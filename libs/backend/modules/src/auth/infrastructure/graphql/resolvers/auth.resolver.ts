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
  },

  Mutation: {
    /**
     * Login mutation
     */
    login: async (_parent: any, args: { input: any }, context: GraphQLContext) => {
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
    register: async (_parent: any, args: { input: any }, context: GraphQLContext) => {
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
    forgotPassword: async (_parent: any, args: { input: { email: string } }) => {
      const authService = new AuthService();
      const forgotPasswordUseCase = new ForgotPasswordUseCase(authService);
      
      const result = await forgotPasswordUseCase.execute(args.input);
      return result;
    },

    /**
     * Reset password mutation
     */
    resetPassword: async (_parent: any, args: { input: { token: string; newPassword: string } }) => {
      const authService = new AuthService();
      const resetPasswordUseCase = new ResetPasswordUseCase(authService);
      
      const result = await resetPasswordUseCase.execute(args.input);
      return result;
    },

    /**
     * Verify email mutation
     */
    verifyEmail: async (_parent: any, args: { input: { token: string } }) => {
      const authService = new AuthService();
      const verifyEmailUseCase = new VerifyEmailUseCase(authService);
      
      const result = await verifyEmailUseCase.execute(args.input);
      return result;
    },

    /**
     * Resend verification email mutation
     */
    resendVerification: async (_parent: any, args: { input: { email: string } }) => {
      const authService = new AuthService();
      const result = await authService.sendVerificationEmail(args.input.email);
      
      return {
        success: result.success,
        message: result.message || 'Verification email sent',
      };
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
