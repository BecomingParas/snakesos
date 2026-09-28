/**
 * Google Gemini API Configuration
 *
 * SECURITY NOTES:
 * - API key MUST be server-side only
 * - Never expose GEMINI_API_KEY to frontend
 * - Rotate key immediately if exposed
 *
 * CURRENT MODEL SUPPORT (as of 2026):
 * - Gemini 3.x series: gemini-3.8-flash, gemini-3.7-flash, gemini-3.6-flash, gemini-3.5-flash
 * - Gemini 2.5 series: gemini-2.5-flash, gemini-2.5-flash-lite, gemini-2.5-pro
 *
 * RETIRED/SHUT DOWN MODELS:
 * - gemini-1.5-* (all variants shut down)
 * - gemini-2.0-* (all variants shut down)
 *
 * @see https://ai.google.dev/gemini-api/docs/models
 */

export interface GeminiConfig {
  apiKey: string;
  model: string;
  timeout: number;
  maxRetries: number;
}

// Default to a stable, currently supported Flash model
// gemini-3.5-flash: Stable model balancing speed and multimodal capabilities
const DEFAULT_GEMINI_MODEL = 'gemini-3.5-flash';

// Models that are confirmed shut down or deprecated
// Based on official Google Gemini API documentation
const RETIRED_GEMINI_MODELS = new Set([
  // Gemini 1.5 series - All shut down
  'gemini-1.5-flash',
  'gemini-1.5-flash-8b',
  'gemini-1.5-flash-002',
  'gemini-1.5-pro',
  // Gemini 2.0 series - All shut down
  'gemini-2.0-flash',
  'gemini-2.0-flash-exp',
  'gemini-2.0-flash-lite',
  // Other historical models
  'gemini-exp-1206',
]);

function normalizeGeminiModel(model?: string): string {
  const sanitized = (model || '').trim();

  if (!sanitized) {
    return DEFAULT_GEMINI_MODEL;
  }

  if (RETIRED_GEMINI_MODELS.has(sanitized)) {
    console.warn(
      `⚠️ GEMINI_MODEL "${sanitized}" is retired or shut down. Falling back to "${DEFAULT_GEMINI_MODEL}".`,
    );
    console.warn(
      `   See https://ai.google.dev/gemini-api/docs/models for current model list.`,
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
