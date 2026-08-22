/**
 * Admin Map Page
 * Track all rescues, rescuers, and monitor rescue operations
 * ✅ INTEGRATED: GraphQL query for all active rescues
 */

'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useUserLocation } from '@/hooks/useUserLocation';
import { useActiveRescuesQuery } from '@/lib/graphql/hooks/rescue.hooks';
import { useHospitals } from '@/lib/graphql/hooks/hospital.hooks';
import { useVolunteersQuery } from '@/lib/graphql/hooks/volunteer.hooks';
import { useSnakebiteHotspots } from '@/lib/graphql/hooks/map.hooks';
import { MapPin, Users, AlertCircle, RefreshCw, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Dynamic import to avoid SSR issues - Using Leaflet (FREE, no API key needed)
const RescueMap = dynamic(
  () => import('@/components/map/RescueMap').then(mod => ({ default: mod.RescueMap })),
  { 
    ssr: false,
    loading: () => (
      <div className="h-[calc(100vh-200px)] flex items-center justify-center rounded-lg bg-muted">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      </div>
    ),
  }
);

export default function AdminMapPage() {
  const [selectedRescueId, setSelectedRescueId] = useState<string | null>(null);
  const [hospitalSearchQuery, setHospitalSearchQuery] = useState<string>('');
  
  // Filter states
  const [showCritical, setShowCritical] = useState(true);
  const [showHigh, setShowHigh] = useState(true);
  const [showMedium, setShowMedium] = useState(true);
  const [showLow, setShowLow] = useState(true);
  const [showRescuers, setShowRescuers] = useState(true);
  const [showHospitals, setShowHospitals] = useState(true);
  const [showHotspots, setShowHotspots] = useState(true);
  const [showRoutes, setShowRoutes] = useState(true);
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);
  
  // Select All / Deselect All functionality
  const allFiltersActive = showCritical && showHigh && showMedium && showLow && 
                           showRescuers && showHospitals && showHotspots && showRoutes;
  
  const toggleAllFilters = () => {
    const newState = !allFiltersActive;
    setShowCritical(newState);
    setShowHigh(newState);
    setShowMedium(newState);
    setShowLow(newState);
    setShowRescuers(newState);
    setShowHospitals(newState);
    setShowHotspots(newState);
    setShowRoutes(newState);
  };
  
  const { location, error: locationError, requestLocation } = useUserLocation();
  
  // Fetch all active rescues using GraphQL hooks
  const { data, loading, error, refetch } = useActiveRescuesQuery({
    variables: {
      pagination: { limit: 200, page: 1 },
    },
    pollInterval: 30000, // Refresh every 30 seconds
    fetchPolicy: 'cache-and-network',
  });

  const rescues = data?.activeRescues?.edges?.map(edge => edge.node) || [];
  
  // Fetch ALL hospitals across Nepal using the hospitals query (no GPS required!)
  const { data: hospitalsData, loading: hospitalsLoading, error: hospitalsError } = useHospitals(
    { status: 'ACTIVE' }, // Only active hospitals
    { first: 100 } // Get first 100 hospitals (all of them)
  );

  const hospitals = (hospitalsData as { hospitals?: { edges?: Array<{ node: any }> } })?.hospitals?.edges?.map(edge => edge.node) || [];
  
  // Debug logging
  console.log(`[Admin Map] Hospital Query Status:`, {
    loading: hospitalsLoading,
    error: hospitalsError?.message,
    data: hospitalsData,
    hospitalsCount: hospitals.length,
  });
  
  if (hospitalsError) {
    console.error('[Admin Map] Hospital query error:', hospitalsError);
    toast.error(`Failed to load hospitals: ${hospitalsError.message}`);
  }
  
  console.log(`[Admin Map] Loaded ${hospitals.length} hospitals across Nepal`);

  // Fetch ALL volunteers/rescuers for live field view
  const { data: volunteersData } = useVolunteersQuery({
    variables: {
      pagination: { limit: 200, page: 1 },
      filter: {
        status: 'APPROVED', // Only show approved volunteers
        isAvailableNow: true, // Only show available rescuers
      },
    },
    pollInterval: 30000, // Refresh every 30 seconds
    fetchPolicy: 'cache-and-network',
  });

  const allVolunteers = volunteersData?.volunteers?.edges?.map(edge => edge.node) || [];
  
  console.log(`[Admin Map] Loaded ${allVolunteers.length} active volunteers`);
  
  // Fetch research-based snakebite hotspots
  const { data: hotspotsData, loading: hotspotsLoading, error: hotspotsError } = useSnakebiteHotspots();
  
  const hotspots = hotspotsData?.snakebiteHotspots || [];
  
  console.log(`[Admin Map] Loaded ${hotspots.length} research hotspots`, {
    loading: hotspotsLoading,
    error: hotspotsError?.message,
    hotspots: hotspots.map(h => ({ district: h.district, riskLevel: h.riskLevel })),
  });
  
  if (hotspotsError) {
    console.error('[Admin Map] Hotspot query error:', hotspotsError);
  }
  
  // Show ALL available volunteers on the map (not just assigned to active rescues)
  // This provides a "live field view" of all active rescuers across Nepal
  const getMockLocationForMunicipality = (municipality: string): { lat: number; lng: number } => {
    const locations: Record<string, { lat: number; lng: number }> = {
      // Kathmandu Valley
      'Kathmandu': { lat: 27.7172, lng: 85.3240 },
      'Lalitpur': { lat: 27.6694, lng: 85.3264 },
      'Bhaktapur': { lat: 27.6710, lng: 85.4298 },
      
      // Bagmati Province
      'Hetauda': { lat: 27.4287, lng: 85.0327 },
      'Bharatpur': { lat: 27.6768, lng: 84.4347 },
      'Dhading': { lat: 27.8565, lng: 84.9056 },
      'Chitwan': { lat: 27.5291, lng: 84.3542 },
      'Dhulikhel': { lat: 27.6200, lng: 85.5450 },
      'Panauti': { lat: 27.5858, lng: 85.5172 },
      
      // Koshi Province
      'Biratnagar': { lat: 26.4525, lng: 87.2718 },
      'Dharan': { lat: 26.8090, lng: 87.2804 },
      'Itahari': { lat: 26.6647, lng: 87.2723 },
      'Dhankuta': { lat: 26.9833, lng: 87.3333 },
      'Ilam': { lat: 26.9100, lng: 87.9250 },
      'Damak': { lat: 26.6593, lng: 87.7010 },
      
      // Madhesh Province
      'Janakpur': { lat: 26.7271, lng: 85.9239 },
      'Birgunj': { lat: 27.0104, lng: 84.8767 },
      'Jaleshwar': { lat: 26.6476, lng: 85.7982 },
      'Rajbiraj': { lat: 26.5400, lng: 86.7460 },
      'Lahan': { lat: 26.7200, lng: 86.4800 },
      
      // Gandaki Province
      'Pokhara': { lat: 28.2096, lng: 83.9856 },
      'Gorkha': { lat: 28.0000, lng: 84.6333 },
      'Besisahar': { lat: 28.2305, lng: 84.4213 },
      'Baglung': { lat: 28.2717, lng: 83.5903 },
      'Beni': { lat: 28.3500, lng: 83.5667 },
      
      // Lumbini Province
      'Butwal': { lat: 27.7000, lng: 83.4500 },
      'Siddharthanagar': { lat: 27.5051, lng: 83.4533 },
      'Tansen': { lat: 27.8667, lng: 83.5500 },
      'Kapilvastu': { lat: 27.5803, lng: 82.9775 },
      'Nawalparasi': { lat: 27.6200, lng: 83.9200 },
      
      // Karnali Province
      'Surkhet': { lat: 28.6000, lng: 81.6167 },
      'Jumla': { lat: 29.2747, lng: 82.1838 },
      'Dailekh': { lat: 28.8500, lng: 81.7167 },
      'Nepalgunj': { lat: 28.0500, lng: 81.6167 },
      
      // Sudurpaschim Province
      'Dhangadhi': { lat: 28.6939, lng: 80.5976 },
      'Mahendranagar': { lat: 28.9657, lng: 80.1794 },
      'Dadeldhura': { lat: 29.3000, lng: 80.5833 },
      'Dipayal': { lat: 29.2667, lng: 80.9333 },
    };

    // Default to Kathmandu if municipality not found
    return locations[municipality] || { lat: 27.7172, lng: 85.3240 };
  };

  const allRescuers = allVolunteers.map((volunteer: any) => ({
    id: volunteer.id,
    name: volunteer.user?.name || 'Volunteer',
    ...getMockLocationForMunicipality(volunteer.municipality || 'Kathmandu'),
    phone: volunteer.user?.phone || '+977-9800000000',
    status: volunteer.isAvailableNow ? 'AVAILABLE' : 'BUSY',
    experience: volunteer.experience,
    totalRescues: volunteer.totalRescues || 0,
    municipality: volunteer.municipality,
  }));

  // Also include rescuers actively working on rescues
  const activeRescuers = rescues
    .filter((r: any) => r.assignedVolunteer && r.status === 'IN_PROGRESS')
    .map((r: any) => ({
      id: `active-${r.assignedVolunteer?.id}`,
      name: r.assignedVolunteer?.user?.name || 'Active Rescuer',
      lat: r.lat || 0,
      lng: r.lng ? r.lng + 0.002 : 0.002,
      phone: r.assignedVolunteer?.contact || r.phone,
      status: 'En Route',
    }));

  // Combine all rescuers (deduplicate by ID)
  const mockRescuers = [
    ...allRescuers,
    ...activeRescuers.filter(ar => !allRescuers.find(r => r.id === ar.id.replace('active-', ''))),
  ];

  console.log(`[Admin Map] Showing ${mockRescuers.length} rescuers on map`);
  
  // Show error toast
  if (error) {
    toast.error(`Failed to load rescues: ${error.message}`);
  }

  // Calculate statistics
  const stats = {
    total: rescues.length,
    critical: rescues.filter((r: any) => r.priority === 'CRITICAL').length,
    pending: rescues.filter((r: any) => r.status === 'PENDING').length,
    inProgress: rescues.filter((r: any) => r.status === 'IN_PROGRESS').length,
    assigned: rescues.filter((r: any) => r.status === 'ASSIGNED').length,
    hospitals: hospitals.length,
    rescuers: mockRescuers.length,
    hotspots: hotspots.length,
  };

  console.log('[Admin Map Stats]', {
    rescues: stats.total,
    hospitals: stats.hospitals,
    rescuers: stats.rescuers,
    hotspots: stats.hotspots,
  });

  const handleRescueClick = (rescueId: string) => {
    setSelectedRescueId(rescueId);
  };
  
  // Filter rescues based on selected filters
  const filteredRescues = rescues.filter((r: any) => {
    const priority = r.priority?.toUpperCase();
    if (priority === 'CRITICAL' && !showCritical) return false;
    if (priority === 'HIGH' && !showHigh) return false;
    if (priority === 'MEDIUM' && !showMedium) return false;
    if (priority === 'LOW' && !showLow) return false;
    return true;
  });
  
  // Calculate map center and zoom based on visible data
  const getMapCenter = (): [number, number] => {
    // If no data, show all of Nepal
    if (filteredRescues.length === 0) {
      return [28.3949, 84.1240]; // Nepal center
    }
    
    // Calculate center of all visible rescues
    const validRescues = filteredRescues.filter((r: any) => r.lat && r.lng);
    if (validRescues.length === 0) {
      return [28.3949, 84.1240];
    }
    
    const avgLat = validRescues.reduce((sum: number, r: any) => sum + r.lat, 0) / validRescues.length;
    const avgLng = validRescues.reduce((sum: number, r: any) => sum + r.lng, 0) / validRescues.length;
    return [avgLat, avgLng];
  };
  
  const mapCenter = getMapCenter();
  const mapZoom = filteredRescues.length > 0 ? 9 : 7;
  
  // Calculate active routes count
  const activeRoutesCount = rescues.filter((r: any) => 
    r.status === 'IN_PROGRESS' || r.status === 'ASSIGNED'
  ).length;

  return (
    <div className="min-h-screen flex flex-col p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Rescue Operations Map</h1>
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
              <p className="text-xs text-muted-foreground uppercase">Total Active</p>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            </div>
            <MapPin className="h-8 w-8 text-primary" />
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-sm border border-destructive/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase">Critical</p>
              <p className="text-2xl font-bold text-destructive">{stats.critical}</p>
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
              <p className="text-xs text-muted-foreground uppercase">Assigned</p>
              <p className="text-2xl font-bold text-info">{stats.assigned}</p>
            </div>
            <Users className="h-8 w-8 text-info" />
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-sm border border-primary/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase">In Progress</p>
              <p className="text-2xl font-bold text-primary">{stats.inProgress}</p>
            </div>
            <MapPin className="h-8 w-8 text-primary" />
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-sm border border-success/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase">Hospitals</p>
              <p className="text-2xl font-bold text-success">{stats.hospitals}</p>
            </div>
            <div className="text-2xl">🏥</div>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-sm border border-success/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase">Rescuers</p>
              <p className="text-2xl font-bold text-success">{stats.rescuers}</p>
            </div>
            <div className="text-2xl">🧑‍🚒</div>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-sm border border-destructive/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase">Hotspots</p>
              <p className="text-2xl font-bold text-destructive">{stats.hotspots}</p>
            </div>
            <div className="text-2xl">🔥</div>
          </div>
        </div>
      </div>

      {/* Map Filters (Dropdown Style) */}
      <div className="bg-card rounded-lg shadow-sm border border-border p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">Map Filters</h3>
          <button
            onClick={toggleAllFilters}
            className="text-xs px-3 py-1 rounded-md border-2 border-input hover:border-primary hover:bg-accent transition-colors"
          >
            {allFiltersActive ? '✓ Deselect All' : 'Select All'}
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {/* Priority Filters Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsPriorityDropdownOpen(!isPriorityDropdownOpen)}
              className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg border-2 border-input bg-surface-elevated hover:border-primary transition-colors text-left"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">🐍 Priority</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {[showCritical, showHigh, showMedium, showLow].filter(Boolean).length}/4
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
                  <div className="w-5 h-5 rounded-full bg-destructive flex items-center justify-center text-xs">🐍</div>
                  <span className="text-sm text-foreground">Critical</span>
                </label>
                
                <label className="flex items-center gap-2 p-2 hover:bg-warning/10 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showHigh}
                    onChange={(e) => setShowHigh(e.target.checked)}
                    className="w-4 h-4 accent-warning rounded"
                  />
                  <div className="w-5 h-5 rounded-full bg-warning flex items-center justify-center text-xs">🐍</div>
                  <span className="text-sm text-foreground">High</span>
                </label>
                
                <label className="flex items-center gap-2 p-2 hover:bg-warning/10 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showMedium}
                    onChange={(e) => setShowMedium(e.target.checked)}
                    className="w-4 h-4 accent-warning rounded"
                  />
                  <div className="w-5 h-5 rounded-full bg-warning flex items-center justify-center text-xs">🐍</div>
                  <span className="text-sm text-foreground">Medium</span>
                </label>
                
                <label className="flex items-center gap-2 p-2 hover:bg-success/10 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showLow}
                    onChange={(e) => setShowLow(e.target.checked)}
                    className="w-4 h-4 accent-success rounded"
                  />
                  <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center text-xs">🐍</div>
                  <span className="text-sm text-foreground">Low</span>
                </label>
              </div>
            )}
          </div>

          {/* Rescuers Toggle */}
          <label className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg border-2 border-input bg-surface-elevated hover:border-success transition-colors cursor-pointer">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center text-xs">👨‍⚕️</div>
              <span className="text-sm font-medium text-foreground">Rescuers</span>
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
              <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center text-xs">🏥</div>
              <span className="text-sm font-medium text-foreground">Hospitals</span>
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
              <div className="w-5 h-5 rounded-full bg-destructive/20 border-2 border-destructive flex items-center justify-center text-xs">🔥</div>
              <span className="text-sm font-medium text-foreground">Hotspots</span>
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
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} strokeDasharray="4 4" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              <span className="text-sm font-medium text-foreground">Routes</span>
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

          {/* Your Location Indicator */}
          {location && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-info/40 bg-info/10">
              <div className="w-4 h-4 rounded-full bg-info border-2 border-card shadow"></div>
              <span className="text-sm font-medium text-info">Your Location</span>
            </div>
          )}
        </div>
      </div>

      {/* Map Container */}
      <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden" style={{ height: '600px' }}>
        <div className="h-full w-full">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading rescues...</p>
              </div>
            </div>
          ) : error ? (
            <div className="h-full flex items-center justify-center">
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
              rescues={filteredRescues.map((r: any) => ({
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
              rescuers={showRescuers ? mockRescuers : []}
              hospitals={showHospitals ? hospitals.map((h: any) => ({
                id: h.id,
                name: h.name,
                latitude: h.latitude,
                longitude: h.longitude,
                address: h.address,
                municipality: h.municipality,
                district: h.district,
                phone: h.phone,
                emergencyPhone: h.emergencyPhone,
                antivenomStatus: h.antivenomStatus,
                emergency24x7: h.emergency24x7,
                snakebiteTreatmentAvailable: h.snakebiteTreatmentAvailable,
                ventilatorAvailable: h.ventilatorAvailable,
              })) : []}
              hotspots={showHotspots ? hotspots.map((h: any) => ({
                id: h.id,
                name: h.name,
                district: h.district,
                province: h.province,
                riskLevel: h.riskLevel,
                riskScore: h.riskScore,
                source: h.source,
                sourceUrl: h.sourceUrl,
                studyYear: h.studyYear,
                populationAtRisk: h.populationAtRisk,
              })) : []}
              userLocation={location}
              selectedRescueId={selectedRescueId}
              onRescueClick={handleRescueClick}
              center={mapCenter}
              zoom={mapZoom}
              showRoutes={showRoutes}
            />
          )}
        </div>
      </div>

      {/* Location Error Alert */}
      {locationError && (
        <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">Location Access Required</p>
            <p className="text-xs text-muted-foreground mt-1">
              Enable location permissions to see distances and your position on the map.
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
