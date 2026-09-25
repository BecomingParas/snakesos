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
    
    console.log('[AUTH_MIDDLEWARE] Auth header:', authHeader ? 'Present' : 'Missing');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('[AUTH_MIDDLEWARE] No Bearer token found');
      return next();
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('[AUTH_MIDDLEWARE] Extracted token:', token);
    
    // Find session in database with user
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true }
    });

    console.log('[AUTH_MIDDLEWARE] Session found in database:', !!session);
    if (session) {
      console.log('[AUTH_MIDDLEWARE] Session user ID:', session.userId);
      console.log('[AUTH_MIDDLEWARE] Session expires at:', session.expiresAt);
      console.log('[AUTH_MIDDLEWARE] Current time:', new Date());
      console.log('[AUTH_MIDDLEWARE] Session expired:', new Date() >= session.expiresAt);
      console.log('[AUTH_MIDDLEWARE] User email:', session.user?.email);
    } else {
      console.log('[AUTH_MIDDLEWARE] Token not found in database. Checking all sessions for this user...');
      // Try to find any sessions to debug
      const userIdFromToken = token.split('_')[0];
      const allUserSessions = await prisma.session.findMany({
        where: { userId: userIdFromToken },
        orderBy: { createdAt: 'desc' },
        take: 5
      });
      console.log('[AUTH_MIDDLEWARE] User has', allUserSessions.length, 'sessions in database');
      if (allUserSessions.length > 0) {
        console.log('[AUTH_MIDDLEWARE] Latest session token:', allUserSessions[0].token.substring(0, 30) + '...');
        console.log('[AUTH_MIDDLEWARE] Received token:', token.substring(0, 30) + '...');
      }
    }

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
      
      console.log('[AUTH_MIDDLEWARE] User authenticated successfully:', {
        userId: session.user.id,
        email: session.user.email,
        role: session.user.role,
      });
      
      logger.debug({
        msg: 'User authenticated',
        userId: session.user.id,
        email: session.user.email,
        role: session.user.role,
      });
    } else if (session) {
      // Session expired - delete it
      console.log('[AUTH_MIDDLEWARE] Session expired, deleting it');
      await prisma.session.delete({ where: { id: session.id } });
      logger.debug('Session expired and deleted');
    } else {
      console.log('[AUTH_MIDDLEWARE] No valid session found for token');
    }
  } catch (error) {
    // Session invalid or error - continue without auth
    console.log('[AUTH_MIDDLEWARE] Error during session validation:', error);
    logger.debug({ msg: 'Session validation error', error });
  }

  next();
}
