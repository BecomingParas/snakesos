/**
 * User DataLoader
 * Batches and caches user queries to prevent N+1 problems
 */

import DataLoader from 'dataloader';
import type { PrismaClient, User } from '@snake-rescue/database';

export function createUserLoader(prisma: PrismaClient) {
  return new DataLoader<string, User | null>(
    async (userIds: readonly string[]) => {
      // Batch fetch all users in one query
      const users = await prisma.user.findMany({
        where: {
          id: {
            in: [...userIds],
          },
        },
      });

      // Create a map for O(1) lookup
      const userMap = new Map(users.map((user) => [user.id, user]));

      // Return users in the same order as requested IDs
      return userIds.map((id) => userMap.get(id) || null);
    },
    {
      // Cache results for the duration of the request
      cache: true,
    }
  );
}
