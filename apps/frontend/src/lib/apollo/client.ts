/**
 * Apollo Client Configuration for Frontend
 * Connects to Backend GraphQL API
 */

import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { createFragmentRegistry } from '@apollo/client/cache';
// Fragment matcher is optional - used for union/interface types
// import possibleTypesResult from '@snake-rescue/contracts/src/generated/fragment-matcher';

// Get API URL from environment
const API_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4200/api/graphql';
const IS_BROWSER = typeof window !== 'undefined';

/**
 * Create HTTP Link for GraphQL requests
 * IMPORTANT: This must only be called client-side
 */
function createHttpLink() {
  return new HttpLink({
    uri: API_URL,
    credentials: 'include', // Send cookies for auth
    fetchOptions: {
      mode: 'cors',
    },
  });
}

/**
 * Error Link - Handles GraphQL and Network errors
 * Lazily initialized to prevent SSR issues with React context
 */
function createErrorLink() {
  return onError((errorResponse) => {
    const { graphQLErrors, networkError, operation } = errorResponse as any;
    
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path, extensions }: any) => {
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
      console.error('Operation:', operation?.operationName);
    }
  });
}

/**
 * Auth Link - Adds authentication headers
 * IMPORTANT: This must only be called client-side
 */
function createAuthLink() {
  return new ApolloLink((operation, forward) => {
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
}

/**
 * Create Apollo Client Instance
 * Works in both browser and SSR/build contexts.
 */
export function createApolloClient() {
  return new ApolloClient({
    link: ApolloLink.from([createErrorLink(), createAuthLink(), createHttpLink()]),
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
    ssrMode: !IS_BROWSER,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
      },
      query: {
        fetchPolicy: 'network-only',
      },
    },
    devtools: {
      enabled: IS_BROWSER && process.env.NODE_ENV === 'development',
    },
  });
}

/**
 * Singleton Apollo Client for Client-Side
 */
let apolloClient: ReturnType<typeof createApolloClient> | null = null;

export function getApolloClient() {
  if (!apolloClient) {
    apolloClient = createApolloClient();
  }
  return apolloClient;
}
