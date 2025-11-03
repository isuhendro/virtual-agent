/**
 * Embeddings Configuration
 * Local embeddings using Transformers.js (Xenova)
 * Based on production implementation from hiyaa-ai-api
 */

import { pipeline, Pipeline } from '@xenova/transformers';
import { Embeddings } from '@langchain/core/embeddings';

// Lazy loading flags
let _transformersChecked = false;
let _transformersAvailable = false;
let _embeddingPipeline: Pipeline | null = null;

/**
 * Lazy load the embedding pipeline
 * Uses singleton pattern to ensure only one model instance
 */
async function getEmbeddingPipeline(): Promise<Pipeline | null> {
  if (_transformersChecked && _embeddingPipeline) {
    return _embeddingPipeline;
  }

  if (_transformersChecked && !_transformersAvailable) {
    return null;
  }

  try {
    const startTime = Date.now();
    console.log('🔄 [EMBEDDINGS] Loading SentenceTransformer model: Xenova/all-MiniLM-L6-v2...');
    // Use the same model as hiyaa-ai-api: all-MiniLM-L6-v2 (384 dimensions)
    _embeddingPipeline = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    _transformersAvailable = true;
    _transformersChecked = true;
    const loadTime = Date.now() - startTime;
    console.log(`✅ [EMBEDDINGS] SentenceTransformer model loaded successfully in ${loadTime}ms`);
    console.log(`   Model: Xenova/all-MiniLM-L6-v2`);
    console.log(`   Dimensions: 384`);
    console.log(`   Provider: Local (Transformers.js)`);
    return _embeddingPipeline;
  } catch (error) {
    console.error('❌ [EMBEDDINGS] Failed to load SentenceTransformer:', error);
    _transformersAvailable = false;
    _transformersChecked = true;
    return null;
  }
}

/**
 * Mean pooling helper function
 * Converts token embeddings to sentence embedding
 */
function meanPooling(tokenEmbeddings: any, attentionMask: any): number[] {
  const data = tokenEmbeddings.data;
  const dims = tokenEmbeddings.dims;
  const [batchSize, seqLength, hiddenSize] = dims;

  // Initialize sum array
  const sum = new Array(hiddenSize).fill(0);
  let validTokens = 0;

  // Sum embeddings weighted by attention mask
  for (let i = 0; i < seqLength; i++) {
    if (attentionMask.data[i] === 1) {
      for (let j = 0; j < hiddenSize; j++) {
        sum[j] += data[i * hiddenSize + j];
      }
      validTokens++;
    }
  }

  // Average
  return sum.map((val) => val / validTokens);
}

/**
 * Normalize vector (L2 normalization)
 */
function normalize(vector: number[]): number[] {
  const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  return vector.map((val) => val / norm);
}

/**
 * TransformerEmbeddings class using Xenova
 * Compatible with LangChain's Embeddings interface
 */
class TransformerEmbeddings extends Embeddings {
  private pipeline: Pipeline | null = null;

  constructor() {
    super({});
  }

  private async ensurePipeline(): Promise<void> {
    if (!this.pipeline) {
      this.pipeline = await getEmbeddingPipeline();
    }
  }

  async embedDocuments(texts: string[]): Promise<number[][]> {
    await this.ensurePipeline();

    if (!this.pipeline) {
      console.warn('⚠️ [EMBEDDINGS] Pipeline not available, using zero vectors');
      return texts.map(() => new Array(384).fill(0));
    }

    try {
      const startTime = Date.now();
      console.log(`🔄 [EMBEDDINGS] Generating embeddings for ${texts.length} documents...`);

      const embeddings = await Promise.all(
        texts.map(async (text) => {
          const output = await this.pipeline!(text, { pooling: 'mean', normalize: true });
          return Array.from(output.data);
        })
      );

      const duration = Date.now() - startTime;
      console.log(`✅ [EMBEDDINGS] Generated ${embeddings.length} embeddings in ${duration}ms (${(duration / texts.length).toFixed(1)}ms/doc)`);

      return embeddings;
    } catch (error) {
      console.error('❌ [EMBEDDINGS] Error generating document embeddings:', error);
      return texts.map(() => new Array(384).fill(0));
    }
  }

  async embedQuery(text: string): Promise<number[]> {
    await this.ensurePipeline();

    if (!this.pipeline) {
      console.warn('⚠️ [EMBEDDINGS] Pipeline not available, using zero vector');
      return new Array(384).fill(0);
    }

    try {
      const startTime = Date.now();
      console.log(`🔄 [EMBEDDINGS] Generating query embedding...`);
      console.log(`   Query text length: ${text.length} characters`);

      const output = await this.pipeline(text, { pooling: 'mean', normalize: true });
      const embedding = Array.from(output.data);

      const duration = Date.now() - startTime;
      console.log(`✅ [EMBEDDINGS] Query embedding generated in ${duration}ms`);
      console.log(`   Embedding dimension: ${embedding.length}`);
      console.log(`   First 3 values: [${embedding.slice(0, 3).map(v => v.toFixed(4)).join(', ')}...]`);

      return embedding;
    } catch (error) {
      console.error('❌ [EMBEDDINGS] Error generating query embedding:', error);
      return new Array(384).fill(0);
    }
  }
}

// Singleton instance
let embeddingsInstance: TransformerEmbeddings | null = null;

/**
 * Initialize embeddings model (singleton)
 * Uses local SentenceTransformer via Transformers.js
 */
export function initializeEmbeddings(): Embeddings {
  if (!embeddingsInstance) {
    console.log('🔄 [EMBEDDINGS] Initializing embeddings singleton...');
    embeddingsInstance = new TransformerEmbeddings();
    console.log('✅ [EMBEDDINGS] Embeddings singleton created');
    console.log('   Model: Xenova/all-MiniLM-L6-v2');
    console.log('   Type: Local (100% free, no API calls)');
    console.log('   Dimensions: 384');
  }
  return embeddingsInstance;
}

/**
 * Generate embedding for a single text query
 */
export async function generateQueryEmbedding(text: string): Promise<number[]> {
  const embeddings = initializeEmbeddings();
  return await embeddings.embedQuery(text);
}

/**
 * Generate embeddings for multiple documents
 */
export async function generateDocumentEmbeddings(texts: string[]): Promise<number[][]> {
  const embeddings = initializeEmbeddings();
  return await embeddings.embedDocuments(texts);
}

/**
 * Preload the embedding model
 * Call this during application startup to avoid first-request latency
 */
export async function preloadEmbeddingModel(): Promise<void> {
  console.log('Preloading embedding model...');
  await getEmbeddingPipeline();
}

// Automatically preload on module import (async, won't block)
if (typeof window === 'undefined') {
  // Only on server-side
  console.log('🚀 [EMBEDDINGS] Auto-preloading embedding model on server startup...');
  preloadEmbeddingModel().catch((err) => {
    console.error('❌ [EMBEDDINGS] Failed to preload model:', err);
  });
}
