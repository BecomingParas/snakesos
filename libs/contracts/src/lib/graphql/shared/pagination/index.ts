import { readGraphQLFile } from '../../read-graphql.js';

export const paginationTypeDefs = readGraphQLFile(
  import.meta.url,
  'pagination.graphql'
);
