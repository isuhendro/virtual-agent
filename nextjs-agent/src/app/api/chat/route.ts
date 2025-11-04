import { NextRequest } from 'next/server';
import { createChatChain } from '@/lib/langchain/chains';
import { HumanMessage, AIMessage, BaseMessage } from '@langchain/core/messages';

/**
 * POST /api/chat
 * Main chat endpoint with SSE streaming
 *
 * Request body:
 * - message: string (user message)
 * - threadId?: string (conversation thread)
 * - chatHistory?: Array<{role: 'user' | 'agent', content: string}> (previous messages)
 * - clientToken?: string (JWT authentication token)
 */
export async function POST(request: NextRequest) {
  try {
    const { message, chatHistory = [] } = await request.json();

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
    try {
      chain = createChatChain();
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
          // Stream the response
          const streamResponse = await chain.stream({
            input: message,
            chatHistory: formattedHistory,
          });

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
