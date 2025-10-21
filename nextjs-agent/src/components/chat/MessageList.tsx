'use client';

/**
 * Message List Container
 * Manages scrolling and renders list of MessageBubble components
 */
export default function MessageList() {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {/* TODO: Map over messages array */}
      {/* TODO: Render MessageBubble for each message */}
      {/* TODO: Auto-scroll to bottom on new messages */}
      <div className="text-text-muted text-center">
        No messages yet
      </div>
    </div>
  );
}
