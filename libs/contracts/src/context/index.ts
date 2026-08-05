/**
 * GraphQL Context Type Definition
 * This is a simplified version for type generation.
 * The actual implementation is in @snake-rescue/core
 */

import type { Request, Response } from 'express';

export interface GraphQLContext {
  req: Request;
  res: Response;
  user?: {
    id: string;
    email: string;
    role: string;
  };
  session?: {
    token: string;
    expiresAt: Date;
  };
  [key: string]: any;
}
