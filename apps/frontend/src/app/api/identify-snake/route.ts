import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

/**
 * Snake identification endpoint that uploads to Cloudinary then uses
 * the configured AI provider (Gemini, Python ML, etc.) via GraphQL.
 *
 * POST /api/identify-snake
 * Body: FormData with a "file" field containing the image
 */

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error('Cloudinary not configured:', {
        cloud_name: !!process.env.CLOUDINARY_CLOUD_NAME,
        api_key: !!process.env.CLOUDINARY_API_KEY,
        api_secret: !!process.env.CLOUDINARY_API_SECRET,
      });
      return NextResponse.json(
        { error: 'Image upload service not configured' },
        { status: 503 },
      );
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 },
      );
    }

    console.log('Received file:', { type: file.type, size: file.size });

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type: ${file.type}. Allowed: ${allowedTypes.join(', ')}` },
        { status: 400 },
      );
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large. Maximum size: ${maxSize / (1024 * 1024)}MB` },
        { status: 400 },
      );
    }

    // Convert blob to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    const uploadResult = await new Promise<{secure_url: string, public_id: string}>((resolve, reject) => {
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
        }
      );
      uploadStream.end(buffer);
    });

    console.log('✅ Image uploaded to Cloudinary:', uploadResult.secure_url);

    // Call GraphQL backend to identify snake using configured AI provider
    const graphqlUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://snakesos.vercel.app'}/api/graphql`;
    
    const graphqlResponse = await fetch(graphqlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Forward auth cookie if present
        'Cookie': request.headers.get('cookie') || '',
      },
      body: JSON.stringify({
        query: `
          mutation IdentifySnake($imageUrl: String!) {
            identifySnake(input: { imageUrl: $imageUrl }) {
              id
              species {
                id
                name
                scientificName
                venomous
                dangerLevel
              }
              confidence
              dangerAssessment
              venomousDetected
              alternativeMatches {
                species {
                  name
                  scientificName
                  venomous
                }
                confidence
              }
              provider
              model
            }
          }
        `,
        variables: {
          imageUrl: uploadResult.secure_url,
        },
      }),
    });

    if (!graphqlResponse.ok) {
      const errorText = await graphqlResponse.text();
      console.error('GraphQL error:', graphqlResponse.status, errorText);
      return NextResponse.json(
        { error: 'AI identification service error', detail: errorText },
        { status: graphqlResponse.status },
      );
    }

    const graphqlResult = await graphqlResponse.json();

    if (graphqlResult.errors) {
      console.error('GraphQL errors:', graphqlResult.errors);
      return NextResponse.json(
        { error: 'AI identification failed', details: graphqlResult.errors },
        { status: 500 },
      );
    }

    const identification = graphqlResult.data?.identifySnake;

    if (!identification) {
      return NextResponse.json(
        { error: 'No identification result returned' },
        { status: 500 },
      );
    }

    // Transform to match expected frontend format
    const response = {
      success: true,
      identification: {
        id: identification.id,
        imageUrl: uploadResult.secure_url,
        species: identification.species,
        confidence: identification.confidence,
        venomous: identification.venomousDetected,
        dangerLevel: identification.dangerAssessment,
        alternativeMatches: identification.alternativeMatches,
        provider: identification.provider,
        model: identification.model,
      },
    };

    console.log('✅ Snake identified using:', identification.provider, identification.model);

    return NextResponse.json(response);

  } catch (error) {
    console.error('Snake identification error:', error);
    console.error('Error type:', error?.constructor?.name);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    console.error('Error stack:', error instanceof Error ? error.stack : 'N/A');
    
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          error: 'Failed to identify snake', 
          message: error.message,
          type: error.constructor.name 
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { error: 'Failed to identify snake' },
      { status: 500 },
    );
  }
}
