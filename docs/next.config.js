/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: false,
  typescript: { ignoreBuildErrors: true },
  experimental: {
    externalDir: true,
  },
  async redirects() {
    return [
      {
        source: '/docs',
        destination: '/docs/introduction',
        permanent: false,
      },
    ];
  },
};
