/**
 * HospitalMapWith Data Component
 * Hospital map integrated with GraphQL API
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import { GoogleHospitalMap } from './GoogleHospitalMap';
import type { HospitalLocation } from './map.types';
import { useHospitals } from '@/lib/graphql/hooks/hospital.hooks';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HospitalMapWithDataProps {
  /** Use user's current location */
  useUserLocation?: boolean;
  /** Fallback center if no user location */
  defaultCenter?: [number, number];
  /** Initial zoom level */
  zoom?: number;
  /** Search radius in km */
  radiusKm?: number;
  /** Filter: only show antivenom available */
  antivenomRequired?: boolean;
  /** Filter: snakebite treatment only */
  snakebiteTreatmentOnly?: boolean;
  /** Filter: 24x7 emergency only */
  emergency24x7?: boolean;
  /** Max hospitals to show */
  limit?: number;
  /** Callback when hospital is clicked */
  onHospitalClick?: (hospitalId: string) => void;
}

/**
 * Convert API hospital data to map format
 */
function mapHospitalData(apiHospital: any): HospitalLocation {
  // Determine verification freshness
  let freshness: 'FRESH' | 'STALE' | 'VERY_OLD' | 'NEVER' = 'NEVER';
  if (apiHospital.lastAntivenomVerification) {
    const verifiedDate = new Date(apiHospital.lastAntivenomVerification);
    const now = new Date();
    const hoursDiff = (now.getTime() - verifiedDate.getTime()) / (1000 * 60 * 60);
    
    if (hoursDiff < 24) {
      freshness = 'FRESH';
    } else if (hoursDiff < 168) { // 7 days
      freshness = 'STALE';
    } else {
      freshness = 'VERY_OLD';
    }
  }

  return {
    id: apiHospital.id,
    name: apiHospital.name,
    latitude: apiHospital.latitude,
    longitude: apiHospital.longitude,
    address: apiHospital.address,
    municipality: apiHospital.municipality,
    district: apiHospital.district,
    phone: apiHospital.phone,
    emergencyPhone: apiHospital.emergencyPhone,
    snakebiteTreatmentAvailable: apiHospital.snakebiteTreatmentAvailable || false,
    antivenomStatus: apiHospital.antivenomStatus || 'UNKNOWN',
    antivenomLastVerifiedAt: apiHospital.lastAntivenomVerification,
    antivenomVerificationFreshness: freshness,
    emergencyAvailable: apiHospital.emergencyAvailable || false,
    emergency24x7: apiHospital.emergency24x7 || false,
    ventilatorAvailable: apiHospital.ventilatorAvailable || false,
    distance: apiHospital.distance,
  };
}

