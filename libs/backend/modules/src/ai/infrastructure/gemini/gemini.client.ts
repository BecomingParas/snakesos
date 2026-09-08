/**
 * Google Gemini API Client
 * Handles communication with Gemini vision models for snake identification
 * 
 * IMPORTANT: Install dependencies first:
 * npm install @google/generative-ai
 */

import type {
  GeminiSnakeIdentificationResponse,
  GeminiErrorResponse,
} from './gemini.types';
import type { GeminiConfig } from './gemini.config';

/**
 * Gemini client for snake identification
 * Uses dynamic import to avoid requiring the SDK when not using Gemini
 */
export class GeminiClient {
  private config: GeminiConfig;

  constructor(config: GeminiConfig) {
    this.config = config;
  }

  /**
   * Identify a snake from an image URL
   * 
   * @param imageUrl - Public URL of the snake image
   * @param locationContext - Optional location context (e.g., "Nepal, Lumbini Province")
   * @returns Structured snake identification response
   */
  async identifySnake(
    imageUrl: string,
    locationContext?: string
  ): Promise<GeminiSnakeIdentificationResponse> {
    try {
      // Dynamic import to avoid requiring the SDK when not configured
      const { GoogleGenerativeAI } = await import('@google/generative-ai');

      const genAI = new GoogleGenerativeAI(this.config.apiKey);
      const model = genAI.getGenerativeModel({ 
        model: this.config.model,
        generationConfig: {
          responseMimeType: 'application/json',
        },
      });

      // Download image
      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) {
        throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
      }

      const imageBuffer = await imageResponse.arrayBuffer();
      const base64Image = Buffer.from(imageBuffer).toString('base64');

      // Determine MIME type
      const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';

      // Build the prompt
      const prompt = this.buildIdentificationPrompt(locationContext);

      // Call Gemini with image and prompt
      const result = await model.generateContent([
        {
          inlineData: {
            mimeType: contentType,
            data: base64Image,
          },
        },
        { text: prompt },
      ]);

      const response = result.response;
      const text = response.text();

      // Parse JSON response
      const parsed: GeminiSnakeIdentificationResponse = JSON.parse(text);

      // Validate response structure
      this.validateResponse(parsed);

      return parsed;
    } catch (error) {
      console.error('Gemini API error:', error);

      // Handle specific error types
      if (this.isGeminiError(error)) {
        throw new Error(`Gemini API error: ${error.error.message}`);
      }

      if (error instanceof Error) {
        throw new Error(`Snake identification failed: ${error.message}`);
      }

      throw new Error('Snake identification failed with unknown error');
    }
  }

  /**
   * Build the snake identification prompt
   * This is the core instruction set for Gemini
   */
  private buildIdentificationPrompt(locationContext?: string): string {
    const location = locationContext ? `\n\nGeographic Context: ${locationContext}` : '';

    return `You are a wildlife image analysis assistant specialized in snake identification.

Analyze the provided image carefully.

Your primary task is to determine whether the image contains a snake and, if so, identify the most likely species.

**CRITICAL RULES:**
- Do NOT guess or fabricate information
- Do NOT claim certainty when visual evidence is insufficient
- Do NOT identify as venomous based solely on appearance
- Do NOT invent scientific names
- Do NOT encourage approaching, handling, or capturing snakes

**Visual Analysis Guidelines:**
Use visible morphological characteristics:
- Head shape (triangular, rounded, distinct from body)
- Body shape and proportions
- Scale patterns (keeled vs smooth)
- Coloration and pattern
- Bands, stripes, spots, or blotches
- Dorsal and ventral patterns
- Tail morphology
- Eye characteristics (when visible)
- Hood presence (for cobras)
- Distinctive markings

**Confidence Levels:**
- 0.85-1.0: High confidence - clear visual features match known species
- 0.65-0.84: Probable - good match but some ambiguity
- 0.40-0.64: Uncertain - insufficient features or similar species
- 0.0-0.39: Very uncertain - poor image quality or no clear match

**Image Quality Assessment:**
- excellent: Clear, well-lit, multiple angles, good resolution
- good: Clear enough for identification, adequate lighting
- fair: Some blur or poor lighting but major features visible
- poor: Blurry, dark, obscured, or too distant

**Identification Status:**
- identified: Clear identification with high confidence
- probable: Good match but not definitive
- uncertain: Cannot confidently identify species
- not_a_snake: Image does not contain a snake
- insufficient_image: Image quality too poor for analysis

**Safety Guidelines:**
- If venomous or potentially venomous: HIGH RISK
- If unable to determine venomous status: MODERATE to HIGH RISK (be conservative)
- If confirmed non-venomous with high confidence: LOW RISK
- Always advise maintaining distance
- Always recommend professional snake rescuers
- If bite mentioned: immediate medical attention required

**Geographic Considerations:**${location}
- Use geography as SUPPORTING evidence only
- Do NOT automatically classify as local species
- Consider distribution but prioritize visual evidence

**Response Format:**
Return ONLY valid JSON matching this exact structure:
{
  "is_snake": boolean,
  "image_quality": "excellent" | "good" | "fair" | "poor",
  "identification_status": "identified" | "probable" | "uncertain" | "not_a_snake" | "insufficient_image",
  "common_name": "Common name" or null,
  "scientific_name": "Scientific name" or null,
  "venomous_status": "venomous" | "non_venomous" | "potentially_venomous" | "unknown",
  "confidence": 0.0 to 1.0,
  "visual_evidence": ["observable feature 1", "observable feature 2", ...],
  "alternative_species": [
    {
      "common_name": "Alternative species name",
      "scientific_name": "Scientific name",
      "confidence": 0.0 to 1.0
    }
  ],
  "geographic_context": {
    "relevant": boolean,
    "region": "Geographic region" or null,
    "notes": "Distribution notes" or null
  },
  "safety": {
    "risk_level": "low" | "moderate" | "high" | "unknown",
    "handling_advice": "Specific advice",
    "public_safety_message": "Clear safety instruction"
  },
  "medical_warning": "Medical advice if applicable" or null,
  "reasoning_summary": "Brief explanation of identification reasoning"
}

**Examples of Good Safety Messages:**
- "Do not approach or handle this snake. Maintain a safe distance of at least 2 meters. Contact trained snake rescuers."
- "This appears to be a non-venomous species, but do not attempt to handle it. Contact wildlife professionals."
- "Cannot confirm species. Treat as potentially dangerous. Do not approach. Call snake rescue services."

**If Snakebite Occurred:**
"If a snakebite has occurred, do not wait for identification. Seek emergency medical care immediately. Keep the affected limb immobilized and at heart level."

Now analyze the provided image.`;
  }

  /**
   * Validate the Gemini response structure
   */
  private validateResponse(response: unknown): asserts response is GeminiSnakeIdentificationResponse {
    if (!response || typeof response !== 'object') {
      throw new Error('Invalid response format: expected object');
    }

    const r = response as Partial<GeminiSnakeIdentificationResponse>;

    // Required fields
    if (typeof r.is_snake !== 'boolean') {
      throw new Error('Invalid response: missing is_snake');
    }

    if (!r.image_quality || !['excellent', 'good', 'fair', 'poor'].includes(r.image_quality)) {
      throw new Error('Invalid response: invalid image_quality');
    }

    if (!r.identification_status) {
      throw new Error('Invalid response: missing identification_status');
    }

    if (!r.venomous_status) {
      throw new Error('Invalid response: missing venomous_status');
    }

    if (typeof r.confidence !== 'number' || r.confidence < 0 || r.confidence > 1) {
      throw new Error('Invalid response: invalid confidence value');
    }

    if (!Array.isArray(r.visual_evidence)) {
      throw new Error('Invalid response: visual_evidence must be array');
    }

    if (!r.safety || typeof r.safety !== 'object') {
      throw new Error('Invalid response: missing safety object');
    }

    if (!r.reasoning_summary) {
      throw new Error('Invalid response: missing reasoning_summary');
    }
  }

  /**
   * Type guard for Gemini error responses
   */
  private isGeminiError(error: unknown): error is GeminiErrorResponse {
    return (
      typeof error === 'object' &&
      error !== null &&
      'error' in error &&
      typeof (error as GeminiErrorResponse).error === 'object'
    );
  }
}
