#!/usr/bin/env node
/**
 * Quick test script to upload image to Cloudinary and test snake identification
 * Usage: node upload-and-test.mjs path/to/image.webp
 */

import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadAndIdentify(imagePath) {
  try {
    console.log('📤 Uploading image to Cloudinary...');
    
    // Upload image
    const uploadResult = await cloudinary.uploader.upload(imagePath, {
      folder: 'snake-identification-test',
      resource_type: 'image',
    });

    console.log('✅ Image uploaded:', uploadResult.secure_url);
    console.log('');
    console.log('🔮 Identifying snake with Gemini...');

    // Call GraphQL API
    const response = await fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation IdentifySnake($imageUrl: String!) {
            identifySnake(input: { imageUrl: $imageUrl }) {
              id
              species {
                name
                scientificName
                venomous
                dangerLevel
              }
              confidence
              dangerAssessment
              provider
              model
              alternativeMatches {
                species {
                  name
                  scientificName
                  venomous
                }
                confidence
                reasoning
              }
            }
          }
        `,
        variables: {
          imageUrl: uploadResult.secure_url,
        },
      }),
    });

    const result = await response.json();

    if (result.errors) {
      console.error('❌ GraphQL Errors:', result.errors);
      return;
    }

    const identification = result.data.identifySnake;

    console.log('');
    console.log('🎯 IDENTIFICATION RESULT');
    console.log('========================');
    console.log('Provider:', identification.provider);
    console.log('Model:', identification.model);
    console.log('Confidence:', (identification.confidence * 100).toFixed(1) + '%');
    console.log('');

    if (identification.species) {
      console.log('🐍 SPECIES');
      console.log('Common Name:', identification.species.name);
      console.log('Scientific Name:', identification.species.scientificName);
      console.log('Venomous:', identification.species.venomous ? '⚠️  YES' : '✅ NO');
      console.log('Danger Level:', identification.dangerAssessment);
    } else {
      console.log('❓ No species identified');
      console.log('Danger Assessment:', identification.dangerAssessment);
    }

    if (identification.alternativeMatches && identification.alternativeMatches.length > 0) {
      console.log('');
      console.log('🔄 ALTERNATIVE MATCHES');
      identification.alternativeMatches.forEach((match, i) => {
        console.log(`  ${i + 1}. ${match.species.name} (${match.species.scientificName})`);
        console.log(`     Confidence: ${(match.confidence * 100).toFixed(1)}%`);
        console.log(`     Venomous: ${match.species.venomous ? 'YES' : 'NO'}`);
      });
    }

    console.log('');
    console.log('📸 Image URL:', uploadResult.secure_url);

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
  }
}

// Get image path from command line
const imagePath = process.argv[2];

if (!imagePath) {
  console.error('Usage: node upload-and-test.mjs path/to/image.webp');
  process.exit(1);
}

if (!fs.existsSync(imagePath)) {
  console.error('Error: File not found:', imagePath);
  process.exit(1);
}

uploadAndIdentify(imagePath);
