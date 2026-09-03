/**
 * Accept Rescue Use Case
 * Volunteer accepts an assigned rescue request
 */

import { RescueRepository } from '@snake-rescue/database';
import { BadRequestError } from '@snake-rescue/shared';
import {
  RescueStatusMachine,
  RescueStatus,
} from '../../domain/rescue-status-machine';

export interface AcceptRescueInput {
  rescueId: string;
  volunteerId: string;
  estimatedArrivalTime?: number; // Minutes
  notes?: string;
}

export class AcceptRescueUseCase {
  constructor(private readonly rescueRepository: RescueRepository) {}

  async execute(input: AcceptRescueInput, userId: string): Promise<any> {
    // 1. Validate rescue exists
    const rescue = await this.rescueRepository.findById(input.rescueId);
    if (!rescue) {
      throw new BadRequestError('Rescue request not found');
    }

    // 2. Validate rescue is assigned to this volunteer
    if (rescue.assignedTo !== input.volunteerId) {
      throw new BadRequestError('Rescue not assigned to you');
    }

    // 3. Validate status transition
    RescueStatusMachine.validateTransition(
      rescue.status as RescueStatus,
      RescueStatus.ACCEPTED,
    );

    // 4. Update status atomically. The assignment and state are repeated in
    // the database predicate so concurrent acceptance attempts cannot both win.
    let updatedRescue;
    try {
      updatedRescue = await this.rescueRepository.acceptAssignedRescue(
        rescue.id,
        input.volunteerId,
      );
    } catch (error: any) {
      if (error.message === 'RESCUE_NOT_ASSIGNED_TO_VOLUNTEER') {
        throw new BadRequestError('Rescue not assigned to you');
      }

      if (error.message?.startsWith('INVALID_STATUS:')) {
        throw new BadRequestError(
          'Rescue assignment can no longer be accepted',
        );
      }

      throw error;
    }

    // 5. Create timeline event
    await this.rescueRepository.addTimelineEvent({
      rescueId: rescue.id,
      event: 'RESCUE_ACCEPTED',
      description: input.notes || 'Volunteer accepted the rescue assignment',
      userId,
      metadata: {
        estimatedArrivalTime: input.estimatedArrivalTime,
      },
    });

    // 6. Create notifications
    await this.createNotifications(rescue, input);

    // 7. Update volunteer statistics
    await this.updateVolunteerStats(input.volunteerId);

    return updatedRescue;
  }

  private async createNotifications(
    rescue: any,
    input: AcceptRescueInput,
  ): Promise<void> {
    const notifications: Array<{
      userId: string;
      type: string;
      title: string;
      message: string;
      rescueId: string;
    }> = [];

    // Notify citizen
    if (rescue.userId) {
      notifications.push({
        userId: rescue.userId,
        type: 'RESCUE_ACCEPTED',
        title: 'Rescuer Accepted!',
        message: `A rescuer has accepted your rescue request ${rescue.referenceNumber || ''}. They will arrive soon.`,
        rescueId: rescue.id,
      });
    }

    // Notify admins (could be enhanced with admin notification preferences)
    const dispatchUsers = await this.rescueRepository.getDispatchUsers();
    for (const admin of dispatchUsers) {
      if (admin.id !== rescue.userId) {
        notifications.push({
          userId: admin.id,
          type: 'RESCUE_ACCEPTED',
          title: 'Rescue accepted',
          message: `Rescue ${rescue.referenceNumber || rescue.id} was accepted by the assigned rescuer.`,
          rescueId: rescue.id,
        });
      }
    }

    if (notifications.length > 0) {
      await this.rescueRepository.createNotifications(notifications);
    }
  }

  private async updateVolunteerStats(volunteerId: string): Promise<void> {
    // Update volunteer acceptance rate, response time, etc.
    // This is a placeholder for future enhancement
  }
}
