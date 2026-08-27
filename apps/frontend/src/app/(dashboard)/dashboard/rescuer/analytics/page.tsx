'use client';

import { useMemo } from 'react';
import {
  Award,
  BarChart3,
  CheckCircle2,
  Clock3,
  DollarSign,
  Loader2,
  Target,
  TrendingUp,
  XCircle,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMyVolunteerProfileQuery } from '@/lib/graphql/hooks/volunteer.hooks';
import { useMyAssignedRescuesQuery } from '@/lib/graphql/hooks/rescue.hooks';
import { useMyFinance } from '@/lib/graphql/hooks/finance.hooks';

// ─────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────

const OUTCOME_LABELS: Record<string, string> = {
  RESCUED_RELOCATED: 'Rescued & Relocated',
  ALREADY_GONE: 'Already Gone',
  FALSE_ALARM: 'False Alarm',
  NO_SNAKE_FOUND: 'No Snake Found',
  DECEASED: 'Snake Deceased',
};

const OUTCOME_CHART_COLORS: Record<string, string> = {
  RESCUED_RELOCATED: 'hsl(var(--success))',
  ALREADY_GONE: 'hsl(var(--primary))',
  FALSE_ALARM: 'hsl(var(--warning))',
  NO_SNAKE_FOUND: 'hsl(var(--muted-foreground))',
  DECEASED: 'hsl(var(--destructive))',
};

const DEFAULT_OUTCOME_COLOR = 'hsl(var(--primary))';
const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;
const MONTHS_TO_SHOW = 6;

// ─────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────

interface OutcomeChartDatum {
  outcome: string;
  label: string;
  count: number;
  color: string;
}

interface MonthlyChartDatum {
  month: string;
  rescues: number;
  earnings: number;
}

interface FinanceAnalytics {
  totalEarned: number;
  paidOut: number;
  pending: number;
  currency: string;
  monthly: MonthlyChartDatum[];
}

interface RescueAnalytics {
  completed: number;
  cancelled: number;
  total: number;
  successRate: number;
  averageDuration: number;
  recent: number;
  outcomes: [string, number][];
  outcomeChartData: OutcomeChartDatum[];
  monthly: MonthlyChartDatum[];
}

// ─────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────

function computeAnalytics(rescues: any[]): RescueAnalytics {
  const completed = rescues.filter((rescue) => rescue.status === 'COMPLETED');
  const cancelled = rescues.filter((rescue) => rescue.status === 'CANCELLED');

  const durations = completed
    .map((rescue) => rescue.rescueDuration)
    .filter((duration): duration is number => typeof duration === 'number');

  const weekAgo = Date.now() - MS_PER_WEEK;
  const recent = rescues.filter(
    (rescue) =>
      new Date(rescue.completedAt || rescue.updatedAt).getTime() >= weekAgo,
  );

  const outcomeCounts = completed.reduce<Record<string, number>>(
    (counts, rescue) => {
      const outcome = rescue.outcome || 'UNKNOWN';
      counts[outcome] = (counts[outcome] || 0) + 1;
      return counts;
    },
    {},
  );

  const outcomes = Object.entries(outcomeCounts).sort(
    (left, right) => right[1] - left[1],
  );

  const outcomeChartData: OutcomeChartDatum[] = outcomes.map(
    ([outcome, count]) => ({
      outcome,
      label: OUTCOME_LABELS[outcome] || outcome,
      count,
      color: OUTCOME_CHART_COLORS[outcome] || DEFAULT_OUTCOME_COLOR,
    }),
  );

  const monthly = createMonthlyData();
  rescues.forEach((rescue) => addMonthlyRescue(monthly, rescue.createdAt));

  return {
    completed: completed.length,
    cancelled: cancelled.length,
    total: rescues.length,
    successRate: rescues.length ? (completed.length / rescues.length) * 100 : 0,
    averageDuration: durations.length
      ? Math.round(
          durations.reduce((sum, duration) => sum + duration, 0) /
            durations.length,
        )
      : 0,
    recent: recent.length,
    outcomes,
    outcomeChartData,
    monthly,
  };
}

function createMonthlyData(): MonthlyChartDatum[] {
  const now = new Date();
  return Array.from({ length: MONTHS_TO_SHOW }, (_, index) => {
    const date = new Date(
      now.getFullYear(),
      now.getMonth() - (MONTHS_TO_SHOW - index - 1),
      1,
    );
    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      rescues: 0,
      earnings: 0,
    };
  });
}

