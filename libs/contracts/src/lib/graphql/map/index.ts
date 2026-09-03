/**
 * Map GraphQL Schema Exports
 * 
 * Geospatial intelligence platform queries and types
 */



export const mapSchema = `# ===================================================================
# SNAKESOS GEOSPATIAL INTELLIGENCE - GRAPHQL SCHEMA
# ===================================================================
# Map queries and types for admin intelligence platform
# ===================================================================

# ===================================================================
# QUERIES
# ===================================================================

extend type Query {
  """
  Get comprehensive map overview for current viewport
  Optimized single query for admin intelligence map
  Returns incidents, rescuers, treatment centers, hotspots within bounds
  """
  mapOverview(
    bounds: MapBoundsInput!
    filters: MapFiltersInput
  ): MapOverview! @auth(requires: [ADMIN, SUPER_ADMIN, DISTRICT_COORDINATOR])
  
  """
  Get incidents within viewport or radius
  Supports clustering and aggregation
  """
  incidents(
    bounds: MapBoundsInput
    radius: RadiusInput
    filters: IncidentFiltersInput
    pagination: PaginationInput
  ): IncidentConnection!
  
  """
  Find nearby rescuers within radius
  Returns available or all rescuers based on filter
  """
  nearbyRescuers(
    latitude: Float!
    longitude: Float!
    radiusKm: Float!
    status: [RescuerStatus!]
  ): [RescuerMapPoint!]!
  
  """
  Find nearby treatment centers ranked by accessibility
  Considers: distance, travel time, antivenom status, capabilities
  """
  nearbyTreatmentCenters(
    latitude: Float!
    longitude: Float!
    radiusKm: Float
    requireAntivenom: Boolean
    requireEmergency: Boolean
  ): [TreatmentCenterMapPoint!]!
  
  """
  Rank treatment centers by accessibility for emergency
  Uses routing to calculate real travel time, not just distance
  """
  rankTreatmentCenters(
    latitude: Float!
    longitude: Float!
    requireAntivenom: Boolean
    limit: Int
  ): [RankedTreatmentCenter!]! @auth
  
  """
  Get research-based snakebite hotspots within bounds
  Clearly labeled as research data with source citations
  """
  snakebiteHotspots(
    bounds: MapBoundsInput
    riskLevel: [RiskLevel!]
    season: Season
    province: String
    district: String
  ): [SnakebiteHotspot!]! @auth(requires: [ADMIN, SUPER_ADMIN, DISTRICT_COORDINATOR])
  
  """
  Get risk zones within bounds
  Aggregated risk analysis by district/municipality
  """
  riskZones(
    bounds: MapBoundsInput
    province: String
    district: String
    minRiskLevel: RiskLevel
  ): [RiskZone!]! @auth(requires: [ADMIN, SUPER_ADMIN])
  
  """
  Get snake species distribution map
  Shows where species have been observed
  """
  snakeSpeciesDistribution(
    bounds: MapBoundsInput
    speciesId: ID
    includeHistorical: Boolean
  ): [SpeciesMapPoint!]!
  
  """
  Get historical snakebite cases for analysis
  Research data clearly separated from live SnakeSOS data
  """
  historicalCases(
    province: String
    district: String
    municipality: String
    year: Int
    season: Season
    outcome: CaseOutcome
    pagination: PaginationInput
  ): SnakebiteCaseConnection! @auth(requires: [ADMIN, SUPER_ADMIN, DISTRICT_COORDINATOR])
  
  """
  Get route between two points
  Uses multi-provider routing (OSRM/ORS)
  """
  getRoute(
    from: CoordinateInput!
    to: CoordinateInput!
    profile: RoutingProfile
  ): Route! @auth
  
  """
  Get district-level analytics
  Comprehensive statistics for a single district
  """
  districtAnalytics(
    district: String!
    year: Int
  ): DistrictAnalytics! @auth(requires: [ADMIN, SUPER_ADMIN, DISTRICT_COORDINATOR])
  
  """
  Get seasonal analytics
  Shows monthly/seasonal patterns
  """
  seasonalAnalytics(
    province: String
    district: String
    year: Int
  ): SeasonalAnalytics! @auth(requires: [ADMIN, SUPER_ADMIN])
  
  """
  Get response time analytics
  Performance metrics for rescue operations
  """
  responseAnalytics(
    province: String
    district: String
    dateRange: DateRangeInput
  ): ResponseAnalytics! @auth(requires: [ADMIN, SUPER_ADMIN, DISTRICT_COORDINATOR])
}

# ===================================================================
# INPUT TYPES
# ===================================================================

input MapBoundsInput {
  """Northern boundary (max latitude)"""
  north: Float!
  
  """Southern boundary (min latitude)"""
  south: Float!
  
  """Eastern boundary (max longitude)"""
  east: Float!
  
  """Western boundary (min longitude)"""
  west: Float!
}

input RadiusInput {
  latitude: Float!
  longitude: Float!
  radiusKm: Float!
}

input CoordinateInput {
  latitude: Float!
  longitude: Float!
}

input MapFiltersInput {
  """Filter by incident types"""
  incidentTypes: [IncidentType!]
  
  """Filter by incident statuses"""
  incidentStatuses: [IncidentStatus!]
  
  """Filter by priorities"""
  priorities: [Priority!]
  
  """Filter by rescuer statuses"""
  rescuerStatuses: [RescuerStatus!]
  
  """Show research-based historical hotspots"""
  showHistoricalHotspots: Boolean
  
  """Show risk zones"""
  showRiskZones: Boolean
  
  """Filter by season"""
  season: Season
  
  """Date range filter"""
  dateRange: DateRangeInput
  
  """Filter by province"""
  province: String
  
  """Filter by district"""
  district: String
}

input IncidentFiltersInput {
  types: [IncidentType!]
  statuses: [IncidentStatus!]
  priorities: [Priority!]
  speciesId: ID
  province: String
  district: String
  municipality: String
  dateRange: DateRangeInput
}

input DateRangeInput {
  from: DateTime!
  to: DateTime!
}

# ===================================================================
# OUTPUT TYPES
# ===================================================================

type MapOverview {
  """Incidents in viewport"""
  incidents: [IncidentMapPoint!]!
  
  """Rescuers in viewport"""
  rescuers: [RescuerMapPoint!]!
  
  """Treatment centers in viewport"""
  treatmentCenters: [TreatmentCenterMapPoint!]!
  
  """Rescue vehicles in viewport"""
  vehicles: [VehicleMapPoint!]!
  
  """Research-based hotspots in viewport"""
  hotspots: [HotspotMapPoint!]!
  
  """Risk zones in viewport"""
  riskZones: [RiskZoneMapPoint!]!
  
  """Aggregated statistics for viewport"""
  statistics: MapStatistics!
  
  """Metadata about the data"""
  metadata: MapMetadata!
}

type MapStatistics {
  """Total incidents in viewport"""
  totalIncidents: Int!
  
  """Active rescues in progress"""
  activeRescues: Int!
  
  """Available rescuers"""
  availableRescuers: Int!
  
  """Treatment centers"""
  treatmentCenters: Int!
  
  """Critical/high priority incidents"""
  criticalIncidents: Int!
  
  """Average response time in minutes"""
  avgResponseTimeMinutes: Float
  
  """Median response time in minutes"""
  medianResponseTimeMinutes: Float
  
  """Success rate (percentage)"""
  successRate: Float
}

type MapMetadata {
  """When this data was generated"""
  generatedAt: DateTime!
  
  """Cache status"""
  cached: Boolean!
  
  """Data freshness (seconds)"""
  freshnessSeconds: Int!
  
  """Viewport area (sq km)"""
  areaKm2: Float
}

# ===================================================================
# MAP POINT TYPES (Optimized for Map Display)
# ===================================================================

type IncidentMapPoint {
  id: ID!
  latitude: Float!
  longitude: Float!
  type: IncidentType
  status: IncidentStatus!
  priority: Priority!
  reportedAt: DateTime!
  distanceKm: Float
  municipality: String
}

type RescuerMapPoint {
  id: ID!
  latitude: Float!
  longitude: Float!
  name: String!
  status: RescuerStatus!
  vehicleType: VehicleType
  distanceKm: Float
  lastLocationUpdate: DateTime
  isAvailable: Boolean!
}

type TreatmentCenterMapPoint {
  id: ID!
  latitude: Float!
  longitude: Float!
  name: String!
  verified: Boolean!
  antivenomStatus: AntivenomStatus!
  emergency24x7: Boolean!
  snakebiteTreatmentAvailable: Boolean!
  distanceKm: Float
  estimatedTravelTimeMinutes: Int
  address: String
  phone: String
  district: String
}

type VehicleMapPoint {
  id: ID!
  latitude: Float!
  longitude: Float!
  vehicleType: VehicleType!
  status: VehicleStatus!
  vehicleNumber: String!
  lastLocationUpdate: DateTime
}

type HotspotMapPoint {
  id: ID!
  geometry: GeoJSON!
  name: String!
  riskLevel: RiskLevel!
  riskScore: Float!
  source: String!
  sourceUrl: String
  studyYear: Int
  district: String
  province: String
  caseCount: Int
  populationAtRisk: Int
}

type RiskZoneMapPoint {
  id: ID!
  geometry: GeoJSON
  district: String!
  province: String!
  riskLevel: RiskLevel!
  populationAtRisk: Int
  incidenceRate: Float
  treatmentCenterCount: Int
}

type SpeciesMapPoint {
  id: ID!
  latitude: Float!
  longitude: Float!
  speciesId: ID!
  speciesName: String!
  venomous: Boolean!
  observedAt: DateTime!
  source: String
}

# ===================================================================
# TREATMENT CENTER RANKING
# ===================================================================

type RankedTreatmentCenter {
  """Treatment center details"""
  treatmentCenter: TreatmentCenter!
  
  """Distance in kilometers"""
  distanceKm: Float!
  
  """Estimated travel time in minutes"""
  estimatedTravelTimeMinutes: Int!
  
  """Route geometry"""
  route: Route
  
  """Rank (1 = best)"""
  rank: Int!
  
  """Composite score (higher = better)"""
  score: Float!
  
  """Scoring breakdown"""
  scoreDetails: RankingScoreDetails!
}

type RankingScoreDetails {
  """Distance score (closer = higher)"""
  distanceScore: Float!
  
  """Capability score (more capable = higher)"""
  capabilityScore: Float!
  
  """Verification score (verified = higher)"""
  verificationScore: Float!
  
  """Antivenom score (available = higher)"""
  antivenomScore: Float!
  
  """Accessibility score (travel time)"""
  accessibilityScore: Float!
}

# ===================================================================
# ROUTING
# ===================================================================

type Route {
  """Total distance in kilometers"""
  distance: Float!
  
  """Total duration in minutes"""
  duration: Int!
  
  """Route geometry (LineString)"""
  geometry: GeoJSON!
  
  """Turn-by-turn instructions"""
  instructions: [RouteInstruction!]!
  
  """Waypoints along route"""
  waypoints: [Coordinate!]!
}

type RouteInstruction {
  """Instruction text"""
  text: String!
  
  """Distance for this step (meters)"""
  distance: Float!
  
  """Duration for this step (seconds)"""
  duration: Int!
  
  """Direction type"""
  type: String!
  
  """Road name"""
  roadName: String
}

type Coordinate {
  latitude: Float!
  longitude: Float!
}

# ===================================================================
# ANALYTICS TYPES
# ===================================================================

type DistrictAnalytics {
  district: String!
  province: String!
  
  """Total incidents (all time)"""
  totalIncidents: Int!
  
  """Active rescues right now"""
  activeRescues: Int!
  
  """Completed rescues"""
  completedRescues: Int!
  
  """Snakebite cases (envenomation)"""
  snakebiteCases: Int!
  
  """Deaths"""
  deaths: Int!
  
  """Treatment centers"""
  treatmentCenters: Int!
  
  """Available rescuers"""
  availableRescuers: Int!
  
  """Average response time"""
  avgResponseTimeMinutes: Float
  
  """Success rate"""
  successRate: Float
  
  """Risk level"""
  riskLevel: RiskLevel
  
  """Monthly trend"""
  monthlyTrend: [MonthlyDataPoint!]!
  
  """Top snake species"""
  topSpecies: [SpeciesCount!]!
  
  """Treatment center coverage"""
  treatmentCenterCoverage: CoverageAnalysis
}

type SeasonalAnalytics {
  """Data by season"""
  bySeason: [SeasonalDataPoint!]!
  
  """Data by month"""
  byMonth: [MonthlyDataPoint!]!
  
  """Monsoon emphasis (June-Sept)"""
  monsoonData: MonsoonData!
  
  """Peak season"""
  peakSeason: Season!
  
  """Peak month"""
  peakMonth: Int!
}

type ResponseAnalytics {
  """Average response time (minutes)"""
  avgResponseTime: Float!
  
  """Median response time (minutes)"""
  medianResponseTime: Float!
  
  """90th percentile response time"""
  p90ResponseTime: Float!
  
  """Average travel distance (km)"""
  avgTravelDistance: Float!
  
  """Success rate (percentage)"""
  successRate: Float!
  
  """Rescue completion rate"""
  completionRate: Float!
  
  """Response time by district"""
  byDistrict: [DistrictResponseTime!]!
  
  """Response time trend"""
  trend: [ResponseTimeTrend!]!
}

type MonthlyDataPoint {
  month: Int!
  year: Int!
  count: Int!
  snakebiteCases: Int
  deaths: Int
}

type SeasonalDataPoint {
  season: Season!
  count: Int!
  percentage: Float!
  snakebiteCases: Int
  deaths: Int
}

type MonsoonData {
  """Incidents during monsoon"""
  incidents: Int!
  
  """Percentage of annual total"""
  percentage: Float!
  
  """Comparison to other seasons"""
  comparisonToWinter: Float!
  comparisonToSpring: Float!
  comparisonToAutumn: Float!
}

type SpeciesCount {
  speciesId: ID!
  speciesName: String!
  count: Int!
  percentage: Float!
  venomous: Boolean!
}

type CoverageAnalysis {
  """Population covered by 30min travel"""
  population30Min: Int
  
  """Population covered by 60min travel"""
  population60Min: Int
  
  """Population coverage percentage"""
  coveragePercentage: Float
  
  """Underserved areas"""
  underservedAreas: [String!]
}

type DistrictResponseTime {
  district: String!
  avgResponseTime: Float!
  medianResponseTime: Float!
  incidentCount: Int!
}

type ResponseTimeTrend {
  date: Date!
  avgResponseTime: Float!
  incidentCount: Int!
}

# ===================================================================
# ENUMS
# ===================================================================

enum IncidentType {
  SNAKE_RESCUE
  SNAKE_BITE
  SNAKE_SIGHTING
  OTHER
}

enum IncidentStatus {
  PENDING
  ASSIGNED
  ACCEPTED
  IN_PROGRESS
  COMPLETED
  CANCELLED
  CLOSED
  EXPIRED
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

enum AntivenomStatus {
  AVAILABLE
  LOW_STOCK
  OUT_OF_STOCK
  UNKNOWN
  NOT_SUPPORTED
}

enum RiskLevel {
  LOW
  MODERATE
  HIGH
  VERY_HIGH
  EXTREME
}

enum Season {
  WINTER
  SPRING
  MONSOON
  AUTUMN
}

enum RoutingProfile {
  DRIVING
  DRIVING_FAST
  EMERGENCY
  WALKING
  CYCLING
}

enum RescuerStatus {
  AVAILABLE
  BUSY
  EN_ROUTE
  ON_SITE
  OFFLINE
  SUSPENDED
}

enum VehicleType {
  RESCUE_VAN
  AMBULANCE
  MOTORBIKE
  BICYCLE
  CAR
  TRUCK
  OTHER
}

enum VehicleStatus {
  AVAILABLE
  ASSIGNED
  EN_ROUTE
  ON_SITE
  MAINTENANCE
  OFFLINE
}

enum CaseOutcome {
  RECOVERED
  RECOVERED_WITH_COMPLICATIONS
  DECEASED
  LOST_TO_FOLLOWUP
  UNKNOWN
}

# ===================================================================
# SCALARS
# ===================================================================

"""
GeoJSON geometry object
Can be Point, LineString, Polygon, MultiPoint, MultiLineString, MultiPolygon
"""
scalar GeoJSON

"""Date without time"""
scalar Date

# ===================================================================
# CONNECTIONS (Pagination)
# ===================================================================

type IncidentConnection {
  edges: [IncidentEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type IncidentEdge {
  node: IncidentMapPoint!
  cursor: String!
}

type SnakebiteCaseConnection {
  edges: [SnakebiteCaseEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type SnakebiteCaseEdge {
  node: SnakebiteCase!
  cursor: String!
}

# ===================================================================
# FULL DETAIL TYPES (Not map points)
# ===================================================================

type SnakebiteHotspot {
  id: ID!
  name: String!
  description: String
  geometry: GeoJSON
  district: String
  municipality: String
  ward: Int
  province: String
  riskScore: Float!
  riskLevel: RiskLevel!
  caseCount: Int
  populationAtRisk: Int
  incidenceRate: Float
  mortalityRate: Float
  seasonalityScore: Float
  source: String!
  sourceUrl: String
  studyYear: Int
  methodology: String
  confidence: Float
  season: Season
  monthlyPattern: [Float!]
  active: Boolean!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type SnakebiteCase {
  id: ID!
  year: Int!
  month: Int
  season: Season
  date: DateTime
  province: String
  district: String
  municipality: String
  ward: Int
  latitude: Float
  longitude: Float
  ageGroup: String
  sex: String
  species: SnakeSpecies
  speciesCommon: String
  envenomation: Boolean
  symptoms: [String!]
  outcome: CaseOutcome!
  treatmentCenter: TreatmentCenter
  treatmentDelayMinutes: Int
  antivenomGiven: Boolean
  hospitalStayDays: Int
  source: String!
  sourceUrl: String
  studyId: String
  dataQuality: String
  notes: String
  createdAt: DateTime!
}

type TreatmentCenter {
  id: ID!
  name: String!
  latitude: Float!
  longitude: Float!
  address: String!
  district: String!
  municipality: String!
  province: String!
  phone: String
  emergencyPhone: String
  antivenomStatus: AntivenomStatus!
  snakebiteTreatmentAvailable: Boolean!
  emergency24x7: Boolean!
  verified: Boolean!
  # ... other fields
}

type RiskZone {
  district: String!
  province: String!
  riskLevel: RiskLevel!
  geometry: GeoJSON
  totalIncidents: Int!
  snakebiteCases: Int!
  populationAtRisk: Int
  incidenceRate: Float
  avgResponseTime: Float
  treatmentCenters: Int!
}

# ===================================================================
# NOTES
# ===================================================================

# 1. All map queries should use viewport bounds for performance
# 2. Clearly label research data vs live SnakeSOS data
# 3. Implement proper authorization (admin-only for sensitive data)
# 4. Use DataLoader to prevent N+1 queries
# 5. Cache expensive calculations (district statistics)
# 6. Implement rate limiting on expensive queries
# 7. Add query complexity limits
# 8. Log all admin map queries for audit trail
`;
export const mapQueries = `# Map Overview Query for Admin Dashboard

query MapOverview(\$bounds: MapBoundsInput!, \$filters: MapFiltersInput) {
  mapOverview(bounds: \$bounds, filters: \$filters) {
    incidents {
      id
      latitude
      longitude
      status
      priority
      reportedAt
      municipality
    }
    rescuers {
      id
      latitude
      longitude
      name
      isAvailable
      lastLocationUpdate
    }
    treatmentCenters {
      id
      latitude
      longitude
      name
      antivenomStatus
      snakebiteTreatmentAvailable
      emergency24x7
      district
      phone
    }
    hotspots {
      id
      name
      riskLevel
      riskScore
      district
      province
      source
      sourceUrl
      studyYear
      geometry
    }
    statistics {
      totalIncidents
      activeRescues
      availableRescuers
      treatmentCenters
      criticalIncidents
      avgResponseTimeMinutes
      successRate
    }
    metadata {
      generatedAt
      cached
      freshnessSeconds
    }
  }
}

query SnakebiteHotspots(\$province: String, \$district: String) {
  snakebiteHotspots(province: \$province, district: \$district) {
    id
    name
    description
    geometry
    district
    province
    riskScore
    riskLevel
    populationAtRisk
    source
    sourceUrl
    studyYear
    methodology
    confidence
    season
    active
  }
}
`;

export const mapTypeDefs = [
  mapSchema,
  mapQueries,
].join('\n\n');
