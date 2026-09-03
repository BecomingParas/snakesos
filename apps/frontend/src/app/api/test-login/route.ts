import { NextResponse } from 'next/server';
import { prisma } from '@snake-rescue/database';
import bcrypt from 'bcryptjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    // Step 1: Find user by email (what Better Auth does first)
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        accounts: {
          where: { providerId: 'credential' }
        }
      }
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        step: 'user_lookup',
        error: 'User not found'
      }, { status: 404 });
    }

    // Step 2: Find credential account
    const account = user.accounts.find(a => a.providerId === 'credential');
    if (!account) {
      return NextResponse.json({
        success: false,
        step: 'account_lookup',
        error: 'No credential account found',
        user: { id: user.id, email: user.email }
      }, { status: 404 });
    }

    // Step 3: Check password exists
    if (!account.password) {
      return NextResponse.json({
        success: false,
        step: 'password_check',
        error: 'No password hash stored',
        account: { providerId: account.providerId, accountId: account.accountId }
      }, { status: 400 });
    }

    // Step 4: Verify password
    const isValid = await bcrypt.compare(password, account.password);
    
    return NextResponse.json({
      success: isValid,
      step: 'password_verify',
      result: isValid ? 'Password matches!' : 'Password does not match',
      user: { id: user.id, email: user.email, name: user.name },
      account: { 
        providerId: account.providerId, 
        accountId: account.accountId,
        passwordHash: account.password.substring(0, 20) + '...'
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      step: 'error',
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
