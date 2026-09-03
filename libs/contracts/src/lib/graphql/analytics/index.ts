// ===================================================================
// ANALYTICS - MODULE EXPORTS
// ===================================================================

import { readGraphQLFile } from '../read-graphql';

// Read all GraphQL files
const readGraphQL = (filename: string) =>
  readGraphQLFile(import.meta.url, filename);

export const analyticsSchema = readGraphQL('schema.graphql');
export const analyticsInputs = readGraphQL('inputs.graphql');
export const analyticsQueries = readGraphQL('queries.graphql');
export const analyticsMutations = readGraphQL('mutations.graphql');
export const analyticsSubscriptions = readGraphQL('subscriptions.graphql');
export const analyticsFragments = readGraphQL('fragments.graphql');

// Combine all analytics type definitions
export const analyticsTypeDefs = [
  analyticsSchema,
  analyticsInputs,
  analyticsQueries,
  analyticsMutations,
  analyticsSubscriptions,
  analyticsFragments,
].join('\n\n');

// Export operations for code generation
export const analyticsOperations = {
  queries: analyticsQueries,
  mutations: analyticsMutations,
  subscriptions: analyticsSubscriptions,
};

// Export fragments for reuse
export const analyticsFragmentDefinitions = analyticsFragments;
