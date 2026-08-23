'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Award,
  Calendar,
  CheckCircle,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Shield,
  Star,
  Target,
  Trash2,
  Truck,
  UserCheck,
  Wrench,
  XCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  useDeleteVolunteerMutation,
  useReactivateVolunteerMutation,
  useReviewVolunteerApplicationMutation,
  useSuspendVolunteerMutation,
  useVerifyVolunteerMutation,
  useVolunteerQuery,
} from '@/lib/graphql/hooks/volunteer.hooks';
import { toast } from 'sonner';

interface PageProps {
  params: Promise<{ id: string }>;
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  APPROVED: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
  VERIFIED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  SUSPENDED: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  REJECTED: 'bg-red-500/10 text-red-400 border-red-500/30',
};

function initialsFrom(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

function StatTile({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
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
  icon: typeof Mail;
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

export default function RescuerDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [suspendReason, setSuspendReason] = useState('');
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { data, loading, error, refetch } = useVolunteerQuery({
    variables: { id },
  });

  const mutationOptions = {
    onCompleted: () => {
      toast.success('Rescuer updated successfully');
      refetch();
    },
    onError: (mutationError: Error) => toast.error(mutationError.message),
  };
  const [reviewApplication, { loading: reviewing }] =
    useReviewVolunteerApplicationMutation(mutationOptions);
  const [verifyVolunteer, { loading: verifying }] =
    useVerifyVolunteerMutation(mutationOptions);
  const [suspendVolunteer, { loading: suspending }] =
    useSuspendVolunteerMutation(mutationOptions);
  const [reactivateVolunteer, { loading: reactivating }] =
    useReactivateVolunteerMutation(mutationOptions);
  const [deleteVolunteer, { loading: deleting }] = useDeleteVolunteerMutation({
    onCompleted: (result) => {
      if (result.deleteVolunteer.success) {
        toast.success('Rescuer deleted successfully');
        router.push('/dashboard/admin/rescuers');
      }
    },
    onError: (mutationError: Error) => toast.error(mutationError.message),
  });

  const rescuer = data?.volunteer;
  const busy = reviewing || verifying || suspending || reactivating || deleting;

  const handleSuspend = async () => {
    const reason = suspendReason.trim();
    if (!reason) {
      toast.error('Enter a suspension reason');
      return;
    }
    await suspendVolunteer({ variables: { volunteerId: id, reason } });
    setSuspendReason('');
    setSuspendDialogOpen(false);
  };

  const handleDelete = async () => {
    await deleteVolunteer({ variables: { volunteerId: id } });
    setDeleteDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !rescuer) {
    return (
      <div className="p-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Card className="mt-6 p-8 text-center">
          <XCircle className="mx-auto h-10 w-10 text-red-500" />
          <h1 className="mt-3 text-xl font-semibold">Rescuer not found</h1>
          <p className="mt-2 text-muted-foreground">
            {error?.message || 'This profile may have been deleted.'}
          </p>
        </Card>
      </div>
    );
  }

  const displayName = rescuer.user?.name || rescuer.name;
  const statusStyle = STATUS_STYLES[rescuer.status] ?? '';
  const location =
    [rescuer.address, rescuer.municipality].filter(Boolean).join(', ') +
    (rescuer.ward ? `, Ward ${rescuer.ward}` : '');

  return (
    <div className="min-h-screen space-y-6 p-6">
      <Button
        variant="outline"
        onClick={() => router.push('/dashboard/admin/rescuers')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to rescuers
      </Button>

      {/* Profile header */}
      <Card className="border-white/10 bg-white/[0.03] p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 text-lg font-semibold text-emerald-300 ring-1 ring-emerald-500/30">
              {initialsFrom(displayName)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold">{displayName}</h1>
                <Badge className={`border ${statusStyle}`} variant="outline">
                  {rescuer.status}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Rescuer application and credential review
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {rescuer.status === 'PENDING' && (
              <Button
                disabled={busy}
                onClick={() =>
                  reviewApplication({
                    variables: { input: { volunteerId: id, approved: true } },
                  })
                }
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve application
              </Button>
            )}
            {rescuer.status === 'APPROVED' && (
              <Button
                disabled={busy}
                onClick={() =>
                  verifyVolunteer({ variables: { volunteerId: id } })
                }
              >
                <UserCheck className="mr-2 h-4 w-4" />
                Verify rescuer
              </Button>
            )}
            {rescuer.status === 'SUSPENDED' ? (
              <Button
                variant="outline"
                disabled={busy}
                onClick={() =>
                  reactivateVolunteer({ variables: { volunteerId: id } })
                }
              >
                <Shield className="mr-2 h-4 w-4" />
                Reactivate
              </Button>
            ) : (
              rescuer.status !== 'REJECTED' && (
                <Button
                  variant="outline"
                  disabled={busy}
                  onClick={() => setSuspendDialogOpen(true)}
                >
                  Suspend
                </Button>
              )
            )}
            <Button
              variant="destructive"
              disabled={busy}
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        {rescuer.rejectionReason && (
          <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
            <strong className="font-semibold">Review note:</strong>{' '}
            {rescuer.rejectionReason}
          </div>
        )}
      </Card>

      {/* Quick-glance performance stats */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          icon={Target}
          label="Total rescues"
          value={String(rescuer.totalRescues ?? 0)}
        />
        <StatTile
          icon={CheckCircle}
          label="Completed"
          value={String(rescuer.completedRescues ?? 0)}
        />
        <StatTile
          icon={Award}
          label="Success rate"
          value={`${rescuer.successRate ?? 0}%`}
        />
        <StatTile
          icon={Star}
          label="Rating"
          value={rescuer.rating ? rescuer.rating.toFixed(1) : 'N/A'}
        />
      </div>

      {/* Detail sections */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Identity and contact
          </h2>
          <div className="mt-3">
            <DetailRow
              icon={Mail}
              label="Email"
              value={rescuer.user?.email || rescuer.email || 'No email'}
            />
            <DetailRow
              icon={Phone}
              label="Phone"
              value={rescuer.user?.phone || rescuer.contact || 'No phone'}
            />
            <DetailRow icon={MapPin} label="Location" value={location} />
            <DetailRow
              icon={CheckCircle}
              label="Email verified"
              value={rescuer.user?.emailVerified ? 'Yes' : 'No'}
            />
            <DetailRow
              icon={Calendar}
              label="Applied"
              value={new Date(rescuer.createdAt).toLocaleDateString()}
            />
          </div>
        </Card>

        <Card className="border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Credentials and experience
          </h2>
          <div className="mt-3">
            <DetailRow
              icon={Award}
              label="Experience"
              value={`${rescuer.experience}${
                rescuer.experienceYears
                  ? ` (${rescuer.experienceYears} years)`
                  : ''
              }`}
            />
            <DetailRow
              icon={Truck}
              label="Vehicle"
              value={`${rescuer.vehicle}${
                rescuer.vehicleDetails ? `, ${rescuer.vehicleDetails}` : ''
              }`}
            />
            <DetailRow
              icon={Shield}
              label="Skills"
              value={rescuer.skills?.join(', ') || 'None listed'}
            />
            <DetailRow
              icon={UserCheck}
              label="Certifications"
              value={rescuer.certifications?.join(', ') || 'None listed'}
            />
            <DetailRow
              icon={Wrench}
              label="Equipment"
              value={
                rescuer.hasEquipment
                  ? rescuer.equipment?.join(', ') || 'Available'
                  : 'Not available'
              }
            />
          </div>
        </Card>
      </div>

      {/* Suspend dialog */}
      <Dialog open={suspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
        <DialogContent>
          <DialogHeader className="items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
              <Shield className="h-6 w-6" />
            </div>
            <DialogTitle>Suspend rescuer?</DialogTitle>
            <DialogDescription>
              This will immediately pause the rescuer account and remove it from
              active assignments.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="suspend-reason">
              Suspension reason
            </label>
            <Input
              id="suspend-reason"
              value={suspendReason}
              onChange={(event) => setSuspendReason(event.target.value)}
              placeholder="Enter a reason"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              disabled={busy}
              onClick={() => setSuspendDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              disabled={busy || !suspendReason.trim()}
              onClick={handleSuspend}
            >
              {suspending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Shield className="mr-2 h-4 w-4" />
              )}
              Confirm suspension
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader className="items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-300">
              <Trash2 className="h-6 w-6" />
            </div>
            <AlertDialogTitle>Delete rescuer profile?</AlertDialogTitle>
            <AlertDialogDescription>
              This will deactivate the account and remove the rescuer profile
              from the management list. This action cannot be undone from the
              dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleting}
              onClick={handleDelete}
              className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-600"
            >
              {deleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Delete profile
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
