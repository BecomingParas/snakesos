// ===================================================================
// ROOT GRAPHQL CONTRACT - MERGES ALL FEATURE MODULES
// ===================================================================
//
// This is the single source of truth for the entire GraphQL API.
// It combines all shared primitives and feature modules into one
// executable schema for Apollo Server.
//
// Usage:
//   import { graphqlSchema } from '@snake-rescue/contracts';
//   const server = new ApolloServer({ typeDefs: graphqlSchema });
//
// ===================================================================

import { sharedTypeDefs } from './shared/index';
import { authTypeDefs } from './auth/index';
import { rescueTypeDefs } from './rescue/index';
import { volunteerTypeDefs } from './volunteer/index';
import { snakeTypeDefs } from './snake/index';
import { aiTypeDefs } from './ai/index';
import { notificationTypeDefs } from './notification/index';
import { cmsTypeDefs } from './cms/index';
import { paymentTypeDefs } from './payment/index';
import { analyticsTypeDefs } from './analytics/index';
import { trainingTypeDefs } from './training/index';
import { contactTypeDefs } from './contact/index';
import { hospitalTypeDefs } from './hospital/index';
import { mapTypeDefs } from './map/index';
import { settingsTypeDefs } from './settings/index';
import { mediaTypeDefs } from './media/index';

// Base GraphQL schema with Query, Mutation, Subscription types
const baseSchema = `
  type Query {
    _empty: String
  }
  
  type Mutation {
    _empty: String
  }
  
  type Subscription {
    _empty: String
  }
`;

// Combine all type definitions
export const graphqlSchema = [
  baseSchema,
  sharedTypeDefs,
  authTypeDefs,
  rescueTypeDefs,
  volunteerTypeDefs,
  snakeTypeDefs,
  aiTypeDefs,
  notificationTypeDefs,
  cmsTypeDefs,
  paymentTypeDefs,
  analyticsTypeDefs,
  trainingTypeDefs,
  contactTypeDefs,
  hospitalTypeDefs,
  mapTypeDefs,
  settingsTypeDefs,
  mediaTypeDefs,
].join('\n\n');

// Export individual modules for selective imports
export * from './shared/index';
export * from './auth/index';
export * from './rescue/index';
export * from './volunteer/index';
export * from './snake/index';
export * from './ai/index';
export * from './notification/index';
export * from './cms/index';
export * from './payment/index';
export * from './analytics/index';
export * from './training/index';
export * from './contact/index';
export * from './hospital/index';
export * from './map/index';
export * from './settings/index';
export * from './media/index';

// Export combined schema as default
export default graphqlSchema;

// Type definitions count (for debugging)
export const typesCount = {
  shared: sharedTypeDefs.split('type ').length - 1,
  auth: authTypeDefs.split('type ').length - 1,
  rescue: rescueTypeDefs.split('type ').length - 1,
  volunteer: volunteerTypeDefs.split('type ').length - 1,
  snake: snakeTypeDefs.split('type ').length - 1,
  ai: aiTypeDefs.split('type ').length - 1,
  notification: notificationTypeDefs.split('type ').length - 1,
  cms: cmsTypeDefs.split('type ').length - 1,
  payment: paymentTypeDefs.split('type ').length - 1,
  analytics: analyticsTypeDefs.split('type ').length - 1,
  training: trainingTypeDefs.split('type ').length - 1,
  contact: contactTypeDefs.split('type ').length - 1,
  hospital: hospitalTypeDefs.split('type ').length - 1,
  map: mapTypeDefs.split('type ').length - 1,
};

console.log('✅ GraphQL Contract Loaded:', {
  totalTypes: Object.values(typesCount).reduce((a, b) => a + b, 0),
  modules: Object.keys(typesCount),
  version: '1.0.0',
  modulesCount: 13,
});
