/**
 * Unified Vector Database Interface
 * Automatically selects between PostgreSQL and Qdrant based on configuration
 */

import { config } from '@/lib/config/env';
import * as postgres from './postgres';
import * as qdrant from './qdrant';

export interface VectorSearchResult {
  id: string | number;
  score: number;
  content: string;
  metadata: any;
  url?: string;
  title?: string;
  description?: string;
  rerankScore?: number;
  vectorScore?: number;
}

/**
 * Get the active vector database provider
 */
function getVectorDbProvider() {
  if (config.vectorDbProvider === 'postgres') {
    return postgres;
  } else if (config.vectorDbProvider === 'qdrant') {
    return qdrant;
  } else {
    console.warn(`Unknown vector DB provider: ${config.vectorDbProvider}, defaulting to postgres`);
    return postgres;
  }
}

/**
 * Search for similar documents in the vector database
 */
export async function searchSimilarDocuments(
  collectionName: string,
  queryVector: number[],
  limit: number = 5,
  scoreThreshold: number = 0.7
): Promise<VectorSearchResult[]> {
  const provider = getVectorDbProvider();
  const results = await provider.searchSimilarDocuments(
    collectionName,
    queryVector,
    limit,
    scoreThreshold
  );

  // Normalize the results to ensure consistent interface
  return results.map(r => ({
    id: r.id,
    score: r.score,
    content: r.content,
    metadata: r.metadata,
    url: r.url,
    title: r.title,
    description: r.description,
  }));
}

/**
 * Two-stage retrieval: Vector search + Reranking
 */
export async function searchWithReranking(
  collectionName: string,
  query: string,
  queryVector: number[],
  topK: number = 5,
  useReranker: boolean = true,
  scoreThreshold: number = 0.7
): Promise<VectorSearchResult[]> {
  const provider = getVectorDbProvider();
  return provider.searchWithReranking(
    collectionName,
    query,
    queryVector,
    topK,
    useReranker,
    scoreThreshold
  );
}

/**
 * Check if a collection exists
 */
export async function collectionExists(collectionName: string): Promise<boolean> {
  const provider = getVectorDbProvider();
  return provider.collectionExists(collectionName);
}

/**
 * Get collection info
 */
export async function getCollectionInfo(collectionName: string) {
  const provider = getVectorDbProvider();
  return provider.getCollectionInfo(collectionName);
}

/**
 * Upsert points into the vector database
 * Works with both Qdrant and PostgreSQL
 */
export async function upsertPoints(
  collectionName: string,
  points: Array<{
    id: string;
    vector: number[] | { dense: number[] };
    payload: {
      content: string;
      metadata: any;
    };
  }>
): Promise<void> {
  const provider = getVectorDbProvider();

  if (config.vectorDbProvider === 'postgres') {
    // PostgreSQL expects flat vector array
    const normalizedPoints = points.map(p => ({
      id: p.id,
      vector: Array.isArray(p.vector) ? p.vector : p.vector.dense,
      payload: p.payload,
    }));
    await postgres.upsertPoints(collectionName, normalizedPoints);
  } else {
    // Qdrant expects named vectors
    const client = qdrant.getQdrantClient();
    await client.upsert(collectionName, {
      wait: true,
      points: points.map(p => ({
        id: p.id,
        vector: p.vector,
        payload: p.payload,
      })),
    });
  }
}

/**
 * Delete points by document ID
 */
export async function deleteByDocumentId(
  collectionName: string,
  documentId: string
): Promise<number> {
  const provider = getVectorDbProvider();

  if (config.vectorDbProvider === 'postgres') {
    return postgres.deleteByFilter(collectionName, { documentId });
  } else {
    const client = qdrant.getQdrantClient();
    const scrollResult = await client.scroll(collectionName, {
      filter: {
        must: [
          {
            key: 'metadata.document_id',
            match: { value: documentId },
          },
        ],
      },
      limit: 10000,
      with_payload: false,
      with_vector: false,
    });

    if (scrollResult.points.length === 0) {
      return 0;
    }

    await client.delete(collectionName, {
      filter: {
        must: [
          {
            key: 'metadata.document_id',
            match: { value: documentId },
          },
        ],
      },
    });

    return scrollResult.points.length;
  }
}

/**
 * Scroll through points matching a document ID
 */
export async function scrollByDocumentId(
  collectionName: string,
  documentId: string,
  limit: number = 10000
): Promise<Array<{ id: string }>> {
  const provider = getVectorDbProvider();

  if (config.vectorDbProvider === 'postgres') {
    return postgres.scroll(collectionName, { documentId }, limit);
  } else {
    const client = qdrant.getQdrantClient();
    const result = await client.scroll(collectionName, {
      filter: {
        must: [
          {
            key: 'metadata.document_id',
            match: { value: documentId },
          },
        ],
      },
      limit,
      with_payload: false,
      with_vector: false,
    });

    return result.points.map(p => ({ id: String(p.id) }));
  }
}

/**
 * Get the current vector database provider name
 */
export function getProviderName(): string {
  return config.vectorDbProvider;
}
