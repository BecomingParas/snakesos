import { prisma } from '@snake-rescue/database';
import type { GraphQLContext } from '@snake-rescue/core';
import {
  classifyConfidence,
  classifySafety,
  resolveSpeciesMatch,
} from '../../application/snake-identification.service';
import { GoogleCloudVisionSnakeIdentificationProvider } from '../google-cloud-vision.provider';
import { PythonSnakeClassifierProvider } from '../python-ml.provider';
import { VisionAiSnakeIdentificationProvider } from '../vision-ai.provider';
import { GeminiSnakeIdentificationProvider } from '../gemini/gemini.provider';
import { isGeminiConfigured } from '../gemini/gemini.config';
import type { SnakeIdentificationProvider } from '../provider.types';
import { checkSnakeIdentificationRateLimit } from './rate-limit.helper';

/**
 * Provider selection logic
 * Priority order (configurable via AI_PROVIDER env var):
 * 1. Explicit AI_PROVIDER setting (PYTHON_ML | GEMINI | GOOGLE_CLOUD_VISION)
 * 2. Python ML if PYTHON_ML_SERVICE_URL is set
 * 3. Gemini if GEMINI_API_KEY is set
 * 4. Google Cloud Vision if credentials exist
 * 5. Stub fallback provider
 */
const getProvider = (): SnakeIdentificationProvider => {
  const explicitProvider = process.env.AI_PROVIDER?.toUpperCase();
  const pythonServiceUrl = process.env.PYTHON_ML_SERVICE_URL || process.env.PYTHON_CLASSIFIER_URL;
  const hasGoogleCredentials =
    process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    process.env.GOOGLE_CLOUD_VISION_CREDENTIALS;

  // Explicit provider selection
  if (explicitProvider === 'GEMINI') {
    if (isGeminiConfigured()) {
      console.log('🔮 Using Google Gemini Vision AI for snake identification (explicit)');
      return new GeminiSnakeIdentificationProvider();
    } else {
      console.warn('⚠️  GEMINI provider requested but not configured. Falling back to next available provider.');
    }
  }

  if (explicitProvider === 'PYTHON_ML') {
    if (pythonServiceUrl) {
      console.log('🐍 Using Python ML classification service for snake identification (explicit)');
      return new PythonSnakeClassifierProvider(pythonServiceUrl);
    } else {
      console.warn('⚠️  PYTHON_ML provider requested but not configured. Falling back to next available provider.');
    }
  }

  if (explicitProvider === 'GOOGLE_CLOUD_VISION') {
    if (hasGoogleCredentials) {
      console.log('📷 Using Google Cloud Vision API for snake identification (explicit)');
      return new GoogleCloudVisionSnakeIdentificationProvider();
    } else {
      console.warn('⚠️  GOOGLE_CLOUD_VISION provider requested but not configured. Falling back to next available provider.');
    }
  }

  // Auto-detection based on available configuration
  if (pythonServiceUrl) {
    console.log('🐍 Using Python ML classification service for snake identification');
    return new PythonSnakeClassifierProvider(pythonServiceUrl);
  }

  if (isGeminiConfigured()) {
    console.log('🔮 Using Google Gemini Vision AI for snake identification');
    return new GeminiSnakeIdentificationProvider();
  }

  if (hasGoogleCredentials) {
    console.log('📷 Using Google Cloud Vision API for snake identification');
    return new GoogleCloudVisionSnakeIdentificationProvider();
  }

  console.log('🎲 Using stub provider (configure PYTHON_ML_SERVICE_URL, GEMINI_API_KEY, or GOOGLE_APPLICATION_CREDENTIALS for real AI)');
  return new VisionAiSnakeIdentificationProvider();
};

const provider = getProvider();
const isPythonProvider = provider instanceof PythonSnakeClassifierProvider;
const isGeminiProvider = provider instanceof GeminiSnakeIdentificationProvider;

