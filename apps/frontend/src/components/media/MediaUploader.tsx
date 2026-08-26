'use client';

import { useRef } from 'react';
import { Loader2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMediaUpload } from '@/hooks/useMediaUpload';

type MediaType = 'RESCUER_PROFILE_IMAGE' | 'RESCUER_VERIFICATION_DOCUMENT';

export function MediaUploader({
  mediaType,
  accept,
  label,
  disabled = false,
  onUploaded,
}: {
  mediaType: MediaType;
  accept: string;
  label: string;
  disabled?: boolean;
  onUploaded?: (media: {
    id: string;
    status: string;
    secureUrl?: string;
  }) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadState = useMediaUpload();

  const chooseFile = async (file: File) => {
    const maxSize = mediaType === 'RESCUER_PROFILE_IMAGE' ? 5 : 10;
    if (file.size > maxSize * 1024 * 1024) {
      return;
    }
    const media = await uploadState.upload(file, mediaType);
    onUploaded?.(media);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        disabled={disabled || uploadState.isUploading}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void chooseFile(file);
          event.currentTarget.value = '';
        }}
      />
      <Button
        type="button"
        variant="outline"
        onClick={() => inputRef.current?.click()}
        disabled={disabled || uploadState.isUploading}
      >
        {uploadState.isUploading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Upload className="mr-2 h-4 w-4" />
        )}
        {uploadState.isUploading ? `${uploadState.progress}%` : label}
      </Button>
      {uploadState.error && (
        <p className="text-sm text-destructive">
          Upload failed. Please try again.
        </p>
      )}
    </div>
  );
}
