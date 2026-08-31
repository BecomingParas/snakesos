'use client';

import { useEffect, useRef } from 'react';

interface HeatmapPoint {
  lat: number;
  lng: number;
  weight?: number; // 0-1, optional intensity weight
}

interface HeatmapLayerProps {
  /**
   * Points to display on the heatmap
   */
  points: HeatmapPoint[];

  /**
   * Visibility toggle
   */
  visible?: boolean;

  /**
   * Radius of each heat point
   */
  radius?: number;

  /**
   * Opacity of the heatmap layer (0-1)
   */
  opacity?: number;

  /**
   * Gradient colors for the heatmap
   * Default: red → orange → yellow → green → cyan
   */
  gradient?: string[];

  /**
   * Map reference (required)
   */
  map?: google.maps.Map | null;

  /**
   * Maximum intensity
   */
  maxIntensity?: number;
}

/**
 * HeatmapLayer Component
 *
 * Visualizes geographic data density and intensity using Google Maps Heatmap Layer.
 * Perfect for showing incident concentration, risk areas, or hotspots.
 *
 * Usage:
 * ```tsx
 * <GoogleMapWrapper ref={mapRef} center={{ lat: 27.7, lng: 85.3 }} zoom={13}>
 *   <HeatmapLayer
 *     points={incidentLocations}
 *     radius={25}
 *     opacity={0.7}
 *     gradient={['#FF0000', '#FFA500', '#FFFF00', '#00FF00', '#0000FF']}
 *     map={map}
 *   />
 * </GoogleMapWrapper>
 * ```
 */
export function HeatmapLayer({
  points,
  visible = true,
  radius = 25,
  opacity = 0.7,
  gradient = [
    '#FF0000', // Red (high intensity)
    '#FF6600', // Orange
    '#FFFF00', // Yellow
    '#00FF00', // Green
    '#0000FF', // Blue (low intensity)
  ],
  map,
  maxIntensity,
}: HeatmapLayerProps) {
  const heatmapRef = useRef<google.maps.visualization.HeatmapLayer | null>(null);

  // Initialize and update heatmap
  useEffect(() => {
    if (!map || !window.google?.maps?.visualization) {
      return undefined;
    }

    // Create heatmap if it doesn't exist
    if (!heatmapRef.current) {
      heatmapRef.current = new google.maps.visualization.HeatmapLayer({
        map,
        radius,
        opacity,
        gradient,
        maxIntensity,
      });
    } else {
      // Update existing heatmap properties using set method
      heatmapRef.current.set('radius', radius);
      heatmapRef.current.set('opacity', opacity);
      heatmapRef.current.set('gradient', gradient);
      if (maxIntensity !== undefined) {
        heatmapRef.current.set('maxIntensity', maxIntensity);
      }
    }

    // Control visibility
    heatmapRef.current.setMap(visible ? map : null);

    // Convert points to LatLng objects with weights
    const heatmapData = points.map((point) => {
      const latLng = new google.maps.LatLng(point.lat, point.lng);
      return point.weight ? { location: latLng, weight: point.weight } : latLng;
    });

    // Set data
    heatmapRef.current.setData(heatmapData);

    return () => {
      // Cleanup: remove layer when component unmounts
      if (heatmapRef.current) {
        heatmapRef.current.setMap(null);
        heatmapRef.current = null;
      }
    };
  }, [map, points, visible, radius, opacity, gradient, maxIntensity]);

  return null; // This is a non-rendering component that manages the heatmap layer
}

export default HeatmapLayer;
