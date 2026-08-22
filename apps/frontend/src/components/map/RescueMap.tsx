/**
 * RescueMap Component
 * Interactive map showing rescue requests and rescuer locations using Leaflet
 */

'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { formatDistance, calculateDistance, estimateTravelTime } from '@/lib/map/distance';
import { isValidCoordinate, filterValidCoordinates } from '@/lib/map/coordinates';

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
  assignedVolunteerId?: string;
}

export interface RescuerLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  phone?: string;
  status?: string;
  experience?: string;
  totalRescues?: number;
  municipality?: string;
}

export interface HospitalLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  municipality?: string;
  district?: string;
  phone?: string;
  emergencyPhone?: string;
  antivenomStatus?: string;
  emergency24x7?: boolean;
  distance?: number;
  distanceFormatted?: string;
}

export interface HotspotLocation {
  id: string;
  name: string;
  district?: string;
  province?: string;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH' | 'EXTREME';
  riskScore: number;
  source: string;
  sourceUrl?: string;
  studyYear?: number;
  populationAtRisk?: number;
}

interface RescueMapProps {
  rescues: RescueLocation[];
  rescuers?: RescuerLocation[];
  hospitals?: HospitalLocation[];
  hotspots?: HotspotLocation[];
  center?: [number, number];
  zoom?: number;
  userLocation?: { latitude: number; longitude: number } | null;
  selectedRescueId?: string | null;
  onRescueClick?: (rescueId: string) => void;
  onHospitalClick?: (hospitalId: string) => void;
  showAccuracyCircle?: boolean;
  showRoutes?: boolean;
}

