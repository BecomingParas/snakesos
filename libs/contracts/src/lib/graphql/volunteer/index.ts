// ===================================================================
// VOLUNTEER - MODULE EXPORTS
// ===================================================================

import { readGraphQLFile } from '../read-graphql';

// Read all GraphQL files
const readGraphQL = (filename: string) =>
  readGraphQLFile(import.meta.url, filename);

export const volunteerEnums = readGraphQL('enums.graphql');
export const volunteerSchema = readGraphQL('schema.graphql');
export const volunteerInputs = readGraphQL('inputs.graphql');
export const volunteerQueries = readGraphQL('queries.graphql');
export const volunteerMutations = readGraphQL('mutations.graphql');
export const volunteerSubscriptions = readGraphQL('subscriptions.graphql');
export const volunteerFragments = readGraphQL('fragments.graphql');

// Combine all volunteer type definitions
export const volunteerTypeDefs = [
  volunteerEnums,
  volunteerSchema,
  volunteerInputs,
  volunteerQueries,
  volunteerMutations,
  volunteerSubscriptions,
  volunteerFragments,
].join('\n\n');

// Export operations for code generation
export const volunteerOperations = {
  queries: volunteerQueries,
  mutations: volunteerMutations,
  subscriptions: volunteerSubscriptions,
};

// Export fragments for reuse
export const volunteerFragmentDefinitions = volunteerFragments;
