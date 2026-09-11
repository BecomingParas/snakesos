/**
 * Search Knowledge Tool
 * 
 * Searches the knowledge base for relevant information.
 * Uses the RAG retrieval service implemented in Phase 1.
 */

import { z } from 'zod';
import { BaseTool } from '../base.tool';
import { ToolDefinition } from '../../types/tool.types';
import { KnowledgeRetrievalService, SearchResult } from '../../knowledge-retrieval.service';

const inputSchema = z.object({
  query: z.string().min(3).max(500).describe('Search query'),
  category: z
    .enum(['SAFETY', 'SNAKE_INFO', 'RESCUE_SOP', 'ADMIN_DOCS', 'PUBLIC_FAQ'])
    .optional()
    .describe('Filter by category'),
  topK: z.number().int().min(1).max(10).optional().default(5).describe('Number of results'),
});

type SearchKnowledgeInput = z.infer<typeof inputSchema>;

/**
 * Search Knowledge Tool
 */
export class SearchKnowledgeTool extends BaseTool<
  SearchKnowledgeInput,
  SearchResult
> {
  readonly definition: ToolDefinition = {
    name: 'searchKnowledge',
    description:
      'Search the SnakeSOS knowledge base for information about snakes, safety guidelines, rescue procedures, and FAQs. Use this to answer questions about snake species, what to do in snake encounters, rescue protocols, and general safety information.',
    category: 'knowledge',
    parameters: [
      {
        name: 'query',
        type: 'string',
        description: 'Natural language search query (e.g., "what to do if bitten by snake")',
        required: true,
      },
      {
        name: 'category',
        type: 'string',
        description: 'Filter by knowledge category',
        required: false,
        enum: ['SAFETY', 'SNAKE_INFO', 'RESCUE_SOP', 'ADMIN_DOCS', 'PUBLIC_FAQ'],
      },
      {
        name: 'topK',
        type: 'number',
        description: 'Number of results to return (1-10)',
        required: false,
      },
    ],
    requiredPermissions: [],
    requiresConfirmation: false,
    isReadOnly: true,
    visibleToRoles: ['PUBLIC', 'CITIZEN', 'VOLUNTEER', 'VERIFIED_RESCUER', 'ADMIN', 'SUPER_ADMIN'],
    schema: inputSchema,
    exampleUsage: 'searchKnowledge({ query: "snake safety guidelines", topK: 3 })',
  };

  private retrievalService: KnowledgeRetrievalService;

  constructor(retrievalService?: KnowledgeRetrievalService) {
    super();
    this.retrievalService = retrievalService || new KnowledgeRetrievalService();
  }

  protected async executeImpl(
    input: SearchKnowledgeInput
  ): Promise<SearchResult> {
    // Determine visibility based on user role
    const visibility = this.getVisibilityForContext(input);

    // Execute search
    const result = await this.retrievalService.search({
      query: input.query,
      topK: input.topK || 5,
      category: input.category,
      visibility,
    });

    return result;
  }

  /**
   * Determine appropriate visibility level based on user context
   */
  private getVisibilityForContext(input: any): string {
    // For now, return PUBLIC
    // In Phase 2B, we'll use context.userRole to determine visibility
    return 'PUBLIC';
  }
}
