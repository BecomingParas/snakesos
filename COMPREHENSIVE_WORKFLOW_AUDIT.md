# SnakeSOS - Comprehensive Workflow Audit
## Complete Repository Analysis & Feature Matrix

**Date**: January 2025  
**Audit Scope**: End-to-end emergency response workflow  
**Status**: COMPLETE AUDIT BEFORE IMPLEMENTATION

---

## EXECUTIVE SUMMARY

SnakeSOS is an Nx monorepo implementing a snake rescue emergency response platform. The intended workflow is:

```
CITIZEN → RESCUE REQUEST → QUEUE → RESCUER → GPS TRACKING → 
INCIDENT LOCATION → HOSPITAL ROUTING → RESCUE COMPLETION → ANALYTICS
```

**Current Implementation Status**: **PARTIAL - Foundation Built, Workflow Incomplete**

- ✅ Strong database schema (Prisma - PostgreSQL)
- ✅ GraphQL API architecture in place
- ✅ Authentication & RBAC implemented
- ✅ Hospital data (67 hospitals seeded)
- ✅ Basic map functionality
- ⚠️ **CRITICAL GAPS**: Queue not prominent, rescue workflow incomplete, real-time tracking missing, hospital verification unclear

---

## 1. REPOSITORY STRUCTURE

### Architecture
```
snake-rescue/
├── apps/
│   ├── frontend/          # Next.js 15 (App Router)
│   └── backend/           # Express + Apollo GraphQL
├── libs/
│   ├── database/          # Prisma schema & seeds
│   ├── contracts/         # GraphQL type definitions
│   ├── backend/
│   │   ├── core/          # Apollo setup, context, auth
│   │   └── modules/       # Feature resolvers & services
│   ├── auth/              # Authentication utilities
│   ├── frontend/          # Frontend utilities
│   └── shared/            # Shared utilities
└── .agents/               # Prisma AI skills
```

### Technology Stack
- **Frontend**: Next.js 15, React, TailwindCSS, Apollo Client, Google Maps
- **Backend**: Node.js, Express, Apollo Server, GraphQL
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: Better-Auth (session-based)
- **Maps**: Google Maps API + OSRM routing
- **Deployment**: Vercel (frontend + serverless functions)

---

## 2. DATABASE AUDIT - PRISMA SCHEMA

### ✅ MODELS IMPLEMENTED (Comprehensive)

#### Core Domain Models
| Model | Purpose | Key Fields | Status |
|-------|---------|------------|--------|
| `User` | Authentication & profile | email, password, role, status | **REAL** |
| `Session` | Better-Auth sessions | token, expiresAt, userId | **REAL** |
| `Account` | OAuth providers | providerId, accessToken | **REAL** |
| `Volunteer` | Rescuer profiles | name, location, status, metrics | **REAL** |
| `RescueRequest` | Citizen rescue requests | location, status, assignedTo | **REAL** |
| `RescueTimeline` | Event tracking | event, rescueId, timestamp | **REAL** |
| `Hospital` | Treatment centers | location, capabilities, status | **REAL** |
| `SnakeSpecies` | Snake database | name, venomous, characteristics | **REAL** |

#### RBAC Models
| Model | Status |
|-------|--------|
| `Role` | **REAL** |
| `Permission` | **REAL** |
| `RolePermission` | **REAL** |
| `UserRoleAssignment` | **REAL** |

#### Supporting Models
- `AIIdentification` - Snake AI predictions
- `Training` - Volunteer training
- `Notification` - System notifications
- `BlogPost` - CMS content
- `GalleryImage` - Media gallery
- `Donation` / `Payment` - Donation system
- `ContactMessage` - Contact forms
- `ActivityLog` - Audit trail
- `HospitalVerification` - Hospital data verification
- `HospitalReport` - Community reports

#### Geospatial Intelligence Models (RECENT ADDITION)
- `SnakebiteHotspot` - Research-based risk zones
- `SnakebiteCase` - Historical epidemiology data
- `TreatmentCenterSource` - Provenance tracking
- `RescueVehicle` - Vehicle tracking
- `SpeciesObservation` - Field observations
- `DistrictStatistics` - Analytics cache

### ✅ ENUMS - WELL DEFINED

```prisma
UserRole: CITIZEN, VOLUNTEER, VERIFIED_RESCUER, DISTRICT_COORDINATOR, ADMIN, SUPER_ADMIN
UserStatus: ACTIVE, INACTIVE, SUSPENDED, PENDING_VERIFICATION, BANNED

RescueStatus: PENDING, ASSIGNED, ACCEPTED, IN_PROGRESS, COMPLETED, CANCELLED, CLOSED, EXPIRED
RescuePriority: LOW, MEDIUM, HIGH, CRITICAL
RescueOutcome: RESCUED_RELOCATED, ALREADY_GONE, FALSE_ALARM, NO_SNAKE_FOUND, DECEASED, REFUSED_HELP

VolunteerStatus: PENDING, APPROVED, VERIFIED, SUSPENDED, REJECTED, INACTIVE

AntivenomStatus: AVAILABLE, LOW_STOCK, OUT_OF_STOCK, UNKNOWN, NOT_SUPPORTED
VerificationStatus: VERIFIED, HISTORICAL, STALE, UNVERIFIED
HospitalStatus: ACTIVE, INACTIVE, TEMPORARILY_CLOSED, PERMANENTLY_CLOSED

NotificationType: RESCUE_CREATED, RESCUE_ASSIGNED, RESCUE_ACCEPTED, ...
PaymentMethod: ESEWA, KHALTI, IME_PAY, STRIPE, BANK_TRANSFER, CASH
PaymentStatus: PENDING, COMPLETED, FAILED, REFUNDED

RiskLevel: LOW, MODERATE, HIGH, VERY_HIGH, EXTREME
Season: WINTER, SPRING, MONSOON, AUTUMN
VehicleStatus: AVAILABLE, ASSIGNED, EN_ROUTE, ON_SITE, MAINTENANCE
```

### ⚠️ COORDINATE STANDARDIZATION

**FINDING**: Schema uses **BOTH** naming conventions:
- RescueRequest: `lat`, `lng`
- Volunteer: `currentLat`, `currentLng`
- Hospital: `latitude`, `longitude`
- SnakebiteHotspot: `latitude`, `longitude`

