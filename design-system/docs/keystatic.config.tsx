import { collection, config, fields } from '@keystatic/core';

export default config({
  storage: { kind: process.env.NODE_ENV === 'production' ? 'cloud' : 'local' },
  cloud: {
    project: 'thinkmill-labs/keystar-ui',
  },
  collections: {
    packageDocs: collection({
      label: 'Package Docs',
      path: 'design-system/pkg/src/**',
      slugField: 'title',
      entryLayout: 'content',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        content: fields.markdoc({
          label: 'Content',
          options: {
            codeBlock: {
              schema: {
                live: fields.checkbox({ label: 'Live' }),
              },
            },
          },
        }),
      },
    }),
    otherDocs: collection({
      label: 'Other Docs',
      path: 'design-system/docs/content/**',
      slugField: 'title',
      entryLayout: 'content',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        content: fields.markdoc({
          label: 'Content',
          options: {
            codeBlock: {
              schema: {
                live: fields.checkbox({ label: 'Live' }),
              },
            },
          },
        }),
      },
    }),
  },
});
