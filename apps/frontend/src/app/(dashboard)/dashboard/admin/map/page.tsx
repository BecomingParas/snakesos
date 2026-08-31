/**
 * Admin Map Page
 * Track all rescues, rescuers, and monitor rescue operations
 * ✅ INTEGRATED: GraphQL query for all active rescues
 */

'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useUserLocation } from '@/hooks/useUserLocation';
import { useActiveRescuesQuery } from '@/lib/graphql/hooks/rescue.hooks';
import { useHospitals } from '@/lib/graphql/hooks/hospital.hooks';
import { useVolunteersQuery } from '@/lib/graphql/hooks/volunteer.hooks';
import {
  useGeographicHeatmap,
  useSnakebiteHotspots,
} from '@/lib/graphql/hooks/map.hooks';
import { MapPin, Users, AlertCircle, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
      <div className="h-[calc(100vh-200px)] flex items-center justify-center rounded-lg bg-muted">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      </div>
    ),
  },
);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Priority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | string;
type RescueStatus =
  | 'PENDING'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | string;

interface RescueRecord {
  id: string;
  lat?: number | null;
  lng?: number | null;
  address?: string;
  municipality?: string;
  status: RescueStatus;
  priority: Priority;
  name?: string;
  phone?: string;
  snakeDescription?: string;
  assignedVolunteer?: {
    id: string;
    contact?: string;
    user?: { name?: string };
  } | null;
}

interface HospitalRecord {
  id: string;
  name: string;
  latitude: number | null;
  longitude: number | null;
  address?: string;
  municipality?: string;
  district?: string;
  phone?: string;
  emergencyPhone?: string;
  antivenomStatus?: string;
  emergency24x7?: boolean;
  snakebiteTreatmentAvailable?: boolean;
  ventilatorAvailable?: boolean;
}

interface HotspotRecord {
  id: string;
  name?: string;
  district: string;
  province?: string;
  riskLevel: string;
  riskScore?: number;
  source?: string;
  sourceUrl?: string;
  studyYear?: number;
  populationAtRisk?: number;
}

interface VolunteerRecord {
  id: string;
  user?: { name?: string; phone?: string };
  municipality?: string;
  latitude?: number | null;
  longitude?: number | null;
  contact?: string;
  isAvailableNow?: boolean;
  experience?: string;
  totalRescues?: number;
}

interface MapRescuer {
  id: string;
  name: string;
  lat: number;
  lng: number;
  phone: string;
  status: string;
  experience?: string;
  totalRescues?: number;
  municipality?: string;
  approximateLocation?: boolean;
}

// Fallback municipality centroids, used only when a volunteer has no stored
// coordinates. Anything placed via this table is flagged `approximateLocation`
// so the map/UI can visually distinguish it from a real GPS fix.
const MUNICIPALITY_FALLBACK_COORDS: Record<
  string,
  { lat: number; lng: number }
