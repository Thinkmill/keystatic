import withPreconstruct from '@preconstruct/next';

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  experimental: {
    serverComponentsExternalPackages: ['esbuild'],
    externalDir: true,
  },
  // reactStrictMode: true,
  // webpack: config => ({
  //   ...config,
  //   infrastructureLogging: {
  //     level: 'error',
  //   },
  // }),
};

export default withPreconstruct(nextConfig);
