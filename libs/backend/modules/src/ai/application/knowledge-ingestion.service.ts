/**
 * Knowledge Ingestion Service
 * 
 * Handles document ingestion for the RAG knowledge base.
 * Processes documents into searchable chunks with metadata.
 * 
 * Pipeline:
 * 1. Text normalization
 * 2. Chunking (with overlap for context preservation)
 * 3. Embedding generation (when pgvector is available)
 * 4. Storage in database
 * 
 * Usage:
 * ```typescript
 * const service = new KnowledgeIngestionService();
 * await service.ingestDocument({
 *   title: 'Snake Safety Guidelines',
 *   content: '...',
 *   source: 'SNAKESOS_DOCS',
 *   category: 'SAFETY',
 * });
 * ```
 */

import { prisma } from '@snake-rescue/database';
import { EmbeddingService } from './embedding.service';
import { createLogger } from '@snake-rescue/shared';

const logger = createLogger('KnowledgeIngestionService');

export interface IngestDocumentInput {
  title: string;
  description?: string;
  content: string;
  source: string; // 'SNAKESOS_DOCS', 'SAFETY_GUIDELINES', 'RESEARCH_PAPER', 'MANUAL'
  sourceUrl?: string;
  category: string; // 'SAFETY', 'SNAKE_INFO', 'RESCUE_SOP', 'ADMIN_DOCS', 'PUBLIC_FAQ'
  tags?: string[];
  visibility?: string; // 'PUBLIC', 'RESCUER', 'ADMIN', 'SUPER_ADMIN'
  language?: string;
  author?: string;
  metadata?: Record<string, any>;
}

export interface ChunkingOptions {
  chunkSize: number; // Characters per chunk
  overlap: number; // Overlap between chunks
  respectParagraphs: boolean; // Try to break at paragraph boundaries
}

export interface IngestDocumentResult {
  documentId: string;
  chunkCount: number;
  totalTokens: number;
  embeddingsGenerated: boolean;
}

/**
 * Knowledge Ingestion Service
 */
export class KnowledgeIngestionService {
  private embeddingService: EmbeddingService;
  private readonly defaultChunkingOptions: ChunkingOptions = {
    chunkSize: 1000, // ~250 tokens (1 token ≈ 4 chars)
    overlap: 200, // 50 token overlap for context
    respectParagraphs: true,
  };

  constructor(embeddingService?: EmbeddingService) {
    this.embeddingService = embeddingService || new EmbeddingService();
  }

