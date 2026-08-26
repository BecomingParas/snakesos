'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { DashboardPagination } from '@/components/dashboard/dashboard-pagination';
import { useAdminNotifications } from './hooks/use-admin-notifications';
import {
  filterCurrentPageNotifications,
  toAdminNotification,
} from './lib/notification-utils';
import type {
  AdminNotification,
  NotificationCategory,
  NotificationStatus,
} from './types';
import {
  DeleteNotificationDialog,
  NotificationList,
  NotificationStats,
  NotificationsHeader,
  NotificationToolbar,
} from './components/notification-center';

export default function AdminNotificationsPage() {
  const [status, setStatus] = useState<NotificationStatus>('all');
  const [category, setCategory] = useState<NotificationCategory | 'all'>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deleteTarget, setDeleteTarget] = useState<AdminNotification | null>(
    null,
  );
  const {
    data,
    error,
    loading,
    refetch,
    notifications,
    markRead,
    markAllRead,
    deleteNotification,
    markAllReadState,
    deleteState,
  } = useAdminNotifications(page, pageSize, status);

  useEffect(() => {
    setPage(1);
  }, [status, category, search]);

  const currentPageNotifications = useMemo(
    () => notifications.map(({ node }) => toAdminNotification(node)),
    [notifications],
  );
  const visibleNotifications = useMemo(
    () =>
      filterCurrentPageNotifications(
        currentPageNotifications,
        category,
        search,
      ),
    [currentPageNotifications, category, search],
  );
  const unreadCount = currentPageNotifications.filter(
    (notification) => !notification.read,
  ).length;
  const clearFilters = () => {
    setSearch('');
    setCategory('all');
  };

  const handleRead = async (id: string) => {
    try {
      await markRead(id);
    } catch {
      toast.error('Unable to mark notification as read');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllRead();
      toast.success('All notifications marked as read');
    } catch {
      toast.error('Unable to mark notifications as read');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteNotification(deleteTarget.id);
      setDeleteTarget(null);
      toast.success('Notification deleted');
    } catch {
      toast.error('Unable to delete notification');
    }
  };

  return (
    <main className="min-h-screen bg-background p-4 text-foreground sm:p-6">
      <div className="w-full max-w-none space-y-6">
        <NotificationsHeader
          unreadCount={unreadCount}
          loading={markAllReadState.loading}
          onMarkAllRead={handleMarkAllRead}
        />
        {!loading && !error && (
          <NotificationStats
            notifications={currentPageNotifications}
            totalCount={data?.myNotifications.totalCount || 0}
          />
        )}
        <NotificationToolbar
          status={status}
          category={category}
          search={search}
          onStatusChange={setStatus}
          onCategoryChange={setCategory}
          onSearchChange={setSearch}
          onClear={clearFilters}
        />
        <NotificationList
          notifications={visibleNotifications}
          loading={loading}
          error={error}
          onRetry={() => void refetch()}
          onRead={handleRead}
          onDelete={setDeleteTarget}
          hasFilters={Boolean(search || category !== 'all')}
          onClear={clearFilters}
        />
        {!loading && !error && (
          <DashboardPagination
            page={page}
            pageSize={pageSize}
            totalCount={data?.myNotifications.totalCount || 0}
            pageInfo={data?.myNotifications.pageInfo}
            onPageChange={setPage}
            onPageSizeChange={(nextPageSize) => {
              setPageSize(nextPageSize);
              setPage(1);
            }}
            itemLabel="notifications"
            pageSizeOptions={[10, 20, 30]}
          />
        )}
      </div>
      <DeleteNotificationDialog
        notification={deleteTarget}
        loading={deleteState.loading}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => void handleDelete()}
      />
    </main>
  );
}
