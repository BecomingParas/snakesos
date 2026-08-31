'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Activity,
  CheckCircle,
  Clock,
  MapPin,
  Navigation,
  Phone,
  XCircle,
  AlertCircle,
  AlertTriangle,
  TrendingUp,
  Award,
  BarChart3,
  Hospital,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import {
  type RescueRequest,
  useAcceptRescueMutation,
  useAvailableRescuesQuery,
  useMyAssignedRescuesQuery,
} from '@/lib/graphql/hooks/rescue.hooks';
import {
  useMyVolunteerProfileQuery,
  useUpdateVolunteerProfileMutation,
} from '@/lib/graphql/hooks/volunteer.hooks';
import { useMyProfileQuery } from '@/lib/graphql/hooks/user.hooks';
import { toast } from 'sonner';

/**
 * Rescuer Dashboard
 *
 * Main dashboard for rescuers showing:
 * - Availability toggle
 * - Current active rescue
 * - Pending assignments
 * - Today's statistics
 */

const DEFAULT_VOLUNTEER_STATS = {
  totalRescues: 0,
  completedRescues: 0,
  rating: 0,
  todayRescues: 0,
};

const PRIORITY_COLORS = {
  LOW: 'bg-gray-500',
  MEDIUM: 'bg-yellow-500',
  HIGH: 'bg-orange-500',
  CRITICAL: 'bg-red-500',
};

