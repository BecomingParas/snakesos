'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, Navigation, AlertCircle, Loader2 } from 'lucide-react';
import { GoogleMapWrapper } from './GoogleMapWrapper';
import { GoogleMapMarker } from './GoogleMapMarker';
import { useUserLocation } from '@/hooks/useUserLocation';

interface LocationPickerProps {
  /**
   * Initial location to display
   */
  initialLocation?: {
    lat: number;
    lng: number;
  };

  /**
   * Called when user confirms a location
   */
  onLocationSelected: (location: {
    latitude: number;
    longitude: number;
    formattedAddress?: string;
  }) => void;

  /**
   * Callback when picker is closed/cancelled
   */
  onCancel?: () => void;

  /**
   * Show or hide the picker
   */
  isOpen?: boolean;

  /**
   * Title for the location picker
   */
  title?: string;

  /**
   * Enable dragging the marker
   */
  draggable?: boolean;

  /**
   * Container height
   */
  height?: string;

  /**
   * Show current location button
   */
  showCurrentLocationButton?: boolean;

  /**
   * Zoom level
   */
  zoom?: number;

  /**
   * Map container class
   */
  className?: string;
}

/**
 * LocationPicker Component
 * 
 * Allows users to:
 * - Click on map to select location
 * - Drag marker to adjust location
 * - Use current location button
 * - Confirm selection
 */
export function LocationPicker({
  initialLocation,
  onLocationSelected,
  onCancel,
  isOpen = true,
  title = 'Select Location',
  draggable = true,
  height = '500px',
  showCurrentLocationButton = true,
  zoom = 13,
  className = '',
}: LocationPickerProps) {
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(initialLocation || null);

  const [markerDragging, setMarkerDragging] = useState(false);
  const [address, setAddress] = useState<string>('');
  const [addressLoading, setAddressLoading] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);

  const { location: userLocation, loading: geoLoading, requestLocation: refetchLocation } = useUserLocation();

  const mapCenter = selectedLocation || (userLocation ? {
    lat: userLocation.latitude,
    lng: userLocation.longitude,
  } : {
    lat: 27.7172,
    lng: 85.324, // Kathmandu, Nepal default
  });

  /**
   * Reverse geocode coordinates to get address
   */
  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    if (typeof window === 'undefined' || !window.google?.maps) {
      return;
    }

    setAddressLoading(true);
    try {
      const geocoder = new google.maps.Geocoder();
      const result = await geocoder.geocode({
        location: { lat, lng },
      });

      if (result.results && result.results.length > 0) {
        const formattedAddress = result.results[0].formatted_address;
        setAddress(formattedAddress);
      } else {
        setAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      setAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    } finally {
      setAddressLoading(false);
    }
  }, []);

  /**
   * Handle map click to set location
   */
  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setSelectedLocation({ lat, lng });
      reverseGeocode(lat, lng);
    }
  };

  /**
   * Handle marker drag
   */
  const handleMarkerDragEnd = (markerId: string, position: google.maps.LatLngLiteral) => {
    const lat = position.lat;
    const lng = position.lng;
    setSelectedLocation({ lat, lng });
    reverseGeocode(lat, lng);
    setMarkerDragging(false);
  };

  /**
   * Use current user location
   */
  const handleUseCurrentLocation = async () => {
    if (!userLocation) {
      await refetchLocation();
      return;
    }

    const lat = userLocation.latitude;
    const lng = userLocation.longitude;
    setSelectedLocation({ lat, lng });
    reverseGeocode(lat, lng);
  };

  /**
   * Confirm and close picker
   */
  const handleConfirm = () => {
    if (selectedLocation) {
      onLocationSelected({
        latitude: selectedLocation.lat,
        longitude: selectedLocation.lng,
        formattedAddress: address || undefined,
      });
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-border bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">{title}</h3>
          </div>
          <button
            onClick={onCancel}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Map Area */}
      <div style={{ flex: 1, minHeight: height }} className="relative">
        <GoogleMapWrapper
          center={mapCenter}
          zoom={zoom}
          onClick={handleMapClick}
          mapContainerStyle={{
            width: '100%',
            height: '100%',
            display: 'block',
          }}
        >
          {selectedLocation && (
            <GoogleMapMarker
              id="location-picker-marker"
              position={selectedLocation}
              title="Selected Location"
              draggable={draggable}
              onDragEnd={(_, pos) => handleMarkerDragEnd('marker', pos)}
              icon={{
                path: typeof window !== 'undefined' && window?.google?.maps?.SymbolPath?.CIRCLE 
                  ? window.google.maps.SymbolPath.CIRCLE 
                  : 0,
                scale: 10,
                fillColor: '#3b82f6',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2,
              } as google.maps.Icon | google.maps.Symbol}
            />
          )}
        </GoogleMapWrapper>

        {/* Loading overlay */}
        {geoLoading && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-lg">
            <div className="bg-background px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm font-medium">Getting location...</span>
            </div>
          </div>
        )}

        {/* Click hint */}
        {!selectedLocation && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-background/90 px-4 py-2 rounded-lg shadow-lg text-center text-sm text-muted-foreground">
              Click on the map to select a location
            </div>
          </div>
        )}
      </div>

      {/* Location Info & Controls */}
      <div className="px-4 py-4 border-t border-border bg-card space-y-4">
        {/* Address Display */}
        {selectedLocation && (
          <Card className="p-3 bg-muted/50 border-border">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-1" />
                <div className="min-w-0">
                  {addressLoading ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Fetching address...
                    </div>
                  ) : (
                    <p className="text-sm font-medium text-foreground wrap-break-word">
                      {address || `${selectedLocation.lat.toFixed(5)}, ${selectedLocation.lng.toFixed(5)}`}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-xs text-muted-foreground ml-6">
                Coordinates: {selectedLocation.lat.toFixed(5)}, {selectedLocation.lng.toFixed(5)}
              </div>
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 flex-wrap">
          {showCurrentLocationButton && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleUseCurrentLocation}
              disabled={geoLoading || !selectedLocation}
              className="gap-2"
            >
              <Navigation className="h-4 w-4" />
              <span className="hidden sm:inline">Use Current Location</span>
              <span className="sm:hidden">Current</span>
            </Button>
          )}

          {draggable && selectedLocation && (
            <Button
              variant="outline"
              size="sm"
              disabled={markerDragging}
              className="gap-2 flex-1 sm:flex-none"
            >
              <span className="text-xs">Drag marker to adjust</span>
            </Button>
          )}
        </div>

        {/* Error message if needed */}
        {!selectedLocation && (
          <div className="flex items-start gap-2 text-xs text-amber-600 bg-amber-50 dark:bg-amber-950 p-2 rounded">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>Select a location to continue</span>
          </div>
        )}

        {/* Confirm/Cancel Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedLocation}
            className="flex-1"
          >
            Confirm Location
          </Button>
        </div>
      </div>
    </div>
  );
}

export default LocationPicker;
