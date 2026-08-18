/**
 * Rescue Repository
 * Database operations for RescueRequest entity
 */

import { PrismaClient, RescueRequest, Prisma, RescueStatus } from '../prisma/generated/client.js';
import { BaseRepository } from './base.repository.js';

export class RescueRepository extends BaseRepository<
  RescueRequest,
  Prisma.RescueRequestCreateInput,
  Prisma.RescueRequestUpdateInput,
  Prisma.RescueRequestWhereInput
> {
  constructor(prisma: PrismaClient) {
    super(prisma, 'rescueRequest' as Prisma.ModelName);
  }

  /**
   * Find rescue with full details
   */
  async findByIdWithDetails(id: string) {
    return this.model.findUnique({
      where: { id },
      include: {
        reporter: true,
        volunteer: true,
        species: true,
        timeline: {
          orderBy: { timestamp: 'asc' },
        },
      },
    });
  }

  /**
   * Find rescues by status
   */
  async findByStatus(
    status: RescueStatus,
    options?: {
      skip?: number;
      take?: number;
    }
  ): Promise<RescueRequest[]> {
    return this.model.findMany({
      where: { status },
      include: {
        reporter: true,
        volunteer: true,
      },
      orderBy: { createdAt: 'desc' },
      ...options,
    });
  }

  /**
   * Find rescues by volunteer
   */
  async findByVolunteer(volunteerId: string): Promise<RescueRequest[]> {
    return this.model.findMany({
      where: { volunteerId },
      include: {
        reporter: true,
        species: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Find pending rescues (unassigned)
   */
  async findPending(): Promise<RescueRequest[]> {
    return this.model.findMany({
      where: {
        status: RescueStatus.PENDING,
        volunteerId: null,
      },
      include: {
        reporter: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Assign volunteer to rescue
   */
  async assignVolunteer(rescueId: string, volunteerId: string): Promise<RescueRequest> {
    return this.model.update({
      where: { id: rescueId },
      data: {
        volunteerId,
        status: RescueStatus.ASSIGNED,
      },
      include: {
        volunteer: true,
        reporter: true,
      },
    });
  }

  /**
   * Update rescue status
   */
  async updateStatus(rescueId: string, status: RescueStatus): Promise<RescueRequest> {
    return this.model.update({
      where: { id: rescueId },
      data: { status },
    });
  }

  /**
   * Get rescue statistics
   */
  async getStatistics() {
    const total = await this.count({});
    const byStatus = await this.prisma.$queryRaw`
      SELECT status, COUNT(*)::int as count
      FROM "RescueRequest"
      GROUP BY status
    `;

    return {
      total,
      byStatus,
    };
  }

  /**
   * Find recent rescues
   */
  async findRecent(limit: number = 10): Promise<RescueRequest[]> {
    return this.model.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        reporter: true,
        volunteer: true,
      },
    });
  }

  /**
   * Search rescues by location
   */
  async searchByLocation(
    municipality: string,
    ward?: string
  ): Promise<RescueRequest[]> {
    return this.model.findMany({
      where: {
        municipality,
        ...(ward && { ward }),
      },
      include: {
        reporter: true,
        volunteer: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Add timeline event to rescue
   */
  async addTimelineEvent(data: {
    rescueId: string;
    event: string;
    description: string;
    userId?: string;
    lat?: number;
    lng?: number;
    metadata?: Record<string, any>;
  }) {
    return this.prisma.rescueTimeline.create({
      data: {
        rescueId: data.rescueId,
        event: data.event,
        description: data.description,
        userId: data.userId,
        lat: data.lat,
        lng: data.lng,
        metadata: data.metadata as any,
      },
    });
  }

  /**
   * Create notifications
   */
  async createNotifications(
    notifications: Array<{
      userId: string;
      type: string;
      title: string;
      message: string;
      rescueId: string;
      priority?: string;
    }>
  ) {
    return this.prisma.notification.createMany({
      data: notifications.map((n) => ({
        userId: n.userId,
        type: n.type as any, // Type assertion for notification type enum
        title: n.title,
        message: n.message,
        rescueId: n.rescueId,
        priority: n.priority || 'NORMAL',
      })),
    });
  }

  /**
   * Get volunteer by ID
   */
  async getVolunteerById(volunteerId: string) {
    return this.prisma.volunteer.findUnique({
      where: { id: volunteerId },
    });
  }

  /**
   * Update volunteer
   */
  async updateVolunteer(volunteerId: string, data: any) {
    return this.prisma.volunteer.update({
      where: { id: volunteerId },
      data,
    });
  }

  /**
   * Increment species rescue count
   */
  async incrementSpeciesRescueCount(speciesId: string) {
    return this.prisma.snakeSpecies.update({
      where: { id: speciesId },
      data: {
        rescueCount: {
          increment: 1,
        },
      },
    });
  }
}
