/**
 * GoogleRescueMap
 * Google Maps implementation of the rescue overview map used across dashboard and public views.
 */

'use client';

import { useMemo, useEffect, useRef } from 'react';
import { GoogleMapWrapperRaw, useGoogleMapRaw } from './GoogleMapWrapperRaw';
import { HeatmapLayer } from './HeatmapLayer';
import type {
  HospitalLocation,
  RescueLocation,
  RescuerLocation,
  UserLocation,
  RescueMapProps,
} from './map.types';
import { calculateDistance } from '@/lib/map/distance';
import { isValidCoordinate } from '@/lib/map/coordinates';

// Declare google as a global to access Google Maps API
declare const google: any;

function getRescueMarkerColor(status: string): string {
  switch (status) {
    case 'IN_PROGRESS':
      return '#8b5cf6';
    case 'ASSIGNED':
      return '#3b82f6';
    case 'PENDING':
      return '#f59e0b';
    case 'COMPLETED':
      return '#10b981';
    default:
      return '#64748b';
  }
}

function getRescuerMarkerColor(status?: string): string {
  switch (status) {
    case 'AVAILABLE':
      return '#22c55e';
    case 'EN_ROUTE':
      return '#3b82f6';
    case 'ON_SITE':
      return '#a855f7';
    default:
      return '#94a3b8';
  }
}

function getHospitalMarkerColor(hospital: HospitalLocation): string {
  if (hospital.antivenomStatus === 'AVAILABLE') return '#10b981';
  if (hospital.emergency24x7) return '#06b6d4';
  return '#f59e0b';
}

function getRiskColor(riskLevel: string): string {
  switch (riskLevel) {
    case 'EXTREME':
      return '#7c2d12'; // dark red
    case 'VERY_HIGH':
      return '#dc2626'; // red
    case 'HIGH':
      return '#ea580c'; // orange-red
    case 'MODERATE':
      return '#f59e0b'; // amber
    case 'LOW':
      return '#eab308'; // yellow
    default:
      return '#9ca3af'; // gray
  }
}

function createCircleMarkerIcon(
  color: string,
  scale: number,
  strokeColor = '#ffffff',
  strokeWeight = 2,
) {
  if (typeof window === 'undefined' || !window.google?.maps) {
    return undefined;
  }

  return {
    path: window.google.maps.SymbolPath.CIRCLE,
    scale,
    fillColor: color,
    fillOpacity: 1,
    strokeColor,
    strokeWeight,
  };
}

