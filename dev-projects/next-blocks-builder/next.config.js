/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    externalDir: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'thinkmill-labs.keystatic.net',
      },
    ],
  },
};

module.exports = nextConfig;
