'use client';

import { useState } from 'react';

interface Message {
  role: 'user' | 'agent';
  content: string;
  timestamp: string;
}

/**
 * useChat Hook
 * Manages chat state and message sending
 */
export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (content: string) => {
    // TODO: Send message to /api/chat
    // TODO: Handle SSE streaming
    // TODO: Update messages array
    setIsLoading(true);
    console.log('Sending message:', content);
    setIsLoading(false);
  };

  const resetConversation = async () => {
    // TODO: Call /api/reset
    setMessages([]);
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    resetConversation,
  };
}
