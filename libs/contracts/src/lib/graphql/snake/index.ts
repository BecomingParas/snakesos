// ===================================================================
// SNAKE - MODULE EXPORTS
// ===================================================================



export const snakeEnums = `# ===================================================================
# SNAKE - ENUMS
# ===================================================================

"""
Danger level of snake species
"""
enum DangerLevel {
  HARMLESS
  MILDLY_VENOMOUS
  MEDICALLY_SIGNIFICANT
  HIGHLY_DANGEROUS
}

"""
Venom type
"""
enum VenomType {
  NEUROTOXIC
  HEMOTOXIC
  CYTOTOXIC
  MIXED
}

"""
Activity pattern
"""
enum ActivityPattern {
  NOCTURNAL
  DIURNAL
  CREPUSCULAR
  BOTH
}

"""
Conservation status
"""
enum ConservationStatus {
  LEAST_CONCERN
  NEAR_THREATENED
  VULNERABLE
  ENDANGERED
  CRITICALLY_ENDANGERED
  EXTINCT_IN_WILD
  EXTINCT
  DATA_DEFICIENT
}
`;
export const snakeSchema = `# ===================================================================
# SNAKE - TYPE DEFINITIONS
# ===================================================================

"""
Snake species information
"""
type SnakeSpecies {
  id: ID!
  
  # Nomenclature
  name: String!
  scientificName: String!
  nepaliName: String!
  localNames: [String!]!
  aliases: [String!]!
  
  # Classification
  family: String
  genus: String
  species: String
  
  # Danger Assessment
  venomous: Boolean!
  dangerLevel: DangerLevel
  venomType: VenomType
  
  # Physical Characteristics
  averageLength: String
  maxLength: String
  color: String
  pattern: String
  identificationGuide: String
  distinctiveFeatures: [String!]!
  
  # Behavior & Habitat
  behavior: String
  habitat: String
  activeTime: ActivityPattern
  diet: String
  
  # Safety Information
  safetyTips: String
  emergencyAdvice: String
  firstAidSteps: [String!]!
  
  # Distribution
  foundInNepal: Boolean!
  regions: [String!]!
  altitudeRange: String
  
  # Conservation
  conservationStatus: ConservationStatus
  protected: Boolean!
  
  # Media
  imageUrl: String
  images: [String!]!
  videoUrl: String
  
  # Statistics
  rescueCount: Int!
  identificationCount: Int!
  
  # Metadata
  verified: Boolean!
  verifiedBy: User
  createdAt: DateTime!
  updatedAt: DateTime!
  
  # Relations
  rescueRequests(
    pagination: PaginationInput
  ): RescueRequestConnection!
  
  aiIdentifications(
    pagination: PaginationInput
  ): AIIdentificationConnection!
}

"""
Snake species statistics
"""
type SnakeSpeciesStats {
  totalSpecies: Int!
  venomousCount: Int!
  harmlessCount: Int!
  byDangerLevel: [SpeciesByDangerLevel!]!
  byFamily: [SpeciesByFamily!]!
  mostEncountered: [SnakeSpecies!]!
}

"""
Species count by danger level
"""
type SpeciesByDangerLevel {
  dangerLevel: DangerLevel!
  count: Int!
}

"""
Species count by family
"""
type SpeciesByFamily {
  family: String!
  count: Int!
  venomousCount: Int!
}
`;
export const snakeInputs = `# ===================================================================
# SNAKE - INPUT TYPES
# ===================================================================

"""
Input for creating snake species
"""
input CreateSnakeSpeciesInput {
  # Nomenclature
  name: String!
  scientificName: String!
  nepaliName: String!
  localNames: [String!]
  aliases: [String!]
  
  # Classification
  family: String
  genus: String
  species: String
  
  # Danger Assessment
  venomous: Boolean!
  dangerLevel: DangerLevel
  venomType: VenomType
  
  # Physical Characteristics
  averageLength: String
  maxLength: String
  color: String
  pattern: String
  identificationGuide: String
  distinctiveFeatures: [String!]
  
  # Behavior & Habitat
  behavior: String
  habitat: String
  activeTime: ActivityPattern
  diet: String
  
  # Safety Information
  safetyTips: String
  emergencyAdvice: String
  firstAidSteps: [String!]
  
  # Distribution
  foundInNepal: Boolean
  regions: [String!]
  altitudeRange: String
  
  # Conservation
  conservationStatus: ConservationStatus
  protected: Boolean
  
  # Media
  imageUrl: String
  images: [String!]
  videoUrl: String
}

"""
Input for updating snake species
"""
input UpdateSnakeSpeciesInput {
  name: String
  scientificName: String
  nepaliName: String
  localNames: [String!]
  aliases: [String!]
  family: String
  genus: String
  species: String
  venomous: Boolean
  dangerLevel: DangerLevel
  venomType: VenomType
  averageLength: String
  maxLength: String
  color: String
  pattern: String
  identificationGuide: String
  distinctiveFeatures: [String!]
  behavior: String
  habitat: String
  activeTime: ActivityPattern
  diet: String
  safetyTips: String
  emergencyAdvice: String
  firstAidSteps: [String!]
  foundInNepal: Boolean
  regions: [String!]
  altitudeRange: String
  conservationStatus: ConservationStatus
  protected: Boolean
  imageUrl: String
  images: [String!]
  videoUrl: String
}

"""
Filter input for snake species queries
"""
input SnakeSpeciesFilterInput {
  venomous: Boolean
  dangerLevel: DangerLevel
  dangerLevels: [DangerLevel!]
  family: String
  foundInNepal: Boolean
  protected: Boolean
  verified: Boolean
  region: String
  search: String
}

"""
Sort input for snake species queries
"""
input SnakeSpeciesSortInput {
  field: SnakeSpeciesSortField!
  order: SortOrder!
}

"""
Fields available for sorting snake species
"""
enum SnakeSpeciesSortField {
  NAME
  SCIENTIFIC_NAME
  RESCUE_COUNT
  IDENTIFICATION_COUNT
  DANGER_LEVEL
  CREATED_AT
}
`;
export const snakeQueries = `# ===================================================================
# SNAKE - QUERIES
# ===================================================================

extend type Query {
  """
  Get snake species by ID
  """
  snakeSpecies(id: ID!): SnakeSpecies
  
  """
  List all snake species
  """
  allSnakeSpecies(
    pagination: PaginationInput
    filter: SnakeSpeciesFilterInput
    sort: SnakeSpeciesSortInput
  ): SnakeSpeciesConnection!
  
  """
  Search snake species
  """
  searchSnakeSpecies(
    query: String!
    pagination: PaginationInput
    filter: SnakeSpeciesFilterInput
  ): SnakeSpeciesConnection!
  
  """
  Get venomous snake species
  """
  venomousSnakes(
    pagination: PaginationInput
  ): SnakeSpeciesConnection!
  
  """
  Get snake species by danger level
  """
  snakesByDangerLevel(
    dangerLevel: DangerLevel!
    pagination: PaginationInput
  ): SnakeSpeciesConnection!
  
  """
  Get snake species statistics
  """
  snakeSpeciesStats: SnakeSpeciesStats! @auth(requires: [ADMIN, SUPER_ADMIN])
  
  """
  Get snake species by region
  """
  snakeSpeciesByRegion(
    region: String!
    pagination: PaginationInput
  ): SnakeSpeciesConnection!
}

"""
Connection type for paginated snake species results
"""
type SnakeSpeciesConnection {
  edges: [SnakeSpeciesEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

"""
Edge type for snake species connection
"""
type SnakeSpeciesEdge {
  node: SnakeSpecies!
  cursor: String!
}
`;
export const snakeMutations = `# ===================================================================
# SNAKE - MUTATIONS
# ===================================================================

extend type Mutation {
  """
  Create new snake species (admin only)
  """
  createSnakeSpecies(input: CreateSnakeSpeciesInput!): SnakeSpecies! @auth(requires: [ADMIN, SUPER_ADMIN])
  
  """
  Update snake species (admin only)
  """
  updateSnakeSpecies(id: ID!, input: UpdateSnakeSpeciesInput!): SnakeSpecies! @auth(requires: [ADMIN, SUPER_ADMIN])
  
  """
  Verify snake species (admin only)
  """
  verifySnakeSpecies(id: ID!): SnakeSpecies! @auth(requires: [ADMIN, SUPER_ADMIN])
  
  """
  Delete snake species (soft delete, admin only)
  """
  deleteSnakeSpecies(id: ID!): SuccessResponse! @auth(requires: [SUPER_ADMIN])
  
  """
  Bulk import snake species
  """
  bulkImportSnakeSpecies(species: [CreateSnakeSpeciesInput!]!): BulkOperationResult! @auth(requires: [SUPER_ADMIN])
}
`;
export const snakeSubscriptions = `# ===================================================================
# SNAKE - SUBSCRIPTIONS
# ===================================================================

extend type Subscription {
  """
  Subscribe to new snake species additions
  """
  snakeSpeciesAdded: SnakeSpecies! @auth(requires: [ADMIN, SUPER_ADMIN])
  
  """
  Subscribe to snake species updates
  """
  snakeSpeciesUpdated(id: ID): SnakeSpecies! @auth
}
`;
export const snakeFragments = `# ===================================================================
# SNAKE - REUSABLE FRAGMENTS
# ===================================================================

"""
Core snake species fields
"""
fragment SnakeSpeciesCore on SnakeSpecies {
  id
  name
  scientificName
  nepaliName
  venomous
  dangerLevel
  imageUrl
}

"""
Snake species with identification info
"""
fragment SnakeSpeciesIdentification on SnakeSpecies {
  ...SnakeSpeciesCore
  color
  pattern
  distinctiveFeatures
  identificationGuide
  averageLength
  maxLength
}

"""
Snake species with safety info
"""
fragment SnakeSpeciesSafety on SnakeSpecies {
  ...SnakeSpeciesCore
  venomType
  safetyTips
  emergencyAdvice
  firstAidSteps
}

"""
Full snake species details
"""
fragment SnakeSpeciesFull on SnakeSpecies {
  ...SnakeSpeciesIdentification
  localNames
  aliases
  family
  genus
  species
  venomType
  behavior
  habitat
  activeTime
  diet
  safetyTips
  emergencyAdvice
  firstAidSteps
  foundInNepal
  regions
  altitudeRange
  conservationStatus
  protected
  images
  videoUrl
  rescueCount
  identificationCount
  verified
  createdAt
  updatedAt
}

"""
Snake species list item
"""
fragment SnakeSpeciesListItem on SnakeSpecies {
  ...SnakeSpeciesCore
  family
  regions
  rescueCount
  verified
}
`;

// Combine all snake type definitions
export const snakeTypeDefs = [
  snakeEnums,
  snakeSchema,
  snakeInputs,
  snakeQueries,
  snakeMutations,
  snakeSubscriptions,
  snakeFragments,
].join('\n\n');

// Export operations for code generation
export const snakeOperations = {
  queries: snakeQueries,
  mutations: snakeMutations,
  subscriptions: snakeSubscriptions,
};

// Export fragments for reuse
export const snakeFragmentDefinitions = snakeFragments;
