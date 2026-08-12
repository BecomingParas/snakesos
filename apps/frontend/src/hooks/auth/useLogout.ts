/**
 * useLogout Hook - Handles user logout with GraphQL
 */

import { useMutation, useApolloClient } from '@apollo/client/react';
import { LOGOUT_MUTATION } from '@/lib/graphql/mutations';
import { useAuthStore } from '@/lib/auth/auth-store';
import { handleGraphQLError } from '@/lib/graphql';

export function useLogout() {
  const apolloClient = useApolloClient();
  const clearUser = useAuthStore((state) => state.clearUser);
  
  const [logoutMutation, { loading, error }] = useMutation(LOGOUT_MUTATION);

  const logout = async (): Promise<void> => {
    try {
      // Call logout mutation
      await logoutMutation();

      // Clear local storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-token');
      }

      // Clear auth store
      clearUser();

      // Clear Apollo cache
      await apolloClient.clearStore();
    } catch (err) {
      // Even if the API call fails, clear local state
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-token');
      }
      clearUser();
      await apolloClient.clearStore();
      
      throw handleGraphQLError(err);
    }
  };

  return {
    logout,
    loading,
    error: error ? handleGraphQLError(error) : null,
  };
}
