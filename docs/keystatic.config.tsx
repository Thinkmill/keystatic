// keystatic.config.tsx
import {
  config,
  fields,
  collection,
  singleton,
  component,
} from '@keystatic/core';

export const componentBlocks = {
  aside: component({
    preview: props => {
      return (
        <div className="flex items-center gap-3 rounded-2xl bg-keystatic-gray px-5 py-4">
          <div>{props.fields.icon.element}</div>
          <div style={{ fontStyle: 'italic', color: '#4A5568' }}>
            {props.fields.content.element}
          </div>
        </div>
      );
    },
    label: 'Aside',
    schema: {
      icon: fields.child({
        kind: 'inline',
        placeholder: 'Emoji icon...',
      }),
      content: fields.child({
        kind: 'block',
        placeholder: 'Aside...',
        formatting: {
          inlineMarks: 'inherit',
          softBreaks: 'inherit',
          listTypes: 'inherit',
        },
        links: 'inherit',
      }),
    },
    chromeless: true,
  }),
};

export default config({
  storage: {
    kind: 'local',
  },
  collections: {
    pages: collection({
      label: 'Pages',
      slugField: 'title',
      format: { contentField: 'content' },
      path: 'src/content/pages/*',
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        content: fields.document({
          label: 'Content',
          formatting: true,
          dividers: true,
          links: true,
          images: { directory: 'public/images/content' },
          componentBlocks,
        }),
      },
    }),
  },
  singletons: {
    navigation: singleton({
      label: 'Navigation',
      path: 'src/content/navigation',
      schema: {
        navGroups: fields.array(
          fields.object({
            groupName: fields.text({ label: 'Group name' }),
            items: fields.array(
              fields.object({
                label: fields.text({
                  label: 'Label',
                  description:
                    "Required when using a URL, or overriding the page's title",
                }),
                link: fields.conditional(
                  fields.select({
                    label: 'Page or URL',
                    options: [
                      { label: 'Page', value: 'page' },
                      { label: 'URL', value: 'url' },
                    ],
                    defaultValue: 'page',
                  }),
                  {
                    page: fields.relationship({
                      label: 'Page',
                      collection: 'pages',
                    }),
                    url: fields.text({ label: 'URL' }),
                  }
                ),
              }),
              {
                label: 'Navigation Links',
                itemLabel: props => props.fields.label.value,
              }
            ),
          }),
          {
            label: 'Navigation groups',
            itemLabel: props => props.fields.groupName.value,
          }
        ),
      },
    }),
  },
});
