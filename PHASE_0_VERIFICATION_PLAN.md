# Phase 0: Complete Workflow Verification Plan

**Objective**: Test the ACTUAL implementation before making any changes  
**Duration**: 1-2 days  
**Status**: PENDING EXECUTION

---

## WHY PHASE 0 IS CRITICAL

**Do NOT skip this phase.**

Before implementing new features or refactoring code, we must understand:
1. ✅ What actually works (not just "looks like it works")
2. ❌ What is broken
3. ⚠️ What is partially implemented
4. 🔍 What is unclear

**Bad approach**: 
```
"The code exists, so it probably works" → Make changes → Break existing functionality
```

**Correct approach**:
```
Test everything → Document findings → Plan fixes → Implement systematically
```

---

## TEST ENVIRONMENT SETUP

### Prerequisites

1. **Database is seeded**
   ```bash
   npm run db:seed
   ```

2. **Backend server running**
   ```bash
   npm run backend:dev
   ```

3. **Frontend server running**
   ```bash
   npm run frontend:dev
   ```

4. **Test users available**
   - CITIZEN account
   - RESCUER/VOLUNTEER account  
   - ADMIN account

### Create Test Users (if not seeded)

```sql
-- Via Prisma Studio or direct SQL

-- CITIZEN
INSERT INTO users (id, email, name, role, status, password)
VALUES (
  gen_random_uuid(),
  'citizen@test.com',
  'Test Citizen',
  'CITIZEN',
  'ACTIVE',
  '$2a$10$...' -- Hashed "password123"
);

-- RESCUER
INSERT INTO users (id, email, name, role, status, password)
VALUES (
  gen_random_uuid(),
  'rescuer@test.com',
  'Test Rescuer',
  'VERIFIED_RESCUER',
  'ACTIVE',
  '$2a$10$...'
);

-- Also create Volunteer profile for rescuer
INSERT INTO volunteers (id, user_id, name, contact, municipality, experience, vehicle, status)
VALUES (
  gen_random_uuid(),
  (SELECT id FROM users WHERE email = 'rescuer@test.com'),
  'Test Rescuer',
  '9841234567',
  'Kathmandu',
  'Expert',
  'Bike',
  'VERIFIED'
);

-- ADMIN
INSERT INTO users (id, email, name, role, status, password)
VALUES (
  gen_random_uuid(),
  'admin@test.com',
  'Test Admin',
  'ADMIN',
  'ACTIVE',
  '$2a$10$...'
);
```

---

## TEST PLAN

### TEST 1: USER AUTHENTICATION

#### 1.1 Registration
- [ ] Navigate to `/auth/signup`
- [ ] Fill registration form
- [ ] Submit
- [ ] **VERIFY**: User created in database
- [ ] **VERIFY**: Session created
- [ ] **VERIFY**: Redirected to dashboard
- [ ] **VERIFY**: Role is CITIZEN by default

**Expected Behavior**: ✅ User can register  
**Actual Behavior**: _____________________  
**Issues Found**: _____________________

#### 1.2 Login
- [ ] Navigate to `/auth/login`
- [ ] Enter credentials
- [ ] Submit
- [ ] **VERIFY**: Session created
- [ ] **VERIFY**: Redirected to correct dashboard (by role)
- [ ] **VERIFY**: User data loaded

**Expected Behavior**: ✅ User can login  
**Actual Behavior**: _____________________  
**Issues Found**: _____________________

#### 1.3 Role-based Redirect
- [ ] Login as CITIZEN → Should redirect to `/dashboard/citizen`
- [ ] Login as RESCUER → Should redirect to `/dashboard/rescuer`
- [ ] Login as ADMIN → Should redirect to `/dashboard/admin`

**Expected Behavior**: ✅ Role-based routing  
**Actual Behavior**: _____________________  
**Issues Found**: _____________________

---

### TEST 2: CREATE RESCUE REQUEST (CITIZEN)

#### 2.1 Navigate to Request Form
- [ ] Login as CITIZEN
- [ ] Find "Request Rescue" or "Emergency" button
- [ ] Click button
- [ ] **VERIFY**: Form displays

**Location of button**: _____________________  
**Route**: _____________________  
**Issues Found**: _____________________

#### 2.2 Fill Rescue Request Form
- [ ] Enter name: "Test Citizen"
- [ ] Enter phone: "9841234567"
- [ ] Select municipality: "Kathmandu"
- [ ] Enter address: "Thamel, Ward 26"
- [ ] Enter description: "Large snake in bedroom"
- [ ] **ATTEMPT**: Capture GPS location
- [ ] **ATTEMPT**: Upload snake image

**GPS capture works?**: YES / NO  
**Image upload works?**: YES / NO  
**Issues Found**: _____________________

