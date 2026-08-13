/**
 * RescueMap Component
 * Interactive map showing rescue requests and rescuer locations using Leaflet
 */

'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { formatDistance, calculateDistance, estimateTravelTime } from '@/lib/map/distance';

// Fix for default marker icons in Next.js/Webpack
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
}

export interface RescueLocation {
  id: string;
  lat: number;
  lng: number;
  address: string;
  municipality?: string;
  status: string;
  priority: string;
  name?: string;
  phone?: string;
  snakeDescription?: string;
}

export interface RescuerLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  phone?: string;
  status?: string;
}

interface RescueMapProps {
  rescues: RescueLocation[];
  rescuers?: RescuerLocation[];
  center?: [number, number];
  zoom?: number;
  userLocation?: { latitude: number; longitude: number } | null;
  selectedRescueId?: string | null;
  onRescueClick?: (rescueId: string) => void;
  showAccuracyCircle?: boolean;
}

// Map updater component to handle center changes with smooth animation
function MapUpdater({ center, zoom }: { center: [number, number]; zoom?: number }) {
  const map = useMap();
  
  useEffect(() => {
    // Use flyTo for smooth animated transition instead of instant setView
    map.flyTo(center, zoom || map.getZoom(), {
      duration: 1.5, // Animation duration in seconds
      easeLinearity: 0.25, // Smoothness of animation
    });
  }, [center, zoom, map]);
  
  return null;
}

// Get priority color
function getPriorityColor(priority: string): string {
  switch (priority?.toUpperCase()) {
    case 'CRITICAL':
      return '#dc2626'; // red-600
    case 'HIGH':
      return '#ea580c'; // orange-600
    case 'MEDIUM':
      return '#ca8a04'; // yellow-600
    case 'LOW':
      return '#16a34a'; // green-600
    default:
      return '#6b7280'; // gray-500
  }
}

// Get status badge color
function getStatusBadgeColor(status: string): string {
  switch (status?.toUpperCase()) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'ASSIGNED':
      return 'bg-blue-100 text-blue-800';
    case 'IN_PROGRESS':
      return 'bg-purple-100 text-purple-800';
    case 'COMPLETED':
      return 'bg-green-100 text-green-800';
    case 'CANCELLED':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-slate-100 text-slate-800';
  }
}

