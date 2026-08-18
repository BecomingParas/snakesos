# SNAKESOS HOSPITAL + ANTIVENOM SYSTEM — IMPLEMENTATION SUMMARY

## ✅ COMPLETED

### 1. Database Schema (Prisma)
**File:** `libs/database/prisma/schema.prisma`

**Added Models:**
- ✅ `Hospital` — Complete hospital information with location, capabilities, and antivenom status
- ✅ `HospitalVerification` — Verification audit trail
- ✅ `HospitalReport` — User-reported incorrect information

**Added Enums:**
- ✅ `AntivenomStatus` — AVAILABLE, LOW_STOCK, OUT_OF_STOCK, UNKNOWN, NOT_SUPPORTED
- ✅ `VerificationStatus` — VERIFIED, HISTORICAL, STALE, UNVERIFIED
- ✅ `HospitalStatus` — ACTIVE, INACTIVE, TEMPORARILY_CLOSED, PERMANENTLY_CLOSED

**Key Features:**
- Geospatial indexes on latitude/longitude for efficient distance queries
- Separation of snakebite treatment capability from antivenom availability
- Verification timestamp tracking with freshness calculation
- Data source tracking (EDCD, Provincial Health, Hospital Direct, Manual)
- Official treatment center designation flag

### 2. GraphQL Contracts
**Location:** `libs/contracts/src/lib/graphql/hospital/`

**Created Files:**
- ✅ `enums.graphql` — All enums (AntivenomStatus, VerificationStatus, HospitalType, etc.)
- ✅ `schema.graphql` — Complete type definitions
- ✅ `inputs.graphql` — Input types for mutations and queries
- ✅ `queries.graphql` — All queries including nearest facilities
- ✅ `mutations.graphql` — All mutations including verification
- ✅ `subscriptions.graphql` — Real-time updates
- ✅ `fragments.graphql` — Reusable fragments
- ✅ `index.ts` — Exports

**Key Queries:**
- `hospital(id)` — Get single hospital
- `hospitals(filter, location, sort)` — List with pagination
- `nearestSnakebiteFacilities(lat, lng, radius)` — Find nearby
- `nearestVerifiedAntivenomFacility(lat, lng)` — Recommended facility
- `hospitalStatistics` — Dashboard statistics
- `hospitalsNeedingVerification` — Admin workflow support

**Key Mutations:**
- `createHospital` — Add new hospital (Admin only)
- `updateHospital` — Edit hospital info (Admin only)
- `verifyAntivenomStatus` — Update antivenom status (Authorized only)
- `verifyHospitalCapability` — Complete verification (Authorized only)
- `reportHospitalInformation` — User reports (Public)
- `bulkImportHospitals` — Data import (Super Admin only)

**Key Subscriptions:**
- `hospitalUpdated` — Real-time hospital updates
- `antivenomStatusChanged` — Antivenom status changes

### 3. Frontend Components
**Location:** `apps/frontend/src/components/map/`

**Created:**
- ✅ `HospitalMap.tsx` — Interactive Leaflet map with color-coded markers

**Features:**
- Color-coded markers based on verification status:
  - 🟢 GREEN: Verified antivenom available (FRESH)
  - 🟡 YELLOW: Snakebite treatment center, status unknown/stale
  - 🔴 RED: Verified out of stock
  - ⚪ GRAY: General hospital, capability unknown
- User location with GPS accuracy circle
- Distance calculation from user to each hospital
- Interactive popups with hospital details
- Mobile-friendly bottom sheet for hospital details
- Call hospital and get directions actions
- Report incorrect information button
- Verification freshness warnings
- Filter support (snakebite treatment only, antivenom available, 24/7 emergency)

### 4. Admin Dashboard
**Location:** `apps/frontend/src/app/(dashboard)/dashboard/admin/hospitals/`

**Created:**
- ✅ `page.tsx` — Hospital management interface

**Features:**
- Hospital list with search and filters
- Statistics dashboard:
  - Total hospitals
  - Verified antivenom count
  - Needs verification count
  - Out of stock count
- Add new hospital dialog with complete form
- Verify antivenom status dialog
- Edit hospital information
- Delete hospital
- Filter by verification status
- Visual indicators for:
  - Official treatment centers (shield icon)
  - Verification freshness (color-coded icons)
  - Antivenom status (badges)

