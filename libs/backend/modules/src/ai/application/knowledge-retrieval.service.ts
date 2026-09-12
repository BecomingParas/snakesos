/**
 * Knowledge Retrieval Service
 * 
 * Retrieves relevant knowledge chunks for RAG (Retrieval-Augmented Generation).
 * Supports both full-text search (current) and vector search (when pgvector is available).
 * 
 * Search Strategy:
 * 1. Full-text search using PostgreSQL tsvector (default)
 * 2. Vector similarity search using pgvector (future upgrade)
 * 3. Hybrid approach combining both
 * 
 * Usage:
 * ```typescript
 * const service = new KnowledgeRetrievalService();
 * const results = await service.search({
 *   query: 'What should I do if I see a snake?',
 *   topK: 5,
 *   visibility: 'PUBLIC',
 * });
 * ```
 */

import { prisma } from '@snake-rescue/database';
import { EmbeddingService } from './embedding.service';
import { createLogger } from '@snake-rescue/shared';

const logger = createLogger('KnowledgeRetrievalService');

export interface SearchOptions {
  query: string; // Search query
  topK?: number; // Number of results to return (default: 5)
  category?: string; // Filter by category
  visibility?: string; // Filter by visibility level
  minScore?: number; // Minimum relevance score (0-1)
  useVector?: boolean; // Use vector search if available (default: auto-detect)
}

export interface RetrievalResult {
  chunkId: string;
  documentId: string;
  documentTitle: string;
  content: string;
  score: number; // Relevance score (0-1)
  metadata: {
    category: string;
    source: string;
    chunkIndex: number;
    tokenCount?: number;
  };
}

export interface SearchResult {
  results: RetrievalResult[];
  totalFound: number;
  searchMethod: 'fulltext' | 'vector' | 'hybrid';
  query: string;
}

/**
 * Knowledge Retrieval Service
 */
export class KnowledgeRetrievalService {
  private embeddingService: EmbeddingService;

  constructor(embeddingService?: EmbeddingService) {
    this.embeddingService = embeddingService || new EmbeddingService();
  }

  /**
   * Search knowledge base for relevant chunks
   * 
   * @param options - Search options
   * @returns Search results
   */
  async search(options: SearchOptions): Promise<SearchResult> {
    const {
      query,
      topK = 5,
      category,
      visibility = 'PUBLIC',
      minScore = 0.1,
      useVector = false, // Vector search not yet available
    } = options;

    try {
      logger.info({ query, topK, category, visibility }, 'Searching knowledge base');

      // Determine search method
      const vectorAvailable = false; // TODO: Check if pgvector is enabled
      const shouldUseVector = useVector && vectorAvailable;

      let results: RetrievalResult[];
      let searchMethod: 'fulltext' | 'vector' | 'hybrid';

      if (shouldUseVector) {
        // Vector similarity search (when pgvector is available)
        results = await this.vectorSearch(query, topK, category, visibility, minScore);
        searchMethod = 'vector';
      } else {
        // Full-text search (current implementation)
        results = await this.fullTextSearch(query, topK, category, visibility, minScore);
        searchMethod = 'fulltext';
      }

      logger.info({
        query,
        found: results.length,
        method: searchMethod,
      }, 'Search complete');

      return {
        results,
        totalFound: results.length,
        searchMethod,
        query,
      };
    } catch (error: any) {
      logger.error({ error: error.message }, 'Search failed');
      throw new Error(`Knowledge search failed: ${error.message}`);
    }
  }

  /**
   * Full-text search using PostgreSQL tsvector
   * 
   * @private
   */
  private async fullTextSearch(
    query: string,
    topK: number,
    category?: string,
    visibility?: string,
    minScore?: number
  ): Promise<RetrievalResult[]> {
    // Convert query to tsquery format (AND all words by default)
    const searchTerms = query
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 2) // Filter out short words
      .join(' & ');

    if (!searchTerms) {
      return [];
    }

    // Build WHERE clause for filters
    const filters: string[] = [];
    const params: any[] = [searchTerms];
    let paramIndex = 2;

    if (category) {
      filters.push(`d.category = $${paramIndex}`);
      params.push(category);
      paramIndex++;
    }

    if (visibility) {
      filters.push(`d.visibility = $${paramIndex}`);
      params.push(visibility);
      paramIndex++;
    }

    // Always filter active documents
    filters.push('d."isActive" = true');

    const whereClause = filters.length > 0 ? `AND ${filters.join(' AND ')}` : '';

