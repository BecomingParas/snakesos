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
import { LoginUseCase, RegisterUseCase } from '../../../application/use-cases/index.js';
import { AuthValidator } from '../../validators/auth.validator.js';

export const authResolvers = {
  Query: {
    /**
     * Get current user
     */
    me: async (_parent: any, _args: any, context: GraphQLContext) => {
      context.requireAuth();
      return context.user;
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
      const userRepository = new UserRepository(prisma);
      const registerUseCase = new RegisterUseCase(userRepository);
      const result = await registerUseCase.execute(input);

      // 3. Return response
      return result;
    },

    /**
     * Logout mutation
     */
    logout: async (_parent: any, _args: any, context: GraphQLContext) => {
      context.requireAuth();

      // TODO: Implement logout using Better Auth
      // await auth.api.signOut({ headers: context.req.headers });

      return {
        success: true,
        message: 'Logged out successfully',
      };
    },
  },
};
