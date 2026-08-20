/**
 * Emergency Map Component
 * Comprehensive map for snake rescue emergencies
 * Shows: Incident location (🐍), Rescuers (🧑‍🚒), Hospitals (🏥), Routes
 */

'use client';

import { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { formatDistance, calculateDistance, estimateTravelTime } from '@/lib/map/distance';
import { isValidCoordinate } from '@/lib/map/coordinates';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, AlertTriangle, MapIcon } from 'lucide-react';
import type { HospitalLocation } from './HospitalMap';
import type { Route as RouteData } from '@/lib/map/routing.types';

// Fix for default marker icons
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
}

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

export interface EmergencyMapProps {
  // Markers
  incident?: IncidentLocation;
  rescuers?: RescuerLocation[];
  hospitals?: HospitalLocation[];
  
  // Route
  route?: RouteData;
  showRoute?: boolean;
  
  // Map settings
  center?: [number, number];
  zoom?: number;
  
  // Callbacks
  onIncidentClick?: () => void;
  onRescuerClick?: (rescuerId: string) => void;
  onHospitalClick?: (hospitalId: string) => void;
  
  // Display options
  showRescuers?: boolean;
  showHospitals?: boolean;
  emergencyMode?: boolean;
}

// ==================== HELPER FUNCTIONS ====================

function getIncidentMarkerColor(priority: IncidentLocation['priority']): string {
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

function getRescuerMarkerColor(status: RescuerLocation['status']): string {
  switch (status) {
    case 'AVAILABLE':
      return '#16a34a'; // green-600
    case 'EN_ROUTE':
      return '#3b82f6'; // blue-600
    case 'ON_SITE':
      return '#ca8a04'; // yellow-600
    case 'UNAVAILABLE':
      return '#6b7280'; // gray-500
    default:
      return '#6b7280';
  }
}

function getHospitalMarkerColor(hospital: HospitalLocation): string {
  if (hospital.antivenomStatus === 'OUT_OF_STOCK') {
    return '#dc2626';
  }
  if (
    hospital.antivenomStatus === 'AVAILABLE' &&
    hospital.antivenomVerificationFreshness === 'FRESH'
  ) {
    return '#16a34a';
  }
  if (
    hospital.snakebiteTreatmentAvailable &&
    (hospital.antivenomStatus === 'UNKNOWN' ||
     hospital.antivenomStatus === 'LOW_STOCK' ||
     hospital.antivenomVerificationFreshness !== 'FRESH')
  ) {
    return '#ca8a04';
  }
  return '#6b7280';
}

// Map updater component
function MapUpdater({ center, zoom, bounds }: { center?: [number, number]; zoom?: number; bounds?: L.LatLngBoundsExpression }) {
  const map = useMap();
  
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    } else if (center) {
      map.flyTo(center, zoom || map.getZoom(), {
        duration: 1.5,
        easeLinearity: 0.25,
      });
    }
  }, [center, zoom, bounds, map]);
  
  return null;
}

// ==================== MAIN COMPONENT ====================

