// ===================================================================
// CONTRACTS LIBRARY - PUBLIC API
// ===================================================================
// Shared contracts for GraphQL API
// Used by both frontend (Apollo Client) and backend (Apollo Server)
// ===================================================================

export * from './lib/graphql/index.js';

// ===================================================================
// GENERATED TYPES
// ===================================================================
// Server-side GraphQL types generated from schema.
// These are used by the backend resolvers.
export * from './generated/resolvers-types.js';
export * from './generated/fragment-matcher.js';

// Note: graphql-operations.js is NOT exported to avoid type conflicts.
// Frontend should use manual hooks from @snake-rescue/features instead.
