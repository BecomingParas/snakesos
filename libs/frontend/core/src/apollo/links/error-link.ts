/**
 * Error Link - Centralized error handling for GraphQL and network errors
 * WITH AUTOMATIC TOKEN REFRESH on authentication errors
 */
import { onError } from '@apollo/client/link/error';
import { GraphQLError } from 'graphql';
import { Observable } from '@apollo/client';
import { setAccessToken } from './auth-link';

export interface ErrorHandlerOptions {
  onNetworkError?: (error: Error) => void;
  onGraphQLError?: (error: GraphQLError) => void;
  onServerError?: (statusCode: number) => void;
  onRefreshToken?: () => Promise<string | null>;
  onUnauthenticated?: () => void;
  logErrors?: boolean;
}

export const createErrorLink = (options: ErrorHandlerOptions = {}) => {
  const {
    onNetworkError,
    onGraphQLError,
    onServerError,
    onRefreshToken,
    onUnauthenticated,
    logErrors = true,
  } = options;

  let isRefreshing = false;
  let pendingRequests: Array<() => void> = [];

  const resolvePendingRequests = () => {
    pendingRequests.map(callback => callback());
    pendingRequests = [];
  };

  return onError(({ graphQLErrors, networkError, operation, forward }: any) => {
    // Handle GraphQL errors
    if (graphQLErrors) {
      for (const error of graphQLErrors) {
        const { message, locations, path, extensions } = error;
        
        if (logErrors) {
          console.error(
            `[GraphQL Error]: Message: ${message}, Location: ${JSON.stringify(locations)}, Path: ${path}`,
            extensions
          );
        }

        // Custom error handling
        if (onGraphQLError) {
          onGraphQLError(error);
        }

        // Handle UNAUTHENTICATED errors with automatic token refresh
        if (extensions?.code === 'UNAUTHENTICATED' && onRefreshToken) {
          // Prevent infinite refresh loops
          if (operation.operationName === 'RefreshToken') {
            if (onUnauthenticated) {
              onUnauthenticated();
            }
            return;
          }

          if (!isRefreshing) {
            isRefreshing = true;

            return new Observable(observer => {
              onRefreshToken()
                .then(newToken => {
                  if (newToken) {
                    setAccessToken(newToken);
                    resolvePendingRequests();
                  } else {
                    pendingRequests = [];
                    if (onUnauthenticated) {
                      onUnauthenticated();
                    }
                  }
                })
                .catch(() => {
                  pendingRequests = [];
                  if (onUnauthenticated) {
                    onUnauthenticated();
                  }
                })
                .finally(() => {
                  isRefreshing = false;
                });

              // Wait for token refresh, then retry
              pendingRequests.push(() => {
                forward(operation).subscribe(observer);
              });
            });
          } else {
            // Queue request while refresh is in progress
            return new Observable(observer => {
              pendingRequests.push(() => {
                forward(operation).subscribe(observer);
              });
            });
          }
        }

        // Handle specific error codes
        switch (extensions?.code) {
          case 'FORBIDDEN':
            console.warn('Access forbidden:', message);
            break;
          case 'BAD_USER_INPUT':
            console.warn('Validation error:', message);
            break;
          case 'INTERNAL_SERVER_ERROR':
            console.error('Server error:', message);
            break;
          default:
            console.error('Unknown GraphQL error:', error);
        }
      }
    }

    // Handle network errors
    if (networkError) {
      if (logErrors) {
        console.error(`[Network Error]: ${networkError.message}`);
      }

      // Handle server errors (5xx)
      if ('statusCode' in networkError && networkError.statusCode) {
        if (onServerError) {
          onServerError(networkError.statusCode);
        }
        
        if (networkError.statusCode >= 500) {
          console.error('Server error:', networkError.statusCode);
        }
      }

      // Custom network error handling
      if (onNetworkError) {
        onNetworkError(networkError);
      }
    }

    // Return undefined to continue with normal error handling
    return undefined;
  });
};

// Utility to extract user-friendly error messages
export const extractErrorMessage = (error: any): string => {
  if (error.graphQLErrors && error.graphQLErrors.length > 0) {
    return error.graphQLErrors[0].message;
  }
  
  if (error.networkError) {
    return 'Network error. Please check your connection.';
  }
  
  return error.message || 'An unknown error occurred';
};

// Utility to check if error is authentication related
export const isAuthError = (error: any): boolean => {
  if (error.graphQLErrors && error.graphQLErrors.length > 0) {
    return error.graphQLErrors.some(
      (err: GraphQLError) =>
        err.extensions?.code === 'UNAUTHENTICATED' ||
        err.extensions?.code === 'FORBIDDEN'
    );
  }
  return false;
};

// Utility to check if error is a validation error
export const isValidationError = (error: any): boolean => {
  if (error.graphQLErrors && error.graphQLErrors.length > 0) {
    return error.graphQLErrors.some(
      (err: GraphQLError) => err.extensions?.code === 'BAD_USER_INPUT'
    );
  }
  return false;
};
