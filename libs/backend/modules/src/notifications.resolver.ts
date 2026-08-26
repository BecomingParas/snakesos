import { GraphQLContext } from '@snake-rescue/core';
import { prisma } from '@snake-rescue/database';

const ADMIN_ROLES = ['ADMIN', 'SUPER_ADMIN'];

function notificationWhere(context: GraphQLContext, filter?: any) {
  const where: any = { userId: context.user!.id };
  if (filter?.type) where.type = filter.type;
  if (filter?.types?.length) where.type = { in: filter.types };
  if (filter?.priority) where.priority = filter.priority;
  if (filter?.priorities?.length) where.priority = { in: filter.priorities };
  if (typeof filter?.read === 'boolean') where.read = filter.read;
  if (filter?.rescueId) where.rescueId = filter.rescueId;
  if (filter?.createdAfter || filter?.createdBefore) {
    where.createdAt = {};
    if (filter.createdAfter)
      where.createdAt.gte = new Date(filter.createdAfter);
    if (filter.createdBefore)
      where.createdAt.lte = new Date(filter.createdBefore);
  }
  return where;
}

function notificationOrder(sort?: any) {
  const fields: Record<string, string> = {
    CREATED_AT: 'createdAt',
    PRIORITY: 'priority',
    TYPE: 'type',
    READ_AT: 'readAt',
  };
  return {
    [fields[sort?.field] || 'createdAt']:
      sort?.order === 'ASC' ? 'asc' : 'desc',
  };
}

function graphqlNotificationPriority(priority: string) {
  if (priority === 'MEDIUM') return 'NORMAL';
  if (['LOW', 'NORMAL', 'HIGH', 'URGENT'].includes(priority)) {
    return priority;
  }
  return 'NORMAL';
}

function channelsData(channels?: string[]) {
  const selected = channels?.length ? channels : ['APP'];
  return {
    sentViaApp: selected.includes('APP') || selected.includes('PUSH'),
    sentViaEmail: selected.includes('EMAIL'),
    sentViaSMS: selected.includes('SMS'),
    sentViaTelegram: selected.includes('TELEGRAM'),
  };
}

function rescueNotificationType(status: string) {
  switch (status) {
    case 'COMPLETED':
      return 'RESCUE_COMPLETED';
    case 'CANCELLED':
      return 'RESCUE_CANCELLED';
    case 'ASSIGNED':
      return 'RESCUE_ASSIGNED';
    case 'ACCEPTED':
      return 'RESCUE_ACCEPTED';
    default:
      return 'RESCUE_CREATED';
  }
}

