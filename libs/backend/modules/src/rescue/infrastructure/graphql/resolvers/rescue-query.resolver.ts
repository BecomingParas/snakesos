/**
 * Rescue Query Resolvers
 * Read operations for rescue requests
 */

import { GraphQLContext } from '@snake-rescue/core';
import { prisma, RescueRepository } from '@snake-rescue/database';
import { GetRescueQuery } from '../../../application/queries/get-rescue.query.js';
import { ListRescuesQuery } from '../../../application/queries/list-rescues.query.js';
import { AvailableRescuesQuery } from '../../../application/queries/available-rescues.query.js';

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

    /**
     * Get available rescues for queue (rescuer can accept)
     * Shows PENDING unassigned rescues
     */
    availableRescues: async (
      _parent: any,
      args: {
        filter?: {
          municipality?: string;
          maxDistance?: number;
        };
        pagination?: {
          limit?: number;
        };
      },
      context: GraphQLContext
    ) => {
      context.requireAuth();
      context.requireRole(['VOLUNTEER', 'VERIFIED_RESCUER', 'DISTRICT_COORDINATOR']);

      // Get volunteer profile for location
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

      const rescueRepository = new RescueRepository(prisma);
      const query = new AvailableRescuesQuery(rescueRepository);
      
      const rescues = await query.execute({
        municipality: args.filter?.municipality || volunteer.municipality,
        rescuerLat: volunteer.lastKnownLatitude || undefined,
        rescuerLng: volunteer.lastKnownLongitude || undefined,
        maxDistance: args.filter?.maxDistance || 50,
        limit: args.pagination?.limit || 50,
      });

      return {
        edges: rescues.map((rescue) => ({
          node: rescue,
          cursor: rescue.id,
        })),
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: rescues[0]?.id || null,
          endCursor: rescues[rescues.length - 1]?.id || null,
        },
        totalCount: rescues.length,
      };
    },

    /**
     * Find available volunteers near a location
     */
    availableVolunteers: async (
      _parent: any,
      args: {
        input: {
          lat: number;
          lng: number;
          radius?: number;
          limit?: number;
        };
      },
      context: GraphQLContext
    ) => {
      context.requireAuth();
      context.requireRole(['ADMIN', 'SUPER_ADMIN', 'DISTRICT_COORDINATOR']);

      const { lat, lng, radius = 50, limit = 10 } = args.input;

      // Find volunteers within radius using Haversine formula
      // Haversine formula: a = sin²(Δφ/2) + cos φ1 ⋅ cos φ2 ⋅ sin²(Δλ/2)
      // c = 2 ⋅ atan2( √a, √(1−a) )
      // d = R ⋅ c (where R = 6371 km)
      
      const volunteers = await prisma.$queryRaw<Array<{
        id: string;
        userId: string;
        distance: number;
        lastKnownLatitude: number;
        lastKnownLongitude: number;
        isAvailableNow: boolean;
        experienceLevel: string;
        specializations: any;
        lastLocationUpdate: Date | null;
      }>>`
        SELECT 
          v.id,
          v."userId",
          v."lastKnownLatitude",
          v."lastKnownLongitude",
          v."isAvailableNow",
          v."experienceLevel",
          v."specializations",
          v."lastLocationUpdate",
          (
            6371 * acos(
              cos(radians(${lat})) * 
              cos(radians(v."lastKnownLatitude")) * 
              cos(radians(v."lastKnownLongitude") - radians(${lng})) + 
              sin(radians(${lat})) * 
              sin(radians(v."lastKnownLatitude"))
            )
          ) AS distance
        FROM "Volunteer" v
        WHERE v."isAvailableNow" = true
          AND v."lastKnownLatitude" IS NOT NULL
          AND v."lastKnownLongitude" IS NOT NULL
          AND v."verificationStatus" = 'VERIFIED'
        HAVING (
          6371 * acos(
            cos(radians(${lat})) * 
            cos(radians(v."lastKnownLatitude")) * 
            cos(radians(v."lastKnownLongitude") - radians(${lng})) + 
            sin(radians(${lat})) * 
            sin(radians(v."lastKnownLatitude"))
          )
        ) <= ${radius}
        ORDER BY distance ASC
        LIMIT ${limit}
      `;

      // Enrich with user data
      const volunteersWithUsers = await Promise.all(
        volunteers.map(async (v) => {
          const user = await prisma.user.findUnique({
            where: { id: v.userId },
            select: {
              id: true,
              name: true,
              phone: true,
            },
          });

          const volunteerFull = await prisma.volunteer.findUnique({
            where: { id: v.id },
            include: {
              user: true,
            },
          });

          return {
            volunteer: volunteerFull,
            distance: Number(v.distance.toFixed(2)), // Round to 2 decimal places
          };
        })
      );

      return volunteersWithUsers.filter((v) => v.volunteer !== null);
    },
  },
};
