import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Snake identification endpoint - calls Gemini DIRECTLY
 * No GraphQL proxy, no Python ML, no localhost.
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

const SNAKE_IDENTIFICATION_PROMPT = `You are an expert herpetologist. Analyze this image and identify the snake species.

Return your response as a JSON object with this EXACT structure (no markdown, no code fences, just raw JSON):

{
  "is_snake": true,
  "common_name": "Common Krait",
  "scientific_name": "Bungarus caeruleus",
  "confidence": 0.85,
  "venomous": true,
  "danger_level": "HIGH",
  "description": "A highly venomous snake found in South Asia...",
  "visual_features": ["blue-black body", "white crossbands", "rounded head"],
  "safety_advice": "Maintain safe distance. Do not attempt to handle. Call emergency services.",
  "first_aid": "Keep the victim calm and still. Immobilize the bitten limb. Rush to nearest hospital.",
  "alternative_species": [
    {
      "common_name": "Wolf Snake",
      "scientific_name": "Lycodon aulicus",
      "confidence": 0.1,
      "venomous": false
    }
  ]
}

If the image does not contain a snake, return:
{
  "is_snake": false,
  "common_name": null,
  "scientific_name": null,
  "confidence": 0,
  "venomous": false,
  "danger_level": "NONE",
  "description": "No snake detected in the image.",
  "visual_features": [],
  "safety_advice": null,
  "first_aid": null,
  "alternative_species": []
}

CRITICAL: Always err on the side of caution. If uncertain, mark as potentially venomous.
Return ONLY the JSON object, no other text.`;

export async function POST(request: NextRequest) {
  try {
    // ---- Step 1: Validate environment ----
    const geminiKey = process.env.GEMINI_API_KEY;
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const cloudKey = process.env.CLOUDINARY_API_KEY;
    const cloudSecret = process.env.CLOUDINARY_API_SECRET;

    console.log('🔧 ENV CHECK:', {
      hasGeminiKey: !!geminiKey,
      geminiKeyPrefix: geminiKey ? geminiKey.substring(0, 8) + '...' : 'MISSING',
      hasCloudName: !!cloudName,
      hasCloudKey: !!cloudKey,
      hasCloudSecret: !!cloudSecret,
    });

    if (!geminiKey) {
      return NextResponse.json(
        { error: 'AI service not configured. GEMINI_API_KEY is missing.' },
        { status: 503 },
      );
    }

    // ---- Step 2: Parse and validate upload ----
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 },
      );
    }

    console.log('📸 Received file:', { type: file.type, size: file.size });

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type: ${file.type}. Allowed: ${allowedTypes.join(', ')}` },
        { status: 400 },
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum size: 10MB' },
        { status: 400 },
      );
    }

    // ---- Step 3: Convert to base64 for Gemini ----
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString('base64');

    console.log('✅ Image converted to base64, length:', base64Image.length);

    // ---- Step 4: Upload to Cloudinary (for storage/display) ----
    let imageUrl = '';
    if (cloudName && cloudKey && cloudSecret) {
      try {
        console.log('📤 Uploading to Cloudinary...');
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
        console.log('✅ Cloudinary upload done:', imageUrl);
      } catch (cloudErr) {
        console.warn('⚠️ Cloudinary upload failed, continuing without:', cloudErr);
        // Continue without Cloudinary — Gemini can still analyze from base64
      }
    } else {
      console.log('⚠️ Cloudinary not configured, skipping upload');
    }

    // ---- Step 5: Call Gemini directly ----
    console.log('🔮 Calling Gemini API...');
    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
    });

    const result = await model.generateContent([
      { text: SNAKE_IDENTIFICATION_PROMPT },
      {
        inlineData: {
          mimeType: file.type || 'image/jpeg',
          data: base64Image,
        },
      },
    ]);

    const responseText = result.response.text();
    console.log('🔮 Gemini raw response:', responseText.substring(0, 500));

    // ---- Step 6: Parse Gemini response ----
    let parsed;
    try {
      // Strip markdown code fences if present
      let cleanJson = responseText.trim();
      if (cleanJson.startsWith('```json')) {
        cleanJson = cleanJson.slice(7);
      } else if (cleanJson.startsWith('```')) {
        cleanJson = cleanJson.slice(3);
      }
      if (cleanJson.endsWith('```')) {
        cleanJson = cleanJson.slice(0, -3);
      }
      parsed = JSON.parse(cleanJson.trim());
    } catch (parseErr) {
      console.error('❌ Failed to parse Gemini JSON:', parseErr);
      console.error('Raw text was:', responseText);
      return NextResponse.json(
        {
          error: 'AI returned invalid response',
          rawResponse: responseText.substring(0, 200),
        },
        { status: 500 },
      );
    }

    console.log('✅ Snake identified:', parsed.common_name, '| Confidence:', parsed.confidence);

    // ---- Step 7: Return result ----
    return NextResponse.json({
      success: true,
      identification: {
        imageUrl: imageUrl || null,
        is_snake: parsed.is_snake ?? false,
        species: {
          name: parsed.common_name || 'Unknown',
          scientificName: parsed.scientific_name || 'Unknown',
          venomous: parsed.venomous ?? false,
          dangerLevel: parsed.danger_level || 'UNKNOWN',
        },
        confidence: parsed.confidence ?? 0,
        description: parsed.description || '',
        visualFeatures: parsed.visual_features || [],
        safetyAdvice: parsed.safety_advice || null,
        firstAid: parsed.first_aid || null,
        alternativeMatches: (parsed.alternative_species || []).map((alt: any) => ({
          species: {
            name: alt.common_name,
            scientificName: alt.scientific_name,
            venomous: alt.venomous ?? false,
          },
          confidence: alt.confidence ?? 0,
        })),
        provider: 'GEMINI',
        model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
      },
    });
  } catch (error) {
    console.error('❌ Snake identification error:', error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: 'Failed to identify snake', message, type: error?.constructor?.name },
      { status: 500 },
    );
  }
}
