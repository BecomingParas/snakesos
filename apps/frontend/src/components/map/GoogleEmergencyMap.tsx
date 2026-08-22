/**
 * Google Maps Emergency Map Component
 * Replaces Leaflet with Google Maps for better reliability
 * Shows: Incident location (🐍), Rescuers (🧑‍🚒), Hospitals (🏥), Routes
 */

'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, Polyline } from '@react-google-maps/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, AlertTriangle, MapIcon, Navigation } from 'lucide-react';
import { formatDistance, calculateDistance } from '@/lib/map/distance';
import { isValidCoordinate } from '@/lib/map/coordinates';
import type { HospitalLocation } from './HospitalMap';
import type { Route as RouteData } from '@/lib/map/routing.types';

// ==================== TYPES ====================

export interface IncidentLocation {
  id: string;
  latitude: number;
  longitude: number;
  address: string;
  snakeSpecies?: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED';
  reportedAt: string;
  notes?: string;
}

export interface RescuerLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  phone?: string;
  status: 'AVAILABLE' | 'EN_ROUTE' | 'ON_SITE' | 'UNAVAILABLE';
  experience: 'BEGINNER' | 'INTERMEDIATE' | 'EXPERT';
  distance?: number;
  eta?: string;
}

export interface GoogleEmergencyMapProps {
  // Markers
  incident?: IncidentLocation;
  rescuers?: RescuerLocation[];
  hospitals?: HospitalLocation[];
  
  // Route
  route?: RouteData;
  showRoute?: boolean;
  
  // Map settings
  center?: { lat: number; lng: number };
  zoom?: number;
  
  // Callbacks
  onIncidentClick?: () => void;
  onRescuerClick?: (rescuerId: string) => void;
  onHospitalClick?: (hospitalId: string) => void;
  
  // Display options
  showRescuers?: boolean;
  showHospitals?: boolean;
  emergencyMode?: boolean;
  
  // Google Maps API Key
  googleMapsApiKey?: string;
}

// ==================== CONSTANTS ====================

const DEFAULT_CENTER = { lat: 27.7172, lng: 85.3240 }; // Kathmandu, Nepal
const DEFAULT_ZOOM = 8;

// Nepal bounds for auto-centering
const NEPAL_BOUNDS = {
  north: 30.4,
  south: 26.3,
  east: 88.2,
  west: 80.0,
};

// Map container style
const mapContainerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '500px',
};

// ==================== HELPER FUNCTIONS ====================

function getPriorityColor(priority: IncidentLocation['priority']): string {
  switch (priority) {
    case 'CRITICAL':
      return '#dc2626'; // red-600
    case 'HIGH':
      return '#ea580c'; // orange-600
    case 'MEDIUM':
      return '#ca8a04'; // yellow-600
    case 'LOW':
      return '#16a34a'; // green-600
    default:
      return '#6b7280'; // gray-500
  }
}

function getRescuerStatusColor(status: RescuerLocation['status']): string {
  switch (status) {
    case 'AVAILABLE':
      return '#16a34a'; // green-600
    case 'EN_ROUTE':
      return '#2563eb'; // blue-600
    case 'ON_SITE':
      return '#9333ea'; // purple-600
    case 'UNAVAILABLE':
      return '#6b7280'; // gray-500
    default:
      return '#6b7280';
  }
}

function getHospitalMarkerColor(hospital: HospitalLocation): string {
  // Prioritize by antivenom availability
  if (hospital.antivenomStatus === 'AVAILABLE') {
    return '#059669'; // emerald-600
  }
  if (hospital.emergency24x7) {
    return '#0891b2'; // cyan-600
  }
  return '#ea580c'; // orange-600
}

// ==================== MAIN COMPONENT ====================

