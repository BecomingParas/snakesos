/**
 * List Rescues Query
 * Paginated list of rescue requests
 */

import { RescueRepository } from '@snake-rescue/database';
import { PaginationHelper, type PaginationInput } from '@snake-rescue/shared';
import { RescueStatus } from '@snake-rescue/database';

export interface ListRescuesFilters {
  status?: RescueStatus;
  municipality?: string;
  volunteerId?: string;
}

export class ListRescuesQuery {
  constructor(
    private readonly rescueRepository: RescueRepository
  ) {}

  async execute(filters: ListRescuesFilters = {}, pagination?: PaginationInput) {
    const { page, limit, skip } = PaginationHelper.normalizePagination(pagination);

    // Build where clause
    const where: any = {};
    if (filters.status) where.status = filters.status;
    if (filters.municipality) where.municipality = filters.municipality;
    if (filters.volunteerId) where.assignedTo = filters.volunteerId;

    // Get rescues
    const [rescues, total] = await Promise.all([
      this.rescueRepository.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: true,
          assignedVolunteer: {
            include: {
              user: true,
            },
          },
          species: true,
        },
      }),
      this.rescueRepository.count(where),
    ]);

    // Build Relay-style connection response
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      edges: rescues.map((rescue) => ({
        node: rescue,
        cursor: rescue.id,
      })),
      pageInfo: {
        hasNextPage,
        hasPreviousPage,
        startCursor: rescues[0]?.id || null,
        endCursor: rescues[rescues.length - 1]?.id || null,
      },
      totalCount: total,
    };
  }
}
