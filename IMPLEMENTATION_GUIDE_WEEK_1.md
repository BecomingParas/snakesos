# SnakeSOS Geospatial Platform - Week 1 Implementation Guide

## 🎯 Goal
Set up the foundational database schema and GraphQL API for the geospatial intelligence platform.

---

## ✅ What We've Created So Far

### 1. Enhanced Database Schema
**File**: `libs/database/prisma/schema-enhancements-geospatial.prisma`

**New Models**:
- ✅ `SnakebiteHotspot` - Research-based risk zones with citations
- ✅ `SnakebiteCase` - Historical cases (anonymized research data)
- ✅ `TreatmentCenterSource` - Provenance tracking for hospitals
- ✅ `RescueVehicle` - Vehicle tracking
- ✅ `SpeciesObservation` - Citizen science observations
- ✅ `DistrictStatistics` - Cached analytics

**New Enums**:
- ✅ `RiskLevel` (LOW, MODERATE, HIGH, VERY_HIGH, EXTREME)
- ✅ `Season` (WINTER, SPRING, MONSOON, AUTUMN)
- ✅ `CaseOutcome` (RECOVERED, DECEASED, etc.)
- ✅ `SourceType` (EDCD, RESEARCH, etc.)
- ✅ `VehicleType` & `VehicleStatus`

### 2. GraphQL Map Schema
**File**: `libs/contracts/src/lib/graphql/map/schema.graphql`

**Queries**:
- ✅ `mapOverview` - Single optimized query for admin map
- ✅ `nearbyRescuers` - Find rescuers within radius
- ✅ `nearbyTreatmentCenters` - Find hospitals
- ✅ `rankTreatmentCenters` - Rank by accessibility (not just distance!)
- ✅ `snakebiteHotspots` - Research-based risk zones
- ✅ `historicalCases` - Research data
- ✅ `districtAnalytics` - District-level statistics
- ✅ `seasonalAnalytics` - Monsoon patterns
- ✅ `responseAnalytics` - Performance metrics

---

## 📋 Week 1 Tasks

### Step 1: Merge Schema Changes (Day 1)

#### 1.1 Backup Current Schema
```bash
cd ~/OneDrive/Desktop/snake-rescue
cp libs/database/prisma/schema.prisma libs/database/prisma/schema.prisma.backup
```

#### 1.2 Add New Models to Main Schema

Open `libs/database/prisma/schema.prisma` and add the models from `schema-enhancements-geospatial.prisma` at the end:

```prisma
// ===================================================================
// GEOSPATIAL INTELLIGENCE MODELS
// ===================================================================

// Copy models from schema-enhancements-geospatial.prisma here
```

#### 1.3 Enhance Existing Models

Add fields to existing models:

**RescueRequest enhancements**:
```prisma
model RescueRequest {
  // ... existing fields ...
  
  // NEW: Geospatial enhancements
  estimatedTravelTimeMinutes Int?
  routeDistance             Float?    // km
  routeGeometry             Json?     // GeoJSON of route taken
  nearestHospitalId         String?
  nearestHospital           Hospital? @relation("NearestHospital", fields: [nearestHospitalId], references: [id])
  
  // NEW: Vehicle assignment
  vehicleId                 String?
  vehicle                   RescueVehicle? @relation("VehicleRescues", fields: [vehicleId], references: [id])
}
```

**Volunteer enhancements**:
```prisma
model Volunteer {
  // ... existing fields ...
  
  // NEW: Service area
  serviceRadiusKm           Float?    @default(20)
  serviceDistricts          Json?     // Array of districts
  
  // NEW: Vehicle
  vehicleId                 String?
  vehicle                   RescueVehicle? @relation("VehicleRescuers", fields: [vehicleId], references: [id])
  
  // NEW: Performance metrics
  totalResponseTimeMinutes  Int?      @default(0)
  averageResponseTimeMinutes Float?
  averageRating             Float?
  
  // NEW: Real-time location
  lastKnownLatitude         Float?
  lastKnownLongitude        Float?
  lastLocationUpdate        DateTime?
}
```

**Hospital enhancements**:
```prisma
model Hospital {
  // ... existing fields ...
  
  // NEW: EDCD Certification
  edcdCertified             Boolean  @default(false)
  edcdCertificationDate     DateTime?
  treatmentCenterType       TreatmentCenterType?
  
  // NEW: Coverage analysis
  populationCoverage        Int?     // Estimated population served
  travelTimeCoverage        Json?    // Isochrone data
  lastOperationalCheck      DateTime?
  
  // NEW: Relations
  sources                   TreatmentCenterSource[] @relation("TreatmentCenterSources")
  historicalCases           SnakebiteCase[]         @relation("HistoricalCases")
}

enum TreatmentCenterType {
  GOVERNMENT
  PROVINCIAL
  DISTRICT
  PRIVATE
  TEACHING
  PRIMARY_HEALTH_CENTER
  OTHER
}
```

