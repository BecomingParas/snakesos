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
import { createRescueNotifications } from '../../../../notifications.resolver.js';
import { RescueFinancialService } from '../../../../finance/application/rescue-financial.service.js';
import { BadRequestError } from '@snake-rescue/shared';

const PUBLIC_SUBMISSION_WINDOW_MS = 15 * 60 * 1000;
const PUBLIC_SUBMISSION_LIMIT = 5;
const publicSubmissionAttempts = new Map<
  string,
  { count: number; resetAt: number }
>();

function enforcePublicSubmissionLimit(
  ip: string,
  phone: string,
  deviceId: string,
) {
  const now = Date.now();
  for (const [key, attempt] of publicSubmissionAttempts) {
    if (attempt.resetAt <= now) publicSubmissionAttempts.delete(key);
  }
  for (const key of [`ip:${ip}`, `phone:${phone}`, `device:${deviceId}`]) {
    const attempt = publicSubmissionAttempts.get(key);
    if (
      attempt &&
      attempt.count >= PUBLIC_SUBMISSION_LIMIT &&
      attempt.resetAt > now
    ) {
      throw new BadRequestError(
        'Too many emergency submissions. Please call the hotline.',
      );
    }
    publicSubmissionAttempts.set(key, {
      count: (attempt?.count || 0) + 1,
      resetAt: attempt?.resetAt || now + PUBLIC_SUBMISSION_WINDOW_MS,
    });
  }
}

function normalizePublicPhone(phone: string) {
  const digits = phone.replace(/\D/g, '');
  return digits.startsWith('977') && digits.length === 13
    ? digits.slice(3)
    : digits;
}