**RECOMMENDATION**: **DO NOT CHANGE** existing schema. Instead:
1. Create coordinate adapter utilities
2. Document the convention per model
3. Add validation in GraphQL layer

**RATIONALE**: Schema changes require migrations. Current implementation works. Standardize in presentation layer.

---

## 3. GRAPHQL API AUDIT

### ✅ SCHEMA ORGANIZATION

```
libs/contracts/src/lib/graphql/
├── shared/          # Primitives, directives, responses
├── auth/            # Authentication & users
├── rescue/          # Rescue requests
├── volunteer/       # Volunteer management
├── snake/           # Snake species
├── ai/              # AI identification
├── hospital/        # Hospital data
├── map/             # Geospatial queries
├── notification/    # Notifications
├── payment/         # Donations
├── analytics/       # Statistics
├── training/        # Training sessions
├── cms/             # Blog & gallery
└── contact/         # Contact forms
```

### ✅ IMPLEMENTED RESOLVERS

Based on `apps/backend/src/server.ts`:

```typescript
const resolvers = [
  authResolvers,                    // ✅ Authentication
  rescueQueryResolvers,             // ✅ Rescue queries
  rescueMutationResolvers,          // ✅ Rescue mutations
  analyticsResolvers,               // ✅ Analytics
  paymentsResolvers,                // ✅ Payments
  hospitalQueryResolvers,           // ✅ Hospital queries
  hospitalMutationResolvers,        // ✅ Hospital mutations
  hospitalSubscriptionResolvers,    // ✅ Hospital subscriptions
  mapQueryResolvers,                // ✅ Map queries
];
```

### ⚠️ MISSING RESOLVERS

| Feature | Schema Exists | Resolver Exists | Status |
|---------|---------------|-----------------|--------|
| Volunteer queries/mutations | ✅ | ❌ | **MISSING** |
| Snake species queries/mutations | ✅ | ❌ | **MISSING** |
| AI identification | ✅ | ❌ | **MISSING** |
| Training management | ✅ | ❌ | **MISSING** |
| CMS (Blog/Gallery) | ✅ | ❌ | **MISSING** |
| Contact messages | ✅ | ❌ | **MISSING** |
| Notification mutations | ✅ | ❌ | **MISSING** |
| Rescue subscriptions | ✅ | ❌ | **PARTIAL** |

### ✅ KEY GRAPHQL OPERATIONS

#### Rescue Workflow
- `getRescueRequest(id: ID!): RescueRequest`
- `listRescueRequests(filter, pagination): RescueRequestConnection`
- `createRescueRequest(input): RescueRequest`
- `updateRescueStatus(id, status): RescueRequest`
- `assignRescue(id, volunteerId): RescueRequest`

#### Map Intelligence (NEW)
- `mapOverview(bounds): MapOverview` - Single optimized query
- `nearbyRescuers(lat, lng, radius): [Volunteer]`
- `nearbyTreatmentCenters(lat, lng): [Hospital]`
- `rankTreatmentCenters(lat, lng): [TreatmentCenterRanking]`
- `snakebiteHotspots(bounds): [SnakebiteHotspot]`
- `districtAnalytics(district): DistrictStatistics`

#### Hospital Verification
- `listHospitals(filter, pagination): HospitalConnection`
- `verifyHospital(id, verification): Hospital`
- `updateAntivenomStatus(id, status): Hospital`

---

## 4. FRONTEND ARCHITECTURE AUDIT

### ✅ DASHBOARD ROUTES

```
/dashboard
├── /admin
│   ├── page.tsx              # ✅ Admin overview
│   ├── /map                  # ✅ Live field map
│   ├── /hospitals            # ✅ Hospital management
│   ├── /users                # ✅ User management
│   ├── /rescues              # ⚠️ Rescue management
│   ├── /rescuers             # ⚠️ Rescuer management
│   ├── /analytics            # ❌ MISSING
│   ├── /notifications        # ⚠️ PARTIAL
│   └── /settings             # ⚠️ PARTIAL
│
├── /citizen
│   ├── page.tsx              # ✅ Citizen dashboard
│   ├── /emergency            # ✅ Emergency button
│   ├── /request              # ✅ Create rescue request
│   ├── /requests             # ✅ My requests
│   ├── /map                  # ✅ Map view
│   ├── /hospitals            # ✅ Hospital finder
│   └── /profile              # ✅ Profile
│
└── /rescuer
    ├── page.tsx              # ✅ Rescuer dashboard
    ├── /active               # ⚠️ Active rescue (PARTIAL)
    ├── /assignments          # ⚠️ Queue (NOT PROMINENT)
    ├── /history              # ✅ Rescue history
    ├── /map                  # ✅ Map view
    └── /profile              # ✅ Profile
```

### ✅ MAP COMPONENTS

```
components/map/
├── EmergencyMap.tsx           # ✅ Leaflet-based (Citizen)
├── RescueMap.tsx              # ✅ Leaflet-based (Rescuer)
├── GoogleEmergencyMap.tsx     # ✅ Google Maps (Admin)
└── coverage-map.tsx           # ✅ Coverage visualization
```

**FINDING**: **THREE DIFFERENT MAP IMPLEMENTATIONS**

| Map | Technology | Usage | Status |
|-----|------------|-------|--------|
| `EmergencyMap` | Leaflet + OpenStreetMap | Citizen emergency | **REAL** |
| `RescueMap` | Leaflet + OpenStreetMap | Rescuer navigation | **REAL** |
| `GoogleEmergencyMap` | Google Maps API | Admin overview | **REAL** |

**RECOMMENDATION**: This is **ACCEPTABLE** - different contexts need different capabilities:
- Admin map needs Google Maps for better satellite imagery and business data
- Citizen/Rescuer maps can use free Leaflet for operational tasks

### ⚠️ COMPONENT DUPLICATION ANALYSIS

**Search for "Map" components**:
- ✅ Separation of concerns (admin vs operational) is valid
- ⚠️ Hospital marker logic MAY be duplicated
- ⚠️ Route rendering MAY be duplicated

**RECOMMENDATION**: Extract shared logic into hooks:
- `useHospitalMarkers()`
- `useRescueRoute()`
- `useRescuerTracking()`

---

## 5. RESCUE WORKFLOW ANALYSIS

### INTENDED WORKFLOW

