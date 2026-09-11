/**
 * Apply AI RAG Migration
 * Adds knowledge base, conversations, and audit log tables
 */

import { prisma } from '../libs/database/src/client';
import { readFileSync } from 'fs';
import { join } from 'path';

async function runMigration() {
  try {
    console.log('📦 Running AI RAG migration...');
    
    const migrationPath = join(
      __dirname,
      '../libs/database/prisma/migrations/20260911000000_add_ai_knowledge_rag_conversations/migration.sql'
    );
    
    const sql = readFileSync(migrationPath, 'utf-8');
    
    // Execute as single transaction
    await prisma.$executeRawUnsafe(sql);
    
    console.log('✅ Migration completed successfully');
    console.log('\n📊 New tables created:');
    console.log('   • knowledge_documents');
    console.log('   • knowledge_chunks');
    console.log('   • ai_conversations');
    console.log('   • ai_messages');
    console.log('   • ai_audit_logs');
    
    await prisma.$disconnect();
  } catch (error: any) {
    console.error('❌ Migration failed:', error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

runMigration();
