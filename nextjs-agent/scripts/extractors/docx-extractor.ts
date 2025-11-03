/**
 * DOCX Extractor
 * Extracts text and images from DOCX files with OCR support
 */

import { BaseExtractor, DocumentChunk, ExtractorResult } from './base-extractor';
import fs from 'fs';
import mammoth from 'mammoth';
import { extractTextFromImages, isValidOCRText } from '../utils/ocr-processor';

export class DocxExtractor extends BaseExtractor {
  readonly supportedExtensions = ['docx', 'doc'];
  readonly name = 'DOCX';

  async extract(filePath: string): Promise<ExtractorResult> {
    this.log(`Extracting from: ${filePath}`);

    // Step 1: Extract text content
    this.log('Step 1/3: Extracting text content...');
    const textChunks = await this.extractText(filePath);

    // Step 2: Extract images
    this.log('Step 2/3: Extracting embedded images...');
    const images = await this.extractImages(filePath);

    // Step 3: OCR on images
    let imageChunks: DocumentChunk[] = [];
    if (images.length > 0) {
      this.log(`Step 3/3: Running OCR on ${images.length} images...`);
      imageChunks = await this.processImagesWithOCR(images);
    } else {
      this.log('Step 3/3: No images found, skipping OCR');
    }

    const allChunks = [...textChunks, ...imageChunks];

    this.log(
      `Extraction complete: ${textChunks.length} text chunks, ${imageChunks.length} image chunks (${allChunks.length} total)`
    );

    return {
      chunks: allChunks,
      metadata: {
        totalImages: images.length,
        fileType: 'docx',
      },
    };
  }

  /**
   * Extract text content from DOCX
   */
  private async extractText(filePath: string): Promise<DocumentChunk[]> {
    try {
      // Extract raw text
      const result = await mammoth.extractRawText({ path: filePath });

      if (result.value && result.value.trim().length > 0) {
        const text = result.value.trim();

        // Split into logical sections (by double newlines or headers)
        const paragraphs = text
          .split(/\n{2,}/)
          .map((p) => p.trim())
          .filter((p) => p.length > 0);

        const chunks: DocumentChunk[] = paragraphs.map((paragraph, index) => ({
          content: paragraph,
          paragraphIndex: index,
          sourceType: 'text',
        }));

        this.log(`Extracted ${chunks.length} text paragraphs (${text.length} total chars)`);

        return chunks;
      } else {
        this.log('No text content found in DOCX');
        return [];
      }
    } catch (error) {
      this.logError('Failed to extract text', error);
      return [];
    }
  }

  /**
   * Extract images from DOCX
   */
  private async extractImages(filePath: string): Promise<{ buffer: Buffer; index: number }[]> {
    try {
      const images: { buffer: Buffer; index: number }[] = [];

      // Use mammoth to extract images
      const result = await mammoth.convertToHtml(
        { path: filePath },
        {
          convertImage: mammoth.images.imgElement((image) => {
            // Read image data
            return image.read('base64').then((imageBuffer) => {
              // Store image buffer
              images.push({
                buffer: Buffer.from(imageBuffer, 'base64'),
                index: images.length,
              });

              // Return empty alt text (we don't need HTML)
              return { src: '' };
            });
          }),
        }
      );

      this.log(`Extracted ${images.length} embedded images`);
      return images;
    } catch (error) {
      this.logError('Failed to extract images', error);
      return [];
    }
  }

  /**
   * Process images with OCR
   */
  private async processImagesWithOCR(
    images: { buffer: Buffer; index: number }[]
  ): Promise<DocumentChunk[]> {
    const imagesToProcess = images.map((img) => ({
      buffer: img.buffer,
      name: `image_${img.index}`,
    }));

    const ocrResults = await extractTextFromImages(imagesToProcess);

    const chunks: DocumentChunk[] = [];

    ocrResults.forEach((result, index) => {
      if (isValidOCRText(result.text, 10)) {
        chunks.push({
          content: result.text,
          sourceType: 'image',
          imageIndex: images[index].index,
        });
      } else {
        console.log(`  ⚠️  Skipped low-quality OCR for ${result.name} (${result.text.length} chars)`);
      }
    });

    this.log(`OCR produced ${chunks.length} valid text chunks from ${images.length} images`);

    return chunks;
  }
}
