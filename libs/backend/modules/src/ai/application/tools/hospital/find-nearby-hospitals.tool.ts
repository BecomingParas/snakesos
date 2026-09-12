/**
 * Find Nearby Hospitals Tool
 * 
 * Finds hospitals near a location with snake bite treatment capabilities.
 */

import { z } from 'zod';
import { BaseTool } from '../base.tool';
import { ToolDefinition } from '../../types/tool.types';
import { prisma } from '@snake-rescue/database';

const inputSchema = z.object({
  latitude: z.number().min(-90).max(90).describe('Latitude coordinate'),
  longitude: z.number().min(-180).max(180).describe('Longitude coordinate'),
  radiusKm: z.number().int().min(1).max(100).optional().default(50).describe('Search radius in kilometers'),
  requiresAntivenom: z.boolean().optional().default(true).describe('Only return hospitals with antivenom'),
});

type FindNearbyHospitalsInput = z.infer<typeof inputSchema>;

interface HospitalResult {
  id: string;
  name: string;
  address: string;
  municipality: string;
  district: string;
  distanceKm: number;
  phone: string | null;
  emergencyPhone: string | null;
  antivenomStatus: string;
  snakebiteTreatment: boolean;
  emergency24x7: boolean;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

/**
 * Find Nearby Hospitals Tool
 */
export class FindNearbyHospitalsTool extends BaseTool<
  FindNearbyHospitalsInput,
  HospitalResult[]
> {
  readonly definition: ToolDefinition = {
    name: 'findNearbyHospitals',
    description:
      'Find hospitals near a location that provide snake bite treatment and have antivenom available. Returns hospitals sorted by distance with their antivenom status, emergency availability, and contact information. Critical for snakebite emergencies.',
    category: 'hospital',
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
        description: 'Search radius in kilometers (default: 50)',
        required: false,
      },
      {
        name: 'requiresAntivenom',
        type: 'boolean',
        description: 'Only return hospitals with antivenom available (default: true)',
        required: false,
      },
    ],
    requiredPermissions: [],
    requiresConfirmation: false,
    isReadOnly: true,
    visibleToRoles: ['PUBLIC', 'CITIZEN', 'VOLUNTEER', 'VERIFIED_RESCUER', 'ADMIN', 'SUPER_ADMIN'],
    schema: inputSchema,
    exampleUsage:
      'findNearbyHospitals({ latitude: 27.7006, longitude: 83.4484, radiusKm: 50 })',
  };

  protected async executeImpl(
    input: FindNearbyHospitalsInput
  ): Promise<HospitalResult[]> {
    const { latitude, longitude, radiusKm, requiresAntivenom } = input;

    // Build query filters
    const whereClause: any = {
      status: 'ACTIVE',
      snakebiteTreatmentAvailable: true,
    };

    if (requiresAntivenom) {
      whereClause.antivenomStatus = {
        in: ['AVAILABLE', 'LOW_STOCK'],
      };
    }

    // Get hospitals
    const hospitals = await prisma.hospital.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        address: true,
        municipality: true,
        district: true,
        province: true,
        latitude: true,
        longitude: true,
        phone: true,
        emergencyPhone: true,
        antivenomStatus: true,
        snakebiteTreatmentAvailable: true,
        emergency24x7: true,
        emergencyAvailable: true,
      },
    });

    // Calculate distances and filter by radius
    const hospitalsWithDistance = hospitals
      .map((hospital) => {
        const distance = this.calculateDistance(
          latitude,
          longitude,
          hospital.latitude,
          hospital.longitude
        );

        if (distance > radiusKm) {
          return null;
        }

        return {
          id: hospital.id,
          name: hospital.name,
          address: hospital.address,
          municipality: hospital.municipality,
          district: hospital.district,
          distanceKm: Math.round(distance * 10) / 10,
          phone: hospital.phone,
          emergencyPhone: hospital.emergencyPhone,
          antivenomStatus: hospital.antivenomStatus,
          snakebiteTreatment: hospital.snakebiteTreatmentAvailable,
          emergency24x7: hospital.emergency24x7,
          coordinates: {
            latitude: hospital.latitude,
            longitude: hospital.longitude,
          },
        };
      })
      .filter((h): h is NonNullable<typeof h> => h !== null)
      .sort((a, b) => {
        // Prioritize hospitals with available antivenom
        if (a.antivenomStatus === 'AVAILABLE' && b.antivenomStatus !== 'AVAILABLE') {
          return -1;
        }
        if (b.antivenomStatus === 'AVAILABLE' && a.antivenomStatus !== 'AVAILABLE') {
          return 1;
        }
        // Then sort by distance
        return a.distanceKm - b.distanceKm;
      })
      .slice(0, 10); // Return top 10

    return hospitalsWithDistance;
  }

  /**
   * Calculate distance using Haversine formula
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
}
