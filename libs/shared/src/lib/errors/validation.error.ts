/**
 * Validation Error
 * Thrown when input validation fails
 */

import { AppError } from './app.error';

export class ValidationError extends AppError {
  constructor(
    message = 'Validation failed',
    context?: Record<string, unknown>
  ) {
    super(message, 400, 'VALIDATION_ERROR', true, context);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
