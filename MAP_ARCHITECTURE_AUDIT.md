# MAP ARCHITECTURE AUDIT

**Status**: COMPLETE  
**Date**: Current Session  
**Purpose**: Audit map components, coordinate handling, and normalization logic

---

## 🎯 EXECUTIVE SUMMARY

**Finding**: Map components handle THREE coordinate conventions but with **proper validation**.

**Coordinate Utilities**: ✅ Comprehensive validation exists (`coordinates.ts`)  
**Map Components**: ✅ Use validation before rendering  
**Normalization**: ⚠️ Each component normalizes independently  

**Critical Discovery**: Hospital/Rescuer use `latitude`/`longitude`, Incident uses `lat`/`lng`, but validation handles both.

---

## 📊 MAP COMPONENTS INVENTORY

### Production Map Components

1. **EmergencyMap.tsx** - Leaflet-based emergency map
2. **GoogleEmergencyMap.tsx** - Google Maps emergency map
3. **HospitalMap.tsx** - Hospital directory map
4. **RescueMap.tsx** - Rescue-specific map
5. **EmergencyMapWithRouting.tsx** - Emergency + routing
6. **HospitalMapWithData.tsx** - Hospital map with GraphQL data

### Supporting Components

7. **HospitalInfoCard.tsx** - Hospital popup/card
8. **HospitalList.tsx** - Hospital list view
9. **MapControls.tsx** - Map control buttons
10. **EmergencyModePanel.tsx** - Emergency UI panel
11. **RouteVisualization.tsx** - Route display

---

## 🛠️ COORDINATE UTILITIES

### Frontend Coordinate Validation (apps)

**File**: `apps/frontend/src/lib/map/coordinates.ts`

```typescript
export function isValidCoordinate(
  lat?: number | null,
  lng?: number | null
): boolean {
  // Validates:
  // - Not null/undefined
  // - Is number type
  // - Not NaN, not Infinity
  // - Latitude: -90 to 90
  // - Longitude: -180 to 180
}
```

**Status**: ✅ **Comprehensive validation**

**Features**:
- ✅ Null/undefined checking
- ✅ Type checking
- ✅ NaN/Infinity checking
- ✅ Range validation
- ✅ Nepal bounds checking (`isInNepal()`)
- ✅ Filtering utilities
- ✅ Bounds calculation

---

### Shared Coordinate Validation (libs)

**File**: `libs/frontend/src/lib/map/coordinates.ts`

```typescript
export function validateCoordinates(
  lat: number | null | undefined,
  lng: number | null | undefined,
  allowNullIsland: boolean = false
): CoordinateValidationResult {
  // Returns typed result:
  // ValidatedCoordinates { latitude, longitude, isValid: true }
  // OR
  // InvalidCoordinates { latitude, longitude, isValid: false, reason: string }
}
```

**Status**: ✅ **Production-grade validation**

**Features**:
- ✅ Detailed error reasons
- ✅ Type-safe results
- ✅ "Null Island" (0,0) detection
- ✅ Nepal-specific validation
- ✅ Used in libs (shared across projects)

**Critical Rule**: Rejects (0,0) by default (often indicates missing data)

---

## 🔍 COORDINATE HANDLING ANALYSIS

### Pattern 1: Hospital Markers

**Convention**: `latitude` / `longitude` (Full form)

**EmergencyMap.tsx**:
```typescript
if (!isValidCoordinate(hospital.latitude, hospital.longitude)) {
  console.warn(`Invalid coordinates for hospital ${hospital.name}`);
  return null; // Don't render marker
}

<Marker
  position={[hospital.latitude, hospital.longitude]}
  icon={hospitalIcon}
/>
```

**Status**: ✅ **Correct handling**

**Evidence**:
- Validates before rendering ✅
- Logs warning if invalid ✅
- Skips invalid markers ✅
- Uses direct `latitude`/`longitude` from Hospital type ✅

---

### Pattern 2: Incident/Rescue Markers

**Convention**: `latitude` / `longitude` (converted from `lat`/`lng`)

**EmergencyMap.tsx**:
```typescript
if (incident && isValidCoordinate(incident.latitude, incident.longitude)) {
  allPoints.push([incident.latitude, incident.longitude]);
}

{incident && isValidCoordinate(incident.latitude, incident.longitude) && (
  <Marker position={[incident.latitude, incident.longitude]} />
)}
```

