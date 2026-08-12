/**
 * useAuth Hook - Get current user and authentication state
 */

'use client';

import { useQuery } from '@apollo/client/react';
import { GET_ME_QUERY } from '@/lib/graphql/queries/dashboard';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'CITIZEN' | 'VOLUNTEER' | 'VERIFIED_RESCUER' | 'DISTRICT_COORDINATOR' | 'ADMIN' | 'SUPER_ADMIN';
  phone?: string;
  emailVerified: boolean;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  volunteerProfile?: {
    id: string;
    status: string;
    experience: string;
    municipality: string;
    totalRescues: number;
    rating: number;
  };
}

export function useAuth() {
  const { data, loading, error, refetch } = useQuery(GET_ME_QUERY, {
    fetchPolicy: 'cache-and-network',
  });

  const user: User | null = data?.me || null;
  const isAuthenticated = !!user;

  return {
    user,
    isAuthenticated,
    loading,
    error,
    refetch,
  };
}
