// ===================================================================
// CONTACT - MODULE EXPORTS
// ===================================================================

import { readGraphQLFile } from '../read-graphql';

// Read all GraphQL files
const readGraphQL = (filename: string) =>
  readGraphQLFile(import.meta.url, filename);

export const contactEnums = readGraphQL('enums.graphql');
export const contactSchema = readGraphQL('schema.graphql');
export const contactInputs = readGraphQL('inputs.graphql');
export const contactQueries = readGraphQL('queries.graphql');
export const contactMutations = readGraphQL('mutations.graphql');
export const contactSubscriptions = readGraphQL('subscriptions.graphql');
export const contactFragments = readGraphQL('fragments.graphql');

// Combine all contact type definitions
export const contactTypeDefs = [
  contactEnums,
  contactSchema,
  contactInputs,
  contactQueries,
  contactMutations,
  contactSubscriptions,
  contactFragments,
].join('\n\n');

// Export operations for code generation
export const contactOperations = {
  queries: contactQueries,
  mutations: contactMutations,
  subscriptions: contactSubscriptions,
};

// Export fragments for reuse
export const contactFragmentDefinitions = contactFragments;
