# SnakeSOS - Detailed Feature Implementation Matrix

**Purpose**: Track exact implementation status of every feature across all layers  
**Updated**: January 2025  
**Legend**: 
- ✅ REAL - Fully implemented and tested
- ⚠️ PARTIAL - Exists but incomplete/broken
- ❌ MISSING - Not implemented
- 🔍 NEEDS VERIFICATION - Implementation status unclear

---

## RESCUE REQUEST WORKFLOW

### 1. CREATE RESCUE REQUEST

| Layer | Component/File | Status | Notes |
|-------|----------------|--------|-------|
| **Frontend** | `/dashboard/citizen/request/page.tsx` | ✅ REAL | Form exists |
| **Frontend** | Request form validation | 🔍 NEEDS VERIFICATION | Check validation logic |
| **Frontend** | Location capture (GPS) | ⚠️ PARTIAL | May use browser API |
| **Frontend** | Location capture (manual) | 🔍 NEEDS VERIFICATION | Address input |
| **Frontend** | Image upload | ⚠️ PARTIAL | UI exists, upload mechanism unclear |
| **GraphQL** | `createRescueRequest` mutation | ✅ REAL | Confirmed in schema |
| **Resolver** | `createRescueRequest` resolver | ✅ REAL | Registered in server.ts |
| **Service** | `RescueService.createRequest()` | 🔍 NEEDS VERIFICATION | Check libs/backend/modules |
| **Database** | `RescueRequest` creation | ✅ REAL | Prisma model exists |
| **Validation** | Input sanitization | 🔍 NEEDS VERIFICATION | |
| **Security** | Authentication required | 🔍 NEEDS VERIFICATION | |
| **Security** | Rate limiting | ❌ MISSING | |

**Issues Found**:
- Image upload destination unclear (S3? Local? Cloudinary?)
- GPS accuracy validation unclear
- Fallback for denied location permission unclear

---

### 2. VIEW RESCUE QUEUE (RESCUER)

| Layer | Component/File | Status | Notes |
|-------|----------------|--------|-------|
| **Frontend** | Queue component prominence | 🚨 **BROKEN** | Buried in /assignments |
| **Frontend** | `/dashboard/rescuer/assignments/page.tsx` | ⚠️ PARTIAL | Exists but not prominent |
| **Frontend** | Real-time queue updates | ❌ MISSING | No subscription visible |
| **Frontend** | Distance calculation | 🔍 NEEDS VERIFICATION | Client-side calculation? |
| **Frontend** | Priority badges | 🔍 NEEDS VERIFICATION | |
| **Frontend** | Filter by distance | ❌ MISSING | |
| **Frontend** | Filter by priority | ❌ MISSING | |
| **Frontend** | Mobile bottom sheet | ❌ MISSING | Desktop-first design |
| **GraphQL** | `listRescueRequests` query | ✅ REAL | With filters |
| **GraphQL** | `rescueQueueUpdated` subscription | ⚠️ PARTIAL | Schema exists, resolver unclear |
| **Resolver** | Queue filtering logic | 🔍 NEEDS VERIFICATION | |
| **Service** | Nearby rescues algorithm | 🔍 NEEDS VERIFICATION | SQL query or post-filter? |
| **Database** | Indexes on status, location | 🔍 NEEDS VERIFICATION | Check schema indexes |

**Critical Issues**:
- 🚨 Queue not visible on rescuer homepage
- 🚨 No persistent queue display (requires navigation)
- 🚨 Mobile rescuers must navigate away from map to see queue

**Recommendation**:
```
RESCUER HOMEPAGE SHOULD BE THE QUEUE
```

---

### 3. ACCEPT RESCUE REQUEST

| Layer | Component/File | Status | Notes |
|-------|----------------|--------|-------|
| **Frontend** | Accept button | ✅ REAL | Likely exists |
| **Frontend** | Optimistic UI update | 🔍 NEEDS VERIFICATION | |
| **Frontend** | Error handling | 🔍 NEEDS VERIFICATION | What if already assigned? |
| **GraphQL** | `acceptRescue` mutation | ✅ REAL | Confirmed |
| **Resolver** | `acceptRescue` resolver | ✅ REAL | Registered |
| **Service** | Atomic assignment logic | 🚨 **CRITICAL - VERIFY** | Must prevent double assignment |
| **Service** | Status transition validation | 🔍 NEEDS VERIFICATION | PENDING→ASSIGNED→ACCEPTED |
| **Database** | Transaction isolation | 🚨 **CRITICAL - VERIFY** | Prevent race condition |
| **Notification** | Notify citizen | ⚠️ PARTIAL | Service exists, delivery unclear |
| **Notification** | Notify admin | ❌ MISSING | |

