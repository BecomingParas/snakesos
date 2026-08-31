'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  ArrowUpRight,
  ImageIcon,
  LayoutGrid,
  List,
  Loader2,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  useGalleryImagesQuery,
  type GalleryImage,
} from '@/lib/graphql/hooks/gallery.hooks';

// Moss green — the one signature accent, reused from the admin gallery so
// the public and internal views read as the same field-log system.
const MOSS = '#9CB593';

const CATEGORY_LABELS: Record<string, string> = {
  RESCUE: 'Rescue',
  SPECIES: 'Species',
  TRAINING: 'Training',
  EVENT: 'Event',
  VOLUNTEER: 'Volunteer',
  EDUCATION: 'Education',
  HABITAT: 'Habitat',
};

const CATEGORY_CODES: Record<string, string> = {
  RESCUE: 'RS',
  SPECIES: 'SP',
  TRAINING: 'TR',
  EVENT: 'EV',
  VOLUNTEER: 'VL',
  EDUCATION: 'ED',
  HABITAT: 'HB',
};

type CategoryFilter =
  | 'All'
  | keyof typeof CATEGORY_LABELS
  | (typeof CATEGORY_LABELS)[keyof typeof CATEGORY_LABELS];

type ViewMode = 'grid' | 'list';

function getCategoryLabel(category?: string | null) {
  return category ? (CATEGORY_LABELS[category] ?? category) : 'Uncategorized';
}

function getCategoryCode(category?: string | null) {
  if (!category) return '—';
  return CATEGORY_CODES[category] ?? category.slice(0, 2).toUpperCase();
}

