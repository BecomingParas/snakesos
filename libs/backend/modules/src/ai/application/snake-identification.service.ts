import type { PrismaClient } from '@snake-rescue/database';
import type { ConfidenceLevel, SafetyLevel } from '../infrastructure/provider.types.js';

export function classifyConfidence(confidence: number): ConfidenceLevel {
  if (confidence >= 0.85) return 'HIGH_CONFIDENCE';
  if (confidence >= 0.6) return 'MEDIUM_CONFIDENCE';
  if (confidence >= 0.4) return 'LOW_CONFIDENCE';
  return 'UNCERTAIN';
}

export function detectDangerFromSpecies(
  species: { venomous?: boolean | null } | null,
  confidenceLevel: ConfidenceLevel | string,
): SafetyLevel {
  if (!species || confidenceLevel === 'UNCERTAIN' || confidenceLevel === 'LOW_CONFIDENCE') {
    return 'UNKNOWN';
  }

  if (species.venomous === true) {
    return 'HIGH_RISK';
  }

  if (species.venomous === false) {
    return 'LOW_RISK';
  }

  return 'UNKNOWN';
}

export function classifySafety(
  species: { venomous?: boolean | null } | null,
  confidenceLevel: ConfidenceLevel | string,
): SafetyLevel {
  return detectDangerFromSpecies(species, confidenceLevel);
}

export async function resolveSpeciesMatch(
  prisma: PrismaClient,
  candidate: {
    scientificName?: string;
    commonName?: string;
  },
) {
  const normalizedScientific = candidate.scientificName?.trim();
  const normalizedCommon = candidate.commonName?.trim();

  if (!normalizedScientific && !normalizedCommon) {
    return null;
  }

  // Build OR conditions dynamically — Prisma rejects empty {} in OR arrays.
  const orConditions: Record<string, unknown>[] = [];

  if (normalizedScientific) {
    orConditions.push({ scientificName: normalizedScientific });
    orConditions.push({ scientificName: { contains: normalizedScientific, mode: 'insensitive' } });
  }

  if (normalizedCommon) {
    orConditions.push({ name: { contains: normalizedCommon, mode: 'insensitive' } });
    orConditions.push({ localNames: { hasSome: [normalizedCommon] } });
    orConditions.push({ aliases: { hasSome: [normalizedCommon] } });
  }

  if (orConditions.length === 0) {
    return null;
  }

  const species = await prisma.snakeSpecies.findFirst({
    where: {
      deletedAt: null,
      OR: orConditions,
    },
    orderBy: { createdAt: 'asc' },
  });

  return species;
}

export function buildSafetyMessage(safetyLevel: SafetyLevel) {
  switch (safetyLevel) {
    case 'HIGH_RISK':
      return 'Likely venomous snake detected. Do not approach, touch, corner, or attempt to capture the snake. Keep a safe distance and contact a trained snake rescuer.';
    case 'LOW_RISK':
      return 'This snake is classified as likely non-venomous based on the available image. Do not attempt to handle or capture the snake.';
    case 'CAUTION':
      return 'Snake identification is uncertain. Keep your distance and contact a trained rescuer if the snake is nearby.';
    default:
      return 'Snake identification is uncertain. The image may not provide enough visual information for reliable identification. Keep your distance and contact a trained rescuer if the snake is nearby.';
  }
}
