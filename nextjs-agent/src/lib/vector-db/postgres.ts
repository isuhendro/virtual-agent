/**
 * PostgreSQL Vector Database Client with pgvector
 * Handles connections and queries to PostgreSQL vector store
 * Supports two-stage retrieval with reranking
 */

import { Pool, PoolClient } from 'pg';
import { config } from '@/lib/config/env';
import { rerank } from '@/lib/embeddings/reranker';

// Initialize PostgreSQL connection pool
let pool: Pool | null = null;

/**
 * Get or create PostgreSQL pool instance (singleton pattern)
 */
export function getPostgresPool(): Pool {
  if (!pool) {
    if (!config.databaseUrl) {
      throw new Error('DATABASE_URL is not configured');
    }

    pool = new Pool({
      connectionString: config.databaseUrl,
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    pool.on('error', (err) => {
      console.error('Unexpected error on idle PostgreSQL client', err);
    });
  }

  return pool;
}

/**
 * Close the PostgreSQL pool
 */
export async function closePostgresPool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

export interface SearchResult {
  id: string;
  score: number;
  content: string;
  metadata: any;
  url?: string;
  title?: string;
  description?: string;
}

/**
 * Search for similar vectors in a PostgreSQL collection
 */
export async function searchSimilarDocuments(
  collectionName: string,
  queryVector: number[],
  limit: number = 5,
  scoreThreshold: number = 0.7
): Promise<SearchResult[]> {
  const pgPool = getPostgresPool();

  try {
    // PostgreSQL pgvector uses cosine distance
    // We convert to similarity score: similarity = 1 - distance
    // Only return results where similarity >= scoreThreshold
    const query = `
      SELECT
        id::text,
        content,
        metadata,
        1 - (embedding <=> $1::vector) as score
      FROM ${collectionName}
      WHERE 1 - (embedding <=> $1::vector) >= $2
      ORDER BY embedding <=> $1::vector
      LIMIT $3
    `;

    const result = await pgPool.query(query, [
      `[${queryVector.join(',')}]`,
      scoreThreshold,
      limit,
    ]);

    return result.rows.map((row) => ({
      id: row.id,
      score: row.score || 0,
      content: row.content || '',
      metadata: row.metadata || {},
      url: row.metadata?.url || '',
      title: row.metadata?.meta_title || row.metadata?.title || '',
      description: row.metadata?.meta_description || '',
    }));
  } catch (error) {
    console.error('Error searching PostgreSQL:', error);
    throw error;
  }
}

/**
 * Check if a collection (table) exists
 */
export async function collectionExists(collectionName: string): Promise<boolean> {
  const pgPool = getPostgresPool();

  try {
    const query = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = $1
      );
    `;

    const result = await pgPool.query(query, [collectionName]);
    return result.rows[0].exists;
  } catch (error) {
    console.error(`Error checking if collection ${collectionName} exists:`, error);
    return false;
  }
}

/**
 * Get collection info
 */
export async function getCollectionInfo(collectionName: string) {
  const pgPool = getPostgresPool();

  try {
    const countQuery = `SELECT COUNT(*) as count FROM ${collectionName}`;
    const result = await pgPool.query(countQuery);

    return {
      name: collectionName,
      pointsCount: parseInt(result.rows[0].count),
    };
  } catch (error) {
    console.error(`Could not get collection ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Two-stage retrieval: Vector search + Reranking
 * Based on hiyaa-ai-api implementation
 *
 * @param collectionName - PostgreSQL table name
 * @param query - User query text
 * @param queryVector - Query embedding vector
 * @param topK - Number of final results to return
 * @param useReranker - Whether to use reranking (default: true)
 * @param scoreThreshold - Minimum similarity score
 * @returns Reranked documents with scores and metadata
 */
export async function searchWithReranking(
  collectionName: string,
  query: string,
  queryVector: number[],
  topK: number = 5,
  useReranker: boolean = true,
  scoreThreshold: number = 0.7
) {
  const startTime = Date.now();

  try {
    console.log('╔════════════════════════════════════════════╗');
    console.log('║   TWO-STAGE RETRIEVAL WITH RERANKING       ║');
    console.log('╚════════════════════════════════════════════╝');
    console.log(`🔍 [POSTGRES] Collection: ${collectionName}`);
    console.log(`   Query: "${query.substring(0, 50)}${query.length > 50 ? '...' : ''}"`);
    console.log(`   Target results: ${topK}`);
    console.log(`   Score threshold: ${scoreThreshold}`);
    console.log(`   Reranking: ${useReranker ? 'ENABLED' : 'DISABLED'}`);

    // Stage 1: Get more results initially if using reranker
    const initialLimit = useReranker ? topK * 4 : topK;

    console.log('\n🔄 [STAGE 1] Vector Search');
    console.log(`   Retrieving top ${initialLimit} results...`);
    console.log(`   Vector dimension: ${queryVector.length}`);

    const searchResult = await searchSimilarDocuments(
      collectionName,
      queryVector,
      initialLimit,
      scoreThreshold
    );

    const stage1Time = Date.now() - startTime;
    console.log(`✅ [STAGE 1] Completed in ${stage1Time}ms`);
    console.log(`   Retrieved: ${searchResult.length} documents`);
    if (searchResult.length > 0) {
      const scores = searchResult.map((r) => r.score || 0);
      console.log(`   Score range: ${Math.max(...scores).toFixed(4)} - ${Math.min(...scores).toFixed(4)}`);
    }

    // Extract documents
    const documents = searchResult;

    // Stage 2: Rerank if enabled
    if (useReranker && documents.length > 0) {
      console.log(`\n🔄 [STAGE 2] Reranking with CrossEncoder`);
      console.log(`   Input: ${documents.length} documents`);
      console.log(`   Output: top ${topK} documents`);
      const stage2Start = Date.now();

      const documentTexts = documents.map((doc) => doc.content);
      const rerankedResults = await rerank(query, documentTexts, topK);

      const stage2Time = Date.now() - stage2Start;
      console.log(`\n✅ [STAGE 2] Completed in ${stage2Time}ms`);

      // Map reranked results back to original documents
      const finalResults = rerankedResults.map((result) => {
        const originalDoc = documents[result.originalIndex];
        return {
          ...originalDoc,
          rerankScore: result.score,
          vectorScore: originalDoc.score,
        };
      });

      const totalTime = Date.now() - startTime;

      console.log('\n╔════════════════════════════════════════════╗');
      console.log('║         RETRIEVAL COMPLETED ✅              ║');
      console.log('╚════════════════════════════════════════════╝');
      console.log(`⏱️  Total time: ${totalTime}ms`);
      console.log(`   ├─ Stage 1 (Vector Search): ${stage1Time}ms`);
      console.log(`   └─ Stage 2 (Reranking): ${stage2Time}ms`);
      console.log(`📊 Results: ${finalResults.length} documents`);
      if (finalResults.length > 0) {
        console.log(`   Top rerank score: ${finalResults[0].rerankScore.toFixed(4)}`);
        console.log(`   Avg rerank score: ${(finalResults.reduce((sum, r) => sum + r.rerankScore, 0) / finalResults.length).toFixed(4)}`);
      }
      console.log('════════════════════════════════════════════\n');

      return finalResults;
    }

    // Return vector search results only
    const totalTime = Date.now() - startTime;
    console.log('\n╔════════════════════════════════════════════╗');
    console.log('║    SINGLE-STAGE RETRIEVAL COMPLETED ✅     ║');
    console.log('╚════════════════════════════════════════════╝');
    console.log(`⏱️  Total time: ${totalTime}ms`);
    console.log(`📊 Results: ${documents.slice(0, topK).length} documents`);
    console.log('════════════════════════════════════════════\n');
    return documents.slice(0, topK);
  } catch (error) {
    const totalTime = Date.now() - startTime;
    console.error(`❌ [POSTGRES] Error in searchWithReranking after ${totalTime}ms:`, error);
    console.log('════════════════════════════════════════════\n');
    throw error;
  }
}

/**
 * Upsert points into PostgreSQL table
 */
export async function upsertPoints(
  collectionName: string,
  points: Array<{
    id: string;
    vector: number[];
    payload: {
      content: string;
      metadata: any;
    };
  }>
): Promise<void> {
  const pgPool = getPostgresPool();
  const client = await pgPool.connect();

  try {
    await client.query('BEGIN');

    for (const point of points) {
      const query = `
        INSERT INTO ${collectionName} (id, content, metadata, embedding)
        VALUES ($1, $2, $3, $4::vector)
        ON CONFLICT (id) DO UPDATE SET
          content = EXCLUDED.content,
          metadata = EXCLUDED.metadata,
          embedding = EXCLUDED.embedding
      `;

      await client.query(query, [
        point.id,
        point.payload.content,
        point.payload.metadata,
        `[${point.vector.join(',')}]`,
      ]);
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error upserting points:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Delete points by filter
 */
export async function deleteByFilter(
  collectionName: string,
  filter: { documentId: string }
): Promise<number> {
  const pgPool = getPostgresPool();

  try {
    const query = `
      DELETE FROM ${collectionName}
      WHERE metadata->>'document_id' = $1
    `;

    const result = await pgPool.query(query, [filter.documentId]);
    return result.rowCount || 0;
  } catch (error) {
    console.error('Error deleting points:', error);
    throw error;
  }
}

/**
 * Scroll through points matching a filter
 */
export async function scroll(
  collectionName: string,
  filter: { documentId: string },
  limit: number = 10000
): Promise<Array<{ id: string }>> {
  const pgPool = getPostgresPool();

  try {
    const query = `
      SELECT id::text
      FROM ${collectionName}
      WHERE metadata->>'document_id' = $1
      LIMIT $2
    `;

    const result = await pgPool.query(query, [filter.documentId, limit]);
    return result.rows.map((row) => ({ id: row.id }));
  } catch (error) {
    console.error('Error scrolling points:', error);
    throw error;
  }
}
