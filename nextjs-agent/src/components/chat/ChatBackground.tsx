'use client';

interface ChatBackgroundProps {
  backgroundName?: string;
  opacity?: number;
}

/**
 * Chat Background Component
 * Renders SVG background from public/backgrounds/
 */
export default function ChatBackground({
  backgroundName = 'default',
  opacity = 0.5,
}: ChatBackgroundProps) {
  const backgroundUrl = `/backgrounds/${backgroundName}.svg`;

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `url(${backgroundUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity,
      }}
    />
  );
}
