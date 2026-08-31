/**
 * GoogleMapWrapper Component
 * Provides a reusable Google Maps container with consistent configuration
 */

'use client';

import { useState, ReactNode } from 'react';
import { GoogleMap } from '@react-google-maps/api';
import { useGoogleMapsApi } from '@/lib/map/google-maps-loader';
import {
  GoogleMapsDevDiagnostics,
  GoogleMapsLoadErrorState,
  GoogleMapsLoadingState,
  GoogleMapsMissingKeyState,
} from './GoogleMapsStatus';

export interface GoogleMapWrapperProps {
  center?: google.maps.LatLngLiteral;
  zoom?: number;
  mapContainerStyle?: React.CSSProperties;
  mapOptions?: google.maps.MapOptions;
  children?: ReactNode;
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onDblClick?: (e: google.maps.MapMouseEvent) => void;
  onBoundsChanged?: () => void;
  onZoomChanged?: () => void;
  onCenterChanged?: () => void;
  onIdle?: () => void;
  onLoadError?: (error: Error) => void;
  loadScriptProps?: Record<string, unknown>;
  className?: string;
}

const DEFAULT_CENTER: google.maps.LatLngLiteral = {
  lat: 27.7172,
  lng: 85.324,
};

const DEFAULT_ZOOM = 8;

const DEFAULT_MAP_STYLE: React.CSSProperties = {
  width: '100%',
  height: '100%',
  minHeight: '400px',
  display: 'block',
};

const DEFAULT_MAP_OPTIONS: google.maps.MapOptions = {
  zoom: DEFAULT_ZOOM,
  center: DEFAULT_CENTER,
  mapTypeId: 'roadmap',
  streetViewControl: false,
  mapTypeControl: true,
  fullscreenControl: true,
  zoomControl: true,
};

export function GoogleMapWrapper({
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  mapContainerStyle = DEFAULT_MAP_STYLE,
  mapOptions = {},
  children,
  onClick,
  onDblClick,
  onBoundsChanged,
  onZoomChanged,
  onCenterChanged,
  onIdle,
  onLoadError,
  className = '',
}: GoogleMapWrapperProps) {
  const [isMapReady, setIsMapReady] = useState(false);
  const { isLoaded, error, retry, apiKeyConfigured } = useGoogleMapsApi();
  const containerStyle = {
    ...DEFAULT_MAP_STYLE,
    ...mapContainerStyle,
  };

  if (!apiKeyConfigured) {
    return (
      <GoogleMapsMissingKeyState style={containerStyle} className={className} />
    );
  }

  if (error) {
    onLoadError?.(error);
    return (
      <GoogleMapsLoadErrorState
        error={error}
        onRetry={retry}
        style={containerStyle}
        className={className}
      />
    );
  }

  if (!isLoaded) {
    return (
      <GoogleMapsLoadingState style={containerStyle} className={className} />
    );
  }

  return (
    <div className={`relative ${className}`} style={containerStyle}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoom}
        options={{
          ...DEFAULT_MAP_OPTIONS,
          ...mapOptions,
          center,
          zoom,
        }}
        onClick={onClick}
        onDblClick={onDblClick}
        onBoundsChanged={onBoundsChanged}
        onZoomChanged={onZoomChanged}
        onCenterChanged={onCenterChanged}
        onIdle={onIdle}
        onLoad={() => setIsMapReady(true)}
      >
        {isMapReady && children}
      </GoogleMap>
      <GoogleMapsDevDiagnostics mapInitialized={isMapReady} />
    </div>
  );
}

export default GoogleMapWrapper;
