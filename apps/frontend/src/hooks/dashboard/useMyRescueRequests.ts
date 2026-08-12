/**
 * useMyRescueRequests Hook - Fetch citizen's rescue requests
 */

'use client';

import { useQuery } from '@apollo/client/react';
import { GET_MY_RESCUE_REQUESTS } from '@/lib/graphql/queries/dashboard.queries';
import { handleGraphQLError } from '@/lib/graphql';

export type RescueStatus = 
  | 'PENDING' 
  | 'ASSIGNED' 
  | 'IN_PROGRESS' 
  | 'COMPLETED' 
  | 'CANCELLED';

export type RescuePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface RescueRequest {
  id: string;
  name: string;
  phone: string;
  municipality: string;
  ward?: number;
  address: string;
  landmark?: string;
  lat?: number;
  lng?: number;
  snakeDescription?: string;
  snakeSize?: string;
  snakeColor?: string;
  snakeImageUrl?: string;
  status: RescueStatus;
  priority: RescuePriority;
  stillPresent: boolean;
  isEmergency: boolean;
  hasBite: boolean;
  referenceNumber?: string;
  createdAt: string;
  updatedAt: string;
  assignedVolunteer?: {
    id: string;
    user: {
      id: string;
      name: string;
      phone: string;
    };
    status: string;
  };
}

export interface PaginationInput {
  first?: number;
  after?: string;
  last?: number;
  before?: string;
}

export interface RescueRequestFilterInput {
  status?: RescueStatus[];
  priority?: RescuePriority[];
  municipality?: string[];
  isEmergency?: boolean;
  hasBite?: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface UseMyRescueRequestsOptions {
  pagination?: PaginationInput;
  filter?: RescueRequestFilterInput;
  skip?: boolean;
}

export function useMyRescueRequests(options: UseMyRescueRequestsOptions = {}) {
  const { pagination, filter, skip = false } = options;

  const { data, loading, error, refetch, fetchMore } = useQuery(GET_MY_RESCUE_REQUESTS, {
    variables: { pagination, filter },
    skip,
    fetchPolicy: 'cache-and-network',
    onError: (err) => {
      handleGraphQLError(err);
    },
  });

  const requests = data?.myRescueRequests?.edges?.map((edge: { node: RescueRequest }) => edge.node) || [];
  const pageInfo = data?.myRescueRequests?.pageInfo;
  const totalCount = data?.myRescueRequests?.totalCount || 0;

  return {
    requests,
    pageInfo,
    totalCount,
    loading,
    error: error ? handleGraphQLError(error) : null,
    refetch,
    fetchMore,
  };
}
