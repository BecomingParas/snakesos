/**
 * Check if pgvector extension is available in PostgreSQL
 */

import { prisma } from '../libs/database/src/client';

async function checkPgVector() {
  try {
    console.log('🔍 Checking pgvector extension...');
    
    const result = await prisma.$queryRaw<Array<{ extname: string }>>`
      SELECT extname FROM pg_extension WHERE extname = 'vector'
    `;
    
    if (result.length > 0) {
      console.log('✅ pgvector extension is INSTALLED');
      return true;
    } else {
      console.log('❌ pgvector extension is NOT INSTALLED');
      console.log('\n📦 To install pgvector:');
      console.log('   1. Connect to your PostgreSQL database');
      console.log('   2. Run: CREATE EXTENSION IF NOT EXISTS vector;');
      console.log('   3. Or run the migration that enables it\n');
      return false;
    }
  } catch (error: any) {
    console.error('❌ Error checking pgvector:', error.message);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

checkPgVector()
  .then((installed) => {
    process.exit(installed ? 0 : 1);
  })
  .catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
