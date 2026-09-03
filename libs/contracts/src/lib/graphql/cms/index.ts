// ===================================================================
// CMS - MODULE EXPORTS
// ===================================================================

import { readGraphQLFile } from '../read-graphql';

// Read all GraphQL files
const readGraphQL = (filename: string) =>
  readGraphQLFile(import.meta.url, filename);

export const cmsEnums = readGraphQL('enums.graphql');
export const cmsSchema = readGraphQL('schema.graphql');
export const cmsInputs = readGraphQL('inputs.graphql');
export const cmsQueries = readGraphQL('queries.graphql');
export const cmsMutations = readGraphQL('mutations.graphql');
export const cmsSubscriptions = readGraphQL('subscriptions.graphql');
export const cmsFragments = readGraphQL('fragments.graphql');

// Combine all CMS type definitions
export const cmsTypeDefs = [
  cmsEnums,
  cmsSchema,
  cmsInputs,
  cmsQueries,
  cmsMutations,
  cmsSubscriptions,
  cmsFragments,
].join('\n\n');

// Export operations for code generation
export const cmsOperations = {
  queries: cmsQueries,
  mutations: cmsMutations,
  subscriptions: cmsSubscriptions,
};

// Export fragments for reuse
export const cmsFragmentDefinitions = cmsFragments;