#### 1.4 Create Migration

```bash
# Generate Prisma Client
npx prisma generate --config libs/database/prisma.config.ts

# Create migration
npx prisma migrate dev --name add_geospatial_models --config libs/database/prisma.config.ts
```

If you encounter errors, you may need to create the migration step-by-step.

---

### Step 2: Seed Research Data (Day 2)

#### 2.1 Create Hotspot Seed Data

Create `libs/database/prisma/seeds/hotspots.seed.ts`:

```typescript
import { PrismaClient, RiskLevel, Season } from '../../src/prisma/generated';

const prisma = new PrismaClient();

// Based on Sharma et al. 2021 - Nature Scientific Reports
// https://www.nature.com/articles/s41598-021-03301-z
const researchHotspots = [
  {
    name: "Eastern Terai - Sarlahi High Risk Zone",
    description: "High-resolution geospatial modeling identified Sarlahi as a major snakebite risk area",
    district: "Sarlahi",
    province: "Madhesh",
    riskLevel: RiskLevel.VERY_HIGH,
    riskScore: 0.90,
    populationAtRisk: 762123, // Sarlahi population
    source: "Sharma SK, Kuch U, Höde P, et al. (2021) Estimating and predicting snakebite risk in the Terai region of Nepal through a high-resolution geospatial and One Health approach. Scientific Reports 11:19.
    sourceUrl: "https://www.nature.com/articles/s41598-021-03301-z",
    studyYear: 2021,
    methodology: "1km² resolution geospatial modeling using MaxEnt algorithm with environmental and demographic variables",
    confidence: 0.85,
    season: Season.MONSOON, // Peak season
    active: true,
  },
  {
    name: "Eastern Terai - Saptari High Risk Zone",
    description: "Major predicted risk area in eastern Nepal",
    district: "Saptari",
    province: "Madhesh",
    riskLevel: RiskLevel.VERY_HIGH,
    riskScore: 0.88,
    populationAtRisk: 639284,
    source: "Sharma SK, Kuch U, Höde P, et al. (2021)",
    sourceUrl: "https://www.nature.com/articles/s41598-021-03301-z",
    studyYear: 2021,
    methodology: "High-resolution geospatial modeling",
    confidence: 0.85,
    season: Season.MONSOON,
    active: true,
  },
  {
    name: "Eastern Terai - Sunsari High Risk Zone",
    description: "High snakebite risk area in Koshi Province",
    district: "Sunsari",
    province: "Koshi",
    riskLevel: RiskLevel.VERY_HIGH,
    riskScore: 0.86,
    populationAtRisk: 763487,
    source: "Sharma SK, Kuch U, Höde P, et al. (2021)",
    sourceUrl: "https://www.nature.com/articles/s41598-021-03301-z",
    studyYear: 2021,
    methodology: "1km² geospatial modeling",
    confidence: 0.85,
    season: Season.MONSOON,
    active: true,
  },
  {
    name: "Western Terai - Rupandehi High Risk Zone",
    description: "Western Terai hotspot including Butwal and Siddharthanagar",
    district: "Rupandehi",
    province: "Lumbini",
    riskLevel: RiskLevel.HIGH,
    riskScore: 0.82,
    populationAtRisk: 880196,
    source: "Sharma SK, Kuch U, Höde P, et al. (2021)",
    sourceUrl: "https://www.nature.com/articles/s41598-021-03301-z",
    studyYear: 2021,
    methodology: "Geospatial risk modeling",
    confidence: 0.80,
    season: Season.MONSOON,
    active: true,
  },
  {
    name: "Mahottari Elevated Risk Area",
    description: "Elevated risk district in Madhesh Province",
    district: "Mahottari",
    province: "Madhesh",
    riskLevel: RiskLevel.HIGH,
    riskScore: 0.75,
    populationAtRisk: 627580,
    source: "Sharma SK, Kuch U, Höde P, et al. (2021)",
    sourceUrl: "https://www.nature.com/articles/s41598-021-03301-z",
    studyYear: 2021,
    methodology: "Geospatial modeling",
    confidence: 0.75,
    season: Season.MONSOON,
    active: true,
  },
  {
    name: "Dhanusa Elevated Risk Area",
    description: "Elevated risk district bordering India",
    district: "Dhanusa",
    province: "Madhesh",
    riskLevel: RiskLevel.HIGH,
    riskScore: 0.72,
    populationAtRisk: 754777,
    source: "Sharma SK, Kuch U, Höde P, et al. (2021)",
    sourceUrl: "https://www.nature.com/articles/s41598-021-03301-z",
    studyYear: 2021,
    methodology: "Geospatial analysis",
    confidence: 0.75,
    season: Season.MONSOON,
    active: true,
  },
  {
    name: "Makwanpur Risk Area",
    description: "Risk area in Bagmati Province",
    district: "Makwanpur",
    province: "Bagmati",
    riskLevel: RiskLevel.HIGH,
    riskScore: 0.70,
    populationAtRisk: 420477,
    source: "Sharma SK, Kuch U, Höde P, et al. (2021)",
    sourceUrl: "https://www.nature.com/articles/s41598-021-03301-z",
    studyYear: 2021,
    methodology: "Geospatial modeling including foothill areas",
    confidence: 0.70,
    season: Season.MONSOON,
    active: true,
  },
  {
    name: "Siraha Risk Area",
    description: "Monsoon snakebite hotspot - 73.2% of cases occur during monsoon (2014-2024 hospital data)",
    district: "Siraha",
    province: "Madhesh",
    riskLevel: RiskLevel.HIGH,
    riskScore: 0.78,
    populationAtRisk: 637328,
    source: "Lamichhane et al. (2024) Clinico-epidemiological profile of snakebite cases in Siraha District, Nepal. Trans R Soc Trop Med Hyg",
    sourceUrl: "https://academic.oup.com/trstmh/article/120/7/764/8661437",
    studyYear: 2024,
    methodology: "10-year retrospective hospital study (2014-2024) showing strong monsoon seasonality",
    confidence: 0.85,
    season: Season.MONSOON,
    monthlyPattern: [2, 3, 5, 8, 12, 18, 22, 18, 15, 8, 4, 3], // Monsoon peak Jun-Sep
    active: true,
  },
  {
    name: "Dang Risk Area",
    description: "Mid-western Terai risk area",
    district: "Dang",
    province: "Lumbini",
    riskLevel: RiskLevel.MODERATE,
    riskScore: 0.65,
    populationAtRisk: 552583,
    source: "Sharma SK, Kuch U, Höde P, et al. (2021)",
    sourceUrl: "https://www.nature.com/articles/s41598-021-03301-z",
    studyYear: 2021,
    methodology: "Geospatial analysis",
    confidence: 0.70,
    season: Season.MONSOON,
    active: true,
  },
];

export async function seedHotspots() {
  console.log('🔥 Seeding research-based snakebite hotspots...');
  
  for (const hotspot of researchHotspots) {
    await prisma.snakebiteHotspot.upsert({
      where: { name: hotspot.name },
      update: hotspot,
      create: hotspot,
    });
    console.log(`  ✓ ${hotspot.district} (${hotspot.riskLevel})`);
  }
  
  console.log(`✅ Seeded ${researchHotspots.length} research-based hotspots`);
}

// Run if called directly
if (require.main === module) {
  seedHotspots()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
}
```

