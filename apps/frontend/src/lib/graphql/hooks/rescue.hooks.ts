/**
 * Generated GraphQL Hooks for Rescue Operations
 * Manually created hooks based on GraphQL schema
 */

import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@/lib/apollo/hooks';
import type { MutationHookOptions, QueryHookOptions } from '@/lib/apollo/hooks';

// ===================================================================
// TYPE DEFINITIONS
// ===================================================================

export interface RescueRequest {
  id: string;
  referenceNumber: string;
  status: string;
  priority: string;
  municipality: string;
  ward?: number;
  address: string;
  landmark?: string;
  lat?: number;
  lng?: number;
  snakeDescription?: string;
  snakeSize?: string;
  snakeColor?: string;
  snakeImages: string[];
  isEmergency: boolean;
  hasBite: boolean;
  assignedAt?: string;
  acceptedAt?: string;
  startedAt?: string;
  arrivedAt?: string;
  completedAt?: string;
  outcome?: string;
  rescueReport?: string;
  rescueImages: string[];
  rescueDuration?: number;
  rating?: {
    id: string;
    rating: number;
    feedback?: string;
    createdAt: string;
  };
  createdAt: string;
  updatedAt: string;
  distance?: number;
  user?: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
  };
  assignedVolunteer?: {
    id: string;
    name: string;
    experience?: string;
    experienceYears?: number;
    totalRescues?: number;
    rating?: number;
    contact?: string; // Main phone number field
    email?: string;
    currentLat?: number;
    currentLng?: number;
    lastLocationUpdate?: string;
  };
  assignedBy?: {
    id: string;
    name: string;
  };
  species?: {
    id: string;
    name: string;
    scientificName?: string;
    venomous?: boolean;
  };
  timeline?: Array<{
    id: string;
    event: string;
    description?: string;
    user?: {
      id: string;
      name: string;
    };
    lat?: number;
    lng?: number;
    createdAt: string;
  }>;
}

export interface CreateRescueRequestInput {
  name: string;
  phone: string;
  email?: string;
  municipality: string;
  ward?: number;
  address: string;
  landmark?: string;
  lat?: number;
  lng?: number;
  locationAccuracy?: number;
  snakeDescription?: string;
  snakeSize?: string;
  snakeColor?: string;
  snakeImageUrl?: string;
  snakeImages?: string[];
  isEmergency?: boolean;
  emergencyDetails?: string;
  hasBite?: boolean;
  biteDetails?: string;
  notes?: string;
  source?: string;
}

export interface AssignRescueInput {
  rescueId: string;
  volunteerId: string;
  notes?: string;
}

export interface AcceptRescueInput {
  rescueId: string;
  estimatedArrival?: number;
  currentLat?: number;
  currentLng?: number;
}

export interface UpdateRescueProgressInput {
  rescueId: string;
  status: string;
  lat?: number;
  lng?: number;
  notes?: string;
}

export interface CompleteRescueInput {
  rescueId: string;
  outcome: string;
  rescueReport: string;
  rescueImages?: string[];
  speciesId?: string;
  releaseLat?: number;
  releaseLng?: number;
  releaseLocation?: string;
  // Hospital verification fields
  victimWentToHospital?: boolean;
  hospitalId?: string;
  antivenomAdministered?: boolean;
  antivenomType?: string;
  hospitalAdmission?: boolean;
  hospitalNotes?: string;
}

export interface UpdateRescueRequestInput {
  municipality?: string;
  ward?: number | null;
  address?: string;
  landmark?: string | null;
  lat?: number | null;
  lng?: number | null;
  snakeDescription?: string | null;
  snakeSize?: string | null;
  snakeColor?: string | null;
  snakeImageUrl?: string | null;
  snakeImages?: string[];
  speciesId?: string;
  status?: string;
  priority?: string;
  stillPresent?: boolean;
  notes?: string | null;
  internalNotes?: string | null;
  isEmergency?: boolean;
  emergencyDetails?: string | null;
  hasBite?: boolean;
  biteDetails?: string | null;
}

