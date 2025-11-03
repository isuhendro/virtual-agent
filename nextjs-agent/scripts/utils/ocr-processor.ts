/**
 * OCR Processor
 * Extract text from images using Tesseract.js
 */

import { createWorker, Worker } from 'tesseract.js';

// Singleton worker for reuse
let ocrWorker: Worker | null = null;
let workerInitialized = false;

/**
 * Initialize OCR worker (lazy loading)
 */
export async function initializeOCR(): Promise<Worker> {
  if (ocrWorker && workerInitialized) {
    return ocrWorker;
  }

  console.log('🔄 [OCR] Initializing Tesseract worker...');
  const startTime = Date.now();

  ocrWorker = await createWorker('eng', 1, {
    logger: () => {}, // Suppress verbose logs
  });

  workerInitialized = true;
  const duration = Date.now() - startTime;
  console.log(`✅ [OCR] Tesseract worker initialized in ${duration}ms`);

  return ocrWorker;
}

/**
 * Extract text from image buffer
 */
export async function extractTextFromImage(
  imageBuffer: Buffer,
  imageName: string = 'image'
): Promise<string> {
  try {
    const worker = await initializeOCR();

    const startTime = Date.now();
    const {
      data: { text, confidence },
    } = await worker.recognize(imageBuffer);

    const duration = Date.now() - startTime;

    // Log confidence
    const confidencePercent = (confidence || 0).toFixed(1);
    console.log(
      `  📷 [OCR] Processed ${imageName}: ${text.length} chars, ${confidencePercent}% confidence (${duration}ms)`
    );

    // Return cleaned text
    return text.trim();
  } catch (error) {
    console.error(`  ❌ [OCR] Failed to process ${imageName}:`, error);
    return '';
  }
}

/**
 * Extract text from multiple images in parallel
 */
export async function extractTextFromImages(
  images: { buffer: Buffer; name: string }[],
  maxParallel: number = 3
): Promise<{ text: string; name: string }[]> {
  if (images.length === 0) {
    return [];
  }

  console.log(`🔄 [OCR] Processing ${images.length} images (max ${maxParallel} parallel)...`);
  const startTime = Date.now();

  const results: { text: string; name: string }[] = [];

  // Process in batches to avoid overwhelming memory
  for (let i = 0; i < images.length; i += maxParallel) {
    const batch = images.slice(i, i + maxParallel);

    const batchResults = await Promise.all(
      batch.map(async (img) => ({
        text: await extractTextFromImage(img.buffer, img.name),
        name: img.name,
      }))
    );

    results.push(...batchResults);
  }

  const totalDuration = Date.now() - startTime;
  const avgDuration = Math.round(totalDuration / images.length);

  console.log(
    `✅ [OCR] Processed ${images.length} images in ${totalDuration}ms (avg ${avgDuration}ms/image)`
  );

  return results;
}

/**
 * Cleanup OCR worker
 */
export async function terminateOCR(): Promise<void> {
  if (ocrWorker && workerInitialized) {
    console.log('🔄 [OCR] Terminating Tesseract worker...');
    await ocrWorker.terminate();
    ocrWorker = null;
    workerInitialized = false;
    console.log('✅ [OCR] Tesseract worker terminated');
  }
}

/**
 * Check if text looks like valid OCR output
 * (filters out garbage OCR results)
 */
export function isValidOCRText(text: string, minLength: number = 10): boolean {
  if (!text || text.length < minLength) {
    return false;
  }

  // Check if text has reasonable ratio of alphanumeric characters
  const alphanumeric = text.match(/[a-zA-Z0-9]/g)?.length || 0;
  const total = text.length;
  const ratio = alphanumeric / total;

  // At least 30% should be alphanumeric for valid text
  return ratio > 0.3;
}
