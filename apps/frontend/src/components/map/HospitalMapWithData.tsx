/**
 * HospitalMapWith Data Component
 * Hospital map integrated with GraphQL API
 */

'use client';

import { useState, useEffect } from 'react';
import { HospitalMap, type HospitalLocation } from './HospitalMap';
import { useNearbyHospitals } from '@/lib/graphql/hooks/hospital.hooks';
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

  // Fetch nearby hospitals from API
  const {
    data,
    loading: queryLoading,
    error: queryError,
    refetch,
  } = useNearbyHospitals(
    userLocation?.latitude || defaultCenter[0],
    userLocation?.longitude || defaultCenter[1],
    {
      radiusKm,
      antivenomRequired,
      limit,
      skip: isRequestingLocation, // Skip query while getting location
    }
  );

  const hospitals = (data as any)?.nearbyHospitals
    ? (data as any).nearbyHospitals.map(mapHospitalData)
    : [];

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
          Failed to load hospital data: {queryError.message}
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="mt-2 ml-2"
          >
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (locationError && useUserLocation) {
    return (
      <Alert>
        <MapPin className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <p>Location access: {locationError}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRequestLocation}
              disabled={isRequestingLocation}
            >
              {isRequestingLocation ? 'Requesting...' : 'Allow Location Access'}
            </Button>
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
          className="absolute top-4 right-4 z-[1000] bg-white shadow-md"
        >
          <MapPin className="h-4 w-4 mr-2" />
          {isRequestingLocation ? 'Getting location...' : 'Use My Location'}
        </Button>
      )}

      {/* Hospital Map */}
      <HospitalMap
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
      <div className="absolute bottom-4 left-4 z-[1000] bg-white px-3 py-2 rounded-md shadow-md text-sm">
        <span className="font-semibold">{hospitals.length}</span> hospitals found
      </div>
    </div>
  );
}
