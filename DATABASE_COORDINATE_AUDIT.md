# DATABASE COORDINATE AUDIT

**Status**: COMPLETE  
**Date**: Current Session  
**Purpose**: Document ALL coordinate field naming conventions across the database schema

---

## 🎯 EXECUTIVE SUMMARY

**Critical Finding**: THREE different coordinate naming conventions exist across the database schema.

**Impact**: 
- High risk of lat/lng swap bugs
- Inconsistent coordinate handling across models
- Complex normalization required in every layer
- Potential for null reference errors
- Maintenance burden

**Recommendation**: Define canonical coordinate model AFTER Phase 0 complete audit.

---

## 📊 COORDINATE CONVENTIONS FOUND

### Convention 1: `lat` / `lng` (Short Form)
**Models Using This**:
- `RescueRequest`
- `RescueTimeline`

### Convention 2: `latitude` / `longitude` (Full Form)
**Models Using This**:
- `Hospital`
- `SnakebiteCase`
- `SpeciesObservation`
- `Hotspot`

### Convention 3: Prefixed Variants
**Models Using This**:
- `Volunteer`: `currentLat`, `currentLng`, `lastKnownLatitude`, `lastKnownLongitude`
- `RescueVehicle`: `lastKnownLatitude`, `lastKnownLongitude`

---

## 🗂️ MODEL-BY-MODEL COORDINATE INVENTORY

### RescueRequest (PRIMARY RESCUE MODEL)

**File**: `libs/database/prisma/schema.prisma:232-233`

```prisma
model RescueRequest {
  lat              Float?
  lng              Float?
  locationAccuracy Float? // GPS accuracy in meters
  
  // ...
}
```

**Analysis**:
- ✅ Nullability: OPTIONAL (`Float?`)
- ✅ Has accuracy metadata
- ⚠️ Uses short form `lat`/`lng`
- ⚠️ No validation constraints
- ⚠️ No index for geospatial queries
- ✅ Precision: Float (sufficient for coordinates)

**Update Source**: Citizen report (GPS/manual entry)  
**Timestamp**: `createdAt`  
**Trusted**: Medium (user-provided, may be inaccurate)

---

### RescueTimeline

**File**: `libs/database/prisma/schema.prisma:364-365`

```prisma
model RescueTimeline {
  lat Float? // Location when event occurred
  lng Float?
  
  // ...
}
```

**Analysis**:
- ✅ Nullability: OPTIONAL (`Float?`)
- ⚠️ Uses short form `lat`/`lng`
- ⚠️ No validation
- ✅ Purpose: Track location at each event

**Update Source**: Event trigger (rescuer app)  
**Timestamp**: `createdAt`  
**Trusted**: Medium-High (device GPS)

---

### Volunteer (COMPLEX: Multiple Coordinate Fields)

**File**: `libs/database/prisma/schema.prisma:417-420, 457-458`

```prisma
model Volunteer {
  // Real-time location (for dispatch)
  currentLat         Float?
  currentLng         Float?
  lastLocationUpdate DateTime?
  
  // Persistent location snapshot
  lastKnownLatitude              Float?
  lastKnownLongitude             Float?
  lastLocationUpdateFromTracking DateTime?
  
  // ...
}
```

**Analysis**:
- ⚠️ FOUR coordinate fields (confusing!)
- ⚠️ Two different naming conventions in SAME model
- ❌ No clear semantic difference between:
  - `currentLat`/`currentLng` vs
  - `lastKnownLatitude`/`lastKnownLongitude`
- ✅ Nullability: All OPTIONAL
- ✅ Has timestamps for each coordinate set
- ❌ No validation
- ❌ No index

**Current Issue**:
- Admin dashboard code assumes "volunteers don't have GPS"
- Schema provides GPS fields
- **NEEDS VERIFICATION**: Are these fields populated in database?

**Update Source**: 
- `currentLat`/`currentLng`: Real-time tracking?
- `lastKnownLatitude`/`lastKnownLongitude`: Cached position?

