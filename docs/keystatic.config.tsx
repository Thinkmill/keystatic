// keystatic.config.tsx
import {
  config,
  fields,
  collection,
  singleton,
  component,
  NotEditable,
} from '@keystatic/core';
import { CloudImagePreview } from './src/components/previews/CloudImagePreview';

export const componentBlocks = {
  aside: component({
    preview: props => {
      return (
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            borderLeft: '3px',
            borderLeftStyle: 'solid',
            borderLeftColor: '#eee',
            paddingLeft: '0.5rem',
          }}
        >
          <NotEditable>{props.fields.icon.value}</NotEditable>
          <div>{props.fields.content.element}</div>
        </div>
      );
    },
    label: 'Aside',
    schema: {
      icon: fields.text({
        label: 'Emoji icon...',
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
  }),
  'cloud-image': component({
    preview: CloudImagePreview,
    label: 'Cloud image',
    schema: {
      href: fields.text({
        label: 'Href *',
        validation: {
          length: {
            min: 1,
          },
        },
      }),
      alt: fields.text({
        label: 'Alt text',
        description:
          'Include an alt text description or leave blank for decorative images',
      }),
      height: fields.text({
        label: 'Height',
        description:
          'The intrinsic height of the image, in pixels. Must be an integer without a unit - e.g. 100',
      }),
      width: fields.text({
        label: 'Width',
        description:
          'The intrinsic width of the image, in pixels. Must be an integer without a unit - e.g. 100',
      }),
      srcSet: fields.text({
        label: 'Srcset',
        description: 'Optionally override the defualt srcset',
      }),
      sizes: fields.text({
        label: 'Sizes',
        description: 'Optionally override the defualt sizes',
      }),
    },
    chromeless: false,
  }),
  tags: component({
    preview: props => {
      return (
        <div style={{ display: 'flex', gap: '1rem' }}>
          {props.fields.tags.value.map(tag => (
            <span
              style={{
                border: 'solid 1px #ddd',
                padding: '0.25rem 0.5rem',
                borderRadius: '20px',
                fontSize: '11px',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      );
    },
    label: 'Tags',
    schema: {
      tags: fields.multiselect({
        label: 'Tags',
        options: [
          { label: 'Local', value: 'Local' },
          { label: 'Github', value: 'github' },
          { label: 'New project', value: 'New project' },
          { label: 'Existing project', value: 'Existing project' },
          { label: 'Astro', value: 'Astro' },
          { label: 'Next.js', value: 'Next.js' },
        ],
      }),
    },
    chromeless: false,
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
      path: 'src/content/pages/**',
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        content: fields.document({
          label: 'Content',
          formatting: {
            inlineMarks: true,
            listTypes: true,
            alignment: true,
            headingLevels: [2, 3],
            blockTypes: true,
            softBreaks: true,
          },
          layouts: [[1, 1]],
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
                    label: 'Link type',
                    options: [
                      { label: 'Page', value: 'page' },
                      { label: 'URL', value: 'url' },
                      { label: 'Coming soon (no link)', value: 'coming-soon' },
                    ],
                    defaultValue: 'page',
                  }),
                  {
                    page: fields.relationship({
                      label: 'Page',
                      collection: 'pages',
                    }),
                    url: fields.text({ label: 'URL' }),
                    'coming-soon': fields.empty(),
                  }
                ),
              }),
              {
                label: 'Navigation items',
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
