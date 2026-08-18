/**
 * Hospital GraphQL Mutations
 * Frontend mutations for hospital and antivenom management
 */

import { gql } from '@apollo/client';
import { HOSPITAL_FRAGMENT } from '../queries/hospital.queries';

/**
 * Create new hospital (Admin only)
 */
export const CREATE_HOSPITAL = gql`
  ${HOSPITAL_FRAGMENT}
  mutation CreateHospital($input: CreateHospitalInput!) {
    createHospital(input: $input) {
      ...HospitalFields
    }
  }
`;

/**
 * Update hospital (Admin only)
 */
export const UPDATE_HOSPITAL = gql`
  ${HOSPITAL_FRAGMENT}
  mutation UpdateHospital($id: ID!, $input: UpdateHospitalInput!) {
    updateHospital(id: $id, input: $input) {
      ...HospitalFields
    }
  }
`;

/**
 * Delete hospital (Admin only - soft delete)
 */
export const DELETE_HOSPITAL = gql`
  mutation DeleteHospital($id: ID!) {
    deleteHospital(id: $id) {
      id
      status
    }
  }
`;

/**
 * Verify antivenom status (Admin/Coordinator)
 */
export const VERIFY_ANTIVENOM_STATUS = gql`
  mutation VerifyAntivenomStatus(
    $hospitalId: ID!
    $status: AntivenomStatus!
    $notes: String
  ) {
    verifyAntivenomStatus(
      hospitalId: $hospitalId
      status: $status
      notes: $notes
    ) {
      id
      hospitalId
      verifiedBy
      antivenomStatus
      verificationDate
      notes
    }
  }
`;

/**
 * Report antivenom status (Any authenticated user)
 */
export const REPORT_ANTIVENOM_STATUS = gql`
  mutation ReportAntivenomStatus(
    $hospitalId: ID!
    $status: AntivenomStatus!
    $notes: String
  ) {
    reportAntivenomStatus(
      hospitalId: $hospitalId
      status: $status
      notes: $notes
    ) {
      id
      hospitalId
      reportedBy
      antivenomStatus
      reportedAt
      notes
      verificationStatus
    }
  }
`;

/**
 * Bulk verify antivenom (Admin/Coordinator)
 */
export const BULK_VERIFY_ANTIVENOM = gql`
  mutation BulkVerifyAntivenom($verifications: [VerifyAntivenomInput!]!) {
    bulkVerifyAntivenom(verifications: $verifications) {
      success
      count
      verifications {
        id
        hospitalId
        antivenomStatus
        verificationDate
      }
    }
  }
`;
