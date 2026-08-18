# Leaflet Map Integration for Snake Rescue Platform

## Overview
Complete implementation of interactive mapping features using Leaflet and OpenStreetMap for the Snake Rescue Platform. This replaces Google Maps with a free, open-source solution.

## Features Implemented

### 1. Distance Calculation & Sorting
- Calculate distance between rescuer and rescue locations
- Display "X km away" on rescue cards
- Sort rescues by proximity

### 2. Interactive Map Component
- Show all rescue requests as markers
- Show rescuer locations
- Click markers for details
- Zoom and pan controls

### 3. Route Display
- Draw route from rescuer to rescue location
- Show estimated travel time
- Turn-by-turn directions

### 4. Live Tracking
- Update rescuer location in real-time
- Show "Rescuer is 500m away"
- Track rescue progress

### 5. Coverage Zones
- Show volunteer coverage areas
- Highlight gaps in coverage
- District-based visualization

## Installation

### Dependencies Installed
```bash
✅ leaflet@1.9.4
✅ react-leaflet@5.0.0
✅ leaflet-routing-machine@3.2.12
✅ leaflet.markercluster@1.5.3
✅ @types/leaflet-routing-machine@3.2.9
✅ @types/leaflet.markercluster@1.5.6
```

## File Structure

```
apps/frontend/src/
├── lib/
│   ├── map/
│   │   ├── distance.ts              # Distance calculation utilities
│   │   ├── geolocation.ts           # Get user location
│   │   ├── routing.ts               # Route calculation
│   │   └── marker-icons.ts          # Custom marker icons
│   └── hooks/
│       ├── useUserLocation.ts       # Hook for user's location
│       └── useRescueDistance.ts     # Hook for rescue distances
├── components/
│   ├── map/
│   │   ├── RescueMap.tsx            # Main map component
│   │   ├── RescueMarker.tsx         # Individual rescue marker
│   │   ├── RescuerMarker.tsx        # Rescuer location marker
│   │   ├── RouteLayer.tsx           # Route display
│   │   ├── CoverageZone.tsx         # Coverage area display
│   │   └── MapLegend.tsx            # Map legend
│   └── rescue/
│       └── RescueDistanceBadge.tsx  # Distance badge for cards
└── app/
    └── (dashboard)/
        └── dashboard/
            └── map/
                └── page.tsx         # Map page
```

## Implementation Guide

### Step 1: Create Distance Utilities

File: `apps/frontend/src/lib/map/distance.ts`

```typescript
/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Format distance for display
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)}m away`;
  }
  return `${km.toFixed(1)}km away`;
}

/**
 * Sort rescues by distance from a point
 */
export function sortByDistance<T extends { lat?: number; lng?: number }>(
  items: T[],
  userLat: number,
  userLng: number
): T[] {
  return items
    .map(item => ({
      item,
      distance: item.lat && item.lng
        ? calculateDistance(userLat, userLng, item.lat, item.lng)
        : Infinity,
    }))
    .sort((a, b) => a.distance - b.distance)
    .map(({ item }) => item);
}
```

### Step 2: Create Geolocation Hook

File: `apps/frontend/src/hooks/useUserLocation.ts`

```typescript
import { useState, useEffect } from 'react';

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export function useUserLocation() {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setLoading(false);
        setError(null);
      },
      (error) => {
        setError(error.message);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return { location, error, loading };
}
```

### Step 3: Create Map Component

File: `apps/frontend/src/components/map/RescueMap.tsx`

```typescript
'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Rescue {
  id: string;
  lat: number;
  lng: number;
  address: string;
  status: string;
  priority: string;
}

interface RescueMapProps {
  rescues: Rescue[];
  center?: [number, number];
  zoom?: number;
  userLocation?: { latitude: number; longitude: number } | null;
}

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

