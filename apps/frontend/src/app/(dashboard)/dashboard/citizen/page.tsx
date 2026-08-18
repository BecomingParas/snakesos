'use client'

import { 
  AlertCircle, 
  Phone,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useMyRescueRequests } from '@/hooks/dashboard'
import { useCurrentUser } from '@/hooks/dashboard/useCurrentUser'
import { StatisticsCard, ChartCard, InteractiveMap, SectionPanel } from '@/components/dashboard/widgets'
import { DataTable } from '@/components/dashboard/data-table'
import type { SeriesPoint, StatDef, TableDef } from '@/lib/dashboard-data'
import { markers, activityFeed } from '@/lib/dashboard-data'

export default function CitizenDashboard() {
  const { requests, totalCount, loading } = useMyRescueRequests({
    pagination: { limit: 10, page: 1 } ,
  })
  const { loading: userLoading } = useCurrentUser()

  // Loading state
  if (loading || userLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-sm text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  // Calculate stats
  const activeRequests = requests.filter(r => 
    r.status !== 'COMPLETED' && r.status !== 'CANCELLED'
  ).length
  const completedRequests = requests.filter(r => r.status === 'COMPLETED').length

  // Stats for StatisticsCard
  const stats: StatDef[] = [
    { label: 'My requests', value: String(totalCount), change: 0, period: 'lifetime', icon: 'siren' },
    { label: 'Active now', value: String(activeRequests), change: 0, period: 'in progress', icon: 'clock' },
    { label: 'Nearest team', value: '3.2 km', change: -12, period: 'response radius', icon: 'map' },
    { label: 'Donated', value: 'NPR 4,500', change: 15, period: 'this year', icon: 'wallet' },
  ]

  // Activity trend data
  const activityTrendData: SeriesPoint[] = [
    { label: 'Feb', value: 4 },
    { label: 'Mar', value: 7 },
    { label: 'Apr', value: 5 },
    { label: 'May', value: 9 },
    { label: 'Jun', value: 8 },
    { label: 'Jul', value: 12 },
    { label: 'Aug', value: 10 },
  ]

  // Distribution breakdown
  const distributionBreakdown = [
    { label: 'Completed', value: completedRequests || 4 },
    { label: 'In progress', value: activeRequests || 1 },
    { label: 'Pending', value: (totalCount - completedRequests - activeRequests) || 1 },
  ]

  // Table for requests
  const myRequestsTable: TableDef = {
    name: 'my-requests',
    columns: [
      { key: 'id', label: 'Request' },
      { key: 'species', label: 'Suspected species' },
      { key: 'status', label: 'Status', badge: true },
      { key: 'location', label: 'Location' },
      { key: 'rescuer', label: 'Assigned to' },
      { key: 'updated', label: 'Updated', align: 'right' },
    ],
    rows: requests.map((r) => {
      const formatDate = (dateStr: string | null) => {
        if (!dateStr) return 'Unknown'
        const date = new Date(dateStr)
        if (isNaN(date.getTime())) return 'Invalid date'
        
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMs / 3600000)
        const diffDays = Math.floor(diffMs / 86400000)

        if (diffMins < 1) return 'Just now'
        if (diffMins < 60) return `${diffMins}m ago`
        if (diffHours < 24) return `${diffHours}h ago`
        return `${diffDays}d ago`
      }

      return {
        id: r.referenceNumber || r.id,
        species: r.snakeDescription || 'Unknown',
        status: r.status,
        location: `${r.municipality}${r.ward ? `-${r.ward}` : ''}`,
        rescuer: r.assignedVolunteer?.user?.name || '—',
        updated: formatDate(r.updatedAt),
      }
    }),
  }

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* Stats Cards Row - using StatisticsCard widget */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => (
          <StatisticsCard key={idx} stat={stat} />
        ))}
      </div>

      {/* Charts Row - using ChartCard widget */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Activity Trend"
          description="7-month rolling request volume"
          type="area"
          data={activityTrendData}
          dataLabels={{
            primary: 'My Requests'
          }}
        />
        <ChartCard
          title="Request Distribution"
          description="Status breakdown"
          type="pie"
          breakdown={distributionBreakdown}
        />
      </div>

      {/* Live Field Map and Activity Feed */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Live Field Map - using InteractiveMap widget */}
        <div className="lg:col-span-2">
          <SectionPanel title="Live Field Map" description="Real-time rescue operations">
            <InteractiveMap markers={markers} onMarkerClick={(m) => console.log('Marker clicked:', m)} />
          </SectionPanel>
        </div>

        {/* Recent Activity Feed */}
        <SectionPanel title="Recent Activity">
          <div className="space-y-4">
            {activityFeed.map((item, idx) => (
              <div key={idx} className="flex gap-3 border-b border-border/30 pb-4 last:border-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <AlertCircle className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="text-sm font-medium leading-tight">{item.text}</p>
                  <span className="text-xs text-muted-foreground">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </SectionPanel>
      </div>

      {/* Emergency Banner */}
      <SectionPanel title="Need Emergency Help?" description="">
        <div className="rounded-xl border-2 border-destructive bg-destructive/20 dark:bg-destructive/10 p-6 shadow-elevated">
          <div className="flex items-start gap-4">
            <AlertCircle className="h-8 w-8 shrink-0 text-destructive dark:text-destructive" />
            <div className="flex-1">
              <p className="mb-4 text-sm text-destructive-foreground dark:text-foreground font-medium">
                If you've spotted a snake or need immediate rescue assistance, submit a request now.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="destructive">
                  <Link href="/emergency">
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Request Emergency Rescue
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-destructive/50 hover:bg-destructive/10">
                  <a href="tel:9816482570">
                    <Phone className="mr-2 h-4 w-4" />
                    Call Hotline: 9816482570
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SectionPanel>

      {/* My Rescue Requests Section - using DataTable widget */}
      <SectionPanel 
        title="My Rescue Requests" 
        description="Track all your submissions"
      >
        <div className="mb-4 flex justify-end">
          <Button asChild size="sm">
            <Link href="/emergency">
              <AlertCircle className="mr-2 h-4 w-4" />
              New Request
            </Link>
          </Button>
        </div>
        <DataTable table={myRequestsTable} loading={loading} />
      </SectionPanel>

      {/* Safety Tips */}
      <SectionPanel 
        title="Safety Tips" 
        description="Essential guidelines for snake encounters"
      >
        <ul className="space-y-3 text-sm">
          <li className="flex gap-3">
            <span className="mt-0.5 text-lg text-primary">•</span>
            <span>Keep a safe distance of at least 3 meters from any snake</span>
          </li>
          <li className="flex gap-3">
            <span className="mt-0.5 text-lg text-primary">•</span>
            <span>Never attempt to handle or kill a snake yourself</span>
          </li>
          <li className="flex gap-3">
            <span className="mt-0.5 text-lg text-primary">•</span>
            <span>If bitten, go to the nearest hospital immediately</span>
          </li>
          <li className="flex gap-3">
            <span className="mt-0.5 text-lg text-primary">•</span>
            <span>Take a photo from a safe distance to help with identification</span>
          </li>
        </ul>
      </SectionPanel>
    </div>
  )
}
