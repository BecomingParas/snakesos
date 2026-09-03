/**
 * useSignup Hook - Handles user registration with Better Auth
 */

import { useState } from 'react';
import { signUp } from '@/lib/auth/better-auth-client';

export interface SignupInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
  language?: string;
  timezone?: string;
}

export interface SignupResult {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    phone?: string;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export function useSignup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const signup = async (input: SignupInput): Promise<SignupResult> => {
    setLoading(true);
    setError(null);

    try {
      console.group('[Better Auth] useSignup - Preparing Request');
      console.log('input:', {
        email: input.email,
        name: input.name,
        password: '[REDACTED]',
        phone: input.phone,
      });
      console.groupEnd();

      // Use Better Auth's signUp method
      const result = await signUp.email({
        email: input.email.trim().toLowerCase(),
        password: input.password,
        name: input.name.trim(),
        // Better Auth v1 doesn't support custom fields in signUp
        // We'll update these after registration if needed
      });

      console.group('[Better Auth] useSignup - Response Received');
      console.log('result.data:', result.data ? 'present' : 'null');
      console.log('result.error:', result.error);
      console.groupEnd();

      // Better Auth automatically creates user and may auto-login
      if (result.data?.user) {
        // Return formatted result matching the expected type
        // Note: Better Auth user doesn't include role by default
        return {
          user: {
            id: result.data.user.id,
            email: result.data.user.email,
            name: result.data.user.name,
            role: 'CITIZEN', // Default role for new users
            phone: (result.data.user as any).phone || undefined,
            emailVerified: result.data.user.emailVerified || false,
            createdAt: result.data.user.createdAt.toISOString(),
            updatedAt: result.data.user.updatedAt.toISOString(),
          },
        };
      }

      throw new Error(result.error?.message || 'Registration failed');
    } catch (err) {
      console.group('[Better Auth] useSignup - Error');
      console.error('raw error:', err);
      console.groupEnd();
      
      const error = err instanceof Error ? err : new Error('Registration failed');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    signup,
    loading,
    error,
    data: null,
  };
}
