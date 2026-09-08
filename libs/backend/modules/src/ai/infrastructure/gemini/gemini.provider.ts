/**
 * Gemini Snake Identification Provider
 * Implements the SnakeIdentificationProvider interface using Google Gemini Vision API
 * 
 * ARCHITECTURE:
 * - Implements standard provider interface for hot-swappable AI backends
 * - Transforms Gemini responses to match common provider format
 * - Stores safety metadata for resolver to access
 * - Conservative confidence and safety handling
 */

import type {
  SnakeIdentificationInput,
  SnakeIdentificationProvider,
  SnakeIdentificationProviderResult,
  SafetyLevel,
} from '../provider.types.js';
import { GeminiClient } from './gemini.client.js';
import { loadGeminiConfig, isGeminiConfigured } from './gemini.config.js';
import type {
  GeminiSnakeIdentificationResponse,
  RiskLevel,
} from './gemini.types.js';

/**
 * Map Gemini risk levels to provider safety levels
 */
function mapRiskToSafety(riskLevel: RiskLevel): SafetyLevel {
  switch (riskLevel) {
    case 'low':
      return 'LOW_RISK';
    case 'moderate':
      return 'CAUTION';
    case 'high':
      return 'HIGH_RISK';
    case 'unknown':
    default:
      return 'UNKNOWN';
  }
}

/**
 * Map Gemini image quality to numeric score
 */
function mapImageQualityToScore(
  quality: 'excellent' | 'good' | 'fair' | 'poor'
): number {
  switch (quality) {
    case 'excellent':
      return 0.95;
    case 'good':
      return 0.8;
    case 'fair':
      return 0.6;
    case 'poor':
      return 0.3;
    default:
      return 0.5;
  }
}

/**
 * Gemini-based snake identification provider
 * Uses Google's Gemini multimodal AI for visual snake classification
 */
