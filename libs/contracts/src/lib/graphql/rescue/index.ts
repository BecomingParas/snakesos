// ===================================================================
// RESCUE - MODULE EXPORTS
// ===================================================================



export const rescueEnums = `# ===================================================================
# RESCUE - ENUMS
# ===================================================================

"""
Status of a rescue request
"""
enum RescueStatus {
  PENDING
  ASSIGNED
  ACCEPTED
  IN_PROGRESS
  COMPLETED
  CANCELLED
  CLOSED
  EXPIRED
}

"""
Priority level of a rescue request
"""
enum RescuePriority {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

"""
Outcome of a completed rescue
"""
enum RescueOutcome {
  RESCUED_RELOCATED
  ALREADY_GONE
  FALSE_ALARM
  NO_SNAKE_FOUND
  DECEASED
  REFUSED_HELP
}

"""
Snake size categories
"""
enum SnakeSize {
  SMALL
  MEDIUM
  LARGE
}

"""
Source of rescue request
"""
enum RescueSource {
  WEB
  APP
  PHONE
  TELEGRAM
}

enum PublicRescueStatus {
  OPEN
  RESPONDER_ASSIGNED
  IN_PROGRESS
  COMPLETED
}

enum PublicVenomStatus {
  VENOMOUS
  NON_VENOMOUS
  UNKNOWN
}
`;
export const rescueSchema = `# ===================================================================
# RESCUE - TYPE DEFINITIONS
# ===================================================================

"""
Snake rescue request
"""
type RescueRequest {
  id: ID!
  
  # Reporter Information
  user: User
  name: String!
  phone: Phone!
  email: Email
  
  # Location Details
  municipality: String!
  ward: Int
  address: String!
  landmark: String
  lat: Latitude
  lng: Longitude
  locationAccuracy: Float
  
  # Snake Information
  snakeDescription: String
  snakeSize: String
  snakeColor: String
  snakeImageUrl: String
  snakeImages: [String!]!
  
  # Species Identification
  species: SnakeSpecies
  aiIdentification: AIIdentification
  
  # Rescue Status
  status: RescueStatus!
  priority: RescuePriority!
  stillPresent: Boolean!
  notes: String
  internalNotes: String
  
  # Assignment
  assignedVolunteer: Volunteer
  assignedAt: DateTime
  assignedBy: User
  
  # Tracking
  acceptedAt: DateTime
  arrivedAt: DateTime
  startedAt: DateTime
  
  # Completion
  completedAt: DateTime
  outcome: RescueOutcome
  rescueReport: String
  rescueImages: [String!]!
  rescueDuration: Int
  rating: RescueRating
  
  # Hospital Information
  victimWentToHospital: Boolean
  hospitalId: String
  hospital: Hospital
  antivenomAdministered: Boolean
  antivenomType: String
  hospitalAdmission: Boolean
  hospitalNotes: String
  
  # Verification
  verifiedBy: User
  verifiedAt: DateTime
  
  # Emergency Details
  isEmergency: Boolean!
  emergencyDetails: String
  hasBite: Boolean!
  biteDetails: String
  
  # Metadata
  source: RescueSource!
  referenceNumber: String
  createdAt: DateTime!
  updatedAt: DateTime!
  
  # Relations
  timeline: [RescueTimeline!]!
  notifications: [Notification!]!
}

type PublicRescue {
  id: ID!
  referenceNumber: String!
  municipality: String!
  district: String
  generalArea: String
  species: SnakeSpecies
  venomStatus: PublicVenomStatus!
  priority: RescuePriority!
  publicStatus: PublicRescueStatus!
  approximateLatitude: Latitude
  approximateLongitude: Longitude
  assignedRescuerName: String
  createdAt: DateTime!
}

type RescueRating {
  id: ID!
  rescueId: ID!
  rescuerId: ID!
  rating: Int!
  feedback: String
  responseSpeed: Int
  professionalism: Int
  communication: Int
  safetyHandling: Int
  createdAt: DateTime!
}

"""
Timeline event for a rescue request
"""
type RescueTimeline {
  id: ID!
  rescue: RescueRequest!
  event: String!
  description: String
  metadata: JSON
  user: User
  lat: Latitude
  lng: Longitude
  createdAt: DateTime!
}

"""
Statistics for rescue operations
"""
type RescueStats {
  total: Int!
  pending: Int!
  inProgress: Int!
  completed: Int!
  cancelled: Int!
  averageResponseTime: Float
  averageRescueTime: Float
  successRate: Float
  byPriority: [RescuePriorityStats!]!
  byMunicipality: [RescueMunicipalityStats!]!
  bySpecies: [RescueSpeciesStats!]!
  recentActivity: [RescueActivityPoint!]!
}

"""
Rescue statistics by priority
"""
type RescuePriorityStats {
  priority: RescuePriority!
  count: Int!
  percentage: Float!
}

"""
Rescue statistics by municipality
"""
type RescueMunicipalityStats {
  municipality: String!
  count: Int!
  percentage: Float!
}

"""
Rescue statistics by species
"""
type RescueSpeciesStats {
  species: SnakeSpecies!
  count: Int!
  percentage: Float!
}

"""
Activity point for rescue timeline charts
"""
type RescueActivityPoint {
  date: DateTime!
  count: Int!
  completed: Int!
  pending: Int!
  cancelled: Int!
}

"""
Nearby rescue requests (for duplicate detection)
"""
type NearbyRescue {
  rescue: RescueRequest!
  distance: Float!
}
`;
export const rescueInputs = `# ===================================================================
# RESCUE - INPUT TYPES
# ===================================================================

"""
Input for creating a rescue request
"""
input CreateRescueRequestInput {
  # Reporter Information
  name: String!
  phone: Phone!
  email: Email
  
  # Location Details
  municipality: String!
  ward: Int
  address: String!
  landmark: String
  lat: Latitude
  lng: Longitude
  locationAccuracy: Float
  
  # Snake Information
  snakeDescription: String
  snakeSize: String
  snakeColor: String
  snakeImageUrl: String
  snakeImages: [String!]
  
  # Emergency Details
  isEmergency: Boolean
  emergencyDetails: String
  hasBite: Boolean
  biteDetails: String
  
  # Additional Notes
  notes: String
  
  # Source tracking
  source: RescueSource
}

"""
Input for updating a rescue request
"""
input UpdateRescueRequestInput {
  # Location Details
  municipality: String
  ward: Int
  address: String
  landmark: String
  lat: Latitude
  lng: Longitude
  
  # Snake Information
  snakeDescription: String
  snakeSize: String
  snakeColor: String
  snakeImageUrl: String
  snakeImages: [String!]
  speciesId: ID
  
  # Status
  status: RescueStatus
  priority: RescuePriority
  stillPresent: Boolean
  notes: String
  internalNotes: String
  
  # Emergency
  isEmergency: Boolean
  emergencyDetails: String
  hasBite: Boolean
  biteDetails: String
}

"""
Input for assigning a rescue to a volunteer
"""
input AssignRescueInput {
  rescueId: ID!
  volunteerId: ID!
  notes: String
}

"""
Input for volunteer accepting a rescue
"""
input AcceptRescueInput {
  rescueId: ID!
  estimatedArrival: Int
  currentLat: Latitude
  currentLng: Longitude
}

"""
Input for updating rescue progress
"""
input UpdateRescueProgressInput {
  rescueId: ID!
  status: RescueStatus!
  lat: Latitude
  lng: Longitude
  notes: String
}

"""
Input for completing a rescue
"""
input CompleteRescueInput {
  rescueId: ID!
  outcome: RescueOutcome!
  rescueReport: String!
  rescueImages: [String!]
  speciesId: ID
  releaseLat: Latitude
  releaseLng: Longitude
  releaseLocation: String
  victimWentToHospital: Boolean
  hospitalId: String
  antivenomAdministered: Boolean
  antivenomType: String
  hospitalAdmission: Boolean
  hospitalNotes: String
}

"""
Input for adding timeline event
"""
input AddTimelineEventInput {
  rescueId: ID!
  event: String!
  description: String
  metadata: JSON
  lat: Latitude
  lng: Longitude
}

"""
Filter input for rescue queries
"""
input RescueRequestFilterInput {
  status: RescueStatus
  statuses: [RescueStatus!]
  priority: RescuePriority
  priorities: [RescuePriority!]
  municipality: String
  municipalities: [String!]
  assignedTo: ID
  speciesId: ID
  isEmergency: Boolean
  hasBite: Boolean
  createdAfter: DateTime
  createdBefore: DateTime
  completedAfter: DateTime
  completedBefore: DateTime
  search: String
}

input PublicRescueFilterInput {
  status: PublicRescueStatus
  priority: RescuePriority
  municipality: String
  district: String
  speciesId: ID
  venomStatus: PublicVenomStatus
  unassigned: Boolean
}

input PublicRescueReportInput {
  name: String!
  phone: Phone!
  email: Email
  municipality: String!
  ward: Int
  generalArea: String!
  latitude: Latitude
  longitude: Longitude
  description: String
  urgency: RescuePriority
  isEmergency: Boolean
  hasBite: Boolean
}

input PublicEmergencyRequestInput {
  fullName: String!
  phone: Phone!
  email: Email
  municipality: String!
  district: String
  generalArea: String!
  address: String
  latitude: Latitude
  longitude: Longitude
  landmark: String
  snakeDescription: String
  snakeSpeciesId: ID
  urgency: RescuePriority!
  notes: String
  isEmergency: Boolean
  hasBite: Boolean
  idempotencyKey: String!
  deviceId: String
}

"""
Sort input for rescue queries
"""
input RescueSortInput {
  field: RescueSortField!
  order: SortOrder!
}

"""
Fields available for sorting rescues
"""
enum RescueSortField {
  CREATED_AT
  UPDATED_AT
  PRIORITY
  STATUS
  MUNICIPALITY
  ASSIGNED_AT
  COMPLETED_AT
}

"""
Input for searching nearby rescues
"""
input NearbyRescuesInput {
  lat: Latitude!
  lng: Longitude!
  radiusKm: Float!
  status: RescueStatus
  withinHours: Int
}

"""
Input for rescue statistics
"""
input RescueStatsInput {
  startDate: DateTime
  endDate: DateTime
  municipality: String
  volunteerId: ID
  speciesId: ID
}
`;
export const rescueQueries = `# ===================================================================
# RESCUE - QUERIES
# ===================================================================

extend type Query {
  publicRescues(
    pagination: PaginationInput
    filter: PublicRescueFilterInput
  ): PublicRescueConnection!

  """
  Get rescue request by ID
  """
  rescueRequest(id: ID!): RescueRequest
  
  """
  List rescue requests
  """
  rescueRequests(
    pagination: PaginationInput
    filter: RescueRequestFilterInput
    sort: RescueSortInput
  ): RescueRequestConnection!
  
  """
  Get my rescue requests (citizen view)
  """
  myRescueRequests(
    pagination: PaginationInput
    filter: RescueRequestFilterInput
  ): RescueRequestConnection! @auth
  
  """
  Get assigned rescues (volunteer view)
  """
  myAssignedRescues(
    pagination: PaginationInput
    filter: RescueRequestFilterInput
  ): RescueRequestConnection! @auth(requires: [VOLUNTEER, VERIFIED_RESCUER, DISTRICT_COORDINATOR])
  
  """
  Search rescue requests
  """
  searchRescues(
    query: String!
    pagination: PaginationInput
    filter: RescueRequestFilterInput
  ): RescueRequestConnection! @auth
  
  """
  Find nearby rescue requests (for duplicate detection)
  """
  nearbyRescues(input: NearbyRescuesInput!): [NearbyRescue!]!
  
  """
  Get rescue statistics
  """
  rescueStats(input: RescueStatsInput): RescueStats! @auth(requires: [ADMIN, SUPER_ADMIN, DISTRICT_COORDINATOR])
  
  """
  Get rescue timeline
  """
  rescueTimeline(rescueId: ID!): [RescueTimeline!]!
  
  """
  Get pending rescues count
  """
  pendingRescuesCount: Int!

  """
  Count of active emergency requests for the current dashboard role
  """
  emergencyRescuesCount: Int! @auth
  
  """
  Get active rescues (in progress)
  """
  activeRescues(
    pagination: PaginationInput
  ): RescueRequestConnection! @auth(requires: [ADMIN, SUPER_ADMIN, DISTRICT_COORDINATOR])
  
  """
  Get available rescues for queue (rescuer can self-accept)
  Shows PENDING unassigned rescues sorted by priority and age
  """
  availableRescues(
    pagination: PaginationInput
    filter: RescueRequestFilterInput
  ): RescueRequestConnection! @auth(requires: [VOLUNTEER, VERIFIED_RESCUER, DISTRICT_COORDINATOR])
  
  """
  Find available volunteers near a location
  Used for admin assignment
  """
  availableVolunteers(input: FindAvailableVolunteersInput!): [AvailableVolunteer!]! @auth(requires: [ADMIN, SUPER_ADMIN, DISTRICT_COORDINATOR])
}

type PublicRescueConnection {
  edges: [PublicRescueEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type PublicRescueEdge {
  node: PublicRescue!
  cursor: String!
}

"""
Connection type for paginated rescue results
"""
type RescueRequestConnection {
  edges: [RescueRequestEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

"""
Edge type for rescue connection
"""
type RescueRequestEdge {
  node: RescueRequest!
  cursor: String!
}
`;
export const rescueMutations = `# ===================================================================
# RESCUE - MUTATIONS
# ===================================================================

extend type Mutation {
  submitPublicEmergencyRequest(input: PublicEmergencyRequestInput!): PublicEmergencyRequestResult!

  submitPublicRescueReport(input: PublicRescueReportInput!): PublicRescueReportResult!

  """
  Create a new rescue request
  """
  createRescueRequest(input: CreateRescueRequestInput!): RescueRequest!
  
  """
  Update a rescue request
  """
  updateRescueRequest(id: ID!, input: UpdateRescueRequestInput!): RescueRequest! @auth
  
  """
  Assign rescue to volunteer (admin/coordinator)
  """
  assignRescue(input: AssignRescueInput!): RescueRequest! @auth(requires: [ADMIN, SUPER_ADMIN, DISTRICT_COORDINATOR])
  
  """
  Volunteer accepts rescue assignment (pre-assigned by admin)
  """
  acceptRescue(input: AcceptRescueInput!): RescueRequest! @auth(requires: [VOLUNTEER, VERIFIED_RESCUER])
  
  """
  Volunteer accepts rescue from queue (self-service)
  ATOMIC - prevents race condition when multiple rescuers try to accept same rescue
  """
  acceptFromQueue(input: AcceptRescueInput!): RescueRequest! @auth(requires: [VOLUNTEER, VERIFIED_RESCUER, DISTRICT_COORDINATOR])
  
  """
  Update rescue progress (volunteer)
  """
  updateRescueProgress(input: UpdateRescueProgressInput!): RescueRequest! @auth(requires: [VOLUNTEER, VERIFIED_RESCUER])
  
  """
  Mark rescue as completed
  """
  completeRescue(input: CompleteRescueInput!): RescueRequest! @auth(requires: [VOLUNTEER, VERIFIED_RESCUER])
  
  """
  Cancel rescue request
  """
  cancelRescue(rescueId: ID!, reason: String): RescueRequest! @auth
  
  """
  Reopen cancelled/closed rescue
  """
  reopenRescue(rescueId: ID!): RescueRequest! @auth(requires: [ADMIN, SUPER_ADMIN, DISTRICT_COORDINATOR])
  
  """
  Verify completed rescue (admin)
  """
  verifyRescue(rescueId: ID!, notes: String): RescueRequest! @auth(requires: [VERIFIED_RESCUER, DISTRICT_COORDINATOR, ADMIN, SUPER_ADMIN])
  
  """
  Add timeline event to rescue
  """
  addRescueTimelineEvent(input: AddTimelineEventInput!): RescueTimeline! @auth
  
  """
  Bulk assign rescues to volunteer
  """
  bulkAssignRescues(rescueIds: [ID!]!, volunteerId: ID!): BulkOperationResult! @auth(requires: [ADMIN, SUPER_ADMIN, DISTRICT_COORDINATOR])
  
  """
  Bulk update rescue status
  """
  bulkUpdateRescueStatus(rescueIds: [ID!]!, status: RescueStatus!): BulkOperationResult! @auth(requires: [ADMIN, SUPER_ADMIN])
  
  """
  Delete rescue request (soft delete, admin only)
  """
  deleteRescueRequest(id: ID!): SuccessResponse! @auth(requires: [SUPER_ADMIN])
}

type PublicRescueReportResult {
  success: Boolean!
  referenceNumber: String!
  publicStatus: PublicRescueStatus!
  createdAt: DateTime!
}

type PublicEmergencyRequestResult {
  success: Boolean!
  referenceNumber: String!
  publicStatus: PublicRescueStatus!
  createdAt: DateTime!
}
`;
export const rescueSubscriptions = `# ===================================================================
# RESCUE - SUBSCRIPTIONS
# ===================================================================

extend type Subscription {
  """
  Subscribe to new rescue requests
  """
  rescueCreated(municipality: String): RescueRequest! @auth(requires: [VOLUNTEER, VERIFIED_RESCUER, DISTRICT_COORDINATOR, ADMIN, SUPER_ADMIN])
  
  """
  Subscribe to rescue status changes
  """
  rescueUpdated(rescueId: ID): RescueRequest! @auth
  
  """
  Subscribe to rescue assignments (volunteer)
  """
  rescueAssigned(volunteerId: ID!): RescueAssignmentEvent! @auth(requires: [VOLUNTEER, VERIFIED_RESCUER])
  
  """
  Subscribe to rescue timeline updates
  """
  rescueTimelineUpdated(rescueId: ID!): RescueTimeline! @auth
  
  """
  Subscribe to nearby rescues (for volunteers)
  """
  nearbyRescuesUpdated(lat: Latitude!, lng: Longitude!, radiusKm: Float!): RescueRequest! @auth(requires: [VOLUNTEER, VERIFIED_RESCUER])
  
  """
  Subscribe to emergency rescues (high priority)
  """
  emergencyRescueCreated: RescueRequest! @auth(requires: [VERIFIED_RESCUER, DISTRICT_COORDINATOR, ADMIN, SUPER_ADMIN])
}

"""
Rescue assignment event
"""
type RescueAssignmentEvent {
  rescue: RescueRequest!
  volunteer: Volunteer!
  assignedBy: User!
  assignedAt: DateTime!
  notes: String
}
`;
export const rescueFragments = `# ===================================================================
# RESCUE - REUSABLE FRAGMENTS
# ===================================================================

"""
Core rescue fields
"""
fragment RescueCore on RescueRequest {
  id
  name
  phone
  municipality
  address
  status
  priority
  isEmergency
  createdAt
}

"""
Rescue with location
"""
fragment RescueWithLocation on RescueRequest {
  ...RescueCore
  ward
  landmark
  lat
  lng
  locationAccuracy
}

"""
Rescue with snake info
"""
fragment RescueWithSnakeInfo on RescueRequest {
  ...RescueWithLocation
  snakeDescription
  snakeSize
  snakeColor
  snakeImageUrl
  snakeImages
  species {
    id
    name
    scientificName
    venomous
    dangerLevel
  }
}

"""
Rescue with assignment
"""
fragment RescueWithAssignment on RescueRequest {
  ...RescueCore
  assignedVolunteer {
    id
    name
    contact
    currentLat
    currentLng
  }
  assignedAt
  acceptedAt
}

"""
Full rescue details
"""
fragment RescueFull on RescueRequest {
  ...RescueWithSnakeInfo
  email
  stillPresent
  notes
  internalNotes
  assignedVolunteer {
    id
    name
    contact
    vehicle
  }
  assignedAt
  acceptedAt
  arrivedAt
  startedAt
  completedAt
  outcome
  rescueReport
  rescueImages
  rescueDuration
  verifiedAt
  emergencyDetails
  hasBite
  biteDetails
  source
  referenceNumber
  updatedAt
}

"""
Rescue timeline event
"""
fragment TimelineEvent on RescueTimeline {
  id
  event
  description
  metadata
  user {
    id
    name
  }
  lat
  lng
  createdAt
}

"""
Rescue for list view
"""
fragment RescueListItem on RescueRequest {
  ...RescueCore
  ward
  lat
  lng
  snakeImageUrl
  species {
    id
    name
    venomous
  }
  assignedVolunteer {
    id
    name
  }
  referenceNumber
  updatedAt
}
`;

// Combine all rescue type definitions
export const rescueTypeDefs = [
  rescueEnums,
  rescueSchema,
  rescueInputs,
  rescueQueries,
  rescueMutations,
  rescueSubscriptions,
  rescueFragments,
].join('\n\n');

// Export operations for code generation
export const rescueOperations = {
  queries: rescueQueries,
  mutations: rescueMutations,
  subscriptions: rescueSubscriptions,
};

// Export fragments for reuse
export const rescueFragmentDefinitions = rescueFragments;