**Analysis**:
- Component receives incident with `latitude`/`longitude` properties
- **Question**: Does IncidentLocation type use `lat`/`lng` or `latitude`/`longitude`?

**Type Definition** (EmergencyMap.tsx:30-43):
```typescript
export interface IncidentLocation {
  id: string;
  latitude: number;  // ← Full form!
  longitude: number; // ← Full form!
  address: string;
  // ...
}
```

**Status**: ✅ Component uses **normalized** `latitude`/`longitude`

**Implication**: Component receives pre-normalized data, NOT raw GraphQL response

---

### Pattern 3: Rescuer Markers

**Convention**: `latitude` / `longitude` (Full form)

**EmergencyMap.tsx**:
```typescript
export interface RescuerLocation {
  id: string;
  name: string;
  latitude: number;  // ← Full form!
  longitude: number; // ← Full form!
  phone?: string;
  status: 'AVAILABLE' | 'EN_ROUTE' | 'ON_SITE' | 'UNAVAILABLE';
  // ...
}
```

**Status**: ✅ Component uses **normalized** `latitude`/`longitude`

**Evidence**: All rescuer markers use `rescuer.latitude` / `rescuer.longitude`

---

### Pattern 4: User Location

**Convention**: `latitude` / `longitude` (Full form)

**HospitalMap.tsx**:
```typescript
userLocation?: { latitude: number; longitude: number } | null;

// Usage:
<Marker position={[userLocation.latitude, userLocation.longitude]} />
```

**Status**: ✅ Consistent with other types

---

### Pattern 5: Route Coordinates

**Convention**: `lat` / `lng` (Short form)

**RouteVisualization.tsx** / **routing.types.ts**:
```typescript
export interface RoutePoint {
  lat: number;  // ← Short form!
  lng: number;  // ← Short form!
}

// Polyline rendering:
<Polyline
  positions={route.coordinates.map(coord => [coord.lat, coord.lng])}
/>
```

**Status**: ⚠️ **Different convention** (but handled correctly)

**Analysis**: Route points use `lat`/`lng` but Leaflet accepts both:
```typescript
[coord.lat, coord.lng]  // Array works fine
```

---

## 🔄 COORDINATE NORMALIZATION FLOW

### Database → GraphQL → Frontend

```
┌─────────────────────────────────────────────────────────────────┐
│ DATABASE (Prisma)                                               │
├─────────────────────────────────────────────────────────────────┤
│ RescueRequest: lat, lng                                         │
│ Hospital: latitude, longitude                                   │
│ Volunteer: currentLat, currentLng                               │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ GRAPHQL                                                         │
├─────────────────────────────────────────────────────────────────┤
│ RescueRequest: lat: Latitude, lng: Longitude                    │
│ Hospital: latitude: Float!, longitude: Float!                   │
│ Volunteer: currentLat: Latitude, currentLng: Longitude          │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ FRONTEND (React Components)                                     │
├─────────────────────────────────────────────────────────────────┤
│ ALL MAP COMPONENTS USE:                                         │
│   latitude: number                                              │
│   longitude: number                                             │
│                                                                 │
│ EXCEPT Route points:                                            │
│   lat: number, lng: number                                      │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ MAP RENDERING (Leaflet/Google Maps)                            │
├─────────────────────────────────────────────────────────────────┤
│ Leaflet Marker: [latitude, longitude] OR [lat, lng]            │
│ Google Maps: { lat, lng }                                       │
└─────────────────────────────────────────────────────────────────┘
```

**Critical Question**: Where does normalization happen?

**Answer**: ⏳ **NEEDS VERIFICATION** - Component prop types suggest normalization occurs before component receives data

---

## 🔍 NORMALIZATION INVESTIGATION

### Suspected Normalization Locations

1. **GraphQL Hook Layer** (likely)
   - `apps/frontend/src/lib/graphql/hooks/*.hooks.ts`
   - Transforms GraphQL response to component props

2. **Page/Container Layer** (possible)
   - `apps/frontend/src/app/(dashboard)/dashboard/admin/page.tsx`
   - Transforms data before passing to map components

3. **Component Internal** (observed for volunteers)
   - Admin dashboard uses `Math.random()` for volunteers
   - Ignores GraphQL response entirely

---

### Admin Dashboard Volunteer Handling

**File**: `apps/frontend/src/app/(dashboard)/dashboard/admin/page.tsx:81-82`

