/**
 * Assign Volunteer Use Case
 * Business workflow for volunteer assignment
 */

import { RescueRepository } from '@snake-rescue/database';
import { createLogger, NotFoundError } from '@snake-rescue/shared';
import type { AssignVolunteerInput, UpdateRescueResponse } from '../dto/index.js';

const logger = createLogger('AssignVolunteerUseCase');

export class AssignVolunteerUseCase {
  constructor(
    private readonly rescueRepository: RescueRepository
  ) {}

  async execute(input: AssignVolunteerInput): Promise<UpdateRescueResponse> {
    const { rescueId, volunteerId } = input;

    logger.info({ msg: 'Assigning volunteer to rescue', rescueId, volunteerId });

    // Check if rescue exists
    const rescue = await this.rescueRepository.findById(rescueId);
    if (!rescue) {
      throw new NotFoundError('Rescue request');
    }

    // Assign volunteer (updates status to ASSIGNED)
    const updated = await this.rescueRepository.assignVolunteer(rescueId, volunteerId);

    logger.info({ msg: 'Volunteer assigned successfully', rescueId, volunteerId });

    // TODO: Send notification to volunteer
    // TODO: Send notification to reporter
    // TODO: Create timeline entry

    return {
      success: true,
      message: 'Volunteer assigned successfully',
      rescue: {
        id: updated.id,
        status: updated.status,
        updatedAt: updated.updatedAt,
      },
    };
  }
}
