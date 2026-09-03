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
        // Type assertion: Better Auth user + custom fields from Prisma schema
        const user = result.data.user as typeof result.data.user & { role?: string; phone?: string };
        
        // Update auth store
        setUser({
          id: user.id,
          email: user.email || '',
          name: user.name,
          role: user.role || 'CITIZEN',
          phone: user.phone,
          emailVerified: user.emailVerified || false,
          createdAt: user.createdAt.toString(),
          updatedAt: user.updatedAt.toString(),
        });

        // Return formatted result matching the expected type
        // Better Auth returns a token directly in result.data
        return {
          accessToken: result.data.token || '',
          refreshToken: result.data.token || '',
          expiresIn: 604800, // 7 days default
          user: {
            id: user.id,
            email: user.email || '',
            name: user.name,
            role: user.role || 'CITIZEN',
            phone: user.phone,
            emailVerified: user.emailVerified || false,
            createdAt: user.createdAt.toString(),
            updatedAt: user.updatedAt.toString(),
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
