/**
 * Hospital Service
 * Business logic for hospital and antivenom management
 */

import { prisma, type AntivenomStatus, type Prisma } from '@snake-rescue/database';

export interface HospitalFilters {
  province?: string;
  district?: string;
  municipality?: string;
  hospitalType?: string;
  antivenomStatus?: AntivenomStatus;
  emergency24x7?: boolean;
  snakebiteTreatmentAvailable?: boolean;
  search?: string;
}

export interface NearbyHospitalInput {
  latitude: number;
  longitude: number;
  radiusKm?: number;
  antivenomRequired?: boolean;
  limit?: number;
}

export interface HospitalRecommendation {
  id: string;
  name: string;
  address: string;
  phone?: string;
  emergencyPhone?: string;
  distance: number;
  distanceFormatted: string;
  antivenomStatus: string;
  emergency24x7: boolean;
  estimatedTravelTime?: string;
  latitude: number;
  longitude: number;
  verificationFreshness?: 'FRESH' | 'STALE' | 'UNKNOWN';
}

export class HospitalService {
  /**
   * Calculate distance between two points using Haversine formula
   * Returns distance in kilometers
   */
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
      Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return Math.round(distance * 100) / 100; // Round to 2 decimal places
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Format distance for display
   */
  private formatDistance(km: number): string {
    if (km < 1) {
      return `${Math.round(km * 1000)}m`;
    }
    return `${km.toFixed(1)}km`;
  }

  /**
   * Estimate travel time (rough estimation: 40 km/h average in Nepal)
   */
  private estimateTravelTime(distanceKm: number): string {
    const avgSpeedKmh = 40;
    const hours = distanceKm / avgSpeedKmh;
    const minutes = Math.round(hours * 60);
    
    if (minutes < 60) {
      return `~${minutes} mins`;
    }
    
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `~${hrs}h ${mins}m` : `~${hrs}h`;
  }

  /**
   * Check verification freshness
   */
  private getVerificationFreshness(lastVerified?: Date | null): 'FRESH' | 'STALE' | 'UNKNOWN' {
    if (!lastVerified) return 'UNKNOWN';
    
    const hoursSinceVerification = (Date.now() - lastVerified.getTime()) / (1000 * 60 * 60);
    
    if (hoursSinceVerification < 24) return 'FRESH';
    return 'STALE';
  }

  /**
   * Get nearby hospitals with distance calculation
   */
  async getNearbyHospitals(input: NearbyHospitalInput): Promise<HospitalRecommendation[]> {
    const { latitude, longitude, radiusKm = 50, antivenomRequired = false, limit = 10 } = input;

    // Build where clause
    const where: Prisma.HospitalWhereInput = {
      status: 'ACTIVE',
      snakebiteTreatmentAvailable: true,
      ...(antivenomRequired && { antivenomStatus: 'AVAILABLE' }),
    };

    // Fetch all hospitals (we'll filter by distance in JS)
    const hospitals = await prisma.hospital.findMany({
      where,
      select: {
        id: true,
        name: true,
        address: true,
        phone: true,
        emergencyPhone: true,
        latitude: true,
        longitude: true,
        antivenomStatus: true,
        emergency24x7: true,
        antivenomLastVerifiedAt: true,
      },
    });

    // Calculate distances and filter
    const hospitalsWithDistance = hospitals
      .map((hospital) => {
        const distance = this.calculateDistance(
          latitude,
          longitude,
          hospital.latitude,
          hospital.longitude
        );

        return {
          id: hospital.id,
          name: hospital.name,
          address: hospital.address,
          phone: hospital.phone ?? undefined,
          emergencyPhone: hospital.emergencyPhone ?? undefined,
          latitude: hospital.latitude,
          longitude: hospital.longitude,
          antivenomStatus: hospital.antivenomStatus,
          emergency24x7: hospital.emergency24x7,
          distance,
          distanceFormatted: this.formatDistance(distance),
          estimatedTravelTime: this.estimateTravelTime(distance),
          verificationFreshness: this.getVerificationFreshness(hospital.antivenomLastVerifiedAt),
        };
      })
      .filter((h) => h.distance <= radiusKm)
      .sort((a, b) => {
        // Sort by distance, but prioritize hospitals with antivenom
        if (a.antivenomStatus === 'AVAILABLE' && b.antivenomStatus !== 'AVAILABLE') return -1;
        if (a.antivenomStatus !== 'AVAILABLE' && b.antivenomStatus === 'AVAILABLE') return 1;
        return a.distance - b.distance;
      })
      .slice(0, limit);

    return hospitalsWithDistance;
  }

  /**
   * Get hospital recommendations based on emergency type
   */
  async getRecommendedHospitals(
    latitude: number,
    longitude: number,
    hasBite = false
  ): Promise<HospitalRecommendation[]> {
    if (hasBite) {
      // For snakebite victims: CRITICAL - prioritize antivenom availability
      return this.getNearbyHospitals({
        latitude,
        longitude,
        radiusKm: 100, // Expand search radius for bites
        antivenomRequired: true,
        limit: 5,
      });
    }

    // For snake rescue: show all nearby snakebite treatment centers
    return this.getNearbyHospitals({
      latitude,
      longitude,
      radiusKm: 30,
      antivenomRequired: false,
      limit: 5,
    });
  }

