/**
 * Rescuer Map Page
 * Track assigned rescue requests and navigate to locations with enhanced map view
 * ✅ INTEGRATED: GraphQL query for assigned rescues + nearby hospitals
 */

'use client';

import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useUserLocation } from '@/hooks/useUserLocation';
import { useMyAssignedRescuesQuery } from '@/lib/graphql/hooks/rescue.hooks';
import { useNearbyHospitals } from '@/lib/graphql/hooks/hospital.hooks';
import {
  Navigation,
  Phone,
  AlertCircle,
  RefreshCw,
  MapPin,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  formatDistance,
  calculateDistance,
  estimateTravelTime,
} from '@/lib/map/distance';
import { toast } from 'sonner';

// Dynamic import to avoid SSR issues - use Google Maps-backed component
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
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      </div>
    ),
  },
);

const NEPAL_CENTER: [number, number] = [28.3949, 84.124];

function hasValidCoords(
  lat: number | null | undefined,
  lng: number | null | undefined,
) {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    !(lat === 0 && lng === 0) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

export default function RescuerMapPage() {
  const [selectedRescueId, setSelectedRescueId] = useState<string | null>(null);
  const [showHospitals, setShowHospitals] = useState(true);
  const [showRoutes, setShowRoutes] = useState(true);

  const { location, error: locationError, requestLocation } = useUserLocation();

  // Only show assigned and in-progress rescues for this rescuer using GraphQL hooks
  const { data, loading, error, refetch } = useMyAssignedRescuesQuery({
    variables: {
      filter: { statuses: ['ASSIGNED', 'ACCEPTED', 'IN_PROGRESS'] },
      pagination: { limit: 50, page: 1 },
    },
    pollInterval: 15000, // Refresh every 15 seconds for real-time updates
    fetchPolicy: 'cache-and-network',
  });

  const rescues =
    data?.myAssignedRescues?.edges?.map((edge) => edge.node) || [];

  // Fetch nearby hospitals for reference during rescues
  const { data: hospitalsData } = useNearbyHospitals(
    location?.latitude,
    location?.longitude,
    {
      radiusKm: 50,
      antivenomRequired: false,
      limit: 20,
      skip: !location,
    },
  );

  const nearbyHospitals = useMemo(() => {
    const hospitals = (hospitalsData as any)?.nearbyHospitals || [];
    return hospitals.filter((h: any) => hasValidCoords(h.latitude, h.longitude));
  }, [hospitalsData]);

  // Define rescue type for better type safety
  type RescueWithDistance = (typeof rescues)[0] & {
    distance: number | null;
    phone?: string;
    name?: string;
    snakeDescription?: string;
  };

  // Show error toast
  if (error) {
    toast.error(`Failed to load rescues: ${error.message}`);
  }

  // Sort rescues by distance
  const sortedRescues: RescueWithDistance[] = location
    ? rescues
        .map((r) => ({
          ...r,
          distance:
            r.lat && r.lng
              ? calculateDistance(
                  location.latitude,
                  location.longitude,
                  r.lat,
                  r.lng,
                )
              : null,
        }))
        .sort((a, b) => {
          if (a.distance === null) return 1;
          if (b.distance === null) return -1;
          return a.distance - b.distance;
        })
    : rescues.map((r) => ({ ...r, distance: null }));

  const plottableRescues = useMemo(
    () => sortedRescues.filter((r) => hasValidCoords(r.lat, r.lng)),
    [sortedRescues],
  );

  const mapCenter: [number, number] = useMemo(() => {
    if (location) {
      return [location.latitude, location.longitude];
    }
    if (plottableRescues.length === 0) return NEPAL_CENTER;
    const avgLat =
      plottableRescues.reduce((sum, r) => sum + (r.lat as number), 0) /
      plottableRescues.length;
    const avgLng =
      plottableRescues.reduce((sum, r) => sum + (r.lng as number), 0) /
      plottableRescues.length;
    return [avgLat, avgLng];
  }, [location, plottableRescues]);

  const mapZoom = location && plottableRescues.length > 0 ? 11 : 9;

  const stats = useMemo(
    () => ({
      total: sortedRescues.length,
      inProgress: sortedRescues.filter((r) => r.status === 'IN_PROGRESS').length,
      critical: sortedRescues.filter((r) => r.priority === 'CRITICAL').length,
      hospitals: nearbyHospitals.length,
    }),
    [sortedRescues, nearbyHospitals.length],
  );

  const handleRescueClick = (rescueId: string) => {
    setSelectedRescueId(rescueId);
  };

  const handleRefresh = () => {
    refetch();
    requestLocation();
    toast.success('Map data refreshed');
  };

  const handleNavigate = (lat: number, lng: number) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
  };

  const handleCallContact = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  return (
    <div className="min-h-screen flex flex-col p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            My Rescue Operations Map
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time tracking of your assigned rescues and nearby hospitals
          </p>
        </div>

        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Statistics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg shadow-sm border border-border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase">
                Total Assigned
              </p>
              <p className="text-2xl font-bold text-foreground">
                {stats.total}
              </p>
            </div>
            <MapPin className="h-8 w-8 text-primary" />
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-sm border border-primary/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase">
                In Progress
              </p>
              <p className="text-2xl font-bold text-primary">
                {stats.inProgress}
              </p>
            </div>
            <Clock className="h-8 w-8 text-primary" />
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-sm border border-destructive/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase">
                Critical
              </p>
              <p className="text-2xl font-bold text-destructive">
                {stats.critical}
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-sm border border-success/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase">
                Nearby Hospitals
              </p>
              <p className="text-2xl font-bold text-success">
                {stats.hospitals}
              </p>
            </div>
            <div className="text-2xl">🏥</div>
          </div>
        </div>
      </div>

      {/* Map Filters */}
      <div className="bg-card rounded-lg shadow-sm border border-border p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">Map Layers</h3>
        <div className="flex flex-wrap gap-2">
          {/* Hospitals Toggle */}
          <label className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg border-2 border-input bg-surface-elevated hover:border-success transition-colors cursor-pointer">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center text-xs">
                🏥
              </div>
              <span className="text-sm font-medium text-foreground">
                Hospitals ({nearbyHospitals.length})
              </span>
            </div>
            <input
              type="checkbox"
              checked={showHospitals}
              onChange={(e) => setShowHospitals(e.target.checked)}
              className="w-4 h-4 accent-success rounded"
            />
          </label>

          {/* Routes Toggle */}
          <label className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg border-2 border-input bg-surface-elevated hover:border-primary transition-colors cursor-pointer">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
              <span className="text-sm font-medium text-foreground">
                Routes
              </span>
            </div>
            <input
              type="checkbox"
              checked={showRoutes}
              onChange={(e) => setShowRoutes(e.target.checked)}
              className="w-4 h-4 accent-primary rounded"
            />
          </label>

          {/* Your Location Indicator */}
          {location && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-info/40 bg-info/10">
              <div className="w-4 h-4 rounded-full bg-info border-2 border-card shadow" />
              <span className="text-sm font-medium text-info">
                Your Location
              </span>
            </div>
          )}

          {locationError && (
            <Button
              variant="outline"
              size="sm"
              onClick={requestLocation}
              className="text-xs"
            >
              <MapPin className="h-3 w-3 mr-1" />
              Enable Location
            </Button>
          )}
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 bg-card rounded-lg shadow-sm border border-border overflow-hidden">
        {loading ? (
          <div className="h-[calc(100vh-450px)] flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-muted-foreground">Loading rescues...</p>
            </div>
          </div>
        ) : (
          <RescueMap
            rescues={plottableRescues.map((r) => ({
              ...r,
              lat: r.lat as number,
              lng: r.lng as number,
            }))}
            hospitals={showHospitals ? nearbyHospitals : []}
            center={mapCenter}
            zoom={mapZoom}
            userLocation={location}
            selectedRescueId={selectedRescueId}
            onRescueClick={handleRescueClick}
            showRoutes={showRoutes}
            showPriorityFilters={false} // Rescuer view shows all their assigned rescues
            enableRescuerView={true}
          />
        )}
      </div>

      {/* Rescue List Sidebar (Mobile-responsive) */}
      <div className="bg-card rounded-lg shadow-sm border border-border p-4">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Your Assigned Rescues
        </h3>
        {sortedRescues.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No assigned rescues at the moment</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {sortedRescues.map((rescue) => (
              <div
                key={rescue.id}
                className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  selectedRescueId === rescue.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => handleRescueClick(rescue.id)}
              >
                {/* Priority Badge */}
                <div className="flex items-start justify-between mb-2">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      rescue.priority === 'CRITICAL'
                        ? 'bg-destructive text-destructive-foreground'
                        : rescue.priority === 'HIGH'
                          ? 'bg-warning text-warning-foreground'
                          : rescue.priority === 'MEDIUM'
                            ? 'bg-info text-info-foreground'
                            : 'bg-success text-success-foreground'
                    }`}
                  >
                    {rescue.priority}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      rescue.status === 'IN_PROGRESS'
                        ? 'bg-primary/20 text-primary'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {rescue.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Location */}
                <div className="mb-2">
                  <p className="text-sm font-medium text-foreground">
                    {rescue.address || 'Location not specified'}
                  </p>
                  {rescue.municipality && (
                    <p className="text-xs text-muted-foreground">
                      {rescue.municipality}
                    </p>
                  )}
                </div>

                {/* Distance */}
                {rescue.distance !== null && (
                    <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {formatDistance(rescue.distance)} away
                      {rescue.distance &&
                        ` • ${estimateTravelTime(rescue.distance)} drive`}
                    </span>
                  </div>
                )}

                {/* Snake Description */}
                {rescue.snakeDescription && (
                  <p className="text-xs text-muted-foreground mb-2">
                    🐍 {rescue.snakeDescription}
                  </p>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 mt-3">
                  {rescue.lat && rescue.lng && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNavigate(rescue.lat as number, rescue.lng as number);
                      }}
                    >
                      <Navigation className="h-3 w-3 mr-1" />
                      Navigate
                    </Button>
                  )}
                  {rescue.user?.phone && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCallContact(rescue.user.phone);
                      }}
                    >
                      <Phone className="h-3 w-3 mr-1" />
                      Call
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


        {/* Rescue List */}
        <div className="lg:col-span-1 h-full min-h-[600px] bg-card rounded-lg shadow-sm border border-border p-4 overflow-auto">
          <h3 className="text-sm font-semibold text-foreground mb-4">
            Rescue Locations
          </h3>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin h-6 w-6 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <p className="text-sm text-red-600">Failed to load rescues</p>
            </div>
          ) : sortedRescues.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                No assigned rescues
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Check back later for assignments
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedRescues.map((rescue) => {
                const isSelected = selectedRescueId === rescue.id;
                const priorityColors: Record<string, string> = {
                  CRITICAL: 'border-red-600 bg-red-50',
                  HIGH: 'border-orange-600 bg-orange-50',
                  MEDIUM: 'border-yellow-600 bg-yellow-50',
                  LOW: 'border-green-600 bg-green-50',
                };
                const bgClass =
                  priorityColors[rescue.priority] || 'border-border bg-card';

                return (
                  <div
                    key={rescue.id}
                    className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
                      isSelected ? 'ring-2 ring-blue-500 ' + bgClass : bgClass
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
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${
                          rescue.status === 'ASSIGNED'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {rescue.status === 'ASSIGNED' ? 'New' : 'Active'}
                      </span>
                    </div>

                    {rescue.distance && (
                      <div className="flex items-center gap-3 text-xs text-foreground mb-2">
                        <span className="flex items-center gap-1 font-semibold text-blue-600">
                          <MapPin className="h-3 w-3" />
                          {formatDistance(rescue.distance)}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {estimateTravelTime(rescue.distance)}
                        </span>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNavigate(rescue.lat, rescue.lng);
                        }}
                      >
                        <Navigation className="h-3 w-3 mr-1" />
                        Navigate
                      </Button>
                      {rescue.phone && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCallContact(rescue.phone);
                          }}
                        >
                          <Phone className="h-3 w-3 mr-1" />
                          Call
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Map */}
        <div className="lg:col-span-2 h-full min-h-[600px] bg-card rounded-lg shadow-sm border border-border overflow-hidden">
          <div className="h-full w-full">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading rescues...</p>
                </div>
              </div>
            ) : error ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-red-600">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4" />
                  <p>Failed to load rescues</p>
                  <Button onClick={() => refetch()} className="mt-4">
                    Try Again
                  </Button>
                </div>
              </div>
            ) : (
              <RescueMap
                rescues={sortedRescues.map((r) => ({
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
                hospitals={nearbyHospitals}
                userLocation={location}
                selectedRescueId={selectedRescueId}
                onRescueClick={handleRescueClick}
                zoom={13}
                tileTheme="default"
              />
            )}
          </div>
        </div>
      </div>

      {/* Location Error Alert */}
      {locationError && (
        <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-yellow-900">
              Location Access Required
            </p>
            <p className="text-xs text-yellow-700 mt-1">
              Enable location to see distances and get accurate navigation.
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
