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
import { MapPin, Users, AlertCircle, RefreshCw, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Dynamic import to avoid SSR issues
const RescueMap = dynamic(
  () => import('@/components/map/RescueMap').then(mod => ({ default: mod.RescueMap })),
  { 
    ssr: false,
    loading: () => (
      <div className="h-[calc(100vh-200px)] flex items-center justify-center bg-slate-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600">Loading map...</p>
        </div>
      </div>
    ),
  }
);

export default function AdminMapPage() {
  const [selectedRescueId, setSelectedRescueId] = useState<string | null>(null);
  
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
  };

  // Mock rescuer data (replace with actual query)
  const mockRescuers = rescues
    .filter((r: any) => r.assignedVolunteer && r.status === 'IN_PROGRESS')
    .map((r: any) => ({
      id: r.assignedVolunteer?.id || '',
      name: r.assignedVolunteer?.user?.name || 'Active Rescuer',
      lat: r.lat || 0,
      lng: r.lng ? r.lng + 0.002 : 0.002, // Offset slightly for visibility
      phone: r.assignedVolunteer?.contact || r.phone, // Use 'contact' field
      status: 'En Route',
    }));

  const handleRescueClick = (rescueId: string) => {
    setSelectedRescueId(rescueId);
  };

  const handleRefresh = () => {
    refetch();
    requestLocation();
  };

  return (
    <div className="min-h-screen flex flex-col p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Rescue Operations Map</h1>
          <p className="text-sm text-slate-600 mt-1">
            Real-time tracking of all rescue operations
          </p>
        </div>
        
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Statistics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-600 uppercase">Total Active</p>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            </div>
            <MapPin className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-red-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-600 uppercase">Critical</p>
              <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-yellow-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-600 uppercase">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <Filter className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-600 uppercase">Assigned</p>
              <p className="text-2xl font-bold text-blue-600">{stats.assigned}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-purple-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-600 uppercase">In Progress</p>
              <p className="text-2xl font-bold text-purple-600">{stats.inProgress}</p>
            </div>
            <MapPin className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden" style={{ height: '600px' }}>
        <div className="h-full w-full">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-slate-600">Loading rescues...</p>
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
              userLocation={location}
              selectedRescueId={selectedRescueId}
              onRescueClick={handleRescueClick}
              zoom={12}
            />
          )}
        </div>
      </div>

      {/* Map Legend */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Map Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center text-white border-2 border-white shadow">🐍</div>
            <span className="text-slate-600">Critical</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-orange-600 flex items-center justify-center text-white border-2 border-white shadow">🐍</div>
            <span className="text-slate-600">High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-yellow-600 flex items-center justify-center text-white border-2 border-white shadow">🐍</div>
            <span className="text-slate-600">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-green-600 flex items-center justify-center text-white border-2 border-white shadow">🐍</div>
            <span className="text-slate-600">Low</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center border-2 border-white shadow">👨‍⚕️</div>
            <span className="text-slate-600">Rescuer</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow"></div>
            <span className="text-slate-600">Your Location</span>
          </div>
        </div>
      </div>

      {/* Location Error Alert */}
      {locationError && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-yellow-900">Location Access Required</p>
            <p className="text-xs text-yellow-700 mt-1">
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
