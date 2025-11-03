/**
 * Text Chunking Utility
 * Splits text into chunks with overlap for better context preservation
 */

export interface ChunkConfig {
  chunkSize: number;      // Target chunk size in characters
  overlapSize: number;    // Overlap between chunks in characters
  preserveSentences: boolean; // Try to break at sentence boundaries
}

export interface TextChunk {
  content: string;
  index: number;
  startChar: number;
  endChar: number;
}

const DEFAULT_CONFIG: ChunkConfig = {
  chunkSize: 800,           // ~200 tokens
  overlapSize: 200,         // 25% overlap
  preserveSentences: true,
};

/**
 * Split text into chunks with overlap
 */
export function chunkText(
  text: string,
  config: Partial<ChunkConfig> = {}
): TextChunk[] {
  const { chunkSize, overlapSize, preserveSentences } = {
    ...DEFAULT_CONFIG,
    ...config,
  };

  if (!text || text.trim().length === 0) {
    return [];
  }

  // Clean text
  const cleanedText = text
    .replace(/\r\n/g, '\n')  // Normalize line endings
    .replace(/\n{3,}/g, '\n\n')  // Max 2 consecutive newlines
    .trim();

  if (cleanedText.length <= chunkSize) {
    // Text fits in one chunk
    return [
      {
        content: cleanedText,
        index: 0,
        startChar: 0,
        endChar: cleanedText.length,
      },
    ];
  }

  const chunks: TextChunk[] = [];
  let currentPos = 0;
  let chunkIndex = 0;

  while (currentPos < cleanedText.length) {
    let endPos = currentPos + chunkSize;

    // If we're at the end, take everything
    if (endPos >= cleanedText.length) {
      endPos = cleanedText.length;
    } else if (preserveSentences) {
      // Try to break at sentence boundary
      endPos = findSentenceBoundary(cleanedText, currentPos, endPos);
    }

    const chunkContent = cleanedText.substring(currentPos, endPos).trim();

    if (chunkContent.length > 0) {
      chunks.push({
        content: chunkContent,
        index: chunkIndex,
        startChar: currentPos,
        endChar: endPos,
      });
      chunkIndex++;
    }

    // Move forward by (chunkSize - overlapSize) to create overlap
    currentPos = endPos - overlapSize;

    // Make sure we're making progress
    if (currentPos <= chunks[chunks.length - 1]?.startChar) {
      currentPos = endPos;
    }

    // If we're very close to the end, just include it in the last chunk
    if (cleanedText.length - currentPos < overlapSize) {
      break;
    }
  }

  return chunks;
}

/**
 * Find the best sentence boundary near the target position
 */
function findSentenceBoundary(
  text: string,
  start: number,
  targetEnd: number
): number {
  // Look for sentence endings: . ! ? followed by space or newline
  const searchWindow = 100; // Look 100 chars before and after target
  const searchStart = Math.max(start, targetEnd - searchWindow);
  const searchEnd = Math.min(text.length, targetEnd + searchWindow);

  const sentenceEndings = /[.!?][\s\n]/g;
  let bestBoundary = targetEnd;
  let minDistance = Infinity;

  // Find all sentence endings in the search window
  for (let i = searchStart; i < searchEnd; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (
      (char === '.' || char === '!' || char === '?') &&
      (nextChar === ' ' || nextChar === '\n' || nextChar === undefined)
    ) {
      const distance = Math.abs(i - targetEnd);
      if (distance < minDistance) {
        minDistance = distance;
        bestBoundary = i + 1; // Include the punctuation
      }
    }
  }

  // If no sentence boundary found nearby, try paragraph break
  if (minDistance > searchWindow / 2) {
    const paragraphBreak = text.indexOf('\n\n', targetEnd - searchWindow);
    if (paragraphBreak !== -1 && paragraphBreak < targetEnd + searchWindow) {
      return paragraphBreak;
    }
  }

  return bestBoundary;
}

/**
 * Get chunk statistics
 */
export function getChunkStats(chunks: TextChunk[]): {
  totalChunks: number;
  avgChunkSize: number;
  minChunkSize: number;
  maxChunkSize: number;
} {
  if (chunks.length === 0) {
    return {
      totalChunks: 0,
      avgChunkSize: 0,
      minChunkSize: 0,
      maxChunkSize: 0,
    };
  }

  const sizes = chunks.map((c) => c.content.length);

  return {
    totalChunks: chunks.length,
    avgChunkSize: Math.round(sizes.reduce((a, b) => a + b, 0) / sizes.length),
    minChunkSize: Math.min(...sizes),
    maxChunkSize: Math.max(...sizes),
  };
}
