import { readGraphQLFile } from '../../read-graphql';

export const paginationTypeDefs = readGraphQLFile(
  import.meta.url,
  'pagination.graphql'
);
