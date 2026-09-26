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

const DEFAULT_GEMINI_MODEL = 'gemini-3.8-flash';
const RETIRED_GEMINI_MODELS = new Set([
  'gemini-1.5-flash',
  'gemini-1.5-flash-8b',
  'gemini-1.5-pro',
  'gemini-2.0-flash',
  'gemini-2.0-flash-exp',
  'gemini-2.5-flash',
  'gemini-3.6-flash',
]);

function normalizeGeminiModel(model?: string): string {
  const sanitized = (model || '').trim();

  if (!sanitized) {
    return DEFAULT_GEMINI_MODEL;
  }

  if (RETIRED_GEMINI_MODELS.has(sanitized)) {
    console.warn(
      `⚠️ GEMINI_MODEL "${sanitized}" is retired or unsupported. Falling back to "${DEFAULT_GEMINI_MODEL}".`,
    );
    return DEFAULT_GEMINI_MODEL;
  }

  return sanitized;
}

/**
 * Load Gemini configuration from environment
 * Fails fast if required variables are missing in production
 */
export function loadGeminiConfig(): GeminiConfig {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = normalizeGeminiModel(process.env.GEMINI_MODEL);

  // Fail fast if API key is missing or placeholder
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'GEMINI_API_KEY is not configured. Get your key from https://aistudio.google.com/app/apikey',
      );
    }
    console.warn(
      '⚠️  GEMINI_API_KEY not configured. Gemini provider will not function.',
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
