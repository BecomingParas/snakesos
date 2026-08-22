# PHASE 0: BUG REGISTER

**Status**: AUDIT IN PROGRESS  
**Last Updated**: Current Session

---

## 🔴 P0: CRITICAL BLOCKERS (Production/Security/Data Integrity)

### P0-001: Coordinate Field Inconsistency Across Stack

**Severity**: P0 - Data Integrity Risk  
**Feature**: Coordinates / Location System  
**Status**: IDENTIFIED - NOT FIXED

**Problem**: 
Three different coordinate naming conventions exist across the stack, creating high risk for latitude/longitude swap bugs and null errors.

**Root Cause**:
Database schema evolved with inconsistent field names:
- RescueRequest: `lat` / `lng`
- Volunteer: `currentLat` / `currentLng` + `lastKnownLatitude` / `lastKnownLongitude`
- Hospital: `latitude` / `longitude` (REQUIRED)
- SnakebiteCase: `latitude` / `longitude`

GraphQL schema:
- RescueRequest: `lat: Latitude` / `lng: Longitude` (custom scalars)
- Hospital: `latitude: Float!` / `longitude: Float!`
- Inputs use mix of both

**Evidence**:
```
Database (Prisma):
- libs/database/prisma/schema.prisma lines 232-233 (RescueRequest)
- libs/database/prisma/schema.prisma lines 1027-1028 (Hospital)
- libs/database/prisma/schema.prisma lines 417-418 (Volunteer)

GraphQL:
- libs/contracts/src/lib/graphql/rescue/schema.graphql line 22-23
- libs/contracts/src/lib/graphql/hospital/schema.graphql line 22-23
```

**Impact**:
- High risk of lat/lng swap in map rendering
- High risk of null/undefined errors
- Requires normalization in every component consuming coordinates
- GraphQL resolvers must map between different field names
- Frontend hooks must handle 3 different schemas

**Recommended Fix**:
Create coordinate normalization utility:
```typescript
// libs/shared/src/utils/coordinates.ts
export interface Coordinates {
  lat: number;
  lng: number;
}

export function normalizeCoordinates(obj: any): Coordinates | null {
  if (obj.lat !== undefined && obj.lng !== undefined) {
    return { lat: obj.lat, lng: obj.lng };
  }
  if (obj.latitude !== undefined && obj.longitude !== undefined) {
    return { lat: obj.latitude, lng: obj.longitude };
  }
  if (obj.currentLat !== undefined && obj.currentLng !== undefined) {
    return { lat: obj.currentLat, lng: obj.currentLng };
  }
  return null;
}

export function validateCoordinates(coords: Coordinates): boolean {
  return (
    coords.lat >= -90 &&
    coords.lat <= 90 &&
    coords.lng >= -180 &&
    coords.lng <= 180
  );
}
```

**Priority**: P0 - Must fix before production  
**Estimated Effort**: 2-4 hours  
**Dependencies**: None  
**Regression Risk**: Medium (need to verify all map components)

---

## ✅ P0: VERIFIED CORRECT (No Issue)

### P0-OK-001: Hospital Seed Data Coordinates

**Feature**: Hospital Data / Seeds  
**Status**: VERIFIED CORRECT

**Verification**:
Hospital seed file contains REAL coordinates from EDCD data:
- 68 treatment centers
- Accurate coordinates verified by sampling
- Examples:
  - Bir Hospital: 27.7042, 85.3138 (Kathmandu) ✅
  - Bharatpur Hospital: 27.6831, 84.4342 (Chitwan) ✅
  - TUTH: 27.7357, 85.3281 (Maharajgunj) ✅

**Source**: `libs/database/prisma/seeds/hospitals.seed.ts`

**No Action Required**: Data integrity is good

---

## 🟡 P1: CORE WORKFLOW BLOCKERS

### P1-001: Queue Race Condition Status Unknown

**Severity**: P1 - Workflow Blocker (if broken)  
**Feature**: Rescue Queue  
**Status**: NEEDS TESTING

**Problem**: 
Unknown if atomic assignment prevents two rescuers from accepting same rescue.

**Evidence Required**:
- Test with 2 concurrent browser sessions
- Both rescuers attempt to accept same rescue
- Verify only one succeeds
- Verify database shows single assignment

**Root Cause**: 
Code inspection shows atomic `updateMany` with WHERE clause (GOOD):
```typescript
// libs/database/src/repositories/rescue.repository.ts
const result = await this.prisma.rescueRequest.updateMany({
  where: {
    id: rescueId,
    assignedTo: null,
    status: 'PENDING',
  },
  data: {
    assignedTo: volunteerId,
    status: 'ASSIGNED',
    assignedAt: new Date(),
  },
})
```

**Status**: Code looks correct, but NEEDS UI TESTING to confirm

**Priority**: P1 - Must verify before claiming workflow complete  
**Testing Required**: Yes - 2 browser race condition test

---

### P1-002: End-to-End Rescue Workflow Untested

**Severity**: P1 - Workflow Status Unknown  
**Feature**: Complete Rescue Workflow  
**Status**: NEEDS TESTING

