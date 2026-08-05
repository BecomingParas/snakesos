/**
 * Error Handling Plugin
 * Provides detailed error reporting and monitoring
 */

import type { ApolloServerPlugin, BaseContext } from '@apollo/server';
import { logger } from '@snake-rescue/shared';

export const errorPlugin: ApolloServerPlugin<BaseContext> = {
  async requestDidStart() {
    return {
      async didEncounterErrors(requestContext) {
        // Log each error
        for (const error of requestContext.errors) {
          // Get operation details
          const operationName = requestContext.request.operationName || 'Anonymous';
          const operation = requestContext.operation?.operation || 'unknown';
          
          // Log error with context
          logger.error({
            msg: 'GraphQL Error',
            operationName,
            operation,
            error: {
              message: error.message,
              path: error.path,
              extensions: error.extensions,
            },
            variables: requestContext.request.variables,
          });

          // TODO: Send to error tracking service (e.g., Sentry)
          // if (process.env.SENTRY_DSN) {
          //   Sentry.captureException(error);
          // }
        }
      },
    };
  },
};
