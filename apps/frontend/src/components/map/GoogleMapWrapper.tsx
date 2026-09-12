/**
 * GoogleMapWrapper Component
 * Provides a reusable Google Maps container with consistent configuration.
 * This intentionally avoids the external @react-google-maps/api wrapper because
 * its React context implementation crashes during Next.js static prerender.
 */

'use client';

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useGoogleMapsApi } from '@/lib/map/google-maps-loader';
import {
  GoogleMapsDevDiagnostics,
  GoogleMapsLoadErrorState,
  GoogleMapsLoadingState,
  GoogleMapsMissingKeyState,
} from './GoogleMapsStatus';

export interface GoogleMapContextValue {
  map: google.maps.Map | null;
  isReady: boolean;
}

export const GoogleMapContext = createContext<GoogleMapContextValue | null>(null);

export function useGoogleMap(): GoogleMapContextValue {
  const context = useContext(GoogleMapContext);
  if (!context) {
    return { map: null, isReady: false };
  }
  return context;
}

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
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const { isLoaded, error, retry, apiKeyConfigured } = useGoogleMapsApi();
  const containerStyle = {
    ...DEFAULT_MAP_STYLE,
    ...mapContainerStyle,
  };

  useEffect(() => {
    if (!isLoaded || !mapRef.current || !window.google?.maps || mapInstanceRef.current) {
      return undefined;
    }

    const map = new window.google.maps.Map(mapRef.current, {
      ...DEFAULT_MAP_OPTIONS,
      ...mapOptions,
      center,
      zoom,
    });

    mapInstanceRef.current = map;
    setIsMapReady(true);

    const handleClick = (event: google.maps.MapMouseEvent) => onClick?.(event);
    const handleDblClick = (event: google.maps.MapMouseEvent) => onDblClick?.(event);
    const handleBoundsChanged = () => onBoundsChanged?.();
    const handleZoomChanged = () => onZoomChanged?.();
    const handleCenterChanged = () => onCenterChanged?.();
    const handleIdle = () => onIdle?.();

    map.addListener('click', handleClick);
    map.addListener('dblclick', handleDblClick);
    map.addListener('bounds_changed', handleBoundsChanged);
    map.addListener('zoom_changed', handleZoomChanged);
    map.addListener('center_changed', handleCenterChanged);
    map.addListener('idle', handleIdle);

    return () => {
      google.maps.event.clearInstanceListeners(map);
      mapInstanceRef.current = null;
      setIsMapReady(false);
    };
  }, [center, isLoaded, mapOptions, onBoundsChanged, onCenterChanged, onClick, onDblClick, onIdle, onZoomChanged, zoom]);

  useEffect(() => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setCenter(center);
    mapInstanceRef.current.setZoom(zoom);
  }, [center, zoom]);

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
      <div
        ref={mapRef}
        style={{
          width: '100%',
          height: '100%',
          minHeight: containerStyle.minHeight ?? '400px',
          display: 'block',
        }}
      />
      {isMapReady && (
        <GoogleMapContext.Provider
          value={{ map: mapInstanceRef.current, isReady: isMapReady }}
        >
          {children}
        </GoogleMapContext.Provider>
      )}
      <GoogleMapsDevDiagnostics mapInitialized={isMapReady} />
    </div>
  );
}

export default GoogleMapWrapper;