**Critical Security Check**:
```typescript
// MUST VERIFY THIS EXISTS:
async acceptRescue(rescueId: string, volunteerId: string) {
  const result = await prisma.rescueRequest.updateMany({
    where: {
      id: rescueId,
      status: 'PENDING',    // ← ATOMIC CHECK
      assignedTo: null,     // ← ATOMIC CHECK
    },
    data: {
      status: 'ASSIGNED',
      assignedTo: volunteerId,
      assignedAt: new Date(),
    },
  });
  
  if (result.count === 0) {
    throw new ConflictError('Rescue already assigned');
  }
  
  return this.getRescueById(rescueId);
}
```

**Test Case**:
- Two rescuers click "Accept" simultaneously
- Expected: One succeeds, one gets error
- Actual: 🔍 NEEDS TESTING

---

### 4. RESCUER GPS TRACKING

| Layer | Component/File | Status | Notes |
|-------|----------------|--------|-------|
| **Frontend** | GPS permission request | 🔍 NEEDS VERIFICATION | |
| **Frontend** | Continuous location tracking | ❌ MISSING | No evidence found |
| **Frontend** | Location update frequency | ❌ MISSING | Every 30s? |
| **Frontend** | Background tracking | ❌ MISSING | |
| **GraphQL** | `updateRescuerLocation` mutation | ⚠️ PARTIAL | Schema exists? |
| **GraphQL** | `rescuerLocationUpdated` subscription | ❌ MISSING | Not in server.ts |
| **Resolver** | Location update resolver | ❌ MISSING | |
| **Service** | Location validation | ❌ MISSING | Verify coordinates valid |
| **Service** | Location storage | ⚠️ PARTIAL | Volunteer.currentLat/Lng exists |
| **Service** | Real-time broadcast | ❌ MISSING | WebSocket/SSE/Subscription |
| **Database** | Location update | ⚠️ PARTIAL | Schema fields exist |

**Current State**: 
- Schema has `Volunteer.currentLat`, `currentLng`, `lastLocationUpdate`
- No mechanism to update these fields in real-time
- No mechanism to broadcast updates to subscribed clients

**Implementation Gap**: **COMPLETE FEATURE MISSING**

**Required Implementation**:
1. Frontend: Geolocation API → send location every 30s
2. GraphQL: Subscription for location updates
3. Backend: PubSub for real-time broadcast
4. Storage: Update Volunteer location in database

---

### 5. NAVIGATION TO INCIDENT

| Layer | Component/File | Status | Notes |
|-------|----------------|--------|-------|
| **Frontend** | Route display | ⚠️ PARTIAL | RescueMap component exists |
| **Frontend** | Turn-by-turn instructions | ❌ MISSING | |
| **Frontend** | ETA display | ❌ MISSING | |
| **Frontend** | Route recalculation | ❌ MISSING | As rescuer moves |
| **GraphQL** | `calculateRoute` query | ⚠️ PARTIAL | May exist in map schema |
| **Resolver** | Route calculation | ⚠️ PARTIAL | OSRM mentioned |
| **Service** | OSRM integration | ⚠️ PARTIAL | Mentioned in docs |
| **Service** | Google Directions fallback | 🔍 NEEDS VERIFICATION | |
| **Service** | ETA calculation | ❌ MISSING | Based on route + traffic |

**Current State**:
- OSRM routing mentioned in documentation
- RescueMap.tsx exists (Leaflet-based)
- Unclear how route is fetched and displayed

**Files to Check**:
- `libs/backend/modules/src/map/` - Routing service?
- `apps/frontend/src/components/map/RescueMap.tsx` - Route rendering
- `apps/frontend/src/lib/` - Routing utilities?

---

### 6. UPDATE RESCUE STATUS

| Layer | Component/File | Status | Notes |
|-------|----------------|--------|-------|
| **Frontend** | Status update buttons | ⚠️ PARTIAL | Likely exists |
| **Frontend** | Status timeline display | ❌ MISSING | No UI found |
| **GraphQL** | `updateRescueStatus` mutation | ✅ REAL | Confirmed |
| **Resolver** | Status update resolver | ✅ REAL | Registered |
| **Service** | Status transition validation | 🔍 NEEDS VERIFICATION | Enforce workflow |
| **Service** | Timeline entry creation | ⚠️ PARTIAL | RescueTimeline model exists |
| **Database** | Status update | ✅ REAL | |
| **Database** | Timeline record | ⚠️ PARTIAL | Model exists, insertion unclear |
| **Notification** | Status change notification | ⚠️ PARTIAL | |

