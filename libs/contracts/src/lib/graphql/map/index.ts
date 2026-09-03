/**
 * Map GraphQL Schema Exports
 * 
 * Geospatial intelligence platform queries and types
 */

import { readGraphQLFile } from '../read-graphql';

const readGraphQL = (filename: string) =>
  readGraphQLFile(import.meta.url, filename);

export const mapSchema = readGraphQL('schema.graphql');
export const mapQueries = readGraphQL('queries.graphql');

export const mapTypeDefs = [
  mapSchema,
  mapQueries,
].join('\n\n');
