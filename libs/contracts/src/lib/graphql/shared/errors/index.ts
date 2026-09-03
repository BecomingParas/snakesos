// Inline GraphQL schema to avoid runtime file reading issues in serverless environments
export const errorsTypeDefs = `# ===================================================================
# SHARED ERROR TYPES
# ===================================================================
# Standard error responses for consistent error handling
# ===================================================================

"""
Error severity level
"""
enum ErrorSeverity {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

"""
Error code for programmatic handling
"""
enum ErrorCode {
  # Authentication
  UNAUTHENTICATED
  UNAUTHORIZED
  FORBIDDEN
  TOKEN_EXPIRED
  INVALID_CREDENTIALS
  
  # Validation
  VALIDATION_ERROR
  INVALID_INPUT
  REQUIRED_FIELD_MISSING
  
  # Not Found
  NOT_FOUND
  RESOURCE_NOT_FOUND
  
  # Conflict
  ALREADY_EXISTS
  DUPLICATE_ENTRY
  CONFLICT
  
  # Rate Limiting
  RATE_LIMIT_EXCEEDED
  TOO_MANY_REQUESTS
  
  # Server
  INTERNAL_SERVER_ERROR
  SERVICE_UNAVAILABLE
  TIMEOUT
  
  # Business Logic
  BUSINESS_RULE_VIOLATION
  INSUFFICIENT_PERMISSIONS
  OPERATION_NOT_ALLOWED
}

"""
Structured error with code, message, and metadata
"""
type Error {
  """
  Machine-readable error code
  """
  code: ErrorCode!
  
  """
  Human-readable error message
  """
  message: String!
  
  """
  Error severity
  """
  severity: ErrorSeverity!
  
  """
  Field that caused the error (for validation)
  """
  field: String
  
  """
  Additional error metadata
  """
  metadata: JSON
}

"""
Validation error for specific field
"""
type ValidationError {
  """
  Field name that failed validation
  """
  field: String!
  
  """
  Validation error message
  """
  message: String!
  
  """
  Error code
  """
  code: String!
}
`;
