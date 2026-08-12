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
      context.requireRole(['ADMIN', 'SUPER_ADMIN']);

      const rescueRepository = new RescueRepository(prisma);
      const stats = await rescueRepository.getStatistics();

      return stats;
    },

    /**
     * Get my rescue requests (citizen dashboard)
     */
    myRescueRequests: async (
      _parent: any,
      args: {
        pagination?: { first?: number; after?: string };
        filter?: any;
      },
      context: GraphQLContext
    ) => {
      context.requireAuth();

      const limit = args.pagination?.first || 10;
      const cursor = args.pagination?.after;

      // Build where clause
      const where: any = {
        userId: context.user.id,
      };

      if (args.filter?.status) {
        where.status = { in: args.filter.status };
      }

      if (cursor) {
        where.id = { lt: cursor };
      }

      const rescues = await prisma.rescueRequest.findMany({
        where,
        take: limit + 1,
        orderBy: { createdAt: 'desc' },
        include: {
          assignedVolunteer: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  phone: true,
                },
              },
            },
          },
        },
      });

      const hasNextPage = rescues.length > limit;
      const edges = rescues.slice(0, limit);

      return {
        edges: edges.map((rescue) => ({
          node: rescue,
          cursor: rescue.id,
        })),
        pageInfo: {
          hasNextPage,
          hasPreviousPage: false,
          startCursor: edges[0]?.id,
          endCursor: edges[edges.length - 1]?.id,
        },
        totalCount: await prisma.rescueRequest.count({ where }),
      };
    },

    /**
     * Get my assigned rescues (rescuer dashboard)
     */
    myAssignedRescues: async (
      _parent: any,
      args: {
        pagination?: { first?: number; after?: string };
        filter?: any;
      },
      context: GraphQLContext
    ) => {
      context.requireAuth();
      context.requireRole(['VOLUNTEER', 'VERIFIED_RESCUER', 'DISTRICT_COORDINATOR']);

      // Get volunteer profile
      const volunteer = await prisma.volunteer.findUnique({
        where: { userId: context.user.id },
      });

      if (!volunteer) {
        return {
          edges: [],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: null,
            endCursor: null,
          },
          totalCount: 0,
        };
      }

      const limit = args.pagination?.first || 10;
      const cursor = args.pagination?.after;

      const where: any = {
        assignedTo: volunteer.id,
        status: { in: ['ASSIGNED', 'ACCEPTED', 'IN_PROGRESS'] },
      };

      if (cursor) {
        where.id = { lt: cursor };
      }

      const rescues = await prisma.rescueRequest.findMany({
        where,
        take: limit + 1,
        orderBy: { createdAt: 'desc' },
      });

      const hasNextPage = rescues.length > limit;
      const edges = rescues.slice(0, limit);

      return {
        edges: edges.map((rescue) => ({
          node: rescue,
          cursor: rescue.id,
        })),
        pageInfo: {
          hasNextPage,
          hasPreviousPage: false,
          startCursor: edges[0]?.id,
          endCursor: edges[edges.length - 1]?.id,
        },
        totalCount: await prisma.rescueRequest.count({ where }),
      };
    },

    /**
     * Get active rescues (admin/coordinator view)
     */
    activeRescues: async (
      _parent: any,
      args: { pagination?: { first?: number; after?: string } },
      context: GraphQLContext
    ) => {
      context.requireAuth();
      context.requireRole(['ADMIN', 'SUPER_ADMIN', 'DISTRICT_COORDINATOR']);

      const limit = args.pagination?.first || 10;
      const cursor = args.pagination?.after;

      const where: any = {
        status: { in: ['PENDING', 'ASSIGNED', 'ACCEPTED', 'IN_PROGRESS'] },
      };

      if (cursor) {
        where.id = { lt: cursor };
      }

      const rescues = await prisma.rescueRequest.findMany({
        where,
        take: limit + 1,
        orderBy: { priority: 'desc' },
        include: {
          assignedVolunteer: {
            include: {
              user: true,
            },
          },
        },
      });

      const hasNextPage = rescues.length > limit;
      const edges = rescues.slice(0, limit);

      return {
        edges: edges.map((rescue) => ({
          node: rescue,
          cursor: rescue.id,
        })),
        pageInfo: {
          hasNextPage,
          hasPreviousPage: false,
          startCursor: edges[0]?.id,
          endCursor: edges[edges.length - 1]?.id,
        },
        totalCount: await prisma.rescueRequest.count({ where }),
      };
    },
  },
};
