# GRAPHQL CONTRACT AUDIT

**Status**: COMPLETE  
**Date**: Current Session  
**Purpose**: Verify coordinate consistency between Database ↔ GraphQL ↔ Frontend

---

## 🎯 EXECUTIVE SUMMARY

**Finding**: GraphQL schema mirrors database inconsistency with THREE coordinate naming conventions.

**Custom Scalars**: ✅ Defined `Latitude` and `Longitude` scalars (validation TBD)

**Coordinate Conventions in GraphQL**:
1. **RescueRequest**: `lat: Latitude`, `lng: Longitude`
2. **Hospital**: `latitude: Float!`, `longitude: Float!`
3. **Volunteer**: `currentLat: Latitude`, `currentLng: Longitude`

**Impact**: Same inconsistency as database level propagates through API layer.

---

## 📊 CUSTOM SCALAR DEFINITIONS

### Latitude Scalar

**File**: `libs/contracts/src/lib/graphql/shared/scalars/scalars.graphql:40`

```graphql
"""
Latitude coordinate (-90 to 90)
"""
scalar Latitude
```

**Analysis**:
- ✅ Defined with documentation
- ⚠️ Range specified in comment but NOT ENFORCED
- ⏳ Implementation needs verification (resolver validation)
- ⏳ Serialization/deserialization needs verification

**Expected Validation** (not yet verified):
```typescript
// Should validate:
// -90 <= value <= 90
// !isNaN(value)
// isFinite(value)
```

---

### Longitude Scalar

**File**: `libs/contracts/src/lib/graphql/shared/scalars/scalars.graphql:45`

```graphql
"""
Longitude coordinate (-180 to 180)
"""
scalar Longitude
```

**Analysis**:
- ✅ Defined with documentation
- ⚠️ Range specified in comment but NOT ENFORCED
- ⏳ Implementation needs verification
- ⏳ Serialization/deserialization needs verification

**Expected Validation**:
```typescript
// Should validate:
// -180 <= value <= 180
// !isNaN(value)
// isFinite(value)
```

---

## 🗺️ TYPE-BY-TYPE COORDINATE ANALYSIS

### RescueRequest Type

**File**: `libs/contracts/src/lib/graphql/rescue/schema.graphql`

```graphql
type RescueRequest {
  # Location Details
  municipality: String!
  ward: Int
  address: String!
  landmark: String
  lat: Latitude        # ← Convention 1: Short form
  lng: Longitude       # ← Convention 1: Short form
  locationAccuracy: Float
  
  # ...
}
```

**Coordinate Fields**:
- `lat: Latitude` (nullable, uses custom scalar)
- `lng: Longitude` (nullable, uses custom scalar)
- `locationAccuracy: Float` (GPS accuracy metadata)

**Analysis**:
- ✅ Uses custom `Latitude`/`Longitude` scalars
- ✅ Nullable (matches database `Float?`)
- ✅ Has accuracy metadata
- ✅ Matches database schema (`lat`/`lng`)
- ⚠️ Short form convention (different from Hospital)

**Database Mapping**:
```
Database Field    →  GraphQL Field
──────────────────────────────────
lat: Float?       →  lat: Latitude
lng: Float?       →  lng: Longitude
locationAccuracy  →  locationAccuracy: Float
```

**Status**: ✅ Direct 1:1 mapping

---

### RescueTimeline Type

**File**: `libs/contracts/src/lib/graphql/rescue/schema.graphql`

```graphql
type RescueTimeline {
  id: ID!
  rescue: RescueRequest!
  event: String!
  description: String
  metadata: JSON
  user: User
  lat: Latitude        # ← Convention 1: Short form
  lng: Longitude       # ← Convention 1: Short form
  createdAt: DateTime!
}
```

**Coordinate Fields**:
- `lat: Latitude` (nullable)
- `lng: Longitude` (nullable)

**Analysis**:
- ✅ Uses custom scalars
- ✅ Nullable
- ✅ Matches database (`lat`/`lng`)
- ✅ Consistent with RescueRequest

**Status**: ✅ Correct

---

### Volunteer Type

**File**: `libs/contracts/src/lib/graphql/volunteer/schema.graphql`

```graphql
type Volunteer {
  # Location (for dispatch)
  currentLat: Latitude       # ← Convention 3: Prefixed
  currentLng: Longitude      # ← Convention 3: Prefixed
  lastLocationUpdate: DateTime
  
  # ...
}
```

**Coordinate Fields**:
- `currentLat: Latitude` (nullable)
- `currentLng: Longitude` (nullable)
- `lastLocationUpdate: DateTime` (timestamp)

**Missing Fields**:
- ❌ `lastKnownLatitude` (exists in database, NOT in GraphQL)
- ❌ `lastKnownLongitude` (exists in database, NOT in GraphQL)

