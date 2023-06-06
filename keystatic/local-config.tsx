import { config, singleton } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local',
  },
  singletons: {
    test: singleton({
      label: 'Text',
      fields: {},
    }),
  },
});
