// ===================================================================
// VOLUNTEER - MODULE EXPORTS
// ===================================================================



export const volunteerEnums = `# ===================================================================
# VOLUNTEER - ENUMS
# ===================================================================

"""
Status of volunteer application/account
"""
enum VolunteerStatus {
  PENDING
  APPROVED
  VERIFIED
  SUSPENDED
  REJECTED
  INACTIVE
}

"""
Experience level of volunteer
"""
enum ExperienceLevel {
  BEGINNER
  INTERMEDIATE
  EXPERT
}

"""
Vehicle availability
"""
enum VehicleType {
  NONE
  BIKE
  CAR
  BOTH
}

"""
Availability time preference
"""
enum AvailabilityTime {
  ANYTIME
  WEEKENDS
  EVENINGS
  WEEKDAYS
}

type DailyAvailability {
  day: String!
  enabled: Boolean!
  startTime: String!
  endTime: String!
}

input DailyAvailabilityInput {
  day: String!
  enabled: Boolean!
  startTime: String!
  endTime: String!
}
`;
export const volunteerSchema = `# ===================================================================
# VOLUNTEER - TYPE DEFINITIONS
# ===================================================================

"""
Volunteer profile and information
"""
type Volunteer {
  id: ID!
  
  # User Link
  user: User
  
  # Personal Information
  name: String!
  contact: Phone!
  email: Email
  address: String!
  municipality: String!
  ward: Int
  dateOfBirth: DateTime
  gender: String
  
  # Emergency Contact
  emergencyContact: String
  emergencyPhone: Phone
  
  # Qualification & Experience
  experience: ExperienceLevel!
  experienceYears: Int
  vehicle: VehicleType!
  vehicleDetails: String
  skills: [String!]!
  certifications: [String!]!
  languages: [String!]!
  
  # Availability
  availableTime: AvailabilityTime!
  availableDays: [String!]!
  availabilitySchedule: [DailyAvailability!]!
  emergencyAvailability: Boolean!
  isAvailableNow: Boolean!
  assignedZone: String
  coverageRadius: Int!
  
  # Location (for dispatch)
  currentLat: Latitude
  currentLng: Longitude
  lastLocationUpdate: DateTime
  
  # Profile
  imageUrl: String
  bio: String
  
  # Verification & Status
  status: VolunteerStatus!
  verifiedAt: DateTime
  verifiedBy: User
  rejectedAt: DateTime
  rejectedBy: User
  rejectionReason: String
  
  # Performance Metrics
  totalRescues: Int!
  completedRescues: Int!
  cancelledRescues: Int!
  successRate: Float
  averageResponseTime: Int
  averageRescueTime: Int
  rating: Float
  totalRatings: Int!
  
  # Training & Certification
  trainingCompleted: Boolean!
  trainingDate: DateTime
  certificationExpiry: DateTime
  
  # Equipment
  hasEquipment: Boolean!
  equipment: [String!]!
  
  # Metadata
  createdAt: DateTime!
  updatedAt: DateTime!
  ratings: [RescueRating!]!
  mediaAssets: [MediaAsset!]!
  
  # Relations
  rescueAssignments(
    pagination: PaginationInput
    filter: RescueRequestFilterInput
  ): RescueRequestConnection!
  
  trainings(
    pagination: PaginationInput
  ): TrainingConnection!
}

"""
Volunteer statistics
"""
type VolunteerStats {
  total: Int!
  active: Int!
  verified: Int!
  pending: Int!
  suspended: Int!
  byMunicipality: [VolunteerMunicipalityStats!]!
  byExperience: [VolunteerExperienceStats!]!
  topPerformers: [VolunteerPerformance!]!
}

"""
Volunteer statistics by municipality
"""
type VolunteerMunicipalityStats {
  municipality: String!
  count: Int!
  activeCount: Int!
}

"""
Volunteer statistics by experience
"""
type VolunteerExperienceStats {
  experience: ExperienceLevel!
  count: Int!
}

"""
Volunteer performance metrics
"""
type VolunteerPerformance {
  volunteer: Volunteer!
  rescuesCompleted: Int!
  successRate: Float!
  averageResponseTime: Int!
  rating: Float!
}

"""
Available volunteers for dispatch
"""
type AvailableVolunteer {
  volunteer: Volunteer!
  distance: Float
  estimatedArrival: Int
  currentlyAssigned: Int!
  rankingScore: Float!
}
`;
export const volunteerInputs = `# ===================================================================
# VOLUNTEER - INPUT TYPES
# ===================================================================

"""
Input for volunteer application
"""
input ApplyVolunteerInput {
  # Personal Information
  name: String!
  contact: Phone!
  email: Email
  address: String!
  municipality: String!
  ward: Int
  dateOfBirth: DateTime
  gender: String
  
  # Emergency Contact
  emergencyContact: String
  emergencyPhone: Phone
  
  # Qualification & Experience
  experience: ExperienceLevel!
  experienceYears: Int
  vehicle: VehicleType!
  vehicleDetails: String
  skills: [String!]
  certifications: [String!]
  languages: [String!]
  
  # Availability
  availableTime: AvailabilityTime!
  availableDays: [String!]!
  emergencyAvailability: Boolean!
  assignedZone: String
  coverageRadius: Int
  
  # Profile
  imageUrl: String
  bio: String
  
  # Equipment
  hasEquipment: Boolean!
  equipment: [String!]
}

"""
Input for updating volunteer profile
"""
input UpdateVolunteerInput {
  contact: Phone
  email: Email
  address: String
  municipality: String
  ward: Int
  experience: String
  experienceYears: Int
  emergencyContact: String
  emergencyPhone: Phone
  vehicle: VehicleType
  vehicleDetails: String
  skills: [String!]
  certifications: [String!]
  languages: [String!]
  availableTime: AvailabilityTime
  availableDays: [String!]
  availabilitySchedule: [DailyAvailabilityInput!]
  emergencyAvailability: Boolean
  assignedZone: String
  coverageRadius: Int
  imageUrl: String
  bio: String
  hasEquipment: Boolean
  equipment: [String!]
  isAvailableNow: Boolean
}

"""
Input for updating volunteer availability
"""
input UpdateVolunteerAvailabilityInput {
  isAvailableNow: Boolean!
  currentLat: Latitude
  currentLng: Longitude
}

"""
Input for approving/rejecting volunteer
"""
input ReviewVolunteerInput {
  volunteerId: ID!
  approved: Boolean!
  notes: String
  assignedZone: String
}

"""
Filter input for volunteer queries
"""
input VolunteerFilterInput {
  status: VolunteerStatus
  statuses: [VolunteerStatus!]
  municipality: String
  municipalities: [String!]
  experience: ExperienceLevel
  isAvailableNow: Boolean
  emergencyAvailability: Boolean
  hasVehicle: Boolean
  hasEquipment: Boolean
  minSuccessRate: Float
  minRating: Float
  search: String
}

"""
Sort input for volunteer queries
"""
input VolunteerSortInput {
  field: VolunteerSortField!
  order: SortOrder!
}

"""
Fields available for sorting volunteers
"""
enum VolunteerSortField {
  NAME
  CREATED_AT
  TOTAL_RESCUES
  SUCCESS_RATE
  RATING
  BAYESIAN_RATING
  MUNICIPALITY
}

"""
Input for finding available volunteers
"""
input FindAvailableVolunteersInput {
  lat: Latitude!
  lng: Longitude!
  radiusKm: Float!
  requireVehicle: Boolean
  requireEquipment: Boolean
  minExperience: ExperienceLevel
  limit: Int
}
`;
export const volunteerQueries = `# ===================================================================
# VOLUNTEER - QUERIES
# ===================================================================

extend type Query {
  """
  Get volunteer by ID
  """
  volunteer(id: ID!): Volunteer
  
  """
  List all volunteers
  """
  volunteers(
    pagination: PaginationInput
    filter: VolunteerFilterInput
    sort: VolunteerSortInput
  ): VolunteerConnection! @auth(requires: [ADMIN, SUPER_ADMIN, DISTRICT_COORDINATOR])
  
  """
  Get my volunteer profile
  """
  myVolunteerProfile: Volunteer @auth
  
  """
  Get volunteer statistics
  """
  volunteerStats: VolunteerStats! @auth(requires: [ADMIN, SUPER_ADMIN, DISTRICT_COORDINATOR])
  
  """
  Find available volunteers near location
  """
  availableVolunteers(input: FindAvailableVolunteersInput!): [AvailableVolunteer!]! @auth(requires: [ADMIN, SUPER_ADMIN, DISTRICT_COORDINATOR])
  
  """
  Get pending volunteer applications
  """
  pendingVolunteerApplications(
    pagination: PaginationInput
  ): VolunteerConnection! @auth(requires: [ADMIN, SUPER_ADMIN, DISTRICT_COORDINATOR])
  
  """
  Search volunteers
  """
  searchVolunteers(
    query: String!
    pagination: PaginationInput
    filter: VolunteerFilterInput
  ): VolunteerConnection! @auth(requires: [ADMIN, SUPER_ADMIN, DISTRICT_COORDINATOR])
}

"""
Connection type for paginated volunteer results
"""
type VolunteerConnection {
  edges: [VolunteerEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

"""
Edge type for volunteer connection
"""
type VolunteerEdge {
  node: Volunteer!
  cursor: String!
}
`;
export const volunteerMutations = `# ===================================================================
# VOLUNTEER - MUTATIONS
# ===================================================================

extend type Mutation {
  """
  Apply to become a volunteer
  """
  applyVolunteer(input: ApplyVolunteerInput!): Volunteer! @auth
  
  """
  Update volunteer profile
  """
  updateVolunteerProfile(input: UpdateVolunteerInput!): Volunteer! @auth(requires: [VOLUNTEER, VERIFIED_RESCUER])
  
  """
  Update volunteer availability status
  """
  updateVolunteerAvailability(input: UpdateVolunteerAvailabilityInput!): Volunteer! @auth(requires: [VOLUNTEER, VERIFIED_RESCUER])
  
  """
  Approve or reject volunteer application
  """
  reviewVolunteerApplication(input: ReviewVolunteerInput!): Volunteer! @auth(requires: [ADMIN, SUPER_ADMIN, DISTRICT_COORDINATOR])
  
  """
  Verify volunteer (upgrade to verified rescuer)
  """
  verifyVolunteer(volunteerId: ID!, notes: String): Volunteer! @auth(requires: [ADMIN, SUPER_ADMIN, DISTRICT_COORDINATOR])
  
  """
  Suspend volunteer
  """
  suspendVolunteer(volunteerId: ID!, reason: String!): Volunteer! @auth(requires: [ADMIN, SUPER_ADMIN, DISTRICT_COORDINATOR])
  
  """
  Reactivate suspended volunteer
  """
  reactivateVolunteer(volunteerId: ID!): Volunteer! @auth(requires: [ADMIN, SUPER_ADMIN, DISTRICT_COORDINATOR])
  
  """
  Update volunteer zone assignment
  """
  updateVolunteerZone(volunteerId: ID!, zone: String!): Volunteer! @auth(requires: [ADMIN, SUPER_ADMIN, DISTRICT_COORDINATOR])
  
  """
  Rate volunteer after rescue completion
  """
  rateVolunteer(
    volunteerId: ID!
    rescueId: ID!
    rating: Int!
    feedback: String
    responseSpeed: Int
    professionalism: Int
    communication: Int
    safetyHandling: Int
  ): Volunteer! @auth
  
  """
  Bulk approve volunteers
  """
  bulkApproveVolunteers(volunteerIds: [ID!]!): BulkOperationResult! @auth(requires: [ADMIN, SUPER_ADMIN])
  
  """
  Delete volunteer profile (soft delete)
  """
  deleteVolunteer(volunteerId: ID!): SuccessResponse! @auth(requires: [SUPER_ADMIN])
}
`;
export const volunteerSubscriptions = `# ===================================================================
# VOLUNTEER - SUBSCRIPTIONS
# ===================================================================

extend type Subscription {
  """
  Subscribe to volunteer application submissions
  """
  volunteerApplicationReceived: Volunteer! @auth(requires: [ADMIN, SUPER_ADMIN, DISTRICT_COORDINATOR])
  
  """
  Subscribe to volunteer status changes
  """
  volunteerStatusChanged(volunteerId: ID): VolunteerStatusChangeEvent! @auth
  
  """
  Subscribe to volunteer availability changes
  """
  volunteerAvailabilityChanged(municipality: String): VolunteerAvailabilityEvent! @auth(requires: [ADMIN, SUPER_ADMIN, DISTRICT_COORDINATOR])
}

"""
Volunteer status change event
"""
type VolunteerStatusChangeEvent {
  volunteerId: ID!
  volunteer: Volunteer!
  oldStatus: VolunteerStatus!
  newStatus: VolunteerStatus!
  changedBy: User
  reason: String
  changedAt: DateTime!
}

"""
Volunteer availability change event
"""
type VolunteerAvailabilityEvent {
  volunteer: Volunteer!
  isAvailableNow: Boolean!
  currentLat: Latitude
  currentLng: Longitude
  changedAt: DateTime!
}
`;
export const volunteerFragments = `# ===================================================================
# VOLUNTEER - REUSABLE FRAGMENTS
# ===================================================================

"""
Core volunteer fields
"""
fragment VolunteerCore on Volunteer {
  id
  name
  contact
  municipality
  status
  experience
  isAvailableNow
  totalRescues
  rating
}

"""
Volunteer with location
"""
fragment VolunteerWithLocation on Volunteer {
  ...VolunteerCore
  address
  ward
  currentLat
  currentLng
  assignedZone
  coverageRadius
}

"""
Volunteer with performance
"""
fragment VolunteerWithPerformance on Volunteer {
  ...VolunteerCore
  completedRescues
  cancelledRescues
  successRate
  averageResponseTime
  averageRescueTime
  totalRatings
}

"""
Full volunteer profile
"""
fragment VolunteerFull on Volunteer {
  ...VolunteerWithLocation
  email
  dateOfBirth
  gender
  emergencyContact
  emergencyPhone
  experienceYears
  vehicle
  vehicleDetails
  skills
  certifications
  languages
  availableTime
  availableDays
  emergencyAvailability
  lastLocationUpdate
  imageUrl
  bio
  verifiedAt
  trainingCompleted
  trainingDate
  certificationExpiry
  hasEquipment
  equipment
  completedRescues
  successRate
  averageResponseTime
  rating
  createdAt
  updatedAt
}

"""
Volunteer for dispatch
"""
fragment VolunteerForDispatch on Volunteer {
  ...VolunteerWithLocation
  vehicle
  hasEquipment
  equipment
  isAvailableNow
  emergencyAvailability
  experienceYears
  rating
  successRate
}

"""
Volunteer list item
"""
fragment VolunteerListItem on Volunteer {
  ...VolunteerCore
  email
  vehicle
  verifiedAt
  createdAt
}
`;

// Combine all volunteer type definitions
export const volunteerTypeDefs = [
  volunteerEnums,
  volunteerSchema,
  volunteerInputs,
  volunteerQueries,
  volunteerMutations,
  volunteerSubscriptions,
  volunteerFragments,
].join('\n\n');

// Export operations for code generation
export const volunteerOperations = {
  queries: volunteerQueries,
  mutations: volunteerMutations,
  subscriptions: volunteerSubscriptions,
};

// Export fragments for reuse
export const volunteerFragmentDefinitions = volunteerFragments;
