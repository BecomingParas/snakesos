# SNAKESOS — HOSPITAL + ANTIVENOM VERIFICATION SYSTEM
## Implementation Documentation

**Status:** ✅ Database Schema, GraphQL Contracts, and Frontend Components Implemented  
**Date:** August 17, 2026  
**Critical Safety Feature:** This system distinguishes between hospital location, snakebite treatment capability, and VERIFIED antivenom availability.

---

## ⚠️ MEDICAL SAFETY PRINCIPLE

**NEVER display "Antivenom Available" unless verified.**

This system implements a strict separation:
- **Hospital exists** ≠ **Hospital treats snakebite** ≠ **Antivenom available right now**

---

## 1. ARCHITECTURE OVERVIEW

### Data Flow
```
User GPS Location
    ↓
GraphQL Query (with location)
    ↓
Hospital Database (PostgreSQL + PostGIS)
    ↓
Distance Calculation + Verification Check
    ↓
Leaflet Map Rendering
    ↓
Color-Coded Markers
    ↓
Hospital Detail Sheet
    ↓
Call / Directions Actions
```

### Map Marker System

🟢 **GREEN** — Verified antivenom available (FRESH verification)
- `antivenomStatus === 'AVAILABLE'`
- `antivenomVerificationFreshness === 'FRESH'`
- Last verified within freshness period (default: 24 hours)

🟡 **YELLOW** — Snakebite treatment center, antivenom status unknown/stale
- `snakebiteTreatmentAvailable === true`
- `antivenomStatus === 'UNKNOWN'` OR `'LOW_STOCK'` OR verification is STALE

🔴 **RED** — Verified out of stock
- `antivenomStatus === 'OUT_OF_STOCK'`
- Verified within recent period

⚪ **GRAY** — General hospital, snakebite capability unknown/not supported
- `snakebiteTreatmentAvailable === false` OR `antivenomStatus === 'NOT_SUPPORTED'`

---

## 2. DATABASE SCHEMA

### Hospital Model
```prisma
model Hospital {
  id                          String             @id @default(uuid())
  
  // Basic Information
  name                        String
  address                     String
  municipality                String
  district                    String
  province                    String
  
  // Location (Required for mapping)
  latitude                    Float
  longitude                   Float
  
  // Emergency Capabilities
  emergencyAvailable          Boolean            @default(false)
  emergency24x7               Boolean            @default(false)
  
  // Snakebite Treatment Capability
  snakebiteTreatmentAvailable Boolean            @default(false)
  treatmentCenterType         String?
  
  // Antivenom Status (CRITICAL)
  antivenomStatus             AntivenomStatus    @default(UNKNOWN)
  antivenomLastVerifiedAt     DateTime?
  antivenomVerifiedBy         String?
  antivenomStockQuantity      Int?
  
  // Additional Capabilities
  ventilatorAvailable         Boolean            @default(false)
  icuAvailable                Boolean            @default(false)
  
  // Data Source & Verification
  source                      String?
  sourceYear                  String?
  verificationStatus          VerificationStatus @default(UNVERIFIED)
  officialTreatmentCenter     Boolean            @default(false)
  
  // Status
  status                      HospitalStatus     @default(ACTIVE)
  
  // Relations
  verificationRecords         HospitalVerification[]
  reports                     HospitalReport[]
  
  @@index([latitude, longitude])
  @@index([snakebiteTreatmentAvailable])
  @@index([antivenomStatus])
  @@index([antivenomLastVerifiedAt])
}

enum AntivenomStatus {
  AVAILABLE              // Verified in stock
  LOW_STOCK              // Low but available
  OUT_OF_STOCK           // Verified out of stock
  UNKNOWN                // Not verified / no data
  NOT_SUPPORTED          // Hospital doesn't provide antivenom
}

enum VerificationStatus {
  VERIFIED               // Recently verified
  HISTORICAL             // Based on old data (needs re-verification)
  STALE                  // Verification expired
  UNVERIFIED             // No verification yet
}
```

### Hospital Verification Model
```prisma
model HospitalVerification {
  id                      String    @id @default(uuid())
  
  hospitalId              String
  hospital                Hospital  @relation(fields: [hospitalId], references: [id])
  
  // Verification Details
  verifiedBy              String    // User ID
  verificationType        String    // PHONE_CALL, SITE_VISIT, OFFICIAL_DOCUMENT, etc.
  
  // What was verified
  snakebiteTreatment      Boolean?
  antivenomStatus         AntivenomStatus?
  antivenomQuantity       Int?
  emergencyStatus         Boolean?
  ventilatorStatus        Boolean?
  
  // Evidence
  notes                   String?   @db.Text
  evidenceUrls            String[]
  officialDocumentUrl     String?
  
  // Source Information
  contactPerson           String?
  contactDesignation      String?
  contactPhone            String?
  
  verificationDate        DateTime  @default(now())
  nextVerificationDue     DateTime?
}
```