/**
 * Calculate distance between two coordinates using Haversine formula
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 100) / 100; // Round to 2 decimal places
}

export function HospitalMapWithData({
  useUserLocation = false,
  defaultCenter = [27.7172, 85.324], // Kathmandu
  zoom = 13,
  radiusKm = 50,
  antivenomRequired = false,
  snakebiteTreatmentOnly = true,
  emergency24x7 = false,
  limit = 50,
  onHospitalClick,
}: HospitalMapWithDataProps) {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);

  // Get user's location if requested
  useEffect(() => {
    if (useUserLocation && 'geolocation' in navigator) {
      setIsRequestingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationError(null);
          setIsRequestingLocation(false);
        },
        (error) => {
          setLocationError(error.message);
          setIsRequestingLocation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    }
  }, [useUserLocation]);

  // Fetch all hospitals (without snakebite filter due to backend error)
  const {
    data,
    loading: queryLoading,
    error: queryError,
    refetch,
  } = useHospitals(
    { 
      status: 'ACTIVE',
      // Note: snakebiteTreatmentAvailable filter causes backend error, filtering client-side instead
    },
    { first: limit || 100 }
  );

  const hospitalsFromQuery = useMemo(() => {
    const hospitalsData = (data as any)?.hospitals?.edges?.map((edge: any) => edge.node) || [];
    // Filter client-side for snakebite treatment and valid coordinates
    return hospitalsData.filter((h: any) => 
      h.latitude !== null && 
      h.longitude !== null &&
      !(h.latitude === 0 && h.longitude === 0) &&
      (!snakebiteTreatmentOnly || h.snakebiteTreatmentAvailable)
    );
  }, [data, snakebiteTreatmentOnly]);

  // Map to expected format
  const hospitals = useMemo(() => {
    console.log('HospitalMapWithData: Mapping hospitals', hospitalsFromQuery.length);
    return hospitalsFromQuery.map((h: any) => {
      // Use backend-provided freshness or calculate if not available
      let freshness: 'FRESH' | 'STALE' | 'VERY_OLD' | 'NEVER' = h.antivenomVerificationFreshness || 'NEVER';
      
      // Fallback: Calculate from antivenomLastVerifiedAt if freshness not provided
      if (!h.antivenomVerificationFreshness && h.antivenomLastVerifiedAt) {
        const verifiedDate = new Date(h.antivenomLastVerifiedAt);
        const now = new Date();
        const hoursDiff = (now.getTime() - verifiedDate.getTime()) / (1000 * 60 * 60);
        
        if (hoursDiff < 24) {
          freshness = 'FRESH';
        } else if (hoursDiff < 168) { // 7 days
          freshness = 'STALE';
        } else {
          freshness = 'VERY_OLD';
        }
      }

      const hospital = {
        id: h.id,
        name: h.name,
        latitude: h.latitude,
        longitude: h.longitude,
        address: h.address || '',
        municipality: h.municipality || '',
        district: h.district || '',
        phone: h.phone || '',
        emergencyPhone: h.emergencyPhone || '',
        snakebiteTreatmentAvailable: h.snakebiteTreatmentAvailable || false,
        antivenomStatus: h.antivenomStatus || 'UNKNOWN',
        antivenomLastVerifiedAt: h.antivenomLastVerifiedAt,
        antivenomVerificationFreshness: freshness,
        emergencyAvailable: h.emergencyAvailable || false,
        emergency24x7: h.emergency24x7 || false,
        ventilatorAvailable: h.ventilatorAvailable || false,
        distance: userLocation ? calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          h.latitude,
          h.longitude
        ) : undefined,
      };
      
      console.log('Mapped hospital:', hospital.name, hospital.latitude, hospital.longitude);
      return hospital;
    });
  }, [hospitalsFromQuery, userLocation]);

  const loading = isRequestingLocation || queryLoading;

  // Request location button handler
  const handleRequestLocation = () => {
    if ('geolocation' in navigator) {
      setIsRequestingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationError(null);
          setIsRequestingLocation(false);
        },
        (error) => {
          setLocationError(error.message);
          setIsRequestingLocation(false);
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser');
    }
  };

  if (loading) {
    return (
      <div className="relative w-full h-[600px] bg-muted rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Skeleton className="h-12 w-12 rounded-full mx-auto" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-48 mx-auto" />
              <Skeleton className="h-4 w-32 mx-auto" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (queryError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <p>Failed to load hospital data: {queryError.message}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
            >
              Retry
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  if (locationError && useUserLocation && !userLocation) {
    return (
      <Alert>
        <MapPin className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <p>Location access: {locationError}</p>
            <p className="text-sm text-muted-foreground">
              The map needs your location to show nearby hospitals. Please allow location access or the map will use a default location.
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRequestLocation}
                disabled={isRequestingLocation}
              >
                {isRequestingLocation ? 'Requesting...' : 'Allow Location Access'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setLocationError(null);
                  setUserLocation({ latitude: defaultCenter[0], longitude: defaultCenter[1] });
                }}
              >
                Use Default Location
              </Button>
            </div>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="relative">
      {/* Location button */}
      {!userLocation && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleRequestLocation}
          disabled={isRequestingLocation}
          className="absolute top-4 right-4 z-[1000] bg-surface-elevated shadow-elevated"
        >
          <MapPin className="h-4 w-4 mr-2" />
          {isRequestingLocation ? 'Getting location...' : 'Use My Location'}
        </Button>
      )}

      {/* Hospital Map */}
      <GoogleHospitalMap
        hospitals={hospitals}
        center={
          userLocation
            ? [userLocation.latitude, userLocation.longitude]
            : defaultCenter
        }
        zoom={zoom}
        userLocation={userLocation}
        onHospitalClick={onHospitalClick}
        filters={{
          snakebiteTreatmentOnly,
          antivenomAvailable: antivenomRequired,
          emergency24x7,
        }}
      />

      {/* Hospital count badge */}
      <div className="absolute bottom-4 left-4 z-[1000] rounded-md border border-border bg-surface-elevated px-3 py-2 text-sm shadow-elevated">
        <span className="font-semibold">{hospitals.length}</span> hospitals found
      </div>
    </div>
  );
}
