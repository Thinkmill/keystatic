const withPreconstruct = require('@preconstruct/next');
const { withTsGql } = require('@ts-gql/next');

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true, tsconfigPath: './tsconfig-for-next/tsconfig.json' },
  reactStrictMode: false,
  async redirects() {
    return [{ source: '/', destination: '/keystatic', permanent: false }];
  },
};

module.exports = withTsGql(withPreconstruct(nextConfig));
