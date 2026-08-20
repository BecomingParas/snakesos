/**
 * Map Service - Geospatial Intelligence Platform
 * 
 * Provides optimized queries for map data including:
 * - Incidents (rescue requests) within bounds
 * - Rescuers (volunteers) within bounds
 * - Treatment centers (hospitals) within bounds
 * - Research-based snakebite hotspots
 * - Real-time statistics and analytics
 */

import { prisma } from '@snake-rescue/database';

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface MapFilters {
  incidentStatuses?: string[];
  rescuerStatuses?: string[];
  priorities?: string[];
  showHistoricalHotspots?: boolean;
  season?: string;
  province?: string;
  district?: string;
  dateRange?: {
    from: Date;
    to: Date;
  };
}

export interface MapOverviewResult {
  incidents: any[];
  rescuers: any[];
  treatmentCenters: any[];
  vehicles: any[];
  hotspots: any[];
  statistics: {
    totalIncidents: number;
    activeRescues: number;
    availableRescuers: number;
    treatmentCenters: number;
    criticalIncidents: number;
    avgResponseTimeMinutes: number | null;
    medianResponseTimeMinutes: number | null;
    successRate: number | null;
  };
  metadata: {
    generatedAt: Date;
    cached: boolean;
    freshnessSeconds: number;
  };
}

export class MapService {
  /**
   * Get comprehensive map overview with all data in a single optimized query
   */
  async getMapOverview(
    bounds: MapBounds,
    filters?: MapFilters
  ): Promise<MapOverviewResult> {
    // Fetch all data in parallel for performance
    const [incidents, rescuers, treatmentCenters, vehicles, hotspots] =
      await Promise.all([
        this.getIncidentsInBounds(bounds, filters),
        this.getRescuersInBounds(bounds, filters),
        this.getTreatmentCentersInBounds(bounds, filters),
        this.getVehiclesInBounds(bounds, filters),
        filters?.showHistoricalHotspots
          ? this.getHotspotsInBounds(bounds, filters)
          : Promise.resolve([]),
      ]);

    // Calculate statistics
    const statistics = this.calculateStatistics({
      incidents,
      rescuers,
      treatmentCenters,
    });

    return {
      incidents,
      rescuers,
      treatmentCenters,
      vehicles,
      hotspots,
      statistics,
      metadata: {
        generatedAt: new Date(),
        cached: false,
        freshnessSeconds: 0,
      },
    };
  }

