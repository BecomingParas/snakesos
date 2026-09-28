/**
 * LeafletHospitalMap - Free alternative to Google Maps
 * Uses OpenStreetMap tiles, no API key required
 */

'use client';

import { useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import type { HospitalLocation } from './map.types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, Navigation, AlertTriangle, Clock } from 'lucide-react';
import { formatDistance } from '@/lib/map/distance';
import { isValidCoordinate } from '@/lib/map/coordinates';

// Fix Leaflet default marker icons issue in Next.js
import 'leaflet/dist/leaflet.css';

export interface LeafletHospitalMapProps {
  hospitals: HospitalLocation[];
  center?: [number, number];
  zoom?: number;
  userLocation?: { latitude: number; longitude: number } | null;
  selectedHospitalId?: string | null;
  onHospitalClick?: (hospitalId: string) => void;
  filters?: {
    snakebiteTreatmentOnly?: boolean;
    antivenomAvailable?: boolean;
    emergency24x7?: boolean;
  };
}

// Create custom marker icons
const createMarkerIcon = (color: string, isSelected = false) => {
  const size = isSelected ? 40 : 32;
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
      ">
        🏥
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
};

const userLocationIcon = L.divIcon({
  className: 'user-location-marker',
  html: `
    <div style="
      width: 20px;
      height: 20px;
      background-color: #3b82f6;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    "></div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

function getHospitalMarkerColor(hospital: HospitalLocation): string {
  if (hospital.antivenomStatus === 'OUT_OF_STOCK') return '#dc2626';
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

function getStatusBadgeColor(
  status: HospitalLocation['antivenomStatus'],
): string {
  switch (status) {
    case 'AVAILABLE':
      return 'bg-green-100 text-green-800';
    case 'LOW_STOCK':
      return 'bg-yellow-100 text-yellow-800';
    case 'OUT_OF_STOCK':
      return 'bg-red-100 text-red-800';
    case 'NOT_SUPPORTED':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-slate-100 text-slate-800';
  }
}

function getFreshnessText(
  freshness: HospitalLocation['antivenomVerificationFreshness'],
  verifiedAt?: string,
): string {
  if (!verifiedAt) return 'Never verified';

  const date = new Date(verifiedAt);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 24) {
    return `Verified ${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  }
  if (diffDays < 30) {
    return `Verified ${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  }
  return `Last verified ${diffDays} days ago`;
}

export function LeafletHospitalMap({
  hospitals,
  center = [27.7172, 85.324],
  zoom = 13,
  userLocation,
  selectedHospitalId,
  onHospitalClick,
  filters = {},
}: LeafletHospitalMapProps) {
  const [selectedHospital, setSelectedHospital] =
    useState<HospitalLocation | null>(null);

  const filteredHospitals = useMemo(
    () =>
      hospitals.filter((hospital) => {
        if (!isValidCoordinate(hospital.latitude, hospital.longitude)) return false;
        if (filters.snakebiteTreatmentOnly && !hospital.snakebiteTreatmentAvailable)
          return false;
        if (
          filters.antivenomAvailable &&
          (hospital.antivenomStatus !== 'AVAILABLE' ||
            hospital.antivenomVerificationFreshness !== 'FRESH')
        ) {
          return false;
        }
        if (filters.emergency24x7 && !hospital.emergency24x7) return false;
        return true;
      }),
    [hospitals, filters],
  );

  const mapCenter: [number, number] = useMemo(() => {
    if (userLocation) {
      return [userLocation.latitude, userLocation.longitude];
    }
    return center;
  }, [center, userLocation]);

  const handleDirections = (lat: number, lng: number) => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      '_blank',
      'noopener,noreferrer',
    );
  };

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ height: '100%', width: '100%', minHeight: '420px' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User location marker */}
        {userLocation && (
          <>
            <Marker
              position={[userLocation.latitude, userLocation.longitude]}
              icon={userLocationIcon}
            >
              <Popup>
                <div className="text-sm font-semibold">Your Location</div>
              </Popup>
            </Marker>
            {/* Show radius circle around user */}
            <Circle
              center={[userLocation.latitude, userLocation.longitude]}
              radius={5000} // 5km radius
              pathOptions={{
                color: '#3b82f6',
                fillColor: '#3b82f6',
                fillOpacity: 0.1,
                weight: 2,
              }}
            />
          </>
        )}

        {/* Hospital markers */}
        {filteredHospitals.map((hospital) => {
          const isSelected = selectedHospitalId === hospital.id;
          const markerColor = getHospitalMarkerColor(hospital);

          return (
            <Marker
              key={hospital.id}
              position={[hospital.latitude, hospital.longitude]}
              icon={createMarkerIcon(markerColor, isSelected)}
              eventHandlers={{
                click: () => {
                  setSelectedHospital(hospital);
                  onHospitalClick?.(hospital.id);
                },
              }}
            >
              <Popup>
                <div className="min-w-[250px] p-2">
                  <h3 className="font-bold text-base mb-2">🏥 {hospital.name}</h3>
                  
                  <div className="space-y-2 text-sm">
                    <p className="text-slate-700">📍 {hospital.address}</p>
                    
                    {hospital.distance !== undefined && (
                      <p className="text-blue-600 font-semibold">
                        {formatDistance(hospital.distance)} away
                      </p>
                    )}

                    <div className="pt-2 border-t border-slate-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">🐍 Snakebite Treatment:</span>
                        <Badge variant={hospital.snakebiteTreatmentAvailable ? 'default' : 'secondary'} className="text-[10px]">
                          {hospital.snakebiteTreatmentAvailable ? 'YES' : 'NO'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">💉 Antivenom:</span>
                        <Badge className={`text-[10px] ${getStatusBadgeColor(hospital.antivenomStatus)}`}>
                          {hospital.antivenomStatus?.replace('_', ' ')}
                        </Badge>
                      </div>

                      {hospital.antivenomLastVerifiedAt && (
                        <p className="text-[10px] text-slate-500 italic mt-1">
                          {getFreshnessText(
                            hospital.antivenomVerificationFreshness,
                            hospital.antivenomLastVerifiedAt,
                          )}
                        </p>
                      )}
                    </div>

                    <div className="pt-2 flex gap-2">
                      {hospital.phone && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs flex-1"
                          onClick={() => window.location.href = `tel:${hospital.phone}`}
                        >
                          <Phone className="h-3 w-3 mr-1" />
                          Call
                        </Button>
                      )}
                      <Button
                        size="sm"
                        className="text-xs flex-1"
                        onClick={() => handleDirections(hospital.latitude, hospital.longitude)}
                      >
                        <Navigation className="h-3 w-3 mr-1" />
                        Directions
                      </Button>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default LeafletHospitalMap;
