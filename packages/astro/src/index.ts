import type { AstroIntegration, ViteUserConfig } from 'astro';

export default function keystatic(): AstroIntegration {
  return {
    name: 'keystatic',
    hooks: {
      'astro:config:setup': ({ injectRoute, updateConfig, config }) => {
        if (config.output !== 'server') {
          throw new Error(
            "Keystatic requires `output: 'server'` in your Astro config"
          );
        }
        if (!config.adapter) {
          throw new Error(
            'Keystatic requires an `adapter` to be set in your Astro config'
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
        };
        updateConfig({
          vite,
        });
        injectRoute({
          entryPoint: '@keystatic/astro/internal/keystatic-astro-page.astro',
          pattern: '/keystatic/[...params]',
        });
        injectRoute({
          entryPoint: '@keystatic/astro/internal/keystatic-api.js',
          pattern: '/api/keystatic/[...params]',
        });
      },
    },
  };
}