```
1. CITIZEN creates rescue request
   ├── Capture location (GPS or manual)
   ├── Upload snake image (optional)
   ├── Describe incident
   └── Submit request
   
2. REQUEST enters QUEUE
   ├── Status: PENDING
   ├── Priority assigned (based on venomous detection)
   └── Visible to available rescuers
   
3. RESCUER sees queue
   ├── Nearby requests shown
   ├── Distance calculated
   ├── Can accept request
   └── Status: ASSIGNED → ACCEPTED
   
4. RESCUER accepts rescue
   ├── Status: ACCEPTED → IN_PROGRESS
   ├── GPS tracking starts
   ├── Navigation to incident
   └── Citizen sees rescuer location
   
5. RESCUER arrives
   ├── Status: IN_PROGRESS (on-site)
   ├── Performs rescue
   └── Uploads rescue images
   
6. HOSPITAL routing (if needed)
   ├── Find nearest verified hospitals
   ├── Filter by snakebite treatment capability
   ├── Check antivenom status
   ├── Navigate to selected hospital
   └── ETA displayed
   
7. RESCUE completion
   ├── Status: COMPLETED
   ├── Outcome recorded
   ├── Report submitted
   └── Analytics updated
   
8. ADMIN oversight
   ├── Monitor all rescues
   ├── View success rates
   ├── Analyze hotspots
   └── Manage resources
```

### ✅ IMPLEMENTED PARTS

| Step | Frontend | GraphQL | Backend Service | Status |
|------|----------|---------|-----------------|--------|
| Create request | ✅ | ✅ | ✅ | **REAL** |
| View own requests | ✅ | ✅ | ✅ | **REAL** |
| Admin view all | ✅ | ✅ | ✅ | **REAL** |
| Hospital finder | ✅ | ✅ | ✅ | **REAL** |
| Basic map display | ✅ | ✅ | ✅ | **REAL** |

### ⚠️ PARTIAL IMPLEMENTATIONS

| Feature | Issue | Evidence |
|---------|-------|----------|
| **Rescue Queue** | Not prominent in rescuer dashboard | Buried in `/assignments` route |
| **Assignment logic** | GraphQL mutation exists, but atomic locking unclear | Need to verify service layer |
| **Status lifecycle** | PENDING→ASSIGNED→ACCEPTED defined, but transitions may not be enforced | Check resolvers |
| **Rescuer location** | Schema has `currentLat/Lng`, but real-time update mechanism unclear | No WebSocket/SSE visible |
| **Routing** | OSRM fallback exists, but integration with rescue workflow unclear | Check `RescueMap` component |

### ❌ MISSING IMPLEMENTATIONS

| Feature | Schema | GraphQL | Resolver | Service | Frontend | Overall Status |
|---------|--------|---------|----------|---------|----------|----------------|
| **Real-time tracking** | ✅ | ❓ | ❓ | ❌ | ❌ | **MISSING** |
| **Atomic assignment** | ✅ | ✅ | ❓ | ❓ | ✅ | **UNCLEAR** |
| **Rescue notifications** | ✅ | ✅ | ❌ | ❌ | ⚠️ | **PARTIAL** |
| **ETA calculation** | ✅ | ❌ | ❌ | ❌ | ❌ | **MISSING** |
| **Hospital routing** | ✅ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | **PARTIAL** |
| **Rescue timeline** | ✅ | ⚠️ | ⚠️ | ⚠️ | ❌ | **PARTIAL** |

---

## 6. RESCUE QUEUE ANALYSIS

### 🚨 CRITICAL FINDING: Queue Not Prominent

**Current Rescuer Dashboard Structure** (`apps/frontend/src/app/(dashboard)/dashboard/rescuer/page.tsx`):

Likely shows:
- Stats cards (assignments, completed, rating)
- Recent activity
- Profile summary
- **Queue buried in sidebar link** `/rescuer/assignments`

**PROBLEM**: The queue is the **OPERATIONAL HEART** of the system. It should be:
- ✅ Visible without navigation
- ✅ Persistent across routes
- ✅ Shows distance to requests
- ✅ Real-time updates
- ✅ Accessible on mobile

**RECOMMENDATION**: 
1. Make queue a **persistent bottom sheet** on mobile
2. Make queue a **sidebar panel** on desktop
3. Show queue on **rescuer dashboard homepage**
4. Add **badge counts** for pending requests

### Queue Component Architecture (NEEDS TO BE BUILT)

```typescript
<RescueQueue>
  <QueueHeader>
    <Title>Available Rescues</Title>
    <Badge count={pendingCount} />
    <FilterButton />
  </QueueHeader>
  
  <QueueFilters>
    <DistanceFilter max={20} />
    <PriorityFilter />
    <MunicipalityFilter />
  </QueueFilters>
  
  <QueueList>
    {requests.map(request => (
      <RescueRequestCard
        key={request.id}
        request={request}
        distance={calculateDistance(rescuerLocation, request.location)}
        onAccept={handleAccept}
      >
        <RequestPriority priority={request.priority} />
        <RequestLocation address={request.address} />
        <RequestDistance km={distance} />
        <RequestTime createdAt={request.createdAt} />
        <RequestSnake species={request.species} />
        <AcceptButton />
      </RescueRequestCard>
    ))}
  </QueueList>
  
  <QueueEmpty state={isEmpty}>
    <EmptyIcon />
    <EmptyMessage>No nearby rescues</EmptyMessage>
  </QueueEmpty>
</RescueQueue>
```

---

## 7. HOSPITAL DATA ANALYSIS

### ✅ HOSPITAL SCHEMA - COMPREHENSIVE

```prisma
model Hospital {
  latitude  Float     # ✅ REQUIRED for mapping
  longitude Float     # ✅ REQUIRED for mapping
  
  snakebiteTreatmentAvailable Boolean
  antivenomStatus             AntivenomStatus  # AVAILABLE, LOW_STOCK, OUT_OF_STOCK, UNKNOWN
  antivenomLastVerifiedAt     DateTime?
  
  emergency24x7      Boolean
  ventilatorAvailable Boolean
  icuAvailable        Boolean
  
  verificationStatus      VerificationStatus  # VERIFIED, HISTORICAL, STALE, UNVERIFIED
  officialTreatmentCenter Boolean
  edcdCertified           Boolean
  
  source                  String?  # EDCD, Provincial_Health, etc.
  sourceYear              String?
}
```

