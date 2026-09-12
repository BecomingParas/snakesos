/**
 * AI Agent Service
 *
 * Orchestrates AI interactions using Gemini with function calling.
 * Manages conversations, tool execution, and context awareness.
 *
 * Architecture:
 * User → AI Agent → Gemini (reasoning) → Tools → Application Services
 *
 * Key Features:
 * - Role-based tool access
 * - Conversation management
 * - Tool execution with safety checks
 * - Streaming responses
 * - Audit logging
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { loadGeminiConfig } from '../infrastructure/gemini/gemini.config';
import { ToolRegistryService } from './tool-registry.service';
import { ToolContext } from './types/tool.types';
import { KnowledgeRetrievalService } from './knowledge-retrieval.service';
import { prisma } from '@snake-rescue/database';
import { createLogger } from '@snake-rescue/shared';

const logger = createLogger('AIAgent');

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  toolCalls?: Array<{
    name: string;
    arguments: Record<string, any>;
    result?: any;
  }>;
}

export interface ChatRequest {
  message: string;
  conversationId?: string;
  context: ToolContext;
  systemPrompt?: string;
}

export interface ChatResponse {
  conversationId: string;
  messageId: string;
  response: string;
  toolsUsed: string[];
  metadata: {
    model: string;
    tokensUsed?: number;
    responseTime: number;
  };
}

/**
 * AI Agent Service
 */
export class AIAgentService {
  private genAI: GoogleGenerativeAI;
  private toolRegistry: ToolRegistryService;
  private retrievalService: KnowledgeRetrievalService;
  private readonly model: string;

  constructor(
    toolRegistry: ToolRegistryService,
    retrievalService?: KnowledgeRetrievalService,
  ) {
    const config = loadGeminiConfig();
    this.genAI = new GoogleGenerativeAI(config.apiKey);
    this.model = config.model;
    this.toolRegistry = toolRegistry;
    this.retrievalService = retrievalService || new KnowledgeRetrievalService();
  }

  /**
   * Chat with the AI agent
   */
  async chat(request: ChatRequest): Promise<ChatResponse> {
    const startTime = Date.now();
    const { message, conversationId, context, systemPrompt } = request;

    try {
      logger.info(
        {
          conversationId,
          userId: context.userId,
          userRole: context.userRole,
        },
        'Processing chat request',
      );

      // Get or create conversation
      const conversation = conversationId
        ? await this.getConversation(conversationId)
        : await this.createConversation(context);

      // Get conversation history
      const history = await this.getConversationHistory(conversation.id);

      // Get available tools for this user
      const tools = this.toolRegistry.getToolDefinitionsForGemini(context);

      // Build system prompt
      const systemMessage = systemPrompt || this.buildSystemPrompt(context);

      // Create Gemini model with tools
      const model = this.genAI.getGenerativeModel({
        model: this.model,
        tools: tools.length > 0 ? [{ functionDeclarations: tools }] : undefined,
        systemInstruction: systemMessage,
      });

      // Start chat with history
      const chat = model.startChat({
        history: this.convertHistoryToGemini(history),
      });

      // Send message and get response
      const result = await chat.sendMessage(message);
      const response = result.response;

      // Handle function calls
      const toolsUsed: string[] = [];
      let finalResponse = '';

      const functionCalls = response.functionCalls();
      if (functionCalls && functionCalls.length > 0) {
        // Execute tools
        const toolResults: any[] = [];

        for (const call of functionCalls) {
          logger.info({ tool: call.name }, 'Executing tool');

          const toolResult = await this.toolRegistry.executeTool({
            toolName: call.name,
            arguments: call.args as Record<string, any>,
            context,
          });

          toolResults.push({
            name: call.name,
            response: toolResult,
          });

          toolsUsed.push(call.name);
        }

        // Send tool results back to model
        const followUpResult = await chat.sendMessage([
          ...toolResults.map((tr) => ({
            functionResponse: {
              name: tr.name,
              response: tr.response,
            },
          })),
        ]);

        finalResponse = followUpResult.response.text();
      } else {
        finalResponse = response.text();
      }

      // Save messages to conversation
      await this.saveUserMessage(conversation.id, message);
      const assistantMessage = await this.saveAssistantMessage(
        conversation.id,
        finalResponse,
        toolsUsed,
      );

      const responseTime = Date.now() - startTime;

      logger.info(
        {
          conversationId: conversation.id,
          toolsUsed: toolsUsed.length,
          responseTime,
        },
        'Chat request completed',
      );

      return {
        conversationId: conversation.id,
        messageId: assistantMessage.id,
        response: finalResponse,
        toolsUsed,
        metadata: {
          model: this.model,
          responseTime,
        },
      };
    } catch (error: any) {
      logger.error({ error: error.message }, 'Chat request failed');
      throw new Error(`AI chat failed: ${error.message}`);
    }
  }

