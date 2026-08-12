/**
 * useMyAssignedRescues Hook - Fetch rescuer's assigned rescues
 */

'use client';

import { useQuery } from '@apollo/client/react';
import { GET_MY_ASSIGNED_RESCUES } from '@/lib/graphql/queries/dashboard.queries';
import { handleGraphQLError } from '@/lib/graphql';
import type { RescueRequest, PaginationInput, RescueRequestFilterInput } from './useMyRescueRequests';

export interface UseMyAssignedRescuesOptions {
  pagination?: PaginationInput;
  filter?: RescueRequestFilterInput;
  skip?: boolean;
}

export function useMyAssignedRescues(options: UseMyAssignedRescuesOptions = {}) {
  const { pagination, filter, skip = false } = options;

  const { data, loading, error, refetch, fetchMore } = useQuery(GET_MY_ASSIGNED_RESCUES, {
    variables: { pagination, filter },
    skip,
    fetchPolicy: 'cache-and-network',
    onError: (err) => {
      handleGraphQLError(err);
    },
  });

  const rescues = data?.myAssignedRescues?.edges?.map((edge: { node: RescueRequest }) => edge.node) || [];
  const pageInfo = data?.myAssignedRescues?.pageInfo;
  const totalCount = data?.myAssignedRescues?.totalCount || 0;

  return {
    rescues,
    pageInfo,
    totalCount,
    loading,
    error: error ? handleGraphQLError(error) : null,
    refetch,
    fetchMore,
  };
}
