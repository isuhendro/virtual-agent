'use client';

interface ChatHeaderProps {
  onReset?: () => void;
}

/**
 * Chat Header Component
 * Displays agent info, status, and action buttons
 */
export default function ChatHeader({ onReset }: ChatHeaderProps = {}) {
  return (
    <header className="px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left: Agent info */}
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-gray-900 font-semibold text-lg">
              {process.env.NEXT_PUBLIC_AGENT_NAME || 'Virtual Assistant'}
            </h2>
            <p className="text-gray-500 text-sm">
              {process.env.NEXT_PUBLIC_AGENT_TAGLINE || 'Always here to help'}
            </p>
          </div>
        </div>

        {/* Right: Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            aria-label="Reset conversation"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            aria-label="History"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
