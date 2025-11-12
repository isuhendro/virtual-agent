'use client';

import { useState } from 'react';
import MarkdownRenderer from './MarkdownRenderer';
import { copyAsRichText } from '@/lib/utils/copy-rich-text';

interface MessageBubbleProps {
  role: 'user' | 'agent';
  content: string;
  timestamp?: string;
}

/**
 * Individual Message Bubble
 * User messages with bubble, agent messages without bubble
 */
export default function MessageBubble({ role, content, timestamp }: MessageBubbleProps) {
  const isUser = role === 'user';
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleCopy = async () => {
    try {
      await copyAsRichText(content);
      setCopyStatus('success');
      setTimeout(() => setCopyStatus('idle'), 2000); // Reset after 2 seconds
    } catch (error) {
      console.error('Failed to copy:', error);
      setCopyStatus('error');
      setTimeout(() => setCopyStatus('idle'), 2000); // Reset after 2 seconds
    }
  };

  if (isUser) {
    // User message: right-aligned with gray bubble, no avatar
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-[80%]">
          <div className="rounded-2xl px-4 py-3 bg-gray-100 text-gray-900">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
          </div>
        </div>
      </div>
    );
  }

  // Agent message: left-aligned, no bubble, markdown content with action icons
  return (
    <div className="flex justify-start mb-6">
      <div className="max-w-[90%]">
        <div className="mb-3">
          <MarkdownRenderer content={content} />
        </div>
        <div className="flex gap-2">
          <button
            className="p-1.5 hover:bg-gray-100 rounded transition relative group"
            aria-label="Copy message"
            onClick={handleCopy}
          >
            {copyStatus === 'success' ? (
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : copyStatus === 'error' ? (
              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {copyStatus === 'success' ? 'Copied!' : copyStatus === 'error' ? 'Copy failed' : 'Copy as rich text'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
