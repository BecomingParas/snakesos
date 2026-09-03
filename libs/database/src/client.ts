// ===================================================================
// PRISMA DATABASE CLIENT WITH DRIVER ADAPTER (SERVERLESS OPTIMIZED)
// ===================================================================
// Singleton Prisma Client instance using Prisma 7 Driver Adapter
// for PostgreSQL with proper connection pooling and error handling.
//
// Serverless Optimization:
// - Uses @prisma/adapter-pg with pg.Pool for connection pooling
// - Optimized pool settings for Vercel serverless functions
// - Singleton pattern prevents connection exhaustion
// - Automatic cleanup on process termination
// ===================================================================

import {
  PrismaClient,
  Prisma as PrismaTypes,
} from './prisma/generated/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
  // eslint-disable-next-line no-var
  var pgPool: Pool | undefined;
}

// Get database URL from environment
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    'DATABASE_URL environment variable is not set. Please configure it in your .env file.',
  );
}

// Create or reuse PostgreSQL connection pool (singleton)
// Pool settings optimized for serverless environments
const pgPool =
  global.pgPool ||
  new Pool({
    connectionString: databaseUrl,
    max: 10, // Maximum pool size (Neon free tier handles this well)
    idleTimeoutMillis: 30000, // Close idle connections after 30s
    connectionTimeoutMillis: 5000, // Timeout after 5s if pool is exhausted
    allowExitOnIdle: false, // Keep pool alive in serverless
  });

// Store pool globally to prevent multiple instances
if (process.env.NODE_ENV !== 'production') {
  global.pgPool = pgPool;
}

// Create Prisma PostgreSQL adapter with connection pool
const adapter = new PrismaPg(pgPool);

// Prisma Client Options
const prismaClientOptions: PrismaTypes.PrismaClientOptions = {
  adapter,
  log:
    process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error'],
  errorFormat: 'pretty',
};

// Create singleton Prisma Client instance
export const prisma = global.prisma || new PrismaClient(prismaClientOptions);

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Graceful shutdown handlers (disabled for serverless - Vercel handles this)
// In serverless environments, connections are automatically cleaned up
// Running cleanup handlers can cause "Called end on pool more than once" errors
// during build when Next.js pre-renders pages

// const cleanup = async () => {
//   await prisma.$disconnect();
//   await pgPool.end();
// };

// process.on('beforeExit', cleanup);
// process.on('SIGINT', cleanup);
// process.on('SIGTERM', cleanup);

// Export Prisma types
export * from './prisma/generated/client';
export { Prisma } from './prisma/generated/client';

// Export connection pool for monitoring (optional)
export { pgPool };