#### 2.3 Submit Request
- [ ] Click "Submit" or "Request Rescue"
- [ ] **VERIFY**: Loading state shown
- [ ] **VERIFY**: Success message shown
- [ ] **VERIFY**: Redirected to request details or list
- [ ] **VERIFY**: Request appears in "My Requests"

**Expected Behavior**: ✅ Request created  
**Actual Behavior**: _____________________  
**Issues Found**: _____________________

#### 2.4 Verify in Database
```sql
SELECT * FROM rescue_requests 
ORDER BY created_at DESC 
LIMIT 1;
```

**Check**:
- [ ] Record created
- [ ] User ID correct
- [ ] Status is PENDING
- [ ] Location captured (lat/lng)
- [ ] Priority assigned

**Issues Found**: _____________________

#### 2.5 Verify on Admin Map
- [ ] Login as ADMIN
- [ ] Navigate to `/dashboard/admin/map`
- [ ] **VERIFY**: New rescue marker appears

**Marker visible?**: YES / NO  
**Marker color/icon correct?**: _____________________  
**Issues Found**: _____________________

---

### TEST 3: VIEW RESCUE QUEUE (RESCUER)

#### 3.1 Locate Rescue Queue
- [ ] Login as RESCUER
- [ ] **OBSERVE**: Where is the rescue queue?
- [ ] **OBSERVE**: Is it visible on homepage?
- [ ] **OBSERVE**: Does it require navigation?

**Queue location**: _____________________  
**Visible without navigation?**: YES / NO  
**Route (if navigated)**: _____________________

#### 3.2 Queue Display
- [ ] **VERIFY**: Test rescue request visible in queue
- [ ] **VERIFY**: Distance shown
- [ ] **VERIFY**: Priority badge shown
- [ ] **VERIFY**: Request details shown
- [ ] **VERIFY**: "Accept" button visible

**Queue works?**: YES / NO  
**Issues Found**: _____________________

#### 3.3 Queue Updates
- [ ] Keep queue open
- [ ] In another tab, create new rescue request (as citizen)
- [ ] **WAIT**: 30-60 seconds
- [ ] **VERIFY**: New request appears in queue

**Real-time updates?**: YES / NO / REQUIRES REFRESH  
**Update mechanism**: SUBSCRIPTION / POLLING / MANUAL REFRESH  
**Issues Found**: _____________________

---

### TEST 4: ACCEPT RESCUE REQUEST (RESCUER)

#### 4.1 Single Acceptance
- [ ] Click "Accept" on a PENDING rescue
- [ ] **VERIFY**: Loading state shown
- [ ] **VERIFY**: Success message shown
- [ ] **VERIFY**: Request moves from queue to "Active Rescue"
- [ ] **VERIFY**: Status changed to ASSIGNED or ACCEPTED

**Expected Behavior**: ✅ Rescue accepted  
**Actual Behavior**: _____________________  
**Issues Found**: _____________________

#### 4.2 Verify in Database
```sql
SELECT status, assigned_to, assigned_at 
FROM rescue_requests 
WHERE id = '<rescue_id>';
```

**Check**:
- [ ] Status changed (PENDING → ASSIGNED/ACCEPTED)
- [ ] assigned_to = rescuer's volunteer ID
- [ ] assigned_at timestamp set

**Issues Found**: _____________________

#### 4.3 Verify Citizen Sees Update
- [ ] Login as CITIZEN (in another browser/incognito)
- [ ] Navigate to "My Requests"
- [ ] **VERIFY**: Request status updated
- [ ] **VERIFY**: Rescuer name/details shown

**Citizen sees update?**: YES / NO / REQUIRES REFRESH  
**Issues Found**: _____________________

---

### TEST 5: ATOMIC ASSIGNMENT (CRITICAL SECURITY TEST)

**This test requires TWO rescuer accounts or ADVANCED setup**

#### 5.1 Setup
- [ ] Create second rescuer account
- [ ] Ensure both rescuers can see the same PENDING rescue

#### 5.2 Concurrent Acceptance Test
- [ ] Open queue as Rescuer A
- [ ] Open queue as Rescuer B
- [ ] **SIMULTANEOUSLY**: Both click "Accept" on same rescue
- [ ] **OBSERVE**: What happens?

**Expected Behavior**:
- One rescuer gets success
- Other rescuer gets error: "Rescue already assigned"
- Only ONE assignment in database

**Actual Behavior**: _____________________

**TEST RESULT**:
- ✅ PASS - Only one assignment created
- ❌ FAIL - Both rescuers assigned (CRITICAL BUG)
- ⚠️ PARTIAL - UI shows error but database has two assignments
- 🔍 UNCLEAR - Cannot test (need two accounts)

