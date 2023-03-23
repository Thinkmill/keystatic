import { collection, config, fields } from '@keystatic/core';

export default config({
  storage: {
    kind: 'github',
    repo: { name: 'keystatic', owner: 'thinkmill' },
  },
  collections: {
    package: collection({
      path: `design-system/packages/*/docs`,
      format: 'yaml',
      label: 'Package',
      slugField: 'name',
      schema: {
        name: fields.slug({
          name: {
            label: 'Name',
            validation: { length: { min: 1 } },
          },
        }),
        description: fields.text({ label: 'Description', multiline: true }),
        category: fields.select({
          label: 'Category',
          defaultValue: 'Miscellaneous',
          options: [
            // { label: 'Introduction', value: 'Introduction' },
            // { label: 'Concepts', value: 'Concepts' },
            { label: 'Miscellaneous', value: 'Miscellaneous' },
            // ------------------------------
            { label: 'Feedback', value: 'Feedback' },
            { label: 'Forms', value: 'Forms' },
            { label: 'Layout', value: 'Layout' },
            { label: 'Media', value: 'Media' },
            { label: 'Navigation', value: 'Navigation' },
            { label: 'Overlays', value: 'Overlays' },
            { label: 'Typography', value: 'Typography' },
          ] as const,
        }),
        content: fields.document({
          label: 'Content',
          links: true,
          formatting: {
            headingLevels: [2, 3, 4],
            blockTypes: { code: true },
            listTypes: true,
            inlineMarks: {
              bold: true,
              code: true,
              italic: true,
              keyboard: true,
            },
          },
        }),
      },
    }),
  },
});
