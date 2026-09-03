/**
 * GraphQL Context Builder
 * Creates the context object for each GraphQL request
 */

import { prisma } from '@snake-rescue/database';
import { createLogger, AuthenticationError } from '@snake-rescue/shared';
import type { GraphQLContext, ContextParams } from './context.interface';
import { createDataLoaders } from '../dataloader/loader.factory';

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
    async hasPermission(permission: string): Promise<boolean> {
      if (!this.user) return false;
      
      // Import role permissions
      const { ROLE_PERMISSIONS, UserRole } = await import('@snake-rescue/auth');
      
      // Check if the user's role has this permission
      const userRole = this.user.role as typeof UserRole[keyof typeof UserRole];
      const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
      
      return rolePermissions.includes(permission as any);
    },

    // Helper: Check if user has role
    hasRole(role: string): boolean {
      if (!this.user) return false;
      
      // Check if user's role matches
      return this.user.role === role;
    },

    // Helper: Require specific role
    requireRole(allowedRoles: string[]): void {
      if (!this.user || !this.session) {
        throw new AuthenticationError('Authentication required');
      }
      
      if (!allowedRoles.includes(this.user.role)) {
        throw new AuthenticationError(`Insufficient permissions. Required roles: ${allowedRoles.join(', ')}`);
      }
    },

    // Helper: Require specific permission
    async requirePermission(permission: string): Promise<void> {
      if (!this.user || !this.session) {
        throw new AuthenticationError('Authentication required');
      }
      
      const hasPermission = await this.hasPermission(permission);
      if (!hasPermission) {
        throw new AuthenticationError(`Insufficient permissions. Required: ${permission}`);
      }
    },
  };

  return context;
}
