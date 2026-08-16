'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Bell, CheckCircle, Clock, AlertCircle, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { useMyRescueRequestsQuery } from '@/lib/graphql/hooks/rescue.hooks'
import { toast } from 'sonner'

/**
 * Citizen Notifications Page
 * Shows all notifications for the citizen
 * ✅ INTEGRATED: Uses timeline data from rescue requests
 */

const NOTIFICATION_ICONS = {
  RESCUE_CREATED: Clock,
  RESCUE_ASSIGNED: Bell,
  RESCUE_ACCEPTED: CheckCircle,
  RESCUE_IN_PROGRESS: AlertCircle,
  RESCUE_COMPLETED: CheckCircle,
  RESCUE_CANCELLED: X,
}

export default function CitizenNotificationsPage() {
  const router = useRouter()
  const [readNotificationIds, setReadNotificationIds] = useState<Set<string>>(new Set())

  // Fetch rescue requests with timeline data
  const { data, loading, error } = useMyRescueRequestsQuery({
    variables: {
      pagination: { limit: 50, page: 1 },
    },
    pollInterval: 30000,
    fetchPolicy: 'cache-and-network',
  })

  // Transform timeline events into notifications
  const notifications = useMemo(() => {
    const rescues = data?.myRescueRequests?.edges?.map(e => e.node) || []
    const notifs: Array<{
      id: string
      type: string
      title: string
      message: string
      read: boolean
      createdAt: string
      rescueId: string
      priority: string
    }> = []

    rescues.forEach(rescue => {
      // Create notification for rescue creation
      notifs.push({
        id: `${rescue.id}-created`,
        type: 'RESCUE_CREATED',
        title: 'Rescue Request Created',
        message: `Your rescue request ${rescue.referenceNumber} has been submitted.`,
        read: readNotificationIds.has(`${rescue.id}-created`),
        createdAt: rescue.createdAt,
        rescueId: rescue.id,
        priority: rescue.priority || 'NORMAL',
      })

      // Create notification for assignment
      if (rescue.assignedAt) {
        notifs.push({
          id: `${rescue.id}-assigned`,
          type: 'RESCUE_ASSIGNED',
          title: 'Rescuer Assigned',
          message: `A rescuer has been assigned to your request ${rescue.referenceNumber}.`,
          read: readNotificationIds.has(`${rescue.id}-assigned`),
          createdAt: rescue.assignedAt,
          rescueId: rescue.id,
          priority: rescue.priority || 'NORMAL',
        })
      }

      // Create notification for acceptance
      if (rescue.acceptedAt) {
        notifs.push({
          id: `${rescue.id}-accepted`,
          type: 'RESCUE_ACCEPTED',
          title: 'Rescuer Accepted!',
          message: `Your rescuer has accepted and is heading to your location.`,
          read: readNotificationIds.has(`${rescue.id}-accepted`),
          createdAt: rescue.acceptedAt,
          rescueId: rescue.id,
          priority: 'HIGH',
        })
      }

      // Create notification for completion
      if (rescue.completedAt) {
        notifs.push({
          id: `${rescue.id}-completed`,
          type: 'RESCUE_COMPLETED',
          title: 'Rescue Completed',
          message: `Your snake rescue has been completed successfully!`,
          read: readNotificationIds.has(`${rescue.id}-completed`),
          createdAt: rescue.completedAt,
          rescueId: rescue.id,
          priority: 'NORMAL',
        })
      }

      // Add timeline events as notifications
      if (rescue.timeline) {
        rescue.timeline.forEach(event => {
          notifs.push({
            id: event.id,
            type: event.event,
            title: event.event.replace(/_/g, ' '),
            message: event.description || `Status update for ${rescue.referenceNumber}`,
            read: readNotificationIds.has(event.id),
            createdAt: event.createdAt,
            rescueId: rescue.id,
            priority: 'NORMAL',
          })
        })
      }
    })

    // Sort by most recent first
    return notifs.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }, [data, readNotificationIds])

  const unreadCount = notifications.filter(n => !n.read).length

  const handleMarkAsRead = (id: string) => {
    setReadNotificationIds(prev => new Set([...prev, id]))
  }

  const handleMarkAllAsRead = () => {
    setReadNotificationIds(new Set(notifications.map(n => n.id)))
    toast.success('All notifications marked as read')
  }

  const handleNotificationClick = (notification: typeof notifications[0]) => {
    handleMarkAsRead(notification.id)
    if (notification.rescueId) {
      router.push(`/dashboard/citizen/requests/${notification.rescueId}`)
    }
  }

  const unreadNotifications = notifications.filter(n => !n.read)

  // Show error toast
  if (error) {
    toast.error(`Failed to load notifications: ${error.message}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="mx-auto max-w-4xl">
        
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Notifications
              </h1>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            </div>
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
                Mark all as read
              </Button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <Card className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
            <p className="text-gray-600 dark:text-gray-400">Loading notifications...</p>
          </Card>
        )}

        {/* Tabs */}
        {!loading && (
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList>
              <TabsTrigger value="all">
                All ({notifications.length})
              </TabsTrigger>
              <TabsTrigger value="unread">
                Unread ({unreadCount})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-3">
              {notifications.length > 0 ? (
              notifications.map((notification) => {
                const Icon = NOTIFICATION_ICONS[notification.type as keyof typeof NOTIFICATION_ICONS] || Bell
                return (
                  <Card
                    key={notification.id}
                    className={cn(
                      'p-4 cursor-pointer transition-colors hover:border-primary',
                      !notification.read && 'bg-blue-50 dark:bg-blue-950/20 border-l-4 border-l-primary'
                    )}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        'p-2 rounded-full',
                        notification.priority === 'HIGH' ? 'bg-red-100 dark:bg-red-900/20' : 'bg-blue-100 dark:bg-blue-900/20'
                      )}>
                        <Icon className={cn(
                          'h-5 w-5',
                          notification.priority === 'HIGH' ? 'text-red-600' : 'text-blue-600'
                        )} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold">{notification.title}</h3>
                          {!notification.read && (
                            <Badge className="bg-primary text-white shrink-0">New</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </Card>
                )
              })
            ) : (
              <Card className="p-12 text-center">
                <Bell className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-semibold">No Notifications</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  You don't have any notifications yet
                </p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="unread" className="space-y-3">
            {unreadNotifications.length > 0 ? (
              unreadNotifications.map((notification) => {
                const Icon = NOTIFICATION_ICONS[notification.type as keyof typeof NOTIFICATION_ICONS] || Bell
                return (
                  <Card
                    key={notification.id}
                    className="p-4 cursor-pointer transition-colors hover:border-primary bg-blue-50 dark:bg-blue-950/20 border-l-4 border-l-primary"
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/20">
                        <Icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold">{notification.title}</h3>
                          <Badge className="bg-primary text-white shrink-0">New</Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </Card>
                )
              })
            ) : (
              <Card className="p-12 text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                <h3 className="mt-4 text-lg font-semibold">All Caught Up!</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  You've read all your notifications
                </p>
              </Card>
            )}
          </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
