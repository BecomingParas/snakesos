import { GraphQLContext } from '@snake-rescue/core';
import { prisma } from '@snake-rescue/database';

export const emergencyContactResolvers = {
  Query: {
    myEmergencyContact: async (
      _parent: unknown,
      _args: unknown,
      context: GraphQLContext,
    ) => {
      context.requireAuth();
      return prisma.emergencyContact.findUnique({
        where: { userId: context.user.id },
      });
    },
  },
  Mutation: {
    saveEmergencyContact: async (
      _parent: unknown,
      args: {
        input: { name: string; phone: string; relationship: string };
      },
      context: GraphQLContext,
    ) => {
      context.requireAuth();
      return prisma.emergencyContact.upsert({
        where: { userId: context.user.id },
        create: {
          userId: context.user.id,
          name: args.input.name.trim(),
          phone: args.input.phone.trim(),
          relationship: args.input.relationship.trim(),
        },
        update: {
          name: args.input.name.trim(),
          phone: args.input.phone.trim(),
          relationship: args.input.relationship.trim(),
        },
      });
    },
  },
};
