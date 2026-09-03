import { readGraphQLFile } from '../../read-graphql';

export const directivesTypeDefs = readGraphQLFile(
  import.meta.url,
  'directives.graphql'
);
