import { prisma } from '../libs/database/src/client';
import { readFileSync } from 'fs';
import { join } from 'path';

async function run() {
  try {
    console.log('🔍 Adding full-text search...');
    const sql = readFileSync(
      join(__dirname, '../libs/database/prisma/migrations/20260911000002_add_fulltext_search/migration.sql'),
      'utf-8'
    );
    await prisma.$executeRawUnsafe(sql);
    console.log('✅ Full-text search enabled');
    await prisma.$disconnect();
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}
run();
