import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { GeminiSnakeIdentificationSchema } from '@/lib/gemini/snake-identification-schema';
import { buildSnakeIdentificationPrompt } from '@/lib/gemini/prompts';

/**
 * Snake identification endpoint - calls Gemini with structured outputs
 * Uses gemini-3.6-flash with proper error handling and rate limiting
 *
 * POST /api/identify-snake
 * Body: FormData with a "file" field containing the image
 */

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Gemini response schema for structured output
 * This ensures Gemini returns properly formatted JSON
 */
const GEMINI_RESPONSE_SCHEMA: any = {
  type: SchemaType.OBJECT,
  properties: {
    is_snake: { type: SchemaType.BOOLEAN },
    image_quality: { 
      type: SchemaType.STRING,
      enum: ['excellent', 'good', 'fair', 'poor']
    },
    identification_status: { 
      type: SchemaType.STRING,
      enum: ['identified', 'probable', 'uncertain', 'not_a_snake', 'insufficient_image']
    },
    common_name: { type: SchemaType.STRING, nullable: true },
    scientific_name: { type: SchemaType.STRING, nullable: true },
    venomous_status: { 
      type: SchemaType.STRING,
      enum: ['venomous', 'non_venomous', 'potentially_venomous', 'unknown']
    },
    confidence: { type: SchemaType.NUMBER },
    visual_evidence: { 
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING }
    },
    alternative_species: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          common_name: { type: SchemaType.STRING },
          scientific_name: { type: SchemaType.STRING, nullable: true },
          confidence: { type: SchemaType.NUMBER }
        },
        required: ['common_name', 'confidence']
      }
    },
    geographic_context: {
      type: SchemaType.OBJECT,
      properties: {
        relevant: { type: SchemaType.BOOLEAN },
        region: { type: SchemaType.STRING, nullable: true },
        notes: { type: SchemaType.STRING, nullable: true }
      }
    },
    safety: {
      type: SchemaType.OBJECT,
      properties: {
        risk_level: { 
          type: SchemaType.STRING,
          enum: ['low', 'moderate', 'high', 'unknown']
        },
        handling_advice: { type: SchemaType.STRING },
        public_safety_message: { type: SchemaType.STRING }
      },
      required: ['risk_level', 'handling_advice', 'public_safety_message']
    },
    medical_warning: { type: SchemaType.STRING, nullable: true },
    reasoning_summary: { type: SchemaType.STRING }
  },
  required: [
    'is_snake',
    'image_quality',
    'identification_status',
    'venomous_status',
    'confidence',
    'visual_evidence',
    'safety',
    'reasoning_summary'
  ]
} as const;


/**
 * Simple in-memory rate limiter
 * Tracks requests per IP address
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const limit = parseInt(process.env.SNAKE_ID_RATE_LIMIT_MAX || '20', 10);
  const window = parseInt(process.env.SNAKE_ID_RATE_LIMIT_WINDOW_MS || '900000', 10); // 15 minutes

  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    // No record or expired - create new
    const resetTime = now + window;
    rateLimitMap.set(ip, { count: 1, resetTime });
    return { allowed: true, remaining: limit - 1, resetTime };
  }

  if (record.count >= limit) {
    // Rate limit exceeded
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }

  // Increment count
  record.count++;
  return { allowed: true, remaining: limit - record.count, resetTime: record.resetTime };
}

/**
 * Get client IP address from request
 */
