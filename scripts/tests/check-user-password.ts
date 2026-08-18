/**
 * Check user password hash in database
 */

import { prisma } from '@snake-rescue/database';
import * as bcrypt from 'bcrypt';

async function checkPassword() {
  const email = 'parasshresthanever@gmail.com';
  const password = 'Password123';

  // Get user from database
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      password: true,
    },
  });

  if (!user) {
    console.log('❌ User not found');
    return;
  }

  console.log('✅ User found:', {
    id: user.id,
    email: user.email,
  });

  console.log('\n📝 Password hash in DB:');
  console.log(user.password);

  if (!user.password) {
    console.log('❌ User has no password hash!');
    return;
  }

  // Test password comparison
  const isValid = await bcrypt.compare(password, user.password);
  
  console.log(`\n🔐 Password "${password}" is ${isValid ? '✅ VALID' : '❌ INVALID'}`);

  // Generate correct hash for comparison
  const correctHash = await bcrypt.hash(password, 10);
  console.log('\n✨ Fresh hash for Password123:');
  console.log(correctHash);

  await prisma.$disconnect();
}

checkPassword().catch(console.error);
