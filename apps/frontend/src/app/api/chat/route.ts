import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Gemini model configuration
 * 
 * IMPORTANT: Keep this in sync with libs/backend/modules/src/ai/infrastructure/gemini/gemini.config.ts
 * 
 * Current supported models (as of 2026):
 * - Gemini 3.8: gemini-3.8-flash (RECOMMENDED - latest, most intelligent Flash model)
 * - Gemini 3.x: gemini-3.7-flash, gemini-3.6-flash, gemini-3.5-flash
 * 
 * No longer available:
 * - gemini-2.5-* (Google says: "no longer available to new users, use gemini-3.8-flash")
 * - gemini-2.0-* (all variants shut down)
 * - gemini-1.5-* (all variants shut down)
 * 
 * @see https://ai.google.dev/gemini-api/docs/models
 */
const DEFAULT_GEMINI_MODEL = 'gemini-3.8-flash';
const FALLBACK_GEMINI_MODEL = 'gemini-3.7-flash'; // Fallback if default fails
const RETIRED_GEMINI_MODELS = new Set([
  'gemini-1.5-flash',
  'gemini-1.5-flash-8b',
  'gemini-1.5-flash-002',
  'gemini-1.5-pro',
  'gemini-2.0-flash',
  'gemini-2.0-flash-exp',
  'gemini-2.0-flash-lite',
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-2.5-pro',
]);

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return String(error);
}

function resolveGeminiModelName(): string {
  const configured = (process.env.GEMINI_MODEL || '').trim();

  if (!configured) {
    console.info(`ℹ️ No GEMINI_MODEL configured, using default: ${DEFAULT_GEMINI_MODEL}`);
    return DEFAULT_GEMINI_MODEL;
  }

  if (RETIRED_GEMINI_MODELS.has(configured)) {
    console.warn(
      `⚠️ GEMINI_MODEL "${configured}" is retired/shut down. Falling back to "${DEFAULT_GEMINI_MODEL}".`
    );
    console.warn(
      `   Update your GEMINI_MODEL environment variable. See https://ai.google.dev/gemini-api/docs/models`
    );
    return DEFAULT_GEMINI_MODEL;
  }

  return configured;
}

function getGeminiModelCandidates(): string[] {
  const configured = resolveGeminiModelName();
  // Try configured model first, then fallback
  return [configured, FALLBACK_GEMINI_MODEL].filter(
    (m, i, arr) => arr.indexOf(m) === i // dedupe
  );
}

function isRetryableGeminiError(error: unknown): boolean {
  const message = getErrorMessage(error);
  return (
    message.includes('404') ||
    message.includes('503') ||
    message.includes('429') ||
    message.includes('quota') ||
    message.includes('rate limit') ||
    message.includes('high demand') ||
    message.includes('not found') ||
    message.includes('model') ||
    message.includes('timeout') ||
    message.includes('ETIMEDOUT')
  );
}

async function getPrisma() {
  const { prisma } = await import('@snake-rescue/database');
  return prisma;
}

/**
 * AI Chat endpoint with RAG (Retrieval-Augmented Generation)
 * Uses Gemini + Knowledge Base for accurate snake safety information
 *
 * POST /api/chat
 * Body: { message: string, conversationHistory?: Array<{role: string, content: string}> }
 */

/**
 * Simple in-memory rate limiter
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
} {
  const now = Date.now();
  const limit = parseInt(process.env.CHAT_RATE_LIMIT_MAX || '50', 10);
  const window = parseInt(
    process.env.CHAT_RATE_LIMIT_WINDOW_MS || '900000',
    10,
  ); // 15 minutes

  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    const resetTime = now + window;
    rateLimitMap.set(ip, { count: 1, resetTime });
    return { allowed: true, remaining: limit - 1, resetTime };
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }

  record.count++;
  return {
    allowed: true,
    remaining: limit - record.count,
    resetTime: record.resetTime,
  };
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');

  if (forwarded) return forwarded.split(',')[0].trim();
  if (realIp) return realIp;
  return 'unknown';
}

/**
 * Search knowledge base for relevant information
 * Uses full-text search on knowledge chunks
 */
