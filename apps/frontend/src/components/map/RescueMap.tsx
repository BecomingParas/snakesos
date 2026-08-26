/**
 * RescueMap Component
 * Interactive map showing rescue requests and rescuer locations using Leaflet
 */

'use client';

import { useEffect, useId, useMemo, useState } from 'react';
import { useTheme } from 'next-themes';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Circle,
  Polyline,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  formatDistance,
  calculateDistance,
  estimateTravelTime,
} from '@/lib/map/distance';
import {
  isValidCoordinate,
  filterValidCoordinates,
} from '@/lib/map/coordinates';
import type {
  HospitalLocation,
  HotspotLocation,
  RescueLocation,
  RescueMapProps,
  RescuerLocation,
  UserLocation,
} from './map.types';
import {
  getHospitalColor,
  getHotspotColor,
  getPriorityColor,
  getStatusBadgeColor,
} from './mapColors';
import {
  createHospitalIcon,
  createRescueIcon,
  createRescuerIcon,
  createUserLocationIcon,
} from './mapIcons';
import { MAP_CONFIG } from './mapConfig';

// Fix for default marker icons in Next.js/Webpack
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as { _getIconUrl?: string })._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
}

interface RouteRescuer {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

interface RouteHospital {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

function findNearest<T>(items: T[], distanceFn: (item: T) => number): T | null {
  if (items.length === 0) return null;

  return items.reduce((nearest, current) =>
    distanceFn(current) < distanceFn(nearest) ? current : nearest,
  );
}

// Map updater component to handle center changes with smooth animation
function MapUpdater({
  center,
  zoom,
}: {
  center: [number, number];
  zoom?: number;
}) {
  const map = useMap();

  // Only update if center has meaningfully changed (not just from default)
  useEffect(() => {
    // Don't animate on initial load
    const currentCenter = map.getCenter();
    const distance = Math.sqrt(
      Math.pow(currentCenter.lat - center[0], 2) +
        Math.pow(currentCenter.lng - center[1], 2),
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
  tileTheme,
}: RescueMapProps) {
  const { resolvedTheme } = useTheme();
  const activeTileTheme =
    tileTheme ?? (resolvedTheme === 'dark' ? 'dark' : 'default');
  const mapInstanceKey = useId();
  const [mapCenter, setMapCenter] = useState<[number, number]>(center);
  const [mapZoom, setMapZoom] = useState(zoom);
  const [selectedRescueForRoute, setSelectedRescueForRoute] = useState<
    string | null
  >(null);
  const [showHospitalRoute, setShowHospitalRoute] = useState<string | null>(
    null,
  );

  // Filter out rescues and rescuers with invalid coordinates
  const validRescues = filterValidCoordinates(rescues);
  const validRescuers = Array.from(
    new Map(
      filterValidCoordinates(rescuers).map((rescuer) => [rescuer.id, rescuer]),
    ).values(),
  );

  // Filter hospitals with valid coordinates (using latitude/longitude instead of lat/lng)
  const validHospitals = hospitals.filter((h) =>
    isValidCoordinate(h.latitude, h.longitude),
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
      if (rescue.assignedVolunteerId) {
        assignedRescuer = validRescuers.find(
          (r) => r.id === rescue.assignedVolunteerId,
        );
      }

      // If no assigned rescuer, find nearest one
      if (!assignedRescuer) {
        const nearestRescuer = validRescuers.reduce<{
          rescuer: RescuerLocation;
          distance: number;
        } | null>((nearest, rescuer) => {
          const distance = calculateDistance(
            rescue.lat,
            rescue.lng,
            rescuer.lat,
            rescuer.lng,
          );

          if (!nearest || distance < nearest.distance) {
            return { rescuer, distance };
          }
          return nearest;
        }, null);

        if (
          nearestRescuer &&
          nearestRescuer.distance <= MAP_CONFIG.maxRescuerRouteDistanceKm
        ) {
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
          assignedRescuer.lng,
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
    if (
      selectedRescueForRoute === rescue.id ||
      showHospitalRoute === rescue.id
    ) {
      const nearestHospital = validHospitals.reduce<{
        hospital: HospitalLocation;
        distance: number;
      } | null>((nearest, hospital) => {
        const distance = calculateDistance(
          rescue.lat,
          rescue.lng,
          hospital.latitude,
          hospital.longitude,
        );

        if (!nearest || distance < nearest.distance) {
          return { hospital, distance };
        }
        return nearest;
      }, null);

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
            [
              nearestHospital.hospital.latitude,
              nearestHospital.hospital.longitude,
            ],
          ],
          distance: nearestHospital.distance,
          hospitalLat: nearestHospital.hospital.latitude,
          hospitalLng: nearestHospital.hospital.longitude,
        });
      }
    }
  });

