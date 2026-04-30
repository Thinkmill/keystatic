import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import markdoc from '@astrojs/markdoc';
import node from '@astrojs/node';
import keystatic from '@keystatic/astro';

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [react(), sitemap(), markdoc(), keystatic()],
});