**Analysis**:
- ✅ Uses custom scalars
- ✅ Nullable (matches database)
- ⚠️ Prefixed convention (different from RescueRequest)
- ❌ **CRITICAL**: Database has 4 coordinate fields, GraphQL exposes only 2
- **Question**: Why are `lastKnownLatitude`/`lastKnownLongitude` hidden?

**Database Mapping**:
```
Database Field           →  GraphQL Field
───────────────────────────────────────────
currentLat: Float?       →  currentLat: Latitude ✅
currentLng: Float?       →  currentLng: Longitude ✅
lastKnownLatitude: Float?   →  NOT EXPOSED ❌
lastKnownLongitude: Float?  →  NOT EXPOSED ❌
lastLocationUpdate       →  lastLocationUpdate: DateTime ✅
```

**Status**: ⚠️ Partial mapping - 2 database fields hidden

---

### Hospital Type

**File**: `libs/contracts/src/lib/graphql/hospital/schema.graphql`

```graphql
type Hospital {
  # Location
  latitude: Float!       # ← Convention 2: Full form
  longitude: Float!      # ← Convention 2: Full form
  
  # ...
}
```

**Coordinate Fields**:
- `latitude: Float!` (REQUIRED, NOT custom scalar)
- `longitude: Float!` (REQUIRED, NOT custom scalar)

**Analysis**:
- ❌ Does NOT use custom `Latitude`/`Longitude` scalars
- ✅ REQUIRED (matches database `Float!`)
- ⚠️ Full form convention (different from RescueRequest)
- ⚠️ Uses raw `Float` instead of validated scalars

**Database Mapping**:
```
Database Field    →  GraphQL Field
──────────────────────────────────
latitude: Float!  →  latitude: Float!
longitude: Float! →  longitude: Float!
```

**Status**: ✅ Direct 1:1 mapping, BUT ❌ inconsistent scalar usage

**Question**: Why doesn't Hospital use `Latitude`/`Longitude` scalars?

---

## 🔍 COORDINATE CONVENTION COMPARISON

| Type | Latitude Field | Longitude Field | Scalar Type | Nullable | Convention |
|------|---------------|----------------|-------------|----------|------------|
| RescueRequest | `lat` | `lng` | Custom (`Latitude`/`Longitude`) | ✅ Yes | Short |
| RescueTimeline | `lat` | `lng` | Custom | ✅ Yes | Short |
| Volunteer | `currentLat` | `currentLng` | Custom | ✅ Yes | Prefixed |
| Hospital | `latitude` | `longitude` | **Raw `Float`** | ❌ No | Full |

---

## ⚠️ CRITICAL INCONSISTENCIES

### Issue #1: Three Naming Conventions

**Same as database**:
- RescueRequest/RescueTimeline: `lat`/`lng`
- Volunteer: `currentLat`/`currentLng`
- Hospital: `latitude`/`longitude`

**Impact**:
- Frontend must normalize coordinates from different field names
- Increases complexity in every GraphQL query
- Risk of using wrong field name

---

### Issue #2: Inconsistent Scalar Usage

**RescueRequest & Volunteer**: Use custom `Latitude`/`Longitude` scalars  
**Hospital**: Uses raw `Float!`

**Why is this a problem?**
1. Hospital coordinates bypass scalar validation
2. Inconsistent API contract
3. Confusion about when to use custom scalars

**Question**: Why doesn't Hospital use validated scalars?

**Hypothesis**: Hospital was created before custom scalars were added

---

### Issue #3: Missing Volunteer Fields

**Database has**:
- `currentLat` / `currentLng`
- `lastKnownLatitude` / `lastKnownLongitude`

**GraphQL exposes**:
- `currentLat` / `currentLng` ✅
- `lastKnownLatitude` / `lastKnownLongitude` ❌ HIDDEN

**Why hidden?**
- Intentional (privacy)?
- Oversight?
- Not needed by frontend?

**Impact**: Cannot access "last known" coordinates even if populated in database

---

### Issue #4: Custom Scalar Validation Not Verified

**Defined**:
```graphql
scalar Latitude  # (-90 to 90)
scalar Longitude # (-180 to 180)
```

**Questions**:
- Is range validation implemented in resolver?
- Is NaN/Infinity rejected?
- Is serialization/deserialization correct?
- Are error messages helpful?

**Status**: ⏳ NEEDS VERIFICATION (Phase 0 resolver audit)

---

## 🔄 COORDINATE FLOW TRACING