export function RescueMap({
  rescues,
  rescuers = [],
  center = [27.7172, 85.324], // Kathmandu default
  zoom = 13,
  userLocation,
  selectedRescueId,
  onRescueClick,
  showAccuracyCircle = true,
}: RescueMapProps) {
  const [mapCenter, setMapCenter] = useState<[number, number]>(center);
  const [mapZoom, setMapZoom] = useState(zoom);

  // Update center when prop changes (e.g., different rescue selected)
  // Use JSON.stringify to compare array values, not references
  useEffect(() => {
    const centerStr = JSON.stringify(center);
    const currentStr = JSON.stringify(mapCenter);
    if (centerStr !== currentStr) {
      setMapCenter(center);
    }
  }, [center]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update zoom when it changes
  useEffect(() => {
    if (zoom !== mapZoom) {
      setMapZoom(zoom);
    }
  }, [zoom]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update center when user location is available
  useEffect(() => {
    if (userLocation) {
      setMapCenter([userLocation.latitude, userLocation.longitude]);
      setMapZoom(14);
    }
  }, [userLocation]);

  return (
    <MapContainer
      center={mapCenter}
      zoom={mapZoom}
      style={{ height: '100%', width: '100%', borderRadius: '8px' }}
      className="z-0"
      scrollWheelZoom={true}
    >
      {/* OpenStreetMap Tiles */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />
      
      <MapUpdater center={mapCenter} zoom={mapZoom} />

      {/* User Location Marker */}
      {userLocation && (
        <>
          <Marker
            position={[userLocation.latitude, userLocation.longitude]}
            icon={L.divIcon({
              className: 'user-location-marker',
              html: `
                <div style="
                  background: #3b82f6;
                  width: 20px;
                  height: 20px;
                  border-radius: 50%;
                  border: 3px solid white;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                  position: relative;
                "></div>
                <div style="
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  width: 12px;
                  height: 12px;
                  background: #60a5fa;
                  border-radius: 50%;
                  animation: pulse 2s infinite;
                "></div>
              `,
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            })}
          >
            <Popup>
              <div className="text-sm">
                <strong className="text-blue-600">📍 Your Location</strong>
                <p className="text-xs text-slate-600 mt-1">Current position</p>
              </div>
            </Popup>
          </Marker>
          
          {/* Accuracy circle */}
          {showAccuracyCircle && (
            <Circle
              center={[userLocation.latitude, userLocation.longitude]}
              radius={50}
              pathOptions={{
                fillColor: '#3b82f6',
                fillOpacity: 0.1,
                color: '#3b82f6',
                weight: 1,
              }}
            />
          )}
        </>
      )}

      {/* Rescuer Markers */}
      {rescuers.map((rescuer) => (
        <Marker
          key={`rescuer-${rescuer.id}`}
          position={[rescuer.lat, rescuer.lng]}
          icon={L.divIcon({
            className: 'rescuer-marker',
            html: `
              <div style="
                background: #10b981;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
              ">👨‍⚕️</div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          })}
        >
          <Popup>
            <div className="text-sm">
              <strong className="text-green-600">🚑 Rescuer: {rescuer.name}</strong>
              {rescuer.phone && (
                <p className="text-xs text-slate-600 mt-1">📞 {rescuer.phone}</p>
              )}
              {rescuer.status && (
                <p className="text-xs mt-1">
                  <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded">
                    {rescuer.status}
                  </span>
                </p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Rescue Request Markers */}
      {rescues.map((rescue) => {
        const isSelected = selectedRescueId === rescue.id;
        const priorityColor = getPriorityColor(rescue.priority);
        const statusBadge = getStatusBadgeColor(rescue.status);
        
        // Calculate distance if user location is available
        const distance = userLocation && rescue.lat && rescue.lng
          ? calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              rescue.lat,
              rescue.lng
            )
          : null;

        return (
          <Marker
            key={`rescue-${rescue.id}`}
            position={[rescue.lat, rescue.lng]}
            icon={L.divIcon({
              className: 'rescue-marker',
              html: `
                <div style="
                  background: ${priorityColor};
                  width: ${isSelected ? '40px' : '34px'};
                  height: ${isSelected ? '40px' : '34px'};
                  border-radius: 50%;
                  border: ${isSelected ? '4px' : '3px'} solid white;
                  box-shadow: 0 2px 8px rgba(0,0,0,${isSelected ? '0.5' : '0.3'});
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: ${isSelected ? '20px' : '18px'};
                  cursor: pointer;
                  transition: all 0.2s;
                ">🐍</div>
              `,
              iconSize: [isSelected ? 40 : 34, isSelected ? 40 : 34],
              iconAnchor: [isSelected ? 20 : 17, isSelected ? 20 : 17],
            })}
            eventHandlers={{
              click: () => onRescueClick?.(rescue.id),
            }}
          >
            <Popup>
              <div className="text-sm min-w-[200px]">
                <strong className="text-slate-900">🐍 Rescue Request</strong>
                
                <div className="mt-2 space-y-1">
                  <p className="text-xs">
                    <span className={`px-2 py-0.5 rounded ${statusBadge}`}>
                      {rescue.status}
                    </span>
                  </p>
                  
                  <p className="text-xs text-slate-700">
                    <strong>Location:</strong> {rescue.address}
                  </p>
                  
                  {rescue.municipality && (
                    <p className="text-xs text-slate-600">
                      {rescue.municipality}
                    </p>
                  )}
                  
                  {rescue.name && (
                    <p className="text-xs text-slate-700">
                      <strong>Contact:</strong> {rescue.name}
                    </p>
                  )}
                  
                  {rescue.phone && (
                    <p className="text-xs text-slate-600">📞 {rescue.phone}</p>
                  )}
                  
                  {rescue.snakeDescription && (
                    <p className="text-xs text-slate-700 mt-2">
                      <strong>Snake:</strong> {rescue.snakeDescription}
                    </p>
                  )}
                  
                  {distance !== null && (
                    <div className="mt-2 pt-2 border-t border-slate-200">
                      <p className="text-xs text-blue-600 font-semibold">
                        📍 {formatDistance(distance)}
                      </p>
                      <p className="text-xs text-slate-500">
                        {estimateTravelTime(distance)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

// Add pulse animation styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes pulse {
      0% {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
      }
      50% {
        transform: translate(-50%, -50%) scale(1.5);
        opacity: 0.5;
      }
      100% {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);
}
