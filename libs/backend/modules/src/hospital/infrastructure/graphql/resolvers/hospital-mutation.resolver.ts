/**
 * Hospital Mutation Resolvers
 * Write operations for hospital and antivenom management
 */

import type { GraphQLContext } from '@snake-rescue/core';
import type { Prisma } from '@snake-rescue/database';
import { HospitalService } from '../../../application/hospital.service.js';

const hospitalService = new HospitalService();

export const hospitalMutationResolvers = {
  Mutation: {
    /**
     * Create a new hospital (Admin only)
     */
    createHospital: async (
      _parent: unknown,
      args: { input: Prisma.HospitalCreateInput },
      context: GraphQLContext
    ) => {
      context.requireAuth();
      context.requireRole(['ADMIN', 'SUPER_ADMIN']);

      return hospitalService.createHospital(args.input);
    },

    /**
     * Update hospital information (Admin only)
     */
    updateHospital: async (
      _parent: unknown,
      args: { id: string; input: Prisma.HospitalUpdateInput },
      context: GraphQLContext
    ) => {
      context.requireAuth();
      context.requireRole(['ADMIN', 'SUPER_ADMIN']);

      return hospitalService.updateHospital(args.id, args.input);
    },

    /**
     * Delete hospital (Admin only - soft delete)
     */
    deleteHospital: async (
      _parent: unknown,
      args: { id: string },
      context: GraphQLContext
    ) => {
      context.requireAuth();
      context.requireRole(['ADMIN', 'SUPER_ADMIN']);

      return hospitalService.deleteHospital(args.id);
    },

    /**
     * Verify antivenom status (Admin/Coordinator only)
     */
    verifyAntivenomStatus: async (
      _parent: unknown,
      args: {
        hospitalId: string;
        status: 'AVAILABLE' | 'OUT_OF_STOCK' | 'UNKNOWN';
        notes?: string;
      },
      context: GraphQLContext
    ) => {
      context.requireAuth();
      context.requireRole(['ADMIN', 'SUPER_ADMIN', 'DISTRICT_COORDINATOR']);

      return hospitalService.verifyAntivenomStatus(
        args.hospitalId,
        args.status,
        context.user.id,
        args.notes
      );
    },

    /**
     * Report antivenom status (Any authenticated user)
     * Used for crowd-sourced reporting from rescuers/citizens
     */
    reportAntivenomStatus: async (
      _parent: unknown,
      args: {
        hospitalId: string;
        status: 'AVAILABLE' | 'OUT_OF_STOCK' | 'UNKNOWN';
        notes?: string;
      },
      context: GraphQLContext
    ) => {
      context.requireAuth();

      return hospitalService.reportAntivenomStatus(
        args.hospitalId,
        args.status,
        context.user.id,
        args.notes
      );
    },

    /**
     * Bulk update hospital antivenom status from verification drive
     */
    bulkVerifyAntivenom: async (
      _parent: unknown,
      args: {
        verifications: Array<{
          hospitalId: string;
          status: 'AVAILABLE' | 'OUT_OF_STOCK' | 'UNKNOWN';
          notes?: string;
        }>;
      },
      context: GraphQLContext
    ) => {
      context.requireAuth();
      context.requireRole(['ADMIN', 'SUPER_ADMIN', 'DISTRICT_COORDINATOR']);

      const results = await Promise.all(
        args.verifications.map((v) =>
          hospitalService.verifyAntivenomStatus(
            v.hospitalId,
            v.status,
            context.user.id,
            v.notes
          )
        )
      );

      return {
        success: true,
        count: results.length,
        verifications: results,
      };
    },
  },
};