### RescueRequest Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ CITIZEN CREATES RESCUE                                          │
├─────────────────────────────────────────────────────────────────┤
│ Frontend: GPS → lat, lng (numbers)                              │
│      ↓                                                           │
│ GraphQL Mutation: CreateRescueRequestInput                      │
│   lat: Latitude (custom scalar)                                 │
│   lng: Longitude (custom scalar)                                │
│      ↓                                                           │
│ Resolver: Validates & converts                                  │
│   lat: Latitude → Float                                         │
│   lng: Longitude → Float                                        │
│      ↓                                                           │
│ Database: Prisma                                                │
│   lat: Float?                                                   │
│   lng: Float?                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ ADMIN/RESCUER VIEWS RESCUE                                      │
├─────────────────────────────────────────────────────────────────┤
│ Database: Prisma                                                │
│   lat: Float?                                                   │
│   lng: Float?                                                   │
│      ↓                                                           │
│ GraphQL Query: RescueRequest                                    │
│   lat: Latitude (custom scalar)                                 │
│   lng: Longitude (custom scalar)                                │
│      ↓                                                           │
│ Resolver: Serializes                                            │
│   Float → Latitude                                              │
│   Float → Longitude                                             │
│      ↓                                                           │
│ Frontend: Receives & renders                                    │
│   lat, lng (numbers)                                            │
│      ↓                                                           │
│ Map Component: Uses coordinates                                 │
│   Leaflet marker at (lat, lng)                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Status**: ⏳ Needs runtime verification

---

### Hospital Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ HOSPITAL SEED                                                   │
├─────────────────────────────────────────────────────────────────┤
│ hospitals.seed.ts: REAL coordinates                             │
│   latitude: 27.7042 (Float)                                     │
│   longitude: 85.3138 (Float)                                    │
│      ↓                                                           │
│ Database: Prisma                                                │
│   latitude: Float! (REQUIRED)                                   │
│   longitude: Float! (REQUIRED)                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ USER VIEWS HOSPITAL MAP                                         │
├─────────────────────────────────────────────────────────────────┤
│ Database: Prisma                                                │
│   latitude: Float!                                              │
│   longitude: Float!                                             │
│      ↓                                                           │
│ GraphQL Query: Hospital                                         │
│   latitude: Float!                                              │
│   longitude: Float!                                             │
│      ↓                                                           │
│ Resolver: No conversion (raw Float)                             │
│   Float → Float                                                 │
│      ↓                                                           │
│ Frontend: Receives & renders                                    │
│   latitude, longitude (numbers)                                 │
│      ↓                                                           │
│ Map Component: Normalizes to lat/lng                            │
│   { latitude: 27.7042, longitude: 85.3138 }                     │
│   → Leaflet marker at (27.7042, 85.3138)                        │
└─────────────────────────────────────────────────────────────────┘
```

**Status**: ⏳ Needs runtime verification

---

### Volunteer Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ VOLUNTEER PROFILE CREATED                                       │
├─────────────────────────────────────────────────────────────────┤
│ seed.ts: NO coordinates                                         │
│   currentLat: NULL                                              │
│   currentLng: NULL                                              │
│   lastKnownLatitude: NULL                                       │
│   lastKnownLongitude: NULL                                      │
│      ↓                                                           │
│ Database: Prisma                                                │
│   currentLat: NULL                                              │
│   currentLng: NULL                                              │
│   lastKnownLatitude: NULL                                       │
│   lastKnownLongitude: NULL                                      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ ADMIN VIEWS VOLUNTEER MAP                                       │
├─────────────────────────────────────────────────────────────────┤
│ Database: Prisma                                                │
│   currentLat: NULL                                              │
│   currentLng: NULL                                              │
│      ↓                                                           │
│ GraphQL Query: Volunteer                                        │
│   currentLat: null                                              │
│   currentLng: null                                              │
│      ↓                                                           │
│ Resolver: Returns NULL                                          │
│      ↓                                                           │
│ Frontend: Receives NULL                                         │
│   currentLat: null                                              │
│   currentLng: null                                              │
│      ↓                                                           │
│ Map Component: GENERATES FAKE COORDINATES                       │
│   x: Math.random() * 100                                        │
│   y: Math.random() * 100                                        │
│      ↓                                                           │
│ User sees: FAKE volunteer positions                             │
└─────────────────────────────────────────────────────────────────┘
```

**Status**: ✅ Root cause confirmed (GPS not implemented, frontend handles wrong)

---

## 📋 GRAPHQL INPUT TYPES

### CreateRescueRequestInput

**File**: `libs/contracts/src/lib/graphql/rescue/inputs.graphql`

**Needs Inspection**: ⏳ Check if coordinates are in input type

**Expected**:
```graphql
input CreateRescueRequestInput {
  lat: Latitude
  lng: Longitude
  locationAccuracy: Float
  # ...
}
```

**Verification Required**: Check actual input definition

---

