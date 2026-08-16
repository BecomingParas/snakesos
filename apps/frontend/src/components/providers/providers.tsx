'use client'

import { ApolloProvider } from '@apollo/client/react'
import { getApolloClient } from '@/lib/apollo/client'
import { type ReactNode } from 'react'

/**
 * App-wide Providers Component
 *
 * Always wraps the app with Apollo Provider so GraphQL hooks work during SSR/build.
 */
export function Providers({ children }: { children: ReactNode }) {
  const apolloClient = getApolloClient()

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
}
