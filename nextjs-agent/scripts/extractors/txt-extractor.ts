/**
 * TXT Extractor
 * Simple text file extractor (no OCR needed)
 */

import { BaseExtractor, DocumentChunk, ExtractorResult } from './base-extractor';
import fs from 'fs';

export class TxtExtractor extends BaseExtractor {
  readonly supportedExtensions = ['txt', 'md', 'markdown'];
  readonly name = 'TXT';

  async extract(filePath: string): Promise<ExtractorResult> {
    this.log(`Extracting from: ${filePath}`);

    try {
      const text = fs.readFileSync(filePath, 'utf-8');

      if (!text || text.trim().length === 0) {
        this.log('File is empty');
        return {
          chunks: [],
          metadata: {
            fileType: 'txt',
          },
        };
      }

      const cleanedText = text.trim();

      // Return as single chunk (will be split by text-chunker later)
      const chunk: DocumentChunk = {
        content: cleanedText,
        sourceType: 'text',
      };

      this.log(`Extracted ${cleanedText.length} characters`);

      return {
        chunks: [chunk],
        metadata: {
          fileType: 'txt',
        },
      };
    } catch (error) {
      this.logError('Failed to extract text', error);
      return {
        chunks: [],
        metadata: {
          fileType: 'txt',
        },
      };
    }
  }
}
