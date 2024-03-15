import { collection, config, fields } from '@keystatic/core';
import { categories } from './utils/categories';

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
        description: fields.text({ label: 'Description', multiline: true }),
        category: fields.select({
          label: 'Category',
          options: categories.map(category => ({
            label: category,
            value: category,
          })),
          defaultValue: 'Introduction',
        }),
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
        description: fields.text({ label: 'Description', multiline: true }),
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
