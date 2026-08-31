/**
 * GoogleMapWrapperRaw Component
 * Uses the shared Google Maps script loader and the native Maps JS API.
 */

'use client';

import {
  useState,
  ReactNode,
  useEffect,
  useRef,
  createContext,
  useContext,
} from 'react';
import { useGoogleMapsApi } from '@/lib/map/google-maps-loader';
import {
  GoogleMapsDevDiagnostics,
  GoogleMapsLoadErrorState,
  GoogleMapsLoadingState,
  GoogleMapsMissingKeyState,
} from './GoogleMapsStatus';

export const GoogleMapContext = createContext<{
  map: google.maps.Map | null;
  isReady: boolean;
} | null>(null);

export const useGoogleMapRaw = () => {
  const context = useContext(GoogleMapContext);
  if (!context) {
    throw new Error('useGoogleMapRaw must be used inside GoogleMapWrapperRaw');
  }
  return context;
};

export interface GoogleMapWrapperRawProps {
  center?: google.maps.LatLngLiteral;
  zoom?: number;
  mapContainerStyle?: React.CSSProperties;
  mapOptions?: google.maps.MapOptions;
  children?: ReactNode;
  onClick?: (e: google.maps.MapMouseEvent) => void;
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

export function GoogleMapWrapperRaw({
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  mapContainerStyle = DEFAULT_MAP_STYLE,
  mapOptions = {},
  children,
  onClick,
  className = '',
}: GoogleMapWrapperRawProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const clickListenerRef = useRef<google.maps.MapsEventListener | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const { isLoaded, error, retry, apiKeyConfigured } = useGoogleMapsApi();

  const containerStyle = {
    ...DEFAULT_MAP_STYLE,
    ...mapContainerStyle,
  };

  useEffect(() => {
    if (!isLoaded || !mapRef.current || mapInstanceRef.current) {
      return undefined;
    }

    if (!window.google?.maps) {
      return undefined;
    }

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      zoom,
      center,
      mapTypeId: 'roadmap',
      streetViewControl: false,
      ...mapOptions,
    });

    mapInstanceRef.current = mapInstance;
    setMapReady(true);

    return undefined;
  }, [isLoaded]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapReady) return;
    map.setCenter(center);
    map.setZoom(zoom);
  }, [center, zoom, mapReady]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapReady) return undefined;

    if (clickListenerRef.current) {
      clickListenerRef.current.remove();
      clickListenerRef.current = null;
    }

    if (onClick) {
      clickListenerRef.current = map.addListener('click', onClick);
    }

    return () => {
      clickListenerRef.current?.remove();
      clickListenerRef.current = null;
    };
  }, [onClick, mapReady]);

  if (!apiKeyConfigured) {
    return (
      <GoogleMapsMissingKeyState style={containerStyle} className={className} />
    );
  }

  if (error) {
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
    <GoogleMapContext.Provider
      value={{ map: mapInstanceRef.current, isReady: mapReady }}
    >
      <div style={containerStyle} className={`relative ${className}`}>
        <div
          ref={mapRef}
          style={{
            width: '100%',
            height: '100%',
            minHeight: containerStyle.minHeight ?? '400px',
            display: 'block',
          }}
        />
        {mapReady && children}
        <GoogleMapsDevDiagnostics mapInitialized={mapReady} />
      </div>
    </GoogleMapContext.Provider>
  );
}
