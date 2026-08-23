/**
 * Assign Volunteer Use Case
 * Business workflow for volunteer assignment
 */

import { RescueRepository } from '@snake-rescue/database';
import {
  BadRequestError,
  createLogger,
  NotFoundError,
} from '@snake-rescue/shared';
import { RescueStatus } from '../../domain/rescue-status-machine.js';
import type { AssignVolunteerInput } from '../dto/index.js';

const logger = createLogger('AssignVolunteerUseCase');

export class AssignVolunteerUseCase {
  constructor(private readonly rescueRepository: RescueRepository) {}

  async execute(input: AssignVolunteerInput, dispatcherUserId: string) {
    const { rescueId, volunteerId } = input;

    logger.info({
      msg: 'Assigning volunteer to rescue',
      rescueId,
      volunteerId,
    });

    // Check if rescue exists
    const rescue = await this.rescueRepository.findById(rescueId);
    if (!rescue) {
      throw new NotFoundError('Rescue request');
    }

    const volunteer = await this.rescueRepository.getVolunteerById(volunteerId);
    if (!volunteer || !['APPROVED', 'VERIFIED'].includes(volunteer.status)) {
      throw new BadRequestError('Rescuer is not approved for dispatch');
    }

    if (rescue.status === RescueStatus.PENDING && !rescue.assignedTo) {
      const updated = await this.rescueRepository.assignVolunteer(
        rescueId,
        volunteerId,
        dispatcherUserId,
      );

      await this.recordAssignment(updated, dispatcherUserId, false);
      logger.info({
        msg: 'Volunteer assigned successfully',
        rescueId,
        volunteerId,
      });
      return updated;
    }

    if (rescue.status === RescueStatus.ASSIGNED && rescue.assignedTo) {
      if (rescue.assignedTo === volunteerId) {
        throw new BadRequestError('Rescue is already assigned to this rescuer');
      }

      const updated = await this.rescueRepository.reassignVolunteer(
        rescueId,
        volunteerId,
        dispatcherUserId,
      );

      await this.recordAssignment(updated, dispatcherUserId, true);
      logger.info({
        msg: 'Volunteer reassigned successfully',
        rescueId,
        volunteerId,
      });
      return updated;
    }

    throw new BadRequestError(
      `Rescue cannot be assigned in its current state: ${rescue.status}`,
    );
  }

  private async recordAssignment(
    rescue: any,
    dispatcherUserId: string,
    isReassignment: boolean,
  ): Promise<void> {
    const event = isReassignment ? 'RESCUE_REASSIGNED' : 'RESCUE_ASSIGNED';
    const description = isReassignment
      ? 'Dispatch reassigned this rescue to another rescuer'
      : 'Dispatch assigned a rescuer to this rescue';

    await this.rescueRepository.addTimelineEvent({
      rescueId: rescue.id,
      event,
      description,
      userId: dispatcherUserId,
      metadata: {
        assignedVolunteerId: rescue.assignedTo,
        assignedBy: dispatcherUserId,
      },
    });

    const notifications = [];
    if (rescue.assignedVolunteer?.userId) {
      notifications.push({
        userId: rescue.assignedVolunteer.userId,
        type: 'RESCUE_ASSIGNED',
        title: isReassignment
          ? 'Rescue reassigned to you'
          : 'New rescue assignment',
        message: `Rescue ${rescue.referenceNumber || ''} is awaiting your acceptance.`,
        rescueId: rescue.id,
        priority: rescue.priority,
      });
    }

    if (rescue.userId) {
      notifications.push({
        userId: rescue.userId,
        type: 'RESCUE_ASSIGNED',
        title: 'Rescuer assigned',
        message: 'A rescuer has been assigned to your rescue request.',
        rescueId: rescue.id,
        priority: rescue.priority,
      });
    }

    if (notifications.length > 0) {
      await this.rescueRepository.createNotifications(notifications);
    }
  }
}
