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
import { MapPin, Phone, AlertCircle, RefreshCw, Clock, Navigation2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistance, calculateDistance, estimateTravelTime } from '@/lib/map/distance';
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

export default function CitizenMapPage() {
  const [selectedRescueId, setSelectedRescueId] = useState<string | null>(null);
  
  // Use watch location for real-time updates
  const { location, error: locationError, requestLocation } = useWatchUserLocation();
  
  // Fetch user's own rescue requests using GraphQL hooks
  const { data, loading, error, refetch } = useMyRescueRequestsQuery({
    variables: {
      filter: { 
        statuses: ['PENDING', 'ASSIGNED', 'ACCEPTED', 'IN_PROGRESS']
      },
      pagination: { limit: 20, page: 1 },
    },
    pollInterval: 10000, // Refresh every 10 seconds for real-time tracking
    fetchPolicy: 'cache-and-network',
  });

  const rescues = data?.myRescueRequests?.edges?.map(edge => edge.node) || [];
  
  // Fetch nearby hospitals using GraphQL hooks
  const { data: hospitalsData } = useNearbyHospitals(
    location?.latitude,
    location?.longitude,
    {
      radiusKm: 30,
      antivenomRequired: false,
      limit: 10,
      skip: !location, // Only fetch when we have location
    }
  );

  const nearbyHospitals = hospitalsData?.nearbyHospitals || [];
  
  // Show error toast
  if (error) {
    toast.error(`Failed to load rescues: ${error.message}`);
  }

  // Mock rescuer location (replace with actual GraphQL query for assigned rescuer)
  const activeRescue = rescues.find((r: any) => r.status === 'IN_PROGRESS' || r.status === 'ASSIGNED');
  const mockRescuers = activeRescue && activeRescue.assignedVolunteer
    ? [{
        id: activeRescue.assignedVolunteer?.id || '',
        name: activeRescue.assignedVolunteer?.name || 'Assigned Rescuer',
        lat: activeRescue.lat ? activeRescue.lat + 0.003 : 0, // Mock location near rescue
        lng: activeRescue.lng ? activeRescue.lng + 0.003 : 0,
        phone: activeRescue.assignedVolunteer?.contact || '+977-9800000000', // Use 'contact' field
        status: 'En Route',
      }]
    : [];

  // Calculate rescuer distance if active rescue exists
  const rescuerDistance = activeRescue && mockRescuers[0] && activeRescue.lat && activeRescue.lng
    ? calculateDistance(
        mockRescuers[0].lat,
        mockRescuers[0].lng,
        activeRescue.lat,
        activeRescue.lng
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
          <h1 className="text-2xl font-bold text-slate-900">Track My Rescue</h1>
          <p className="text-sm text-slate-600 mt-1">
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
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Navigation2 className="h-5 w-5 text-blue-600" />
                <h3 className="text-sm font-bold text-blue-900">
                  {activeRescue.status === 'IN_PROGRESS' ? 'Rescuer En Route!' : 'Rescue Assigned'}
                </h3>
              </div>
              
              <div className="space-y-1 text-sm">
                <p className="text-blue-800">
                  <strong>Location:</strong> {activeRescue.address}
                </p>
                <p className="text-blue-700">
                  <strong>Status:</strong>{' '}
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    activeRescue.status === 'IN_PROGRESS'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {activeRescue.status === 'IN_PROGRESS' ? 'In Progress' : 'Assigned'}
                  </span>
                </p>
                
                {rescuerDistance !== null && (
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-blue-200">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      <span className="font-semibold text-blue-900">
                        {formatDistance(rescuerDistance)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="text-blue-700">
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
                className="bg-blue-600 hover:bg-blue-700"
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
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-600 uppercase">My Requests</p>
              <p className="text-2xl font-bold text-slate-900">{rescues.length}</p>
            </div>
            <MapPin className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-yellow-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-600 uppercase">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {rescues.filter((r: any) => r.status === 'PENDING').length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-600 uppercase">Assigned</p>
              <p className="text-2xl font-bold text-blue-600">
                {rescues.filter((r: any) => r.status === 'ASSIGNED').length}
              </p>
            </div>
            <Navigation2 className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-purple-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-600 uppercase">Active</p>
              <p className="text-2xl font-bold text-purple-600">
                {rescues.filter((r: any) => r.status === 'IN_PROGRESS').length}
              </p>
            </div>
            <MapPin className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Main Content - Split Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Rescue List */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-slate-200 p-4 overflow-auto">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">My Rescue Requests</h3>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin h-6 w-6 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-sm text-slate-600">Loading...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <p className="text-sm text-red-600">Failed to load requests</p>
            </div>
          ) : rescues.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-600">No active requests</p>
              <p className="text-xs text-slate-500 mt-1">Create a rescue request to see it here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {rescues.map((rescue: any) => {
                const isSelected = selectedRescueId === rescue.id;
                const isActive = rescue.status === 'IN_PROGRESS' || rescue.status === 'ASSIGNED';

                return (
                  <div
                    key={rescue.id}
                    className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
                      isSelected 
                        ? 'ring-2 ring-blue-500 border-blue-300 bg-blue-50' 
                        : isActive
                        ? 'border-blue-300 bg-blue-50'
                        : 'border-slate-300 bg-white hover:border-slate-400'
                    }`}
                    onClick={() => handleRescueClick(rescue.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900">
                          {rescue.address?.substring(0, 40)}...
                        </p>
                        <p className="text-xs text-slate-600 mt-0.5">
                          {rescue.municipality}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        rescue.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : rescue.status === 'ASSIGNED'
                          ? 'bg-blue-100 text-blue-800'
                          : rescue.status === 'IN_PROGRESS'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {rescue.status === 'PENDING' ? 'Waiting' : 
                         rescue.status === 'ASSIGNED' ? 'Assigned' :
                         rescue.status === 'IN_PROGRESS' ? 'Active' : rescue.status}
                      </span>
                      
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        rescue.priority === 'CRITICAL'
                          ? 'bg-red-100 text-red-800'
                          : rescue.priority === 'HIGH'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}>
                        {rescue.priority}
                      </span>
                    </div>

                    {rescue.snakeDescription && (
                      <p className="text-xs text-slate-600 mt-2">
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
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden" style={{ height: '600px' }}>
          <div className="h-full w-full">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-slate-600">Loading map...</p>
                </div>
              </div>
            ) : error ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-red-600">
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
              />
            )}
          </div>
        </div>
      </div>

      {/* Map Legend */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Map Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white border-2 border-white shadow">🐍</div>
            <span className="text-slate-600">My Request</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center border-2 border-white shadow">👨‍⚕️</div>
            <span className="text-slate-600">Rescuer</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center border-2 border-white shadow text-xs">🏥</div>
            <span className="text-slate-600">Hospital (Antivenom)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-yellow-600 flex items-center justify-center border-2 border-white shadow text-xs">🏥</div>
            <span className="text-slate-600">Hospital (Unknown)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow"></div>
            <span className="text-slate-600">Your Location</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            <span className="text-slate-600">Distance</span>
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
