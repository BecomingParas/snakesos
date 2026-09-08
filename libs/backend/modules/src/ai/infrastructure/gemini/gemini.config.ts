/**
 * Google Gemini API Configuration
 * 
 * SECURITY NOTES:
 * - API key MUST be server-side only
 * - Never expose GEMINI_API_KEY to frontend
 * - Rotate key immediately if exposed
 */

export interface GeminiConfig {
  apiKey: string;
  model: string;
  timeout: number;
  maxRetries: number;
}

/**
 * Load Gemini configuration from environment
 * Fails fast if required variables are missing in production
 */
export function loadGeminiConfig(): GeminiConfig {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || 'gemini-3.6-flash';

  // Fail fast if API key is missing or placeholder
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'GEMINI_API_KEY is not configured. Get your key from https://aistudio.google.com/app/apikey'
      );
    }
    console.warn(
      '⚠️  GEMINI_API_KEY not configured. Gemini provider will not function.'
    );
  }

  return {
    apiKey: apiKey || '',
    model,
    timeout: 30000, // 30 seconds
    maxRetries: 2,
  };
}

/**
 * Validate that Gemini is properly configured
 */
export function isGeminiConfigured(): boolean {
  const apiKey = process.env.GEMINI_API_KEY;
  return Boolean(apiKey && apiKey !== 'your_gemini_api_key_here');
}
