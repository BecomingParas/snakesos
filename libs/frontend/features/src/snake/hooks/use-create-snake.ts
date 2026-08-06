/**
 * useCreateSnake - Create a new snake species
 */
import { useCallback } from 'react';
// import { useCreateSnakeMutation, CreateSnakeInput, SnakesDocument } from '@snake-rescue/contracts';
import { useToast } from '@snake-rescue/frontend-core';

export const useCreateSnake = () => {
  const { info } = useToast();

  // Temporarily disabled until GraphQL types are generated
  // Uncomment after running: yarn graphql:codegen
  
  const createSnake = useCallback(
    async (input: any) => {
      info('GraphQL types not generated yet. Run: yarn graphql:codegen');
      return null;
    },
    [info]
  );

  return {
    createSnake,
    loading: false,
    error: null,
  };
};
