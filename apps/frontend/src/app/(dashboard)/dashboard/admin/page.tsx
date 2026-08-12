'use client'

import {
  Loader2,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Info,
  Radio,
} from 'lucide-react'
import { useDashboardStats } from '@/hooks/dashboard'
import { StatisticsCard, ChartCard, SectionPanel, InteractiveMap } from '@/components/dashboard/widgets'
import { DataTable } from '@/components/dashboard/data-table'
import type { SeriesPoint, StatDef, TableDef } from '@/lib/dashboard-data'
import { markers, activityFeed } from '@/lib/dashboard-data'

const TONE_ICON = {
  error: AlertTriangle,
  warning: AlertCircle,
  success: CheckCircle2,
  info: Info,
} as const

const TONE_CLASS = {
  error: 'text-destructive bg-destructive/10',
  warning: 'text-warning bg-warning/10',
  success: 'text-success bg-success/10',
  info: 'text-muted-foreground bg-muted',
} as const

export default function AdminDashboard() {
  const { stats, loading, error } = useDashboardStats()

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
          <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-destructive" />
          <h2 className="mb-2 text-xl font-semibold">Failed to Load Dashboard</h2>
          <p className="text-sm text-muted-foreground">
            {error?.message || 'Unable to fetch dashboard statistics'}
          </p>
        </div>
      </div>
    )
  }

  const formatResponseTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    return `${minutes} min`
  }

  const now = new Date()
  const timestamp = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

  // "Right now" — the stats someone opens this page to check first
  const liveStats: StatDef[] = [
    { label: 'Open requests', value: String(stats.activeRescues), change: 6.5, period: 'vs yesterday', icon: 'siren' },
    { label: 'Avg response', value: formatResponseTime(stats.averageResponseTime), change: -9.3, period: 'vs last week', icon: 'clock' },
    { label: 'Active handlers', value: String(stats.activeVolunteers), change: 3.0, period: 'on shift', icon: 'shield' },
  ]

  // "Trend" — network health, checked less urgently
  const trendStats: StatDef[] = [
    { label: 'Released safely', value: String(stats.completedRescues), change: 4.4, period: 'this year', icon: 'check' },
    { label: 'Verified rescuers', value: String(stats.verifiedRescuers), change: stats.volunteerTrend.change, period: 'total', icon: 'users' },
    { label: 'Completion rate', value: `${stats.completionRate.toFixed(1)}%`, change: 1.8, period: 'vs last month', icon: 'trending-up' },
  ]

  const monthlyData: SeriesPoint[] = [
    { label: 'Feb', value: 140, secondary: 87 },
    { label: 'Mar', value: 155, secondary: 96 },
    { label: 'Apr', value: 148, secondary: 92 },
    { label: 'May', value: 165, secondary: 102 },
    { label: 'Jun', value: 158, secondary: 98 },
    { label: 'Jul', value: 172, secondary: 107 },
    { label: 'Aug', value: 168, secondary: 104 },
  ]

  const speciesBreakdown = [
    { label: 'Cobra', value: 34 },
    { label: 'Krait', value: 22 },
    { label: 'Rat snake', value: 28 },
    { label: 'Viper', value: 16 },
  ]

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
    rows: [
      { id: 'SR-2380', species: 'Russell\'s Viper', status: 'ASSIGNED', priority: 'LOW', assignedTo: '—', updated: '12 min ago' },
      { id: 'SR-2381', species: 'Rat Snake', status: 'IN_PROGRESS', priority: 'MEDIUM', assignedTo: 'Prakash Gurung', updated: '24 min ago' },
      { id: 'SR-2382', species: 'Checkered Keelback', status: 'COMPLETED', priority: 'HIGH', assignedTo: 'Deepak Lama', updated: '36 min ago' },
      { id: 'SR-2383', species: 'Green Pit Viper', status: 'CANCELLED', priority: 'EMERGENCY', assignedTo: 'Rohit Adhikari', updated: '48 min ago' },
      { id: 'SR-2384', species: 'Spectacled Cobra', status: 'PENDING', priority: 'LOW', assignedTo: 'Kiran Bhandari', updated: '60 min ago' },
    ],
  }

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
            secondary: 'Completed Rescues'
          }}
        />
        <ChartCard
          title="Distribution"
          description="Share of total"
          type="pie"
          breakdown={speciesBreakdown}
        />
      </div>

      {/* Live Field Map and Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SectionPanel title="Live field map" description="Call-outs, handlers and sightings">
            <InteractiveMap markers={markers} onMarkerClick={(m) => console.log('Marker clicked:', m)} />
          </SectionPanel>
        </div>

        <SectionPanel title="Recent activity" description="Network-wide event stream">
          <div className="space-y-1">
            {activityFeed.map((item, idx) => {
              const Icon = TONE_ICON[item.tone]
              return (
                <div
                  key={idx}
                  className="flex items-start gap-3 border-b border-border/30 py-3 last:border-0"
                >
                  <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${TONE_CLASS[item.tone]}`}>
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <p className="text-sm leading-snug text-foreground">{item.text}</p>
                    <span className="font-mono text-[11px] text-muted-foreground">{item.time}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </SectionPanel>
      </div>

      {/* Needs Attention Table */}
      <SectionPanel title="Needs attention" description="Open requests awaiting triage or reassignment">
        <DataTable table={needsAttentionTable} pageSize={5} />
      </SectionPanel>
    </div>
  )
}