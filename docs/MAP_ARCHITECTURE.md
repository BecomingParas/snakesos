# Snake Rescue Map Architecture

## Overview

The Snake Rescue platform uses **Leaflet + OpenStreetMap** for interactive map visualization of rescue operations, rescuer locations, and real-time tracking.

## Technology Stack

- **Map Library:** Leaflet v1.9.4
- **React Integration:** react-leaflet v5.0.0
- **Tile Provider:** OpenStreetMap
- **Routing:** leaflet-routing-machine v3.2.12
- **Clustering:** leaflet.markercluster v1.5.3

## Why Leaflet Instead of Google Maps?

✅ **Open Source:** No vendor lock-in, full control
✅ **Free:** No API keys or usage limits
✅ **Lightweight:** Smaller bundle size
✅ **Flexible:** Easy to customize and extend
✅ **Privacy:** No data sent to Google servers

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     PostgreSQL Database                      │
│  ┌────────────────┐              ┌────────────────┐         │
│  │ RescueRequest  │              │   Volunteer    │         │
│  │ - lat: Float?  │              │ - currentLat   │         │
│  │ - lng: Float?  │              │ - currentLng   │         │
│  └────────────────┘              └────────────────┘         │
└──────────────────┬──────────────────────┬───────────────────┘
                   │                      │
                   ▼                      ▼
         ┌─────────────────────────────────────────┐
         │         Prisma ORM / Database Layer      │
         └─────────────────┬───────────────────────┘
                           │
                           ▼
         ┌─────────────────────────────────────────┐
         │      Rescue Repository (Backend)         │
         └─────────────────┬───────────────────────┘
                           │
                           ▼
         ┌─────────────────────────────────────────┐
         │     Rescue Use Case (Business Logic)     │
         └─────────────────┬───────────────────────┘
                           │
                           ▼
         ┌─────────────────────────────────────────┐
         │    GraphQL Resolver (API Gateway)        │
         │    - activeRescues(pagination)           │
         │    - rescueRequest(id)                   │
         └─────────────────┬───────────────────────┘
                           │
                           ▼
         ┌─────────────────────────────────────────┐
         │         Apollo Client (Frontend)         │
         │    - useActiveRescuesQuery()             │
         │    - useRescueWithTrackingQuery()        │
         └─────────────────┬───────────────────────┘
                           │
                           ▼
         ┌─────────────────────────────────────────┐
         │      Admin Command Center / Map Page     │
         │    - Rescue list panel                   │
         │    - Interactive map panel               │
         │    - Rescue details panel                │
         └─────────────────┬───────────────────────┘
                           │
                           ▼
         ┌─────────────────────────────────────────┐
         │          RescueMap Component             │
         │    (Leaflet + OpenStreetMap)             │
         │                                           │
         │    - Rescue markers (priority colors)    │
         │    - Rescuer markers (live location)     │
         │    - User location marker                │
         │    - Distance calculation                │
         │    - Coordinate validation               │
         │    - Map centering on selection          │
         └───────────────────────────────────────────┘
```

## Data Flow

### 1. Rescue Coordinates

```typescript
// Database (Prisma Schema)
model RescueRequest {
  lat  Float?
  lng  Float?
}

// GraphQL Query
query ActiveRescues {
  activeRescues {
    edges {
      node {
        id
        lat
        lng
        address
      }
    }
  }
}

// Frontend Hook
const { data } = useActiveRescuesQuery({
  pollInterval: 10000, // Refresh every 10s
})

// Map Component
<RescueMap
  rescues={data.activeRescues.edges.map(e => ({
    id: e.node.id,
    lat: e.node.lat,
    lng: e.node.lng,
  }))}
/>
```

### 2. Rescuer Live Tracking

```typescript
// Database (Prisma Schema)
model Volunteer {
  currentLat         Float?
  currentLng         Float?
  lastLocationUpdate DateTime?
}

