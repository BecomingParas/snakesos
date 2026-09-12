/**
 * GoogleMapMarker Component
 * Renders a native Google Maps marker without relying on the external wrapper
 * package that crashes during Next.js prerender.
 */

'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { createRoot } from 'react-dom/client';
import { useGoogleMap } from './GoogleMapWrapper';

export interface GoogleMapMarkerProps {
  id: string;
  position: google.maps.LatLngLiteral;
  title?: string;
  icon?: string | google.maps.Icon | google.maps.Symbol;
  onClick?: (markerId: string, event: google.maps.MapMouseEvent) => void;
  onDoubleClick?: (markerId: string, event: google.maps.MapMouseEvent) => void;
  onMouseOver?: (markerId: string) => void;
  onMouseOut?: (markerId: string) => void;
  onDragEnd?: (
    markerId: string,
    newPosition: google.maps.LatLngLiteral,
  ) => void;
  infoWindowContent?: React.ReactNode;
  infoWindowOpen?: boolean;
  zIndex?: number;
  draggable?: boolean;
  animation?: google.maps.Animation;
  opacity?: number;
  cursor?: string;
  label?: string | google.maps.MarkerLabel;
  infoWindowStyle?: CSSProperties;
}

export function GoogleMapMarker({
  id,
  position,
  title,
  icon,
  onClick,
  onDoubleClick,
  onMouseOver,
  onMouseOut,
  onDragEnd,
  infoWindowContent,
  infoWindowOpen: initialInfoWindowOpen = false,
  zIndex,
  draggable = false,
  animation,
  opacity,
  cursor,
  label,
  infoWindowStyle,
}: GoogleMapMarkerProps) {
  const { map, isReady } = useGoogleMap();
  const markerRef = useRef<google.maps.Marker | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const [showInfoWindow, setShowInfoWindow] = useState(
    initialInfoWindowOpen || !!infoWindowContent,
  );

  useEffect(() => {
    if (!map || !isReady || typeof window === 'undefined' || !window.google?.maps) {
      return undefined;
    }

    const marker = new google.maps.Marker({
      position,
      map,
      title,
      icon: icon as google.maps.Icon | string | google.maps.Symbol | undefined,
      draggable,
      zIndex,
      animation,
      opacity,
      cursor,
      label,
    });

    markerRef.current = marker;

    const handleClick = (event: google.maps.MapMouseEvent) => {
      setShowInfoWindow(true);
      onClick?.(id, event);
    };

    const handleDblClick = (event: google.maps.MapMouseEvent) => {
      onDoubleClick?.(id, event);
    };

    const handleMouseOver = () => onMouseOver?.(id);
    const handleMouseOut = () => onMouseOut?.(id);
    const handleDragEnd = (event: google.maps.MapMouseEvent) => {
      const nextPosition = {
        lat: event.latLng?.lat() ?? position.lat,
        lng: event.latLng?.lng() ?? position.lng,
      };
      onDragEnd?.(id, nextPosition);
    };

    marker.addListener('click', handleClick);
    marker.addListener('dblclick', handleDblClick);
    marker.addListener('mouseover', handleMouseOver);
    marker.addListener('mouseout', handleMouseOut);
    marker.addListener('dragend', handleDragEnd);

    if (infoWindowContent) {
      const container = document.createElement('div');
      const root = createRoot(container);
      root.render(<div style={infoWindowStyle}>{infoWindowContent}</div>);

      const infoWindow = new google.maps.InfoWindow({ content: container });
      infoWindowRef.current = infoWindow;

      marker.addListener('click', () => {
        infoWindow.open({ anchor: marker, map });
      });

      if (showInfoWindow) {
        infoWindow.open({ anchor: marker, map });
      }
    }

    return () => {
      google.maps.event.clearInstanceListeners(marker);
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
        infoWindowRef.current = null;
      }
      marker.setMap(null);
      markerRef.current = null;
    };
  }, [animation, cursor, draggable, icon, id, infoWindowContent, infoWindowStyle, isReady, label, map, onClick, onDoubleClick, onDragEnd, onMouseOut, onMouseOver, opacity, position, title, zIndex]);

  useEffect(() => {
    if (!infoWindowRef.current || !markerRef.current) return;
    if (showInfoWindow) {
      infoWindowRef.current.open({
        anchor: markerRef.current,
        map: markerRef.current.getMap(),
      });
    } else {
      infoWindowRef.current.close();
    }
  }, [showInfoWindow]);

  return null;
}

export default GoogleMapMarker;
