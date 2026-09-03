import { Prisma, RescueRepository } from '@snake-rescue/database';
import { PaginationHelper, type PaginationInput } from '@snake-rescue/shared';

export interface ListPublicRescuesFilters {
  status?: 'OPEN' | 'RESPONDER_ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED';
  priority?: string;
  municipality?: string;
  district?: string;
  speciesId?: string;
  venomStatus?: 'VENOMOUS' | 'NON_VENOMOUS' | 'UNKNOWN';
  unassigned?: boolean;
}

const PUBLIC_RETENTION_DAYS = Number(
  process.env.PUBLIC_RESCUE_RETENTION_DAYS || 30,
);

function publicStatus(status: string) {
  if (status === 'PENDING') return 'OPEN';
  if (status === 'ASSIGNED' || status === 'ACCEPTED') {
    return 'RESPONDER_ASSIGNED';
  }
  if (status === 'IN_PROGRESS') return 'IN_PROGRESS';
  return 'COMPLETED';
}

function publicReference(id: string, referenceNumber: string | null) {
  return (
    referenceNumber ||
    `BR-${new Date().getFullYear()}-${id.replace(/-/g, '').slice(0, 8).toUpperCase()}`
  );
}

export class ListPublicRescuesQuery {
  constructor(private readonly rescueRepository: RescueRepository) {}

  async execute(
    filters: ListPublicRescuesFilters = {},
    pagination?: PaginationInput,
  ) {
    const { page, limit, skip } =
      PaginationHelper.normalizePagination(pagination);
    const completedAfter = new Date(
      Date.now() - PUBLIC_RETENTION_DAYS * 24 * 60 * 60 * 1000,
    );
    const where: Prisma.RescueRequestWhereInput = {
      deletedAt: null,
      OR: [
        { status: { in: ['PENDING', 'ASSIGNED', 'ACCEPTED', 'IN_PROGRESS'] } },
        { status: 'COMPLETED', completedAt: { gte: completedAfter } },
      ],
    };

    if (filters.status) {
      const statuses = {
        OPEN: ['PENDING'],
        RESPONDER_ASSIGNED: ['ASSIGNED', 'ACCEPTED'],
        IN_PROGRESS: ['IN_PROGRESS'],
        COMPLETED: ['COMPLETED'],
      }[filters.status];
      where.status = { in: statuses as never[] };
    }
    if (filters.priority) where.priority = filters.priority as never;
    if (filters.municipality)
      where.municipality = {
        contains: filters.municipality,
        mode: 'insensitive',
      };
    if (filters.district)
      where.municipality = { contains: filters.district, mode: 'insensitive' };
    if (filters.speciesId) where.speciesId = filters.speciesId;
    if (filters.unassigned) where.assignedTo = null;
    if (filters.venomStatus === 'VENOMOUS') where.species = { venomous: true };
    if (filters.venomStatus === 'NON_VENOMOUS')
      where.species = { venomous: false };

    const [rescues, total] = await Promise.all([
      this.rescueRepository.findPublicMany({
        where: where as any,
        skip,
        take: limit,
      }),
      this.rescueRepository.count(where as any),
    ]);

    return {
      edges: rescues.map((rescue: any) => ({
        cursor: rescue.id,
        node: {
          id: rescue.id,
          referenceNumber: publicReference(rescue.id, rescue.referenceNumber),
          municipality: rescue.municipality,
          district: rescue.municipality,
          generalArea: rescue.ward ? `Ward ${rescue.ward}` : null,
          species: rescue.species,
          venomStatus:
            rescue.species?.venomous === true
              ? 'VENOMOUS'
              : rescue.species?.venomous === false
                ? 'NON_VENOMOUS'
                : 'UNKNOWN',
          priority: rescue.priority,
          publicStatus: publicStatus(rescue.status),
          approximateLatitude:
            rescue.lat == null ? null : Math.round(rescue.lat * 100) / 100,
          approximateLongitude:
            rescue.lng == null ? null : Math.round(rescue.lng * 100) / 100,
          assignedRescuerName: rescue.assignedVolunteer?.user?.name || null,
          createdAt: rescue.createdAt,
        },
      })),
      pageInfo: {
        hasNextPage: skip + limit < total,
        hasPreviousPage: page > 1,
        startCursor: rescues[0]?.id || null,
        endCursor: rescues.at(-1)?.id || null,
      },
      totalCount: total,
    };
  }
}
