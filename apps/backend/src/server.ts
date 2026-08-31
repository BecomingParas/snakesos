/**
 * Apollo Server Setup
 * Creates and configures Apollo Server with GraphQL schema
 */

import { expressMiddleware } from '@as-integrations/express5';
import type { Express, Request, Response } from 'express';
import { createLogger } from '@snake-rescue/shared';
import {
  createApolloServer,
  buildContext,
  type GraphQLContext,
} from '@snake-rescue/core';
import {
  authResolvers,
  rescueQueryResolvers,
  rescueMutationResolvers,
  analyticsResolvers,
  paymentsResolvers,
  hospitalQueryResolvers,
  hospitalMutationResolvers,
  hospitalSubscriptionResolvers,
  mapQueryResolvers,
  settingsResolvers,
  notificationResolvers,
  volunteerResolvers,
  mediaResolvers,
  emergencyContactResolvers,
  cmsResolvers,
  snakeIdentificationResolvers,
} from '@snake-rescue/backend/modules';
import { config } from './config/index.js';

const logger = createLogger('Server');

/**
 * Setup Apollo Server and integrate with Express
 */
export async function setupApolloServer(app: Express) {
  // Combine all resolvers into an array for merging
  const resolvers = [
    authResolvers,
    rescueQueryResolvers,
    rescueMutationResolvers,
    analyticsResolvers,
    paymentsResolvers,
    hospitalQueryResolvers,
    hospitalMutationResolvers,
    hospitalSubscriptionResolvers,
    mapQueryResolvers,
    settingsResolvers,
    notificationResolvers,
    volunteerResolvers,
    mediaResolvers,
    emergencyContactResolvers,
    cmsResolvers,
    snakeIdentificationResolvers,
  ];

  // Create Apollo Server with schema and resolvers
  const server = createApolloServer(resolvers);

  // Start Apollo Server
  await server.start();
  logger.info('Apollo Server started');

  // Apply Apollo middleware to Express
  app.use(
    config.graphqlPath,
    expressMiddleware(server as any, {
      context: async ({
        req,
        res,
      }: {
        req: Request;
        res: Response;
      }): Promise<GraphQLContext> => {
        // Use buildContext to create fully-featured context with loaders, permissions, etc.
        return await buildContext({ req, res });
      },
    }),
  );

  logger.info(`GraphQL endpoint: ${config.graphqlPath}`);

  if (config.graphqlPlayground) {
    logger.info(
      `GraphQL Playground: http://${config.host}:${config.port}${config.graphqlPath}`,
    );
  }

  return server;
}
