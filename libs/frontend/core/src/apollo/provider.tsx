/**
 * Apollo Provider - Wraps the app with Apollo Client
 */
'use client';

import { ReactNode, useMemo } from 'react';
import { ApolloProvider } from '@apollo/client/react';
import { getApolloClient } from './client';
import { useRouter } from 'next/navigation';

export interface ApolloProviderProps {
  children: ReactNode;
  enableSubscriptions?: boolean;
}

export const ApolloClientProvider = ({
  children,
  enableSubscriptions = false, // Temporarily disabled to fix timeout issue
}: ApolloProviderProps) => {
  const router = useRouter();

  const client = useMemo(
    () =>
      getApolloClient({
        enableSubscriptions,
        onUnauthenticated: () => {
          // Redirect to login on authentication error
          router.push('/auth/login');
        },
      }),
    [enableSubscriptions, router]
  );

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
