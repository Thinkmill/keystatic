import { config, fields, collection } from '@keystatic/core';

const formatting = {
  headingLevels: [2, 3],
  blockTypes: true,
  listTypes: true,
  inlineMarks: true,
} as const;

export default config({
  storage: {
    kind: 'local',
  },
  collections: {
    // ------------------------------
    // Blog posts
    // ------------------------------
    blog: collection({
      label: 'Blog posts',
      slugField: 'title',
      path: 'src/content/blog/**',
      entryLayout: 'content',
      format: {
        contentField: 'content',
      },
      schema: {
        title: fields.slug({
          name: { label: 'Title', validation: { length: { min: 1 } } },
        }),
        description: fields.text({
          label: 'Description',
          validation: { length: { min: 1 } },
        }),
        pubDate: fields.date({
          label: 'Pub Date',
          validation: {
            isRequired: true,
          },
        }),
        updatedDate: fields.date({
          label: 'Updated Date',
        }),
        heroImage: fields.text({
          label: 'Hero Image',
        }),
        content: fields.document({
          label: 'Content',
          links: true,
          layouts: [[1, 1]],
          dividers: true,
          tables: true,
          formatting,
        }),
      },
    }),
  },
});
