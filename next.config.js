/*import type { NextConfig } from 'next';

const nextConfig: NextConfig = {*/
const nextConfig = {
  experimental: {
    ppr: false,
  },
  images: {
    remotePatterns: [
      {
        hostname: 'avatar.vercel.sh',
      },
    ],
  },
};

/*export default nextConfig;*/
module.exports = nextConfig
