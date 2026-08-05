/**
 * Logging Plugin
 * Logs GraphQL operations for monitoring and debugging
 */

import type { ApolloServerPlugin, BaseContext } from '@apollo/server';
import { logger } from '@snake-rescue/shared';

export const loggingPlugin: ApolloServerPlugin<BaseContext> = {
  async requestDidStart(requestContext) {
    const start = Date.now();
    const operationName = requestContext.request.operationName || 'Anonymous';

    logger.debug({
      msg: 'GraphQL request started',
      operationName,
      variables: requestContext.request.variables,
    });

    return {
      async willSendResponse(responseContext) {
        const duration = Date.now() - start;
        
        logger.info({
          msg: 'GraphQL request completed',
          operationName,
          duration: `${duration}ms`,
          errors: responseContext.errors?.length || 0,
        });
      },

      async didEncounterErrors(errorContext) {
        logger.error({
          msg: 'GraphQL request encountered errors',
          operationName,
          errors: errorContext.errors.map((err) => ({
            message: err.message,
            path: err.path,
          })),
        });
      },
    };
  },
};
