'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Activity,
  MapPin,
  Clock,
  Award,
  AlertTriangle,
  BarChart3,
  Download,
  Loader2,
} from 'lucide-react';
import { useDashboardStats } from '@/hooks/dashboard/useDashboardStats';
import { toast } from 'sonner';

/**
 * Admin Analytics Page
 * Real dashboard stats via GraphQL
 */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold tracking-[0.16em] text-success uppercase mb-1">
      {children}
    </p>
  );
}

function Panel({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card
      className={`border border-border bg-card/70 backdrop-blur-xl shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset] ${className}`}
    >
      {children}
    </Card>
  );
}

function StatCard({
  label,
  value,
  trendUp,
  trendLabel,
  trendColor,
  icon: Icon,
  iconColor,
  iconDim,
}: {
  label: string;
  value: string;
  trendUp: boolean;
  trendLabel: string;
  trendColor: string;
  icon: any;
  iconColor: string;
  iconDim: string;
}) {
  const TrendIcon = trendUp ? TrendingUp : TrendingDown;
  return (
    <Panel className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className="text-2xl font-bold mt-1.5 text-foreground">{value}</p>
          <div className="flex items-center gap-1.5 mt-2.5">
            <TrendIcon className="h-3.5 w-3.5" style={{ color: trendColor }} />
            <span className="text-xs font-medium" style={{ color: trendColor }}>
              {trendLabel}
            </span>
          </div>
        </div>
        <div className="p-2.5 rounded-lg" style={{ backgroundColor: iconDim }}>
          <Icon className="h-5 w-5" style={{ color: iconColor }} />
        </div>
      </div>
    </Panel>
  );
}

