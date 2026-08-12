/**
 * Root Provider Component
 * Wraps app with all necessary providers
 */

import { type ReactNode, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ApolloProvider } from '@/lib/apollo';
import { useAuthStore } from '@/lib/auth';

// Create QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

interface RootProviderProps {
  children: ReactNode;
}

export function RootProvider({ children }: RootProviderProps) {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <ApolloProvider>
        {children}
      </ApolloProvider>
    </QueryClientProvider>
  );
}
