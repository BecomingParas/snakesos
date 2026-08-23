/**
 * Rescue DataLoader
 * Batches and caches rescue request queries
 */

import DataLoader from 'dataloader';
import type { PrismaClient, RescueRequest } from '@snake-rescue/database';

export function createRescueLoader(prisma: PrismaClient) {
  return new DataLoader<string, RescueRequest | null>(
    async (rescueIds: readonly string[]) => {
      const rescues = await prisma.rescueRequest.findMany({
        where: {
          id: {
            in: [...rescueIds],
          },
        },
        include: {
          user: true,
          assignedVolunteer: {
            include: { user: true },
          },
          species: true,
        },
      });

      const rescueMap = new Map(rescues.map((rescue) => [rescue.id, rescue]));

      return rescueIds.map((id) => rescueMap.get(id) || null);
    },
    {
      cache: true,
    }
  );
}
