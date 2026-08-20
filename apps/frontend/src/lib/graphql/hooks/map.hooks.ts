/**
 * Map GraphQL Hooks
 * React hooks for geospatial intelligence queries
 */

import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';

// Hotspots Query
export const SNAKEBITE_HOTSPOTS_QUERY = gql`
  query SnakebiteHotspots($province: String, $district: String) {
    snakebiteHotspots(province: $province, district: $district) {
      id
      name
      description
      geometry
      district
      province
      riskScore
      riskLevel
      populationAtRisk
      source
      sourceUrl
      studyYear
      methodology
      confidence
      season
      active
    }
  }
`;

export interface SnakebiteHotspot {
  id: string;
  name: string;
  description?: string;
  geometry?: string;
  district?: string;
  province?: string;
  riskScore: number;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH' | 'EXTREME';
  populationAtRisk?: number;
  source: string;
  sourceUrl?: string;
  studyYear?: number;
  methodology?: string;
  confidence?: number;
  season?: string;
  active: boolean;
}

export interface SnakebiteHotspotsData {
  snakebiteHotspots: SnakebiteHotspot[];
}

export interface SnakebiteHotspotsVariables {
  province?: string;
  district?: string;
}

export function useSnakebiteHotspots(variables?: SnakebiteHotspotsVariables) {
  return useQuery<SnakebiteHotspotsData, SnakebiteHotspotsVariables>(
    SNAKEBITE_HOTSPOTS_QUERY,
    {
      variables,
      fetchPolicy: 'cache-and-network',
    }
  );
}
