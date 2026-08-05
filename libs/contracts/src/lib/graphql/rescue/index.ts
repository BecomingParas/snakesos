// ===================================================================
// RESCUE - MODULE EXPORTS
// ===================================================================

import { readGraphQLFile } from '../read-graphql.js';

// Read all GraphQL files
const readGraphQL = (filename: string) =>
  readGraphQLFile(import.meta.url, filename);

export const rescueEnums = readGraphQL('enums.graphql');
export const rescueSchema = readGraphQL('schema.graphql');
export const rescueInputs = readGraphQL('inputs.graphql');
export const rescueQueries = readGraphQL('queries.graphql');
export const rescueMutations = readGraphQL('mutations.graphql');
export const rescueSubscriptions = readGraphQL('subscriptions.graphql');
export const rescueFragments = readGraphQL('fragments.graphql');

// Combine all rescue type definitions
export const rescueTypeDefs = [
  rescueEnums,
  rescueSchema,
  rescueInputs,
  rescueQueries,
  rescueMutations,
  rescueSubscriptions,
  rescueFragments,
].join('\n\n');

// Export operations for code generation
export const rescueOperations = {
  queries: rescueQueries,
  mutations: rescueMutations,
  subscriptions: rescueSubscriptions,
};

// Export fragments for reuse
export const rescueFragmentDefinitions = rescueFragments;
