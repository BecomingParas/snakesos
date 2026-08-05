/**
 * GraphQL Error Formatter
 * Formats errors for consistent API responses
 */

import type { GraphQLFormattedError } from 'graphql';
import { unwrapResolverError } from '@apollo/server/errors';
import { AppError } from '@snake-rescue/shared';

export function formatError(formattedError: GraphQLFormattedError, error: unknown): GraphQLFormattedError {
  // Unwrap the original error
  const originalError = unwrapResolverError(error);

  // If it's our custom AppError, format it nicely
  if (originalError instanceof AppError) {
    return {
      message: originalError.message,
      extensions: {
        code: originalError.code,
        statusCode: originalError.statusCode,
        context: originalError.context,
      },
    };
  }

  // For development, include stack trace
  if (process.env.NODE_ENV !== 'production') {
    return {
      ...formattedError,
      extensions: {
        ...formattedError.extensions,
        stacktrace: (originalError as Error).stack?.split('\n'),
      },
    };
  }

  // In production, hide internal error details
  return {
    message: 'Internal server error',
    extensions: {
      code: 'INTERNAL_SERVER_ERROR',
      statusCode: 500,
    },
  };
}
