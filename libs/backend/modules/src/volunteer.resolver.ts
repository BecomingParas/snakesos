import { prisma } from '@snake-rescue/database';
import type { GraphQLContext } from '@snake-rescue/core';

export const volunteerResolvers = {
  Query: {
    myVolunteerProfile: async (
      _parent: unknown,
      _args: unknown,
      context: GraphQLContext,
    ) => {
      context.requireAuth();
      return prisma.volunteer.findUnique({
        where: { userId: context.user.id },
      });
    },
  },
  Mutation: {
    updateVolunteerProfile: async (
      _parent: unknown,
      args: { input: Record<string, unknown> },
      context: GraphQLContext,
    ) => {
      context.requireAuth();
      context.requireRole(['VOLUNTEER', 'VERIFIED_RESCUER']);

      const volunteer = await prisma.volunteer.findUnique({
        where: { userId: context.user.id },
      });
      if (!volunteer) throw new Error('Rescuer profile not found');

      const input = args.input;
      const allowedFields = [
        'experience',
        'experienceYears',
        'municipality',
        'ward',
        'vehicle',
        'vehicleDetails',
        'skills',
        'certifications',
        'languages',
        'availableTime',
        'availableDays',
        'availabilitySchedule',
        'emergencyAvailability',
        'assignedZone',
        'coverageRadius',
        'bio',
        'hasEquipment',
        'equipment',
        'isAvailableNow',
      ];
      const data = Object.fromEntries(
        allowedFields
          .filter((field) => input[field] !== undefined)
          .map((field) => [field, input[field]]),
      );

      return prisma.volunteer.update({
        where: { id: volunteer.id },
        data,
      });
    },
  },
};
