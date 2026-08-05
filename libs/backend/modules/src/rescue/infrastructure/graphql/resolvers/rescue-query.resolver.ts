/**
 * Rescue Query Resolvers
 * Read operations for rescue requests
 */

import { GraphQLContext } from '@snake-rescue/core';
import { prisma, RescueRepository } from '@snake-rescue/database';
import { GetRescueQuery } from '../../../application/queries/get-rescue.query.js';
import { ListRescuesQuery } from '../../../application/queries/list-rescues.query.js';

export const rescueQueryResolvers = {
  Query: {
    /**
     * Get a single rescue request by ID
     */
    rescueRequest: async (_parent: any, args: { id: string }, context: GraphQLContext) => {
      // Authentication required
      context.requireAuth();

      // Execute query
      const rescueRepository = new RescueRepository(prisma);
      const query = new GetRescueQuery(rescueRepository);
      const rescue = await query.execute(args.id);

      return rescue;
    },

    /**
     * List rescue requests with filters and pagination
     */
    rescueRequests: async (
      _parent: any,
      args: {
        filter?: {
          status?: any;
          municipality?: string;
          volunteerId?: string;
        };
        pagination?: {
          page?: number;
          limit?: number;
        };
      },
      context: GraphQLContext
    ) => {
      // Authentication required
      context.requireAuth();

      // Execute query
      const rescueRepository = new RescueRepository(prisma);
      const query = new ListRescuesQuery(rescueRepository);
      const result = await query.execute(args.filter as any, args.pagination);

      return result;
    },

    /**
     * Get rescue statistics
     */
    rescueStats: async (_parent: any, _args: any, context: GraphQLContext) => {
      // Admin only
      context.requireAuth();
      // TODO: Add permission check for admin

      const rescueRepository = new RescueRepository(prisma);
      const stats = await rescueRepository.getStatistics();

      return stats;
    },
  },
};
