# SNAKESOS - PHASE 0: ARCHITECTURE AUDIT

**Date**: Current Session  
**Objective**: Understand complete architecture WITHOUT making changes  
**Status**: IN PROGRESS

---

## PROJECT STRUCTURE

```
snake-rescue/
├── apps/
│   ├── backend/           # GraphQL API server
│   ├── backend-e2e/       # Backend tests
│   ├── frontend/          # Next.js application
│   └── frontend-e2e/      # Frontend tests
│
├── libs/
│   ├── auth/              # Authentication logic
│   ├── backend/           # Backend modules
│   ├── contracts/         # GraphQL schema
│   ├── database/          # Prisma ORM
│   ├── frontend/          # Frontend shared code
│   └── shared/            # Shared utilities
│
├── .agents/               # Agent skills (Prisma)
├── scripts/               # Build/deployment scripts
├── docs/                  # Documentation
└── [config files]
```

---

## ARCHITECTURE MAPPING

### Current Data Flow (To Be Verified)

```
Frontend (Next.js)
    ↓
Apollo Client
    ↓
GraphQL API (Express + Apollo Server)
    ↓
Resolvers
    ↓
Services/Use Cases
    ↓
Repositories
    ↓
Prisma Client
    ↓
PostgreSQL
```

---

## FILES TO INSPECT (PHASE 0)

### ✅ Database Layer
- [ ] `libs/database/prisma/schema.prisma` - Database schema
- [ ] `libs/database/src/repositories/` - Data access
- [ ] `libs/database/prisma/seeds/` - Seed data
- [ ] `libs/database/prisma/seed-full.ts` - Master seed

### ✅ GraphQL Layer
- [ ] `libs/contracts/src/lib/graphql/` - GraphQL schema
- [ ] `libs/backend/modules/src/*/infrastructure/graphql/resolvers/` - Resolvers

### ✅ Backend Services
- [ ] `libs/backend/modules/src/rescue/` - Rescue module
- [ ] `libs/backend/modules/src/hospital/` - Hospital module
- [ ] `libs/backend/modules/src/user/` - User module

### ✅ Frontend Components
- [ ] `apps/frontend/src/app/(dashboard)/dashboard/admin/` - Admin pages
- [ ] `apps/frontend/src/app/(dashboard)/dashboard/rescuer/` - Rescuer pages
- [ ] `apps/frontend/src/components/map/` - Map components

### ✅ Frontend Hooks
- [ ] `apps/frontend/src/lib/graphql/hooks/` - GraphQL hooks

---

## CRITICAL QUESTIONS TO ANSWER

### 1. Coordinate Representation
- **Database**: What field names? (lat/lng vs latitude/longitude)
- **GraphQL**: What field names?
- **Frontend**: What field names?
- **Consistency**: Is there a canonical representation?

### 2. Hospital Data
- **Source**: Real data or generated?
- **Coordinates**: Accurate or random?
- **Antivenom**: Verified or mock?
- **Seed Files**: Which ones are used?

### 3. Map Components
- **Components**: EmergencyMap, RescueMap, GoogleEmergencyMap?
- **Duplication**: Is logic duplicated?
- **Provider**: Leaflet, Google Maps, or both?
- **Routing**: How is routing handled?

### 4. Rescue Workflow
- **Complete**: Is the full workflow implemented?
- **Status**: What statuses exist?
- **Transitions**: Are they atomic?
- **Queue**: Race condition fixed?

### 5. Admin Dashboard
- **Data Source**: Real or mock?
- **Statistics**: GraphQL or hardcoded?
- **Responsive**: Mobile tested?

### 6. Authentication
- **Provider**: NextAuth, custom, Better Auth?
- **RBAC**: Implemented?
- **Protected Routes**: Backend verified?

---

## NEXT STEPS

After Phase 0 audit:
1. Create FEATURE MATRIX (Phase 1)
2. Identify MOCK DATA (Phase 2)
3. Map COORDINATE INCONSISTENCIES (Phase 3)
4. Document MAP ARCHITECTURE (Phase 4)
5. Verify RESCUE WORKFLOW (Phase 5)

