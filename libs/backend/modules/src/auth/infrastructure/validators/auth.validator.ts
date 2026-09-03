/**
 * Auth Validators
 * Input validation for auth operations
 */

import { Validator } from '@snake-rescue/shared';
import { LoginInputSchema, RegisterInputSchema } from '../../application/dto/index';
import type { LoginInput, RegisterInput } from '../../application/dto/index';

export class AuthValidator {
  static validateLogin(input: unknown): LoginInput {
    return Validator.validate(LoginInputSchema, input);
  }

  static validateRegister(input: unknown): RegisterInput {
    return Validator.validate(RegisterInputSchema, input);
  }
}
