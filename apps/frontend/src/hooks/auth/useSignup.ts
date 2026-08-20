/**
 * useSignup Hook - Handles user registration with GraphQL
 */

import { useMutation } from '@apollo/client/react';
import { REGISTER_MUTATION } from '@/lib/graphql/mutations';
import { useAuthStore } from '@/lib/auth/auth-store';
import { handleGraphQLError } from '@/lib/graphql';

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
  const setUser = useAuthStore((state) => state.setUser);
  
  const [registerMutation, { loading, error, data }] = useMutation(REGISTER_MUTATION, {
    onCompleted: (data) => {
      const responseData = data as { register?: SignupResult } | undefined;
      // Registration complete - user will need to verify email then login
      // No tokens or auth state to store during registration
      console.log('Registration successful:', responseData?.register?.user);
    },
  });

  const signup = async (input: SignupInput): Promise<SignupResult> => {
    try {
      console.group('[GRAPHQL] useSignup - Preparing Request');
      console.log('input:', {
        email: input.email,
        name: input.name,
        password: '[REDACTED]',
        phone: input.phone,
        language: input.language || 'en',
        timezone: input.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      console.log('GraphQL endpoint:', process.env.NEXT_PUBLIC_GRAPHQL_URL);
      console.groupEnd();

      const result = await registerMutation({
        variables: {
          input: {
            email: input.email.trim().toLowerCase(),
            password: input.password,
            name: input.name.trim(),
            phone: input.phone,
            language: input.language || 'en',
            timezone: input.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
        },
        // Don't throw on GraphQL errors - let us handle them
        errorPolicy: 'all',
      });

      console.group('[GRAPHQL] useSignup - Response Received');
      console.log('result.data:', result.data ? 'present' : 'null');
      console.log('result.error:', result.error);
      console.groupEnd();

      // Check for GraphQL error first
      if (result.error) {
        console.log('GraphQL error detected:', result.error);
        throw result.error;
      }

      const responseData = result.data as { register?: SignupResult } | undefined;

      if (!responseData?.register) {
        throw new Error('Registration failed - no data returned');
      }

      return responseData.register;
    } catch (err) {
      console.group('[GRAPHQL] useSignup - Error');
      console.error('raw error:', err);
      console.groupEnd();
      throw handleGraphQLError(err);
    }
  };

  return {
    signup,
    loading,
    error: error ? handleGraphQLError(error) : null,
    data: (data as { register?: SignupResult } | undefined)?.register,
  };
}
