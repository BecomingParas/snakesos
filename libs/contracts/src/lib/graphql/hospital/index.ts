/**
 * Hospital GraphQL Schema Exports
 * 
 * Hospital and antivenom availability management
 */

import { readGraphQLFile } from '../read-graphql.js';

const readGraphQL = (filename: string) =>
  readGraphQLFile(import.meta.url, filename);

export const hospitalEnums = readGraphQL('enums.graphql');
export const hospitalSchema = readGraphQL('schema.graphql');
export const hospitalInputs = readGraphQL('inputs.graphql');
export const hospitalQueries = readGraphQL('queries.graphql');
export const hospitalMutations = readGraphQL('mutations.graphql');
export const hospitalSubscriptions = readGraphQL('subscriptions.graphql');
export const hospitalFragments = readGraphQL('fragments.graphql');

export const hospitalTypeDefs = [
  hospitalEnums,
  hospitalSchema,
  hospitalInputs,
  hospitalQueries,
  hospitalMutations,
  hospitalSubscriptions,
  hospitalFragments,
].join('\n\n');
