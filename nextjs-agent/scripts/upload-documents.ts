#!/usr/bin/env tsx
/**
 * Document Upload Script
 * Processes documents from incoming/ folder and uploads to Qdrant
 * Supports: PDF, DOCX, TXT with OCR on images
 */

// Load environment variables FIRST
import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';
import { PdfExtractor } from './extractors/pdf-extractor';
import { DocxExtractor } from './extractors/docx-extractor';
import { TxtExtractor } from './extractors/txt-extractor';
import { BaseExtractor } from './extractors/base-extractor';
import { chunkText, getChunkStats } from './utils/text-chunker';
import { updateDocument, DocumentChunkToUpload } from './utils/document-manager';
import { terminateOCR } from './utils/ocr-processor';

// Initialize extractors
const extractors: BaseExtractor[] = [
  new PdfExtractor(),
  new DocxExtractor(),
  new TxtExtractor(),
];

interface ProcessingResult {
  filename: string;
  success: boolean;
  chunks: number;
  error?: string;
  movedTo?: string;
}

/**
 * Main processing function
 */
async function main() {
  console.log('╔════════════════════════════════════════════════════╗');
  console.log('║       DOCUMENT UPLOAD TO QDRANT                    ║');
  console.log('╚════════════════════════════════════════════════════╝\n');

  // Get incoming folder path
  const incomingDir = path.join(process.cwd(), 'incoming');

  // Check if incoming directory exists
  if (!fs.existsSync(incomingDir)) {
    console.log('❌ Error: incoming/ folder not found');
    console.log('📁 Creating incoming/ folder...\n');
    fs.mkdirSync(incomingDir);
    console.log('✅ Created incoming/ folder');
    console.log('📝 Please place your PDF, DOCX, or TXT files in incoming/ and run again\n');
    return;
  }

  // Get all files in incoming folder
  const files = fs.readdirSync(incomingDir).filter((file) => {
    const filePath = path.join(incomingDir, file);
    return fs.statSync(filePath).isFile();
  });

  if (files.length === 0) {
    console.log('📂 incoming/ folder is empty');
    console.log('📝 Please place your PDF, DOCX, or TXT files in incoming/ folder\n');
    return;
  }

  console.log(`📂 Found ${files.length} file(s) in incoming/\n`);

  const results: ProcessingResult[] = [];
  const startTime = Date.now();

  // Process each file
  for (let i = 0; i < files.length; i++) {
    const filename = files[i];
    const filePath = path.join(incomingDir, filename);

    console.log(`\n${'='.repeat(60)}`);
    console.log(`📄 Processing file ${i + 1}/${files.length}: ${filename}`);
    console.log(`${'='.repeat(60)}\n`);

    try {
      const result = await processFile(filePath, filename);
      results.push(result);

      if (result.success) {
        console.log(`\n✅ Successfully processed ${filename}`);
      } else {
        console.log(`\n❌ Failed to process ${filename}: ${result.error}`);
      }
    } catch (error: any) {
      console.error(`\n❌ Unexpected error processing ${filename}:`, error.message);
      results.push({
        filename,
        success: false,
        chunks: 0,
        error: error.message,
      });
    }
  }

  // Cleanup OCR worker
  await terminateOCR();

  // Print summary
  const totalTime = Date.now() - startTime;
  printSummary(results, totalTime);
}

/**
 * Process a single file
 */
