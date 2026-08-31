'use client';

import { useState } from 'react';
import { Clock, MapPin, Quote, Star, User } from 'lucide-react';
import dynamic from 'next/dynamic';
import { gql } from '@apollo/client';
import { useQuery } from '@/lib/apollo/hooks';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PageHeader, StatusPill, UrgencyPill } from '@/components/ui-bits';

const PUBLIC_RESCUES = gql`
  query PublicRescues(
    $pagination: PaginationInput
    $filter: PublicRescueFilterInput
  ) {
    publicRescues(pagination: $pagination, filter: $filter) {
      edges {
        node {
          id
          referenceNumber
          municipality
          district
          generalArea
          venomStatus
          priority
          publicStatus
          approximateLatitude
          approximateLongitude
          assignedRescuerName
          createdAt
          species {
            name
            scientificName
            venomous
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      totalCount
    }
  }
`;

type PublicRescue = {
  id: string;
  referenceNumber: string;
  municipality: string;
  district?: string | null;
  generalArea?: string | null;
  venomStatus: 'VENOMOUS' | 'NON_VENOMOUS' | 'UNKNOWN';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  publicStatus: 'OPEN' | 'RESPONDER_ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED';
  approximateLatitude?: number | null;
  approximateLongitude?: number | null;
  assignedRescuerName?: string | null;
  createdAt: string;
  species?: { name: string; scientificName: string; venomous: boolean } | null;
};

type PublicRescueConnection = {
  edges: Array<{ node: PublicRescue }>;
  pageInfo?: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  } | null;
  totalCount?: number | null;
};

type PublicRescuesData = {
  publicRescues?: PublicRescueConnection | null;
};