---

## 3. GRAPHQL API

### Key Queries

#### Get Nearest Snakebite Facilities
```graphql
query NearestSnakebiteFacilities($lat: Float!, $lng: Float!) {
  nearestSnakebiteFacilities(
    latitude: $lat
    longitude: $lng
    radiusKm: 50
    limit: 10
  ) {
    hospital {
      ...HospitalFull
    }
    distance
    travelTimeEstimate
    recommendationReason
  }
}
```

#### Get Nearest Verified Antivenom Facility
```graphql
query NearestVerifiedAntivenom($lat: Float!, $lng: Float!) {
  nearestVerifiedAntivenomFacility(
    latitude: $lat
    longitude: $lng
    maxRadiusKm: 100
  ) {
    hospital {
      ...HospitalFull
    }
    distance
    travelTimeEstimate
    recommendationReason
  }
}
```

#### List Hospitals with Filters
```graphql
query Hospitals($filter: HospitalFilterInput, $location: HospitalLocationInput) {
  hospitals(
    filter: $filter
    location: $location
    first: 20
  ) {
    edges {
      node {
        ...HospitalMapMarker
      }
    }
    totalCount
  }
}
```

### Key Mutations

#### Verify Antivenom Status (Authorized Only)
```graphql
mutation VerifyAntivenom($input: VerifyAntivenomInput!) {
  verifyAntivenomStatus(input: $input) {
    id
    antivenomStatus
    antivenomLastVerifiedAt
    antivenomVerificationFreshness
  }
}
```

#### Report Incorrect Information (Public)
```graphql
mutation ReportHospital($input: CreateHospitalReportInput!) {
  reportHospitalInformation(input: $input) {
    id
    reportType
    description
    status
  }
}
```

---

## 4. FRONTEND COMPONENTS

### HospitalMap Component
**Location:** `apps/frontend/src/components/map/HospitalMap.tsx`

**Features:**
- Interactive Leaflet map with OpenStreetMap tiles
- Color-coded hospital markers based on verification status
- User location with GPS accuracy circle
- Hospital detail popup on marker click
- Mobile-friendly bottom sheet for hospital details
- Call hospital and get directions actions
- Report incorrect information option

**Usage:**
```tsx
import { HospitalMap } from '@/components/map/HospitalMap';

<HospitalMap
  hospitals={hospitalsWithDistance}
  userLocation={userLocation}
  center={[27.7172, 85.324]}
  zoom={13}
  selectedHospitalId={selectedId}
  onHospitalClick={(id) => console.log('Selected:', id)}
  filters={{
    snakebiteTreatmentOnly: true,
    antivenomAvailable: false,
  }}
/>
```

### Hospital Management Page (Admin)
**Location:** `apps/frontend/src/app/(dashboard)/dashboard/admin/hospitals/page.tsx`

**Features:**
- Hospital list with search and filters
- Add new hospital dialog
- Verify antivenom status dialog
- Edit hospital information
- View verification history
- Statistics dashboard
- Stale verification warnings

---

## 5. VERIFICATION WORKFLOW

### Admin/Verifier Workflow
```
1. Admin views hospital list
2. Identifies hospitals needing verification (STALE/UNVERIFIED)
3. Contacts hospital (phone/visit/document)
4. Records verification:
   - Antivenom status (AVAILABLE/LOW_STOCK/OUT_OF_STOCK/UNKNOWN)
   - Verification method (PHONE_CALL/SITE_VISIT/OFFICIAL_DOCUMENT)
   - Contact person details
   - Evidence (photos/documents)
   - Notes
5. System records:
   - Verification timestamp
   - Verifier ID
   - Next verification due date
6. Map updates automatically with fresh data
```

### Verification Freshness Rules
```
FRESH:       Verified within 24 hours (configurable)
STALE:       Verified 24 hours - 30 days ago
VERY_OLD:    Verified 30+ days ago
NEVER:       No verification record
```

**Configuration:**
```env
ANTIVENOM_VERIFICATION_MAX_AGE=24  # hours
```

### Authorization

**Only these roles can update antivenom status:**
- `SUPER_ADMIN`
- `ADMIN`
- `VERIFIED_HOSPITAL_STAFF` (for their own hospital only)

