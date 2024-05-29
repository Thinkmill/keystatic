const withPreconstruct = require('@preconstruct/next');

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: {
    ignoreBuildErrors: true,
    tsconfigPath: './tsconfig-for-next/tsconfig.json',
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

module.exports = withPreconstruct(nextConfig);
