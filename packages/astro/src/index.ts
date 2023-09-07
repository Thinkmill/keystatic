import type { AstroIntegration, ViteUserConfig } from 'astro';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs/promises';

export default function keystatic(): AstroIntegration {
  return {
    name: 'keystatic',
    hooks: {
      'astro:config:setup': async ({ injectRoute, updateConfig, config }) => {
        if (config.output !== 'hybrid') {
          throw new Error(
            "Keystatic requires `output: 'hybrid'` in your Astro config"
          );
        }
        const vite: ViteUserConfig = {
          plugins: [
            {
              name: 'keystatic',
              resolveId(id) {
                if (id === 'virtual:keystatic-config') {
                  return this.resolve('./keystatic.config', './a');
                }
                return null;
              },
            },
          ],
          optimizeDeps: {
            entries: ['keystatic.config.*', '.astro/keystatic-imports.js'],
          },
        };
        await fs.writeFile(
          path.join(fileURLToPath(config.root), '.astro/keystatic-imports.js'),
          `import '@keystatic/astro/api';
import '@keystatic/astro/ui';`
        );
        updateConfig({
          vite,
        });
        injectRoute({
          entryPoint: '@keystatic/astro/internal/keystatic-astro-page.astro',
          pattern: '/keystatic/[...params]',
          prerender: false,
        });
        injectRoute({
          entryPoint: '@keystatic/astro/internal/keystatic-api.js',
          pattern: '/api/keystatic/[...params]',
          prerender: false,
        });
      },
    },
  };
}
