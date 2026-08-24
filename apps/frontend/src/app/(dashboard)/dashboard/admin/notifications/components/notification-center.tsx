import { useRouter } from 'next/navigation';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  Bell,
  CheckCircle,
  CheckCheck,
  Filter,
  Info,
  Search,
  Settings,
  Trash2,
  User,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import type {
  AdminNotification,
  NotificationCategory,
  NotificationSeverity,
  NotificationStatus,
} from '../types';
import { formatNotificationTime } from '../lib/notification-utils';

const severityStyles: Record<
  NotificationSeverity,
  { icon: typeof Bell; color: string; accent: string }
> = {
  info: { icon: Info, color: 'text-info', accent: 'border-l-info bg-info/5' },
  success: {
    icon: CheckCircle,
    color: 'text-success',
    accent: 'border-l-success bg-success/5',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-warning',
    accent: 'border-l-warning bg-warning/5',
  },
  error: {
    icon: AlertCircle,
    color: 'text-destructive',
    accent: 'border-l-destructive bg-destructive/5',
  },
};

const categoryIcons: Record<NotificationCategory, typeof Bell> = {
  rescue: Activity,
  user: User,
  system: Settings,
};

export function NotificationsHeader({
  unreadCount,
  loading,
  onMarkAllRead,
}: {
  unreadCount: number;
  loading: boolean;
  onMarkAllRead: () => void;
}) {
  return (
    <header className="flex flex-col gap-5 border-b border-border pb-6 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Bell className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Notifications
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Stay current with rescue operations and system activity.
          </p>
          <p className="mt-2 text-sm font-medium text-foreground">
            {unreadCount} unread notification{unreadCount === 1 ? '' : 's'}
          </p>
        </div>
      </div>
      <Button
        type="button"
        onClick={onMarkAllRead}
        disabled={loading || unreadCount === 0}
      >
        {loading ? (
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          <CheckCheck className="mr-2 h-4 w-4" />
        )}
        {loading ? 'Marking...' : 'Mark all as read'}
      </Button>
    </header>
  );
}

export function NotificationStats({
  notifications,
  totalCount,
}: {
  notifications: AdminNotification[];
  totalCount: number;
}) {
  const unread = notifications.filter((item) => !item.read).length;
  const rescues = notifications.filter(
    (item) => item.category === 'rescue',
  ).length;
  const systems = notifications.filter(
    (item) => item.category === 'system',
  ).length;
  const stats = [
    ['Total', totalCount, Bell],
    ['Unread on page', unread, Bell],
    ['Rescue on page', rescues, Activity],
    ['System on page', systems, Settings],
  ] as const;
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map(([label, value, Icon]) => (
        <Card key={label} className="border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              {label}
            </span>
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
        </Card>
      ))}
    </div>
  );
}

export function NotificationToolbar({
  status,
  category,
  search,
  onStatusChange,
  onCategoryChange,
  onSearchChange,
  onClear,
}: {
  status: NotificationStatus;
  category: NotificationCategory | 'all';
  search: string;
  onStatusChange: (value: NotificationStatus) => void;
  onCategoryChange: (value: NotificationCategory | 'all') => void;
  onSearchChange: (value: string) => void;
  onClear: () => void;
}) {
  return (
    <Card className="border-border bg-card p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search this page of notifications..."
            className="pl-9"
            aria-label="Search notifications"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div
            className="flex items-center gap-1 rounded-md border border-border p-1"
            aria-label="Notification status"
          >
            <Button
              type="button"
              size="sm"
              variant={status === 'all' ? 'default' : 'ghost'}
              onClick={() => onStatusChange('all')}
            >
              All
            </Button>
            <Button
              type="button"
              size="sm"
              variant={status === 'unread' ? 'default' : 'ghost'}
              onClick={() => onStatusChange('unread')}
            >
              Unread
            </Button>
            <Button
              type="button"
              size="sm"
              variant={status === 'read' ? 'default' : 'ghost'}
              onClick={() => onStatusChange('read')}
            >
              Read
            </Button>
          </div>
          <Select
            value={category}
            onValueChange={(value) =>
              onCategoryChange(value as NotificationCategory | 'all')
            }
          >
            <SelectTrigger className="w-[150px]">
              <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              <SelectItem value="rescue">Rescue</SelectItem>
              <SelectItem value="user">Users</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
          {(search || category !== 'all') && (
            <Button type="button" variant="ghost" size="sm" onClick={onClear}>
              Clear filters
            </Button>
          )}
        </div>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Search and category filters apply to the current page.
      </p>
    </Card>
  );
}

