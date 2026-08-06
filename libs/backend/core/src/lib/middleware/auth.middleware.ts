/**
 * Authentication Middleware
 * Extracts and validates user session from database
 */

import type { Request, Response, NextFunction } from 'express';
import { logger } from '@snake-rescue/shared';
import { prisma } from '@snake-rescue/database';

/**
 * Extract user and session from Authorization header
 * Validates session token against database
 * Attaches user and session to req.user and req.session if valid
 */
export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Find session in database with user
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true }
    });

    // Validate session exists and hasn't expired
    if (session && new Date() < session.expiresAt) {
      // Attach to request for GraphQL context
      (req as any).session = {
        id: session.id,
        userId: session.userId,
        token: session.token,
        expiresAt: session.expiresAt,
        ipAddress: session.ipAddress,
        userAgent: session.userAgent,
      };
      
      (req as any).user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
        phone: session.user.phone,
        avatar: session.user.avatar,
        emailVerified: session.user.emailVerified,
        createdAt: session.user.createdAt,
        updatedAt: session.user.updatedAt,
      };
      
      logger.debug({
        msg: 'User authenticated',
        userId: session.user.id,
        email: session.user.email,
        role: session.user.role,
      });
    } else if (session) {
      // Session expired - delete it
      await prisma.session.delete({ where: { id: session.id } });
      logger.debug('Session expired and deleted');
    }
  } catch (error) {
    // Session invalid or error - continue without auth
    logger.debug({ msg: 'Session validation error', error });
  }

  next();
}
