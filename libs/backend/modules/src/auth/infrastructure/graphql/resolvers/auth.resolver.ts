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
} from '../../../application/use-cases/index.js';
import { AuthValidator } from '../../validators/auth.validator.js';

export const authResolvers = {
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
      },
      context: GraphQLContext
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
        };
      },
      context: GraphQLContext
    ) => {
      try {
        // Require admin/coordinator access
        context.requireAuth();
        context.requireRole(['ADMIN', 'SUPER_ADMIN', 'DISTRICT_COORDINATOR']);

        const { pagination, filter } = args;
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
          where.municipality = { contains: filter.municipality, mode: 'insensitive' };
        }
        
        if (filter?.isAvailableNow !== undefined) {
          where.isAvailableNow = filter.isAvailableNow;
        }

        // Fetch volunteers and total count
        const [volunteers, totalCount] = await Promise.all([
          prisma.volunteer.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
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
            endCursor: volunteers.length > 0 ? volunteers[volunteers.length - 1].id : null,
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
    resetPassword: async (_parent: any, args: { input: { email: string; code: string; newPassword: string } }) => {
      const resetPasswordUseCase = new ResetPasswordUseCase();
      
      const result = await resetPasswordUseCase.execute(args.input);
      return result.success;
    },

    /**
     * Verify email mutation
     */
    verifyEmail: async (_parent: any, args: { input: { email: string; code: string } }) => {
      const verifyEmailUseCase = new VerifyEmailUseCase();
      
      const result = await verifyEmailUseCase.execute(args.input);
      return result;
    },

    /**
     * Resend verification email mutation
     */
    resendVerification: async (_parent: any, args: { input: { email: string } }) => {
      const resendVerificationUseCase = new ResendVerificationUseCase();
      const result = await resendVerificationUseCase.execute(args.input);
      
      return result.success;
    },

    /**
     * Change password mutation (authenticated)
     */
    changePassword: async (_parent: any, args: { input: any }, context: GraphQLContext) => {
      context.requireAuth();

      const userRepository = new UserRepository(prisma);
      const authService = new AuthService();
      const changePasswordUseCase = new ChangePasswordUseCase(userRepository, authService);
      
      const result = await changePasswordUseCase.execute(context.user.id, args.input);
      return result;
    },
  },
};
