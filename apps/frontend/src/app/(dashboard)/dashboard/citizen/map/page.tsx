/**
 * Citizen Map Page
 * Track own rescue requests and assigned rescuer location in real-time
 * ✅ INTEGRATED: GraphQL query for rescue requests
 */

'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useWatchUserLocation } from '@/hooks/useUserLocation';
import { useMyRescueRequestsQuery } from '@/lib/graphql/hooks/rescue.hooks';
import { useNearbyHospitals } from '@/lib/graphql/hooks/hospital.hooks';
import {
  MapPin,
  Phone,
  AlertCircle,
  RefreshCw,
  Clock,
  Navigation2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  formatDistance,
  calculateDistance,
  estimateTravelTime,
} from '@/lib/map/distance';
import { toast } from 'sonner';

// Dynamic import to avoid SSR issues
const RescueMap = dynamic(
  () =>
    import('@/components/map/GoogleRescueMap').then((mod) => ({
      default: mod.GoogleRescueMap,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="h-[calc(100vh-200px)] flex items-center justify-center bg-muted rounded-lg">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      </div>
    ),
  },
);

export default function CitizenMapPage() {
  const [selectedRescueId, setSelectedRescueId] = useState<string | null>(null);

  // Use watch location for real-time updates
  const {
    location,
    error: locationError,
    requestLocation,
  } = useWatchUserLocation();

  // Fetch user's own rescue requests using GraphQL hooks
  const { data, loading, error, refetch } = useMyRescueRequestsQuery({
    variables: {
      filter: {
        statuses: ['PENDING', 'ASSIGNED', 'ACCEPTED', 'IN_PROGRESS'],
      },
      pagination: { limit: 20, page: 1 },
    },
    pollInterval: 10000, // Refresh every 10 seconds for real-time tracking
    fetchPolicy: 'cache-and-network',
  });

  const rescues = data?.myRescueRequests?.edges?.map((edge) => edge.node) || [];

  // Fetch nearby hospitals using GraphQL hooks
  const { data: hospitalsData } = useNearbyHospitals(
    location?.latitude,
    location?.longitude,
    {
      radiusKm: 30,
      antivenomRequired: false,
      limit: 10,
      skip: !location, // Only fetch when we have location
    },
  );

  const nearbyHospitals = (hospitalsData as any)?.nearbyHospitals || [];

  // Show error toast
  if (error) {
    toast.error(`Failed to load rescues: ${error.message}`);
  }

  // Mock rescuer location (replace with actual GraphQL query for assigned rescuer)
  const activeRescue = rescues.find(
    (r: any) => r.status === 'IN_PROGRESS' || r.status === 'ASSIGNED',
  );
  const mockRescuers =
    activeRescue && activeRescue.assignedVolunteer
      ? [
          {
            id: activeRescue.assignedVolunteer?.id || '',
            name: activeRescue.assignedVolunteer?.name || 'Assigned Rescuer',
            lat: activeRescue.lat ? activeRescue.lat + 0.003 : 0, // Mock location near rescue
            lng: activeRescue.lng ? activeRescue.lng + 0.003 : 0,
            phone: activeRescue.assignedVolunteer?.contact || '+977-9800000000', // Use 'contact' field
            status: 'En Route',
          },
        ]
      : [];

  // Calculate rescuer distance if active rescue exists
  const rescuerDistance =
    activeRescue && mockRescuers[0] && activeRescue.lat && activeRescue.lng
      ? calculateDistance(
          mockRescuers[0].lat,
          mockRescuers[0].lng,
          activeRescue.lat,
          activeRescue.lng,
        )
      : null;

  const handleRescueClick = (rescueId: string) => {
    setSelectedRescueId(rescueId);
  };

  const handleRefresh = () => {
    refetch();
    requestLocation();
  };

  const handleCallRescuer = () => {
    if (mockRescuers[0]?.phone) {
      window.location.href = `tel:${mockRescuers[0].phone}`;
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Track My Rescue
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor rescue status and rescuer location in real-time
          </p>
        </div>

        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Active Rescue Alert */}
      {activeRescue && (
        <div className="bg-info/10 dark:bg-info/15 border-2 border-info/30 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Navigation2 className="h-5 w-5 text-info" />
                <h3 className="text-sm font-bold text-foreground">
                  {activeRescue.status === 'IN_PROGRESS'
                    ? 'Rescuer En Route!'
                    : 'Rescue Assigned'}
                </h3>
              </div>

              <div className="space-y-1 text-sm">
                <p className="text-foreground/80">
                  <strong>Location:</strong> {activeRescue.address}
                </p>
                <p className="text-muted-foreground">
                  <strong>Status:</strong>{' '}
                  <span
                    className={`px-2 py-0.5 rounded text-xs ${
                      activeRescue.status === 'IN_PROGRESS'
                        ? 'bg-purple-500/15 text-purple-700 dark:text-purple-400'
                        : 'bg-info/15 text-info'
                    }`}
                  >
                    {activeRescue.status === 'IN_PROGRESS'
                      ? 'In Progress'
                      : 'Assigned'}
                  </span>
                </p>

                {rescuerDistance !== null && (
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-info/20">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-info" />
                      <span className="font-semibold text-foreground">
                        {formatDistance(rescuerDistance)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-info" />
                      <span className="text-muted-foreground">
                        ETA: {estimateTravelTime(rescuerDistance)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {mockRescuers[0]?.phone && (
              <Button
                onClick={handleCallRescuer}
                size="sm"
                className="bg-info hover:bg-info/90 text-info-foreground"
              >
                <Phone className="h-4 w-4 mr-2" />
                Call Rescuer
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Statistics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg shadow-sm border border-border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase">
                My Requests
              </p>
              <p className="text-2xl font-bold text-foreground">
                {rescues.length}
              </p>
            </div>
            <MapPin className="h-8 w-8 text-info" />
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-sm border border-warning/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase">Pending</p>
              <p className="text-2xl font-bold text-warning">
                {rescues.filter((r: any) => r.status === 'PENDING').length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-warning" />
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-sm border border-info/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase">
                Assigned
              </p>
              <p className="text-2xl font-bold text-info">
                {rescues.filter((r: any) => r.status === 'ASSIGNED').length}
              </p>
            </div>
            <Navigation2 className="h-8 w-8 text-info" />
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-sm border border-purple-500/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase">Active</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {rescues.filter((r: any) => r.status === 'IN_PROGRESS').length}
              </p>
            </div>
            <MapPin className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
      </div>

      {/* Main Content - Split Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Rescue List */}
        <div className="lg:col-span-1 bg-card rounded-lg shadow-sm border border-border p-4 overflow-auto">
          <h3 className="text-sm font-semibold text-foreground mb-4">
            My Rescue Requests
          </h3>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
              <p className="text-sm text-destructive">
                Failed to load requests
              </p>
            </div>
          ) : rescues.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                No active requests
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Create a rescue request to see it here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {rescues.map((rescue: any) => {
                const isSelected = selectedRescueId === rescue.id;
                const isActive =
                  rescue.status === 'IN_PROGRESS' ||
                  rescue.status === 'ASSIGNED';

                return (
                  <div
                    key={rescue.id}
                    className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
                      isSelected
                        ? 'ring-2 ring-info border-info/40 bg-info/10'
                        : isActive
                          ? 'border-info/30 bg-info/5'
                          : 'border-border bg-card hover:border-border/80 hover:bg-accent/50'
                    }`}
                    onClick={() => handleRescueClick(rescue.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground">
                          {rescue.address?.substring(0, 40)}...
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {rescue.municipality}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${
                          rescue.status === 'PENDING'
                            ? 'bg-warning/15 text-warning dark:text-warning'
                            : rescue.status === 'ASSIGNED'
                              ? 'bg-info/15 text-info'
                              : rescue.status === 'IN_PROGRESS'
                                ? 'bg-purple-500/15 text-purple-700 dark:text-purple-400'
                                : 'bg-primary/15 text-primary'
                        }`}
                      >
                        {rescue.status === 'PENDING'
                          ? 'Waiting'
                          : rescue.status === 'ASSIGNED'
                            ? 'Assigned'
                            : rescue.status === 'IN_PROGRESS'
                              ? 'Active'
                              : rescue.status}
                      </span>

                      <span
                        className={`text-xs px-2 py-0.5 rounded ${
                          rescue.priority === 'CRITICAL'
                            ? 'bg-destructive/15 text-destructive'
                            : rescue.priority === 'HIGH'
                              ? 'bg-warning/15 text-warning'
                              : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {rescue.priority}
                      </span>
                    </div>

                    {rescue.snakeDescription && (
                      <p className="text-xs text-muted-foreground mt-2">
                        🐍 {rescue.snakeDescription.substring(0, 50)}...
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Map */}
        <div
          className="lg:col-span-2 bg-card rounded-lg shadow-sm border border-border overflow-hidden"
          style={{ height: '600px' }}
        >
          <div className="h-full w-full">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading map...</p>
                </div>
              </div>
            ) : error ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-destructive">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4" />
                  <p>Failed to load map</p>
                  <Button onClick={() => refetch()} className="mt-4">
                    Try Again
                  </Button>
                </div>
              </div>
            ) : (
              <RescueMap
                rescues={rescues.map((r: any) => ({
                  id: r.id,
                  lat: r.lat || 0,
                  lng: r.lng || 0,
                  address: r.address,
                  municipality: r.municipality,
                  status: r.status,
                  priority: r.priority,
                  name: r.name,
                  phone: r.phone,
                  snakeDescription: r.snakeDescription,
                }))}
                rescuers={mockRescuers}
                hospitals={nearbyHospitals}
                userLocation={location}
                selectedRescueId={selectedRescueId}
                onRescueClick={handleRescueClick}
                zoom={14}
                tileTheme="default"
              />
            )}
          </div>
        </div>
      </div>

      {/* Map Legend */}
      <div className="bg-card rounded-lg shadow-sm border border-border p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Map Legend
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-info flex items-center justify-center text-white border-2 border-card shadow">
              🐍
            </div>
            <span className="text-muted-foreground">My Request</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center border-2 border-card shadow">
              👨‍⚕️
            </div>
            <span className="text-muted-foreground">Rescuer</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center border-2 border-card shadow text-xs">
              🏥
            </div>
            <span className="text-muted-foreground">Hospital (Antivenom)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-warning flex items-center justify-center border-2 border-card shadow text-xs">
              🏥
            </div>
            <span className="text-muted-foreground">Hospital (Unknown)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-info border-2 border-card shadow"></div>
            <span className="text-muted-foreground">Your Location</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-info" />
            <span className="text-muted-foreground">Distance</span>
          </div>
        </div>
      </div>

      {/* Location Error Alert */}
      {locationError && (
        <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">
              Location Access Required
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Enable location to track rescuer distance in real-time.
            </p>
          </div>
          <Button onClick={requestLocation} size="sm" variant="outline">
            Enable
          </Button>
        </div>
      )}
    </div>
  );
}
