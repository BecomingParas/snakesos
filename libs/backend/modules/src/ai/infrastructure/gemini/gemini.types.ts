/**
 * Google Gemini API Response Types
 * Based on official Gemini API structured output schemas
 */

/**
 * Image quality assessment
 */
export type ImageQuality = 'excellent' | 'good' | 'fair' | 'poor';

/**
 * Identification status
 */
export type IdentificationStatus =
  | 'identified'
  | 'probable'
  | 'uncertain'
  | 'not_a_snake'
  | 'insufficient_image';

/**
 * Venomous status classification
 */
export type VenomousStatus =
  | 'venomous'
  | 'non_venomous'
  | 'potentially_venomous'
  | 'unknown';

/**
 * Risk level for safety messaging
 */
export type RiskLevel = 'low' | 'moderate' | 'high' | 'unknown';

/**
 * Alternative species candidate
 */
export interface AlternativeSpecies {
  common_name: string;
  scientific_name: string;
  confidence: number;
}

/**
 * Geographic context information
 */
export interface GeographicContext {
  relevant: boolean;
  region?: string;
  notes?: string;
}

/**
 * Safety information and handling advice
 */
export interface SafetyInfo {
  risk_level: RiskLevel;
  handling_advice: string;
  public_safety_message: string;
}

/**
 * Complete Gemini snake identification response
 * This is the structured JSON schema we request from Gemini
 */
export interface GeminiSnakeIdentificationResponse {
  // Basic detection
  is_snake: boolean;
  image_quality: ImageQuality;
  identification_status: IdentificationStatus;

  // Primary identification
  common_name?: string;
  scientific_name?: string;
  venomous_status: VenomousStatus;
  confidence: number;

  // Visual evidence
  visual_evidence: string[];

  // Alternative possibilities
  alternative_species?: AlternativeSpecies[];

  // Geographic considerations
  geographic_context?: GeographicContext;

  // Safety information
  safety: SafetyInfo;

  // Medical warning
  medical_warning?: string;

  // AI reasoning
  reasoning_summary: string;
}

/**
 * Error response from Gemini API
 */
export interface GeminiErrorResponse {
  error: {
    code: number;
    message: string;
    status: string;
  };
}

/**
 * Type guard for error responses
 */
export function isGeminiError(
  response: unknown
): response is GeminiErrorResponse {
  return (
    typeof response === 'object' &&
    response !== null &&
    'error' in response &&
    typeof (response as GeminiErrorResponse).error === 'object'
  );
}
