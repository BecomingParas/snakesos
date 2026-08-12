/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@snake-rescue/contracts', '@snake-rescue/shared'],
  images: {
    unoptimized: true,
    remotePatterns: [],
  },
};

export default nextConfig;