function StatusBar({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-sm font-semibold text-foreground">{value}</span>
      </div>
      <div className="w-full h-2 rounded-full bg-black/30 border border-border overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function HealthRow({
  label,
  value,
  sublabel,
  color,
  dim,
}: {
  label: string;
  value: string;
  sublabel: string;
  color: string;
  dim: string;
}) {
  return (
    <div
      className="p-4 rounded-lg border border-border"
      style={{ backgroundColor: dim }}
    >
      <div className="flex items-center justify-between">
        <span className="font-medium text-sm" style={{ color }}>
          {label}
        </span>
        <span className="text-2xl font-bold" style={{ color }}>
          {value}
        </span>
      </div>
      <p className="text-xs text-muted-foreground mt-1">{sublabel}</p>
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const [dateRange, setDateRange] = useState('30days');

  const periodByRange = {
    '7days': 'LAST_7_DAYS',
    '30days': 'LAST_30_DAYS',
    '90days': 'LAST_90_DAYS',
    year: 'THIS_YEAR',
  } as const;
  const { stats, loading, error } = useDashboardStats({
    period: periodByRange[dateRange as keyof typeof periodByRange],
  });

  const analytics = useMemo(() => {
    if (!stats) return null;

    const totalRescues = stats.totalRescues || 0;
    const completedRescues = stats.completedRescues || 0;
    const activeRescues = stats.activeRescues || 0;
    const cancelledRescues = Math.max(
      totalRescues - completedRescues - activeRescues,
      0,
    );
    const successRate =
      totalRescues > 0 ? (completedRescues / totalRescues) * 100 : 0;

    return {
      totalRescues,
      activeRescues,
      completedRescues,
      cancelledRescues,
      successRate,
      avgResponseTime: stats.averageResponseTime || 0,
      totalRescuers: stats.totalVolunteers || 0,
      availableRescuers: stats.activeVolunteers || 0,
      totalCitizens: stats.totalUsers || 0,
      recentRescues: stats.recentRescues || [],
    };
  }, [stats]);

  const handleExport = () => {
    toast.success('Export functionality coming soon!');
    // Future: Generate CSV/PDF report
  };

  useEffect(() => {
    if (error) toast.error(`Failed to load analytics: ${error.message}`);
  }, [error]);

  const municipalityStats = useMemo(() => {
    if (!analytics) return [];
    const counts = new Map<string, number>();
    analytics.recentRescues.forEach((rescue) => {
      counts.set(
        rescue.municipality,
        (counts.get(rescue.municipality) || 0) + 1,
      );
    });
    return Array.from(counts, ([name, rescues]) => ({ name, rescues })).sort(
      (left, right) => right.rescues - left.rescues,
    );
  }, [analytics]);

  const responseOnTarget = (analytics?.avgResponseTime ?? 0) <= 15;
  const utilizationPct =
    analytics && analytics.totalRescuers > 0
      ? Math.round(
          (analytics.availableRescuers / analytics.totalRescuers) * 100,
        )
      : 0;

  return (
    <div className="p-6 md:p-8 space-y-6 text-foreground">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <Eyebrow>Command Center · Reporting</Eyebrow>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <BarChart3 className="h-7 w-7 text-success" />
            Analytics Dashboard
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            System-wide performance metrics and insights
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 rounded-lg border border-border bg-black/30 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-success/40"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="year">This Year</option>
          </select>
          <Button
            variant="outline"
            onClick={handleExport}
            className="border-border text-foreground bg-black/20 hover:bg-white/5"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-7 w-7 animate-spin text-success" />
        </div>
      )}

      {!loading && analytics && (
        <>
          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Total Rescues"
              value={String(analytics.totalRescues)}
              trendUp
              trendLabel="All Time"
              trendColor="hsl(var(--primary))"
              icon={Activity}
              iconColor="hsl(var(--primary))"
              iconDim="hsl(var(--primary) / 0.14)"
            />
            <StatCard
              label="Success Rate"
              value={`${analytics.successRate.toFixed(1)}%`}
              trendUp
              trendLabel={
                analytics.successRate >= 95
                  ? 'Excellent'
                  : analytics.successRate >= 85
                    ? 'Good'
                    : 'Fair'
              }
              trendColor="hsl(var(--success))"
              icon={Award}
              iconColor="hsl(var(--success))"
              iconDim="hsl(var(--success) / 0.14)"
            />
            <StatCard
              label="Avg Response"
              value={`${analytics.avgResponseTime}m`}
              trendUp={!responseOnTarget}
              trendLabel={responseOnTarget ? 'On Target' : 'Above Target'}
              trendColor={
                responseOnTarget ? 'hsl(var(--success))' : 'hsl(var(--warning))'
              }
              icon={Clock}
              iconColor={
                responseOnTarget ? 'hsl(var(--success))' : 'hsl(var(--warning))'
              }
              iconDim={
                responseOnTarget
                  ? 'hsl(var(--success) / 0.14)'
                  : 'hsl(var(--warning) / 0.14)'
              }
            />
            <StatCard
              label="Active Rescuers"
              value={`${analytics.availableRescuers}/${analytics.totalRescuers}`}
              trendUp
              trendLabel={`${utilizationPct}% Available`}
              trendColor="hsl(var(--primary))"
              icon={Users}
              iconColor="hsl(var(--primary))"
              iconDim="hsl(var(--primary) / 0.14)"
            />
          </div>

          {/* Charts Row */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Rescue Status Breakdown */}
            <Panel className="p-6">
              <Eyebrow>Distribution</Eyebrow>
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <BarChart3 className="h-5 w-5 text-success" />
                Rescue Status Breakdown
              </h2>
              <div className="space-y-4">
                <StatusBar
                  label="Completed"
                  value={analytics.completedRescues}
                  total={analytics.totalRescues}
                  color="hsl(var(--success))"
                />
                <StatusBar
                  label="Active"
                  value={analytics.activeRescues}
                  total={analytics.totalRescues}
                  color="hsl(var(--primary))"
                />
                <StatusBar
                  label="Cancelled"
                  value={analytics.cancelledRescues}
                  total={analytics.totalRescues}
                  color="hsl(var(--destructive))"
                />
              </div>
            </Panel>

            {/* System Health */}
            <Panel className="p-6">
              <Eyebrow>Vitals</Eyebrow>
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <Activity className="h-5 w-5 text-success" />
                System Health
              </h2>
              <div className="space-y-3">
                <HealthRow
                  label="Rescue Success Rate"
                  value={`${analytics.successRate.toFixed(1)}%`}
                  sublabel={`${analytics.completedRescues} successfully completed`}
                  color="hsl(var(--success))"
                  dim="hsl(var(--success) / 0.14)"
                />
                <HealthRow
                  label="Response Time"
                  value={`${analytics.avgResponseTime}m`}
                  sublabel={
                    responseOnTarget
                      ? 'Meeting target of 15 minutes'
                      : 'Above 15 minute target'
                  }
                  color={
                    responseOnTarget
                      ? 'hsl(var(--success))'
                      : 'hsl(var(--warning))'
                  }
                  dim={
                    responseOnTarget
                      ? 'hsl(var(--success) / 0.14)'
                      : 'hsl(var(--warning) / 0.14)'
                  }
                />
                <HealthRow
                  label="Rescuer Utilization"
                  value={`${utilizationPct}%`}
                  sublabel={`${analytics.availableRescuers} of ${analytics.totalRescuers} available`}
                  color="hsl(var(--primary))"
                  dim="hsl(var(--primary) / 0.14)"
                />
              </div>
            </Panel>
          </div>

          {/* Municipality Performance */}
          <Panel className="p-6">
            <Eyebrow>By Region</Eyebrow>
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-success" />
              Performance by Municipality
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2.5 px-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Municipality
                    </th>
                    <th className="text-right py-2.5 px-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Recent Rescues
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {municipalityStats.map((muni) => (
                    <tr
                      key={muni.name}
                      className="border-b border-border last:border-0"
                    >
                      <td className="py-3 px-3 font-medium text-sm flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-success" />
                        {muni.name}
                      </td>
                      <td className="py-3 px-3 text-right text-sm text-muted-foreground">
                        {muni.rescues}
                      </td>
                    </tr>
                  ))}
                  {municipalityStats.length === 0 && (
                    <tr>
                      <td
                        colSpan={2}
                        className="py-8 text-center text-sm text-muted-foreground"
                      >
                        No rescue data for this period.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Panel>

          {/* Performance Alerts */}
          <Panel className="p-6">
            <Eyebrow>Watch List</Eyebrow>
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 text-warning">
              <AlertTriangle className="h-5 w-5" />
              Performance Alerts
            </h2>
            <div className="space-y-3">
              {analytics.avgResponseTime > 15 && (
                <div className="p-4 rounded-lg border border-warning/30 bg-warning/15">
                  <p className="font-medium text-sm text-warning">
                    Response time is above target
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Current average: {analytics.avgResponseTime} minutes.
                  </p>
                </div>
              )}
              {analytics.totalRescuers === 0 && (
                <p className="text-sm text-muted-foreground">
                  No rescuer records are available.
                </p>
              )}
              {analytics.avgResponseTime <= 15 &&
                analytics.totalRescuers > 0 && (
                  <p className="text-sm text-muted-foreground">
                    No performance alerts for this period.
                  </p>
                )}
            </div>
          </Panel>
        </>
      )}
    </div>
  );
}
