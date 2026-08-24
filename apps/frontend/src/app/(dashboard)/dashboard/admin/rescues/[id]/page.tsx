'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Siren,
  Star,
  User,
  XCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  useRescueRequestQuery,
  useUpdateRescueRequestMutation,
} from '@/lib/graphql/hooks/rescue.hooks';
import { cn } from '@/lib/utils';

interface PageProps {
  params: Promise<{ id: string }>;
}

type RescueData = {
  id: string;
  referenceNumber?: string;
  status: string;
  priority: string;
  municipality?: string;
  ward?: number;
  address?: string;
  landmark?: string;
  snakeDescription?: string;
  snakeSize?: string;
  snakeColor?: string;
  isEmergency?: boolean;
  hasBite?: boolean;
  createdAt: string;
  updatedAt: string;
  assignedAt?: string;
  acceptedAt?: string;
  startedAt?: string;
  arrivedAt?: string;
  completedAt?: string;
  rescueDuration?: number;
  user?: { name?: string; email?: string; phone?: string };
  assignedVolunteer?: {
    name?: string;
    experience?: string;
    totalRescues?: number;
    rating?: number;
  };
  timeline?: Array<{
    id: string;
    event: string;
    description?: string;
    createdAt: string;
    user?: { name?: string };
  }>;
};

type QueryData = { rescueRequest?: RescueData | null };

const statusStyles: Record<string, string> = {
  PENDING: 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400',
  ASSIGNED: 'bg-blue-500/15 text-blue-700 dark:text-blue-400',
  ACCEPTED: 'bg-green-500/15 text-green-700 dark:text-green-400',
  IN_PROGRESS: 'bg-purple-500/15 text-purple-700 dark:text-purple-400',
  COMPLETED: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  CANCELLED: 'bg-red-500/15 text-red-700 dark:text-red-400',
};

const priorityOptions = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const;

function StatTile({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
}) {
  return (
    <Card className="flex items-center gap-3 border-white/10 bg-white/[0.03] p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-muted-foreground">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-semibold">{value}</p>
      </div>
    </Card>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/5 py-3 last:border-b-0">
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="h-4 w-4 shrink-0" />
        {label}
      </span>
      <span className="text-right text-sm font-medium">{value}</span>
    </div>
  );
}

function formatLocation(rescue: RescueData) {
  const parts = [rescue.address, rescue.municipality].filter(
    (part): part is string => Boolean(part && part.trim()),
  );
  const base = parts.length > 0 ? parts.join(', ') : 'Location not provided';
  return rescue.ward != null ? `${base}, Ward ${rescue.ward}` : base;
}

// NOTE: assumes rescueDuration is reported in minutes. Confirm the unit
// against the backend schema and adjust if it's actually seconds.
function formatDuration(minutes?: number) {
  if (minutes == null) return null;
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return remaining > 0 ? `${hours}h ${remaining}m` : `${hours}h`;
}

