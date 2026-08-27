import { v2 as cloudinary } from 'cloudinary';
import { randomUUID } from 'node:crypto';

export type MediaType =
  | 'RESCUER_PROFILE_IMAGE'
  | 'CITIZEN_PROFILE_IMAGE'
  | 'ADMIN_PROFILE_IMAGE'
  | 'RESCUER_VERIFICATION_DOCUMENT';

const isProfileImage = (mediaType: MediaType) =>
  mediaType === 'RESCUER_PROFILE_IMAGE' ||
  mediaType === 'CITIZEN_PROFILE_IMAGE' ||
  mediaType === 'ADMIN_PROFILE_IMAGE';

const mimeTypes: Record<MediaType, string[]> = {
  RESCUER_PROFILE_IMAGE: ['image/jpeg', 'image/png', 'image/webp'],
  CITIZEN_PROFILE_IMAGE: ['image/jpeg', 'image/png', 'image/webp'],
  ADMIN_PROFILE_IMAGE: ['image/jpeg', 'image/png', 'image/webp'],
  RESCUER_VERIFICATION_DOCUMENT: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
  ],
};

const maxSizes: Record<MediaType, number> = {
  RESCUER_PROFILE_IMAGE: 5 * 1024 * 1024,
  CITIZEN_PROFILE_IMAGE: 5 * 1024 * 1024,
  ADMIN_PROFILE_IMAGE: 5 * 1024 * 1024,
  RESCUER_VERIFICATION_DOCUMENT: 10 * 1024 * 1024,
};

function configureCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary media storage is not configured');
  }
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
  return { cloudName, apiKey, apiSecret };
}

export function validateMediaInput(
  mediaType: MediaType,
  mimeType: string,
  sizeBytes: number,
) {
  if (!mimeTypes[mediaType]?.includes(mimeType)) {
    throw new Error('MEDIA_MIME_TYPE_NOT_ALLOWED');
  }
  if (
    !Number.isInteger(sizeBytes) ||
    sizeBytes <= 0 ||
    sizeBytes > maxSizes[mediaType]
  ) {
    throw new Error('MEDIA_FILE_TOO_LARGE');
  }
}

export function createMediaUploadSignature(input: {
  userId: string;
  mediaType: MediaType;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
}) {
  validateMediaInput(input.mediaType, input.mimeType, input.sizeBytes);
  const { cloudName, apiKey, apiSecret } = configureCloudinary();
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = isProfileImage(input.mediaType)
    ? `snakesos/users/${input.userId}/rescuer/profile`
    : `snakesos/users/${input.userId}/rescuer/verification`;
  const publicId = `${isProfileImage(input.mediaType) ? 'profile' : 'verification'}/${randomUUID()}`;
  const resourceType =
    input.mediaType === 'RESCUER_VERIFICATION_DOCUMENT' &&
    input.mimeType === 'application/pdf'
      ? 'raw'
      : 'image';
  const signature = cloudinary.utils.api_sign_request(
    { folder, public_id: publicId, timestamp },
    apiSecret,
  );
  return {
    cloudName,
    apiKey,
    timestamp,
    signature,
    folder,
    publicId,
    resourceType,
    uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
  };
}

export async function getCloudinaryResource(
  publicId: string,
  resourceType: string,
) {
  configureCloudinary();
  return cloudinary.api.resource(publicId, {
    resource_type: resourceType,
    type: 'upload',
  });
}

export function createSecureMediaUrl(
  publicId: string,
  resourceType: string,
  mediaType: MediaType,
) {
  configureCloudinary();
  return cloudinary.url(publicId, {
    secure: true,
    resource_type: resourceType,
    type: 'authenticated',
    sign_url: true,
    expires_at: Math.floor(Date.now() / 1000) + 300,
    transformation: isProfileImage(mediaType)
      ? [
          {
            width: 512,
            height: 512,
            crop: 'fill',
            gravity: 'face',
            quality: 'auto',
            fetch_format: 'auto',
          },
        ]
      : undefined,
  });
}

export function createProfileMediaUrl(publicId: string) {
  const { cloudName } = configureCloudinary();
  return `https://res.cloudinary.com/${cloudName}/image/upload/c_fill,g_face,h_512,w_512,q_auto,f_auto/${publicId}`;
}
