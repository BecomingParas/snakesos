/**
 * Apollo Provider for React App
 * Wraps the app with Apollo Client context
 */

import { ApolloProvider as BaseApolloProvider } from '@apollo/client/react';
import { type ReactNode } from 'react';
import { getApolloClient } from './client';

interface ApolloProviderProps {
  children: ReactNode;
}

export function ApolloProvider({ children }: ApolloProviderProps) {
  const client = getApolloClient();

  return <BaseApolloProvider client={client}>{children}</BaseApolloProvider>;
}
