import { readGraphQLFile } from '../../read-graphql';

export const responsesTypeDefs = readGraphQLFile(
  import.meta.url,
  'responses.graphql'
);
