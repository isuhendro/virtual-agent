#!/usr/bin/env tsx
/**
 * Create Qdrant Index Script
 * Creates a keyword index on metadata.document_id for document updates/deletes
 */

import dotenv from 'dotenv';
dotenv.config();

import { getQdrantClient } from '../src/lib/vector-db/qdrant';
import { config } from '../src/lib/config/env';

async function createIndex() {
  console.log('╔════════════════════════════════════════════════════╗');
  console.log('║     CREATE QDRANT INDEX FOR DOCUMENT UPDATES      ║');
  console.log('╚════════════════════════════════════════════════════╝\n');

  console.log(`📚 Collection: ${config.qdrantCollectionName}`);
  console.log(`🔑 Field: metadata.document_id`);
  console.log(`📊 Type: keyword\n`);

  try {
    const client = getQdrantClient();

    console.log('🔄 Creating index...');

    await client.createPayloadIndex(config.qdrantCollectionName, {
      field_name: 'metadata.document_id',
      field_schema: 'keyword',
    });

    console.log('✅ Index created successfully!\n');
    console.log('📝 Benefits:');
    console.log('   • Enables checking if documents already exist');
    console.log('   • Allows updating existing documents (replaces old chunks)');
    console.log('   • Supports deleting documents by filename');
    console.log('   • Prevents duplicate uploads\n');
    console.log('🎉 You can now re-upload files to update them automatically!\n');
  } catch (error: any) {
    if (error.message && error.message.includes('already exists')) {
      console.log('✅ Index already exists!\n');
      console.log('📝 The index is already configured. No action needed.\n');
    } else {
      console.error('❌ Failed to create index:', error.message);
      console.log('\n💡 Troubleshooting:');
      console.log('   1. Check that collection exists');
      console.log('   2. Verify Qdrant connection settings in .env');
      console.log('   3. Ensure you have permission to modify the collection\n');
      process.exit(1);
    }
  }
}

createIndex();
