// ===================================================================
// PRISMA DATABASE CLIENT WITH DRIVER ADAPTER
// ===================================================================
// Singleton Prisma Client instance using Prisma 7 Driver Adapter
// for PostgreSQL with proper connection pooling and error handling.
//
// Prisma 7 Migration:
// - Uses @prisma/adapter-pg for PostgreSQL connections
// - Connection URL configured via environment variable
// - Singleton pattern for application-wide database access
// ===================================================================

import {
  PrismaClient,
  Prisma as PrismaTypes,
} from './prisma/generated/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Get database URL from environment
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    'DATABASE_URL environment variable is not set. Please configure it in your .env file.',
  );
}

// Create Prisma PostgreSQL adapter directly with connection string
// This avoids Pool type conflicts between workspace and package node_modules
const adapter = new PrismaPg(databaseUrl);

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

// Graceful shutdown handlers
const cleanup = async () => {
  await prisma.$disconnect();
};

process.on('beforeExit', cleanup);
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

// Export Prisma types
export * from './prisma/generated/client.js';
export { Prisma } from './prisma/generated/client.js';