### UpdateVolunteerInput

**Needs Inspection**: ⏳ Check if GPS update is supported

**Expected** (if GPS tracking implemented):
```graphql
input UpdateVolunteerInput {
  currentLat: Latitude
  currentLng: Longitude
  # ...
}
```

**Verification Required**: Check if volunteer location update mutation exists

---

## ✅ WHAT WORKS CORRECTLY

### 1. Custom Scalars Defined
- ✅ `Latitude` scalar exists
- ✅ `Longitude` scalar exists
- ✅ Documented with range comments
- ⏳ Implementation needs verification

### 2. Consistent with Database
- ✅ RescueRequest GraphQL matches database (`lat`/`lng`)
- ✅ Hospital GraphQL matches database (`latitude`/`longitude`)
- ✅ Volunteer GraphQL matches database (`currentLat`/`currentLng`)
- ✅ Nullability matches database
- ✅ Required fields match database

### 3. Metadata Preserved
- ✅ `locationAccuracy` exposed (RescueRequest)
- ✅ `lastLocationUpdate` exposed (Volunteer)

---

## ❌ WHAT NEEDS FIXING

### 1. Inconsistent Naming (P0)
- Three different coordinate field names across types
- Frontend must normalize in every query

### 2. Inconsistent Scalar Usage (P1)
- Hospital uses raw `Float!`
- RescueRequest/Volunteer use custom scalars
- No clear rule for when to use which

### 3. Missing Volunteer Fields (P2)
- `lastKnownLatitude`/`lastKnownLongitude` not exposed
- May be intentional but needs documentation

### 4. Validation Not Verified (P0)
- Custom scalar implementation unknown
- Range validation unknown
- Error handling unknown

---

## 🎯 RECOMMENDED CANONICAL GRAPHQL MODEL

After Phase 0 complete, consider:

### Option A: Use Custom Scalars Everywhere

```graphql
type Hospital {
  latitude: Latitude!    # Not Float!
  longitude: Longitude!  # Not Float!
}
```

### Option B: Normalize Field Names

```graphql
# All types use same names
type RescueRequest {
  latitude: Latitude   # Not lat
  longitude: Longitude # Not lng
}

type Volunteer {
  latitude: Latitude       # Not currentLat
  longitude: Longitude     # Not currentLng
  lastLatitude: Latitude   # Expose hidden field
  lastLongitude: Longitude # Expose hidden field
}
```

### Option C: Coordinate Object Type

```graphql
type Coordinate {
  latitude: Latitude!
  longitude: Longitude!
  accuracy: Float
  timestamp: DateTime
}

type RescueRequest {
  location: Coordinate  # Single field
}

type Hospital {
  location: Coordinate!  # Single field, required
}

type Volunteer {
  currentLocation: Coordinate
  lastKnownLocation: Coordinate
}
```

**Recommendation**: Option C (Coordinate object) provides strongest consistency

---

## 📊 PHASE 0.3 COMPLETION CHECKLIST

### ✅ Completed
- [x] Identified custom scalars
- [x] Mapped all coordinate fields across types
- [x] Compared GraphQL vs Database schema
- [x] Traced coordinate flow (conceptual)
- [x] Documented inconsistencies
- [x] Identified hidden fields

### ⏳ Requires Phase 0 Continuation
- [ ] Verify custom scalar implementation (resolvers)
- [ ] Verify input types for coordinate mutations
- [ ] Runtime verification (GraphQL queries with real data)
- [ ] Check resolver coordinate transformation logic
- [ ] Verify validation error handling

---

## 🚨 CRITICAL FINDINGS SUMMARY

1. **Inconsistent Naming**: `lat`/`lng` vs `currentLat`/`currentLng` vs `latitude`/`longitude`
2. **Inconsistent Scalars**: Hospital uses raw `Float`, others use custom scalars
3. **Hidden Fields**: Volunteer `lastKnownLatitude`/`lastKnownLongitude` not exposed in GraphQL
4. **Validation Unknown**: Custom scalar implementation not yet verified
5. **Direct Database Mapping**: GraphQL mirrors database inconsistency (not fixing it)

---

## 📝 NEXT PHASE 0 STEPS

- [x] 0.1: Database Audit
- [x] 0.2: Seed Data Audit
- [x] 0.3: GraphQL Contract Audit
- [ ] 0.4: Auth/RBAC Audit
- [ ] 0.5: Map Source Audit (check frontend coordinate normalization)
- [ ] 0.6: Hospital Data Audit (runtime verification)
- [ ] 0.7: Rescue Workflow Audit

---

**Document Status**: COMPLETE  
**Confidence**: HIGH (based on schema inspection)  
**Runtime Verification**: PENDING (needs resolver audit + GraphQL testing)
