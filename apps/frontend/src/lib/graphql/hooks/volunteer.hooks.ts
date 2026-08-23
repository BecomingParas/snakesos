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
    role?: string;
    status?: string;
    emailVerified?: boolean;
  };
  name: string;
  contact: string;
  email?: string;
  address: string;
  experience: string;
  experienceYears?: number;
  municipality: string;
  ward?: number;
  skills: string[];
  certifications?: string[];
  languages?: string[];
  vehicle?: string;
  vehicleDetails?: string;
  availableTime?: string;
  availableDays?: string[];
  emergencyAvailability?: boolean;
  totalRescues: number;
  completedRescues: number;
  cancelledRescues?: number;
  rating?: number;
  totalRatings?: number;
  isAvailableNow: boolean;
  status: string;
  successRate?: number;
  assignedZone?: string;
  coverageRadius?: number;
  bio?: string;
  verifiedAt?: string;
  rejectionReason?: string;
  averageResponseTime?: number;
  averageRescueTime?: number;
  trainingCompleted?: boolean;
  certificationExpiry?: string;
  hasEquipment?: boolean;
  equipment?: string[];
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

export interface ReviewVolunteerInput {
  volunteerId: string;
  approved: boolean;
  notes?: string;
  assignedZone?: string;
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

const GET_VOLUNTEER = gql`
  query GetVolunteer($id: ID!) {
    volunteer(id: $id) {
      id
      user {
        id
        name
        email
        phone
        role
        status
        emailVerified
      }
      name
      contact
      email
      address
      municipality
      ward
      experience
      experienceYears
      vehicle
      vehicleDetails
      skills
      certifications
      languages
      availableTime
      availableDays
      emergencyAvailability
      isAvailableNow
      assignedZone
      coverageRadius
      bio
      status
      verifiedAt
      rejectionReason
      totalRescues
      completedRescues
      cancelledRescues
      successRate
      averageResponseTime
      averageRescueTime
      rating
      totalRatings
      trainingCompleted
      certificationExpiry
      hasEquipment
      equipment
      createdAt
      updatedAt
    }
  }
`;

const REVIEW_VOLUNTEER_APPLICATION = gql`
  mutation ReviewVolunteerApplication($input: ReviewVolunteerInput!) {
    reviewVolunteerApplication(input: $input) {
      id
      status
      user {
        id
        role
        status
      }
    }
  }
`;

const VERIFY_VOLUNTEER = gql`
  mutation VerifyVolunteer($volunteerId: ID!, $notes: String) {
    verifyVolunteer(volunteerId: $volunteerId, notes: $notes) {
      id
      status
      user {
        id
        role
        status
      }
    }
  }
`;

const SUSPEND_VOLUNTEER = gql`
  mutation SuspendVolunteer($volunteerId: ID!, $reason: String!) {
    suspendVolunteer(volunteerId: $volunteerId, reason: $reason) {
      id
      status
      user {
        id
        role
        status
      }
    }
  }
`;

const REACTIVATE_VOLUNTEER = gql`
  mutation ReactivateVolunteer($volunteerId: ID!) {
    reactivateVolunteer(volunteerId: $volunteerId) {
      id
      status
      user {
        id
        role
        status
      }
    }
  }
`;

const DELETE_VOLUNTEER = gql`
  mutation DeleteVolunteer($volunteerId: ID!) {
    deleteVolunteer(volunteerId: $volunteerId) {
      success
      message
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
  query GetVolunteers(
    $pagination: PaginationInput
    $filter: VolunteerFilterInput
  ) {
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
  >,
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
  >,
) {
  return useMutation<
    { updateVolunteerStatus: Volunteer },
    { input: UpdateVolunteerStatusInput }
  >(UPDATE_VOLUNTEER_STATUS, options);
}

export function useVolunteerQuery(
  options?: QueryHookOptions<{ volunteer: Volunteer | null }, { id: string }>,
) {
  return useQuery<{ volunteer: Volunteer | null }, { id: string }>(
    GET_VOLUNTEER,
    options,
  );
}

export function useReviewVolunteerApplicationMutation(
  options?: MutationHookOptions<
    { reviewVolunteerApplication: Volunteer },
    { input: ReviewVolunteerInput }
  >,
) {
  return useMutation<
    { reviewVolunteerApplication: Volunteer },
    { input: ReviewVolunteerInput }
  >(REVIEW_VOLUNTEER_APPLICATION, options);
}

export function useVerifyVolunteerMutation(
  options?: MutationHookOptions<
    { verifyVolunteer: Volunteer },
    { volunteerId: string; notes?: string }
  >,
) {
  return useMutation<
    { verifyVolunteer: Volunteer },
    { volunteerId: string; notes?: string }
  >(VERIFY_VOLUNTEER, options);
}

export function useSuspendVolunteerMutation(
  options?: MutationHookOptions<
    { suspendVolunteer: Volunteer },
    { volunteerId: string; reason: string }
  >,
) {
  return useMutation<
    { suspendVolunteer: Volunteer },
    { volunteerId: string; reason: string }
  >(SUSPEND_VOLUNTEER, options);
}

export function useReactivateVolunteerMutation(
  options?: MutationHookOptions<
    { reactivateVolunteer: Volunteer },
    { volunteerId: string }
  >,
) {
  return useMutation<
    { reactivateVolunteer: Volunteer },
    { volunteerId: string }
  >(REACTIVATE_VOLUNTEER, options);
}

export function useDeleteVolunteerMutation(
  options?: MutationHookOptions<
    { deleteVolunteer: { success: boolean; message?: string } },
    { volunteerId: string }
  >,
) {
  return useMutation<
    { deleteVolunteer: { success: boolean; message?: string } },
    { volunteerId: string }
  >(DELETE_VOLUNTEER, options);
}

export function useMyVolunteerProfileQuery(
  options?: QueryHookOptions<
    { myVolunteerProfile: VolunteerProfile | null },
    Record<string, never>
  >,
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
  >,
) {
  return useQuery<
    { volunteers: VolunteerConnection },
    { pagination?: PaginationInput; filter?: VolunteerFilterInput }
  >(GET_VOLUNTEERS, options);
}
