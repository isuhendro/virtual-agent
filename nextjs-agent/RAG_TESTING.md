# RAG Pipeline Testing Guide

This guide shows you how to test and verify your RAG implementation with detailed logging.

## Quick Test

### 1. Start the development server:

```bash
npm run dev
```

### 2. Test the RAG pipeline:

Open your browser or use `curl`:

```bash
# Test with default query
curl "http://localhost:3000/api/test-rag"

# Test with custom query
curl "http://localhost:3000/api/test-rag?query=What%20is%20your%20return%20policy&topK=5&useReranking=true"

# Test without reranking (single-stage)
curl "http://localhost:3000/api/test-rag?query=test&useReranking=false"
```

### 3. Check the console output

You'll see detailed logging like this:

```
╔══════════════════════════════════════════════════════════╗
║              RAG PIPELINE TEST                           ║
╚══════════════════════════════════════════════════════════╝
🧪 Test Query: "What is your return policy?"
📚 Collection: knowledge_base
🎯 Top K: 5
🔄 Reranking: ENABLED
──────────────────────────────────────────────────────────

🔄 [EMBEDDINGS] Loading SentenceTransformer model: Xenova/all-MiniLM-L6-v2...
✅ [EMBEDDINGS] SentenceTransformer model loaded successfully in 2458ms
   Model: Xenova/all-MiniLM-L6-v2
   Dimensions: 384
   Provider: Local (Transformers.js)

🔄 [EMBEDDINGS] Generating query embedding...
   Query text length: 26 characters
✅ [EMBEDDINGS] Query embedding generated in 125ms
   Embedding dimension: 384
   First 3 values: [0.0234, -0.0156, 0.0891...]

╔════════════════════════════════════════════╗
║   TWO-STAGE RETRIEVAL WITH RERANKING       ║
╚════════════════════════════════════════════╝
🔍 [QDRANT] Collection: knowledge_base
   Query: "What is your return policy?"
   Target results: 5
   Score threshold: 0
   Reranking: ENABLED

🔄 [STAGE 1] Vector Search
   Retrieving top 20 results...
   Vector dimension: 384
✅ [STAGE 1] Completed in 234ms
   Retrieved: 20 documents
   Score range: 0.8234 - 0.4567

🔄 [STAGE 2] Reranking with CrossEncoder
   Input: 20 documents
   Output: top 5 documents

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 [RERANKER] Starting reranking process...
   Input: 20 documents
   Target: top 5 results
   Query length: 26 chars

🔄 [RERANKER] Cache miss. Computing scores... (0/2000 entries)
🔄 [RERANKER] Loading CrossEncoder model: Xenova/ms-marco-MiniLM-L-6-v2...
✅ [RERANKER] CrossEncoder model loaded successfully in 3124ms
   Model: Xenova/ms-marco-MiniLM-L-6-v2
   Type: Text Classification (Cross-Encoder)
   Cache size: 2000 entries

🔄 [RERANKER] Processing 1 batches (batch size: 32)...
   Batch 1/1: Processing 20 documents...
   ✅ Batch 1 completed in 567ms
💾 [RERANKER] Results cached
✅ [RERANKER] Reranking completed in 3892ms
   Scores - Top: 0.9234, Avg: 0.6123, Min: 0.3456
   Performance: 194.6ms per document
   Returning top 5 results
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ [STAGE 2] Completed in 3892ms

╔════════════════════════════════════════════╗
║         RETRIEVAL COMPLETED ✅              ║
╚════════════════════════════════════════════╝
⏱️  Total time: 4126ms
   ├─ Stage 1 (Vector Search): 234ms
   └─ Stage 2 (Reranking): 3892ms
📊 Results: 5 documents
   Top rerank score: 0.9234
   Avg rerank score: 0.7891
════════════════════════════════════════════

╔══════════════════════════════════════════════════════════╗
║  TEST PASSED ✅                                           ║
╚══════════════════════════════════════════════════════════╝
⏱️  Total time: 4392ms
   ├─ Embedding: 125ms
   └─ Search: 4126ms
══════════════════════════════════════════════════════════
```

## What the Logging Shows

### 🔵 **Embeddings Module**
- Model loading time
- Embedding generation time
- Vector dimensions
- Sample embedding values

### 🟢 **Reranker Module**
- Model loading time
- Cache hits/misses
- Batch processing progress
- Score statistics (top, avg, min)
- Performance metrics

### 🟡 **Qdrant Client**
- Collection information
- Vector search results
- Score ranges
- Two-stage retrieval timing breakdown

### 🟠 **Chat API**
- RAG mode status
- Document formatting
- Context preparation
- Chain initialization

## Testing Real Chat Requests

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is your return policy?",
    "useRAG": true,
    "useReranking": true,
    "collectionName": "knowledge_base",
    "topK": 5,
    "scoreThreshold": 0.7
  }'
```

## Expected Performance (First Request)

| Stage | Time | Description |
|-------|------|-------------|
| Model Loading | 2-5s | First-time model download and initialization |
| Embedding | 50-200ms | Generate query embedding |
| Vector Search | 100-300ms | Search Qdrant |
| Reranking | 200-800ms | CrossEncoder reranking |
| **Total** | **3-6s** | First request (includes model loading) |

## Expected Performance (Subsequent Requests)

| Stage | Time | Description |
|-------|------|-------------|
| Embedding | 50-200ms | Generate query embedding (cached model) |
| Vector Search | 100-300ms | Search Qdrant |
| Reranking | 200-800ms | CrossEncoder reranking (may be cached) |
| **Total** | **350-1300ms** | Cached models |

## Troubleshooting

### No Documents Found
```
⚠️ [CHAT API] No relevant documents found
```
- Check if collection exists in Qdrant
- Lower `scoreThreshold` (try 0.0 for testing)
- Verify collection has documents

### Model Loading Failures
```
❌ [EMBEDDINGS] Failed to load SentenceTransformer
```
- Check internet connection (first download)
- Verify Node.js version (>= 18)
- Check disk space for model cache

### Qdrant Connection Errors
```
❌ [QDRANT] Error in searchWithReranking
```
- Verify `QDRANT_URL` in `.env`
- Verify `QDRANT_API_KEY` in `.env`
- Check Qdrant cluster is running

## Performance Optimization

### Preload Models (Optional)
Reduce first-request latency by preloading models:

```bash
# Preload both models
curl -X POST http://localhost:3000/api/test-rag
```

Add to your app startup (e.g., in a middleware or init script):

```typescript
import { preloadEmbeddingModel } from '@/lib/embeddings';
import { preloadRerankerModel } from '@/lib/embeddings/reranker';

// Preload on startup
preloadEmbeddingModel();
preloadRerankerModel();
```

### Cache Benefits
- **Reranking Cache**: 2000 entries, 5-minute TTL
- **Model Cache**: Models loaded once, reused for all requests
- **Second request with same query**: ~10ms (cached reranking scores)

## Logging Levels

All logs use emojis for easy visual scanning:

- 🔄 **In Progress**: Operation starting
- ✅ **Success**: Operation completed
- ❌ **Error**: Operation failed
- ⚠️ **Warning**: Non-critical issue
- 📊 **Stats**: Performance metrics
- 💾 **Cache**: Cache operations
- 🔍 **Search**: Search operations
