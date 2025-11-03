/**
 * Qdrant Vector Database Client
 * Handles connections and queries to Qdrant vector store
 * Supports two-stage retrieval with reranking
 */

import { QdrantClient } from '@qdrant/js-client-rest';
import { config } from '@/lib/config/env';
import { rerank, RerankResult } from '@/lib/embeddings/reranker';

// Initialize Qdrant client
let qdrantClient: QdrantClient | null = null;

/**
 * Get or create Qdrant client instance (singleton pattern)
 */
export function getQdrantClient(): QdrantClient {
  if (!qdrantClient) {
    if (!config.qdrantUrl) {
      throw new Error('QDRANT_URL is not configured');
    }

    qdrantClient = new QdrantClient({
      url: config.qdrantUrl,
      apiKey: config.qdrantApiKey || undefined,
    });
  }

  return qdrantClient;
}

/**
 * Search for similar vectors in a Qdrant collection
 */
export async function searchSimilarDocuments(
  collectionName: string,
  queryVector: number[],
  limit: number = 5,
  scoreThreshold: number = 0.7
) {
  const client = getQdrantClient();

  try {
    const searchResult = await client.search(collectionName, {
      vector: {
        name: 'dense',  // Specify which named vector to use
        vector: queryVector,
      },
      limit,
      score_threshold: scoreThreshold,
      with_payload: true,
      with_vector: false,
    });

    return searchResult.map((result) => ({
      id: result.id,
      score: result.score || 0,
      content: result.payload?.content || result.payload?.text || '',
      metadata: result.payload?.metadata || {},
    }));
  } catch (error) {
    console.error('Error searching Qdrant:', error);
    throw error;
  }
}

/**
 * Get all collections from Qdrant
 */
export async function getCollections() {
  const client = getQdrantClient();

  try {
    const result = await client.getCollections();
    return result.collections;
  } catch (error) {
    console.error('Could not get collections:', error);
    throw error;
  }
}

/**
 * Check if a collection exists
 */
export async function collectionExists(collectionName: string): Promise<boolean> {
  try {
    const client = getQdrantClient();
    await client.getCollection(collectionName);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Get collection info
 */
export async function getCollectionInfo(collectionName: string) {
  const client = getQdrantClient();

  try {
    const collection = await client.getCollection(collectionName);
    return collection;
  } catch (error) {
    console.error(`Could not get collection ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Two-stage retrieval: Vector search + Reranking
 * Based on hiyaa-ai-api implementation
 *
 * @param collectionName - Qdrant collection name
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
  const client = getQdrantClient();
  const startTime = Date.now(); // Declare outside try block so it's accessible in catch

  try {

    console.log('╔════════════════════════════════════════════╗');
    console.log('║   TWO-STAGE RETRIEVAL WITH RERANKING       ║');
    console.log('╚════════════════════════════════════════════╝');
    console.log(`🔍 [QDRANT] Collection: ${collectionName}`);
    console.log(`   Query: "${query.substring(0, 50)}${query.length > 50 ? '...' : ''}"`);
    console.log(`   Target results: ${topK}`);
    console.log(`   Score threshold: ${scoreThreshold}`);
    console.log(`   Reranking: ${useReranker ? 'ENABLED' : 'DISABLED'}`);

    // Stage 1: Get more results initially if using reranker
    const initialLimit = useReranker ? topK * 4 : topK;

    console.log('\n🔄 [STAGE 1] Vector Search');
    console.log(`   Retrieving top ${initialLimit} results...`);
    console.log(`   Vector dimension: ${queryVector.length}`);

    const searchResult = await client.search(collectionName, {
      vector: {
        name: 'dense',  // Specify which named vector to use
        vector: queryVector,
      },
      limit: initialLimit,
      score_threshold: scoreThreshold,
      with_payload: true,
      with_vector: false,
    });

    const stage1Time = Date.now() - startTime;
    console.log(`✅ [STAGE 1] Completed in ${stage1Time}ms`);
    console.log(`   Retrieved: ${searchResult.length} documents`);
    if (searchResult.length > 0) {
      const scores = searchResult.map(r => r.score || 0);
      console.log(`   Score range: ${Math.max(...scores).toFixed(4)} - ${Math.min(...scores).toFixed(4)}`);
    }

    // Extract documents
    const documents = searchResult.map((result) => ({
      id: result.id,
      score: result.score || 0,
      content: result.payload?.content || result.payload?.text || '',
      metadata: result.payload?.metadata || {},
      url: result.payload?.url || '',
      title: result.payload?.meta_title || result.payload?.title || '',
      description: result.payload?.meta_description || '',
    }));

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
    console.error(`❌ [QDRANT] Error in searchWithReranking after ${totalTime}ms:`, error);
    console.log('════════════════════════════════════════════\n');
    throw error;
  }
}
