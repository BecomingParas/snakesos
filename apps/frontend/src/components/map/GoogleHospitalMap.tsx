/**
 * GoogleHospitalMap
 * Replaces the Leaflet hospital map with a Google Maps implementation while
 * preserving the medical safety logic and GraphQL-backed hospital data.
 */

'use client';

import { useMemo, useState } from 'react';
import { GoogleMapWrapper } from './GoogleMapWrapper';
import { GoogleMapMarker } from './GoogleMapMarker';
import type { HospitalLocation } from './map.types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, Navigation, AlertTriangle, Clock } from 'lucide-react';
import { formatDistance, calculateDistance } from '@/lib/map/distance';
import { isValidCoordinate } from '@/lib/map/coordinates';

export interface GoogleHospitalMapProps {
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

function createCircleMarkerIcon(
  color: string,
  scale: number,
  strokeColor = '#ffffff',
  strokeWeight = 2,
) {
  if (typeof window === 'undefined' || !window.google?.maps) {
    return undefined;
  }

  return {
    path: window.google.maps.SymbolPath.CIRCLE,
    scale,
    fillColor: color,
    fillOpacity: 1,
    strokeColor,
    strokeWeight,
  };
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

export function GoogleHospitalMap({
  hospitals,
  center = [27.7172, 85.324],
  zoom = 13,
  userLocation,
  selectedHospitalId,
  onHospitalClick,
  filters = {},
}: GoogleHospitalMapProps) {
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

  const hospitalsWithDistance = useMemo(
    () =>
      filteredHospitals.map((hospital) => ({
        ...hospital,
        distance: userLocation
          ? calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              hospital.latitude,
              hospital.longitude,
            )
          : undefined,
      })),
    [filteredHospitals, userLocation],
  );

  const mapCenter = useMemo(() => {
    if (userLocation) {
      return { lat: userLocation.latitude, lng: userLocation.longitude };
    }
    if (center && center.length === 2) {
      return { lat: center[0], lng: center[1] };
    }
    return { lat: 27.7172, lng: 85.324 };
  }, [center, userLocation]);

  const handleHospitalClick = (hospital: HospitalLocation) => {
    setSelectedHospital(hospital);
    onHospitalClick?.(hospital.id);
  };

  const handleDirections = (lat: number, lng: number) => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      '_blank',
      'noopener,noreferrer',
    );
  };

  return (
    <div className="relative h-full w-full">
      <GoogleMapWrapper
        center={mapCenter}
        zoom={zoom}
        mapContainerStyle={{ width: '100%', height: '100%', minHeight: '420px' }}
      >
        {userLocation && (
          <GoogleMapMarker
            id="user-location"
            position={{
              lat: userLocation.latitude,
              lng: userLocation.longitude,
            }}
            title="Your location"
            icon={createCircleMarkerIcon('#3b82f6', 8)}
          />
        )}

        {hospitalsWithDistance.map((hospital) => {
          const isSelected = selectedHospitalId === hospital.id;
          const markerColor = getHospitalMarkerColor(hospital);

          return (
            <GoogleMapMarker
              key={hospital.id}
              id={hospital.id}
              position={{ lat: hospital.latitude, lng: hospital.longitude }}
              title={hospital.name}
              icon={createCircleMarkerIcon(
                markerColor,
                isSelected ? 12 : 10,
                '#ffffff',
                3,
              )}
              onClick={() => handleHospitalClick(hospital)}
              infoWindowContent={
                <div className="text-sm min-w-62.5">
                  <strong className="text-slate-900">🏥 {hospital.name}</strong>
                  <div className="mt-2 space-y-1.5">
                    <p className="text-xs text-slate-700">📍 {hospital.address}</p>
                    {hospital.distance !== undefined && (
                      <p className="text-xs text-blue-600 font-semibold">
                        {formatDistance(hospital.distance)} away
                      </p>
                    )}
                    <div className="pt-2 border-t border-slate-200 space-y-1">
                      <p className="text-xs flex items-center justify-between">
                        <span className="text-slate-600">🐍 Snakebite Treatment:</span>
                        <Badge variant={hospital.snakebiteTreatmentAvailable ? 'default' : 'secondary'} className="text-[10px] px-1.5 py-0">
                          {hospital.snakebiteTreatmentAvailable ? 'YES' : 'NO'}
                        </Badge>
                      </p>
                      <p className="text-xs flex items-center justify-between">
                        <span className="text-slate-600">💉 Antivenom:</span>
                        <Badge className={`text-[10px] px-1.5 py-0 ${getStatusBadgeColor(hospital.antivenomStatus)}`}>
                          {hospital.antivenomStatus?.replace('_', ' ')}
                        </Badge>
                      </p>
                      {hospital.antivenomLastVerifiedAt && (
                        <p className="text-[10px] text-slate-500 italic">
                          {getFreshnessText(
                            hospital.antivenomVerificationFreshness,
                            hospital.antivenomLastVerifiedAt,
                          )}
                        </p>
                      )}
                    </div>
                    <div className="pt-2 flex gap-2">
                      {hospital.phone && (
                        <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => window.location.href = `tel:${hospital.phone}`}>
                          <Phone className="h-3 w-3 mr-1" />
                          Call
                        </Button>
                      )}
                      <Button
                        size="sm"
                        className="text-xs h-7"
                        onClick={() => handleDirections(hospital.latitude, hospital.longitude)}
                      >
                        <Navigation className="h-3 w-3 mr-1" />
                        Directions
                      </Button>
                    </div>
                  </div>
                </div>
              }
              infoWindowOpen={selectedHospitalId === hospital.id}
            />
          );
        })}
      </GoogleMapWrapper>

      {selectedHospital && (
        <div className="absolute bottom-4 left-4 z-10 max-w-sm rounded-lg border border-slate-200 bg-white/95 p-4 shadow-lg">
          <div className="flex items-start gap-3">
            <div className="text-2xl">🏥</div>
            <div>
              <h3 className="font-semibold text-slate-900">{selectedHospital.name}</h3>
              <p className="text-xs text-slate-600">{selectedHospital.address}</p>
              {selectedHospital.distance !== undefined && (
                <p className="mt-1 text-xs font-medium text-blue-600">
                  {formatDistance(selectedHospital.distance)} away
                </p>
              )}
            </div>
          </div>

          <div className="mt-3 space-y-2 text-xs text-slate-700">
            <div className="flex items-center justify-between">
              <span>Snakebite treatment</span>
              <Badge variant={selectedHospital.snakebiteTreatmentAvailable ? 'default' : 'secondary'}>
                {selectedHospital.snakebiteTreatmentAvailable ? 'AVAILABLE' : 'NOT AVAILABLE'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Antivenom</span>
              <Badge className={getStatusBadgeColor(selectedHospital.antivenomStatus)}>
                {selectedHospital.antivenomStatus?.replace('_', ' ')}
              </Badge>
            </div>
            {selectedHospital.antivenomLastVerifiedAt && (
              <div className="flex items-start gap-2 rounded bg-slate-50 p-2">
                <Clock className="h-4 w-4 mt-0.5 shrink-0" />
                <div>
                  <p>{getFreshnessText(
                    selectedHospital.antivenomVerificationFreshness,
                    selectedHospital.antivenomLastVerifiedAt,
                  )}</p>
                  {selectedHospital.antivenomVerificationFreshness !== 'FRESH' && (
                    <p className="mt-1 flex items-center gap-1 text-yellow-700">
                      <AlertTriangle className="h-3 w-3" />
                      Verification may be outdated
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default GoogleHospitalMap;
