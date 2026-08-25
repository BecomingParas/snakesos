/**
 * Rescue Mutation Resolvers
 * Write operations for rescue requests
 */

import { GraphQLContext } from '@snake-rescue/core';
import { prisma, RescueRepository } from '@snake-rescue/database';
import { CreateRescueUseCase } from '../../../application/use-cases/create-rescue.use-case.js';
import { AssignVolunteerUseCase } from '../../../application/use-cases/assign-volunteer.use-case.js';
import { AcceptRescueUseCase } from '../../../application/use-cases/accept-rescue.use-case.js';
import { AcceptFromQueueUseCase } from '../../../application/use-cases/accept-from-queue.use-case.js';
import { UpdateRescueStatusUseCase } from '../../../application/use-cases/update-status.use-case.js';
import { CompleteRescueUseCase } from '../../../application/use-cases/complete-rescue.use-case.js';
import { CancelRescueUseCase } from '../../../application/use-cases/cancel-rescue.use-case.js';
import { RescueValidator } from '../../validators/rescue.validator.js';
// import { createRescueNotifications } from '../../../../notifications.resolver.js';  // Commented out due to build errors
import { RescueFinancialService } from '../../../../finance/application/rescue-financial.service.js';

export const rescueMutationResolvers = {
  Mutation: {
    /**
     * Create a new rescue request
     */
    createRescueRequest: async (
      _parent: any,
      args: { input: any },
      context: GraphQLContext,
    ) => {
      // Authentication required
      context.requireAuth();

      // 1. Validate input
      const input = RescueValidator.validateCreateRescue(args.input);

      // 2. Execute use case
      const rescueRepository = new RescueRepository(prisma);
      const useCase = new CreateRescueUseCase(rescueRepository);
      const result = await useCase.execute(input, context.user.id);
      // TODO: Re-enable notifications after resolving build issues
      // // await createRescueNotifications(...)

      // 3. Return response
      return result;
    },

    /**
     * Update the rescue priority from the admin command surface
     */
    updateRescueRequest: async (
      _parent: any,
      args: { id: string; input: { priority?: string } },
      context: GraphQLContext,
    ) => {
      context.requireAuth();
      context.requireRole(['ADMIN', 'SUPER_ADMIN']);

      if (!args.input.priority) {
        throw new Error('Priority is required');
      }

      const rescueRepository = new RescueRepository(prisma);
      const rescue = await rescueRepository.findById(args.id);
      if (!rescue) {
        throw new Error('Rescue request not found');
      }

      const updatedRescue = await rescueRepository.update(args.id, {
        priority: args.input.priority as any,
      });

      if (rescue.priority !== args.input.priority) {
        await rescueRepository.addTimelineEvent({
          rescueId: args.id,
          event: 'PRIORITY_UPDATED',
          description: `Priority changed from ${rescue.priority} to ${args.input.priority}`,
          userId: context.user.id,
        });
      }

      // TODO: Re-enable notifications after resolving build issues
      // // await createRescueNotifications(...)
      return updatedRescue;
    },

    /**
     * Assign a volunteer to a rescue request
     */
    assignRescue: async (
      _parent: any,
      args: { input: any },
      context: GraphQLContext,
    ) => {
      // Authentication required (coordinator or admin)
      context.requireAuth();

      // Require appropriate role (District Coordinator or Admin)
      context.requireRole(['DISTRICT_COORDINATOR', 'ADMIN', 'SUPER_ADMIN']);

      // 1. Validate input
      const input = RescueValidator.validateAssignVolunteer(args.input);

      // 2. Execute use case
      const rescueRepository = new RescueRepository(prisma);
      const useCase = new AssignVolunteerUseCase(rescueRepository);
      const result = await useCase.execute(input, context.user.id);

      // 3. Return response
      // TODO: Re-enable notifications after resolving build issues
      // // await createRescueNotifications(...)
      return result;
    },

    /**
     * Volunteer accepts rescue assignment (pre-assigned by admin)
     */
    acceptRescue: async (
      _parent: any,
      args: { input: any },
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
        throw new Error('Volunteer profile not found');
      }

      const rescueRepository = new RescueRepository(prisma);
      const useCase = new AcceptRescueUseCase(rescueRepository);

      const result = await useCase.execute(
        {
          rescueId: args.input.rescueId,
          volunteerId: volunteer.id,
          estimatedArrivalTime: args.input.estimatedArrivalTime,
          notes: args.input.notes,
        },
        context.user.id,
      );
      return result;
    },

    /**
     * Volunteer accepts rescue from queue (self-service)
     * ATOMIC - prevents race condition when multiple rescuers try to accept same rescue
     */
    acceptFromQueue: async (
      _parent: any,
      args: { input: any },
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
        throw new Error('Volunteer profile not found');
      }

      const rescueRepository = new RescueRepository(prisma);
      const useCase = new AcceptFromQueueUseCase(rescueRepository);

      const result = await useCase.execute(
        {
          rescueId: args.input.rescueId,
          volunteerId: volunteer.id,
          estimatedArrivalTime: args.input.estimatedArrivalTime,
          notes: args.input.notes,
        },
        context.user.id,
      );
      return result;
    },

    /**
     * Update rescue progress (generic status update)
     */
    updateRescueProgress: async (
      _parent: any,
      args: { input: any },
      context: GraphQLContext,
    ) => {
      context.requireAuth();
      context.requireRole([
        'VOLUNTEER',
        'VERIFIED_RESCUER',
        'ADMIN',
        'SUPER_ADMIN',
        'DISTRICT_COORDINATOR',
      ]);

      const rescueRepository = new RescueRepository(prisma);
      const useCase = new UpdateRescueStatusUseCase(
        rescueRepository,
        new RescueFinancialService(prisma),
      );

      const result = await useCase.execute(
        {
          rescueId: args.input.rescueId,
          status: args.input.status,
          notes: args.input.notes,
          location: args.input.location,
          metadata: args.input.metadata,
        },
        context.user.id,
      );
      return result;
    },

    /**
     * Mark rescue as completed
     */
    completeRescue: async (
      _parent: any,
      args: { input: any },
      context: GraphQLContext,
    ) => {
      context.requireAuth();
      context.requireRole(['VOLUNTEER', 'VERIFIED_RESCUER']);

      // Get volunteer profile
      const volunteer = await prisma.volunteer.findUnique({
        where: { userId: context.user.id },
      });

      if (!volunteer) {
        throw new Error('Volunteer profile not found');
      }

      const rescueRepository = new RescueRepository(prisma);
      const useCase = new CompleteRescueUseCase(
        rescueRepository,
        new RescueFinancialService(prisma),
      );

      const result = await useCase.execute(
        {
          rescueId: args.input.rescueId,
          volunteerId: volunteer.id,
          outcome: args.input.outcome,
          rescueReport: args.input.rescueReport,
          rescueImages: args.input.rescueImages,
          speciesId: args.input.speciesId,
          notes: args.input.notes,
          location: args.input.location,
        },
        context.user.id,
      );
      return result;
    },

    /**
     * Cancel rescue request
     */
    cancelRescue: async (
      _parent: any,
      args: { rescueId: string; reason: string },
      context: GraphQLContext,
    ) => {
      context.requireAuth();

      const isAdmin = ['ADMIN', 'SUPER_ADMIN', 'DISTRICT_COORDINATOR'].includes(
        context.user.role,
      );
      const cancelledBy = isAdmin ? 'ADMIN' : 'CITIZEN';

      const rescueRepository = new RescueRepository(prisma);
      const useCase = new CancelRescueUseCase(rescueRepository);

      const result = await useCase.execute(
        {
          rescueId: args.rescueId,
          reason: args.reason || 'No reason provided',
          cancelledBy,
        },
        context.user.id,
        context.user.role,
      );
      return result;
    },

    /**
     * Add timeline event to rescue
     */
    addRescueTimelineEvent: async (
      _parent: any,
      args: { input: any },
      context: GraphQLContext,
    ) => {
      context.requireAuth();

      const rescueRepository = new RescueRepository(prisma);

      return await rescueRepository.addTimelineEvent({
        rescueId: args.input.rescueId,
        event: args.input.event,
        description: args.input.description,
        userId: context.user.id,
        lat: args.input.location?.lat,
        lng: args.input.location?.lng,
        metadata: args.input.metadata,
      });
    },
  },
};
