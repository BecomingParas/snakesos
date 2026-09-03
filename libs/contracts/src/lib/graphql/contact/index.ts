// ===================================================================
// CONTACT - MODULE EXPORTS
// ===================================================================



export const contactEnums = `# ===================================================================
# CONTACT - ENUMS
# ===================================================================

"""
Category of contact message
"""
enum MessageCategory {
  GENERAL
  RESCUE
  VOLUNTEER
  DONATION
  TECHNICAL
  FEEDBACK
  PARTNERSHIP
  MEDIA
  COMPLAINT
}

"""
Status of contact message
"""
enum MessageStatus {
  NEW
  READ
  RESPONDED
  CLOSED
  ARCHIVED
}

"""
Priority of contact message
"""
enum MessagePriority {
  LOW
  NORMAL
  HIGH
  URGENT
}
`;
export const contactSchema = `# ===================================================================
# CONTACT - TYPE DEFINITIONS
# ===================================================================

"""
Contact message from users
"""
type ContactMessage {
  id: ID!
  
  # Sender
  name: String!
  email: Email!
  phone: Phone
  subject: String!
  message: String!
  
  # Classification
  category: MessageCategory!
  priority: MessagePriority!
  
  # Status
  status: MessageStatus!
  assignedTo: User
  
  # Response
  responded: Boolean!
  respondedAt: DateTime
  response: String
  
  # Metadata
  ipAddress: String
  userAgent: String
  source: String!
  
  createdAt: DateTime!
  updatedAt: DateTime!
}

type EmergencyContact {
  id: ID!
  name: String!
  phone: Phone!
  relationship: String!
  createdAt: DateTime!
  updatedAt: DateTime!
}

"""
Contact message statistics
"""
type ContactMessageStats {
  total: Int!
  newMessages: Int!
  respondedMessages: Int!
  byCategory: [MessageByCategory!]!
  byPriority: [MessageByPriority!]!
  averageResponseTime: Int!
  recentMessages: [ContactMessage!]!
}

"""
Message count by category
"""
type MessageByCategory {
  category: MessageCategory!
  count: Int!
  newCount: Int!
}

"""
Message count by priority
"""
type MessageByPriority {
  priority: MessagePriority!
  count: Int!
}
`;
export const contactInputs = `# ===================================================================
# CONTACT - INPUT TYPES
# ===================================================================

"""
Input for submitting a contact message
"""
input SubmitContactMessageInput {
  name: String!
  email: Email!
  phone: Phone
  subject: String!
  message: String!
  category: MessageCategory
}

input SaveEmergencyContactInput {
  name: String!
  phone: Phone!
  relationship: String!
}

"""
Input for responding to a contact message
"""
input RespondToMessageInput {
  messageId: ID!
  response: String!
  sendEmail: Boolean
}

"""
Input for updating message status
"""
input UpdateMessageStatusInput {
  messageId: ID!
  status: MessageStatus!
  assignedTo: ID
}

"""
Filter input for contact message queries
"""
input ContactMessageFilterInput {
  status: MessageStatus
  statuses: [MessageStatus!]
  category: MessageCategory
  categories: [MessageCategory!]
  priority: MessagePriority
  priorities: [MessagePriority!]
  assignedTo: ID
  responded: Boolean
  createdAfter: DateTime
  createdBefore: DateTime
  search: String
}

"""
Sort input for contact message queries
"""
input ContactMessageSortInput {
  field: ContactMessageSortField!
  order: SortOrder!
}

"""
Fields available for sorting contact messages
"""
enum ContactMessageSortField {
  CREATED_AT
  PRIORITY
  STATUS
  CATEGORY
  NAME
}
`;
export const contactQueries = `# ===================================================================
# CONTACT - QUERIES
# ===================================================================

extend type Query {
  myEmergencyContact: EmergencyContact @auth

  """
  Get contact message by ID
  """
  contactMessage(id: ID!): ContactMessage @auth(requires: [ADMIN, SUPER_ADMIN])
  
  """
  List contact messages
  """
  contactMessages(
    pagination: PaginationInput
    filter: ContactMessageFilterInput
    sort: ContactMessageSortInput
  ): ContactMessageConnection! @auth(requires: [ADMIN, SUPER_ADMIN])
  
  """
  Get new contact messages count
  """
  newContactMessagesCount: Int! @auth(requires: [ADMIN, SUPER_ADMIN])
  
  """
  Get contact message statistics
  """
  contactMessageStats: ContactMessageStats! @auth(requires: [ADMIN, SUPER_ADMIN])
}

"""
Connection type for paginated contact message results
"""
type ContactMessageConnection {
  edges: [ContactMessageEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

"""
Edge type for contact message connection
"""
type ContactMessageEdge {
  node: ContactMessage!
  cursor: String!
}
`;
export const contactMutations = `# ===================================================================
# CONTACT - MUTATIONS
# ===================================================================

extend type Mutation {
  saveEmergencyContact(input: SaveEmergencyContactInput!): EmergencyContact! @auth

  """
  Submit a contact message
  """
  submitContactMessage(input: SubmitContactMessageInput!): ContactMessage!
  
  """
  Respond to a contact message
  """
  respondToMessage(input: RespondToMessageInput!): ContactMessage! @auth(requires: [ADMIN, SUPER_ADMIN])
  
  """
  Update message status
  """
  updateMessageStatus(input: UpdateMessageStatusInput!): ContactMessage! @auth(requires: [ADMIN, SUPER_ADMIN])
  
  """
  Mark message as read
  """
  markMessageAsRead(messageId: ID!): ContactMessage! @auth(requires: [ADMIN, SUPER_ADMIN])
  
  """
  Archive contact message
  """
  archiveContactMessage(messageId: ID!): ContactMessage! @auth(requires: [ADMIN, SUPER_ADMIN])
  
  """
  Delete contact message (soft delete)
  """
  deleteContactMessage(id: ID!): SuccessResponse! @auth(requires: [SUPER_ADMIN])
  
  """
  Bulk update message status
  """
  bulkUpdateMessageStatus(messageIds: [ID!]!, status: MessageStatus!): BulkOperationResult! @auth(requires: [ADMIN, SUPER_ADMIN])
}
`;
export const contactSubscriptions = `# ===================================================================
# CONTACT - SUBSCRIPTIONS
# ===================================================================

extend type Subscription {
  """
  Subscribe to new contact messages
  """
  contactMessageReceived: ContactMessage! @auth(requires: [ADMIN, SUPER_ADMIN])
  
  """
  Subscribe to contact message updates
  """
  contactMessageUpdated(id: ID): ContactMessage! @auth(requires: [ADMIN, SUPER_ADMIN])
}
`;
export const contactFragments = `# ===================================================================
# CONTACT - REUSABLE FRAGMENTS
# ===================================================================

"""
Core contact message fields
"""
fragment ContactMessageCore on ContactMessage {
  id
  name
  email
  subject
  category
  status
  priority
  createdAt
}

"""
Contact message with details
"""
fragment ContactMessageWithDetails on ContactMessage {
  ...ContactMessageCore
  phone
  message
  responded
  respondedAt
}

"""
Full contact message details
"""
fragment ContactMessageFull on ContactMessage {
  ...ContactMessageWithDetails
  assignedTo {
    id
    name
    email
  }
  response
  ipAddress
  userAgent
  source
  updatedAt
}

"""
Contact message list item
"""
fragment ContactMessageListItem on ContactMessage {
  ...ContactMessageCore
  responded
}
`;

// Combine all contact type definitions
export const contactTypeDefs = [
  contactEnums,
  contactSchema,
  contactInputs,
  contactQueries,
  contactMutations,
  contactSubscriptions,
  contactFragments,
].join('\n\n');

// Export operations for code generation
export const contactOperations = {
  queries: contactQueries,
  mutations: contactMutations,
  subscriptions: contactSubscriptions,
};

// Export fragments for reuse
export const contactFragmentDefinitions = contactFragments;
