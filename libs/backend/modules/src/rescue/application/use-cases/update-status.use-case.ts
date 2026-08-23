/**
 * Update Rescue Status Use Case
 * Generic status transition handler for rescue workflow
 */

import { RescueRepository } from '@snake-rescue/database';
import { BadRequestError } from '@snake-rescue/shared';
import {
  RescueStatusMachine,
  RescueStatus,
} from '../../domain/rescue-status-machine.js';

export interface UpdateRescueStatusInput {
  rescueId: string;
  status: RescueStatus;
  notes?: string;
  location?: {
    lat: number;
    lng: number;
  };
  metadata?: Record<string, any>;
}

export class UpdateRescueStatusUseCase {
  constructor(private readonly rescueRepository: RescueRepository) {}

  async execute(input: UpdateRescueStatusInput, userId: string): Promise<any> {
    // 1. Validate rescue exists
    const rescue = await this.rescueRepository.findById(input.rescueId);
    if (!rescue) {
      throw new BadRequestError('Rescue request not found');
    }

    // 2. Validate status transition
    RescueStatusMachine.validateTransition(
      rescue.status as RescueStatus,
      input.status,
    );

    // 3. Prepare update data
    const updateData: any = {
      status: input.status,
    };

    // Set timestamp fields based on status
    switch (input.status) {
      case RescueStatus.ACCEPTED:
        updateData.acceptedAt = new Date();
        break;
      case RescueStatus.IN_PROGRESS:
        if (!rescue.startedAt) {
          updateData.startedAt = new Date();
        }
        break;
      case RescueStatus.COMPLETED:
        if (!rescue.completedAt) {
          updateData.completedAt = new Date();
        }
        // Calculate rescue duration
        if (rescue.startedAt) {
          const duration = Math.floor(
            (new Date().getTime() - new Date(rescue.startedAt).getTime()) /
              60000,
          );
          updateData.rescueDuration = duration;
        }
        break;
    }

    // 4. Update rescue
    const updatedRescue = await this.rescueRepository.update(
      rescue.id,
      updateData,
    );

    // 5. Create timeline event
    const timelineEvent = RescueStatusMachine.getTimelineEvent(input.status);
    await this.rescueRepository.addTimelineEvent({
      rescueId: rescue.id,
      event: timelineEvent,
      description: input.notes || this.getStatusDescription(input.status),
      userId,
      lat: input.location?.lat,
      lng: input.location?.lng,
      metadata: input.metadata,
    });

    // 6. Create notifications
    await this.createNotifications(rescue, input.status);

    return updatedRescue;
  }

  private getStatusDescription(status: RescueStatus): string {
    const descriptions: Record<RescueStatus, string> = {
      [RescueStatus.PENDING]: 'Rescue request created',
      [RescueStatus.ASSIGNED]: 'Volunteer assigned to rescue',
      [RescueStatus.ACCEPTED]: 'Volunteer accepted the rescue',
      [RescueStatus.IN_PROGRESS]: 'Rescue operation in progress',
      [RescueStatus.COMPLETED]: 'Rescue completed successfully',
      [RescueStatus.CANCELLED]: 'Rescue request cancelled',
      [RescueStatus.CLOSED]: 'Rescue closed',
      [RescueStatus.EXPIRED]: 'Rescue request expired',
    };
    return descriptions[status] || 'Status updated';
  }

  private async createNotifications(
    rescue: any,
    newStatus: RescueStatus,
  ): Promise<void> {
    const notifications: Array<{
      userId: string;
      type: string;
      title: string;
      message: string;
      rescueId: string;
      priority?: string;
    }> = [];

    // Notify citizen based on status
    if (rescue.userId) {
      const citizenNotification = this.getCitizenNotification(
        newStatus,
        rescue,
      );
      if (citizenNotification) {
        notifications.push({
          userId: rescue.userId,
          rescueId: rescue.id,
          ...citizenNotification,
        });
      }
    }

    // Notify assigned volunteer (if applicable)
    if (rescue.assignedTo) {
      const volunteerNotification = this.getVolunteerNotification(
        newStatus,
        rescue,
      );
      if (volunteerNotification) {
        // Get volunteer's userId
        const volunteer = await this.rescueRepository.getVolunteerById(
          rescue.assignedTo,
        );
        if (volunteer?.userId) {
          notifications.push({
            userId: volunteer.userId,
            rescueId: rescue.id,
            ...volunteerNotification,
          });
        }
      }
    }

    const dispatchUsers = await this.rescueRepository.getDispatchUsers();
    const notificationType = this.getNotificationType(newStatus);
    for (const admin of dispatchUsers) {
      if (admin.id !== rescue.userId) {
        notifications.push({
          userId: admin.id,
          rescueId: rescue.id,
          type: notificationType,
          title: `Rescue ${newStatus.toLowerCase().replace('_', ' ')}`,
          message: `Rescue ${rescue.referenceNumber || rescue.id} is now ${newStatus.toLowerCase().replace('_', ' ')}.`,
          priority: 'HIGH',
        });
      }
    }

    if (notifications.length > 0) {
      await this.rescueRepository.createNotifications(notifications);
    }
  }

  private getNotificationType(status: RescueStatus): string {
    switch (status) {
      case RescueStatus.COMPLETED:
        return 'RESCUE_COMPLETED';
      case RescueStatus.CANCELLED:
        return 'RESCUE_CANCELLED';
      case RescueStatus.ASSIGNED:
        return 'RESCUE_ASSIGNED';
      case RescueStatus.ACCEPTED:
      case RescueStatus.IN_PROGRESS:
        return 'RESCUE_ACCEPTED';
      default:
        return 'SYSTEM_ALERT';
    }
  }

  private getCitizenNotification(
    status: RescueStatus,
    rescue: any,
  ): any | null {
    switch (status) {
      case RescueStatus.ACCEPTED:
        return {
          type: 'RESCUE_ACCEPTED',
          title: 'Rescuer On The Way!',
          message: `Your rescuer has accepted and is heading to your location.`,
          priority: 'HIGH',
        };
      case RescueStatus.IN_PROGRESS:
        return {
          type: 'RESCUE_ACCEPTED',
          title: 'Rescue In Progress',
          message: `The rescuer has arrived and the rescue operation is underway.`,
          priority: 'HIGH',
        };
      case RescueStatus.COMPLETED:
        return {
          type: 'RESCUE_COMPLETED',
          title: 'Rescue Completed!',
          message: `Your snake rescue has been completed successfully. Thank you for using SnakeSOS!`,
          priority: 'NORMAL',
        };
      case RescueStatus.CANCELLED:
        return {
          type: 'RESCUE_CANCELLED',
          title: 'Rescue Cancelled',
          message: `Your rescue request has been cancelled.`,
          priority: 'NORMAL',
        };
      default:
        return null;
    }
  }

  private getVolunteerNotification(
    status: RescueStatus,
    rescue: any,
  ): any | null {
    switch (status) {
      case RescueStatus.CANCELLED:
        return {
          type: 'RESCUE_CANCELLED',
          title: 'Rescue Cancelled',
          message: `Rescue ${rescue.referenceNumber || rescue.id} has been cancelled.`,
          priority: 'NORMAL',
        };
      default:
        return null;
    }
  }
}
