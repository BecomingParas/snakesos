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

import { sharedTypeDefs } from './shared/index.js';
import { authTypeDefs } from './auth/index.js';
import { rescueTypeDefs } from './rescue/index.js';
import { volunteerTypeDefs } from './volunteer/index.js';
import { snakeTypeDefs } from './snake/index.js';
import { aiTypeDefs } from './ai/index.js';
import { notificationTypeDefs } from './notification/index.js';
import { cmsTypeDefs } from './cms/index.js';
import { paymentTypeDefs } from './payment/index.js';
import { analyticsTypeDefs } from './analytics/index.js';
import { trainingTypeDefs } from './training/index.js';
import { contactTypeDefs } from './contact/index.js';
import { hospitalTypeDefs } from './hospital/index.js';

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
].join('\n\n');

// Export individual modules for selective imports
export * from './shared/index.js';
export * from './auth/index.js';
export * from './rescue/index.js';
export * from './volunteer/index.js';
export * from './snake/index.js';
export * from './ai/index.js';
export * from './notification/index.js';
export * from './cms/index.js';
export * from './payment/index.js';
export * from './analytics/index.js';
export * from './training/index.js';
export * from './contact/index.js';
export * from './hospital/index.js';

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
};

console.log('✅ GraphQL Contract Loaded:', {
  totalTypes: Object.values(typesCount).reduce((a, b) => a + b, 0),
  modules: Object.keys(typesCount),
  version: '1.0.0',
  modulesCount: 12,
});
