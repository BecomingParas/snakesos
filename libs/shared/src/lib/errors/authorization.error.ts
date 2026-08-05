/**
 * Authorization Error
 * Thrown when user lacks permissions
 */

import { AppError } from './app.error.js';

export class AuthorizationError extends AppError {
  constructor(
    message: string = 'Insufficient permissions',
    context?: Record<string, unknown>
  ) {
    super(message, 403, 'FORBIDDEN', true, context);
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}
