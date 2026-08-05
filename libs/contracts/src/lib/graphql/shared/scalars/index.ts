import { readGraphQLFile } from '../../read-graphql.js';

export const scalarsTypeDefs = readGraphQLFile(
  import.meta.url,
  'scalars.graphql'
);
