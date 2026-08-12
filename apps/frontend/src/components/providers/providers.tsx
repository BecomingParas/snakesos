'use client'

import { ApolloProvider } from '@apollo/client/react'
import { Toaster } from '@/components/ui/sonner'
import { createApolloClient } from '@/lib/apollo/client'

const apolloClient = createApolloClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={apolloClient}>
      {children}
      <Toaster />
    </ApolloProvider>
  )
}
