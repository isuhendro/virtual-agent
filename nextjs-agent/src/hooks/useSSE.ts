'use client';

import { useState } from 'react';

/**
 * useSSE Hook
 * Handles Server-Sent Events streaming
 */
export function useSSE() {
  const [data, setData] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const startStreaming = async (url: string, body: any, onToken?: (token: string) => void) => {
    setIsStreaming(true);
    setError(null);
    setData('');

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        // Try to parse error response
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMessage = errorData.error;
            if (errorData.details) {
              errorMessage += ` - ${errorData.details}`;
            }
          }
        } catch (e) {
          // Failed to parse error, use default message
        }
        throw new Error(errorMessage);
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedData = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        // Decode chunk
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const jsonStr = line.substring(6); // Remove 'data: ' prefix

            try {
              const parsed = JSON.parse(jsonStr);

              if (parsed.type === 'token') {
                accumulatedData += parsed.content;
                setData(accumulatedData);

                // Call optional token callback
                if (onToken) {
                  onToken(parsed.content);
                }
              } else if (parsed.type === 'done') {
                // Stream complete
                break;
              } else if (parsed.type === 'error') {
                console.error('Server streaming error:', parsed.content);
                throw new Error(parsed.content || 'Streaming error');
              }
            } catch (parseError) {
              // Ignore empty lines and invalid JSON (common in SSE)
              if (line.trim() && !line.startsWith('data: {')) {
                console.warn('Failed to parse SSE line:', line);
              }
            }
          }
        }
      }
    } catch (err) {
      console.error('SSE streaming error:', err);
      setError(err as Error);
    } finally {
      setIsStreaming(false);
    }
  };

  const reset = () => {
    setData('');
    setError(null);
    setIsStreaming(false);
  };

  return {
    data,
    isStreaming,
    error,
    startStreaming,
    reset,
  };
}
