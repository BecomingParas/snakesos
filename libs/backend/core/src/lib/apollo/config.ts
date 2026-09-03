/**
 * Apollo Server Configuration
 */

import type { ApolloServerOptions } from '@apollo/server';
import type { GraphQLContext } from '../context/index';
import { loggingPlugin } from '../plugins/logging.plugin';
import { errorPlugin } from '../plugins/error.plugin';
import { formatError } from './error-formatter';

export function createApolloConfig(schema: any): ApolloServerOptions<GraphQLContext> {
  const isDevelopment = process.env.NODE_ENV !== 'production';

  return {
    schema,
    
    // Plugins
    plugins: [
      loggingPlugin,
      errorPlugin,
    ],

    // Error formatting
    formatError,

    // Introspection (only in development)
    introspection: isDevelopment,

    // Include stack trace in errors (only in development)
    includeStacktraceInErrorResponses: isDevelopment,

    // Performance
    cache: 'bounded',
    
    // Allow batched queries
    allowBatchedHttpRequests: true,
  };
}
