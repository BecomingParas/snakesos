/**
 * Auth Resolvers
 * GraphQL resolvers for authentication
 *
 * IMPORTANT: Resolvers should NEVER contain business logic.
 * They only:
 * 1. Validate input
 * 2. Call use cases
 * 3. Return formatted responses
 */

import { GraphQLContext } from '@snake-rescue/core';
import { prisma, UserRepository } from '@snake-rescue/database';
import { AuthService } from '@snake-rescue/auth';
import {
  LoginUseCase,
  RegisterUseCase,
  LogoutUseCase,
  RefreshTokenUseCase,
  ForgotPasswordUseCase,
  ResetPasswordUseCase,
  VerifyEmailUseCase,
  ResendVerificationUseCase,
  ChangePasswordUseCase,
} from '../../../application/use-cases/index';
import { AuthValidator } from '../../validators/auth.validator';
import { calculateRescuerRankingScore } from '../../../../lib/rescuer-ranking';

export const authResolvers = {
  Volunteer: {
    ratings: (parent: { id: string }) =>
      prisma.rescueRating.findMany({
        where: { rescuerId: parent.id },
        orderBy: { createdAt: 'desc' },
      }),
    mediaAssets: async (
      parent: { userId?: string | null },
      _args: unknown,
      context: GraphQLContext,
    ) => {
      context.requireRole(['ADMIN', 'SUPER_ADMIN', 'DISTRICT_COORDINATOR']);
      if (!parent.userId) return [];
      return prisma.mediaAsset.findMany({
        where: { ownerId: parent.userId, status: { in: ['UPLOADED', 'VERIFIED'] } },
        orderBy: { createdAt: 'desc' },
      });
    },
  },
  Query: {
    /**
     * Get current user with volunteer profile
     */
    me: async (_parent: any, _args: any, context: GraphQLContext) => {
      context.requireAuth();
      // Fetch user with volunteerProfile included
      const user = await prisma.user.findUnique({
        where: { id: context.user.id },
        include: {
          volunteerProfile: true,
        },
      });

      return user;
    },

    user: async (
      _parent: any,
      args: { id: string },
      context: GraphQLContext,
    ) => {
      context.requireAuth();
      context.requireRole(['ADMIN', 'SUPER_ADMIN']);

      return prisma.user.findFirst({
        where: { id: args.id, deletedAt: null },
        include: { volunteerProfile: true },
      });
    },

    volunteer: async (
      _parent: any,
      args: { id: string },
      context: GraphQLContext,
    ) => {
      context.requireAuth();
      context.requireRole(['ADMIN', 'SUPER_ADMIN', 'DISTRICT_COORDINATOR']);

      return prisma.volunteer.findFirst({
        where: { id: args.id, deletedAt: null },
        include: { user: true },
      });
    },

    /**
     * Get all users (Admin only)
     */
    users: async (
      _parent: any,
      args: {
        pagination?: { limit?: number; page?: number };
        filter?: {
          role?: string;
          status?: string;
          emailVerified?: boolean;
          search?: string;
        };
        sort?: { field: string; order: 'ASC' | 'DESC' };
      },
      context: GraphQLContext,
    ) => {
      // Require admin access
      context.requireAuth();
      context.requireRole(['ADMIN', 'SUPER_ADMIN']);

      const { pagination, filter } = args;
      const limit = pagination?.limit || 50;
      const page = pagination?.page || 1;
      const skip = (page - 1) * limit;

      // Build where clause
      const where: any = {};

      if (filter?.role) {
        where.role = filter.role;
      }

      if (filter?.status) {
        where.status = filter.status;
      }

      if (filter?.emailVerified !== undefined) {
        where.emailVerified = filter.emailVerified;
      }

      if (filter?.search) {
        where.OR = [
          { name: { contains: filter.search, mode: 'insensitive' } },
          { email: { contains: filter.search, mode: 'insensitive' } },
          { phone: { contains: filter.search } },
        ];
      }

      // Fetch users and total count
      const [users, totalCount] = await Promise.all([
        prisma.user.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.user.count({ where }),
      ]);

      // Build connection response
      return {
        edges: users,
        pageInfo: {
          hasNextPage: skip + users.length < totalCount,
          hasPreviousPage: page > 1,
          startCursor: users.length > 0 ? users[0].id : null,
          endCursor: users.length > 0 ? users[users.length - 1].id : null,
        },
        totalCount,
      };
    },

    /**
     * Get all volunteers (Admin/Coordinator only)
     */
    volunteers: async (
      _parent: any,
      args: {
        pagination?: { limit?: number; page?: number };
        filter?: {
          status?: string;
          experience?: string;
          municipality?: string;
          isAvailableNow?: boolean;
          search?: string;
        };
        sort?: { field: string; order: 'ASC' | 'DESC' };
      },
      context: GraphQLContext,
    ) => {
      try {
        // Require admin/coordinator access
        context.requireAuth();
        context.requireRole(['ADMIN', 'SUPER_ADMIN', 'DISTRICT_COORDINATOR']);

        const { pagination, filter, sort } = args;
        const limit = pagination?.limit || 50;
        const page = pagination?.page || 1;
        const skip = (page - 1) * limit;

        // Build where clause
        const where: any = {};

        if (filter?.status) {
          where.status = filter.status;
        }

        if (filter?.experience) {
          where.experience = filter.experience;
        }

        if (filter?.municipality) {
          where.municipality = {
            contains: filter.municipality,
            mode: 'insensitive',
          };
        }

        if (filter?.isAvailableNow !== undefined) {
          where.isAvailableNow = filter.isAvailableNow;
        }

        if (filter?.search) {
          where.OR = [
            { name: { contains: filter.search, mode: 'insensitive' } },
            { email: { contains: filter.search, mode: 'insensitive' } },
            { contact: { contains: filter.search } },
            { municipality: { contains: filter.search, mode: 'insensitive' } },
          ];
        }

        where.deletedAt = null;

        const sortField = sort?.field;
        const sortDirection = sort?.order === 'ASC' ? 1 : -1;

        // Bayesian ranking avoids promoting a rescuer with one lucky review.
        if (sortField === 'BAYESIAN_RATING') {
          const [candidates, totalCount] = await Promise.all([
            prisma.volunteer.findMany({ where, include: { user: true } }),
            prisma.volunteer.count({ where }),
          ]);
          const ranked = candidates.sort((left, right) => {
            const leftScore = calculateRescuerRankingScore(left);
            const rightScore = calculateRescuerRankingScore(right);

            return (
              (rightScore - leftScore) * sortDirection ||
              Number(right.isAvailableNow) - Number(left.isAvailableNow) ||
              right.completedRescues - left.completedRescues ||
              right.createdAt.getTime() - left.createdAt.getTime()
            );
          });
          const volunteers = ranked.slice(skip, skip + limit);
          return {
            edges: volunteers.map((volunteer) => ({
              node: volunteer,
              cursor: volunteer.id,
            })),
            pageInfo: {
              hasNextPage: skip + volunteers.length < totalCount,
              hasPreviousPage: page > 1,
              startCursor: volunteers.length > 0 ? volunteers[0].id : null,
              endCursor:
                volunteers.length > 0
                  ? volunteers[volunteers.length - 1].id
                  : null,
            },
            totalCount,
          };
        }

        const orderBy: Record<string, 'asc' | 'desc'> = {
          createdAt: 'desc',
        };
        const sortFieldMap: Record<string, string> = {
          NAME: 'name',
          CREATED_AT: 'createdAt',
          TOTAL_RESCUES: 'totalRescues',
          SUCCESS_RATE: 'successRate',
          RATING: 'rating',
          MUNICIPALITY: 'municipality',
        };
        if (sortField && sortFieldMap[sortField]) {
          orderBy[sortFieldMap[sortField]] =
            sortDirection === 1 ? 'asc' : 'desc';
        }

        // Fetch volunteers and total count
        const [volunteers, totalCount] = await Promise.all([
          prisma.volunteer.findMany({
            where,
            skip,
            take: limit,
            orderBy,
            include: {
              user: true,
            },
          }),
          prisma.volunteer.count({ where }),
        ]);

        // Build connection response with edge structure
        const result = {
          edges: volunteers.map((volunteer) => ({
            node: volunteer,
            cursor: volunteer.id,
          })),
          pageInfo: {
            hasNextPage: skip + volunteers.length < totalCount,
            hasPreviousPage: page > 1,
            startCursor: volunteers.length > 0 ? volunteers[0].id : null,
            endCursor:
              volunteers.length > 0
                ? volunteers[volunteers.length - 1].id
                : null,
          },
          totalCount,
        };

        return result;
      } catch (error) {
        console.error('Error fetching volunteers:', error);
        throw error;
      }
    },
  },

  Mutation: {
    applyVolunteer: async (
      _parent: unknown,
      args: { input: Record<string, unknown> },
      context: GraphQLContext,
    ) => {
      context.requireAuth();

      const existing = await prisma.volunteer.findUnique({
        where: { userId: context.user.id },
      });
      if (existing && !existing.deletedAt) {
        throw new Error(
          'A rescuer application already exists for this account',
        );
      }

      const input = args.input;
      const volunteer = await prisma.volunteer.create({
        data: {
          userId: context.user.id,
          name: String(input.name),
          contact: String(input.contact),
          email: input.email ? String(input.email) : undefined,
          address: String(input.address),
          municipality: String(input.municipality),
          ward: typeof input.ward === 'number' ? input.ward : undefined,
          emergencyContact: input.emergencyContact
            ? String(input.emergencyContact)
            : undefined,
          emergencyPhone: input.emergencyPhone
            ? String(input.emergencyPhone)
            : undefined,
          experience: String(input.experience),
          experienceYears:
            typeof input.experienceYears === 'number'
              ? input.experienceYears
              : undefined,
          vehicle: String(input.vehicle),
          vehicleDetails: input.vehicleDetails
            ? String(input.vehicleDetails)
            : undefined,
          skills: Array.isArray(input.skills) ? input.skills.map(String) : [],
          certifications: Array.isArray(input.certifications)
            ? input.certifications.map(String)
            : [],
          availableTime: String(input.availableTime),
          availableDays: Array.isArray(input.availableDays)
            ? input.availableDays.map(String)
            : [],
          emergencyAvailability: Boolean(input.emergencyAvailability),
          assignedZone: input.assignedZone
            ? String(input.assignedZone)
            : undefined,
          coverageRadius:
            typeof input.coverageRadius === 'number'
              ? input.coverageRadius
              : 20,
          bio: input.bio ? String(input.bio) : undefined,
          hasEquipment: Boolean(input.hasEquipment),
          equipment: Array.isArray(input.equipment)
            ? input.equipment.map(String)
            : [],
          status: 'PENDING',
          isAvailableNow: false,
          verifiedAt: null,
          verifiedBy: null,
        },
        include: { user: true },
      });

      const admins = await prisma.user.findMany({
        where: {
          status: 'ACTIVE',
          role: { in: ['ADMIN', 'SUPER_ADMIN'] },
        },
        select: { id: true },
      });
      if (admins.length > 0) {
        await prisma.notification.createMany({
          data: admins.map((admin) => ({
            userId: admin.id,
            type: 'RESCUER_APPLICATION_SUBMITTED' as any,
            title: 'New rescuer application',
            message: `${volunteer.name} submitted a rescuer application for review.`,
            actionUrl: `/dashboard/admin/rescuers/${volunteer.id}`,
            link: `/dashboard/admin/rescuers/${volunteer.id}`,
            priority: 'HIGH' as any,
          })),
        });
      }

      return volunteer;
    },

    /**
     * Login mutation
     */
    login: async (_parent: any, args: { input: any }) => {
      // 1. Validate input
      const input = AuthValidator.validateLogin(args.input);

      // 2. Execute use case
      const userRepository = new UserRepository(prisma);
      const loginUseCase = new LoginUseCase(userRepository);
      const result = await loginUseCase.execute(input);

      // 3. Return response
      return result;
    },

    /**
     * Register mutation
     */
    register: async (_parent: any, args: { input: any }) => {
      // 1. Validate input
      const input = AuthValidator.validateRegister(args.input);

      // 2. Execute use case
      const registerUseCase = new RegisterUseCase();
      const result = await registerUseCase.execute(input);

      // 3. Return response
      return result;
    },

    /**
     * Logout mutation
     */
    logout: async (_parent: any, _args: any, context: GraphQLContext) => {
      context.requireAuth();

      // Extract session token from Authorization header
      const authHeader = context.req.headers.authorization;
      const sessionToken = authHeader?.replace('Bearer ', '') || '';

      // Execute logout use case
      const logoutUseCase = new LogoutUseCase();
      await logoutUseCase.execute(sessionToken);

      // Return boolean as per GraphQL schema
      return true;
    },

    /**
     * Refresh token mutation
     */
    refreshToken: async (_parent: any, _args: any, context: GraphQLContext) => {
      // Extract session token from Authorization header or cookies
      const authHeader = context.req.headers.authorization;
      const sessionToken = authHeader?.replace('Bearer ', '') || '';

      if (!sessionToken) {
        throw new Error('No session token provided');
      }

      // Execute refresh token use case
      const userRepository = new UserRepository(prisma);
      const refreshTokenUseCase = new RefreshTokenUseCase(userRepository);
      const result = await refreshTokenUseCase.execute(sessionToken);

      return result;
    },

    /**
     * Forgot password mutation
     */
    forgotPassword: async (_parent: any, args: { email: string }) => {
      const forgotPasswordUseCase = new ForgotPasswordUseCase();

      const result = await forgotPasswordUseCase.execute({ email: args.email });
      return result;
    },

    /**
     * Reset password mutation
     */
    resetPassword: async (
      _parent: any,
      args: { input: { email: string; code: string; newPassword: string } },
    ) => {
      const resetPasswordUseCase = new ResetPasswordUseCase();

      const result = await resetPasswordUseCase.execute(args.input);
      return result.success;
    },

    /**
     * Verify email mutation
     */
    verifyEmail: async (
      _parent: any,
      args: { input: { email: string; code: string } },
    ) => {
      const verifyEmailUseCase = new VerifyEmailUseCase();

      const result = await verifyEmailUseCase.execute(args.input);
      return result;
    },

    /**
     * Resend verification email mutation
     */
    resendVerification: async (
      _parent: any,
      args: { input: { email: string } },
    ) => {
      const resendVerificationUseCase = new ResendVerificationUseCase();
      const result = await resendVerificationUseCase.execute(args.input);

      return result.success;
    },

    /**
     * Change password mutation (authenticated)
     */
    changePassword: async (
      _parent: any,
      args: { input: any },
      context: GraphQLContext,
    ) => {
      context.requireAuth();

      const userRepository = new UserRepository(prisma);
      const authService = new AuthService();
      const changePasswordUseCase = new ChangePasswordUseCase(
        userRepository,
        authService,
      );

      const result = await changePasswordUseCase.execute(
        context.user.id,
        args.input,
      );
      return result;
    },

    updateProfile: async (
      _parent: unknown,
      args: { input: { name?: string; phone?: string; avatar?: string } },
      context: GraphQLContext,
    ) => {
      context.requireAuth();
      const data = Object.fromEntries(
        Object.entries(args.input).filter(([, value]) => value !== undefined),
      );
      return prisma.user.update({
        where: { id: context.user.id },
        data,
      });
    },

    updateUserRole: async (
      _parent: unknown,
      args: { input: { userId: string; role: string } },
      context: GraphQLContext,
    ) => {
      context.requireAuth();
      context.requireRole(['ADMIN', 'SUPER_ADMIN']);
      if (args.input.userId === context.user.id) {
        throw new Error('ADMIN_CANNOT_CHANGE_OWN_ROLE');
      }

      return prisma.user.update({
        where: { id: args.input.userId },
        data: { role: args.input.role as any },
      });
    },

    reviewVolunteerApplication: async (
      _parent: any,
      args: {
        input: {
          volunteerId: string;
          approved: boolean;
          notes?: string;
          assignedZone?: string;
        };
      },
      context: GraphQLContext,
    ) => {
      context.requireAuth();
      context.requireRole(['ADMIN', 'SUPER_ADMIN', 'DISTRICT_COORDINATOR']);

      const { volunteerId, approved, notes, assignedZone } = args.input;
      const volunteer = await prisma.volunteer.findFirstOrThrow({
        where: { id: volunteerId, deletedAt: null },
      });

      return prisma.$transaction(async (transaction) => {
        const updatedVolunteer = await transaction.volunteer.update({
          where: { id: volunteer.id },
          data: {
            status: approved ? 'APPROVED' : 'REJECTED',
            assignedZone,
            rejectionReason: approved ? null : notes,
            rejectedAt: approved ? null : new Date(),
            rejectedBy: approved ? null : context.user.id,
          } as any,
          include: { user: true },
        });

        if (volunteer.userId && approved) {
          await transaction.user.update({
            where: { id: volunteer.userId },
            data: { role: 'VOLUNTEER', status: 'ACTIVE' } as any,
          });
        }

        return updatedVolunteer;
      });
    },

    rateVolunteer: async (
      _parent: any,
      args: {
        volunteerId: string;
        rescueId: string;
        rating: number;
        feedback?: string;
        responseSpeed?: number;
        professionalism?: number;
        communication?: number;
        safetyHandling?: number;
      },
      context: GraphQLContext,
    ) => {
      context.requireAuth();

      if (
        !Number.isInteger(args.rating) ||
        args.rating < 1 ||
        args.rating > 5
      ) {
        throw new Error('Rating must be an integer from 1 to 5');
      }
      for (const [label, value] of [
        ['Response speed', args.responseSpeed],
        ['Professionalism', args.professionalism],
        ['Communication', args.communication],
        ['Safety handling', args.safetyHandling],
      ] as const) {
        if (
          value != null &&
          (!Number.isInteger(value) || value < 1 || value > 5)
        ) {
          throw new Error(`${label} must be an integer from 1 to 5`);
        }
      }

      const rescue = await prisma.rescueRequest.findFirst({
        where: {
          id: args.rescueId,
          userId: context.user.id,
          status: 'COMPLETED',
          assignedTo: args.volunteerId,
        },
        select: { id: true, assignedTo: true },
      });

      const rescuerId = rescue?.assignedTo;
      if (!rescuerId) {
        throw new Error(
          'Only the citizen who completed this rescue can rate it',
        );
      }

      const existingRating = await prisma.rescueRating.findUnique({
        where: { rescueId: args.rescueId },
        select: { id: true, citizenId: true, createdAt: true },
      });
      if (existingRating) {
        const editWindowMs = 14 * 24 * 60 * 60 * 1000;
        const canEdit =
          existingRating.citizenId === context.user.id &&
          Date.now() - existingRating.createdAt.getTime() <= editWindowMs;
        if (!canEdit) {
          throw new Error('The rating edit window has closed');
        }
      }

      return prisma.$transaction(async (transaction) => {
        const ratingData = {
          rating: args.rating,
          feedback: args.feedback?.trim() || null,
          responseSpeed: args.responseSpeed,
          professionalism: args.professionalism,
          communication: args.communication,
          safetyHandling: args.safetyHandling,
        };
        if (existingRating) {
          await transaction.rescueRating.update({
            where: { id: existingRating.id },
            data: ratingData,
          });
        } else {
          await transaction.rescueRating.create({
            data: {
              rescueId: args.rescueId,
              citizenId: context.user.id,
              rescuerId,
              ...ratingData,
            },
          });
        }

        const aggregate = await transaction.rescueRating.aggregate({
          where: { rescuerId },
          _avg: { rating: true },
        });
        const totalRatings = await transaction.rescueRating.count({
          where: { rescuerId },
        });

        return transaction.volunteer.update({
          where: { id: rescuerId },
          data: {
            rating: aggregate._avg?.rating ?? args.rating,
            totalRatings,
          },
          include: { user: true },
        });
      });
    },

    verifyVolunteer: async (
      _parent: any,
      args: { volunteerId: string; notes?: string },
      context: GraphQLContext,
    ) => {
      context.requireAuth();
      context.requireRole(['ADMIN', 'SUPER_ADMIN', 'DISTRICT_COORDINATOR']);

      const volunteer = await prisma.volunteer.findFirstOrThrow({
        where: { id: args.volunteerId, deletedAt: null },
      });

      return prisma.$transaction(async (transaction) => {
        const updatedVolunteer = await transaction.volunteer.update({
          where: { id: volunteer.id },
          data: {
            status: 'VERIFIED',
            verifiedAt: new Date(),
            verifiedBy: context.user.id,
          } as any,
          include: { user: true },
        });

        if (volunteer.userId) {
          await transaction.user.update({
            where: { id: volunteer.userId },
            data: { role: 'VERIFIED_RESCUER', status: 'ACTIVE' } as any,
          });
        }

        return updatedVolunteer;
      });
    },

    suspendVolunteer: async (
      _parent: any,
      args: { volunteerId: string; reason: string },
      context: GraphQLContext,
    ) => {
      context.requireAuth();
      context.requireRole(['ADMIN', 'SUPER_ADMIN', 'DISTRICT_COORDINATOR']);

      const volunteer = await prisma.volunteer.update({
        where: { id: args.volunteerId },
        data: { status: 'SUSPENDED', rejectionReason: args.reason } as any,
        include: { user: true },
      });

      if (volunteer.userId) {
        await prisma.user.update({
          where: { id: volunteer.userId },
          data: { status: 'SUSPENDED' } as any,
        });
      }

      return volunteer;
    },

    reactivateVolunteer: async (
      _parent: any,
      args: { volunteerId: string },
      context: GraphQLContext,
    ) => {
      context.requireAuth();
      context.requireRole(['ADMIN', 'SUPER_ADMIN', 'DISTRICT_COORDINATOR']);

      const volunteer = await prisma.volunteer.update({
        where: { id: args.volunteerId },
        data: { status: 'APPROVED', rejectionReason: null } as any,
        include: { user: true },
      });

      if (volunteer.userId) {
        await prisma.user.update({
          where: { id: volunteer.userId },
          data: { status: 'ACTIVE', role: 'VOLUNTEER' } as any,
        });
      }

      return volunteer;
    },

    deleteVolunteer: async (
      _parent: any,
      args: { volunteerId: string },
      context: GraphQLContext,
    ) => {
      context.requireAuth();
      context.requireRole(['SUPER_ADMIN']);

      const volunteer = await prisma.volunteer.update({
        where: { id: args.volunteerId },
        data: {
          deletedAt: new Date(),
          status: 'INACTIVE',
          isAvailableNow: false,
        } as any,
      });

      if (volunteer.userId) {
        await prisma.user.update({
          where: { id: volunteer.userId },
          data: { status: 'INACTIVE' } as any,
        });
      }

      return {
        success: true,
        message: 'Volunteer deleted successfully',
        metadata: { volunteerId: args.volunteerId },
      };
    },
  },
};
