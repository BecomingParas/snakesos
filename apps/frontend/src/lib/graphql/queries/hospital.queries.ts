/**
 * Hospital GraphQL Queries
 * Frontend queries for hospital and antivenom data
 */

import { gql } from '@apollo/client';

/**
 * Hospital fragment with essential fields
 */
export const HOSPITAL_FRAGMENT = gql`
  fragment HospitalFields on Hospital {
    id
    name
    address
    municipality
    ward
    district
    province
    latitude
    longitude
    phone
    emergencyPhone
    emergencyAvailable
    emergency24x7
    snakebiteTreatmentAvailable
    treatmentCenterType
    antivenomStatus
    lastAntivenomVerification
    ventilatorAvailable
    icuAvailable
    ambulanceAvailable
    bloodBankAvailable
    hospitalType
    status
    createdAt
    updatedAt
  }
`;

/**
 * Get single hospital by ID
 */
export const GET_HOSPITAL = gql`
  ${HOSPITAL_FRAGMENT}
  query GetHospital($id: ID!) {
    hospital(id: $id) {
      ...HospitalFields
      verifications {
        id
        verifiedBy
        verificationDate
        antivenomStatus
        notes
      }
    }
  }
`;

/**
 * List hospitals with filters and pagination
 */
export const LIST_HOSPITALS = gql`
  ${HOSPITAL_FRAGMENT}
  query ListHospitals($filter: HospitalFilter, $pagination: PaginationInput) {
    hospitals(filter: $filter, pagination: $pagination) {
      edges {
        node {
          ...HospitalFields
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

/**
 * Get nearby hospitals with distance
 */
export const GET_NEARBY_HOSPITALS = gql`
  query GetNearbyHospitals(
    $latitude: Float!
    $longitude: Float!
    $radiusKm: Float
    $antivenomRequired: Boolean
    $limit: Int
  ) {
    nearbyHospitals(
      latitude: $latitude
      longitude: $longitude
      radiusKm: $radiusKm
      antivenomRequired: $antivenomRequired
      limit: $limit
    ) {
      id
      name
      address
      phone
      emergencyPhone
      distance
      distanceFormatted
      antivenomStatus
      emergency24x7
      estimatedTravelTime
      latitude
      longitude
      verificationFreshness
    }
  }
`;

/**
 * Get recommended hospitals based on emergency type
 */
export const GET_RECOMMENDED_HOSPITALS = gql`
  query GetRecommendedHospitals(
    $latitude: Float!
    $longitude: Float!
    $hasBite: Boolean
  ) {
    recommendedHospitals(
      latitude: $latitude
      longitude: $longitude
      hasBite: $hasBite
    ) {
      id
      name
      address
      phone
      emergencyPhone
      distance
      distanceFormatted
      antivenomStatus
      emergency24x7
      estimatedTravelTime
      latitude
      longitude
      verificationFreshness
    }
  }
`;

/**
 * Search hospitals by query
 */
export const SEARCH_HOSPITALS = gql`
  ${HOSPITAL_FRAGMENT}
  query SearchHospitals($query: String!, $limit: Int) {
    searchHospitals(query: $query, limit: $limit) {
      ...HospitalFields
    }
  }
`;

/**
 * Get hospitals by province
 */
export const GET_HOSPITALS_BY_PROVINCE = gql`
  ${HOSPITAL_FRAGMENT}
  query GetHospitalsByProvince($province: String!, $pagination: PaginationInput) {
    hospitalsByProvince(province: $province, pagination: $pagination) {
      edges {
        node {
          ...HospitalFields
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

/**
 * Get hospitals by district
 */
export const GET_HOSPITALS_BY_DISTRICT = gql`
  ${HOSPITAL_FRAGMENT}
  query GetHospitalsByDistrict($district: String!, $pagination: PaginationInput) {
    hospitalsByDistrict(district: $district, pagination: $pagination) {
      edges {
        node {
          ...HospitalFields
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

/**
 * Get hospital statistics (Admin only)
 */
export const GET_HOSPITAL_STATS = gql`
  query GetHospitalStats {
    hospitalStats {
      totalHospitals
      antivenomAvailable
      antivenomUnknown
      emergency24x7Count
      byProvince {
        province
        count
      }
    }
  }
`;
