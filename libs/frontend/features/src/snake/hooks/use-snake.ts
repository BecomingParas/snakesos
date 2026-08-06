/**
 * useSnake - Fetch single snake details
 */
export interface UseSnakeOptions {
  id: string;
  skip?: boolean;
}

export const useSnake = (options: UseSnakeOptions) => {
  // Temporarily disabled until GraphQL types are generated
  // Uncomment after running: yarn graphql:codegen
  /*
  const { data, loading, error, refetch } = useSnakeQuery({
    variables: { id },
    skip: !id || skip,
    fetchPolicy: 'cache-first',
  });

  useEffect(() => {
    if (error) {
      toast.error('Failed to load snake details', {
        description: error.message,
      });
    }
  }, [error, toast]);

  return {
    snake: data?.snake || null,
    loading,
    error,
    refetch,
  };
  */

  // Temporary placeholder
  return {
    snake: null,
    loading: false,
    error: null,
    refetch: async () => {},
  };
};
