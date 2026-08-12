/**
 * useDashboardStats Hook - Fetch admin dashboard statistics
 */

'use client';

import { useQuery } from '@apollo/client/react';
import { GET_DASHBOARD_STATS } from '@/lib/graphql/queries/dashboard.queries';
import { handleGraphQLError } from '@/lib/graphql';

export type AnalyticsTimePeriod = 
  | 'TODAY' 
  | 'YESTERDAY' 
  | 'LAST_7_DAYS' 
  | 'LAST_30_DAYS' 
  | 'LAST_90_DAYS' 
  | 'THIS_MONTH' 
  | 'LAST_MONTH' 
  | 'THIS_YEAR' 
  | 'LAST_YEAR' 
  | 'CUSTOM';

export interface TrendData {
  current: number;
  previous: number;
  change: number;
  direction: 'UP' | 'DOWN' | 'STABLE';
}

export interface DashboardStats {
  totalRescues: number;
  activeRescues: number;
  completedRescues: number;
  completionRate: number;
  averageResponseTime: number;
  totalVolunteers: number;
  activeVolunteers: number;
  verifiedRescuers: number;
  totalSpecies: number;
  venomousEncounters: number;
  totalUsers: number;
  totalDonations: number;
  totalDonationAmount: number;
  rescueTrend: TrendData;
  volunteerTrend: TrendData;
  donationTrend: TrendData;
}

export interface UseDashboardStatsOptions {
  period?: AnalyticsTimePeriod;
  skip?: boolean;
}

export function useDashboardStats(options: UseDashboardStatsOptions = {}) {
  const { period = 'THIS_MONTH', skip = false } = options;

  const { data, loading, error, refetch } = useQuery(GET_DASHBOARD_STATS, {
    variables: { period },
    skip,
    fetchPolicy: 'cache-and-network',
  });

  return {
    stats: (data as any)?.dashboardStats as DashboardStats | undefined,
    loading,
    error: error ? handleGraphQLError(error) : null,
    refetch,
  };
}
