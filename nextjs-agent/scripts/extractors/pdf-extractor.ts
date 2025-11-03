/**
 * PDF Extractor
 * Extracts text from PDF files using pdfjs-dist
 */

import { BaseExtractor, DocumentChunk, ExtractorResult } from './base-extractor';
import fs from 'fs';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

export class PdfExtractor extends BaseExtractor {
  readonly supportedExtensions = ['pdf'];
  readonly name = 'PDF';

  async extract(filePath: string): Promise<ExtractorResult> {
    this.log(`Extracting from: ${filePath}`);

    const fileBuffer = fs.readFileSync(filePath);

    // Extract text from PDF
    this.log('Extracting text content...');
    const textChunks = await this.extractText(fileBuffer);

    this.log(`Extraction complete: ${textChunks.length} text chunks`);

    return {
      chunks: textChunks,
      metadata: {
        totalPages: textChunks.length > 0 ? Math.max(...textChunks.map((c) => c.page || 0)) : 0,
        fileType: 'pdf',
      },
    };
  }

  /**
   * Extract text content from PDF using pdfjs-dist
   */
  private async extractText(buffer: Buffer): Promise<DocumentChunk[]> {
    try {
      const chunks: DocumentChunk[] = [];

      // Load PDF document
      const loadingTask = pdfjsLib.getDocument({
        data: new Uint8Array(buffer),
        useSystemFonts: true,
      });

      const pdfDocument = await loadingTask.promise;
      const numPages = pdfDocument.numPages;

      this.log(`Processing ${numPages} pages...`);

      // Extract text from each page
      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdfDocument.getPage(pageNum);
        const textContent = await page.getTextContent();

        // Combine text items into a single string
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ')
          .trim();

        if (pageText.length > 0) {
          chunks.push({
            content: pageText,
            page: pageNum,
            sourceType: 'text',
          });
        }
      }

      const totalChars = chunks.reduce((sum, chunk) => sum + chunk.content.length, 0);
      this.log(`Extracted text from ${chunks.length} pages (${totalChars} total chars)`);

      return chunks;
    } catch (error) {
      this.logError('Failed to extract text', error);
      return [];
    }
  }
}
