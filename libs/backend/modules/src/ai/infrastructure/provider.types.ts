export type ConfidenceLevel =
  | 'HIGH_CONFIDENCE'
  | 'MEDIUM_CONFIDENCE'
  | 'LOW_CONFIDENCE'
  | 'UNCERTAIN';

export type SafetyLevel = 'LOW_RISK' | 'CAUTION' | 'HIGH_RISK' | 'UNKNOWN';

export interface SnakeIdentificationInput {
  imageUrl: string;
  imagePublicId?: string;
  mimeType?: string;
  fileSizeBytes?: number;
}

export interface SnakeIdentificationCandidate {
  scientificName?: string;
  commonName?: string;
  confidence: number;
  observations: string[];
}

export interface SnakeIdentificationProviderResult {
  candidates: SnakeIdentificationCandidate[];
  isSnakeDetected: boolean;
  imageQuality: {
    score: number;
    sufficient: boolean;
    reasons: string[];
  };
}

export interface SnakeIdentificationProvider {
  identify(
    input: SnakeIdentificationInput,
  ): Promise<SnakeIdentificationProviderResult>;
}
