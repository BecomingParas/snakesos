/**
 * useCurrentUser Hook - Get current authenticated user
 */

'use client';

import { useQuery } from '@apollo/client/react';
import { GET_ME } from '@/lib/graphql/queries/dashboard.queries';
import { handleGraphQLError } from '@/lib/graphql';

export type UserRole = 
  | 'CITIZEN' 
  | 'VOLUNTEER' 
  | 'VERIFIED_RESCUER' 
  | 'DISTRICT_COORDINATOR' 
  | 'ADMIN' 
  | 'SUPER_ADMIN';

export interface CurrentUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  volunteerProfile?: {
    id: string;
    status: string;
    experience: string;
    completedRescues: number;
    rating?: number;
  };
}

export interface UseCurrentUserOptions {
  skip?: boolean;
}

export function useCurrentUser(options: UseCurrentUserOptions = {}) {
  const { skip = false } = options;

  const { data, loading, error, refetch } = useQuery(GET_ME, {
    skip,
    fetchPolicy: 'cache-and-network',
    onError: (err) => {
      handleGraphQLError(err);
    },
  });

  return {
    user: data?.me as CurrentUser | undefined,
    loading,
    error: error ? handleGraphQLError(error) : null,
    refetch,
  };
}
