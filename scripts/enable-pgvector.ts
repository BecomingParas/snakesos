/**
 * Enable pgvector Extension
 * Adds vector similarity search capability to PostgreSQL
 */

import { prisma } from '../libs/database/src/client';
import { readFileSync } from 'fs';
import { join } from 'path';

async function enablePgVector() {
  try {
    console.log('🔧 Enabling pgvector extension...');
    
    // Check if pgvector is already enabled
    const existing = await prisma.$queryRaw<Array<{ extname: string }>>`
      SELECT extname FROM pg_extension WHERE extname = 'vector'
    `;
    
    if (existing.length > 0) {
      console.log('✅ pgvector extension already enabled');
    }
    
    const migrationPath = join(
      __dirname,
      '../libs/database/prisma/migrations/20260911000001_enable_pgvector/migration.sql'
    );
    
    const sql = readFileSync(migrationPath, 'utf-8');
    await prisma.$executeRawUnsafe(sql);
    
    console.log('✅ pgvector extension enabled successfully');
    console.log('✅ Embedding column added to knowledge_chunks');
    console.log('✅ Vector index created for similarity search');
    console.log('\n📊 Configuration:');
    console.log('   • Embedding model: Gemini embedding-001');
    console.log('   • Embedding dimension: 768');
    console.log('   • Index type: IVFFlat (cosine similarity)');
    
    await prisma.$disconnect();
  } catch (error: any) {
    if (error.message && error.message.includes('could not open extension control file')) {
      console.error('\n❌ pgvector extension is not installed on your PostgreSQL server');
      console.error('\n📦 To install pgvector:');
      console.error('   Docker: Use postgres image with pgvector');
      console.error('   Ubuntu: apt-get install postgresql-15-pgvector');
      console.error('   Mac: brew install pgvector');
      console.error('   Cloud: Check if your provider supports pgvector\n');
    } else {
      console.error('❌ Failed to enable pgvector:', error.message);
    }
    await prisma.$disconnect();
    process.exit(1);
  }
}

enablePgVector();