function addMonthlyRescue(data: MonthlyChartDatum[], dateValue?: string) {
  if (!dateValue) return;
  const rescueDate = new Date(dateValue);
  const monthIndex =
    data.length -
    1 -
    ((new Date().getFullYear() - rescueDate.getFullYear()) * 12 +
      new Date().getMonth() -
      rescueDate.getMonth());
  if (monthIndex >= 0 && monthIndex < data.length)
    data[monthIndex].rescues += 1;
}

function computeFinanceAnalytics(
  settlements: Array<{
    rescuerAmount: string;
    amount: string;
    currency: string;
    status: string;
    createdAt: string;
  }>,
  payouts: Array<{ amount: string; status: string }>,
): FinanceAnalytics {
  const totalEarned = settlements.reduce(
    (sum, settlement) =>
      sum + Number(settlement.rescuerAmount || settlement.amount || 0),
    0,
  );
  const paidOut = payouts
    .filter((payout) => payout.status === 'PAID' || payout.status === 'SETTLED')
    .reduce((sum, payout) => sum + Number(payout.amount || 0), 0);
  const pending = Math.max(totalEarned - paidOut, 0);
  const monthly = createMonthlyData();

  settlements.forEach((settlement) => {
    const settlementDate = new Date(settlement.createdAt);
    const monthIndex =
      monthly.length -
      1 -
      ((new Date().getFullYear() - settlementDate.getFullYear()) * 12 +
        new Date().getMonth() -
        settlementDate.getMonth());
    if (monthIndex >= 0 && monthIndex < monthly.length) {
      monthly[monthIndex].earnings += Number(
        settlement.rescuerAmount || settlement.amount || 0,
      );
    }
  });

  return {
    totalEarned,
    paidOut,
    pending,
    currency: settlements[0]?.currency || 'NPR',
    monthly,
  };
}

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

// ─────────────────────────────────────────────────────────────────────────
// Presentational components
// ─────────────────────────────────────────────────────────────────────────

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

function OutcomeChartTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const datum: OutcomeChartDatum = payload[0].payload;
  return (
    <div className="rounded-md border border-border bg-popover px-3 py-2 text-sm shadow-md">
      <p className="font-medium text-popover-foreground">{datum.label}</p>
      <p className="text-muted-foreground">{datum.count} rescue(s)</p>
    </div>
  );
}

function OutcomesList({ outcomes }: { outcomes: [string, number][] }) {
  if (!outcomes.length) {
    return (
      <p className="text-sm text-muted-foreground">
        Complete a rescue to see outcome analytics.
      </p>
    );
  }
  return (
    <div className="space-y-4">
      {outcomes.map(([outcome, count]) => (
        <div
          key={outcome}
          className="flex items-center justify-between gap-4 border-b border-border pb-3 last:border-0 last:pb-0"
        >
          <span className="text-sm">{OUTCOME_LABELS[outcome] || outcome}</span>
          <Badge variant="outline">{count}</Badge>
        </div>
      ))}
    </div>
  );
}

