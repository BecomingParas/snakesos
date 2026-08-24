import { prisma } from '@snake-rescue/database';
import { GraphQLContext } from '@snake-rescue/core';

const defaults = {
  systemName: 'SnakeSOS',
  contactEmail: 'admin@snakesos.org',
  contactPhone: '9841234567',
  supportEmail: 'support@snakesos.org',
  smsEnabled: true,
  emailEnabled: true,
  pushEnabled: true,
  smsProvider: 'Twilio',
  emailProvider: 'SendGrid',
  defaultRadius: 5,
  maxAssignmentDistance: 15,
  autoAssignEnabled: true,
  priorityThreshold: 30,
  targetResponseTime: 15,
  maxResponseTime: 30,
  smsApiKey: '',
  emailApiKey: '',
  mapboxToken: '',
  sessionTimeout: 60,
  passwordMinLength: 8,
  requireTwoFactor: false,
  maxLoginAttempts: 5,
} as const;

const settingMeta: Record<string, { type: string; category: string }> = {
  systemName: { type: 'STRING', category: 'GENERAL' },
  contactEmail: { type: 'STRING', category: 'GENERAL' },
  contactPhone: { type: 'STRING', category: 'GENERAL' },
  supportEmail: { type: 'STRING', category: 'GENERAL' },
  smsEnabled: { type: 'BOOLEAN', category: 'NOTIFICATIONS' },
  emailEnabled: { type: 'BOOLEAN', category: 'NOTIFICATIONS' },
  pushEnabled: { type: 'BOOLEAN', category: 'NOTIFICATIONS' },
  smsProvider: { type: 'STRING', category: 'NOTIFICATIONS' },
  emailProvider: { type: 'STRING', category: 'NOTIFICATIONS' },
  defaultRadius: { type: 'NUMBER', category: 'COVERAGE' },
  maxAssignmentDistance: { type: 'NUMBER', category: 'COVERAGE' },
  autoAssignEnabled: { type: 'BOOLEAN', category: 'COVERAGE' },
  priorityThreshold: { type: 'NUMBER', category: 'COVERAGE' },
  targetResponseTime: { type: 'NUMBER', category: 'GENERAL' },
  maxResponseTime: { type: 'NUMBER', category: 'GENERAL' },
  smsApiKey: { type: 'STRING', category: 'INTEGRATIONS' },
  emailApiKey: { type: 'STRING', category: 'INTEGRATIONS' },
  mapboxToken: { type: 'STRING', category: 'INTEGRATIONS' },
  sessionTimeout: { type: 'NUMBER', category: 'SECURITY' },
  passwordMinLength: { type: 'NUMBER', category: 'SECURITY' },
  requireTwoFactor: { type: 'BOOLEAN', category: 'SECURITY' },
  maxLoginAttempts: { type: 'NUMBER', category: 'SECURITY' },
};

function parseValue(value: string, type: string) {
  if (type === 'BOOLEAN') return value === 'true';
  if (type === 'NUMBER') return Number(value);
  return value;
}

async function getSettings() {
  const rows = await prisma.systemSetting.findMany();
  const values: Record<string, unknown> = { ...defaults };
  for (const row of rows) values[row.key] = parseValue(row.value, row.type);
  return {
    ...values,
    updatedAt: rows.reduce(
      (latest, row) => (row.updatedAt > latest ? row.updatedAt : latest),
      new Date(0),
    ),
  };
}

export const settingsResolvers = {
  Query: {
    adminSettings: async (
      _parent: unknown,
      _args: unknown,
      context: GraphQLContext,
    ) => {
      context.requireAuth();
      context.requireRole(['ADMIN', 'SUPER_ADMIN']);
      return getSettings();
    },
  },
  Mutation: {
    updateAdminSettings: async (
      _parent: unknown,
      args: { input: Record<string, unknown> },
      context: GraphQLContext,
    ) => {
      context.requireAuth();
      context.requireRole(['ADMIN', 'SUPER_ADMIN']);
      await prisma.$transaction(
        Object.entries(args.input).map(([key, value]) => {
          const meta = settingMeta[key];
          if (!meta) throw new Error(`Unsupported setting: ${key}`);
          return prisma.systemSetting.upsert({
            where: { key },
            create: {
              key,
              value: String(value),
              ...meta,
              updatedBy: context.user.id,
            },
            update: {
              value: String(value),
              ...meta,
              updatedBy: context.user.id,
            },
          });
        }),
      );
      return getSettings();
    },
  },
};
