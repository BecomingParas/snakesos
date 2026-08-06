/**
 * WebSocket Link - Handles GraphQL subscriptions over WebSocket
 */
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getAccessToken } from './auth-link';

export interface SubscriptionLinkOptions {
  url: string;
  reconnect?: boolean;
  connectionParams?: () => Record<string, any> | Promise<Record<string, any>>;
}

export const createSubscriptionLink = (options: SubscriptionLinkOptions) => {
  const { url, reconnect = true, connectionParams } = options;

  const wsClient = createClient({
    url,
    connectionParams: connectionParams || (() => {
      const token = getAccessToken();
      return token ? { authorization: `Bearer ${token}` } : {};
    }),
    shouldRetry: () => reconnect,
    retryAttempts: 5,
    retryWait: (retries) => {
      // Exponential backoff: 1s, 2s, 4s, 8s, 16s
      return new Promise((resolve) => {
        setTimeout(resolve, Math.min(1000 * Math.pow(2, retries), 16000));
      });
    },
    lazy: true, // Lazy connection - only connect when subscription is used
    lazyCloseTimeout: 30000, // Close after 30s of inactivity
    keepAlive: 10000, // Send ping every 10s
    on: {
      connected: () => console.log('WebSocket connected'),
      closed: () => console.log('WebSocket closed'),
      error: (error) => console.error('WebSocket error:', error),
    },
  });

  return new GraphQLWsLink(wsClient);
};

// Utility to close WebSocket connection
export const closeWebSocket = (link: GraphQLWsLink) => {
  if (link) {
    link.client.dispose();
  }
};
