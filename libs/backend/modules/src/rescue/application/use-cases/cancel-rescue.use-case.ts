/**
 * Cancel Rescue Use Case
 * Cancel a rescue request (by citizen or admin)
 */

import { RescueRepository } from '@snake-rescue/database';
import { BadRequestError, UnauthorizedError } from '@snake-rescue/shared';
import { RescueStatusMachine, RescueStatus } from '../../domain/rescue-status-machine.js';

export interface CancelRescueInput {
  rescueId: string;
  reason: string;
  cancelledBy: 'CITIZEN' | 'ADMIN' | 'VOLUNTEER';
}

export class CancelRescueUseCase {
  constructor(private readonly rescueRepository: RescueRepository) {}

  async execute(input: CancelRescueInput, userId: string, userRole: string): Promise<any> {
    // 1. Validate rescue exists
    const rescue = await this.rescueRepository.findById(input.rescueId);
    if (!rescue) {
      throw new BadRequestError('Rescue request not found');
    }

    // 2. Validate authorization
    this.validateAuthorization(rescue, userId, userRole, input.cancelledBy);

    // 3. Validate status can be cancelled
    if (!RescueStatusMachine.canModify(rescue.status as RescueStatus)) {
      throw new BadRequestError('Cannot cancel completed or already cancelled rescue');
    }

    // 4. Update rescue
    const updatedRescue = await this.rescueRepository.update(rescue.id, {
      status: RescueStatus.CANCELLED,
    });

    // 5. Create timeline event
    await this.rescueRepository.addTimelineEvent({
      rescueId: rescue.id,
      event: 'RESCUE_CANCELLED',
      description: `Rescue cancelled by ${input.cancelledBy}: ${input.reason}`,
      userId,
      metadata: {
        cancelledBy: input.cancelledBy,
        reason: input.reason,
      },
    });

    // 6. Update volunteer stats if volunteer was assigned
    if (rescue.assignedTo) {
      await this.updateVolunteerStats(rescue.assignedTo, false);
    }

    // 7. Create notifications
    await this.createNotifications(rescue, input, userId);

    return updatedRescue;
  }

  private validateAuthorization(
    rescue: any,
    userId: string,
    userRole: string,
    cancelledBy: string
  ): void {
    const isAdmin = ['ADMIN', 'SUPER_ADMIN', 'DISTRICT_COORDINATOR'].includes(userRole);
    const isOwner = rescue.userId === userId;

    if (cancelledBy === 'ADMIN' && !isAdmin) {
      throw new UnauthorizedError('Only admins can cancel on behalf of admin');
    }

    if (cancelledBy === 'CITIZEN' && !isOwner && !isAdmin) {
      throw new UnauthorizedError('You can only cancel your own rescue requests');
    }

    // If rescue is already accepted/in progress, only allow admin cancellation
    if (
      [RescueStatus.ACCEPTED, RescueStatus.IN_PROGRESS].includes(rescue.status as RescueStatus) &&
      !isAdmin
    ) {
      throw new BadRequestError(
        'Rescue is already in progress. Please contact support to cancel.'
      );
    }
  }

  private async updateVolunteerStats(volunteerId: string, markAsCancelled: boolean): Promise<void> {
    try {
      const volunteer = await this.rescueRepository.getVolunteerById(volunteerId);
      if (!volunteer) return;

      if (markAsCancelled) {
        await this.rescueRepository.updateVolunteer(volunteerId, {
          cancelledRescues: volunteer.cancelledRescues + 1,
        });
      }
    } catch (error) {
      console.error('Failed to update volunteer stats:', error);
    }
  }

  private async createNotifications(
    rescue: any,
    input: CancelRescueInput,
    cancelledByUserId: string
  ): Promise<void> {
    const notifications: Array<{
      userId: string;
      type: string;
      title: string;
      message: string;
      rescueId: string;
      priority?: string;
    }> = [];

    // Notify citizen (if not the one who cancelled)
    if (rescue.userId && rescue.userId !== cancelledByUserId) {
      notifications.push({
        userId: rescue.userId,
        type: 'RESCUE_CANCELLED',
        title: 'Rescue Cancelled',
        message: `Your rescue request has been cancelled. Reason: ${input.reason}`,
        rescueId: rescue.id,
        priority: 'NORMAL',
      });
    }

    // Notify assigned volunteer (if exists and not the one who cancelled)
    if (rescue.assignedTo) {
      const volunteer = await this.rescueRepository.getVolunteerById(rescue.assignedTo);
      if (volunteer?.userId && volunteer.userId !== cancelledByUserId) {
        notifications.push({
          userId: volunteer.userId,
          type: 'RESCUE_CANCELLED',
          title: 'Rescue Cancelled',
          message: `Rescue ${rescue.referenceNumber || rescue.id} has been cancelled. Reason: ${input.reason}`,
          rescueId: rescue.id,
          priority: 'NORMAL',
        });
      }
    }

    if (notifications.length > 0) {
      await this.rescueRepository.createNotifications(notifications);
    }
  }
}