export default function AdminRescueDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data, loading, error } = useRescueRequestQuery({ variables: { id } });
  const [updateRescueRequest, { loading: updatingPriority }] =
    useUpdateRescueRequestMutation({
      refetchQueries: ['RescueRequest'],
    });
  const rescue = (data as QueryData | undefined)?.rescueRequest;

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  if (error || !rescue)
    return (
      <div className="space-y-6 p-6">
        <Button
          variant="outline"
          onClick={() => router.push('/dashboard/admin/rescues')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to rescues
        </Button>
        <Card className="p-8 text-center">
          <XCircle className="mx-auto h-10 w-10 text-red-500" />
          <h1 className="mt-3 text-xl font-semibold">Rescue not found</h1>
          <p className="mt-2 text-muted-foreground">
            {error?.message || 'This rescue request is unavailable.'}
          </p>
        </Card>
      </div>
    );

  const timeline = rescue.timeline || [];
  const duration = formatDuration(rescue.rescueDuration);

  // Operational timestamps beyond created/updated — fetched by the query
  // but previously never shown to the admin.
  const operationalStamps: Array<{ label: string; value?: string }> = [
    { label: 'Assigned', value: rescue.assignedAt },
    { label: 'Accepted', value: rescue.acceptedAt },
    { label: 'Started', value: rescue.startedAt },
    { label: 'Arrived on scene', value: rescue.arrivedAt },
    { label: 'Completed', value: rescue.completedAt },
  ].filter((stamp) => Boolean(stamp.value));

  return (
    <div className="min-h-screen space-y-6 p-6">
      <Button
        variant="outline"
        onClick={() => router.push('/dashboard/admin/rescues')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to rescues
      </Button>

      {/* Header */}
      <Card className="border-white/10 bg-white/[0.03] p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="text-sm text-muted-foreground">Rescue request</p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold">
                {rescue.referenceNumber || rescue.id}
              </h1>
              <Badge className={cn(statusStyles[rescue.status] || 'bg-muted')}>
                {rescue.status.replace(/_/g, ' ')}
              </Badge>
              <Badge variant="outline">{rescue.priority} priority</Badge>
              {rescue.isEmergency && (
                <Badge className="bg-red-500/15 text-red-600 dark:text-red-400">
                  <Siren className="mr-1 h-3 w-3" />
                  Emergency
                </Badge>
              )}
              {rescue.hasBite && (
                <Badge className="bg-red-600/15 text-red-700 dark:text-red-400">
                  Bite reported
                </Badge>
              )}
            </div>
            <label className="mt-4 flex max-w-xs flex-col gap-1 text-sm font-medium">
              Rescue priority
              <select
                aria-label="Rescue priority"
                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                disabled={updatingPriority}
                value={rescue.priority}
                onChange={(event) => {
                  void updateRescueRequest({
                    variables: {
                      id,
                      input: { priority: event.target.value },
                    },
                  });
                }}
              >
                {priorityOptions.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </label>
            <p className="mt-1 text-sm text-muted-foreground">
              Operational details and rescue timeline
            </p>
          </div>
        </div>
      </Card>

      {/* Quick-glance stats */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          icon={Calendar}
          label="Reported"
          value={new Date(rescue.createdAt).toLocaleDateString()}
        />
        <StatTile
          icon={Clock}
          label="Last updated"
          value={new Date(rescue.updatedAt).toLocaleString()}
        />
        <StatTile
          icon={CheckCircle}
          label="Timeline events"
          value={String(timeline.length)}
        />
        <StatTile
          icon={Clock}
          label="Duration"
          value={duration ?? 'In progress'}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Rescue details
            </h2>
            <div className="mt-3">
              <DetailRow
                icon={CheckCircle}
                label="Snake"
                value={rescue.snakeDescription || 'Not provided'}
              />
              <DetailRow
                icon={CheckCircle}
                label="Size / color"
                value={`${rescue.snakeSize || 'N/A'} / ${
                  rescue.snakeColor || 'N/A'
                }`}
              />
              <DetailRow
                icon={MapPin}
                label="Location"
                value={formatLocation(rescue)}
              />
              {rescue.landmark && (
                <DetailRow
                  icon={MapPin}
                  label="Landmark"
                  value={rescue.landmark}
                />
              )}
              <DetailRow
                icon={Siren}
                label="Emergency"
                value={rescue.isEmergency ? 'Yes' : 'No'}
              />
              <DetailRow
                icon={Calendar}
                label="Created"
                value={new Date(rescue.createdAt).toLocaleString()}
              />
              <DetailRow
                icon={Clock}
                label="Updated"
                value={new Date(rescue.updatedAt).toLocaleString()}
              />
            </div>
          </Card>

          {operationalStamps.length > 0 && (
            <Card className="border-white/10 bg-white/[0.03] p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Operational timestamps
              </h2>
              <div className="mt-3">
                {operationalStamps.map((stamp) => (
                  <DetailRow
                    key={stamp.label}
                    icon={Clock}
                    label={stamp.label}
                    value={new Date(stamp.value as string).toLocaleString()}
                  />
                ))}
              </div>
            </Card>
          )}

          <Card className="border-white/10 bg-white/[0.03] p-6">
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              <Clock className="h-4 w-4" />
              Timeline
            </h2>
            <div className="mt-4 space-y-4">
              {timeline.length ? (
                timeline.map((event) => (
                  <div
                    className="border-l-2 border-primary/30 pl-4"
                    key={event.id}
                  >
                    <p className="font-medium">{event.event}</p>
                    <p className="text-sm text-muted-foreground">
                      {event.description || 'Status update'}
                      {event.user?.name ? ` by ${event.user.name}` : ''}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(event.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No timeline events recorded.
                </p>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-white/10 bg-white/[0.03] p-6">
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              <User className="h-4 w-4" />
              Reporter
            </h2>
            <div className="mt-3">
              <DetailRow
                icon={User}
                label="Name"
                value={rescue.user?.name || 'Unknown reporter'}
              />
              <DetailRow
                icon={Mail}
                label="Email"
                value={rescue.user?.email || 'No email'}
              />
              <DetailRow
                icon={Phone}
                label="Phone"
                value={rescue.user?.phone || 'No phone'}
              />
            </div>
          </Card>

          <Card className="border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Assigned rescuer
            </h2>
            {rescue.assignedVolunteer ? (
              <div className="mt-3">
                <DetailRow
                  icon={User}
                  label="Name"
                  value={rescue.assignedVolunteer.name || 'Unnamed'}
                />
                <DetailRow
                  icon={CheckCircle}
                  label="Experience"
                  value={rescue.assignedVolunteer.experience || 'Not listed'}
                />
                <DetailRow
                  icon={CheckCircle}
                  label="Total rescues"
                  value={String(rescue.assignedVolunteer.totalRescues ?? 0)}
                />
                <DetailRow
                  icon={Star}
                  label="Rating"
                  value={
                    rescue.assignedVolunteer.rating != null
                      ? rescue.assignedVolunteer.rating.toFixed(1)
                      : 'N/A'
                  }
                />
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                Not assigned yet.
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
