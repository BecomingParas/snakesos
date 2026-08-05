/**
 * Apollo Server Setup
 * Creates and configures the Apollo Server instance
 */

import { ApolloServer } from '@apollo/server';
import type { GraphQLContext } from '../context/index.js';
import { createApolloConfig } from './config.js';
import { createGraphQLSchema } from './schema.js';
import { logger } from '@snake-rescue/shared';

/**
 * Create Apollo Server instance
 * @param resolvers - Resolvers from feature modules
 */
export function createApolloServer(resolvers: any[] = []): ApolloServer<GraphQLContext> {
  // Create GraphQL schema with resolvers
  const schema = createGraphQLSchema(resolvers);

  // Create Apollo configuration
  const config = createApolloConfig(schema);

  // Create Apollo Server
  const server = new ApolloServer<GraphQLContext>(config);

  logger.info('Apollo Server created successfully');

  return server;
}
