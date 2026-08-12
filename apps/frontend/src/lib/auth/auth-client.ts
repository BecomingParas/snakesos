/**
 * Authentication Client
 * Handles auth operations with backend GraphQL API
 */

import { getApolloClient } from '@/lib/apollo';
import {
  REGISTER_MUTATION,
  LOGIN_MUTATION,
  LOGOUT_MUTATION,
  FORGOT_PASSWORD_MUTATION,
  RESET_PASSWORD_MUTATION,
  VERIFY_EMAIL_MUTATION,
} from '@/lib/graphql/mutations';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  language?: string;
  timezone?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  phone?: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthPayload {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}

export interface AuthSession {
  user: User;
  accessToken: string;
}

/**
 * Login with email and password
 */
export async function login(credentials: LoginCredentials): Promise<AuthSession> {
  const client = getApolloClient();

  try {
    const { data, errors } = await client.mutate({
      mutation: LOGIN_MUTATION,
      variables: {
        input: {
          email: credentials.email,
          password: credentials.password,
        },
      },
    });

    if (errors && errors.length > 0) {
      throw new Error(errors[0].message || 'Login failed');
    }

    if (!data?.login) {
      throw new Error('Login failed - no data returned');
    }

    // Store access token
    const { accessToken, user } = data.login;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth-token', accessToken);
    }

    return {
      user,
      accessToken,
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error instanceof Error ? error : new Error('Login failed');
  }
}

/**
 * Register new user
 */
export async function register(data: RegisterData): Promise<AuthPayload> {
  const client = getApolloClient();

  try {
    const { data: result, errors } = await client.mutate({
      mutation: REGISTER_MUTATION,
      variables: {
        input: {
          email: data.email,
          password: data.password,
          name: data.name,
          phone: data.phone,
          language: data.language || 'en',
          timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      },
    });

    if (errors && errors.length > 0) {
      throw new Error(errors[0].message || 'Registration failed');
    }

    if (!result?.register) {
      throw new Error('Registration failed - no data returned');
    }

    // Store access token
    const { accessToken } = result.register;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth-token', accessToken);
    }

    return result.register;
  } catch (error) {
    console.error('Registration error:', error);
    throw error instanceof Error ? error : new Error('Registration failed');
  }
}

/**
 * Logout user
 */
export async function logout(): Promise<void> {
  const client = getApolloClient();

  try {
    await client.mutate({
      mutation: LOGOUT_MUTATION,
    });

    // Clear auth token
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-token');
    }

    // Clear Apollo cache
    await client.clearStore();
  } catch (error) {
    console.error('Logout error:', error);
    // Still clear local data even if logout request fails
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-token');
    }
    throw error instanceof Error ? error : new Error('Logout failed');
  }
}

/**
 * Get current session
 * For now, returns null as we'll implement a proper currentUser query later
 */
export async function getSession(): Promise<AuthSession | null> {
  try {
    // Check if we have a token
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        return null;
      }
    }

    // TODO: Implement a currentUser query to fetch session
    // For now, return null - session will be managed through auth store
    return null;
  } catch (error) {
    console.error('Failed to get session:', error);
    return null;
  }
}

/**
 * Request password reset
 */
export async function requestPasswordReset(email: string): Promise<{ message: string; expiresAt: string }> {
  const client = getApolloClient();

  try {
    const { data, errors } = await client.mutate({
      mutation: FORGOT_PASSWORD_MUTATION,
      variables: { email },
    });

    if (errors && errors.length > 0) {
      throw new Error(errors[0].message || 'Password reset request failed');
    }

    if (!data?.forgotPassword) {
      throw new Error('Password reset request failed - no data returned');
    }

    return data.forgotPassword;
  } catch (error) {
    console.error('Password reset request error:', error);
    throw error instanceof Error ? error : new Error('Password reset request failed');
  }
}

/**
 * Reset password with token
 */
export async function resetPassword(token: string, newPassword: string): Promise<boolean> {
  const client = getApolloClient();

  try {
    const { data, errors } = await client.mutate({
      mutation: RESET_PASSWORD_MUTATION,
      variables: {
        input: {
          token,
          newPassword,
        },
      },
    });

    if (errors && errors.length > 0) {
      throw new Error(errors[0].message || 'Password reset failed');
    }

    return data?.resetPassword || false;
  } catch (error) {
    console.error('Password reset error:', error);
    throw error instanceof Error ? error : new Error('Password reset failed');
  }
}

/**
 * Verify email with token
 */
export async function verifyEmail(token: string): Promise<{ success: boolean; message: string; user?: User }> {
  const client = getApolloClient();

  try {
    const { data, errors } = await client.mutate({
      mutation: VERIFY_EMAIL_MUTATION,
      variables: {
        input: { token },
      },
    });

    if (errors && errors.length > 0) {
      throw new Error(errors[0].message || 'Email verification failed');
    }

    if (!data?.verifyEmail) {
      throw new Error('Email verification failed - no data returned');
    }

    return data.verifyEmail;
  } catch (error) {
    console.error('Email verification error:', error);
    throw error instanceof Error ? error : new Error('Email verification failed');
  }
}

/**
 * Social login (Google)
 * TODO: Implement OAuth GraphQL mutation
 */
export function loginWithGoogle(): void {
  console.warn('Google OAuth not yet implemented with GraphQL');
  // Will need to implement oauthLogin mutation
}
