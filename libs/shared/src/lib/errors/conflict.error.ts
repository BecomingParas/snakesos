/**
 * Conflict Error
 * Thrown when an operation conflicts with existing state
 */

import { AppError } from './app.error.js';

export class ConflictError extends AppError {
  constructor(
    message: string = 'Resource conflict',
    context?: Record<string, unknown>
  ) {
    super(message, 409, 'CONFLICT', true, context);
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}