---

### TEST 6: RESCUER GPS TRACKING

#### 6.1 GPS Permission
- [ ] Login as RESCUER
- [ ] Accept a rescue
- [ ] **OBSERVE**: Does app request GPS permission?
- [ ] **OBSERVE**: Does app start tracking location?

**GPS requested?**: YES / NO  
**Tracking started?**: YES / NO / UNCLEAR  
**Issues Found**: _____________________

#### 6.2 Location Updates
- [ ] With rescue accepted and GPS enabled
- [ ] **CHECK**: Browser DevTools → Network tab
- [ ] **OBSERVE**: Are location updates being sent?
- [ ] **OBSERVE**: Frequency of updates

**Updates sent?**: YES / NO  
**Frequency**: _____ seconds  
**Endpoint**: _____________________  
**Issues Found**: _____________________

#### 6.3 Citizen Sees Rescuer Location
- [ ] Login as CITIZEN (rescue creator)
- [ ] View rescue details or map
- [ ] **OBSERVE**: Is rescuer location shown?
- [ ] **OBSERVE**: Does location update in real-time?

**Location visible?**: YES / NO  
**Real-time updates?**: YES / NO / REQUIRES REFRESH  
**Issues Found**: _____________________

---

### TEST 7: NAVIGATION & ROUTING

#### 7.1 Route Display
- [ ] As RESCUER with accepted rescue
- [ ] **OBSERVE**: Is route from rescuer to incident shown on map?
- [ ] **OBSERVE**: Is ETA displayed?

**Route shown?**: YES / NO  
**ETA shown?**: YES / NO  
**Issues Found**: _____________________

#### 7.2 Route Calculation
- [ ] Open browser DevTools → Network tab
- [ ] Trigger route calculation
- [ ] **OBSERVE**: Is route API called?
- [ ] **OBSERVE**: Which routing service? (Google / OSRM / other)

**Route API called?**: YES / NO  
**Routing service**: _____________________  
**Issues Found**: _____________________

---

### TEST 8: UPDATE RESCUE STATUS

#### 8.1 Status Updates
- [ ] As RESCUER with accepted rescue
- [ ] Find "Update Status" or similar button
- [ ] Try changing status to:
  - [ ] IN_PROGRESS
  - [ ] COMPLETED
- [ ] **VERIFY**: Status updates successfully

**Status update works?**: YES / NO  
**Issues Found**: _____________________

#### 8.2 Status Workflow Enforcement
- [ ] As RESCUER
- [ ] Try changing PENDING rescue to COMPLETED (skip ASSIGNED)
- [ ] **OBSERVE**: Is this allowed or blocked?

**Expected**: Should block (enforce workflow)  
**Actual**: _____________________

---

### TEST 9: HOSPITAL ROUTING

#### 9.1 Find Hospital Feature
- [ ] As RESCUER with active rescue
- [ ] Look for "Find Hospital" or "Nearest Hospital"
- [ ] **OBSERVE**: Feature exists?

**Feature exists?**: YES / NO  
**Location**: _____________________

#### 9.2 Hospital List
- [ ] Trigger hospital search
- [ ] **VERIFY**: Hospitals displayed
- [ ] **VERIFY**: Sorted by distance or travel time?
- [ ] **VERIFY**: Antivenom status shown
- [ ] **VERIFY**: Treatment capability shown

**Hospital search works?**: YES / NO  
**Sorted by**: DISTANCE / TRAVEL TIME / UNCLEAR  
**Status shown?**: YES / NO  
**Issues Found**: _____________________

#### 9.3 Navigate to Hospital
- [ ] Select a hospital
- [ ] Click "Navigate" or similar
- [ ] **VERIFY**: Route displayed

**Navigation works?**: YES / NO  
**Issues Found**: _____________________

---

### TEST 10: RESCUE COMPLETION

#### 10.1 Complete Rescue
- [ ] As RESCUER with IN_PROGRESS rescue
- [ ] Find "Complete Rescue" button
- [ ] Click button
- [ ] **VERIFY**: Completion form appears

**Form exists?**: YES / NO  
**Location**: _____________________

#### 10.2 Completion Form
- [ ] Select outcome (RESCUED_RELOCATED, etc.)
- [ ] Write report: "Snake relocated to nearby forest"
- [ ] **ATTEMPT**: Upload rescue photos
- [ ] Submit

**Form submits?**: YES / NO  
**Photo upload works?**: YES / NO  
**Issues Found**: _____________________

#### 10.3 Verify Completion
- [ ] **VERIFY**: Status changed to COMPLETED
- [ ] **VERIFY**: completedAt timestamp set
- [ ] **VERIFY**: Outcome recorded
- [ ] **VERIFY**: Report saved
- [ ] **VERIFY**: Removed from active rescues
- [ ] **VERIFY**: Appears in history

