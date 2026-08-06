/**
 * Upload Link - Enables file uploads via GraphQL
 */
// import { createUploadLink } from 'apollo-upload-client';
import { HttpLink } from '@apollo/client';

export interface UploadLinkOptions {
  uri: string;
  credentials?: RequestCredentials;
  headers?: Record<string, string>;
}

export const createCustomUploadLink = (options: UploadLinkOptions) => {
  // Temporarily using HttpLink until apollo-upload-client types are fixed
  return new HttpLink({
    uri: options.uri,
    credentials: options.credentials || 'same-origin',
    headers: options.headers || {},
  });
};
