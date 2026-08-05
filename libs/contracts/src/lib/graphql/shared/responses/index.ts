import { readGraphQLFile } from '../../read-graphql.js';

export const responsesTypeDefs = readGraphQLFile(
  import.meta.url,
  'responses.graphql'
);
