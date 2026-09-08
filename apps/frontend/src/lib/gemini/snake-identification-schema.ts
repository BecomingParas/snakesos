/**
 * Zod schema for Gemini snake identification responses
 * Validates structured JSON outputs from Gemini API
 */

import { z } from 'zod';

/**
 * Alternative species candidate schema
 */
export const AlternativeSpeciesSchema = z.object({
  common_name: z.string(),
  scientific_name: z.string().nullable(),
  confidence: z.number().min(0).max(1),
});

/**
 * Geographic context schema
 */
export const GeographicContextSchema = z.object({
  relevant: z.boolean(),
  region: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

/**
 * Safety information schema
 */
export const SafetyInfoSchema = z.object({
  risk_level: z.enum(['low', 'moderate', 'high', 'unknown']),
  handling_advice: z.string(),
  public_safety_message: z.string(),
});

/**
 * Complete Gemini snake identification response schema
 */
export const GeminiSnakeIdentificationSchema = z.object({
  // Basic detection
  is_snake: z.boolean(),
  image_quality: z.enum(['excellent', 'good', 'fair', 'poor']),
  identification_status: z.enum([
    'identified',
    'probable',
    'uncertain',
    'not_a_snake',
    'insufficient_image',
  ]),

  // Primary identification
  common_name: z.string().nullable(),
  scientific_name: z.string().nullable(),
  venomous_status: z.enum([
    'venomous',
    'non_venomous',
    'potentially_venomous',
    'unknown',
  ]),
  confidence: z.number().min(0).max(1),

  // Visual evidence
  visual_evidence: z.array(z.string()),

  // Alternative possibilities
  alternative_species: z.array(AlternativeSpeciesSchema).optional(),

  // Geographic considerations
  geographic_context: GeographicContextSchema.optional(),

  // Safety information
  safety: SafetyInfoSchema,

  // Medical warning
  medical_warning: z.string().nullable().optional(),

  // AI reasoning
  reasoning_summary: z.string(),
});

export type GeminiSnakeIdentification = z.infer<typeof GeminiSnakeIdentificationSchema>;
export type AlternativeSpecies = z.infer<typeof AlternativeSpeciesSchema>;
export type SafetyInfo = z.infer<typeof SafetyInfoSchema>;
