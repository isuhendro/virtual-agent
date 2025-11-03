/**
 * Reranker Module
 * Two-stage retrieval using CrossEncoder for reranking
 * Based on production implementation from hiyaa-ai-api
 */

import { pipeline, Pipeline } from '@xenova/transformers';

// Lazy loading flags
let _rerankerChecked = false;
let _rerankerAvailable = false;
let _rerankerPipeline: Pipeline | null = null;

// Caching for reranking results
const _cache = new Map<string, { scores: number[]; timestamp: number }>();
const _cacheSize = 2000;
const _cleanupInterval = 300000; // 5 minutes
let _lastCleanup = Date.now();

/**
 * Lazy load the reranker pipeline
 * Uses singleton pattern
 */
async function getRerankerPipeline(): Promise<Pipeline | null> {
  if (_rerankerChecked && _rerankerPipeline) {
    return _rerankerPipeline;
  }

  if (_rerankerChecked && !_rerankerAvailable) {
    return null;
  }

  try {
    const startTime = Date.now();
    console.log('🔄 [RERANKER] Loading CrossEncoder model: Xenova/ms-marco-MiniLM-L-6-v2...');
    // Use a lightweight cross-encoder model for reranking
    _rerankerPipeline = await pipeline('text-classification', 'Xenova/ms-marco-MiniLM-L-6-v2');
    _rerankerAvailable = true;
    _rerankerChecked = true;
    const loadTime = Date.now() - startTime;
    console.log(`✅ [RERANKER] CrossEncoder model loaded successfully in ${loadTime}ms`);
    console.log(`   Model: Xenova/ms-marco-MiniLM-L-6-v2`);
    console.log(`   Type: Text Classification (Cross-Encoder)`);
    console.log(`   Cache size: ${_cacheSize} entries`);
    return _rerankerPipeline;
  } catch (error) {
    console.error('❌ [RERANKER] Failed to load CrossEncoder:', error);
    _rerankerAvailable = false;
    _rerankerChecked = true;
    return null;
  }
}

/**
 * Cleanup old cache entries
 */
function cleanupCache(): void {
  const now = Date.now();
  if (now - _lastCleanup > _cleanupInterval) {
    const entries = Array.from(_cache.entries());
    entries.sort((a, b) => b[1].timestamp - a[1].timestamp);

    // Keep only the most recent entries
    _cache.clear();
    entries.slice(0, _cacheSize).forEach(([key, value]) => {
      _cache.set(key, value);
    });

    _lastCleanup = now;
  }
}

/**
 * Generate cache key
 */
function getCacheKey(query: string, documents: string[]): string {
  const docsHash = documents.join('|').substring(0, 100);
  return `${query}:${docsHash}`;
}

/**
 * Get cached scores
 */
function getCachedScores(query: string, documents: string[]): number[] | null {
  const key = getCacheKey(query, documents);
  const cached = _cache.get(key);

  if (cached) {
    console.log(`✅ [RERANKER] Cache hit! (${_cache.size}/${_cacheSize} entries)`);
    // Update timestamp for LRU
    cached.timestamp = Date.now();
    return cached.scores;
  }

  console.log(`🔄 [RERANKER] Cache miss. Computing scores... (${_cache.size}/${_cacheSize} entries)`);
  return null;
}

/**
 * Cache scores
 */
function cacheScores(query: string, documents: string[], scores: number[]): void {
  const key = getCacheKey(query, documents);
  _cache.set(key, { scores, timestamp: Date.now() });
  cleanupCache();
}

export interface RerankResult {
  document: string;
  score: number;
  originalIndex: number;
}

/**
 * Rerank documents using CrossEncoder
 *
 * @param query - The search query
 * @param documents - List of documents to rerank
 * @param topK - Number of top results to return
 * @returns Reranked documents with scores
 */
