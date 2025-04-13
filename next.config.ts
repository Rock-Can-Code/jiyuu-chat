import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  coverageReporters: ['lcov', 'json'],
  experimental: {
    forceSwcTransforms: true,
  },
};

export default nextConfig;
