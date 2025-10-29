'use client';

import { useState, useEffect } from 'react';
import ChatHeader from './ChatHeader';
import ChatBackground from './ChatBackground';
import MessageList from './MessageList';
import StarterPrompts from './StarterPrompts';
import MessageInput from './MessageInput';
import { useChat } from '@/hooks/useChat';

/**
 * Main Chat Interface Container
 * Orchestrates all chat components and manages conversation state
 */
export default function ChatInterface() {
  const { messages, isLoading, error, sendMessage } = useChat();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration errors by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const starterPrompts = process.env.NEXT_PUBLIC_STARTER_PROMPTS
    ? JSON.parse(process.env.NEXT_PUBLIC_STARTER_PROMPTS)
    : [
        'How can I track my order?',
        'What are your business hours?',
        'Tell me about your return policy',
        'Get started with a demo',
      ];

  const handlePromptClick = (prompt: string) => {
    sendMessage(prompt);
  };

  const handleSendMessage = (message: string) => {
    sendMessage(message);
  };

  if (!mounted) {
    // Return a placeholder that matches the server-rendered output
    return (
      <div className="flex flex-col h-full bg-white relative">
        <ChatHeader />
        <div className="flex-1 overflow-hidden">
          <div className="flex flex-col items-center justify-center h-full">
            <StarterPrompts prompts={starterPrompts} onPromptClick={handlePromptClick} />
          </div>
        </div>
        <MessageInput onSend={handleSendMessage} isLoading={false} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white relative">
      <ChatHeader />

      <div className="flex-1 overflow-hidden">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <StarterPrompts prompts={starterPrompts} onPromptClick={handlePromptClick} />
          </div>
        ) : (
          <MessageList messages={messages} isLoading={isLoading} />
        )}
      </div>

      {error && (
        <div className="px-4 py-2 bg-red-50 text-red-600 text-sm">
          {error}
        </div>
      )}

      <MessageInput onSend={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}