```typescript
// Convert volunteers to markers
volunteers.edges.forEach((edge: any) => {
  const v = edge.node;
  realMarkers.push({
    type: 'handler' as const,
    label: `${v.user?.name || 'Volunteer'} · ${v.municipality}`,
    x: Math.random() * 100, // ← PROBLEM!
    y: Math.random() * 100, // ← PROBLEM!
    priority: 'LOW' as const,
    status: v.isAvailableNow ? 'AVAILABLE' : 'BUSY',
  });
});
```

**Analysis**:
- GraphQL query fetches `currentLat`, `currentLng` (verified in Phase 0.3)
- But code IGNORES them and generates random `x`/`y`
- `x`/`y` are custom dashboard coordinates, NOT lat/lng
- Dashboard likely uses custom coordinate system for field map

**Status**: ❌ **INCORRECT** - Should check if coordinates are NULL, if so hide marker or show "unavailable"

---

## ✅ WHAT WORKS CORRECTLY

### 1. Coordinate Validation ✅

**Both validation utilities**:
- Check null/undefined
- Check NaN/Infinity
- Check range (-90 to 90, -180 to 180)
- Reject invalid coordinates
- Provide error reasons

**Usage in components**: Consistent use of `isValidCoordinate()` before rendering

---

### 2. Invalid Coordinate Handling ✅

**Pattern observed**:
```typescript
if (!isValidCoordinate(hospital.latitude, hospital.longitude)) {
  console.warn(`Invalid coordinates for hospital ${hospital.name}`);
  return null; // Skip marker
}
```

**Status**: ✅ **Correct approach** - Don't render invalid markers

---

### 3. Distance Calculation ✅

**File**: `apps/frontend/src/lib/map/distance.ts`

```typescript
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  // Haversine formula
  // Returns distance in kilometers
}
```

**Used For**:
- Sorting hospitals by distance
- Calculating rescuer ETA
- Finding nearby facilities

**Status**: ✅ Correct implementation

---

### 4. Routing Integration ✅

**Routing Services**:
- OSRM Provider (`providers/osrm.provider.ts`)
- OpenRouteService Provider (`providers/openrouteservice.provider.ts`)

**Coordinate Handling**:
```typescript
// OSRM/ORS expect [lng, lat] order (GeoJSON standard)
const coords = waypoints.map(wp => [wp.lng, wp.lat]);

// Convert response back to {lat, lng}
const routeCoordinates = geometry.coordinates.map((coord) => ({
  lat: coord[1],  // GeoJSON is [lng, lat]
  lng: coord[0],
}));
```

**Status**: ✅ **Correct** - Handles GeoJSON coordinate order

---

## ❌ WHAT NEEDS FIXING

### Issue #1: Volunteer Position Generation (P2)

**Location**: `apps/frontend/src/app/(dashboard)/dashboard/admin/page.tsx:81-82`

**Problem**: Uses `Math.random()` instead of checking database coordinates

**Current**:
```typescript
x: Math.random() * 100,
y: Math.random() * 100,
```

**Should Be**:
```typescript
const hasCoordinates = v.currentLat !== null && v.currentLng !== null;

if (!hasCoordinates) {
  // Option 1: Don't show marker
  return null;
  
  // Option 2: Show with indicator
  return {
    type: 'handler',
    label: `${v.user?.name} · Location unavailable`,
    status: 'NO_GPS',
    // No x/y coordinates
  };
}

// Use real coordinates (convert to custom field map system)
return {
  type: 'handler',
  x: convertLatToFieldX(v.currentLat),
  y: convertLngToFieldY(v.currentLng),
  status: v.isAvailableNow ? 'AVAILABLE' : 'BUSY',
};
```

**Status**: ❌ **Must fix in Phase 1**

---

### Issue #2: Coordinate Normalization Not Centralized (P1)

**Problem**: Each component/page normalizes coordinates independently

**Example Locations**:
- Admin dashboard: Custom normalization for field map
- Hospital hooks: GraphQL → Component props
- Rescue map: GraphQL → Component props

**Impact**:
- Duplication of normalization logic
- Risk of inconsistent handling
- Harder to maintain

**Recommendation**: Create centralized normalization utility:

```typescript
// libs/frontend/src/lib/map/normalize.ts

export function normalizeRescueCoordinates(rescue: any): IncidentLocation {
  return {
    id: rescue.id,
    latitude: rescue.lat,      // ← Normalize here
    longitude: rescue.lng,     // ← Normalize here
    address: rescue.address,
    // ...
  };
}

export function normalizeHospitalCoordinates(hospital: any): HospitalLocation {
  return {
    id: hospital.id,
    latitude: hospital.latitude,   // ← Already correct
    longitude: hospital.longitude, // ← Already correct
    name: hospital.name,
    // ...
  };
}

export function normalizeVolunteerCoordinates(volunteer: any): RescuerLocation | null {
  // Return null if no GPS
  if (volunteer.currentLat === null || volunteer.currentLng === null) {
    return null;
  }
  
  return {
    id: volunteer.id,
    latitude: volunteer.currentLat,     // ← Normalize here
    longitude: volunteer.currentLng,    // ← Normalize here
    name: volunteer.user?.name,
    // ...
  };
}
```

**Status**: ⚠️ **Recommended for Phase 2**

---

### Issue #3: Inconsistent Prop Types (P2)

**Component Types**: Use `latitude`/`longitude`  
**Route Types**: Use `lat`/`lng`

**Impact**: Developers must remember which type to use

**Recommendation**: Standardize on ONE convention:

**Option A**: All use `latitude`/`longitude`
```typescript
export interface Coordinate {
  latitude: number;
  longitude: number;
}
```

**Option B**: All use `lat`/`lng`
```typescript
export interface Coordinate {
  lat: number;
  lng: number;
}
```

**Status**: ⚠️ **Design decision needed**

---

## 📋 MAP COMPONENT DUPLICATION

### Leaflet vs Google Maps

**Leaflet Components**:
- EmergencyMap.tsx
- HospitalMap.tsx
- RescueMap.tsx

**Google Maps Components**:
- GoogleEmergencyMap.tsx

**Status**: ⚠️ **Two implementations** for emergency maps

**Question**: Why both Leaflet and Google Maps?

**Likely Reason**: 
- Leaflet: Free, open-source
- Google Maps: Better UX, more features, but requires API key

**Recommendation**: Choose ONE for production

---

## 🧪 VERIFICATION REQUIRED

### Runtime Verification Needed

1. **Coordinate Normalization**:
   - [ ] Where does `lat`/`lng` → `latitude`/`longitude` conversion happen?
   - [ ] Trace GraphQL response → Component props
   - [ ] Check if normalization is in hooks or pages

2. **Hospital Coordinates**:
   - [ ] Verify hospital markers appear at CORRECT positions
   - [ ] Verify Bir Hospital: 27.7042, 85.3138
   - [ ] Check for lat/lng swap

3. **Rescue Coordinates**:
   - [ ] Verify rescue markers appear at reported locations
   - [ ] Check address matches marker position

4. **Route Rendering**:
   - [ ] Verify routes follow roads (not straight lines)
   - [ ] Check start/end positions match markers

---

## 🎯 RECOMMENDATIONS

### Immediate (Phase 1)

1. ✅ Fix volunteer `Math.random()` generation
   - Check if coordinates are NULL
   - Don't show marker if no GPS
   - OR show "Location unavailable" indicator

2. ✅ Add centralized normalization utilities
   - Create `normalizeRescueCoordinates()`
   - Create `normalizeVolunteerCoordinates()`
   - Use in GraphQL hooks

3. ✅ Runtime verification
   - Test hospital markers with known coordinates
   - Verify no lat/lng swap

### Medium Priority (Phase 2)

4. Standardize coordinate types
   - Choose `latitude`/`longitude` OR `lat`/`lng`
   - Update all interfaces
   - Update all components

5. Reduce map component duplication
   - Choose Leaflet OR Google Maps
   - Remove unused implementation

6. Add coordinate validation to GraphQL layer
   - Implement custom scalar validation
   - Reject invalid coordinates at API level

### Long Term (Phase 3)

7. Add PostGIS support
   - Efficient proximity queries
   - Spatial indexes
   - Geometry types

8. Add coordinate transformation utilities
   - Support different coordinate systems
   - WGS84 ↔ Local grid conversions

---

## 📝 NEXT PHASE 0 STEPS

- [x] 0.1: Database Audit
- [x] 0.2: Seed Data Audit
- [x] 0.3: GraphQL Contract Audit
- [x] 0.4: Auth/RBAC Audit
- [x] 0.5: Map Source Audit
- [ ] 0.6: Hospital Data Audit (runtime verification)
- [ ] 0.7: Rescue Workflow Audit

---

**Document Status**: COMPLETE  
**Confidence**: HIGH (based on component inspection)  
**Runtime Verification**: PENDING (needs UI testing with real data)