### ✅ SEED DATA STATUS

**File**: `libs/database/prisma/seeds/hospitals.seed.ts`

**Confirmed**: 67 hospitals seeded with:
- ✅ Real coordinates (verified via map display)
- ✅ District & municipality
- ✅ Emergency capabilities
- ✅ Snakebite treatment flags
- ✅ Antivenom status (mix of AVAILABLE, UNKNOWN, NOT_SUPPORTED)

### ⚠️ VERIFICATION CONCERNS

**FINDING**: Antivenom status shows mix of states:
- Some hospitals: `antivenomStatus: AVAILABLE`
- Some hospitals: `antivenomStatus: UNKNOWN`
- Some hospitals: `antivenomStatus: NOT_SUPPORTED`

**QUESTION**: Is this **real data** or **assumed data**?

**RECOMMENDATION**: 
1. Add `dataQuality` field to hospital records
2. Show verification date on hospital cards
3. Add "Report Issue" button for crowdsourced corrections
4. Display **uncertainty** clearly in UI:
   - ✅ "Verified Available (Jan 2025)"
   - ⚠️ "Status Unknown - Last checked 2023"
   - ❌ "Not Verified"

### ⚠️ HOSPITAL MARKER IMPLEMENTATION

**Current Implementation** (`GoogleEmergencyMap.tsx`):
- Uses emoji: 🏥
- Pulls data from GraphQL
- Shows popup on click
- Displays first 100 hospitals (recently fixed)

**ISSUES**:
1. ❌ Emoji markers (inconsistent rendering across devices)
2. ⚠️ No visual distinction for verified vs unverified
3. ⚠️ No antivenom status indicator
4. ⚠️ Popup may not show verification status

**RECOMMENDATION**:
```typescript
<HospitalMarker
  hospital={hospital}
  icon={getHospitalIcon(hospital)}
  verified={hospital.verificationStatus === 'VERIFIED'}
  hasAntivenom={hospital.antivenomStatus === 'AVAILABLE'}
  onClick={() => showHospitalPopup(hospital)}
/>

function getHospitalIcon(hospital: Hospital) {
  if (hospital.edcdCertified) return verifiedHospitalIcon;
  if (hospital.antivenomStatus === 'AVAILABLE') return antivenomIcon;
  if (hospital.snakebiteTreatmentAvailable) return treatmentIcon;
  return basicHospitalIcon;
}
```

---

## 8. ROUTING & NAVIGATION ANALYSIS

### ✅ OSRM INTEGRATION

**File**: Check `libs/backend/modules/src/map` or `libs/frontend/src/lib`

**Evidence**: Documentation mentions "OSRM fallback"

**Status**: **PARTIAL** - exists but integration with rescue workflow unclear

### ❌ MISSING: Complete Routing Workflow

**What's Needed**:

```
1. RESCUER accepts rescue
   ├── Get rescuer current location
   ├── Get incident location
   ├── Request route from OSRM/Google
   ├── Calculate ETA
   └── Display route on map
   
2. RESCUER en route
   ├── Track GPS position (every 30s?)
   ├── Update ETA based on current location
   ├── Send location to backend
   └── Citizen sees rescuer approaching
   
3. HOSPITAL routing (if needed)
   ├── Get current location (incident site)
   ├── Query verified hospitals within 50km
   ├── Rank by travel time (NOT just distance!)
   ├── Show top 5 options with ETA
   ├── Rescuer selects hospital
   └── Navigate to hospital
```

### 🚨 CRITICAL GAP: Real-time Location Sharing

**Current State**: Schema has `Volunteer.currentLat/Lng` but update mechanism unclear

**Options for Implementation**:
1. **WebSocket** - Bidirectional, low latency (BEST)
2. **Server-Sent Events (SSE)** - One-way, simpler
3. **GraphQL Subscriptions** - Built into Apollo (RECOMMENDED)
4. **Polling** - Simple but inefficient

**RECOMMENDATION**: Use **GraphQL Subscriptions**

```graphql
type Subscription {
  rescuerLocationUpdated(rescueId: ID!): RescuerLocation
}

type RescuerLocation {
  rescueId: ID!
  volunteerId: ID!
  latitude: Float!
  longitude: Float!
  timestamp: DateTime!
  accuracy: Float
  heading: Float
}
```

---

## 9. AUTHENTICATION & AUTHORIZATION AUDIT

### ✅ AUTHENTICATION - IMPLEMENTED

**System**: Better-Auth (session-based)

**Models**:
- `Session` - Token, expiry, user agent
- `Account` - OAuth providers (Google, GitHub)
- `Verification` - Email verification codes

**Routes** (inferred):
- `/api/auth/login` - ✅
- `/api/auth/register` - ✅
- `/api/auth/logout` - ✅
- `/api/auth/session` - ✅

### ✅ RBAC - IMPLEMENTED

**Roles**:
```typescript
enum UserRole {
  CITIZEN
  VOLUNTEER
  VERIFIED_RESCUER      // ← Important distinction!
  DISTRICT_COORDINATOR
  ADMIN
  SUPER_ADMIN
}
```

**RBAC Tables**:
- `Role` - Role definitions
- `Permission` - Granular permissions
- `RolePermission` - Many-to-many
- `UserRoleAssignment` - User role grants

### ⚠️ AUTHORIZATION ENFORCEMENT - UNCLEAR

**QUESTIONS**:
1. Are GraphQL resolvers checking permissions?
2. Are mutations validating user roles?
3. Can a CITIZEN accept a rescue request? (should be blocked)
4. Can a VOLUNTEER see admin analytics? (should be blocked)

**RECOMMENDATION**: Audit every resolver for authorization checks:

```typescript
// CORRECT PATTERN
async function assignRescue(parent, args, context) {
  // 1. Check authentication
  if (!context.user) {
    throw new AuthenticationError('Not authenticated');
  }
  
  // 2. Check authorization
  if (!hasPermission(context.user, 'ASSIGN_RESCUES')) {
    throw new ForbiddenError('Not authorized');
  }
  
  // 3. Business logic
  return rescueService.assignRescue(args.rescueId, args.volunteerId);
}
```

### 🚨 CRITICAL: Prevent Double Assignment

**RISK**: Two rescuers might accept the same request simultaneously

**SOLUTION**: Database-level atomic update

