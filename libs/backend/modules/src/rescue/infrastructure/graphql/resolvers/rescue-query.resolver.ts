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
        pagination?: { limit?: number; page?: number };
        filter?: any;
      },
      context: GraphQLContext
    ) => {
      context.requireAuth();

      const limit = args.pagination?.limit || 10;
      const page = args.pagination?.page || 1;
      const skip = (page - 1) * limit;

      // Build where clause
      const where: any = {
        userId: context.user.id,
      };

      if (args.filter?.status) {
        where.status = { in: args.filter.status };
      }

      const [rescues, totalCount] = await Promise.all([
        prisma.rescueRequest.findMany({
          where,
          take: limit,
          skip,
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
        }),
        prisma.rescueRequest.count({ where }),
      ]);

      const hasNextPage = skip + limit < totalCount;
      const hasPreviousPage = page > 1;

      const edges = rescues.map((rescue) => ({
        node: rescue,
        cursor: rescue.id,
      }));

      return {
        edges,
        pageInfo: {
          hasNextPage,
          hasPreviousPage,
          startCursor: rescues[0]?.id || null,
          endCursor: rescues[rescues.length - 1]?.id || null,
        },
        totalCount,
      };
    },

    /**
     * Get my assigned rescues (rescuer dashboard)
     */
    myAssignedRescues: async (
      _parent: any,
      args: {
        pagination?: { limit?: number; page?: number };
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

      const limit = args.pagination?.limit || 10;
      const page = args.pagination?.page || 1;
      const skip = (page - 1) * limit;

      const where: any = {
        assignedTo: volunteer.id,
        status: { in: ['ASSIGNED', 'ACCEPTED', 'IN_PROGRESS'] },
      };

      const [rescues, totalCount] = await Promise.all([
        prisma.rescueRequest.findMany({
          where,
          take: limit,
          skip,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.rescueRequest.count({ where }),
      ]);

      const hasNextPage = skip + limit < totalCount;
      const hasPreviousPage = page > 1;

      return {
        edges: rescues.map((rescue) => ({
          node: rescue,
          cursor: rescue.id,
        })),
        pageInfo: {
          hasNextPage,
          hasPreviousPage,
          startCursor: rescues[0]?.id || null,
          endCursor: rescues[rescues.length - 1]?.id || null,
        },
        totalCount,
      };
    },

    /**
     * Get active rescues (admin/coordinator view)
     */
    activeRescues: async (
      _parent: any,
      args: { pagination?: { limit?: number; page?: number } },
      context: GraphQLContext
    ) => {
      context.requireAuth();
      context.requireRole(['ADMIN', 'SUPER_ADMIN', 'DISTRICT_COORDINATOR']);

      const limit = args.pagination?.limit || 10;
      const page = args.pagination?.page || 1;
      const skip = (page - 1) * limit;

      const where: any = {
        status: { in: ['PENDING', 'ASSIGNED', 'ACCEPTED', 'IN_PROGRESS'] },
      };

      const [rescues, totalCount] = await Promise.all([
        prisma.rescueRequest.findMany({
          where,
          take: limit,
          skip,
          orderBy: { priority: 'desc' },
          include: {
            assignedVolunteer: {
              include: {
                user: true,
              },
            },
          },
        }),
        prisma.rescueRequest.count({ where }),
      ]);

      const hasNextPage = skip + limit < totalCount;
      const hasPreviousPage = page > 1;

      const edges = rescues.map((rescue) => ({
        node: rescue,
        cursor: rescue.id,
      }));

      return {
        edges,
        pageInfo: {
          hasNextPage,
          hasPreviousPage,
          startCursor: rescues[0]?.id || null,
          endCursor: rescues[rescues.length - 1]?.id || null,
        },
        totalCount,
      };
    },
  },
};