> = {
  Kathmandu: { lat: 27.7172, lng: 85.324 },
  Lalitpur: { lat: 27.6694, lng: 85.3264 },
  Bhaktapur: { lat: 27.671, lng: 85.4298 },
  Hetauda: { lat: 27.4287, lng: 85.0327 },
  Bharatpur: { lat: 27.6768, lng: 84.4347 },
  Dhading: { lat: 27.8565, lng: 84.9056 },
  Chitwan: { lat: 27.5291, lng: 84.3542 },
  Dhulikhel: { lat: 27.62, lng: 85.545 },
  Panauti: { lat: 27.5858, lng: 85.5172 },
  Biratnagar: { lat: 26.4525, lng: 87.2718 },
  Dharan: { lat: 26.809, lng: 87.2804 },
  Itahari: { lat: 26.6647, lng: 87.2723 },
  Dhankuta: { lat: 26.9833, lng: 87.3333 },
  Ilam: { lat: 26.91, lng: 87.925 },
  Damak: { lat: 26.6593, lng: 87.701 },
  Janakpur: { lat: 26.7271, lng: 85.9239 },
  Birgunj: { lat: 27.0104, lng: 84.8767 },
  Jaleshwar: { lat: 26.6476, lng: 85.7982 },
  Rajbiraj: { lat: 26.54, lng: 86.746 },
  Lahan: { lat: 26.72, lng: 86.48 },
  Pokhara: { lat: 28.2096, lng: 83.9856 },
  Gorkha: { lat: 28.0, lng: 84.6333 },
  Besisahar: { lat: 28.2305, lng: 84.4213 },
  Baglung: { lat: 28.2717, lng: 83.5903 },
  Beni: { lat: 28.35, lng: 83.5667 },
  Butwal: { lat: 27.7, lng: 83.45 },
  Siddharthanagar: { lat: 27.5051, lng: 83.4533 },
  Tansen: { lat: 27.8667, lng: 83.55 },
  Kapilvastu: { lat: 27.5803, lng: 82.9775 },
  Nawalparasi: { lat: 27.62, lng: 83.92 },
  Surkhet: { lat: 28.6, lng: 81.6167 },
  Jumla: { lat: 29.2747, lng: 82.1838 },
  Dailekh: { lat: 28.85, lng: 81.7167 },
  Nepalgunj: { lat: 28.05, lng: 81.6167 },
  Dhangadhi: { lat: 28.6939, lng: 80.5976 },
  Mahendranagar: { lat: 28.9657, lng: 80.1794 },
  Dadeldhura: { lat: 29.3, lng: 80.5833 },
  Dipayal: { lat: 29.2667, lng: 80.9333 },
};

const NEPAL_CENTER: [number, number] = [28.3949, 84.124];

function resolveVolunteerLocation(volunteer: VolunteerRecord): {
  lat: number;
  lng: number;
  approximateLocation: boolean;
} {
  if (
    typeof volunteer.latitude === 'number' &&
    typeof volunteer.longitude === 'number'
  ) {
    return {
      lat: volunteer.latitude,
      lng: volunteer.longitude,
      approximateLocation: false,
    };
  }
  const fallback =
    MUNICIPALITY_FALLBACK_COORDS[volunteer.municipality ?? ''] ??
    MUNICIPALITY_FALLBACK_COORDS.Kathmandu;
  return { ...fallback, approximateLocation: true };
}

