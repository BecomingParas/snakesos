/**
 * Check OTP for User
 * Quick script to check the OTP code for a specific email
 */

import 'dotenv/config';
import { prisma } from '@snake-rescue/database';

async function checkOTP(email: string) {
  console.log(`\n🔍 Checking OTP for: ${email}\n`);

  // Find user
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    console.log('❌ User not found');
    return;
  }

  console.log('✅ User found:');
  console.log(`   ID: ${user.id}`);
  console.log(`   Name: ${user.name}`);
  console.log(`   Email Verified: ${user.emailVerified}`);
  console.log(`   Created: ${user.createdAt}`);

  // Find verification record
  const verification = await prisma.verification.findFirst({
    where: { 
      identifier: email,
      type: 'email',
      expiresAt: { gte: new Date() } // Not expired
    },
    orderBy: { createdAt: 'desc' }
  });

  if (!verification) {
    console.log('\n⚠️  No active verification record found (might be expired)');
    
    // Check for any verification record, even expired
    const anyVerification = await prisma.verification.findFirst({
      where: { 
        identifier: email,
        type: 'email'
      },
      orderBy: { createdAt: 'desc' }
    });
    
    if (anyVerification) {
      console.log('\n📋 Last verification record (EXPIRED):');
      console.log(`   Code: ${anyVerification.code}`);
      console.log(`   Token: ${anyVerification.token}`);
      console.log(`   Expires: ${anyVerification.expiresAt}`);
      console.log(`   Created: ${anyVerification.createdAt}`);
    }
    return;
  }

  console.log('\n✅ Active verification record found:');
  console.log(`   📧 OTP CODE: ${verification.code}`);
  console.log(`   🔐 Token: ${verification.token}`);
  console.log(`   ⏰ Expires: ${verification.expiresAt}`);
  console.log(`   📅 Created: ${verification.createdAt}`);

  // Calculate time remaining
  const now = new Date();
  const expiresAt = new Date(verification.expiresAt);
  const hoursRemaining = Math.floor((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60));
  const minutesRemaining = Math.floor((expiresAt.getTime() - now.getTime()) / (1000 * 60)) % 60;
  
  console.log(`   ⏱️  Time remaining: ${hoursRemaining}h ${minutesRemaining}m`);
  
  console.log('\n✨ Use this code to verify the email!\n');
}

const email = process.argv[2] || 'sitalaxayale@gmail.com';
checkOTP(email)
  .catch(console.error)
  .finally(() => prisma.$disconnect());
