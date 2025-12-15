import withPreconstruct from '@preconstruct/next';

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  serverExternalPackages: ['esbuild'],
  experimental: {
    externalDir: true,
  },
};

export default withPreconstruct(nextConfig);
