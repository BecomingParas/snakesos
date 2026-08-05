/**
 * Authentication Error
 * Thrown when authentication fails or is missing
 */

import { AppError } from './app.error.js';

export class AuthenticationError extends AppError {
  constructor(
    message: string = 'Authentication required',
    context?: Record<string, unknown>
  ) {
    super(message, 401, 'UNAUTHENTICATED', true, context);
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}
