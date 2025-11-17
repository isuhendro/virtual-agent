#!/usr/bin/env tsx
/**
 * PostgreSQL Database Initialization Script
 * Creates the required database, pgvector extension, and tables
 */

import dotenv from 'dotenv';
dotenv.config();

import { Pool } from 'pg';
import { config } from '../src/lib/config/env';

async function initializeDatabase() {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║     POSTGRESQL DATABASE INITIALIZATION                ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  if (!config.databaseUrl) {
    console.error('❌ DATABASE_URL is not configured in .env file');
    console.log('   Please set DATABASE_URL to your PostgreSQL connection string');
    console.log('   Example: postgresql://user:password@localhost:5432/dbname\n');
    process.exit(1);
  }

  console.log(`📚 Database: ${config.databaseUrl.replace(/\/\/.*@/, '//*****@')}`);
  console.log(`📊 Collection/Table: ${config.vectorDbCollectionName}`);
  console.log(`🔢 Vector Dimension: 384 (all-MiniLM-L6-v2)\n`);

  const pool = new Pool({
    connectionString: config.databaseUrl,
  });

  try {
    // Step 1: Check/Create pgvector extension
    console.log('🔄 Step 1: Checking pgvector extension...');
    try {
      const extCheck = await pool.query(`
        SELECT EXISTS (
          SELECT 1 FROM pg_extension WHERE extname = 'vector'
        ) as exists
      `);

      if (!extCheck.rows[0].exists) {
        console.log('⚠️  pgvector extension not found. Attempting to create...');
        await pool.query('CREATE EXTENSION IF NOT EXISTS vector');
        console.log('✅ pgvector extension created\n');
      } else {
        console.log('✅ pgvector extension already exists\n');
      }
    } catch (error: any) {
      if (error.code === '42501') {
        // Permission denied
        console.error('❌ Permission denied to create pgvector extension');
        console.log('\n🔧 SOLUTION: Run as PostgreSQL superuser:');
        console.log('   psql -U postgres -d sensei_dev -f scripts/setup-pgvector-superuser.sql');
        console.log('\n   This will:');
        console.log('   1. Create the pgvector extension');
        console.log('   2. Grant necessary permissions to sensei_user\n');
        throw error;
      } else {
        console.error('❌ Failed to create pgvector extension:', error.message);
        console.log('\n💡 Troubleshooting:');
        console.log('   1. Ensure pgvector is installed on your PostgreSQL server');
        console.log('   2. Install with: brew install pgvector (macOS) or apt-get install postgresql-16-pgvector (Ubuntu)');
        console.log('   3. Or use Docker: docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres pgvector/pgvector:pg16\n');
        throw error;
      }
    }

    // Step 2: Create table with vector column
    console.log('🔄 Step 2: Creating table...');
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS ${config.vectorDbCollectionName} (
        id UUID PRIMARY KEY,
        content TEXT NOT NULL,
        metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
        embedding vector(384) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await pool.query(createTableQuery);
    console.log(`✅ Table "${config.vectorDbCollectionName}" created/verified\n`);

    // Step 3: Create indexes for efficient searching
    console.log('🔄 Step 3: Creating indexes...');

    // Create vector index using HNSW (Hierarchical Navigable Small World)
    // This is the most efficient index for vector similarity search
    try {
      await pool.query(`
        CREATE INDEX IF NOT EXISTS ${config.vectorDbCollectionName}_embedding_idx
        ON ${config.vectorDbCollectionName}
        USING hnsw (embedding vector_cosine_ops);
      `);
      console.log('✅ Vector index (HNSW) created for cosine similarity search');
    } catch (error: any) {
      console.warn('⚠️  HNSW index creation failed, trying IVFFlat...');
      // Fallback to IVFFlat if HNSW is not available
      await pool.query(`
        CREATE INDEX IF NOT EXISTS ${config.vectorDbCollectionName}_embedding_idx
        ON ${config.vectorDbCollectionName}
        USING ivfflat (embedding vector_cosine_ops)
        WITH (lists = 100);
      `);
      console.log('✅ Vector index (IVFFlat) created for cosine similarity search');
    }

    // Create index on metadata.document_id for updates and deletes
    await pool.query(`
      CREATE INDEX IF NOT EXISTS ${config.vectorDbCollectionName}_document_id_idx
      ON ${config.vectorDbCollectionName}
      USING btree ((metadata->>'document_id'));
    `);
    console.log('✅ Document ID index created for efficient updates/deletes\n');

    // Step 4: Verify setup
    console.log('🔄 Step 4: Verifying setup...');
    const countResult = await pool.query(
      `SELECT COUNT(*) as count FROM ${config.vectorDbCollectionName}`
    );
    const count = parseInt(countResult.rows[0].count);
    console.log(`✅ Setup verified. Current document count: ${count}\n`);

    // Step 5: Display table info
    console.log('📋 Table Information:');
    const tableInfoResult = await pool.query(`
      SELECT
        column_name,
        data_type,
        is_nullable
      FROM information_schema.columns
      WHERE table_name = $1
      ORDER BY ordinal_position;
    `, [config.vectorDbCollectionName]);

    tableInfoResult.rows.forEach((row) => {
      console.log(`   • ${row.column_name}: ${row.data_type} ${row.is_nullable === 'NO' ? '(NOT NULL)' : ''}`);
    });

    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║           INITIALIZATION COMPLETED ✅                  ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

    console.log('✨ Your PostgreSQL vector database is ready!');
    console.log('\n📝 Next steps:');
    console.log('   1. Upload documents: npm run upload-docs');
    console.log('   2. Test RAG: npm run test-rag (update package.json script)');
    console.log('   3. Start the app: npm run dev\n');

  } catch (error: any) {
    console.error('\n❌ Database initialization failed:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

initializeDatabase();
