/**
 * Document Manager
 * Handles vector database operations for document management
 * Supports both PostgreSQL (pgvector) and Qdrant
 */

import * as vectorDb from '../../src/lib/vector-db';
import { generateDocumentEmbeddings } from '../../src/lib/embeddings';
import { config } from '../../src/lib/config/env';
import crypto from 'crypto';

export interface DocumentMetadata {
  document_id: string;
  filename: string;
  file_type: string;
  page?: number;
  section?: string;
  chunk_index: number;
  total_chunks: number;
  source_type: 'text' | 'image';
  image_index?: number;
  uploaded_at: string;
}

export interface DocumentChunkToUpload {
  content: string;
  metadata: Omit<DocumentMetadata, 'document_id' | 'uploaded_at' | 'chunk_index'>;
}

/**
 * Generate document ID from filename
 */
export function generateDocumentId(filename: string): string {
  // Use filename as document ID for easy updates
  return filename;
}

/**
 * Generate file hash for duplicate detection
 */
export function generateFileHash(fileBuffer: Buffer): string {
  return crypto.createHash('md5').update(fileBuffer).digest('hex');
}

/**
 * Check if document already exists in vector database
 */
export async function documentExists(
  documentId: string,
  collectionName: string = config.vectorDbCollectionName
): Promise<{ exists: boolean; chunkCount: number }> {
  try {
    const result = await vectorDb.scrollByDocumentId(collectionName, documentId, 1);

    if (result.length > 0) {
      // Count total chunks
      const countResult = await vectorDb.scrollByDocumentId(collectionName, documentId, 10000);

      return {
        exists: true,
        chunkCount: countResult.length,
      };
    }

    return { exists: false, chunkCount: 0 };
  } catch (error: any) {
    // If index is missing, skip check and assume document doesn't exist
    if (error.message && (error.message.includes('Index required') || error.message.includes('does not exist'))) {
      console.log(`⚠️  Collection or index not found - skipping duplicate check`);
      console.log(`   Tip: Run the database initialization script to create the required tables/indexes`);
      return { exists: false, chunkCount: 0 };
    }
    console.error(`❌ Error checking document existence:`, error);
    return { exists: false, chunkCount: 0 };
  }
}

/**
 * Delete all chunks for a document
 */
export async function deleteDocument(
  documentId: string,
  collectionName: string = config.vectorDbCollectionName
): Promise<number> {
  try {
    const deletedCount = await vectorDb.deleteByDocumentId(collectionName, documentId);
    return deletedCount;
  } catch (error) {
    console.error(`❌ Error deleting document:`, error);
    throw error;
  }
}

/**
 * Upload document chunks to vector database
 */
export async function uploadDocumentChunks(
  filename: string,
  fileType: string,
  chunks: DocumentChunkToUpload[],
  collectionName: string = config.vectorDbCollectionName,
  batchSize: number = 100
): Promise<{ success: boolean; uploadedCount: number }> {
  try {
    const documentId = generateDocumentId(filename);
    const uploadedAt = new Date().toISOString();

    console.log(`🔄 Generating embeddings for ${chunks.length} chunks...`);
    const startTime = Date.now();

    // Generate embeddings for all chunks
    const contents = chunks.map((c) => c.content);
    const embeddings = await generateDocumentEmbeddings(contents);

    const embeddingTime = Date.now() - startTime;
    console.log(`✅ Embeddings generated in ${embeddingTime}ms`);

    // Prepare points for upload
    const points = chunks.map((chunk, index) => ({
      id: crypto.randomUUID(),
      vector: config.vectorDbProvider === 'qdrant'
        ? { dense: embeddings[index] }
        : embeddings[index],
      payload: {
        content: chunk.content,
        metadata: {
          ...chunk.metadata,
          document_id: documentId,
          chunk_index: index,
          total_chunks: chunks.length,
          uploaded_at: uploadedAt,
          filename,
          file_type: fileType,
        },
      },
    }));

    console.log(`🔄 Uploading ${points.length} points to ${config.vectorDbProvider} in batches of ${batchSize}...`);
    const uploadStartTime = Date.now();

    // Upload in batches
    for (let i = 0; i < points.length; i += batchSize) {
      const batch = points.slice(i, i + batchSize);
      await vectorDb.upsertPoints(collectionName, batch);

      console.log(`  ✅ Uploaded batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(points.length / batchSize)} (${batch.length} points)`);
    }

    const uploadTime = Date.now() - uploadStartTime;
    console.log(`✅ All chunks uploaded in ${uploadTime}ms`);

    return {
      success: true,
      uploadedCount: points.length,
    };
  } catch (error) {
    console.error(`❌ Error uploading document chunks:`, error);
    return {
      success: false,
      uploadedCount: 0,
    };
  }
}

/**
 * Update document (delete old + upload new)
 */
export async function updateDocument(
  filename: string,
  fileType: string,
  chunks: DocumentChunkToUpload[],
  collectionName: string = config.vectorDbCollectionName
): Promise<{ success: boolean; deleted: number; uploaded: number }> {
  const documentId = generateDocumentId(filename);

  console.log(`🔄 Checking for existing document: ${documentId}`);
  const { exists, chunkCount } = await documentExists(documentId, collectionName);

  let deletedCount = 0;
  if (exists) {
    console.log(`⚠️  Document already exists with ${chunkCount} chunks`);
    console.log(`🔄 Deleting old chunks...`);
    deletedCount = await deleteDocument(documentId, collectionName);
    console.log(`✅ Deleted ${deletedCount} old chunks`);
  }

  console.log(`🔄 Uploading new version...`);
  const { success, uploadedCount } = await uploadDocumentChunks(
    filename,
    fileType,
    chunks,
    collectionName
  );

  if (success) {
    if (deletedCount > 0) {
      console.log(`✅ Updated document: ${filename} (removed ${deletedCount} chunks, added ${uploadedCount} chunks)`);
    } else {
      console.log(`✅ Uploaded new document: ${filename} (${uploadedCount} chunks)`);
    }
  }

  return {
    success,
    deleted: deletedCount,
    uploaded: uploadedCount,
  };
}
