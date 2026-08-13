/**
 * Rescue GraphQL Queries
 */

import { gql } from '@apollo/client';

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
    assignedVolunteer {
      id
      status
      user {
        id
        name
        phone
      }
    }
    assignedAt
    assignedBy {
      id
      name
    }
    createdAt
    updatedAt
  }
`;

/**
 * List Rescue Requests Query
 * Used for map views and rescue lists
 */
export const LIST_RESCUES_QUERY = gql`
  ${RESCUE_REQUEST_FRAGMENT}
  
  query ListRescues($filter: RescueRequestFilterInput, $pagination: PaginationInput, $sort: RescueSortInput) {
    rescueRequests(filter: $filter, pagination: $pagination, sort: $sort) {
      edges {
        node {
          ...RescueRequestFields
        }
      }
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

/**
 * Get Rescue Request by ID
 */
export const GET_RESCUE_REQUEST = gql`
  ${RESCUE_REQUEST_FRAGMENT}
  
  query GetRescueRequest($id: ID!) {
    rescueRequest(id: $id) {
      ...RescueRequestFields
    }
  }
`;

/**
 * Get My Rescue Requests (Citizen)
 */
export const GET_MY_RESCUE_REQUESTS = gql`
  ${RESCUE_REQUEST_FRAGMENT}
  
  query GetMyRescueRequests($pagination: PaginationInput, $filter: RescueRequestFilterInput) {
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
 * Get My Assigned Rescues (Rescuer/Volunteer)
 */
export const GET_MY_ASSIGNED_RESCUES = gql`
  ${RESCUE_REQUEST_FRAGMENT}
  
  query GetMyAssignedRescues($pagination: PaginationInput, $filter: RescueRequestFilterInput) {
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
 * Get Active Rescues (Admin)
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
 * Search Rescues
 */
export const SEARCH_RESCUES = gql`
  ${RESCUE_REQUEST_FRAGMENT}
  
  query SearchRescues($query: String!, $pagination: PaginationInput, $filter: RescueRequestFilterInput) {
    searchRescues(query: $query, pagination: $pagination, filter: $filter) {
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
 * Get Nearby Rescues (Duplicate Detection)
 */
export const GET_NEARBY_RESCUES = gql`
  query GetNearbyRescues($input: NearbyRescuesInput!) {
    nearbyRescues(input: $input) {
      rescue {
        id
        address
        lat
        lng
        status
      }
      distance
    }
  }
`;
