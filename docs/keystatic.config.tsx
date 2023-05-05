// keystatic.config.tsx
import { config, fields, singleton } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local',
  },
  singletons: {
    homepage: singleton({
      label: 'Homepage',
      path: 'src/content/_homepage',
      schema: {
        headline: fields.text({ label: 'Headline' }),
      },
    }),
  },
});
