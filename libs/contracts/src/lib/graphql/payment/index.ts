// ===================================================================
// PAYMENT - MODULE EXPORTS
// ===================================================================

import { readGraphQLFile } from '../read-graphql.js';

// Read all GraphQL files
const readGraphQL = (filename: string) =>
  readGraphQLFile(import.meta.url, filename);

export const paymentEnums = readGraphQL('enums.graphql');
export const paymentSchema = readGraphQL('schema.graphql');
export const paymentInputs = readGraphQL('inputs.graphql');
export const paymentQueries = readGraphQL('queries.graphql');
export const paymentMutations = readGraphQL('mutations.graphql');
export const paymentSubscriptions = readGraphQL('subscriptions.graphql');
export const paymentFragments = readGraphQL('fragments.graphql');

// Combine all payment type definitions
export const paymentTypeDefs = [
  paymentEnums,
  paymentSchema,
  paymentInputs,
  paymentQueries,
  paymentMutations,
  paymentSubscriptions,
  paymentFragments,
].join('\n\n');

// Export operations for code generation
export const paymentOperations = {
  queries: paymentQueries,
  mutations: paymentMutations,
  subscriptions: paymentSubscriptions,
};

// Export fragments for reuse
export const paymentFragmentDefinitions = paymentFragments;
