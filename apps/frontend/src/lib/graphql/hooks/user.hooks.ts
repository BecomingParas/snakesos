/**
 * GraphQL Hooks for User and Profile Operations
 */

import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@/lib/apollo/hooks';
import type { MutationHookOptions, QueryHookOptions } from '@/lib/apollo/hooks';

// ===================================================================
// TYPE DEFINITIONS
// ===================================================================

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserProfileInput {
  name?: string;
  phone?: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  createdAt: string;
  updatedAt: string;
}

export interface SaveEmergencyContactInput {
  name: string;
  phone: string;
  relationship: string;
}

export interface UserConnection {
  edges: Array<User>;
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
  };
  totalCount: number;
}

export interface PaginationInput {
  limit?: number;
  page?: number;
}

export interface UserFilterInput {
  role?: string;
  isActive?: boolean;
  isEmailVerified?: boolean;
  search?: string;
}

export interface UpdateUserStatusInput {
  userId: string;
  isActive: boolean;
}

export interface UpdateUserRoleInput {
  userId: string;
  role: string;
}

// ===================================================================
// MUTATIONS
// ===================================================================

const UPDATE_USER_PROFILE = gql`
  mutation UpdateUserProfile($input: UpdateUserProfileInput!) {
    updateUserProfile(input: $input) {
      id
      name
      email
      phone
      updatedAt
    }
  }
`;

const SAVE_EMERGENCY_CONTACT = gql`
  mutation SaveEmergencyContact($input: SaveEmergencyContactInput!) {
    saveEmergencyContact(input: $input) {
      id
      name
      phone
      relationship
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_USER_STATUS = gql`
  mutation UpdateUserStatus($input: UpdateUserStatusInput!) {
    updateUserStatus(input: $input) {
      id
      isActive
      updatedAt
    }
  }
`;

const UPDATE_USER_ROLE = gql`
  mutation UpdateUserRole($input: UpdateUserRoleInput!) {
    updateUserRole(input: $input) {
      id
      role
      updatedAt
    }
  }
`;

// ===================================================================
// QUERIES
// ===================================================================

const GET_MY_PROFILE = gql`
  query GetMyProfile {
    me {
      id
      name
      email
      phone
      role
      isActive
      isEmailVerified
      createdAt
      updatedAt
    }
  }
`;

const GET_EMERGENCY_CONTACT = gql`
  query GetEmergencyContact {
    myEmergencyContact {
      id
      name
      phone
      relationship
      createdAt
      updatedAt
    }
  }
`;

const GET_USERS = gql`
  query GetUsers($pagination: PaginationInput, $filter: UserFilterInput) {
    users(pagination: $pagination, filter: $filter) {
      edges {
        id
        name
        email
        phone
        role
        status
        emailVerified
        lastLoginAt
        createdAt
        updatedAt
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;

// ===================================================================
// HOOKS
// ===================================================================

export function useUpdateUserProfileMutation(
  options?: MutationHookOptions<
    { updateUserProfile: User },
    { input: UpdateUserProfileInput }
  >
) {
  return useMutation<
    { updateUserProfile: User },
    { input: UpdateUserProfileInput }
  >(UPDATE_USER_PROFILE, options);
}

export function useSaveEmergencyContactMutation(
  options?: MutationHookOptions<
    { saveEmergencyContact: EmergencyContact },
    { input: SaveEmergencyContactInput }
  >
) {
  return useMutation<
    { saveEmergencyContact: EmergencyContact },
    { input: SaveEmergencyContactInput }
  >(SAVE_EMERGENCY_CONTACT, options);
}

export function useUpdateUserStatusMutation(
  options?: MutationHookOptions<
    { updateUserStatus: User },
    { input: UpdateUserStatusInput }
  >
) {
  return useMutation<
    { updateUserStatus: User },
    { input: UpdateUserStatusInput }
  >(UPDATE_USER_STATUS, options);
}

export function useUpdateUserRoleMutation(
  options?: MutationHookOptions<
    { updateUserRole: User },
    { input: UpdateUserRoleInput }
  >
) {
  return useMutation<
    { updateUserRole: User },
    { input: UpdateUserRoleInput }
  >(UPDATE_USER_ROLE, options);
}

export function useMyProfileQuery(
  options?: QueryHookOptions<{ me: User | null }, Record<string, never>>
) {
  return useQuery<{ me: User | null }, Record<string, never>>(
    GET_MY_PROFILE,
    options
  );
}

export function useEmergencyContactQuery(
  options?: QueryHookOptions<
    { myEmergencyContact: EmergencyContact | null },
    Record<string, never>
  >
) {
  return useQuery<
    { myEmergencyContact: EmergencyContact | null },
    Record<string, never>
  >(GET_EMERGENCY_CONTACT, options);
}

export function useUsersQuery(
  options?: QueryHookOptions<
    { users: UserConnection },
    { pagination?: PaginationInput; filter?: UserFilterInput }
  >
) {
  return useQuery<
    { users: UserConnection },
    { pagination?: PaginationInput; filter?: UserFilterInput }
  >(GET_USERS, options);
}
