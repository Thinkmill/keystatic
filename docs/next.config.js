/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: false,
  typescript: { ignoreBuildErrors: true },
  experimental: {
    appDir: true,
    externalDir: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'keystatic.io',
        port: '',
        pathname: '/images/keystatic-docs/**',
      },
    ],
  },
};
