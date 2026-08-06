/**
 * Frontend Core - Main export
 * 
 * This library provides the core Apollo Client setup, providers, and utilities
 * for the Snake Rescue Platform frontend.
 */

// Apollo Client
export * from './apollo';

// Auth Token Management
export { setAccessToken, getAccessToken, clearAccessToken } from './apollo/links/auth-link';

// Providers
export * from './providers';

// Hooks
export * from './hooks';

// Layouts - Temporarily disabled until UI library is fixed
// export * from './layouts';

// Config
export * from './config';
