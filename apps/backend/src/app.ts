/**
 * Express Application Setup
 * Configures Express with all middleware and routes
 */

import express, {
  type Express,
  Request,
  Response,
  NextFunction,
} from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { createLogger } from '@snake-rescue/shared';
import { authMiddleware } from '@snake-rescue/core';
import {
  auth,
  authRateLimiter,
  apiRateLimiter,
  doubleCsrfProtection,
} from '@snake-rescue/auth';
import { config } from './config/index.js';
import { errorMiddleware } from './middleware/index.js';
import { createConfiguredPaymentProviderService } from '@snake-rescue/modules';

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
    }),
  );

  // CORS
  const corsOptions = {
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {
        return callback(null, true);
      }

      if (config.corsOrigins.includes(origin)) {
        callback(null, true);
      } else {
        logger.warn({
          msg: 'CORS blocked origin',
          origin,
          allowed: config.corsOrigins,
        });
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
  app.use(
    express.json({
      limit: '10mb',
      verify: (request, _response, buffer) => {
        (request as Request & { rawBody?: Buffer }).rawBody =
          Buffer.from(buffer);
      },
    }),
  );
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Provider callbacks are unauthenticated, but are verified against the
  // provider API before a payment intent can change state.
  app.all('/api/payments/webhooks/:provider', async (req, res, next) => {
    try {
      if (req.method !== 'GET' && req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
      }
      const provider = String(req.params.provider).toUpperCase();
      if (!['STRIPE', 'ESEWA', 'KHALTI'].includes(provider)) {
        return res
          .status(404)
          .json({ error: 'Payment provider not supported' });
      }

      let payload = (req.method === 'GET' ? req.query : req.body) as Record<
        string,
        unknown
      >;
      if (provider === 'STRIPE' && req.method === 'POST') {
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
        const signature = req.header('stripe-signature');
        if (
          !process.env.STRIPE_SECRET_KEY ||
          !webhookSecret ||
          webhookSecret.includes('YOUR_WEBHOOK_SECRET') ||
          !signature
        ) {
          return res
            .status(503)
            .json({ error: 'Stripe webhook verification is not configured' });
        }

        const rawBody = (req as Request & { rawBody?: Buffer }).rawBody;
        if (!rawBody) {
          return res.status(400).json({ error: 'Missing raw webhook body' });
        }

        let event: Stripe.Event;
        try {
          event = new Stripe(
            process.env.STRIPE_SECRET_KEY,
          ).webhooks.constructEvent(rawBody, signature, webhookSecret);
        } catch {
          return res
            .status(400)
            .json({ error: 'Invalid Stripe webhook signature' });
        }
        if (
          ![
            'checkout.session.completed',
            'checkout.session.async_payment_succeeded',
            'charge.succeeded',
          ].includes(event.type)
        ) {
          return res.status(200).json({ received: true });
        }

        let session: Stripe.Checkout.Session | null = null;
        if (event.type.startsWith('checkout.session.')) {
          session = event.data.object as Stripe.Checkout.Session;
        } else {
          const charge = event.data.object as Stripe.Charge;
          const paymentIntentId =
            typeof charge.payment_intent === 'string'
              ? charge.payment_intent
              : null;
          if (paymentIntentId) {
            const sessions = await new Stripe(
              process.env.STRIPE_SECRET_KEY,
            ).checkout.sessions.list({
              payment_intent: paymentIntentId,
              limit: 1,
            });
            session = sessions.data[0] || null;
          }
        }

        if (!session) {
          return res.status(200).json({ received: true });
        }

        payload = {
          paymentIntentId: session.metadata?.paymentIntentId,
          session_id: session.id,
        };
      }
      const intentId = String(
        payload.paymentIntentId ||
          payload.transaction_uuid ||
          payload.purchase_order_id ||
          '',
      );
      const providerReference = String(
        payload.session_id || payload.pidx || payload.transaction_uuid || '',
      );
      if (!providerReference || (provider !== 'STRIPE' && !intentId)) {
        return res.status(400).json({ error: 'Invalid payment callback' });
      }

      const service = createConfiguredPaymentProviderService();
      const result = intentId
        ? await service.confirmPayment(
            intentId,
            providerReference,
            undefined,
            provider as 'STRIPE' | 'ESEWA' | 'KHALTI',
          )
        : await service.confirmPaymentByProviderReference(
            providerReference,
            undefined,
            provider as 'STRIPE' | 'ESEWA' | 'KHALTI',
          );
      return res.status(200).json({
        paymentIntentId: result.intent.id,
        status: result.intent.status,
      });
    } catch (error) {
      return next(error);
    }
  });

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
  app.use(
    '/api/auth',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        // Convert Express request to Web Standard Request
        const url = new URL(req.url, `${req.protocol}://${req.get('host')}`);
        const webRequest = new globalThis.Request(url, {
          method: req.method,
          headers: req.headers as Record<string, string>,
          body: ['GET', 'HEAD'].includes(req.method)
            ? undefined
            : JSON.stringify(req.body),
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
    },
  );

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
