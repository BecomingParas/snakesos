'use client';

import { useState, useEffect } from 'react';
import type { AdminStats, RescueRecord } from '../types';

interface UseAdminStatsReturn {
  stats: AdminStats | null;
  recentRescues: RescueRecord[];
  loading: boolean;
  error: Error | null;
}

export function useAdminStats(): UseAdminStatsReturn {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentRescues, setRecentRescues] = useState<RescueRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [rescueRes, volunteerRes, speciesRes, blogRes] = await Promise.all([
          fetch('/api/rescue?limit=100'),
          fetch('/api/volunteer'),
          fetch('/api/species'),
          fetch('/api/blog?limit=10'),
        ]);

        const [rescueData, volunteerData, speciesData, blogData] = await Promise.all([
          rescueRes.json(),
          volunteerRes.json(),
          speciesRes.json(),
          blogRes.json(),
        ]);

        const rescues = rescueData.data || [];
        const volunteers = volunteerData.data || [];

        setStats({
          totalRescues: rescues.length,
          pendingRescues: rescues.filter((r: any) => r.status === 'PENDING').length,
          completedRescues: rescues.filter(
            (r: any) => r.status === 'RESCUED' || r.status === 'CLOSED'
          ).length,
          activeRescues: rescues.filter(
            (r: any) => r.status === 'ASSIGNED' || r.status === 'IN_PROGRESS'
          ).length,
          totalVolunteers: volunteers.length,
          pendingVolunteers: volunteers.filter((v: any) => v.status === 'PENDING').length,
          totalSpecies: (speciesData.data || []).length,
          totalBlogs: blogData.total || 0,
        });

        setRecentRescues(rescues.slice(0, 5));
        setError(null);
      } catch (err) {
        console.error('Failed to fetch admin stats:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { stats, recentRescues, loading, error };
}
