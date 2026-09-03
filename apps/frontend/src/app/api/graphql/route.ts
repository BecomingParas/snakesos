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

// Log database connection status
console.log('[GraphQL API] Initializing with DATABASE_URL:', process.env.DATABASE_URL ? 'SET ✓' : 'NOT SET ✗');
console.log('[GraphQL API] DIRECT_URL:', process.env.DIRECT_URL ? 'SET ✓' : 'NOT SET ✗');
console.log('[GraphQL API] Node environment:', process.env.NODE_ENV);

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

// Create Apollo Server instance (singleton pattern)
let serverPromise: Promise<any> | null = null;
let handler: any = null;

async function getHandler() {
  if (handler) {
    return handler;
  }

  if (!serverPromise) {
    serverPromise = (async () => {
      try {
        console.log('[GraphQL API] Creating Apollo Server...');
        const server = createApolloServer(resolvers);
        
        console.log('[GraphQL API] Starting Apollo Server...');
        await server.start();
        console.log('[GraphQL API] Apollo Server started successfully ✓');
        
        return server;
      } catch (error) {
        console.error('[GraphQL API] FATAL ERROR during initialization:', error);
        serverPromise = null; // Reset on error to allow retry
        throw error;
      }
    })();
  }

  const server = await serverPromise;

  if (!handler) {
    handler = startServerAndCreateNextHandler(server, {
      context: async (req) => {
        // Adapt Next.js request to Express-like request/response
        // This allows us to reuse the existing buildContext function
        
        // Import Better Auth
        const { auth } = await import('@snake-rescue/auth');
        
        // Get session from Better Auth using the request
        // Better Auth will check cookies and bearer tokens
        let user = null;
        let session = null;
        
        try {
          // Create a Request object from the Next.js request for Better Auth
          const url = new URL(req.url || 'http://localhost/api/graphql');
          const request = new Request(url, {
            method: req.method,
            headers: req.headers instanceof Headers 
              ? req.headers 
              : new Headers(Object.entries(req.headers as any)),
          });
          
          // Get session from Better Auth
          const betterAuthSession = await auth.api.getSession({ headers: request.headers });
          
          if (betterAuthSession?.user && betterAuthSession?.session) {
            user = betterAuthSession.user;
            session = betterAuthSession.session;
            console.log('[GraphQL API] Authenticated user:', user.email);
          }
        } catch (error) {
          // Session validation failed - this is OK, user is just not authenticated
          console.log('[GraphQL API] No valid session found');
        }
        
        // Create a mock Express-like request object
        const mockReq = {
          headers: req.headers instanceof Headers 
            ? Object.fromEntries(req.headers.entries())
            : req.headers,
          method: req.method,
          url: req.url,
          user,
          session,
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
    console.log('[GraphQL API] Request handler created successfully ✓');
  }

  return handler;
}

// CORS headers configuration
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // In production, replace with your domain
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, apollo-require-preflight',
  'Access-Control-Allow-Credentials': 'true',
};

// Handle CORS preflight requests
export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

// Export POST handler (GraphQL only uses POST)
export async function POST(request: NextRequest) {
  console.log('[GraphQL API] POST request received');
  
  try {
    console.log('[GraphQL API] Getting handler...');
    const requestHandler = await getHandler();
    console.log('[GraphQL API] Handler obtained');
    
    if (!requestHandler) {
      console.error('[GraphQL API] Handler not initialized!');
      return NextResponse.json(
        {
          errors: [
            {
              message: 'GraphQL server is not initialized',
              extensions: {
                code: 'SERVER_NOT_INITIALIZED',
              },
            },
          ],
        },
        { status: 500, headers: corsHeaders }
      );
    }

    console.log('[GraphQL API] Calling handler...');
    const response = await requestHandler(request);
    console.log('[GraphQL API] Handler completed successfully');
    
    // Add CORS headers to the response
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    
    return response;
  } catch (error) {
    console.error('[GraphQL API] Request error:', error);
    console.error('[GraphQL API] Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.error('[GraphQL API] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    return NextResponse.json(
      {
        errors: [
          {
            message: error instanceof Error ? error.message : 'Internal server error',
            extensions: {
              code: 'INTERNAL_SERVER_ERROR',
              details: error instanceof Error ? error.message : String(error),
            },
          },
        ],
      },
      { status: 500, headers: corsHeaders }
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
      { status: 403, headers: corsHeaders }
    );
  }

  // In development, Apollo Server 4 has built-in playground
  // accessible via Apollo Sandbox or GraphQL Playground browser extension
  return NextResponse.json({
    message: 'GraphQL API is running',
    endpoint: '/api/graphql',
    playground: 'Use Apollo Sandbox: https://studio.apollographql.com/sandbox',
  }, { headers: corsHeaders });
}

// Export runtime configuration for Vercel
export const runtime = 'nodejs'; // Use Node.js runtime (not Edge)
export const dynamic = 'force-dynamic'; // Disable static optimization
export const maxDuration = 60; // Maximum execution time (seconds) - adjust based on plan
