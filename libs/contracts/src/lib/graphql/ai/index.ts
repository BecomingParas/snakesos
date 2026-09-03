// ===================================================================
// AI - MODULE EXPORTS
// ===================================================================

import { readGraphQLFile } from '../read-graphql';

// Read all GraphQL files
const readGraphQL = (filename: string) =>
  readGraphQLFile(import.meta.url, filename);

export const aiEnums = readGraphQL('enums.graphql');
export const aiSchema = readGraphQL('schema.graphql');
export const aiInputs = readGraphQL('inputs.graphql');
export const aiQueries = readGraphQL('queries.graphql');
export const aiMutations = readGraphQL('mutations.graphql');
export const aiSubscriptions = readGraphQL('subscriptions.graphql');
export const aiFragments = readGraphQL('fragments.graphql');

// Combine all AI type definitions
export const aiTypeDefs = [
  aiEnums,
  aiSchema,
  aiInputs,
  aiQueries,
  aiMutations,
  aiSubscriptions,
  aiFragments,
].join('\n\n');

// Export operations for code generation
export const aiOperations = {
  queries: aiQueries,
  mutations: aiMutations,
  subscriptions: aiSubscriptions,
};

// Export fragments for reuse
export const aiFragmentDefinitions = aiFragments;
