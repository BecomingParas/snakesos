/**
 * Environment Configuration
 */
export const env = {
  // API URLs
  graphqlUrl: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql',
  graphqlWsUrl: process.env.NEXT_PUBLIC_GRAPHQL_WS_URL || 'ws://localhost:4000/graphql',
  
  // App
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'Snake Rescue',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  
  // Features
  enableSubscriptions: process.env.NEXT_PUBLIC_ENABLE_SUBSCRIPTIONS !== 'false',
  enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  
  // Environment
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
} as const;
