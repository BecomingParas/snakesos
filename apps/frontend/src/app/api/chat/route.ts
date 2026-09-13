import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '@snake-rescue/database';

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

function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const limit = parseInt(process.env.CHAT_RATE_LIMIT_MAX || '50', 10);
  const window = parseInt(process.env.CHAT_RATE_LIMIT_WINDOW_MS || '900000', 10); // 15 minutes

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
  return { allowed: true, remaining: limit - record.count, resetTime: record.resetTime };
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
    const results = await prisma.$queryRawUnsafe<Array<{
      content: string;
      document_title: string;
      rank: number;
    }>>(
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
      searchTerms
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
            }
          }
        );
      }
    }

    // ---- Validate environment ----
    const geminiKey = process.env.GEMINI_API_KEY;

    console.log(`[${requestId}] 🔧 Chat API - ENV CHECK:`, {
      hasGeminiKey: !!geminiKey,
      model: process.env.GEMINI_MODEL || 'gemini-1.5-flash (default)',
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
    const body = await request.json();
    const { message, conversationHistory = [] } = body;

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

    console.log(`[${requestId}] 💬 Chat request:`, {
      messageLength: message.length,
      historyLength: conversationHistory.length,
    });

    // ---- Search knowledge base for relevant context ----
    let contextFromKnowledge = '';
    try {
      const knowledge = await searchKnowledgeBase(message);
      if (knowledge.results.length > 0) {
        contextFromKnowledge = '\n\nRelevant safety information from knowledge base:\n' +
          knowledge.results
            .map((r, i) => `${i + 1}. ${r.content}`)
            .join('\n\n');
        
        console.log(`[${requestId}] 📚 Found ${knowledge.results.length} relevant knowledge chunks`);
      }
    } catch (error) {
      console.warn(`[${requestId}] ⚠️ Knowledge search failed:`, error);
      // Continue without knowledge base context
    }

    // ---- Initialize Gemini ----
    const genAI = new GoogleGenerativeAI(geminiKey);
    const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: `You are SnakeSOS AI, an intelligent assistant for the SnakeSOS snake rescue and safety platform in Nepal.

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

${contextFromKnowledge ? `\nYou have access to verified knowledge from the SnakeSOS knowledge base. Use this information to provide accurate responses. Always prioritize safety information from the knowledge base over general knowledge.` : ''}

Be helpful, empathetic, and safety-conscious. Keep responses concise and clear.
Lives may depend on your guidance.`,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    // ---- Convert conversation history to Gemini format ----
    const history = conversationHistory
      .slice(-10) // Keep last 10 messages for context
      .map((msg: any) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      }));

    // ---- Start chat with history ----
    const chat = model.startChat({
      history: history,
    });

    // ---- Send message with timeout ----
    const timeout = parseInt(process.env.GEMINI_TIMEOUT_MS || '30000', 10);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    let result;
    try {
      console.log(`[${requestId}] 🔮 Calling Gemini API with RAG context...`);
      
      // Add knowledge context to the message if available
      const enhancedMessage = contextFromKnowledge
        ? `${message}${contextFromKnowledge}`
        : message;
      
      result = await Promise.race([
        chat.sendMessage(enhancedMessage),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Gemini request timeout')), timeout)
        )
      ]);
    } finally {
      clearTimeout(timeoutId);
    }

    const responseText = result.response.text();
    const processingTime = Date.now() - startTime;

    console.log(`[${requestId}] ✅ Chat completed:`, {
      responseLength: responseText.length,
      processing_time_ms: processingTime,
    });

    // ---- Return response ----
    return NextResponse.json({
      success: true,
      data: {
        response: responseText,
        conversationId: requestId, // Use request ID as conversation ID
      },
      meta: {
        model: modelName,
        processing_time_ms: processingTime,
        request_id: requestId,
      },
    });

  } catch (error) {
    const processingTime = Date.now() - startTime;
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

    if (message.includes('429') || message.includes('rate limit') || message.includes('quota')) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'AI_RATE_LIMITED',
            message: 'AI service is temporarily unavailable. Please try again in a few minutes.',
          },
        },
        { status: 429 },
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