async function processFile(filePath: string, filename: string): Promise<ProcessingResult> {
  // Find appropriate extractor
  const extractor = extractors.find((e) => e.canHandle(filename));

  if (!extractor) {
    const ext = filename.split('.').pop()?.toLowerCase();
    console.log(`⚠️  Unsupported file type: .${ext}`);
    console.log(`   Supported types: ${extractors.flatMap((e) => e.supportedExtensions).join(', ')}`);
    return {
      filename,
      success: false,
      chunks: 0,
      error: `Unsupported file type: .${ext}`,
    };
  }

  console.log(`🔧 Using ${extractor.name} extractor`);

  // Step 1: Extract content
  console.log('\n📥 STEP 1: Extracting content...');
  const extractionResult = await extractor.extract(filePath);

  if (extractionResult.chunks.length === 0) {
    console.log('⚠️  No content extracted from file');
    return {
      filename,
      success: false,
      chunks: 0,
      error: 'No content extracted',
    };
  }

  console.log(`✅ Extracted ${extractionResult.chunks.length} raw chunks`);

  // Step 2: Chunk the content
  console.log('\n✂️  STEP 2: Chunking content...');
  const chunkedContent: DocumentChunkToUpload[] = [];

  for (const extractedChunk of extractionResult.chunks) {
    // Apply text chunking
    const textChunks = chunkText(extractedChunk.content, {
      chunkSize: 800,
      overlapSize: 200,
      preserveSentences: true,
    });

    // Convert to upload format
    for (const textChunk of textChunks) {
      chunkedContent.push({
        content: textChunk.content,
        metadata: {
          filename,
          file_type: extractionResult.metadata.fileType,
          page: extractedChunk.page,
          section: extractedChunk.section,
          chunk_index: 0, // Will be set during upload
          total_chunks: 0, // Will be set during upload
          source_type: extractedChunk.sourceType,
          image_index: extractedChunk.imageIndex,
        },
      });
    }
  }

  const stats = getChunkStats(
    chunkedContent.map((c, i) => ({
      content: c.content,
      index: i,
      startChar: 0,
      endChar: c.content.length,
    }))
  );

  console.log(`✅ Created ${chunkedContent.length} final chunks`);
  console.log(`   Avg size: ${stats.avgChunkSize} chars`);
  console.log(`   Range: ${stats.minChunkSize} - ${stats.maxChunkSize} chars`);

  // Step 3: Upload to Qdrant
  console.log('\n☁️  STEP 3: Uploading to Qdrant...');
  const uploadResult = await updateDocument(
    filename,
    extractionResult.metadata.fileType,
    chunkedContent
  );

  if (!uploadResult.success) {
    return {
      filename,
      success: false,
      chunks: 0,
      error: 'Upload failed',
    };
  }

  // Step 4: Move to processed folder
  console.log('\n📦 STEP 4: Moving to processed folder...');
  const processedDir = path.join(process.cwd(), 'processed');
  if (!fs.existsSync(processedDir)) {
    fs.mkdirSync(processedDir, { recursive: true });
  }

  const targetPath = path.join(processedDir, filename);

  try {
    fs.renameSync(filePath, targetPath);
    console.log(`✅ Moved to: processed/${filename}`);
  } catch (moveError: any) {
    console.warn(`⚠️  Could not move file: ${moveError.message}`);
    // Don't fail the whole operation if move fails
  }

  return {
    filename,
    success: true,
    chunks: uploadResult.uploaded,
    movedTo: 'processed/',
  };
}

/**
 * Print summary report
 */
function printSummary(results: ProcessingResult[], totalTime: number) {
  console.log('\n\n╔════════════════════════════════════════════════════╗');
  console.log('║              PROCESSING SUMMARY                    ║');
  console.log('╚════════════════════════════════════════════════════╝\n');

  const successful = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);
  const totalChunks = successful.reduce((sum, r) => sum + r.chunks, 0);

  console.log(`⏱️  Total time: ${(totalTime / 1000).toFixed(1)}s`);
  console.log(`📊 Total files: ${results.length}`);
  console.log(`✅ Successful: ${successful.length}`);
  console.log(`❌ Failed: ${failed.length}`);
  console.log(`📝 Total chunks uploaded: ${totalChunks}\n`);

  if (successful.length > 0) {
    console.log('✅ Successfully processed:');
    successful.forEach((r) => {
      const location = r.movedTo ? ` → ${r.movedTo}` : '';
      console.log(`   • ${r.filename} (${r.chunks} chunks)${location}`);
    });
    console.log('');
  }

  if (failed.length > 0) {
    console.log('❌ Failed to process:');
    failed.forEach((r) => {
      console.log(`   • ${r.filename}: ${r.error}`);
    });
    console.log('');
  }

  console.log('════════════════════════════════════════════════════\n');
}

// Run main function
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
