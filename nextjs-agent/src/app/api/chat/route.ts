import { NextRequest } from 'next/server';

/**
 * Hardcoded responses for demo purposes
 */
const DEMO_RESPONSES = [
  "Hello! I'm your virtual assistant. How can I help you today?",
  "That's a great question! Let me help you with that.",
  "I understand what you're looking for. Here's what I can tell you...",
  "Thanks for reaching out! I'm here to assist you with any questions you might have.",
  "I'd be happy to help you with that. Let me provide you with some information.",
  "That's an interesting point. From my experience, I can suggest...",
  "I appreciate you asking! Here's my recommendation based on your question.",
  "Great question! I can definitely help you understand this better.",
  "I see what you're asking about. Let me break this down for you...",
  "Thank you for your patience. Here's what I think would work best for your situation."
];

/**
 * POST /api/chat
 * Demo chat endpoint with hardcoded responses and SSE streaming
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

    // Select a response based on message content or randomly
    let selectedResponse: string;
    
    // Simple keyword-based responses
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      selectedResponse = "Hello! I'm your virtual assistant. How can I help you today?";
    } else if (lowerMessage.includes('help')) {
      selectedResponse = "I'd be happy to help you! What specific question or topic would you like assistance with?";
    } else if (lowerMessage.includes('thank')) {
      selectedResponse = "You're very welcome! Is there anything else I can help you with?";
    } else if (lowerMessage.includes('problem') || lowerMessage.includes('issue')) {
      selectedResponse = "I understand you're facing a challenge. Let me help you work through this step by step.";
    } else if (lowerMessage.includes('how') && lowerMessage.includes('work')) {
      selectedResponse = "Great question! Let me explain how this works in simple terms...";
    } else {
      // Random response for other messages
      const randomIndex = Math.floor(Math.random() * DEMO_RESPONSES.length);
      selectedResponse = DEMO_RESPONSES[randomIndex];
    }

    // Create readable stream for SSE
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Simulate typing by streaming word by word
          const words = selectedResponse.split(' ');
          
          for (let i = 0; i < words.length; i++) {
            const word = words[i] + (i < words.length - 1 ? ' ' : '');
            
            // Send each word as a token
            const sseData = `data: ${JSON.stringify({ type: 'token', content: word })}\n\n`;
            controller.enqueue(encoder.encode(sseData));
            
            // Add small delay to simulate typing
            await new Promise(resolve => setTimeout(resolve, 50));
          }

          // Send completion event
          const doneData = `data: ${JSON.stringify({ type: 'done' })}\n\n`;
          controller.enqueue(encoder.encode(doneData));

          controller.close();
        } catch (error: any) {
          console.error('Streaming error:', error);
          const errorData = `data: ${JSON.stringify({ type: 'error', content: 'Sorry, something went wrong.' })}\n\n`;
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