**Authorization check:**
```typescript
if (!['SUPER_ADMIN', 'ADMIN', 'VERIFIED_HOSPITAL_STAFF'].includes(user.role)) {
  throw new Error('Unauthorized: Only authorized verifiers can update antivenom status');
}
```

---

## 6. DATA SOURCES

### Official Sources (Prioritized)

1. **EDCD (Epidemiology and Disease Control Division)**
   - National snakebite guidelines
   - Treatment center standards
   - Official treatment center list
   - Source: https://edcd.gov.np/

2. **Provincial Health Directorates**
   - Koshi Province
   - Madhesh Province
   - Bagmati Province
   - Gandaki Province
   - Lumbini Province
   - Karnali Province
   - Sudurpaschim Province

3. **DoHS Annual Reports**
   - Historical treatment center data
   - ASVS (Anti-Snake Venom Serum) procurement records
   - District-level health statistics

4. **Hospital Direct Verification**
   - Phone verification with hospital staff
   - Site visits by authorized personnel
   - Official hospital reports/documents

### Data Source Field
```typescript
{
  source: "EDCD" | "Provincial_Health" | "Hospital_Direct" | "Manual",
  sourceYear: "2078/79" | "2024",
  sourceUrl: "https://edcd.gov.np/...",
  verificationStatus: "VERIFIED" | "HISTORICAL" | "STALE" | "UNVERIFIED",
  officialTreatmentCenter: true | false
}
```

---

## 7. DISTANCE CALCULATION & ROUTING

### Distance Calculation
Uses Haversine formula for accurate GPS distance:

```typescript
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}
```

### Nearest Hospital Recommendation Algorithm
```typescript
function recommendHospital(hospitals: Hospital[], userLocation: Location): Hospital {
  // Score each hospital
  const scored = hospitals.map(hospital => {
    let score = 0;
    
    // Distance (inverse - closer is better)
    const distance = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      hospital.latitude,
      hospital.longitude
    );
    score += Math.max(0, 100 - distance);
    
    // Antivenom status (critical)
    if (hospital.antivenomStatus === 'AVAILABLE' && 
        hospital.antivenomVerificationFreshness === 'FRESH') {
      score += 100; // Strong preference for verified antivenom
    } else if (hospital.antivenomStatus === 'LOW_STOCK') {
      score += 50;
    } else if (hospital.antivenomStatus === 'UNKNOWN') {
      score += 20; // Still better than nothing
    } else if (hospital.antivenomStatus === 'OUT_OF_STOCK') {
      score -= 50; // Penalize
    }
    
    // Snakebite treatment
    if (hospital.snakebiteTreatmentAvailable) {
      score += 30;
    }
    
    // Emergency capability
    if (hospital.emergency24x7) {
      score += 20;
    }
    
    // Ventilator
    if (hospital.ventilatorAvailable) {
      score += 10;
    }
    
    // Official treatment center
    if (hospital.officialTreatmentCenter) {
      score += 15;
    }
    
    // Data freshness
    if (hospital.verificationStatus === 'VERIFIED') {
      score += 10;
    }
    
    return { hospital, score, distance };
  });
  
  // Sort by score (highest first)
  scored.sort((a, b) => b.score - a.score);
  
  return scored[0].hospital;
}
```

---

## 8. MAP LAYERS ARCHITECTURE

### Layer System
```typescript
Layer 1: User location (blue marker with pulse)
Layer 2: Hospital markers (color-coded by status)
Layer 3: Rescue locations (snake icon)
Layer 4: Rescuer live positions (rescuer icon)
Layer 5: Rescue route/polyline (blue line)
Layer 6: Emergency incident location (red pin)
```

### Independent Layer Toggling
```typescript
const [layersVisible, setLayersVisible] = useState({
  userLocation: true,
  hospitals: true,
  rescues: true,
  rescuers: true,
  routes: true,
  incidents: true,
});
```

**Map must support:**
- Independent layer visibility toggles
- Separate hospital map vs rescue tracking map
- No mixing of hospital availability with rescuer tracking logic

---

## 9. REAL-TIME UPDATES

### GraphQL Subscriptions
```graphql
subscription HospitalUpdated($hospitalId: ID) {
  hospitalUpdated(hospitalId: $hospitalId) {
    id
    antivenomStatus
    antivenomLastVerifiedAt
    antivenomVerificationFreshness
  }
}

subscription AntivenomStatusChanged($province: String) {
  antivenomStatusChanged(province: $province) {
    hospital {
      id
      name
    }
    previousStatus
    newStatus
    verifiedAt
    verifiedBy
  }
}
```