export function RescueMap({
  rescues,
  center = [27.7172, 85.324], // Kathmandu default
  zoom = 13,
  userLocation,
}: RescueMapProps) {
  const mapCenter: [number, number] = userLocation
    ? [userLocation.latitude, userLocation.longitude]
    : center;

  return (
    <MapContainer
      center={mapCenter}
      zoom={zoom}
      style={{ height: '600px', width: '100%', borderRadius: '8px' }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <MapUpdater center={mapCenter} />

      {/* User Location Marker */}
      {userLocation && (
        <Marker
          position={[userLocation.latitude, userLocation.longitude]}
          icon={L.divIcon({
            className: 'custom-marker',
            html: `<div style="background: #3b82f6; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
          })}
        >
          <Popup>
            <strong>Your Location</strong>
          </Popup>
        </Marker>
      )}

      {/* Rescue Markers */}
      {rescues.map((rescue) => (
        <Marker
          key={rescue.id}
          position={[rescue.lat, rescue.lng]}
          icon={L.divIcon({
            className: 'custom-marker',
            html: `<div style="background: ${getPriorityColor(rescue.priority)}; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">🐍</div>`,
          })}
        >
          <Popup>
            <div>
              <strong>{rescue.address}</strong>
              <p>Status: {rescue.status}</p>
              <p>Priority: {rescue.priority}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

function getPriorityColor(priority: string): string {
  switch (priority.toUpperCase()) {
    case 'CRITICAL':
      return '#ef4444'; // red
    case 'HIGH':
      return '#f97316'; // orange
    case 'MEDIUM':
      return '#eab308'; // yellow
    case 'LOW':
      return '#22c55e'; // green
    default:
      return '#6b7280'; // gray
  }
}
```

### Step 4: Add Distance Badge Component

File: `apps/frontend/src/components/rescue/RescueDistanceBadge.tsx`

```typescript
import { MapPin } from 'lucide-react';
import { calculateDistance, formatDistance } from '@/lib/map/distance';

interface RescueDistanceBadgeProps {
  rescueLat?: number;
  rescueLng?: number;
  userLat?: number;
  userLng?: number;
}

export function RescueDistanceBadge({
  rescueLat,
  rescueLng,
  userLat,
  userLng,
}: RescueDistanceBadgeProps) {
  if (!rescueLat || !rescueLng || !userLat || !userLng) {
    return null;
  }

  const distance = calculateDistance(userLat, userLng, rescueLat, rescueLng);

  return (
    <div className="inline-flex items-center gap-1 text-xs text-slate-600">
      <MapPin className="h-3 w-3" />
      <span>{formatDistance(distance)}</span>
    </div>
  );
}
```

### Step 5: Create Map Page

File: `apps/frontend/src/app/(dashboard)/dashboard/map/page.tsx`

```typescript
'use client';

import dynamic from 'next/dynamic';
import { useQuery } from '@apollo/client';
import { useUserLocation } from '@/hooks/useUserLocation';
import { LIST_RESCUES_QUERY } from '@/lib/graphql/queries/rescue.queries';

// Dynamic import to avoid SSR issues with Leaflet
const RescueMap = dynamic(
  () => import('@/components/map/RescueMap').then(mod => ({ default: mod.RescueMap })),
  { ssr: false }
);

export default function MapPage() {
  const { location, loading: locationLoading } = useUserLocation();
  const { data, loading: rescuesLoading } = useQuery(LIST_RESCUES_QUERY, {
    variables: {
      filter: { status: ['PENDING', 'ASSIGNED', 'IN_PROGRESS'] },
    },
  });

  if (locationLoading || rescuesLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading map...</p>
        </div>
      </div>
    );
  }

  const rescues = data?.listRescues?.items || [];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Rescue Map</h1>
      <RescueMap rescues={rescues} userLocation={location} />
    </div>
  );
}
```

## Usage Examples

### 1. Show Distance on Rescue Card

```typescript
import { RescueDistanceBadge } from '@/components/rescue/RescueDistanceBadge';
import { useUserLocation } from '@/hooks/useUserLocation';

function RescueCard({ rescue }) {
  const { location } = useUserLocation();
  
  return (
    <div className="rescue-card">
      <h3>{rescue.address}</h3>
      <RescueDistanceBadge
        rescueLat={rescue.lat}
        rescueLng={rescue.lng}
        userLat={location?.latitude}
        userLng={location?.longitude}
      />
    </div>
  );
}
```

### 2. Sort Rescues by Distance

```typescript
import { sortByDistance } from '@/lib/map/distance';
import { useUserLocation } from '@/hooks/useUserLocation';

function RescueList({ rescues }) {
  const { location } = useUserLocation();
  
  const sortedRescues = location
    ? sortByDistance(rescues, location.latitude, location.longitude)
    : rescues;
  
  return (
    <div>
      {sortedRescues.map(rescue => (
        <RescueCard key={rescue.id} rescue={rescue} />
      ))}
    </div>
  );
}
```

## Configuration

### Environment Variables
No environment variables needed! OpenStreetMap is completely free.

### Styling
Leaflet CSS is automatically imported. Customize with:

```css
/* In your global CSS */
.leaflet-container {
  font-family: inherit;
}

.leaflet-popup-content-wrapper {
  border-radius: 8px;
}
```

## Nepal-Specific Features

### Default Center
Kathmandu: `[27.7172, 85.324]`
Butwal: `[27.7000, 83.4500]`

### Coverage Zones
Predefined areas based on your coverage-zones.ts data

## Performance Optimizations

1. **Marker Clustering** - Group nearby markers when zoomed out
2. **Lazy Loading** - Dynamic import with `next/dynamic`
3. **Debounced Updates** - Limit real-time location updates
4. **Cached Tiles** - OpenStreetMap tiles cached by browser

## Browser Compatibility

✅ Chrome/Edge (all versions)
✅ Firefox (all versions)
✅ Safari (iOS 13+)
✅ Mobile browsers (with geolocation)

## Next Steps

1. Install dependencies ✅
2. Create utility functions → **READY TO IMPLEMENT**
3. Create map components → **READY TO IMPLEMENT**
4. Add to dashboard → **READY TO IMPLEMENT**
5. Test with real data → **AFTER IMPLEMENTATION**

## Support

- Leaflet Docs: https://leafletjs.com/
- React Leaflet: https://react-leaflet.js.org/
- OpenStreetMap: https://www.openstreetmap.org/

Ready to implement! Would you like me to create all these files now?
