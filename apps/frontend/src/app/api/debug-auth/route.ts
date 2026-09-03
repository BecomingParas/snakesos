import { NextResponse } from 'next/server';
import { prisma } from '@snake-rescue/database';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Check for admin specifically
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@snakerescue.com' },
      include: {
        accounts: {
          select: {
            providerId: true,
            accountId: true,
            password: true,
          }
        }
      }
    });

    const users = await prisma.user.findMany({
      take: 10,
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        accounts: {
          select: {
            providerId: true,
            accountId: true,
            password: true,
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      adminExists: !!admin,
      admin: admin ? {
        ...admin,
        accounts: admin.accounts.map(a => ({
          ...a,
          password: a.password ? `EXISTS (${a.password.substring(0, 10)}...)` : 'NULL'
        }))
      } : null,
      userCount: users.length,
      users: users.map(u => ({
        ...u,
        accounts: u.accounts.map(a => ({
          ...a,
          password: a.password ? `EXISTS (${a.password.substring(0, 10)}...)` : 'NULL'
        }))
      }))
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code
    }, { status: 500 });
  }
}