export function GoogleEmergencyMap({
  incident,
  rescuers = [],
  hospitals = [],
  route,
  showRoute = false,
  center,
  zoom = DEFAULT_ZOOM,
  onIncidentClick,
  onRescuerClick,
  onHospitalClick,
  showRescuers = true,
  showHospitals = true,
  emergencyMode = false,
  googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
}: GoogleEmergencyMapProps) {
  const [selectedMarker, setSelectedMarker] = useState<{ type: string; id: string } | null>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Calculate map center and bounds
  const mapCenter = useMemo(() => {
    if (center) return center;
    if (incident && isValidCoordinate(incident.latitude, incident.longitude)) {
      return { lat: incident.latitude, lng: incident.longitude };
    }
    return DEFAULT_CENTER;
  }, [center, incident]);

  // Calculate hospitals with distance from incident
  const hospitalsWithDistance = useMemo(() => {
    if (!incident || !isValidCoordinate(incident.latitude, incident.longitude)) {
      return hospitals;
    }

    return hospitals
      .map(hospital => ({
        ...hospital,
        distance: isValidCoordinate(hospital.latitude, hospital.longitude)
          ? calculateDistance(incident.latitude, incident.longitude, hospital.latitude, hospital.longitude)
          : undefined,
      }))
      .sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
  }, [incident, hospitals]);

  // Fit bounds to show all markers
  useEffect(() => {
    if (!mapInstance) return;

    const bounds = new google.maps.LatLngBounds();
    let hasValidBounds = false;

    // Add incident
    if (incident && isValidCoordinate(incident.latitude, incident.longitude)) {
      bounds.extend({ lat: incident.latitude, lng: incident.longitude });
      hasValidBounds = true;
    }

    // Add rescuers
    if (showRescuers) {
      rescuers.forEach(rescuer => {
        if (isValidCoordinate(rescuer.latitude, rescuer.longitude)) {
          bounds.extend({ lat: rescuer.latitude, lng: rescuer.longitude });
          hasValidBounds = true;
        }
      });
    }

    // Add hospitals
    if (showHospitals) {
      hospitalsWithDistance.forEach(hospital => {
        if (isValidCoordinate(hospital.latitude, hospital.longitude)) {
          bounds.extend({ lat: hospital.latitude, lng: hospital.longitude });
          hasValidBounds = true;
        }
      });
    }

    if (hasValidBounds) {
      mapInstance.fitBounds(bounds);
    }
  }, [mapInstance, incident, rescuers, hospitalsWithDistance, showRescuers, showHospitals]);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMapInstance(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMapInstance(null);
  }, []);

  // Simpler marker icons that don't require google.maps to be loaded
  const getIncidentIcon = useCallback((priority: string) => {
    if (!isLoaded || typeof google === 'undefined') return undefined;
    
    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="18" fill="${getPriorityColor(priority as any)}" stroke="white" stroke-width="2"/>
          <text x="20" y="27" font-size="20" text-anchor="middle" fill="white">🐍</text>
        </svg>
      `)}`,
      scaledSize: new google.maps.Size(40, 40),
      anchor: new google.maps.Point(20, 20),
    };
  }, [isLoaded]);

  const getRescuerIcon = useCallback((status: string) => {
    if (!isLoaded || typeof google === 'undefined') return undefined;
    
    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="16" fill="${getRescuerStatusColor(status as any)}" stroke="white" stroke-width="2"/>
          <text x="18" y="24" font-size="18" text-anchor="middle" fill="white">🧑‍🚒</text>
        </svg>
      `)}`,
      scaledSize: new google.maps.Size(36, 36),
      anchor: new google.maps.Point(18, 18),
    };
  }, [isLoaded]);

  const getHospitalIcon = useCallback((hospital: HospitalLocation) => {
    if (!isLoaded || typeof google === 'undefined') return undefined;
    
    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="16" fill="${getHospitalMarkerColor(hospital)}" stroke="white" stroke-width="2"/>
          <text x="18" y="24" font-size="18" text-anchor="middle" fill="white">🏥</text>
        </svg>
      `)}`,
      scaledSize: new google.maps.Size(36, 36),
      anchor: new google.maps.Point(18, 18),
    };
  }, [isLoaded]);

  if (!googleMapsApiKey) {
    return (
      <div className="w-full h-full min-h-[500px] bg-gray-100 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Google Maps API Key Required</h3>
          <p className="text-gray-600 mb-4">
            Please add your Google Maps API key to your environment variables:
          </p>
          <code className="block bg-gray-100 p-2 rounded text-sm mb-4">
            NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
          </code>
          <a
            href="https://console.cloud.google.com/google/maps-apis"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Get your API key →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <LoadScript 
        googleMapsApiKey={googleMapsApiKey}
        onLoad={() => setIsLoaded(true)}
        onError={() => console.error('Error loading Google Maps')}
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={mapCenter}
          zoom={zoom}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            restriction: {
              latLngBounds: NEPAL_BOUNDS,
              strictBounds: false,
            },
            mapTypeControl: true,
            streetViewControl: false,
            fullscreenControl: true,
            zoomControl: true,
          }}
        >
          {/* Incident Marker */}
          {incident && isValidCoordinate(incident.latitude, incident.longitude) && (
            <Marker
              position={{ lat: incident.latitude, lng: incident.longitude }}
              icon={getIncidentIcon(incident.priority)}
              onClick={() => {
                setSelectedMarker({ type: 'incident', id: incident.id });
                onIncidentClick?.();
              }}
            />
          )}

          {/* Rescuer Markers */}
          {showRescuers && rescuers.map((rescuer) => {
            if (!isValidCoordinate(rescuer.latitude, rescuer.longitude)) return null;

            return (
              <Marker
                key={`rescuer-${rescuer.id}`}
                position={{ lat: rescuer.latitude, lng: rescuer.longitude }}
                icon={getRescuerIcon(rescuer.status)}
                onClick={() => {
                  setSelectedMarker({ type: 'rescuer', id: rescuer.id });
                  onRescuerClick?.(rescuer.id);
                }}
              />
            );
          })}

          {/* Hospital Markers */}
          {showHospitals && hospitalsWithDistance.map((hospital) => {
            if (!isValidCoordinate(hospital.latitude, hospital.longitude)) {
              console.warn(`Invalid coordinates for hospital ${hospital.name}:`, hospital.latitude, hospital.longitude);
              return null;
            }

            return (
              <Marker
                key={`hospital-${hospital.id}`}
                position={{ lat: hospital.latitude, lng: hospital.longitude }}
                icon={getHospitalIcon(hospital)}
                onClick={() => {
                  setSelectedMarker({ type: 'hospital', id: hospital.id });
                  onHospitalClick?.(hospital.id);
                }}
              />
            );
          })}

          {/* Route Polyline */}
          {showRoute && route && (route as any).geometry && (
            <Polyline
              path={(route as any).geometry.map((point: number[]) => ({ lat: point[0], lng: point[1] }))}
              options={{
                strokeColor: emergencyMode ? '#dc2626' : '#2563eb',
                strokeWeight: 4,
                strokeOpacity: 0.8,
              }}
            />
          )}
        </GoogleMap>
      </LoadScript>

      {/* Emergency Mode Indicator */}
      {emergencyMode && (
        <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-semibold">EMERGENCY MODE</span>
        </div>
      )}
    </div>
  );
}
