'use client';

import { gql } from '@apollo/client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Bell,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useMutation, useQuery } from '@/lib/apollo/hooks';
import { DashboardPagination } from '@/components/dashboard/dashboard-pagination';
import { toast } from 'sonner';

/**
 * Citizen Notifications Page
 * Shows all notifications for the citizen
 */

const MY_NOTIFICATIONS = gql`
  query CitizenNotifications($pagination: PaginationInput) {
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
  mutation MarkCitizenNotificationAsRead($id: ID!) {
    markNotificationAsRead(id: $id) {
      id
      read
    }
  }
`;

const MARK_ALL_NOTIFICATIONS_AS_READ = gql`
  mutation MarkAllCitizenNotificationsAsRead {
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
  link?: string | null;
  priority: string;
};

type NotificationsData = {
  myNotifications: {
    edges: Array<{ node: NotificationRecord }>;
    pageInfo: { hasNextPage: boolean; hasPreviousPage: boolean };
    totalCount: number;
  };
};

const NOTIFICATION_ICONS = {
  RESCUE_CREATED: Clock,
  RESCUE_ASSIGNED: Bell,
  RESCUE_ACCEPTED: CheckCircle,
  RESCUE_IN_PROGRESS: AlertCircle,
  RESCUE_COMPLETED: CheckCircle,
  RESCUE_CANCELLED: X,
};

export default function CitizenNotificationsPage() {
  const router = useRouter();
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
    data?.myNotifications?.edges.map(({ node }) => node) || [];
  const totalCount = data?.myNotifications?.totalCount || 0;
  const unreadCount = data?.unreadNotificationsCount || 0;
  const filteredNotifications =
    activeTab === 'unread'
      ? notifications.filter((notification) => !notification.read)
      : notifications;

  const handleMarkAsRead = async (notification: NotificationRecord) => {
    try {
      if (!notification.read) {
        await markNotificationAsRead({
          variables: { id: notification.id },
          refetchQueries: ['RecentNotifications'],
        });
        await refetch();
      }
      const destination = notification.actionUrl || notification.link;
      if (destination) router.push(destination);
    } catch (markError) {
      toast.error(
        markError instanceof Error
          ? markError.message
          : 'Unable to mark notification as read',
      );
    }
  };

  const handleMarkAllAsRead = async () => {
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

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Notifications
              </h1>
              <p className="mt-1 text-muted-foreground">
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
            <p className="text-muted-foreground">Loading notifications...</p>
          </Card>
        )}

        {/* Tabs */}
        {!loading && (
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as 'all' | 'unread')}
            className="space-y-6"
          >
            <TabsList>
              <TabsTrigger value="all">All ({totalCount})</TabsTrigger>
              <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-3">
              {notifications.length > 0 ? (
                notifications.map((notification) => {
                  const Icon =
                    NOTIFICATION_ICONS[
                      notification.type as keyof typeof NOTIFICATION_ICONS
                    ] || Bell;
                  return (
                    <Card
                      key={notification.id}
                      className={cn(
                        'cursor-pointer p-4 transition-colors hover:border-primary',
                        !notification.read &&
                          'border-l-4 border-l-primary bg-blue-50 dark:bg-blue-950/20',
                      )}
                      onClick={() => void handleMarkAsRead(notification)}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={cn(
                            'p-2 rounded-full',
                            notification.priority === 'HIGH'
                              ? 'bg-red-100 dark:bg-red-900/20'
                              : 'bg-blue-100 dark:bg-blue-900/20',
                          )}
                        >
                          <Icon
                            className={cn(
                              'h-5 w-5',
                              notification.priority === 'HIGH'
                                ? 'text-red-600'
                                : 'text-blue-600',
                            )}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="font-semibold">
                              {notification.title}
                            </h3>
                            {!notification.read && (
                              <Badge className="bg-primary text-white shrink-0">
                                New
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </Card>
                  );
                })
              ) : (
                <Card className="p-12 text-center">
                  <Bell className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-semibold">
                    No Notifications
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    You don't have any notifications yet
                  </p>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="unread" className="space-y-3">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification) => {
                  const Icon =
                    NOTIFICATION_ICONS[
                      notification.type as keyof typeof NOTIFICATION_ICONS
                    ] || Bell;
                  return (
                    <Card
                      key={notification.id}
                      className="cursor-pointer border-l-4 border-l-primary bg-blue-50 p-4 transition-colors hover:border-primary dark:bg-blue-950/20"
                      onClick={() => void handleMarkAsRead(notification)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="rounded-full bg-blue-100 p-2">
                          <Icon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="font-semibold">
                              {notification.title}
                            </h3>
                            <Badge className="bg-primary text-white shrink-0">
                              New
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </Card>
                  );
                })
              ) : (
                <Card className="p-12 text-center">
                  <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                  <h3 className="mt-4 text-lg font-semibold">All Caught Up!</h3>
                  <p className="mt-2 text-muted-foreground">
                    You've read all your notifications
                  </p>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        )}

        {error && (
          <Card className="p-6 text-center">
            <p className="text-sm text-destructive">
              Failed to load notifications. Please try again.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => void refetch()}
            >
              Try again
            </Button>
          </Card>
        )}

        <DashboardPagination
          page={currentPage}
          pageSize={pageSize}
          totalCount={totalCount}
          pageInfo={data?.myNotifications?.pageInfo}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
          itemLabel="notifications"
        />
      </div>
    </div>
  );
}
