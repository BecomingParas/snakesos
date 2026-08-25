'use client';

import {
  Loader2,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Info,
  Radio,
} from 'lucide-react';
import { useDashboardStats } from '@/hooks/dashboard';
import { useResponsive } from '@/hooks/use-responsive';
import { useActiveRescuesQuery } from '@/lib/graphql/hooks/rescue.hooks';
import { useHospitals } from '@/lib/graphql/hooks/hospital.hooks';
import { AdminDashboardMobile } from './AdminDashboardMobile';
import {
  StatisticsCard,
  ChartCard,
  SectionPanel,
  LiveFieldMap,
} from '@/components/dashboard/widgets';
import { DataTable } from '@/components/dashboard/data-table';
import type {
  SeriesPoint,
  StatDef,
  TableDef,
  MapMarker,
} from '@/lib/dashboard-data';

const TONE_ICON = {
  error: AlertTriangle,
  warning: AlertCircle,
  success: CheckCircle2,
  info: Info,
} as const;

const TONE_CLASS = {
  error: 'text-destructive bg-destructive/10',
  warning: 'text-warning bg-warning/10',
  success: 'text-success bg-success/10',
  info: 'text-muted-foreground bg-muted',
} as const;

export default function AdminDashboard() {
  const { stats, loading, error } = useDashboardStats();
  const { isMobile } = useResponsive();

  // Fetch ALL real data for live field map
  const { data: rescuesData } = useActiveRescuesQuery({
    variables: { pagination: { limit: 200, page: 1 } },
    pollInterval: 30000, // Refresh every 30 seconds
  });

  const { data: hospitalsData } = useHospitals(
    { status: 'ACTIVE' },
    { first: 100 },
  );

  const recentRescues = stats?.recentRescues || [];

  // Convert real data to MapMarker format for LiveFieldMap.
  const rescues =
    rescuesData?.activeRescues?.edges?.map((edge) => edge.node) || [];
  const hospitals =
    (hospitalsData as any)?.hospitals?.edges?.map((edge: any) => edge.node) ||
    [];

  // Create markers from real data
  const realMarkers: MapMarker[] = [
    // Rescue markers
    ...rescues
      .filter((r: any) => Number.isFinite(r.lng) && Number.isFinite(r.lat))
      .map((r: any) => ({
        id: `rescue-${r.id}`,
        type: 'rescue' as const,
        label: `${r.snakeDescription || 'Snake rescue'} · ${r.municipality}`,
        x: ((r.lng - 80.0) / 8.2) * 100, // Convert lng to percentage
        y: (1 - (r.lat - 26.3) / 4.1) * 100, // Convert lat to percentage (inverted)
        priority: r.priority as any,
        status: r.status,
      })),
    // Hospital markers - SHOW ALL, not just 20!
    ...hospitals
      .filter(
        (h: any) => Number.isFinite(h.longitude) && Number.isFinite(h.latitude),
      )
      .map((h: any) => ({
        id: `hospital-${h.id}`,
        type: 'facility' as const,
        label: `${h.name} · ${h.municipality}`,
        x: ((h.longitude - 80.0) / 8.2) * 100,
        y: (1 - (h.latitude - 26.3) / 4.1) * 100,
        priority: 'LOW' as const,
        status: h.emergency24x7 ? 'AVAILABLE' : 'LIMITED',
      })),
  ];

  const markers = realMarkers;

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-sm text-muted-foreground">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-lg border-2 border-destructive bg-destructive/10 p-6 text-center shadow-elevated">
          <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-destructive" />
          <h2 className="mb-2 text-xl font-semibold text-destructive-foreground dark:text-foreground">
            Failed to Load Dashboard
          </h2>
          <p className="text-sm text-destructive-foreground font-medium">
            {error?.message || 'Unable to fetch dashboard statistics'}
          </p>
        </div>
      </div>
    );
  }

  // Mobile view
  if (isMobile) {
    return <AdminDashboardMobile stats={stats} />;
  }

  // Desktop view continues below...

  const formatResponseTime = (seconds: number) => {
    return `${seconds} min`;
  };

  const now = new Date();
  const timestamp = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // "Right now" — the stats someone opens this page to check first
  const liveStats: StatDef[] = [
    {
      label: 'Open requests',
      value: String(stats.activeRescues),
      change: stats.rescueTrend.change,
      period: 'vs previous period',
      icon: 'siren',
    },
    {
      label: 'Avg response',
      value: formatResponseTime(stats.averageResponseTime),
      change: 0,
      period: 'current average',
      icon: 'clock',
    },
    {
      label: 'Active handlers',
      value: String(stats.activeVolunteers),
      change: stats.volunteerTrend.change,
      period: 'vs previous period',
      icon: 'shield',
    },
  ];

  // "Trend" — network health, checked less urgently
  const trendStats: StatDef[] = [
    {
      label: 'Released safely',
      value: String(stats.completedRescues),
      change: stats.rescueTrend.change,
      period: 'current period',
      icon: 'check',
    },
    {
      label: 'Verified rescuers',
      value: String(stats.verifiedRescuers),
      change: stats.volunteerTrend.change,
      period: 'total',
      icon: 'users',
    },
    {
      label: 'Completion rate',
      value: `${stats.completionRate.toFixed(1)}%`,
      change: stats.rescueTrend.change,
      period: 'vs previous period',
      icon: 'trending-up',
    },
  ];

  const monthlyData: SeriesPoint[] = recentRescues.reduce<SeriesPoint[]>(
    (months, rescue) => {
      const label = new Date(rescue.createdAt).toLocaleDateString('en-US', {
        month: 'short',
      });
      const month = months.find((item) => item.label === label);
      if (month) month.value += 1;
      else months.push({ label, value: 1 });
      return months;
    },
    [],
  );

  const statusBreakdown = [
    { label: 'Completed', value: stats.completedRescues },
    { label: 'Active', value: stats.activeRescues },
    {
      label: 'Other',
      value: Math.max(
        stats.totalRescues - stats.completedRescues - stats.activeRescues,
        0,
      ),
    },
  ].filter((item) => item.value > 0);

  const needsAttentionTable: TableDef = {
    name: 'needs-attention',
    columns: [
      { key: 'id', label: 'Request' },
      { key: 'species', label: 'Suspected species' },
      { key: 'status', label: 'Status', badge: true },
      { key: 'priority', label: 'Priority', badge: true },
      { key: 'assignedTo', label: 'Assigned to' },
      { key: 'updated', label: 'Updated', align: 'right' },
    ],
    rows: rescues.slice(0, 5).map((rescue: any) => ({
      id: rescue.referenceNumber || rescue.id,
      species: rescue.snakeDescription || 'Unidentified',
      status: rescue.status,
      priority: rescue.priority,
      assignedTo: rescue.assignedVolunteer?.user?.name || 'Unassigned',
      updated: new Date(rescue.updatedAt || rescue.createdAt).toLocaleString(),
    })),
  };

  return (
    <div className="mx-auto max-w-[1400px] space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      {/* Header — dispatch strip */}
      <div className="flex flex-col gap-3 border-b border-border/60 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success/60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Field ops · Butwal network
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
          <Radio className="h-3.5 w-3.5" />
          <span>Live &middot; last sync {timestamp}</span>
        </div>
      </div>

      {/* Right now */}
      <div className="space-y-3">
        <h2 className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Right now
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {liveStats.map((stat, idx) => (
            <StatisticsCard key={idx} stat={stat} />
          ))}
        </div>
      </div>

      {/* Trend */}
      <div className="space-y-3">
        <h2 className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Network trend
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {trendStats.map((stat, idx) => (
            <StatisticsCard key={idx} stat={stat} />
          ))}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Activity trend"
          description="Rolling seven-month volume"
          type="area"
          data={monthlyData}
          dataLabels={{
            primary: 'Total Requests',
            secondary: 'Completed Rescues',
          }}
        />
        <ChartCard
          title="Distribution"
          description="Share of total"
          type="pie"
          breakdown={statusBreakdown}
        />
      </div>

      {/* Live Field Map and Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SectionPanel
            title="Live field map"
            description="Call-outs, handlers and sightings"
          >
            <LiveFieldMap
              markers={markers}
              onMarkerClick={(m) => console.log('Marker clicked:', m)}
            />
          </SectionPanel>
        </div>

        <SectionPanel
          title="Recent activity"
          description="Network-wide event stream"
        >
          <div className="space-y-1">
            {recentRescues.slice(0, 5).map((rescue, idx) => {
              const tone =
                rescue.status === 'COMPLETED'
                  ? 'success'
                  : rescue.status === 'PENDING'
                    ? 'warning'
                    : 'info';
              const Icon = TONE_ICON[tone];
              return (
                <div
                  key={rescue.id}
                  className="flex items-start gap-3 border-b border-border/30 py-3 last:border-0"
                >
                  <span
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${TONE_CLASS[tone]}`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <p className="text-sm leading-snug text-foreground">
                      {rescue.name || 'Rescue request'} · {rescue.status}
                    </p>
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {new Date(rescue.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
            {recentRescues.length === 0 && (
              <p className="py-6 text-sm text-muted-foreground">
                No recent activity for this period.
              </p>
            )}
          </div>
        </SectionPanel>
      </div>

      {/* Needs Attention Table */}
      <SectionPanel
        title="Needs attention"
        description="Open requests awaiting triage or reassignment"
      >
        <DataTable table={needsAttentionTable} pageSize={5} />
      </SectionPanel>
    </div>
  );
}