**Problem**:
Full citizen → rescuer → hospital → completion workflow not verified.

**Required Test**:
1. Citizen creates rescue
2. GPS captured correctly
3. Rescue enters queue
4. Rescuer sees rescue
5. Rescuer accepts
6. Status updates
7. Map shows locations correctly
8. Hospital selection works
9. Hospital form saves data
10. Admin sees completed rescue

**Status**: Code exists but integration untested

**Priority**: P1 - Core product workflow  
**Testing Required**: Yes - Full end-to-end test

---

## 🟠 P2: MAJOR UI/FUNCTIONALITY ISSUES

### P2-001: Admin Dashboard Data Source Unknown

**Severity**: P2 - Data Integrity / User Trust  
**Feature**: Admin Dashboard  
**Status**: NEEDS INSPECTION

**Problem**:
Unknown if dashboard statistics come from real GraphQL queries or mock data.

**Files to Audit**:
- `apps/frontend/src/app/(dashboard)/dashboard/admin/page.tsx`
- `apps/frontend/src/components/dashboard/widgets.tsx`

**Evidence Required**:
For each stat card trace:
- Component → Hook → GraphQL → Resolver → Database

**Examples to Check**:
- Total rescues
- Active rescues
- Total rescuers
- Hospitals count
- Charts/analytics

**Priority**: P2 - Must show real data  
**Testing Required**: Yes - Inspect code + verify UI displays real data

---

### P2-002: Map Component Duplication Unknown

**Severity**: P2 - Maintainability Risk  
**Feature**: Map System  
**Status**: NEEDS INSPECTION

**Problem**:
Unknown if business logic is duplicated between EmergencyMap, RescueMap, GoogleEmergencyMap.

**Files to Audit**:
- `apps/frontend/src/components/map/EmergencyMap.tsx`
- `apps/frontend/src/components/map/RescueMap.tsx`
- `apps/frontend/src/components/map/GoogleEmergencyMap.tsx`

**Check For**:
- Duplicate coordinate normalization
- Duplicate hospital queries
- Duplicate marker rendering
- Duplicate routing logic

**Recommended Architecture**:
```
Map/
├── BaseMap (shared)
├── HospitalMarker (shared)
├── RescuerMarker (shared)
├── RescueLocationMarker (shared)
└── RouteLayer (shared)
```

**Priority**: P2 - Maintainability / future bug risk  
**Inspection Required**: Yes - Code audit

---

### P2-003: Hospital Marker Implementation Unknown

**Severity**: P2 - UX / Professional Appearance  
**Feature**: Hospital Markers  
**Status**: NEEDS INSPECTION

**Problem**:
Unknown if hospital markers use emoji (🏥) or professional SVG icons.

**Files to Audit**:
- Map components (EmergencyMap, RescueMap)
- Hospital marker components

**Requirement**:
- NO emoji markers
- Professional SVG icon
- Antivenom status indicator
- Emergency status indicator
- Hover state
- Selected state

**Priority**: P2 - UX quality  
**Inspection Required**: Yes - UI test

---

### P2-004: Responsive Queue Visibility Unknown

**Severity**: P2 - Mobile UX  
**Feature**: Admin Queue / Sidebar  
**Status**: NEEDS TESTING

**Problem**:
Unknown if rescue queue remains visible when sidebar collapses.

**Requirement**:
- Desktop: Queue visible when sidebar collapsed
- Tablet: Queue accessible
- Mobile: Queue in drawer/dedicated section

**Testing Required**:
- Test at 1920px, 1024px, 768px, 375px
- Collapse sidebar
- Verify queue accessibility

**Priority**: P2 - Core workflow accessibility  
**Testing Required**: Yes - Responsive UI test

---

## 🔵 P3: MINOR ISSUES / IMPROVEMENTS

(None identified yet - to be populated during UI testing)

---

## 📊 AUDIT STATUS

### Completed Audits
- [x] Database schema (Prisma)
- [x] Hospital seed data verification
- [x] Coordinate field mapping
- [x] GraphQL schema coordinate fields

### Pending Audits
- [ ] GraphQL resolvers
- [ ] Backend services
- [ ] Authentication/RBAC
- [ ] Map components (code inspection)
- [ ] Admin dashboard (code inspection)
- [ ] Rescue queue (code inspection)
- [ ] Hospital pages (code inspection)

### Pending UI Tests
- [ ] Admin dashboard (desktop/tablet/mobile)
- [ ] Rescue queue (desktop/tablet/mobile)
- [ ] Hospital pages (desktop/tablet/mobile)
- [ ] Map rendering (all viewports)
- [ ] End-to-end rescue workflow
- [ ] Queue race condition test
- [ ] Authentication/RBAC test
- [ ] Responsive UI test (all pages)

---

## 🎯 NEXT ACTIONS

### Immediate (Phase 0 Continuation)
1. Finish source code audit (resolvers, services, auth)
2. Run application
3. Test UI (desktop/tablet/mobile)
4. Test end-to-end workflows
5. Verify race condition handling
6. Complete bug register

### Phase 1 (After Audit)
1. Fix P0 issues (coordinate normalization)
2. Verify P1 workflows (race condition, end-to-end)
3. Fix P2 issues (dashboard data, map, responsive)
4. Regression test

