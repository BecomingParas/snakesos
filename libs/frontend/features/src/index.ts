/**
 * Frontend Features
 * 
 * All feature modules export their hooks and components through this index.
 * Components are presentational only. Hooks contain business logic.
 */

// Snake Feature
export * from './snake';

// Rescue Feature
export * from './rescue';

// App Context
export * from './lib/context/app-provider';

// Auth Feature
export * from './auth/context/auth-context';
export * from './auth/hooks/use-forgot-password';
export * from './auth/hooks/use-reset-password';
export * from './auth/hooks/use-login';
export * from './auth/hooks/use-register';
export * from './auth/hooks/use-logout';
export * from './auth/hooks/use-refresh-token';
export * from './auth/hooks/use-me';

// Home Feature
export { HeroSection } from './lib/home/hero-section';
export { StatsSection } from './lib/home/stats-section';
export { ServicesSection } from './lib/home/services-section';
export { EducationSection } from './lib/home/education-section';
export { CoverageAreaSection } from './lib/home/coverage-area-section';

// Emergency Feature
export { RescueForm } from './lib/emergency/rescue-form';
export { RescueSuccess } from './lib/emergency/rescue-success';

// Admin Feature
export * from './lib/admin';
