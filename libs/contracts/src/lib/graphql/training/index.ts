// ===================================================================
// TRAINING - MODULE EXPORTS
// ===================================================================

import { readGraphQLFile } from '../read-graphql.js';

// Read all GraphQL files
const readGraphQL = (filename: string) =>
  readGraphQLFile(import.meta.url, filename);

export const trainingEnums = readGraphQL('enums.graphql');
export const trainingSchema = readGraphQL('schema.graphql');
export const trainingInputs = readGraphQL('inputs.graphql');
export const trainingQueries = readGraphQL('queries.graphql');
export const trainingMutations = readGraphQL('mutations.graphql');
export const trainingSubscriptions = readGraphQL('subscriptions.graphql');
export const trainingFragments = readGraphQL('fragments.graphql');

// Combine all training type definitions
export const trainingTypeDefs = [
  trainingEnums,
  trainingSchema,
  trainingInputs,
  trainingQueries,
  trainingMutations,
  trainingSubscriptions,
  trainingFragments,
].join('\n\n');

// Export operations for code generation
export const trainingOperations = {
  queries: trainingQueries,
  mutations: trainingMutations,
  subscriptions: trainingSubscriptions,
};

// Export fragments for reuse
export const trainingFragmentDefinitions = trainingFragments;
