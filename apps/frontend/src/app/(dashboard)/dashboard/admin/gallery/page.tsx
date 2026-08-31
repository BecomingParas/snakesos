'use client';

import { useState } from 'react';
import {
  Eye,
  EyeOff,
  ImageIcon,
  LayoutGrid,
  List,
  Loader2,
  Pencil,
  Search,
  Trash2,
  Upload,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MediaUploader } from '@/components/media/MediaUploader';
import { DashboardPagination } from '@/components/dashboard/dashboard-pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  useGalleryImagesQuery,
  useUpdateGalleryImageMutation,
  useDeleteGalleryImageMutation,
  useUploadGalleryImageMutation,
  type GalleryImage,
  type GalleryCategory,
} from '@/lib/graphql/hooks/gallery.hooks';
import { toast } from 'sonner';

// ── Field-log design tokens ───────────────────────────────────────────
// Same moss accent and specimen-code system as the rest of the gallery
// surfaces, so admin, public grid, and this page read as one product.
const MOSS = '#9CB593';
const MOSS_DIM = '#4b5d46';

const CATEGORIES: { value: GalleryCategory; label: string; code: string }[] = [
  { value: 'RESCUE', label: 'Rescue', code: 'RS' },
  { value: 'SPECIES', label: 'Species', code: 'SP' },
  { value: 'TRAINING', label: 'Training', code: 'TR' },
  { value: 'EVENT', label: 'Event', code: 'EV' },
  { value: 'VOLUNTEER', label: 'Volunteer', code: 'VL' },
  { value: 'EDUCATION', label: 'Education', code: 'ED' },
  { value: 'HABITAT', label: 'Habitat', code: 'HB' },
];

const CATEGORY_CODE: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.value, c.code]),
);

// ── Gallery Management Page ───────────────────────────────────────────

