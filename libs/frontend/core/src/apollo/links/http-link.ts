/**
 * HTTP Link - Handles standard HTTP queries and mutations
 */
import { HttpLink } from '@apollo/client';

export interface HttpLinkOptions {
  uri: string;
  credentials?: RequestCredentials;
  headers?: Record<string, string>;
  useGETForQueries?: boolean;
}

export const createHttpLink = (options: HttpLinkOptions) => {
  return new HttpLink({
    uri: options.uri,
    credentials: options.credentials || 'same-origin',
    headers: options.headers || {},
    fetchOptions: {
      mode: 'cors',
    },
    useGETForQueries: options.useGETForQueries || false,
  });
};
