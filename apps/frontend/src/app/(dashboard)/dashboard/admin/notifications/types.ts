'use client';

export type NotificationCategory = 'rescue' | 'user' | 'system';
export type NotificationSeverity = 'info' | 'success' | 'warning' | 'error';
export type NotificationStatus = 'all' | 'unread' | 'read';

export interface NotificationNode {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string | null;
  link?: string | null;
  createdAt: string;
}

export interface AdminNotification {
  id: string;
  type: string;
  severity: NotificationSeverity;
  category: NotificationCategory;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string | null;
}

export interface NotificationConnection {
  edges: Array<{ node: NotificationNode }>;
  totalCount: number;
  pageInfo: { hasNextPage: boolean; hasPreviousPage: boolean };
}

export interface AdminNotificationsData {
  myNotifications: NotificationConnection;
}
