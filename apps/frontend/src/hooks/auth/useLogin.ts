/**
 * useLogin Hook - Handles user login with GraphQL
 */

import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { useAuthStore } from '@/lib/auth/auth-store';

const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      user {
        id
        email
        name
        role
        phone
        emailVerified
        createdAt
        updatedAt
      }
      accessToken
      refreshToken
    }
  }
`;

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

  const [loginMutation] = useMutation(LOGIN_MUTATION);

  const login = async (input: LoginInput): Promise<LoginResult> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await loginMutation({
        variables: {
          input: {
            email: input.email.trim().toLowerCase(),
            password: input.password,
          },
        },
      });

      if (data?.login) {
        const { user, accessToken, refreshToken } = data.login;

        // Store tokens in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth-token', accessToken);
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
        }

        // Update auth store
        setUser({
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          phone: user.phone || undefined,
          emailVerified: user.emailVerified,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        });

        // Return formatted result
        return {
          accessToken,
          refreshToken,
          expiresIn: 604800, // 7 days
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            phone: user.phone || undefined,
            emailVerified: user.emailVerified,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
        };
      }

      throw new Error('Login failed');
    } catch (err: any) {
      const errorMessage = err.graphQLErrors?.[0]?.message || err.message || 'Login failed';
      const error = new Error(errorMessage);
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
