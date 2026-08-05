/**
 * Not Found Error
 * Thrown when a requested resource doesn't exist
 */

import { AppError } from './app.error.js';

export class NotFoundError extends AppError {
  constructor(
    resource: string = 'Resource',
    context?: Record<string, unknown>
  ) {
    super(`${resource} not found`, 404, 'NOT_FOUND', true, context);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