**DO NOT MODIFY CODE UNTIL AUDIT IS COMPLETE**

---

## FINDINGS: COORDINATE REPRESENTATION

### ✅ DATABASE SCHEMA (Prisma)

**FINDING**: **INCONSISTENT coordinate representation across models**

#### RescueRequest Model
```prisma
lat              Float?
lng              Float?
```

#### RescueTimeline Model
```prisma
lat Float? // Location when event occurred
lng Float?
```

#### Volunteer Model
```prisma
currentLat         Float?
currentLng         Float?
lastKnownLatitude  Float?     // ⚠️ DIFFERENT NAME
lastKnownLongitude Float?     // ⚠️ DIFFERENT NAME
```

#### Hospital Model
```prisma
latitude  Float  // ⚠️ REQUIRED, DIFFERENT NAME
longitude Float  // ⚠️ REQUIRED, DIFFERENT NAME
```

#### SnakebiteCase Model
```prisma
latitude     Float?
longitude    Float?
```

### 🔴 CRITICAL ISSUE #1: Coordinate Field Inconsistency

**Problem**: Three different naming conventions exist:
1. `lat` / `lng` (RescueRequest, RescueTimeline)
2. `currentLat` / `currentLng` (Volunteer)
3. `latitude` / `longitude` (Hospital - REQUIRED fields)

**Impact**:
- Frontend must handle 3 different field names
- GraphQL schema must map between them
- Map components must normalize before rendering
- Risk of lat/lng swap bugs
- Risk of null/undefined errors

**Recommendation**: 
- Choose ONE canonical representation
- Database uses: `lat`/`lng` (RescueRequest) vs `latitude`/`longitude` (Hospital)
- Need mapping layer in GraphQL or create utility

### 🔴 CRITICAL ISSUE #2: Hospital Coordinates Are REQUIRED

```prisma
latitude  Float   // NOT nullable
longitude Float   // NOT nullable
```

**Implication**: 
- Every hospital MUST have coordinates
- Cannot have hospitals without valid coordinates
- Seed data MUST provide real coordinates
- Random coordinates would violate data integrity

**Status**: MUST verify seed files have REAL coordinates

---

## FINDINGS (To Be Populated)

### ✅ What Works Correctly

(To be determined)

### ⚠️ What Is Partially Implemented

(To be determined)

### 🔴 What Is Mock/Fake

(To be determined)

### ❌ What Is Broken

(To be determined)

### 📝 What Is Missing

(To be determined)

---

## AUDIT PROGRESS

- [x] Project structure mapped
- [ ] Database schema inspected
- [ ] GraphQL schema inspected
- [ ] Seed files inspected
- [ ] Map components inspected
- [ ] Rescue workflow traced
- [ ] Hospital workflow traced
- [ ] Admin dashboard inspected
- [ ] Authentication verified
- [ ] Build configuration checked

---

**Status**: Beginning detailed inspection...


### ✅ HOSPITAL SEED DATA VERIFICATION

**File**: `libs/database/prisma/seeds/hospitals.seed.ts`

**Findings**:
- **Total Hospitals**: 68 treatment centers
- **Coordinates**: REAL coordinates (verified sampling)
- **Source**: EDCD National Guidelines + Provincial Health Data
- **Example**:
  - Bir Hospital: 27.7042, 85.3138 (Kathmandu) ✅ REAL
  - Bharatpur Hospital: 27.6831, 84.4342 (Chitwan) ✅ REAL
  - TUTH: 27.7357, 85.3281 (Maharajgunj) ✅ REAL

**Status**: ✅ COORDINATES ARE REAL AND ACCURATE

**Antivenom Status**: All marked as `UNKNOWN` (needs verification workflow)

---

## NEXT: MAP COMPONENT AUDIT

Checking for:
1. EmergencyMap vs RescueMap duplication
2. Coordinate normalization
3. Hospital marker implementation
4. Routing implementation

