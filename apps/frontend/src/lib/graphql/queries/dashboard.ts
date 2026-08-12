/**
 * Dashboard GraphQL Queries
 */

import { gql } from '@apollo/client';

// Get current user with role
export const GET_ME_QUERY = gql`
  query GetMe {
    me {
      id
      email
      name
      role
      phone
      emailVerified
      avatar
      createdAt
      updatedAt
      volunteerProfile {
        id
        status
        experience
        municipality
        totalRescues
        rating
      }
    }
  }
`;

// Admin Dashboard Stats
export const GET_DASHBOARD_STATS_QUERY = gql`
  query GetDashboardStats($period: AnalyticsTimePeriod) {
    dashboardStats(period: $period) {
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
      recentRescues {
        id
        requesterName
        municipality
        status
        priority
        createdAt
      }
      recentDonations {
        id
        amount
        donorName
        createdAt
      }
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
    }
  }
`;

// Citizen Dashboard - My Requests
export const GET_MY_RESCUE_REQUESTS_QUERY = gql`
  query GetMyRescueRequests($pagination: PaginationInput, $filter: RescueRequestFilterInput) {
    myRescueRequests(pagination: $pagination, filter: $filter) {
      edges {
        id
        requesterName
        requesterPhone
        municipality
        landmark
        description
        status
        priority
        createdAt
        updatedAt
        assignedVolunteers {
          id
          user {
            name
            phone
          }
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

// Rescuer Dashboard - Assigned Rescues
export const GET_MY_ASSIGNED_RESCUES_QUERY = gql`
  query GetMyAssignedRescues($pagination: PaginationInput, $filter: RescueRequestFilterInput) {
    myAssignedRescues(pagination: $pagination, filter: $filter) {
      edges {
        id
        requesterName
        requesterPhone
        municipality
        landmark
        description
        status
        priority
        latitude
        longitude
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

// Active Rescues Count
export const GET_PENDING_RESCUES_COUNT_QUERY = gql`
  query GetPendingRescuesCount {
    pendingRescuesCount
  }
`;

// Rescuer Performance Stats
export const GET_RESCUER_STATS_QUERY = gql`
  query GetRescuerStats {
    me {
      id
      volunteerProfile {
        id
        totalRescues
        rating
        status
        experience
        municipality
        createdAt
      }
    }
  }
`;
