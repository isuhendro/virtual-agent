import ChatInterface from '@/components/chat/ChatInterface';

/**
 * Embeddable Chat Widget Page
 * Minimal page designed to be embedded in an iframe
 * Used by the Svelte widget wrapper
 */
export default function EmbedPage() {
  return (
    <main className="w-full h-screen overflow-hidden bg-background">
      <ChatInterface />
    </main>
  );
}
