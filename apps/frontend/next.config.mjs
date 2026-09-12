import nextEnv from '@next/env';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const { loadEnvConfig } = nextEnv;

// Nx serves the Next app from apps/frontend, so Next only auto-loads
// apps/frontend/.env*. Load workspace-root env as well so local maps keys
// in .env / .env.local reach NEXT_PUBLIC_* the same way the backend does.
const workspaceRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..',
);
loadEnvConfig(workspaceRoot);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Disable ESLint during builds (lint separately)
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript checking during builds
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable static error pages to avoid prerendering issues with context providers
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
  // Skip generating static error pages
  generateStaticParams: async () => {
    return [];
  },
  transpilePackages: [
    '@snake-rescue/contracts',
    '@snake-rescue/shared',
    '@snake-rescue/auth',
    '@snake-rescue/database',
    '@snake-rescue/core',
    '@snake-rescue/modules',
  ],
  images: {
    unoptimized: true,
    remotePatterns: [],
  },
  devIndicators: {
    buildActivity: false,
  },
  trailingSlash: false, // Prevent trailing slash redirects for API routes
  
  // Output file tracing root for monorepo support
  outputFileTracingRoot: workspaceRoot,
  
  // Experimental features configuration
  experimental: {
    // Disable PPR to avoid prerendering issues with error boundaries
    ppr: false,
  },
  
  // Skip specific routes during static generation
  async headers() {
    return [];
  },
  
  // Ensure we're not trying to export as static
  async rewrites() {
    return [];
  },
  
  // Custom configuration for build
  async generateBuildId() {
    return 'build-' + Date.now();
  },
  
  // Configure page extensions
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  env: {
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY:
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  },
  
  // Configure webpack to include .graphql files
  webpack: (config, { isServer }) => {
    // Add rule for .graphql files
    config.module.rules.push({
      test: /\.graphql$/,
      type: 'asset/source',
    });
    
    // Configure module resolution for .js → .ts imports
    config.resolve.extensionAlias = {
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
      '.cjs': ['.cts', '.cjs'],
    };

    config.resolve.alias['@snake-rescue/database$'] = path.resolve(
      workspaceRoot,
      'libs/database/src/index.ts',
    );
    config.resolve.alias['@snake-rescue/core$'] = path.resolve(
      workspaceRoot,
      'libs/backend/core/src/index.ts',
    );
    config.resolve.alias['@snake-rescue/modules$'] = path.resolve(
      workspaceRoot,
      'libs/backend/modules/src/index.ts',
    );
    
    return config;
  },
};

export default nextConfig;
