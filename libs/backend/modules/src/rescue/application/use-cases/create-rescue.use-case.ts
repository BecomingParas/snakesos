/**
 * Create Rescue Use Case
 * Orchestrates the rescue creation workflow
 */

import { RescueRepository } from '@snake-rescue/database';
import { createLogger } from '@snake-rescue/shared';
import { CreateRescueCommand } from '../commands/create-rescue.command.js';
import type { CreateRescueInput } from '../dto/index.js';
import type { RescueRequest } from '@snake-rescue/database';

const logger = createLogger('CreateRescueUseCase');

export class CreateRescueUseCase {
  constructor(private readonly rescueRepository: RescueRepository) {}

  async execute(
    input: CreateRescueInput,
    reporterId?: string,
  ): Promise<RescueRequest> {
    logger.info({
      msg: 'Creating rescue request',
      reporterId,
      municipality: input.municipality,
    });

    const command = new CreateRescueCommand(this.rescueRepository);
    const rescue = await command.execute(input, reporterId);

    logger.info({ msg: 'Rescue request created', rescueId: rescue.id });

    // TODO: Send notifications to volunteers
    // TODO: Create timeline entry

    return rescue;
  }
}
