/**
 * useUpdateSnake - Update existing snake species
 */
import { useCallback } from 'react';
// import { useUpdateSnakeMutation, UpdateSnakeInput } from '@snake-rescue/contracts';
import { useToast } from '@snake-rescue/frontend-core';

export const useUpdateSnake = () => {
  const { info } = useToast();

  const updateSnake = useCallback(
    async (id: string, input: any) => {
      info('GraphQL types not generated yet. Run: yarn graphql:codegen');
      return null;
    },
    [info]
  );

  return {
    updateSnake,
    loading: false,
    error: null,
  };
};
