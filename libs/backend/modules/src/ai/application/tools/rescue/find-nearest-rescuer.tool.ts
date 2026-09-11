/**
 * Find Nearest Rescuer Tool
 * 
 * Finds the nearest available rescuer to a given location.
 * Uses existing rescuer services and location utilities.
 */

import { z } from 'zod';
import { BaseTool } from '../base.tool';
import { ToolDefinition } from '../../types/tool.types';
import { prisma } from '@snake-rescue/database';

const inputSchema = z.object({
  latitude: z.number().min(-90).max(90).describe('Latitude coordinate'),
  longitude: z.number().min(-180).max(180).describe('Longitude coordinate'),
  radiusKm: z.number().int().min(1).max(50).optional().default(20).describe('Search radius in kilometers'),
  onlyAvailable: z.boolean().optional().default(true).describe('Only return available rescuers'),
});

type FindNearestRescuerInput = z.infer<typeof inputSchema>;

interface RescuerResult {
  id: string;
  name: string;
  phone: string;
  distanceKm: number;
  isAvailable: boolean;
  experience: string;
  municipality: string;
  totalRescues: number;
  successRate: number | null;
}

/**
 * Find Nearest Rescuer Tool
 */
export class FindNearestRescuerTool extends BaseTool<
  FindNearestRescuerInput,
  RescuerResult[]
> {
  readonly definition: ToolDefinition = {
    name: 'findNearestRescuer',
    description:
      'Find the nearest available snake rescuer to a specific location. Returns rescuers sorted by distance with their availability status, experience, and success rate. Use this when someone needs immediate rescue assistance.',
    category: 'rescue',
    parameters: [
      {
        name: 'latitude',
        type: 'number',
        description: 'Latitude of the location',
        required: true,
      },
      {
        name: 'longitude',
        type: 'number',
        description: 'Longitude of the location',
        required: true,
      },
      {
        name: 'radiusKm',
        type: 'number',
        description: 'Search radius in kilometers (default: 20)',
        required: false,
      },
      {
        name: 'onlyAvailable',
        type: 'boolean',
        description: 'Only return currently available rescuers (default: true)',
        required: false,
      },
    ],
    requiredPermissions: [],
    requiresConfirmation: false,
    isReadOnly: true,
    visibleToRoles: ['PUBLIC', 'CITIZEN', 'VOLUNTEER', 'VERIFIED_RESCUER', 'ADMIN', 'SUPER_ADMIN'],
    schema: inputSchema,
    exampleUsage:
      'findNearestRescuer({ latitude: 27.7006, longitude: 83.4484, radiusKm: 20 })',
  };

  protected async executeImpl(
    input: FindNearestRescuerInput
  ): Promise<RescuerResult[]> {
    const { latitude, longitude, radiusKm, onlyAvailable } = input;

    // Build query filters
    const whereClause: any = {
      status: 'VERIFIED', // Only verified rescuers
    };

    if (onlyAvailable) {
      whereClause.isAvailableNow = true;
    }

    // Get rescuers with location data
    const rescuers = await prisma.volunteer.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        contact: true,
        currentLat: true,
        currentLng: true,
        lastKnownLatitude: true,
        lastKnownLongitude: true,
        isAvailableNow: true,
        experience: true,
        municipality: true,
        totalRescues: true,
        successRate: true,
        serviceRadiusKm: true,
      },
    });

    // Calculate distances and filter by radius
    const rescuersWithDistance = rescuers
      .map((rescuer) => {
        // Use last known location or current location
        const rescuerLat = rescuer.lastKnownLatitude || rescuer.currentLat;
        const rescuerLng = rescuer.lastKnownLongitude || rescuer.currentLng;

        if (!rescuerLat || !rescuerLng) {
          return null; // Skip rescuers without location
        }

        const distance = this.calculateDistance(
          latitude,
          longitude,
          rescuerLat,
          rescuerLng
        );

        // Filter by radius and rescuer's service radius
        const serviceRadius = rescuer.serviceRadiusKm || 20;
        if (distance > radiusKm || distance > serviceRadius) {
          return null;
        }

        return {
          id: rescuer.id,
          name: rescuer.name,
          phone: rescuer.contact,
          distanceKm: Math.round(distance * 10) / 10, // Round to 1 decimal
          isAvailable: rescuer.isAvailableNow,
          experience: rescuer.experience,
          municipality: rescuer.municipality,
          totalRescues: rescuer.totalRescues,
          successRate: rescuer.successRate,
        };
      })
      .filter((r): r is RescuerResult => r !== null)
      .sort((a, b) => a.distanceKm - b.distanceKm) // Sort by distance
      .slice(0, 5); // Return top 5

    return rescuersWithDistance;
  }

  /**
   * Calculate distance between two coordinates using Haversine formula
   * Returns distance in kilometers
   */
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }

  /**
   * Sanitize rescuer data for public display
   */
  protected sanitizeForAudit(data: any): any {
    // Don't expose full phone numbers in audit logs
    if (Array.isArray(data)) {
      return data.map((rescuer) => ({
        ...rescuer,
        phone: rescuer.phone ? '***' + rescuer.phone.slice(-4) : undefined,
      }));
    }
    return data;
  }
}
