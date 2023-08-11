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
          name: {
            label: 'Title',
            validation: {
              isRequired: true,
            },
          },
        }),
        description: fields.text({
          label: 'Description',
          validation: {
            isRequired: true,
          },
        }),
        pubDate: fields.date({
          label: 'Pub Date',
          validation: {
            isRequired: true,
          },
        }),
        updatedDate: fields.date({
          label: 'Pub Date',
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
