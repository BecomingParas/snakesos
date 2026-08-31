/**
 * GoogleMapMarker Component
 * Renders a marker on Google Maps with custom icon and info window
 */

'use client';

import { useState, CSSProperties, useEffect } from 'react';
import { Marker, InfoWindow, useGoogleMap } from '@react-google-maps/api';

// Declare google as a global to access Google Maps API types
declare const google: any;

export interface GoogleMapMarkerProps {
  /**
   * Unique identifier for the marker
   */
  id: string;

  /**
   * Position of the marker
   */
  position: google.maps.LatLngLiteral;

  /**
   * Marker title (shown on hover)
   */
  title?: string;

  /**
   * Marker icon
   */
  icon?: string | google.maps.Icon | google.maps.Symbol;

  /**
   * Click handler
   */
  onClick?: (markerId: string, event: google.maps.MapMouseEvent) => void;

  /**
   * Double-click handler
   */
  onDoubleClick?: (markerId: string, event: google.maps.MapMouseEvent) => void;

  /**
   * Mouse over handler
   */
  onMouseOver?: (markerId: string) => void;

  /**
   * Mouse out handler
   */
  onMouseOut?: (markerId: string) => void;

  /**
   * Drag end handler
   */
  onDragEnd?: (
    markerId: string,
    newPosition: google.maps.LatLngLiteral,
  ) => void;

  /**
   * Info window content
   */
  infoWindowContent?: React.ReactNode;

  /**
   * Whether info window is initially open
   */
  infoWindowOpen?: boolean;

  /**
   * Z-index of the marker
   */
  zIndex?: number;

  /**
   * Whether marker is draggable
   */
  draggable?: boolean;

  /**
   * Marker animation
   */
  animation?: google.maps.Animation;

  /**
   * Marker opacity (0-1)
   */
  opacity?: number;

  /**
   * Marker cursor
   */
  cursor?: string;

  /**
   * Marker label
   */
  label?: string | google.maps.MarkerLabel;

  /**
   * Custom styles for info window content
   */
  infoWindowStyle?: CSSProperties;
}

/**
 * GoogleMapMarker - Renders a marker on Google Maps
 */
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
  const map = useGoogleMap();
  const [showInfoWindow, setShowInfoWindow] = useState(
    initialInfoWindowOpen || !!infoWindowContent,
  );

  // Safety check: only render if Google Maps API and map instance are available
  if (typeof window === 'undefined' || !window.google?.maps || !map) {
    return null;
  }

  const handleClick = (e: google.maps.MapMouseEvent) => {
    setShowInfoWindow(true);
    onClick?.(id, e);
  };

  const handleDoubleClick = (e: google.maps.MapMouseEvent) => {
    onDoubleClick?.(id, e);
  };

  const handleDragEnd = (e: google.maps.MapMouseEvent) => {
    const newPosition = {
      lat: e.latLng?.lat() ?? position.lat,
      lng: e.latLng?.lng() ?? position.lng,
    };
    onDragEnd?.(id, newPosition);
  };

  // Wrap marker rendering with error suppression
  return (
    <>
      <Marker
        position={position}
        title={title}
        icon={icon}
        onClick={handleClick}
        onDblClick={handleDoubleClick}
        onMouseOver={() => onMouseOver?.(id)}
        onMouseOut={() => onMouseOut?.(id)}
        onDragEnd={handleDragEnd}
        zIndex={zIndex}
        draggable={draggable}
        animation={animation}
        opacity={opacity}
        cursor={cursor}
        label={label}
      />
      {showInfoWindow && infoWindowContent && (
        <InfoWindow
          position={position}
          onCloseClick={() => setShowInfoWindow(false)}
        >
          <div style={infoWindowStyle}>{infoWindowContent}</div>
        </InfoWindow>
      )}
    </>
  );
}

export default GoogleMapMarker;
