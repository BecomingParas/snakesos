'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, CalendarDays, ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGalleryImageQuery } from '@/lib/graphql/hooks/gallery.hooks';

const CATEGORY_LABELS: Record<string, string> = {
  RESCUE: 'Rescue',
  SPECIES: 'Species',
  TRAINING: 'Training',
  EVENT: 'Event',
  VOLUNTEER: 'Volunteer',
  EDUCATION: 'Education',
  HABITAT: 'Habitat',
};

function getCategoryLabel(category?: string | null) {
  return category ? (CATEGORY_LABELS[category] ?? category) : 'Uncategorized';
}

export default function GalleryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, loading, error } = useGalleryImageQuery({
    variables: { id },
    skip: !id,
    fetchPolicy: 'cache-and-network',
  });

  const item = data?.galleryImage;

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-5 py-16">
        <div className="flex items-center justify-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading gallery story…</span>
        </div>
      </main>
    );
  }

  if (error || !item) {
    return (
      <main className="mx-auto max-w-5xl px-5 py-16">
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center">
          <ImageIcon className="mx-auto h-10 w-10 text-destructive/70" />
          <h1 className="mt-4 text-2xl font-bold">Gallery item not found</h1>
          <p className="mt-2 text-muted-foreground">
            This media item may have been removed or is not public.
          </p>
          <Button asChild className="mt-6">
            <Link href="/gallery/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to gallery
            </Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 lg:py-14">
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/gallery/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to gallery
          </Link>
        </Button>
      </div>

      <article className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm">
        <div className="grid gap-0 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="bg-secondary">
            {item.videoUrl ? (
              <video
                src={item.videoUrl}
                className="h-full min-h-75 w-full object-cover"
                controls
                playsInline
              />
            ) : (
              <img
                src={
                  item.imageUrl || item.thumbnailUrl || '/placeholder-image.jpg'
                }
                alt={item.title || 'Gallery item'}
                className="h-full min-h-75 w-full object-cover"
              />
            )}
          </div>

          <div className="p-6 sm:p-8">
            <span className="inline-flex rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              {getCategoryLabel(item.category)}
            </span>

            <h1 className="mt-5 text-3xl font-bold tracking-tight lg:text-4xl">
              {item.title || 'Untitled gallery item'}
            </h1>

            <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              <span>
                {item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'Recently added'}
              </span>
            </div>

            {item.description ? (
              <p className="mt-6 text-base leading-7 text-muted-foreground">
                {item.description}
              </p>
            ) : (
              <p className="mt-6 text-base leading-7 text-muted-foreground">
                This story does not include a description yet.
              </p>
            )}
          </div>
        </div>
      </article>
    </main>
  );
}
