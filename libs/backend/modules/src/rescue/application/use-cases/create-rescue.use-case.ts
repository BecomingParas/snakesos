/**
 * Create Rescue Use Case
 * Orchestrates the rescue creation workflow
 */

import { RescueRepository } from '@snake-rescue/database';
import { createLogger } from '@snake-rescue/shared';
import { CreateRescueCommand } from '../commands/create-rescue.command.js';
import type { CreateRescueInput, CreateRescueResponse } from '../dto/index.js';

const logger = createLogger('CreateRescueUseCase');

export class CreateRescueUseCase {
  constructor(
    private readonly rescueRepository: RescueRepository
  ) {}

  async execute(input: CreateRescueInput, reporterId: string): Promise<CreateRescueResponse> {
    logger.info({ msg: 'Creating rescue request', reporterId, municipality: input.municipality });

    // Execute command
    const command = new CreateRescueCommand(this.rescueRepository);
    const rescue = await command.execute(input, reporterId);

    logger.info({ msg: 'Rescue request created', rescueId: rescue.id });

    // TODO: Send notifications to volunteers
    // TODO: Create timeline entry

    return {
      success: true,
      message: 'Rescue request created successfully',
      rescue: {
        id: rescue.id,
        address: rescue.address,
        municipality: rescue.municipality,
        status: rescue.status,
        priority: rescue.priority,
        createdAt: rescue.createdAt,
      },
    };
  }
}