```typescript
// In rescue service
async acceptRescue(rescueId: string, volunteerId: string) {
  const result = await prisma.rescueRequest.updateMany({
    where: {
      id: rescueId,
      status: 'PENDING',      // Only update if still PENDING
      assignedTo: null,        // Only update if not assigned
    },
    data: {
      status: 'ASSIGNED',
      assignedTo: volunteerId,
      assignedAt: new Date(),
    },
  });
  
  if (result.count === 0) {
    throw new Error('Rescue already assigned or not available');
  }
  
  return this.getRescueById(rescueId);
}
```

---

## 10. AI SNAKE IDENTIFICATION

### ✅ DATABASE MODEL

```prisma
model AIIdentification {
  imageUrl       String
  speciesId      String?
  species        SnakeSpecies?
  confidence     Float
  provider       String  # "gemini", "openai", "claude"
  model          String
  responseTime   Int?
  
  alternativeMatches Json?
  venomousDetected   Boolean?
  userFeedback       String?
}
```

### ❌ IMPLEMENTATION STATUS: **MISSING**

**Evidence**: No AI resolvers in `server.ts`, no AI service in `libs/backend/modules`

**GraphQL Schema**: ✅ Exists in `libs/contracts/src/lib/graphql/ai/`

**CONCLUSION**: AI feature is **PLANNED BUT NOT IMPLEMENTED**

### 🎯 RECOMMENDED ARCHITECTURE

```
Frontend
  ↓ (Upload image)
GraphQL Mutation: identifySnake(imageUrl)
  ↓
AI Service (Node.js)
  ↓ (HTTP request)
Python AI Service (separate process/container)
  ↓ (ML model inference)
Snake Species Database Mapping
  ↓
Return prediction + confidence
```

**IMPORTANT**: AI should **NEVER** directly declare a snake safe. Flow:

```
1. AI predicts: "Likely Ptyas mucosa" (confidence: 85%)
2. Backend looks up SnakeSpecies by name
3. Return: species record (with verified venomous status)
4. UI displays: 
   - "AI Prediction: Rat Snake"
   - "Venomous: No (verified)"
   - "Confidence: 85%"
   - "⚠️ Always treat unknown snakes as dangerous"
```

---

## 11. MOBILE RESPONSIVENESS AUDIT

### ⚠️ RESPONSIVE ARCHITECTURE - INCONSISTENT

**Findings**:
- ✅ TailwindCSS responsive utilities used
- ✅ Mobile-specific component: `AdminDashboardMobile.tsx`
- ⚠️ Desktop sidebar may collapse on mobile
- ⚠️ Queue accessibility on mobile unclear
- ⚠️ Map controls may be cramped on mobile

### 🚨 CRITICAL: Mobile Queue UX

**Problem**: Rescue queue MUST be accessible on mobile for field rescuers

**Current State**: Likely requires:
1. Open menu
2. Navigate to /assignments
3. View queue

**Required State**: 
1. Open app → Queue visible
2. Bottom sheet design
3. Swipe to accept

**Recommendation**:

```typescript
// Mobile Rescuer Dashboard
<MobileRescuerDashboard>
  <TopBar>
    <StatusIndicator online={isOnline} />
    <NotificationBell />
  </TopBar>
  
  <MainContent>
    <ActiveRescueCard rescue={activeRescue} />
    
    <BottomSheet defaultOpen={!activeRescue}>
      <SheetHandle />
      <RescueQueue compact />
    </BottomSheet>
  </MainContent>
  
  <BottomNav>
    <NavItem icon={QueueIcon} label="Queue" active />
    <NavItem icon={MapIcon} label="Map" />
    <NavItem icon={HistoryIcon} label="History" />
    <NavItem icon={ProfileIcon} label="Profile" />
  </BottomNav>
</MobileRescuerDashboard>
```

---

## 12. FEATURE MATRIX

### Complete Implementation Status

