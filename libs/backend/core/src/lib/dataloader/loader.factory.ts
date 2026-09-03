/**
 * DataLoader Factory
 * Creates all DataLoaders for a GraphQL request
 */

import type { PrismaClient } from '@snake-rescue/database';
import { createUserLoader } from './loaders/user.loader';
import { createRescueLoader } from './loaders/rescue.loader';

export interface DataLoaders {
  userLoader: ReturnType<typeof createUserLoader>;
  rescueLoader: ReturnType<typeof createRescueLoader>;
}

/**
 * Create all DataLoaders for a single request
 * Each request gets fresh DataLoaders to prevent cache issues
 */
export function createDataLoaders(prisma: PrismaClient): DataLoaders {
  return {
    userLoader: createUserLoader(prisma),
    rescueLoader: createRescueLoader(prisma),
  };
}
