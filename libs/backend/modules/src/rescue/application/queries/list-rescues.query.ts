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
    if (filters.volunteerId) where.volunteerId = filters.volunteerId;

    // Get rescues
    const [rescues, total] = await Promise.all([
      this.rescueRepository.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          reporter: true,
          volunteer: true,
        },
      }),
      this.rescueRepository.count(where),
    ]);

    return PaginationHelper.buildPaginatedResponse(rescues, total, page, limit);
  }
}
