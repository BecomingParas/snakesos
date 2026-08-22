/**
 * Accept From Queue Use Case
 * Volunteer accepts an unassigned PENDING rescue from the queue
 * 
 * This is different from AcceptRescueUseCase which confirms a pre-assignment.
 * This use case handles the self-service queue workflow.
 */

import { RescueRepository } from '@snake-rescue/database';
import { BadRequestError } from '@snake-rescue/shared';

export interface AcceptFromQueueInput {
  rescueId: string;
  volunteerId: string;
  estimatedArrivalTime?: number; // Minutes
  notes?: string;
}

export class AcceptFromQueueUseCase {
  constructor(private readonly rescueRepository: RescueRepository) {}

  async execute(input: AcceptFromQueueInput, userId: string): Promise<any> {
    try {
      // 1. Atomically assign rescue (handles race condition)
      // This will throw error if rescue is already assigned
      const rescue = await this.rescueRepository.assignVolunteer(
        input.rescueId,
        input.volunteerId
      );

      // 2. Create timeline event
      await this.rescueRepository.addTimelineEvent({
        rescueId: rescue.id,
        event: 'RESCUE_ACCEPTED_FROM_QUEUE',
        description: input.notes || 'Volunteer accepted rescue from queue',
        userId,
        metadata: {
          estimatedArrivalTime: input.estimatedArrivalTime,
          acceptedFrom: 'QUEUE',
        },
      });

      // 3. Create notifications
      await this.createNotifications(rescue);

      // 4. Update volunteer statistics (mark as busy)
      await this.updateVolunteerAvailability(input.volunteerId, false);

      return {
        success: true,
        rescue,
        message: 'Rescue accepted successfully',
      };
    } catch (error: any) {
      // Handle specific errors from atomic assignment
      if (error.message?.includes('RESCUE_ALREADY_ASSIGNED')) {
        throw new BadRequestError('This rescue has already been accepted by another rescuer. Please select a different rescue from the queue.');
      }
      
      if (error.message?.includes('INVALID_STATUS')) {
        throw new BadRequestError('This rescue is no longer available. Status: ' + error.message.split('status ')[1]);
      }
      
      if (error.message?.includes('RESCUE_NOT_FOUND')) {
        throw new BadRequestError('Rescue request not found');
      }
      
      // Re-throw other errors
      throw error;
    }
  }

  private async createNotifications(rescue: any): Promise<void> {
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
        title: 'Rescuer on the way!',
        message: `A rescuer has accepted your emergency request. They will arrive soon.`,
        rescueId: rescue.id,
      });
    }

    // Create notifications
    if (notifications.length > 0) {
      await this.rescueRepository.createNotifications(notifications);
    }
  }

  private async updateVolunteerAvailability(volunteerId: string, available: boolean): Promise<void> {
    // Mark volunteer as busy when they accept a rescue
    await this.rescueRepository.updateVolunteer(volunteerId, {
      isAvailableNow: available,
      lastLocationUpdate: new Date(),
    });
  }
}
