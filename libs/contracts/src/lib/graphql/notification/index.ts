// ===================================================================
// NOTIFICATION - MODULE EXPORTS
// ===================================================================



export const notificationEnums = `# ===================================================================
# NOTIFICATION - ENUMS
# ===================================================================

"""
Type of notification
"""
enum NotificationType {
  RESCUE_CREATED
  RESCUE_ASSIGNED
  RESCUE_ACCEPTED
  RESCUE_COMPLETED
  RESCUE_CANCELLED
  VOLUNTEER_APPROVED
  VOLUNTEER_REJECTED
  RESCUER_APPLICATION_SUBMITTED
  TRAINING_SCHEDULED
  TRAINING_REMINDER
  DONATION_RECEIVED
  SYSTEM_ALERT
  ANNOUNCEMENT
}

"""
Priority level of notification
"""
enum NotificationPriority {
  LOW
  NORMAL
  HIGH
  URGENT
}

"""
Delivery channel for notification
"""
enum NotificationChannel {
  APP
  EMAIL
  SMS
  TELEGRAM
  PUSH
}
`;
export const notificationSchema = `# ===================================================================
# NOTIFICATION - TYPE DEFINITIONS
# ===================================================================

"""
User notification
"""
type Notification {
  id: ID!
  
  # Recipient
  user: User!
  
  # Content
  type: NotificationType!
  title: String!
  message: String!
  link: String
  actionUrl: String
  
  # Delivery Channels
  sentViaApp: Boolean!
  sentViaEmail: Boolean!
  sentViaSMS: Boolean!
  sentViaTelegram: Boolean!
  
  # Status
  read: Boolean!
  readAt: DateTime
  
  # Context
  rescue: RescueRequest
  
  # Metadata
  metadata: JSON
  priority: NotificationPriority!
  expiresAt: DateTime
  
  createdAt: DateTime!
}

"""
Notification statistics
"""
type NotificationStats {
  total: Int!
  unread: Int!
  byType: [NotificationByType!]!
  byPriority: [NotificationByPriority!]!
  deliveryStats: NotificationDeliveryStats!
}

"""
Notification count by type
"""
type NotificationByType {
  type: NotificationType!
  count: Int!
  unreadCount: Int!
}

"""
Notification count by priority
"""
type NotificationByPriority {
  priority: NotificationPriority!
  count: Int!
}

"""
Notification delivery statistics
"""
type NotificationDeliveryStats {
  app: Int!
  email: Int!
  sms: Int!
  telegram: Int!
  totalDelivered: Int!
  totalFailed: Int!
}

"""
Notification preferences
"""
type NotificationPreferences {
  userId: ID!

  highPriorityRescueAlerts: Boolean!
  rescueCompletionNotifications: Boolean!
  newUserRegistrations: Boolean!
  systemAlerts: Boolean!
  dailySummaryReports: Boolean!
  
  # Channel Preferences
  enableApp: Boolean!
  enableEmail: Boolean!
  enableSMS: Boolean!
  enableTelegram: Boolean!
  
  # Type Preferences
  rescueUpdates: Boolean!
  volunteerUpdates: Boolean!
  trainingReminders: Boolean!
  donationReceipts: Boolean!
  systemAnnouncements: Boolean!
  
  # Quiet Hours
  quietHoursStart: String
  quietHoursEnd: String
  timezone: String!
  
  updatedAt: DateTime!
}
`;
export const notificationInputs = `# ===================================================================
# NOTIFICATION - INPUT TYPES
# ===================================================================

"""
Input for creating a notification
"""
input CreateNotificationInput {
  userId: ID!
  type: NotificationType!
  title: String!
  message: String!
  link: String
  actionUrl: String
  rescueId: ID
  priority: NotificationPriority
  channels: [NotificationChannel!]
  metadata: JSON
  expiresAt: DateTime
}

"""
Input for sending bulk notifications
"""
input BulkNotificationInput {
  userIds: [ID!]!
  type: NotificationType!
  title: String!
  message: String!
  link: String
  priority: NotificationPriority
  channels: [NotificationChannel!]
}

"""
Filter input for notification queries
"""
input NotificationFilterInput {
  type: NotificationType
  types: [NotificationType!]
  priority: NotificationPriority
  priorities: [NotificationPriority!]
  read: Boolean
  rescueId: ID
  createdAfter: DateTime
  createdBefore: DateTime
}

"""
Sort input for notification queries
"""
input NotificationSortInput {
  field: NotificationSortField!
  order: SortOrder!
}

"""
Fields available for sorting notifications
"""
enum NotificationSortField {
  CREATED_AT
  PRIORITY
  TYPE
  READ_AT
}

"""
Input for updating notification preferences
"""
input UpdateNotificationPreferencesInput {
  highPriorityRescueAlerts: Boolean
  rescueCompletionNotifications: Boolean
  newUserRegistrations: Boolean
  systemAlerts: Boolean
  dailySummaryReports: Boolean
  enableApp: Boolean
  enableEmail: Boolean
  enableSMS: Boolean
  enableTelegram: Boolean
  rescueUpdates: Boolean
  volunteerUpdates: Boolean
  trainingReminders: Boolean
  donationReceipts: Boolean
  systemAnnouncements: Boolean
  quietHoursStart: String
  quietHoursEnd: String
  timezone: String
}
`;
export const notificationQueries = `# ===================================================================
# NOTIFICATION - QUERIES
# ===================================================================

extend type Query {
  """
  Get notification by ID
  """
  notification(id: ID!): Notification @auth
  
  """
  Get my notifications
  """
  myNotifications(
    pagination: PaginationInput
    filter: NotificationFilterInput
    sort: NotificationSortInput
  ): NotificationConnection! @auth
  
  """
  Get unread notifications count
  """
  unreadNotificationsCount: Int! @auth
  
  """
  Get notification statistics
  """
  notificationStats(userId: ID): NotificationStats! @auth
  
  """
  Get notification preferences
  """
  myNotificationPreferences: NotificationPreferences! @auth
}

"""
Connection type for paginated notification results
"""
type NotificationConnection {
  edges: [NotificationEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

"""
Edge type for notification connection
"""
type NotificationEdge {
  node: Notification!
  cursor: String!
}
`;
export const notificationMutations = `# ===================================================================
# NOTIFICATION - MUTATIONS
# ===================================================================

extend type Mutation {
  """
  Create a notification (admin only)
  """
  createNotification(input: CreateNotificationInput!): Notification! @auth(requires: [ADMIN, SUPER_ADMIN])
  
  """
  Send bulk notifications (admin only)
  """
  sendBulkNotifications(input: BulkNotificationInput!): BulkOperationResult! @auth(requires: [ADMIN, SUPER_ADMIN])
  
  """
  Mark notification as read
  """
  markNotificationAsRead(id: ID!): Notification! @auth
  
  """
  Mark all notifications as read
  """
  markAllNotificationsAsRead: SuccessResponse! @auth
  
  """
  Delete notification
  """
  deleteNotification(id: ID!): SuccessResponse! @auth
  
  """
  Delete all read notifications
  """
  deleteReadNotifications: SuccessResponse! @auth
  
  """
  Update notification preferences
  """
  updateNotificationPreferences(input: UpdateNotificationPreferencesInput!): NotificationPreferences! @auth
  
  """
  Test notification delivery
  """
  testNotificationDelivery(channel: NotificationChannel!): SuccessResponse! @auth
}
`;
export const notificationSubscriptions = `# ===================================================================
# NOTIFICATION - SUBSCRIPTIONS
# ===================================================================

extend type Subscription {
  """
  Subscribe to new notifications
  """
  notificationReceived(userId: ID!): Notification! @auth
  
  """
  Subscribe to notification read events
  """
  notificationRead(userId: ID!): NotificationReadEvent! @auth
  
  """
  Subscribe to unread count changes
  """
  unreadCountChanged(userId: ID!): UnreadCountEvent! @auth
}

"""
Notification read event
"""
type NotificationReadEvent {
  notification: Notification!
  userId: ID!
  readAt: DateTime!
}

"""
Unread count change event
"""
type UnreadCountEvent {
  userId: ID!
  unreadCount: Int!
  changedAt: DateTime!
}
`;
export const notificationFragments = `# ===================================================================
# NOTIFICATION - REUSABLE FRAGMENTS
# ===================================================================

"""
Core notification fields
"""
fragment NotificationCore on Notification {
  id
  type
  title
  message
  read
  priority
  createdAt
}

"""
Notification with link
"""
fragment NotificationWithLink on Notification {
  ...NotificationCore
  link
  actionUrl
}

"""
Notification with context
"""
fragment NotificationWithContext on Notification {
  ...NotificationWithLink
  rescue {
    id
    referenceNumber
    status
  }
  metadata
}

"""
Full notification details
"""
fragment NotificationFull on Notification {
  ...NotificationWithContext
  user {
    id
    name
    email
  }
  sentViaApp
  sentViaEmail
  sentViaSMS
  sentViaTelegram
  readAt
  expiresAt
}

"""
Notification list item
"""
fragment NotificationListItem on Notification {
  ...NotificationCore
  link
  readAt
}

"""
Notification preferences
"""
fragment NotificationPreferencesFields on NotificationPreferences {
  userId
  enableApp
  enableEmail
  enableSMS
  enableTelegram
  rescueUpdates
  volunteerUpdates
  trainingReminders
  donationReceipts
  systemAnnouncements
  quietHoursStart
  quietHoursEnd
  timezone
  updatedAt
}
`;

// Combine all notification type definitions
export const notificationTypeDefs = [
  notificationEnums,
  notificationSchema,
  notificationInputs,
  notificationQueries,
  notificationMutations,
  notificationSubscriptions,
  notificationFragments,
].join('\n\n');

// Export operations for code generation
export const notificationOperations = {
  queries: notificationQueries,
  mutations: notificationMutations,
  subscriptions: notificationSubscriptions,
};

// Export fragments for reuse
export const notificationFragmentDefinitions = notificationFragments;