export default function GalleryPage() {
  const [active, setActive] = useState<CategoryFilter>('All');
  const [query, setQuery] = useState('');
  const [view, setView] = useState<ViewMode>('grid');
  const [selected, setSelected] = useState<GalleryImage | null>(null);

  const { data, loading, error } = useGalleryImagesQuery({
    variables: {
      pagination: { page: 1, limit: 50 },
      filter: { isPublic: true },
    },
    fetchPolicy: 'cache-and-network',
  });

  const items: GalleryImage[] = useMemo(
    () =>
      (
        data as { galleryImages?: { edges?: Array<{ node: GalleryImage }> } }
      )?.galleryImages?.edges?.map(({ node }) => node) ?? [],
    [data],
  );

  const categories = useMemo(
    () => [
      'All',
      ...Array.from(
        new Set(items.map((item) => getCategoryLabel(item.category))),
      ),
    ],
    [items],
  );

  const list = useMemo(() => {
    const byCategory =
      active === 'All'
        ? items
        : items.filter((item) => getCategoryLabel(item.category) === active);

    const q = query.trim().toLowerCase();
    if (!q) return byCategory;

    return byCategory.filter((item) => {
      const haystack =
        `${item.title ?? ''} ${item.description ?? ''}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [items, active, query]);

  return (
    <main>
      <section className="border-b border-border/40 px-5 py-16 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-3 text-sm font-semibold text-primary">
            <span className="h-px w-8 bg-primary" />
            Field stories
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight lg:text-6xl">
            Rescue gallery
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            A curated record of rescues, releases, training, and community work
            from the SnakeSOS network.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10">
        {/* Search + view toggle */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search rescue stories…"
              className="pl-9 focus-visible:ring-[#9CB593]/40"
            />
          </div>

          <div
            className="inline-flex shrink-0 items-center gap-1 self-start rounded-lg border border-border/50 p-1 sm:self-auto"
            role="group"
            aria-label="Toggle gallery layout"
          >
            <button
              type="button"
              onClick={() => setView('grid')}
              aria-pressed={view === 'grid'}
              className="rounded-md p-1.5 transition-colors"
              style={{
                backgroundColor: view === 'grid' ? `${MOSS}22` : undefined,
                color: view === 'grid' ? MOSS : undefined,
              }}
            >
              <LayoutGrid
                className={view === 'grid' ? '' : 'text-muted-foreground'}
                size={16}
              />
            </button>
            <button
              type="button"
              onClick={() => setView('list')}
              aria-pressed={view === 'list'}
              className="rounded-md p-1.5 transition-colors"
              style={{
                backgroundColor: view === 'list' ? `${MOSS}22` : undefined,
                color: view === 'list' ? MOSS : undefined,
              }}
            >
              <List
                className={view === 'list' ? '' : 'text-muted-foreground'}
                size={16}
              />
            </button>
          </div>
        </div>

        {/* Category filter */}
        <div
          className="mt-5 flex flex-wrap gap-2 border-b border-border/40 pb-6"
          aria-label="Gallery categories"
        >
          {categories.map((category) => {
            const isActive = active === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActive(category as CategoryFilter)}
                className="rounded-full border px-3.5 py-1.5 font-mono text-xs font-bold uppercase tracking-wider transition-colors"
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
                  {category}
                </span>
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-3 py-20 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading gallery…</span>
          </div>
        ) : error ? (
          <div className="py-20 text-center">
            <ImageIcon className="mx-auto h-10 w-10 text-destructive/70" />
            <p className="mt-4 text-lg font-semibold text-destructive">
              Unable to load gallery items
            </p>
          </div>
        ) : list.length === 0 ? (
          <div className="py-20 text-center">
            <ImageIcon className="mx-auto h-10 w-10 text-muted-foreground/60" />
            <p className="mt-4 text-lg font-semibold">No gallery items found</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {query ? 'Try a different search term.' : 'Try another category.'}
            </p>
          </div>
        ) : view === 'grid' ? (
          <div className="grid gap-6 py-10 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => setSelected(item)}
                className="group block text-left"
              >
                <figure className="overflow-hidden rounded-xl border border-border/50 bg-card transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg">
                  <div className="relative aspect-4/3 bg-secondary">
                    {item.videoUrl ? (
                      <video
                        src={item.videoUrl}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        muted
                        playsInline
                        controls={false}
                      />
                    ) : (
                      <img
                        src={
                          item.imageUrl ||
                          item.thumbnailUrl ||
                          '/placeholder-image.jpg'
                        }
                        alt={item.title || 'Gallery item'}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    )}
                    <span
                      className="absolute left-0 top-0 rounded-br-lg border-b border-r px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm"
                      style={{
                        borderColor: `${MOSS}55`,
                        backgroundColor: '#10140fcc',
                        color: MOSS,
                      }}
                    >
                      {getCategoryCode(item.category)}
                    </span>
                  </div>
                  <figcaption className="p-5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                      {getCategoryLabel(item.category)}
                    </span>
                    <h2 className="mt-2 font-semibold">
                      {item.title || 'Untitled gallery item'}
                    </h2>
                    {item.description && (
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    )}
                  </figcaption>
                </figure>
              </button>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-border/40 py-4">
            {list.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => setSelected(item)}
                className="flex w-full items-center gap-5 py-4 text-left transition-colors hover:bg-secondary/20"
              >
                <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-secondary">
                  {item.videoUrl ? (
                    <video
                      src={item.videoUrl}
                      className="h-full w-full object-cover"
                      muted
                      playsInline
                    />
                  ) : (
                    <img
                      src={
                        item.imageUrl ||
                        item.thumbnailUrl ||
                        '/placeholder-image.jpg'
                      }
                      alt={item.title || 'Gallery item'}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <span
                    className="font-mono text-[11px] font-bold uppercase tracking-widest"
                    style={{ color: MOSS }}
                  >
                    {getCategoryCode(item.category)} ·{' '}
                    {getCategoryLabel(item.category)}
                  </span>
                  <h2 className="mt-1 truncate font-semibold">
                    {item.title || 'Untitled gallery item'}
                  </h2>
                  {item.description && (
                    <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  )}
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Preview dialog */}
      <Dialog
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
      >
        <DialogContent className="max-w-2xl overflow-hidden p-0">
          {selected && (
            <>
              <div className="relative aspect-video w-full bg-secondary">
                {selected.videoUrl ? (
                  <video
                    src={selected.videoUrl}
                    className="h-full w-full object-cover"
                    controls
                    playsInline
                  />
                ) : (
                  <img
                    src={
                      selected.imageUrl ||
                      selected.thumbnailUrl ||
                      '/placeholder-image.jpg'
                    }
                    alt={selected.title || 'Gallery item'}
                    className="h-full w-full object-cover"
                  />
                )}
                <span
                  className="absolute left-0 top-0 rounded-br-lg border-b border-r px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm"
                  style={{
                    borderColor: `${MOSS}55`,
                    backgroundColor: '#10140fcc',
                    color: MOSS,
                  }}
                >
                  {getCategoryCode(selected.category)}
                </span>
              </div>

              <div className="p-6">
                <DialogHeader className="items-start space-y-1.5 text-left">
                  <span
                    className="font-mono text-xs font-bold uppercase tracking-widest"
                    style={{ color: MOSS }}
                  >
                    {getCategoryLabel(selected.category)}
                  </span>
                  <DialogTitle className="font-display text-2xl">
                    {selected.title || 'Untitled gallery item'}
                  </DialogTitle>
                </DialogHeader>

                {selected.description && (
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {selected.description}
                  </p>
                )}

                <div className="mt-6 flex justify-end">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/gallery/${selected.id}`}>
                      Open full story
                      <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
