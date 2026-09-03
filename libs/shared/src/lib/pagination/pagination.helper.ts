/**
 * Pagination Helper Functions
 */

import type { PaginationInput, PaginatedResponse } from './pagination.dto';

export class PaginationHelper {
  static readonly DEFAULT_PAGE = 1;
  static readonly DEFAULT_LIMIT = 10;
  static readonly MAX_LIMIT = 100;

  /**
   * Normalize pagination input
   */
  static normalizePagination(input?: PaginationInput) {
    const page = Math.max(1, input?.page || this.DEFAULT_PAGE);
    const limit = Math.min(
      this.MAX_LIMIT,
      Math.max(1, input?.limit || this.DEFAULT_LIMIT)
    );
    const skip = (page - 1) * limit;
    const sortBy = input?.sortBy || 'createdAt';
    const sortOrder = input?.sortOrder || 'desc';

    return { page, limit, skip, sortBy, sortOrder };
  }

  /**
   * Build paginated response
   */
  static buildPaginatedResponse<T>(
    data: T[],
    total: number,
    page: number,
    limit: number
  ): PaginatedResponse<T> {
    const totalPages = Math.ceil(total / limit);
    
    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  /**
   * Calculate Prisma skip/take for pagination
   */
  static getPrismaParams(page: number, limit: number) {
    return {
      skip: (page - 1) * limit,
      take: limit,
    };
  }
}
