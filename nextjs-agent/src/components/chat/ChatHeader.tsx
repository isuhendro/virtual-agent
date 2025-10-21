'use client';

/**
 * Chat Header Component
 * Displays agent info, status, and action buttons
 */
export default function ChatHeader() {
  return (
    <header className="sticky top-0 z-10 bg-background border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left: Agent info */}
        <div className="flex items-center gap-3">
          {/* TODO: Add agent avatar */}
          <div>
            <h2 className="text-text-primary font-semibold">
              {process.env.NEXT_PUBLIC_AGENT_NAME || 'Virtual Assistant'}
            </h2>
            <p className="text-text-secondary text-sm">
              {process.env.NEXT_PUBLIC_AGENT_TAGLINE || 'Always here to help'}
            </p>
          </div>
        </div>

        {/* Right: Action buttons */}
        <div className="flex items-center gap-2">
          {/* TODO: Add minimize, close buttons */}
        </div>
      </div>
    </header>
  );
}
