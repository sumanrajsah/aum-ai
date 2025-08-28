import type { NextConfig } from "next";
import TerserPlugin from "terser-webpack-plugin";
const nextConfig: NextConfig = {
  /* config options here */
  // output: 'standalone',
  webpack(config, { dev, isServer }) {
    if (!dev && !isServer) {
      config.optimization.minimizer?.push(
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true, // removes all console.* calls
            },
          },
        })
      );
    }
    return config;
  },
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
      {
        protocol: 'http',
        hostname: '**', // allow all HTTPS domains
      },
      {
        protocol: 'http',
        hostname: 'localhost', // allow all HTTPS domains
      },
    ],
  },
};

export default nextConfig;
