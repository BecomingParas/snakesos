/**
 * Check Verification Records
 * Diagnostic script to inspect verification codes in database
 */

import { prisma } from '@snake-rescue/database';

async function checkVerifications() {
  try {
    const email = 'parasshresthanever@gmail.com';

    console.log(`\n🔍 Checking verification records for: ${email}\n`);

    // Check all verification records for this email
    const verifications = await prisma.verification.findMany({
      where: {
        identifier: {
          in: [email, email.toLowerCase()],
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (verifications.length === 0) {
      console.log('❌ No verification records found for this email');
      console.log('\nPossible causes:');
      console.log('1. User was created without sending verification email');
      console.log('2. Verification code was already used and deleted');
      console.log('3. Verification code expired and was cleaned up');
    } else {
      console.log(`✅ Found ${verifications.length} verification record(s):\n`);

      verifications.forEach((v, index) => {
        const now = new Date();
        const isExpired = v.expiresAt < now;
        const timeLeft = isExpired
          ? 'EXPIRED'
          : `${Math.round((v.expiresAt.getTime() - now.getTime()) / 1000 / 60)} minutes left`;

        console.log(`Record ${index + 1}:`);
        console.log(`  ID: ${v.id}`);
        console.log(`  Identifier: ${v.identifier}`);
        console.log(`  Code: ${v.code || 'N/A'}`);
        console.log(`  Token: ${v.token || 'N/A'}`);
        console.log(`  Type: ${v.type}`);
        console.log(`  Created: ${v.createdAt.toISOString()}`);
        console.log(`  Expires: ${v.expiresAt.toISOString()}`);
        console.log(`  Status: ${isExpired ? '❌ EXPIRED' : '✅ VALID'} (${timeLeft})`);
        console.log('');
      });
    }

    // Check user status
    console.log('\n👤 Checking user status:\n');

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        verifiedAt: true,
        createdAt: true,
      },
    });

    if (!user) {
      console.log('❌ User not found');
    } else {
      console.log(`✅ User found:`);
      console.log(`  ID: ${user.id}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Name: ${user.name}`);
      console.log(`  Email Verified: ${user.emailVerified ? '✅ YES' : '❌ NO'}`);
      console.log(`  Verified At: ${user.verifiedAt?.toISOString() || 'N/A'}`);
      console.log(`  Created At: ${user.createdAt.toISOString()}`);
    }

    // Check for ANY verification codes (debugging)
    console.log('\n🔍 All verification records in database:\n');
    const allVerifications = await prisma.verification.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });

    if (allVerifications.length === 0) {
      console.log('❌ No verification records exist in database at all');
    } else {
      console.log(`Found ${allVerifications.length} recent verification record(s):\n`);
      allVerifications.forEach((v, index) => {
        console.log(`${index + 1}. ${v.identifier} | Code: ${v.code || 'N/A'} | Type: ${v.type} | Expires: ${v.expiresAt.toISOString()}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkVerifications();