| Feature | Database | GraphQL Schema | Resolver | Service | Frontend | Overall Status |
|---------|----------|----------------|----------|---------|----------|----------------|
| **Auth & Users** |
| User registration | ✅ | ✅ | ✅ | ✅ | ✅ | **REAL** |
| Login/Logout | ✅ | ✅ | ✅ | ✅ | ✅ | **REAL** |
| OAuth (Google) | ✅ | ✅ | ✅ | ✅ | ✅ | **REAL** |
| Email verification | ✅ | ✅ | ✅ | ✅ | ⚠️ | **PARTIAL** |
| Password reset | ✅ | ✅ | ✅ | ✅ | ⚠️ | **PARTIAL** |
| Role-based access | ✅ | ✅ | ⚠️ | ⚠️ | ⚠️ | **PARTIAL** |
| **Rescue Workflow** |
| Create rescue request | ✅ | ✅ | ✅ | ✅ | ✅ | **REAL** |
| View own requests | ✅ | ✅ | ✅ | ✅ | ✅ | **REAL** |
| Admin view all requests | ✅ | ✅ | ✅ | ✅ | ✅ | **REAL** |
| **Rescue Queue** | ✅ | ✅ | ✅ | ✅ | ⚠️ | **PARTIAL - NOT PROMINENT** |
| Accept rescue | ✅ | ✅ | ⚠️ | ⚠️ | ✅ | **PARTIAL - NEEDS ATOMIC LOCK** |
| Update rescue status | ✅ | ✅ | ✅ | ✅ | ⚠️ | **PARTIAL** |
| Rescue timeline | ✅ | ⚠️ | ⚠️ | ⚠️ | ❌ | **PARTIAL** |
| Rescue completion | ✅ | ✅ | ⚠️ | ⚠️ | ⚠️ | **PARTIAL** |
| **Real-time Features** |
| Rescuer GPS tracking | ✅ | ❓ | ❌ | ❌ | ❌ | **MISSING** |
| Live location sharing | ✅ | ❓ | ❌ | ❌ | ❌ | **MISSING** |
| Real-time notifications | ✅ | ✅ | ❌ | ❌ | ⚠️ | **MISSING** |
| Status subscriptions | ✅ | ✅ | ⚠️ | ❌ | ❌ | **PARTIAL** |
| **Navigation & Routing** |
| Map display | ✅ | ✅ | ✅ | ✅ | ✅ | **REAL** |
| Hospital markers | ✅ | ✅ | ✅ | ✅ | ✅ | **REAL** |
| Rescue markers | ✅ | ✅ | ✅ | ✅ | ✅ | **REAL** |
| Route calculation | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | **PARTIAL** |
| ETA calculation | ⚠️ | ❌ | ❌ | ❌ | ❌ | **MISSING** |
| Turn-by-turn navigation | ❌ | ❌ | ❌ | ❌ | ❌ | **MISSING** |
| **Hospital Management** |
| Hospital database | ✅ | ✅ | ✅ | ✅ | ✅ | **REAL** |
| Hospital search | ✅ | ✅ | ✅ | ✅ | ✅ | **REAL** |
| Antivenom status | ✅ | ✅ | ✅ | ✅ | ✅ | **REAL** |
| Hospital verification | ✅ | ✅ | ✅ | ⚠️ | ⚠️ | **PARTIAL** |
| Verification workflow | ✅ | ✅ | ⚠️ | ⚠️ | ❌ | **PARTIAL** |
| Hospital routing | ✅ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | **PARTIAL** |
| **Volunteer Management** |
| Volunteer profiles | ✅ | ✅ | ❌ | ❌ | ✅ | **PARTIAL** |
| Volunteer application | ✅ | ✅ | ❌ | ❌ | ⚠️ | **PARTIAL** |
| Volunteer approval | ✅ | ✅ | ❌ | ❌ | ❌ | **MISSING** |
| Performance metrics | ✅ | ⚠️ | ❌ | ❌ | ❌ | **MISSING** |
| Availability tracking | ✅ | ❌ | ❌ | ❌ | ❌ | **MISSING** |
| **Snake Intelligence** |
| Species database | ✅ | ✅ | ❌ | ❌ | ⚠️ | **PARTIAL** |
| Species search | ✅ | ✅ | ❌ | ❌ | ❌ | **MISSING** |
| AI identification | ✅ | ✅ | ❌ | ❌ | ❌ | **MISSING** |
| Image upload | ✅ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | **PARTIAL** |
| **Analytics & Intelligence** |
| Admin dashboard stats | ✅ | ✅ | ✅ | ✅ | ✅ | **REAL** |
| Rescue analytics | ✅ | ✅ | ✅ | ⚠️ | ⚠️ | **PARTIAL** |
| District statistics | ✅ | ✅ | ❌ | ❌ | ❌ | **MISSING** |
| Hotspot visualization | ✅ | ✅ | ❌ | ❌ | ❌ | **MISSING** |
| Seasonal analytics | ✅ | ✅ | ❌ | ❌ | ❌ | **MISSING** |
| Historical cases | ✅ | ✅ | ❌ | ❌ | ❌ | **MISSING** |
| **Content & Community** |
| Blog posts | ✅ | ✅ | ❌ | ❌ | ❌ | **MISSING** |
| Gallery images | ✅ | ✅ | ❌ | ❌ | ❌ | **MISSING** |
| Contact forms | ✅ | ✅ | ❌ | ❌ | ⚠️ | **PARTIAL** |
| **Donations** |
| Donation creation | ✅ | ✅ | ✅ | ✅ | ✅ | **REAL** |
| Payment processing | ✅ | ✅ | ✅ | ⚠️ | ✅ | **PARTIAL** |
| Donation receipts | ✅ | ⚠️ | ⚠️ | ⚠️ | ❌ | **PARTIAL** |

### Legend
- ✅ **REAL** - Fully implemented and functional
- ⚠️ **PARTIAL** - Implemented but incomplete or needs work
- ❌ **MISSING** - Not implemented
- ❓ **UNCLEAR** - Implementation status unknown

---

## 13. MOCK DATA ANALYSIS

### ✅ SEED FILES

```
libs/database/prisma/
├── seed-full.ts                # Master seed orchestrator
├── seeds/
│   ├── hospitals.seed.ts       # ✅ REAL DATA (67 hospitals)
│   ├── hotspots.seed.ts        # ✅ REAL DATA (research-based)
│   ├── species.seed.ts         # ⚠️ NEEDS VERIFICATION
│   └── users.seed.ts           # ⚠️ DEVELOPMENT ONLY
```

### ⚠️ FINDINGS

**hospitals.seed.ts**: 
- ✅ Real hospital names
- ✅ Real coordinates
- ⚠️ Antivenom status may be assumed
- ✅ Source attribution present

**hotspots.seed.ts**:
- ✅ Research-backed (Sharma et al. 2021)
- ✅ Proper citations
- ✅ Risk scores from actual studies

**users.seed.ts**:
- ⚠️ Contains test users with fake data
- ⚠️ Should NOT be used in production

### 🚨 PRODUCTION CHECKLIST

Before production:
1. ✅ Remove development seed users
2. ✅ Verify hospital antivenom status
3. ✅ Add hospital verification dates
4. ✅ Document data sources
5. ✅ Add data quality indicators

---

## 14. CRITICAL GAPS SUMMARY

### 🚨 MUST FIX FOR PRODUCTION

1. **Rescue Queue Visibility**
   - Current: Buried in /assignments route
   - Required: Prominent on rescuer dashboard
   - Impact: **CRITICAL** - Rescuers won't see requests

2. **Atomic Rescue Assignment**
   - Current: Unclear if double-assignment is prevented
   - Required: Database-level locking
   - Impact: **CRITICAL** - Two rescuers might accept same request

3. **Real-time Location Tracking**
   - Current: Missing
   - Required: GPS → Backend → Citizen map
   - Impact: **CRITICAL** - Citizen can't see rescuer approaching

4. **Hospital Verification UX**
   - Current: Antivenom status unclear
   - Required: Show verification status and date
   - Impact: **HIGH** - Trust in hospital data

5. **Authorization Enforcement**
   - Current: Unclear if resolvers check permissions
   - Required: Role checks on all mutations
   - Impact: **CRITICAL** - Security vulnerability

### ⚠️ SHOULD HAVE FOR PRODUCTION

6. **Rescue Timeline Display**
   - Current: Database model exists, no frontend
   - Required: Show rescue progress to citizen
   - Impact: **HIGH** - User experience

7. **ETA Calculation**
   - Current: Routing exists, but no ETA
   - Required: Calculate and display ETA
   - Impact: **MEDIUM** - User expectation

