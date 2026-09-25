import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { GeminiSnakeIdentificationSchema } from '@/lib/gemini/snake-identification-schema';
import { buildSnakeIdentificationPrompt } from '@/lib/gemini/prompts';
import { prisma } from '@snake-rescue/database';

/**
 * Snake identification endpoint - calls Gemini with structured outputs
 * Uses gemini-1.5-flash with proper error handling and rate limiting
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
      geminiKeyPrefix: geminiKey ? geminiKey.substring(0, 10) + '...' : 'MISSING',
      geminiKeyLength: geminiKey?.length || 0,
      model: process.env.GEMINI_MODEL || 'gemini-1.5-flash (default)',
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
    
    // Validate API key format
    if (!geminiKey.startsWith('AIza') && !geminiKey.startsWith('AQ.')) {
      console.error(`[${requestId}] ❌ Invalid API key format. Must start with 'AIza' or 'AQ.'`);
      return NextResponse.json(
        { 
          success: false,
          error: {
            code: 'AI_SERVICE_NOT_CONFIGURED',
            message: 'AI API key format is invalid. Please contact support.',
          },
          meta: { request_id: requestId }
        },
        { status: 503 },
      );
    }
    
    const genAI = new GoogleGenerativeAI(geminiKey);
    
    // Force correct model name (gemini-3.6-flash doesn't exist)
    let modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    
    // Fix common mistakes
    if (modelName === 'gemini-3.6-flash' || modelName.includes('3.6')) {
      console.warn(`[${requestId}] ⚠️ Invalid model ${modelName}, using gemini-1.5-flash instead`);
      modelName = 'gemini-1.5-flash';
    }
    
    console.log(`[${requestId}] 📝 Using model: ${modelName}`);
    
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
    } catch (geminiError: any) {
      console.error(`[${requestId}] ❌ Gemini API Error:`, {
        name: geminiError?.name,
        message: geminiError?.message,
        status: geminiError?.status,
        statusText: geminiError?.statusText,
        details: geminiError?.details || geminiError?.error,
      });
      throw geminiError;
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

    // ---- Step 7: Fetch nearest hospital and rescuer (if location provided) ----
    const lat = formData.get('lat');
    const lng = formData.get('lng');
    let nearestHospital = null;
    let nearestRescuer = null;

    if (lat && lng) {
      const latitude = parseFloat(lat.toString());
      const longitude = parseFloat(lng.toString());

      if (!isNaN(latitude) && !isNaN(longitude)) {
        console.log(`[${requestId}] 📍 Location provided:`, { latitude, longitude });
        
        try {
          // Find nearest hospital - query all active hospitals first
          console.log(`[${requestId}] 🏥 Querying hospitals...`);
          const hospitals = await prisma.hospital.findMany({
            where: {
              status: 'ACTIVE',
              // Optional filter - only if snakebite treatment is tracked
              ...(await prisma.hospital.findFirst({ 
                where: { snakebiteTreatmentAvailable: true } 
              }) ? { snakebiteTreatmentAvailable: true } : {}),
            },
            select: {
              id: true,
              name: true,
              address: true,
              municipality: true,
              district: true,
              phone: true,
              emergencyPhone: true,
              latitude: true,
              longitude: true,
              antivenomStatus: true,
              snakebiteTreatmentAvailable: true,
              emergency24x7: true,
            },
            take: 50, // Limit to avoid memory issues
          });

          console.log(`[${requestId}] 🏥 Found ${hospitals.length} hospitals`);

          if (hospitals.length > 0) {
            const hospitalsWithDistance = hospitals.map((hospital) => ({
              ...hospital,
              distance: calculateDistance(latitude, longitude, hospital.latitude, hospital.longitude),
            }));

            // Sort by distance, prioritize those with antivenom
            const sorted = hospitalsWithDistance.sort((a, b) => {
              // Prioritize available antivenom
              if (a.antivenomStatus === 'AVAILABLE' && b.antivenomStatus !== 'AVAILABLE') return -1;
              if (b.antivenomStatus === 'AVAILABLE' && a.antivenomStatus !== 'AVAILABLE') return 1;
              return a.distance - b.distance;
            });

            const nearest = sorted[0];
            nearestHospital = {
              name: nearest.name,
              address: `${nearest.address}, ${nearest.municipality || nearest.district}`,
              phone: nearest.phone || undefined,
              emergencyPhone: nearest.emergencyPhone || undefined,
              distance: nearest.distance,
              antivenomStatus: nearest.antivenomStatus,
              snakebiteTreatmentAvailable: nearest.snakebiteTreatmentAvailable,
            };
            console.log(`[${requestId}] ✓ Nearest hospital: ${nearest.name} (${nearest.distance.toFixed(1)} km)`);
          }

          // Find nearest rescuer
          console.log(`[${requestId}] 🦸 Querying rescuers...`);
          const rescuers = await prisma.volunteer.findMany({
            where: {
              status: { in: ['VERIFIED', 'APPROVED'] },
              // Get all rescuers, not just currently available
            },
            select: {
              id: true,
              name: true,
              contact: true,
              experience: true,
              currentLat: true,
              currentLng: true,
              rating: true,
              totalRescues: true,
              municipality: true,
              isAvailableNow: true,
            },
            take: 50,
          });

          console.log(`[${requestId}] 🦸 Found ${rescuers.length} rescuers`);

          // Use rescuer's base location (municipality) if current location not available
          const rescuersWithDistance = rescuers
            .map((rescuer) => {
              // Use current location if available, otherwise skip
              if (!rescuer.currentLat || !rescuer.currentLng) {
                return null;
              }
              return {
                ...rescuer,
                distance: calculateDistance(latitude, longitude, rescuer.currentLat!, rescuer.currentLng!),
              };
            })
            .filter((r): r is NonNullable<typeof r> => r !== null);

          if (rescuersWithDistance.length > 0) {
            // Sort: prioritize available, then by distance
            const sorted = rescuersWithDistance.sort((a, b) => {
              if (a.isAvailableNow && !b.isAvailableNow) return -1;
              if (!a.isAvailableNow && b.isAvailableNow) return 1;
              return a.distance - b.distance;
            });

            const nearest = sorted[0];
            nearestRescuer = {
              name: nearest.name,
              contact: nearest.contact,
              experience: nearest.experience,
              distance: nearest.distance,
              rating: nearest.rating || undefined,
              totalRescues: nearest.totalRescues,
            };
            console.log(`[${requestId}] ✓ Nearest rescuer: ${nearest.name} (${nearest.distance.toFixed(1)} km)`);
          } else {
            console.log(`[${requestId}] ⚠️ No rescuers with location data`);
          }

          console.log(`[${requestId}] 📍 Location services:`, {
            nearestHospital: nearestHospital?.name,
            hospitalDistance: nearestHospital?.distance,
            nearestRescuer: nearestRescuer?.name,
            rescuerDistance: nearestRescuer?.distance,
          });
        } catch (locationError) {
          console.warn(`[${requestId}] ⚠️ Failed to fetch location data:`, locationError);
          // Continue without location data
        }
      }
    }

    // ---- Step 8: Return result ----
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
        nearestHospital,
        nearestRescuer,
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
      console.error(`[${requestId}] ❌ Model error:`, message);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'AI_PROVIDER_ERROR',
            message: 'AI model configuration error. Please contact support.',
            details: process.env.NODE_ENV === 'development' ? message : undefined,
          },
          meta: {
            request_id: requestId,
            processing_time_ms: processingTime,
            model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
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


/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}
