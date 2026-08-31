import { prisma } from '@snake-rescue/database';
import type { GraphQLContext } from '@snake-rescue/core';
import {
  classifyConfidence,
  classifySafety,
  resolveSpeciesMatch,
} from '../../application/snake-identification.service.js';
import { GoogleCloudVisionSnakeIdentificationProvider } from '../google-cloud-vision.provider.js';
import { PythonSnakeClassifierProvider } from '../python-ml.provider.js';
import { VisionAiSnakeIdentificationProvider } from '../vision-ai.provider.js';

// Prefer a dedicated Python model service when configured, then vendor AI, then stub fallback.
const getProvider = () => {
  const pythonServiceUrl = process.env.PYTHON_ML_SERVICE_URL || process.env.PYTHON_CLASSIFIER_URL;
  const hasGoogleCredentials =
    process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    process.env.GOOGLE_CLOUD_VISION_CREDENTIALS;

  if (pythonServiceUrl) {
    console.log('🐍 Using Python ML classification service for snake identification');
    return new PythonSnakeClassifierProvider(pythonServiceUrl);
  }

  if (hasGoogleCredentials) {
    console.log('📷 Using Google Cloud Vision API for snake identification');
    return new GoogleCloudVisionSnakeIdentificationProvider();
  }

  console.log('🎲 Using stub provider (configure PYTHON_ML_SERVICE_URL or GOOGLE_APPLICATION_CREDENTIALS for real AI)');
  return new VisionAiSnakeIdentificationProvider();
};

const provider = getProvider();
const isPythonProvider = provider instanceof PythonSnakeClassifierProvider;

export const snakeIdentificationResolvers = {
  Mutation: {
    identifySnake: async (
      _parent: unknown,
      args: { input: { imageUrl: string } },
      context: GraphQLContext,
    ) => {
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

      // When using the Python ML model, trust the model's own safety classification
      // since it already applies confidence thresholds and venomous detection.
      // For other providers, compute safety from the matched species record.
      let safetyLevel: string;
      let providerName: string;
      let modelName: string;

      if (isPythonProvider) {
        const pythonProvider = provider as PythonSnakeClassifierProvider;
        safetyLevel = pythonProvider.lastSafetyLevel;
        providerName = 'LOCAL';
        modelName = pythonProvider.lastModelVersion ?? 'python-snake-classifier';
      } else {
        safetyLevel = classifySafety(matchedSpecies, confidenceLevel);
        providerName = 'LOCAL';
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