8. **Mobile Queue UX**
   - Current: Desktop-first design
   - Required: Mobile-optimized bottom sheet
   - Impact: **HIGH** - Field rescuers use mobile

9. **Notification System**
   - Current: Database model exists, delivery unclear
   - Required: Push notifications for rescuers
   - Impact: **HIGH** - Timely response

10. **Hospital Routing Integration**
    - Current: Hospital data exists, routing partial
    - Required: Complete routing workflow
    - Impact: **MEDIUM** - Snakebite emergencies

### 🎯 NICE TO HAVE

11. **AI Snake Identification**
12. **Analytics Dashboard**
13. **Hotspot Visualization**
14. **District Statistics**
15. **Historical Trend Analysis**

---

## 15. ARCHITECTURE RECOMMENDATIONS

### ✅ KEEP AS-IS

1. **Nx Monorepo** - Good separation of concerns
2. **Prisma ORM** - Clean schema, good tooling
3. **GraphQL API** - Flexible, well-documented
4. **PostgreSQL** - Proper relational database
5. **Three Map Implementations** - Justified by different needs

### ⚠️ NEEDS REFACTORING

1. **Extract Map Hooks**
   ```typescript
   // Create:
   hooks/map/
   ├── useHospitalMarkers.ts
   ├── useRescueRoute.ts
   ├── useRescuerTracking.ts
   └── useMapBounds.ts
   ```

2. **Create Rescue Queue Component**
   ```typescript
   components/rescue/
   ├── RescueQueue.tsx           # Main queue component
   ├── RescueQueueHeader.tsx
   ├── RescueQueueFilters.tsx
   ├── RescueRequestCard.tsx
   ├── RescuePriorityBadge.tsx
   └── RescueQueueEmpty.tsx
   ```

3. **Implement GraphQL Subscriptions**
   ```typescript
   // For real-time updates:
   subscription RescueStatusUpdated($rescueId: ID!) {
     rescueStatusUpdated(rescueId: $rescueId) {
       id
       status
       assignedTo
       updatedAt
     }
   }
   
   subscription RescuerLocationUpdated($rescueId: ID!) {
     rescuerLocationUpdated(rescueId: $rescueId) {
       rescueId
       latitude
       longitude
       timestamp
     }
   }
   ```

4. **Create Service Layer Architecture**
   ```typescript
   libs/backend/modules/src/rescue/
   ├── rescue.resolvers.ts       # GraphQL resolvers
   ├── rescue.service.ts         # Business logic
   ├── rescue.repository.ts      # Database queries
   ├── rescue.validators.ts      # Input validation
   └── rescue.utils.ts           # Helper functions
   ```

### ❌ DO NOT CHANGE

1. **Coordinate field names** - Would require migrations
2. **User role enum** - Already in use
3. **Rescue status enum** - Core workflow dependency
4. **Better-Auth** - Working authentication

---

## 16. IMMEDIATE ACTION PLAN

### Phase 0: Verification (THIS WEEK)

**Goal**: Understand what actually works

1. ✅ **Audit Complete** (this document)
2. ⏳ **Test Complete Workflow**:
   - [ ] Create rescue request as CITIZEN
   - [ ] View request in RESCUER queue
   - [ ] Accept rescue as RESCUER
   - [ ] Verify no double-assignment possible
   - [ ] Update rescue status
   - [ ] Complete rescue
   - [ ] View on ADMIN dashboard
   
3. ⏳ **Document Findings**:
   - [ ] What works?
   - [ ] What breaks?
   - [ ] What's missing?

### Phase 1: Critical Fixes (WEEK 1-2)

**Goal**: Make current workflow production-ready

1. **Fix Rescue Queue**
   - [ ] Create `RescueQueue` component
   - [ ] Add to rescuer dashboard homepage
   - [ ] Make mobile-responsive (bottom sheet)
   - [ ] Add real-time updates (polling or subscription)

2. **Implement Atomic Assignment**
   - [ ] Add database-level lock to `acceptRescue`
   - [ ] Test concurrent acceptance attempts
   - [ ] Add error handling for "already assigned"

3. **Enforce Authorization**
   - [ ] Audit all GraphQL resolvers
   - [ ] Add permission checks
   - [ ] Test unauthorized access attempts

4. **Hospital Verification UX**
   - [ ] Show verification status on map popup
   - [ ] Show verification date
   - [ ] Add "Data last verified: X days ago"
   - [ ] Add "Report Issue" button

### Phase 2: Real-time Tracking (WEEK 3-4)

**Goal**: Enable rescuer tracking

1. **Implement Location Tracking**
   - [ ] Add GraphQL subscription for location updates
   - [ ] Create location update mutation
   - [ ] Build rescuer location service
   - [ ] Add frontend GPS tracking
   - [ ] Display rescuer location on citizen map

2. **Implement Notifications**
   - [ ] Create notification service
   - [ ] Add push notification setup
   - [ ] Send notifications on status changes
   - [ ] Build notification UI

### Phase 3: Complete Routing (WEEK 5-6)

**Goal**: Complete navigation workflow

1. **Rescue Navigation**
   - [ ] Integrate OSRM route calculation
   - [ ] Display route on rescuer map
   - [ ] Calculate and show ETA
   - [ ] Update ETA as rescuer moves

2. **Hospital Routing**
   - [ ] Build hospital selection UI
   - [ ] Rank hospitals by travel time
   - [ ] Show hospital capabilities
   - [ ] Navigate to selected hospital

### Phase 4: Intelligence Features (WEEK 7+)

**Goal**: Advanced analytics

1. **Geospatial Intelligence** (see existing plan)
2. **AI Integration** (see existing plan)
3. **Analytics Dashboard** (see existing plan)

---

## 17. QUESTIONS FOR CLARIFICATION

Before proceeding with major changes, clarify:

### Data Verification
1. ❓ Are the 67 hospital antivenom statuses **verified** or **estimated**?
2. ❓ What is the verification process for hospital data?
3. ❓ Who maintains hospital data (admin, hospitals self-report, community)?

### Real-time Requirements
4. ❓ How often should rescuer location update? (10s, 30s, 60s?)
5. ❓ Should citizens see rescuer location in real-time or only when en route?
6. ❓ What happens if rescuer goes offline during rescue?

