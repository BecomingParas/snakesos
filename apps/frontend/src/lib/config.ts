/**
 * Frontend Configuration
 * Centralized config for API endpoints and environment variables
 */

export const config = {
  // API Configuration
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  graphqlUrl: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql',
  authUrl: process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:4000/api/auth',
  
  // Frontend Configuration
  frontendUrl: process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:4200',
  
  // Environment
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  
  // Feature Flags
  enableDevTools: process.env.NODE_ENV === 'development',
  
  // External Services (optional)
  googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
} as const;

// Validate required environment variables
if (!config.apiUrl) {
  console.warn('⚠️ VITE_API_URL not set, using default');
}

if (!config.graphqlUrl) {
  console.warn('⚠️ VITE_GRAPHQL_URL not set, using default');
}