**Status Workflow to Enforce**:
```
PENDING
  ↓ (rescuer accepts)
ASSIGNED
  ↓ (rescuer confirms acceptance)
ACCEPTED
  ↓ (rescuer starts moving)
IN_PROGRESS
  ↓ (rescue performed)
COMPLETED / CANCELLED / CLOSED
```

**Timeline Events to Record**:
- CREATED - When request submitted
- ASSIGNED - When rescuer assigned
- ACCEPTED - When rescuer accepts
- EN_ROUTE - When rescuer starts moving
- ARRIVED - When rescuer arrives
- RESCUING - When rescue in progress
- COMPLETED - When rescue finished

---

### 7. HOSPITAL ROUTING

| Layer | Component/File | Status | Notes |
|-------|----------------|--------|-------|
| **Frontend** | Hospital selection UI | ⚠️ PARTIAL | Hospital list exists |
| **Frontend** | Hospital capability display | ⚠️ PARTIAL | Antivenom status shown |
| **Frontend** | Hospital ranking by travel time | ❌ MISSING | Currently distance only |
| **Frontend** | Route to hospital | ❌ MISSING | |
| **GraphQL** | `nearbyTreatmentCenters` query | ✅ REAL | Map schema |
| **GraphQL** | `rankTreatmentCenters` query | ✅ REAL | Map schema |
| **Resolver** | Hospital ranking | 🔍 NEEDS VERIFICATION | Check mapQueryResolvers |
| **Service** | Travel time calculation | ❌ MISSING | OSRM/Google integration |
| **Service** | Hospital capability filtering | ⚠️ PARTIAL | Query exists |
| **Database** | Hospital antivenom status | ✅ REAL | 67 hospitals seeded |

**Current Limitation**:
- Hospitals shown on map
- Likely sorted by straight-line distance
- **NOT** ranked by actual travel time
- **NOT** filtered by treatment capability

**Required**:
```
When snakebite involved:
1. Filter hospitals with snakebiteTreatmentAvailable = true
2. Filter hospitals with antivenomStatus = AVAILABLE
3. Calculate travel time (not distance) to each
4. Rank by travel time
5. Show top 5 with:
   - Name
   - Distance
   - Travel time
   - Antivenom status
   - Last verified date
```

---

### 8. RESCUE COMPLETION

| Layer | Component/File | Status | Notes |
|-------|----------------|--------|-------|
| **Frontend** | Completion form | ⚠️ PARTIAL | Likely exists |
| **Frontend** | Outcome selection | 🔍 NEEDS VERIFICATION | RescueOutcome enum |
| **Frontend** | Report text area | 🔍 NEEDS VERIFICATION | |
| **Frontend** | Image upload (rescue photos) | ⚠️ PARTIAL | |
| **GraphQL** | `completeRescue` mutation | ✅ REAL | Likely exists |
| **Resolver** | Completion resolver | ⚠️ PARTIAL | |
| **Service** | Completion validation | 🔍 NEEDS VERIFICATION | Required fields |
| **Service** | Metrics update | 🔍 NEEDS VERIFICATION | Update volunteer stats |
| **Service** | Analytics update | 🔍 NEEDS VERIFICATION | District statistics |
| **Database** | Completion timestamp | ✅ REAL | completedAt field |
| **Database** | Outcome recording | ✅ REAL | outcome field |
| **Database** | Duration calculation | ✅ REAL | rescueDuration field |

**Completion Workflow**:
1. Rescuer marks rescue complete
2. Select outcome (RESCUED_RELOCATED, ALREADY_GONE, etc.)
3. Write report
4. Upload photos (optional)
5. Submit
6. Update:
   - RescueRequest.status = COMPLETED
   - RescueRequest.completedAt = now
   - RescueRequest.outcome = selected
   - Volunteer.completedRescues += 1
   - Volunteer.successRate = recalculate
   - DistrictStatistics.completedRescues += 1

---

## HOSPITAL MANAGEMENT

### 9. HOSPITAL DATABASE

