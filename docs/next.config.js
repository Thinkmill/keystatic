/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: false,
  typescript: { ignoreBuildErrors: true },
  experimental: {
    externalDir: true,
  },
  images: {
    remotePatterns: [{ hostname: 'thinkmill-labs.keystatic.net' }],
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
      {
        source: '/docs/how-keystatic-organises-your-content',
        destination: '/docs/content-organisation',
        permanent: true,
      },
      {
        source: '/docs/local-vs-git-hub-storage-strategy',
        destination: '/docs/local-mode',
        permanent: true,
      },
      {
        source: '/docs/path-configuration',
        destination: '/docs/path-wildcard',
        permanent: true,
      },
      {
        source: '/docs/connect-to-github',
        destination: '/docs/github-mode',
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
