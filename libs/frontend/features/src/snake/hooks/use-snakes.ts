/**
 * useSnakes - Fetch paginated list of snakes
 * 
 * This hook wraps the generated useSnakesQuery and adds:
 * - Error handling with toasts
 * - Loading state management
 * - Pagination helpers
 * - Data transformation
 */
export interface UseSnakesOptions {
  filters?: any; // Will be SnakeSpeciesFilters after codegen
  orderBy?: any; // Will be SnakeSpeciesOrderBy after codegen
  limit?: number;
  skip?: boolean;
}

export interface UseSnakesReturn {
  snakes: any[];
  loading: boolean;
  error: any;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalCount: number;
  fetchMore: () => Promise<void>;
  refetch: () => Promise<void>;
}

export const useSnakes = (options?: UseSnakesOptions): UseSnakesReturn => {
  // Temporarily disabled until GraphQL types are generated
  // Uncomment after running: yarn graphql:codegen
  /*
  const { data, loading, error, fetchMore: apolloFetchMore, refetch } = useSnakesQuery({
    variables: {
      first: limit,
      filters,
      orderBy,
    },
    skip,
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  // Show error toast
  useEffect(() => {
    if (error) {
      toast.error('Failed to load snakes', {
        description: error.message,
      });
    }
  }, [error, toast]);

  // Fetch more items (pagination)
  const fetchMore = useCallback(async () => {
    if (!data?.snakes?.pageInfo?.hasNextPage) return;

    try {
      await apolloFetchMore({
        variables: {
          after: data.snakes.pageInfo.endCursor,
        },
      });
    } catch (err: any) {
      toast.error('Failed to load more snakes', {
        description: err.message,
      });
    }
  }, [apolloFetchMore, data, toast]);

  // Refetch data
  const handleRefetch = useCallback(async () => {
    try {
      await refetch();
      toast.success('Snakes refreshed');
    } catch (err: any) {
      toast.error('Failed to refresh snakes', {
        description: err.message,
      });
    }
  }, [refetch, toast]);

  return {
    snakes: data?.snakes?.edges?.map((edge) => edge.node) || [],
    loading,
    error,
    hasNextPage: data?.snakes?.pageInfo?.hasNextPage || false,
    hasPreviousPage: data?.snakes?.pageInfo?.hasPreviousPage || false,
    totalCount: data?.snakes?.totalCount || 0,
    fetchMore,
    refetch: handleRefetch,
  };
  */

  // Temporary placeholder implementation
  return {
    snakes: [],
    loading: false,
    error: null,
    hasNextPage: false,
    hasPreviousPage: false,
    totalCount: 0,
    fetchMore: async () => {},
    refetch: async () => {},
  };
};
