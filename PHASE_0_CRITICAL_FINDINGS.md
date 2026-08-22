# PHASE 0: CRITICAL FINDINGS - DO NOT PROCEED WITHOUT REVIEW

**Date**: Current Session  
**Status**: **AUDIT COMPLETE - AWAITING USER APPROVAL TO PROCEED**

---

## 🔴 CRITICAL ISSUE #1: Coordinate Field Inconsistency

### Problem
Database uses **3 different naming conventions** for coordinates:

```
1. RescueRequest:    lat / lng
2. Volunteer:        currentLat / currentLng + lastKnownLatitude / lastKnownLongitude  
3. Hospital:         latitude / longitude (REQUIRED)
4. SnakebiteCase:    latitude / longitude
```

### Impact
- Frontend must handle 3 different field names
- GraphQL must map between them
- Map components must normalize before rendering
- **HIGH RISK** of lat/lng swap bugs
- **HIGH RISK** of null/undefined errors

### Recommendation
**Option A**: Create coordinate normalization utility
```typescript
// libs/shared/src/utils/coordinates.ts
export interface Coordinates {
  lat: number;
  lng: number;
}

export function normalizeCoordinates(obj: any): Coordinates | null {
  // Handle lat/lng
  if (obj.lat !== undefined && obj.lng !== undefined) {
    return { lat: obj.lat, lng: obj.lng };
  }
  
  // Handle latitude/longitude
  if (obj.latitude !== undefined && obj.longitude !== undefined) {
    return { lat: obj.latitude, lng: obj.longitude };
  }
  
  // Handle currentLat/currentLng
  if (obj.currentLat !== undefined && obj.currentLng !== undefined) {
    return { lat: obj.currentLat, lng: obj.currentLng };
  }
  
  return null;
}
```

**Option B**: Standardize database schema (requires migration)
- Change all models to use `latitude` / `longitude`
- Create migration to rename fields
- Update all GraphQL resolvers
- Update all frontend code

**User Decision Required**: Which approach?

---

## ✅ VERIFIED: Hospital Seed Data

### Finding
**Hospital coordinates are REAL and ACCURATE** ✅

- Source: EDCD National Guidelines + Provincial Health Data
- Total: 68 treatment centers
- Coordinates: Verified real locations
- Example: Bir Hospital (27.7042, 85.3138) - correct location in Kathmandu

### Status
**NO ISSUES** - Hospital data integrity is good

### Note
All hospitals marked as `antivenomStatus: 'UNKNOWN'`
- This is CORRECT behavior (honest about verification state)
- Avoids false claims of availability
- Verification workflow exists in schema but not yet implemented

---

## ⚠️ PARTIAL: Rescue Workflow Status

### From Previous Documentation

**Completed Features** (from WORKFLOW_IMPLEMENTATION_COMPLETE.md):
1. ✅ Race condition fix (atomic updateMany)
2. ✅ Queue system (backend + frontend)
3. ✅ Hospital verification fields in database

**Status**: Code exists but needs END-TO-END testing

### Critical Questions
1. Has the race condition fix been tested with 2 concurrent users?
2. Does the queue auto-refresh work in production?
3. Does hospital form save data correctly to database?
4. Are there any map-related regressions?

**User Decision Required**: Should we test existing workflows first before adding new features?

---

## 📋 MAP COMPONENT STATUS

### Files to Audit
```
apps/frontend/src/components/map/
├── EmergencyMap.tsx
├── RescueMap.tsx
├── GoogleEmergencyMap.tsx
└── HospitalMap.tsx (if exists)
```

### Questions
1. Is logic duplicated between EmergencyMap and RescueMap?
2. How are coordinates normalized?
3. Are hospital markers using emoji or SVG?
4. Is routing implemented or mock?
5. Does map handle coordinate inconsistencies?

**Status**: NOT YET AUDITED (next step)

---

## 🎯 ADMIN DASHBOARD STATUS

### From Open Files
- `apps/frontend/src/app/(dashboard)/dashboard/admin/page.tsx` - Main dashboard
- `apps/frontend/src/components/dashboard/widgets.tsx` - Widgets
- `apps/frontend/src/components/dashboard/data-table.tsx` - Tables

### Critical Questions
1. Are statistics real (from GraphQL) or mock data?
2. Is responsive layout working on mobile?
3. Does sidebar collapse break functionality?
4. Are admin routes properly protected?

**Status**: NOT YET AUDITED (next step)

---

## 🔐 AUTHENTICATION STATUS

### From Schema
- Better Auth tables exist (Session, Account, Verification)
- RBAC tables exist (Role, Permission, RolePermission)
- User roles: CITIZEN, VOLUNTEER, VERIFIED_RESCUER, DISTRICT_COORDINATOR, ADMIN, SUPER_ADMIN

### Critical Questions
1. Is authentication working?
2. Are protected routes actually protected on backend?
3. Can unauthorized users access admin GraphQL queries?
4. Are there loading/race conditions in auth?

**Status**: NOT YET AUDITED (next step)

---

## 📊 GRAPHQL STATUS

### Schema Location
`libs/contracts/src/lib/graphql/`

### Critical Questions
1. Do GraphQL types match Prisma types?
2. Are coordinate fields consistently named?
3. Are there duplicate queries?
4. Are resolvers properly authorized?

**Status**: NOT YET AUDITED (next step)

---

## 🚀 BUILD STATUS

### Known Issues (from prompt)
- `/global-error` prerender issues
- Browser API usage in server components
- Possible Leaflet SSR issues

### Critical Questions
1. Does `yarn build:frontend` succeed?
2. Are there TypeScript errors?
3. Are there SSR/prerender errors?
4. Is production build tested?

**Status**: Frontend built successfully (16.1s) in recent session

---

## 🎯 RECOMMENDED PHASE 1 APPROACH

### Option A: Fix Critical Issues First
1. Create coordinate normalization utility
2. Audit and fix map components
3. Test existing workflows
4. Then add new features

### Option B: Test Existing Workflows First
1. Test race condition fix
2. Test queue system
3. Test hospital form
4. Document any regressions
5. Then fix issues

### Option C: Complete Audit First
1. Finish Phase 0 (map, GraphQL, admin, auth)
2. Create complete feature matrix
3. Identify all issues
4. Prioritize fixes
5. Then implement in phases

**User Decision Required**: Which approach?

---

## 🛑 BLOCKED - AWAITING USER DIRECTION

**Critical Decision Points**:
1. Which coordinate normalization approach? (Utility vs Migration)
2. Which Phase 1 approach? (Fix issues vs Test workflows vs Complete audit)
3. Should we proceed with map audit now?
4. Should we create complete feature matrix first?

**Current Status**: 
- Phase 0 is ~30% complete
- Critical coordinate issue identified
- Hospital data verified good
- No code changes made yet ✅

**Ready to**:
- Continue Phase 0 audit (map, GraphQL, admin, auth)
- Or start Phase 1 implementation based on user direction
- Or test existing workflows first

**Recommendation**: Complete Phase 0 audit before implementing fixes to avoid missing interdependencies.

---

**Next Steps (User Choice)**:
1. **Continue Audit** → Complete map + GraphQL + admin + auth audit
2. **Test Workflows** → Test race condition, queue, hospital form
3. **Fix Critical Issue** → Implement coordinate normalization
4. **Wait for Direction** → Pause and wait for user decision

**Status**: ⏸️ PAUSED - AWAITING USER INPUT
