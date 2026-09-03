// ===================================================================
// DATABASE LIBRARY - PUBLIC API
// ===================================================================
// Main export point for the database library. Provides Prisma client
// and all generated types for use throughout the application.
// ===================================================================

// Prisma Client
export * from './client';

// Repositories
export * from './repositories/index';
export { prisma as db } from './client';