export async function rerank(
  query: string,
  documents: string[],
  topK: number = 5
): Promise<RerankResult[]> {
  const startTime = Date.now();

  try {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔄 [RERANKER] Starting reranking process...');
    console.log(`   Input: ${documents.length} documents`);
    console.log(`   Target: top ${topK} results`);
    console.log(`   Query length: ${query.length} chars`);

    // Handle empty documents
    if (!documents || documents.length === 0) {
      console.log('⚠️ [RERANKER] No documents to rerank');
      return [];
    }

    // Check cache first
    const cachedScores = getCachedScores(query, documents);
    if (cachedScores) {
      const results = createRerankResults(documents, cachedScores, topK);
      const duration = Date.now() - startTime;
      console.log(`✅ [RERANKER] Completed (cached) in ${duration}ms`);
      console.log(`   Top score: ${results[0]?.score.toFixed(4) || 'N/A'}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      return results;
    }

    // Get reranker pipeline
    const reranker = await getRerankerPipeline();

    if (!reranker) {
      console.warn('⚠️ [RERANKER] Model not available, returning original order');
      const results = documents.slice(0, topK).map((doc, idx) => ({
        document: doc,
        score: 0.5,
        originalIndex: idx,
      }));
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      return results;
    }

    // Process documents in batches
    const batchSize = 32;
    const scores: number[] = [];
    const numBatches = Math.ceil(documents.length / batchSize);

    console.log(`🔄 [RERANKER] Processing ${numBatches} batches (batch size: ${batchSize})...`);

    for (let i = 0; i < documents.length; i += batchSize) {
      const batchNum = Math.floor(i / batchSize) + 1;
      const batchStart = Date.now();

      const batch = documents.slice(i, i + batchSize);
      console.log(`   Batch ${batchNum}/${numBatches}: Processing ${batch.length} documents...`);

      // Create query-document pairs
      const pairs = batch.map((doc) => `${query} [SEP] ${doc}`);

      // Get scores from the model
      const batchResults = await Promise.all(
        pairs.map(async (pair) => {
          try {
            const result = await reranker(pair);
            // Extract relevance score (usually the "LABEL_1" score for positive class)
            return Array.isArray(result) ? result[0]?.score ?? 0 : 0;
          } catch (error) {
            console.error('❌ [RERANKER] Error scoring pair:', error);
            return 0;
          }
        })
      );

      scores.push(...batchResults);

      const batchDuration = Date.now() - batchStart;
      console.log(`   ✅ Batch ${batchNum} completed in ${batchDuration}ms`);
    }

    // Cache the results
    cacheScores(query, documents, scores);
    console.log(`💾 [RERANKER] Results cached`);

    const duration = Date.now() - startTime;
    const topScore = Math.max(...scores);
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;

    console.log(`✅ [RERANKER] Reranking completed in ${duration}ms`);
    console.log(`   Scores - Top: ${topScore.toFixed(4)}, Avg: ${avgScore.toFixed(4)}, Min: ${Math.min(...scores).toFixed(4)}`);
    console.log(`   Performance: ${(duration / documents.length).toFixed(1)}ms per document`);

    const results = createRerankResults(documents, scores, topK);
    console.log(`   Returning top ${results.length} results`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    return results;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ [RERANKER] Error in reranking after ${duration}ms:`, error);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    return [];
  }
}

/**
 * Helper function to create rerank results
 */
function createRerankResults(
  documents: string[],
  scores: number[],
  topK: number
): RerankResult[] {
  // Combine documents with scores and original indices
  const combined = documents.map((doc, idx) => ({
    document: doc,
    score: scores[idx] || 0,
    originalIndex: idx,
  }));

  // Sort by score (descending)
  combined.sort((a, b) => b.score - a.score);

  // Return top K
  return combined.slice(0, topK);
}

/**
 * Preload the reranker model
 * Call this during application startup to avoid first-request latency
 */
export async function preloadRerankerModel(): Promise<void> {
  console.log('Preloading reranker model...');
  await getRerankerPipeline();
}
