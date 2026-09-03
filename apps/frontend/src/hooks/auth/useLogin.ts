/**
 * useLogin Hook - Handles user login with Better Auth
 */

import { useState } from 'react';
import { signIn } from '@/lib/auth/better-auth-client';
import { useAuthStore } from '@/lib/auth/auth-store';

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
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

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const setUser = useAuthStore((state) => state.setUser);

  const login = async (input: LoginInput): Promise<LoginResult> => {
    setLoading(true);
    setError(null);

    try {
      // Use Better Auth's signIn method
      const result = await signIn.email({
        email: input.email.trim().toLowerCase(),
        password: input.password,
      });

      // Better Auth automatically sets session cookies
      // The result contains user data
      if (result.data?.user) {
        // Update auth store
        setUser({
          id: result.data.user.id,
          email: result.data.user.email,
          name: result.data.user.name,
          role: result.data.user.role || 'USER',
          phone: result.data.user.phone,
          emailVerified: result.data.user.emailVerified || false,
          createdAt: result.data.user.createdAt,
          updatedAt: result.data.user.updatedAt,
        });

        // Return formatted result matching the expected type
        return {
          accessToken: result.data.session?.token || '',
          refreshToken: result.data.session?.token || '',
          expiresIn: result.data.session?.expiresIn || 604800, // 7 days default
          user: {
            id: result.data.user.id,
            email: result.data.user.email,
            name: result.data.user.name,
            role: result.data.user.role || 'USER',
            phone: result.data.user.phone,
            emailVerified: result.data.user.emailVerified || false,
            createdAt: result.data.user.createdAt,
            updatedAt: result.data.user.updatedAt,
          },
        };
      }

      throw new Error(result.error?.message || 'Login failed');
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Login failed');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    loading,
    error,
    data: null,
  };
}
