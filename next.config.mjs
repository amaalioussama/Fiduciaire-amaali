/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
    unoptimized: false,
  },
  experimental: {
    optimizePackageImports: ['react-icons'],
  },
  // Ensure proper build output
  output: 'standalone',
};

export default nextConfig;
