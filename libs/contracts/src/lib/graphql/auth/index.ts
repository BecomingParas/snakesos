// ===================================================================
// AUTH - MODULE EXPORTS
// ===================================================================

import { readGraphQLFile } from '../read-graphql.js';

// Read all GraphQL files
const readGraphQL = (filename: string) =>
  readGraphQLFile(import.meta.url, filename);

export const authEnums = readGraphQL('enums.graphql');
export const authSchema = readGraphQL('schema.graphql');
export const authInputs = readGraphQL('inputs.graphql');
export const authQueries = readGraphQL('queries.graphql');
export const authMutations = readGraphQL('mutations.graphql');
export const authSubscriptions = readGraphQL('subscriptions.graphql');
export const authFragments = readGraphQL('fragments.graphql');

// Combine all auth type definitions
export const authTypeDefs = [
  authEnums,
  authSchema,
  authInputs,
  authQueries,
  authMutations,
  authSubscriptions,
  authFragments,
].join('\n\n');

// Export operations for code generation
export const authOperations = {
  queries: authQueries,
  mutations: authMutations,
  subscriptions: authSubscriptions,
};

// Export fragments for reuse
export const authFragmentDefinitions = authFragments;
