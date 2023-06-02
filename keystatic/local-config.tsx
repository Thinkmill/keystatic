import { config, fields, singleton } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local',
  },
  singletons: {
    test: singleton({
      label: 'Test',
      schema: {
        document: fields.markdoc({
          label: 'Document',
          config: {},
        }),
      },
    }),
  },
});
