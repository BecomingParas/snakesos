// ===================================================================
// SNAKE - MODULE EXPORTS
// ===================================================================

import { readGraphQLFile } from '../read-graphql.js';

// Read all GraphQL files
const readGraphQL = (filename: string) =>
  readGraphQLFile(import.meta.url, filename);

export const snakeEnums = readGraphQL('enums.graphql');
export const snakeSchema = readGraphQL('schema.graphql');
export const snakeInputs = readGraphQL('inputs.graphql');
export const snakeQueries = readGraphQL('queries.graphql');
export const snakeMutations = readGraphQL('mutations.graphql');
export const snakeSubscriptions = readGraphQL('subscriptions.graphql');
export const snakeFragments = readGraphQL('fragments.graphql');

// Combine all snake type definitions
export const snakeTypeDefs = [
  snakeEnums,
  snakeSchema,
  snakeInputs,
  snakeQueries,
  snakeMutations,
  snakeSubscriptions,
  snakeFragments,
].join('\n\n');

// Export operations for code generation
export const snakeOperations = {
  queries: snakeQueries,
  mutations: snakeMutations,
  subscriptions: snakeSubscriptions,
};

// Export fragments for reuse
export const snakeFragmentDefinitions = snakeFragments;