  // Show warning if rescue or hospital items were filtered out.
  // Rescuer-only gaps are expected in assigned state when a volunteer has no
  // live coordinates yet; they should not trigger the global invalid-location banner.
  const invalidRescueCount = rescues.length - validRescues.length;
  const invalidHospitalCount = hospitals.length - validHospitals.length;
  const showCoordinateWarning =
    invalidRescueCount > 0 || invalidHospitalCount > 0;

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
      {showCoordinateWarning && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] max-w-md">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg shadow-lg p-3 text-sm">
            <p className="text-yellow-800 font-medium">
              ⚠️ Some locations have invalid coordinates
            </p>
            {invalidRescueCount > 0 && (
              <p className="text-yellow-700 text-xs mt-1">
                {invalidRescueCount} rescue
                {invalidRescueCount > 1 ? 's' : ''} not shown
              </p>
            )}
            {invalidHospitalCount > 0 && (
              <p className="text-yellow-700 text-xs">
                {invalidHospitalCount} hospital
                {invalidHospitalCount > 1 ? 's' : ''} not shown
              </p>
            )}
          </div>
        </div>
      )}

      <MapContainer
        key={mapInstanceKey}
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: '100%', width: '100%', borderRadius: '8px' }}
        className="z-0"
        scrollWheelZoom={true}
      >
        {/* OpenStreetMap Tiles */}
        <TileLayer
          key={activeTileTheme}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={
            activeTileTheme === 'dark'
              ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
              : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          }
          maxZoom={19}
        />

        <MapUpdater center={mapCenter} zoom={mapZoom} />

        {/* Route Lines between Rescuers and Active Rescues */}
        {showRoutes &&
          routes.map((route, index) => {
            // Color based on status
            const routeColor =
              route.status === 'IN_PROGRESS' ? '#8b5cf6' : '#3b82f6'; // purple for in-progress, blue for assigned
            const routeWeight = route.status === 'IN_PROGRESS' ? 4 : 3;

            return (
              <Polyline
                key={`route-${route.rescueId}-${index}`}
                positions={route.path}
                pathOptions={{
                  color: routeColor,
                  weight: routeWeight,
                  opacity: 0.8,
                  dashArray:
                    route.status === 'IN_PROGRESS' ? '10, 5' : '10, 10',
                }}
              >
                <Popup>
                  <div className="text-sm">
                    <strong className="text-purple-600">
                      🚗 Rescuer Route
                    </strong>
                    <p className="text-xs text-slate-700 mt-1">
                      <strong>Rescuer:</strong> {route.rescuerName}
                    </p>
                    <p className="text-xs text-slate-700">
                      <strong>Distance:</strong>{' '}
                      {formatDistance(route.distance)}
                    </p>
                    <p className="text-xs text-slate-700">
                      <strong>Est. Time:</strong>{' '}
                      {estimateTravelTime(route.distance)}
                    </p>
                    <p className="text-xs mt-1">
                      <span
                        className={`px-2 py-0.5 rounded ${
                          route.status === 'IN_PROGRESS'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
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
                  <strong>Est. Time:</strong>{' '}
                  {estimateTravelTime(route.distance)}
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
              icon={createUserLocationIcon()}
            >
              <Popup>
                <div className="text-sm">
                  <strong className="text-blue-600">📍 Your Location</strong>
                  <p className="text-xs text-slate-600 mt-1">
                    Current position
                  </p>
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
          const rescuerColor =
            rescuer.status === 'AVAILABLE' ? '#10b981' : '#f59e0b';

          return (
            <Marker
              key={`rescuer-${rescuer.id}`}
              position={[rescuer.lat, rescuer.lng]}
              icon={createRescuerIcon(rescuerColor)}
            >
              <Popup>
                <div className="text-sm min-w-[220px]">
                  <strong className="text-green-600">
                    🚑 Rescuer: {rescuer.name}
                  </strong>

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
                        <span
                          className={`px-2 py-0.5 rounded ${
                            rescuer.status === 'AVAILABLE'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
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
          const hospitalColor = getHospitalColor(hospital.antivenomStatus);

          // Calculate distance if user location is available
          const distance =
            userLocation && hospital.latitude && hospital.longitude
              ? calculateDistance(
                  userLocation.latitude,
                  userLocation.longitude,
                  hospital.latitude,
                  hospital.longitude,
                )
              : hospital.distance || null;

          return (
            <Marker
              key={`hospital-${hospital.id}`}
              position={[hospital.latitude, hospital.longitude]}
              icon={createHospitalIcon(hospitalColor)}
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
                        <span
                          className={`px-2 py-0.5 rounded ${
                            hospital.antivenomStatus === 'AVAILABLE'
                              ? 'bg-green-100 text-green-800'
                              : hospital.antivenomStatus === 'OUT_OF_STOCK'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
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
                          📍{' '}
                          {hospital.distanceFormatted ||
                            formatDistance(distance)}
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
          const hotspotColor = getHotspotColor(hotspot.riskLevel);

          const districtCenters: Record<string, [number, number]> = {
            Sarlahi: [27.0, 85.5],
            Saptari: [26.7, 86.7],
            Sunsari: [26.6, 87.2],
            Rupandehi: [27.6, 83.5],
            Mahottari: [27.1, 85.9],
            Dhanusa: [26.8, 86.0],
            Makwanpur: [27.5, 85.0],
            Siraha: [26.6, 86.2],
            Dang: [28.1, 82.3],
          };

          const position: [number, number] =
            hotspot.latitude !== null &&
            hotspot.longitude !== null &&
            hotspot.latitude !== undefined &&
            hotspot.longitude !== undefined
              ? [hotspot.latitude, hotspot.longitude]
              : districtCenters[hotspot.district || ''] || [27.7, 85.3];

          return (
            <Circle
              key={`hotspot-${hotspot.id}`}
              center={position}
              radius={MAP_CONFIG.hotspotRadiusMeters}
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
                      <span
                        className={`px-2 py-0.5 rounded font-semibold ${
                          hotspot.riskLevel === 'VERY_HIGH' ||
                          hotspot.riskLevel === 'EXTREME'
                            ? 'bg-red-100 text-red-800'
                            : hotspot.riskLevel === 'HIGH'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {hotspot.riskLevel.replace('_', ' ')}
                      </span>
                    </p>

                    <p className="text-xs">
                      <strong>Risk Score:</strong>{' '}
                      {(hotspot.riskScore * 100).toFixed(0)}%
                    </p>

                    <p className="text-xs text-slate-600">
                      <strong>District:</strong> {hotspot.district},{' '}
                      {hotspot.province}
                    </p>

                    {hotspot.populationAtRisk && (
                      <p className="text-xs text-slate-600">
                        <strong>Population at Risk:</strong>{' '}
                        {hotspot.populationAtRisk.toLocaleString()}
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
                        This hotspot is based on peer-reviewed scientific
                        research, not live SnakeSOS data.
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
          const distance =
            userLocation && rescue.lat && rescue.lng
              ? calculateDistance(
                  userLocation.latitude,
                  userLocation.longitude,
                  rescue.lat,
                  rescue.lng,
                )
              : null;

          return (
            <Marker
              key={`rescue-${rescue.id}`}
              position={[rescue.lat, rescue.lng]}
              icon={createRescueIcon(priorityColor, isSelected)}
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
                      <p className="text-xs text-slate-600">
                        📞 {rescue.phone}
                      </p>
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
                        {showHospitalRoute === rescue.id
                          ? '✗ Hide Hospital Route'
                          : '🏥 Show Hospital Route'}
                      </button>
                      {showHospitalRoute === rescue.id &&
                        (() => {
                          const hospitalRoute = hospitalRoutes.find(
                            (r) => r.rescueId === rescue.id,
                          );
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
