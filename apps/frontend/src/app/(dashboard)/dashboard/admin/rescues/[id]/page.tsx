'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import {
  ArrowLeft,
  AlertTriangle,
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
  Pencil,
  Trash2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useRescueRequestQuery,
  useUpdateRescueRequestMutation,
} from '@/lib/graphql/hooks/rescue.hooks';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent as UiDialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const DELETE_RESCUE_REQUEST = gql`
  mutation DeleteRescueRequest($id: ID!) {
    deleteRescueRequest(id: $id) {
      success
      message
    }
  }
`;

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
  notes?: string;
  emergencyDetails?: string;
  biteDetails?: string;
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

type RescueEditForm = {
  municipality: string;
  ward: string;
  address: string;
  landmark: string;
  snakeDescription: string;
  snakeSize: string;
  snakeColor: string;
  priority: string;
  notes: string;
  emergencyDetails: string;
  biteDetails: string;
  isEmergency: boolean;
  hasBite: boolean;
};

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
    <Card className="flex items-center gap-3 border-white/10 bg-white/3 p-4">
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
  const [editing, setEditing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [editForm, setEditForm] = useState<RescueEditForm | null>(null);
  const { data, loading, error } = useRescueRequestQuery({ variables: { id } });
  const [updateRescueRequest, { loading: updatingPriority }] =
    useUpdateRescueRequestMutation({
      refetchQueries: ['RescueRequest'],
    });
  const [deleteRescue, { loading: deleting }] = useMutation(
    DELETE_RESCUE_REQUEST,
  );
  const rescue = (data as QueryData | undefined)?.rescueRequest;

  useEffect(() => {
    if (rescue && !editing) {
      setEditForm({
        municipality: rescue.municipality || '',
        ward: rescue.ward == null ? '' : String(rescue.ward),
        address: rescue.address || '',
        landmark: rescue.landmark || '',
        snakeDescription: rescue.snakeDescription || '',
        snakeSize: rescue.snakeSize || '',
        snakeColor: rescue.snakeColor || '',
        priority: rescue.priority,
        notes: rescue.notes || '',
        emergencyDetails: rescue.emergencyDetails || '',
        biteDetails: rescue.biteDetails || '',
        isEmergency: Boolean(rescue.isEmergency),
        hasBite: Boolean(rescue.hasBite),
      });
    }
  }, [rescue, editing]);

  const updateEditField = <Key extends keyof RescueEditForm>(
    field: Key,
    value: RescueEditForm[Key],
  ) => {
    setEditForm((current) =>
      current ? { ...current, [field]: value } : current,
    );
  };

  const saveEditForm = async () => {
    if (!editForm) return;
    try {
      await updateRescueRequest({
        variables: {
          id,
          input: {
            municipality: editForm.municipality,
            ward: editForm.ward ? Number(editForm.ward) : null,
            address: editForm.address,
            landmark: editForm.landmark || null,
            snakeDescription: editForm.snakeDescription || null,
            snakeSize: editForm.snakeSize || null,
            snakeColor: editForm.snakeColor || null,
            priority: editForm.priority,
            notes: editForm.notes || null,
            emergencyDetails: editForm.emergencyDetails || null,
            biteDetails: editForm.biteDetails || null,
            isEmergency: editForm.isEmergency,
            hasBite: editForm.hasBite,
          },
        },
      });
      toast.success('Rescue details updated');
      setEditing(false);
    } catch (updateError) {
      toast.error(
        updateError instanceof Error
          ? updateError.message
          : 'Unable to update rescue details',
      );
    }
  };

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
      <Card className="border-white/10 bg-white/3 p-6">
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
            <p className="mt-1 text-sm text-muted-foreground">
              Operational details and rescue timeline
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setEditing(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="destructive"
              disabled={deleting}
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </Card>

      <Dialog
        open={editing}
        onOpenChange={(open) => {
          setEditing(open);
          if (!open) {
            setEditForm((current) => current);
          }
        }}
      >
        <UiDialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit rescue request</DialogTitle>
            <DialogDescription>
              Update the rescue details for{' '}
              {rescue.referenceNumber || 'this request'}.
            </DialogDescription>
          </DialogHeader>

          {editForm && (
            <div className="space-y-4 py-2">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-sm font-medium">
                  Municipality
                  <Input
                    className="mt-1"
                    value={editForm.municipality}
                    onChange={(event) =>
                      updateEditField('municipality', event.target.value)
                    }
                  />
                </label>
                <label className="text-sm font-medium">
                  Ward
                  <Input
                    className="mt-1"
                    type="number"
                    min="1"
                    value={editForm.ward}
                    onChange={(event) =>
                      updateEditField('ward', event.target.value)
                    }
                  />
                </label>
              </div>

              <label className="block text-sm font-medium">
                Address
                <Input
                  className="mt-1"
                  value={editForm.address}
                  onChange={(event) =>
                    updateEditField('address', event.target.value)
                  }
                />
              </label>

              <label className="block text-sm font-medium">
                Landmark
                <Input
                  className="mt-1"
                  value={editForm.landmark}
                  onChange={(event) =>
                    updateEditField('landmark', event.target.value)
                  }
                />
              </label>

              <div className="grid gap-3 sm:grid-cols-3">
                <label className="text-sm font-medium">
                  Snake size
                  <Select
                    value={editForm.snakeSize || 'not-listed'}
                    onValueChange={(value) =>
                      updateEditField(
                        'snakeSize',
                        value === 'not-listed' ? '' : value,
                      )
                    }
                  >
                    <SelectTrigger className="mt-1 h-10 border-primary/20 bg-primary/4 font-medium shadow-sm transition-colors hover:border-primary/50 hover:bg-primary/8">
                      <SelectValue placeholder="Not listed" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not-listed">Not listed</SelectItem>
                      <SelectItem value="Small (&lt;1ft)">
                        Small (&lt;1ft)
                      </SelectItem>
                      <SelectItem value="Medium (1-3ft)">
                        Medium (1-3ft)
                      </SelectItem>
                      <SelectItem value="Large (&gt;3ft)">
                        Large (&gt;3ft)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </label>

                <label className="text-sm font-medium">
                  Snake color
                  <Input
                    className="mt-1"
                    value={editForm.snakeColor}
                    onChange={(event) =>
                      updateEditField('snakeColor', event.target.value)
                    }
                  />
                </label>

                <label className="text-sm font-medium">
                  Priority
                  <Select
                    value={editForm.priority}
                    onValueChange={(value) =>
                      updateEditField('priority', value)
                    }
                  >
                    <SelectTrigger className="mt-1 h-10 border-primary/20 bg-primary/4 font-medium shadow-sm transition-colors hover:border-primary/50 hover:bg-primary/8">
                      <SelectValue placeholder="Choose priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityOptions.map((priority) => (
                        <SelectItem key={priority} value={priority}>
                          {priority}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </label>
              </div>

              <label className="block text-sm font-medium">
                Snake description
                <Textarea
                  className="mt-1"
                  rows={3}
                  value={editForm.snakeDescription}
                  onChange={(event) =>
                    updateEditField('snakeDescription', event.target.value)
                  }
                />
              </label>

              <label className="block text-sm font-medium">
                Notes
                <Textarea
                  className="mt-1"
                  rows={3}
                  value={editForm.notes}
                  onChange={(event) =>
                    updateEditField('notes', event.target.value)
                  }
                />
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <input
                    type="checkbox"
                    checked={editForm.isEmergency}
                    onChange={(event) =>
                      updateEditField('isEmergency', event.target.checked)
                    }
                  />
                  Emergency request
                </label>
                <label className="flex items-center gap-2 text-sm font-medium">
                  <input
                    type="checkbox"
                    checked={editForm.hasBite}
                    onChange={(event) =>
                      updateEditField('hasBite', event.target.checked)
                    }
                  />
                  Bite reported
                </label>
              </div>

              <label className="block text-sm font-medium">
                Emergency details
                <Textarea
                  className="mt-1"
                  rows={2}
                  value={editForm.emergencyDetails}
                  onChange={(event) =>
                    updateEditField('emergencyDetails', event.target.value)
                  }
                />
              </label>

              <label className="block text-sm font-medium">
                Bite details
                <Textarea
                  className="mt-1"
                  rows={2}
                  value={editForm.biteDetails}
                  onChange={(event) =>
                    updateEditField('biteDetails', event.target.value)
                  }
                />
              </label>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setEditing(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => void saveEditForm()}
              disabled={updatingPriority}
            >
              {updatingPriority ? 'Saving...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </UiDialogContent>
      </Dialog>

      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) setDeleteConfirmation('');
        }}
      >
        <AlertDialogContent className="border-red-400/50 bg-red-700 text-white shadow-2xl">
          <AlertDialogHeader>
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-red-500/10 text-red-600 dark:text-red-400">
                <AlertTriangle className="h-5 w-5" />
              </span>
              <div>
                <AlertDialogTitle>Delete rescue request?</AlertDialogTitle>
                <AlertDialogDescription className="mt-1 text-red-100/80">
                  You selected{' '}
                  <strong className="text-foreground">
                    {rescue.referenceNumber || 'this request'}
                  </strong>
                  . It will be removed from the active list.
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>
          <div className="rounded-lg border border-red-200/30 bg-red-800/50 p-3">
            <p className="text-sm text-red-100">
              This action cannot be undone. Type <strong>DELETE</strong> to
              continue.
            </p>
            <Input
              value={deleteConfirmation}
              onChange={(event) => setDeleteConfirmation(event.target.value)}
              placeholder="Type DELETE"
              aria-label="Type DELETE to confirm deletion"
              className="mt-3 border-red-200/40 bg-red-900/70 text-white placeholder:text-red-100/60"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-red-200/40 bg-transparent text-red-50 hover:bg-red-900">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteConfirmation !== 'DELETE' || deleting}
              className="bg-red-500 text-white hover:bg-red-400 disabled:pointer-events-none disabled:opacity-50"
              onClick={async () => {
                try {
                  await deleteRescue({ variables: { id } });
                  toast.success('Rescue request deleted');
                  setDeleteDialogOpen(false);
                  router.push('/dashboard/admin/rescues');
                } catch (deleteError) {
                  toast.error(
                    deleteError instanceof Error
                      ? deleteError.message
                      : 'Unable to delete rescue request',
                  );
                }
              }}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
          <Card className="border-white/10 bg-white/3 p-6">
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
            <Card className="border-white/10 bg-white/3 p-6">
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

          <Card className="border-white/10 bg-white/3 p-6">
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
          <Card className="border-white/10 bg-white/3 p-6">
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

          <Card className="border-white/10 bg-white/3 p-6">
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
