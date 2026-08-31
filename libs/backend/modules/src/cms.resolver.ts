import { prisma } from '@snake-rescue/database';
import type { GraphQLContext } from '@snake-rescue/core';

const ADMIN_ROLES = ['ADMIN', 'SUPER_ADMIN'];

function connection(
  items: any[],
  totalCount: number,
  page: number,
  limit: number,
) {
  return {
    edges: items.map((node, index) => ({
      node,
      cursor: String((page - 1) * limit + index + 1),
    })),
    pageInfo: {
      hasNextPage: page * limit < totalCount,
      hasPreviousPage: page > 1,
      startCursor: items.length ? String((page - 1) * limit + 1) : null,
      endCursor: items.length
        ? String((page - 1) * limit + items.length)
        : null,
    },
    totalCount,
  };
}

function publicWhere(
  filter?: { category?: string; search?: string },
  includeDrafts = false,
) {
  const search = filter?.search?.trim();
  return {
    ...(includeDrafts ? {} : { isPublic: true }),
    deletedAt: null,
    ...(filter?.category ? { category: filter.category } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' as const } },
            { description: { contains: search, mode: 'insensitive' as const } },
            { category: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  } as any;
}

export const cmsResolvers = {
  Query: {
    galleryImages: async (
      _parent: unknown,
      args: {
        pagination?: { page?: number; limit?: number };
        filter?: { category?: string; search?: string; isPublic?: boolean };
      },
      context: GraphQLContext,
    ) => {
      const includeDrafts = Boolean(
        context.user && ADMIN_ROLES.includes(context.user.role),
      );
      const page = Math.max(args.pagination?.page || 1, 1);
      const limit = Math.min(Math.max(args.pagination?.limit || 20, 1), 100);
      const where = {
        ...publicWhere(args.filter, includeDrafts),
        ...(includeDrafts && typeof args.filter?.isPublic === 'boolean'
          ? { isPublic: args.filter.isPublic }
          : {}),
      };
      const [items, totalCount] = await Promise.all([
        prisma.galleryImage.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.galleryImage.count({ where }),
      ]);
      return connection(items, totalCount, page, limit);
    },

    featuredGalleryImages: async (
      _parent: unknown,
      args: { pagination?: { page?: number; limit?: number } },
    ) => {
      const page = Math.max(args.pagination?.page || 1, 1);
      const limit = Math.min(Math.max(args.pagination?.limit || 20, 1), 100);
      const where = { ...publicWhere(), isFeatured: true };
      const [items, totalCount] = await Promise.all([
        prisma.galleryImage.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.galleryImage.count({ where }),
      ]);
      return connection(items, totalCount, page, limit);
    },

    galleryImage: async (_parent: unknown, args: { id: string }) =>
      prisma.galleryImage.findFirst({
        where: { id: args.id, isPublic: true, deletedAt: null },
      }),
  },

  Mutation: {
    uploadGalleryImage: async (
      _parent: unknown,
      args: { input: Record<string, unknown> },
      context: GraphQLContext,
    ) => {
      context.requireAuth();
      context.requireRole(ADMIN_ROLES);
      return prisma.galleryImage.create({
        data: {
          title: args.input.title ? String(args.input.title) : null,
          description: args.input.description
            ? String(args.input.description)
            : null,
          imageUrl: args.input.imageUrl ? String(args.input.imageUrl) : null,
          videoUrl: args.input.videoUrl ? String(args.input.videoUrl) : null,
          thumbnailUrl: args.input.thumbnailUrl
            ? String(args.input.thumbnailUrl)
            : null,
          category: args.input.category ? String(args.input.category) : null,
          tags: Array.isArray(args.input.tags)
            ? args.input.tags.map(String)
            : [],
          rescueId: args.input.rescueId ? String(args.input.rescueId) : null,
          speciesId: args.input.speciesId ? String(args.input.speciesId) : null,
          uploadedBy: context.user.id,
          isPublic: false,
          isFeatured: false,
        } as any,
      });
    },

    updateGalleryImage: async (
      _parent: unknown,
      args: { id: string; input: Record<string, unknown> },
      context: GraphQLContext,
    ) => {
      context.requireAuth();
      context.requireRole(ADMIN_ROLES);
      const input = args.input;
      return prisma.galleryImage.update({
        where: { id: args.id },
        data: {
          ...(input.title !== undefined
            ? { title: input.title ? String(input.title) : null }
            : {}),
          ...(input.description !== undefined
            ? {
                description: input.description
                  ? String(input.description)
                  : null,
              }
            : {}),
          ...(input.imageUrl !== undefined
            ? { imageUrl: input.imageUrl ? String(input.imageUrl) : null }
            : {}),
          ...(input.videoUrl !== undefined
            ? { videoUrl: input.videoUrl ? String(input.videoUrl) : null }
            : {}),
          ...(input.category !== undefined
            ? { category: input.category ? String(input.category) : null }
            : {}),
          ...(input.tags !== undefined
            ? { tags: Array.isArray(input.tags) ? input.tags.map(String) : [] }
            : {}),
          ...(input.isPublic !== undefined
            ? { isPublic: Boolean(input.isPublic) }
            : {}),
          ...(input.isFeatured !== undefined
            ? { isFeatured: Boolean(input.isFeatured) }
            : {}),
        } as any,
      });
    },

    deleteGalleryImage: async (
      _parent: unknown,
      args: { id: string },
      context: GraphQLContext,
    ) => {
      context.requireAuth();
      context.requireRole(ADMIN_ROLES);
      await prisma.galleryImage.update({
        where: { id: args.id },
        data: { deletedAt: new Date(), isPublic: false },
      });
      return { success: true, message: 'Gallery image deleted' };
    },
  },
};
