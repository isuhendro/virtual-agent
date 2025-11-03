import { NextRequest } from 'next/server';
import { createChatChain, createRAGChain } from '@/lib/langchain/chains';
import { HumanMessage, AIMessage, BaseMessage } from '@langchain/core/messages';
import { searchSimilarDocuments, searchWithReranking } from '@/lib/vector-db/qdrant';
import { generateQueryEmbedding } from '@/lib/embeddings';
import { config } from '@/lib/config/env';

/**
 * POST /api/chat
 * Main chat endpoint with SSE streaming
 *
 * Request body:
 * - message: string (user message)
 * - threadId?: string (conversation thread)
 * - chatHistory?: Array<{role: 'user' | 'agent', content: string}> (previous messages)
 * - clientToken?: string (JWT authentication token)
 * - useRAG?: boolean (enable RAG retrieval from Qdrant)
 * - collectionName?: string (Qdrant collection name for RAG)
 * - topK?: number (number of documents to retrieve, default: 5)
 * - scoreThreshold?: number (minimum similarity score, default: 0.7)
 * - useReranking?: boolean (enable two-stage retrieval with reranking, default: true)
 */
export async function POST(request: NextRequest) {
  try {
    const {
      message,
      chatHistory = [],
      useRAG = config.ragEnabled,              // Default from environment
      collectionName = config.qdrantCollectionName,
      topK = config.ragTopK,
      scoreThreshold = config.ragScoreThreshold,
      useReranking = config.ragUseReranking
    } = await request.json();

    if (!message || typeof message !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // TODO: Validate client token

    // Convert chat history to LangChain message format
    const formattedHistory: BaseMessage[] = chatHistory.map((msg: { role: string; content: string }) => {
      return msg.role === 'user'
        ? new HumanMessage(msg.content)
        : new AIMessage(msg.content);
    });

    // Initialize chat chain
    let chain;
    let retrievedContext = '';
    let ragSucceeded = false;

    try {
      // If RAG is enabled, retrieve relevant documents from Qdrant
      if (useRAG) {
        console.log('\n═══════════════════════════════════════════════════════════════');
        console.log('🚀 RAG MODE ENABLED');
        console.log('═══════════════════════════════════════════════════════════════');
        console.log(`📚 Collection: ${collectionName}`);
        console.log(`🎯 Top K: ${topK}`);
        console.log(`📊 Score Threshold: ${scoreThreshold}`);
        console.log(`🔄 Reranking: ${useReranking ? 'ENABLED' : 'DISABLED'}`);
        console.log(`💬 User Message: "${message.substring(0, 100)}${message.length > 100 ? '...' : ''}"`);
        console.log('───────────────────────────────────────────────────────────────\n');

        try {
          // Generate embedding for the user's query
          const queryEmbedding = await generateQueryEmbedding(message);

          let documents;

          // Use two-stage retrieval with reranking if enabled
          if (useReranking) {
            documents = await searchWithReranking(
              collectionName,
              message,
              queryEmbedding,
              topK,
              true, // useReranker
              scoreThreshold
            );
          } else {
            console.log('🔄 [CHAT API] Using single-stage retrieval (vector search only)');
            documents = await searchSimilarDocuments(
              collectionName,
              queryEmbedding,
              topK,
              scoreThreshold
            );
          }

          console.log(`\n✅ [CHAT API] Retrieved ${documents.length} documents from Qdrant`);

          // Format retrieved documents as context
          if (documents.length > 0) {
            console.log('📝 [CHAT API] Formatting context for LLM...');

            retrievedContext = documents
              .map((doc: any, index: number) => {
                const scoreInfo = doc.rerankScore
                  ? `Rerank Score: ${doc.rerankScore.toFixed(3)}, Vector Score: ${doc.vectorScore.toFixed(3)}`
                  : `Score: ${doc.score.toFixed(3)}`;

                // Log each document
                console.log(`   Document ${index + 1}:`);
                console.log(`     ${scoreInfo}`);
                console.log(`     Length: ${doc.content.length} chars`);
                if (doc.title) console.log(`     Title: ${doc.title}`);

                return `[Document ${index + 1}] (${scoreInfo})\n${doc.content}`;
              })
              .join('\n\n');

            console.log(`\n✅ [CHAT API] Context prepared: ${retrievedContext.length} total characters`);
          } else {
            console.log('⚠️ [CHAT API] No relevant documents found');
            retrievedContext = 'No relevant documents found in the knowledge base.';
          }

          // Use RAG chain
          console.log('🔄 [CHAT API] Initializing RAG chain...');
          chain = createRAGChain();
          ragSucceeded = true;
          console.log('✅ [CHAT API] RAG chain initialized');
          console.log('═══════════════════════════════════════════════════════════════\n');
        } catch (ragError: any) {
          console.error('❌ [CHAT API] RAG retrieval error:', ragError);
          console.log('⚠️ [CHAT API] Falling back to regular chat mode');
          console.log('═══════════════════════════════════════════════════════════════\n');
          chain = createChatChain();
          ragSucceeded = false;
        }
      } else {
        // Use regular chat chain
        console.log('💬 [CHAT API] Regular chat mode (RAG disabled)');
        chain = createChatChain();
        ragSucceeded = false;
      }
    } catch (initError: any) {
      console.error('Failed to initialize chat chain:', initError);
      return new Response(
        JSON.stringify({
          error: 'Configuration error: ' + (initError.message || 'Failed to initialize LLM'),
          details: 'Please ensure ANTHROPIC_API_KEY is set in your .env file'
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create readable stream for SSE
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Prepare input based on whether RAG succeeded
          const chainInput = ragSucceeded ? {
            question: message,
            chatHistory: formattedHistory,
            context: retrievedContext,
          } : {
            input: message,
            chatHistory: formattedHistory,
          };

          // Stream the response
          const streamResponse = await chain.stream(chainInput);

          for await (const chunk of streamResponse) {
            // Handle different chunk types from LangChain
            let content = '';

            if (typeof chunk === 'string') {
              content = chunk;
            } else if (chunk.content) {
              // AIMessage or similar
              content = typeof chunk.content === 'string' ? chunk.content : '';
            } else if (typeof chunk === 'object' && chunk.text) {
              content = chunk.text;
            }

            if (content) {
              // Send SSE formatted data
              const sseData = `data: ${JSON.stringify({ type: 'token', content })}\n\n`;
              controller.enqueue(encoder.encode(sseData));
            }
          }

          // Send completion event
          const doneData = `data: ${JSON.stringify({ type: 'done' })}\n\n`;
          controller.enqueue(encoder.encode(doneData));

          controller.close();
        } catch (error: any) {
          console.error('Streaming error:', error);
          console.error('Error details:', error.message, error.stack);

          const errorMessage = error.message || 'Stream error occurred';
          const errorData = `data: ${JSON.stringify({ type: 'error', content: errorMessage })}\n\n`;
          controller.enqueue(encoder.encode(errorData));
          controller.close();
        }
      },
    });

    // Return SSE response
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
