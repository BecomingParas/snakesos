import { UserRole, UserStatus } from '@prisma/client';
import { prisma } from '../src/client.js';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('🌱 Starting database seed...');

  // Create test users
  console.log('👤 Creating users...');
  
  // Hash password properly with bcryptjs
  const hashedPassword = await bcrypt.hash('password123', 10);

  const users = [
    {
      email: 'admin@snakerescue.com',
      name: 'Admin User',
      password: hashedPassword,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      emailVerified: true,
      phone: '+9779851234567',
    },
    {
      email: 'user@snakerescue.com',
      name: 'Test User',
      password: hashedPassword,
      role: UserRole.CITIZEN,
      status: UserStatus.ACTIVE,
      emailVerified: true,
      phone: '+9779851234568',
    },
    {
      email: 'volunteer@snakerescue.com',
      name: 'Volunteer User',
      password: hashedPassword,
      role: UserRole.VOLUNTEER,
      status: UserStatus.ACTIVE,
      emailVerified: true,
      phone: '+9779851234569',
    },
  ];

  for (const userData of users) {
    let user;
    try {
      user = await prisma.user.create({ data: userData });
      console.log(`  ✓ Created user: ${userData.email}`);
    } catch (error: unknown) {
      if ((error as any).code === 'P2002') {
        // User already exists, fetch it
        console.log(`  ⊘ User already exists: ${userData.email}, fetching...`);
        user = await prisma.user.findUnique({ where: { email: userData.email } });
        if (!user) {
          console.log(`  ✗ Failed to fetch user: ${userData.email}`);
          continue;
        }
      } else {
        throw error;
      }
    }

    // Create credential account for Better Auth (if not exists)
    // Better Auth stores passwords in the account table, not user table
    try {
      await prisma.account.create({
        data: {
          userId: user.id,
          providerId: 'credential',
          accountId: userData.email, // Use email as accountId for credential provider
          password: hashedPassword, // Better Auth reads password from account table
        },
      });
      console.log(`  ✓ Created credential account for: ${userData.email}`);
    } catch (error: unknown) {
      if ((error as any).code === 'P2002') {
        console.log(`  ⊘ Credential account already exists for: ${userData.email}`);
      } else {
        throw error;
      }
    }
  }

  console.log('\n✅ Seed completed successfully!');
  console.log('\n📊 Test users:');
  console.log('  • admin@snakerescue.com (password: password123)');
  console.log('  • user@snakerescue.com (password: password123)');
  console.log('  • volunteer@snakerescue.com (password: password123)');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