**Trusted**: High (if from GPS tracking system)

---

### Hospital (CANONICAL TREATMENT CENTER MODEL)

**File**: `libs/database/prisma/schema.prisma:1027-1028`

```prisma
model Hospital {
  latitude  Float!
  longitude Float!
  
  // ...
}
```

**Analysis**:
- ✅ Uses full form `latitude`/`longitude`
- ❌ NOT nullable (`Float!` - REQUIRED)
- ⚠️ No validation constraints
- ⚠️ No index for geospatial queries
- ✅ Precision: Float

**Critical**: Hospital coordinates are REQUIRED (non-nullable)

**Update Source**: EDCD seed data (68 real treatment centers)  
**Timestamp**: `updatedAt`  
**Trusted**: HIGH (government healthcare data)

---

### SnakebiteCase (HISTORICAL ANALYTICS MODEL)

**File**: `libs/database/prisma/schema-enhancements-geospatial.prisma:101-102`

```prisma
model SnakebiteCase {
  // Coordinates (anonymized/aggregated for privacy)
  latitude  Float?
  longitude Float?
  
  // ...
}
```

**Analysis**:
- ✅ Uses full form `latitude`/`longitude`
- ✅ Nullability: OPTIONAL
- ⚠️ Anonymized/aggregated (privacy requirement)
- ⚠️ No validation
- ⚠️ Comment indicates privacy constraint

**Update Source**: Historical case import  
**Timestamp**: `dateOfBite`, `createdAt`  
**Trusted**: Medium (aggregated/anonymized)

---

### SpeciesObservation

**File**: `libs/database/prisma/schema-enhancements-geospatial.prisma:293-294`

```prisma
model SpeciesObservation {
  latitude     Float
  longitude    Float
  locationName String?
  district     String?
  
  // ...
}
```

**Analysis**:
- ✅ Uses full form `latitude`/`longitude`
- ❌ NOT nullable (`Float` - REQUIRED)
- ✅ Has location name and district context
- ⚠️ No validation

**Update Source**: Observer/volunteer report  
**Timestamp**: `observedAt`  
**Trusted**: Medium

---

### Hotspot

**File**: Schema enhancements (location TBD)

```prisma
model Hotspot {
  latitude  Float
  longitude Float
  
  // ...
}
```

**Analysis**:
- ✅ Uses full form `latitude`/`longitude`
- ❌ NOT nullable - REQUIRED
- ⚠️ No validation

**Update Source**: Analytics/heatmap calculation  
**Trusted**: High (derived from aggregated data)

---

### RescueVehicle

**File**: `libs/database/prisma/schema-enhancements-geospatial.prisma:230-231`

```prisma
model RescueVehicle {
  // Location (persistent snapshot, not real-time)
  lastKnownLatitude  Float?
  lastKnownLongitude Float?
  lastLocationUpdate DateTime?
  
  // ...
}
```

**Analysis**:
- ✅ Uses prefixed full form
- ✅ Nullability: OPTIONAL
- ✅ Has timestamp
- ⚠️ Comment: "not real-time"
- ⚠️ No validation

**Update Source**: Vehicle tracking system  
**Trusted**: High (if GPS-equipped)

---

## 🔍 VALIDATION ANALYSIS

### Current Validation: NONE

**No constraints on**:
- Latitude range (-90 to 90)
- Longitude range (-180 to 180)
- Non-null when required
- Swap detection
- Invalid values (0,0, NaN, Infinity)

### Recommended Validation

**Database Level** (PostgreSQL CHECK constraints):
```sql
ALTER TABLE rescue_request 
  ADD CONSTRAINT valid_latitude CHECK (lat IS NULL OR (lat >= -90 AND lat <= 90));
  
ALTER TABLE rescue_request 
  ADD CONSTRAINT valid_longitude CHECK (lng IS NULL OR (lng >= -180 AND lng <= 180));
```

