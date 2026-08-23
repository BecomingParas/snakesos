/**
 * Rescue Repository
 * Database operations for RescueRequest entity
 */

import {
  PrismaClient,
  RescueRequest,
  Prisma,
  RescueStatus,
} from '../prisma/generated/client.js';
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
        user: true,
        assignedVolunteer: {
          include: { user: true },
        },
        species: true,
        timeline: {
          orderBy: { createdAt: 'asc' },
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
    },
  ): Promise<RescueRequest[]> {
    return this.model.findMany({
      where: { status },
      include: {
        user: true,
        assignedVolunteer: {
          include: { user: true },
        },
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
      where: { assignedTo: volunteerId },
      include: {
        user: true,
        assignedVolunteer: {
          include: { user: true },
        },
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
        assignedTo: null,
      },
      include: {
        user: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Find available rescues for queue (PENDING, unassigned)
   * Optionally filter by location proximity
   */
  async findAvailableForQueue(options?: {
    municipality?: string;
    maxDistance?: number;
    rescuerLat?: number;
    rescuerLng?: number;
    limit?: number;
  }): Promise<RescueRequest[]> {
    const whereClause: any = {
      status: RescueStatus.PENDING,
      assignedTo: null,
      stillPresent: true, // Only show if snake still present
    };

    // Filter by municipality if provided
    if (options?.municipality) {
      whereClause.municipality = options.municipality;
    }

    // TODO: Implement geospatial distance filtering when rescuerLat/Lng provided
    // For now, return all pending rescues

    return this.model.findMany({
      where: whereClause,
      include: {
        user: true,
        species: true,
      },
      orderBy: [
        { priority: 'desc' }, // High priority first
        { createdAt: 'asc' }, // Oldest first
      ],
      take: options?.limit || 50,
    });
  }

  /**
   * Assign volunteer to rescue (ATOMIC - prevents double assignment)
   *
   * Uses updateMany with conditional WHERE to ensure:
   * 1. Rescue is still PENDING
   * 2. No volunteer is already assigned
   *
   * This prevents race conditions when multiple rescuers try to accept simultaneously.
   */
  async assignVolunteer(
    rescueId: string,
    volunteerId: string,
    assignedBy?: string,
  ): Promise<RescueRequest> {
    // Atomic update with conditions
    const result = await this.model.updateMany({
      where: {
        id: rescueId,
        status: RescueStatus.PENDING, // Must still be PENDING
        assignedTo: null, // Must not be assigned yet
      },
      data: {
        assignedTo: volunteerId,
        status: RescueStatus.ASSIGNED,
        assignedAt: new Date(),
        assignedBy,
      },
    });

    // Check if update actually happened
    if (result.count === 0) {
      // Fetch rescue to determine specific error
      const existingRescue = await this.model.findUnique({
        where: { id: rescueId },
      });

      if (!existingRescue) {
        throw new Error('RESCUE_NOT_FOUND: Rescue request not found');
      }

      if (existingRescue.assignedTo) {
        throw new Error(
          'RESCUE_ALREADY_ASSIGNED: This rescue has already been assigned to another rescuer',
        );
      }

      // Status is not PENDING
      throw new Error(
        `INVALID_STATUS: Cannot assign rescue with status ${existingRescue.status}. Only PENDING rescues can be assigned.`,
      );
    }

    // Fetch updated rescue with relations
    const updatedRescue = await this.model.findUnique({
      where: { id: rescueId },
      include: {
        user: true,
        assignedVolunteer: {
          include: { user: true },
        },
      },
    });

    if (!updatedRescue) {
      throw new Error(
        'RESCUE_NOT_FOUND: Rescue was assigned but could not be retrieved',
      );
    }

    return updatedRescue;
  }

  /**
   * Replace an unaccepted assignment.
   *
   * Dispatch may change a responder only while the rescue is still ASSIGNED.
   * Once a responder has accepted or started the rescue, a separate hand-off
   * workflow is required so an active incident is never silently reassigned.
   */
  async reassignVolunteer(
    rescueId: string,
    volunteerId: string,
    assignedBy: string,
  ): Promise<RescueRequest> {
    const result = await this.model.updateMany({
      where: {
        id: rescueId,
        status: RescueStatus.ASSIGNED,
        assignedTo: { not: null },
      },
      data: {
        assignedTo: volunteerId,
        assignedAt: new Date(),
        assignedBy,
      },
    });

    if (result.count === 0) {
      const rescue = await this.model.findUnique({ where: { id: rescueId } });

      if (!rescue) {
        throw new Error('RESCUE_NOT_FOUND: Rescue request not found');
      }

      throw new Error(
        `INVALID_STATUS: Cannot reassign rescue with status ${rescue.status}. Only unaccepted ASSIGNED rescues can be reassigned.`,
      );
    }

    const updatedRescue = await this.model.findUnique({
      where: { id: rescueId },
      include: {
        user: true,
        assignedVolunteer: {
          include: { user: true },
        },
      },
    });

    if (!updatedRescue) {
      throw new Error(
        'RESCUE_NOT_FOUND: Rescue was reassigned but could not be retrieved',
      );
    }

    return updatedRescue;
  }

  /**
   * Atomically accept an assignment owned by the current rescuer.
   * The conditional update makes duplicate clicks and concurrent requests safe.
   */
  async acceptAssignedRescue(
    rescueId: string,
    volunteerId: string,
  ): Promise<RescueRequest> {
    const result = await this.model.updateMany({
      where: {
        id: rescueId,
        assignedTo: volunteerId,
        status: RescueStatus.ASSIGNED,
      },
      data: {
        status: RescueStatus.ACCEPTED,
        acceptedAt: new Date(),
      },
    });

    if (result.count === 0) {
      const rescue = await this.model.findUnique({ where: { id: rescueId } });

      if (!rescue) {
        throw new Error('RESCUE_NOT_FOUND: Rescue request not found');
      }

      if (rescue.assignedTo !== volunteerId) {
        throw new Error('RESCUE_NOT_ASSIGNED_TO_VOLUNTEER');
      }

      throw new Error(
        `INVALID_STATUS: Cannot accept rescue with status ${rescue.status}`,
      );
    }

    const updatedRescue = await this.model.findUnique({
      where: { id: rescueId },
    });
    if (!updatedRescue) {
      throw new Error(
        'RESCUE_NOT_FOUND: Rescue was accepted but could not be retrieved',
      );
    }

    return updatedRescue;
  }

  /**
   * Update rescue status
   */
  async updateStatus(
    rescueId: string,
    status: RescueStatus,
  ): Promise<RescueRequest> {
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
  async findRecent(limit = 10): Promise<RescueRequest[]> {
    return this.model.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        assignedVolunteer: {
          include: { user: true },
        },
      },
    });
  }

  /**
   * Search rescues by location
   */
  async searchByLocation(
    municipality: string,
    ward?: string,
  ): Promise<RescueRequest[]> {
    return this.model.findMany({
      where: {
        municipality,
        ...(ward && { ward }),
      },
      include: {
        user: true,
        assignedVolunteer: {
          include: { user: true },
        },
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
    }>,
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
   * Get active admin users who should receive dispatch updates.
   */
  async getDispatchUsers() {
    return this.prisma.user.findMany({
      where: {
        role: { in: ['ADMIN', 'SUPER_ADMIN', 'DISTRICT_COORDINATOR'] },
        status: 'ACTIVE',
      },
      select: { id: true },
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

  /**
   * Create hospital visit record (links rescue to hospital analytics)
   */
  async createHospitalVisit(data: {
    rescueId: string;
    hospitalId: string;
    antivenomAdministered: boolean;
    antivenomType?: string;
    admission: boolean;
    notes?: string;
  }) {
    // Update rescue with hospital information
    return this.prisma.rescueRequest.update({
      where: { id: data.rescueId },
      data: {
        victimWentToHospital: true,
        hospitalId: data.hospitalId,
        antivenomAdministered: data.antivenomAdministered,
        antivenomType: data.antivenomType,
        hospitalAdmission: data.admission,
        hospitalNotes: data.notes,
      },
    });
  }
}
