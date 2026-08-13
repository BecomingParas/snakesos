/**
 * Bad Request Error
 * Thrown when request is invalid or malformed
 */

import { AppError } from './app.error.js';

export class BadRequestError extends AppError {
  constructor(
    message = 'Bad request',
    context?: Record<string, unknown>
  ) {
    super(message, 400, 'BAD_REQUEST', true, context);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}
