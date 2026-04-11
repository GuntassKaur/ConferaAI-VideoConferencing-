/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Removed unsupported eslint key
  // You can use 'next lint' separately or configure via a different method if needed
  typescript: {
    ignoreBuildErrors: true, 
  },
  experimental: {
    // This helps Next.js stay within the project directory
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

module.exports = nextConfig;

