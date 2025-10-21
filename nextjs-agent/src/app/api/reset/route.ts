import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/reset
 * Reset conversation context
 *
 * Request body:
 * - threadId: string (conversation thread to reset)
 */
export async function POST(request: NextRequest) {
  try {
    const { threadId } = await request.json();

    // TODO: Clear conversation state from PostgreSQL
    // TODO: Reset LangGraph checkpointer
    // TODO: Clear vector store session data

    return NextResponse.json({
      success: true,
      threadId,
    });
  } catch (error) {
    console.error('Reset API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