export const rescueMutationResolvers = {
  Mutation: {
    submitPublicEmergencyRequest: async (
      _parent: unknown,
      args: { input: Record<string, unknown> },
      context: GraphQLContext,
    ) => {
      const input = args.input;
      const idempotencyKey = String(input.idempotencyKey || '');
      const deviceId = String(input.deviceId || 'unknown');
      if (!idempotencyKey || idempotencyKey.length > 100) {
        throw new BadRequestError('A valid idempotency key is required');
      }

      const existing = await prisma.rescueRequest.findUnique({
        where: { publicIdempotencyKey: idempotencyKey },
      });
      if (existing) {
        return {
          success: true,
          referenceNumber:
            existing.referenceNumber ||
            `BR-${existing.createdAt.getFullYear()}-${existing.id.replace(/-/g, '').slice(0, 8).toUpperCase()}`,
          publicStatus: 'OPEN',
          createdAt: existing.createdAt,
        };
      }

      const phone = normalizePublicPhone(String(input.phone || ''));
      const municipality = String(input.municipality || '');
      enforcePublicSubmissionLimit(
        context.req.ip || 'unknown',
        phone,
        deviceId,
      );
      const recentDuplicate = await prisma.rescueRequest.findFirst({
        where: {
          phone,
          municipality,
          createdAt: { gte: new Date(Date.now() - 10 * 60 * 1000) },
          status: { in: ['PENDING', 'ASSIGNED', 'ACCEPTED', 'IN_PROGRESS'] },
        },
      });
      if (recentDuplicate) {
        return {
          success: true,
          referenceNumber:
            recentDuplicate.referenceNumber || recentDuplicate.id,
          publicStatus: 'OPEN',
          createdAt: recentDuplicate.createdAt,
        };
      }

      const validated = RescueValidator.validateCreateRescue({
        name: input.fullName,
        phone,
        email: input.email,
        municipality,
        ward: input.ward,
        address: input.address || input.generalArea,
        landmark: input.landmark,
        lat: input.latitude,
        lng: input.longitude,
        snakeDescription: input.snakeDescription,
        priority: input.urgency,
        notes: input.notes,
        isEmergency: true,
        hasBite: input.hasBite,
        publicIdempotencyKey: idempotencyKey,
      });
      const result = await new CreateRescueUseCase(
        new RescueRepository(prisma),
      ).execute(validated, context.user?.id);
      const updated = result;
      await createRescueNotifications(
        updated.id,
        'RESCUE_CREATED',
        'Public emergency rescue request',
        'A public emergency rescue request needs immediate attention.',
        context.user?.id,
      );
      return {
        success: true,
        referenceNumber:
          updated.referenceNumber ||
          `BR-${updated.createdAt.getFullYear()}-${updated.id.replace(/-/g, '').slice(0, 8).toUpperCase()}`,
        publicStatus: 'OPEN',
        createdAt: updated.createdAt,
      };
    },

    submitPublicRescueReport: async (
      _parent: unknown,
      args: { input: any },
      context: GraphQLContext,
    ) => {
      const input = RescueValidator.validateCreateRescue({
        name: args.input.name,
        phone: args.input.phone,
        email: args.input.email,
        municipality: args.input.municipality,
        ward: args.input.ward,
        address: args.input.generalArea,
        lat: args.input.latitude,
        lng: args.input.longitude,
        snakeDescription: args.input.description,
        priority: args.input.urgency,
        isEmergency: args.input.isEmergency,
        hasBite: args.input.hasBite,
        source: 'WEB',
      });
      const rescueRepository = new RescueRepository(prisma);
      const result = await new CreateRescueUseCase(rescueRepository).execute(
        input,
        context.user?.id,
      );
      return {
        success: true,
        referenceNumber: result.referenceNumber || result.id,
        publicStatus: 'OPEN',
        createdAt: result.createdAt,
      };
    },

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
      if (input.isEmergency || input.hasBite) {
        await createRescueNotifications(
          result.id,
          'RESCUE_CREATED',
          'Emergency rescue request',
          input.hasBite
            ? 'A snake bite emergency needs immediate attention.'
            : 'A high-priority emergency rescue request needs attention.',
          context.user.id,
        );
      }

      // 3. Return response
      return result;
    },

    /**
     * Update the rescue priority from the admin command surface
     */
    updateRescueRequest: async (
      _parent: any,
      args: { id: string; input: Record<string, unknown> },
      context: GraphQLContext,
    ) => {
      context.requireAuth();
      context.requireRole(['ADMIN', 'SUPER_ADMIN']);

      const rescueRepository = new RescueRepository(prisma);
      const rescue = await rescueRepository.findById(args.id);
      if (!rescue) {
        throw new Error('Rescue request not found');
      }

      const updateData = Object.fromEntries(
        Object.entries(args.input).filter(
          ([field, value]) =>
            [
              'municipality',
              'ward',
              'address',
              'landmark',
              'snakeDescription',
              'snakeSize',
              'snakeColor',
              'priority',
              'stillPresent',
              'notes',
              'isEmergency',
              'emergencyDetails',
              'hasBite',
              'biteDetails',
            ].includes(field) && value !== undefined,
        ),
      );
      if (Object.keys(updateData).length === 0) {
        throw new Error('At least one rescue field is required');
      }

      const updatedRescue = await rescueRepository.update(args.id, updateData);

      if (args.input.priority && rescue.priority !== args.input.priority) {
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

    deleteRescueRequest: async (
      _parent: unknown,
      args: { id: string },
      context: GraphQLContext,
    ) => {
      context.requireAuth();
      context.requireRole(['SUPER_ADMIN']);

      const rescue = await prisma.rescueRequest.findUnique({
        where: { id: args.id },
        select: { id: true, deletedAt: true },
      });
      if (!rescue) throw new BadRequestError('Rescue request not found');
      if (rescue.deletedAt) {
        return { success: true, message: 'Rescue request already deleted' };
      }

      await prisma.rescueRequest.update({
        where: { id: args.id },
        data: { deletedAt: new Date() },
      });
      return { success: true, message: 'Rescue request deleted' };
    },
  },
};
