import { readGraphQLFile } from '../read-graphql.js';

const readGraphQL = (filename: string) =>
  readGraphQLFile(import.meta.url, filename);

export const mediaTypeDefs = [
  readGraphQL('enums.graphql'),
  readGraphQL('schema.graphql'),
  readGraphQL('inputs.graphql'),
  readGraphQL('queries.graphql'),
  readGraphQL('mutations.graphql'),
].join('\n\n');
