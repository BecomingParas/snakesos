/**
 * useLogin Hook - Handles user login with GraphQL
 */

import { useMutation } from '@apollo/client/react';
import { LOGIN_MUTATION } from '@/lib/graphql/mutations';
import { useAuthStore } from '@/lib/auth/auth-store';
import { handleGraphQLError } from '@/lib/graphql';

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
  const setUser = useAuthStore((state) => state.setUser);
  
  const [loginMutation, { loading, error, data }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      const responseData = data as { login?: LoginResult } | undefined;
      if (responseData?.login) {
        // Store access token
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth-token', responseData.login.accessToken);
        }
        
        // Update auth store
        setUser(responseData.login.user);
      }
    },
  });

  const login = async (input: LoginInput): Promise<LoginResult> => {
    try {
      const result = await loginMutation({
        variables: {
          input: {
            email: input.email.trim().toLowerCase(),
            password: input.password,
          },
        },
      });

      const responseData = result.data as { login?: LoginResult } | undefined;

      if (!responseData?.login) {
        throw new Error('Login failed - no data returned');
      }

      return responseData.login;
    } catch (err) {
      throw handleGraphQLError(err);
    }
  };

  return {
    login,
    loading,
    error: error ? handleGraphQLError(error) : null,
    data: (data as { login?: LoginResult } | undefined)?.login,
  };
}
