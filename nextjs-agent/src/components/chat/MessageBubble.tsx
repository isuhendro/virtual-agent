'use client';

interface MessageBubbleProps {
  role: 'user' | 'agent';
  content: string;
  timestamp?: string;
}

/**
 * Individual Message Bubble
 * Renders a single message with role-based styling
 */
export default function MessageBubble({ role, content, timestamp }: MessageBubbleProps) {
  const isUser = role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[70%] rounded-bubble p-4 ${
          isUser
            ? 'bg-primary text-inverse'
            : 'bg-secondary text-primary'
        }`}
      >
        <p className="whitespace-pre-wrap">{content}</p>
        {timestamp && (
          <p className="text-text-muted text-xs mt-1">{timestamp}</p>
        )}
      </div>
    </div>
  );
}
