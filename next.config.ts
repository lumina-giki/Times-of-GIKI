import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['@supabase/supabase-js'],
  },
  // Enable static optimization
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