  /**
   * Get incidents (rescue requests) within geographic bounds
   */
  private async getIncidentsInBounds(
    bounds: MapBounds,
    filters?: MapFilters
  ) {
    return prisma.rescueRequest.findMany({
      where: {
        lat: {
          gte: bounds.south,
          lte: bounds.north,
        },
        lng: {
          gte: bounds.west,
          lte: bounds.east,
        },
        ...(filters?.incidentStatuses && {
          status: { in: filters.incidentStatuses as any },
        }),
        ...(filters?.priorities && {
          priority: { in: filters.priorities as any },
        }),
        ...(filters?.dateRange && {
          createdAt: {
            gte: filters.dateRange.from,
            lte: filters.dateRange.to,
          },
        }),
      },
      include: {
        aiIdentification: {
          include: {
            species: true,
          },
        },
        assignedVolunteer: {
          select: {
            id: true,
            name: true,
            contact: true,
            currentLat: true,
            currentLng: true,
          },
        },
        nearestHospital: {
          select: {
            id: true,
            name: true,
            district: true,
            latitude: true,
            longitude: true,
          },
        },
      },
      take: 1000, // Limit for performance
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Get active rescuers (volunteers) within geographic bounds
   */
  private async getRescuersInBounds(bounds: MapBounds, filters?: MapFilters) {
    return prisma.volunteer.findMany({
      where: {
        currentLat: {
          gte: bounds.south,
          lte: bounds.north,
        },
        currentLng: {
          gte: bounds.west,
          lte: bounds.east,
        },
        status: 'APPROVED',
        ...(filters?.rescuerStatuses && {
          isAvailableNow: filters.rescuerStatuses.includes('AVAILABLE'),
        }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            avatar: true,
          },
        },
        assignedVehicle: {
          select: {
            id: true,
            vehicleType: true,
            vehicleNumber: true,
            status: true,
          },
        },
      },
      take: 500,
    });
  }

  /**
   * Get treatment centers (hospitals) within geographic bounds
   */
  private async getTreatmentCentersInBounds(
    bounds: MapBounds,
    filters?: MapFilters
  ) {
    return prisma.hospital.findMany({
      where: {
        latitude: {
          gte: bounds.south,
          lte: bounds.north,
        },
        longitude: {
          gte: bounds.west,
          lte: bounds.east,
        },
        status: 'ACTIVE',
        ...(filters?.district && {
          district: filters.district,
        }),
        ...(filters?.province && {
          province: filters.province,
        }),
      },
      include: {
        sources: {
          select: {
            sourceType: true,
            verifiedAt: true,
          },
          take: 1,
          orderBy: {
            verifiedAt: 'desc',
          },
        },
      },
      take: 200,
    });
  }

  /**
   * Get rescue vehicles within geographic bounds
   */
  private async getVehiclesInBounds(bounds: MapBounds, filters?: MapFilters) {
    return prisma.rescueVehicle.findMany({
      where: {
        lastKnownLatitude: {
          gte: bounds.south,
          lte: bounds.north,
        },
        lastKnownLongitude: {
          gte: bounds.west,
          lte: bounds.east,
        },
        active: true,
        status: {
          in: ['AVAILABLE', 'ASSIGNED', 'EN_ROUTE', 'ON_SITE'],
        },
      },
      include: {
        rescuers: {
          select: {
            id: true,
            name: true,
            contact: true,
          },
          take: 2,
        },
      },
      take: 100,
    });
  }

  /**
   * Get research-based snakebite hotspots
   */
  private async getHotspotsInBounds(bounds: MapBounds, filters?: MapFilters) {
    return prisma.snakebiteHotspot.findMany({
      where: {
        active: true,
        ...(filters?.season && { season: filters.season as any }),
        ...(filters?.province && { province: filters.province }),
        ...(filters?.district && { district: filters.district }),
      },
      orderBy: {
        riskScore: 'desc',
      },
    });
  }

  /**
   * Calculate real-time statistics from map data
   */
  private calculateStatistics(data: {
    incidents: any[];
    rescuers: any[];
    treatmentCenters: any[];
  }) {
    const activeStatuses = ['ASSIGNED', 'ACCEPTED', 'IN_PROGRESS'];
    const activeRescues = data.incidents.filter((i) =>
      activeStatuses.includes(i.status)
    ).length;

    const criticalIncidents = data.incidents.filter(
      (i) => i.priority === 'CRITICAL'
    ).length;

    const availableRescuers = data.rescuers.filter(
      (r) => r.isAvailableNow
    ).length;

    // Calculate average response time from completed rescues
    const completedRescues = data.incidents.filter(
      (i) => i.status === 'COMPLETED' && i.acceptedAt && i.createdAt
    );

    let avgResponseTimeMinutes: number | null = null;
    if (completedRescues.length > 0) {
      const totalResponseTime = completedRescues.reduce((sum, rescue) => {
        const responseTime =
          (new Date(rescue.acceptedAt).getTime() -
            new Date(rescue.createdAt).getTime()) /
          (1000 * 60); // Convert to minutes
        return sum + responseTime;
      }, 0);
      avgResponseTimeMinutes = totalResponseTime / completedRescues.length;
    }

    // Calculate success rate
    const totalCompleted = data.incidents.filter(
      (i) => i.status === 'COMPLETED'
    ).length;
    const successfulRescues = data.incidents.filter(
      (i) =>
        i.status === 'COMPLETED' &&
        i.outcome === 'RESCUED_RELOCATED'
    ).length;
    const successRate =
      totalCompleted > 0 ? (successfulRescues / totalCompleted) * 100 : null;

    return {
      totalIncidents: data.incidents.length,
      activeRescues,
      availableRescuers,
      treatmentCenters: data.treatmentCenters.length,
      criticalIncidents,
      avgResponseTimeMinutes,
      medianResponseTimeMinutes: null, // TODO: Implement median calculation
      successRate,
    };
  }

  /**
   * Get nearby rescuers for a specific location
   */
  async getNearbyRescuers(
    latitude: number,
    longitude: number,
    radiusKm: number = 20
  ) {
    // Simple bounding box calculation (for more accurate, use PostGIS ST_DWithin)
    const latDelta = radiusKm / 111; // ~111 km per degree latitude
    const lngDelta = radiusKm / (111 * Math.cos((latitude * Math.PI) / 180));

    const bounds: MapBounds = {
      north: latitude + latDelta,
      south: latitude - latDelta,
      east: longitude + lngDelta,
      west: longitude - lngDelta,
    };

    return this.getRescuersInBounds(bounds);
  }

  /**
   * Get nearby treatment centers for a specific location
   */
  async getNearbyTreatmentCenters(
    latitude: number,
    longitude: number,
    radiusKm: number = 50
  ) {
    const latDelta = radiusKm / 111;
    const lngDelta = radiusKm / (111 * Math.cos((latitude * Math.PI) / 180));

    const bounds: MapBounds = {
      north: latitude + latDelta,
      south: latitude - latDelta,
      east: longitude + lngDelta,
      west: longitude - lngDelta,
    };

    return this.getTreatmentCentersInBounds(bounds);
  }

  /**
   * Get all active hotspots for display
   */
  async getAllHotspots() {
    return prisma.snakebiteHotspot.findMany({
      where: {
        active: true,
      },
      orderBy: {
        riskScore: 'desc',
      },
    });
  }
}

// Export singleton instance
export const mapService = new MapService();