function hasValidCoords(
  lat: number | null | undefined,
  lng: number | null | undefined,
) {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    !(lat === 0 && lng === 0) && // guard against "null island" placeholder data
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

function unwrapConnectionNodes<T>(payload: unknown, field: string): T[] {
  if (!payload || typeof payload !== 'object' || !(field in payload)) {
    return [];
  }

  const connection = (payload as Record<string, unknown>)[field];
  if (
    !connection ||
    typeof connection !== 'object' ||
    !('edges' in connection)
  ) {
    return [];
  }

  const edges = (connection as { edges?: Array<{ node: T }> }).edges ?? [];
  return edges.map((edge) => edge.node);
}

export default function AdminMapPage() {
  const [selectedRescueId, setSelectedRescueId] = useState<string | null>(null);

  // Filter states
  const [showCritical, setShowCritical] = useState(true);
  const [showHigh, setShowHigh] = useState(true);
  const [showMedium, setShowMedium] = useState(true);
  const [showLow, setShowLow] = useState(true);
  const [showRescuers, setShowRescuers] = useState(true);
  const [showHospitals, setShowHospitals] = useState(true);
  const [showHotspots, setShowHotspots] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showRoutes, setShowRoutes] = useState(true);
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);
  const priorityDropdownRef = useRef<HTMLDivElement>(null);

  // Close the priority dropdown on outside click / Escape
  useEffect(() => {
    if (!isPriorityDropdownOpen) {
      return undefined;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (
        priorityDropdownRef.current &&
        !priorityDropdownRef.current.contains(event.target as Node)
      ) {
        setIsPriorityDropdownOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsPriorityDropdownOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPriorityDropdownOpen]);

  const allFiltersActive =
    showCritical &&
    showHigh &&
    showMedium &&
    showLow &&
    showRescuers &&
    showHospitals &&
    showHotspots &&
    !showHeatmap &&
    showRoutes;

  const toggleAllFilters = () => {
    const newState = !allFiltersActive;
    setShowCritical(newState);
    setShowHigh(newState);
    setShowMedium(newState);
    setShowLow(newState);
    setShowRescuers(newState);
    setShowHospitals(newState);
    setShowHotspots(newState);
    setShowHeatmap(false);
    setShowRoutes(newState);
  };

  const { location, error: locationError, requestLocation } = useUserLocation();

  // Fetch all active rescues
  const { data, loading, error, refetch } = useActiveRescuesQuery({
    variables: { pagination: { limit: 200, page: 1 } },
    pollInterval: 30000,
    fetchPolicy: 'cache-and-network',
  });

  const rescues: RescueRecord[] = useMemo(
    () => unwrapConnectionNodes<RescueRecord>(data, 'activeRescues'),
    [data],
  );

  // Fetch all active hospitals across Nepal
  const {
    data: hospitalsData,
    loading: hospitalsLoading,
    error: hospitalsError,
  } = useHospitals({ status: 'ACTIVE' }, { first: 100 });

  const hospitals: HospitalRecord[] = useMemo(
    () => unwrapConnectionNodes<HospitalRecord>(hospitalsData, 'hospitals'),
    [hospitalsData],
  );

  // Fetch approved, currently-available rescuers for the live field view
  const { data: volunteersData, loading: volunteersLoading } =
    useVolunteersQuery({
      variables: {
        pagination: { limit: 200, page: 1 },
        filter: { status: 'APPROVED', isAvailableNow: true },
      },
      pollInterval: 30000,
      fetchPolicy: 'cache-and-network',
    });

  const allVolunteers: VolunteerRecord[] = useMemo(
    () => unwrapConnectionNodes<VolunteerRecord>(volunteersData, 'volunteers'),
    [volunteersData],
  );

  // Research-based snakebite hotspots
  const {
    data: hotspotsData,
    loading: hotspotsLoading,
    error: hotspotsError,
  } = useSnakebiteHotspots();

  const {
    data: heatmapData,
    loading: heatmapLoading,
    error: heatmapError,
  } = useGeographicHeatmap();

  const heatmapPoints = useMemo(
    () =>
      (heatmapData?.geographicHeatmap ?? []).filter((point) =>
        hasValidCoords(point.lat, point.lng),
      ),
    [heatmapData],
  );

  const hotspots: HotspotRecord[] = useMemo(() => {
    if (!hotspotsData || typeof hotspotsData !== 'object') {
      return [];
    }

    const value = (hotspotsData as { snakebiteHotspots?: HotspotRecord[] })
      .snakebiteHotspots;
    return Array.isArray(value) ? value : [];
  }, [hotspotsData]);

  // Surface fetch errors as toasts exactly once per error, not on every render
  useEffect(() => {
    if (error) toast.error(`Failed to load rescues: ${error.message}`);
  }, [error]);

  useEffect(() => {
    if (hospitalsError)
      toast.error(`Failed to load hospitals: ${hospitalsError.message}`);
  }, [hospitalsError]);

  useEffect(() => {
    if (hotspotsError)
      toast.error(`Failed to load hotspots: ${hotspotsError.message}`);
  }, [hotspotsError]);

  useEffect(() => {
    if (heatmapError)
      toast.error(`Failed to load heatmap: ${heatmapError.message}`);
  }, [heatmapError]);

  // Merge "available now" volunteers with rescuers currently en route on an
  // active job, de-duplicated by id in O(n) rather than a nested find().
  const mockRescuers: MapRescuer[] = useMemo(() => {
    const availableRescuers: MapRescuer[] = allVolunteers.map((volunteer) => {
      const resolved = resolveVolunteerLocation(volunteer);
      return {
        id: volunteer.id,
        name: volunteer.user?.name || 'Volunteer',
        lat: resolved.lat,
        lng: resolved.lng,
        approximateLocation: resolved.approximateLocation,
        phone: volunteer.user?.phone || 'Not available',
        status: volunteer.isAvailableNow ? 'AVAILABLE' : 'BUSY',
        experience: volunteer.experience,
        totalRescues: volunteer.totalRescues || 0,
        municipality: volunteer.municipality,
      };
    });

    const knownIds = new Set(availableRescuers.map((r) => r.id));

    const activeRescuers: MapRescuer[] = rescues
      .filter(
        (r) =>
          r.assignedVolunteer &&
          r.status === 'IN_PROGRESS' &&
          !knownIds.has(r.assignedVolunteer.id) &&
          hasValidCoords(r.lat, r.lng),
      )
      .map((r) => ({
        id: `active-${r.assignedVolunteer!.id}`,
        name: r.assignedVolunteer?.user?.name || 'Active Rescuer',
        lat: r.lat as number,
        lng: (r.lng as number) + 0.002,
        phone: r.assignedVolunteer?.contact || r.phone || 'Not available',
        status: 'En Route',
      }));

    return [...availableRescuers, ...activeRescuers];
  }, [allVolunteers, rescues]);

  // Filter rescues by selected priority levels
  const filteredRescues = useMemo(
    () =>
      rescues.filter((r) => {
        switch (r.priority) {
          case 'CRITICAL':
            return showCritical;
          case 'HIGH':
            return showHigh;
          case 'MEDIUM':
            return showMedium;
          case 'LOW':
            return showLow;
          default:
            return true;
        }
      }),
    [rescues, showCritical, showHigh, showMedium, showLow],
  );

  // Only rescues with real, plottable coordinates should ever reach the map —
  // otherwise missing lat/lng silently defaults to (0, 0), the Gulf of Guinea.
  const plottableRescues = useMemo(
    () => filteredRescues.filter((r) => hasValidCoords(r.lat, r.lng)),
    [filteredRescues],
  );

  const plottableHospitals = useMemo(
    () => hospitals.filter((h) => hasValidCoords(h.latitude, h.longitude)),
    [hospitals],
  );

  const mapCenter: [number, number] = useMemo(() => {
    if (plottableRescues.length === 0) return NEPAL_CENTER;
    const avgLat =
      plottableRescues.reduce((sum, r) => sum + (r.lat as number), 0) /
      plottableRescues.length;
    const avgLng =
      plottableRescues.reduce((sum, r) => sum + (r.lng as number), 0) /
      plottableRescues.length;
    return [avgLat, avgLng];
  }, [plottableRescues]);

  const mapZoom = plottableRescues.length > 0 ? 9 : 7;

  const stats = useMemo(
    () => ({
      total: rescues.length,
      critical: rescues.filter((r) => r.priority === 'CRITICAL').length,
      pending: rescues.filter((r) => r.status === 'PENDING').length,
      inProgress: rescues.filter((r) => r.status === 'IN_PROGRESS').length,
      assigned: rescues.filter((r) => r.status === 'ASSIGNED').length,
      hospitals: hospitals.length,
      rescuers: mockRescuers.length,
      hotspots: hotspots.length,
    }),
    [rescues, hospitals.length, mockRescuers.length, hotspots.length],
  );

  const activeRoutesCount = useMemo(
    () =>
      rescues.filter(
        (r) => r.status === 'IN_PROGRESS' || r.status === 'ASSIGNED',
      ).length,
    [rescues],
  );

  const handleRescueClick = (rescueId: string) => setSelectedRescueId(rescueId);

  const isMapDataLoading =
    loading || hospitalsLoading || volunteersLoading || hotspotsLoading || heatmapLoading;

  return (
    <div className="min-h-screen flex flex-col p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Rescue Operations Map
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time tracking of all rescue operations across Nepal
          </p>
        </div>
      </div>

      {/* Statistics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="bg-card rounded-lg shadow-sm border border-border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase">
                Total Active
              </p>
              <p className="text-2xl font-bold text-foreground">
                {stats.total}
              </p>
            </div>
            <MapPin className="h-8 w-8 text-primary" />
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

        <div className="bg-card rounded-lg shadow-sm border border-warning/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase">Pending</p>
              <p className="text-2xl font-bold text-warning">{stats.pending}</p>
            </div>
            <Filter className="h-8 w-8 text-warning" />
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-sm border border-info/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase">
                Assigned
              </p>
              <p className="text-2xl font-bold text-info">{stats.assigned}</p>
            </div>
            <Users className="h-8 w-8 text-info" />
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
            <MapPin className="h-8 w-8 text-primary" />
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-sm border border-success/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase">
                Hospitals
              </p>
              <p className="text-2xl font-bold text-success">
                {stats.hospitals}
              </p>
            </div>
            <div className="text-2xl">🏥</div>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-sm border border-success/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase">
                Rescuers
              </p>
              <p className="text-2xl font-bold text-success">
                {stats.rescuers}
              </p>
            </div>
            <div className="text-2xl">🧑‍🚒</div>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-sm border border-destructive/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase">
                Hotspots
              </p>
              <p className="text-2xl font-bold text-destructive">
                {stats.hotspots}
              </p>
            </div>
            <div className="text-2xl">🔥</div>
          </div>
        </div>
      </div>

      {/* Map Filters */}
      <div className="bg-card rounded-lg shadow-sm border border-border p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">Map Filters</h3>
          <button
            type="button"
            onClick={toggleAllFilters}
            className="text-xs px-3 py-1 rounded-md border-2 border-input hover:border-primary hover:bg-accent transition-colors"
          >
            {allFiltersActive ? '✓ Deselect All' : 'Select All'}
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {/* Priority Filters Dropdown */}
          <div className="relative" ref={priorityDropdownRef}>
            <button
              type="button"
              aria-haspopup="true"
              aria-expanded={isPriorityDropdownOpen}
              onClick={() => setIsPriorityDropdownOpen((open) => !open)}
              className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg border-2 border-input bg-surface-elevated hover:border-primary transition-colors text-left"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">
                  🐍 Priority
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {
                  [showCritical, showHigh, showMedium, showLow].filter(Boolean)
                    .length
                }
                /4
              </span>
            </button>
            {isPriorityDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-full bg-popover text-popover-foreground border-2 border-border rounded-lg shadow-elevated z-50 p-2 space-y-1">
                <label className="flex items-center gap-2 p-2 hover:bg-destructive/10 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showCritical}
                    onChange={(e) => setShowCritical(e.target.checked)}
                    className="w-4 h-4 accent-destructive rounded"
                  />
                  <div className="w-5 h-5 rounded-full bg-destructive flex items-center justify-center text-xs">
                    🐍
                  </div>
                  <span className="text-sm text-foreground">Critical</span>
                </label>

                <label className="flex items-center gap-2 p-2 hover:bg-warning/10 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showHigh}
                    onChange={(e) => setShowHigh(e.target.checked)}
                    className="w-4 h-4 accent-warning rounded"
                  />
                  <div className="w-5 h-5 rounded-full bg-warning flex items-center justify-center text-xs">
                    🐍
                  </div>
                  <span className="text-sm text-foreground">High</span>
                </label>

                <label className="flex items-center gap-2 p-2 hover:bg-warning/10 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showMedium}
                    onChange={(e) => setShowMedium(e.target.checked)}
                    className="w-4 h-4 accent-warning rounded"
                  />
                  <div className="w-5 h-5 rounded-full bg-warning flex items-center justify-center text-xs">
                    🐍
                  </div>
                  <span className="text-sm text-foreground">Medium</span>
                </label>

                <label className="flex items-center gap-2 p-2 hover:bg-success/10 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showLow}
                    onChange={(e) => setShowLow(e.target.checked)}
                    className="w-4 h-4 accent-success rounded"
                  />
                  <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center text-xs">
                    🐍
                  </div>
                  <span className="text-sm text-foreground">Low</span>
                </label>
              </div>
            )}
          </div>

          {/* Rescuers Toggle */}
          <label className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg border-2 border-input bg-surface-elevated hover:border-success transition-colors cursor-pointer">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center text-xs">
                👨‍⚕️
              </div>
              <span className="text-sm font-medium text-foreground">
                Rescuers
              </span>
            </div>
            <input
              type="checkbox"
              checked={showRescuers}
              onChange={(e) => setShowRescuers(e.target.checked)}
              className="w-4 h-4 accent-success rounded"
            />
          </label>

          {/* Hospitals Toggle */}
          <label className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg border-2 border-input bg-surface-elevated hover:border-success transition-colors cursor-pointer">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center text-xs">
                🏥
              </div>
              <span className="text-sm font-medium text-foreground">
                Hospitals
              </span>
            </div>
            <input
              type="checkbox"
              checked={showHospitals}
              onChange={(e) => setShowHospitals(e.target.checked)}
              className="w-4 h-4 accent-success rounded"
            />
          </label>

          {/* Hotspots Toggle */}
          <label className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg border-2 border-input bg-surface-elevated hover:border-destructive transition-colors cursor-pointer">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-destructive/20 border-2 border-destructive flex items-center justify-center text-xs">
                🔥
              </div>
              <span className="text-sm font-medium text-foreground">
                Hotspots
              </span>
            </div>
            <input
              type="checkbox"
              checked={showHotspots}
              onChange={(e) => setShowHotspots(e.target.checked)}
              className="w-4 h-4 accent-destructive rounded"
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
              {activeRoutesCount > 0 && (
                <span className="text-xs bg-primary/15 text-primary px-1.5 py-0.5 rounded-full">
                  {activeRoutesCount}
                </span>
              )}
            </div>
            <input
              type="checkbox"
              checked={showRoutes}
              onChange={(e) => setShowRoutes(e.target.checked)}
              className="w-4 h-4 accent-primary rounded"
            />
          </label>

          {/* Heatmap Toggle */}
          <label className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg border-2 border-input bg-surface-elevated hover:border-warning transition-colors cursor-pointer">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-warning/20 border-2 border-warning flex items-center justify-center text-xs">
                ◉
              </div>
              <span className="text-sm font-medium text-foreground">
                Risk heatmap
              </span>
            </div>
            <input
              type="checkbox"
              checked={showHeatmap}
              onChange={(e) => setShowHeatmap(e.target.checked)}
              className="w-4 h-4 accent-warning rounded"
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
        </div>
      </div>

      {/* Map Container */}
      <div
        className="bg-card rounded-lg shadow-sm border border-border overflow-hidden flex flex-col"
        style={{ height: '600px' }}
      >
        {isMapDataLoading ? (
          <div className="h-full w-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-muted-foreground">Loading rescues...</p>
            </div>
          </div>
        ) : error ? (
          <div className="h-full w-full flex items-center justify-center">
            <div className="text-center text-destructive">
              <AlertCircle className="h-12 w-12 mx-auto mb-4" />
              <p>Failed to load rescues</p>
              <Button onClick={() => refetch()} className="mt-4">
                Try Again
              </Button>
            </div>
          </div>
        ) : (
          <RescueMap
            rescues={plottableRescues.map((r) => ({
              id: r.id,
              lat: r.lat as number,
              lng: r.lng as number,
              address: r.address,
              municipality: r.municipality,
              status: r.status,
              priority: r.priority,
              name: r.name,
              phone: r.phone,
              snakeDescription: r.snakeDescription,
            }))}
            rescuers={showRescuers ? mockRescuers : []}
            hospitals={
              showHospitals
                ? plottableHospitals.map((h) => ({
                    id: h.id,
                    name: h.name,
                    latitude: h.latitude as number,
                    longitude: h.longitude as number,
                    address: h.address,
                    municipality: h.municipality,
                    district: h.district,
                    phone: h.phone,
                    emergencyPhone: h.emergencyPhone,
                    antivenomStatus: h.antivenomStatus,
                    emergency24x7: h.emergency24x7,
                    snakebiteTreatmentAvailable: h.snakebiteTreatmentAvailable,
                    ventilatorAvailable: h.ventilatorAvailable,
                  }))
                : []
            }
            hotspots={
              showHotspots
                ? hotspots.map((h) => ({
                    id: h.id,
                    name: h.name,
                    district: h.district,
                    province: h.province,
                    riskLevel: h.riskLevel as
                      | 'LOW'
                      | 'MODERATE'
                      | 'HIGH'
                      | 'VERY_HIGH'
                      | 'EXTREME',
                    riskScore: h.riskScore,
                    source: h.source,
                    sourceUrl: h.sourceUrl,
                    studyYear: h.studyYear,
                    populationAtRisk: h.populationAtRisk,
                  }))
                : []
            }
            userLocation={location}
            selectedRescueId={selectedRescueId}
            onRescueClick={handleRescueClick}
            center={mapCenter}
            zoom={mapZoom}
            showRoutes={showRoutes}
            heatmapPoints={heatmapPoints}
            showHeatmap={showHeatmap}
          />
        )}
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
              Enable location permissions to see distances and your position on
              the map.
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
