/**
 * Express Application Setup
 * Configures Express with all middleware and routes
 */

import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { createLogger } from '@snake-rescue/shared';
import { authMiddleware } from '@snake-rescue/core';
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
  app.use(
    cors({
      origin: config.corsOrigins,
      credentials: true, // Allow cookies
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Body parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  
  // Cookie parsing (for Better Auth session)
  app.use(cookieParser());

  // Compression
  app.use(compression());

  // Auth middleware - extracts Better Auth session
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