### 5. Documentation
**Created:**
- ✅ `HOSPITAL_ANTIVENOM_SYSTEM.md` — Complete system documentation (20 sections)
- ✅ `IMPLEMENTATION_SUMMARY.md` — This file

---

## 🔨 REMAINING TASKS

### Backend Implementation (REQUIRED)

#### 1. Hospital Resolvers
**Create:** `apps/backend/src/resolvers/hospital.resolver.ts`

**Implement:**
- All query resolvers (hospitals, nearestSnakebiteFacilities, etc.)
- All mutation resolvers (createHospital, verifyAntivenomStatus, etc.)
- All subscription resolvers (hospitalUpdated, antivenomStatusChanged)
- Authorization guards (check user role before mutations)
- Geospatial distance calculations
- Verification freshness logic
- Recommendation algorithm

**Example Structure:**
```typescript
@Resolver()
export class HospitalResolver {
  constructor(
    private readonly hospitalService: HospitalService,
    private readonly authService: AuthService,
  ) {}

  @Query(() => Hospital, { nullable: true })
  async hospital(@Args('id') id: string): Promise<Hospital | null> {
    return this.hospitalService.findById(id);
  }

  @Query(() => HospitalConnection)
  async hospitals(
    @Args('filter', { nullable: true }) filter?: HospitalFilterInput,
    @Args('location', { nullable: true }) location?: HospitalLocationInput,
    @Args('sort', { nullable: true }) sort?: HospitalSortInput,
    @Args('first', { nullable: true }) first?: number,
    @Args('after', { nullable: true }) after?: string,
  ): Promise<HospitalConnection> {
    return this.hospitalService.findMany({ filter, location, sort, first, after });
  }

  @Query(() => [NearestFacility])
  async nearestSnakebiteFacilities(
    @Args('latitude') latitude: number,
    @Args('longitude') longitude: number,
    @Args('radiusKm', { nullable: true }) radiusKm?: number,
    @Args('limit', { nullable: true }) limit?: number,
  ): Promise<NearestFacility[]> {
    return this.hospitalService.findNearestFacilities(
      { latitude, longitude },
      radiusKm || 50,
      limit || 10,
    );
  }

  @Mutation(() => Hospital)
  @UseGuards(AuthGuard, RoleGuard(['ADMIN', 'SUPER_ADMIN']))
  async createHospital(
    @Args('input') input: CreateHospitalInput,
    @CurrentUser() user: User,
  ): Promise<Hospital> {
    return this.hospitalService.create(input, user.id);
  }

  @Mutation(() => Hospital)
  @UseGuards(AuthGuard, RoleGuard(['ADMIN', 'SUPER_ADMIN', 'VERIFIED_HOSPITAL_STAFF']))
  async verifyAntivenomStatus(
    @Args('input') input: VerifyAntivenomInput,
    @CurrentUser() user: User,
  ): Promise<Hospital> {
    return this.hospitalService.verifyAntivenom(input, user.id);
  }
}
```

#### 2. Hospital Service
**Create:** `apps/backend/src/services/hospital.service.ts`

**Implement:**
- CRUD operations
- Geospatial distance queries (Haversine or PostGIS)
- Verification freshness calculation
- Recommendation algorithm
- Bulk import logic
- Statistics calculation

