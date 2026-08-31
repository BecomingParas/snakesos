'use client';

import { gql } from '@apollo/client';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCircle, Clock, User, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMutation, useQuery } from '@/lib/apollo/hooks';
import { toast } from 'sonner';
import { DashboardPagination } from '@/components/dashboard/dashboard-pagination';

const MY_NOTIFICATIONS = gql`
  query RescuerNotifications($pagination: PaginationInput) {
    myNotifications(pagination: $pagination) {
      edges {
        node {
          id
          type
          title
          message
          read
          createdAt
          actionUrl
          link
          priority
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      totalCount
    }
    unreadNotificationsCount
  }
`;

const MARK_NOTIFICATION_AS_READ = gql`
  mutation MarkRescuerNotificationAsRead($id: ID!) {
    markNotificationAsRead(id: $id) {
      id
      read
    }
  }
`;

const MARK_ALL_NOTIFICATIONS_AS_READ = gql`
  mutation MarkAllRescuerNotificationsAsRead {
    markAllNotificationsAsRead {
      success
    }
  }
`;

type NotificationRecord = {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string | null;
  priority: string;
};

type NotificationsData = {
  myNotifications: {
    edges: Array<{ node: NotificationRecord }>;
    pageInfo: { hasNextPage: boolean; hasPreviousPage: boolean };
    totalCount: number;
  };
  unreadNotificationsCount: number;
};

/**
 * Rescuer Notifications Page
 * All notifications for rescuer
 * ✅ INTEGRATED: Uses timeline data from assigned rescues
 */

export default function RescuerNotificationsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);
  const { data, loading, error, refetch } = useQuery<NotificationsData>(
    MY_NOTIFICATIONS,
    {
      variables: { pagination: { limit: pageSize, page: currentPage } },
      pollInterval: 30000,
      fetchPolicy: 'no-cache',
    },
  );
  const [markNotificationAsRead] = useMutation(MARK_NOTIFICATION_AS_READ);
  const [markAllNotificationsAsRead] = useMutation(
    MARK_ALL_NOTIFICATIONS_AS_READ,
  );
  const notifications =
    data?.myNotifications?.edges?.map((edge) => edge.node) || [];
  const serverNotificationCount = data?.myNotifications?.totalCount || 0;
  const unreadCount = data?.unreadNotificationsCount || 0;
  const filteredNotifications =
    activeTab === 'unread'
      ? notifications.filter((notification) => !notification.read)
      : notifications;

  const markAsRead = async (id: string, actionUrl?: string | null) => {
    try {
      await markNotificationAsRead({
        variables: { id },
        refetchQueries: ['RecentNotifications'],
      });
      await refetch();
      if (actionUrl) window.location.assign(actionUrl);
    } catch (markError) {
      toast.error(
        markError instanceof Error
          ? markError.message
          : 'Unable to mark notification as read',
      );
    }
  };

  const markAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead({
        refetchQueries: ['RecentNotifications'],
        update(cache) {
          cache.modify({
            fields: {
              unreadNotificationsCount: () => 0,
            },
          });
        },
      });
      await refetch();
      toast.success('All notifications marked as read');
    } catch (markError) {
      toast.error(
        markError instanceof Error
          ? markError.message
          : 'Unable to mark notifications as read',
      );
    }
  };

  // Show error toast
  if (error) toast.error(`Failed to load notifications: ${error.message}`);

  const getIcon = (type: string) => {
    switch (type) {
      case 'NEW_ASSIGNMENT':
        return <User className="h-5 w-5 text-blue-600" />;
      case 'RESCUE_UPDATE':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'SYSTEM':
        return <Bell className="h-5 w-5 text-gray-600" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Loading State */}
      {loading && (
        <Card className="p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
          <p className="text-gray-600 dark:text-gray-400">
            Loading notifications...
          </p>
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
                    : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200',
                )}
              >
                All Notifications ({serverNotificationCount})
              </button>
              <button
                onClick={() => setActiveTab('unread')}
                className={cn(
                  'pb-3 px-1 border-b-2 font-medium transition-colors',
                  activeTab === 'unread'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200',
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
                    !notification.read &&
                      'border-l-4 border-l-primary bg-blue-50 dark:bg-blue-950',
                  )}
                  onClick={() =>
                    markAsRead(notification.id, notification.actionUrl)
                  }
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1">{getIcon(notification.type)}</div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3
                            className={cn(
                              'font-semibold',
                              !notification.read && 'text-primary',
                            )}
                          >
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
                          {formatTime(notification.createdAt)}
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

          <DashboardPagination
            page={currentPage}
            pageSize={pageSize}
            totalCount={serverNotificationCount}
            pageInfo={data?.myNotifications?.pageInfo}
            onPageChange={setCurrentPage}
            onPageSizeChange={(nextPageSize) => {
              setPageSize(nextPageSize);
              setCurrentPage(1);
            }}
            itemLabel="notifications"
            alwaysShow
          />
        </>
      )}
    </div>
  );
}
