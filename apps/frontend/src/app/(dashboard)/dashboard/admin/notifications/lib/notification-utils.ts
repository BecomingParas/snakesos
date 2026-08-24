import type {
  AdminNotification,
  NotificationCategory,
  NotificationNode,
  NotificationSeverity,
} from '../types';

interface NotificationTypeConfig {
  category: NotificationCategory;
  severity: NotificationSeverity;
}

const TYPE_CONFIG: Record<string, NotificationTypeConfig> = {
  RESCUE_CREATED: { category: 'rescue', severity: 'info' },
  RESCUE_ASSIGNED: { category: 'rescue', severity: 'warning' },
  RESCUE_ACCEPTED: { category: 'rescue', severity: 'success' },
  RESCUE_COMPLETED: { category: 'rescue', severity: 'success' },
  RESCUE_CANCELLED: { category: 'rescue', severity: 'error' },
  VOLUNTEER_APPROVED: { category: 'user', severity: 'success' },
  VOLUNTEER_REJECTED: { category: 'user', severity: 'error' },
  SYSTEM_ALERT: { category: 'system', severity: 'error' },
  ANNOUNCEMENT: { category: 'system', severity: 'info' },
};

export function toAdminNotification(node: NotificationNode): AdminNotification {
  const config = TYPE_CONFIG[node.type] || { category: 'system', severity: 'info' };
  return {
    ...node,
    ...config,
    actionUrl: node.actionUrl || node.link,
  };
}

export function formatNotificationTime(value: string): string {
  const elapsed = Math.max(0, Date.now() - new Date(value).getTime());
  const minutes = Math.floor(elapsed / 60000);
  const hours = Math.floor(elapsed / 3600000);
  const days = Math.floor(elapsed / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export function filterCurrentPageNotifications(
  notifications: AdminNotification[],
  category: NotificationCategory | 'all',
  search: string,
): AdminNotification[] {
  const normalizedSearch = search.trim().toLowerCase();
  return notifications.filter((notification) => {
    const matchesCategory = category === 'all' || notification.category === category;
    const matchesSearch = !normalizedSearch ||
      `${notification.title} ${notification.message}`.toLowerCase().includes(normalizedSearch);
    return matchesCategory && matchesSearch;
  });
}
