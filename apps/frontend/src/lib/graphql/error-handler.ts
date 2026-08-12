/**
 * GraphQL Error Handler
 * Normalizes GraphQL errors into predictable frontend format
 */

export interface AuthError extends Error {
  code?: string;
  field?: string;
  extensions?: Record<string, any>;
}

interface GraphQLError {
  message: string;
  extensions?: Record<string, any>;
}

interface NetworkError {
  message: string;
}

interface ApolloErrorLike {
  message: string;
  graphQLErrors?: GraphQLError[];
  networkError?: NetworkError | null;
}

/**
 * Handle and normalize GraphQL errors
 */
export function handleGraphQLError(error: unknown): AuthError {
  // If it's already an AuthError, return it
  if (error instanceof Error && 'code' in error) {
    return error as AuthError;
  }

  // Handle Apollo-like errors (check for graphQLErrors or networkError)
  if (
    error &&
    typeof error === 'object' &&
    ('graphQLErrors' in error || 'networkError' in error)
  ) {
    const apolloError = error as ApolloErrorLike;
    
    // Network errors
    if (apolloError.networkError) {
      const authError = new Error('Network error. Please check your connection.') as AuthError;
      authError.code = 'NETWORK_ERROR';
      return authError;
    }

    // GraphQL errors
    if (apolloError.graphQLErrors && apolloError.graphQLErrors.length > 0) {
      const gqlError = apolloError.graphQLErrors[0];
      const authError = new Error(gqlError.message || 'An error occurred') as AuthError;
      
      // Extract error code and extensions
      if (gqlError.extensions) {
        authError.code = (gqlError.extensions.code as string) || 'UNKNOWN';
        authError.extensions = gqlError.extensions;
        
        // Extract field name for validation errors
        if (gqlError.extensions.field) {
          authError.field = gqlError.extensions.field as string;
        }
      }
      
      return authError;
    }

    // Generic Apollo error
    const authError = new Error(apolloError.message || 'An error occurred') as AuthError;
    authError.code = 'APOLLO_ERROR';
    return authError;
  }

  // Handle standard errors
  if (error instanceof Error) {
    const authError = new Error(error.message) as AuthError;
    authError.code = 'UNKNOWN_ERROR';
    return authError;
  }

  // Unknown error type
  const authError = new Error('An unexpected error occurred') as AuthError;
  authError.code = 'UNKNOWN_ERROR';
  return authError;
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyErrorMessage(error: unknown): string {
  // Handle AuthError
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const authError = error as AuthError;
    
    // Map common error codes to user-friendly messages
    const errorMessages: Record<string, string> = {
      UNAUTHENTICATED: 'Please log in to continue',
      UNAUTHORIZED: 'You do not have permission to perform this action',
      FORBIDDEN: 'Access denied',
      BAD_USER_INPUT: 'Please check your input and try again',
      INVALID_CREDENTIALS: 'Invalid email or password',
      EMAIL_ALREADY_EXISTS: 'This email is already registered',
      USER_NOT_FOUND: 'User not found',
      INVALID_TOKEN: 'Invalid or expired token',
      TOKEN_EXPIRED: 'Token has expired',
      NETWORK_ERROR: 'Network error. Please check your connection',
      VALIDATION_ERROR: 'Please check your input',
    };

    return errorMessages[authError.code || ''] || authError.message || 'An error occurred';
  }
  
  // Handle standard Error
  if (error instanceof Error) {
    return error.message;
  }
  
  // Handle string
  if (typeof error === 'string') {
    return error;
  }
  
  // Fallback
  return 'An unexpected error occurred';
}

/**
 * Check if error is a specific type
 */
export function isAuthenticationError(error: AuthError): boolean {
  return error.code === 'UNAUTHENTICATED' || error.code === 'INVALID_CREDENTIALS';
}

export function isValidationError(error: AuthError): boolean {
  return error.code === 'BAD_USER_INPUT' || error.code === 'VALIDATION_ERROR';
}

export function isNetworkError(error: AuthError): boolean {
  return error.code === 'NETWORK_ERROR';
}
