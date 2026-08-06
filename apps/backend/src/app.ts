/**
 * Express Application Setup
 * Configures Express with all middleware and routes
 */

import express, { type Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { createLogger } from '@snake-rescue/shared';
import { authMiddleware } from '@snake-rescue/core';
import { auth, authRateLimiter, apiRateLimiter, doubleCsrfProtection } from '@snake-rescue/auth';
import { config } from './config/index.js';
import { errorMiddleware } from './middleware/index.js';

const logger = createLogger('App');

export function createApp(): Express {
  const app = express();

  // Trust proxy (for rate limiting, IP detection)
  app.set('trust proxy', 1);

  // Security middleware
  app.use(
    helmet({
      contentSecurityPolicy: config.graphqlPlayground ? false : undefined,
      crossOriginEmbedderPolicy: false,
    })
  );

  // CORS
  const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {
        return callback(null, true);
      }
      
      if (config.corsOrigins.includes(origin)) {
        callback(null, true);
      } else {
        logger.warn({ msg: 'CORS blocked origin', origin, allowed: config.corsOrigins });
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Allow cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Set-Cookie'],
    maxAge: 86400, // 24 hours
  };
  
  logger.info({ msg: 'CORS configuration', origins: config.corsOrigins });
  
  app.use(cors(corsOptions));

  // Body parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  
  // Cookie parsing (for Better Auth session)
  app.use(cookieParser());

  // Compression
  app.use(compression());

  // Rate limiting
  app.use('/api/auth', authRateLimiter);
  app.use('/graphql', apiRateLimiter);

  // CSRF protection for mutations (exclude auth routes as Better Auth handles CSRF)
  if (config.nodeEnv === 'production') {
    app.use((req: Request, res: Response, next: NextFunction) => {
      // Skip CSRF for GET requests and auth endpoints
      if (req.method === 'GET' || req.path.startsWith('/api/auth')) {
        return next();
      }
      return doubleCsrfProtection(req, res, next);
    });
  }

  // Mount Better Auth REST API endpoints
  // Better Auth handler expects Web Standard Request, returns Web Standard Response
  app.use('/api/auth', async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Convert Express request to Web Standard Request
      const url = new URL(req.url, `${req.protocol}://${req.get('host')}`);
      const webRequest = new globalThis.Request(url, {
        method: req.method,
        headers: req.headers as Record<string, string>,
        body: ['GET', 'HEAD'].includes(req.method) ? undefined : JSON.stringify(req.body),
      });

      // Call Better Auth handler
      const webResponse = await auth.handler(webRequest);

      // Convert Web Standard Response to Express response
      res.status(webResponse.status);
      
      // Copy headers
      webResponse.headers.forEach((value: string, key: string) => {
        res.setHeader(key, value);
      });

      // Send body
      const body = await webResponse.text();
      res.send(body);
    } catch (error) {
      logger.error({ msg: 'Better Auth handler error', error });
      if (!res.headersSent) {
        res.status(500).json({ error: 'Authentication error' });
      }
      next(error);
    }
  });

  // Auth middleware - extracts Better Auth session for GraphQL
  app.use(authMiddleware);

  // Request logging
  app.use((req, _res, next) => {
    logger.info({
      msg: 'Incoming request',
      method: req.method,
      path: req.path,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });
    next();
  });

  // Health check endpoint
  app.get('/health', (_req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.nodeEnv,
    });
  });

  // Root endpoint
  app.get('/', (_req, res) => {
    res.json({
      name: 'Snake Rescue API',
      version: '1.0.0',
      graphql: config.graphqlPath,
      health: '/health',
    });
  });

  // Error handling middleware (must be last)
  app.use(errorMiddleware);

  return app;
}
