/**
 * Complete Rescue Use Case
 * Mark rescue as completed with outcome and details
 */

import { RescueRepository } from '@snake-rescue/database';
import { BadRequestError } from '@snake-rescue/shared';
import { RescueStatusMachine, RescueStatus } from '../../domain/rescue-status-machine.js';

export interface CompleteRescueInput {
  rescueId: string;
  volunteerId: string;
  outcome: string; // RESCUED_RELOCATED, ALREADY_GONE, FALSE_ALARM, etc.
  rescueReport: string;
  rescueImages?: string[]; // URLs to uploaded images
  speciesId?: string; // Final species identification
  notes?: string;
  location?: {
    lat: number;
    lng: number;
  };
}

export class CompleteRescueUseCase {
  constructor(private readonly rescueRepository: RescueRepository) {}

  async execute(input: CompleteRescueInput, userId: string): Promise<any> {
    // 1. Validate rescue exists
    const rescue = await this.rescueRepository.findById(input.rescueId);
    if (!rescue) {
      throw new BadRequestError('Rescue request not found');
    }

    // 2. Validate volunteer is assigned to this rescue
    if (rescue.assignedTo !== input.volunteerId) {
      throw new BadRequestError('You are not assigned to this rescue');
    }

    // 3. Validate status can transition to completed
    RescueStatusMachine.validateTransition(
      rescue.status as RescueStatus,
      RescueStatus.COMPLETED
    );

    // 4. Calculate rescue duration
    let rescueDuration: number | undefined;
    if (rescue.startedAt) {
      rescueDuration = Math.floor(
        (new Date().getTime() - new Date(rescue.startedAt).getTime()) / 60000
      );
    } else if (rescue.acceptedAt) {
      rescueDuration = Math.floor(
        (new Date().getTime() - new Date(rescue.acceptedAt).getTime()) / 60000
      );
    }

    // 5. Prepare update data
    const updateData: any = {
      status: RescueStatus.COMPLETED,
      completedAt: new Date(),
      outcome: input.outcome,
      rescueReport: input.rescueReport,
      rescueImages: input.rescueImages || [],
      rescueDuration,
    };

    // Update species if provided
    if (input.speciesId) {
      updateData.speciesId = input.speciesId;
    }

    // 6. Update rescue
    const updatedRescue = await this.rescueRepository.update(rescue.id, updateData);

    // 7. Create timeline event
    await this.rescueRepository.addTimelineEvent({
      rescueId: rescue.id,
      event: 'RESCUE_COMPLETED',
      description: input.notes || `Rescue completed with outcome: ${input.outcome}`,
      userId,
      lat: input.location?.lat,
      lng: input.location?.lng,
      metadata: {
        outcome: input.outcome,
        duration: rescueDuration,
        imagesCount: input.rescueImages?.length || 0,
      },
    });

    // 8. Update volunteer statistics
    await this.updateVolunteerStats(input.volunteerId, true);

    // 9. Update species rescue count
    if (input.speciesId) {
      await this.updateSpeciesStats(input.speciesId);
    }

    // 10. Create notifications
    await this.createNotifications(rescue, input);

    return updatedRescue;
  }

  private async updateVolunteerStats(volunteerId: string, success: boolean): Promise<void> {
    try {
      const volunteer = await this.rescueRepository.getVolunteerById(volunteerId);
      if (!volunteer) return;

      const updates: any = {
        totalRescues: volunteer.totalRescues + 1,
      };

      if (success) {
        updates.completedRescues = volunteer.completedRescues + 1;
      }

      // Calculate success rate
      if (updates.totalRescues > 0) {
        updates.successRate = (updates.completedRescues / updates.totalRescues) * 100;
      }

      await this.rescueRepository.updateVolunteer(volunteerId, updates);
    } catch (error) {
      console.error('Failed to update volunteer stats:', error);
      // Don't throw - stats update failure shouldn't prevent rescue completion
    }
  }

  private async updateSpeciesStats(speciesId: string): Promise<void> {
    try {
      await this.rescueRepository.incrementSpeciesRescueCount(speciesId);
    } catch (error) {
      console.error('Failed to update species stats:', error);
      // Don't throw
    }
  }

  private async createNotifications(rescue: any, input: CompleteRescueInput): Promise<void> {
    const notifications: Array<{
      userId: string;
      type: string;
      title: string;
      message: string;
      rescueId: string;
      priority?: string;
    }> = [];

    // Notify citizen
    if (rescue.userId) {
      notifications.push({
        userId: rescue.userId,
        type: 'RESCUE_COMPLETED',
        title: 'Rescue Completed! 🎉',
        message: this.getCompletionMessage(input.outcome),
        rescueId: rescue.id,
        priority: 'HIGH',
      });
    }

    // Notify admins (for verification)
    // Could add admin notification here

    if (notifications.length > 0) {
      await this.rescueRepository.createNotifications(notifications);
    }
  }

  private getCompletionMessage(outcome: string): string {
    const messages: Record<string, string> = {
      RESCUED_RELOCATED: 'The snake has been safely rescued and relocated. Thank you for helping protect wildlife!',
      ALREADY_GONE: 'The snake had already left before the rescuer arrived. Please contact us if you see it again.',
      FALSE_ALARM: 'Our rescuer confirmed this was not a dangerous situation. Thank you for your vigilance!',
      NO_SNAKE_FOUND: 'The rescuer could not locate the snake. It may have moved to a safer location.',
      DECEASED: 'Unfortunately, the snake was found deceased. Thank you for reporting.',
      REFUSED_HELP: 'The rescue was completed as requested.',
    };
    return messages[outcome] || 'Your rescue request has been completed. Thank you for using SnakeSOS!';
  }
}