### Implementation
```typescript
const { data } = useSubscription(HOSPITAL_UPDATED_SUBSCRIPTION, {
  variables: { hospitalId: null }, // null = all hospitals
});

useEffect(() => {
  if (data?.hospitalUpdated) {
    // Update hospital marker without full refetch
    updateHospitalMarker(data.hospitalUpdated);
  }
}, [data]);
```

---

## 10. MOBILE UI CONSIDERATIONS

### Responsive Breakpoints
```css
320px:  Small mobile
375px:  iPhone SE
390px:  iPhone 12/13/14
412px:  Android standard
768px:  iPad portrait
1024px: iPad landscape
1280px: Desktop
1440px: Large desktop
```

### Mobile-First Design

**Map View:**
- Full-screen map on mobile
- Tappable markers (larger touch targets)
- Bottom sheet for hospital details
- Sticky "Call" and "Directions" buttons

**Desktop View:**
- Map + side panel layout
- Hover effects on markers
- Detailed information panel
- Multi-column layout

---

## 11. PERFORMANCE OPTIMIZATION

### Viewport-Based Querying
```graphql
query HospitalsInViewport($bounds: BoundsInput!) {
  hospitals(
    location: {
      latitude: $bounds.centerLat
      longitude: $bounds.centerLng
      radiusKm: $bounds.radiusKm
    }
  ) {
    edges {
      node {
        ...HospitalMapMarker
      }
    }
  }
}
```

### Marker Clustering
```typescript
import MarkerClusterGroup from 'react-leaflet-cluster';

<MarkerClusterGroup>
  {hospitals.map(hospital => (
    <Marker key={hospital.id} position={[hospital.latitude, hospital.longitude]} />
  ))}
</MarkerClusterGroup>
```

### Debounced Map Movement
```typescript
const debouncedFetchHospitals = useMemo(
  () => debounce((bounds) => {
    fetchHospitals({ variables: { bounds } });
  }, 500),
  [fetchHospitals]
);
```

---

## 12. TESTING STRATEGY

### Unit Tests
- Distance calculation accuracy
- Marker color logic
- Verification freshness calculation
- Hospital recommendation algorithm

### Integration Tests
- GraphQL query/mutation execution
- Authorization checks
- Database constraint validation

### E2E Tests
- Map rendering
- Marker interaction
- Hospital detail sheet
- Verification workflow
- Report submission

---

## 13. DATA MIGRATION & SEEDING

### Initial Data Import
```typescript
// Seed script: libs/database/prisma/seed-hospitals.ts

const edcdHospitals = [
  {
    name: 'Bharatpur Hospital',
    latitude: 27.6831,
    longitude: 84.4342,
    district: 'Chitwan',
    province: 'Bagmati',
    snakebiteTreatmentAvailable: true,
    antivenomStatus: 'UNKNOWN',
    source: 'EDCD',
    sourceYear: '2078/79',
    officialTreatmentCenter: true,
    verificationStatus: 'HISTORICAL',
  },
  // ... 87 more hospitals
];

await prisma.hospital.createMany({
  data: edcdHospitals,
  skipDuplicates: true,
});
```

### Bulk Import Command
```bash
npm run db:seed:hospitals
```

---

## 14. SECURITY & PRIVACY

### Data Access Control
- Public: Read hospital locations and verified antivenom status
- Authenticated: Report incorrect information
- Admin: Update hospital information
- Authorized Verifier: Verify antivenom status
- Super Admin: Bulk import, delete hospitals

### PII Protection
- Hospital phone numbers: Public (for emergency use)
- Verification records: Admin only
- Internal notes: Admin only
- User GPS location: Never stored permanently (session only)

### API Rate Limiting
```typescript
// Prevent abuse of hospital queries
rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
});
```

---

## 15. DEPLOYMENT CHECKLIST

### Database
- [ ] Run Prisma migration: `npx prisma migrate deploy`
- [ ] Seed initial hospital data
- [ ] Create indexes on lat/lng columns
- [ ] Set up PostGIS extension (if using geospatial queries)

### Backend
- [ ] Deploy GraphQL resolvers
- [ ] Configure authorization middleware
- [ ] Set up subscriptions (WebSocket)
- [ ] Configure CORS for map tiles

### Frontend
- [ ] Build hospital map component
- [ ] Deploy admin hospital management page
- [ ] Configure Leaflet CDN
- [ ] Test responsive design (mobile/desktop)

### Verification
- [ ] Create admin accounts with verifier role
- [ ] Document verification workflow
- [ ] Train admin staff on verification process
- [ ] Set up verification notification system

### Monitoring
- [ ] Log verification actions
- [ ] Monitor stale verification count
- [ ] Track hospital report submissions
- [ ] Alert on antivenom out-of-stock status

---

