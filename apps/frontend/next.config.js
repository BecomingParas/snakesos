//@ts-check

const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  
  // Fix Turbopack root directory issue
  experimental: {
    turbo: {
      root: path.resolve(__dirname, '../..'),
    },
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  
  images: {
    formats: ['image/webp', 'image/avif'],
    qualities: [50, 75, 90, 95, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
      '@snake-rescue/contracts': path.resolve(__dirname, '../../libs/contracts/src/index.ts'),
      '@snake-rescue/frontend-core': path.resolve(__dirname, '../../libs/frontend/core/src/index.ts'),
      '@snake-rescue/frontend/core': path.resolve(__dirname, '../../libs/frontend/core/src/index.ts'),
      '@snake-rescue/features': path.resolve(__dirname, '../../libs/frontend/features/src/index.ts'),
      '@snake-rescue/frontend-features': path.resolve(__dirname, '../../libs/frontend/features/src/index.ts'),
      '@snake-rescue/frontend/features': path.resolve(__dirname, '../../libs/frontend/features/src/index.ts'),
      '@snake-rescue/ui': path.resolve(__dirname, '../../libs/frontend/ui/src/index.ts'),
      '@snake-rescue/frontend/ui': path.resolve(__dirname, '../../libs/frontend/ui/src/index.ts'),
    };

    return config;
  },
};

module.exports = nextConfig;
