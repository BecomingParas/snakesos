'use client'

import { 
  MapPin, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  Phone,
  Navigation,
  Loader2
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { useMyAssignedRescues, useCurrentUser } from '@/hooks/dashboard'

export default function RescuerDashboard() {
  const { user } = useCurrentUser()
  const { rescues, totalCount, loading, error } = useMyAssignedRescues({
    pagination: { first: 10 },
  })

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-sm text-muted-foreground">Loading your rescues...</p>
        </div>
      </div>
    )
  }

  // Calculate stats
  const monthlyRescues = rescues.filter(r => {
    const createdDate = new Date(r.createdAt)
    const now = new Date()
    return createdDate.getMonth() === now.getMonth() && 
           createdDate.getFullYear() === now.getFullYear()
  }).length

  const volunteerProfile = user?.volunteerProfile
  const completedRescues = volunteerProfile?.completedRescues || 0
  const rating = volunteerProfile?.rating || 0

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Rescuer Dashboard</h1>
          <p className="text-muted-foreground">Your rescue assignments and status</p>
        </div>
        <div className="flex gap-2">
          <Badge 
            variant={volunteerProfile?.status === 'ACTIVE' ? 'default' : 'secondary'}
            className="text-sm"
          >
            {volunteerProfile?.status === 'ACTIVE' ? '🟢' : '🔴'} {volunteerProfile?.status || 'INACTIVE'}
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rescues</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedRescues}</div>
            <p className="text-xs text-muted-foreground">
              All time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthlyRescues}</div>
            <p className="text-xs text-success">
              +2 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Rating</CardTitle>
            <span className="text-lg">⭐</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rating > 0 ? rating.toFixed(1) : 'N/A'}/5.0</div>
            <p className="text-xs text-muted-foreground">
              {rating > 0 ? 'Your rating' : 'No ratings yet'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Now</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rescues.length}</div>
            <p className="text-xs text-destructive">
              {rescues.filter(r => r.priority === 'CRITICAL').length} critical
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Button className="h-auto flex-col gap-2 py-6" variant="destructive">
            <AlertCircle className="h-8 w-8" />
            <span>Mark Unavailable</span>
          </Button>
          <Button asChild variant="outline" className="h-auto flex-col gap-2 py-6">
            <Link href="/rescues">
              <MapPin className="h-8 w-8" />
              <span>View All Rescues</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto flex-col gap-2 py-6">
            <Link href="/dashboard/rescuer/history">
              <Clock className="h-8 w-8" />
              <span>Rescue History</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Assigned Rescues */}
      <Card>
        <CardHeader>
          <CardTitle>Your Assigned Rescues</CardTitle>
        </CardHeader>
        <CardContent>
          {rescues.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <CheckCircle2 className="mx-auto mb-2 h-12 w-12 text-muted-foreground/50" />
              <p>No rescues assigned right now</p>
              <p className="text-sm">You'll be notified when a rescue is assigned</p>
            </div>
          ) : (
            <div className="space-y-4">
              {rescues.map((rescue) => {
                const formatDate = (dateStr: string | null) => {
                  if (!dateStr) return 'Unknown'
                  const date = new Date(dateStr)
                  if (isNaN(date.getTime())) return 'Invalid date'
                  
                  const now = new Date()
                  const diffMs = now.getTime() - date.getTime()
                  const diffMins = Math.floor(diffMs / 60000)
                  const diffHours = Math.floor(diffMs / 3600000)

                  if (diffMins < 1) return 'Just now'
                  if (diffMins < 60) return `${diffMins} min ago`
                  if (diffHours < 24) return `${diffHours} hours ago`
                  const diffDays = Math.floor(diffHours / 24)
                  return `${diffDays} days ago`
                }

                const getPriorityBadge = (priority: string) => {
                  if (priority === 'CRITICAL' || priority === 'HIGH') return 'destructive'
                  return 'secondary'
                }

                return (
                  <div
                    key={rescue.id}
                    className="rounded-lg border border-border p-4"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-semibold">
                            {rescue.referenceNumber || rescue.id}
                          </span>
                          <Badge 
                            variant={getPriorityBadge(rescue.priority)}
                            className="text-xs"
                          >
                            {rescue.priority}
                          </Badge>
                          {rescue.isEmergency && (
                            <Badge variant="destructive" className="text-xs">
                              EMERGENCY
                            </Badge>
                          )}
                        </div>
                        <h3 className="mt-1 font-semibold">
                          {rescue.snakeDescription || 'Snake Rescue'}
                        </h3>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(rescue.createdAt)}
                      </span>
                    </div>

                    <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {rescue.address}, {rescue.municipality}
                        {rescue.ward ? `-${rescue.ward}` : ''}
                      </span>
                    </div>

                    {rescue.hasBite && (
                      <div className="mb-3 rounded-md bg-destructive/10 p-2 text-sm font-medium text-destructive">
                        ⚠️ Snakebite reported - Medical emergency
                      </div>
                    )}

                    <div className="flex gap-2">
                      {rescue.lat && rescue.lng ? (
                        <Button size="sm" className="flex-1" asChild>
                          <a 
                            href={`https://www.google.com/maps/dir/?api=1&destination=${rescue.lat},${rescue.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Navigation className="mr-2 h-4 w-4" />
                            Navigate
                          </a>
                        </Button>
                      ) : (
                        <Button size="sm" className="flex-1" disabled>
                          <Navigation className="mr-2 h-4 w-4" />
                          No GPS
                        </Button>
                      )}
                      <Button size="sm" variant="outline" asChild>
                        <a href={`tel:${rescue.phone}`}>
                          <Phone className="mr-2 h-4 w-4" />
                          Call
                        </a>
                      </Button>
                      <Button size="sm" variant="outline">
                        Details
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
