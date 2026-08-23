'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  Mail,
  Phone,
  Shield,
  ShieldCheck,
  Trash2,
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
  useAdminDeleteUserMutation,
  useAdminUpdateUserStatusMutation,
  useUserQuery,
} from '@/lib/graphql/hooks/user.hooks';
import { toast } from 'sonner';

interface PageProps {
  params: Promise<{ id: string }>;
}

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  SUSPENDED: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  DELETED: 'bg-red-500/10 text-red-400 border-red-500/30',
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
    <div className="flex items-center justify-between gap-4 border-b border-white/5 py-3 last:border-b-0">
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="h-4 w-4" />
        {label}
      </span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

export default function CitizenDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [suspendReason, setSuspendReason] = useState('');
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { data, loading, error, refetch } = useUserQuery({ variables: { id } });

  const [updateStatus, { loading: updating }] =
    useAdminUpdateUserStatusMutation({
      onCompleted: () => {
        toast.success('Citizen account updated successfully');
        setSuspendReason('');
        setSuspendDialogOpen(false);
        refetch();
      },
      onError: (mutationError: Error) => toast.error(mutationError.message),
    });
  const [deleteUser, { loading: deleting }] = useAdminDeleteUserMutation({
    onCompleted: (result) => {
      if (result.deleteUser.success) {
        toast.success('Citizen deleted successfully');
        router.push('/dashboard/admin/users');
      }
    },
    onError: (mutationError: Error) => toast.error(mutationError.message),
  });

  const citizen = data?.user;
  const busy = updating || deleting;

  const handleSuspend = async () => {
    if (!suspendReason.trim()) {
      toast.error('Enter a suspension reason');
      return;
    }
    await updateStatus({ variables: { userId: id, status: 'SUSPENDED' } });
  };

  const handleDelete = async () => {
    await deleteUser({ variables: { userId: id } });
    setDeleteDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !citizen) {
    return (
      <div className="p-6">
        <Button
          variant="outline"
          onClick={() => router.push('/dashboard/admin/users')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to citizens
        </Button>
        <Card className="mt-6 p-8 text-center">
          <XCircle className="mx-auto h-10 w-10 text-red-500" />
          <h1 className="mt-3 text-xl font-semibold">Citizen not found</h1>
          <p className="mt-2 text-muted-foreground">
            {error?.message || 'This account may have been deleted.'}
          </p>
        </Card>
      </div>
    );
  }

  const statusStyle = STATUS_STYLES[citizen.status] ?? '';

  return (
    <div className="min-h-screen space-y-6 p-6">
      <Button
        variant="outline"
        onClick={() => router.push('/dashboard/admin/users')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to citizens
      </Button>

      {/* Profile header */}
      <Card className="border-white/10 bg-white/[0.03] p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 text-lg font-semibold text-emerald-300 ring-1 ring-emerald-500/30">
              {initialsFrom(citizen.name)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold">{citizen.name}</h1>
                <Badge className={`border ${statusStyle}`} variant="outline">
                  {citizen.status}
                </Badge>
                <Badge variant="secondary">
                  {citizen.role.replace('_', ' ')}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {citizen.email}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {citizen.status === 'SUSPENDED' ? (
              <Button
                variant="outline"
                disabled={busy}
                onClick={() =>
                  updateStatus({ variables: { userId: id, status: 'ACTIVE' } })
                }
              >
                <ShieldCheck className="mr-2 h-4 w-4" />
                Reactivate
              </Button>
            ) : (
              <Button
                variant="outline"
                disabled={busy}
                onClick={() => setSuspendDialogOpen(true)}
              >
                <Shield className="mr-2 h-4 w-4" />
                Suspend
              </Button>
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
      </Card>

      {/* Quick-glance stats */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          icon={CheckCircle2}
          label="Total requests"
          value={String(citizen.rescueRequests?.totalCount ?? 0)}
        />
        <StatTile
          icon={Clock}
          label="Last login"
          value={
            citizen.lastLoginAt
              ? new Date(citizen.lastLoginAt).toLocaleDateString()
              : 'Never'
          }
        />
        <StatTile
          icon={Mail}
          label="Email verified"
          value={citizen.emailVerified ? 'Verified' : 'Unverified'}
        />
        <StatTile
          icon={Calendar}
          label="Member since"
          value={new Date(citizen.createdAt).toLocaleDateString()}
        />
      </div>

      {/* Detail sections */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Identity and contact
          </h2>
          <div className="mt-3">
            <DetailRow icon={Mail} label="Email" value={citizen.email} />
            <DetailRow
              icon={Phone}
              label="Phone"
              value={citizen.phone || 'No phone number'}
            />
            <DetailRow
              icon={Shield}
              label="Role"
              value={citizen.role.replace('_', ' ')}
            />
            <DetailRow
              icon={CheckCircle2}
              label="Email verified"
              value={citizen.emailVerified ? 'Yes' : 'No'}
            />
            <DetailRow
              icon={Calendar}
              label="Joined"
              value={new Date(citizen.createdAt).toLocaleDateString()}
            />
          </div>
        </Card>

        <Card className="border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Rescue activity
          </h2>
          <div className="mt-3">
            <DetailRow
              icon={CheckCircle2}
              label="Total rescue requests"
              value={String(citizen.rescueRequests?.totalCount ?? 0)}
            />
            <DetailRow
              icon={Clock}
              label="Last login"
              value={
                citizen.lastLoginAt
                  ? new Date(citizen.lastLoginAt).toLocaleString()
                  : 'Never'
              }
            />
            <DetailRow
              icon={Shield}
              label="Account status"
              value={citizen.status}
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
            <DialogTitle>Suspend citizen?</DialogTitle>
            <DialogDescription>
              This will immediately prevent the citizen from accessing the
              account.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <label
              className="text-sm font-medium"
              htmlFor="citizen-suspend-reason"
            >
              Suspension reason
            </label>
            <Input
              id="citizen-suspend-reason"
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
              {updating ? (
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
            <AlertDialogTitle>Delete citizen account?</AlertDialogTitle>
            <AlertDialogDescription>
              This will deactivate the citizen account and remove it from the
              management list. This action cannot be undone from the dashboard.
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
              Delete account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
