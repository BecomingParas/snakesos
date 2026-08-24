import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@/lib/apollo/hooks';

export interface AdminSettings {
  systemName: string;
  contactEmail: string;
  contactPhone: string;
  supportEmail: string;
  smsEnabled: boolean;
  emailEnabled: boolean;
  pushEnabled: boolean;
  smsProvider: string;
  emailProvider: string;
  defaultRadius: number;
  maxAssignmentDistance: number;
  autoAssignEnabled: boolean;
  priorityThreshold: number;
  targetResponseTime: number;
  maxResponseTime: number;
  smsApiKey: string;
  emailApiKey: string;
  mapboxToken: string;
  sessionTimeout: number;
  passwordMinLength: number;
  requireTwoFactor: boolean;
  maxLoginAttempts: number;
  updatedAt: string;
}

export type AdminSettingsInput = Omit<AdminSettings, 'updatedAt'>;

const ADMIN_SETTINGS = gql`
  query AdminSettings {
    adminSettings {
      systemName
      contactEmail
      contactPhone
      supportEmail
      smsEnabled
      emailEnabled
      pushEnabled
      smsProvider
      emailProvider
      defaultRadius
      maxAssignmentDistance
      autoAssignEnabled
      priorityThreshold
      targetResponseTime
      maxResponseTime
      smsApiKey
      emailApiKey
      mapboxToken
      sessionTimeout
      passwordMinLength
      requireTwoFactor
      maxLoginAttempts
      updatedAt
    }
  }
`;

const UPDATE_ADMIN_SETTINGS = gql`
  mutation UpdateAdminSettings($input: AdminSettingsInput!) {
    updateAdminSettings(input: $input) {
      systemName
      contactEmail
      contactPhone
      supportEmail
      smsEnabled
      emailEnabled
      pushEnabled
      smsProvider
      emailProvider
      defaultRadius
      maxAssignmentDistance
      autoAssignEnabled
      priorityThreshold
      targetResponseTime
      maxResponseTime
      smsApiKey
      emailApiKey
      mapboxToken
      sessionTimeout
      passwordMinLength
      requireTwoFactor
      maxLoginAttempts
      updatedAt
    }
  }
`;

export function useAdminSettingsQuery() {
  return useQuery<{ adminSettings: AdminSettings }>(ADMIN_SETTINGS);
}

export function useUpdateAdminSettingsMutation() {
  return useMutation<
    { updateAdminSettings: AdminSettings },
    { input: AdminSettingsInput }
  >(UPDATE_ADMIN_SETTINGS);
}