**Example:**
```typescript
@Injectable()
export class HospitalService {
  constructor(private readonly prisma: PrismaService) {}

  async findNearestFacilities(
    userLocation: { latitude: number; longitude: number },
    radiusKm: number,
    limit: number,
  ): Promise<NearestFacility[]> {
    // Get all hospitals within radius
    const hospitals = await this.prisma.hospital.findMany({
      where: {
        status: 'ACTIVE',
        snakebiteTreatmentAvailable: true,
        // Add geospatial query if using PostGIS
      },
    });

    // Calculate distances
    const withDistance = hospitals.map(hospital => ({
      hospital,
      distance: this.calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        hospital.latitude,
        hospital.longitude,
      ),
    }));

    // Filter by radius
    const inRadius = withDistance.filter(h => h.distance <= radiusKm);

    // Sort by recommendation score
    const scored = inRadius.map(h => ({
      ...h,
      score: this.calculateRecommendationScore(h.hospital, h.distance),
    }));

    scored.sort((a, b) => b.score - a.score);

    // Take top N
    return scored.slice(0, limit).map(s => ({
      hospital: s.hospital,
      distance: s.distance,
      travelTimeEstimate: this.estimateTravelTime(s.distance),
      recommendationReason: this.getRecommendationReason(s.hospital),
    }));
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private calculateRecommendationScore(hospital: Hospital, distance: number): number {
    let score = 0;

    // Distance (inverse - closer is better)
    score += Math.max(0, 100 - distance);

    // Antivenom status (critical)
    if (hospital.antivenomStatus === 'AVAILABLE' &&
        this.isVerificationFresh(hospital.antivenomLastVerifiedAt)) {
      score += 100;
    } else if (hospital.antivenomStatus === 'LOW_STOCK') {
      score += 50;
    } else if (hospital.antivenomStatus === 'UNKNOWN') {
      score += 20;
    } else if (hospital.antivenomStatus === 'OUT_OF_STOCK') {
      score -= 50;
    }

    // Other capabilities
    if (hospital.emergency24x7) score += 20;
    if (hospital.ventilatorAvailable) score += 10;
    if (hospital.officialTreatmentCenter) score += 15;
    if (hospital.verificationStatus === 'VERIFIED') score += 10;

    return score;
  }

  private isVerificationFresh(verifiedAt?: Date): boolean {
    if (!verifiedAt) return false;
    const FRESHNESS_HOURS = 24; // configurable
    const hoursSince = (Date.now() - verifiedAt.getTime()) / (1000 * 60 * 60);
    return hoursSince <= FRESHNESS_HOURS;
  }

  async verifyAntivenom(
    input: VerifyAntivenomInput,
    verifiedBy: string,
  ): Promise<Hospital> {
    const hospital = await this.prisma.hospital.update({
      where: { id: input.hospitalId },
      data: {
        antivenomStatus: input.antivenomStatus,
        antivenomStockQuantity: input.antivenomQuantity,
        antivenomLastVerifiedAt: new Date(),
        antivenomVerifiedBy: verifiedBy,
        verificationStatus: 'VERIFIED',
      },
    });

    // Create verification record
    await this.prisma.hospitalVerification.create({
      data: {
        hospitalId: input.hospitalId,
        verifiedBy,
        verificationType: input.verificationType,
        antivenomStatus: input.antivenomStatus,
        antivenomQuantity: input.antivenomQuantity,
        notes: input.notes,
        evidenceUrls: input.evidenceUrls || [],
        contactPerson: input.contactPerson,
        contactDesignation: input.contactDesignation,
        contactPhone: input.contactPhone,
      },
    });

    return hospital;
  }
}
```

#### 3. Authorization Middleware
**Create:** `apps/backend/src/guards/verifier.guard.ts`

**Implement:**
```typescript
@Injectable()
export class VerifierGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Not authenticated');
    }

    const allowedRoles = ['SUPER_ADMIN', 'ADMIN', 'VERIFIED_HOSPITAL_STAFF'];
    if (!allowedRoles.includes(user.role)) {
      throw new ForbiddenException(
        'Only authorized verifiers can update antivenom status',
      );
    }

    return true;
  }
}
```

#### 4. Database Migration
```bash
# Generate Prisma client
npx prisma generate --schema libs/database/prisma/schema.prisma

# Create migration
npx prisma migrate dev --name add_hospital_antivenom_system --schema libs/database/prisma/schema.prisma

# Or if drift exists, resolve manually first
```

---

### Frontend Integration (REQUIRED)

#### 1. GraphQL Hooks
**Create:** `apps/frontend/src/lib/graphql/hooks/hospital.hooks.ts`

**Implement:**
```typescript
export function useHospitals(variables: HospitalsQueryVariables) {
  return useQuery(HOSPITALS_QUERY, { variables });
}

export function useNearestFacilities(variables: NearestFacilitiesQueryVariables) {
  return useQuery(NEAREST_FACILITIES_QUERY, { variables });
}

export function useCreateHospital() {
  return useMutation(CREATE_HOSPITAL_MUTATION);
}

export function useVerifyAntivenom() {
  return useMutation(VERIFY_ANTIVENOM_MUTATION);
}

export function useReportHospital() {
  return useMutation(REPORT_HOSPITAL_MUTATION);
}

export function useHospitalUpdates(hospitalId?: string) {
  return useSubscription(HOSPITAL_UPDATED_SUBSCRIPTION, {
    variables: { hospitalId },
  });
}
```

