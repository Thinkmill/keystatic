const withPreconstruct = require('@preconstruct/next');
const compiler = require('@ts-gql/compiler');
const path = require('path');

const withTsGql =
  (internalConfig = {}) =>
  (phase, thing) => {
    if (phase === 'phase-development-server') {
      compiler
        .watch(path.resolve(__dirname, '../../packages/keystatic'))
        .catch(err => {
          console.error(err.toString());
          process.exit(1);
        });
    }
    let internalConfigObj =
      typeof internalConfig === 'function'
        ? internalConfig(phase, thing)
        : internalConfig;
    return internalConfigObj;
  };

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: {
    ignoreBuildErrors: true,
    tsconfigPath: './tsconfig-for-next/tsconfig.json',
  },
  reactStrictMode: false,
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

module.exports = withTsGql(withPreconstruct(nextConfig));
