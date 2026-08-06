/**
 * Auth Link - Automatically attaches JWT tokens to requests
 * Enterprise-grade: Stores access token in memory, refresh token in HttpOnly cookie
 */
import { setContext } from '@apollo/client/link/context';

// In-memory token storage (never localStorage for security)
let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = (): string | null => {
  return accessToken;
};

export const clearAccessToken = () => {
  accessToken = null;
};

// Auth link - adds authorization header
export const authLink = setContext((_, { headers }) => {
  const token = getAccessToken();
  
  return {
    headers: {
      ...headers,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  };
});
