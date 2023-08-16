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
      {
        source: '/docs/collections-and-singletons',
        destination: '/docs/collections',
        permanent: true,
      },
      // Discord server invite
      {
        source: '/chat',
        destination: 'https://discord.gg/mudNPCMyCv',
        permanent: true,
      },
    ];
  },
};
