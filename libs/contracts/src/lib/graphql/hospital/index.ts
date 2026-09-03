/**
 * Hospital GraphQL Schema Exports
 * 
 * Hospital and antivenom availability management
 */



export const hospitalEnums = `# ===================================================================
# HOSPITAL ENUMS
# ===================================================================

enum AntivenomStatus {
  AVAILABLE
  LOW_STOCK
  OUT_OF_STOCK
  UNKNOWN
  NOT_SUPPORTED
}

enum VerificationStatus {
  VERIFIED
  HISTORICAL
  STALE
  UNVERIFIED
}

enum HospitalStatus {
  ACTIVE
  INACTIVE
  TEMPORARILY_CLOSED
  PERMANENTLY_CLOSED
}

enum HospitalType {
  GOVERNMENT
  PRIVATE
  ARMY
  POLICE
  NGO
  COMMUNITY
}

enum TreatmentCenterType {
  PRIMARY
  DISTRICT
  PROVINCIAL
  SPECIALIZED
  REFERRAL
  PRIVATE
}

enum VerificationType {
  PHONE_CALL
  SITE_VISIT
  OFFICIAL_DOCUMENT
  HOSPITAL_REPORT
  PROVINCIAL_HEALTH
  EDCD_RECORD
}

enum HospitalReportType {
  INCORRECT_INFO
  OUTDATED_STATUS
  CLOSED
  WRONG_LOCATION
  ANTIVENOM_STATUS_CHANGE
  OTHER
}

enum HospitalReportStatus {
  NEW
  UNDER_REVIEW
  RESOLVED
  DISMISSED
}

enum SortDirection {
  ASC
  DESC
}
`;
export const hospitalSchema = `# ===================================================================
# HOSPITAL SCHEMA
# ===================================================================

type Hospital {
  id: ID!
  
  # Basic Information
  name: String!
  address: String!
  municipality: String!
  ward: Int
  district: String!
  province: String!
  
  # Contact Information
  phone: String
  email: String
  emergencyPhone: String
  
  # Location
  latitude: Float!
  longitude: Float!
  
  # Emergency Capabilities
  emergencyAvailable: Boolean!
  emergency24x7: Boolean!
  
  # Snakebite Treatment Capability
  snakebiteTreatmentAvailable: Boolean!
  treatmentCenterType: TreatmentCenterType
  
  # Antivenom Status
  antivenomStatus: AntivenomStatus!
  antivenomStockQuantity: Int
  antivenomLastVerifiedAt: DateTime
  antivenomVerifiedBy: String
  antivenomStockPublic: Boolean!
  
  # Derived verification state
  antivenomVerificationFreshness: VerificationFreshness!
  
  # Additional Medical Capabilities
  ventilatorAvailable: Boolean!
  icuAvailable: Boolean!
  ambulanceAvailable: Boolean!
  bloodBankAvailable: Boolean!
  
  # Data Source & Verification
  source: String
  sourceYear: String
  sourceUrl: String
  verificationStatus: VerificationStatus!
  officialTreatmentCenter: Boolean!
  
  # Status
  status: HospitalStatus!
  
  # Additional Information
  hospitalType: HospitalType
  bedCapacity: Int
  specializations: [String!]!
  
  # Metadata
  notes: String
  
  # Computed Fields
  distanceFromUser: Float # Distance in kilometers (computed based on user location)
  markerColor: String! # Color for map marker based on status
  recommendationScore: Float # Suitability score for snake rescue
  
  createdAt: DateTime!
  updatedAt: DateTime!
  
  # Relations
  verificationRecords: [HospitalVerification!]!
  recentVerification: HospitalVerification
}

type HospitalVerification {
  id: ID!
  hospitalId: String!
  hospital: Hospital!
  
  # Verification Details
  verifiedBy: String!
  verificationType: VerificationType!
  
  # What was verified
  snakebiteTreatment: Boolean
  antivenomStatus: AntivenomStatus
  antivenomQuantity: Int
  emergencyStatus: Boolean
  ventilatorStatus: Boolean
  
  # Verification Evidence
  notes: String
  evidenceUrls: [String!]!
  officialDocumentUrl: String
  
  # Source Information
  contactPerson: String
  contactDesignation: String
  contactPhone: String
  
  verificationDate: DateTime!
  nextVerificationDue: DateTime
  
  createdAt: DateTime!
}

type HospitalReport {
  id: ID!
  hospitalId: String!
  hospital: Hospital!
  
  # Reporter Information
  reportedBy: String
  reporterName: String
  reporterEmail: String
  reporterPhone: String
  
  # Report Details
  reportType: HospitalReportType!
  description: String!
  
  # Status
  status: HospitalReportStatus!
  
  # Resolution
  resolvedBy: String
  resolvedAt: DateTime
  resolution: String
  
  createdAt: DateTime!
  updatedAt: DateTime!
}

# Verification freshness indicator
enum VerificationFreshness {
  FRESH        # Verified within freshness period
  STALE        # Verification expired
  VERY_OLD     # Very old data
  NEVER        # Never verified
}

# Hospital Connection (for pagination)
type HospitalConnection {
  edges: [HospitalEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type HospitalEdge {
  node: Hospital!
  cursor: String!
}

# Nearest facilities response
type NearestFacility {
  hospital: Hospital!
  distance: Float!
  travelTimeEstimate: String!
  recommendationReason: String
}

# Hospital statistics
type HospitalStatistics {
  total: Int!
  withSnakebiteTreatment: Int!
  withVerifiedAntivenom: Int!
  withUnknownAntivenom: Int!
  outOfStock: Int!
  byProvince: [ProvinceHospitalCount!]!
  verificationCoverage: Float!
}

type ProvinceHospitalCount {
  province: String!
  count: Int!
  withAntivenom: Int!
}
`;
export const hospitalInputs = `# ===================================================================
# HOSPITAL INPUTS
# ===================================================================

input CreateHospitalInput {
  name: String!
  address: String!
  municipality: String!
  ward: Int
  district: String!
  province: String!
  
  phone: String
  email: String
  emergencyPhone: String
  
  latitude: Float!
  longitude: Float!
  
  emergencyAvailable: Boolean
  emergency24x7: Boolean
  
  snakebiteTreatmentAvailable: Boolean
  treatmentCenterType: TreatmentCenterType
  
  antivenomStatus: AntivenomStatus
  
  ventilatorAvailable: Boolean
  icuAvailable: Boolean
  ambulanceAvailable: Boolean
  bloodBankAvailable: Boolean
  
  source: String
  sourceYear: String
  sourceUrl: String
  officialTreatmentCenter: Boolean
  
  hospitalType: HospitalType
  bedCapacity: Int
  specializations: [String!]
  
  notes: String
}

input UpdateHospitalInput {
  name: String
  address: String
  municipality: String
  ward: Int
  district: String
  province: String
  
  phone: String
  email: String
  emergencyPhone: String
  
  latitude: Float
  longitude: Float
  
  emergencyAvailable: Boolean
  emergency24x7: Boolean
  
  snakebiteTreatmentAvailable: Boolean
  treatmentCenterType: TreatmentCenterType
  
  antivenomStatus: AntivenomStatus
  
  ventilatorAvailable: Boolean
  icuAvailable: Boolean
  ambulanceAvailable: Boolean
  bloodBankAvailable: Boolean
  
  source: String
  sourceYear: String
  officialTreatmentCenter: Boolean
  
  hospitalType: HospitalType
  bedCapacity: Int
  specializations: [String!]
  
  status: HospitalStatus
  
  notes: String
  internalNotes: String
}

input VerifyAntivenomInput {
  hospitalId: ID!
  antivenomStatus: AntivenomStatus!
  antivenomQuantity: Int
  verificationType: VerificationType!
  notes: String
  evidenceUrls: [String!]
  contactPerson: String
  contactDesignation: String
  contactPhone: String
}

input VerifyHospitalCapabilityInput {
  hospitalId: ID!
  snakebiteTreatment: Boolean
  antivenomStatus: AntivenomStatus
  antivenomQuantity: Int
  emergencyStatus: Boolean
  ventilatorStatus: Boolean
  verificationType: VerificationType!
  notes: String
  evidenceUrls: [String!]
  officialDocumentUrl: String
  contactPerson: String
  contactDesignation: String
  contactPhone: String
  nextVerificationDue: DateTime
}

input HospitalFilterInput {
  snakebiteTreatmentOnly: Boolean
  antivenomStatus: AntivenomStatus
  antivenomAvailable: Boolean
  emergency24x7: Boolean
  provinces: [String!]
  districts: [String!]
  municipalities: [String!]
  hospitalTypes: [HospitalType!]
  verificationStatus: VerificationStatus
  status: HospitalStatus
  officialOnly: Boolean
}

input HospitalLocationInput {
  latitude: Float!
  longitude: Float!
  radiusKm: Float
}

input CreateHospitalReportInput {
  hospitalId: ID!
  reportType: HospitalReportType!
  description: String!
  reporterName: String
  reporterEmail: String
  reporterPhone: String
}

input ResolveHospitalReportInput {
  reportId: ID!
  resolution: String!
}

input HospitalSortInput {
  field: HospitalSortField!
  direction: SortDirection!
}

enum HospitalSortField {
  NAME
  CREATED_AT
  UPDATED_AT
  VERIFICATION_DATE
  DISTANCE
}
`;
export const hospitalQueries = `# ===================================================================
# HOSPITAL QUERIES
# ===================================================================

extend type Query {
  # Get single hospital by ID
  hospital(id: ID!): Hospital
  
  # List hospitals with pagination and filters
  hospitals(
    filter: HospitalFilterInput
    location: HospitalLocationInput
    sort: HospitalSortInput
    first: Int
    after: String
    pagination: PaginationInput
  ): HospitalConnection!
  
  # Find nearby hospitals (with distance)
  nearbyHospitals(
    latitude: Float!
    longitude: Float!
    radiusKm: Float
    antivenomRequired: Boolean
    limit: Int
  ): [NearestFacility!]!
  
  # Find nearest snakebite facilities (alias for nearbyHospitals with treatment filter)
  nearestSnakebiteFacilities(
    latitude: Float!
    longitude: Float!
    radiusKm: Float
    limit: Int
  ): [NearestFacility!]!
  
  # Get recommended hospitals based on emergency type
  recommendedHospitals(
    latitude: Float!
    longitude: Float!
    hasBite: Boolean
  ): [NearestFacility!]!
  
  # Find nearest facility with verified antivenom
  nearestVerifiedAntivenomFacility(
    latitude: Float!
    longitude: Float!
    maxRadiusKm: Float
  ): NearestFacility
  
  # Get hospital statistics
  hospitalStatistics: HospitalStatistics!
  hospitalStats: HospitalStatistics! # Alias
  
  # Get hospitals needing verification
  hospitalsNeedingVerification(
    province: String
    maxDaysSinceVerification: Int
    first: Int
    after: String
  ): HospitalConnection!
  
  # Get verification records for a hospital
  hospitalVerifications(
    hospitalId: ID!
    first: Int
    after: String
  ): [HospitalVerification!]!
  
  # Get hospital reports
  hospitalReports(
    hospitalId: ID
    status: HospitalReportStatus
    first: Int
    after: String
  ): [HospitalReport!]!
  
  # Search hospitals by name or location
  searchHospitals(
    query: String!
    filter: HospitalFilterInput
    limit: Int
  ): [Hospital!]!
  
  # Get hospitals by province
  hospitalsByProvince(
    province: String!
    pagination: PaginationInput
  ): HospitalConnection!
  
  # Get hospitals by district
  hospitalsByDistrict(
    district: String!
    pagination: PaginationInput
  ): HospitalConnection!
}

input PaginationInput {
  page: Int
  limit: Int
}
`;
export const hospitalMutations = `# ===================================================================
# HOSPITAL MUTATIONS
# ===================================================================

extend type Mutation {
  # Create new hospital (Admin only)
  createHospital(input: CreateHospitalInput!): Hospital!
  
  # Update hospital information (Admin only)
  updateHospital(id: ID!, input: UpdateHospitalInput!): Hospital!
  
  # Delete hospital (Admin only)
  deleteHospital(id: ID!): Boolean!
  
  # Verify antivenom status (Authorized verifier only)
  verifyAntivenomStatus(input: VerifyAntivenomInput!): Hospital!
  
  # Verify complete hospital capability (Authorized verifier only)
  verifyHospitalCapability(input: VerifyHospitalCapabilityInput!): Hospital!
  
  # Update antivenom stock quantity (Hospital staff / Admin)
  updateAntivenomStock(
    hospitalId: ID!
    quantity: Int!
    notes: String
  ): Hospital!
  
  # Report incorrect hospital information (Public)
  reportHospitalInformation(input: CreateHospitalReportInput!): HospitalReport!
  
  # Resolve hospital report (Admin only)
  resolveHospitalReport(input: ResolveHospitalReportInput!): HospitalReport!
  
  # Bulk import hospitals (Super Admin only)
  bulkImportHospitals(
    hospitals: [CreateHospitalInput!]!
    source: String!
  ): BulkImportResult!
}

type BulkImportResult {
  success: Boolean!
  imported: Int!
  failed: Int!
  errors: [BulkImportError!]!
}

type BulkImportError {
  index: Int!
  hospitalName: String!
  error: String!
}
`;
export const hospitalSubscriptions = `# ===================================================================
# HOSPITAL SUBSCRIPTIONS
# ===================================================================

extend type Subscription {
  # Subscribe to hospital updates (for map real-time updates)
  hospitalUpdated(hospitalId: ID): Hospital!
  
  # Subscribe to antivenom status changes
  antivenomStatusChanged(
    hospitalId: ID
    province: String
  ): AntivenomStatusUpdate!
  
  # Subscribe to new hospital reports
  hospitalReportCreated: HospitalReport!
}

type AntivenomStatusUpdate {
  hospital: Hospital!
  previousStatus: AntivenomStatus!
  newStatus: AntivenomStatus!
  verifiedAt: DateTime!
  verifiedBy: String!
}
`;
export const hospitalFragments = `# ===================================================================
# HOSPITAL FRAGMENTS
# ===================================================================

fragment HospitalBasic on Hospital {
  id
  name
  address
  municipality
  district
  province
  latitude
  longitude
  phone
  emergencyPhone
}

fragment HospitalCapability on Hospital {
  emergencyAvailable
  emergency24x7
  snakebiteTreatmentAvailable
  treatmentCenterType
  antivenomStatus
  antivenomLastVerifiedAt
  antivenomVerificationFreshness
  ventilatorAvailable
  icuAvailable
  ambulanceAvailable
}

fragment HospitalFull on Hospital {
  ...HospitalBasic
  ...HospitalCapability
  email
  ward
  antivenomStockQuantity
  antivenomStockPublic
  bloodBankAvailable
  source
  sourceYear
  sourceUrl
  verificationStatus
  officialTreatmentCenter
  status
  hospitalType
  bedCapacity
  specializations
  notes
  markerColor
  createdAt
  updatedAt
}

fragment HospitalMapMarker on Hospital {
  id
  name
  latitude
  longitude
  snakebiteTreatmentAvailable
  antivenomStatus
  antivenomVerificationFreshness
  markerColor
  distanceFromUser
}

fragment HospitalVerificationBasic on HospitalVerification {
  id
  hospitalId
  verifiedBy
  verificationType
  snakebiteTreatment
  antivenomStatus
  antivenomQuantity
  emergencyStatus
  ventilatorStatus
  verificationDate
  nextVerificationDue
}

fragment HospitalVerificationFull on HospitalVerification {
  ...HospitalVerificationBasic
  notes
  evidenceUrls
  officialDocumentUrl
  contactPerson
  contactDesignation
  contactPhone
  createdAt
}

fragment NearestFacilityInfo on NearestFacility {
  distance
  travelTimeEstimate
  recommendationReason
  hospital {
    ...HospitalFull
  }
}
`;

export const hospitalTypeDefs = [
  hospitalEnums,
  hospitalSchema,
  hospitalInputs,
  hospitalQueries,
  hospitalMutations,
  hospitalSubscriptions,
  hospitalFragments,
].join('\n\n');
