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
};

export default nextConfig;
