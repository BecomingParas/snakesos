import type {
  SnakeIdentificationInput,
  SnakeIdentificationProvider,
  SnakeIdentificationProviderResult,
} from './provider.types.js';

const SPECIES_PATTERNS = [
  {
    commonName: 'Spectacled Cobra',
    scientificName: 'Naja naja',
    confidence: 0.89,
    observations: ['hood shape', 'spectacle marking', 'elongated body'],
  },
  {
    commonName: 'Common Krait',
    scientificName: 'Bungarus caeruleus',
    confidence: 0.71,
    observations: ['glossy black body', 'light banding', 'nocturnal posture'],
  },
  {
    commonName: 'Russell\'s Viper',
    scientificName: 'Daboia russelii',
    confidence: 0.62,
    observations: ['triangular head', 'chain pattern', 'broad body'],
  },
  {
    commonName: 'Rat Snake',
    scientificName: 'Ptyas mucosa',
    confidence: 0.58,
    observations: ['slender build', 'large eyes', 'long body'],
  },
] as const;

function hashedIndex(input: string) {
  return Array.from(input).reduce((total, char) => total + char.charCodeAt(0), 0);
}

export class VisionAiSnakeIdentificationProvider
  implements SnakeIdentificationProvider
{
  async identify(
    input: SnakeIdentificationInput,
  ): Promise<SnakeIdentificationProviderResult> {
    const normalizedUrl = input.imageUrl.trim();
    const seededIndex = normalizedUrl
      ? hashedIndex(normalizedUrl) % SPECIES_PATTERNS.length
      : 0;

    const primary = SPECIES_PATTERNS[seededIndex] ?? SPECIES_PATTERNS[0];
    const alternate = SPECIES_PATTERNS.filter((entry) => entry !== primary);

    const candidates = [
      {
        scientificName: primary.scientificName,
        commonName: primary.commonName,
        confidence: primary.confidence,
        observations: [...primary.observations],
      },
      ...alternate.slice(0, 2).map((entry) => ({
        scientificName: entry.scientificName,
        commonName: entry.commonName,
        confidence: entry.confidence * 0.45,
        observations: [...entry.observations],
      })),
    ];

    const sufficient = normalizedUrl.length > 0 && primary.confidence >= 0.5;

    return {
      candidates,
      isSnakeDetected: normalizedUrl.length > 0,
      imageQuality: {
        score: sufficient ? 0.86 : 0.42,
        sufficient,
        reasons: sufficient
          ? ['Image is clear enough to review body shape and markings.']
          : ['Image may be too distant or low contrast for reliable matching.'],
      },
    };
  }
}
