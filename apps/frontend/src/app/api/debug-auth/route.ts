import { NextResponse } from 'next/server';
import { prisma } from '@snake-rescue/database';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      take: 5,
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