function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }
  
  return 'unknown';
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
              code: 'AI_RATE_LIMITED',
              message: 'Too many identification requests. Please try again later.',
            },
            meta: {
              request_id: requestId,
              retry_after_seconds: retryAfter,
            },
          },
          { 
            status: 429,
            headers: {
              'Retry-After': retryAfter.toString(),
              'X-RateLimit-Limit': process.env.SNAKE_ID_RATE_LIMIT_MAX || '20',
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString(),
            }
          }
        );
      }
    }

    // ---- Step 1: Validate environment ----
    const geminiKey = process.env.GEMINI_API_KEY;
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const cloudKey = process.env.CLOUDINARY_API_KEY;
    const cloudSecret = process.env.CLOUDINARY_API_SECRET;

    console.log(`[${requestId}] 🔧 ENV CHECK:`, {
      hasGeminiKey: !!geminiKey,
      geminiKeyPrefix: geminiKey ? geminiKey.substring(0, 8) + '...' : 'MISSING',
      model: process.env.GEMINI_MODEL || 'gemini-3.6-flash (default)',
      hasCloudName: !!cloudName,
      hasCloudKey: !!cloudKey,
      hasCloudSecret: !!cloudSecret,
    });

    if (!geminiKey) {
      return NextResponse.json(
        { 
          success: false,
          error: {
            code: 'AI_SERVICE_NOT_CONFIGURED',
            message: 'AI service not configured. Please contact support.',
          },
          meta: { request_id: requestId }
        },
        { status: 503 },
      );
    }

    // ---- Step 2: Parse and validate upload ----
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { 
          success: false,
          error: {
            code: 'INVALID_IMAGE',
            message: 'No image file provided. Please upload an image.',
          },
          meta: { request_id: requestId }
        },
        { status: 400 },
      );
    }

    console.log(`[${requestId}] 📸 Received file:`, { type: file.type, size: file.size });

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { 
          success: false,
          error: {
            code: 'INVALID_IMAGE_TYPE',
            message: `Invalid file type: ${file.type}. Allowed types: JPEG, PNG, WebP`,
          },
          meta: { request_id: requestId }
        },
        { status: 400 },
      );
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { 
          success: false,
          error: {
            code: 'IMAGE_TOO_LARGE',
            message: 'File too large. Maximum size: 10MB',
          },
          meta: { request_id: requestId }
        },
        { status: 413 },
      );
    }

    // ---- Step 3: Convert to base64 for Gemini ----
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString('base64');

    console.log(`[${requestId}] ✅ Image converted to base64, length:`, base64Image.length);

    // ---- Step 4: Upload to Cloudinary (for storage/display) ----
    let imageUrl = '';
    if (cloudName && cloudKey && cloudSecret) {
      try {
        console.log(`[${requestId}] 📤 Uploading to Cloudinary...`);
        const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'snake-identification',
              resource_type: 'image',
              transformation: [
                { width: 1024, height: 1024, crop: 'limit' },
                { quality: 'auto' },
              ],
            },
            (error, result) => {
              if (error) reject(error);
              else if (result) resolve(result);
              else reject(new Error('Upload failed'));
            },
          );
          uploadStream.end(buffer);
        });
        imageUrl = uploadResult.secure_url;
        console.log(`[${requestId}] ✅ Cloudinary upload done:`, imageUrl);
      } catch (cloudErr) {
        console.warn(`[${requestId}] ⚠️ Cloudinary upload failed:`, cloudErr);
        // Continue without Cloudinary — Gemini can still analyze from base64
      }
    }

    // ---- Step 5: Call Gemini with structured output ----
    console.log(`[${requestId}] 🔮 Calling Gemini API...`);
    const genAI = new GoogleGenerativeAI(geminiKey);
    const modelName = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
    
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: GEMINI_RESPONSE_SCHEMA,
        temperature: 0.2, // Lower temperature for more consistent outputs
      },
    });

    const prompt = buildSnakeIdentificationPrompt();

    // Set timeout for Gemini request
    const timeout = parseInt(process.env.GEMINI_TIMEOUT_MS || '30000', 10);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    let result;
    try {
      result = await Promise.race([
        model.generateContent([
          { text: prompt },
          {
            inlineData: {
              mimeType: file.type || 'image/jpeg',
              data: base64Image,
            },
          },
        ]),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Gemini request timeout')), timeout)
        )
      ]);
    } finally {
      clearTimeout(timeoutId);
    }

    const responseText = result.response.text();
    console.log(`[${requestId}] 🔮 Gemini raw response length:`, responseText.length);

    // ---- Step 6: Parse and validate Gemini response ----
    let parsed;
    try {
      parsed = JSON.parse(responseText);
    } catch (parseErr) {
      console.error(`[${requestId}] ❌ Failed to parse Gemini JSON:`, parseErr);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'AI_INVALID_RESPONSE',
            message: 'AI returned invalid response. Please try again.',
          },
          meta: { request_id: requestId }
        },
        { status: 422 },
      );
    }

    // Validate with Zod schema
    const validation = GeminiSnakeIdentificationSchema.safeParse(parsed);
    
    if (!validation.success) {
      console.error(`[${requestId}] ❌ Schema validation failed:`, validation.error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'AI_INVALID_RESPONSE',
            message: 'AI returned incomplete response. Please try again.',
          },
          meta: { request_id: requestId }
        },
        { status: 422 },
      );
    }

    const identification = validation.data;
    const processingTime = Date.now() - startTime;

    console.log(`[${requestId}] ✅ Snake identified:`, {
      is_snake: identification.is_snake,
      common_name: identification.common_name,
      confidence: identification.confidence,
      status: identification.identification_status,
      processing_time_ms: processingTime
    });

    // ---- Step 7: Return result ----
    return NextResponse.json({
      success: true,
      data: {
        imageUrl: imageUrl || null,
        is_snake: identification.is_snake,
        image_quality: identification.image_quality,
        identification_status: identification.identification_status,
        species: identification.common_name ? {
          name: identification.common_name,
          scientificName: identification.scientific_name,
          venomous: identification.venomous_status === 'venomous',
          venomousStatus: identification.venomous_status,
        } : null,
        confidence: identification.confidence,
        visualFeatures: identification.visual_evidence,
        alternativeMatches: (identification.alternative_species || []).map((alt) => ({
          species: {
            name: alt.common_name,
            scientificName: alt.scientific_name,
            venomous: false, // Would need to be in the schema
          },
          confidence: alt.confidence,
        })),
        geographicContext: identification.geographic_context,
        safety: identification.safety,
        medicalWarning: identification.medical_warning,
        reasoning: identification.reasoning_summary,
      },
      meta: {
        model: modelName,
        processing_time_ms: processingTime,
        request_id: requestId,
      },
    });
  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error(`[${requestId}] ❌ Snake identification error:`, error);
    
    const message = error instanceof Error ? error.message : String(error);
    const errorName = error?.constructor?.name || 'Error';

    // Handle specific error types
    if (message.includes('timeout') || message.includes('ETIMEDOUT')) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'AI_PROVIDER_TIMEOUT',
            message: 'AI service took too long to respond. Please try again.',
          },
          meta: {
            request_id: requestId,
            processing_time_ms: processingTime
          }
        },
        { status: 504 },
      );
    }

    if (message.includes('429') || message.includes('rate limit') || message.includes('quota')) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'AI_PROVIDER_RATE_LIMITED',
            message: 'AI service is temporarily unavailable due to high demand. Please try again in a few minutes.',
          },
          meta: {
            request_id: requestId,
            processing_time_ms: processingTime
          }
        },
        { status: 429 },
      );
    }

    if (message.includes('404') || message.includes('not found') || message.includes('model')) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'AI_PROVIDER_ERROR',
            message: 'AI model configuration error. Please contact support.',
          },
          meta: {
            request_id: requestId,
            processing_time_ms: processingTime
          }
        },
        { status: 502 },
      );
    }

    if (message.includes('API key') || message.includes('authentication') || message.includes('unauthorized')) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'AI_PROVIDER_ERROR',
            message: 'AI service authentication failed. Please contact support.',
          },
          meta: {
            request_id: requestId,
            processing_time_ms: processingTime
          }
        },
        { status: 502 },
      );
    }

    // Generic error
    return NextResponse.json(
      { 
        success: false,
        error: {
          code: 'SNAKE_IDENTIFICATION_FAILED',
          message: 'Failed to identify snake. Please try again.',
        },
        meta: {
          request_id: requestId,
          processing_time_ms: processingTime,
          error_type: errorName
        }
      },
      { status: 500 },
    );
  }
}
