/**
 * Rescue Query Resolvers
 * Read operations for rescue requests
 */

import { GraphQLContext } from '@snake-rescue/core';
import { prisma, RescueRepository } from '@snake-rescue/database';
import { AuthorizationError } from '@snake-rescue/shared';
import { GetRescueQuery } from '../../../application/queries/get-rescue.query.js';
import { ListRescuesQuery } from '../../../application/queries/list-rescues.query.js';
import { AvailableRescuesQuery } from '../../../application/queries/available-rescues.query.js';
import { calculateRescuerRankingScore } from '../../../../lib/rescuer-ranking.js';

const RESCUE_MANAGEMENT_ROLES = [
  'ADMIN',
  'SUPER_ADMIN',
  'DISTRICT_COORDINATOR',
];

export const rescueQueryResolvers = {
  RescueRequest: {
    rating: async (parent: { id: string }) =>
      prisma.rescueRating.findUnique({ where: { rescueId: parent.id } }),
    assignedBy: async (parent: {
      assignedBy?: string | { id: string } | null;
    }) => {
      if (!parent.assignedBy) {
        return null;
      }

      if (typeof parent.assignedBy !== 'string') {
        return parent.assignedBy;
      }

      return prisma.user.findUnique({
        where: { id: parent.assignedBy },
      });
    },
  },
  Query: {
    /**
     * Get a single rescue request by ID
     */
    rescueRequest: async (
      _parent: any,
      args: { id: string },
      context: GraphQLContext,
    ) => {
      // Authentication required
      context.requireAuth();

      // Execute query
      const rescueRepository = new RescueRepository(prisma);
      const query = new GetRescueQuery(rescueRepository);
      const rescue = await query.execute(args.id);

      const canManageRescues = RESCUE_MANAGEMENT_ROLES.includes(
        context.user.role,
      );
      const isReporter = rescue.userId === context.user.id;
      const isAssignedVolunteer =
        rescue.assignedVolunteer?.userId === context.user.id;

      if (!canManageRescues && !isReporter && !isAssignedVolunteer) {
        throw new AuthorizationError(
          'You do not have permission to view this rescue request',
        );
      }

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
      context: GraphQLContext,
    ) => {
      // Authentication required
      context.requireAuth();
      context.requireRole(RESCUE_MANAGEMENT_ROLES);

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
      context.requireRole(RESCUE_MANAGEMENT_ROLES);

      const rescueRepository = new RescueRepository(prisma);
      const stats = await rescueRepository.getStatistics();

      return stats;
    },

    emergencyRescuesCount: async (
      _parent: unknown,
      _args: unknown,
      context: GraphQLContext,
    ) => {
      context.requireAuth();
      const isAdmin = RESCUE_MANAGEMENT_ROLES.includes(context.user.role);
      return prisma.rescueRequest.count({
        where: {
          isEmergency: true,
          status: {
            in: isAdmin
              ? ['PENDING', 'ASSIGNED', 'ACCEPTED', 'IN_PROGRESS']
              : ['PENDING'],
          },
          ...(isAdmin ? {} : { assignedTo: null }),
        },
      });
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
      context: GraphQLContext,
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
      context: GraphQLContext,
    ) => {
      context.requireAuth();
      context.requireRole([
        'VOLUNTEER',
        'VERIFIED_RESCUER',
        'DISTRICT_COORDINATOR',
      ]);

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
      const statuses =
        args.filter?.statuses ||
        (args.filter?.status
          ? [args.filter.status]
          : ['ASSIGNED', 'ACCEPTED', 'IN_PROGRESS']);

      const where: any = {
        assignedTo: volunteer.id,
        status: { in: statuses },
      };

      const [rescues, totalCount] = await Promise.all([
        prisma.rescueRequest.findMany({
          where,
          take: limit,
          skip,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                phone: true,
              },
            },
          },
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
      context: GraphQLContext,
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
      context: GraphQLContext,
    ) => {
      context.requireAuth();
      context.requireRole([
        'VOLUNTEER',
        'VERIFIED_RESCUER',
        'DISTRICT_COORDINATOR',
      ]);

      // Get volunteer profile for location
      const volunteer = await prisma.volunteer.findUnique({
        where: { userId: context.user.id },
      });

      const rescueRepository = new RescueRepository(prisma);
      const query = new AvailableRescuesQuery(rescueRepository);

      const rescues = await query.execute({
        municipality: args.filter?.municipality,
        rescuerLat: volunteer?.lastKnownLatitude || undefined,
        rescuerLng: volunteer?.lastKnownLongitude || undefined,
        maxDistance: args.filter?.maxDistance || 50,
        limit: args.pagination?.limit || 50,
      });

      // Open alerts deliberately expose only the information a responder needs
      // to decide whether to claim a rescue. Exact address, coordinates, citizen
      // identity, contact information, and operational notes are available only
      // after the responder owns the assignment.
      const openAlerts = rescues.map((rescue: any) => ({
        id: rescue.id,
        referenceNumber: rescue.referenceNumber,
        status: rescue.status,
        priority: rescue.priority,
        municipality: rescue.municipality,
        ward: rescue.ward,
        address: 'Exact address is shared after you claim this rescue.',
        landmark: rescue.landmark,
        lat: null,
        lng: null,
        snakeDescription: rescue.snakeDescription,
        snakeSize: rescue.snakeSize,
        snakeColor: rescue.snakeColor,
        snakeImageUrl: null,
        snakeImages: [],
        isEmergency: rescue.isEmergency,
        hasBite: rescue.hasBite,
        stillPresent: rescue.stillPresent,
        name: 'Withheld until claim',
        phone: 'Not available',
        source: rescue.source,
        createdAt: rescue.createdAt,
        updatedAt: rescue.updatedAt,
        species: rescue.species,
      }));

      return {
        edges: openAlerts.map((rescue) => ({
          node: rescue,
          cursor: rescue.id,
        })),
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: openAlerts[0]?.id || null,
          endCursor: openAlerts[openAlerts.length - 1]?.id || null,
        },
        totalCount: openAlerts.length,
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
          radiusKm: number;
          limit?: number;
        };
      },
      context: GraphQLContext,
    ) => {
      context.requireAuth();
      context.requireRole(['ADMIN', 'SUPER_ADMIN', 'DISTRICT_COORDINATOR']);

      const { lat, lng, radiusKm, limit = 10 } = args.input;

      // Find volunteers within radius using Haversine formula
      // Haversine formula: a = sin²(Δφ/2) + cos φ1 ⋅ cos φ2 ⋅ sin²(Δλ/2)
      // c = 2 ⋅ atan2( √a, √(1−a) )
      // d = R ⋅ c (where R = 6371 km)

      const volunteers = await prisma.$queryRaw<
        Array<{
          id: string;
          userId: string;
          distance: number | null;
          currentLat: number | null;
          currentLng: number | null;
          isAvailableNow: boolean;
          status: string;
          lastLocationUpdate: Date | null;
          rating: number | null;
          totalRatings: number;
          completedRescues: number;
        }>
      >`
        SELECT 
          v.id,
          v."userId",
          v."currentLat",
          v."currentLng",
          v."isAvailableNow",
          v."status",
          v."lastLocationUpdate",
          v."rating",
          v."totalRatings",
          v."completedRescues",
          (
            6371 * acos(
              cos(radians(${lat})) * 
              cos(radians(v."currentLat")) * 
              cos(radians(v."currentLng") - radians(${lng})) + 
              sin(radians(${lat})) * 
              sin(radians(v."currentLat"))
            )
          ) AS distance
        FROM "volunteers" v
        WHERE v."isAvailableNow" = true
          AND v."status" = 'VERIFIED'
        AND (
          v."currentLat" IS NULL OR v."currentLng" IS NULL OR (
            6371 * acos(
              cos(radians(${lat})) * 
              cos(radians(v."currentLat")) * 
              cos(radians(v."currentLng") - radians(${lng})) + 
              sin(radians(${lat})) * 
              sin(radians(v."currentLat"))
            ) <= ${radiusKm}
          )
        )
        ORDER BY distance ASC
      `;

      // Enrich with user data
      const volunteersWithUsers = await Promise.all(
        volunteers.map(async (v) => {
          const volunteerFull = await prisma.volunteer.findUnique({
            where: { id: v.id },
            include: {
              user: true,
            },
          });
          const currentlyAssigned = await prisma.rescueRequest.count({
            where: { assignedTo: v.id },
          });

          return {
            volunteer: volunteerFull,
            distance:
              v.distance === null ? undefined : Number(v.distance.toFixed(2)), // Round to 2 decimal places
            estimatedArrival:
              v.distance === null
                ? undefined
                : Math.max(1, Math.round(v.distance * 3 + 5)),
            currentlyAssigned,
          };
        }),
      );

      const rankedVolunteers = volunteersWithUsers
        .filter((v) => v.volunteer !== null)
        .map((entry) => {
          const source = volunteers.find(
            (volunteer) => volunteer.id === entry.volunteer?.id,
          );
          const rankingScore = calculateRescuerRankingScore({
            rating: source?.rating,
            totalRatings: source?.totalRatings ?? 0,
          });
          return { ...entry, rankingScore, source };
        })
        .sort(
          (left, right) =>
            right.rankingScore - left.rankingScore ||
            (left.distance ?? Number.POSITIVE_INFINITY) -
              (right.distance ?? Number.POSITIVE_INFINITY),
        )
        .slice(0, limit);

      return rankedVolunteers.map(({ source: _source, ...entry }) => entry);
    },
  },
};
