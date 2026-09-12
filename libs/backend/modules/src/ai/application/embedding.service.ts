/**
 * Embedding Service
 * 
 * Generates vector embeddings for text using Gemini API.
 * Provides abstraction over embedding provider for future flexibility.
 * 
 * Key Features:
 * - Text to vector embedding conversion
 * - Batch embedding support
 * - Error handling and retries
 * - Input validation and limits
 * - Caching (future enhancement)
 * 
 * Usage:
 * ```typescript
 * const service = new EmbeddingService();
 * const embedding = await service.generateEmbedding('snake safety guidelines');
 * // Returns: Float32Array[768]
 * ```
 */

import { GoogleGenerativeAI, TaskType } from '@google/generative-ai';
import { loadGeminiConfig } from '../infrastructure/gemini/gemini.config';
import { createLogger } from '@snake-rescue/shared';

const logger = createLogger('EmbeddingService');

export interface EmbeddingResult {
  embedding: number[];
  dimension: number;
  model: string;
}

export interface BatchEmbeddingResult {
  embeddings: number[][];
  dimension: number;
  model: string;
  count: number;
}

/**
 * Embedding Service
 * Generates embeddings using Gemini API
 */
export class EmbeddingService {
  private genAI: GoogleGenerativeAI | null = null;
  private embeddingModel: string = 'text-embedding-004';
  private readonly dimension: number = 768; // Optimized dimension for Gemini
  private readonly maxInputLength: number = 8000; // Max tokens for embedding model
  private readonly maxBatchSize: number = 100; // Max batch size

  constructor() {
    const config = loadGeminiConfig();
    
    if (config.apiKey) {
      this.genAI = new GoogleGenerativeAI(config.apiKey);
      logger.info('Embedding service initialized with Gemini');
    } else {
      logger.warn('Gemini API key not configured - embeddings will not work');
    }
  }

  /**
   * Check if embedding service is available
   */
  isAvailable(): boolean {
    return this.genAI !== null;
  }

  /**
   * Get embedding dimension
   */
  getDimension(): number {
    return this.dimension;
  }

  /**
   * Generate embedding for a single text
   * 
   * @param text - Text to embed (max 8000 tokens)
   * @returns Embedding vector
   * @throws Error if API fails or text is too long
   */
  async generateEmbedding(text: string): Promise<EmbeddingResult> {
    if (!this.genAI) {
      throw new Error('Embedding service not available - Gemini API key not configured');
    }

    // Validate input
    if (!text || text.trim().length === 0) {
      throw new Error('Text cannot be empty');
    }

    // Truncate if too long (rough token estimate: 1 token ≈ 4 characters)
    if (text.length > this.maxInputLength * 4) {
      logger.warn(`Text too long (${text.length} chars), truncating to ${this.maxInputLength * 4}`);
      text = text.substring(0, this.maxInputLength * 4);
    }

    try {
      const model = this.genAI.getGenerativeModel({
        model: this.embeddingModel,
      });

      const result = await model.embedContent({
        content: { role: 'user', parts: [{ text }] },
        taskType: TaskType.RETRIEVAL_DOCUMENT, // Optimized for document retrieval
      });

      const embedding = result.embedding.values;

      if (!embedding || embedding.length !== this.dimension) {
        throw new Error(
          `Invalid embedding dimension: expected ${this.dimension}, got ${embedding?.length || 0}`
        );
      }

      return {
        embedding: Array.from(embedding),
        dimension: this.dimension,
        model: this.embeddingModel,
      };
    } catch (error: any) {
      logger.error({ error: error.message }, 'Failed to generate embedding');
      throw new Error(`Embedding generation failed: ${error.message}`);
    }
  }

  /**
   * Generate embeddings for multiple texts (batch operation)
   * 
   * @param texts - Array of texts to embed
   * @returns Array of embedding vectors
   * @throws Error if API fails
   */
  async generateBatchEmbeddings(texts: string[]): Promise<BatchEmbeddingResult> {
    if (!this.genAI) {
      throw new Error('Embedding service not available - Gemini API key not configured');
    }

    if (texts.length === 0) {
      throw new Error('Texts array cannot be empty');
    }

    if (texts.length > this.maxBatchSize) {
      throw new Error(`Batch size ${texts.length} exceeds maximum ${this.maxBatchSize}`);
    }

    try {
      // Process sequentially to avoid rate limits
      // TODO: Implement parallel processing with rate limiting
      const embeddings: number[][] = [];

      for (const text of texts) {
        const result = await this.generateEmbedding(text);
        embeddings.push(result.embedding);
      }

      return {
        embeddings,
        dimension: this.dimension,
        model: this.embeddingModel,
        count: embeddings.length,
      };
    } catch (error: any) {
      logger.error({ error: error.message }, 'Failed to generate batch embeddings');
      throw new Error(`Batch embedding generation failed: ${error.message}`);
    }
  }

  /**
   * Generate embedding for a query (optimized for retrieval)
   * 
   * @param query - Search query
   * @returns Embedding vector
   */
  async generateQueryEmbedding(query: string): Promise<EmbeddingResult> {
    if (!this.genAI) {
      throw new Error('Embedding service not available - Gemini API key not configured');
    }

    try {
      const model = this.genAI.getGenerativeModel({
        model: this.embeddingModel,
      });

      const result = await model.embedContent({
        content: { role: 'user', parts: [{ text: query }] },
        taskType: TaskType.RETRIEVAL_QUERY, // Optimized for query retrieval
      });

      const embedding = result.embedding.values;

      if (!embedding || embedding.length !== this.dimension) {
        throw new Error(
          `Invalid embedding dimension: expected ${this.dimension}, got ${embedding?.length || 0}`
        );
      }

      return {
        embedding: Array.from(embedding),
        dimension: this.dimension,
        model: this.embeddingModel,
      };
    } catch (error: any) {
      logger.error({ error: error.message }, 'Failed to generate query embedding');
      throw new Error(`Query embedding generation failed: ${error.message}`);
    }
  }
}
