/**
 * GraphQL Context Interface
 * Defines the shape of the context object available in all resolvers
 */

import type { Request, Response } from 'express';
import type { User, Session } from '@snake-rescue/database';
import type { Logger } from '@snake-rescue/shared';
import type DataLoader from 'dataloader';

export interface ContextDataLoaders {
  userLoader: DataLoader<string, any>;
  rescueLoader: DataLoader<string, any>;
}

export interface GraphQLContext {
  // Request/Response
  req: Request;
  res: Response;

  // Authentication
  user: User | null;
  session: Session | null;
  
  // DataLoaders (N+1 prevention)
  loaders: ContextDataLoaders;
  
  // Logger
  logger: Logger;
  
  // Utilities
  prisma: any; // Will be typed as PrismaClient
  
  // Helper methods
  requireAuth(): asserts this is GraphQLContext & { user: User; session: Session };
  hasPermission(permission: string): Promise<boolean>;
  hasRole(role: string): boolean;
  requireRole(allowedRoles: string[]): void;
  requirePermission(permission: string): Promise<void>;
}

export interface ContextParams {
  req: Request;
  res: Response;
}