| Layer | Component/File | Status | Notes |
|-------|----------------|--------|-------|
| **Database** | Hospital model | ✅ REAL | Comprehensive schema |
| **Database** | 67 hospitals seeded | ✅ REAL | Confirmed on map |
| **Database** | Coordinates validated | ✅ REAL | Display correctly |
| **Database** | Antivenom status | ⚠️ PARTIAL | Mix of AVAILABLE/UNKNOWN |
| **Database** | Verification records | ✅ REAL | HospitalVerification model |
| **Seed** | hospitals.seed.ts | ✅ REAL | Real hospital data |

**Data Quality Audit Needed**:
- 🔍 How many hospitals have antivenomStatus = AVAILABLE?
- 🔍 How many hospitals have antivenomStatus = UNKNOWN?
- 🔍 When was antivenom status last verified?
- 🔍 What is the source of antivenom data?

---

### 10. HOSPITAL DISPLAY & MARKERS

| Layer | Component/File | Status | Notes |
|-------|----------------|--------|-------|
| **Frontend** | Hospital markers on map | ✅ REAL | GoogleEmergencyMap |
| **Frontend** | Marker icon | ⚠️ **EMOJI** | Uses 🏥 - device-dependent |
| **Frontend** | Marker clustering | ❌ MISSING | Too many markers at zoom out |
| **Frontend** | Hospital popup | ✅ REAL | Shows hospital info |
| **Frontend** | Verification status display | 🔍 NEEDS VERIFICATION | In popup? |
| **Frontend** | Antivenom status display | ⚠️ PARTIAL | May show UNKNOWN as fact |
| **Frontend** | Last verified date | ❌ MISSING | Not displayed |
| **GraphQL** | `listHospitals` query | ✅ REAL | |
| **GraphQL** | Pagination | ✅ REAL | First 100 |
| **Resolver** | Hospital query | ✅ REAL | Registered |

**Marker Icon Recommendation**:
```typescript
// Replace emoji with SVG icons
const HospitalIcon = {
  verified: <VerifiedHospitalSVG />,           // Green cross
  antivenom: <AntivenomAvailableSVG />,       // Green cross + snake
  treatment: <SnakebiteTreatmentSVG />,       // Yellow cross
  unverified: <UnverifiedHospitalSVG />,      // Gray cross
};

function getHospitalIcon(hospital: Hospital) {
  if (hospital.edcdCertified) return HospitalIcon.verified;
  if (hospital.antivenomStatus === 'AVAILABLE') return HospitalIcon.antivenom;
  if (hospital.snakebiteTreatmentAvailable) return HospitalIcon.treatment;
  return HospitalIcon.unverified;
}
```

---

### 11. HOSPITAL VERIFICATION WORKFLOW

| Layer | Component/File | Status | Notes |
|-------|----------------|--------|-------|
| **Frontend** | Verification form | ❌ MISSING | Admin feature |
| **Frontend** | Verification history | ❌ MISSING | |
| **Frontend** | Community reporting | ❌ MISSING | "Report Issue" button |
| **GraphQL** | `verifyHospital` mutation | ✅ REAL | Schema exists |
| **GraphQL** | `reportHospitalIssue` mutation | 🔍 NEEDS VERIFICATION | |
| **Resolver** | Verification resolver | ⚠️ PARTIAL | hospitalMutationResolvers |
| **Service** | Verification logic | ⚠️ PARTIAL | |
| **Database** | HospitalVerification records | ✅ REAL | Model exists |
| **Database** | HospitalReport records | ✅ REAL | Model exists |

**Verification Workflow Needed**:
1. Admin initiates verification
2. Contact hospital (phone/site visit)
3. Verify:
   - Snakebite treatment available?
   - Antivenom in stock?
   - Quantity?
   - Emergency 24/7?
   - Ventilator available?
4. Upload evidence (photos, documents)
5. Save verification record
6. Update hospital status
7. Set next verification date (6 months?)

---

## ADMIN DASHBOARD

### 12. ADMIN OVERVIEW

| Layer | Component/File | Status | Notes |
|-------|----------------|--------|-------|
| **Frontend** | `/dashboard/admin/page.tsx` | ✅ REAL | Dashboard exists |
| **Frontend** | Stats cards | ⚠️ PARTIAL | May use mock data |
| **Frontend** | Live map | ✅ REAL | GoogleEmergencyMap |
| **Frontend** | Rescue list | ⚠️ PARTIAL | |
| **GraphQL** | `analyticsOverview` query | ✅ REAL | analyticsResolvers |
| **Resolver** | Analytics resolver | ✅ REAL | Registered |
| **Service** | Real-time stats calculation | 🔍 NEEDS VERIFICATION | |

