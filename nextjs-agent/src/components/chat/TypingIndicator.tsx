'use client';

/**
 * Typing Indicator Component
 * Shows animated dots when agent is generating response
 */
export default function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-secondary text-primary rounded-bubble p-4">
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