export function GoogleRescueMap({
  rescues,
  rescuers = [],
  hospitals = [],
  center = [27.7172, 85.324],
  zoom = 13,
  userLocation,
  selectedRescueId,
  onRescueClick,
  onHospitalClick,
  showAccuracyCircle = true,
  showRoutes = true,
  heatmapPoints = [],
  showHeatmap = false,
}: RescueMapProps) {
  const validRescues = useMemo(
    () =>
      rescues.filter((rescue) =>
        isValidCoordinate(rescue.lat ?? 0, rescue.lng ?? 0),
      ),
    [rescues],
  );

  const validRescuers = useMemo(
    () =>
      rescuers.filter((rescuer) =>
        isValidCoordinate(rescuer.lat ?? 0, rescuer.lng ?? 0),
      ),
    [rescuers],
  );

  const validHospitals = useMemo(
    () =>
      hospitals.filter((hospital) =>
        isValidCoordinate(hospital.latitude, hospital.longitude),
      ),
    [hospitals],
  );

  const mapCenter = useMemo(() => {
    if (userLocation) {
      return { lat: userLocation.latitude, lng: userLocation.longitude };
    }
    if (validRescues.length > 0) {
      const rescue = validRescues[0];
      return { lat: rescue.lat, lng: rescue.lng };
    }
    return { lat: center[0], lng: center[1] };
  }, [center, userLocation, validRescues]);

  const routes = useMemo(() => {
    if (!showRoutes) return [];

    const items: Array<{
      id: string;
      path: { lat: number; lng: number }[];
      color: string;
      weight: number;
    }> = [];

    validRescues.forEach((rescue) => {
      if (!['ASSIGNED', 'IN_PROGRESS'].includes(rescue.status)) return;

      const assignedRescuer = rescue.assignedVolunteerId
        ? validRescuers.find(
            (rescuer) => rescuer.id === rescue.assignedVolunteerId,
          )
        : null;

      const routeSource =
        assignedRescuer ??
        validRescuers.reduce<RescuerLocation | null>((nearest, rescuer) => {
          const distance = calculateDistance(
            rescue.lat,
            rescue.lng,
            rescuer.lat,
            rescuer.lng,
          );
          if (!nearest) return rescuer;
          const nearestDistance = calculateDistance(
            rescue.lat,
            rescue.lng,
            nearest.lat,
            nearest.lng,
          );
          return distance < nearestDistance ? rescuer : nearest;
        }, null);

      if (!routeSource) return;

      items.push({
        id: `${rescue.id}-route`,
        path: [
          { lat: routeSource.lat, lng: routeSource.lng },
          { lat: rescue.lat, lng: rescue.lng },
        ],
        color: rescue.status === 'IN_PROGRESS' ? '#8b5cf6' : '#3b82f6',
        weight: rescue.status === 'IN_PROGRESS' ? 4 : 3,
      });
    });

    return items;
  }, [showRoutes, validRescues, validRescuers]);

  const hospitalRoutes = useMemo(() => {
    if (!selectedRescueId) return [];

    const selectedRescue = validRescues.find(
      (rescue) => rescue.id === selectedRescueId,
    );
    if (!selectedRescue) return [];

    const nearestHospital = validHospitals.reduce<{
      hospital: HospitalLocation;
      distance: number;
    } | null>((nearest, hospital) => {
      const distance = calculateDistance(
        selectedRescue.lat,
        selectedRescue.lng,
        hospital.latitude,
        hospital.longitude,
      );
      if (!nearest || distance < nearest.distance) {
        return { hospital, distance };
      }
      return nearest;
    }, null);

    if (!nearestHospital) return [];

    return [
      {
        id: `${selectedRescueId}-hospital-route`,
        path: [
          { lat: selectedRescue.lat, lng: selectedRescue.lng },
          {
            lat: nearestHospital.hospital.latitude,
            lng: nearestHospital.hospital.longitude,
          },
        ],
        color: '#10b981',
        weight: 3,
      },
    ];
  }, [selectedRescueId, validHospitals, validRescues]);

  return (
    <div className="w-full h-full flex flex-col">
      <GoogleMapWrapperRaw
        center={mapCenter}
        zoom={zoom}
        mapContainerStyle={{
          width: '100%',
          height: '100%',
          minHeight: '400px',
          display: 'block',
        }}
      >
        <MapMarkerRenderer
          rescues={validRescues}
          rescuers={validRescuers}
          hospitals={validHospitals}
          userLocation={userLocation}
          selectedRescueId={selectedRescueId}
          onRescueClick={onRescueClick}
          onHospitalClick={onHospitalClick}
        />
        {heatmapPoints.length > 0 && (
          <HeatmapRendererComponent points={heatmapPoints} visible={showHeatmap} />
        )}
      </GoogleMapWrapperRaw>
    </div>
  );
}

/**
 * Component that renders heatmap on the map
 */
function HeatmapRendererComponent({
  points,
  visible,
}: {
  points: Array<{ lat: number; lng: number; weight?: number }>;
  visible: boolean;
}) {
  const { map, isReady } = useGoogleMapRaw();
  const heatmapRef = useRef<google.maps.visualization.HeatmapLayer | null>(null);

  useEffect(() => {
    if (!map || !isReady || !visible) {
      if (heatmapRef.current) {
        heatmapRef.current.setMap(null);
      }
      return undefined;
    }

    const heatmapData = points.map((point) => ({
      location: new google.maps.LatLng(point.lat, point.lng),
      weight: point.weight ?? 1,
    }));

    if (!heatmapRef.current) {
      heatmapRef.current = new google.maps.visualization.HeatmapLayer({
        data: heatmapData,
        map,
        radius: 20,
        maxIntensity: 100,
        dissipating: true,
      });
    } else {
      heatmapRef.current.setData(heatmapData);
      heatmapRef.current.setMap(map);
    }

    return () => {
      if (heatmapRef.current) {
        heatmapRef.current.setMap(null);
      }
    };
  }, [map, isReady, points, visible]);

  return null; // This component doesn't render anything to React
}

export default GoogleRescueMap;

/**
 * Component that renders markers on the map using raw Google Maps API
 */
