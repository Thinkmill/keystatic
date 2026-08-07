import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

initOpenNextCloudflareForDev();

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  serverExternalPackages: ['esbuild'],
  experimental: {
    externalDir: true,
    prefetchInlining: false,
  },
};

export default nextConfig;