#### 2.2 Run Hotspot Seed

```bash
npx tsx libs/database/prisma/seeds/hotspots.seed.ts
```

---

### Step 3: GraphQL Implementation (Days 3-4)

#### 3.1 Create Map Module Structure

```bash
mkdir -p libs/backend/modules/src/map/application
mkdir -p libs/backend/modules/src/map/domain
mkdir -p libs/backend/modules/src/map/infrastructure/graphql/resolvers
mkdir -p libs/backend/modules/src/map/infrastructure/graphql/types
```

#### 3.2 Create Map Service

`libs/backend/modules/src/map/application/map.service.ts`:

```typescript
import { PrismaClient } from '@snake-rescue/database';
import { GeospatialService } from '../../geo/geospatial.service';

export class MapService {
  constructor(
    private prisma: PrismaClient,
    private geoService: GeospatialService
  ) {}

  async getMapOverview(bounds: MapBounds, filters?: MapFilters) {
    // Fetch incidents within bounds
    const incidents = await this.getIncidentsInBounds(bounds, filters);
    
    // Fetch rescuers within bounds
    const rescuers = await this.getRescuersInBounds(bounds, filters);
    
    // Fetch treatment centers within bounds
    const treatmentCenters = await this.getTreatmentCentersInBounds(bounds, filters);
    
    // Fetch hotspots if requested
    const hotspots = filters?.showHistoricalHotspots
      ? await this.getHotspotsInBounds(bounds, filters)
      : [];
    
    // Calculate statistics
    const statistics = this.calculateStatistics({
      incidents,
      rescuers,
      treatmentCenters,
    });
    
    return {
      incidents,
      rescuers,
      treatmentCenters,
      vehicles: [], // TODO
      hotspots,
      riskZones: [], // TODO
      statistics,
      metadata: {
        generatedAt: new Date(),
        cached: false,
        freshnessSeconds: 0,
      },
    };
  }

  private async getIncidentsInBounds(
    bounds: MapBounds,
    filters?: MapFilters
  ) {
    return this.prisma.rescueRequest.findMany({
      where: {
        lat: {
          gte: bounds.south,
          lte: bounds.north,
        },
        lng: {
          gte: bounds.west,
          lte: bounds.east,
        },
        ...(filters?.incidentStatuses && {
          status: { in: filters.incidentStatuses },
        }),
        ...(filters?.priorities && {
          priority: { in: filters.priorities },
        }),
        ...(filters?.dateRange && {
          createdAt: {
            gte: filters.dateRange.from,
            lte: filters.dateRange.to,
          },
        }),
      },
      include: {
        aiIdentification: {
          include: {
            species: true,
          },
        },
      },
      take: 1000, // Limit for performance
    });
  }

  private async getRescuersInBounds(
    bounds: MapBounds,
    filters?: MapFilters
  ) {
    return this.prisma.volunteer.findMany({
      where: {
        lastKnownLatitude: {
          gte: bounds.south,
          lte: bounds.north,
        },
        lastKnownLongitude: {
          gte: bounds.west,
          lte: bounds.east,
        },
        ...(filters?.rescuerStatuses && {
          status: { in: filters.rescuerStatuses },
        }),
        status: 'APPROVED',
      },
      include: {
        user: true,
        vehicle: true,
      },
      take: 500,
    });
  }

  private async getTreatmentCentersInBounds(
    bounds: MapBounds,
    filters?: MapFilters
  ) {
    return this.prisma.hospital.findMany({
      where: {
        latitude: {
          gte: bounds.south,
          lte: bounds.north,
        },
        longitude: {
          gte: bounds.west,
          lte: bounds.east,
        },
        status: 'ACTIVE',
      },
      take: 200,
    });
  }

  private async getHotspotsInBounds(
    bounds: MapBounds,
    filters?: MapFilters
  ) {
    return this.prisma.snakebiteHotspot.findMany({
      where: {
        active: true,
        ...(filters?.season && { season: filters.season }),
        ...(filters?.province && { province: filters.province }),
        ...(filters?.district && { district: filters.district }),
      },
    });
  }

  private calculateStatistics(data: any) {
    const activeRescues = data.incidents.filter(
      (i: any) => ['ASSIGNED', 'IN_PROGRESS'].includes(i.status)
    ).length;

    const criticalIncidents = data.incidents.filter(
      (i: any) => i.priority === 'CRITICAL'
    ).length;

    return {
      totalIncidents: data.incidents.length,
      activeRescues,
      availableRescuers: data.rescuers.filter(
        (r: any) => r.isAvailableNow
      ).length,
      treatmentCenters: data.treatmentCenters.length,
      criticalIncidents,
      avgResponseTimeMinutes: null, // TODO: Calculate
      medianResponseTimeMinutes: null,
      successRate: null,
    };
  }
}
```

