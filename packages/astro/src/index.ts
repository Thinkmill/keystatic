import type { AstroIntegration, ViteUserConfig } from 'astro';

export default function keystatic(): AstroIntegration {
  return {
    name: 'keystatic',
    hooks: {
      'astro:config:setup': ({ injectRoute, updateConfig, config }) => {
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
            entries: [
              require.resolve('@keystatic/astro/internal/for-optimize-deps'),
            ],
          },
        };
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
