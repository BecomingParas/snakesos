import { readGraphQLFile } from '../../read-graphql.js';

export const errorsTypeDefs = readGraphQLFile(import.meta.url, 'errors.graphql');
