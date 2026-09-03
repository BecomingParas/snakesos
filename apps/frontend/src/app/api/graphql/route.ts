/**
 * GraphQL API Route (Vercel Serverless)
 * 
 * This file converts the Express + Apollo Server backend
 * to a Next.js API route compatible with Vercel serverless functions.
 * 
 * Architecture:
 * - Uses @as-integrations/next for Next.js integration
 * - Maintains existing resolvers and schema
 * - Implements proper context building
 * - Handles authentication via Better Auth
 */

import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { NextRequest, NextResponse } from 'next/server';
import { createApolloServer, buildContext } from '@snake-rescue/core';
import {
  authResolvers,
  rescueQueryResolvers,
  rescueMutationResolvers,
  analyticsResolvers,
  paymentsResolvers,
  hospitalQueryResolvers,
  hospitalMutationResolvers,
  hospitalSubscriptionResolvers,
  mapQueryResolvers,
  settingsResolvers,
  notificationResolvers,
  volunteerResolvers,
  mediaResolvers,
  emergencyContactResolvers,
  cmsResolvers,
  snakeIdentificationResolvers,
} from '@snake-rescue/modules';

// Combine all resolvers (same as backend/src/server.ts)
const resolvers = [
  authResolvers,
  rescueQueryResolvers,
  rescueMutationResolvers,
  analyticsResolvers,
  paymentsResolvers,
  hospitalQueryResolvers,
  hospitalMutationResolvers,
  hospitalSubscriptionResolvers,
  mapQueryResolvers,
  settingsResolvers,
  notificationResolvers,
  volunteerResolvers,
  mediaResolvers,
  emergencyContactResolvers,
  cmsResolvers,
  snakeIdentificationResolvers,
];

// Create Apollo Server instance
const server = createApolloServer(resolvers);

// Start server (required for Apollo Server 4+)
await server.start();

// Create Next.js request handler
const handler = startServerAndCreateNextHandler(server, {
  context: async (req) => {
    // Adapt Next.js request to Express-like request/response
    // This allows us to reuse the existing buildContext function
    
    // Create a mock Express-like request object
    const mockReq = {
      headers: Object.fromEntries(req.headers.entries()),
      method: req.method,
      url: req.url,
      // Better Auth will populate these from cookies
      user: null,
      session: null,
    } as any;

    // Create a mock Express-like response object
    const mockRes = {
      setHeader: () => {},
      status: () => mockRes,
      json: () => mockRes,
    } as any;

    // Build context using existing context builder
    return await buildContext({ req: mockReq, res: mockRes });
  },
});

// Export POST handler (GraphQL only uses POST)
export async function POST(request: NextRequest) {
  try {
    return await handler(request);
  } catch (error) {
    console.error('[GraphQL API Error]:', error);
    return NextResponse.json(
      {
        errors: [
          {
            message: 'Internal server error',
            extensions: {
              code: 'INTERNAL_SERVER_ERROR',
            },
          },
        ],
      },
      { status: 500 }
    );
  }
}

// Export GET handler for GraphQL Playground (development only)
export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      {
        message: 'GraphQL Playground is disabled in production',
        endpoint: '/api/graphql',
      },
      { status: 403 }
    );
  }

  // In development, Apollo Server 4 has built-in playground
  // accessible via Apollo Sandbox or GraphQL Playground browser extension
  return NextResponse.json({
    message: 'GraphQL API is running',
    endpoint: '/api/graphql',
    playground: 'Use Apollo Sandbox: https://studio.apollographql.com/sandbox',
  });
}

// Export runtime configuration for Vercel
export const runtime = 'nodejs'; // Use Node.js runtime (not Edge)
export const dynamic = 'force-dynamic'; // Disable static optimization
export const maxDuration = 60; // Maximum execution time (seconds) - adjust based on plan
