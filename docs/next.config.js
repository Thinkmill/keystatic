/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: false,
  typescript: { ignoreBuildErrors: true },
  experimental: {
    appDir: true,
    externalDir: true
  },
};
