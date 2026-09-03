#!/usr/bin/env node
/**
 * Quick test to verify Neon connection and basic database operations
 */

import { prisma } from './libs/database/src/client.js';

async function test() {
  try {
    console.log('🔍 Testing Neon PostgreSQL connection...\n');

    // Test 1: Raw query
    console.log('Test 1: Raw SQL query...');
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Raw query successful:', result);

    // Test 2: Count tables
    console.log('\nTest 2: Listing tables...');
    const tables = await prisma.$queryRaw`
      SELECT tablename 
      FROM pg_catalog.pg_tables 
      WHERE schemaname = 'public' 
      ORDER BY tablename
      LIMIT 10
    `;
    console.log(`✅ Found ${tables.length} tables:`, tables.map(t => t.tablename).join(', '));

    // Test 3: Count users
    console.log('\nTest 3: Counting users...');
    const userCount = await prisma.user.count();
    console.log(`✅ Users in database: ${userCount}`);

    // Test 4: List all tables to see what exists
    console.log('\nTest 4: All tables in database...');
    const allTables = await prisma.$queryRaw`
      SELECT tablename 
      FROM pg_catalog.pg_tables 
      WHERE schemaname = 'public' 
      ORDER BY tablename
    `;
    console.log('Tables:');
    allTables.forEach((t, i) => console.log(`  ${i + 1}. ${t.tablename}`));

    console.log('\n✅ All tests passed! Neon database is working!');
    console.log('\n📊 Database Summary:');
    console.log(`  - Total tables: ${allTables.length}`);
    console.log(`  - Total users: ${userCount}`);

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.code) {
      console.error(`Error code: ${error.code}`);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

test();