function NotificationIcon({
  notification,
}: {
  notification: AdminNotification;
}) {
  const Icon = severityStyles[notification.severity].icon;
  return (
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-background ${severityStyles[notification.severity].color}`}
    >
      <Icon className="h-5 w-5" />
    </div>
  );
}

export function NotificationCard({
  notification,
  onRead,
  onDelete,
}: {
  notification: AdminNotification;
  onRead: (id: string) => void;
  onDelete: (notification: AdminNotification) => void;
}) {
  const router = useRouter();
  const CategoryIcon = categoryIcons[notification.category];
  const style = severityStyles[notification.severity];
  return (
    <Card
      className={`border-border border-l-4 p-4 transition-colors hover:bg-muted/30 ${!notification.read ? style.accent : 'bg-card'}`}
    >
      <div className="flex gap-3">
        <NotificationIcon notification={notification} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 items-center gap-2">
              <h3
                className={`truncate text-sm ${notification.read ? 'font-medium' : 'font-semibold'} text-foreground`}
              >
                {notification.title}
              </h3>
              {!notification.read && (
                <span
                  className="h-2 w-2 shrink-0 rounded-full bg-primary"
                  aria-label="Unread"
                />
              )}
            </div>
            <time
              className="shrink-0 text-xs text-muted-foreground"
              dateTime={notification.createdAt}
            >
              {formatNotificationTime(notification.createdAt)}
            </time>
          </div>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {notification.message}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <CategoryIcon className="h-3.5 w-3.5" />
              {notification.category}
            </Badge>
            <Badge variant="outline" className={style.color}>
              {notification.severity}
            </Badge>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() =>
                notification.actionUrl && router.push(notification.actionUrl)
              }
              disabled={!notification.actionUrl}
            >
              View details
            </Button>
            {!notification.read && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => onRead(notification.id)}
              >
                <CheckCheck className="mr-1.5 h-4 w-4" />
                Mark read
              </Button>
            )}
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="text-destructive hover:text-destructive"
              onClick={() => onDelete(notification)}
              aria-label="Delete notification"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function NotificationList({
  notifications,
  loading,
  error,
  onRetry,
  onRead,
  onDelete,
  hasFilters,
  onClear,
}: {
  notifications: AdminNotification[];
  loading: boolean;
  error?: Error;
  onRetry: () => void;
  onRead: (id: string) => void;
  onDelete: (notification: AdminNotification) => void;
  hasFilters: boolean;
  onClear: () => void;
}) {
  if (loading)
    return (
      <div className="space-y-3" aria-label="Loading notifications">
        {Array.from({ length: 5 }, (_, index) => (
          <Card key={index} className="flex gap-3 border-border p-5">
            <Skeleton className="h-10 w-10 shrink-0" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-8 w-32" />
            </div>
          </Card>
        ))}
      </div>
    );
  if (error)
    return (
      <Card className="border-destructive/30 bg-destructive/5 p-10 text-center">
        <AlertCircle className="mx-auto h-10 w-10 text-destructive" />
        <h2 className="mt-3 font-semibold text-foreground">
          Unable to load notifications
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Something went wrong while loading your notifications.
        </p>
        <Button type="button" className="mt-4" onClick={onRetry}>
          Try again
        </Button>
      </Card>
    );
  if (!notifications.length)
    return (
      <Card className="border-border p-10 text-center">
        <Bell className="mx-auto h-10 w-10 text-muted-foreground" />
        <h2 className="mt-3 font-semibold text-foreground">
          {hasFilters ? 'No matching notifications' : 'No notifications yet'}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {hasFilters
            ? 'Try changing your search or filters.'
            : 'When activity occurs, notifications will appear here.'}
        </p>
        {hasFilters && (
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={onClear}
          >
            Clear filters
          </Button>
        )}
      </Card>
    );
  return (
    <div className="space-y-3">
      {notifications.map((notification) => (
        <NotificationCard
          key={notification.id}
          notification={notification}
          onRead={onRead}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export function DeleteNotificationDialog({
  notification,
  loading,
  onCancel,
  onConfirm,
}: {
  notification: AdminNotification | null;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog
      open={Boolean(notification)}
      onOpenChange={(open) => !open && onCancel()}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete notification?</AlertDialogTitle>
          <AlertDialogDescription>
            This notification will be permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={loading}>
            {loading ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
