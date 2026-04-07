/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    memoryBasedWorkersCount: true,
    turbopack: {
      root: "./",
    },
  },
};

module.exports = nextConfig;
