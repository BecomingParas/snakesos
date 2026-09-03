// ===================================================================
// AI - MODULE EXPORTS
// ===================================================================



export const aiEnums = `# ===================================================================
# AI - ENUMS
# ===================================================================

"""
AI provider for snake identification
"""
enum AIProvider {
  GEMINI
  OPENAI
  CLAUDE
  LOCAL
  CUSTOM
}

"""
User feedback on AI identification accuracy
"""
enum IdentificationFeedback {
  CORRECT
  INCORRECT
  PARTIAL
  UNSURE
}

"""
Upload source for identification
"""
enum UploadSource {
  WEB
  APP
  API
  TELEGRAM
}
`;
export const aiSchema = `# ===================================================================
# AI - TYPE DEFINITIONS
# ===================================================================

"""
AI-powered snake identification result
"""
type AIIdentification {
  id: ID!
  
  # Input
  imageUrl: String!
  imageThumbnail: String
  uploadSource: UploadSource!
  
  # Results
  species: SnakeSpecies
  confidence: Float!
  
  # Alternative Matches
  alternativeMatches: [AlternativeMatch!]!
  
  # AI Provider Details
  provider: AIProvider!
  model: String!
  promptUsed: String
  responseTime: Int
  
  # Additional Analysis
  venomousDetected: Boolean
  dangerAssessment: String
  colorDetected: [String!]!
  sizeEstimate: String
  
  # User Context
  user: User
  
  # Feedback
  userFeedback: IdentificationFeedback
  correctSpecies: SnakeSpecies
  
  # Metadata
  createdAt: DateTime!
  
  # Relations
  rescueRequest: RescueRequest
}

"""
Alternative species match from AI
"""
type AlternativeMatch {
  species: SnakeSpecies!
  confidence: Float!
  reasoning: String
}

"""
AI identification statistics
"""
type AIIdentificationStats {
  total: Int!
  byProvider: [IdentificationByProvider!]!
  averageConfidence: Float!
  accuracyRate: Float
  topIdentifiedSpecies: [SpeciesIdentificationCount!]!
  averageResponseTime: Int!
}

"""
Identification count by provider
"""
type IdentificationByProvider {
  provider: AIProvider!
  count: Int!
  averageConfidence: Float!
  averageResponseTime: Int!
}

"""
Species identification count
"""
type SpeciesIdentificationCount {
  species: SnakeSpecies!
  count: Int!
  averageConfidence: Float!
}

"""
AI model configuration
"""
type AIModelConfig {
  provider: AIProvider!
  model: String!
  enabled: Boolean!
  maxImageSize: Int!
  supportedFormats: [String!]!
  averageResponseTime: Int
  accuracy: Float
}
`;
export const aiInputs = `# ===================================================================
# AI - INPUT TYPES
# ===================================================================

"""
Input for identifying snake from image
"""
input IdentifySnakeInput {
  imageUrl: String!
  uploadSource: UploadSource
  userId: ID
  includeAlternatives: Boolean
  minConfidence: Float
}

"""
Input for providing feedback on identification
"""
input IdentificationFeedbackInput {
  identificationId: ID!
  feedback: IdentificationFeedback!
  correctSpeciesId: ID
  notes: String
}

"""
Filter input for AI identification queries
"""
input AIIdentificationFilterInput {
  provider: AIProvider
  providers: [AIProvider!]
  minConfidence: Float
  maxConfidence: Float
  hasFeedback: Boolean
  feedback: IdentificationFeedback
  speciesId: ID
  userId: ID
  uploadSource: UploadSource
  createdAfter: DateTime
  createdBefore: DateTime
}

"""
Sort input for AI identification queries
"""
input AIIdentificationSortInput {
  field: AIIdentificationSortField!
  order: SortOrder!
}

"""
Fields available for sorting AI identifications
"""
enum AIIdentificationSortField {
  CREATED_AT
  CONFIDENCE
  RESPONSE_TIME
  PROVIDER
}

"""
Input for AI model configuration
"""
input UpdateAIModelConfigInput {
  provider: AIProvider!
  model: String
  enabled: Boolean
  maxImageSize: Int
  supportedFormats: [String!]
}
`;
export const aiQueries = `# ===================================================================
# AI - QUERIES
# ===================================================================

extend type Query {
  """
  Get AI identification by ID
  """
  aiIdentification(id: ID!): AIIdentification
  
  """
  List AI identifications
  """
  aiIdentifications(
    pagination: PaginationInput
    filter: AIIdentificationFilterInput
    sort: AIIdentificationSortInput
  ): AIIdentificationConnection! @auth(requires: [ADMIN, SUPER_ADMIN])
  
  """
  Get my identification history
  """
  myIdentificationHistory(
    pagination: PaginationInput
  ): AIIdentificationConnection! @auth
  
  """
  Get AI identification statistics
  """
  aiIdentificationStats: AIIdentificationStats! @auth(requires: [ADMIN, SUPER_ADMIN])
  
  """
  Get available AI models
  """
  availableAIModels: [AIModelConfig!]!
  
  """
  Get AI model configuration
  """
  aiModelConfig(provider: AIProvider!): AIModelConfig @auth(requires: [ADMIN, SUPER_ADMIN])
}

"""
Connection type for paginated AI identification results
"""
type AIIdentificationConnection {
  edges: [AIIdentificationEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

"""
Edge type for AI identification connection
"""
type AIIdentificationEdge {
  node: AIIdentification!
  cursor: String!
}
`;
export const aiMutations = `# ===================================================================
# AI - MUTATIONS
# ===================================================================

extend type Mutation {
  """
  Identify snake from image using AI
  """
  identifySnake(input: IdentifySnakeInput!): AIIdentification!
  
  """
  Provide feedback on AI identification
  """
  provideIdentificationFeedback(input: IdentificationFeedbackInput!): AIIdentification! @auth
  
  """
  Update AI model configuration (admin only)
  """
  updateAIModelConfig(input: UpdateAIModelConfigInput!): AIModelConfig! @auth(requires: [SUPER_ADMIN])
  
  """
  Reprocess identification with different model
  """
  reprocessIdentification(identificationId: ID!, provider: AIProvider!): AIIdentification! @auth(requires: [ADMIN, SUPER_ADMIN])
  
  """
  Delete AI identification
  """
  deleteAIIdentification(id: ID!): SuccessResponse! @auth(requires: [SUPER_ADMIN])
}
`;
export const aiSubscriptions = `# ===================================================================
# AI - SUBSCRIPTIONS
# ===================================================================

extend type Subscription {
  """
  Subscribe to new AI identifications
  """
  aiIdentificationCompleted(userId: ID): AIIdentification! @auth
  
  """
  Subscribe to identification feedback events
  """
  identificationFeedbackReceived: IdentificationFeedbackEvent! @auth(requires: [ADMIN, SUPER_ADMIN])
}

"""
Identification feedback event
"""
type IdentificationFeedbackEvent {
  identification: AIIdentification!
  feedback: IdentificationFeedback!
  user: User!
  correctSpecies: SnakeSpecies
  providedAt: DateTime!
}
`;
export const aiFragments = `# ===================================================================
# AI - REUSABLE FRAGMENTS
# ===================================================================

"""
Core AI identification fields
"""
fragment AIIdentificationCore on AIIdentification {
  id
  imageUrl
  imageThumbnail
  confidence
  provider
  model
  createdAt
}

"""
AI identification with species
"""
fragment AIIdentificationWithSpecies on AIIdentification {
  ...AIIdentificationCore
  species {
    id
    name
    scientificName
    venomous
    dangerLevel
    imageUrl
  }
  venomousDetected
  dangerAssessment
}

"""
AI identification with alternatives
"""
fragment AIIdentificationWithAlternatives on AIIdentification {
  ...AIIdentificationWithSpecies
  alternativeMatches {
    species {
      id
      name
      scientificName
      venomous
      dangerLevel
    }
    confidence
    reasoning
  }
}

"""
Full AI identification details
"""
fragment AIIdentificationFull on AIIdentification {
  ...AIIdentificationWithAlternatives
  uploadSource
  promptUsed
  responseTime
  colorDetected
  sizeEstimate
  user {
    id
    name
    email
  }
  userFeedback
  correctSpecies {
    id
    name
    scientificName
  }
}

"""
AI identification list item
"""
fragment AIIdentificationListItem on AIIdentification {
  ...AIIdentificationCore
  species {
    id
    name
    venomous
  }
  userFeedback
}
`;

// Combine all AI type definitions
export const aiTypeDefs = [
  aiEnums,
  aiSchema,
  aiInputs,
  aiQueries,
  aiMutations,
  aiSubscriptions,
  aiFragments,
].join('\n\n');

// Export operations for code generation
export const aiOperations = {
  queries: aiQueries,
  mutations: aiMutations,
  subscriptions: aiSubscriptions,
};

// Export fragments for reuse
export const aiFragmentDefinitions = aiFragments;
