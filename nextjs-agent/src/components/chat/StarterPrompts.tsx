'use client';

interface StarterPromptsProps {
  prompts?: string[];
  onPromptClick?: (prompt: string) => void;
}

/**
 * Starter Prompts Component
 * Displays suggested questions when conversation is empty
 */
export default function StarterPrompts({
  prompts = [],
  onPromptClick,
}: StarterPromptsProps) {
  if (prompts.length === 0) return null;

  return (
    <div className="p-6 space-y-4">
      <h3 className="text-text-primary font-semibold text-center">
        How can I help you today?
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {prompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => onPromptClick?.(prompt)}
            className="p-3 text-left bg-secondary/10 hover:bg-primary hover:text-inverse text-text-primary rounded-lg transition cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