export default function RescuerDashboard() {
  const router = useRouter();
  const { data: userData } = useMyProfileQuery({
    fetchPolicy: 'cache-and-network',
  });
  const { data: profileData, refetch: refetchProfile } =
    useMyVolunteerProfileQuery({ fetchPolicy: 'cache-and-network' });
  const profile = profileData?.myVolunteerProfile;
  const volunteerName = userData?.me?.name || 'Rescuer';
  const verificationStatus = profile?.status || 'UNDER_REVIEW';
  const accountStatus = userData?.me?.status || 'INACTIVE';
  const isOperationallyEligible =
    verificationStatus === 'VERIFIED' && accountStatus === 'ACTIVE';
  const liveStats = {
    totalRescues: profile?.totalRescues ?? DEFAULT_VOLUNTEER_STATS.totalRescues,
    completedRescues:
      profile?.completedRescues ?? DEFAULT_VOLUNTEER_STATS.completedRescues,
    rating: profile?.rating ?? DEFAULT_VOLUNTEER_STATS.rating,
  };
  const [isAvailable, setIsAvailable] = useState<boolean>(
    profile?.isAvailableNow ?? false,
  );
  const [updatingAvailability, setUpdatingAvailability] = useState(false);
  const [accepting, setAccepting] = useState<string | null>(null);
  const [selectedAssignment, setSelectedAssignment] =
    useState<RescueRequest | null>(null);

  const [updateVolunteerProfile] = useUpdateVolunteerProfileMutation();

  // Fetch assigned rescues
  const { data, loading, refetch } = useMyAssignedRescuesQuery({
    variables: {
      filter: { statuses: ['ASSIGNED', 'ACCEPTED', 'IN_PROGRESS'] },
    },
    pollInterval: 10000, // Real-time updates
    fetchPolicy: 'cache-and-network',
  });

  const { data: openAlertsData, loading: openAlertsLoading } =
    useAvailableRescuesQuery({
      variables: { pagination: { limit: 50, page: 1 } },
      pollInterval: 10000,
      fetchPolicy: 'cache-and-network',
    });

  // Accept rescue mutation
  const [acceptRescue] = useAcceptRescueMutation({
    onCompleted: () => {
      toast.success('Rescue accepted!');
      refetch();
      router.push('/dashboard/rescuer/active');
    },
    onError: (error) => {
      toast.error(`Failed to accept: ${error.message}`);
      setAccepting(null);
    },
  });

  // Extract rescues from GraphQL
  const allRescues = data?.myAssignedRescues?.edges?.map((e) => e.node) || [];
  const activeRescue = allRescues.find((r) =>
    ['ACCEPTED', 'IN_PROGRESS', 'ARRIVED'].includes(r.status),
  );
  const pendingAssignments = allRescues.filter((r) => r.status === 'ASSIGNED');
  const openAlertsCount = openAlertsData?.availableRescues?.totalCount || 0;

  useEffect(() => {
    if (profile?.isAvailableNow !== undefined) {
      setIsAvailable(profile.isAvailableNow);
    }
  }, [profile?.isAvailableNow]);

  // Calculate stats from real data
  const todayRescues = allRescues.filter((r) => {
    const today = new Date().setHours(0, 0, 0, 0);
    const rescueDate = new Date(r.createdAt).setHours(0, 0, 0, 0);
    return rescueDate === today;
  }).length;

  const handleAvailabilityToggle = async (checked: boolean) => {
    if (!isOperationallyEligible) {
      toast.error('Your rescuer account is not eligible for operations yet');
      return;
    }

    setUpdatingAvailability(true);
    try {
      await updateVolunteerProfile({
        variables: {
          input: {
            isAvailableNow: checked,
          },
        },
      });
      setIsAvailable(checked);
      toast.success(checked ? 'You are now online' : 'You are now offline');
      await refetchProfile();
    } catch (error) {
      console.error('Failed to update availability:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to update availability',
      );
    } finally {
      setUpdatingAvailability(false);
    }
  };

  const handleAcceptRescue = async (rescueId: string) => {
    setAccepting(rescueId);
    try {
      await acceptRescue({
        variables: {
          input: { rescueId },
        },
      });
    } catch (error) {
      console.error('Failed to accept rescue:', error);
    }
  };

  const handleRejectRescue = async (rescueId: string) => {
    // TODO: Implement reject mutation
    toast.info('Reject functionality coming soon');
    console.log('Rejecting rescue:', rescueId);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Rescuer Dashboard
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Welcome back, {volunteerName}
          </p>
        </div>

        {/* Loading State */}
        {loading && !data && (
          <Card className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
            <p className="text-gray-600 dark:text-gray-400">
              Loading your dashboard...
            </p>
          </Card>
        )}

        {!isOperationallyEligible && (
          <Card className="border-2 border-amber-300 bg-amber-50 p-6 dark:border-amber-700 dark:bg-amber-950/30">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
              <div>
                <h2 className="font-semibold text-amber-950 dark:text-amber-100">
                  Rescuer verification required
                </h2>
                <p className="mt-1 text-sm text-amber-900 dark:text-amber-200">
                  Your account is not eligible for rescue assignments until your
                  application is verified and your account is active.
                </p>
                <Badge className="mt-3 bg-amber-600 text-white">
                  Application status: {verificationStatus.replace('_', ' ')}
                </Badge>
              </div>
            </div>
          </Card>
        )}

        {/* Availability Toggle */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-full',
                  isAvailable ? 'bg-green-100' : 'bg-gray-100',
                )}
              >
                <Activity
                  className={cn(
                    'h-6 w-6',
                    isAvailable ? 'text-green-600' : 'text-gray-400',
                  )}
                />
              </div>
              <div>
                <h2 className="text-lg font-semibold">
                  {isAvailable ? 'You are Online' : 'You are Offline'}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isAvailable
                    ? 'Ready to accept new rescue assignments'
                    : 'Turn on availability to receive assignments'}
                </p>
              </div>
            </div>
            <Switch
              checked={isAvailable}
              onCheckedChange={handleAvailabilityToggle}
              disabled={updatingAvailability || !isOperationallyEligible}
            />
          </div>
        </Card>

        {/* Open Rescue Alerts */}
        {isOperationallyEligible && (
          <Card className="border-2 border-primary/30 bg-primary/5 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold">Open Rescue Alerts</h2>
                  <Badge className="bg-primary text-primary-foreground">
                    {openAlertsLoading ? 'Loading…' : openAlertsCount}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  View unassigned requests, then claim one securely. Exact
                  contact and location details are shared after a successful
                  claim.
                </p>
              </div>
              <Button onClick={() => router.push('/dashboard/rescuer/queue')}>
                <AlertTriangle className="mr-2 h-4 w-4" />
                View Open Rescues
              </Button>
            </div>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Rescues
                </p>
                <p className="mt-1 text-2xl font-bold">
                  {liveStats.totalRescues}
                </p>
              </div>
              <Activity className="h-8 w-8 text-primary" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Success Rate
                </p>
                <p className="mt-1 text-2xl font-bold">
                  {liveStats.totalRescues > 0
                    ? Math.round(
                        (liveStats.completedRescues / liveStats.totalRescues) *
                          100,
                      )
                    : 0}
                  %
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Rating
                </p>
                <p className="mt-1 text-2xl font-bold">
                  ⭐ {liveStats.rating || 0}
                </p>
              </div>
              <Award className="h-8 w-8 text-yellow-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Today
                </p>
                <p className="mt-1 text-2xl font-bold">{todayRescues}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Active Rescue */}
          <div className="lg:col-span-2 space-y-6">
            {activeRescue ? (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Active Rescue</h2>
                  <Badge className="bg-green-500 text-white">
                    {activeRescue.status.replace('_', ' ')}
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-lg font-semibold">
                        {activeRescue.referenceNumber}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {activeRescue.address}, {activeRescue.municipality}
                      </p>
                    </div>
                    <Badge
                      className={cn(
                        'text-white',
                        PRIORITY_COLORS[
                          activeRescue.priority as keyof typeof PRIORITY_COLORS
                        ],
                      )}
                    >
                      {activeRescue.priority}
                    </Badge>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Snake Description
                    </p>
                    <p>
                      {activeRescue.snakeDescription ||
                        'No description available'}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>
                        {Math.round(
                          (Date.now() -
                            new Date(
                              activeRescue.acceptedAt ||
                                activeRescue.assignedAt ||
                                activeRescue.createdAt,
                            ).getTime()) /
                            60000,
                        )}{' '}
                        min ago
                      </span>
                    </div>
                    {activeRescue.lat && activeRescue.lng && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>Location captured</span>
                      </div>
                    )}
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2">
                    <Button
                      className="w-full"
                      onClick={() => router.push('/dashboard/rescuer/active')}
                    >
                      <Navigation className="mr-2 h-4 w-4" />
                      Continue Rescue
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        if (activeRescue.user?.phone) {
                          window.location.href = `tel:${activeRescue.user.phone}`;
                        }
                      }}
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      Call Citizen
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-12 text-center">
                <Activity className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-semibold">No Active Rescue</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  {isAvailable
                    ? 'Accept an assignment below to start a rescue'
                    : 'Turn on availability to receive assignments'}
                </p>
              </Card>
            )}

            {/* Pending Assignments */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">
                Pending Assignments
              </h2>

              {pendingAssignments.length > 0 ? (
                <div className="space-y-4">
                  {pendingAssignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold">
                            {assignment.referenceNumber}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {assignment.address}, {assignment.municipality}
                          </p>
                        </div>
                        <Badge
                          className={cn(
                            'text-white',
                            PRIORITY_COLORS[
                              assignment.priority as keyof typeof PRIORITY_COLORS
                            ],
                          )}
                        >
                          {assignment.priority}
                        </Badge>
                      </div>

                      <p className="text-sm mb-3">
                        {assignment.snakeDescription ||
                          'No description available'}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>
                            {Math.round(
                              (Date.now() -
                                new Date(assignment.createdAt).getTime()) /
                                60000,
                            )}{' '}
                            min ago
                          </span>
                        </div>
                        {assignment.lat && assignment.lng && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>GPS available</span>
                          </div>
                        )}
                      </div>

                      <div className="grid gap-2 sm:grid-cols-2">
                        <Button
                          onClick={() => setSelectedAssignment(assignment)}
                          disabled={accepting === assignment.id}
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          {accepting === assignment.id ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Accepting...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Accept
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleRejectRescue(assignment.id)}
                          disabled={accepting === assignment.id}
                          className="w-full"
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <AlertCircle className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    No pending assignments
                  </p>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="w-full min-w-0 justify-start bg-green-50 hover:bg-green-100 dark:bg-green-950 dark:hover:bg-green-900 border-green-200 dark:border-green-800"
                  onClick={() => router.push('/dashboard/rescuer/queue')}
                >
                  <Activity className="mr-2 h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
                  <span className="truncate">
                    <span className="hidden sm:inline">Rescue </span>
                    Queue
                  </span>
                  {/* TODO: Add badge with queue count */}
                </Button>
                <Button
                  variant="outline"
                  className="w-full min-w-0 justify-start"
                  onClick={() => router.push('/dashboard/rescuer/assignments')}
                >
                  <Activity className="mr-2 h-4 w-4 shrink-0" />
                  <span className="truncate">Assignments</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full min-w-0 justify-start"
                  onClick={() => router.push('/dashboard/rescuer/history')}
                >
                  <Clock className="mr-2 h-4 w-4 shrink-0" />
                  <span className="truncate">History</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full min-w-0 justify-start"
                  onClick={() => router.push('/dashboard/rescuer/analytics')}
                >
                  <BarChart3 className="mr-2 h-4 w-4 shrink-0" />
                  <span className="truncate">Earnings</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full min-w-0 justify-start"
                  onClick={() => router.push('/dashboard/rescuer/hospitals')}
                >
                  <Hospital className="mr-2 h-4 w-4 shrink-0" />
                  <span className="truncate">Hospitals</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full min-w-0 justify-start"
                  onClick={() => router.push('/dashboard/rescuer/map')}
                >
                  <MapPin className="mr-2 h-4 w-4 shrink-0" />
                  <span className="truncate">Map</span>
                </Button>
              </div>
            </Card>

            {/* Emergency Contact */}
            <Card className="p-6 border-2 border-red-600 bg-red-100 dark:border-red-600 dark:bg-red-950 shadow-elevated">
              <h3 className="text-lg font-semibold mb-2 text-red-900 dark:text-red-100">
                Emergency Support
              </h3>
              <p className="text-sm text-red-800 dark:text-red-200 mb-4 font-medium">
                Need help during a rescue? Contact our emergency line
              </p>
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white shadow-lg">
                <Phone className="mr-2 h-4 w-4" />
                Call Emergency: 102
              </Button>
            </Card>

            {/* Safety Tips */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-3">Safety Reminder</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Always wear protective gear</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>
                    Never handle venomous snakes without proper equipment
                  </span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Update your status regularly</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Contact support if unsure</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>

      <Dialog
        open={Boolean(selectedAssignment)}
        onOpenChange={(open) => {
          if (!open) setSelectedAssignment(null);
        }}
      >
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Accept rescue assignment</DialogTitle>
            <DialogDescription>
              Review the rescue details before confirming. This will move the
              case into your active rescue queue.
            </DialogDescription>
          </DialogHeader>

          {selectedAssignment && (
            <div className="space-y-4 py-2">
              <div className="rounded-lg border bg-muted/30 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Reference</p>
                    <p className="text-lg font-semibold">
                      {selectedAssignment.referenceNumber}
                    </p>
                  </div>
                  <Badge
                    className={cn(
                      'text-white',
                      PRIORITY_COLORS[
                        selectedAssignment.priority as keyof typeof PRIORITY_COLORS
                      ],
                    )}
                  >
                    {selectedAssignment.priority}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4" />
                  <span>
                    {selectedAssignment.address},{' '}
                    {selectedAssignment.municipality}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="mt-0.5 h-4 w-4" />
                  <span>
                    Reported{' '}
                    {new Date(selectedAssignment.createdAt).toLocaleString(
                      'en-US',
                      {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      },
                    )}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="mt-0.5 h-4 w-4" />
                  <span>
                    {selectedAssignment.snakeDescription ||
                      'No snake description provided yet.'}
                  </span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={() => setSelectedAssignment(null)}
              disabled={!!accepting}
            >
              Cancel
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={async () => {
                if (!selectedAssignment) return;
                const assignmentToAccept = selectedAssignment;
                setSelectedAssignment(null);
                await handleAcceptRescue(assignmentToAccept.id);
              }}
              disabled={!!accepting}
            >
              {accepting === selectedAssignment?.id ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Accepting...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Confirm accept
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