function OutcomesChart({ data }: { data: OutcomeChartDatum[] }) {
  if (!data.length) {
    return (
      <p className="text-sm text-muted-foreground">
        Chart appears once you have completed rescues.
      </p>
    );
  }
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 16, bottom: 4, left: 4 }}
        >
          <CartesianGrid
            horizontal={false}
            stroke="hsl(var(--border))"
            strokeDasharray="3 3"
          />
          <XAxis
            type="number"
            allowDecimals={false}
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <YAxis
            type="category"
            dataKey="label"
            width={130}
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
          />
          <Tooltip
            content={<OutcomeChartTooltip />}
            cursor={{ fill: 'hsl(var(--muted))', opacity: 0.3 }}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={28}>
            {data.map((entry) => (
              <Cell key={entry.outcome} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function MonthlyActivityChart({ data }: { data: MonthlyChartDatum[] }) {
  return (
    <div className="h-64 min-w-0 w-full sm:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 8, right: 8, bottom: 4, left: 0 }}
        >
          <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <YAxis
            yAxisId="rescues"
            allowDecimals={false}
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <YAxis
            yAxisId="earnings"
            orientation="right"
            hide
            domain={[0, 'auto']}
          />
          <Tooltip
            formatter={(value, name) => [
              name === 'earnings'
                ? formatCurrency(Number(value), 'NPR')
                : value,
              name === 'earnings' ? 'Earnings' : 'Rescues',
            ]}
            contentStyle={{
              borderRadius: 6,
              borderColor: 'hsl(var(--border))',
              backgroundColor: 'hsl(var(--popover))',
            }}
          />
          <Bar
            yAxisId="rescues"
            dataKey="rescues"
            fill="hsl(var(--primary))"
            radius={[4, 4, 0, 0]}
          />
          <Line
            yAxisId="earnings"
            type="monotone"
            dataKey="earnings"
            stroke="hsl(var(--success))"
            strokeWidth={3}
            dot={{ r: 4, fill: 'hsl(var(--success))' }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

function PageHeader() {
  return (
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
  );
}

function MetricsGrid({ analytics }: { analytics: RescueAnalytics }) {
  return (
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
  );
}

function OutcomesCard({ analytics }: { analytics: RescueAnalytics }) {
  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <CheckCircle2 className="h-5 w-5 text-success" />
        <h2 className="font-semibold">Rescue outcomes</h2>
      </div>
      <div className="mt-6">
        <OutcomesChart data={analytics.outcomeChartData} />
      </div>
      <div className="mt-6">
        <OutcomesList outcomes={analytics.outcomes} />
      </div>
    </Card>
  );
}

function FinanceCard({ analytics }: { analytics: FinanceAnalytics }) {
  return (
    <Card className="min-w-0 p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <DollarSign className="h-5 w-5 text-success" />
        <h2 className="font-semibold">Finance analytics</h2>
      </div>
      <div className="mt-6 grid min-w-0 gap-4 sm:grid-cols-3 sm:gap-5">
        <div>
          <p className="text-sm text-muted-foreground">Total earned</p>
          <p className="mt-1 text-2xl font-bold text-success">
            {formatCurrency(analytics.totalEarned, analytics.currency)}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Paid out</p>
          <p className="mt-1 text-2xl font-bold">
            {formatCurrency(analytics.paidOut, analytics.currency)}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="mt-1 text-2xl font-bold text-warning">
            {formatCurrency(analytics.pending, analytics.currency)}
          </p>
        </div>
      </div>
    </Card>
  );
}

function MonthlyActivityCard({ data }: { data: MonthlyChartDatum[] }) {
  return (
    <Card className="min-w-0 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="truncate font-semibold">Monthly rescue activity</h2>
        </div>
        <div className="flex shrink-0 items-center gap-3 text-xs text-muted-foreground sm:gap-4">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Rescues
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-success" />
            Earnings
          </span>
        </div>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Rescues handled and earnings by month.
      </p>
      <div className="mt-5">
        <MonthlyActivityChart data={data} />
      </div>
    </Card>
  );
}

function ActivitySummaryCard({
  analytics,
  profile,
}: {
  analytics: RescueAnalytics;
  profile: { rating?: number | null; totalRatings?: number | null } | undefined;
}) {
  return (
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
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────

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
  const { data: financeData, loading: financeLoading } = useMyFinance({
    pagination: { limit: 100, page: 1 },
  });

  const profile = profileData?.myVolunteerProfile;
  const rescues =
    rescueData?.myAssignedRescues?.edges.map((edge) => edge.node) || [];

  const analytics = useMemo(() => computeAnalytics(rescues), [rescues]);
  const financeAnalytics = useMemo(
    () =>
      computeFinanceAnalytics(
        financeData?.mySettlements?.edges.map((edge) => edge.node) || [],
        financeData?.myPayouts?.edges.map((edge) => edge.node) || [],
      ),
    [financeData],
  );

  if (profileLoading || rescueLoading || financeLoading) {
    return <LoadingState />;
  }

  return (
    <div className="mx-auto min-w-0 max-w-7xl space-y-6 p-4 sm:p-6">
      <PageHeader />
      <MetricsGrid analytics={analytics} />
      <FinanceCard analytics={financeAnalytics} />
      <MonthlyActivityCard
        data={analytics.monthly.map((month, index) => ({
          ...month,
          earnings: financeAnalytics.monthly[index]?.earnings || 0,
        }))}
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <OutcomesCard analytics={analytics} />
        <ActivitySummaryCard analytics={analytics} profile={profile} />
      </div>
    </div>
  );
}
