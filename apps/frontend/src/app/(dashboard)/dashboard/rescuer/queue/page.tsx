'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Clock,
  MapPin,
  Navigation,
  AlertTriangle,
  CheckCircle,
  Filter,
  RefreshCw,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import {
  useAvailableRescuesQuery,
  useAcceptFromQueueMutation,
} from '@/lib/graphql/hooks/rescue.hooks'
import { toast } from 'sonner'

/**
 * Rescue Queue Page
 * Shows available rescues that rescuers can pick up
 * Features:
 * - Auto-refresh every 5 seconds
 * - Filter by municipality
 * - Sort by priority, distance, time
 * - One-click accept from queue
 */

const MUNICIPALITIES = [
  'Kathmandu',
  'Lalitpur',
  'Bhaktapur',
  'Kirtipur',
  'Madhyapur Thimi',
]

const SORT_OPTIONS = [
  { value: 'PRIORITY', label: 'Priority' },
  { value: 'NEAREST', label: 'Nearest' },
  { value: 'OLDEST', label: 'Oldest' },
]

export default function RescueQueuePage() {
  const router = useRouter()
  const [municipality, setMunicipality] = useState('')
  const [sortBy, setSortBy] = useState('PRIORITY')
  const [autoRefresh, setAutoRefresh] = useState(true)

  // Fetch available rescues
  const { data, loading, refetch } = useAvailableRescuesQuery({
    variables: {
      filter: {
        municipality: municipality || undefined,
      },
    },
    fetchPolicy: 'cache-and-network',
  })

  // Accept from queue mutation
  const [acceptFromQueue, { loading: accepting }] = useAcceptFromQueueMutation({
    onCompleted: () => {
      toast.success('Rescue accepted! Redirecting to active rescue...')
      setTimeout(() => {
        router.push('/dashboard/rescuer/active')
      }, 1500)
    },
    onError: (error) => {
      if (error.message.includes('already assigned')) {
        toast.error('This rescue was just taken by another rescuer')
        refetch()
      } else {
        toast.error(`Failed to accept: ${error.message}`)
      }
    },
  })

  // Auto-refresh every 5 seconds
  useEffect(() => {
    if (!autoRefresh) return undefined

    const interval = setInterval(() => {
      refetch()
    }, 5000)

    return () => clearInterval(interval)
  }, [autoRefresh, refetch])

  const handleAccept = async (rescueId: string): Promise<void> => {
    await acceptFromQueue({
      variables: {
        input: { rescueId },
      },
    })
  }

  const availableRescues = data?.availableRescues?.edges?.map(edge => edge.node) || []

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Rescue Queue</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Available rescues waiting for assignment
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <RefreshCw
                className={cn(
                  'h-4 w-4',
                  autoRefresh && 'animate-spin text-green-500'
                )}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {autoRefresh ? 'Auto-refreshing' : 'Paused'}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              {autoRefresh ? 'Pause' : 'Resume'}
            </Button>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <div className="flex-1 grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Municipality</label>
                <Select value={municipality} onValueChange={setMunicipality}>
                  <SelectTrigger>
                    <SelectValue placeholder="All municipalities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All municipalities</SelectItem>
                    {MUNICIPALITIES.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{availableRescues.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Available</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {availableRescues.filter((r: any) => r.priority === 'HIGH').length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">High Priority</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <MapPin className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {municipality ? availableRescues.length : 'All'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {municipality || 'All Areas'}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Rescue List */}
        {loading && availableRescues.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : availableRescues.length === 0 ? (
          <Card className="p-12 text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Available Rescues</h2>
            <p className="text-gray-600 dark:text-gray-400">
              {municipality
                ? `No rescues available in ${municipality} right now`
                : 'All rescues are currently assigned. Check back soon!'}
            </p>
            {municipality && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setMunicipality('')}
              >
                Clear Filter
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid gap-4">
            {availableRescues.map((rescue: any) => (
              <Card
                key={rescue.id}
                className="p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold">
                        {rescue.referenceNumber}
                      </h3>
                      <Badge
                        className={cn(
                          'text-white',
                          rescue.priority === 'HIGH' && 'bg-red-500',
                          rescue.priority === 'MEDIUM' && 'bg-yellow-500',
                          rescue.priority === 'LOW' && 'bg-green-500'
                        )}
                      >
                        {rescue.priority}
                      </Badge>
                      <Badge variant="outline">{rescue.status}</Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                        <span className="text-gray-600 dark:text-gray-400">
                          {rescue.address}, {rescue.municipality}
                          {rescue.ward && ` (Ward ${rescue.ward})`}
                        </span>
                      </div>

                      {rescue.snakeDescription && (
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-gray-500 mt-0.5" />
                          <span className="text-gray-600 dark:text-gray-400">
                            {rescue.snakeDescription}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600 dark:text-gray-400">
                          Reported{' '}
                          {new Date(rescue.createdAt).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Button
                      onClick={() => handleAccept(rescue.id)}
                      disabled={accepting}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {accepting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Accepting...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Accept
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (rescue.lat && rescue.lng) {
                          window.open(
                            `https://www.google.com/maps/dir/?api=1&destination=${rescue.lat},${rescue.lng}`,
                            '_blank'
                          )
                        }
                      }}
                    >
                      <Navigation className="mr-2 h-3 w-3" />
                      Navigate
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
