'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  Award,
  TrendingUp,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMyAssignedRescuesQuery } from '@/lib/graphql/hooks/rescue.hooks';
import { toast } from 'sonner';
import { DashboardPagination } from '@/components/dashboard/dashboard-pagination';

/**
 * Rescuer History Page
 * Shows past rescues and performance statistics
 * ✅ INTEGRATED: GraphQL query for historical rescues
 */

const OUTCOME_LABELS = {
  RESCUED_RELOCATED: 'Rescued & Relocated',
  ALREADY_GONE: 'Already Gone',
  FALSE_ALARM: 'False Alarm',
  NO_SNAKE_FOUND: 'Not Found',
  DECEASED: 'Deceased',
};

export default function RescuerHistoryPage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTab]);

  // Fetch all completed and cancelled rescues
  const { data, loading, error } = useMyAssignedRescuesQuery({
    variables: {
      filter: { statuses: ['COMPLETED', 'CANCELLED'] },
      pagination: { limit: pageSize, page: currentPage },
    },
    fetchPolicy: 'cache-and-network',
    pollInterval: 30000, // Slower polling for history
  });

  // Extract rescues from GraphQL response
  const allHistory = useMemo(
    () => data?.myAssignedRescues?.edges?.map((e) => e.node) || [],
    [data],
  );

  // Calculate statistics from real data
  const stats = useMemo(() => {
    const completed = allHistory.filter((r) => r.status === 'COMPLETED');
    const totalRescues = allHistory.length;
    const completedCount = completed.length;

    // Calculate average duration (in minutes)
    const avgDuration =
      completed.length > 0
        ? Math.round(
            completed.reduce((sum, r) => sum + (r.rescueDuration || 0), 0) /
              completed.length,
          )
        : 0;

    // Calculate success rate
    const successRate =
      totalRescues > 0
        ? ((completedCount / totalRescues) * 100).toFixed(1)
        : '0.0';

    // This week (last 7 days)
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const thisWeek = allHistory.filter(
      (r) => new Date(r.completedAt || r.updatedAt) >= weekAgo,
    ).length;

    // This month (last 30 days)
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const thisMonth = allHistory.filter(
      (r) => new Date(r.completedAt || r.updatedAt) >= monthAgo,
    ).length;

    return {
      totalRescues,
      completedRescues: completedCount,
      successRate: parseFloat(successRate),
      averageRating: 4.8, // TODO: Get from backend when available
      averageResponseTime: 12, // TODO: Calculate from data
      averageRescueDuration: avgDuration,
      thisMonth,
      thisWeek,
    };
  }, [allHistory]);

  // Filter rescues by tab
  const filteredHistory = useMemo(() => {
    if (selectedTab === 'thisWeek') {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return allHistory.filter(
        (r) => new Date(r.completedAt || r.updatedAt) >= weekAgo,
      );
    }
    if (selectedTab === 'thisMonth') {
      const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      return allHistory.filter(
        (r) => new Date(r.completedAt || r.updatedAt) >= monthAgo,
      );
    }
    return allHistory;
  }, [allHistory, selectedTab]);

  // Show error state
  if (error) {
    toast.error(`Failed to load history: ${error.message}`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Rescue History
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Your performance and past rescues
          </p>
        </div>

        {/* Loading State */}
        {loading && !data && (
          <Card className="p-8 text-center mb-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
            <p className="text-gray-600 dark:text-gray-400">
              Loading rescue history...
            </p>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Card className="p-6 mb-8 border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
            <div className="flex items-center gap-2 text-red-900 dark:text-red-100">
              <AlertCircle className="h-5 w-5" />
              <p>Failed to load history: {error.message}</p>
            </div>
          </Card>
        )}

        {/* Stats Grid */}
        {!loading && (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Total Rescues
                    </p>
                    <p className="mt-1 text-3xl font-bold">
                      {stats.totalRescues}
                    </p>
                  </div>
                  <CheckCircle className="h-10 w-10 text-primary" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Success Rate
                    </p>
                    <p className="mt-1 text-3xl font-bold">
                      {stats.successRate}%
                    </p>
                  </div>
                  <TrendingUp className="h-10 w-10 text-green-500" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Average Rating
                    </p>
                    <p className="mt-1 text-3xl font-bold">
                      ⭐ {stats.averageRating}
                    </p>
                  </div>
                  <Award className="h-10 w-10 text-yellow-500" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      This Month
                    </p>
                    <p className="mt-1 text-3xl font-bold">{stats.thisMonth}</p>
                  </div>
                  <Clock className="h-10 w-10 text-blue-500" />
                </div>
              </Card>
            </div>

            {/* Performance Metrics */}
            <Card className="p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">
                Performance Metrics
              </h2>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Avg Response Time
                  </p>
                  <p className="text-2xl font-bold">
                    {stats.averageResponseTime} min
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Avg Rescue Duration
                  </p>
                  <p className="text-2xl font-bold">
                    {stats.averageRescueDuration} min
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    This Week
                  </p>
                  <p className="text-2xl font-bold">{stats.thisWeek} rescues</p>
                </div>
              </div>
            </Card>
          </>
        )}

        {/* History List */}
        {!loading && (
          <>
            <Tabs
              value={selectedTab}
              onValueChange={setSelectedTab}
              className="space-y-6"
            >
              <TabsList>
                <TabsTrigger value="all">All ({allHistory.length})</TabsTrigger>
                <TabsTrigger value="thisWeek">
                  This Week ({stats.thisWeek})
                </TabsTrigger>
                <TabsTrigger value="thisMonth">
                  This Month ({stats.thisMonth})
                </TabsTrigger>
              </TabsList>

              <TabsContent value={selectedTab} className="space-y-4">
                {filteredHistory.length === 0 ? (
                  <Card className="p-12 text-center">
                    <Clock className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-semibold">
                      {selectedTab === 'all'
                        ? 'No Rescue History'
                        : `No Rescues ${selectedTab === 'thisWeek' ? 'This Week' : 'This Month'}`}
                    </h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      {selectedTab === 'all'
                        ? 'Your completed rescues will appear here'
                        : 'Complete some rescues to see them here'}
                    </p>
                  </Card>
                ) : (
                  filteredHistory.map((rescue) => (
                    <Card
                      key={rescue.id}
                      className="p-6 hover:border-primary cursor-pointer transition-colors"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">
                            {rescue.referenceNumber}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {rescue.address}, {rescue.municipality}
                          </p>
                        </div>
                        <Badge
                          className={
                            rescue.status === 'COMPLETED'
                              ? 'bg-green-500 text-white'
                              : 'bg-red-500 text-white'
                          }
                        >
                          {rescue.status === 'COMPLETED'
                            ? 'Completed'
                            : 'Cancelled'}
                        </Badge>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-4 text-sm">
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">
                            Outcome
                          </p>
                          <p className="font-medium">
                            {rescue.outcome
                              ? OUTCOME_LABELS[
                                  rescue.outcome as keyof typeof OUTCOME_LABELS
                                ] || rescue.outcome
                              : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">
                            Duration
                          </p>
                          <p className="font-medium">
                            {rescue.rescueDuration
                              ? `${rescue.rescueDuration} min`
                              : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">
                            Rating
                          </p>
                          <p className="font-medium">
                            ⭐ {stats.averageRating}/5
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">
                            Completed
                          </p>
                          <p className="font-medium">
                            {new Date(
                              rescue.completedAt || rescue.updatedAt,
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {rescue.rescueReport && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Report
                          </p>
                          <p className="text-sm">{rescue.rescueReport}</p>
                        </div>
                      )}
                    </Card>
                  ))
                )}
              </TabsContent>
            </Tabs>
            <DashboardPagination
              page={currentPage}
              pageSize={pageSize}
              totalCount={data?.myAssignedRescues?.totalCount || 0}
              pageInfo={data?.myAssignedRescues?.pageInfo}
              onPageChange={setCurrentPage}
              onPageSizeChange={(nextPageSize) => {
                setPageSize(nextPageSize);
                setCurrentPage(1);
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}
