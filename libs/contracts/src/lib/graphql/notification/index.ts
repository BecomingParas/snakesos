// ===================================================================
// NOTIFICATION - MODULE EXPORTS
// ===================================================================

import { readGraphQLFile } from '../read-graphql.js';

// Read all GraphQL files
const readGraphQL = (filename: string) =>
  readGraphQLFile(import.meta.url, filename);

export const notificationEnums = readGraphQL('enums.graphql');
export const notificationSchema = readGraphQL('schema.graphql');
export const notificationInputs = readGraphQL('inputs.graphql');
export const notificationQueries = readGraphQL('queries.graphql');
export const notificationMutations = readGraphQL('mutations.graphql');
export const notificationSubscriptions = readGraphQL('subscriptions.graphql');
export const notificationFragments = readGraphQL('fragments.graphql');

// Combine all notification type definitions
export const notificationTypeDefs = [
  notificationEnums,
  notificationSchema,
  notificationInputs,
  notificationQueries,
  notificationMutations,
  notificationSubscriptions,
  notificationFragments,
].join('\n\n');

// Export operations for code generation
export const notificationOperations = {
  queries: notificationQueries,
  mutations: notificationMutations,
  subscriptions: notificationSubscriptions,
};

// Export fragments for reuse
export const notificationFragmentDefinitions = notificationFragments;
