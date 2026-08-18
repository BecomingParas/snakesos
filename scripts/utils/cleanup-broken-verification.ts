/**
 * Cleanup Broken Verification Records
 * Deletes verification records with null code
 */

import 'dotenv/config';
import { prisma } from '@snake-rescue/database';

async function cleanup() {
  console.log('\n🧹 Cleaning up broken verification records...\n');

  // Find records with null code
  const brokenRecords = await prisma.verification.findMany({
    where: {
      code: null,
      type: 'email'
    }
  });

  console.log(`Found ${brokenRecords.length} broken records (code is null):`);
  brokenRecords.forEach(r => {
    console.log(`  - ${r.identifier} (created: ${r.createdAt})`);
  });

  if (brokenRecords.length === 0) {
    console.log('\n✅ No broken records found!\n');
    return;
  }

  // Delete them
  const result = await prisma.verification.deleteMany({
    where: {
      code: null,
      type: 'email'
    }
  });

  console.log(`\n✅ Deleted ${result.count} broken verification records\n`);
  console.log('Now you can run resendVerification to create proper records with OTP codes!\n');
}

cleanup()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