**Application Level** (Prisma/GraphQL):
```typescript
// Custom validation in resolvers
function validateCoordinate(lat: number, lng: number): boolean {
  return (
    lat >= -90 && lat <= 90 &&
    lng >= -180 && lng <= 180 &&
    !isNaN(lat) && !isNaN(lng) &&
    isFinite(lat) && isFinite(lng)
  );
}
```

---

## 🗺️ GEOSPATIAL INDEX ANALYSIS

### Current Indexes: NONE FOUND

**Missing Indexes**:
- No PostGIS indexes
- No compound indexes on (latitude, longitude)
- No spatial indexes for proximity queries

### Impact:
- Slow "find nearby hospitals" queries
- Slow "find available rescuers in area" queries
- No efficient radius/bounding box searches

### Recommended Indexes

**Option 1: Compound B-tree Index** (without PostGIS):
```prisma
@@index([latitude, longitude])
```

**Option 2: PostGIS Spatial Index** (requires PostGIS extension):
```sql
-- Would require adding geometry column
ALTER TABLE hospital ADD COLUMN location geometry(Point, 4326);
CREATE INDEX hospital_location_idx ON hospital USING GIST(location);
```

---

## 📋 COORDINATE FIELD SUMMARY TABLE

| Model | Latitude Field | Longitude Field | Nullable | Convention | Validated | Indexed | Update Source |
|-------|---------------|----------------|----------|------------|-----------|---------|---------------|
| RescueRequest | `lat` | `lng` | ✅ Yes | Short | ❌ No | ❌ No | Citizen GPS |
| RescueTimeline | `lat` | `lng` | ✅ Yes | Short | ❌ No | ❌ No | Event trigger |
| Volunteer | `currentLat` | `currentLng` | ✅ Yes | Prefixed | ❌ No | ❌ No | GPS tracking |
| Volunteer | `lastKnownLatitude` | `lastKnownLongitude` | ✅ Yes | Prefixed-Full | ❌ No | ❌ No | GPS cache |
| Hospital | `latitude` | `longitude` | ❌ No (Required) | Full | ❌ No | ❌ No | EDCD seed |
| SnakebiteCase | `latitude` | `longitude` | ✅ Yes | Full | ❌ No | ❌ No | Case import |
| SpeciesObservation | `latitude` | `longitude` | ❌ No (Required) | Full | ❌ No | ❌ No | Observer |
| Hotspot | `latitude` | `longitude` | ❌ No (Required) | Full | ❌ No | ❌ No | Analytics |
| RescueVehicle | `lastKnownLatitude` | `lastKnownLongitude` | ✅ Yes | Prefixed-Full | ❌ No | ❌ No | Vehicle GPS |

---

## ⚠️ CRITICAL INCONSISTENCIES

### 1. Naming Convention Mismatch
- RescueRequest uses `lat`/`lng`
- Hospital uses `latitude`/`longitude`
- GraphQL must map between both
- Frontend must normalize

### 2. Volunteer Coordinate Duplication
- WHY does Volunteer have 4 coordinate fields?
- What is the semantic difference between:
  - `currentLat`/`currentLng` vs
  - `lastKnownLatitude`/`lastKnownLongitude`
- Admin dashboard assumes no GPS exists

### 3. Nullability Inconsistency
- Hospital: coordinates REQUIRED (!)
- RescueRequest: coordinates OPTIONAL (?)
- SpeciesObservation: coordinates REQUIRED (!)
- Volunteer: all coordinates OPTIONAL (?)

**Question**: Can you create a rescue without coordinates?  
**Answer**: Schema says YES (nullable), but is this correct?

### 4. No Validation
- No range checks (-90 to 90, -180 to 180)
- No swap detection
- No invalid value prevention (0,0 when meaningless, NaN, Infinity)

### 5. No Indexes
- Proximity queries will be SLOW
- No geospatial optimization

---

## 🎯 RECOMMENDED CANONICAL MODEL

After Phase 0, consider defining ONE domain coordinate model:

```typescript
// libs/shared/src/geo/coordinate.ts

/**
 * Canonical coordinate representation
 * WGS84 decimal degrees
 */
export interface Coordinate {
  /** Latitude in decimal degrees [-90, 90] */
  latitude: number;
  
  /** Longitude in decimal degrees [-180, 180] */
  longitude: number;
}

/**
 * Optional coordinate (for entities where location may not be known)
 */
export type MaybeCoordinate = Coordinate | null;

/**
 * Coordinate with metadata
 */
export interface CoordinateWithMetadata extends Coordinate {
  /** GPS accuracy in meters (optional) */
  accuracy?: number;
  
  /** When coordinate was captured */
  timestamp?: Date;
  
  /** Source of coordinate */
  source?: 'gps' | 'manual' | 'geocoded' | 'estimated';
  
  /** Trust level */
  trust?: 'high' | 'medium' | 'low';
}
```

### Adapter Pattern for Legacy Fields

```typescript
/**
 * Normalize any coordinate object to canonical form
 */
export function normalizeCoordinate(obj: any): Coordinate | null {
  // Convention 1: lat/lng
  if (obj.lat !== undefined && obj.lng !== undefined) {
    return { latitude: obj.lat, longitude: obj.lng };
  }
  
  // Convention 2: latitude/longitude
  if (obj.latitude !== undefined && obj.longitude !== undefined) {
    return { latitude: obj.latitude, longitude: obj.longitude };
  }
  
  // Convention 3: currentLat/currentLng
  if (obj.currentLat !== undefined && obj.currentLng !== undefined) {
    return { latitude: obj.currentLat, longitude: obj.currentLng };
  }
  
  // Convention 3: lastKnownLatitude/lastKnownLongitude
  if (obj.lastKnownLatitude !== undefined && obj.lastKnownLongitude !== undefined) {
    return { latitude: obj.lastKnownLatitude, longitude: obj.lastKnownLongitude };
  }
  
  return null;
}
```

---

## ✅ VERIFICATION REQUIREMENTS (Phase 0 Continuation)

### Database Data Verification Needed
- [ ] Check if RescueRequest records have `lat`/`lng` populated
- [ ] Check if Volunteer records have `currentLat`/`currentLng` populated
- [ ] Check if Volunteer records have `lastKnownLatitude`/`lastKnownLongitude` populated
- [ ] Verify Hospital coordinates match seed data
- [ ] Count records with null coordinates per model

### Runtime Verification Needed
- [ ] Trace RescueRequest coordinates: Database → GraphQL → Frontend → Map
- [ ] Trace Hospital coordinates: Database → GraphQL → Frontend → Map
- [ ] Trace Volunteer coordinates: Database → GraphQL → Frontend → Map
- [ ] Verify no lat/lng swaps occur in transformation chain
- [ ] Verify map markers appear at correct positions

### GraphQL Mapping Verification Needed
- [ ] Check resolver mapping for `lat`/`lng` → GraphQL schema
- [ ] Check resolver mapping for `latitude`/`longitude` → GraphQL schema
- [ ] Verify coordinate serialization/deserialization
- [ ] Check for transformation bugs in resolvers

---

## 🚨 PHASE 0 STATUS

**Database Coordinate Audit**: ✅ COMPLETE

**Key Findings**:
1. Three naming conventions (`lat`/`lng`, `latitude`/`longitude`, prefixed variants)
2. No validation constraints
3. No geospatial indexes
4. Volunteer model has confusing duplicate coordinates
5. Inconsistent nullability

**Next Phase 0 Steps**:
- 0.2: Seed Data Audit
- 0.3: GraphQL Contract Audit
- 0.4: Auth/RBAC Audit
- 0.5: Map Source Audit

**DO NOT IMPLEMENT FIXES YET** - Complete full Phase 0 audit first.

---

**Document Status**: COMPLETE  
**Confidence**: HIGH (based on schema inspection)  
**Runtime Verification**: PENDING (requires database query access)
