import ChatInterface from '@/components/chat/ChatInterface';

/**
 * Standalone Chat Page
 * Full-page chat interface for direct access
 */
export default function ChatPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-4xl h-[800px] bg-background rounded-lg shadow-lg overflow-hidden">
        <ChatInterface />
      </div>
    </main>
  );
}