function MapMarkerRenderer({
  rescues,
  rescuers,
  hospitals,
  hotspots,
  userLocation,
  selectedRescueId,
  onRescueClick,
  onHospitalClick,
  showRoutes,
}: Omit<RescueMapProps, 'center' | 'zoom' | 'mapContainerStyle' | 'showAccuracyCircle' | 'heatmapPoints' | 'showHeatmap'> & { onRescueClick?: (id: string) => void; onHospitalClick?: (id: string) => void }) {
  const { map, isReady } = useGoogleMapRaw();
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowsRef = useRef<google.maps.InfoWindow[]>([]);
  const polylinesRef = useRef<google.maps.Polyline[]>([]);

  useEffect(() => {
    if (!map || !isReady) return undefined;

    // Clear previous markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    infoWindowsRef.current.forEach((iw) => iw.close());
    polylinesRef.current.forEach((line) => line.setMap(null));
    markersRef.current = [];
    infoWindowsRef.current = [];
    polylinesRef.current = [];

    // Create user location marker if available
    if (userLocation && isValidCoordinate(userLocation.latitude, userLocation.longitude)) {
      const userMarker = new google.maps.Marker({
        position: { lat: userLocation.latitude, lng: userLocation.longitude },
        map,
        title: 'Your location',
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#3b82f6',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
      });
      markersRef.current.push(userMarker);
    }

    // Create rescue markers
    rescues.forEach((rescue) => {
      if (!isValidCoordinate(rescue.lat ?? 0, rescue.lng ?? 0)) return;

      const color = getRescueMarkerColor(rescue.status);
      const isSelected = selectedRescueId === rescue.id;
      const rescueMarker = new google.maps.Marker({
        position: { lat: rescue.lat, lng: rescue.lng },
        map,
        title: `Rescue ${rescue.name ?? rescue.id}`,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: isSelected ? 12 : 10,
          fillColor: color,
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 3,
        },
        zIndex: isSelected ? 1000 : 100,
      });

      // Create info window
      const infoContent = document.createElement('div');
      infoContent.className = 'min-w-[220px] text-sm p-2 bg-white rounded';
      infoContent.innerHTML = `
        <strong class="text-slate-900">🚨 ${rescue.name || rescue.address}</strong>
        <div class="mt-2 space-y-1 text-xs text-slate-700">
          <p><strong>Location:</strong> ${rescue.address || 'Unknown'}</p>
          <p><strong>Status:</strong> ${rescue.status || 'Unknown'}</p>
          <p><strong>Priority:</strong> ${rescue.priority || 'Unknown'}</p>
          ${rescue.phone ? `<p><strong>Phone:</strong> ${rescue.phone}</p>` : ''}
        </div>
      `;

      const infoWindow = new google.maps.InfoWindow({ content: infoContent });
      infoWindowsRef.current.push(infoWindow);

      rescueMarker.addListener('click', () => {
        // Close all other info windows
        infoWindowsRef.current.forEach((iw) => iw.close());
        infoWindow.open({ anchor: rescueMarker, shouldFocus: true });
        onRescueClick?.(rescue.id);
      });

      markersRef.current.push(rescueMarker);
    });

    // Create rescuer markers
    rescuers.forEach((rescuer) => {
      if (!isValidCoordinate(rescuer.lat ?? 0, rescuer.lng ?? 0)) return;

      const color = getRescuerMarkerColor(rescuer.status);
      const rescuerMarker = new google.maps.Marker({
        position: { lat: rescuer.lat, lng: rescuer.lng },
        map,
        title: rescuer.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 9,
          fillColor: color,
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
        zIndex: 200,
      });

      // Create info window
      const infoContent = document.createElement('div');
      infoContent.className = 'min-w-[200px] text-sm p-2 bg-white rounded';
      infoContent.innerHTML = `
        <strong class="text-slate-900">🚑 ${rescuer.name}</strong>
        <div class="mt-2 space-y-1 text-xs text-slate-700">
          ${rescuer.phone ? `<p><strong>Phone:</strong> ${rescuer.phone}</p>` : ''}
          ${rescuer.status ? `<p><strong>Status:</strong> ${rescuer.status}</p>` : ''}
          ${rescuer.municipality ? `<p><strong>Area:</strong> ${rescuer.municipality}</p>` : ''}
        </div>
      `;

      const infoWindow = new google.maps.InfoWindow({ content: infoContent });
      infoWindowsRef.current.push(infoWindow);

      rescuerMarker.addListener('click', () => {
        infoWindowsRef.current.forEach((iw) => iw.close());
        infoWindow.open({ anchor: rescuerMarker, shouldFocus: true });
      });

      markersRef.current.push(rescuerMarker);
    });

    // Create hospital markers
    hospitals.forEach((hospital) => {
      if (!isValidCoordinate(hospital.latitude, hospital.longitude)) return;

      const color = getHospitalMarkerColor(hospital);
      const hospitalMarker = new google.maps.Marker({
        position: { lat: hospital.latitude, lng: hospital.longitude },
        map,
        title: hospital.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 9,
          fillColor: color,
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
        zIndex: 150,
      });

      // Create info window
      const infoContent = document.createElement('div');
      infoContent.className = 'min-w-[220px] text-sm p-2 bg-white rounded';
      infoContent.innerHTML = `
        <strong class="text-slate-900">🏥 ${hospital.name}</strong>
        <div class="mt-2 space-y-1 text-xs text-slate-700">
          <p>${hospital.address || 'Unknown'}</p>
          ${hospital.phone ? `<p><strong>Phone:</strong> ${hospital.phone}</p>` : ''}
          <p><strong>Antivenom:</strong> ${hospital.antivenomStatus || 'Unknown'}</p>
        </div>
      `;

      const infoWindow = new google.maps.InfoWindow({ content: infoContent });
      infoWindowsRef.current.push(infoWindow);

      hospitalMarker.addListener('click', () => {
        infoWindowsRef.current.forEach((iw) => iw.close());
        infoWindow.open({ anchor: hospitalMarker, shouldFocus: true });
        onHospitalClick?.(hospital.id);
      });

      markersRef.current.push(hospitalMarker);
    });

    // Create hotspot markers
    if (hotspots && hotspots.length > 0) {
      hotspots.forEach((hotspot) => {
        const lat = hotspot.latitude ?? 0;
        const lng = hotspot.longitude ?? 0;
        if (!isValidCoordinate(lat, lng)) return;

        const riskColor = getRiskColor(hotspot.riskLevel);
        const hotspotMarker = new google.maps.Marker({
          position: { lat, lng },
          map,
          title: hotspot.name || `Hotspot: ${hotspot.district}`,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: riskColor,
            fillOpacity: 0.7,
            strokeColor: '#ffffff',
            strokeWeight: 1,
          },
          zIndex: 50,
        });

        // Create info window for hotspot
        const infoContent = document.createElement('div');
        infoContent.className = 'min-w-[200px] text-sm p-2 bg-white rounded';
        infoContent.innerHTML = `
          <strong class="text-slate-900">🔥 ${hotspot.name || hotspot.district}</strong>
          <div class="mt-2 space-y-1 text-xs text-slate-700">
            <p><strong>Risk Level:</strong> ${hotspot.riskLevel}</p>
            ${hotspot.riskScore ? `<p><strong>Risk Score:</strong> ${hotspot.riskScore.toFixed(2)}</p>` : ''}
            ${hotspot.populationAtRisk ? `<p><strong>Population at Risk:</strong> ${hotspot.populationAtRisk.toLocaleString()}</p>` : ''}
            ${hotspot.studyYear ? `<p><strong>Study Year:</strong> ${hotspot.studyYear}</p>` : ''}
          </div>
        `;

        const infoWindow = new google.maps.InfoWindow({ content: infoContent });
        infoWindowsRef.current.push(infoWindow);

        hotspotMarker.addListener('click', () => {
          infoWindowsRef.current.forEach((iw) => iw.close());
          infoWindow.open({ anchor: hotspotMarker, shouldFocus: true });
        });

        markersRef.current.push(hotspotMarker);
      });
    }

    // Create routes/polylines if enabled
    if (showRoutes && rescues.length > 0 && rescuers.length > 0) {
      rescues.forEach((rescue) => {
        // Only show routes for assigned or in-progress rescues
        if (!['ASSIGNED', 'IN_PROGRESS'].includes(rescue.status)) return;

        // Find closest rescuer for this rescue
        let closestRescuer: RescuerLocation | null = null;
        let minDistance = Infinity;

        rescuers.forEach((rescuer) => {
          const distance = calculateDistance(
            rescue.lat,
            rescue.lng,
            rescuer.lat,
            rescuer.lng,
          );
          if (distance < minDistance) {
            minDistance = distance;
            closestRescuer = rescuer;
          }
        });

        if (closestRescuer) {
          const polyline = new google.maps.Polyline({
            path: [
              { lat: closestRescuer.lat, lng: closestRescuer.lng },
              { lat: rescue.lat, lng: rescue.lng },
            ],
            geodesic: true,
            strokeColor: rescue.status === 'IN_PROGRESS' ? '#8b5cf6' : '#3b82f6',
            strokeOpacity: 0.8,
            strokeWeight: rescue.status === 'IN_PROGRESS' ? 4 : 3,
            map,
            clickable: false,
          });
          polylinesRef.current.push(polyline);
        }
      });
    }

    // Cleanup on unmount
    return () => {
      markersRef.current.forEach((marker) => marker.setMap(null));
      infoWindowsRef.current.forEach((iw) => iw.close());
      polylinesRef.current.forEach((line) => line.setMap(null));
    };
  }, [map, isReady, rescues, rescuers, hospitals, hotspots, userLocation, selectedRescueId, onRescueClick, onHospitalClick, showRoutes]);

  return null; // This component doesn't render anything to React
}