  /**
   * List hospitals with filters and pagination
   */
  async listHospitals(
    filters: HospitalFilters = {},
    pagination: { page?: number; limit?: number } = {}
  ) {
    const page = pagination.page || 1;
    const limit = pagination.limit || 20;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.HospitalWhereInput = {
      status: 'ACTIVE',
      ...(filters.province && { province: filters.province }),
      ...(filters.district && { district: filters.district }),
      ...(filters.municipality && { municipality: filters.municipality }),
      ...(filters.hospitalType && { hospitalType: filters.hospitalType }),
      ...(filters.antivenomStatus && { antivenomStatus: filters.antivenomStatus }),
      ...(filters.emergency24x7 !== undefined && { emergency24x7: filters.emergency24x7 }),
      ...(filters.snakebiteTreatmentAvailable !== undefined && { 
        snakebiteTreatmentAvailable: filters.snakebiteTreatmentAvailable 
      }),
      ...(filters.search && {
        OR: [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { address: { contains: filters.search, mode: 'insensitive' } },
          { municipality: { contains: filters.search, mode: 'insensitive' } },
          { district: { contains: filters.search, mode: 'insensitive' } },
        ],
      }),
    };

    const [hospitals, totalCount] = await Promise.all([
      prisma.hospital.findMany({
        where,
        take: limit,
        skip,
        orderBy: [{ province: 'asc' }, { district: 'asc' }, { name: 'asc' }],
        include: {
          verificationRecords: {
            take: 1,
            orderBy: { verificationDate: 'desc' },
          },
        },
      }),
      prisma.hospital.count({ where }),
    ]);

    return {
      hospitals,
      totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      hasNextPage: skip + limit < totalCount,
      hasPreviousPage: page > 1,
    };
  }

  /**
   * Get hospital by ID
   */
  async getHospitalById(id: string) {
    return prisma.hospital.findUnique({
      where: { id },
      include: {
        verificationRecords: {
          orderBy: { verificationDate: 'desc' },
          take: 10,
        },
        reports: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });
  }

  /**
   * Create hospital
   */
  async createHospital(data: Prisma.HospitalCreateInput) {
    return prisma.hospital.create({
      data: {
        ...data,
        status: 'ACTIVE',
      },
    });
  }

  /**
   * Update hospital
   */
  async updateHospital(id: string, data: Prisma.HospitalUpdateInput) {
    return prisma.hospital.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete hospital (soft delete)
   */
  async deleteHospital(id: string) {
    return prisma.hospital.update({
      where: { id },
      data: { status: 'INACTIVE' },
    });
  }

  /**
   * Verify antivenom status
   */
  async verifyAntivenomStatus(
    hospitalId: string,
    status: 'AVAILABLE' | 'OUT_OF_STOCK' | 'UNKNOWN',
    verifiedBy: string,
    notes?: string
  ) {
    const now = new Date();

    // Create verification record
    const verification = await prisma.hospitalVerification.create({
      data: {
        hospitalId,
        verifiedBy,
        verificationType: 'PHONE_CALL',
        antivenomStatus: status,
        snakebiteTreatment: true,
        verificationDate: now,
        notes,
      },
    });

    // Update hospital record
    await prisma.hospital.update({
      where: { id: hospitalId },
      data: {
        antivenomStatus: status,
        antivenomLastVerifiedAt: now,
      },
    });

    return verification;
  }

  /**
   * Report antivenom status (from public/rescuers)
   */
  async reportAntivenomStatus(
    hospitalId: string,
    status: 'AVAILABLE' | 'OUT_OF_STOCK' | 'UNKNOWN',
    reportedBy: string,
    notes?: string
  ) {
    return prisma.hospitalReport.create({
      data: {
        hospitalId,
        reportedBy,
        reportType: 'OUTDATED_STATUS',
        description: `Antivenom status reported as: ${status}. ${notes || ''}`,
        status: 'NEW',
      },
    });
  }

  /**
   * Get hospital statistics
   */
  async getStatistics() {
    const [
      totalHospitals,
      antivenomAvailable,
      antivenomUnknown,
      emergency24x7Count,
      byProvince,
    ] = await Promise.all([
      prisma.hospital.count({ where: { status: 'ACTIVE' } }),
      prisma.hospital.count({
        where: { status: 'ACTIVE', antivenomStatus: 'AVAILABLE' },
      }),
      prisma.hospital.count({
        where: { status: 'ACTIVE', antivenomStatus: 'UNKNOWN' },
      }),
      prisma.hospital.count({
        where: { status: 'ACTIVE', emergency24x7: true },
      }),
      prisma.hospital.groupBy({
        by: ['province'],
        where: { status: 'ACTIVE' },
        _count: true,
      }),
    ]);

    return {
      totalHospitals,
      antivenomAvailable,
      antivenomUnknown,
      emergency24x7Count,
      byProvince: byProvince.map((p) => ({
        province: p.province,
        count: p._count,
      })),
    };
  }
}
