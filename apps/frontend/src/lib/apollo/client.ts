/**
 * Apollo Client Configuration for Frontend
 * Connects to Backend GraphQL API
 */

import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  from,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { createFragmentRegistry } from '@apollo/client/cache';
// Fragment matcher is optional - used for union/interface types
// import possibleTypesResult from '@snake-rescue/contracts/src/generated/fragment-matcher';

// Get API URL from environment
const API_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql';
const IS_BROWSER = typeof window !== 'undefined';

/**
 * Create HTTP Link for GraphQL requests
 */
const httpLink = new HttpLink({
  uri: API_URL,
  credentials: 'include', // Send cookies for auth
  fetchOptions: {
    mode: 'cors',
  },
});

/**
 * Error Link - Handles GraphQL and Network errors
 */
const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      console.error(
        `[GraphQL Error]: Message: ${message}, Location: ${JSON.stringify(
          locations
        )}, Path: ${path}`,
        extensions
      );

      // Handle specific error codes
      if (extensions?.code === 'UNAUTHENTICATED') {
        // Redirect to login if unauthenticated
        if (IS_BROWSER) {
          window.location.href = '/login';
        }
      }
    });
  }

  if (networkError) {
    console.error(`[Network Error]: ${networkError.message}`);
    console.error('Operation:', operation.operationName);
  }
});

/**
 * Auth Link - Adds authentication headers
 */
const authLink = new ApolloLink((operation, forward) => {
  // Get auth token from localStorage or cookies
  const token = IS_BROWSER ? localStorage.getItem('auth-token') : null;

  // Add authorization header if token exists
  if (token) {
    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        authorization: `Bearer ${token}`,
      },
    }));
  }

  return forward(operation);
});

/**
 * Create Apollo Client Instance
 */
export function createApolloClient() {
  return new ApolloClient({
    link: from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache({
      // possibleTypes: possibleTypesResult.possibleTypes, // Uncomment if using unions/interfaces
      fragments: createFragmentRegistry(),
      typePolicies: {
        Query: {
          fields: {
            // Example: Merge pagination results
            rescues: {
              keyArgs: ['filter'],
              merge(existing = [], incoming) {
                return [...existing, ...incoming];
              },
            },
          },
        },
      },
    }),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'all',
      },
      query: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
      },
      mutate: {
        errorPolicy: 'all',
      },
    },
    devtools: {
      enabled: process.env.NODE_ENV === 'development',
    },
  });
}

/**
 * Singleton Apollo Client for Client-Side
 */
let apolloClient: ApolloClient<any> | null = null;

export function getApolloClient() {
  if (!apolloClient) {
    apolloClient = createApolloClient();
  }
  return apolloClient;
}
