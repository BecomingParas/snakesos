/**
 * useDeleteSnake - Delete snake species
 */
import { useCallback } from 'react';
// import { useDeleteSnakeMutation } from '@snake-rescue/contracts';
import { useToast } from '@snake-rescue/frontend-core';

export const useDeleteSnake = () => {
  const { info } = useToast();

  const deleteSnake = useCallback(
    async (id: string) => {
      info('GraphQL types not generated yet. Run: yarn graphql:codegen');
      return null;
    },
    [info]
  );

  return {
    deleteSnake,
    loading: false,
    error: null,
  };
};
