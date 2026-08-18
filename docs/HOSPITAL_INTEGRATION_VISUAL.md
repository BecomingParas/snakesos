# 🗺️ Hospital Integration - Visual Overview

## Map Integration Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER OPENS MAP PAGE                           │
│           (Citizen / Rescuer / Admin Dashboard)                  │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│              📍 GEOLOCATION REQUEST                              │
│         Browser asks: "Allow location access?"                   │
└─────────────┬───────────────────────────┬───────────────────────┘
              │                           │
         ALLOW│                           │DENY
              ▼                           ▼
┌──────────────────────────┐   ┌────────────────────────────┐
│   User Location: ✓       │   │  Use Default Location      │
│   lat: 27.7172           │   │  (Kathmandu center)        │
│   lng: 85.324            │   │  Limited hospital data     │
└────────┬─────────────────┘   └────────┬───────────────────┘
         │                              │
         └──────────┬───────────────────┘
                    ▼
┌─────────────────────────────────────────────────────────────────┐
│              🔄 PARALLEL DATA FETCHING                           │
├─────────────────────────────────────────────────────────────────┤
│  Query 1: useMyRescueRequestsQuery()      [Rescue Requests]     │
│  Query 2: useMyAssignedRescuesQuery()     [For Rescuers]        │
│  Query 3: useActiveRescuesQuery()         [For Admins]          │
│  Query 4: useNearbyHospitals()   ⭐ NEW  [Hospitals]            │
└────────┬────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│           🏥 HOSPITAL QUERY PROCESSING                           │
├─────────────────────────────────────────────────────────────────┤
│  Input: User location + Search params                           │
│                                                                  │
│  Citizen: radiusKm: 30, limit: 10                               │
│  Rescuer: radiusKm: 50, limit: 15                               │
│  Admin:   radiusKm: 100, limit: 50                              │
└────────┬────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│              🌐 GRAPHQL API CALL                                 │
│  POST http://localhost:4000/graphql                             │
│                                                                  │
│  query {                                                         │
│    nearbyHospitals(                                             │
│      latitude: 27.7172                                          │
│      longitude: 85.324                                          │
│      radiusKm: 30                                               │
│      limit: 10                                                  │
│    ) {                                                          │
│      id, name, latitude, longitude                             │
│      distance, antivenomStatus, ...                            │
│    }                                                            │
│  }                                                              │
└────────┬────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│              🔧 BACKEND PROCESSING                               │
│  HospitalService.getNearbyHospitals()                           │
├─────────────────────────────────────────────────────────────────┤
│  1. Query Database (65 hospitals)                               │
│  2. Filter: snakebiteTreatmentAvailable = true                 │
│  3. Calculate distances (Haversine formula)                     │
│  4. Filter: distance <= radiusKm                                │
│  5. Sort: By antivenom status, then distance                    │
│  6. Limit: Take top N results                                   │
│  7. Format: Add distanceFormatted, travelTime                   │
└────────┬────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│              📦 DATA RETURNED TO FRONTEND                        │
│  nearbyHospitals: [                                             │
│    {                                                             │
│      id: "hosp_123"                                             │
│      name: "Bir Hospital"                                       │
│      latitude: 27.7094                                          │
│      longitude: 85.3133                                         │
│      distance: 0.92                                             │
│      distanceFormatted: "0.9km"                                 │
│      antivenomStatus: "UNKNOWN"                                 │
│      emergency24x7: true                                        │
│    },                                                            │
│    ... 9 more hospitals                                         │
│  ]                                                              │
└────────┬────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│              🗺️ RENDER MAP WITH ALL MARKERS                     │
│  <RescueMap                                                     │
│    rescues={[...]}       🐍 Rescue requests                     │
│    rescuers={[...]}      👨‍⚕️ Active rescuers                     │
│    hospitals={[...]}     🏥 Nearby hospitals ⭐ NEW             │
│    userLocation={...}    🔵 User position                       │
│  />                                                             │
└────────┬────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│              🎨 LEAFLET MAP RENDERING                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐│
│  │   OpenStreetMap Tiles                                      ││
│  │                                                            ││
│  │    🐍 (red)     ← Critical rescue                         ││
│  │                                                            ││
│  │         🏥 (yellow) ← Hospital (unknown status)           ││
│  │                                                            ││
│  │              🔵  ← Your location                          ││
│  │                                                            ││
│  │    🏥 (green)    ← Hospital (antivenom available)         ││
│  │                                                            ││
│  │  👨‍⚕️              ← Active rescuer                          ││
│  │                                                            ││
│  │         🐍 (orange) ← High priority rescue                ││
│  │                                                            ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                  │
│  Legend:                                                         │
│  🐍 Rescues  |  👨‍⚕️ Rescuers  |  🏥 Hospitals  |  🔵 You          │
└─────────────────────────────────────────────────────────────────┘
```

---

## Marker Color Logic

```
RESCUE MARKERS (🐍)
├── Priority: CRITICAL    → 🔴 Red (#dc2626)
├── Priority: HIGH        → 🟠 Orange (#ea580c)
├── Priority: MEDIUM      → 🟡 Yellow (#ca8a04)
└── Priority: LOW         → 🟢 Green (#16a34a)

RESCUER MARKERS (👨‍⚕️)
└── Status: Active        → 🟢 Green (#10b981)

HOSPITAL MARKERS (🏥) ⭐ NEW
├── Antivenom: AVAILABLE        → 🟢 Green (#16a34a)
├── Antivenom: UNKNOWN          → 🟡 Yellow (#ca8a04)
└── Antivenom: OUT_OF_STOCK     → 🔴 Red (#dc2626)

USER LOCATION (🔵)
└── Current position      → 🔵 Blue (#3b82f6) + pulse animation
```

---

## Distance Calculation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│               📏 HAVERSINE DISTANCE FORMULA                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Input:                                                          │
│    lat1, lon1 = User Location (27.7172, 85.324)                │
│    lat2, lon2 = Hospital Location (27.7094, 85.3133)           │
│                                                                  │
│  Convert to Radians:                                            │
│    dLat = (lat2 - lat1) * π / 180                              │
│    dLon = (lon2 - lon1) * π / 180                              │
│                                                                  │
│  Calculate:                                                      │
│    a = sin²(dLat/2) + cos(lat1) * cos(lat2) * sin²(dLon/2)    │
│    c = 2 * atan2(√a, √(1-a))                                   │
│    distance = 6371 * c    (Earth radius = 6371 km)             │
│                                                                  │
│  Result:                                                         │
│    distance = 0.92 km                                           │
│                                                                  │
│  Format for Display:                                            │
│    < 1 km    → "920m"                                           │
│    ≥ 1 km    → "0.9km"                                         │
│                                                                  │
│  Estimate Travel Time:                                          │
│    avgSpeed = 40 km/h  (Nepal urban average)                   │
│    time = distance / avgSpeed * 60                             │
│    time = 0.92 / 40 * 60 = 1.38 mins                           │
│    display = "~1 min"                                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Page-Specific Configurations

```
┌─────────────────────────────────────────────────────────────────┐
│                    CITIZEN MAP PAGE                              │
│            /dashboard/citizen/map                                │
├─────────────────────────────────────────────────────────────────┤
│  Purpose: Track own rescue + find nearby hospitals              │
│                                                                  │
│  Hospital Config:                                                │
│    radiusKm: 30          ← Focus on immediate vicinity          │
│    limit: 10             ← Keep map clean                       │
│    skip: !location       ← Only when location available         │
│                                                                  │
│  Displays:                                                       │
│    🐍 User's rescue requests                                    │
│    👨‍⚕️ Assigned rescuer (if any)                                 │
│    🏥 Nearby hospitals (30km)                                   │
│    🔵 User location                                             │
│                                                                  │
│  Updates: Every 10 seconds (pollInterval: 10000)                │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    RESCUER MAP PAGE                              │
│            /dashboard/rescuer/map                                │
├─────────────────────────────────────────────────────────────────┤
│  Purpose: Navigate to rescues + hospital reference              │
│                                                                  │
│  Hospital Config:                                                │
│    radiusKm: 50          ← Operational range                    │
│    limit: 15             ← More options                         │
│    skip: !location       ← Only when location available         │
│                                                                  │
│  Displays:                                                       │
│    🐍 Assigned rescue requests                                  │
│    🏥 Nearby hospitals (50km)                                   │
│    🔵 Rescuer location                                          │
│                                                                  │
│  Use Case:                                                       │
│    - Direct snakebite victims to nearest hospital               │
│    - Quick reference during active rescues                      │
│    - Check antivenom availability                               │
│                                                                  │
│  Updates: Every 15 seconds (pollInterval: 15000)                │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    ADMIN MAP PAGE                                │
│            /dashboard/admin/map                                  │
├─────────────────────────────────────────────────────────────────┤
│  Purpose: Monitor operations + network coverage                 │
│                                                                  │
│  Hospital Config:                                                │
│    radiusKm: 100         ← Strategic overview                   │
│    limit: 50             ← Full network view                    │
│    skip: false           ← Always fetch (default Kathmandu)     │
│                                                                  │
│  Displays:                                                       │
│    🐍 All active rescue requests                                │
│    👨‍⚕️ All active rescuers                                       │
│    🏥 Hospital network (100km)                                  │
│    🔵 Admin location (optional)                                 │
│                                                                  │
│  Use Case:                                                       │
│    - Monitor rescue operations                                  │
│    - Assess hospital coverage                                   │
│    - Strategic resource planning                                │
│    - Identify gaps in network                                   │
│                                                                  │
│  Updates: Every 30 seconds (pollInterval: 30000)                │
└─────────────────────────────────────────────────────────────────┘
```

---

## Hospital Popup Details

```
┌─────────────────────────────────────────────────────────────────┐
│  WHEN USER CLICKS HOSPITAL MARKER:                              │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│  🏥 Bir Hospital                                             │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                              │
│  📍 Location:                                                │
│     Mahabouddha, Kathmandu                                   │
│     Kathmandu, Bagmati Province                              │
│                                                              │
│  📞 Phone: +977-1-4221988                                    │
│  📞 Emergency: +977-1-4221119                                │
│                                                              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                              │
│  Antivenom Status: [ ? Unknown ]  ← Yellow badge            │
│  ⏰ 24/7 Emergency Services                                  │
│                                                              │
│  ⚠️ Please call ahead to confirm antivenom availability     │
│                                                              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                              │
│  📍 0.9km away                                               │
│  ⏱️ ~1 min travel time                                       │
│                                                              │
└──────────────────────────────────────────────────────────────┘

Status Badge Colors:
  [ ✓ Available ]     ← Green (verified <24hrs)
  [ ? Unknown ]       ← Yellow (not verified / stale)
  [ ✗ Out of Stock ]  ← Red (verified unavailable)
```

---

## Integration Summary Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                   SNAKESOS PLATFORM                              │
│              Complete Hospital Integration                       │
└─────────────────────────────────────────────────────────────────┘

DATABASE LAYER (Prisma + PostgreSQL)
├── 65 Real Hospitals (Nepal EDCD data)
├── GPS Coordinates (latitude, longitude)
├── Antivenom Status (AVAILABLE, UNKNOWN, OUT_OF_STOCK)
├── Verification History
└── Province/District Organization

                    ⬆️
                    │
                    ▼

BACKEND API LAYER (GraphQL)
├── HospitalService (Distance calculation, recommendations)
├── Query Resolvers (8 operations)
├── Mutation Resolvers (6 operations)
└── Subscription Resolvers (Real-time - placeholder)

                    ⬆️
                    │
                    ▼

FRONTEND API LAYER (Apollo Client)
├── GraphQL Queries (hospital.queries.ts)
├── GraphQL Mutations (hospital.mutations.ts)
└── React Hooks (hospital.hooks.ts)

                    ⬆️
                    │
                    ▼

COMPONENT LAYER
├── RescueMap ⭐ UPDATED (Shows hospitals + rescues + rescuers)
├── HospitalMap (Standalone hospital finder)
└── HospitalMapWithData (API-integrated hospital map)

                    ⬆️
                    │
                    ▼

PAGE LAYER - ALL UPDATED ✅
├── /dashboard/citizen/map          ← Shows hospitals (30km)
├── /dashboard/rescuer/map          ← Shows hospitals (50km)
├── /dashboard/admin/map            ← Shows hospitals (100km)
├── /dashboard/citizen/hospitals    ← Dedicated hospital finder
└── /dashboard/admin/hospitals      ← Hospital management

                    ⬆️
                    │
                    ▼

END USER
├── 🐍 See rescue requests
├── 👨‍⚕️ Track rescuer location
├── 🏥 Find nearby hospitals with antivenom
├── 📍 Calculate distance and travel time
└── 📞 Get contact information
```

---

## Before & After

### BEFORE Integration:
```
Maps showed:
  🐍 Rescue requests
  👨‍⚕️ Rescuers
  🔵 User location

Missing:
  ❌ Hospital locations
  ❌ Antivenom availability
  ❌ Emergency contact info
  ❌ Distance to hospitals
```

### AFTER Integration:
```
Maps now show:
  🐍 Rescue requests
  👨‍⚕️ Rescuers
  🔵 User location
  🏥 Nearby hospitals ⭐ NEW
  📏 Distance to each hospital ⭐ NEW
  ⏱️ Travel time estimates ⭐ NEW
  💊 Antivenom status ⭐ NEW
  📞 Emergency contacts ⭐ NEW
```

---

## Success! 🎉

**Hospital data is now visible on EVERY map in the application!**

✅ Citizen can find nearby hospitals during emergencies
✅ Rescuers have quick hospital reference during operations
✅ Admins can monitor hospital network coverage
✅ Color-coded by antivenom availability (medical safety compliant)
✅ Distance and travel time calculated for each hospital
✅ Complete contact information in popups

**SnakeSOS now provides complete situational awareness! 🚀**

