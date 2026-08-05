/**
 * Rescue Mutation Resolvers
 * Write operations for rescue requests
 */

import { GraphQLContext } from '@snake-rescue/core';
import { prisma, RescueRepository } from '@snake-rescue/database';
import { CreateRescueUseCase } from '../../../application/use-cases/create-rescue.use-case.js';
import { AssignVolunteerUseCase } from '../../../application/use-cases/assign-volunteer.use-case.js';
import { RescueValidator } from '../../validators/rescue.validator.js';

export const rescueMutationResolvers = {
  Mutation: {
    /**
     * Create a new rescue request
     */
    createRescueRequest: async (_parent: any, args: { input: any }, context: GraphQLContext) => {
      // Authentication required
      context.requireAuth();

      // 1. Validate input
      const input = RescueValidator.validateCreateRescue(args.input);

      // 2. Execute use case
      const rescueRepository = new RescueRepository(prisma);
      const useCase = new CreateRescueUseCase(rescueRepository);
      const result = await useCase.execute(input, context.user.id);

      // 3. Return response
      return result;
    },

    /**
     * Assign a volunteer to a rescue request
     */
    assignRescue: async (_parent: any, args: { input: any }, context: GraphQLContext) => {
      // Authentication required (coordinator or admin)
      context.requireAuth();
      // TODO: Add permission check

      // 1. Validate input
      const input = RescueValidator.validateAssignVolunteer(args.input);

      // 2. Execute use case
      const rescueRepository = new RescueRepository(prisma);
      const useCase = new AssignVolunteerUseCase(rescueRepository);
      const result = await useCase.execute(input);

      // 3. Return response
      return result;
    },

  },
};
