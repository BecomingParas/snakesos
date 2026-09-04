import { NextResponse } from 'next/server';

/**
 * Test endpoint to verify environment variables are loaded
 * GET /api/test-env
 */
export async function GET() {
  return NextResponse.json({
    PYTHON_ML_SERVICE_URL: process.env.PYTHON_ML_SERVICE_URL || 'NOT SET',
    PYTHON_ML_API_KEY: process.env.PYTHON_ML_API_KEY ? '***SET***' : 'NOT SET',
    PYTHON_ML_TIMEOUT: process.env.PYTHON_ML_TIMEOUT || 'NOT SET',
    NODE_ENV: process.env.NODE_ENV,
  });
}
