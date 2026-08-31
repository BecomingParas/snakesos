/**
 * Google Cloud Vision API Provider for Snake Identification
 * 
 * Setup Instructions:
 * 1. Install: npm install @google-cloud/vision
 * 2. Set environment variable: GOOGLE_CLOUD_VISION_CREDENTIALS (path to JSON key file)
 *    OR set GOOGLE_APPLICATION_CREDENTIALS for automatic detection
 * 3. Create custom labels model in Google Cloud Vision or use Web Detection
 * 
 * Reference: https://cloud.google.com/vision/docs/setup
 */

import { ImageAnnotatorClient } from '@google-cloud/vision';
import type {
  SnakeIdentificationInput,
  SnakeIdentificationProvider,
  SnakeIdentificationProviderResult,
} from './provider.types.js';

// Nepali snake species mapping for Google Cloud custom labels
const NEPALI_SNAKE_SPECIES = {
  'Spectacled Cobra': { 
    scientificName: 'Naja naja', 
    venomous: true,
    confidence: 0.95 
  },
  'Common Krait': { 
    scientificName: 'Bungarus caeruleus', 
    venomous: true,
    confidence: 0.95 
  },
  "Russell's Viper": { 
    scientificName: 'Daboia russelii', 
    venomous: true,
    confidence: 0.95 
  },
  'Rat Snake': { 
    scientificName: 'Ptyas mucosus', 
    venomous: false,
    confidence: 0.90 
  },
  'Monocled Cobra': { 
    scientificName: 'Naja kaouthia', 
    venomous: true,
    confidence: 0.93 
  },
  'King Cobra': { 
    scientificName: 'Ophiophagus hannah', 
    venomous: true,
    confidence: 0.95 
  },
  'Banded Krait': { 
    scientificName: 'Bungarus fasciatus', 
    venomous: true,
    confidence: 0.92 
  },
  'Green Pit Viper': { 
    scientificName: 'Trimeresurus albolabris', 
    venomous: true,
    confidence: 0.88 
  },
  'Bamboo Pit Viper': { 
    scientificName: 'Trimeresurus gramineus', 
    venomous: true,
    confidence: 0.87 
  },
  'Elaphe hodgsoni': { 
    scientificName: 'Elaphe hodgsoni', 
    venomous: false,
    confidence: 0.85 
  },
};

