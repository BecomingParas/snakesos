/**
 * Google Gemini API Configuration
 *
 * SECURITY NOTES:
 * - API key MUST be server-side only
 * - Never expose GEMINI_API_KEY to frontend
 * - Rotate key immediately if exposed
 *
 * CURRENT MODEL SUPPORT (as of 2026):
 * - Gemini 3.8: gemini-3.8-flash (RECOMMENDED - latest stable)
 * - Gemini 3.x: gemini-3.7-flash, gemini-3.6-flash, gemini-3.5-flash
 *
 * NO LONGER AVAILABLE:
 * - gemini-2.5-flash (shut down - Google recommends gemini-3.8-flash)
 * - gemini-2.0-* (all variants shut down)
 * - gemini-1.5-* (all variants shut down)
 *
 * @see https://ai.google.dev/gemini-api/docs/models
 */

export interface GeminiConfig {
  apiKey: string;
  apiKeys: string[]; // Multiple API keys for fallback
  model: string;
  timeout: number;
  maxRetries: number;
}

// Use the latest recommended model from Google
// gemini-3.8-flash: Most intelligent Flash model for complex workflows
const DEFAULT_GEMINI_MODEL = 'gemini-3.8-flash';

// Models that are confirmed shut down or no longer available
// Based on official Google Gemini API documentation and production errors
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
  // Gemini 2.5 series - No longer available to new users
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-2.5-pro',
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
      `⚠️ GEMINI_MODEL "${sanitized}" is retired or no longer available. Falling back to "${DEFAULT_GEMINI_MODEL}".`,
    );
    console.warn(
      `   Update GEMINI_MODEL to "gemini-3.8-flash" in your environment variables.`,
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
 * Supports multiple API keys separated by commas for automatic fallback
 * Fails fast if required variables are missing in production
 */
export function loadGeminiConfig(): GeminiConfig {
  const apiKeyEnv = process.env.GEMINI_API_KEY || '';
  const model = normalizeGeminiModel(process.env.GEMINI_MODEL);

  // Parse multiple API keys (comma-separated)
  const apiKeys = apiKeyEnv
    .split(',')
    .map(key => key.trim())
    .filter(key => key && key !== 'your_gemini_api_key_here');

  const apiKey = apiKeys[0] || '';

  // Fail fast if no valid API keys
  if (apiKeys.length === 0) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'GEMINI_API_KEY is not configured. Get your key from https://aistudio.google.com/app/apikey',
      );
    }
    console.warn(
      '⚠️  GEMINI_API_KEY not configured. Gemini provider will not function.',
    );
  } else if (apiKeys.length > 1) {
    console.info(
      `✅ Configured ${apiKeys.length} Gemini API keys for automatic fallback`,
    );
  }

  return {
    apiKey,
    apiKeys,
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
