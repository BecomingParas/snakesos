/**
 * Apollo Client Instance
 * - Configured with all links including automatic token refresh
 * - InMemoryCache with persistence
 * - SSR support
 */
import { ApolloClient, ApolloLink } from '@apollo/client';
import { cache } from './cache';
import {
  authLink,
  createErrorLink,
  createRetryLink,
  createHttpLink,
  createSubscriptionLink,
  createSplitLink,
} from './links';
import { clearAccessToken } from './links/auth-link';

// Client-side only imports
let persistCache: any;
if (typeof window !== 'undefined') {
  import('apollo3-cache-persist').then((module) => {
    persistCache = module.persistCache;
  });
}

// Configuration
const GRAPHQL_HTTP_URL =
  process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql';
const GRAPHQL_WS_URL =
  process.env.NEXT_PUBLIC_GRAPHQL_WS_URL || 'ws://localhost:4000/graphql';

// SSR detection
const isBrowser = typeof window !== 'undefined';

// Client instance
let apolloClient: any = null;

/**
 * Refresh token function for automatic token refresh
 */
const refreshTokenFunction = async (): Promise<string | null> => {
  try {
    const response = await fetch(GRAPHQL_HTTP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        query: `
          mutation RefreshToken {
            refreshToken {
              accessToken
            }
          }
        `,
      }),
    });

    const result = await response.json();
    
    if (result.data?.refreshToken?.accessToken) {
      return result.data.refreshToken.accessToken;
    }
    
    return null;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return null;
  }
};

/**
 * Create Apollo Client with full link chain including automatic token refresh
 */
export const createApolloClient = (options?: {
  onUnauthenticated?: () => void;
  enableSubscriptions?: boolean;
}) => {
  const { onUnauthenticated, enableSubscriptions = true } = options || {};

  // Error handling link with automatic token refresh
  const errorLink = createErrorLink({
    logErrors: process.env.NODE_ENV === 'development',
    onRefreshToken: refreshTokenFunction,
    onUnauthenticated: () => {
      clearAccessToken();
      if (onUnauthenticated) {
        onUnauthenticated();
      }
    },
    onNetworkError: (error) => {
      console.error('[Network Error]:', error);
    },
    onGraphQLError: (error) => {
      console.error('[GraphQL Error]:', error.message);
    },
  });

  // Retry link
  const retryLink = createRetryLink({
    maxAttempts: 3,
  });

  // HTTP link
  const httpLink = createHttpLink({
    uri: GRAPHQL_HTTP_URL,
    credentials: 'include',
  });

  // Build the link chain
  let link: ApolloLink;

  if (isBrowser && enableSubscriptions) {
    // WebSocket link for subscriptions
    const wsLink = createSubscriptionLink({
      url: GRAPHQL_WS_URL,
      reconnect: true,
    });

    // Split between WebSocket and HTTP
    const splitLink = createSplitLink(wsLink, httpLink);

    // Full link chain with subscriptions
    link = ApolloLink.from([
      errorLink,
      retryLink,
      authLink,
      splitLink,
    ]);
  } else {
    // HTTP-only link chain (SSR or subscriptions disabled)
    link = ApolloLink.from([
      errorLink,
      retryLink,
      authLink,
      httpLink,
    ]);
  }

  // Create client
  const client = new ApolloClient({
    link,
    cache,
    ssrMode: !isBrowser,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true,
      },
      query: {
        fetchPolicy: 'cache-first',
      },
      mutate: {
        fetchPolicy: 'no-cache',
      },
    },
  });

  // Enable cache persistence on client-side
  if (isBrowser && persistCache) {
    persistCache({
      cache,
      storage: window.localStorage,
      key: 'apollo-cache-persist',
      maxSize: 1048576 * 10, // 10 MB
      debug: process.env.NODE_ENV === 'development',
    }).catch((error: Error) => {
      console.error('Cache persistence error:', error);
    });
  }

  return client;
};

/**
 * Get or create Apollo Client (singleton pattern)
 */
export const getApolloClient = (options?: {
  onUnauthenticated?: () => void;
  enableSubscriptions?: boolean;
}): any => {
  // SSR: always create a new client
  if (!isBrowser) {
    return createApolloClient(options);
  }

  // Client-side: reuse existing client
  if (!apolloClient) {
    apolloClient = createApolloClient(options);
  }

  return apolloClient;
};

/**
 * Reset Apollo Client (useful for logout)
 */
export const resetApolloClient = async () => {
  if (apolloClient) {
    await apolloClient.clearStore();
  }
};

/**
 * Export singleton instance
 */
export { apolloClient };