// GraphQL Query
query ActiveRescues {
  activeRescues {
    assignedVolunteer {
      id
      currentLat
      currentLng
      lastLocationUpdate
    }
  }
}

// Update Flow (from Rescuer App)
mutation UpdateRescueProgress {
  updateRescueProgress(input: {
    rescueId: "xxx"
    lat: 27.7172
    lng: 85.3240
  })
}
```

## Map Components

### RescueMap Component

**Location:** `apps/frontend/src/components/map/RescueMap.tsx`

**Props:**
- `rescues: RescueLocation[]` - Array of rescue locations
- `rescuers: RescuerLocation[]` - Array of rescuer locations
- `center: [number, number]` - Map center coordinates
- `zoom: number` - Zoom level
- `userLocation: { latitude, longitude }` - Current user location
- `selectedRescueId: string` - ID of selected rescue
- `onRescueClick: (id: string) => void` - Marker click handler

**Features:**
- ✅ Dynamic marker rendering based on priority
- ✅ Rescuer tracking with offset for visibility
- ✅ Popup with rescue details
- ✅ Distance calculation from user location
- ✅ Smooth map animations on selection
- ✅ Invalid coordinate filtering

### Rescue Marker Colors

| Priority  | Color     | Hex       |
|-----------|-----------|-----------|
| CRITICAL  | Red       | #dc2626   |
| HIGH      | Orange    | #ea580c   |
| MEDIUM    | Yellow    | #ca8a04   |
| LOW       | Green     | #16a34a   |

### Status Badge Colors

| Status       | Badge Style |
|--------------|-------------|
| PENDING      | Yellow      |
| ASSIGNED     | Blue        |
| IN_PROGRESS  | Purple      |
| COMPLETED    | Green       |
| CANCELLED    | Gray        |

## Coordinate Validation

**Location:** `apps/frontend/src/lib/map/coordinates.ts`

```typescript
isValidCoordinate(lat, lng): boolean
  - Validates latitude range: -90 to 90
  - Validates longitude range: -180 to 180
  - Checks for null, undefined, NaN, Infinity

filterValidCoordinates<T>(items: T[]): T[]
  - Filters array to only valid coordinates

isInNepal(lat, lng): boolean
  - Checks if coordinates are within Nepal bounds
```

## Distance Calculation

**Location:** `apps/frontend/src/lib/map/distance.ts`

```typescript
calculateDistance(lat1, lng1, lat2, lng2): number
  - Uses Haversine formula
  - Returns distance in kilometers

formatDistance(km: number): string
  - Returns human-readable format: "2.5km away"

estimateTravelTime(km: number): string
  - Average speed: 40 km/h (Nepal urban)
  - Returns: "~15 min" or "~1h 30m"

sortByDistance<T>(items, userLat, userLng): T[]
  - Sorts items by distance from user
```

## Environment Configuration

**File:** `apps/frontend/.env.local`

```bash
# Currently NO Google Maps API key required
# Using OpenStreetMap (free and open)

# Optional: If migrating to Google Maps
# NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
```

## Usage Examples

### Admin Command Center

```tsx
import dynamic from 'next/dynamic'

const RescueMap = dynamic(
  () => import('@/components/map/RescueMap'),
  { ssr: false }
)

