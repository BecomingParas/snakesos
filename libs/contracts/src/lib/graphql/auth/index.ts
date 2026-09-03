// ===================================================================
// AUTH - MODULE EXPORTS
// ===================================================================



export const authEnums = `# ===================================================================
# AUTH - ENUMS
# ===================================================================

"""
User role for role-based access control
"""
enum UserRole {
  """
  Regular citizen who can submit rescue requests
  """
  CITIZEN
  
  """
  Approved volunteer (not yet verified)
  """
  VOLUNTEER
  
  """
  Verified snake rescuer with full rescue capabilities
  """
  VERIFIED_RESCUER
  
  """
  District-level coordinator managing volunteers
  """
  DISTRICT_COORDINATOR
  
  """
  Administrator with full system access
  """
  ADMIN
  
  """
  Super administrator with system configuration access
  """
  SUPER_ADMIN
}

"""
User account status
"""
enum UserStatus {
  """
  Active and can use the system
  """
  ACTIVE
  
  """
  Inactive (voluntarily disabled)
  """
  INACTIVE
  
  """
  Suspended by admin
  """
  SUSPENDED
  
  """
  Pending email verification
  """
  PENDING_VERIFICATION
  
  """
  Permanently banned
  """
  BANNED
}
`;
export const authSchema = `# ===================================================================
# AUTH - USER TYPE DEFINITIONS
# ===================================================================

type ChangePasswordPayload {
  success: Boolean!
  message: String!
}

"""
User account with authentication and profile information
"""
type User {
  id: ID!
  email: Email!
  name: String!
  phone: Phone
  role: UserRole!
  status: UserStatus!
  avatar: String
  
  # OAuth Integration
  googleId: String
  googleEmail: Email
  
  # Email Verification
  emailVerified: Boolean!
  verifiedAt: DateTime
  
  # Security
  lastLoginAt: DateTime
  lastLoginIp: String
  
  # Preferences
  language: String!
  timezone: String!
  notificationPreferences: JSON
  
  # Metadata
  createdAt: DateTime!
  updatedAt: DateTime!
  
  # Relations
  rescueRequests(
    pagination: PaginationInput
    filter: RescueRequestFilterInput
  ): RescueRequestConnection
  
  volunteerProfile: Volunteer
  
  blogPosts(
    pagination: PaginationInput
    filter: BlogPostFilterInput
  ): BlogPostConnection
  
  galleryImages(
    pagination: PaginationInput
  ): GalleryImageConnection
  
  donations(
    pagination: PaginationInput
  ): DonationConnection
  
  aiIdentifications(
    pagination: PaginationInput
  ): AIIdentificationConnection
  
  notifications(
    pagination: PaginationInput
    filter: NotificationFilterInput
  ): NotificationConnection
  
  activityLogs(
    pagination: PaginationInput
  ): ActivityLogConnection
}

"""
Authentication payload returned on successful login/register
"""
type AuthPayload {
  accessToken: String!
  refreshToken: String!
  user: User!
  expiresIn: Int!
}

"""
Registration payload returned after successful registration (no auth tokens until email verification + login)
"""
type RegistrationPayload {
  user: User!
}

"""
User profile for public display
"""
type UserProfile {
  id: ID!
  name: String!
  avatar: String
  role: UserRole!
  volunteerProfile: Volunteer
  totalRescues: Int!
  joinedAt: DateTime!
}

"""
Password reset token response
"""
type PasswordResetTokenPayload {
  message: String!
  expiresAt: DateTime!
}

"""
Email verification response
"""
type EmailVerificationPayload {
  success: Boolean!
  message: String!
  user: User
}

"""
Activity log entry for audit trail
"""
type ActivityLog {
  id: ID!
  userId: ID!
  user: User!
  action: String!
  resource: String
  resourceId: ID
  metadata: JSON
  ipAddress: String
  userAgent: String
  createdAt: DateTime!
}

"""
Paginated connection for activity logs
"""
type ActivityLogConnection {
  edges: [ActivityLog!]!
  pageInfo: PageInfo!
  totalCount: Int!
}
`;
export const authInputs = `# ===================================================================
# AUTH - INPUT TYPES
# ===================================================================

"""
Input for user registration
"""
input RegisterInput {
  email: Email!
  password: String!
  name: String!
  phone: Phone
  language: String
  timezone: String
}

"""
Input for user login
"""
input LoginInput {
  email: Email!
  password: String!
}

"""
Input for OAuth (Google) login
"""
input OAuthLoginInput {
  provider: String!
  token: String!
  googleId: String
  email: Email
  name: String
}

"""
Input for updating user profile
"""
input UpdateUserProfileInput {
  name: String
  phone: Phone
  avatar: String
  language: String
  timezone: String
  notificationPreferences: JSON
}

"""
Input for changing password
"""
input ChangePasswordInput {
  currentPassword: String!
  newPassword: String!
}

"""
Input for password reset request
"""
input PasswordResetRequestInput {
  email: Email!
}

"""
Input for password reset confirmation using email + OTP code
"""
input ResetPasswordInput {
  email: Email!
  code: String!
  newPassword: String!
}

"""
Input for email verification using OTP code only
"""
input VerifyEmailInput {
  email: Email!
  code: String!
}

"""
Input for resending verification email
"""
input ResendVerificationInput {
  email: Email!
}

"""
Input for updating notification preferences
"""
input NotificationPreferencesInput {
  emailNotifications: Boolean
  smsNotifications: Boolean
  telegramNotifications: Boolean
  rescueUpdates: Boolean
  volunteerUpdates: Boolean
  systemAnnouncements: Boolean
}

"""
Filter input for user queries
"""
input UserFilterInput {
  role: UserRole
  status: UserStatus
  emailVerified: Boolean
  search: String
  createdAfter: DateTime
  createdBefore: DateTime
}

"""
Sort input for user queries
"""
input UserSortInput {
  field: UserSortField!
  order: SortOrder!
}

"""
Fields available for sorting users
"""
enum UserSortField {
  NAME
  EMAIL
  CREATED_AT
  UPDATED_AT
  LAST_LOGIN_AT
}
`;
export const authQueriesSchema = `# ===================================================================
# AUTH - QUERY DEFINITIONS
# ===================================================================
# Authentication and user queries
# ===================================================================

extend type Query {
  """
  Get current authenticated user
  """
  me: User
  
  """
  Get user by ID (admin or self only)
  """
  user(id: ID!): User
  
  """
  Get user profile by ID (public)
  """
  userProfile(id: ID!): UserProfile
  
  """
  List all users (admin only)
  """
  users(
    pagination: PaginationInput
    filter: UserFilterInput
    sort: UserSortInput
  ): UserConnection!
  
  """
  Search users by name or email
  """
  searchUsers(
    query: String!
    pagination: PaginationInput
  ): UserConnection!
  
  """
  Check if email is available for registration
  """
  checkEmailAvailability(email: Email!): Boolean!
  
  """
  Get activity logs for current user
  """
  myActivityLogs(
    pagination: PaginationInput
  ): ActivityLogConnection!
}

"""
Paginated connection for users
"""
type UserConnection {
  edges: [User!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

`;
export const authMutationsSchema = `# ===================================================================
# AUTH - MUTATION DEFINITIONS
# ===================================================================
# Authentication and authorization mutations
# ===================================================================

extend type Mutation {
  """
  Register a new user account (returns user data only, no auth tokens until email verification + login)
  """
  register(input: RegisterInput!): RegistrationPayload!
  
  """
  Login with email and password
  """
  login(input: LoginInput!): AuthPayload!
  
  """
  Login with OAuth provider (Google)
  """
  oauthLogin(input: OAuthLoginInput!): AuthPayload!
  
  """
  Logout current user (invalidates refresh token)
  """
  logout: Boolean!
  
  """
  Refresh access token using refresh token cookie
  """
  refreshToken: AuthPayload!
  
  """
  Request password reset email
  """
  forgotPassword(email: String!): PasswordResetTokenPayload!
  
  """
  Reset password with token
  """
  resetPassword(input: ResetPasswordInput!): Boolean!
  
  """
  Verify email address with token
  """
  verifyEmail(input: VerifyEmailInput!): EmailVerificationPayload!
  
  """
  Resend email verification
  """
  resendVerification(input: ResendVerificationInput!): Boolean!
  
  """
  Change password (requires current password)
  """
  changePassword(input: ChangePasswordInput!): ChangePasswordPayload!
  
  """
  Update user profile
  """
  updateProfile(input: UpdateProfileInput!): User!
  
  """
  Delete user account (soft delete)
  """
  deleteAccount(password: String!): Boolean!

  """
  Update a user's account status (admin only)
  """
  updateUserStatus(userId: ID!, status: UserStatus!): User! @auth(requires: [ADMIN, SUPER_ADMIN])

  """
  Change another user's role (admin only; administrators cannot change their own role)
  """
  updateUserRole(input: UpdateUserRoleInput!): User! @auth(requires: [ADMIN, SUPER_ADMIN])

  """
  Soft-delete a user account (super admin only)
  """
  deleteUser(userId: ID!): SuccessResponse! @auth(requires: [SUPER_ADMIN])
}

"""
Input for password reset with OTP code
"""
input ResetPasswordInput {
  email: Email!
  code: String!
  newPassword: String!
}

"""
Input for profile update
"""
input UpdateProfileInput {
  name: String
  phone: Phone
  avatar: String
  language: String
  timezone: String
}

input UpdateUserRoleInput {
  userId: ID!
  role: UserRole!
}

`;
export const authSubscriptions = `# ===================================================================
# AUTH - SUBSCRIPTIONS
# ===================================================================

extend type Subscription {
  """
  Subscribe to user profile updates
  """
  userUpdated(userId: ID!): User! @auth
  
  """
  Subscribe to user status changes (admin only)
  """
  userStatusChanged: UserStatusChangeEvent! @auth(requires: [ADMIN, SUPER_ADMIN])
}

"""
User status change event
"""
type UserStatusChangeEvent {
  userId: ID!
  user: User!
  oldStatus: UserStatus!
  newStatus: UserStatus!
  changedBy: User
  changedAt: DateTime!
}
`;

// Combine all auth type definitions for backend
export const authTypeDefs = [
  authEnums,
  authSchema,
  authInputs,
  authQueriesSchema,
  authMutationsSchema,
  authSubscriptions,
].join('\n\n');