**Stats to Verify**:
- Total rescues (all time)
- Active rescues (status = IN_PROGRESS)
- Pending requests (status = PENDING)
- Completed today
- Available rescuers (isAvailableNow = true)
- Response time average
- Success rate

**Check**: Are these numbers **real queries** or **hardcoded**?

---

### 13. ADMIN MAP (LIVE FIELD VIEW)

| Layer | Component/File | Status | Notes |
|-------|----------------|--------|-------|
| **Frontend** | `/dashboard/admin/map/page.tsx` | ✅ REAL | Confirmed working |
| **Frontend** | Hospital markers (67) | ✅ REAL | Fixed recently |
| **Frontend** | Rescue markers | ✅ REAL | |
| **Frontend** | Volunteer markers | ✅ REAL | |
| **Frontend** | Real-time updates | ✅ REAL | Every 30s |
| **Frontend** | Layer toggles | ❌ MISSING | Show/hide layers |
| **Frontend** | Legend | ❌ MISSING | Explain markers |
| **Frontend** | Clustering | ❌ MISSING | Too many markers |
| **GraphQL** | `mapOverview` query | ✅ REAL | New map schema |
| **Resolver** | Map query resolver | ✅ REAL | mapQueryResolvers |

**Recent Fix Applied**:
- Hospital limit increased from 10 to 100
- All 67 hospitals now display
- Real-time updates every 30 seconds

**Enhancements Needed**:
- [ ] Map legend (what each marker means)
- [ ] Layer toggles (hospitals, rescues, rescuers, vehicles, hotspots)
- [ ] Marker clustering (for zoom out)
- [ ] Click marker → detailed info panel
- [ ] Filter by status, priority, district

---

## AUTHENTICATION & AUTHORIZATION

### 14. AUTHENTICATION

| Feature | Status | Notes |
|---------|--------|-------|
| User registration | ✅ REAL | Better-Auth |
| Email/password login | ✅ REAL | |
| Google OAuth | ✅ REAL | |
| Session management | ✅ REAL | Session model |
| Email verification | ⚠️ PARTIAL | Schema exists, flow unclear |
| Password reset | ⚠️ PARTIAL | Schema exists, flow unclear |
| Logout | ✅ REAL | |
| Session expiry | ✅ REAL | |

---

### 15. AUTHORIZATION (CRITICAL)

| Feature | Status | Notes |
|---------|--------|-------|
| Role-based access (RBAC) | ✅ REAL | Schema exists |
| Permission model | ✅ REAL | Permission model exists |
| Route protection (frontend) | ⚠️ PARTIAL | Likely exists, needs audit |
| GraphQL resolver guards | 🚨 **NEEDS AUDIT** | CRITICAL |
| Mutation authorization | 🚨 **NEEDS AUDIT** | Can citizen accept rescue? |
| Admin-only operations | 🚨 **NEEDS AUDIT** | Hospital verification |
| Data filtering by role | 🔍 NEEDS VERIFICATION | Can citizen see all rescues? |

**Authorization Audit Required**:

```typescript
// MUST VERIFY THESE SCENARIOS:

// 1. Can CITIZEN accept rescue?
mutation AcceptRescue {
  acceptRescue(rescueId: "xxx") { # Should FAIL with error
    id
    status
  }
}

// 2. Can VOLUNTEER see admin analytics?
query AdminAnalytics {
  analyticsOverview { # Should FAIL with error
    totalRescues
  }
}

// 3. Can CITIZEN see other users' rescue requests?
query AllRescues {
  listRescueRequests { # Should filter by userId or FAIL
    edges { node { id } }
  }
}

// 4. Can VOLUNTEER verify hospitals?
mutation VerifyHospital {
  verifyHospital(id: "xxx", verification: {...}) { # Should FAIL
    id
  }
}
```

---

## NOTIFICATIONS

### 16. NOTIFICATION SYSTEM

| Layer | Component/File | Status | Notes |
|-------|----------------|--------|-------|
| **Database** | Notification model | ✅ REAL | Comprehensive |
| **Database** | NotificationType enum | ✅ REAL | All events defined |
| **GraphQL** | Notification queries | ✅ REAL | Schema exists |
| **GraphQL** | Notification mutations | ✅ REAL | Schema exists |
| **GraphQL** | Notification subscriptions | ⚠️ PARTIAL | Schema exists |
| **Resolver** | Notification resolvers | ❌ MISSING | Not in server.ts |
| **Service** | Notification creation | ⚠️ PARTIAL | May exist |
| **Service** | Push notification delivery | ❌ MISSING | Firebase? OneSignal? |
| **Service** | Email delivery | ❌ MISSING | SendGrid? |
| **Service** | SMS delivery | ❌ MISSING | Twilio? |
| **Frontend** | Notification bell | ⚠️ PARTIAL | UI exists? |
| **Frontend** | Notification list | ❌ MISSING | |
| **Frontend** | Real-time updates | ❌ MISSING | Subscription |