// Map updater component to handle center changes with smooth animation
function MapUpdater({ center, zoom }: { center: [number, number]; zoom?: number }) {
  const map = useMap();
  
  // Only update if center has meaningfully changed (not just from default)
  useEffect(() => {
    // Don't animate on initial load
    const currentCenter = map.getCenter();
    const distance = Math.sqrt(
      Math.pow(currentCenter.lat - center[0], 2) + 
      Math.pow(currentCenter.lng - center[1], 2)
    );
    
    // Only fly to if distance is significant (> 0.1 degrees, ~11km)
    if (distance > 0.1) {
      map.flyTo(center, zoom || map.getZoom(), {
        duration: 1.5,
        easeLinearity: 0.25,
      });
    }
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
  hospitals = [],
  hotspots = [],
  center = [27.7172, 85.324], // Kathmandu default
  zoom = 13,
  userLocation,
  selectedRescueId,
  onRescueClick,
  onHospitalClick,
  showAccuracyCircle = true,
  showRoutes = true,
}: RescueMapProps) {
  const [mapCenter, setMapCenter] = useState<[number, number]>(center);
  const [mapZoom, setMapZoom] = useState(zoom);
  const [selectedRescueForRoute, setSelectedRescueForRoute] = useState<string | null>(null);
  const [showHospitalRoute, setShowHospitalRoute] = useState<string | null>(null);

  // Filter out rescues and rescuers with invalid coordinates
  const validRescues = filterValidCoordinates(rescues);
  const validRescuers = filterValidCoordinates(rescuers);
  
  // Filter hospitals with valid coordinates (using latitude/longitude instead of lat/lng)
  const validHospitals = hospitals.filter(h => 
    isValidCoordinate(h.latitude, h.longitude)
  );

  // Calculate routes between IN_PROGRESS rescues and their nearest rescuers
  const routes: Array<{
    rescueId: string;
    rescuerName: string;
    rescuerId: string;
    path: [number, number][];
    distance: number;
    status: string;
  }> = [];

  // Calculate hospital routes for selected rescues
  const hospitalRoutes: Array<{
    rescueId: string;
    hospitalName: string;
    hospitalId: string;
    path: [number, number][];
    distance: number;
    hospitalLat: number;
    hospitalLng: number;
  }> = [];

  validRescues.forEach((rescue) => {
    // Only show routes for active rescues (ASSIGNED or IN_PROGRESS)
    if (rescue.status === 'IN_PROGRESS' || rescue.status === 'ASSIGNED') {
      // Find assigned rescuer or nearest available rescuer
      let assignedRescuer = null;
      
      // Try to find assigned rescuer by ID
      if ((rescue as any).assignedVolunteerId) {
        assignedRescuer = validRescuers.find(r => r.id === (rescue as any).assignedVolunteerId);
      }
      
      // If no assigned rescuer, find nearest one
      if (!assignedRescuer) {
        const nearestRescuer = validRescuers.reduce((nearest: any, rescuer: any) => {
          const distance = calculateDistance(
            rescue.lat,
            rescue.lng,
            rescuer.lat,
            rescuer.lng
          );
          
          if (!nearest || distance < nearest.distance) {
            return { rescuer, distance };
          }
          return nearest;
        }, null as any);

        if (nearestRescuer && nearestRescuer.distance < 50) { // Only show routes within 50km
          routes.push({
            rescueId: rescue.id,
            rescuerName: nearestRescuer.rescuer.name,
            rescuerId: nearestRescuer.rescuer.id,
            path: [
              [nearestRescuer.rescuer.lat, nearestRescuer.rescuer.lng],
              [rescue.lat, rescue.lng],
            ],
            distance: nearestRescuer.distance,
            status: rescue.status,
          });
        }
      } else {
        const distance = calculateDistance(
          rescue.lat,
          rescue.lng,
          assignedRescuer.lat,
          assignedRescuer.lng
        );
        
        routes.push({
          rescueId: rescue.id,
          rescuerName: assignedRescuer.name,
          rescuerId: assignedRescuer.id,
          path: [
            [assignedRescuer.lat, assignedRescuer.lng],
            [rescue.lat, rescue.lng],
          ],
          distance,
          status: rescue.status,
        });
      }
    }
    
    // Calculate route to nearest hospital for selected rescues
    if (selectedRescueForRoute === rescue.id || showHospitalRoute === rescue.id) {
      const nearestHospital = validHospitals.reduce((nearest: any, hospital: any) => {
        const distance = calculateDistance(
          rescue.lat,
          rescue.lng,
          hospital.latitude,
          hospital.longitude
        );
        
        if (!nearest || distance < nearest.distance) {
          return { hospital, distance };
        }
        return nearest;
      }, null as any);

      if (nearestHospital) {
        // Debug logging for hospital coordinates
        console.log(`[RescueMap] Nearest hospital for rescue ${rescue.id}:`, {
          name: nearestHospital.hospital.name,
          lat: nearestHospital.hospital.latitude,
          lng: nearestHospital.hospital.longitude,
          distance: nearestHospital.distance,
        });
        
        hospitalRoutes.push({
          rescueId: rescue.id,
          hospitalName: nearestHospital.hospital.name,
          hospitalId: nearestHospital.hospital.id,
          path: [
            [rescue.lat, rescue.lng],
            [nearestHospital.hospital.latitude, nearestHospital.hospital.longitude],
          ],
          distance: nearestHospital.distance,
          hospitalLat: nearestHospital.hospital.latitude,
          hospitalLng: nearestHospital.hospital.longitude,
        });
      }
    }
  });

  // Show warning if some items were filtered out
  const invalidRescueCount = rescues.length - validRescues.length;
  const invalidRescuerCount = rescuers.length - validRescuers.length;
  const invalidHospitalCount = hospitals.length - validHospitals.length;

  // Update center when prop changes (e.g., different rescue selected)
  // Use JSON.stringify to compare array values, not references
  // Only update if center is explicitly provided and different
  useEffect(() => {
    if (center) {
      const centerStr = JSON.stringify(center);
      const currentStr = JSON.stringify(mapCenter);
      if (centerStr !== currentStr) {
        setMapCenter(center);
      }
    }
  }, [center]);

  // Update zoom when it changes
  useEffect(() => {
    if (zoom !== mapZoom) {
      setMapZoom(zoom);
    }
  }, [zoom]);

  return (
    <>
      {/* Warning banner for invalid coordinates */}
      {(invalidRescueCount > 0 || invalidRescuerCount > 0 || invalidHospitalCount > 0) && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] max-w-md">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg shadow-lg p-3 text-sm">
            <p className="text-yellow-800 font-medium">
              ⚠️ Some locations have invalid coordinates
            </p>
            {invalidRescueCount > 0 && (
              <p className="text-yellow-700 text-xs mt-1">
                {invalidRescueCount} rescue{invalidRescueCount > 1 ? 's' : ''} not shown
              </p>
            )}
            {invalidRescuerCount > 0 && (
              <p className="text-yellow-700 text-xs">
                {invalidRescuerCount} rescuer{invalidRescuerCount > 1 ? 's' : ''} not shown
              </p>
            )}
            {invalidHospitalCount > 0 && (
              <p className="text-yellow-700 text-xs">
                {invalidHospitalCount} hospital{invalidHospitalCount > 1 ? 's' : ''} not shown
              </p>
            )}
          </div>
        </div>
      )}

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

      {/* Route Lines between Rescuers and Active Rescues */}
      {showRoutes && routes.map((route, index) => {
        // Color based on status
        const routeColor = route.status === 'IN_PROGRESS' ? '#8b5cf6' : '#3b82f6'; // purple for in-progress, blue for assigned
        const routeWeight = route.status === 'IN_PROGRESS' ? 4 : 3;
        
        return (
          <Polyline
            key={`route-${route.rescueId}-${index}`}
            positions={route.path}
            pathOptions={{
              color: routeColor,
              weight: routeWeight,
              opacity: 0.8,
              dashArray: route.status === 'IN_PROGRESS' ? '10, 5' : '10, 10',
            }}
          >
            <Popup>
              <div className="text-sm">
                <strong className="text-purple-600">🚗 Rescuer Route</strong>
                <p className="text-xs text-slate-700 mt-1">
                  <strong>Rescuer:</strong> {route.rescuerName}
                </p>
                <p className="text-xs text-slate-700">
                  <strong>Distance:</strong> {formatDistance(route.distance)}
                </p>
                <p className="text-xs text-slate-700">
                  <strong>Est. Time:</strong> {estimateTravelTime(route.distance)}
                </p>
                <p className="text-xs mt-1">
                  <span className={`px-2 py-0.5 rounded ${
                    route.status === 'IN_PROGRESS' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {route.status}
                  </span>
                </p>
              </div>
            </Popup>
          </Polyline>
        );
      })}

      {/* Hospital Routes (shown when rescue is clicked) */}
      {hospitalRoutes.map((route, index) => (
        <Polyline
          key={`hospital-route-${route.rescueId}-${index}`}
          positions={route.path}
          pathOptions={{
            color: '#10b981', // green for hospital routes
            weight: 3,
            opacity: 0.7,
            dashArray: '5, 10',
          }}
        >
          <Popup>
            <div className="text-sm">
              <strong className="text-green-600">🏥 Hospital Route</strong>
              <p className="text-xs text-slate-700 mt-1">
                <strong>Hospital:</strong> {route.hospitalName}
              </p>
              <p className="text-xs text-slate-700">
                <strong>Distance:</strong> {formatDistance(route.distance)}
              </p>
              <p className="text-xs text-slate-700">
                <strong>Est. Time:</strong> {estimateTravelTime(route.distance)}
              </p>
            </div>
          </Popup>
        </Polyline>
      ))}

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
      {validRescuers.map((rescuer) => {
        // Determine marker color based on status
        const rescuerColor = rescuer.status === 'AVAILABLE' ? '#10b981' : '#f59e0b'; // green for available, amber for busy
        
        return (
          <Marker
            key={`rescuer-${rescuer.id}`}
            position={[rescuer.lat, rescuer.lng]}
            icon={L.divIcon({
              className: 'rescuer-marker',
              html: `
                <div style="
                  background: ${rescuerColor};
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
              <div className="text-sm min-w-[220px]">
                <strong className="text-green-600">🚑 Rescuer: {rescuer.name}</strong>
                
                <div className="mt-2 space-y-1">
                  {rescuer.phone && (
                    <p className="text-xs text-slate-700">
                      <strong>Phone:</strong> 📞 {rescuer.phone}
                    </p>
                  )}
                  
                  {rescuer.municipality && (
                    <p className="text-xs text-slate-600">
                      <strong>Location:</strong> {rescuer.municipality}
                    </p>
                  )}
                  
                  {rescuer.experience && (
                    <p className="text-xs text-slate-700">
                      <strong>Experience:</strong> {rescuer.experience}
                    </p>
                  )}
                  
                  {rescuer.totalRescues !== undefined && (
                    <p className="text-xs text-slate-700">
                      <strong>Total Rescues:</strong> {rescuer.totalRescues}
                    </p>
                  )}
                  
                  {rescuer.status && (
                    <p className="text-xs mt-2">
                      <strong>Status:</strong>{' '}
                      <span className={`px-2 py-0.5 rounded ${
                        rescuer.status === 'AVAILABLE' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {rescuer.status}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}

      {/* Hospital Markers */}
      {validHospitals.map((hospital) => {
        // Determine hospital marker color based on antivenom status
        const getHospitalColor = (status?: string): string => {
          switch (status?.toUpperCase()) {
            case 'AVAILABLE':
              return '#16a34a'; // green-600 - Verified available
            case 'OUT_OF_STOCK':
              return '#dc2626'; // red-600 - Out of stock
            case 'UNKNOWN':
            default:
              return '#ca8a04'; // yellow-600 - Unknown/not verified
          }
        };

        const hospitalColor = getHospitalColor(hospital.antivenomStatus);
        
        // Calculate distance if user location is available
        const distance = userLocation && hospital.latitude && hospital.longitude
          ? calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              hospital.latitude,
              hospital.longitude
            )
          : hospital.distance || null;

        return (
          <Marker
            key={`hospital-${hospital.id}`}
            position={[hospital.latitude, hospital.longitude]}
            icon={L.divIcon({
              className: 'hospital-marker',
              html: `
                <div style="
                  background: ${hospitalColor};
                  width: 44px;
                  height: 44px;
                  border-radius: 50%;
                  border: 4px solid white;
                  box-shadow: 0 2px 12px rgba(0,0,0,0.5);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 22px;
                  cursor: pointer;
                ">🏥</div>
              `,
              iconSize: [44, 44],
              iconAnchor: [22, 22],
            })}
            eventHandlers={{
              click: () => onHospitalClick?.(hospital.id),
            }}
          >
            <Popup>
              <div className="text-sm min-w-[220px]">
                <strong className="text-slate-900">🏥 {hospital.name}</strong>
                
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-slate-700">
                    <strong>Location:</strong> {hospital.address}
                  </p>
                  
                  {hospital.municipality && (
                    <p className="text-xs text-slate-600">
                      {hospital.municipality}, {hospital.district}
                    </p>
                  )}
                  
                  {hospital.phone && (
                    <p className="text-xs text-slate-700 mt-2">
                      <strong>Phone:</strong> 📞 {hospital.phone}
                    </p>
                  )}
                  
                  {hospital.emergencyPhone && (
                    <p className="text-xs text-red-700">
                      <strong>Emergency:</strong> 📞 {hospital.emergencyPhone}
                    </p>
                  )}
                  
                  <div className="mt-2 pt-2 border-t border-slate-200">
                    <p className="text-xs">
                      <strong>Antivenom Status:</strong>{' '}
                      <span className={`px-2 py-0.5 rounded ${
                        hospital.antivenomStatus === 'AVAILABLE'
                          ? 'bg-green-100 text-green-800'
                          : hospital.antivenomStatus === 'OUT_OF_STOCK'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {hospital.antivenomStatus === 'AVAILABLE'
                          ? '✓ Available'
                          : hospital.antivenomStatus === 'OUT_OF_STOCK'
                          ? '✗ Out of Stock'
                          : '? Unknown'}
                      </span>
                    </p>
                    
                    {hospital.emergency24x7 && (
                      <p className="text-xs text-blue-600 mt-1">
                        ⏰ 24/7 Emergency Services
                      </p>
                    )}
                  </div>
                  
                  {distance !== null && (
                    <div className="mt-2 pt-2 border-t border-slate-200">
                      <p className="text-xs text-blue-600 font-semibold">
                        📍 {hospital.distanceFormatted || formatDistance(distance)}
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

      {/* Snakebite Hotspot Markers (Research Data) */}
      {hotspots.map((hotspot) => {
        // Determine hotspot marker color based on risk level
        const getHotspotColor = (riskLevel: string): string => {
          switch (riskLevel) {
            case 'EXTREME':
              return '#7f1d1d'; // red-900
            case 'VERY_HIGH':
              return '#dc2626'; // red-600
            case 'HIGH':
              return '#ea580c'; // orange-600
            case 'MODERATE':
              return '#f59e0b'; // amber-500
            case 'LOW':
            default:
              return '#84cc16'; // lime-500
          }
        };

        const hotspotColor = getHotspotColor(hotspot.riskLevel);
        
        // Use district center as approximate location (can be enhanced with geometry later)
        const districtCenters: Record<string, [number, number]> = {
          'Sarlahi': [27.0, 85.5],
          'Saptari': [26.7, 86.7],
          'Sunsari': [26.6, 87.2],
          'Rupandehi': [27.6, 83.5],
          'Mahottari': [27.1, 85.9],
          'Dhanusa': [26.8, 86.0],
          'Makwanpur': [27.5, 85.0],
          'Siraha': [26.6, 86.2],
          'Dang': [28.1, 82.3],
        };

        const position = districtCenters[hotspot.district || ''] || [27.7, 85.3];

        return (
          <Circle
            key={`hotspot-${hotspot.id}`}
            center={position}
            radius={25000} // 25km radius
            pathOptions={{
              color: hotspotColor,
              fillColor: hotspotColor,
              fillOpacity: 0.15,
              weight: 2,
              opacity: 0.6,
            }}
          >
            <Popup>
              <div className="text-sm min-w-[280px]">
                <strong className="text-red-700 flex items-center gap-2">
                  🔥 {hotspot.name}
                </strong>
                
                <div className="mt-2 space-y-1">
                  <p className="text-xs">
                    <strong>Risk Level:</strong>{' '}
                    <span className={`px-2 py-0.5 rounded font-semibold ${
                      hotspot.riskLevel === 'VERY_HIGH' || hotspot.riskLevel === 'EXTREME'
                        ? 'bg-red-100 text-red-800'
                        : hotspot.riskLevel === 'HIGH'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {hotspot.riskLevel.replace('_', ' ')}
                    </span>
                  </p>
                  
                  <p className="text-xs">
                    <strong>Risk Score:</strong> {(hotspot.riskScore * 100).toFixed(0)}%
                  </p>
                  
                  <p className="text-xs text-slate-600">
                    <strong>District:</strong> {hotspot.district}, {hotspot.province}
                  </p>
                  
                  {hotspot.populationAtRisk && (
                    <p className="text-xs text-slate-600">
                      <strong>Population at Risk:</strong> {hotspot.populationAtRisk.toLocaleString()}
                    </p>
                  )}
                  
                  <div className="mt-2 pt-2 border-t border-slate-200">
                    <p className="text-xs text-slate-700">
                      <strong>📚 Research Source:</strong>
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      {hotspot.source}
                    </p>
                    {hotspot.studyYear && (
                      <p className="text-xs text-slate-500">
                        Study Year: {hotspot.studyYear}
                      </p>
                    )}
                    {hotspot.sourceUrl && (
                      <a
                        href={hotspot.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline block mt-1"
                      >
                        🔗 View Research Paper
                      </a>
                    )}
                  </div>
                  
                  <div className="mt-2 pt-2 border-t border-slate-200 bg-blue-50 p-2 rounded">
                    <p className="text-xs text-blue-800 font-semibold">
                      ℹ️ Research Data
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                      This hotspot is based on peer-reviewed scientific research, not live SnakeSOS data.
                    </p>
                  </div>
                </div>
              </div>
            </Popup>
          </Circle>
        );
      })}

      {/* Rescue Request Markers */}
      {validRescues.map((rescue) => {
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
                  
                  {/* Hospital Route Button */}
                  <div className="mt-3 pt-2 border-t border-slate-200">
                    <button
                      onClick={() => {
                        if (showHospitalRoute === rescue.id) {
                          setShowHospitalRoute(null);
                        } else {
                          setShowHospitalRoute(rescue.id);
                          setSelectedRescueForRoute(rescue.id);
                        }
                      }}
                      className={`w-full px-3 py-2 text-xs font-medium rounded transition-colors ${
                        showHospitalRoute === rescue.id
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {showHospitalRoute === rescue.id ? '✗ Hide Hospital Route' : '🏥 Show Hospital Route'}
                    </button>
                    {showHospitalRoute === rescue.id && (() => {
                      const hospitalRoute = hospitalRoutes.find(r => r.rescueId === rescue.id);
                      return hospitalRoute ? (
                        <div className="mt-2 p-2 bg-green-50 rounded border border-green-200">
                          <p className="text-xs text-green-800 font-semibold">
                            🏥 {hospitalRoute.hospitalName}
                          </p>
                          <p className="text-xs text-slate-600 mt-1">
                            📍 {formatDistance(hospitalRoute.distance)} away
                          </p>
                          <p className="text-xs text-slate-500">
                            ⏱️ {estimateTravelTime(hospitalRoute.distance)}
                          </p>
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&origin=${rescue.lat},${rescue.lng}&destination=${hospitalRoute.hospitalLat},${hospitalRoute.hospitalLng}&travelmode=driving`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 flex items-center justify-center gap-1 w-full px-2 py-1.5 text-xs font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                          >
                            🗺️ Open in Google Maps
                          </a>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500 mt-2 text-center">
                          No hospitals available
                        </p>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
    </>
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
