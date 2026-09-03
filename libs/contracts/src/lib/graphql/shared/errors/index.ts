import { readGraphQLFile } from '../../read-graphql';

export const errorsTypeDefs = readGraphQLFile(import.meta.url, 'errors.graphql');
