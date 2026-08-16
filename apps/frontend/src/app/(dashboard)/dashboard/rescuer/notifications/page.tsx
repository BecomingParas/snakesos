'use client'

import { useState, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bell, CheckCircle,  Clock, User,  Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useMyAssignedRescuesQuery } from '@/lib/graphql/hooks/rescue.hooks'
import { toast } from 'sonner'

/**
 * Rescuer Notifications Page
 * All notifications for rescuer
 * ✅ INTEGRATED: Uses timeline data from assigned rescues
 */

export default function RescuerNotificationsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all')
  const [readNotificationIds, setReadNotificationIds] = useState<Set<string>>(new Set())

  // Fetch all rescues assigned to this rescuer
  const { data, loading, error } = useMyAssignedRescuesQuery({
    variables: {
      pagination: { limit: 100, page: 1 },
    },
    pollInterval: 30000,
    fetchPolicy: 'cache-and-network',
  })

  // Transform rescue data into notifications
  const notifications = useMemo(() => {
    const rescues = data?.myAssignedRescues?.edges?.map(e => e.node) || []
    const notifs: Array<{
      id: string
      type: string
      title: string
      message: string
      timestamp: string
      read: boolean
      priority: string
    }> = []

    rescues.forEach(rescue => {
      // New assignment notification
      if (rescue.assignedAt) {
        notifs.push({
          id: `${rescue.id}-assigned`,
          type: 'NEW_ASSIGNMENT',
          title: 'New Rescue Assignment',
          message: `You have been assigned to rescue request ${rescue.referenceNumber}`,
          timestamp: rescue.assignedAt,
          read: readNotificationIds.has(`${rescue.id}-assigned`),
          priority: rescue.priority || 'NORMAL',
        })
      }

      // Completion notification
      if (rescue.completedAt) {
        notifs.push({
          id: `${rescue.id}-completed`,
          type: 'RESCUE_UPDATE',
          title: 'Rescue Completed',
          message: `Rescue ${rescue.referenceNumber} has been marked as completed`,
          timestamp: rescue.completedAt,
          read: readNotificationIds.has(`${rescue.id}-completed`),
          priority: 'NORMAL',
        })
      }

      // Timeline events as notifications
      if (rescue.timeline) {
        rescue.timeline.forEach(event => {
          notifs.push({
            id: event.id,
            type: 'RESCUE_UPDATE',
            title: event.event.replace(/_/g, ' '),
            message: event.description || `Update for ${rescue.referenceNumber}`,
            timestamp: event.createdAt,
            read: readNotificationIds.has(event.id),
            priority: 'NORMAL',
          })
        })
      }
    })

    // Sort by most recent first
    return notifs.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
  }, [data, readNotificationIds])

  const unreadCount = notifications.filter(n => !n.read).length

  const filteredNotifications = activeTab === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications

  const markAsRead = (id: string) => {
    setReadNotificationIds(prev => new Set([...prev, id]))
  }

  const markAllAsRead = () => {
    setReadNotificationIds(new Set(notifications.map(n => n.id)))
    toast.success('All notifications marked as read')
  }

  // Show error toast
  if (error) {
    toast.error(`Failed to load notifications: ${error.message}`)
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'NEW_ASSIGNMENT':
        return <User className="h-5 w-5 text-blue-600" />
      case 'RESCUE_UPDATE':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'SYSTEM':
        return <Bell className="h-5 w-5 text-gray-600" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  return (
    <div className="p-6 space-y-6">
      {/* Loading State */}
      {loading && (
        <Card className="p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
          <p className="text-gray-600 dark:text-gray-400">Loading notifications...</p>
        </Card>
      )}

      {!loading && (
        <>
          <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Bell className="h-8 w-8" />
            Notifications
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white">
                {unreadCount} new
              </Badge>
            )}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Stay updated with your rescue assignments and system updates
          </p>
        </div>

        {unreadCount > 0 && (
          <Button onClick={markAllAsRead} variant="outline">
            Mark all as read
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('all')}
            className={cn(
              'pb-3 px-1 border-b-2 font-medium transition-colors',
              activeTab === 'all'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
            )}
          >
            All Notifications ({notifications.length})
          </button>
          <button
            onClick={() => setActiveTab('unread')}
            className={cn(
              'pb-3 px-1 border-b-2 font-medium transition-colors',
              activeTab === 'unread'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
            )}
          >
            Unread ({unreadCount})
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card className="p-12 text-center">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No notifications</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {activeTab === 'unread' 
                ? "You're all caught up! No unread notifications."
                : "You don't have any notifications yet."}
            </p>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={cn(
                'p-4 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800',
                !notification.read && 'border-l-4 border-l-primary bg-blue-50 dark:bg-blue-950'
              )}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  {getIcon(notification.type)}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className={cn(
                        'font-semibold',
                        !notification.read && 'text-primary'
                      )}>
                        {notification.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {notification.message}
                      </p>
                    </div>

                    {notification.priority === 'HIGH' && (
                      <Badge className="bg-red-500 text-white">
                        Urgent
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTime(notification.timestamp)}
                    </span>
                    {!notification.read && (
                      <Badge variant="outline" className="text-xs">
                        New
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
        </>
      )}
    </div>
  )
}