function CommandCenter() {
  const { data } = useActiveRescuesQuery()
  
  return (
    <RescueMap
      rescues={data.activeRescues.edges.map(e => ({
        id: e.node.id,
        lat: e.node.lat,
        lng: e.node.lng,
        priority: e.node.priority,
        status: e.node.status,
      }))}
      rescuers={/* ... */}
      onRescueClick={handleRescueClick}
    />
  )
}
```

### Admin Map Page

**Route:** `/dashboard/admin/map`

Full-page map view with:
- Statistics panel
- All active rescues
- All active rescuers
- Map legend
- Refresh controls

### Citizen Map Page

**Route:** `/dashboard/citizen/map`

Citizen-facing map showing:
- Their own rescue requests
- Assigned rescuer location
- ETA and distance

## Real-Time Updates

### Current Implementation: Polling

```typescript
useActiveRescuesQuery({
  pollInterval: 10000, // 10 seconds
  fetchPolicy: 'cache-and-network',
})
```

### Future: GraphQL Subscriptions

```typescript
// Planned implementation
subscription RescueUpdates {
  rescueUpdated {
    id
    status
    assignedVolunteer {
      currentLat
      currentLng
    }
  }
}
```

## Performance Optimizations

1. **Dynamic Import:** Avoid SSR issues
   ```tsx
   const RescueMap = dynamic(() => import('...'), { ssr: false })
   ```

2. **Coordinate Filtering:** Filter invalid coordinates before rendering
   ```tsx
   const validRescues = filterValidCoordinates(rescues)
   ```

3. **Memo/Callback:** Prevent unnecessary re-renders
   ```tsx
   const handleClick = useCallback((id) => { ... }, [])
   ```

4. **Map Instance Reuse:** Don't recreate on every render
   ```tsx
   // MapContainer manages instance lifecycle
   ```

## Troubleshooting

### Map Not Rendering

**Symptom:** Blank or placeholder map area

**Causes:**
1. Missing dynamic import (SSR issue)
2. Leaflet CSS not imported
3. Invalid coordinates (all filtered out)

**Solution:**
```tsx
// 1. Use dynamic import
const RescueMap = dynamic(() => import('...'), { ssr: false })

// 2. Import CSS in component
import 'leaflet/dist/leaflet.css'

// 3. Check coordinate validation
console.log('Valid rescues:', filterValidCoordinates(rescues))
```

### Marker Icon Missing

**Symptom:** Blue default marker or broken image

**Cause:** Webpack doesn't bundle Leaflet marker images

**Solution:**
```typescript
// In RescueMap.tsx
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/...',
  iconUrl: 'https://cdnjs.cloudflare.com/...',
  shadowUrl: 'https://cdnjs.cloudflare.com/...',
})
```

### Map Center Not Updating

**Symptom:** Map doesn't center on selected rescue

**Solution:** Use MapUpdater component with flyTo:
```tsx
function MapUpdater({ center }) {
  const map = useMap()
  useEffect(() => {
    map.flyTo(center, 15, { duration: 1.5 })
  }, [center, map])
  return null
}
```

## Security Considerations

1. **Coordinate Privacy:** Don't expose exact citizen locations publicly
2. **Volunteer Location:** Only show to admins and assigned rescuers
3. **API Security:** Backend validates all location updates
4. **Rate Limiting:** Prevent location update spam

## Future Enhancements

- [ ] GraphQL subscriptions for real-time updates
- [ ] Route visualization using leaflet-routing-machine
- [ ] ETA calculation based on actual road distance
- [ ] Geofencing alerts (rescuer near rescue site)
- [ ] Historical path tracking
- [ ] Heatmap of rescue density
- [ ] Offline map caching
- [ ] Mobile app integration with native maps

## Related Files

```
apps/frontend/src/
├── components/map/
│   └── RescueMap.tsx                    # Main map component
├── lib/map/
│   ├── coordinates.ts                    # Coordinate validation
│   └── distance.ts                       # Distance calculations
├── hooks/
│   └── useUserLocation.ts                # Geolocation hook
├── lib/graphql/hooks/
│   └── rescue.hooks.ts                   # GraphQL queries
└── app/(dashboard)/dashboard/admin/
    ├── command/page.tsx                  # Command center
    └── map/page.tsx                      # Full map page
```

## References

- [Leaflet Documentation](https://leafletjs.com/reference.html)
- [React Leaflet Documentation](https://react-leaflet.js.org/)
- [OpenStreetMap Tile Usage Policy](https://operations.osmfoundation.org/policies/tiles/)
- [Haversine Formula](https://en.wikipedia.org/wiki/Haversine_formula)
