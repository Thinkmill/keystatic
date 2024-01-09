import { config, collection, fields, component } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local',
  },
  collections: {
    posts: collection({
      label: 'Posts',
      slugField: 'slug',
      schema: {
        title: fields.text({ label: 'Title' }),
        slug: fields.text({
          label: 'Slug',
          validation: { length: { min: 4 } },
        }),
        publishDate: fields.date({ label: 'Publish Date' }),
        heroImage: fields.image({ label: 'Hero Image' }),
        content: fields.document({
          label: 'Content',
          formatting: {
            alignment: true,
            blockTypes: {
              blockquote: true,
              code: {
                schema: {
                  filename: fields.text({ label: 'Filename' }),
                },
              },
            },
            headingLevels: {
              levels: true,
              schema: {
                id: fields.text({ label: 'ID' }),
              },
            },
            inlineMarks: true,
            listTypes: true,
            softBreaks: true,
          },
          layouts: [
            [1, 1],
            [1, 2],
            [1, 1, 1],
          ], // TEMP
          dividers: true,
          links: true,
          tables: true,
          images: {
            directory: 'public/images/posts',
            publicPath: '/images/posts/',
            schema: {
              title: fields.text({ label: 'Title' }),
            },
          },
          componentBlocks: {
            something: component({
              label: 'Some Component',
              preview: () => null,
              schema: {},
            }),
          },
        }),
        authors: fields.array(
          fields.object({
            name: fields.text({ label: 'Name' }),
            bio: fields.document({
              label: 'Bio',
              formatting: true,
              dividers: true,
              links: true,
            }),
          }),
          {
            label: 'Authors',
            itemLabel: props => props.fields.name.value,
          }
        ),
      },
    }),
  },
});
