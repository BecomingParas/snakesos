'use client';

import { gql } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { Bell, CheckCheck, ChevronRight, Loader2 } from 'lucide-react';
import { useQuery } from '@/lib/apollo/hooks';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatNotificationTime } from '@/app/(dashboard)/dashboard/admin/notifications/lib/notification-utils';

interface RecentNotification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string | null;
  link?: string | null;
}

interface NotificationsQueryData {
  myNotifications: {
    edges: Array<{ node: RecentNotification }>;
  };
}

const RECENT_NOTIFICATIONS_QUERY = gql`
  query RecentNotifications($pagination: PaginationInput) {
    myNotifications(pagination: $pagination) {
      edges {
        node {
          id
          title
          message
          read
          createdAt
          actionUrl
          link
        }
      }
    }
  }
`;

function notificationPath(role: string) {
  return `/dashboard/${role.toLowerCase().replace('_', '-')}/notifications`;
}

export function NotificationDropdown({ role }: { role: string }) {
  const router = useRouter();
  const { data, loading } = useQuery<NotificationsQueryData>(
    RECENT_NOTIFICATIONS_QUERY,
    {
      variables: { pagination: { limit: 3, page: 1 } },
      fetchPolicy: 'cache-and-network',
      pollInterval: 30000,
    },
  );
  const notifications =
    data?.myNotifications.edges.map(({ node }) => node) || [];
  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;
  const goToNotifications = () => router.push(notificationPath(role));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-10 w-10 hover:bg-secondary/50"
          aria-label="Open notifications"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 border-border bg-popover p-0"
      >
        <DropdownMenuLabel className="flex items-center justify-between px-3 py-2">
          <span className="text-sm">Recent notifications</span>
          {unreadCount > 0 && (
            <Badge variant="destructive">{unreadCount} new</Badge>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {loading && (
          <div className="flex items-center justify-center gap-2 px-3 py-5 text-xs text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Loading...
          </div>
        )}
        {!loading && notifications.length === 0 && (
          <div className="px-3 py-5 text-center text-xs text-muted-foreground">
            <Bell className="mx-auto mb-1.5 h-5 w-5" />
            No recent notifications
          </div>
        )}
        {!loading &&
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className="items-start gap-2 px-3 py-2"
              onClick={() =>
                router.push(
                  notification.actionUrl ||
                    notification.link ||
                    notificationPath(role),
                )
              }
            >
              <span
                className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${notification.read ? 'bg-muted' : 'bg-primary'}`}
                aria-label={notification.read ? 'Read' : 'Unread'}
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-medium text-foreground">
                  {notification.title}
                </span>
                <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
                  {notification.message}
                </span>
                <span className="mt-0.5 block text-[10px] text-muted-foreground">
                  {formatNotificationTime(notification.createdAt)}
                </span>
              </span>
              <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            </DropdownMenuItem>
          ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="justify-center px-3 py-2 text-xs font-medium text-primary"
          onClick={goToNotifications}
        >
          <CheckCheck className="mr-1.5 h-3.5 w-3.5" />
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
