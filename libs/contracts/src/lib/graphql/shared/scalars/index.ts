// Inline GraphQL schema to avoid runtime file reading issues in serverless environments
export const scalarsTypeDefs = `# ===================================================================
# SHARED SCALARS
# ===================================================================
# Custom scalar types used across the entire GraphQL schema
# ===================================================================

"""
ISO 8601 datetime string (e.g., "2024-08-05T12:30:00Z")
"""
scalar DateTime

"""
JSON object for flexible data structures
"""
scalar JSON

"""
File upload scalar for multipart/form-data
"""
scalar Upload

"""
Valid email address format
"""
scalar Email

"""
Valid phone number (international format)
"""
scalar Phone

"""
Positive integer
"""
scalar PositiveInt

"""
Latitude coordinate (-90 to 90)
"""
scalar Latitude

"""
Longitude coordinate (-180 to 180)
"""
scalar Longitude
`;
