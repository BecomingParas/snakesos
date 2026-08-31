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
  transpilePackages: ['@snake-rescue/contracts', '@snake-rescue/shared'],
  images: {
    unoptimized: true,
    remotePatterns: [],
  },
  devIndicators: {
    buildActivity: false,
  },
  trailingSlash: true,
  
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
};

export default nextConfig;
