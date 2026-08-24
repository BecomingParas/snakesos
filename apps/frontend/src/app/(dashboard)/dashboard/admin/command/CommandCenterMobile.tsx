'use client';

import { useState } from 'react';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ChevronRight,
  ClipboardList,
  Clock,
  Loader2,
  MapPin,
  User,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { type RescueRequest } from '@/lib/graphql/hooks/rescue.hooks';
import { cn } from '@/lib/utils';

interface CommandCenterMobileProps {
  rescues: RescueRequest[];
  loading: boolean;
  onRescueSelect: (rescue: RescueRequest) => void;
}

const STATUS_CONFIG = {
  PENDING: { label: 'Pending', color: 'bg-yellow-500' },
  ASSIGNED: { label: 'Assigned', color: 'bg-blue-500' },
  ACCEPTED: { label: 'Accepted', color: 'bg-green-500' },
  IN_PROGRESS: { label: 'In Progress', color: 'bg-purple-500' },
  COMPLETED: { label: 'Completed', color: 'bg-green-600' },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-500' },
};

const PRIORITY_CONFIG = {
  LOW: { color: 'bg-gray-500', label: 'Low' },
  MEDIUM: { color: 'bg-yellow-500', label: 'Medium' },
  HIGH: { color: 'bg-orange-500', label: 'High' },
  CRITICAL: { color: 'bg-red-600', label: 'Critical' },
};

const ACTIVE_STATUSES = ['ASSIGNED', 'ACCEPTED', 'IN_PROGRESS'] as const;

const PRIORITY_SECTIONS = [
  {
    key: 'CRITICAL',
    label: 'Critical Priority',
    icon: AlertTriangle,
    className: 'text-destructive',
  },
  {
    key: 'HIGH',
    label: 'High Priority',
    icon: AlertCircle,
    className: 'text-orange-500',
  },
  {
    key: 'STANDARD',
    label: 'Standard Priority',
    icon: null,
    className: 'text-muted-foreground',
  },
] as const;

