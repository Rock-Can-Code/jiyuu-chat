import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
 
const nextConfig: NextConfig = {
  experimental: {
    forceSwcTransforms: true,
  },
};
 
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);