  /**
   * Build system prompt based on user context
   */
  private buildSystemPrompt(context: ToolContext): string {
    const role = context.userRole || 'PUBLIC';

    const basePrompt = `You are SnakeSOS AI, an intelligent assistant for the SnakeSOS snake rescue and safety platform in Nepal.

Your primary goals:
1. Provide accurate, safety-first information about snakes and snake encounters
2. Help users find rescue assistance when needed
3. Guide users to appropriate medical facilities in emergencies
4. Answer questions using the SnakeSOS knowledge base

CRITICAL SAFETY RULES:
- NEVER encourage users to approach, handle, capture, or kill snakes
- For snakebite situations, ALWAYS prioritize immediate medical attention
- Emphasize keeping distance and calling professional rescuers
- Never claim visual identification is certain without high confidence
- Do not provide medical diagnoses - recommend professional medical evaluation

When using tools:
- Use searchKnowledge for questions about snake species, safety guidelines, and procedures
- Use findNearestRescuer when someone needs rescue assistance
- Use findNearbyHospitals for medical emergencies or snakebite situations
- Always explain what you're doing when calling tools

Your knowledge comes from:
1. The SnakeSOS knowledge base (via searchKnowledge tool)
2. Real-time data from the platform (via tools)
3. Your training data about snakes and safety

Be helpful, empathetic, and safety-conscious. Lives may depend on your guidance.`;

    // Add role-specific instructions
    if (role === 'VERIFIED_RESCUER') {
      return `${basePrompt}

You are assisting a VERIFIED RESCUER. They have access to:
- Rescue assignment information
- Professional snake handling procedures
- Extended rescue protocols and SOPs`;
    }

    if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
      return `${basePrompt}

You are assisting an ADMIN. They have access to:
- Platform analytics and statistics
- Operational data
- Administrative tools and reports`;
    }

    return basePrompt;
  }

  /**
   * Get or create conversation
   */
  private async getConversation(conversationId: string) {
    const conversation = await prisma.aiConversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    return conversation;
  }

  /**
   * Create new conversation
   */
  private async createConversation(context: ToolContext) {
    return prisma.aiConversation.create({
      data: {
        userId: context.userId,
        context: context.userRole || 'PUBLIC',
        role: context.userRole,
        isActive: true,
        sessionId: context.sessionId,
        ipAddress: context.ipAddress,
      },
    });
  }

  /**
   * Get conversation history
   */
  private async getConversationHistory(conversationId: string) {
    return prisma.aiMessage.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      take: 20, // Last 20 messages for context
    });
  }

  /**
   * Convert database history to Gemini format
   */
  private convertHistoryToGemini(messages: any[]): any[] {
    return messages.map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));
  }

  /**
   * Save user message
   */
  private async saveUserMessage(conversationId: string, content: string) {
    return prisma.aiMessage.create({
      data: {
        conversationId,
        role: 'user',
        content,
      },
    });
  }

  /**
   * Save assistant message
   */
  private async saveAssistantMessage(
    conversationId: string,
    content: string,
    toolsUsed: string[],
  ) {
    return prisma.aiMessage.create({
      data: {
        conversationId,
        role: 'assistant',
        content,
        metadata: {
          toolsUsed,
        } as any,
      },
    });
  }
}
