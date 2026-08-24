import { readGraphQLFile } from '../read-graphql.js';

const readGraphQL = (filename: string) =>
  readGraphQLFile(import.meta.url, filename);

export const settingsTypeDefs = [
  readGraphQL('schema.graphql'),
  readGraphQL('inputs.graphql'),
  readGraphQL('queries.graphql'),
  readGraphQL('mutations.graphql'),
].join('\n\n');
