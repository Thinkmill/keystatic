import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import markdoc from '@astrojs/markdoc';

// https://astro.build/config
export default defineConfig({
  output: 'hybrid',
	site: 'https://example.com',
  integrations: [tailwind(), react(), sitemap(), markdoc()]
});
