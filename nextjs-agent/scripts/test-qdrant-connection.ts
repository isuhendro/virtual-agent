#!/usr/bin/env tsx
/**
 * Test Qdrant Connection
 * Simple diagnostic to verify Qdrant connection works
 */

import dotenv from 'dotenv';
const result = dotenv.config();

console.log('🔍 Testing Qdrant Connection\n');

console.log('Dotenv result:', result.parsed ? 'Loaded' : 'Failed');
console.log('Environment variables BEFORE import:');
console.log(`  QDRANT_URL: ${process.env.QDRANT_URL}`);
console.log(`  QDRANT_API_KEY: ${process.env.QDRANT_API_KEY ? '***' + process.env.QDRANT_API_KEY.slice(-4) : 'NOT SET'}`);
console.log(`  QDRANT_COLLECTION_NAME: ${process.env.QDRANT_COLLECTION_NAME}\n`);

import { config } from '../src/lib/config/env';

console.log('Config values:');
console.log(`  config.qdrantUrl: ${config.qdrantUrl}`);
console.log(`  config.qdrantApiKey: ${config.qdrantApiKey ? '***' + config.qdrantApiKey.slice(-4) : 'NOT SET'}`);
console.log(`  config.qdrantCollectionName: ${config.qdrantCollectionName}\n`);

import { getQdrantClient } from '../src/lib/vector-db/qdrant';

async function testConnection() {
  try {
    console.log('🔄 Attempting to connect to Qdrant...');
    const client = getQdrantClient();

    console.log('🔄 Fetching collections...');
    const collections = await client.getCollections();

    console.log('✅ Successfully connected to Qdrant!');
    console.log(`\n📊 Available collections:`);
    collections.collections.forEach((col) => {
      console.log(`  • ${col.name}`);
    });

  } catch (error: any) {
    console.error('\n❌ Connection failed:', error.message);
    if (error.cause) {
      console.error('Cause:', error.cause);
    }
    console.log('\n💡 Troubleshooting tips:');
    console.log('  1. Check if Qdrant Cloud cluster is active (not paused)');
    console.log('  2. Verify API key is correct');
    console.log('  3. Check if URL format is correct (should NOT include port for HTTPS)');
    console.log('  4. Test connection from browser/Postman to verify network access');
    process.exit(1);
  }
}

testConnection();
