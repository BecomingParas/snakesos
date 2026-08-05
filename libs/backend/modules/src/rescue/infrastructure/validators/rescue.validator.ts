/**
 * Rescue Validators
 * Input validation for rescue operations
 */

import { Validator } from '@snake-rescue/shared';
import {
  CreateRescueInputSchema,
  UpdateRescueStatusInputSchema,
  AssignVolunteerInputSchema,
} from '../../application/dto/index.js';
import type {
  CreateRescueInput,
  UpdateRescueStatusInput,
  AssignVolunteerInput,
} from '../../application/dto/index.js';

export class RescueValidator {
  static validateCreateRescue(input: unknown): CreateRescueInput {
    return Validator.validate(CreateRescueInputSchema, input);
  }

  static validateUpdateStatus(input: unknown): UpdateRescueStatusInput {
    return Validator.validate(UpdateRescueStatusInputSchema, input);
  }

  static validateAssignVolunteer(input: unknown): AssignVolunteerInput {
    return Validator.validate(AssignVolunteerInputSchema, input);
  }
}
