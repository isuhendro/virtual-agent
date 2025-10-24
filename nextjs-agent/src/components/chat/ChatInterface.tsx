'use client';

import { useState } from 'react';
import ChatHeader from './ChatHeader';
import ChatBackground from './ChatBackground';
import MessageList from './MessageList';
import StarterPrompts from './StarterPrompts';
import MessageInput from './MessageInput';

interface Message {
  role: 'user' | 'agent';
  content: string;
  timestamp: string;
}

/**
 * Main Chat Interface Container
 * Orchestrates all chat components and manages conversation state
 */
export default function ChatInterface() {
  // Hardcoded demo messages for UI reference (static timestamps to avoid hydration errors)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'user',
      content: 'hi',
      timestamp: '',
    },
    {
      role: 'agent',
      content:
        "Hello! How can I assist you with PriceHub today? If you have a specific question or need help with a PriceHub feature, please let me know and I'll check the documentation for you.",
      timestamp: '',
    },
    {
      role: 'user',
      content: 'how are you',
      timestamp: '',
    },
    {
      role: 'agent',
      content:
        "I'm here and ready to help you with any PriceHub-related questions! How can I assist you with your PriceHub tasks or issues today? If you have a specific question about using PriceHub, let me know, and I'll check the documentation to provide accurate guidance.",
      timestamp: '',
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const starterPrompts = process.env.NEXT_PUBLIC_STARTER_PROMPTS
    ? JSON.parse(process.env.NEXT_PUBLIC_STARTER_PROMPTS)
    : [
        'How can I track my order?',
        'What are your business hours?',
        'Tell me about your return policy',
        'Get started with a demo',
      ];

  const handlePromptClick = (prompt: string) => {
    handleSendMessage(prompt);
  };

  const handleSendMessage = (message: string) => {
    const newUserMessage: Message = {
      role: 'user',
      content: message,
      timestamp: '',
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    // Simulate agent response
    setTimeout(() => {
      const agentResponse: Message = {
        role: 'agent',
        content:
          "Thank you for your message! I'm here to help you with any questions or tasks related to our services. How can I assist you further?",
        timestamp: '',
      };
      setMessages((prev) => [...prev, agentResponse]);
      setIsLoading(false);
    }, 1500);
  };

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

      <MessageInput onSend={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}
