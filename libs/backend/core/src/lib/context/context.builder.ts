/**
 * GraphQL Context Builder
 * Creates the context object for each GraphQL request
 */

import { prisma } from '@snake-rescue/database';
import { createLogger, AuthenticationError } from '@snake-rescue/shared';
import type { GraphQLContext, ContextParams } from './context.interface.js';
import { createDataLoaders } from '../dataloader/loader.factory.js';

const logger = createLogger('GraphQLContext');

/**
 * Build GraphQL context from Express request/response
 */
export async function buildContext(params: ContextParams): Promise<GraphQLContext> {
  const { req, res } = params;

  // Extract user and session from request (set by auth middleware)
  const user = (req as any).user || null;
  const session = (req as any).session || null;

  // Create DataLoaders for this request
  const loaders = createDataLoaders(prisma);

  // Build context object
  const context: GraphQLContext = {
    req,
    res,
    user,
    session,
    loaders,
    logger,
    prisma,

    // Helper: Require authentication
    requireAuth() {
      if (!this.user || !this.session) {
        throw new AuthenticationError('Authentication required');
      }
    },

    // Helper: Check if user has permission
    hasPermission(permission: string): boolean {
      if (!this.user) return false;
      
      // TODO: Implement permission checking logic
      // This will check user's roles and permissions from database
      return false;
    },

    // Helper: Check if user has role
    hasRole(role: string): boolean {
      if (!this.user) return false;
      
      // TODO: Implement role checking logic
      // This will check user's assigned roles
      return false;
    },
  };

  return context;
}
