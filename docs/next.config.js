/** @type {import('next').NextConfig} */
module.exports = {
  typescript: { ignoreBuildErrors: true },
  experimental: {
    externalDir: true,
  },
  async rewrites() {
    return [{ source: '/keystatic/:path*', destination: '/keystatic' }];
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        destination: 'https://keystatic.com/:path*',
        permanent: false,
        has: [{ type: 'host', value: 'keystatic.thinkmill.com.au' }],
      },
      {
        source: '/:path*',
        destination: 'https://keystatic.com/:path*',
        permanent: false,
        has: [{ type: 'host', value: 'keystatic.thinkmill.com' }],
      },
      {
        source: '/:path*',
        destination: 'https://keystatic.com/:path*',
        permanent: false,
        has: [{ type: 'host', value: 'www.keystatic.com' }],
      },
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
