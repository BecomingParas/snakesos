/**
 * Map Query Resolvers
 * Geospatial intelligence queries for the admin map
 */

import type { GraphQLContext } from '@snake-rescue/core';
import { mapService, type MapBounds, type MapFilters } from '../../../application/map.service.js';

const MAP_MANAGEMENT_ROLES = [
  'ADMIN',
  'SUPER_ADMIN',
  'DISTRICT_COORDINATOR',
] as const;

export const mapQueryResolvers = {
  Query: {
    /**
     * Get comprehensive map overview with all data
     * Optimized single query for admin dashboard map
     */
    mapOverview: async (
      _parent: unknown,
      args: {
        bounds: MapBounds;
        filters?: MapFilters;
      },
      context: GraphQLContext
    ) => {
      context.requireAuth();
      context.requireRole([...MAP_MANAGEMENT_ROLES]);
      return mapService.getMapOverview(args.bounds, args.filters);
    },

    /**
     * Get nearby rescuers for a specific location
     */
    nearbyRescuers: async (
      _parent: unknown,
      args: {
        latitude: number;
        longitude: number;
        radiusKm?: number;
      },
      context: GraphQLContext
    ) => {
      context.requireAuth();
      context.requireRole([
        'RESCUER',
        ...MAP_MANAGEMENT_ROLES,
      ]);
      return mapService.getNearbyRescuers(
        args.latitude,
        args.longitude,
        args.radiusKm || 20
      );
    },

    /**
     * Get nearby treatment centers for a specific location
     */
    nearbyTreatmentCenters: async (
      _parent: unknown,
      args: {
        latitude: number;
        longitude: number;
        radiusKm?: number;
      },
      context: GraphQLContext
    ) => {
      context.requireAuth();
      return mapService.getNearbyTreatmentCenters(
        args.latitude,
        args.longitude,
        args.radiusKm || 50
      );
    },

    /**
     * Get all active snakebite hotspots
     */
    snakebiteHotspots: async (
      _parent: unknown,
      args: {
        province?: string;
        district?: string;
        riskLevel?: string;
      },
      context: GraphQLContext
    ) => {
      context.requireAuth();
      context.requireRole([...MAP_MANAGEMENT_ROLES]);
      return mapService.getAllHotspots();
    },
  },
};
