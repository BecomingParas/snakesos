/**
 * Get Rescue Query
 * Query pattern for read operations
 */

import { RescueRepository } from '@snake-rescue/database';
import { NotFoundError } from '@snake-rescue/shared';

export class GetRescueQuery {
  constructor(
    private readonly rescueRepository: RescueRepository
  ) {}

  async execute(rescueId: string) {
    const rescue = await this.rescueRepository.findByIdWithDetails(rescueId);

    if (!rescue) {
      throw new NotFoundError('Rescue request');
    }

    return rescue;
  }
}
