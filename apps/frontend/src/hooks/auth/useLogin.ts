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
        // Type assertion: Better Auth user doesn't include role/phone by default
        // but our Prisma schema has these fields
        const user = result.data.user as any;
        
        // Update auth store
        setUser({
          id: user.id,
          email: user.email || '',
          name: user.name,
          role: user.role || 'CITIZEN',
          phone: user.phone || undefined,
          emailVerified: user.emailVerified || false,
          createdAt: user.createdAt?.toISOString?.() || new Date().toISOString(),
          updatedAt: user.updatedAt?.toISOString?.() || new Date().toISOString(),
        });

        // Return formatted result matching the expected type
        return {
          accessToken: (result.data as any).session?.token || '',
          refreshToken: (result.data as any).session?.token || '',
          expiresIn: (result.data as any).session?.expiresIn || 604800, // 7 days default
          user: {
            id: user.id,
            email: user.email || '',
            name: user.name,
            role: user.role || 'CITIZEN',
            phone: user.phone || undefined,
            emailVerified: user.emailVerified || false,
            createdAt: user.createdAt?.toISOString?.() || new Date().toISOString(),
            updatedAt: user.updatedAt?.toISOString?.() || new Date().toISOString(),
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