export class GoogleCloudVisionSnakeIdentificationProvider
  implements SnakeIdentificationProvider
{
  private client: ImageAnnotatorClient;

  constructor() {
    // Initialize Google Cloud Vision client
    // Credentials are read from GOOGLE_APPLICATION_CREDENTIALS env var
    this.client = new ImageAnnotatorClient();
  }

  async identify(
    input: SnakeIdentificationInput,
  ): Promise<SnakeIdentificationProviderResult> {
    try {
      const imageUrl = input.imageUrl?.trim();

      if (!imageUrl) {
        throw new Error('Image URL is required');
      }

      // Call Google Cloud Vision API with Web Detection
      // This detects objects, text, landmarks, etc.
      const request = {
        image: { source: { imageUri: imageUrl } },
        features: [
          { type: 'LABEL_DETECTION' as const },
          { type: 'WEB_DETECTION' as const },
          { type: 'OBJECT_LOCALIZATION' as const },
        ],
      };

      const [result] = await this.client.annotateImage(request);

      // Extract labels and web detection results
      const labels = result.labelAnnotations || [];
      const webDetection = result.webDetection || {};
      const objects = result.localizedObjectAnnotations || [];

      // Filter for snake-related labels
      const snakeLabels = labels.filter(
        (label) =>
          label.description &&
          (label.description.toLowerCase().includes('snake') ||
            label.description.toLowerCase().includes('reptile') ||
            label.description.toLowerCase().includes('cobra') ||
            label.description.toLowerCase().includes('krait') ||
            label.description.toLowerCase().includes('viper'))
      );

      // Check web detection for snake species pages
      const webEntities = webDetection.webEntities || [];
      const snakeWebEntities = webEntities.filter(
        (entity) =>
          entity.description &&
          (entity.description.toLowerCase().includes('snake') ||
            entity.description.toLowerCase().includes('cobra') ||
            entity.description.toLowerCase().includes('krait') ||
            entity.description.toLowerCase().includes('viper'))
      );

      // Build candidates from detected labels
      const candidates = this.buildCandidatesFromDetection(
        snakeLabels,
        snakeWebEntities,
        objects
      );

      // Determine if image contains snake
      const isSnakeDetected =
        snakeLabels.length > 0 ||
        snakeWebEntities.length > 0 ||
        objects.some((obj) =>
          obj.name?.toLowerCase().includes('snake')
        );

      // Calculate image quality
      const imageQuality = {
        score: this.calculateImageQuality(result),
        sufficient: snakeLabels.length > 0 && candidates.length > 0,
        reasons: this.getQualityReasons(result, isSnakeDetected),
      };

      return {
        candidates:
          candidates.length > 0
            ? candidates
            : this.getDefaultCandidates(),
        isSnakeDetected,
        imageQuality,
      };
    } catch (error) {
      console.error('Google Cloud Vision API error:', error);
      // Fallback to stub provider on error
      return this.getDefaultCandidates().length > 0
        ? {
            candidates: this.getDefaultCandidates(),
            isSnakeDetected: false,
            imageQuality: {
              score: 0.3,
              sufficient: false,
              reasons: [
                'Unable to analyze image with Vision API. API error occurred.',
              ],
            },
          }
        : {
            candidates: [],
            isSnakeDetected: false,
            imageQuality: {
              score: 0,
              sufficient: false,
              reasons: ['Image analysis failed. Please try another image.'],
            },
          };
    }
  }

  private buildCandidatesFromDetection(
    labels: any[],
    webEntities: any[],
    objects: any[]
  ) {
    const candidates = [];

    // Try to match labels to known Nepali species
    for (const label of labels) {
      const description = label.description || '';
      const confidence = (label.score || 0) * 0.95; // Calibrate confidence

      // Direct species match
      for (const [speciesName, info] of Object.entries(
        NEPALI_SNAKE_SPECIES
      )) {
        if (
          description.toLowerCase().includes(speciesName.toLowerCase()) ||
          description.toLowerCase().includes(
            (info as any).scientificName.toLowerCase()
          )
        ) {
          candidates.push({
            commonName: speciesName,
            scientificName: (info as any).scientificName,
            confidence: Math.min(confidence + 0.15, 0.95),
            observations: this.getObservations(speciesName),
          });
          break;
        }
      }

      // Generic snake label (if no direct match)
      if (candidates.length === 0 && description.toLowerCase().includes('snake')) {
        candidates.push({
          commonName: 'Unknown Snake Species',
          scientificName: 'Serpentes (Order)',
          confidence: confidence * 0.7,
          observations: ['Snake detected but specific species unknown'],
        });
      }
    }

    // Use web detection as secondary source
    if (candidates.length === 0) {
      for (const entity of webEntities) {
        const entityName = entity.description || '';
        for (const [speciesName, info] of Object.entries(
          NEPALI_SNAKE_SPECIES
        )) {
          if (
            entityName.toLowerCase().includes(speciesName.toLowerCase())
          ) {
            candidates.push({
              commonName: speciesName,
              scientificName: (info as any).scientificName,
              confidence: 0.65,
              observations: this.getObservations(speciesName),
            });
            break;
          }
        }
      }
    }

    // Sort by confidence and return top 3
    return candidates
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 3);
  }

  private calculateImageQuality(result: any): number {
    let score = 0.5; // Base score

    // Bonus for detecting objects
    if (result.localizedObjectAnnotations && result.localizedObjectAnnotations.length > 0) {
      score += 0.2;
    }

    // Bonus for having labels
    if (result.labelAnnotations && result.labelAnnotations.length > 0) {
      score += 0.15;
    }

    // Bonus for high confidence labels
    const highConfidenceLabels = (result.labelAnnotations || []).filter(
      (l: any) => l.score > 0.8
    );
    if (highConfidenceLabels.length > 0) {
      score += 0.15;
    }

    return Math.min(score, 1.0);
  }

  private getQualityReasons(result: any, isSnakeDetected: boolean): string[] {
    const reasons: string[] = [];

    if (!isSnakeDetected) {
      reasons.push('No snake detected in image.');
    }

    if (!result.labelAnnotations || result.labelAnnotations.length === 0) {
      reasons.push('Limited visual features detected.');
    } else {
      reasons.push('Image contains clear visual features for analysis.');
    }

    if (
      result.localizedObjectAnnotations &&
      result.localizedObjectAnnotations.length > 0
    ) {
      reasons.push('Objects identified in image.');
    }

    return reasons.length > 0
      ? reasons
      : ['Image analysis completed with standard confidence.'];
  }

  private getObservations(speciesName: string): string[] {
    const observations: Record<string, string[]> = {
      'Spectacled Cobra': ['hood shape', 'spectacle marking', 'elongated body'],
      'Common Krait': ['glossy black body', 'light banding', 'nocturnal posture'],
      "Russell's Viper": ['triangular head', 'chain pattern', 'broad body'],
      'Rat Snake': ['slender build', 'large eyes', 'long body'],
      'Monocled Cobra': ['hood shape', 'single mark', 'golden-yellow body'],
      'King Cobra': ['very large body', 'hood expansion', 'dark coloration'],
      'Banded Krait': ['banding pattern', 'glossy black', 'small eyes'],
      'Green Pit Viper': ['green coloration', 'triangular head', 'coiled posture'],
      'Bamboo Pit Viper': ['green coloration', 'slender body', 'triangular head'],
      'Elaphe hodgsoni': ['brown coloration', 'large body', 'long tail'],
    };
    return observations[speciesName] || ['Snake detected in image'];
  }

  private getDefaultCandidates() {
    return [
      {
        commonName: 'Spectacled Cobra',
        scientificName: 'Naja naja',
        confidence: 0.0,
        observations: ['Unable to analyze image'],
      },
    ];
  }
}
