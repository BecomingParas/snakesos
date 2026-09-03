import { readGraphQLFile } from '../../read-graphql';

export const scalarsTypeDefs = readGraphQLFile(
  import.meta.url,
  'scalars.graphql'
);