export const snakeIdentificationResolvers = {
  Mutation: {
    identifySnake: async (
      _parent: unknown,
      args: { input: { imageUrl: string } },
      context: GraphQLContext,
    ) => {
      // Apply rate limiting first (before any AI processing)
      checkSnakeIdentificationRateLimit(context);

      const user = context.user;
      const imageUrl = args.input.imageUrl?.trim();

      if (!imageUrl) {
        throw new Error('INVALID_IMAGE');
      }

      // Public endpoint - no auth required

      const aiResult = await provider.identify({ imageUrl });
      const topCandidate = aiResult.candidates[0];
      const matchedSpecies = topCandidate
        ? await resolveSpeciesMatch(prisma, topCandidate)
        : null;

      const confidenceValue = Number(topCandidate?.confidence ?? 0);
      const confidenceLevel = classifyConfidence(confidenceValue);

      // Provider-specific safety classification
      // Python ML and Gemini compute their own safety levels with confidence thresholds
      // Other providers compute safety from matched species records
      let safetyLevel: string;
      let providerName: string;
      let modelName: string;

      if (isPythonProvider) {
        const pythonProvider = provider as PythonSnakeClassifierProvider;
        safetyLevel = pythonProvider.lastSafetyLevel;
        providerName = 'PYTHON_ML';
        modelName = pythonProvider.lastModelVersion ?? 'python-snake-classifier';
      } else if (isGeminiProvider) {
        const geminiProvider = provider as GeminiSnakeIdentificationProvider;
        safetyLevel = geminiProvider.lastSafetyLevel;
        providerName = 'GEMINI';
        modelName = geminiProvider.lastModelVersion ?? 'gemini-1.5-flash';
      } else {
        safetyLevel = classifySafety(matchedSpecies, confidenceLevel);
        providerName = 'GOOGLE_CLOUD_VISION';
        modelName = 'vision-ai';
      }

      const identification = await (prisma as any).aIIdentification.create({
        data: {
          imageUrl,
          uploadSource: 'WEB',
          speciesId: matchedSpecies?.id ?? null,
          confidence: confidenceValue,
          provider: providerName,
          model: modelName,
          promptUsed: 'Template snake classification prompt',
          responseTime: 0,
          venomousDetected: matchedSpecies?.venomous ?? null,
          dangerAssessment: safetyLevel,
          colorDetected: [],
          userId: user?.id ?? null,
          alternativeMatches: (aiResult.candidates ?? []).slice(1).map((candidate) => ({
            commonName: candidate.commonName,
            scientificName: candidate.scientificName,
            confidence: Number(candidate.confidence ?? 0),
            observations: [...(candidate.observations ?? [])],
          })),
        },
      });

      const alternativeMatches = (aiResult.candidates ?? []).slice(1).map((candidate) => ({
        species: {
          id: candidate.scientificName ?? candidate.commonName ?? 'unknown',
          name: candidate.commonName ?? 'Unknown',
          scientificName: candidate.scientificName ?? 'Unknown',
          nepaliName: '',
          localNames: [],
          aliases: [],
          venomous: false,
          foundInNepal: true,
          verified: false,
          rescueCount: 0,
          identificationCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          protected: false,
          dangerLevel: null,
          venomType: null,
          firstAidSteps: [],
          distinctiveFeatures: [...(candidate.observations ?? [])],
          regions: [],
          images: [],
          videoUrl: null,
          family: null,
          genus: null,
          species: null,
          behavior: null,
          habitat: null,
          diet: null,
          safetyTips: null,
          emergencyAdvice: null,
          averageLength: null,
          maxLength: null,
          color: null,
          pattern: null,
          identificationGuide: null,
          deletedAt: null,
        } as any,
        confidence: Number(candidate.confidence ?? 0),
        reasoning: (candidate.observations ?? []).join(', ') || 'Visual pattern suggests a possible alternate match.',
      }));

      return {
        id: identification.id,
        imageUrl,
        imageThumbnail: imageUrl,
        uploadSource: 'WEB',
        species: matchedSpecies as any,
        confidence: confidenceValue,
        alternativeMatches,
        provider: providerName,
        model: modelName,
        promptUsed: 'snake-vision-template',
        responseTime: 0,
        venomousDetected: matchedSpecies?.venomous ?? null,
        dangerAssessment: safetyLevel,
        colorDetected: [],
        sizeEstimate: null,
        user: user ?? null,
        userFeedback: null,
        correctSpecies: matchedSpecies as any,
        createdAt: identification.createdAt,
      };
    },
  },
};
