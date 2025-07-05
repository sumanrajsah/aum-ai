import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true, // Disable ESLint during builds
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'dalleprodsec.blob.core.windows.net',
      },
      {
        protocol: 'https',
        hostname: '**', // allow all HTTPS domains
      },
    ],
  },
};

export default nextConfig;
