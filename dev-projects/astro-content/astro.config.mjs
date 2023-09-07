import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';

// https://astro.build/config
export default defineConfig({
  output: 'hybrid',
  site: 'https://example.com',
  integrations: [tailwind(), react(), sitemap(), markdoc(), keystatic()],
  // this vite config is only needed inside the monorepo
  vite: {
    ssr: {
      external: ['@keystatic/core'],
    },
  },
});