export interface RescueRequestConnection {
  edges: Array<{
    node: RescueRequest;
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

export interface RescueRequestFilterInput {
  status?: string;
  statuses?: string[];
  priority?: string;
  priorities?: string[];
  municipality?: string;
  isEmergency?: boolean;
}

// ===================================================================
// MUTATIONS
// ===================================================================

const CREATE_RESCUE_REQUEST = gql`
  mutation CreateRescueRequest($input: CreateRescueRequestInput!) {
    createRescueRequest(input: $input) {
      id
      referenceNumber
      status
      priority
      municipality
      ward
      address
      landmark
      lat
      lng
      snakeDescription
      snakeSize
      snakeColor
      snakeImages
      notes
      emergencyDetails
      biteDetails
      isEmergency
      hasBite
      createdAt
      updatedAt
    }
  }
`;

const ASSIGN_RESCUE = gql`
  mutation AssignRescue($input: AssignRescueInput!) {
    assignRescue(input: $input) {
      id
      referenceNumber
      status
      assignedAt
      assignedVolunteer {
        id
        name
      }
      updatedAt
    }
  }
`;

const UPDATE_RESCUE_REQUEST = gql`
  mutation UpdateRescueRequest($id: ID!, $input: UpdateRescueRequestInput!) {
    updateRescueRequest(id: $id, input: $input) {
      id
      priority
      updatedAt
    }
  }
`;

const ACCEPT_RESCUE = gql`
  mutation AcceptRescue($input: AcceptRescueInput!) {
    acceptRescue(input: $input) {
      id
      referenceNumber
      status
      acceptedAt
      updatedAt
    }
  }
`;

const UPDATE_RESCUE_PROGRESS = gql`
  mutation UpdateRescueProgress($input: UpdateRescueProgressInput!) {
    updateRescueProgress(input: $input) {
      id
      referenceNumber
      status
      startedAt
      arrivedAt
      updatedAt
    }
  }
`;

const COMPLETE_RESCUE = gql`
  mutation CompleteRescue($input: CompleteRescueInput!) {
    completeRescue(input: $input) {
      id
      referenceNumber
      status
      completedAt
      outcome
      rescueReport
      rescueImages
      species {
        id
        name
      }
      victimWentToHospital
      hospitalId
      antivenomAdministered
      antivenomType
      hospitalAdmission
      hospitalNotes
      updatedAt
    }
  }
`;

const CANCEL_RESCUE = gql`
  mutation CancelRescue($rescueId: ID!, $reason: String) {
    cancelRescue(rescueId: $rescueId, reason: $reason) {
      id
      referenceNumber
      status
      updatedAt
    }
  }
`;

// ===================================================================
// QUERIES
// ===================================================================

const RESCUE_REQUEST = gql`
  query RescueRequest($id: ID!) {
    rescueRequest(id: $id) {
      id
      referenceNumber
      status
      priority
      municipality
      ward
      address
      landmark
      lat
      lng
      snakeDescription
      snakeSize
      snakeColor
      snakeImages
      isEmergency
      hasBite
      assignedAt
      acceptedAt
      startedAt
      arrivedAt
      completedAt
      outcome
      rescueReport
      rescueImages
      rescueDuration
      rating {
        id
        rating
        feedback
        createdAt
      }
      createdAt
      updatedAt
      user {
        id
        name
        email
        phone
      }
      assignedVolunteer {
        id
        name
        experience
        experienceYears
        totalRescues
        rating
      }
      assignedBy {
        id
        name
      }
      species {
        id
        name
        scientificName
        venomous
      }
      timeline {
        id
        event
        description
        user {
          id
          name
        }
        lat
        lng
        createdAt
      }
    }
  }
`;

const MY_RESCUE_REQUESTS = gql`
  query MyRescueRequests(
    $pagination: PaginationInput
    $filter: RescueRequestFilterInput
  ) {
    myRescueRequests(pagination: $pagination, filter: $filter) {
      edges {
        node {
          id
          referenceNumber
          status
          priority
          municipality
          address
          snakeDescription
          isEmergency
          createdAt
          assignedVolunteer {
            id
            name
          }
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

const MY_ASSIGNED_RESCUES = gql`
  query MyAssignedRescues(
    $pagination: PaginationInput
    $filter: RescueRequestFilterInput
  ) {
    myAssignedRescues(pagination: $pagination, filter: $filter) {
      edges {
        node {
          id
          referenceNumber
          status
          priority
          municipality
          ward
          address
          landmark
          lat
          lng
          snakeDescription
          snakeSize
          snakeColor
          snakeImages
          isEmergency
          createdAt
          assignedAt
          acceptedAt
          startedAt
          arrivedAt
          completedAt
          outcome
          rescueReport
          rescueDuration
          updatedAt
          user {
            id
            name
            phone
          }
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

const ACTIVE_RESCUES = gql`
  query ActiveRescues($pagination: PaginationInput) {
    activeRescues(pagination: $pagination) {
      edges {
        node {
          id
          referenceNumber
          status
          priority
          municipality
          ward
          address
          lat
          lng
          snakeDescription
          isEmergency
          createdAt
          assignedAt
          acceptedAt
          user {
            id
            name
            phone
          }
          assignedVolunteer {
            id
            name
            contact
            currentLat
            currentLng
            lastLocationUpdate
          }
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

const EMERGENCY_RESCUES_COUNT = gql`
  query EmergencyRescuesCount {
    emergencyRescuesCount
  }
`;

const RESCUE_WITH_TRACKING = gql`
  query RescueWithTracking($id: ID!) {
    rescueRequest(id: $id) {
      id
      referenceNumber
      status
      priority
      municipality
      ward
      address
      landmark
      lat
      lng
      snakeDescription
      isEmergency
      createdAt
      assignedAt
      acceptedAt
      startedAt
      arrivedAt
      user {
        id
        name
        email
        phone
      }
      assignedVolunteer {
        id
        name
        contact
        email
        currentLat
        currentLng
        lastLocationUpdate
        experience
        experienceYears
        totalRescues
        rating
      }
      timeline {
        id
        event
        description
        lat
        lng
        createdAt
        user {
          id
          name
        }
      }
    }
  }
`;

const AVAILABLE_VOLUNTEERS = gql`
  query AvailableVolunteers($input: FindAvailableVolunteersInput!) {
    availableVolunteers(input: $input) {
      volunteer {
        id
        name
        contact
        experience
        experienceYears
        totalRescues
        rating
        currentLat
        currentLng
      }
      distance
      estimatedArrival
      currentlyAssigned
      rankingScore
    }
  }
`;

const AVAILABLE_RESCUES = gql`
  query AvailableRescues(
    $pagination: PaginationInput
    $filter: RescueRequestFilterInput
  ) {
    availableRescues(pagination: $pagination, filter: $filter) {
      edges {
        node {
          id
          referenceNumber
          status
          priority
          municipality
          ward
          address
          landmark
          lat
          lng
          snakeDescription
          snakeSize
          snakeColor
          isEmergency
          hasBite
          createdAt
          species {
            id
            name
            scientificName
            venomous
          }
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

const ACCEPT_FROM_QUEUE = gql`
  mutation AcceptFromQueue($input: AcceptRescueInput!) {
    acceptFromQueue(input: $input) {
      id
      referenceNumber
      status
      acceptedAt
      assignedAt
      assignedVolunteer {
        id
        name
      }
      updatedAt
    }
  }
`;

// ===================================================================
// HOOKS
// ===================================================================

export function useCreateRescueRequestMutation(
  options?: MutationHookOptions<
    { createRescueRequest: RescueRequest },
    { input: CreateRescueRequestInput }
  >,
) {
  return useMutation<
    { createRescueRequest: RescueRequest },
    { input: CreateRescueRequestInput }
  >(CREATE_RESCUE_REQUEST, options);
}

export function useAssignRescueMutation(
  options?: MutationHookOptions<
    { assignRescue: RescueRequest },
    { input: AssignRescueInput }
  >,
) {
  return useMutation<
    { assignRescue: RescueRequest },
    { input: AssignRescueInput }
  >(ASSIGN_RESCUE, options);
}

export function useUpdateRescueRequestMutation(
  options?: MutationHookOptions<
    { updateRescueRequest: RescueRequest },
    { id: string; input: UpdateRescueRequestInput }
  >,
) {
  return useMutation<
    { updateRescueRequest: RescueRequest },
    { id: string; input: UpdateRescueRequestInput }
  >(UPDATE_RESCUE_REQUEST, options);
}

export function useAcceptRescueMutation(
  options?: MutationHookOptions<
    { acceptRescue: RescueRequest },
    { input: AcceptRescueInput }
  >,
) {
  return useMutation<
    { acceptRescue: RescueRequest },
    { input: AcceptRescueInput }
  >(ACCEPT_RESCUE, options);
}

export function useUpdateRescueProgressMutation(
  options?: MutationHookOptions<
    { updateRescueProgress: RescueRequest },
    { input: UpdateRescueProgressInput }
  >,
) {
  return useMutation<
    { updateRescueProgress: RescueRequest },
    { input: UpdateRescueProgressInput }
  >(UPDATE_RESCUE_PROGRESS, options);
}

export function useCompleteRescueMutation(
  options?: MutationHookOptions<
    { completeRescue: RescueRequest },
    { input: CompleteRescueInput }
  >,
) {
  return useMutation<
    { completeRescue: RescueRequest },
    { input: CompleteRescueInput }
  >(COMPLETE_RESCUE, options);
}

export function useCancelRescueMutation(
  options?: MutationHookOptions<
    { cancelRescue: RescueRequest },
    { rescueId: string; reason?: string }
  >,
) {
  return useMutation<
    { cancelRescue: RescueRequest },
    { rescueId: string; reason?: string }
  >(CANCEL_RESCUE, options);
}

export function useRescueRequestQuery(
  options: QueryHookOptions<
    { rescueRequest: RescueRequest | null },
    { id: string }
  >,
) {
  return useQuery<{ rescueRequest: RescueRequest | null }, { id: string }>(
    RESCUE_REQUEST,
    options,
  );
}

export function useMyRescueRequestsQuery(
  options?: QueryHookOptions<
    { myRescueRequests: RescueRequestConnection },
    { pagination?: PaginationInput; filter?: RescueRequestFilterInput }
  >,
) {
  return useQuery<
    { myRescueRequests: RescueRequestConnection },
    { pagination?: PaginationInput; filter?: RescueRequestFilterInput }
  >(MY_RESCUE_REQUESTS, options);
}

export function useMyAssignedRescuesQuery(
  options?: QueryHookOptions<
    { myAssignedRescues: RescueRequestConnection },
    { pagination?: PaginationInput; filter?: RescueRequestFilterInput }
  >,
) {
  return useQuery<
    { myAssignedRescues: RescueRequestConnection },
    { pagination?: PaginationInput; filter?: RescueRequestFilterInput }
  >(MY_ASSIGNED_RESCUES, options);
}

export function useActiveRescuesQuery(
  options?: QueryHookOptions<
    { activeRescues: RescueRequestConnection },
    { pagination?: PaginationInput }
  >,
) {
  return useQuery<
    { activeRescues: RescueRequestConnection },
    { pagination?: PaginationInput }
  >(ACTIVE_RESCUES, options);
}

export function useEmergencyRescuesCountQuery(
  options?: QueryHookOptions<
    { emergencyRescuesCount: number },
    Record<string, never>
  >,
) {
  return useQuery<{ emergencyRescuesCount: number }, Record<string, never>>(
    EMERGENCY_RESCUES_COUNT,
    {
      ...options,
      pollInterval: 10000,
      fetchPolicy: 'cache-and-network',
    },
  );
}

export function useRescueWithTrackingQuery(
  options: QueryHookOptions<
    { rescueRequest: RescueRequest | null },
    { id: string }
  >,
) {
  return useQuery<{ rescueRequest: RescueRequest | null }, { id: string }>(
    RESCUE_WITH_TRACKING,
    options,
  );
}

export interface AvailableVolunteer {
  volunteer: {
    id: string;
    name: string;
    contact?: string;
    experience?: string;
    experienceYears?: number;
    totalRescues?: number;
    rating?: number;
    currentLat?: number;
    currentLng?: number;
  };
  distance?: number;
  estimatedArrival?: number;
  currentlyAssigned: number;
  rankingScore: number;
}

export interface FindAvailableVolunteersInput {
  lat: number;
  lng: number;
  limit?: number;
  radiusKm: number;
}

export function useAvailableVolunteersQuery(
  options?: QueryHookOptions<
    { availableVolunteers: AvailableVolunteer[] },
    { input: FindAvailableVolunteersInput }
  >,
) {
  return useQuery<
    { availableVolunteers: AvailableVolunteer[] },
    { input: FindAvailableVolunteersInput }
  >(AVAILABLE_VOLUNTEERS, options);
}

/**
 * Get available rescues for queue (rescuer can accept)
 * Shows PENDING unassigned rescues
 */
export function useAvailableRescuesQuery(
  options?: QueryHookOptions<
    { availableRescues: RescueRequestConnection },
    { pagination?: PaginationInput; filter?: RescueRequestFilterInput }
  >,
) {
  return useQuery<
    { availableRescues: RescueRequestConnection },
    { pagination?: PaginationInput; filter?: RescueRequestFilterInput }
  >(AVAILABLE_RESCUES, options);
}

/**
 * Accept rescue from queue (self-service)
 * ATOMIC - prevents race condition
 */
export function useAcceptFromQueueMutation(
  options?: MutationHookOptions<
    { acceptFromQueue: RescueRequest },
    { input: AcceptRescueInput }
  >,
) {
  return useMutation<
    { acceptFromQueue: RescueRequest },
    { input: AcceptRescueInput }
  >(ACCEPT_FROM_QUEUE, options);
}
