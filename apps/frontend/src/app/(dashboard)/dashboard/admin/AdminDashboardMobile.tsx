'use client';

import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  Clock,
  Users,
  TrendingUp,
  CheckCircle2,
  Shield,
  Siren,
  ChevronRight,
  AlertCircle,
  Radio,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DashboardStats {
  activeRescues: number;
  activeVolunteers: number;
  completedRescues: number;
  verifiedRescuers: number;
  averageResponseTime: number;
  completionRate: number;
  rescueTrend: { change: number };
  volunteerTrend: { change: number };
}

interface AdminDashboardMobileProps {
  stats: DashboardStats;
}

/**
 * Mobile Admin Dashboard
 * Prioritized card-based layout for field operations
 */
export function AdminDashboardMobile({ stats }: AdminDashboardMobileProps) {
  const router = useRouter();

  const formatChange = (change: number) => {
    const sign = change > 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}% vs previous period`;
  };

  const formatResponseTime = (minutes: number) => {
    return `${minutes} min`;
  };

  const now = new Date();
  const timestamp = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="flex flex-col min-h-full bg-background">
      {/* Header */}
      <div className="border-b px-4 py-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success/60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Field Ops · Live
          </span>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Radio className="h-3 w-3" />
            <span>{timestamp}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* SOS Emergency Card - HIGHEST PRIORITY */}
        <Card className="p-4 bg-red-100 dark:bg-destructive/10 border-2 border-red-600 dark:border-destructive shadow-elevated">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-red-600 dark:bg-destructive flex items-center justify-center shadow-sm">
                <Siren className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-red-900 dark:text-foreground">
                  Emergency Dispatch
                </h3>
                <p className="text-xs text-red-700 dark:text-muted-foreground font-medium">
                  Immediate response required
                </p>
              </div>
            </div>
          </div>
          <Button
            variant="destructive"
            className="w-full"
            size="lg"
            onClick={() => router.push('/dashboard/admin/command')}
          >
            Open Command Center
          </Button>
        </Card>

        {/* Critical Stats Grid */}
        <div className="space-y-2">
          <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Right Now
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {/* Open Requests */}
            <Card
              className="p-4 cursor-pointer active:scale-95 transition-transform"
              onClick={() => router.push('/dashboard/admin/command')}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                </div>
              </div>
              <p className="text-2xl font-bold">{stats.activeRescues}</p>
              <p className="text-xs text-muted-foreground">Open Requests</p>
              <div className="mt-2 flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                {formatChange(stats.rescueTrend.change)}
              </div>
            </Card>

            {/* Active Handlers */}
            <Card
              className="p-4 cursor-pointer active:scale-95 transition-transform"
              onClick={() => router.push('/dashboard/admin/rescuers')}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
              </div>
              <p className="text-2xl font-bold">{stats.activeVolunteers}</p>
              <p className="text-xs text-muted-foreground">Active Handlers</p>
              <div className="mt-2 flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                {formatChange(stats.volunteerTrend.change)}
              </div>
            </Card>

            {/* Avg Response */}
            <Card className="p-4 col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Clock className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {formatResponseTime(stats.averageResponseTime)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Avg Response Time
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  -9.3% faster
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Quick Actions
          </h2>
          <div className="space-y-2">
            <Card
              className="p-4 cursor-pointer active:scale-95 transition-transform"
              onClick={() => router.push('/dashboard/admin/command')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <AlertCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Command Center</p>
                    <p className="text-xs text-muted-foreground">
                      Manage active operations
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </Card>

            <Card
              className="p-4 cursor-pointer active:scale-95 transition-transform"
              onClick={() => router.push('/dashboard/admin/map')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <svg
                      className="h-5 w-5 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold">Live Map</p>
                    <p className="text-xs text-muted-foreground">
                      Track rescuers in real-time
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </Card>

            <Card
              className="p-4 cursor-pointer active:scale-95 transition-transform"
              onClick={() => router.push('/dashboard/admin/rescuers')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-semibold">Rescuers</p>
                    <p className="text-xs text-muted-foreground">
                      View team availability
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </Card>
          </div>
        </div>

        {/* Network Trend Stats */}
        <div className="space-y-2">
          <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Network Trend
          </h2>
          <div className="grid grid-cols-3 gap-2">
            <Card className="p-3">
              <div className="flex flex-col gap-1">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <p className="text-xl font-bold">{stats.completedRescues}</p>
                <p className="text-[10px] text-muted-foreground leading-tight">
                  Released Safely
                </p>
              </div>
            </Card>

            <Card className="p-3">
              <div className="flex flex-col gap-1">
                <Shield className="h-5 w-5 text-primary" />
                <p className="text-xl font-bold">{stats.verifiedRescuers}</p>
                <p className="text-[10px] text-muted-foreground leading-tight">
                  Verified Rescuers
                </p>
              </div>
            </Card>

            <Card className="p-3">
              <div className="flex flex-col gap-1">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                <p className="text-xl font-bold">
                  {stats.completionRate.toFixed(0)}%
                </p>
                <p className="text-[10px] text-muted-foreground leading-tight">
                  Completion Rate
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-2 pb-4">
          <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Recent Activity
          </h2>
          <Card className="divide-y">
            <ActivityItem
              icon={<AlertTriangle className="h-4 w-4 text-destructive" />}
              text="New emergency request in Kalimati"
              time="2 min ago"
              tone="error"
            />
            <ActivityItem
              icon={<CheckCircle2 className="h-4 w-4 text-green-500" />}
              text="Rescue SR-2381 completed successfully"
              time="12 min ago"
              tone="success"
            />
            <ActivityItem
              icon={<Users className="h-4 w-4 text-blue-500" />}
              text="3 new rescuers came online"
              time="24 min ago"
              tone="info"
            />
            <ActivityItem
              icon={<AlertCircle className="h-4 w-4 text-yellow-500" />}
              text="Rescue SR-2380 needs reassignment"
              time="36 min ago"
              tone="warning"
            />
          </Card>
        </div>
      </div>
    </div>
  );
}

interface ActivityItemProps {
  icon: React.ReactNode;
  text: string;
  time: string;
  tone: 'error' | 'warning' | 'success' | 'info';
}

function ActivityItem({ icon, text, time, tone }: ActivityItemProps) {
  const toneClass = {
    error: 'bg-destructive/10',
    warning: 'bg-yellow-500/10',
    success: 'bg-green-500/10',
    info: 'bg-blue-500/10',
  };

  return (
    <div className="flex items-start gap-3 p-3">
      <div
        className={cn(
          'h-8 w-8 rounded-full flex items-center justify-center shrink-0',
          toneClass[tone],
        )}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm leading-tight">{text}</p>
        <p className="text-[10px] text-muted-foreground mt-1">{time}</p>
      </div>
    </div>
  );
}