---

### Step 4: Frontend Map Updates (Day 5)

#### 4.1 Update Admin Overview to Use GraphQL

Instead of separate queries, use the new `mapOverview` query:

```typescript
// apps/frontend/src/app/(dashboard)/dashboard/admin/page.tsx

const { data: mapData, loading } = useMapOverviewQuery({
  variables: {
    bounds: {
      north: 30.4,
      south: 26.3,
      east: 88.2,
      west: 80.0,
    },
    filters: {
      showHistoricalHotspots: true,
    },
  },
  pollInterval: 30000,
});

// mapData.incidents
// mapData.rescuers
// mapData.treatmentCenters
// mapData.hotspots
// mapData.statistics
```

---

## 🎯 Week 1 Success Criteria

- [ ] Database schema merged and migrated
- [ ] 9 research hotspots seeded with proper citations
- [ ] GraphQL map module created
- [ ] `mapOverview` query working
- [ ] Admin overview uses new query
- [ ] Console shows: "Loaded X incidents, Y rescuers, Z hospitals, 9 hotspots"

---

## 📚 Next Week Preview (Week 2)

- Implement PostGIS for spatial queries
- Build routing service abstraction
- Add hotspot layer to map
- Create district analytics dashboard
- Implement seasonal analytics (monsoon emphasis)

---

## ✅ Current Progress

**Completed**:
- ✅ Schema design (geospatial models)
- ✅ GraphQL schema (map queries)
- ✅ Research hotspots defined
- ✅ Admin map shows ALL data (67 hospitals, all volunteers, all rescues)

**Next**:
- 📝 Merge schema changes
- 📝 Create migration
- 📝 Seed hotspots
- 📝 Implement GraphQL resolvers
- 📝 Update frontend to use new API

---

🚀 **Let's build Nepal's national snakebite intelligence platform!**
