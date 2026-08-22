# PHASE 0: COMPLETE AUDIT PLAN (Architecture + UI Testing)

**Objective**: Understand EVERYTHING before making changes  
**Includes**: Code inspection + Actual UI testing + Workflow verification

---

## ✅ COMPLETED (30%)

### Architecture Inspection
- [x] Project structure mapped
- [x] Database schema inspected
- [x] Coordinate inconsistency identified (CRITICAL)
- [x] Hospital seed data verified (REAL coordinates ✅)

### Critical Finding
**Coordinate Field Inconsistency**:
- RescueRequest: `lat` / `lng`
- Volunteer: `currentLat` / `currentLng` + `lastKnownLatitude` / `lastKnownLongitude`
- Hospital: `latitude` / `longitude` (REQUIRED)

**Decision Needed**: Normalization utility vs database migration

---

## ⏳ IN PROGRESS (Next Steps)

### 1. GraphQL Schema Audit
- [ ] Inspect `libs/contracts/src/lib/graphql/`
- [ ] Verify coordinate field mapping
- [ ] Check query/mutation authorization
- [ ] Identify duplicate operations
- [ ] Verify type safety

### 2. Map Components Audit
- [ ] EmergencyMap.tsx
- [ ] RescueMap.tsx
- [ ] GoogleEmergencyMap.tsx
- [ ] Check for duplication
- [ ] Verify coordinate normalization
- [ ] Check hospital marker implementation
- [ ] Verify routing implementation

### 3. Backend Resolvers Audit
- [ ] Rescue resolvers
- [ ] Hospital resolvers
- [ ] User/Auth resolvers
- [ ] Verify authorization checks
- [ ] Check error handling

---

## 🎯 UI TESTING PHASE (CRITICAL - NOT YET STARTED)

### Admin Dashboard Testing

#### Desktop (1920px)
- [ ] `/dashboard/admin` - Main dashboard
  - [ ] All stats load from GraphQL (not mock)
  - [ ] Cards render correctly
  - [ ] Charts work
  - [ ] No horizontal overflow
- [ ] `/dashboard/admin/users` - User management
  - [ ] Table loads real data
  - [ ] Pagination works
  - [ ] Search works
  - [ ] Actions work
- [ ] `/dashboard/admin/hospitals` - Hospital management
  - [ ] Real hospitals load
  - [ ] Coordinates accurate
  - [ ] Antivenom status shown correctly
  - [ ] No fake data
- [ ] `/dashboard/admin/map` - Admin map
  - [ ] Map renders
  - [ ] Hospital markers appear
  - [ ] Rescue markers appear
  - [ ] Popups show real data
  - [ ] No emoji markers

#### Tablet (768px)
- [ ] Sidebar collapses correctly
- [ ] Queue remains visible
- [ ] Map scales properly
- [ ] Tables become responsive
- [ ] No content clipped

#### Mobile (375px)
- [ ] Mobile navigation works
- [ ] Cards stack properly
- [ ] Queue accessible
- [ ] Map usable
- [ ] Forms work
- [ ] Touch targets adequate

### Rescuer Dashboard Testing

#### Desktop
- [ ] `/dashboard/rescuer` - Main dashboard
  - [ ] Shows assigned rescues
  - [ ] Queue visible
  - [ ] Stats accurate
- [ ] `/dashboard/rescuer/queue` - Rescue queue
  - [ ] Auto-refresh works (5s)
  - [ ] Municipality filter works
  - [ ] Accept button works
  - [ ] Race condition handled
  - [ ] **CRITICAL**: 2 rescuers can't claim same rescue
- [ ] `/dashboard/rescuer/active` - Active rescue
  - [ ] Rescue details load
  - [ ] Status update works
  - [ ] Complete form appears
  - [ ] Hospital section works
  - [ ] Hospital search works
  - [ ] Antivenom fields work
  - [ ] Data saves to database

#### Mobile
- [ ] Queue accessible
- [ ] Accept button usable
- [ ] Complete form usable
- [ ] Hospital selection works

### Citizen Dashboard Testing

#### Desktop
- [ ] `/dashboard/citizen` - Dashboard
  - [ ] Shows citizen's rescues
  - [ ] Status updates
  - [ ] Can create new rescue
- [ ] `/report` - Create rescue
  - [ ] GPS capture works
  - [ ] Image upload works
  - [ ] Form validation works
  - [ ] Submission works

