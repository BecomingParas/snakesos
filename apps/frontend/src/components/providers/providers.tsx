'use client'

import { ApolloProvider } from '@apollo/client/react'
import { getApolloClient } from '@/lib/apollo/client'
import { ThemeProvider } from '@/components/theme'
import { type ReactNode } from 'react'

/**
 * App-wide Providers Component
 *
 * Wraps the app with all necessary providers:
 * - ThemeProvider: Handles light/dark/system theme switching
 * - ApolloProvider: GraphQL client for API communication
 */
export function Providers({ children }: { children: ReactNode }) {
  const apolloClient = getApolloClient()

  return (
    <ThemeProvider>
      <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
    </ThemeProvider>
  )
}
