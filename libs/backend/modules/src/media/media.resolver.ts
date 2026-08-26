import { prisma } from '@snake-rescue/database';
import type { GraphQLContext } from '@snake-rescue/core';
import {
  createCloudinaryResource,
  createMediaUploadSignature,
  createProfileMediaUrl,
  createSecureMediaUrl,
  type MediaType,
} from './media.service.js';

function requireRescuer(context: GraphQLContext) {
  context.requireAuth();
  context.requireRole(['VOLUNTEER', 'VERIFIED_RESCUER']);
  return context.user;
}

export const mediaResolvers = {
  Query: {
    getSecureMediaUrl: async (
      _parent: unknown,
      args: { mediaId: string },
      context: GraphQLContext,
    ) => {
      context.requireAuth();
      const asset = await prisma.mediaAsset.findUnique({
        where: { id: args.mediaId },
      });
      if (
        !asset ||
        (asset.ownerId !== context.user.id &&
          !context.hasRole('ADMIN') &&
          !context.hasRole('SUPER_ADMIN'))
      ) {
        throw new Error('MEDIA_ACCESS_DENIED');
      }
      return createSecureMediaUrl(
        asset.publicId,
        asset.resourceType,
        asset.mediaType,
      );
    },
  },
  Mutation: {
    createMediaUploadSignature: async (
      _parent: unknown,
      args: {
        input: {
          mediaType: MediaType;
          fileName: string;
          mimeType: string;
          sizeBytes: number;
        };
      },
      context: GraphQLContext,
    ) => {
      const user = requireRescuer(context);
      const signature = createMediaUploadSignature({
        userId: user.id,
        ...args.input,
      });
      const cloudinaryPublicId = `${signature.folder}/${signature.publicId}`;
      const asset = await prisma.mediaAsset.create({
        data: {
          ownerId: user.id,
          mediaType: args.input.mediaType,
          publicId: cloudinaryPublicId,
          resourceType: signature.resourceType,
          originalFileName: args.input.fileName,
          mimeType: args.input.mimeType,
          sizeBytes: BigInt(args.input.sizeBytes),
        },
      });
      return { mediaId: asset.id, ...signature };
    },
    confirmMediaUpload: async (
      _parent: unknown,
      args: { mediaId: string },
      context: GraphQLContext,
    ) => {
      const user = requireRescuer(context);
      const asset = await prisma.mediaAsset.findUnique({
        where: { id: args.mediaId },
      });
      if (!asset || asset.ownerId !== user.id)
        throw new Error('MEDIA_UPLOAD_NOT_FOUND');
      if (asset.status === 'UPLOADED' || asset.status === 'VERIFIED') {
        return {
          ...asset,
          sizeBytes: asset.sizeBytes ? Number(asset.sizeBytes) : null,
        };
      }
      const resource = await createCloudinaryResource(
        asset.publicId,
        asset.resourceType,
      );
      const updated = await prisma.mediaAsset.update({
        where: { id: asset.id },
        data: {
          status: 'UPLOADED',
          format: resource.format,
          width: resource.width,
          height: resource.height,
          sizeBytes: resource.bytes ? BigInt(resource.bytes) : asset.sizeBytes,
        },
      });
      if (asset.mediaType === 'RESCUER_PROFILE_IMAGE') {
        await prisma.mediaAsset.updateMany({
          where: {
            ownerId: user.id,
            mediaType: 'RESCUER_PROFILE_IMAGE',
            id: { not: asset.id },
            status: { in: ['PENDING', 'UPLOADED', 'VERIFIED'] },
          },
          data: { status: 'DELETED' },
        });
        await prisma.user.update({
          where: { id: user.id },
          data: { avatar: createProfileMediaUrl(asset.publicId) },
        });
      }
      return {
        ...updated,
        sizeBytes: updated.sizeBytes ? Number(updated.sizeBytes) : null,
      };
    },
  },
};
