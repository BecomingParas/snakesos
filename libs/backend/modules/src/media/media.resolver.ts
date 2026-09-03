import { prisma } from '@snake-rescue/database';
import type { GraphQLContext } from '@snake-rescue/core';
import {
  createCloudinaryResource,
  createMediaUploadSignature,
  createProfileMediaUrl,
  createSecureMediaUrl,
  type MediaType,
} from './media.service';

function requireMediaOwner(context: GraphQLContext) {
  context.requireAuth();
  context.requireRole([
    'CITIZEN',
    'VOLUNTEER',
    'VERIFIED_RESCUER',
    'ADMIN',
    'SUPER_ADMIN',
  ]);
  return context.user;
}

export const mediaResolvers = {
  MediaAsset: {
    secureUrl: async (parent: {
      id: string;
      ownerId: string;
      publicId: string;
      resourceType: string;
      mediaType: MediaType;
    }, _args: unknown, context: GraphQLContext) => {
      context.requireAuth();
      if (
        parent.ownerId !== context.user.id &&
        !context.hasRole('ADMIN') &&
        !context.hasRole('SUPER_ADMIN') &&
        !context.hasRole('DISTRICT_COORDINATOR')
      ) {
        throw new Error('MEDIA_ACCESS_DENIED');
      }
      return createSecureMediaUrl(
        parent.publicId,
        parent.resourceType,
        parent.mediaType,
      );
    },
  },
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
          mediaType: MediaType | string;
          fileName: string;
          mimeType: string;
          sizeBytes: number;
        };
      },
      context: GraphQLContext,
    ) => {
      const mediaType = args.input.mediaType as MediaType;
      
      // Allow public uploads for gallery images (e.g., snake identification)
      const user = mediaType === 'GALLERY_IMAGE' ? null : context.user;
      
      // Require auth for user profile and document uploads
      if (!user && mediaType !== 'GALLERY_IMAGE') {
        context.requireAuth();
      }
      
      const signature = createMediaUploadSignature({
        userId: user?.id ?? 'public',
        mediaType,
        fileName: args.input.fileName,
        mimeType: args.input.mimeType,
        sizeBytes: args.input.sizeBytes,
      });
      const cloudinaryPublicId = `${signature.folder}/${signature.publicId}`;
      
      // Only create mediaAsset for authenticated uploads
      let assetId = '';
      if (user) {
        const asset = await prisma.mediaAsset.create({
          data: {
            ownerId: user.id,
            mediaType: mediaType as any,
            publicId: cloudinaryPublicId,
            resourceType: signature.resourceType,
            originalFileName: args.input.fileName,
            mimeType: args.input.mimeType,
            sizeBytes: BigInt(args.input.sizeBytes),
          },
        });
        assetId = asset.id;
      } else {
        // For public uploads, generate a temporary mediaId (we won't track these)
        assetId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      }
      
      return { mediaId: assetId, ...signature };
    },
    confirmMediaUpload: async (
      _parent: unknown,
      args: { mediaId: string },
      context: GraphQLContext,
    ) => {
      // For temporary public upload IDs (gallery/identify), skip DB lookup entirely.
      // These IDs are generated for unauthenticated uploads and are not stored in the database.
      if (args.mediaId.startsWith('temp-')) {
        return {
          id: args.mediaId,
          status: 'VERIFIED',
          mediaType: 'GALLERY_IMAGE',
          publicId: '',
          format: null,
          width: null,
          height: null,
        };
      }

      const asset = await prisma.mediaAsset.findUnique({
        where: { id: args.mediaId },
      });
      
      if (!asset) {
        throw new Error('MEDIA_UPLOAD_NOT_FOUND');
      }
      
      if (asset.mediaType !== 'GALLERY_IMAGE') {
        const user = context.user;
        if (!user || asset.ownerId !== user.id)
          throw new Error('MEDIA_UPLOAD_NOT_FOUND');
      }
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
      if (
        asset.mediaType === 'RESCUER_PROFILE_IMAGE' ||
        asset.mediaType === 'CITIZEN_PROFILE_IMAGE' ||
        asset.mediaType === 'ADMIN_PROFILE_IMAGE'
      ) {
        // Profile images require authentication
        const user = context.user;
        if (!user) {
          throw new Error('AUTHENTICATION_REQUIRED');
        }
        
        await prisma.mediaAsset.updateMany({
          where: {
            ownerId: user.id,
            mediaType: {
              in: [
                'RESCUER_PROFILE_IMAGE',
                'CITIZEN_PROFILE_IMAGE',
                'ADMIN_PROFILE_IMAGE',
              ],
            },
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
