/**
 * Backend Configuration
 * Centralized configuration management
 */

export const config = {
  // Server
  nodeEnv: process.env['NODE_ENV'] || 'development',
  host: process.env['HOST'] || 'localhost',
  port: parseInt(process.env['PORT'] || '4000', 10),
  
  // Database
  databaseUrl: process.env['DATABASE_URL'] || '',
  
  // CORS
  corsOrigins: process.env['CORS_ORIGINS']?.split(',') || ['http://localhost:3000'],
  
  // Better Auth
  betterAuthSecret: process.env['BETTER_AUTH_SECRET'] || 'dev-secret-change-in-production',
  betterAuthUrl: process.env['BETTER_AUTH_URL'] || 'http://localhost:4000/api/auth',
  
  // GraphQL
  graphqlPath: '/graphql',
  graphqlPlayground: process.env['NODE_ENV'] !== 'production',
  
  // Rate Limiting
  rateLimitWindowMs: 15 * 60 * 1000, // 15 minutes
  rateLimitMax: 100, // requests per window
} as const;

export const isDevelopment = config.nodeEnv === 'development';
export const isProduction = config.nodeEnv === 'production';
