import axios from 'axios';
import type {
  SnakeIdentificationInput,
  SnakeIdentificationProvider,
  SnakeIdentificationProviderResult,
} from './provider.types';

// ── Response types matching the actual /api/v1/predict endpoint ──────────────

export interface PredictionClass {
  label: string;       // 'venomous', 'non_venomous', or 'uncertain'
  confidence: number;  // 0.0–1.0
}

export interface SpeciesIdentification {
  common_name: string;
  scientific_name: string;
  confidence: number;
  venomous: boolean;
  region: string;
}

export interface PythonSnakeClassifierResponse {
  request_id?: string;
  timestamp?: string;
  model_version: string;
  success: boolean;
  error?: string | null;
  prediction?: PredictionClass | null;
  confident: boolean;
  /** Risk status computed by the model: 'high_risk' | 'low_risk' | 'uncertain' */
  status: 'high_risk' | 'low_risk' | 'uncertain';
  requires_human_verification: boolean;
  safety_message?: string | null;
  top_predictions?: PredictionClass[] | null;
  confidence_threshold?: number;
  processing_time_ms?: number | null;
  species?: SpeciesIdentification | null;
  top_species?: SpeciesIdentification[] | null;
}

// ── Map model status → provider-level safety level ──────────────────────────

function mapStatusToSafetyLevel(status: string): 'HIGH_RISK' | 'LOW_RISK' | 'UNKNOWN' {
  switch (status) {
    case 'high_risk':
      return 'HIGH_RISK';
    case 'low_risk':
      return 'LOW_RISK';
    default:
      return 'UNKNOWN';
  }
}

// ── Provider implementation ─────────────────────────────────────────────────

export class PythonSnakeClassifierProvider implements SnakeIdentificationProvider {
  constructor(private readonly baseUrl: string) {}

  /** The model's risk status, available after the last call to identify(). */
  public lastSafetyLevel: 'HIGH_RISK' | 'LOW_RISK' | 'UNKNOWN' = 'UNKNOWN';
  public lastSafetyMessage: string | null = null;
  public lastModelVersion: string | null = null;

  async identify(
    input: SnakeIdentificationInput,
  ): Promise<SnakeIdentificationProviderResult> {
    const imageUrl = input.imageUrl?.trim();
    if (!imageUrl) {
      throw new Error('Image URL is required');
    }

    try {
      // 1. Download the image from Cloudinary / URL
      const imageResponse = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
        timeout: 15000,
      });

      const buffer = Buffer.from(imageResponse.data);
      const formData = new FormData();
      formData.append('file', new Blob([buffer]), 'snake-image.jpg');

      // 2. Send to the Python classifier at /api/v1/predict
      const httpResponse = await axios.post<PythonSnakeClassifierResponse>(
        `${this.baseUrl.replace(/\/$/, '')}/api/v1/predict`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000,
        },
      );

      const payload = httpResponse.data;

      // DEBUG: Log the raw response from the Python classifier
      console.log('🐍 [DEBUG] Python ML raw response:', JSON.stringify(payload, null, 2));

      // 3. Stash model-computed safety outputs for the resolver to use
      this.lastSafetyLevel = mapStatusToSafetyLevel(payload.status);
      this.lastSafetyMessage = payload.safety_message ?? null;
      this.lastModelVersion = payload.model_version ?? null;

      // 4. Build candidates from species + top_species
      const candidates = this.buildCandidates(payload);

      console.log('🐍 [DEBUG] Built candidates:', JSON.stringify(candidates, null, 2));

      const confidence = Number(payload.prediction?.confidence ?? 0);
      const isSnakeDetected = payload.success && payload.status !== 'uncertain';

      return {
        candidates: candidates.length > 0 ? candidates : [
          {
            commonName: 'Unknown Snake Species',
            scientificName: 'Unknown Snake Species',
            confidence: 0.01,
            observations: ['Python classifier could not determine the species confidently.'],
          },
        ],
        isSnakeDetected,
        imageQuality: {
          score: confidence,
          sufficient: payload.confident,
          reasons: [
            payload.confident
              ? 'Model produced a confident classification.'
              : payload.requires_human_verification
                ? 'Classification confidence is below threshold — human verification required.'
                : 'Model did not produce a confident classification.',
          ],
        },
      };
    } catch (error) {
      console.error('Python ML provider error:', error);
      this.lastSafetyLevel = 'UNKNOWN';
      this.lastSafetyMessage = null;
      this.lastModelVersion = null;
      return {
        candidates: [
          {
            commonName: 'Unknown Snake Species',
            scientificName: 'Unknown Snake Species',
            confidence: 0.01,
            observations: ['ML service unavailable; using fallback handling.'],
          },
        ],
        isSnakeDetected: false,
        imageQuality: {
          score: 0.1,
          sufficient: false,
          reasons: ['Python ML service unavailable.', 'Fallback path engaged.'],
        },
      };
    }
  }

  // ── Helpers ──────────────────────────────────────────────────────────────

  private buildCandidates(payload: PythonSnakeClassifierResponse) {
    const candidates: Array<{
      commonName: string;
      scientificName: string;
      confidence: number;
      observations: string[];
    }> = [];

    // Primary species identification from the model
    if (payload.species) {
      candidates.push({
        commonName: payload.species.common_name,
        scientificName: payload.species.scientific_name,
        confidence: Number(payload.species.confidence ?? 0),
        observations: [
          payload.species.venomous ? 'Venomous species' : 'Non-venomous species',
          `Region: ${payload.species.region}`,
          'Predicted by Python ML snake classifier',
        ],
      });
    }

    // Additional species from top_species (skip the first if it matches primary)
    if (payload.top_species && payload.top_species.length > 0) {
      for (const sp of payload.top_species) {
        const isDuplicate = payload.species &&
          sp.scientific_name === payload.species.scientific_name;
        if (isDuplicate) continue;

        candidates.push({
          commonName: sp.common_name,
          scientificName: sp.scientific_name,
          confidence: Number(sp.confidence ?? 0),
          observations: [
            sp.venomous ? 'Venomous species' : 'Non-venomous species',
            `Region: ${sp.region}`,
            'Alternative match from Python ML classifier',
          ],
        });
      }
    }

    // Fallback: if no species data, use the raw prediction label
    if (candidates.length === 0 && payload.prediction) {
      const label = payload.prediction.label ?? 'unknown';
      candidates.push({
        commonName: label === 'venomous' ? 'Venomous Snake' : label === 'non_venomous' ? 'Non-Venomous Snake' : 'Unknown Snake',
        scientificName: 'Unknown',
        confidence: Number(payload.prediction.confidence ?? 0),
        observations: [
          `Classification: ${label}`,
          'Species-level identification not available',
          'Predicted by Python ML snake classifier',
        ],
      });
    }

    return candidates;
  }
}
