'use client';

/**
 * Message Input Component
 * User text input field with send button
 */
export default function MessageInput() {
  return (
    <div className="border-t border-gray-200 p-4">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="button"
          className="px-6 py-2 bg-primary text-inverse rounded-lg hover:opacity-90 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
