/**
 * Health Check API Route
 * Tests database connectivity and environment configuration
 */

import { NextResponse } from 'next/server';
import { prisma } from '@snake-rescue/database';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  const checks: Record<string, any> = {
    timestamp: new Date().toISOString(),
    env: {
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_URL: process.env.DATABASE_URL ? 'SET ✓' : 'NOT SET ✗',
      DIRECT_URL: process.env.DIRECT_URL ? 'SET ✓' : 'NOT SET ✗',
      BETTER_AUTH_URL: process.env.BETTER_AUTH_URL ? 'SET ✓' : 'NOT SET ✗',
      NEXT_PUBLIC_GRAPHQL_URL: process.env.NEXT_PUBLIC_GRAPHQL_URL,
    },
    database: {
      connected: false,
      error: null as string | null,
      testQuery: false,
    },
  };

  // Test database connection
  try {
    await prisma.$connect();
    checks.database.connected = true;

    // Test a simple query
    const userCount = await prisma.user.count();
    checks.database.testQuery = true;
    checks.database.userCount = userCount;
    
    console.log('[Health Check] Database connected, user count:', userCount);
  } catch (error) {
    checks.database.connected = false;
    checks.database.error = error instanceof Error ? error.message : String(error);
    console.error('[Health Check] Database error:', error);
  } finally {
    await prisma.$disconnect();
  }

  const status = checks.database.connected ? 200 : 500;
  
  return NextResponse.json(checks, { status });
}
