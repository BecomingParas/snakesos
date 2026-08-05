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

import { PrismaClient, Prisma as PrismaTypes } from '@prisma/client';
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
    'DATABASE_URL environment variable is not set. Please configure it in your .env file.'
  );
}

// Create PostgreSQL connection pool (singleton)
const pool = global.pgPool || new Pool({ connectionString: databaseUrl });

if (process.env.NODE_ENV !== 'production') {
  global.pgPool = pool;
}

// Create Prisma PostgreSQL adapter
const adapter = new PrismaPg(pool);

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
export const prisma =
  global.prisma || new PrismaClient(prismaClientOptions);

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Graceful shutdown handlers
const cleanup = async () => {
  await prisma.$disconnect();
  await pool.end();
};

process.on('beforeExit', cleanup);
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

// Export Prisma types
export * from '@prisma/client';
export type { Prisma } from '@prisma/client';

// Export pool for advanced use cases
export { pool };
