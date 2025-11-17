import { NextRequest, NextResponse } from 'next/server';
import { generateQueryEmbedding } from '@/lib/embeddings';
import { searchWithReranking, collectionExists, getCollectionInfo } from '@/lib/vector-db';
import { preloadEmbeddingModel } from '@/lib/embeddings';
import { preloadRerankerModel } from '@/lib/embeddings/reranker';
import { config } from '@/lib/config/env';

/**
 * GET /api/test-rag
 * Test endpoint to verify RAG pipeline is working
 *
 * Query parameters:
 * - query: string (test query)
 * - collection: string (collection name, default: knowledge_base)
 * - topK: number (default: 5)
 * - useReranking: boolean (default: true)
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query') || 'What is your return policy?';
    const collectionName = searchParams.get('collection') || 'knowledge_base';
    const topK = parseInt(searchParams.get('topK') || '5');
    const useReranking = searchParams.get('useReranking') !== 'false';

    console.log('\n╔══════════════════════════════════════════════════════════╗');
    console.log('║              RAG PIPELINE TEST                           ║');
    console.log('╚══════════════════════════════════════════════════════════╝');
    console.log(`🧪 Test Query: "${query}"`);
    console.log(`📚 Collection: ${collectionName}`);
    console.log(`🎯 Top K: ${topK}`);
    console.log(`🔄 Reranking: ${useReranking ? 'ENABLED' : 'DISABLED'}`);
    console.log('──────────────────────────────────────────────────────────\n');

    const results: any = {
      success: false,
      query,
      collectionName,
      topK,
      useReranking,
      steps: [],
      timings: {},
      errors: [],
    };

    // Step 1: Check vector database collection
    try {
      console.log(`🔄 [TEST] Step 1: Checking ${config.vectorDbProvider} collection...`);
      const exists = await collectionExists(collectionName);

      if (exists) {
        results.steps.push(`✅ ${config.vectorDbProvider} connection successful`);
        const collectionInfo = await getCollectionInfo(collectionName);
        results.collectionExists = true;
        results.collectionInfo = collectionInfo;
        console.log(`✅ [TEST] Collection "${collectionName}" found`);
        console.log(`   Points: ${collectionInfo.pointsCount || 'N/A'}`);
      } else {
        results.warnings = [`Collection "${collectionName}" not found in ${config.vectorDbProvider}`];
        console.warn(`⚠️ [TEST] Collection "${collectionName}" not found`);
      }
    } catch (error: any) {
      const msg = `${config.vectorDbProvider} connection failed: ${error.message}`;
      results.errors.push(msg);
      console.error(`❌ [TEST] ${msg}`);
      results.steps.push(`❌ ${msg}`);
    }

    // Step 2: Generate embedding
    try {
      console.log('\n🔄 [TEST] Step 2: Generating query embedding...');
      const embeddingStart = Date.now();

      const embedding = await generateQueryEmbedding(query);

      results.timings.embedding = Date.now() - embeddingStart;
      results.steps.push('✅ Query embedding generated');
      results.embeddingDimension = embedding.length;

      console.log(`✅ [TEST] Embedding generated (${results.timings.embedding}ms)`);
      console.log(`   Dimension: ${embedding.length}`);
      console.log(`   Sample values: [${embedding.slice(0, 3).map((v: number) => v.toFixed(4)).join(', ')}...]`);
    } catch (error: any) {
      const msg = `Embedding generation failed: ${error.message}`;
      results.errors.push(msg);
      console.error(`❌ [TEST] ${msg}`);
      results.steps.push(`❌ ${msg}`);
    }

    // Step 3: Search with reranking
    if (results.errors.length === 0) {
      try {
        console.log('\n🔄 [TEST] Step 3: Searching with reranking...');
        const searchStart = Date.now();

        const embedding = await generateQueryEmbedding(query);
        const documents = await searchWithReranking(
          collectionName,
          query,
          embedding,
          topK,
          useReranking,
          0.0 // Lower threshold for testing
        );

        results.timings.search = Date.now() - searchStart;
        results.steps.push('✅ Search with reranking completed');
        results.documentsFound = documents.length;
        results.documents = documents.map((doc: any) => ({
          score: doc.rerankScore || doc.score,
          vectorScore: doc.vectorScore,
          rerankScore: doc.rerankScore,
          contentLength: doc.content?.length || 0,
          title: doc.title,
          hasContent: !!doc.content,
        }));

        console.log(`✅ [TEST] Search completed (${results.timings.search}ms)`);
        console.log(`   Documents found: ${documents.length}`);
        if (documents.length > 0) {
          console.log(`   Top score: ${results.documents[0].score?.toFixed(4) || 'N/A'}`);
        }

        results.success = true;
      } catch (error: any) {
        const msg = `Search failed: ${error.message}`;
        results.errors.push(msg);
        console.error(`❌ [TEST] ${msg}`);
        results.steps.push(`❌ ${msg}`);
      }
    }

    const totalTime = Date.now() - startTime;
    results.timings.total = totalTime;

    console.log('\n╔══════════════════════════════════════════════════════════╗');
    console.log(`║  TEST ${results.success ? 'PASSED ✅' : 'FAILED ❌'}${results.success ? '                                   ' : '                                  '}║`);
    console.log('╚══════════════════════════════════════════════════════════╝');
    console.log(`⏱️  Total time: ${totalTime}ms`);
    if (results.timings.embedding) {
      console.log(`   ├─ Embedding: ${results.timings.embedding}ms`);
    }
    if (results.timings.search) {
      console.log(`   └─ Search: ${results.timings.search}ms`);
    }
    if (results.errors.length > 0) {
      console.log(`\n❌ Errors: ${results.errors.length}`);
      results.errors.forEach((err: string) => console.log(`   - ${err}`));
    }
    console.log('══════════════════════════════════════════════════════════\n');

    return NextResponse.json(results, {
      status: results.success ? 200 : 500,
    });
  } catch (error: any) {
    const totalTime = Date.now() - startTime;
    console.error(`❌ [TEST] Unexpected error after ${totalTime}ms:`, error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: error.stack,
        timings: { total: totalTime },
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/test-rag/preload
 * Preload embedding and reranker models
 */
export async function POST(request: NextRequest) {
  try {
    console.log('\n🔄 [TEST] Preloading models...');

    const embeddingStart = Date.now();
    await preloadEmbeddingModel();
    const embeddingTime = Date.now() - embeddingStart;

    const rerankerStart = Date.now();
    await preloadRerankerModel();
    const rerankerTime = Date.now() - rerankerStart;

    const totalTime = embeddingTime + rerankerTime;

    console.log(`✅ [TEST] Models preloaded in ${totalTime}ms`);
    console.log(`   ├─ Embedding model: ${embeddingTime}ms`);
    console.log(`   └─ Reranker model: ${rerankerTime}ms\n`);

    return NextResponse.json({
      success: true,
      timings: {
        embedding: embeddingTime,
        reranker: rerankerTime,
        total: totalTime,
      },
    });
  } catch (error: any) {
    console.error('❌ [TEST] Model preload failed:', error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