#### Mobile
- [ ] GPS works on mobile
- [ ] Camera works
- [ ] Form usable

---

## 🔒 AUTHENTICATION TESTING

### Login Flow
- [ ] Login page renders
- [ ] Login works
- [ ] Session persists
- [ ] Redirect to correct dashboard

### Role-Based Access
- [ ] Citizen cannot access `/dashboard/admin`
- [ ] Rescuer cannot access admin operations
- [ ] Unauthenticated redirects to login
- [ ] **CRITICAL**: Backend verifies authorization (not just frontend)

### Session States
- [ ] Loading state
- [ ] Authenticated state
- [ ] Unauthenticated state
- [ ] Error state
- [ ] Expired session
- [ ] Logout

---

## 🗺️ MAP SYSTEM TESTING

### Map Rendering
- [ ] Map loads
- [ ] Markers appear
- [ ] Coordinates accurate
- [ ] No random coordinates
- [ ] No emoji markers

### Hospital Markers
- [ ] Hospital markers render
- [ ] Coordinates from database
- [ ] Popup shows real data
- [ ] Antivenom status accurate
- [ ] Click to select works

### Rescue Markers
- [ ] Rescue location renders
- [ ] Citizen coordinates accurate
- [ ] Popup shows rescue details

### Rescuer Tracking
- [ ] Rescuer marker appears
- [ ] Location updates
- [ ] Route renders (if implemented)

### Routing
- [ ] Route calculation works
- [ ] Start/end coordinates correct
- [ ] Route renders on map
- [ ] ETA/distance accurate
- [ ] Error handling works

---

## 🚨 CRITICAL WORKFLOW TESTING

### End-to-End Rescue Workflow

1. **Citizen Creates Rescue**
   - [ ] Form submits
   - [ ] GPS captured
   - [ ] Data saved to database
   - [ ] Status = PENDING

2. **Rescue Enters Queue**
   - [ ] Appears in rescuer queue
   - [ ] Visible to rescuers
   - [ ] Priority shown
   - [ ] Location shown

3. **Rescuer Accepts**
   - [ ] Accept button works
   - [ ] Status → ACCEPTED
   - [ ] Race condition prevented
   - [ ] Citizen notified (if implemented)

4. **Status Updates**
   - [ ] IN_PROGRESS works
   - [ ] ARRIVED works
   - [ ] Citizen sees updates

5. **Rescue Completion**
   - [ ] Complete form works
   - [ ] Outcome selection works
   - [ ] Report required

6. **Hospital Workflow**
   - [ ] Hospital toggle works
   - [ ] Hospital search works
   - [ ] Hospital selection works
   - [ ] Antivenom fields work
   - [ ] Admission toggle works
   - [ ] Data saves correctly

7. **Admin Verification**
   - [ ] Admin sees completed rescue
   - [ ] All data present
   - [ ] Hospital linkage correct
   - [ ] Analytics updated

---

## 🐛 BUG TRACKING

| Component | Issue | Severity | Status |
|-----------|-------|----------|--------|
| Database | Coordinate field inconsistency | P0 | IDENTIFIED |
| (TBD) | (TBD) | (TBD) | (TBD) |

---

## 📊 TESTING PROGRESS

```
Architecture Audit:  ████░░░░░░ 30%
UI Testing:          ░░░░░░░░░░  0%
Workflow Testing:    ░░░░░░░░░░  0%
Overall Phase 0:     ██░░░░░░░░ 20%
```

---

## 🎯 NEXT IMMEDIATE STEPS

1. **Complete Architecture Audit**
   - GraphQL schema
   - Map components
   - Backend resolvers

2. **Start UI Testing**
   - Admin dashboard
   - Rescuer dashboard
   - Citizen dashboard

3. **Test Critical Workflows**
   - End-to-end rescue
   - Queue race condition
   - Hospital selection

4. **Document All Findings**
   - Create UI_TEST_REPORT.md
   - Update bug tracker
   - Prioritize fixes

---

## ⛔ DO NOT PROCEED TO PHASE 1 UNTIL:

- [ ] Complete architecture audit
- [ ] Complete UI testing (desktop + tablet + mobile)
- [ ] Test all critical workflows
- [ ] Document all bugs
- [ ] Prioritize fixes
- [ ] Get user approval

**Status**: Phase 0 is 20% complete - UI testing not yet started
