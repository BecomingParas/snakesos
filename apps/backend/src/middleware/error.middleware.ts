/**
 * Error Handling Middleware
 * Global error handler for Express
 */

import type { Request, Response, NextFunction } from 'express';
import { AppError, createLogger } from '@snake-rescue/shared';

const logger = createLogger('ErrorMiddleware');

export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) {
  // Log error
  logger.error({
    msg: 'Unhandled error',
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Handle AppError instances
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.code,
      ...(process.env['NODE_ENV'] === 'development' && { stack: err.stack }),
    });
  }

  // Handle unknown errors
  return res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(process.env['NODE_ENV'] === 'development' && { 
      error: err.message,
      stack: err.stack,
    }),
  });
}
