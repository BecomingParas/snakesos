/**
 * Hospital GraphQL Hooks
 * React hooks for hospital and antivenom queries and mutations
 */

import * as React from 'react';
import { useApolloClient, useMutation, useQuery } from '@apollo/client/react';
import {
  GET_HOSPITAL,
  LIST_HOSPITALS,
  GET_NEARBY_HOSPITALS,
  GET_RECOMMENDED_HOSPITALS,
  SEARCH_HOSPITALS,
  GET_HOSPITALS_BY_PROVINCE,
  GET_HOSPITALS_BY_DISTRICT,
  GET_HOSPITAL_STATS,
} from '../queries/hospital.queries';
import {
  CREATE_HOSPITAL,
  UPDATE_HOSPITAL,
  DELETE_HOSPITAL,
  VERIFY_ANTIVENOM_STATUS,
  REPORT_ANTIVENOM_STATUS,
  BULK_VERIFY_ANTIVENOM,
} from '../mutations/hospital.mutations';

// ==================== QUERIES ====================

/**
 * Get single hospital by ID
 */
export function useHospital(id: string) {
  return useQuery(GET_HOSPITAL, {
    variables: { id },
    skip: !id,
  });
}

/**
 * List hospitals with filters and pagination
 */
export function useHospitals(filters?: unknown, pagination?: unknown) {
  return useQuery(LIST_HOSPITALS, {
    variables: { filter: filters, pagination },
  });
}

/**
 * Get nearby hospitals with distance calculation
 */
export function useNearbyHospitals(
  latitude?: number,
  longitude?: number,
  options?: {
    radiusKm?: number;
    antivenomRequired?: boolean;
    limit?: number;
    skip?: boolean;
  }
) {
  return useQuery(GET_NEARBY_HOSPITALS, {
    variables: {
      latitude,
      longitude,
      radiusKm: options?.radiusKm,
      antivenomRequired: options?.antivenomRequired,
      limit: options?.limit,
    },
    skip: !latitude || !longitude || options?.skip,
  });
}

/**
 * Get recommended hospitals based on emergency type
 */
export function useRecommendedHospitals(
  latitude?: number,
  longitude?: number,
  hasBite = false,
  skip = false
) {
  return useQuery(GET_RECOMMENDED_HOSPITALS, {
    variables: { latitude, longitude, hasBite },
    skip: !latitude || !longitude || skip,
  });
}

/**
 * Search hospitals
 */
export function useSearchHospitals(query: string, limit = 10) {
  return useQuery(SEARCH_HOSPITALS, {
    variables: { query, limit },
    skip: !query || query.length < 2,
  });
}

/**
 * Get hospitals by province
 */
export function useHospitalsByProvince(province: string, pagination?: unknown) {
  return useQuery(GET_HOSPITALS_BY_PROVINCE, {
    variables: { province, pagination },
    skip: !province,
  });
}

/**
 * Get hospitals by district
 */
export function useHospitalsByDistrict(district: string, pagination?: unknown) {
  return useQuery(GET_HOSPITALS_BY_DISTRICT, {
    variables: { district, pagination },
    skip: !district,
  });
}

/**
 * Get hospital statistics (Admin only)
 */
export function useHospitalStats() {
  return useQuery(GET_HOSPITAL_STATS);
}

// ==================== MUTATIONS ====================

/**
 * Create hospital mutation (Admin only)
 */
export function useCreateHospital() {
  const client = useApolloClient();
  
  return useMutation(CREATE_HOSPITAL, {
    onCompleted: () => {
      // Refetch hospitals list
      client.refetchQueries({
        include: [LIST_HOSPITALS, GET_HOSPITAL_STATS],
      });
    },
  });
}

/**
 * Update hospital mutation (Admin only)
 */
export function useUpdateHospital() {
  return useMutation(UPDATE_HOSPITAL, {
    refetchQueries: [GET_HOSPITAL_STATS],
  });
}

/**
 * Delete hospital mutation (Admin only)
 */
export function useDeleteHospital() {
  const client = useApolloClient();
  
  return useMutation(DELETE_HOSPITAL, {
    onCompleted: () => {
      client.refetchQueries({
        include: [LIST_HOSPITALS, GET_HOSPITAL_STATS],
      });
    },
  });
}

/**
 * Verify antivenom status mutation (Admin/Coordinator)
 */
export function useVerifyAntivenomStatus() {
  const client = useApolloClient();
  
  return useMutation(VERIFY_ANTIVENOM_STATUS, {
    onCompleted: (data: unknown) => {
      // Refetch affected hospital and related queries
      if (data && typeof data === 'object' && 'verifyAntivenomStatus' in data) {
        const result = data as { verifyAntivenomStatus?: { hospitalId?: string } };
        if (result.verifyAntivenomStatus?.hospitalId) {
          // Refetch the specific hospital
          client.refetchQueries({
            include: [GET_NEARBY_HOSPITALS, GET_RECOMMENDED_HOSPITALS, LIST_HOSPITALS],
          });
          // Refetch the specific hospital by ID
          client.query({
            query: GET_HOSPITAL,
            variables: { id: result.verifyAntivenomStatus.hospitalId },
            fetchPolicy: 'network-only',
          });
        }
      }
    },
  });
}

/**
 * Report antivenom status mutation (Any authenticated user)
 */
export function useReportAntivenomStatus() {
  return useMutation(REPORT_ANTIVENOM_STATUS);
}

/**
 * Bulk verify antivenom mutation (Admin/Coordinator)
 */
export function useBulkVerifyAntivenom() {
  const client = useApolloClient();
  
  return useMutation(BULK_VERIFY_ANTIVENOM, {
    onCompleted: () => {
      client.refetchQueries({
        include: [
          LIST_HOSPITALS,
          GET_NEARBY_HOSPITALS,
          GET_RECOMMENDED_HOSPITALS,
          GET_HOSPITAL_STATS,
        ],
      });
    },
  });
}

// ==================== UTILITY HOOKS ====================

/**
 * Get user's current location and nearby hospitals
 */
export function useNearbyHospitalsWithLocation(options?: {
  radiusKm?: number;
  antivenomRequired?: boolean;
  limit?: number;
}) {
  const [location, setLocation] = React.useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (err) => {
          setError(err.message);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
    }
  }, []);

  const { data, loading, error: queryError } = useNearbyHospitals(
    location?.lat,
    location?.lng,
    {
      ...options,
      skip: !location,
    }
  );

  return {
    hospitals: (data as { nearbyHospitals?: unknown[] })?.nearbyHospitals || [],
    loading: !location || loading,
    error: error || queryError?.message,
    location,
  };
}
