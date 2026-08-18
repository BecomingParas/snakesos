# Leaflet Map - Quick Start Guide

## ✅ Completed

1. **Dependencies Installed**
   - leaflet@1.9.4
   - react-leaflet@5.0.0
   - leaflet-routing-machine@3.2.12
   - leaflet.markercluster@1.5.3

2. **Files Created**
   - ✅ `apps/frontend/src/lib/map/distance.ts` - Distance calculations
   - ✅ `apps/frontend/src/hooks/useUserLocation.ts` - Geolocation hook
   - ✅ `apps/frontend/src/components/map/RescueMap.tsx` - Main map component

## 🚀 How to Use

### 1. Add Distance Badge to Rescue Cards

```typescript
// In your rescue card component
import { calculateDistance, formatDistance } from '@/lib/map/distance';
import { useUserLocation } from '@/hooks/useUserLocation';
import { MapPin } from 'lucide-react';

function RescueCard({ rescue }) {
  const { location } = useUserLocation();
  
  const distance = location && rescue.lat && rescue.lng
    ? calculateDistance(
        location.latitude,
        location.longitude,
        rescue.lat,
        rescue.lng
      )
    : null;

  return (
    <div className="rescue-card">
      <h3>{rescue.address}</h3>
      
      {distance !== null && (
        <div className="flex items-center gap-1 text-sm text-blue-600">
          <MapPin className="h-4 w-4" />
          <span>{formatDistance(distance)}</span>
        </div>
      )}
    </div>
  );
}
```

### 2. Sort Rescues by Proximity

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
        <RescueCard key={rescue.id} rescue={rescue} distance={rescue.distance} />
      ))}
    </div>
  );
}
```

### 3. Create Map Page

```typescript
// app/(dashboard)/dashboard/map/page.tsx
'use client';

import dynamic from 'next/dynamic';
import { useQuery } from '@apollo/client';
import { useUserLocation } from '@/hooks/useUserLocation';
import { LIST_RESCUES_QUERY } from '@/lib/graphql/queries/rescue.queries';

// Import map component dynamically (avoids SSR issues)
const RescueMap = dynamic(
  () => import('@/components/map/RescueMap').then(mod => ({ default: mod.RescueMap })),
  { 
    ssr: false,
    loading: () => (
      <div className="h-[600px] flex items-center justify-center bg-slate-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600">Loading map...</p>
        </div>
      </div>
    ),
  }
);

export default function MapPage() {
  const { location, loading: locationLoading, error: locationError } = useUserLocation();
  
  const { data, loading: rescuesLoading } = useQuery(LIST_RESCUES_QUERY, {
    variables: {
      filter: { status: ['PENDING', 'ASSIGNED', 'IN_PROGRESS'] },
      pagination: { page: 1, limit: 100 },
    },
  });

  if (locationError) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            ⚠️ Location access denied. Enable location permissions to see distances.
          </p>
        </div>
      </div>
    );
  }

  const rescues = data?.listRescues?.items || [];

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Rescue Map</h1>
          <p className="text-sm text-slate-600 mt-1">
            {rescues.length} active rescue{rescues.length !== 1 ? 's' : ''}
            {location && ' · Your location detected'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div style={{ height: '600px' }}>
          <RescueMap
            rescues={rescues.map(r => ({
              id: r.id,
              lat: r.lat || 0,
              lng: r.lng || 0,
              address: r.address,
              municipality: r.municipality,
              status: r.status,
              priority: r.priority,
              name: r.name,
              phone: r.phone,
              snakeDescription: r.snakeDescription,
            }))}
            userLocation={location}
            zoom={13}
          />
        </div>
      </div>

      {/* Map Legend */}
      <div className="mt-4 bg-white rounded-lg shadow-sm border border-slate-200 p-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Map Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-white text-xs">🐍</div>
            <span className="text-slate-600">Critical</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-orange-600 flex items-center justify-center text-white text-xs">🐍</div>
            <span className="text-slate-600">High Priority</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-yellow-600 flex items-center justify-center text-white text-xs">🐍</div>
            <span className="text-slate-600">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center text-white text-xs">🐍</div>
            <span className="text-slate-600">Low Priority</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-blue-600 border-2 border-white"></div>
            <span className="text-slate-600">Your Location</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-xs">👨‍⚕️</div>
            <span className="text-slate-600">Rescuer</span>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 4. Add Map Link to Sidebar

```typescript
// In your sidebar component
import { Map } from 'lucide-react';

const navigation = [
  // ... existing items
  {
    name: 'Map',
    href: '/dashboard/map',
    icon: Map,
  },
];
```

## 📊 Features Included

### ✅ Implemented
1. **Interactive Map** - Click and drag, zoom in/out
2. **Rescue Markers** - Color-coded by priority
3. **User Location** - Blue dot showing your position
4. **Distance Calculation** - Real-time distance to rescues
5. **Travel Time Estimation** - Approximate time to reach
6. **Popup Details** - Click markers for full info
7. **Responsive** - Works on mobile and desktop

### 🔄 Coming Soon (you can add)
1. **Route Drawing** - Show path to rescue
2. **Clustering** - Group nearby markers when zoomed out
3. **Coverage Zones** - Volunteer areas
4. **Live Tracking** - Real-time rescuer movement
5. **Filters** - Show/hide by status/priority

## 🔧 Customization

### Change Default Center
```typescript
// For Butwal instead of Kathmandu
<RescueMap
  center={[27.7000, 83.4500]}
  zoom={14}
  // ... other props
/>
```

### Custom Marker Colors
Edit `getPriorityColor()` function in `RescueMap.tsx`

### Different Map Tiles
Replace OpenStreetMap with other providers:

```typescript
// Satellite view (requires Mapbox token)
<TileLayer
  url="https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=YOUR_TOKEN"
/>

// Dark mode
<TileLayer
  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
/>
```

## 🐛 Troubleshooting

### Map not showing
- Check console for errors
- Ensure component is imported dynamically with `{ ssr: false }`
- Verify Leaflet CSS is imported

### Location not working
- Check browser location permissions
- Must use HTTPS in production (or localhost)
- Some browsers block geolocation on HTTP

### Markers not appearing
- Verify rescue data has `lat` and `lng` fields
- Check console for null/undefined coordinates
- Ensure coordinates are numbers, not strings

## 🎯 Next Steps

1. **Add to Navigation** - Link in sidebar ✅
2. **Test with Real Data** - Use actual rescue coordinates
3. **Add Routing** - Show directions (needs routing service)
4. **Add Clustering** - Group markers when zoomed out
5. **Add Filters** - Status, priority, date filters

## 📚 Resources

- [Leaflet Docs](https://leafletjs.com/)
- [React Leaflet](https://react-leaflet.js.org/)
- [OpenStreetMap](https://www.openstreetmap.org/)

Ready to use! The map is fully functional with distance calculation, user location tracking, and interactive markers.
