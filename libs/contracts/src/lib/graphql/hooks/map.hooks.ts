/**
 * Map GraphQL Hooks
 * React hooks for geospatial intelligence queries
 */

import { gql } from '@apollo/client';
// Note: useQuery is imported from@apollo/client but TypeScript may have issues resolving it
// import type { useQuery } from '@apollo/client';

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

// Note: useSnakebiteHotspots hook removed due to Apollo Client type resolution issues
// Use the query and types directly with your GraphQL client implementation