---

## 📝 TESTING PROTOCOL

### For Each Bug
1. **Identify**: Source code inspection or UI observation
2. **Reproduce**: Document exact steps
3. **Trace**: Database → GraphQL → Component → UI
4. **Document**: Root cause with evidence
5. **Fix**: Minimal change with clear reasoning
6. **Test**: Verify fix + check for regressions
7. **Close**: Mark as FIXED with test evidence

### Evidence Requirements
- Code file paths with line numbers
- Screenshots for UI issues
- Console logs for errors
- Network tab for GraphQL issues
- Database queries for data issues

---

**Status**: Phase 0 audit ~40% complete (source audit in progress, UI testing not started)


---

### P2-005: Admin Map Uses Random Volunteer Positions

**Severity**: P2 - Data Integrity / User Confusion  
**Feature**: Admin Dashboard Map  
**Status**: IDENTIFIED

**Problem**:
Volunteer markers on admin dashboard map use `Math.random()` positions instead of real coordinates.

**Evidence**:
```typescript
// apps/frontend/src/app/(dashboard)/dashboard/admin/page.tsx lines 81-82
x: Math.random() * 100, // Mock position (volunteers don't have GPS)
y: Math.random() * 100,
```

**Root Cause**:
Code comment states "volunteers don't have GPS", but Prisma schema shows:
```prisma
currentLat         Float?
currentLng         Float?
lastKnownLatitude  Float?
lastKnownLongitude Float?
```

**Impact**:
- Admin sees fake volunteer positions
- Cannot dispatch based on real location
- Confusing for users expecting real data

**Recommended Fix**:
1. If volunteer has real coordinates, use them
2. If volunteer has no coordinates, either:
   - Don't show marker, OR
   - Show marker with "Location unknown" indicator
3. Never show random positions as if real

**Priority**: P2 - Data integrity / user trust  
**Estimated Effort**: 1-2 hours



---

### P2-006: Homepage Statistics Are Hardcoded (Mock Data)

**Severity**: P2 - Data Integrity / User Trust  
**Feature**: Public Homepage  
**Status**: IDENTIFIED

**Problem**:
Homepage stats are hardcoded strings, not dynamic from database.

**Evidence**:
```typescript
// apps/frontend/src/app/(public)/page.tsx lines 10-13
const stats = [
  { label: 'Active Rescues', value: '4', delta: '2 critical' },
  { label: 'Responders on Duty', value: '11', delta: '3 districts' },
  { label: 'Avg. Response Time', value: '24 min', delta: '−6 min this month' },
  { label: 'Snakes Released', value: '2,847', delta: 'since 2019' },
]
```

**Impact**:
- Users see fake stats
- Stats never update
- "2 critical" is always "2 critical"
- "11 responders" is always "11"
- Misleading for decision-making
- Loss of user trust if discovered

**Recommended Fix**:
Create public GraphQL query for homepage stats:
```graphql
query HomepageStats {
  dashboardStats {
    activeRescues
    criticalRescues
    activeVolunteers
    avgResponseTime
    totalSnakesReleased
  }
}
```

**Priority**: P2 - Public-facing data must be real  
**Estimated Effort**: 2-3 hours  
**Dependencies**: GraphQL resolver for public stats



---

## 🔍 PHASE 0.2 UPDATE: Volunteer Coordinates Root Cause Found

**Finding**: GPS tracking for volunteers is NOT IMPLEMENTED

**Evidence from Seed Audit**:
- ✅ Production seed (`seed.ts`) does NOT populate volunteer GPS fields
- ✅ Database has NULL for all volunteer coordinate fields
- ✅ Frontend comment "volunteers don't have GPS" is ACCURATE
- ❌ Frontend generates fake `Math.random()` coordinates instead of showing "unavailable"

**Updated Root Cause for P2-005**:
1. GPS tracking feature NOT implemented → Schema exists but unused
2. Database has NULL coordinates → Expected behavior
3. Frontend queries volunteers → Receives NULL  
4. Frontend uses `Math.random()` → WRONG approach (should show "unavailable")
5. Result: Fake positions displayed as if real → Data integrity violation

**Correct Behavior Should Be**:
```typescript
const volunteerMarkers = volunteers.edges.map((edge) => {
  const v = edge.node;
  
  // Check for real coordinates
  const hasCoordinates = v.currentLat !== null && v.currentLng !== null;
  
  if (!hasCoordinates) {
    // Option 1: Don't show marker
    return null;
    
    // Option 2: Show with "unavailable" indicator
    return {
      type: 'handler',
      label: `${v.user?.name} · Location unavailable`,
      status: 'NO_GPS',
      // Don't add x/y coordinates
    };
  }
  
  // Use real coordinates
  return {
    type: 'handler',
    x: convertLatToX(v.currentLat),
    y: convertLngToY(v.currentLng),
    status: v.isAvailableNow ? 'AVAILABLE' : 'BUSY',
  };
}).filter(Boolean);
```

**Status**: ROOT CAUSE IDENTIFIED - Fix deferred to Phase 1

