// ===================================================================
// SHARED GRAPHQL - EXPORT ALL SHARED TYPES
// ===================================================================

import { scalarsTypeDefs } from './scalars/index';
import { directivesTypeDefs } from './directives/index';
import { paginationTypeDefs } from './pagination/index';
import { errorsTypeDefs } from './errors/index';
import { responsesTypeDefs } from './responses/index';

export { scalarsTypeDefs, directivesTypeDefs, paginationTypeDefs, errorsTypeDefs, responsesTypeDefs };

// Combine all shared type definitions
export const sharedTypeDefs = [
  scalarsTypeDefs,
  directivesTypeDefs,
  paginationTypeDefs,
  errorsTypeDefs,
  responsesTypeDefs,
].join('\n\n');
