import { readGraphQLFile } from '../../read-graphql.js';

export const directivesTypeDefs = readGraphQLFile(
  import.meta.url,
  'directives.graphql'
);
