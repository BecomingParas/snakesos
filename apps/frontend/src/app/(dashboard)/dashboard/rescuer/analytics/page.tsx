'use client';

import { useMemo } from 'react';
import {
  Award,
  BarChart3,
  CheckCircle2,
  Clock3,
  Loader2,
  Target,
  TrendingUp,
  XCircle,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMyVolunteerProfileQuery } from '@/lib/graphql/hooks/volunteer.hooks';
import { useMyAssignedRescuesQuery } from '@/lib/graphql/hooks/rescue.hooks';

const OUTCOME_LABELS: Record<string, string> = {
  RESCUED_RELOCATED: 'Rescued & Relocated',
  ALREADY_GONE: 'Already Gone',
  FALSE_ALARM: 'False Alarm',
  NO_SNAKE_FOUND: 'No Snake Found',
  DECEASED: 'Snake Deceased',
};

function Metric({
  label,
  value,
  detail,
  icon: Icon,
  className = 'text-primary',
}: {
  label: string;
  value: string;
  detail: string;
  icon: typeof BarChart3;
  className?: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 text-3xl font-bold">{value}</p>
          <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
        </div>
        <Icon className={`h-6 w-6 ${className}`} />
      </div>
    </Card>
  );
}

export default function RescuerAnalyticsPage() {
  const { data: profileData, loading: profileLoading } =
    useMyVolunteerProfileQuery({
      fetchPolicy: 'cache-and-network',
    });
  const { data: rescueData, loading: rescueLoading } =
    useMyAssignedRescuesQuery({
      variables: {
        filter: { statuses: ['COMPLETED', 'CANCELLED'] },
        pagination: { limit: 100, page: 1 },
      },
      fetchPolicy: 'cache-and-network',
    });

  const profile = profileData?.myVolunteerProfile;
  const rescues =
    rescueData?.myAssignedRescues?.edges.map((edge) => edge.node) || [];
  const analytics = useMemo(() => {
    const completed = rescues.filter((rescue) => rescue.status === 'COMPLETED');
    const cancelled = rescues.filter((rescue) => rescue.status === 'CANCELLED');
    const durations = completed
      .map((rescue) => rescue.rescueDuration)
      .filter((duration): duration is number => typeof duration === 'number');
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recent = rescues.filter(
      (rescue) =>
        new Date(rescue.completedAt || rescue.updatedAt).getTime() >= weekAgo,
    );
    const outcomes = completed.reduce<Record<string, number>>(
      (counts, rescue) => {
        const outcome = rescue.outcome || 'UNKNOWN';
        counts[outcome] = (counts[outcome] || 0) + 1;
        return counts;
      },
      {},
    );
    return {
      completed: completed.length,
      cancelled: cancelled.length,
      total: rescues.length,
      successRate: rescues.length
        ? (completed.length / rescues.length) * 100
        : 0,
      averageDuration: durations.length
        ? Math.round(
            durations.reduce((sum, duration) => sum + duration, 0) /
              durations.length,
          )
        : 0,
      recent: recent.length,
      outcomes: Object.entries(outcomes).sort(
        (left, right) => right[1] - left[1],
      ),
    };
  }, [rescues]);

  if (profileLoading || rescueLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <header>
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">
          Rescuer account
        </p>
        <h1 className="mt-2 flex items-center gap-3 text-2xl font-bold sm:text-3xl">
          <BarChart3 className="h-7 w-7 text-primary" />
          My performance
        </h1>
        <p className="mt-2 text-muted-foreground">
          Your rescue activity, outcomes, and performance metrics.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric
          label="Total rescues"
          value={String(analytics.total)}
          detail="Completed or cancelled"
          icon={Target}
        />
        <Metric
          label="Success rate"
          value={`${analytics.successRate.toFixed(1)}%`}
          detail="Completed rescues"
          icon={TrendingUp}
          className="text-success"
        />
        <Metric
          label="Average duration"
          value={`${analytics.averageDuration} min`}
          detail="Completed rescues"
          icon={Clock3}
          className="text-warning"
        />
        <Metric
          label="This week"
          value={String(analytics.recent)}
          detail="Rescue records"
          icon={Award}
          className="text-primary"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-success" />
            <h2 className="font-semibold">Rescue outcomes</h2>
          </div>
          <div className="mt-6 space-y-4">
            {analytics.outcomes.length ? (
              analytics.outcomes.map(([outcome, count]) => (
                <div
                  key={outcome}
                  className="flex items-center justify-between gap-4 border-b border-border pb-3 last:border-0 last:pb-0"
                >
                  <span className="text-sm">
                    {OUTCOME_LABELS[outcome] || outcome}
                  </span>
                  <Badge variant="outline">{count}</Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                Complete a rescue to see outcome analytics.
              </p>
            )}
          </div>
        </Card>
        <Card className="p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Activity summary</h2>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="mt-1 text-2xl font-bold text-success">
                {analytics.completed}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cancelled</p>
              <p className="mt-1 text-2xl font-bold text-destructive">
                {analytics.cancelled}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Profile rating</p>
              <p className="mt-1 text-2xl font-bold">
                {profile?.rating?.toFixed(1) || 'N/A'} / 5
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total ratings</p>
              <p className="mt-1 text-2xl font-bold">
                {profile?.totalRatings || 0}
              </p>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-2 border-t border-border pt-4 text-sm text-muted-foreground">
            <XCircle className="h-4 w-4" />
            Use these metrics to improve response and completion quality.
          </div>
        </Card>
      </div>
    </div>
  );
}
