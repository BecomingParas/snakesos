import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@snake-rescue/database';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    console.log('[Better Auth Debug] Starting debug for:', email);

    // Step 1: Try to find user the way Better Auth's Prisma adapter does
    // Better Auth looks for user by email in the User table
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    console.log('[Better Auth Debug] User found:', user ? 'YES' : 'NO');
    if (!user) {
      return NextResponse.json({
        success: false,
        step: 'user_lookup',
        error: 'User not found with Better Auth query pattern',
        query: 'prisma.user.findFirst({ where: { email } })',
      });
    }

    // Step 2: Try to find account linked to this user
    // Better Auth looks for credential account by userId
    const account = await prisma.account.findFirst({
      where: {
        userId: user.id,
        providerId: 'credential',
      },
    });

    console.log('[Better Auth Debug] Account found:', account ? 'YES' : 'NO');
    if (!account) {
      return NextResponse.json({
        success: false,
        step: 'account_lookup',
        error: 'Credential account not found for user',
        userId: user.id,
        query: 'prisma.account.findFirst({ where: { userId, providerId: "credential" } })',
      });
    }

    // Step 3: Check if password field exists
    if (!account.password) {
      return NextResponse.json({
        success: false,
        step: 'password_check',
        error: 'Account found but password field is null',
        accountId: account.id,
      });
    }

    // Step 4: Verify password using bcrypt (same as Better Auth config)
    const passwordMatches = await bcrypt.compare(password, account.password);

    console.log('[Better Auth Debug] Password matches:', passwordMatches);

    return NextResponse.json({
      success: true,
      message: 'All checks passed - authentication should work',
      details: {
        userFound: true,
        userId: user.id,
        userEmail: user.email,
        accountFound: true,
        accountId: account.id,
        accountProviderId: account.providerId,
        passwordExists: true,
        passwordMatches: passwordMatches,
      },
    });
  } catch (error) {
    console.error('[Better Auth Debug] Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}
