/**
 * Check All Verifications
 * See all verification records in database
 */

import 'dotenv/config';
import { prisma } from '@snake-rescue/database';

async function checkAll() {
  console.log('\n📋 All Verification Records:\n');

  const verifications = await prisma.verification.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10
  });

  if (verifications.length === 0) {
    console.log('❌ No verification records found in database');
    return;
  }

  verifications.forEach((v, index) => {
    console.log(`${index + 1}. ${v.identifier}`);
    console.log(`   Code: ${v.code}`);
    console.log(`   Type: ${v.type}`);
    console.log(`   Expires: ${v.expiresAt}`);
    console.log(`   Created: ${v.createdAt}`);
    const isExpired = new Date(v.expiresAt) < new Date();
    console.log(`   Status: ${isExpired ? '❌ EXPIRED' : '✅ ACTIVE'}`);
    console.log('');
  });
}

checkAll()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