**Completion works?**: YES / NO  
**Issues Found**: _____________________

---

### TEST 11: ADMIN DASHBOARD

#### 11.1 Admin Overview
- [ ] Login as ADMIN
- [ ] View dashboard at `/dashboard/admin`
- [ ] **OBSERVE**: Statistics shown

**Statistics visible?**: YES / NO  
**Statistics to verify**:
- [ ] Total rescues: _____ (check database count)
- [ ] Active rescues: _____ (check IN_PROGRESS count)
- [ ] Pending requests: _____ (check PENDING count)
- [ ] Completed today: _____ (check completed today)
- [ ] Available rescuers: _____ (check isAvailableNow count)

**Match database?**: YES / NO / SOME MISMATCH  
**Issues Found**: _____________________

#### 11.2 Admin Map
- [ ] Navigate to `/dashboard/admin/map`
- [ ] **VERIFY**: All hospital markers (67) visible
- [ ] **VERIFY**: Rescue markers visible
- [ ] **VERIFY**: Rescuer markers visible
- [ ] **VERIFY**: Map updates (every 30s)

**All markers visible?**: YES / NO  
**Real-time updates?**: YES / NO  
**Issues Found**: _____________________

---

### TEST 12: AUTHORIZATION (SECURITY)

#### 12.1 Unauthorized Actions (GraphQL)

Open GraphQL Playground: `http://localhost:4000/graphql`

**Test A: Citizen tries to accept rescue**
```graphql
# Login as CITIZEN first, then:
mutation {
  acceptRescue(rescueId: "xxx") {
    id
    status
  }
}
```

**Expected**: Error - "Not authorized"  
**Actual**: _____________________

**Test B: Volunteer tries to view admin analytics**
```graphql
# Login as RESCUER, then:
query {
  analyticsOverview {
    totalRescues
    completedRescues
  }
}
```

**Expected**: Error - "Not authorized" OR filtered data  
**Actual**: _____________________

**Test C: Citizen tries to verify hospital**
```graphql
# Login as CITIZEN, then:
mutation {
  verifyHospital(
    hospitalId: "xxx"
    verification: { /* ... */ }
  ) {
    id
  }
}
```

**Expected**: Error - "Not authorized"  
**Actual**: _____________________

#### 12.2 Unauthorized Routes (Frontend)
- [ ] Login as CITIZEN
- [ ] Try accessing `/dashboard/admin` directly
- [ ] **EXPECTED**: Blocked (redirect or 403)
- [ ] **ACTUAL**: _____________________

- [ ] Login as RESCUER
- [ ] Try accessing `/dashboard/admin/users` directly
- [ ] **EXPECTED**: Blocked
- [ ] **ACTUAL**: _____________________

---

## FINDINGS TEMPLATE

After completing all tests, fill out this summary:

### ✅ WORKING FEATURES

1. _____________________
2. _____________________
3. _____________________

### ❌ BROKEN FEATURES

1. _____________________
   - Expected: _____________________
   - Actual: _____________________
   - Root cause: _____________________

### ⚠️ PARTIAL FEATURES

1. _____________________
   - Works: _____________________
   - Missing: _____________________
   - Needs: _____________________

### 🚨 CRITICAL SECURITY ISSUES

1. _____________________
   - Risk: _____________________
   - Reproduction: _____________________
   - Fix needed: _____________________

### 🔍 UNCLEAR / NEEDS INVESTIGATION

1. _____________________
   - Why unclear: _____________________
   - Files to check: _____________________

---

## NEXT STEPS AFTER PHASE 0

Based on findings:

### If Major Issues Found
→ Create bug fix plan  
→ Prioritize critical security issues  
→ Fix broken features before adding new ones

### If Minor Issues Found
→ Document issues  
→ Proceed to Phase 1 (Critical Fixes)  
→ Fix issues alongside new development

### If Everything Works
→ Amazing! (Unlikely on first test)  
→ Document actual behavior  
→ Proceed to Phase 1 with confidence

---

## DOCUMENTATION

Save test results to:
```
PHASE_0_TEST_RESULTS.md
```

Include:
- Screenshots of issues
- Error messages
- Network request logs
- Database query results
- Specific reproduction steps

**This documentation is CRITICAL for Phase 1 planning.**

---

**IMPORTANT**: Do NOT skip any tests. Do NOT assume functionality works. Test everything systematically.

The time spent in Phase 0 will save WEEKS of debugging later.

---

**END OF PHASE 0 PLAN**

Execute tests → Document findings → Plan Phase 1