## 16. FUTURE ENHANCEMENTS

### Phase 2
- [ ] SMS alerts for antivenom stock changes
- [ ] Automated verification reminders
- [ ] Hospital staff self-service portal
- [ ] Integration with national health database

### Phase 3
- [ ] Mobile app with offline map
- [ ] Real-time antivenom stock tracking
- [ ] Predictive stock shortage alerts
- [ ] Inter-hospital antivenom transfer coordination

### Phase 4
- [ ] AI-powered verification confidence scoring
- [ ] Crowdsourced verification (with admin approval)
- [ ] Public API for third-party integrations
- [ ] Open data portal for researchers

---

## 17. FILES CREATED

### Database
- `libs/database/prisma/schema.prisma` (modified)

### GraphQL Contracts
- `libs/contracts/src/lib/graphql/hospital/enums.graphql`
- `libs/contracts/src/lib/graphql/hospital/schema.graphql`
- `libs/contracts/src/lib/graphql/hospital/inputs.graphql`
- `libs/contracts/src/lib/graphql/hospital/queries.graphql`
- `libs/contracts/src/lib/graphql/hospital/mutations.graphql`
- `libs/contracts/src/lib/graphql/hospital/subscriptions.graphql`
- `libs/contracts/src/lib/graphql/hospital/fragments.graphql`
- `libs/contracts/src/lib/graphql/hospital/index.ts`

### Frontend Components
- `apps/frontend/src/components/map/HospitalMap.tsx`
- `apps/frontend/src/app/(dashboard)/dashboard/admin/hospitals/page.tsx`

### Documentation
- `HOSPITAL_ANTIVENOM_SYSTEM.md` (this file)

---

## 18. REMAINING IMPLEMENTATION TASKS

### Backend (Required)
1. **Hospital GraphQL Resolvers**
   - Create `apps/backend/src/resolvers/hospital.resolver.ts`
   - Implement all queries (hospitals, nearestSnakebiteFacilities, etc.)
   - Implement all mutations (createHospital, verifyAntivenomStatus, etc.)
   - Implement subscriptions (hospitalUpdated, antivenomStatusChanged)

2. **Hospital Service**
   - Create `apps/backend/src/services/hospital.service.ts`
   - Implement geospatial distance queries
   - Implement verification freshness logic
   - Implement recommendation algorithm

3. **Authorization Middleware**
   - Implement verifier role checks
   - Protect mutations with proper guards

4. **Database Migration**
   - Generate Prisma migration
   - Apply to development database
   - Test on staging

### Frontend (Required)
1. **GraphQL Hooks**
   - Create `apps/frontend/src/lib/graphql/hooks/hospital.hooks.ts`
   - Implement useHospitals, useNearestFacilities, useVerifyAntivenom

2. **Hospital Queries**
   - Create `apps/frontend/src/lib/graphql/queries/hospital.queries.ts`
   - Add all query definitions

3. **Hospital Mutations**
   - Create `apps/frontend/src/lib/graphql/mutations/hospital.mutations.ts`
   - Add all mutation definitions

4. **Integration**
   - Connect HospitalMap to real GraphQL data
   - Connect admin page to real mutations
   - Implement report dialog
   - Add geolocation permissions handling

### Data (Required)
1. **Seed Hospital Data**
   - Create `libs/database/prisma/seeds/hospitals.seed.ts`
   - Add EDCD official treatment centers (88 hospitals)
   - Add provincial health directorate data
   - Mark historical data appropriately

2. **Verification Records**
   - Set up initial verification workflow
   - Train admin staff

---

## 19. CRITICAL REMINDERS

### ⚠️ NEVER FAKE MEDICAL DATA
- Do NOT hardcode antivenom availability
- Do NOT assume hospital = antivenom
- Do NOT show "Available" for UNKNOWN status
- ALWAYS show verification timestamp
- ALWAYS warn on stale data

### ✅ ALWAYS VERIFY
- Every antivenom status requires verification record
- Every verification has timestamp + verifier ID
- Every update triggers audit log
- Every stale record shows warning

### 🚨 SAFETY FIRST
- Distance alone does NOT determine recommendation
- Verified antivenom > closer distance
- Show all warnings clearly
- Make "Call Hospital" prominent
- Provide directions to verified facilities

---

## 20. CONTACT & SUPPORT

For implementation questions or medical data verification:
- System Admin: [admin@snakesos.com]
- Medical Verification: EDCD Nepal
- Technical Support: [dev@snakesos.com]

---

**Document Version:** 1.0  
**Last Updated:** August 17, 2026  
**Status:** Database & Frontend Components Complete, Backend Implementation Pending