// Dynamic import for the map component to avoid SSR issues
const RescueMap = dynamic(
  () =>
    import('@/components/map/GoogleRescueMap').then((mod) => ({
      default: mod.GoogleRescueMap,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="h-44 flex items-center justify-center bg-secondary/40 rounded-lg border border-border/70">
        <div className="text-center">
          <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
          <p className="text-xs text-muted-foreground">Loading map...</p>
        </div>
      </div>
    ),
  },
);

const filters = ['all', 'critical', 'unassigned', 'closed'] as const;

function getRescueMapData(rescue: PublicRescue) {
  if (rescue.approximateLatitude == null || rescue.approximateLongitude == null)
    return null;
  return {
    rescue: {
      id: rescue.id,
      lat: rescue.approximateLatitude,
      lng: rescue.approximateLongitude,
      address: rescue.generalArea || rescue.municipality,
      municipality: rescue.municipality,
      status:
        rescue.publicStatus === 'IN_PROGRESS'
          ? 'IN_PROGRESS'
          : rescue.publicStatus === 'COMPLETED'
            ? 'COMPLETED'
            : rescue.publicStatus === 'RESPONDER_ASSIGNED'
              ? 'ASSIGNED'
              : 'PENDING',
      priority: rescue.priority,
      name: rescue.referenceNumber,
      phone: '',
      snakeDescription: rescue.species?.name || 'Unknown species',
    },
    rescuers: [],
    center: [rescue.approximateLatitude, rescue.approximateLongitude] as [
      number,
      number,
    ],
  };
}

function formatNepalDateTime(value: string) {
  return new Intl.DateTimeFormat('en-NP', {
    timeZone: 'Asia/Kathmandu',
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export default function RescuesPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>('all');
  const [selected, setSelected] = useState<PublicRescue | null>(null);
  const { data, loading, error, refetch } = useQuery<PublicRescuesData>(
    PUBLIC_RESCUES,
    {
    variables: {
      pagination: { page: 1, limit: 20 },
      filter:
        filter === 'critical'
          ? { priority: 'CRITICAL' }
          : filter === 'closed'
            ? { status: 'COMPLETED' }
            : filter === 'unassigned'
              ? { unassigned: true }
              : undefined,
    },
    fetchPolicy: 'cache-and-network',
  });
  const list: PublicRescue[] =
    data?.publicRescues?.edges?.map(
      (edge: { node: PublicRescue }) => edge.node,
    ) || [];
  const visibleList = list;
  const activeSelected =
    visibleList.find((rescue) => rescue.id === selected?.id) ||
    visibleList[0] ||
    null;
  const mapData = activeSelected ? getRescueMapData(activeSelected) : null;

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <PageHeader
        eyebrow="Dispatch"
        title="Rescue call-out board"
        description="Every report that reaches the hotline lands here. Triage by venom risk and exposure, then page the nearest certified handler."
      />

      <div className="mt-8 flex flex-wrap gap-2.5">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={
              'rounded-full border px-6 py-2.5 text-xs font-medium uppercase tracking-wider transition-all ' +
              (filter === f
                ? 'border-accent bg-accent text-accent-foreground shadow-md'
                : 'border-border/30 bg-background/40 backdrop-blur-sm text-muted-foreground hover:text-foreground hover:border-accent/40')
            }
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-4">
          {loading && visibleList.length === 0 && (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Loading rescue reports...
            </p>
          )}
          {error && (
            <div className="rounded-lg border border-destructive/40 p-5 text-sm text-destructive">
              Unable to load rescue reports.{' '}
              <button className="underline" onClick={() => refetch()}>
                Please try again.
              </button>
            </div>
          )}
          {!loading && !error && visibleList.length === 0 && (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No active rescue reports in this area.
            </p>
          )}
          {visibleList.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelected(r)}
              className={
                'w-full rounded-2xl border p-5 text-left transition-all ' +
                (activeSelected?.id === r.id
                  ? 'border-accent/60 bg-accent/10 shadow-md backdrop-blur-sm'
                  : 'border-border/30 bg-background/40 backdrop-blur-sm hover:border-accent/40 hover:shadow-sm')
              }
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs text-muted-foreground">
                  {r.referenceNumber}
                </span>
                <UrgencyPill
                  urgency={
                    r.priority === 'CRITICAL'
                      ? 'critical'
                      : r.priority === 'HIGH'
                        ? 'high'
                        : 'routine'
                  }
                />
                <StatusPill
                  status={
                    r.publicStatus === 'IN_PROGRESS'
                      ? 'en-route'
                      : r.publicStatus === 'COMPLETED'
                        ? 'closed'
                        : r.publicStatus === 'RESPONDER_ASSIGNED'
                          ? 'assigned'
                          : 'new'
                  }
                />
              </div>
              <p className="mt-2 font-semibold">
                {r.species?.name || 'Unknown species'}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />{' '}
                {r.generalArea || r.municipality}
              </p>
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />{' '}
                  {formatNepalDateTime(r.createdAt)}
                </span>
                <span className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />{' '}
                  {r.assignedRescuerName ?? 'Awaiting assignment'}
                </span>
              </div>
            </button>
          ))}
        </div>

        <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          {!activeSelected ? (
            <Card className="border-border/30 bg-background/60">
              <CardContent className="p-5 text-sm text-muted-foreground">
                Select a rescue report to view its public details.
              </CardContent>
            </Card>
          ) : (
            <Card className="border-border/30 bg-background/60 backdrop-blur-2xl shadow-md">
              <CardContent className="p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">
                    {activeSelected.referenceNumber}
                  </span>
                  {activeSelected.venomStatus === 'VENOMOUS' && (
                    <span className="rounded-full border border-destructive/40 bg-destructive/15 px-2.5 py-0.5 text-[10px] font-bold uppercase text-destructive">
                      Venomous
                    </span>
                  )}
                  <StatusPill
                    status={
                      activeSelected.publicStatus === 'IN_PROGRESS'
                        ? 'en-route'
                        : activeSelected.publicStatus === 'COMPLETED'
                          ? 'closed'
                          : activeSelected.publicStatus === 'RESPONDER_ASSIGNED'
                            ? 'assigned'
                            : 'new'
                    }
                  />
                </div>
                <h2 className="mt-3 text-2xl font-bold">
                  {activeSelected.species?.name || 'Unknown species'}
                </h2>

                {mapData ? (
                  <div className="mt-4 relative h-70 overflow-hidden rounded-lg border border-border/70 bg-secondary/40">
                    <RescueMap
                      rescues={[mapData.rescue]}
                      rescuers={mapData.rescuers}
                      center={mapData.center}
                      zoom={15}
                      selectedRescueId={activeSelected.id}
                      showAccuracyCircle={false}
                    />
                    <span className="absolute bottom-2 left-3 text-[11px] uppercase tracking-wider text-white bg-black/60 px-2 py-1 rounded backdrop-blur-sm z-1000">
                      Approximate {activeSelected.municipality} area
                    </span>
                  </div>
                ) : (
                  <div className="mt-4 rounded-lg border border-border/70 bg-secondary/40 p-6 text-sm text-muted-foreground">
                    Location map unavailable for this report.
                  </div>
                )}

                <dl className="mt-5 space-y-3 text-sm">
                  {[
                    [
                      'Area',
                      activeSelected.generalArea || activeSelected.municipality,
                    ],
                    [
                      'District',
                      activeSelected.district || activeSelected.municipality,
                    ],
                    ['Status', activeSelected.publicStatus],
                    [
                      'Responder',
                      activeSelected.assignedRescuerName ??
                        'Awaiting assignment',
                    ],
                    [
                      'Reported',
                      `${formatNepalDateTime(activeSelected.createdAt)} (Nepal time)`,
                    ],
                  ].map(([k, v]) => (
                    <div key={k} className="grid grid-cols-[110px_1fr] gap-3">
                      <dt className="text-muted-foreground">{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          )}

          <Card className="border-border/30 bg-background/60 shadow-md">
            <CardContent className="p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    Community feedback
                  </p>
                  <h3 className="mt-1 text-lg font-semibold">
                    Trusted in the moments that matter
                  </h3>
                </div>
                <div
                  className="flex items-center gap-1 text-warning"
                  aria-label="4.9 out of 5 stars"
                >
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-sm font-semibold text-foreground">
                    4.9
                  </span>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                {[
                  {
                    quote:
                      'The team arrived calmly and helped everyone keep a safe distance.',
                    area: 'Butwal',
                    name: 'Verified community report',
                    initials: 'VC',
                  },
                  {
                    quote:
                      'Clear updates, careful handling, and a safe release for the snake.',
                    area: 'Rupandehi',
                    name: 'Verified rescue follow-up',
                    initials: 'VR',
                  },
                ].map((review) => (
                  <div
                    key={review.quote}
                    className="rounded-xl border border-border/70 bg-secondary/30 p-3"
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-9 w-9 border border-primary/30">
                        <AvatarImage
                          src={`https://api.dicebear.com/9.x/initials/svg?seed=${review.initials}&backgroundColor=0ea5e9`}
                          alt="Anonymous reviewer"
                        />
                        <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                          {review.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate text-xs font-medium">
                            {review.name}
                          </span>
                          <span className="shrink-0 text-xs text-muted-foreground">
                            {review.area}
                          </span>
                        </div>
                        <div
                          className="mt-1 flex items-center gap-1 text-warning"
                          aria-label="5 out of 5 stars"
                        >
                          {Array.from({ length: 5 }).map((_, index) => (
                            <Star
                              key={index}
                              className="h-3 w-3 fill-current"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 flex gap-2">
                      <Quote className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <p className="text-sm leading-5">{review.quote}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