function getRelativeTime(date: string) {
  const minutes = Math.max(
    0,
    Math.floor((Date.now() - new Date(date).getTime()) / 60_000),
  );
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function CommandCenterMobile({
  rescues,
  loading,
  onRescueSelect,
}: CommandCenterMobileProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'active'>(
    'all',
  );
  const pendingCount = rescues.filter(
    ({ status }) => status === 'PENDING',
  ).length;
  const activeCount = rescues.filter(({ status }) =>
    ACTIVE_STATUSES.includes(status as (typeof ACTIVE_STATUSES)[number]),
  ).length;
  const criticalCount = rescues.filter(
    ({ priority }) => priority === 'CRITICAL',
  ).length;
  const filteredRescues = rescues.filter((rescue) => {
    if (activeTab === 'pending') return rescue.status === 'PENDING';
    if (activeTab === 'active')
      return ACTIVE_STATUSES.includes(
        rescue.status as (typeof ACTIVE_STATUSES)[number],
      );
    return true;
  });
  const priorityGroups = {
    CRITICAL: filteredRescues.filter(({ priority }) => priority === 'CRITICAL'),
    HIGH: filteredRescues.filter(({ priority }) => priority === 'HIGH'),
    STANDARD: filteredRescues.filter(
      ({ priority }) => !['CRITICAL', 'HIGH'].includes(priority),
    ),
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading rescues...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-muted/20">
      <header className="border-b bg-card px-4 pb-4 pt-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              Live operations
            </p>
            <h1 className="mt-1 text-xl font-bold tracking-tight">
              Rescue Command Center
            </h1>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
            <Activity className="h-3.5 w-3.5" /> Live
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <StatCard icon={ClipboardList} label="Open" value={pendingCount} />
          <StatCard icon={Activity} label="Active" value={activeCount} />
          <StatCard
            icon={AlertTriangle}
            label="Critical"
            value={criticalCount}
            tone="critical"
          />
        </div>
      </header>

      <div className="border-b bg-card px-4 py-3">
        <div
          className="flex gap-1 rounded-lg border bg-muted/50 p-1"
          role="tablist"
          aria-label="Rescue filters"
        >
          {(
            [
              ['all', 'All', rescues.length],
              ['pending', 'Pending', pendingCount],
              ['active', 'Active', activeCount],
            ] as const
          ).map(([tab, label, count]) => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab(tab)}
              className="h-8 flex-1 px-2 text-xs"
              role="tab"
              aria-selected={activeTab === tab}
            >
              {label} <span className="ml-1 opacity-70">{count}</span>
            </Button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredRescues.length === 0 ? (
          <div className="flex h-64 items-center justify-center px-6">
            <div className="text-center">
              <ClipboardList className="mx-auto h-12 w-12 text-muted-foreground/60" />
              <p className="mt-3 text-sm font-medium">Queue is clear</p>
              <p className="mt-1 text-xs text-muted-foreground">
                No rescues match this filter.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-5 p-4">
            {PRIORITY_SECTIONS.map((section) => {
              const sectionRescues = priorityGroups[section.key];
              if (!sectionRescues.length) return null;
              const Icon = section.icon;
              return (
                <section key={section.key} className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    {Icon && (
                      <Icon className={cn('h-4 w-4', section.className)} />
                    )}
                    <h2
                      className={cn(
                        'text-xs font-semibold uppercase tracking-wider',
                        section.className,
                      )}
                    >
                      {section.label}
                    </h2>
                    <span className="text-xs text-muted-foreground">
                      {sectionRescues.length}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {sectionRescues.map((rescue) => (
                      <RescueCard
                        key={rescue.id}
                        rescue={rescue}
                        onClick={() => onRescueSelect(rescue)}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone = 'default',
}: {
  icon: typeof ClipboardList;
  label: string;
  value: number;
  tone?: 'default' | 'critical';
}) {
  return (
    <Card className="border-border/60 bg-background/70 p-2.5 shadow-none">
      <div className="flex items-center justify-between gap-1">
        <span className="text-[11px] font-medium text-muted-foreground">
          {label}
        </span>
        <Icon
          className={cn(
            'h-3.5 w-3.5',
            tone === 'critical' ? 'text-destructive' : 'text-primary',
          )}
        />
      </div>
      <p
        className={cn(
          'mt-1 text-2xl font-bold leading-none',
          tone === 'critical' && 'text-destructive',
        )}
      >
        {value}
      </p>
    </Card>
  );
}

function RescueCard({
  rescue,
  onClick,
}: {
  rescue: RescueRequest;
  onClick: () => void;
}) {
  const statusConfig =
    STATUS_CONFIG[rescue.status as keyof typeof STATUS_CONFIG] ??
    STATUS_CONFIG.PENDING;
  const priorityConfig =
    PRIORITY_CONFIG[rescue.priority as keyof typeof PRIORITY_CONFIG] ??
    PRIORITY_CONFIG.LOW;
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <Card
      role="button"
      tabIndex={0}
      aria-label={`Open rescue ${rescue.referenceNumber}`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={cn(
        'group relative cursor-pointer overflow-hidden border-border/60 bg-card/80 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99]',
        rescue.priority === 'CRITICAL' &&
          'border-destructive/40 shadow-sm shadow-destructive/10',
        rescue.priority === 'HIGH' &&
          'border-orange-500/40 shadow-sm shadow-orange-500/10',
      )}
    >
      <div
        className={cn(
          'absolute inset-y-0 left-0 w-1',
          rescue.priority === 'CRITICAL' && 'bg-destructive',
          rescue.priority === 'HIGH' && 'bg-orange-500',
          rescue.priority === 'MEDIUM' && 'bg-yellow-500',
          rescue.priority === 'LOW' && 'bg-muted',
        )}
      />
      <div className="p-4 pl-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <p className="truncate text-sm font-semibold">
                {rescue.referenceNumber}
              </p>
              {rescue.isEmergency && (
                <Badge
                  variant="destructive"
                  className="px-1.5 py-0 text-[10px]"
                >
                  EMERGENCY
                </Badge>
              )}
            </div>
            <div className="flex min-w-0 items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{rescue.address}</span>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </div>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge className={cn('text-xs text-white', statusConfig.color)}>
            {statusConfig.label}
          </Badge>
          <Badge className={cn('text-xs text-white', priorityConfig.color)}>
            {priorityConfig.label}
          </Badge>
        </div>
        <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{getRelativeTime(rescue.createdAt)}</span>
          </div>
          {rescue.assignedVolunteer ? (
            <div className="flex min-w-0 items-center gap-1">
              <User className="h-3 w-3 shrink-0" />
              <span className="max-w-25 truncate">
                {rescue.assignedVolunteer.name}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-yellow-500">
              <AlertCircle className="h-3 w-3" />
              <span>Unassigned</span>
            </div>
          )}
        </div>
        {rescue.snakeDescription && (
          <div className="mt-3 border-t pt-2">
            <p className="line-clamp-1 text-xs text-muted-foreground">
              {rescue.snakeDescription}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