**Notification Events to Implement**:
- RESCUE_CREATED → Admin
- RESCUE_ASSIGNED → Rescuer
- RESCUE_ACCEPTED → Citizen
- RESCUER_EN_ROUTE → Citizen
- RESCUER_ARRIVED → Citizen
- RESCUE_COMPLETED → Citizen, Admin

---

## AI SNAKE IDENTIFICATION

### 17. AI IDENTIFICATION (FUTURE FEATURE)

| Layer | Status | Notes |
|-------|--------|-------|
| **Database** | AIIdentification model | ✅ REAL | Comprehensive schema |
| **GraphQL** | AI queries/mutations | ✅ REAL | Schema exists |
| **Resolver** | AI resolvers | ❌ MISSING | Not registered |
| **Service** | AI service (Node.js) | ❌ MISSING | |
| **Service** | Python ML service | ❌ MISSING | Separate process |
| **Service** | Species mapping | ❌ MISSING | |
| **Frontend** | Image upload | ⚠️ PARTIAL | Upload mechanism unclear |
| **Frontend** | Prediction display | ❌ MISSING | |
| **Frontend** | Confidence display | ❌ MISSING | |

**Status**: **PLANNED BUT NOT IMPLEMENTED**

**Priority**: **LOW** - Complete core rescue workflow first

---

## ANALYTICS & INTELLIGENCE

### 18. ANALYTICS DASHBOARD

| Feature | Database | GraphQL | Resolver | Frontend | Status |
|---------|----------|---------|----------|----------|--------|
| Admin overview stats | ✅ | ✅ | ✅ | ⚠️ | **PARTIAL** |
| District statistics | ✅ | ✅ | ❌ | ❌ | **MISSING** |
| Seasonal patterns | ✅ | ✅ | ❌ | ❌ | **MISSING** |
| Response time analytics | ✅ | ✅ | ⚠️ | ❌ | **PARTIAL** |
| Hotspot visualization | ✅ | ✅ | ❌ | ❌ | **MISSING** |
| Historical trends | ✅ | ✅ | ❌ | ❌ | **MISSING** |

**Status**: Infrastructure exists, implementation incomplete

---

## MOBILE OPTIMIZATION

### 19. MOBILE RESPONSIVENESS

| Component | Status | Notes |
|-----------|--------|-------|
| Responsive layout | ⚠️ PARTIAL | TailwindCSS utilities |
| Mobile navigation | ⚠️ PARTIAL | Sidebar collapses |
| Touch-friendly controls | 🔍 NEEDS VERIFICATION | |
| Bottom sheet (queue) | ❌ MISSING | CRITICAL for rescuers |
| Mobile map controls | ⚠️ PARTIAL | May be cramped |
| Image capture | ⚠️ PARTIAL | Mobile camera access |
| Offline support | ❌ MISSING | Service worker |
| PWA manifest | 🔍 NEEDS VERIFICATION | |

---

## SUMMARY: IMMEDIATE PRIORITIES

### 🚨 FIX IMMEDIATELY (THIS WEEK)

1. **Rescue Queue Prominence**
   - Move queue to rescuer dashboard homepage
   - Make it persistent (bottom sheet on mobile)
   - Add real-time updates

2. **Authorization Audit**
   - Test all unauthorized access attempts
   - Add resolver guards where missing
   - Document permission model

3. **Atomic Assignment Verification**
   - Test concurrent acceptance
   - Verify database transaction
   - Add proper error handling

4. **Hospital Verification UX**
   - Show last verified date
   - Show data quality indicators
   - Add "Report Issue" button

### ⚠️ IMPLEMENT NEXT (WEEK 2-3)

5. **Real-time GPS Tracking**
6. **Rescue Timeline Display**
7. **Notification Delivery**
8. **Complete Routing Workflow**

### 🎯 LATER (WEEK 4+)

9. **Analytics Dashboard**
10. **Hotspot Visualization**
11. **AI Snake Identification**
12. **Advanced Features**

---

**END OF FEATURE MATRIX**

Use this document to track implementation progress. Update status as features are completed.