export default function AdminGalleryPage() {
  const [publishedFilter, setPublishedFilter] = useState<boolean | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<GalleryCategory | undefined>();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCategory, setEditCategory] = useState<
    GalleryCategory | undefined
  >();
  const [uploadedMedia, setUploadedMedia] = useState<{
    secureUrl?: string;
    url?: string;
  } | null>(null);
  const [mediaKind, setMediaKind] = useState<'image' | 'video'>('image');

  const { data, loading, error, refetch } = useGalleryImagesQuery({
    variables: {
      pagination: { page: currentPage, limit: pageSize },
      filter: { isPublic: publishedFilter },
    },
    fetchPolicy: 'cache-and-network',
  });
  const [updateGalleryImage, { loading: updating }] =
    useUpdateGalleryImageMutation();
  const [deleteGalleryImage] = useDeleteGalleryImageMutation();
  const [uploadGalleryImage, { loading: creating }] =
    useUploadGalleryImageMutation();

  const galleryData = data as
    | {
        galleryImages?: {
          edges?: Array<{ node: GalleryImage }>;
          totalCount?: number;
          pageInfo?: {
            hasNextPage: boolean;
            hasPreviousPage: boolean;
          };
        };
      }
    | undefined;

  const items: GalleryImage[] =
    galleryData?.galleryImages?.edges?.map(({ node }) => node) ?? [];
  const totalCount = galleryData?.galleryImages?.totalCount ?? 0;
  const pageInfo = galleryData?.galleryImages?.pageInfo;

  const filteredItems = items.filter((item) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;

    const haystack = `${item.title ?? ''} ${item.description ?? ''} ${
      item.category ?? ''
    }`.toLowerCase();
    return haystack.includes(q);
  });

  const stats = {
    total: items.length,
    published: items.filter((i) => i.isPublic).length,
    draft: items.filter((i) => !i.isPublic).length,
  };

  const resetAddForm = () => {
    setTitle('');
    setDescription('');
    setCategory(undefined);
    setUploadedMedia(null);
    setMediaKind('image');
  };

  const createDraft = async () => {
    if (!uploadedMedia?.secureUrl || !title.trim() || !category) {
      toast.error('Upload media, enter a title, and choose a category');
      return;
    }
    try {
      await uploadGalleryImage({
        variables: {
          input: {
            title: title.trim(),
            description: description.trim() || undefined,
            ...(mediaKind === 'image'
              ? { imageUrl: uploadedMedia.secureUrl }
              : { videoUrl: uploadedMedia.secureUrl }),
            category,
          },
        },
      });
      toast.success('Gallery draft created');
      resetAddForm();
      setIsAddDialogOpen(false);
      await refetch();
    } catch (mutationError) {
      toast.error(
        mutationError instanceof Error
          ? mutationError.message
          : 'Unable to create gallery draft',
      );
    }
  };

  const togglePublished = async (id: string, isPublic: boolean) => {
    try {
      await updateGalleryImage({ variables: { id, input: { isPublic } } });
      toast.success(
        isPublic ? 'Gallery item published' : 'Gallery item unpublished',
      );
      await refetch();
    } catch (mutationError) {
      toast.error(
        mutationError instanceof Error
          ? mutationError.message
          : 'Unable to update gallery item',
      );
    }
  };

  const startEdit = (item: GalleryImage) => {
    setEditingId(item.id);
    setEditTitle(item.title || '');
    setEditDescription(item.description || '');
    setEditCategory(item.category || undefined);
    setIsEditDialogOpen(true);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditDescription('');
    setEditCategory(undefined);
    setIsEditDialogOpen(false);
  };

  const saveEdit = async (id: string) => {
    if (!editTitle.trim() || !editCategory) {
      toast.error('Title and category are required to update the gallery item');
      return;
    }

    try {
      await updateGalleryImage({
        variables: {
          id,
          input: {
            title: editTitle.trim(),
            description: editDescription.trim() || undefined,
            category: editCategory,
          },
        },
      });
      toast.success('Gallery item updated');
      cancelEdit();
      await refetch();
    } catch (mutationError) {
      toast.error(
        mutationError instanceof Error
          ? mutationError.message
          : 'Unable to update gallery item',
      );
    }
  };

  const removeItem = async (id: string) => {
    try {
      await deleteGalleryImage({ variables: { id } });
      toast.success('Gallery item deleted');
      await refetch();
    } catch (mutationError) {
      toast.error(
        mutationError instanceof Error
          ? mutationError.message
          : 'Unable to delete gallery item',
      );
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border/30 pb-5">
        <div>
          <span
            className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.25em]"
            style={{ color: MOSS }}
          >
            Field Log
            <span
              className="h-1 w-1 rounded-full"
              style={{ backgroundColor: MOSS_DIM }}
            />
            Gallery
          </span>
          <h1 className="mt-1.5 text-3xl font-bold tracking-tight text-foreground">
            Gallery Management
          </h1>
          <p className="mt-1.5 text-muted-foreground">
            Upload and publish rescue stories to showcase your work.
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="h-10 gap-2 rounded-md px-4 text-sm font-medium"
            >
              <Plus className="h-4 w-4" />
              Add Gallery Media
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto p-0">
            <div
              className="flex items-center gap-3 border-b border-border/30 px-6 py-4"
              style={{
                backgroundImage: `linear-gradient(90deg, ${MOSS_DIM}22, transparent 60%)`,
              }}
            >
              <span
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border"
                style={{
                  borderColor: `${MOSS}55`,
                  backgroundColor: `${MOSS}1a`,
                }}
              >
                <Upload className="h-4 w-4" style={{ color: MOSS }} />
              </span>
              <DialogHeader className="space-y-0.5 text-left">
                <DialogTitle>Add a gallery photo</DialogTitle>
                <DialogDescription>
                  Upload a photo and save it as a draft before publishing.
                </DialogDescription>
              </DialogHeader>
            </div>

            <div className="space-y-5 px-6 py-5">
              <div>
                <label
                  className="text-sm font-semibold"
                  htmlFor="gallery-title"
                >
                  Title *
                </label>
                <Input
                  id="gallery-title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Cobra rescue in Butwal"
                  className="mt-2 focus-visible:ring-[#9CB593]/40"
                />
              </div>

              <div>
                <label className="text-sm font-semibold">Media type *</label>
                <div className="mt-2 flex gap-2">
                  {(['image', 'video'] as const).map((kind) => (
                    <Button
                      key={kind}
                      type="button"
                      variant={mediaKind === kind ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setMediaKind(kind);
                        setUploadedMedia(null);
                      }}
                    >
                      {kind === 'image' ? 'Image' : 'Video'}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  className="text-sm font-semibold"
                  htmlFor="gallery-category"
                >
                  Category *
                </label>
                <div className="mt-2">
                  <Select
                    value={category}
                    onValueChange={(value) =>
                      setCategory(value as GalleryCategory)
                    }
                  >
                    <SelectTrigger
                      id="gallery-category"
                      className="h-11 w-full font-mono text-sm"
                    >
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          <span
                            style={{ color: MOSS }}
                            className="mr-1.5 font-mono text-xs font-bold"
                          >
                            {c.code}
                          </span>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label
                  className="text-sm font-semibold"
                  htmlFor="gallery-description"
                >
                  Description
                </label>
                <Textarea
                  id="gallery-description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Describe this public rescue story…"
                  className="mt-2 min-h-28"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold">
                  {mediaKind === 'image' ? 'Image' : 'Video'} *
                </label>
                <div
                  className="rounded-lg border-2 border-dashed p-6 transition-colors"
                  style={{
                    borderColor: uploadedMedia?.secureUrl
                      ? `${MOSS}88`
                      : undefined,
                    backgroundColor: uploadedMedia?.secureUrl
                      ? `${MOSS}14`
                      : undefined,
                  }}
                >
                  <MediaUploader
                    mediaType={
                      mediaKind === 'image' ? 'GALLERY_IMAGE' : 'GALLERY_VIDEO'
                    }
                    accept={
                      mediaKind === 'image'
                        ? 'image/jpeg,image/png,image/webp'
                        : 'video/mp4,video/webm,video/quicktime'
                    }
                    label={
                      uploadedMedia
                        ? `${mediaKind === 'image' ? 'Image' : 'Video'} uploaded ✓`
                        : `Upload ${mediaKind}`
                    }
                    onUploaded={(media) => setUploadedMedia(media)}
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 border-t border-border/30 px-6 py-4 sm:gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetAddForm();
                  setIsAddDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => void createDraft()}
                disabled={
                  creating ||
                  !uploadedMedia?.secureUrl ||
                  !title.trim() ||
                  !category
                }
              >
                {creating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="mr-2 h-4 w-4" />
                )}
                Save as draft
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          if (!open) cancelEdit();
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto p-0">
          <div
            className="flex items-center gap-3 border-b border-border/30 px-6 py-4"
            style={{
              backgroundImage: `linear-gradient(90deg, ${MOSS_DIM}22, transparent 60%)`,
            }}
          >
            <span
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border"
              style={{
                borderColor: `${MOSS}55`,
                backgroundColor: `${MOSS}1a`,
              }}
            >
              <Pencil className="h-4 w-4" style={{ color: MOSS }} />
            </span>
            <DialogHeader className="space-y-0.5 text-left">
              <DialogTitle>Edit gallery photo</DialogTitle>
              <DialogDescription>
                Update the title, category, and story details for this item.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="space-y-5 px-6 py-5">
            <div>
              <label
                className="text-sm font-semibold"
                htmlFor="edit-gallery-title"
              >
                Title *
              </label>
              <Input
                id="edit-gallery-title"
                value={editTitle}
                onChange={(event) => setEditTitle(event.target.value)}
                placeholder="Title"
                className="mt-2 focus-visible:ring-[#9CB593]/40"
              />
            </div>

            <div>
              <label
                className="text-sm font-semibold"
                htmlFor="edit-gallery-category"
              >
                Category *
              </label>
              <div className="mt-2">
                <Select
                  value={editCategory}
                  onValueChange={(value) =>
                    setEditCategory(value as GalleryCategory)
                  }
                >
                  <SelectTrigger
                    id="edit-gallery-category"
                    className="h-11 w-full font-mono text-sm"
                  >
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        <span
                          style={{ color: MOSS }}
                          className="mr-1.5 font-mono text-xs font-bold"
                        >
                          {c.code}
                        </span>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label
                className="text-sm font-semibold"
                htmlFor="edit-gallery-description"
              >
                Description
              </label>
              <Textarea
                id="edit-gallery-description"
                value={editDescription}
                onChange={(event) => setEditDescription(event.target.value)}
                placeholder="Description"
                className="mt-2 min-h-28"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 border-t border-border/30 px-6 py-4 sm:gap-2">
            <Button type="button" variant="outline" onClick={cancelEdit}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (editingId) void saveEdit(editingId);
              }}
              disabled={updating || !editTitle.trim() || !editCategory}
            >
              {updating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Pencil className="mr-2 h-4 w-4" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Stats */}
      <div className="grid gap-4 border-b border-border/30 pb-5 md:grid-cols-3">
        <LogTag
          icon={ImageIcon}
          tone="primary"
          value={stats.total}
          label="Total items"
        />
        <LogTag
          icon={Eye}
          tone="success"
          value={stats.published}
          label="Published"
        />
        <LogTag
          icon={EyeOff}
          tone="warning"
          value={stats.draft}
          label="Draft"
        />
      </div>

      <div className="flex flex-col gap-3 border-b border-border/30 pb-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search gallery items…"
            className="h-10 pl-9 focus-visible:ring-[#9CB593]/40"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'All', value: undefined },
              { label: 'Published', value: true },
              { label: 'Draft', value: false },
            ].map(({ label, value }) => {
              const isActive = publishedFilter === value;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    setPublishedFilter(value as boolean | undefined);
                    setCurrentPage(1);
                  }}
                  className="rounded-md border px-3.5 py-1.5 text-xs font-medium transition-colors"
                  style={{
                    borderColor: isActive ? MOSS : undefined,
                    backgroundColor: isActive ? `${MOSS}1a` : undefined,
                    color: isActive ? MOSS : undefined,
                  }}
                >
                  <span
                    className={
                      isActive
                        ? ''
                        : 'border-border/60 text-muted-foreground hover:text-foreground'
                    }
                  >
                    {label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="inline-flex rounded-md border border-border/50 p-1">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              aria-pressed={viewMode === 'grid'}
              className="rounded-md p-2 transition-colors"
              style={{
                backgroundColor: viewMode === 'grid' ? `${MOSS}22` : undefined,
                color: viewMode === 'grid' ? MOSS : undefined,
              }}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              aria-pressed={viewMode === 'list'}
              className="rounded-md p-2 transition-colors"
              style={{
                backgroundColor: viewMode === 'list' ? `${MOSS}22` : undefined,
                color: viewMode === 'list' ? MOSS : undefined,
              }}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      {loading && !data ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: MOSS }} />
        </div>
      ) : error ? (
        <Card className="p-6 text-center">
          <ImageIcon className="mx-auto mb-2 h-8 w-8 text-destructive" />
          <p className="font-semibold text-destructive">
            Unable to load gallery items
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => refetch()}
          >
            Try Again
          </Button>
        </Card>
      ) : filteredItems.length === 0 ? (
        <Card className="border-2 border-dashed p-10 text-center">
          <ImageIcon className="mx-auto mb-3 h-12 w-12 text-muted-foreground/40" />
          <p className="text-lg font-semibold text-foreground">
            {searchQuery ? 'No matching gallery items' : 'Nothing logged yet'}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {searchQuery
              ? 'Try a different keyword or clear the search.'
              : 'Upload your first rescue story to get started.'}
          </p>
        </Card>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => {
                return (
                  <Card
                    key={item.id}
                    className="cursor-pointer overflow-hidden transition-shadow duration-200 hover:shadow-lg"
                    onClick={() => {
                      window.location.href = `/dashboard/admin/gallery/${item.id}`;
                    }}
                  >
                    <div className="group relative aspect-video overflow-hidden bg-secondary">
                      {item.videoUrl ? (
                        <video
                          src={item.videoUrl}
                          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                          muted
                          playsInline
                          preload="metadata"
                        />
                      ) : (
                        <img
                          src={
                            item.thumbnailUrl ||
                            item.imageUrl ||
                            '/placeholder-image.jpg'
                          }
                          alt={item.title || 'Gallery item'}
                          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />

                      <span
                        className="absolute left-0 top-0 rounded-br-lg border-b border-r px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm"
                        style={{
                          borderColor: `${MOSS_DIM}88`,
                          backgroundColor: '#10140fcc',
                          color: MOSS,
                        }}
                      >
                        {CATEGORY_CODE[item.category ?? ''] ?? '—'}
                      </span>

                      <span
                        className={
                          'absolute right-3 top-3 select-none rounded-sm border-2 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.15em] backdrop-blur-sm ' +
                          (item.isPublic
                            ? '-rotate-4 border-success/70 bg-success/10 text-success'
                            : 'rotate-3 border-dashed border-warning/60 bg-warning/10 text-warning')
                        }
                      >
                        {item.isPublic ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <CardContent className="pb-4 pt-4">
                      <div className="space-y-3">
                        <div className="min-w-0">
                          <h2 className="truncate font-semibold text-foreground">
                            {item.title || 'Untitled gallery item'}
                          </h2>
                          <p
                            className="mt-1 font-mono text-[10px] font-bold uppercase tracking-widest"
                            style={{ color: MOSS }}
                          >
                            {CATEGORY_CODE[item.category ?? ''] ?? '—'} ·{' '}
                            {item.category || 'Uncategorized'}
                          </p>
                        </div>

                        {item.description && (
                          <p className="line-clamp-2 text-xs text-muted-foreground">
                            {item.description}
                          </p>
                        )}

                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            disabled={updating}
                            onClick={() =>
                              void togglePublished(item.id, !item.isPublic)
                            }
                          >
                            {item.isPublic ? (
                              <>
                                <EyeOff className="mr-1 h-4 w-4" />
                                Unpublish
                              </>
                            ) : (
                              <>
                                <Eye className="mr-1 h-4 w-4" />
                                Publish
                              </>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="px-3"
                            onClick={(event) => {
                              event.stopPropagation();
                              startEdit(item);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="px-3"
                            onClick={() => void removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredItems.map((item) => {
                return (
                  <Card
                    key={item.id}
                    className="cursor-pointer overflow-hidden"
                    onClick={() => {
                      window.location.href = `/dashboard/admin/gallery/${item.id}`;
                    }}
                  >
                    <div className="flex flex-col gap-4 p-4 md:flex-row">
                      <div className="relative h-28 w-full overflow-hidden rounded-lg bg-secondary md:w-52">
                        {item.videoUrl ? (
                          <video
                            src={item.videoUrl}
                            className="h-full w-full object-cover"
                            muted
                            playsInline
                            preload="metadata"
                          />
                        ) : (
                          <img
                            src={
                              item.thumbnailUrl ||
                              item.imageUrl ||
                              '/placeholder-image.jpg'
                            }
                            alt={item.title || 'Gallery item'}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h2 className="truncate font-semibold text-foreground">
                                {item.title || 'Untitled gallery item'}
                              </h2>
                              <p
                                className="mt-1 font-mono text-[10px] font-bold uppercase tracking-widest"
                                style={{ color: MOSS }}
                              >
                                {CATEGORY_CODE[item.category ?? ''] ?? '—'} ·{' '}
                                {item.category || 'Uncategorized'}
                              </p>
                            </div>
                            <span
                              className={
                                'select-none rounded-sm border-2 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.15em] ' +
                                (item.isPublic
                                  ? 'border-success/70 bg-success/10 text-success'
                                  : 'border-dashed border-warning/60 bg-warning/10 text-warning')
                              }
                            >
                              {item.isPublic ? 'Published' : 'Draft'}
                            </span>
                          </div>

                          {item.description && (
                            <p className="line-clamp-2 text-xs text-muted-foreground">
                              {item.description}
                            </p>
                          )}

                          <div className="flex gap-2 pt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                              disabled={updating}
                              onClick={() =>
                                void togglePublished(item.id, !item.isPublic)
                              }
                            >
                              {item.isPublic ? (
                                <>
                                  <EyeOff className="mr-1 h-4 w-4" />
                                  Unpublish
                                </>
                              ) : (
                                <>
                                  <Eye className="mr-1 h-4 w-4" />
                                  Publish
                                </>
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="px-3"
                              onClick={(event) => {
                                event.stopPropagation();
                                startEdit(item);
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="px-3"
                              onClick={() => void removeItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          <DashboardPagination
            page={currentPage}
            pageSize={pageSize}
            totalCount={totalCount}
            pageInfo={pageInfo}
            onPageChange={(page) => setCurrentPage(page)}
            onPageSizeChange={(nextPageSize) => {
              setPageSize(nextPageSize);
              setCurrentPage(1);
            }}
            itemLabel="gallery items"
          />
        </>
      )}
    </div>
  );
}

function LogTag({
  icon: Icon,
  tone,
  value,
  label,
}: {
  icon: React.ElementType;
  tone: 'primary' | 'success' | 'warning';
  value: number;
  label: string;
}) {
  const toneText = {
    primary: 'text-primary',
    success: 'text-success',
    warning: 'text-warning',
  }[tone];

  return (
    <div
      className="flex min-h-35 flex-col justify-between rounded-2xl border border-border/50 bg-linear-to-br from-background to-secondary/20 p-5 shadow-sm"
      style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)' }}
    >
      <div className="flex items-center justify-between">
        <div
          className={`grid h-11 w-11 place-items-center rounded-xl border border-current/20 bg-current/5 ${toneText}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-5 flex items-end justify-between gap-3">
        <div>
          <div className="font-mono text-4xl font-bold leading-none tracking-tight text-foreground">
            {value}
          </div>
          <div className="mt-2 text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
            {label}
          </div>
        </div>
      </div>
    </div>
  );
}
