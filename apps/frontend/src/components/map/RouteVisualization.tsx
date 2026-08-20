/**
 * Route Visualization Component
 * Displays route polyline and waypoints on Leaflet map
 */

'use client';

import { Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { Route } from '@/lib/map/routing.types';

interface RouteVisualizationProps {
  route: Route;
  startLabel?: string;
  endLabel?: string;
  color?: string;
  weight?: number;
  opacity?: number;
  showWaypoints?: boolean;
  emergencyMode?: boolean;
}

/**
 * Render a route on the map with polyline and optional waypoint markers
 */
export function RouteVisualization({
  route,
  startLabel = 'Start',
  endLabel = 'Destination',
  color = '#3b82f6',
  weight = 4,
  opacity = 0.8,
  showWaypoints = false,
  emergencyMode = false,
}: RouteVisualizationProps) {
  if (!route || route.coordinates.length === 0) {
    return null;
  }

  const positions = route.coordinates.map((coord) => [coord.lat, coord.lng] as [number, number]);
  const startPoint = route.coordinates[0];
  const endPoint = route.coordinates[route.coordinates.length - 1];

  // Use red color for emergency mode
  const lineColor = emergencyMode ? '#dc2626' : color;

  return (
    <>
      {/* Route Polyline */}
      <Polyline
        positions={positions}
        pathOptions={{
          color: lineColor,
          weight,
          opacity,
          dashArray: emergencyMode ? '10, 5' : undefined,
          lineCap: 'round',
          lineJoin: 'round',
        }}
      />

      {/* Start Waypoint Marker */}
      {showWaypoints && (
        <Marker
          position={[startPoint.lat, startPoint.lng]}
          icon={L.divIcon({
            className: 'route-waypoint-start',
            html: `
              <div style="
                background: ${emergencyMode ? '#dc2626' : '#10b981'};
                width: 32px;
                height: 32px;
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
                font-weight: bold;
                color: white;
              ">A</div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          })}
        >
          <Popup>
            <div className="text-sm">
              <strong>{startLabel}</strong>
            </div>
          </Popup>
        </Marker>
      )}

      {/* End Waypoint Marker */}
      {showWaypoints && (
        <Marker
          position={[endPoint.lat, endPoint.lng]}
          icon={L.divIcon({
            className: 'route-waypoint-end',
            html: `
              <div style="
                background: ${emergencyMode ? '#dc2626' : '#3b82f6'};
                width: 32px;
                height: 32px;
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
                font-weight: bold;
                color: white;
              ">B</div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          })}
        >
          <Popup>
            <div className="text-sm">
              <strong>{endLabel}</strong>
            </div>
          </Popup>
        </Marker>
      )}
    </>
  );
}