async function ensureCurrentRescueNotifications(context: GraphQLContext) {
  const isAdmin = ADMIN_ROLES.includes(context.user!.role);
  const isRescuer = [
    'VOLUNTEER',
    'VERIFIED_RESCUER',
    'DISTRICT_COORDINATOR',
  ].includes(context.user!.role);
  const where = {
    deletedAt: null,
    ...(isAdmin
      ? {}
      : isRescuer
        ? { assignedVolunteer: { userId: context.user!.id } }
        : { userId: context.user!.id }),
  };
  const rescues = await prisma.rescueRequest.findMany({
    where,
    orderBy: { updatedAt: 'desc' },
    take: 100,
    select: {
      id: true,
      status: true,
      priority: true,
      referenceNumber: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  await Promise.all(
    rescues.map(async (rescue) => {
      const type = rescueNotificationType(rescue.status);
      const exists = await prisma.notification.findFirst({
        where: { userId: context.user!.id, rescueId: rescue.id, type },
        select: { id: true },
      });
      if (exists) return;

      const reference = rescue.referenceNumber || rescue.id;
      await prisma.notification.create({
        data: {
          userId: context.user!.id,
          rescueId: rescue.id,
          type,
          title: `Rescue ${rescue.status.toLowerCase().replace('_', ' ')}`,
          message: `Rescue request ${reference} is currently ${rescue.status.toLowerCase().replace('_', ' ')}.`,
          actionUrl: isAdmin
            ? `/dashboard/admin/rescues/${rescue.id}`
            : `/dashboard/${isRescuer ? 'rescuer' : 'citizen'}/requests/${rescue.id}`,
          priority: 'NORMAL',
          createdAt: rescue.updatedAt || rescue.createdAt,
        },
      });
    }),
  );
}

export async function createRescueNotifications(
  rescueId: string,
  type: string,
  title: string,
  message: string,
  actorId?: string,
) {
  const rescue = await prisma.rescueRequest.findUnique({
    where: { id: rescueId },
    select: { userId: true, assignedVolunteer: { select: { userId: true } } },
  });
  if (!rescue) return;

  const admins = await prisma.user.findMany({
    where: { role: { in: ADMIN_ROLES as any }, status: 'ACTIVE' },
    select: { id: true },
  });
  const recipientIds = [
    ...new Set([
      rescue.userId,
      rescue.assignedVolunteer?.userId,
      ...admins.map((admin) => admin.id),
    ]),
  ].filter((id): id is string => Boolean(id) && id !== actorId);
  if (!recipientIds.length) return;

  await prisma.notification.createMany({
    data: recipientIds.map((userId) => ({
      userId,
      type: type as any,
      title,
      message,
      rescueId,
      actionUrl: `/dashboard/${ADMIN_ROLES.includes('ADMIN') && admins.some((admin) => admin.id === userId) ? 'admin/rescues' : 'citizen/requests'}/${rescueId}`,
      priority: type === 'RESCUE_CREATED' ? 'HIGH' : 'NORMAL',
    })),
  });
}

export const notificationResolvers = {
  Notification: {
    user: (parent: any) =>
      parent.user || prisma.user.findUnique({ where: { id: parent.userId } }),
    rescue: (parent: any) =>
      parent.rescue ||
      (parent.rescueId
        ? prisma.rescueRequest.findUnique({ where: { id: parent.rescueId } })
        : null),
  },
  Query: {
    notification: async (
      _: unknown,
      args: { id: string },
      context: GraphQLContext,
    ) => {
      context.requireAuth();
      return prisma.notification.findFirst({
        where: { id: args.id, userId: context.user.id },
      });
    },
    myNotifications: async (_: unknown, args: any, context: GraphQLContext) => {
      context.requireAuth();
      await ensureCurrentRescueNotifications(context);
      const limit = Math.min(args.pagination?.limit || 50, 100);
      const page = Math.max(args.pagination?.page || 1, 1);
      const where = notificationWhere(context, args.filter);
      const [items, totalCount] = await Promise.all([
        prisma.notification.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: notificationOrder(args.sort),
        }),
        prisma.notification.count({ where }),
      ]);
      return {
        edges: items.map((node) => ({
          node: {
            ...node,
            priority: graphqlNotificationPriority(node.priority),
          },
          cursor: node.id,
        })),
        pageInfo: {
          hasNextPage: page * limit < totalCount,
          hasPreviousPage: page > 1,
          startCursor: items[0]?.id || null,
          endCursor: items[items.length - 1]?.id || null,
        },
        totalCount,
      };
    },
    unreadNotificationsCount: async (
      _: unknown,
      _args: unknown,
      context: GraphQLContext,
    ) => {
      context.requireAuth();
      return prisma.notification.count({
        where: { userId: context.user.id, read: false },
      });
    },
    notificationStats: async (
      _: unknown,
      args: { userId?: string },
      context: GraphQLContext,
    ) => {
      context.requireAuth();
      const userId =
        args.userId && ADMIN_ROLES.includes(context.user.role)
          ? args.userId
          : context.user.id;
      const [total, unread, notifications] = await Promise.all([
        prisma.notification.count({ where: { userId } }),
        prisma.notification.count({ where: { userId, read: false } }),
        prisma.notification.findMany({
          where: { userId },
          select: {
            type: true,
            priority: true,
            read: true,
            sentViaApp: true,
            sentViaEmail: true,
            sentViaSMS: true,
            sentViaTelegram: true,
          },
        }),
      ]);
      const byType = [...new Set(notifications.map((item) => item.type))].map(
        (type) => ({
          type,
          count: notifications.filter((item) => item.type === type).length,
          unreadCount: notifications.filter(
            (item) => item.type === type && !item.read,
          ).length,
        }),
      );
      const byPriority = [
        ...new Set(notifications.map((item) => item.priority)),
      ].map((priority) => ({
        priority,
        count: notifications.filter((item) => item.priority === priority)
          .length,
      }));
      return {
        total,
        unread,
        byType,
        byPriority,
        deliveryStats: {
          app: notifications.filter((item) => item.sentViaApp).length,
          email: notifications.filter((item) => item.sentViaEmail).length,
          sms: notifications.filter((item) => item.sentViaSMS).length,
          telegram: notifications.filter((item) => item.sentViaTelegram).length,
          totalDelivered: notifications.length,
          totalFailed: 0,
        },
      };
    },
    myNotificationPreferences: async (
      _: unknown,
      _args: unknown,
      context: GraphQLContext,
    ) => {
      context.requireAuth();
      const user = await prisma.user.findUnique({
        where: { id: context.user.id },
        select: {
          notificationPreferences: true,
          timezone: true,
          updatedAt: true,
        },
      });
      const preferences: any = user?.notificationPreferences || {};
      return {
        userId: context.user.id,
        highPriorityRescueAlerts: true,
        rescueCompletionNotifications: true,
        newUserRegistrations: true,
        systemAlerts: true,
        dailySummaryReports: false,
        enableApp: true,
        enableEmail: false,
        enableSMS: false,
        enableTelegram: false,
        rescueUpdates: true,
        volunteerUpdates: true,
        trainingReminders: true,
        donationReceipts: true,
        systemAnnouncements: true,
        timezone: user?.timezone || 'Asia/Kathmandu',
        updatedAt: user?.updatedAt || new Date(),
        ...preferences,
      };
    },
  },
  Mutation: {
    createNotification: async (
      _: unknown,
      args: { input: any },
      context: GraphQLContext,
    ) => {
      context.requireAuth();
      context.requireRole(ADMIN_ROLES);
      const input = args.input;
      return prisma.notification.create({
        data: {
          userId: input.userId,
          type: input.type,
          title: input.title,
          message: input.message,
          link: input.link,
          actionUrl: input.actionUrl,
          rescueId: input.rescueId,
          priority: input.priority || 'NORMAL',
          metadata: input.metadata,
          expiresAt: input.expiresAt ? new Date(input.expiresAt) : undefined,
          ...channelsData(input.channels),
        },
      });
    },
    markNotificationAsRead: async (
      _: unknown,
      args: { id: string },
      context: GraphQLContext,
    ) => {
      context.requireAuth();
      return prisma.notification
        .updateMany({
          where: { id: args.id, userId: context.user.id },
          data: { read: true, readAt: new Date() },
        })
        .then(async () =>
          prisma.notification.findFirst({
            where: { id: args.id, userId: context.user.id },
          }),
        );
    },
    markAllNotificationsAsRead: async (
      _: unknown,
      _args: unknown,
      context: GraphQLContext,
    ) => {
      context.requireAuth();
      await prisma.notification.updateMany({
        where: { userId: context.user.id, read: false },
        data: { read: true, readAt: new Date() },
      });
      return { success: true, message: 'Notifications marked as read' };
    },
    deleteNotification: async (
      _: unknown,
      args: { id: string },
      context: GraphQLContext,
    ) => {
      context.requireAuth();
      await prisma.notification.deleteMany({
        where: { id: args.id, userId: context.user.id },
      });
      return { success: true, message: 'Notification deleted' };
    },
    deleteReadNotifications: async (
      _: unknown,
      _args: unknown,
      context: GraphQLContext,
    ) => {
      context.requireAuth();
      await prisma.notification.deleteMany({
        where: { userId: context.user.id, read: true },
      });
      return { success: true, message: 'Read notifications deleted' };
    },
    updateNotificationPreferences: async (
      _: unknown,
      args: { input: any },
      context: GraphQLContext,
    ) => {
      context.requireAuth();
      const user = await prisma.user.findUnique({
        where: { id: context.user.id },
        select: {
          notificationPreferences: true,
          timezone: true,
          updatedAt: true,
        },
      });
      const preferences = {
        ...((user?.notificationPreferences as object) || {}),
        ...args.input,
      };
      const updated = await prisma.user.update({
        where: { id: context.user.id },
        data: {
          notificationPreferences: preferences,
          ...(args.input.timezone ? { timezone: args.input.timezone } : {}),
        },
        select: { updatedAt: true },
      });
      return {
        userId: context.user.id,
        highPriorityRescueAlerts: true,
        rescueCompletionNotifications: true,
        newUserRegistrations: true,
        systemAlerts: true,
        dailySummaryReports: false,
        enableApp: true,
        enableEmail: false,
        enableSMS: false,
        enableTelegram: false,
        rescueUpdates: true,
        volunteerUpdates: true,
        trainingReminders: true,
        donationReceipts: true,
        systemAnnouncements: true,
        timezone: args.input.timezone || user?.timezone || 'Asia/Kathmandu',
        updatedAt: updated.updatedAt,
        ...preferences,
      };
    },
  },
};
