/**
 * Better Auth API Routes (Vercel Serverless)
 * 
 * This catch-all route handles all Better Auth endpoints:
 * - /api/auth/sign-in
 * - /api/auth/sign-up
 * - /api/auth/sign-out
 * - /api/auth/session
 * - /api/auth/verify-email
 * - And all other Better Auth endpoints
 * 
 * Better Auth automatically handles these routes based on the
 * configuration in libs/auth/src/lib/authentication/config/better-auth.config.ts
 */

import { auth } from '@snake-rescue/auth';
import { toNextJsHandler } from 'better-auth/next-js';

// Export Better Auth handler for Next.js
export const { GET, POST } = toNextJsHandler(auth);

// Export runtime configuration for Vercel
export const runtime = 'nodejs'; // Use Node.js runtime
export const dynamic = 'force-dynamic'; // Disable caching for auth endpoints