  /**
   * Ingest a document into the knowledge base
   * 
   * @param input - Document input
   * @param options - Chunking options
   * @returns Ingestion result
   */
  async ingestDocument(
    input: IngestDocumentInput,
    options?: Partial<ChunkingOptions>
  ): Promise<IngestDocumentResult> {
    const chunkOptions = { ...this.defaultChunkingOptions, ...options };

    try {
      logger.info('Ingesting document', { title: input.title, category: input.category });

      // 1. Normalize text
      const normalizedContent = this.normalizeText(input.content);

      // 2. Create document
      const document = await prisma.knowledgeDocument.create({
        data: {
          title: input.title,
          description: input.description,
          content: normalizedContent,
          source: input.source,
          sourceUrl: input.sourceUrl,
          category: input.category,
          tags: input.tags || [],
          visibility: input.visibility || 'PUBLIC',
          language: input.language || 'en',
          author: input.author,
          metadata: input.metadata as any,
          isLatest: true,
          isActive: true,
        },
      });

      // 3. Chunk the document
      const chunks = this.chunkText(normalizedContent, chunkOptions);
      logger.info(`Created ${chunks.length} chunks for document ${document.id}`);

      // 4. Generate embeddings (if available)
      const embeddingsAvailable = this.embeddingService.isAvailable();
      let embeddingsGenerated = false;

      // 5. Store chunks
      let totalTokens = 0;

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const tokenCount = this.estimateTokenCount(chunk);
        totalTokens += tokenCount;

        // Generate embedding if service is available
        // Note: Embedding storage will work once pgvector is enabled
        let embedding: number[] | undefined;
        
        if (embeddingsAvailable) {
          try {
            const result = await this.embeddingService.generateEmbedding(chunk);
            embedding = result.embedding;
            embeddingsGenerated = true;
          } catch (error: any) {
            logger.warn(`Failed to generate embedding for chunk ${i}`, { error: error.message });
          }
        }

        // Store chunk (embedding will be null if pgvector is not enabled)
        await prisma.knowledgeChunk.create({
          data: {
            documentId: document.id,
            content: chunk,
            chunkIndex: i,
            tokenCount,
            // embedding: embedding, // Uncomment when pgvector is enabled
            metadata: {
              chunkSize: chunk.length,
              hasEmbedding: !!embedding,
            } as any,
          },
        });
      }

      logger.info('Document ingestion complete', {
        documentId: document.id,
        chunks: chunks.length,
        tokens: totalTokens,
        embeddings: embeddingsGenerated,
      });

      return {
        documentId: document.id,
        chunkCount: chunks.length,
        totalTokens,
        embeddingsGenerated,
      };
    } catch (error: any) {
      logger.error('Document ingestion failed', { error: error.message });
      throw new Error(`Failed to ingest document: ${error.message}`);
    }
  }

  /**
   * Normalize text (remove extra whitespace, normalize unicode, etc.)
   */
  private normalizeText(text: string): string {
    return text
      .replace(/\r\n/g, '\n') // Normalize line endings
      .replace(/\t/g, ' ') // Replace tabs with spaces
      .replace(/ +/g, ' ') // Collapse multiple spaces
      .replace(/\n{3,}/g, '\n\n') // Collapse multiple newlines
      .trim();
  }

  /**
   * Chunk text into smaller pieces with overlap
   * 
   * @param text - Text to chunk
   * @param options - Chunking options
   * @returns Array of text chunks
   */
  private chunkText(text: string, options: ChunkingOptions): string[] {
    const { chunkSize, overlap, respectParagraphs } = options;
    const chunks: string[] = [];

    if (respectParagraphs) {
      // Split by paragraphs first
      const paragraphs = text.split(/\n\n+/).filter((p) => p.trim().length > 0);
      let currentChunk = '';

      for (const paragraph of paragraphs) {
        // If adding this paragraph would exceed chunk size, start new chunk
        if (currentChunk.length + paragraph.length > chunkSize && currentChunk.length > 0) {
          chunks.push(currentChunk.trim());

          // Add overlap from end of previous chunk
          const overlapText = currentChunk.slice(-overlap);
          currentChunk = overlapText + '\n\n' + paragraph;
        } else {
          currentChunk += (currentChunk.length > 0 ? '\n\n' : '') + paragraph;
        }
      }

      // Add final chunk
      if (currentChunk.trim().length > 0) {
        chunks.push(currentChunk.trim());
      }
    } else {
      // Simple character-based chunking
      let start = 0;

      while (start < text.length) {
        const end = Math.min(start + chunkSize, text.length);
        const chunk = text.slice(start, end);
        chunks.push(chunk.trim());
        start += chunkSize - overlap;
      }
    }

    return chunks;
  }

  /**
   * Estimate token count for text
   * Rough estimate: 1 token ≈ 4 characters
   */
  private estimateTokenCount(text: string): number {
    return Math.ceil(text.length / 4);
  }

  /**
   * Delete a document and all its chunks
   * 
   * @param documentId - Document ID to delete
   */
  async deleteDocument(documentId: string): Promise<void> {
    try {
      logger.info('Deleting document', { documentId });

      await prisma.knowledgeDocument.delete({
        where: { id: documentId },
        // Cascades to chunks automatically
      });

      logger.info('Document deleted', { documentId });
    } catch (error: any) {
      logger.error('Failed to delete document', { error: error.message });
      throw new Error(`Failed to delete document: ${error.message}`);
    }
  }

  /**
   * Update document active status
   * 
   * @param documentId - Document ID
   * @param isActive - Active status
   */
  async setDocumentActive(documentId: string, isActive: boolean): Promise<void> {
    await prisma.knowledgeDocument.update({
      where: { id: documentId },
      data: { isActive },
    });

    logger.info('Document status updated', { documentId, isActive });
  }
}