### Workflow Clarifications
7. ❓ Can a rescue be reassigned after acceptance?
8. ❓ What happens if rescuer doesn't accept within X minutes?
9. ❓ Can citizen cancel a rescue after assignment?
10. ❓ Who can mark a rescue as complete?

### Authorization
11. ❓ Can VOLUNTEER accept rescues, or only VERIFIED_RESCUER?
12. ❓ What's the difference between VOLUNTEER and VERIFIED_RESCUER?
13. ❓ Can DISTRICT_COORDINATOR assign rescues manually?

### Mobile Strategy
14. ❓ Will there be a native mobile app (React Native) or web-only?
15. ❓ Should mobile app have offline capabilities?
16. ❓ Are push notifications required or optional?

---

## 18. FINAL RECOMMENDATIONS

### 🎯 BUILD ORDER (Follow This)

```
PHASE 0: Verify Current State (1-2 days)
  ├── Test complete workflow
  ├── Document what works
  └── Document what breaks

PHASE 1: Critical Fixes (1-2 weeks)
  ├── 1. Rescue Queue Prominence
  ├── 2. Atomic Assignment Lock
  ├── 3. Authorization Enforcement
  └── 4. Hospital Verification UX

PHASE 2: Real-time Features (2-3 weeks)
  ├── 5. GPS Tracking (GraphQL Subscriptions)
  ├── 6. Notifications (Push + In-App)
  └── 7. Rescue Timeline Display

PHASE 3: Complete Navigation (2-3 weeks)
  ├── 8. Rescue Routing (OSRM Integration)
  ├── 9. ETA Calculation
  ├── 10. Hospital Routing
  └── 11. Mobile Queue UX

PHASE 4: Intelligence Features (4-6 weeks)
  ├── 12. Geospatial Hotspots
  ├── 13. Analytics Dashboard
  ├── 14. District Statistics
  ├── 15. Historical Trends
  └── 16. AI Snake Identification

PHASE 5: Production Polish (2-3 weeks)
  ├── 17. Performance Optimization
  ├── 18. Mobile Optimization
  ├── 19. Testing (E2E)
  └── 20. Documentation
```

### ⚠️ DO NOT START WITH

1. ❌ AI Snake Identification (nice-to-have, complex)
2. ❌ Advanced Analytics (before basic workflow works)
3. ❌ Schema refactoring (would break existing functionality)
4. ❌ Rewriting map components (they work)

### ✅ START WITH

1. ✅ **Test the complete workflow end-to-end**
2. ✅ **Make rescue queue prominent**
3. ✅ **Implement atomic assignment**
4. ✅ **Verify authorization works**

---

## 19. SUCCESS CRITERIA

### ✅ MVP Production Ready (End of Phase 3)

**Citizen Can**:
- ✅ Create rescue request with location
- ✅ See request status in real-time
- ✅ See assigned rescuer details
- ✅ Track rescuer location on map
- ✅ Find nearby verified hospitals
- ✅ Receive notifications on status changes

**Rescuer Can**:
- ✅ See pending rescues in prominent queue
- ✅ Filter by distance/priority
- ✅ Accept rescue (with atomic locking)
- ✅ Navigate to incident location with ETA
- ✅ Update rescue status
- ✅ Share location with citizen
- ✅ Find nearest hospital with antivenom
- ✅ Complete rescue with outcome

**Admin Can**:
- ✅ View all rescues on map
- ✅ Monitor active rescues
- ✅ See rescuer locations
- ✅ View hospital data
- ✅ Access basic analytics
- ✅ Verify hospital information
- ✅ Manage user accounts

**System Provides**:
- ✅ Real-time updates (subscriptions)
- ✅ Atomic assignment (no conflicts)
- ✅ GPS tracking (rescuer → citizen)
- ✅ Route calculation (OSRM)
- ✅ ETA display
- ✅ Notifications (push + in-app)
- ✅ Mobile-responsive UI
- ✅ Role-based authorization

### 🌟 Full Platform Ready (End of Phase 4)

Everything above PLUS:
- ✅ Research-based hotspot visualization
- ✅ Seasonal analytics (monsoon patterns)
- ✅ District performance metrics
- ✅ Historical case analysis
- ✅ Smart hospital ranking (by accessibility)
- ✅ AI snake identification
- ✅ Coverage gap analysis

---

## 20. CONCLUSION

### Current Status: **SOLID FOUNDATION, INCOMPLETE WORKFLOW**

**Strengths**:
- ✅ Comprehensive database schema
- ✅ Well-organized GraphQL API
- ✅ Authentication & RBAC infrastructure
- ✅ Real hospital data (67 hospitals)
- ✅ Proper monorepo structure
- ✅ Research-backed geospatial intelligence models

**Critical Gaps**:
- 🚨 Rescue queue not prominent
- 🚨 Real-time tracking missing
- 🚨 Authorization enforcement unclear
- 🚨 Atomic assignment unverified
- 🚨 Mobile UX incomplete

**Recommendation**: 
**Follow the phased implementation plan**. Do NOT skip ahead to AI or analytics. Complete the core rescue workflow first. Test it. Then add intelligence features.

**Timeline**:
- **MVP Production Ready**: 6-8 weeks (Phases 0-3)
- **Full Intelligence Platform**: 12-14 weeks (Phases 0-4)

**Priority**: 
The queue is the operational heart of the system. Fix that first. Everything else depends on rescuers being able to see and accept requests efficiently.

---

## APPENDIX A: Files to Review

### Critical Backend Files
- `apps/backend/src/server.ts` - Resolver registration
- `libs/backend/modules/src/rescue/` - Rescue service implementation
- `libs/backend/core/src/` - Context & auth middleware

### Critical Frontend Files
- `apps/frontend/src/app/(dashboard)/dashboard/rescuer/page.tsx`
- `apps/frontend/src/app/(dashboard)/dashboard/rescuer/assignments/page.tsx`
- `apps/frontend/src/components/map/EmergencyMap.tsx`
- `apps/frontend/src/components/map/RescueMap.tsx`
- `apps/frontend/src/components/map/GoogleEmergencyMap.tsx`

### Database Files
- `libs/database/prisma/schema.prisma`
- `libs/database/prisma/seed-full.ts`
- `libs/database/prisma/seeds/hospitals.seed.ts`

---

**END OF AUDIT**

This audit provides the complete foundation for systematic implementation. Proceed with Phase 0 testing before making any architectural changes.
