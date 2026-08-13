/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@snake-rescue/contracts', '@snake-rescue/shared'],
  images: {
    unoptimized: true,
    remotePatterns: [],
  },
  devIndicators: {
    buildActivity: false, // Hide the build indicator in development
  },
};

export default nextConfig;
