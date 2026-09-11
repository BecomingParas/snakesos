/**
 * Verify AI RAG Tables
 */

import { prisma } from '../libs/database/src/client';

async function verifyTables() {
  try {
    console.log('🔍 Verifying AI RAG tables...\n');
    
    // Check each table
    const tables = [
      'knowledge_documents',
      'knowledge_chunks',
      'ai_conversations',
      'ai_messages',
      'ai_audit_logs'
    ];
    
    for (const table of tables) {
      const count = await prisma.$queryRawUnsafe<Array<{ count: bigint }>>(
        `SELECT COUNT(*) as count FROM "${table}"`
      );
      console.log(`✅ ${table.padEnd(25)} - ${count[0].count} rows`);
    }
    
    console.log('\n✅ All AI RAG tables verified successfully!');
    await prisma.$disconnect();
  } catch (error: any) {
    console.error('❌ Verification failed:', error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

verifyTables();
