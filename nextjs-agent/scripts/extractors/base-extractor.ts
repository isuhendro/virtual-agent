/**
 * Base Extractor Interface
 * Abstract class for document extractors (PDF, DOCX, TXT, etc.)
 */

export interface DocumentChunk {
  content: string;
  page?: number;              // For PDF
  section?: string;           // For DOCX
  paragraphIndex?: number;    // For DOCX
  sourceType: 'text' | 'image';
  imageIndex?: number;        // If from image
}

export interface ExtractorResult {
  chunks: DocumentChunk[];
  metadata: {
    totalPages?: number;
    totalImages?: number;
    fileType: string;
  };
}

export abstract class BaseExtractor {
  /**
   * Supported file extensions (without dot)
   */
  abstract readonly supportedExtensions: string[];

  /**
   * Human-readable name for logging
   */
  abstract readonly name: string;

  /**
   * Extract content from a document file
   * @param filePath Absolute path to the document
   * @returns Extracted chunks and metadata
   */
  abstract extract(filePath: string): Promise<ExtractorResult>;

  /**
   * Check if this extractor can handle the given filename
   * @param filename Filename with extension
   * @returns True if this extractor supports the file type
   */
  canHandle(filename: string): boolean {
    const ext = filename.toLowerCase().split('.').pop();
    return ext ? this.supportedExtensions.includes(ext) : false;
  }

  /**
   * Get file extension from filename
   */
  protected getExtension(filename: string): string {
    return filename.toLowerCase().split('.').pop() || '';
  }

  /**
   * Log extraction progress
   */
  protected log(message: string): void {
    console.log(`  [${this.name}] ${message}`);
  }

  /**
   * Log extraction error
   */
  protected logError(message: string, error?: any): void {
    console.error(`  ❌ [${this.name}] ${message}`, error || '');
  }
}