async function searchKnowledgeBase(query: string): Promise<{
  results: Array<{
    content: string;
    score: number;
    documentTitle: string;
  }>;
}> {
  const prisma = await getPrisma();

  try {
    // Convert query to tsquery format
    const searchTerms = query
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 2)
      .join(' & ');

    if (!searchTerms) {
      return { results: [] };
    }

    // Search knowledge base (limit to top 3 most relevant chunks)
    const results = await prisma.$queryRawUnsafe<
      Array<{
        content: string;
        document_title: string;
        rank: number;
      }>
    >(
      `
      SELECT 
        c.content,
        d.title as document_title,
        ts_rank(c.search_vector, to_tsquery('english', $1)) as rank
      FROM knowledge_chunks c
      INNER JOIN knowledge_documents d ON c."documentId" = d.id
      WHERE c.search_vector @@ to_tsquery('english', $1)
        AND d."isActive" = true
        AND d.visibility = 'PUBLIC'
      ORDER BY rank DESC
      LIMIT 3
      `,
      searchTerms,
    );

    return {
      results: results.map((r) => ({
        content: r.content,
        score: Math.min(r.rank, 1.0),
        documentTitle: r.document_title,
      })),
    };
  } catch (error) {
    console.error('Knowledge search error:', error);
    return { results: [] };
  }
}

export async function POST(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(7);
  const startTime = Date.now();

  try {
    // ---- Rate Limiting ----
    if (process.env.SKIP_RATE_LIMIT !== 'true') {
      const clientIp = getClientIp(request);
      const rateLimit = checkRateLimit(clientIp);

      if (!rateLimit.allowed) {
        const retryAfter = Math.ceil((rateLimit.resetTime - Date.now()) / 1000);
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'RATE_LIMITED',
              message: 'Too many chat requests. Please try again later.',
            },
          },
          {
            status: 429,
            headers: {
              'Retry-After': retryAfter.toString(),
            },
          },
        );
      }
    }

    // ---- Validate environment ----
    const geminiKey = process.env.GEMINI_API_KEY;

    console.log(`[${requestId}] 🔧 Chat API - ENV CHECK:`, {
      hasGeminiKey: !!geminiKey,
      model: process.env.GEMINI_MODEL || `${DEFAULT_GEMINI_MODEL} (default)`,
    });

    if (!geminiKey) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'AI_SERVICE_NOT_CONFIGURED',
            message: 'AI service not configured. Please contact support.',
          },
        },
        { status: 503 },
      );
    }

    // ---- Parse request body ----
    const contentType = request.headers.get('content-type') || '';
    let message = '';
    let imageData: { mimeType: string; data: string } | null = null;

    // Handle both JSON (text) and FormData (image upload)
    if (contentType.includes('multipart/form-data')) {
      // Image upload
      const formData = await request.formData();
      message = (formData.get('message') as string) || 'What snake is this?';
      const file = formData.get('image');

      if (file && file instanceof Blob) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Image = buffer.toString('base64');

        imageData = {
          mimeType: file.type || 'image/jpeg',
          data: base64Image,
        };

        console.log(`[${requestId}] 📸 Image received:`, {
          type: file.type,
          size: file.size,
        });
      }
    } else {
      // Text message
      const body = await request.json();
      message = body.message;

      if (!message || typeof message !== 'string') {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'INVALID_MESSAGE',
              message: 'Message is required and must be a string.',
            },
          },
          { status: 400 },
        );
      }
    }

    console.log(`[${requestId}] 💬 Chat request:`, {
      messageLength: message.length,
      hasImage: !!imageData,
    });

    // ---- Search knowledge base for relevant context ----
    let contextFromKnowledge = '';
    try {
      const knowledge = await searchKnowledgeBase(message);
      if (knowledge.results.length > 0) {
        contextFromKnowledge =
          '\n\nRelevant safety information from knowledge base:\n' +
          knowledge.results
            .map((r, i) => `${i + 1}. ${r.content}`)
            .join('\n\n');

        console.log(
          `[${requestId}] 📚 Found ${knowledge.results.length} relevant knowledge chunks`,
        );
      }
    } catch (error) {
      console.warn(`[${requestId}] ⚠️ Knowledge search failed:`, error);
      // Continue without knowledge base context
    }

    // ---- Initialize Gemini ----
    // Parse multiple API keys from environment (comma-separated)
    const apiKeyEnv = geminiKey || '';
    const apiKeys = apiKeyEnv
      .split(',')
      .map(key => key.trim())
      .filter(key => key && key !== 'your_gemini_api_key_here');

    if (apiKeys.length === 0) {
      console.error(`[${requestId}] ❌ No valid API keys found`);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'AI_SERVICE_NOT_CONFIGURED',
            message: 'AI service not configured. Please contact support.',
          },
          meta: { request_id: requestId },
        },
        { status: 503 },
      );
    }

    console.log(`[${requestId}] 🔑 Found ${apiKeys.length} API key(s) for fallback`);

    const modelCandidates = getGeminiModelCandidates();
    const systemInstruction = `You are SnakeSOS AI, an intelligent assistant for the SnakeSOS snake rescue and safety platform in Nepal.

Your primary goals:
1. Provide accurate, safety-first information about snakes and snake encounters
2. Help users find rescue assistance when needed
3. Guide users to appropriate medical facilities in emergencies
4. Answer questions about snake species, identification, and safety

CRITICAL SAFETY RULES:
- NEVER encourage users to approach, handle, capture, or kill snakes
- For snakebite situations, ALWAYS prioritize immediate medical attention
- Emphasize keeping distance and calling professional rescuers
- Never claim visual identification is certain without high confidence
- Do not provide medical diagnoses - recommend professional medical evaluation

${
  imageData
    ? `\nWhen analyzing snake images:
- Identify visible physical characteristics (color, pattern, head shape, body structure)
- Assess venomous vs non-venomous likelihood based on features
- Provide safety guidance based on the identified species
- Recommend keeping distance and contacting professional rescuers
- If uncertain, err on the side of caution and treat as potentially venomous`
    : ''
}

${contextFromKnowledge ? `\nYou have access to verified knowledge from the SnakeSOS knowledge base. Use this information to provide accurate responses. Always prioritize safety information from the knowledge base over general knowledge.` : ''}

Be helpful, empathetic, and safety-conscious. Keep responses concise and clear.
Lives may depend on your guidance.`;

    const timeout = parseInt(process.env.GEMINI_TIMEOUT_MS || '30000', 10);
    let result: { response: { text: () => string } } | undefined;
    let lastError: unknown;
    let activeModelName = modelCandidates[0];
    let activeApiKeyIndex = 0;

    // Try each API key with each model
    for (let keyIndex = 0; keyIndex < apiKeys.length; keyIndex++) {
      const currentApiKey = apiKeys[keyIndex];
      
      // Validate API key format
      if (!currentApiKey.startsWith('AIza') && !currentApiKey.startsWith('AQ.')) {
        console.error(
          `[${requestId}] ❌ Invalid API key format for key #${keyIndex + 1}. Skipping...`,
        );
        continue;
      }

      console.log(`[${requestId}] 🔑 Trying API key #${keyIndex + 1}/${apiKeys.length}`);
      const genAI = new GoogleGenerativeAI(currentApiKey);

      for (const modelName of modelCandidates) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
          console.log(`[${requestId}] 🔮 Trying Gemini model: ${modelName} with API key #${keyIndex + 1}...`);
          const model = genAI.getGenerativeModel({
            model: modelName,
            systemInstruction,
            generationConfig: {
              temperature: imageData ? 0.2 : 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            },
          });

          const history = imageData ? [] : [];
          const chat = model.startChat({ history });

          const messageParts: Array<
            { text: string } | { inlineData: { mimeType: string; data: string } }
          > = [];
          const enhancedMessage =
            contextFromKnowledge && !imageData
              ? `${message}${contextFromKnowledge}`
              : message;
          messageParts.push({ text: enhancedMessage });

          if (imageData) {
            messageParts.push({
              inlineData: {
                mimeType: imageData.mimeType,
                data: imageData.data,
              },
            });
          }

          result = (await Promise.race([
            chat.sendMessage(messageParts),
            new Promise((_, reject) =>
              setTimeout(
                () => reject(new Error('Gemini request timeout')),
                timeout,
              ),
            ),
          ])) as { response: { text: () => string } };

          activeModelName = modelName;
          activeApiKeyIndex = keyIndex;
          clearTimeout(timeoutId);
          console.log(
            `[${requestId}] ✅ Success with API key #${keyIndex + 1}, model: ${modelName}`,
          );
          break; // Success - exit model loop
        } catch (error) {
          lastError = error;
          clearTimeout(timeoutId);

          const errorMessage = getErrorMessage(error);
          console.error(
            `[${requestId}] ❌ Gemini model failed for ${modelName} with key #${keyIndex + 1}:`,
            errorMessage,
          );

          // Check if error is API key related (auth failure)
          const isAuthError = 
            errorMessage.includes('API key') ||
            errorMessage.includes('authentication') ||
            errorMessage.includes('unauthorized') ||
            errorMessage.includes('401') ||
            errorMessage.includes('403') ||
            errorMessage.includes('invalid') ||
            errorMessage.includes('PERMISSION_DENIED');

          if (isAuthError) {
            console.warn(
              `[${requestId}] ⚠️ API key #${keyIndex + 1} authentication failed, trying next key...`,
            );
            break; // Try next API key
          }

          if (!isRetryableGeminiError(error)) {
            break;
          }

          console.warn(
            `[${requestId}] ⚠️ ${modelName} failed with key #${keyIndex + 1}; trying next model...`,
          );
        }
      }

      if (result) {
        break; // Success - exit API key loop
      }
    }

    if (!result) {
      console.error(`[${requestId}] ❌ All API keys and models exhausted`);
      throw lastError || new Error('All Gemini API keys and model fallbacks failed');
    }

    const responseText = result.response.text();
    const processingTime = Date.now() - startTime;

    console.log(`[${requestId}] ✅ Chat completed:`, {
      responseLength: responseText.length,
      processing_time_ms: processingTime,
      model: activeModelName,
    });

    // ---- Return response ----
    return NextResponse.json({
      success: true,
      data: {
        response: responseText,
        conversationId: requestId,
      },
      meta: {
        model: activeModelName,
        processing_time_ms: processingTime,
        request_id: requestId,
      },
    });
  } catch (error) {
    console.error(`[${requestId}] ❌ Chat error:`, error);

    const message = error instanceof Error ? error.message : String(error);

    // Handle specific error types
    if (message.includes('timeout') || message.includes('ETIMEDOUT')) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'AI_TIMEOUT',
            message: 'AI took too long to respond. Please try again.',
          },
        },
        { status: 504 },
      );
    }

    if (
      message.includes('429') ||
      message.includes('503') ||
      message.includes('rate limit') ||
      message.includes('quota') ||
      message.includes('high demand')
    ) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'AI_RATE_LIMITED',
            message:
              'AI service is temporarily unavailable. Please try again in a few minutes.',
          },
        },
        { status: 503 },
      );
    }

    // Generic error
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'CHAT_FAILED',
          message: 'Failed to process chat message. Please try again.',
        },
      },
      { status: 500 },
    );
  }
}
