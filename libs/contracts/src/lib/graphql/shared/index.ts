// ===================================================================
// SHARED GRAPHQL - EXPORT ALL SHARED TYPES
// ===================================================================

import { scalarsTypeDefs } from './scalars/index.js';
import { directivesTypeDefs } from './directives/index.js';
import { paginationTypeDefs } from './pagination/index.js';
import { errorsTypeDefs } from './errors/index.js';
import { responsesTypeDefs } from './responses/index.js';

export { scalarsTypeDefs, directivesTypeDefs, paginationTypeDefs, errorsTypeDefs, responsesTypeDefs };

// Combine all shared type definitions
export const sharedTypeDefs = [
  scalarsTypeDefs,
  directivesTypeDefs,
  paginationTypeDefs,
  errorsTypeDefs,
  responsesTypeDefs,
].join('\n\n');
