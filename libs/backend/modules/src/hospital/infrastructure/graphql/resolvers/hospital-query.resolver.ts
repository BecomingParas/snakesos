/**
 * Hospital Query Resolvers
 * Read operations for hospital and antivenom data
 */

import type { GraphQLContext } from '@snake-rescue/core';
import {
  HospitalService,
  type HospitalFilters,
} from '../../../application/hospital.service.js';

const hospitalService = new HospitalService();

interface PaginationInput {
  page?: number;
  limit?: number;
}

export const hospitalQueryResolvers = {
  Hospital: {
    antivenomVerificationFreshness: (hospital: {
      antivenomLastVerifiedAt?: Date | string | null;
    }) => {
      if (!hospital.antivenomLastVerifiedAt) return 'NEVER';

      const lastVerified = new Date(hospital.antivenomLastVerifiedAt).getTime();
      const hoursSinceVerification =
        (Date.now() - lastVerified) / (1000 * 60 * 60);

      return hoursSinceVerification < 24 ? 'FRESH' : 'STALE';
    },
  },
  Query: {
    /**
     * Get a single hospital by ID
     */
    hospital: async (
      _parent: unknown,
      args: { id: string },
      context: GraphQLContext,
    ) => {
      return hospitalService.getHospitalById(args.id);
    },

    /**
     * List hospitals with filters and pagination
     */
    hospitals: async (
      _parent: unknown,
      args: {
        filter?: HospitalFilters;
        first?: number;
        after?: string;
        pagination?: PaginationInput;
      },
      context: GraphQLContext,
    ) => {
      // Support both Relay-style (first/after) and traditional (pagination) arguments
      const limit = args.first || args.pagination?.limit || 100; // Default to 100 for admin
      const page = args.pagination?.page || 1;

      const result = await hospitalService.listHospitals(args.filter, {
        page,
        limit,
      });

      return {
        edges: result.hospitals.map((hospital) => ({
          node: hospital,
          cursor: hospital.id,
        })),
        pageInfo: {
          hasNextPage: result.hasNextPage,
          hasPreviousPage: result.hasPreviousPage,
          startCursor: result.hospitals[0]?.id || null,
          endCursor: result.hospitals[result.hospitals.length - 1]?.id || null,
        },
        totalCount: result.totalCount,
      };
    },

    /**
     * Get nearby hospitals with distance calculation
     */
    nearbyHospitals: async (
      _parent: unknown,
      args: {
        latitude: number;
        longitude: number;
        radiusKm?: number;
        antivenomRequired?: boolean;
        limit?: number;
      },
      context: GraphQLContext,
    ) => {
      return hospitalService.getNearbyHospitals(args);
    },

    /**
     * Find nearest snakebite treatment facilities (filtered)
     */
    nearestSnakebiteFacilities: async (
      _parent: unknown,
      args: {
        latitude: number;
        longitude: number;
        radiusKm?: number;
        limit?: number;
      },
      context: GraphQLContext,
    ) => {
      // Call nearbyHospitals with snakebite filter
      return hospitalService.getNearbyHospitals({
        ...args,
        antivenomRequired: false, // Show all snakebite facilities, not just with antivenom
      });
    },

    /**
     * Get recommended hospitals based on location and emergency type
     */
    recommendedHospitals: async (
      _parent: unknown,
      args: {
        latitude: number;
        longitude: number;
        hasBite?: boolean;
      },
      context: GraphQLContext,
    ) => {
      return hospitalService.getRecommendedHospitals(
        args.latitude,
        args.longitude,
        args.hasBite || false,
      );
    },

    /**
     * Get hospital statistics (admin only)
     */
    hospitalStats: async (
      _parent: unknown,
      _args: unknown,
      context: GraphQLContext,
    ) => {
      context.requireAuth();
      context.requireRole(['ADMIN', 'SUPER_ADMIN']);

      return hospitalService.getStatistics();
    },

    /**
     * Get hospital statistics (alias)
     */
    hospitalStatistics: async (
      _parent: unknown,
      _args: unknown,
      context: GraphQLContext,
    ) => {
      context.requireAuth();
      context.requireRole(['ADMIN', 'SUPER_ADMIN']);

      return hospitalService.getStatistics();
    },

    /**
     * Search hospitals by name, location, or district
     */
    searchHospitals: async (
      _parent: unknown,
      args: {
        query: string;
        limit?: number;
      },
      context: GraphQLContext,
    ) => {
      const result = await hospitalService.listHospitals(
        { search: args.query },
        { page: 1, limit: args.limit || 10 },
      );

      return result.hospitals;
    },

    /**
     * Get hospitals by province
     */
    hospitalsByProvince: async (
      _parent: unknown,
      args: {
        province: string;
        pagination?: PaginationInput;
      },
      context: GraphQLContext,
    ) => {
      const result = await hospitalService.listHospitals(
        { province: args.province },
        args.pagination,
      );

      return {
        edges: result.hospitals.map((hospital) => ({
          node: hospital,
          cursor: hospital.id,
        })),
        pageInfo: {
          hasNextPage: result.hasNextPage,
          hasPreviousPage: result.hasPreviousPage,
          startCursor: result.hospitals[0]?.id || null,
          endCursor: result.hospitals[result.hospitals.length - 1]?.id || null,
        },
        totalCount: result.totalCount,
      };
    },

    /**
     * Get hospitals by district
     */
    hospitalsByDistrict: async (
      _parent: unknown,
      args: {
        district: string;
        pagination?: PaginationInput;
      },
      context: GraphQLContext,
    ) => {
      const result = await hospitalService.listHospitals(
        { district: args.district },
        args.pagination,
      );

      return {
        edges: result.hospitals.map((hospital) => ({
          node: hospital,
          cursor: hospital.id,
        })),
        pageInfo: {
          hasNextPage: result.hasNextPage,
          hasPreviousPage: result.hasPreviousPage,
          startCursor: result.hospitals[0]?.id || null,
          endCursor: result.hospitals[result.hospitals.length - 1]?.id || null,
        },
        totalCount: result.totalCount,
      };
    },
  },
};