    // Execute full-text search
    // Note: search_vector column needs to be created via migration
    const results = await prisma.$queryRawUnsafe<Array<{
      chunk_id: string;
      document_id: string;
      document_title: string;
      content: string;
      category: string;
      source: string;
      chunk_index: number;
      token_count: number | null;
      rank: number;
    }>>(
      `
      SELECT 
        c.id as chunk_id,
        c."documentId" as document_id,
        d.title as document_title,
        c.content,
        d.category,
        d.source,
        c."chunkIndex" as chunk_index,
        c."tokenCount" as token_count,
        ts_rank(c.search_vector, to_tsquery('english', $1)) as rank
      FROM knowledge_chunks c
      INNER JOIN knowledge_documents d ON c."documentId" = d.id
      WHERE c.search_vector @@ to_tsquery('english', $1)
        ${whereClause}
      ORDER BY rank DESC
      LIMIT ${topK}
      `,
      ...params
    );

    // Transform to standard format
    return results.map((row) => ({
      chunkId: row.chunk_id,
      documentId: row.document_id,
      documentTitle: row.document_title,
      content: row.content,
      score: Math.min(row.rank, 1.0), // Normalize score to 0-1
      metadata: {
        category: row.category,
        source: row.source,
        chunkIndex: row.chunk_index,
        tokenCount: row.token_count || undefined,
      },
    }));
  }

  /**
   * Vector similarity search using pgvector
   * 
   * @private
   * NOTE: Requires pgvector extension to be enabled
   */
  private async vectorSearch(
    query: string,
    topK: number,
    category?: string,
    visibility?: string,
    minScore?: number
  ): Promise<RetrievalResult[]> {
    // Generate query embedding
    const embeddingResult = await this.embeddingService.generateQueryEmbedding(query);
    const embedding = embeddingResult.embedding;

    // Build WHERE clause for filters
    const filters: string[] = [];
    const params: any[] = [`[${embedding.join(',')}]`];
    let paramIndex = 2;

    if (category) {
      filters.push(`d.category = $${paramIndex}`);
      params.push(category);
      paramIndex++;
    }

    if (visibility) {
      filters.push(`d.visibility = $${paramIndex}`);
      params.push(visibility);
      paramIndex++;
    }

    filters.push('d."isActive" = true');
    filters.push('c.embedding IS NOT NULL');

    const whereClause = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';

    // Execute vector similarity search
    // Note: This requires pgvector extension to be enabled
    const results = await prisma.$queryRawUnsafe<Array<{
      chunk_id: string;
      document_id: string;
      document_title: string;
      content: string;
      category: string;
      source: string;
      chunk_index: number;
      token_count: number | null;
      similarity: number;
    }>>(
      `
      SELECT 
        c.id as chunk_id,
        c."documentId" as document_id,
        d.title as document_title,
        c.content,
        d.category,
        d.source,
        c."chunkIndex" as chunk_index,
        c."tokenCount" as token_count,
        1 - (c.embedding <=> $1::vector) as similarity
      FROM knowledge_chunks c
      INNER JOIN knowledge_documents d ON c."documentId" = d.id
      ${whereClause}
      ORDER BY c.embedding <=> $1::vector
      LIMIT ${topK}
      `,
      ...params
    );

    // Filter by minimum score and transform
    return results
      .filter((row) => !minScore || row.similarity >= minScore)
      .map((row) => ({
        chunkId: row.chunk_id,
        documentId: row.document_id,
        documentTitle: row.document_title,
        content: row.content,
        score: row.similarity,
        metadata: {
          category: row.category,
          source: row.source,
          chunkIndex: row.chunk_index,
          tokenCount: row.token_count || undefined,
        },
      }));
  }

  /**
   * Get document by ID
   * 
   * @param documentId - Document ID
   * @returns Document with all chunks
   */
  async getDocument(documentId: string) {
    const document = await prisma.knowledgeDocument.findUnique({
      where: { id: documentId },
      include: {
        chunks: {
          orderBy: { chunkIndex: 'asc' },
        },
      },
    });

    if (!document) {
      throw new Error('Document not found');
    }

    return document;
  }

  /**
   * List all documents with filters
   * 
   * @param filters - Optional filters
   * @returns List of documents
   */
  async listDocuments(filters?: {
    category?: string;
    visibility?: string;
    isActive?: boolean;
  }) {
    return prisma.knowledgeDocument.findMany({
      where: {
        ...filters,
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        source: true,
        category: true,
        visibility: true,
        isActive: true,
        createdAt: true,
        _count: {
          select: { chunks: true },
        },
      },
    });
  }
}
