/**
 * AI Chat GraphQL Resolver
 * 
 * Provides GraphQL interface for AI agent interactions.
 */

import { AIAgentService } from '../../application/ai-agent.service';
import { getToolRegistry } from '../../application/initialize-tools';
import { ToolContext } from '../../application/types/tool.types';
import { prisma } from '@snake-rescue/database';
import { createLogger } from '@snake-rescue/shared';
import type { GraphQLContext } from '@snake-rescue/core';

const logger = createLogger('AiChatResolver');

/**
 * AI Chat Resolvers
 */
export const aiChatResolvers = {
  Query: {
    /**
     * Get conversation by ID
     */
    aiConversation: async (
      _: unknown,
      args: { id: string },
      context: GraphQLContext
    ) => {
      context.requireAuth();

      const conversation = await prisma.aiConversation.findUnique({
        where: { id: args.id },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
            take: 50, // Last 50 messages
          },
        },
      });

      if (!conversation) {
        throw new Error('Conversation not found');
      }

      // Check authorization - user can only view their own conversations
      if (
        conversation.userId !== context.user.id &&
        !context.hasRole('ADMIN') &&
        !context.hasRole('SUPER_ADMIN')
      ) {
        throw new Error('Not authorized to view this conversation');
      }

      return conversation;
    },

    /**
     * Get user's conversations
     */
    myAiConversations: async (
      _: unknown,
      args: { limit?: number; offset?: number },
      context: GraphQLContext
    ) => {
      context.requireAuth();

      const limit = args.limit || 20;
      const offset = args.offset || 0;

      return prisma.aiConversation.findMany({
        where: {
          userId: context.user.id,
          isActive: true,
        },
        orderBy: { updatedAt: 'desc' },
        take: limit,
        skip: offset,
        include: {
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1, // Just the last message for preview
          },
        },
      });
    },

    /**
     * Get available AI tools for current user
     */
    availableAiTools: async (
      _: unknown,
      __: unknown,
      context: GraphQLContext
    ) => {
      const toolRegistry = getToolRegistry();

      const toolContext: ToolContext = {
        userId: context.user?.id,
        userRole: context.user?.role || 'PUBLIC',
        permissions: [],
        sessionId: context.session?.id,
      };

      const tools = toolRegistry.getAvailableTools(toolContext);

      return tools.map((tool) => ({
        name: tool.name,
        description: tool.description,
        category: tool.category,
        parameters: tool.parameters.map((param) => ({
          name: param.name,
          type: param.type,
          description: param.description,
          required: param.required,
          enum: param.enum || [],
        })),
        requiresConfirmation: tool.requiresConfirmation,
        isReadOnly: tool.isReadOnly,
      }));
    },
  },

  Mutation: {
    /**
     * Send message to AI agent
     */
    aiChat: async (
      _: unknown,
      args: {
        input: {
          message: string;
          conversationId?: string;
          context?: {
            location?: { latitude: number; longitude: number };
            metadata?: Record<string, any>;
          };
        };
      },
      context: GraphQLContext
    ) => {
      const { message, conversationId, context: chatContext } = args.input;

      // Build tool context
      const toolContext: ToolContext = {
        userId: context.user?.id,
        userRole: context.user?.role || 'PUBLIC',
        permissions: [],
        sessionId: context.session?.id,
        ipAddress: context.req.ip,
        conversationId,
      };

      // Get AI agent
      const toolRegistry = getToolRegistry();
      const aiAgent = new AIAgentService(toolRegistry);

      // Build enhanced system prompt if location provided
      let systemPrompt: string | undefined;
      if (chatContext?.location) {
        systemPrompt = `User's current location: latitude ${chatContext.location.latitude}, longitude ${chatContext.location.longitude}. Use this location when calling location-based tools like findNearestRescuer or findNearbyHospitals if the user needs rescue or medical assistance.`;
      }

      try {
        // Send message to agent
        const response = await aiAgent.chat({
          message,
          conversationId,
          context: toolContext,
          systemPrompt,
        });

        logger.info({
          conversationId: response.conversationId,
          toolsUsed: response.toolsUsed.length,
          userId: context.user?.id,
        }, 'Chat completed');

        return {
          conversationId: response.conversationId,
          messageId: response.messageId,
          response: response.response,
          toolsUsed: response.toolsUsed,
          responseTime: response.metadata.responseTime,
          requiresConfirmation: false, // Will be true for write operations
          confirmationRequest: null,
        };
      } catch (error: any) {
        logger.error({ error: error.message }, 'Chat failed');
        throw new Error(`Chat failed: ${error.message}`);
      }
    },

    /**
     * Confirm a pending action
     * (For write operations that require confirmation)
     */
    confirmAiAction: async (
      _: unknown,
      args: {
        input: {
          conversationId: string;
          toolName: string;
          arguments: Record<string, any>;
          confirmed: boolean;
        };
      },
      context: GraphQLContext
    ) => {
      context.requireAuth();

      const { conversationId, toolName, arguments: toolArgs, confirmed } = args.input;

      if (!confirmed) {
        throw new Error('Action was not confirmed');
      }

      // Get conversation to verify ownership
      const conversation = await prisma.aiConversation.findUnique({
        where: { id: conversationId },
      });

      if (!conversation) {
        throw new Error('Conversation not found');
      }

      if (conversation.userId !== context.user.id) {
        throw new Error('Not authorized');
      }

      // Build tool context
      const toolContext: ToolContext = {
        userId: context.user.id,
        userRole: context.user.role,
        permissions: [],
        sessionId: context.session?.id,
        ipAddress: context.req.ip,
        conversationId,
      };

      // Execute tool with confirmation
      const toolRegistry = getToolRegistry();
      const result = await toolRegistry.executeTool({
        toolName,
        arguments: toolArgs,
        context: toolContext,
        requireConfirmation: true, // Bypass confirmation since user already confirmed
      });

      if (!result.success) {
        throw new Error(result.error || 'Action failed');
      }

      // Save as assistant message
      const message = await prisma.aiMessage.create({
        data: {
          conversationId,
          role: 'assistant',
          content: `Action completed: ${toolName}`,
          toolName,
          toolArguments: toolArgs as any,
          toolResult: result.data as any,
          toolSuccess: true,
        },
      });

      return {
        conversationId,
        messageId: message.id,
        response: `Successfully executed ${toolName}`,
        toolsUsed: [toolName],
        responseTime: result.metadata?.executionTimeMs || 0,
        requiresConfirmation: false,
        confirmationRequest: null,
      };
    },

    /**
     * Close a conversation
     */
    closeAiConversation: async (
      _: unknown,
      args: { conversationId: string },
      context: GraphQLContext
    ) => {
      context.requireAuth();

      const conversation = await prisma.aiConversation.findUnique({
        where: { id: args.conversationId },
      });

      if (!conversation) {
        throw new Error('Conversation not found');
      }

      if (conversation.userId !== context.user.id) {
        throw new Error('Not authorized');
      }

      return prisma.aiConversation.update({
        where: { id: args.conversationId },
        data: {
          isActive: false,
          closedAt: new Date(),
        },
      });
    },

    /**
     * Delete a conversation
     */
    deleteAiConversation: async (
      _: unknown,
      args: { conversationId: string },
      context: GraphQLContext
    ) => {
      context.requireAuth();

      const conversation = await prisma.aiConversation.findUnique({
        where: { id: args.conversationId },
      });

      if (!conversation) {
        throw new Error('Conversation not found');
      }

      if (
        conversation.userId !== context.user.id &&
        !context.hasRole('ADMIN') &&
        !context.hasRole('SUPER_ADMIN')
      ) {
        throw new Error('Not authorized');
      }

      // Delete conversation (cascades to messages)
      await prisma.aiConversation.delete({
        where: { id: args.conversationId },
      });

      return true;
    },
  },

  // Field resolvers
  AiConversation: {
    messages: async (parent: any) => {
      if (parent.messages) {
        return parent.messages;
      }

      return prisma.aiMessage.findMany({
        where: { conversationId: parent.id },
        orderBy: { createdAt: 'asc' },
      });
    },
  },

  AiChatMessage: {
    role: (parent: any) => parent.role.toUpperCase(),
    toolCalls: (parent: any) => {
      if (!parent.toolName) {
        return [];
      }

      return [
        {
          name: parent.toolName,
          arguments: parent.toolArguments || {},
          result: parent.toolResult || null,
          success: parent.toolSuccess || false,
          error: parent.toolError || null,
        },
      ];
    },
  },
};
