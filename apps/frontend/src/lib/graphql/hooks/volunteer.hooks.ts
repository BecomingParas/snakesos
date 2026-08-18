/**
 * GraphQL Hooks for Volunteer Operations
 */

import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@/lib/apollo/hooks';
import type { MutationHookOptions, QueryHookOptions } from '@/lib/apollo/hooks';

// ===================================================================
// TYPE DEFINITIONS
// ===================================================================

export interface Volunteer {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  experience: string;
  experienceYears?: number;
  municipality: string;
  ward?: number;
  skills: string[];
  totalRescues: number;
  completedRescues: number;
  rating?: number;
  isAvailableNow: boolean;
  status: string;
  successRate?: number;
  createdAt: string;
  updatedAt: string;
}

export interface VolunteerProfile {
  id: string;
  experience: string;
  experienceYears?: number;
  municipality: string;
  ward?: number;
  skills: string[];
  totalRescues: number;
  completedRescues: number;
  rating?: number;
  successRate?: number;
  isAvailableNow: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateVolunteerProfileInput {
  experience?: string;
  experienceYears?: number;
  municipality?: string;
  ward?: number;
  skills?: string[];
  isAvailableNow?: boolean;
}

export interface UpdateVolunteerStatusInput {
  volunteerId: string;
  status?: string;
}

export interface VolunteerConnection {
  edges: Array<{
    node: Volunteer;
    cursor: string;
  }>;
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

export interface VolunteerFilterInput {
  status?: string;
  isAvailableNow?: boolean;
  municipality?: string;
  experience?: string;
  search?: string;
}

// ===================================================================
// MUTATIONS
// ===================================================================

const UPDATE_VOLUNTEER_PROFILE = gql`
  mutation UpdateVolunteerProfile($input: UpdateVolunteerProfileInput!) {
    updateVolunteerProfile(input: $input) {
      id
      experience
      experienceYears
      municipality
      ward
      skills
      isAvailableNow
      updatedAt
    }
  }
`;

const UPDATE_VOLUNTEER_STATUS = gql`
  mutation UpdateVolunteerStatus($input: UpdateVolunteerStatusInput!) {
    updateVolunteerStatus(input: $input) {
      id
      status
      updatedAt
    }
  }
`;

// ===================================================================
// QUERIES
// ===================================================================

const GET_MY_VOLUNTEER_PROFILE = gql`
  query GetMyVolunteerProfile {
    myVolunteerProfile {
      id
      experience
      experienceYears
      municipality
      ward
      skills
      totalRescues
      completedRescues
      rating
      successRate
      isAvailableNow
      status
      createdAt
      updatedAt
    }
  }
`;

const GET_VOLUNTEERS = gql`
  query GetVolunteers($pagination: PaginationInput, $filter: VolunteerFilterInput) {
    volunteers(pagination: $pagination, filter: $filter) {
      edges {
        node {
          id
          user {
            id
            name
            email
            phone
          }
          experience
          experienceYears
          municipality
          ward
          skills
          totalRescues
          completedRescues
          rating
          successRate
          isAvailableNow
          status
          createdAt
          updatedAt
        }
        cursor
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

export function useUpdateVolunteerProfileMutation(
  options?: MutationHookOptions<
    { updateVolunteerProfile: VolunteerProfile },
    { input: UpdateVolunteerProfileInput }
  >
) {
  return useMutation<
    { updateVolunteerProfile: VolunteerProfile },
    { input: UpdateVolunteerProfileInput }
  >(UPDATE_VOLUNTEER_PROFILE, options);
}

export function useUpdateVolunteerStatusMutation(
  options?: MutationHookOptions<
    { updateVolunteerStatus: Volunteer },
    { input: UpdateVolunteerStatusInput }
  >
) {
  return useMutation<
    { updateVolunteerStatus: Volunteer },
    { input: UpdateVolunteerStatusInput }
  >(UPDATE_VOLUNTEER_STATUS, options);
}

export function useMyVolunteerProfileQuery(
  options?: QueryHookOptions<
    { myVolunteerProfile: VolunteerProfile | null },
    Record<string, never>
  >
) {
  return useQuery<
    { myVolunteerProfile: VolunteerProfile | null },
    Record<string, never>
  >(GET_MY_VOLUNTEER_PROFILE, options);
}

export function useVolunteersQuery(
  options?: QueryHookOptions<
    { volunteers: VolunteerConnection },
    { pagination?: PaginationInput; filter?: VolunteerFilterInput }
  >
) {
  return useQuery<
    { volunteers: VolunteerConnection },
    { pagination?: PaginationInput; filter?: VolunteerFilterInput }
  >(GET_VOLUNTEERS, options);
}
