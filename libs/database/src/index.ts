// ===================================================================
// DATABASE LIBRARY - PUBLIC API
// ===================================================================
// Main export point for the database library. Provides Prisma client
// and all generated types for use throughout the application.
// ===================================================================

// Prisma Client
export * from './client.js';

// Repositories
export * from './repositories/index.js';
export { prisma as db } from './client.js';
