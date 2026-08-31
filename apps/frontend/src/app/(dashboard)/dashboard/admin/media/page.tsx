'use client';

import { useState } from 'react';
import {
  Eye,
  EyeOff,
  FileIcon,
  ImageIcon,
  Loader2,
  Trash2,
  Upload,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MediaUploader } from '@/components/media/MediaUploader';
import { toast } from 'sonner';

type MediaCategory =
  | 'RESCUE'
  | 'SPECIES'
  | 'TRAINING'
  | 'EVENT'
  | 'VOLUNTEER'
  | 'EDUCATION'
  | 'HABITAT'
  | 'DOCUMENT'
  | 'OTHER';

interface MediaFile {
  id: string;
  title: string;
  url: string;
  category: MediaCategory;
  description?: string;
  uploadedAt: Date;
  isPublic: boolean;
  fileType: 'image' | 'document' | 'video';
}

export default function AdminMediaPage() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<MediaCategory>('RESCUE');
  const [uploadedMedia, setUploadedMedia] = useState<{
    secureUrl?: string;
  } | null>(null);
  const [fileType, setFileType] = useState<'image' | 'document'>('image');
  const [publishedFilter, setPublishedFilter] = useState<boolean | undefined>();
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const filteredItems = mediaFiles.filter((item) => {
    if (publishedFilter !== undefined && item.isPublic !== publishedFilter) {
      return false;
    }
    return true;
  });

  const createDraft = async () => {
    if (!uploadedMedia?.secureUrl || !title.trim()) {
      toast.error('Upload a file and enter a title first');
      return;
    }

    setIsCreating(true);
    try {
      const newFile: MediaFile = {
        id: Date.now().toString(),
        title: title.trim(),
        url: uploadedMedia.secureUrl,
        category,
        description: description.trim() || undefined,
        uploadedAt: new Date(),
        isPublic: false,
        fileType: fileType as 'image' | 'document',
      };

      setMediaFiles([newFile, ...mediaFiles]);
      toast.success('Media file saved as draft');
      setTitle('');
      setDescription('');
      setUploadedMedia(null);
      setFileType('image');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Unable to save media file',
      );
    } finally {
      setIsCreating(false);
    }
  };

  const togglePublished = async (id: string, isPublic: boolean) => {
    setIsUpdating(true);
    try {
      setMediaFiles(
        mediaFiles.map((file) =>
          file.id === id ? { ...file, isPublic } : file,
        ),
      );
      toast.success(isPublic ? 'Media published' : 'Media unpublished');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Unable to update media file',
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const removeItem = async (id: string) => {
    try {
      setMediaFiles(mediaFiles.filter((file) => file.id !== id));
      toast.success('Media file deleted');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Unable to delete media file',
      );
    }
  };

  return (
    <main className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Media Library</h1>
        <p className="mt-1 text-muted-foreground">
          Upload and manage media files for the platform.
        </p>
      </div>

      {/* Upload Section */}
      <Card className="max-w-3xl p-6">
        <h2 className="text-lg font-semibold">Add media file</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload images or documents and save as a private draft.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium" htmlFor="media-title">
                Title
              </label>
              <Input
                id="media-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Enter media title"
              />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="media-type">
                File Type
              </label>
              <select
                id="media-type"
                value={fileType}
                onChange={(event) =>
                  setFileType(event.target.value as 'image' | 'document')
                }
                className="mt-1 h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
              >
                <option value="image">Image</option>
                <option value="document">Document</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="media-category">
                Category
              </label>
              <select
                id="media-category"
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value as MediaCategory)
                }
                className="mt-1 h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
              >
                <option value="RESCUE">Rescue</option>
                <option value="SPECIES">Species</option>
                <option value="TRAINING">Training</option>
                <option value="EVENT">Event</option>
                <option value="VOLUNTEER">Volunteer</option>
                <option value="EDUCATION">Education</option>
                <option value="HABITAT">Habitat</option>
                <option value="DOCUMENT">Document</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="media-description">
              Description
            </label>
            <Textarea
              id="media-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Add optional description or caption"
              className="mt-1 h-full"
            />
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-dashed border-border p-4">
          <p className="mb-2 text-sm font-medium">File</p>
          <MediaUploader
            mediaType="GALLERY_IMAGE"
            accept={
              fileType === 'image'
                ? 'image/jpeg,image/png,image/webp'
                : '.pdf,.doc,.docx,.txt'
            }
            label={uploadedMedia ? 'File uploaded' : `Upload ${fileType}`}
            onUploaded={(media) => setUploadedMedia(media)}
          />
        </div>

        <Button
          className="mt-4"
          onClick={() => void createDraft()}
          disabled={isCreating || !uploadedMedia?.secureUrl || !title.trim()}
        >
          {isCreating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Upload className="mr-2 h-4 w-4" />
          )}
          Save as draft
        </Button>
      </Card>

      {/* Filter Section */}
      <div className="flex flex-wrap gap-2">
        {[
          ['All', undefined],
          ['Published', true],
          ['Draft', false],
        ].map(([label, value]) => (
          <Button
            key={String(label)}
            size="sm"
            variant={publishedFilter === value ? 'default' : 'outline'}
            onClick={() => setPublishedFilter(value as boolean | undefined)}
          >
            {label}
          </Button>
        ))}
      </div>

      {/* Media Grid Section */}
      {mediaFiles.length === 0 ? (
        <Card className="p-10 text-center">
          <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-4 text-lg font-semibold">No media files found</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Upload a file above to get started.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              {item.fileType === 'image' ? (
                <div className="relative aspect-video bg-secondary">
                  <img
                    src={item.url}
                    alt={item.title || 'Media file'}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="relative aspect-video flex items-center justify-center bg-secondary">
                  <FileIcon className="h-12 w-12 text-muted-foreground/50" />
                </div>
              )}
              <div className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate font-semibold">
                      {item.title || 'Untitled media'}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {item.category || 'Uncategorized'}
                    </p>
                  </div>
                  <Badge variant={item.isPublic ? 'default' : 'outline'}>
                    {item.isPublic ? 'Published' : 'Draft'}
                  </Badge>
                </div>
                {item.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isUpdating}
                    onClick={() =>
                      void togglePublished(item.id, !item.isPublic)
                    }
                  >
                    {item.isPublic ? (
                      <EyeOff className="mr-2 h-4 w-4" />
                    ) : (
                      <Eye className="mr-2 h-4 w-4" />
                    )}
                    {item.isPublic ? 'Unpublish' : 'Publish'}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => void removeItem(item.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
