/**
 * Authentication Middleware
 * Extracts and validates user session from Better Auth
 */

import type { Request, Response, NextFunction } from 'express';
import { auth } from '@snake-rescue/auth';
import { logger } from '@snake-rescue/shared';

/**
 * Extract user and session from Better Auth cookies
 * Attaches them to req.user and req.session if valid
 */
export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    // Get session from Better Auth
    const session = await auth.api.getSession({ headers: req.headers as any });

    if (session) {
      // Attach to request for GraphQL context
      (req as any).session = session.session;
      (req as any).user = session.user;
      
      logger.debug({
        msg: 'User authenticated',
        userId: session.user.id,
        email: session.user.email,
      });
    }
  } catch (error) {
    // Session invalid or expired - continue without auth
    logger.debug('No valid session found');
  }

  next();
}
