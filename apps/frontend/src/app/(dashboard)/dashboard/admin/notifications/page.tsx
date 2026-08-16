'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Bell,
  CheckCheck,
  Trash2,
  Filter,
  Search,
  AlertCircle,
  Info,
  CheckCircle,
  AlertTriangle,
  User,
  Activity,
  Settings
} from 'lucide-react'

/**
 * Admin Notifications Page
 * System-wide notifications management
 * NOTE: Currently using mock data - can be enhanced with real-time notifications API
 */

type NotificationType = 'info' | 'success' | 'warning' | 'error'

interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: Date
  read: boolean
  category: 'rescue' | 'user' | 'system'
  actionUrl?: string
}

export default function AdminNotificationsPage() {
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'rescue' | 'user' | 'system'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Mock notifications - will be replaced with real data from GraphQL
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'warning',
      title: 'High Priority Rescue',
      message: 'Emergency rescue request in Butwal Ward 8 - Venomous snake reported',
      timestamp: new Date(Date.now() - 5 * 60000),
      read: false,
      category: 'rescue',
      actionUrl: '/dashboard/admin/command'
    },
    {
      id: '2',
      type: 'success',
      title: 'Rescue Completed',
      message: 'Ram Prasad Sharma completed rescue #1234 in Bhairahawa',
      timestamp: new Date(Date.now() - 15 * 60000),
      read: false,
      category: 'rescue',
    },
    {
      id: '3',
      type: 'info',
      title: 'New Rescuer Registration',
      message: 'Krishna Bahadur has registered as a new rescuer in Pokhara',
      timestamp: new Date(Date.now() - 30 * 60000),
      read: true,
      category: 'user',
      actionUrl: '/dashboard/admin/rescuers'
    },
    {
      id: '4',
      type: 'error',
      title: 'System Alert',
      message: 'Failed to send SMS notification to rescuer - Check SMS gateway',
      timestamp: new Date(Date.now() - 60 * 60000),
      read: false,
      category: 'system',
    },
    {
      id: '5',
      type: 'warning',
      title: 'Delayed Response',
      message: 'Rescue #1230 in Kathmandu has been pending for 45 minutes',
      timestamp: new Date(Date.now() - 90 * 60000),
      read: true,
      category: 'rescue',
      actionUrl: '/dashboard/admin/rescues'
    },
    {
      id: '6',
      type: 'success',
      title: 'User Verification',
      message: 'Sita Devi Thapa\'s documents have been verified',
      timestamp: new Date(Date.now() - 2 * 3600000),
      read: true,
      category: 'user',
    },
    {
      id: '7',
      type: 'info',
      title: 'Daily Report',
      message: 'Daily rescue report for January 15, 2024 is ready',
      timestamp: new Date(Date.now() - 4 * 3600000),
      read: true,
      category: 'system',
    },
    {
      id: '8',
      type: 'warning',
      title: 'Low Rescuer Coverage',
      message: 'Chitwan area has only 2 active rescuers for 15 active requests',
      timestamp: new Date(Date.now() - 6 * 3600000),
      read: true,
      category: 'system',
    },
  ])

  // Filter notifications
  const filteredNotifications = notifications.filter(notif => {
    const matchesReadFilter = filter === 'all' || 
      (filter === 'read' && notif.read) || 
      (filter === 'unread' && !notif.read)
    
    const matchesCategoryFilter = categoryFilter === 'all' || notif.category === categoryFilter
    
    const matchesSearch = searchQuery === '' || 
      notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.message.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesReadFilter && matchesCategoryFilter && matchesSearch
  })

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'rescue':
        return <Activity className="h-4 w-4" />
      case 'user':
        return <User className="h-4 w-4" />
      default:
        return <Settings className="h-4 w-4" />
    }
  }

  const formatTimestamp = (date: Date) => {
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

  return (
    <div className="p-6 space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between">
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
            System-wide notifications and alerts
          </p>
        </div>
        
        <Button 
          variant="outline" 
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
        >
          <CheckCheck className="h-4 w-4 mr-2" />
          Mark All Read
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            />
          </div>

          {/* Read Status Filter */}
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
              size="sm"
            >
              All
            </Button>
            <Button
              variant={filter === 'unread' ? 'default' : 'outline'}
              onClick={() => setFilter('unread')}
              size="sm"
            >
              Unread
            </Button>
            <Button
              variant={filter === 'read' ? 'default' : 'outline'}
              onClick={() => setFilter('read')}
              size="sm"
            >
              Read
            </Button>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
              className="px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            >
              <option value="all">All Categories</option>
              <option value="rescue">Rescue</option>
              <option value="user">User</option>
              <option value="system">System</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card className="p-8 text-center">
            <Bell className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600 dark:text-gray-400">No notifications found</p>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card 
              key={notification.id}
              className={`p-4 transition-all ${
                !notification.read 
                  ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800' 
                  : 'bg-white dark:bg-gray-800'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        <span className="mr-1">{getCategoryIcon(notification.category)}</span>
                        {notification.category}
                      </Badge>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {formatTimestamp(notification.timestamp)}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {notification.message}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {notification.actionUrl && (
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    )}
                    {!notification.read && (
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <CheckCheck className="h-4 w-4 mr-1" />
                        Mark Read
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => deleteNotification(notification.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Notification Settings */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Settings className="h-5 w-5" />
          Notification Preferences
        </h2>
        
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <span className="text-sm">High priority rescue alerts</span>
            <input type="checkbox" defaultChecked className="toggle" />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-sm">Rescue completion notifications</span>
            <input type="checkbox" defaultChecked className="toggle" />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-sm">New user registrations</span>
            <input type="checkbox" defaultChecked className="toggle" />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-sm">System alerts and errors</span>
            <input type="checkbox" defaultChecked className="toggle" />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-sm">Daily summary reports</span>
            <input type="checkbox" className="toggle" />
          </label>
        </div>

        <div className="mt-6 pt-6 border-t dark:border-gray-700">
          <Button>Save Preferences</Button>
        </div>
      </Card>
    </div>
  )
}
