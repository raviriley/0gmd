import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    config.externals = [
      ...(config.externals || []),
      "pino-pretty",
      "lokijs",
      "encoding",
    ];
    return config;
  },
};

export default nextConfig;
