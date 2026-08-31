'use client';

import { useEffect, useMemo, useRef } from 'react';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { GoogleMapMarker } from './GoogleMapMarker';
import type { MapMarker } from './map.types';

interface ClusteredMarkersProps {
  /**
   * Array of markers to cluster
   */
  markers: MapMarker[];

  /**
   * Called when a marker is clicked
   */
  onMarkerClick?: (markerId: string) => void;

  /**
   * Minimum number of markers to start clustering
   * Default: 20
   * Note: Clustering with @react-google-maps/marker-clusterer can be enabled
   * for improved performance with 100+ markers
   */
  clusterStartThreshold?: number;

  /**
   * Google Map instance used for native clustering
   */
  map?: google.maps.Map | null;

  /**
   * Info window content renderer
   */
  infoWindowContent?: (marker: MapMarker) => React.ReactNode;

  /**
   * Selected marker ID to show open info window
   */
  selectedMarkerId?: string | null;

  /**
   * Custom marker icon
   */
  markerIcon?: google.maps.Icon | ((marker: MapMarker) => google.maps.Icon);

  /**
   * Draggable markers
   */
  draggable?: boolean;

  /**
   * Marker click handler (alternative to onMarkerClick)
   */
  onClick?: (marker: MapMarker) => void;
}

/**
 * ClusteredMarkers Component
 *
 * Renders markers on a Google Map and clusters large marker sets when a map
 * instance is provided.
 *
 */
export function ClusteredMarkers({
  markers,
  onMarkerClick,
  clusterStartThreshold = 200,
  map = null,
  infoWindowContent,
  selectedMarkerId,
  markerIcon,
  draggable = false,
  onClick,
}: ClusteredMarkersProps) {
  const clustererRef = useRef<MarkerClusterer | null>(null);
  const nativeMarkersRef = useRef<google.maps.Marker[]>([]);
  const shouldCluster = Boolean(map && markers.length >= clusterStartThreshold);

  useEffect(() => {
    if (!shouldCluster || !map) {
      return undefined;
    }

    const nativeMarkers = markers.map((marker) => {
      const nativeMarker = new google.maps.Marker({
        position: marker.position,
        title: marker.title,
        icon: typeof markerIcon === 'function' ? markerIcon(marker) : markerIcon,
        draggable,
      });

      nativeMarker.addListener('click', () => {
        onMarkerClick?.(marker.id);
        onClick?.(marker);
      });

      return nativeMarker;
    });

    nativeMarkersRef.current = nativeMarkers;
    clustererRef.current = new MarkerClusterer({ map, markers: nativeMarkers });

    return () => {
      clustererRef.current?.clearMarkers();
      clustererRef.current = null;
      nativeMarkers.forEach((nativeMarker) => {
        google.maps.event.clearInstanceListeners(nativeMarker);
        nativeMarker.setMap(null);
      });
      nativeMarkersRef.current = [];
    };
  }, [map, markers, markerIcon, draggable, onMarkerClick, onClick, shouldCluster]);

  const renderedMarkers = useMemo(() => {
    if (shouldCluster) {
      return null;
    }

    return markers.map((marker) => {
      const isSelected = selectedMarkerId === marker.id;
      const iconFn = typeof markerIcon === 'function' ? markerIcon : () => markerIcon;

      return (
        <GoogleMapMarker
          key={marker.id}
          id={marker.id}
          position={marker.position}
          title={marker.title}
          icon={markerIcon ? iconFn(marker) : undefined}
          draggable={draggable}
          onClick={(markerId) => {
            onMarkerClick?.(markerId);
            onClick?.(marker);
          }}
          infoWindowOpen={isSelected}
          infoWindowContent={infoWindowContent?.(marker)}
        />
      );
    });
  }, [markers, selectedMarkerId, markerIcon, draggable, infoWindowContent, onMarkerClick, onClick, shouldCluster]);

  return <>{renderedMarkers}</>;
}

export default ClusteredMarkers;
