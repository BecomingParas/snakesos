// ===================================================================
// TRAINING - MODULE EXPORTS
// ===================================================================



export const trainingEnums = `# ===================================================================
# TRAINING - ENUMS
# ===================================================================

"""
Type of training
"""
enum TrainingType {
  BASIC
  ADVANCED
  REFRESHER
  FIRST_AID
  SPECIES_IDENTIFICATION
  EQUIPMENT_HANDLING
  SAFETY_PROTOCOLS
  DOCUMENTATION
}

"""
Status of training session
"""
enum TrainingStatus {
  SCHEDULED
  ONGOING
  COMPLETED
  CANCELLED
  POSTPONED
}
`;
export const trainingSchema = `# ===================================================================
# TRAINING - TYPE DEFINITIONS
# ===================================================================

"""
Training session
"""
type Training {
  id: ID!
  
  title: String!
  description: String
  type: TrainingType!
  
  # Schedule
  scheduledAt: DateTime!
  duration: Int!
  location: String!
  instructor: String
  
  # Capacity
  maxParticipants: Int!
  registeredCount: Int!
  availableSeats: Int!
  
  # Status
  status: TrainingStatus!
  
  # Materials
  materials: [String!]!
  certificate: String
  
  # Metadata
  createdAt: DateTime!
  updatedAt: DateTime!
  
  # Relations
  participants: [User!]!
  volunteers: [Volunteer!]!
}

"""
Training statistics
"""
type TrainingStats {
  totalSessions: Int!
  upcomingSession: Int!
  completedSessions: Int!
  totalParticipants: Int!
  averageAttendance: Float!
  byType: [TrainingByType!]!
  recentSessions: [Training!]!
}

"""
Training count by type
"""
type TrainingByType {
  type: TrainingType!
  count: Int!
  totalParticipants: Int!
}
`;
export const trainingInputs = `# ===================================================================
# TRAINING - INPUT TYPES
# ===================================================================

"""
Input for creating a training session
"""
input CreateTrainingInput {
  title: String!
  description: String
  type: TrainingType!
  scheduledAt: DateTime!
  duration: Int!
  location: String!
  instructor: String
  maxParticipants: Int!
  materials: [String!]
  certificate: String
}

"""
Input for updating a training session
"""
input UpdateTrainingInput {
  title: String
  description: String
  type: TrainingType
  scheduledAt: DateTime
  duration: Int
  location: String
  instructor: String
  maxParticipants: Int
  status: TrainingStatus
  materials: [String!]
  certificate: String
}

"""
Filter input for training queries
"""
input TrainingFilterInput {
  type: TrainingType
  types: [TrainingType!]
  status: TrainingStatus
  statuses: [TrainingStatus!]
  scheduledAfter: DateTime
  scheduledBefore: DateTime
  location: String
  hasAvailableSeats: Boolean
}

"""
Sort input for training queries
"""
input TrainingSortInput {
  field: TrainingSortField!
  order: SortOrder!
}

"""
Fields available for sorting training sessions
"""
enum TrainingSortField {
  SCHEDULED_AT
  CREATED_AT
  REGISTERED_COUNT
  TITLE
}
`;
export const trainingQueries = `# ===================================================================
# TRAINING - QUERIES
# ===================================================================

extend type Query {
  """
  Get training session by ID
  """
  training(id: ID!): Training
  
  """
  List training sessions
  """
  trainings(
    pagination: PaginationInput
    filter: TrainingFilterInput
    sort: TrainingSortInput
  ): TrainingConnection! @auth(requires: [ADMIN, SUPER_ADMIN, DISTRICT_COORDINATOR])
  
  """
  Get upcoming training sessions (public)
  """
  upcomingTrainings(
    pagination: PaginationInput
  ): TrainingConnection!
  
  """
  Get my enrolled trainings
  """
  myTrainings(
    pagination: PaginationInput
  ): TrainingConnection! @auth
  
  """
  Get training statistics
  """
  trainingStats: TrainingStats! @auth(requires: [ADMIN, SUPER_ADMIN, DISTRICT_COORDINATOR])
}

"""
Connection type for paginated training results
"""
type TrainingConnection {
  edges: [TrainingEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

"""
Edge type for training connection
"""
type TrainingEdge {
  node: Training!
  cursor: String!
}
`;
export const trainingMutations = `# ===================================================================
# TRAINING - MUTATIONS
# ===================================================================

extend type Mutation {
  """
  Create a training session
  """
  createTraining(input: CreateTrainingInput!): Training! @auth(requires: [ADMIN, SUPER_ADMIN, DISTRICT_COORDINATOR])
  
  """
  Update a training session
  """
  updateTraining(id: ID!, input: UpdateTrainingInput!): Training! @auth(requires: [ADMIN, SUPER_ADMIN, DISTRICT_COORDINATOR])
  
  """
  Enroll in training session
  """
  enrollInTraining(trainingId: ID!): Training! @auth
  
  """
  Cancel training enrollment
  """
  cancelTrainingEnrollment(trainingId: ID!): Training! @auth
  
  """
  Mark training as completed (admin)
  """
  completeTraining(trainingId: ID!): Training! @auth(requires: [ADMIN, SUPER_ADMIN, DISTRICT_COORDINATOR])
  
  """
  Cancel training session
  """
  cancelTraining(trainingId: ID!, reason: String): Training! @auth(requires: [ADMIN, SUPER_ADMIN, DISTRICT_COORDINATOR])
  
  """
  Delete training session (soft delete)
  """
  deleteTraining(id: ID!): SuccessResponse! @auth(requires: [SUPER_ADMIN])
}
`;
export const trainingSubscriptions = `# ===================================================================
# TRAINING - SUBSCRIPTIONS
# ===================================================================

extend type Subscription {
  """
  Subscribe to new training sessions
  """
  trainingCreated: Training! @auth
  
  """
  Subscribe to training updates
  """
  trainingUpdated(id: ID): Training! @auth
  
  """
  Subscribe to training enrollments
  """
  trainingEnrollmentReceived(trainingId: ID!): TrainingEnrollmentEvent! @auth(requires: [ADMIN, SUPER_ADMIN, DISTRICT_COORDINATOR])
}

"""
Training enrollment event
"""
type TrainingEnrollmentEvent {
  training: Training!
  user: User!
  enrolledAt: DateTime!
  availableSeats: Int!
}
`;
export const trainingFragments = `# ===================================================================
# TRAINING - REUSABLE FRAGMENTS
# ===================================================================

"""
Core training fields
"""
fragment TrainingCore on Training {
  id
  title
  type
  scheduledAt
  duration
  location
  status
  maxParticipants
  registeredCount
  availableSeats
}

"""
Training with details
"""
fragment TrainingWithDetails on Training {
  ...TrainingCore
  description
  instructor
  materials
  certificate
  createdAt
}

"""
Full training details
"""
fragment TrainingFull on Training {
  ...TrainingWithDetails
  participants {
    id
    name
    email
  }
  volunteers {
    id
    name
    contact
  }
  updatedAt
}

"""
Training list item
"""
fragment TrainingListItem on Training {
  ...TrainingCore
  instructor
}
`;

// Combine all training type definitions
export const trainingTypeDefs = [
  trainingEnums,
  trainingSchema,
  trainingInputs,
  trainingQueries,
  trainingMutations,
  trainingSubscriptions,
  trainingFragments,
].join('\n\n');

// Export operations for code generation
export const trainingOperations = {
  queries: trainingQueries,
  mutations: trainingMutations,
  subscriptions: trainingSubscriptions,
};

// Export fragments for reuse
export const trainingFragmentDefinitions = trainingFragments;