export function EmergencyMap({
  incident,
  rescuers = [],
  hospitals = [],
  route,
  showRoute = false,
  center = [27.7172, 85.324],
  zoom = 13,
  onIncidentClick,
  onRescuerClick,
  onHospitalClick,
  showRescuers = true,
  showHospitals = true,
  emergencyMode = false,
}: EmergencyMapProps) {
  const [selectedType, setSelectedType] = useState<'incident' | 'rescuer' | 'hospital' | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Calculate map bounds to show all markers
  const mapBounds = useMemo(() => {
    const allPoints: [number, number][] = [];
    
    if (incident && isValidCoordinate(incident.latitude, incident.longitude)) {
      allPoints.push([incident.latitude, incident.longitude]);
    }
    
    if (showRescuers) {
      rescuers.forEach(rescuer => {
        if (isValidCoordinate(rescuer.latitude, rescuer.longitude)) {
          allPoints.push([rescuer.latitude, rescuer.longitude]);
        }
      });
    }
    
    if (showHospitals) {
      hospitals.forEach(hospital => {
        if (isValidCoordinate(hospital.latitude, hospital.longitude)) {
          allPoints.push([hospital.latitude, hospital.longitude]);
        }
      });
    }
    
    if (allPoints.length > 1) {
      return L.latLngBounds(allPoints);
    }
    
    return null;
  }, [incident, rescuers, hospitals, showRescuers, showHospitals]);

  // Determine initial center
  const initialCenter = useMemo(() => {
    if (incident && isValidCoordinate(incident.latitude, incident.longitude)) {
      return [incident.latitude, incident.longitude] as [number, number];
    }
    return center;
  }, [incident, center]);

  // Calculate distances from incident
  const rescuersWithDistance = useMemo(() => {
    if (!incident) return rescuers;
    
    return rescuers.map(rescuer => ({
      ...rescuer,
      distance: isValidCoordinate(rescuer.latitude, rescuer.longitude)
        ? calculateDistance(incident.latitude, incident.longitude, rescuer.latitude, rescuer.longitude)
        : undefined,
      eta: isValidCoordinate(rescuer.latitude, rescuer.longitude)
        ? estimateTravelTime(calculateDistance(incident.latitude, incident.longitude, rescuer.latitude, rescuer.longitude))
        : undefined,
    }));
  }, [incident, rescuers]);

  const hospitalsWithDistance = useMemo(() => {
    if (!incident) return hospitals;
    
    return hospitals.map(hospital => ({
      ...hospital,
      distance: isValidCoordinate(hospital.latitude, hospital.longitude)
        ? calculateDistance(incident.latitude, incident.longitude, hospital.latitude, hospital.longitude)
        : undefined,
    }));
  }, [incident, hospitals]);

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={initialCenter}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        className="z-0 rounded-lg"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        
        <MapUpdater center={mapBounds ? undefined : initialCenter} zoom={zoom} bounds={mapBounds} />

        {/* ========== INCIDENT MARKER ========== */}
        {incident && isValidCoordinate(incident.latitude, incident.longitude) && (
          <Marker
            position={[incident.latitude, incident.longitude]}
            icon={L.divIcon({
              className: 'incident-marker',
              html: `
                <div style="
                  background: ${getIncidentMarkerColor(incident.priority)};
                  width: 44px;
                  height: 44px;
                  border-radius: 50%;
                  border: 4px solid white;
                  box-shadow: 0 2px 12px rgba(0,0,0,0.5);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 22px;
                  cursor: pointer;
                  animation: pulse 2s infinite;
                ">🐍</div>
                <style>
                  @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                  }
                </style>
              `,
              iconSize: [44, 44],
              iconAnchor: [22, 22],
            })}
            eventHandlers={{
              click: () => {
                setSelectedType('incident');
                setSelectedId(incident.id);
                setIsSheetOpen(true);
                onIncidentClick?.();
              },
            }}
          >
            <Popup>
              <div className="text-sm min-w-[250px] bg-white">
                <strong className="text-red-600">🐍 Snake Emergency</strong>
                <div className="mt-2 space-y-1.5">
                  <p className="text-xs">📍 {incident.address}</p>
                  {incident.snakeSpecies && (
                    <p className="text-xs">Species: <strong>{incident.snakeSpecies}</strong></p>
                  )}
                  <Badge className="text-xs" variant={incident.priority === 'CRITICAL' ? 'destructive' : 'default'}>
                    {incident.priority} PRIORITY
                  </Badge>
                  <Badge className="text-xs ml-2" variant="outline">
                    {incident.status}
                  </Badge>
                </div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* ========== RESCUER MARKERS ========== */}
        {showRescuers && rescuersWithDistance.map((rescuer) => {
          if (!isValidCoordinate(rescuer.latitude, rescuer.longitude)) return null;
          
          const markerColor = getRescuerMarkerColor(rescuer.status);

          return (
            <Marker
              key={`rescuer-${rescuer.id}`}
              position={[rescuer.latitude, rescuer.longitude]}
              icon={L.divIcon({
                className: 'rescuer-marker',
                html: `
                  <div style="
                    background: ${markerColor};
                    width: 38px;
                    height: 38px;
                    border-radius: 50%;
                    border: 3px solid white;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.4);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                    cursor: pointer;
                  ">🧑‍🚒</div>
                `,
                iconSize: [38, 38],
                iconAnchor: [19, 19],
              })}
              eventHandlers={{
                click: () => {
                  setSelectedType('rescuer');
                  setSelectedId(rescuer.id);
                  setIsSheetOpen(true);
                  onRescuerClick?.(rescuer.id);
                },
              }}
            >
              <Popup>
                <div className="text-sm min-w-[220px] bg-white">
                  <strong className="text-slate-900">🧑‍🚒 {rescuer.name}</strong>
                  <div className="mt-2 space-y-1.5">
                    {rescuer.distance !== undefined && (
                      <p className="text-xs text-blue-600 font-semibold">
                        📍 {formatDistance(rescuer.distance)} away
                      </p>
                    )}
                    {rescuer.eta && (
                      <p className="text-xs text-slate-600">
                        ⏱️ ETA: {rescuer.eta}
                      </p>
                    )}
                    <Badge className="text-xs" variant={rescuer.status === 'AVAILABLE' ? 'default' : 'secondary'}>
                      {rescuer.status}
                    </Badge>
                    <Badge className="text-xs ml-2" variant="outline">
                      {rescuer.experience}
                    </Badge>
                    {rescuer.phone && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs h-7 w-full mt-2"
                        onClick={() => window.location.href = `tel:${rescuer.phone}`}
                      >
                        <Phone className="h-3 w-3 mr-1" />
                        Call Rescuer
                      </Button>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* ========== HOSPITAL MARKERS ========== */}
        {showHospitals && hospitalsWithDistance.map((hospital) => {
          if (!isValidCoordinate(hospital.latitude, hospital.longitude)) return null;
          
          const markerColor = getHospitalMarkerColor(hospital);

          return (
            <Marker
              key={`hospital-${hospital.id}`}
              position={[hospital.latitude, hospital.longitude]}
              icon={L.divIcon({
                className: 'hospital-marker',
                html: `
                  <div style="
                    background: ${markerColor};
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    border: 3px solid white;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                    cursor: pointer;
                  ">🏥</div>
                `,
                iconSize: [36, 36],
                iconAnchor: [18, 18],
              })}
              eventHandlers={{
                click: () => {
                  setSelectedType('hospital');
                  setSelectedId(hospital.id);
                  setIsSheetOpen(true);
                  onHospitalClick?.(hospital.id);
                },
              }}
            >
              <Popup>
                <div className="text-sm min-w-[250px] bg-white">
                  <strong className="text-slate-900">🏥 {hospital.name}</strong>
                  <div className="mt-2 space-y-1.5">
                    <p className="text-xs">📍 {hospital.address}</p>
                    {hospital.distance !== undefined && (
                      <p className="text-xs text-blue-600 font-semibold">
                        {formatDistance(hospital.distance)} away
                      </p>
                    )}
                    <div className="pt-1 space-y-1">
                      <div className="text-xs flex items-center justify-between">
                        <span>🐍 Snakebite Treatment:</span>
                        <Badge variant={hospital.snakebiteTreatmentAvailable ? 'default' : 'secondary'} className="text-[10px]">
                          {hospital.snakebiteTreatmentAvailable ? 'YES' : 'NO'}
                        </Badge>
                      </div>
                      <div className="text-xs flex items-center justify-between">
                        <span>💉 Antivenom:</span>
                        <Badge variant="outline" className="text-[10px]">
                          {hospital.antivenomStatus}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* ========== ROUTE POLYLINE ========== */}
        {showRoute && route && route.coordinates.length > 0 && (
          <Polyline
            positions={route.coordinates.map(coord => [coord.lat, coord.lng])}
            pathOptions={{
              color: emergencyMode ? '#dc2626' : '#3b82f6',
              weight: 4,
              opacity: 0.8,
              dashArray: emergencyMode ? '10, 5' : undefined,
            }}
          />
        )}
      </MapContainer>

      {/* ========== EMERGENCY MODE INDICATOR ========== */}
      {emergencyMode && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000]">
          <div className="bg-red-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-pulse">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-bold">EMERGENCY MODE</span>
          </div>
        </div>
      )}

      {/* ========== STATS OVERLAY ========== */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm px-4 py-3 rounded-lg shadow-lg space-y-1">
        {incident && (
          <div className="flex items-center gap-2 text-sm">
            <span>🐍</span>
            <span className="font-semibold">1</span>
            <span className="text-slate-600">Incident</span>
          </div>
        )}
        {showRescuers && rescuers.length > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <span>🧑‍🚒</span>
            <span className="font-semibold">{rescuers.length}</span>
            <span className="text-slate-600">Rescuer{rescuers.length !== 1 ? 's' : ''}</span>
          </div>
        )}
        {showHospitals && hospitals.length > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <span>🏥</span>
            <span className="font-semibold">{hospitals.length}</span>
            <span className="text-slate-600">Hospital{hospitals.length !== 1 ? 's' : ''}</span>
          </div>
        )}
        {showRoute && route && (
          <div className="flex items-center gap-2 text-sm pt-2 border-t">
            <MapIcon className="h-4 w-4 text-blue-600" />
            <span className="font-semibold text-blue-600">{route.summary}</span>
          </div>
        )}
      </div>
    </div>
  );
}