export class GeminiSnakeIdentificationProvider
  implements SnakeIdentificationProvider
{
  private client: GeminiClient;

  // Store the latest safety metadata for resolver access
  public lastSafetyLevel: SafetyLevel = 'UNKNOWN';
  public lastSafetyMessage: string | null = null;
  public lastMedicalWarning: string | null = null;
  public lastModelVersion: string | null = null;

  constructor() {
    // Check if Gemini is configured before creating client
    if (!isGeminiConfigured()) {
      throw new Error(
        'Gemini is not configured. Please set GEMINI_API_KEY in environment variables.'
      );
    }

    const config = loadGeminiConfig();
    this.client = new GeminiClient(config);
    this.lastModelVersion = config.model;
  }

  /**
   * Identify a snake from an image
   * 
   * @param input - Image URL and metadata
   * @returns Standardized snake identification result
   */
  async identify(
    input: SnakeIdentificationInput
  ): Promise<SnakeIdentificationProviderResult> {
    const imageUrl = input.imageUrl?.trim();
    if (!imageUrl) {
      throw new Error('Image URL is required');
    }

    try {
      // Call Gemini with optional location context
      // You could extract location from input or pass it separately
      const geminiResponse = await this.client.identifySnake(imageUrl);

      console.log(
        '🔮 [DEBUG] Gemini raw response:',
        JSON.stringify(geminiResponse, null, 2)
      );

      // Store safety metadata for resolver
      this.lastSafetyLevel = mapRiskToSafety(geminiResponse.safety.risk_level);
      this.lastSafetyMessage = geminiResponse.safety.public_safety_message;
      this.lastMedicalWarning = geminiResponse.medical_warning || null;

      // Transform Gemini response to provider format
      const result = this.transformGeminiResponse(geminiResponse);

      console.log(
        '🔮 [DEBUG] Transformed provider result:',
        JSON.stringify(result, null, 2)
      );

      return result;
    } catch (error) {
      console.error('Gemini provider error:', error);

      // Reset safety metadata on error
      this.lastSafetyLevel = 'UNKNOWN';
      this.lastSafetyMessage = null;
      this.lastMedicalWarning = null;

      // Return fallback result
      return {
        candidates: [
          {
            commonName: 'Unknown Snake Species',
            scientificName: 'Unknown Snake Species',
            confidence: 0.01,
            observations: [
              'Gemini AI service error',
              error instanceof Error ? error.message : 'Unknown error',
            ],
          },
        ],
        isSnakeDetected: false,
        imageQuality: {
          score: 0.1,
          sufficient: false,
          reasons: [
            'Gemini service unavailable',
            'Unable to analyze image with AI',
          ],
        },
      };
    }
  }

  /**
   * Transform Gemini response to standard provider format
   */
  private transformGeminiResponse(
    response: GeminiSnakeIdentificationResponse
  ): SnakeIdentificationProviderResult {
    const candidates = this.buildCandidates(response);

    // Determine if snake was detected based on Gemini's analysis
    const isSnakeDetected =
      response.is_snake &&
      response.identification_status !== 'not_a_snake' &&
      response.identification_status !== 'insufficient_image';

    // Image quality assessment
    const qualityScore = mapImageQualityToScore(response.image_quality);
    const isSufficient =
      response.identification_status !== 'insufficient_image' &&
      response.image_quality !== 'poor';

    const qualityReasons: string[] = [];

    // Add quality reasoning
    if (response.image_quality === 'excellent' || response.image_quality === 'good') {
      qualityReasons.push('Image quality is sufficient for analysis');
    } else if (response.image_quality === 'fair') {
      qualityReasons.push('Image quality is adequate but not ideal');
    } else {
      qualityReasons.push('Image quality is insufficient for confident identification');
    }

    // Add identification status context
    switch (response.identification_status) {
      case 'identified':
        qualityReasons.push('Species identified with high confidence');
        break;
      case 'probable':
        qualityReasons.push('Probable species match but not definitive');
        break;
      case 'uncertain':
        qualityReasons.push('Unable to confidently identify species');
        break;
      case 'not_a_snake':
        qualityReasons.push('Image does not appear to contain a snake');
        break;
      case 'insufficient_image':
        qualityReasons.push('Image quality too poor for analysis');
        break;
    }

    return {
      candidates: candidates.length > 0 ? candidates : [
        {
          commonName: 'Unknown Snake Species',
          scientificName: 'Unknown Snake Species',
          confidence: 0.01,
          observations: ['Gemini could not identify the species'],
        },
      ],
      isSnakeDetected,
      imageQuality: {
        score: qualityScore,
        sufficient: isSufficient,
        reasons: qualityReasons,
      },
    };
  }

  /**
   * Build candidate list from Gemini response
   */
  private buildCandidates(
    response: GeminiSnakeIdentificationResponse
  ): Array<{
    commonName: string;
    scientificName: string;
    confidence: number;
    observations: string[];
  }> {
    const candidates: Array<{
      commonName: string;
      scientificName: string;
      confidence: number;
      observations: string[];
    }> = [];

    // Primary identification
    if (
      response.common_name &&
      response.scientific_name &&
      response.identification_status !== 'not_a_snake' &&
      response.identification_status !== 'insufficient_image'
    ) {
      const observations: string[] = [
        ...response.visual_evidence,
        `Venomous status: ${response.venomous_status}`,
      ];

      // Add geographic context if relevant
      if (response.geographic_context?.relevant && response.geographic_context.region) {
        observations.push(`Geographic region: ${response.geographic_context.region}`);
      }

      // Add reasoning summary
      if (response.reasoning_summary) {
        observations.push(`AI reasoning: ${response.reasoning_summary}`);
      }

      candidates.push({
        commonName: response.common_name,
        scientificName: response.scientific_name,
        confidence: response.confidence,
        observations,
      });
    }

    // Alternative species
    if (response.alternative_species && response.alternative_species.length > 0) {
      for (const alt of response.alternative_species.slice(0, 3)) {
        // Limit to top 3 alternatives
        candidates.push({
          commonName: alt.common_name,
          scientificName: alt.scientific_name,
          confidence: alt.confidence,
          observations: [
            'Alternative possible species',
            'Identified by Gemini Vision AI',
          ],
        });
      }
    }

    return candidates;
  }
}
