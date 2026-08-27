'use client';

import { useState } from 'react';
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
import { cn } from '@/lib/utils';
import {
  useAcceptRescueMutation,
  useAvailableRescuesQuery,
  useMyAssignedRescuesQuery,
} from '@/lib/graphql/hooks/rescue.hooks';
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

// Mock data - TODO: Replace with GraphQL queries
const mockVolunteer = {
  id: 'vol-1',
  name: 'Ram Prasad Sharma',
  isAvailableNow: true,
  totalRescues: 156,
  completedRescues: 148,
  rating: 4.8,
  todayRescues: 3,
};

const mockActiveRescue = {
  id: 'rescue-active-1',
  referenceNumber: 'BR-2024-102',
  status: 'IN_PROGRESS',
  priority: 'HIGH',
  municipality: 'Butwal',
  ward: 12,
  address: 'Traffic Chowk, Main Road',
  snakeDescription: 'Large brown snake, approximately 4 feet',
  createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  acceptedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
  distance: 2.3,
  citizenName: 'John Doe',
  citizenPhone: '9841234567',
};

const mockPendingAssignments = [
  {
    id: 'rescue-pending-1',
    referenceNumber: 'BR-2024-103',
    status: 'ASSIGNED',
    priority: 'MEDIUM',
    municipality: 'Butwal',
    address: 'Near City Mall',
    snakeDescription: 'Small green snake in garden',
    distance: 1.5,
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
  {
    id: 'rescue-pending-2',
    referenceNumber: 'BR-2024-104',
    status: 'ASSIGNED',
    priority: 'HIGH',
    municipality: 'Butwal',
    address: 'Hospital Road',
    snakeDescription: 'Snake inside house, possibly venomous',
    distance: 3.2,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
];

const PRIORITY_COLORS = {
  LOW: 'bg-gray-500',
  MEDIUM: 'bg-yellow-500',
  HIGH: 'bg-orange-500',
  CRITICAL: 'bg-red-500',
};

export default function RescuerDashboard() {
  const router = useRouter();
  const [isAvailable, setIsAvailable] = useState(mockVolunteer.isAvailableNow);
  const [updatingAvailability, setUpdatingAvailability] = useState(false);
  const [accepting, setAccepting] = useState<string | null>(null);

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

  // Calculate stats from real data
  const todayRescues = allRescues.filter((r) => {
    const today = new Date().setHours(0, 0, 0, 0);
    const rescueDate = new Date(r.createdAt).setHours(0, 0, 0, 0);
    return rescueDate === today;
  }).length;

  const handleAvailabilityToggle = async (checked: boolean) => {
    setUpdatingAvailability(true);
    try {
      // TODO: Call GraphQL mutation to update availability
      // await updateVolunteerAvailability({ available: checked })
      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsAvailable(checked);
      toast.success(checked ? 'You are now online' : 'You are now offline');
    } catch (error) {
      console.error('Failed to update availability:', error);
      toast.error('Failed to update availability');
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Rescuer Dashboard
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Welcome back, {mockVolunteer.name}
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
              disabled={updatingAvailability}
            />
          </div>
        </Card>

        {/* Open Rescue Alerts */}
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
                View unassigned requests, then claim one securely. Exact contact
                and location details are shared after a successful claim.
              </p>
            </div>
            <Button onClick={() => router.push('/dashboard/rescuer/queue')}>
              <AlertTriangle className="mr-2 h-4 w-4" />
              View Open Rescues
            </Button>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Rescues
                </p>
                <p className="mt-1 text-2xl font-bold">
                  {mockVolunteer.totalRescues}
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
                  {Math.round(
                    (mockVolunteer.completedRescues /
                      mockVolunteer.totalRescues) *
                      100,
                  )}
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
                  ⭐ {mockVolunteer.rating}
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
                          onClick={() => handleAcceptRescue(assignment.id)}
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
                  <span className="truncate">
                    <span className="hidden sm:inline">Rescue </span>
                    History
                  </span>
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
    </div>
  );
}
