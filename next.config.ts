import type { NextConfig } from "next";
import TerserPlugin from "terser-webpack-plugin";

const nextConfig: NextConfig = {
  webpack(config, { dev }) {
    if (!dev) {
      config.optimization.minimizer = [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true, // remove all console.* calls
            },
          },
        }),
      ];
    }
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "dalleprodsec.blob.core.windows.net" },
      { protocol: "https", hostname: "**" }, // allow all HTTPS
      { protocol: "http", hostname: "**" },  // allow all HTTP (incl. localhost)
    ],
  },
};

export default nextConfig;
