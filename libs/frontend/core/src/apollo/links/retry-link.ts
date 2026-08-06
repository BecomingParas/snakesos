/**
 * Retry Link - Automatically retries failed requests
 */
import { RetryLink } from '@apollo/client/link/retry';

export interface RetryLinkOptions {
  maxAttempts?: number;
  retryIf?: (error: any, operation: any) => boolean;
}

export const createRetryLink = (options: RetryLinkOptions = {}) => {
  const { maxAttempts = 3, retryIf } = options;

  return new RetryLink({
    delay: {
      initial: 300,
      max: 5000,
      jitter: true,
    },
    attempts: {
      max: maxAttempts,
      retryIf: (error: any, operation: any) => {
        // Don't retry on authentication errors
        const isAuthError =
          error?.graphQLErrors?.some(
            (err: any) =>
              err.extensions?.code === 'UNAUTHENTICATED' ||
              err.extensions?.code === 'FORBIDDEN'
          ) ?? false;

        if (isAuthError) {
          return false;
        }

        // Don't retry on bad user input
        const isBadInput =
          error?.graphQLErrors?.some(
            (err: any) => err.extensions?.code === 'BAD_USER_INPUT'
          ) ?? false;

        if (isBadInput) {
          return false;
        }

        // Custom retry logic
        if (retryIf) {
          return retryIf(error, operation);
        }

        // Retry on network errors and server errors
        return Boolean(
          error?.networkError || 
          error?.graphQLErrors?.some(
            (err: any) => err.extensions?.code === 'INTERNAL_SERVER_ERROR'
          )
        );
      },
    },
  });
};
