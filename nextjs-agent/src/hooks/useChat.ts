'use client';

import { useState, useRef } from 'react';
import { useSSE } from './useSSE';

interface Message {
  role: 'user' | 'agent';
  content: string;
  timestamp: string;
}

/**
 * useChat Hook
 * Manages chat state and message sending with SSE streaming
 */
export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { startStreaming, isStreaming } = useSSE();

  // Track the current streaming message
  const streamingMessageRef = useRef<string>('');

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    setIsLoading(true);
    setError(null);

    // Add user message immediately
    const userMessage: Message = {
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Prepare agent message placeholder
    const agentMessageIndex = messages.length + 1;
    streamingMessageRef.current = '';

    setMessages((prev) => [
      ...prev,
      {
        role: 'agent',
        content: '',
        timestamp: new Date().toISOString(),
      },
    ]);

    try {
      // Start SSE streaming
      await startStreaming(
        '/api/chat',
        {
          message: content,
          chatHistory: messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        },
        // onToken callback - update the agent message progressively
        (token: string) => {
          streamingMessageRef.current += token;
          setMessages((prev) => {
            const newMessages = [...prev];
            newMessages[agentMessageIndex] = {
              ...newMessages[agentMessageIndex],
              content: streamingMessageRef.current,
            };
            return newMessages;
          });
        }
      );
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');

      // Remove the empty agent message on error
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
      streamingMessageRef.current = '';
    }
  };

  const resetConversation = () => {
    setMessages([]);
    setError(null);
  };

  return {
    messages,
    isLoading: isLoading || isStreaming,
    error,
    sendMessage,
    resetConversation,
  };
}
