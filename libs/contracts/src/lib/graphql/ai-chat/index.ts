/**
 * AI Chat GraphQL Schema
 * 
 * Provides chat interface for AI agent interactions.
 */

export const aiChatTypeDefs = `#graphql
  # ===================================================================
  # AI CHAT TYPES
  # ===================================================================

  """
  AI Chat message
  """
  type AiChatMessage {
    id: ID!
    role: AiMessageRole!
    content: String!
    toolCalls: [AiToolCall!]
    metadata: JSON
    createdAt: DateTime!
  }

  """
  Message role
  """
  enum AiMessageRole {
    USER
    ASSISTANT
    SYSTEM
  }

  """
  Tool call information
  """
  type AiToolCall {
    name: String!
    arguments: JSON!
    result: JSON
    success: Boolean
    error: String
  }

  """
  AI Conversation
  """
  type AiConversation {
    id: ID!
    title: String
    context: String!
    isActive: Boolean!
    messages: [AiChatMessage!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  """
  Chat response
  """
  type AiChatResponse {
    conversationId: ID!
    messageId: ID!
    response: String!
    toolsUsed: [String!]!
    responseTime: Int!
    requiresConfirmation: Boolean
    confirmationRequest: AiConfirmationRequest
  }

  """
  Confirmation request for write operations
  """
  type AiConfirmationRequest {
    toolName: String!
    action: String!
    description: String!
    arguments: JSON!
    risks: [String!]!
    reversible: Boolean!
  }

  """
  Available tool definition
  """
  type AiToolDefinition {
    name: String!
    description: String!
    category: String!
    parameters: [AiToolParameter!]!
    requiresConfirmation: Boolean!
    isReadOnly: Boolean!
  }

  """
  Tool parameter definition
  """
  type AiToolParameter {
    name: String!
    type: String!
    description: String!
    required: Boolean!
    enum: [String!]
  }

  # ===================================================================
  # INPUT TYPES
  # ===================================================================

  """
  Chat input
  """
  input AiChatInput {
    message: String!
    conversationId: ID
    context: AiChatContext
  }

  """
  Chat context
  """
  input AiChatContext {
    location: LocationInput
    metadata: JSON
  }

  """
  Location input for context
  """
  input LocationInput {
    latitude: Float!
    longitude: Float!
  }

  """
  Confirm action input
  """
  input ConfirmActionInput {
    conversationId: ID!
    toolName: String!
    arguments: JSON!
    confirmed: Boolean!
  }

  # ===================================================================
  # QUERIES
  # ===================================================================

  extend type Query {
    """
    Get conversation by ID
    """
    aiConversation(id: ID!): AiConversation

    """
    Get user's conversations
    """
    myAiConversations(
      limit: Int
      offset: Int
    ): [AiConversation!]!

    """
    Get available AI tools for current user
    """
    availableAiTools: [AiToolDefinition!]!
  }

  # ===================================================================
  # MUTATIONS
  # ===================================================================

  extend type Mutation {
    """
    Send a message to AI agent
    """
    aiChat(input: AiChatInput!): AiChatResponse!

    """
    Confirm a pending action
    """
    confirmAiAction(input: ConfirmActionInput!): AiChatResponse!

    """
    Close/end a conversation
    """
    closeAiConversation(conversationId: ID!): AiConversation!

    """
    Delete a conversation
    """
    deleteAiConversation(conversationId: ID!): Boolean!
  }
`;
