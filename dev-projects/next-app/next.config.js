const { initOpenNextCloudflareForDev } = require('@opennextjs/cloudflare');

initOpenNextCloudflareForDev();

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
    tsconfigPath: './tsconfig-for-next/tsconfig.json',
  },
  experimental: {
    externalDir: true,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/keystatic',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
