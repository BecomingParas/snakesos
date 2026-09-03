

export const settingsTypeDefs = [
  `type AdminSettings {
  systemName: String!
  contactEmail: String!
  contactPhone: String!
  supportEmail: String!
  smsEnabled: Boolean!
  emailEnabled: Boolean!
  pushEnabled: Boolean!
  smsProvider: String!
  emailProvider: String!
  defaultRadius: Int!
  maxAssignmentDistance: Int!
  autoAssignEnabled: Boolean!
  priorityThreshold: Int!
  targetResponseTime: Int!
  maxResponseTime: Int!
  smsApiKey: String!
  emailApiKey: String!
  mapboxToken: String!
  sessionTimeout: Int!
  passwordMinLength: Int!
  requireTwoFactor: Boolean!
  maxLoginAttempts: Int!
  updatedAt: DateTime!
}`,
  `input AdminSettingsInput {
  systemName: String!
  contactEmail: String!
  contactPhone: String!
  supportEmail: String!
  smsEnabled: Boolean!
  emailEnabled: Boolean!
  pushEnabled: Boolean!
  smsProvider: String!
  emailProvider: String!
  defaultRadius: Int!
  maxAssignmentDistance: Int!
  autoAssignEnabled: Boolean!
  priorityThreshold: Int!
  targetResponseTime: Int!
  maxResponseTime: Int!
  smsApiKey: String!
  emailApiKey: String!
  mapboxToken: String!
  sessionTimeout: Int!
  passwordMinLength: Int!
  requireTwoFactor: Boolean!
  maxLoginAttempts: Int!
}`,
  `extend type Query {
  adminSettings: AdminSettings! @auth(requires: [ADMIN, SUPER_ADMIN])
}`,
  `extend type Mutation {
  updateAdminSettings(input: AdminSettingsInput!): AdminSettings!
    @auth(requires: [ADMIN, SUPER_ADMIN])
}`,
].join('\n\n');
