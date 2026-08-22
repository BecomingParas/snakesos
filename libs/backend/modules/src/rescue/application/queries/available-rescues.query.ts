/**
 * Available Rescues Query
 * Fetches PENDING unassigned rescues for the queue
 */

import { RescueRepository } from '@snake-rescue/database';

export interface AvailableRescuesFilters {
  municipality?: string;
  maxDistance?: number;
  rescuerLat?: number;
  rescuerLng?: number;
  limit?: number;
}

export class AvailableRescuesQuery {
  constructor(private readonly rescueRepository: RescueRepository) {}

  async execute(filters: AvailableRescuesFilters = {}): Promise<any[]> {
    // Fetch available rescues from repository
    const rescues = await this.rescueRepository.findAvailableForQueue({
      municipality: filters.municipality,
      maxDistance: filters.maxDistance,
      rescuerLat: filters.rescuerLat,
      rescuerLng: filters.rescuerLng,
      limit: filters.limit || 50,
    });

    // Calculate distance if rescuer location provided
    if (filters.rescuerLat && filters.rescuerLng) {
      return rescues.map(rescue => {
        const distance = this.calculateDistance(
          filters.rescuerLat!,
          filters.rescuerLng!,
          rescue.lat || 0,
          rescue.lng || 0
        );

        return {
          ...rescue,
          distance: Math.round(distance * 10) / 10, // Round to 1 decimal
        };
      });
    }

    return rescues;
  }

  /**
   * Calculate distance between two coordinates using Haversine formula
   * Returns distance in kilometers
   */
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}
