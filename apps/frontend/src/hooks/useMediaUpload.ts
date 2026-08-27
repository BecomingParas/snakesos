'use client';

import { useState } from 'react';
import { useMutation } from '@/lib/apollo/hooks';
import {
  CONFIRM_MEDIA_UPLOAD,
  CREATE_MEDIA_UPLOAD_SIGNATURE,
} from '@/lib/graphql/media';

type MediaType =
  | 'RESCUER_PROFILE_IMAGE'
  | 'CITIZEN_PROFILE_IMAGE'
  | 'ADMIN_PROFILE_IMAGE'
  | 'RESCUER_VERIFICATION_DOCUMENT';

type UploadSignature = {
  mediaId: string;
  cloudName: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  folder: string;
  publicId: string;
  uploadUrl: string;
  resourceType: string;
};

export function useMediaUpload() {
  const [createSignature] = useMutation<{
    createMediaUploadSignature: UploadSignature;
  }>(CREATE_MEDIA_UPLOAD_SIGNATURE);
  const [confirmUpload] = useMutation<{
    confirmMediaUpload: { id: string; status: string; publicId: string };
  }>(CONFIRM_MEDIA_UPLOAD);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [media, setMedia] = useState<{
    id: string;
    status: string;
    publicId: string;
  } | null>(null);

  const upload = async (file: File, mediaType: MediaType) => {
    setIsUploading(true);
    setProgress(0);
    setError(null);
    try {
      const { data } = await createSignature({
        variables: {
          input: {
            mediaType,
            fileName: file.name,
            mimeType: file.type,
            sizeBytes: file.size,
          },
        },
      });
      if (!data) throw new Error('Unable to create upload signature');
      const signature = data.createMediaUploadSignature;
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', signature.apiKey);
      formData.append('timestamp', String(signature.timestamp));
      formData.append('signature', signature.signature);
      formData.append('folder', signature.folder);
      formData.append('public_id', signature.publicId);
      const uploaded = await new Promise<{
        public_id: string;
        secure_url?: string;
      }>((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open('POST', signature.uploadUrl);
        request.upload.onprogress = (event) => {
          if (event.lengthComputable)
            setProgress(Math.round((event.loaded / event.total) * 100));
        };
        request.onload = () =>
          request.status >= 200 && request.status < 300
            ? resolve(JSON.parse(request.responseText))
            : (() => {
                let message = 'Cloudinary upload failed';
                try {
                  const response = JSON.parse(request.responseText) as {
                    error?: { message?: string };
                  };
                  message = response.error?.message || message;
                } catch {
                  // Keep the generic message when Cloudinary does not return JSON.
                }
                reject(new Error(message));
              })();
        request.onerror = () => reject(new Error('Cloudinary upload failed'));
        request.send(formData);
      });
      const confirmed = await confirmUpload({
        variables: { mediaId: signature.mediaId },
      });
      if (!confirmed.data) throw new Error('Unable to confirm media upload');
      const result = {
        ...confirmed.data.confirmMediaUpload,
        publicId: uploaded.public_id,
        secureUrl: uploaded.secure_url,
      };
      setMedia(result);
      setProgress(100);
      return result;
    } catch (uploadError) {
      const message =
        uploadError instanceof Error
          ? uploadError.message
          : 'Media upload failed';
      setError(message);
      throw uploadError;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    upload,
    progress,
    isUploading,
    error,
    media,
    reset: () => {
      setProgress(0);
      setError(null);
      setMedia(null);
    },
  };
}
