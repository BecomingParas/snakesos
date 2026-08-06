/**
 * useUpdateRescueStatus - Update rescue status with optimistic updates
 */
import { useCallback } from 'react';
// import { useUpdateRescueStatusMutation, RescueStatus } from '@snake-rescue/contracts';
import { useToast } from '@snake-rescue/frontend-core';

export const useUpdateRescueStatus = () => {
  const { info } = useToast();

  const updateStatus = useCallback(
    async (id: string, status: any, notes?: string) => {
      info('GraphQL types not generated yet. Run: yarn graphql:codegen');
      return null;
    },
    [info]
  );

  return {
    updateStatus,
    loading: false,
    error: null,
  };
};
