/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@confera/shared"],
  // Tailwind v4 uses standard CSS imports, PostCSS/Vite plugins, or built-in Next.js 15 features.
};

module.exports = nextConfig;
