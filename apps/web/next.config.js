/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@confera/shared"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // We will keep type checking enabled but maybe ignore errors if they are too many
    // ignoreBuildErrors: true, 
  },
};

module.exports = nextConfig;