#### 2. GraphQL Queries
**Create:** `apps/frontend/src/lib/graphql/queries/hospital.queries.ts`

**Implement:**
```typescript
export const HOSPITALS_QUERY = gql`
  query Hospitals(
    $filter: HospitalFilterInput
    $location: HospitalLocationInput
    $first: Int
    $after: String
  ) {
    hospitals(filter: $filter, location: $location, first: $first, after: $after) {
      edges {
        node {
          ...HospitalMapMarker
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
  ${HOSPITAL_MAP_MARKER_FRAGMENT}
`;

export const NEAREST_FACILITIES_QUERY = gql`
  query NearestSnakebiteFacilities(
    $latitude: Float!
    $longitude: Float!
    $radiusKm: Float
    $limit: Int
  ) {
    nearestSnakebiteFacilities(
      latitude: $latitude
      longitude: $longitude
      radiusKm: $radiusKm
      limit: $limit
    ) {
      ...NearestFacilityInfo
    }
  }
  ${NEAREST_FACILITY_INFO_FRAGMENT}
`;
```

#### 3. GraphQL Mutations
**Create:** `apps/frontend/src/lib/graphql/mutations/hospital.mutations.ts`

**Implement:**
```typescript
export const VERIFY_ANTIVENOM_MUTATION = gql`
  mutation VerifyAntivenom($input: VerifyAntivenomInput!) {
    verifyAntivenomStatus(input: $input) {
      ...HospitalFull
    }
  }
  ${HOSPITAL_FULL_FRAGMENT}
`;

export const REPORT_HOSPITAL_MUTATION = gql`
  mutation ReportHospital($input: CreateHospitalReportInput!) {
    reportHospitalInformation(input: $input) {
      id
      reportType
      description
      status
    }
  }
`;
```

#### 4. Page Integration
**Update:** `apps/frontend/src/app/(dashboard)/dashboard/admin/hospitals/page.tsx`

Replace mock data with actual GraphQL queries:
```typescript
const { data, loading, error } = useHospitals({
  filter: {
    snakebiteTreatmentOnly: filters.snakebiteTreatmentOnly,
  },
  first: 50,
});

const [verifyAntivenom] = useVerifyAntivenom();
const [reportHospital] = useReportHospital();
```

#### 5. Map Page Integration
**Create:** `apps/frontend/src/app/(dashboard)/dashboard/citizen/hospitals/page.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { HospitalMap } from '@/components/map/HospitalMap';
import { useNearestFacilities } from '@/lib/graphql/hooks/hospital.hooks';

export default function HospitalsMapPage() {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error('Geolocation error:', error);
      }
    );
  }, []);

  const { data, loading, error } = useNearestFacilities({
    latitude: userLocation?.latitude || 27.7172,
    longitude: userLocation?.longitude || 85.324,
    radiusKm: 50,
    limit: 20,
  });

  if (loading) return <div>Loading hospitals...</div>;
  if (error) return <div>Error loading hospitals</div>;

  const hospitals = data?.nearestSnakebiteFacilities.map(f => ({
    ...f.hospital,
    distance: f.distance,
  })) || [];

  return (
    <div className="h-screen">
      <HospitalMap
        hospitals={hospitals}
        userLocation={userLocation}
        center={userLocation ? [userLocation.latitude, userLocation.longitude] : [27.7172, 85.324]}
        zoom={13}
      />
    </div>
  );
}
```

---

### Data Seeding (OPTIONAL BUT RECOMMENDED)

#### 1. Hospital Seed Data
**Create:** `libs/database/prisma/seeds/hospitals.seed.ts`

**Implement:**
```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// EDCD Official Treatment Centers (from EDCD/DoHS data)
const edcdHospitals = [
  {
    name: 'Bharatpur Hospital',
    address: 'Bharatpur-10, Chitwan',
    municipality: 'Bharatpur',
    district: 'Chitwan',
    province: 'Bagmati',
    latitude: 27.6831,
    longitude: 84.4342,
    phone: '056-521777',
    emergencyPhone: '056-521777',
    snakebiteTreatmentAvailable: true,
    emergency24x7: true,
    antivenomStatus: 'UNKNOWN',
    source: 'EDCD',
    sourceYear: '2078/79',
    officialTreatmentCenter: true,
    verificationStatus: 'HISTORICAL',
    hospitalType: 'GOVERNMENT',
    status: 'ACTIVE',
  },
  // Add remaining 87 hospitals from EDCD/Provincial Health data
];

async function seedHospitals() {
  console.log('Seeding hospitals...');

  for (const hospital of edcdHospitals) {
    await prisma.hospital.upsert({
      where: { 
        // Assuming we add a unique constraint on name + district
        name_district: {
          name: hospital.name,
          district: hospital.district,
        },
      },
      update: {},
      create: hospital,
    });
  }

  console.log(`Seeded ${edcdHospitals.length} hospitals`);
}

seedHospitals()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

**Run:**
```bash
npx ts-node libs/database/prisma/seeds/hospitals.seed.ts
```

---

## 📊 VERIFICATION WORKFLOW

### For Admins
1. Log in to admin dashboard
2. Navigate to Hospitals page
3. Filter "Needs Verification"
4. Click "Verify" button on hospital row
5. Select:
   - Antivenom status (AVAILABLE/LOW_STOCK/OUT_OF_STOCK/UNKNOWN)
   - Verification method (PHONE_CALL/SITE_VISIT/OFFICIAL_DOCUMENT)
   - Contact person details
   - Notes and evidence
6. Submit verification
7. System records:
   - Timestamp
   - Verifier ID
   - Verification record
8. Map updates automatically

### For Public Users
1. View hospital map
2. Click hospital marker
3. View hospital details
4. If information is incorrect:
   - Click "Report Incorrect Information"
   - Select report type
   - Describe issue
   - Submit report
5. Admin reviews and resolves report

---

## 🚨 CRITICAL SAFETY REMINDERS

### ⚠️ NEVER FAKE MEDICAL DATA
- ❌ Do NOT hardcode antivenom availability
- ❌ Do NOT assume hospital = antivenom
- ❌ Do NOT show "Available" for UNKNOWN status
- ✅ ALWAYS show verification timestamp
- ✅ ALWAYS warn on stale data

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

## 📝 TESTING CHECKLIST

### Database
- [ ] Prisma migration applied successfully
- [ ] All indexes created
- [ ] Foreign key constraints working
- [ ] Enum values accessible

### GraphQL
- [ ] All queries return data
- [ ] All mutations execute successfully
- [ ] Authorization guards working
- [ ] Subscriptions receive updates

### Frontend
- [ ] Map renders hospitals correctly
- [ ] Markers have correct colors
- [ ] User location displays
- [ ] Distance calculation accurate
- [ ] Hospital detail sheet works
- [ ] Call/Directions buttons work
- [ ] Admin page loads
- [ ] Verification dialog works
- [ ] Add hospital dialog works

### Integration
- [ ] Real-time updates work
- [ ] Filters work correctly
- [ ] Search works
- [ ] Pagination works
- [ ] Mobile responsive
- [ ] No console errors

---

## 🎯 NEXT STEPS

1. **Implement backend resolvers and services**
2. **Create database migration**
3. **Implement frontend GraphQL hooks**
4. **Connect components to real data**
5. **Seed initial hospital data**
6. **Test complete workflow**
7. **Train admin staff on verification**
8. **Deploy to staging**
9. **User acceptance testing**
10. **Deploy to production**

---

## 📚 DOCUMENTATION

- Main Documentation: `HOSPITAL_ANTIVENOM_SYSTEM.md`
- This Summary: `IMPLEMENTATION_SUMMARY.md`
- Prisma Schema: `libs/database/prisma/schema.prisma`
- GraphQL Schema: `libs/contracts/src/lib/graphql/hospital/`

---

**Status:** Frontend and Database Schema Complete  
**Progress:** ~60% Implementation Complete  
**Remaining:** Backend resolvers, services, and integration  
**Next:** Implement HospitalResolver and HospitalService
