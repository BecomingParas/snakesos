/**
 * Dashboard GraphQL Queries
 */

import { gql } from '@apollo/client';

/**
 * Dashboard Stats Fragment
 */
export const DASHBOARD_STATS_FRAGMENT = gql`
  fragment DashboardStatsFields on DashboardStats {
    totalRescues
    activeRescues
    completedRescues
    completionRate
    averageResponseTime
    totalVolunteers
    activeVolunteers
    verifiedRescuers
    totalSpecies
    venomousEncounters
    totalUsers
    totalDonations
    totalDonationAmount
    rescueTrend {
      current
      previous
      change
      direction
    }
    volunteerTrend {
      current
      previous
      change
      direction
    }
    donationTrend {
      current
      previous
      change
      direction
    }
    recentRescues {
      id
      name
      municipality
      status
      priority
      createdAt
    }
  }
`;

/**
 * Rescue Request Fragment
 */
export const RESCUE_REQUEST_FRAGMENT = gql`
  fragment RescueRequestFields on RescueRequest {
    id
    name
    phone
    municipality
    ward
    address
    landmark
    lat
    lng
    snakeDescription
    snakeSize
    snakeColor
    snakeImageUrl
    status
    priority
    stillPresent
    isEmergency
    hasBite
    referenceNumber
    createdAt
    updatedAt
    assignedVolunteer {
      id
      user {
        id
        name
        phone
      }
      status
    }
  }
`;

/**
 * Get Dashboard Stats Query - Admin Dashboard
 */
export const GET_DASHBOARD_STATS = gql`
  ${DASHBOARD_STATS_FRAGMENT}

  query GetDashboardStats($period: AnalyticsTimePeriod) {
    dashboardStats(period: $period) {
      ...DashboardStatsFields
    }
  }
`;

/**
 * Get My Rescue Requests Query - Citizen Dashboard
 */
export const GET_MY_RESCUE_REQUESTS = gql`
  ${RESCUE_REQUEST_FRAGMENT}

  query GetMyRescueRequests(
    $pagination: PaginationInput
    $filter: RescueRequestFilterInput
  ) {
    myRescueRequests(pagination: $pagination, filter: $filter) {
      edges {
        node {
          ...RescueRequestFields
        }
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

/**
 * Get My Assigned Rescues Query - Rescuer Dashboard
 */
export const GET_MY_ASSIGNED_RESCUES = gql`
  ${RESCUE_REQUEST_FRAGMENT}

  query GetMyAssignedRescues(
    $pagination: PaginationInput
    $filter: RescueRequestFilterInput
  ) {
    myAssignedRescues(pagination: $pagination, filter: $filter) {
      edges {
        node {
          ...RescueRequestFields
        }
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

/**
 * Get Active Rescues Query - Admin/Rescuer View
 */
export const GET_ACTIVE_RESCUES = gql`
  ${RESCUE_REQUEST_FRAGMENT}

  query GetActiveRescues($pagination: PaginationInput) {
    activeRescues(pagination: $pagination) {
      edges {
        node {
          ...RescueRequestFields
        }
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

/**
 * Get Pending Rescues Count Query
 */
export const GET_PENDING_RESCUES_COUNT = gql`
  query GetPendingRescuesCount {
    pendingRescuesCount
  }
`;

/**
 * Get Current User Query
 */
export const GET_ME = gql`
  query GetMe {
    me {
      id
      email
      name
      role
      phone
      avatar
      emailVerified
      createdAt
      updatedAt
      volunteerProfile {
        id
        status
        experience
        completedRescues
        rating
      }
    }
  }
`;

/**
 * Get Rescue Stats Query - For stats cards
 */
export const GET_RESCUE_STATS = gql`
  query GetRescueStats($input: RescueStatsInput) {
    rescueStats(input: $input) {
      total
      pending
      inProgress
      completed
      cancelled
      averageResponseTime
      averageRescueTime
      successRate
      byPriority {
        priority
        count
        percentage
      }
      byMunicipality {
        municipality
        count
        percentage
      }
    }
  }
`;
