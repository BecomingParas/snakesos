// Inline GraphQL schema to avoid runtime file reading issues in serverless environments
export const paginationTypeDefs = `# ===================================================================
# SHARED PAGINATION
# ===================================================================
# Relay-style cursor pagination for consistent list queries
# ===================================================================

"""
Information about pagination in a connection
"""
type PageInfo {
  """
  When paginating forwards, are there more items?
  """
  hasNextPage: Boolean!
  
  """
  When paginating backwards, are there more items?
  """
  hasPreviousPage: Boolean!
  
  """
  When paginating backwards, the cursor to continue
  """
  startCursor: String
  
  """
  When paginating forwards, the cursor to continue
  """
  endCursor: String
}

"""
Generic pagination input
"""
input PaginationInput {
  """
  Number of items to return (max 100)
  """
  limit: Int = 20
  
  """
  Page number (1-indexed)
  """
  page: Int = 1
}

"""
Cursor-based pagination input
"""
input CursorPaginationInput {
  """
  Cursor to start from
  """
  after: String
  
  """
  Cursor to end at
  """
  before: String
  
  """
  Number of items (max 100)
  """
  first: Int
  
  """
  Number of items from end (max 100)
  """
  last: Int
}

"""
Sort order
"""
enum SortOrder {
  ASC
  DESC
}
`;
