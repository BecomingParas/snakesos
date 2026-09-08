import { NextResponse } from 'next/server';

/**
 * Debug endpoint to check environment variables (REMOVE IN PRODUCTION!)
 */
export async function GET() {
  return NextResponse.json({
    gemini_configured: !!process.env.GEMINI_API_KEY,
    gemini_api_key_exists: !!process.env.GEMINI_API_KEY,
    gemini_model: process.env.GEMINI_MODEL || 'not set',
    ai_provider: process.env.AI_PROVIDER || 'not set',
    python_ml_url: !!process.env.PYTHON_ML_SERVICE_URL,
    cloudinary_configured: !!process.env.CLOUDINARY_API_KEY,
  });
}
