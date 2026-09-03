// ===================================================================
// AUTH - MODULE EXPORTS
// ===================================================================

import { readGraphQLFile } from '../read-graphql';

// Read all GraphQL files
const readGraphQL = (filename: string) =>
  readGraphQLFile(import.meta.url, filename);

export const authEnums = readGraphQL('enums.graphql');
export const authSchema = readGraphQL('schema.graphql');
export const authInputs = readGraphQL('inputs.graphql');
export const authQueriesSchema = readGraphQL('queries-schema.graphql');
export const authMutationsSchema = readGraphQL('mutations-schema.graphql');
export const authSubscriptions = readGraphQL('subscriptions.graphql');

// Combine all auth type definitions for backend
export const authTypeDefs = [
  authEnums,
  authSchema,
  authInputs,
  authQueriesSchema,
  authMutationsSchema,
  authSubscriptions,
].join('\n\n');
