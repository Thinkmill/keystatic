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
  fieldDemo: component({
    preview: props => {
      return <div>{props.fields.field.value}</div>;
    },
    label: 'Field demo',
    schema: {
      field: fields.select({
        label: 'Field',
        defaultValue: 'text',
        options: [
          { label: 'Date', value: 'date' },
          { label: 'File', value: 'file' },
          { label: 'Image', value: 'image' },
          { label: 'Integer', value: 'integer' },
          { label: 'Multiselect', value: 'multiselect' },
          { label: 'Select', value: 'select' },
          { label: 'Slug', value: 'slug' },
          { label: 'Text', value: 'text' },
          { label: 'URL', value: 'url' },
        ],
      }),
    },
    chromeless: false,
  }),
  embed: component({
    label: 'Embed',
    preview: () => null,
    schema: {
      mediaType: fields.select({
        label: 'Media type',
        options: [
          { label: 'Video', value: 'video' },
          { label: 'Audio', value: 'audio' },
        ],
        defaultValue: 'video',
      }),
      embedCode: fields.text({
        label: 'Embed code',
        multiline: true,
      }),
    },
  }),
  videoGif: component({
    label: 'Looping video (muted)',
    preview: () => null,
    schema: {
      src: fields.file({
        label: 'Video',
        directory: 'public/writing',
        publicPath: '/writing/',
        validation: { isRequired: true },
      }),
      caption: fields.text({ label: 'Caption', multiline: true }),
    },
  }),
};

export default config({
  storage: {
    kind: 'local',
  },
  collections: {
    // ------------------------------
    // Docs pages
    // ------------------------------
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

    // ------------------------------
    // Blog posts
    // ------------------------------
    blog: collection({
      label: 'Blog posts',
      path: 'src/content/blog/*/',
      format: {
        data: 'yaml',
        contentField: '_content',
      },
      slugField: 'title',
      schema: {
        title: fields.slug({
          name: {
            label: 'Title',
            validation: {
              length: { min: 1 },
            },
          },
        }),
        draft: fields.checkbox({
          label: 'Do not publish',
          description:
            'Check this box to prevent this post from being published',
          defaultValue: false,
        }),
        publishedOn: fields.date({
          label: 'Published on',
          validation: {
            isRequired: true,
          },
        }),
        summary: fields.text({ label: 'Summary', multiline: true }),
        authors: fields.array(
          fields.relationship({
            label: 'Author',
            collection: 'authors',
            validation: { isRequired: true },
          }),
          {
            label: 'Authors',
            itemLabel: props => props.value ?? 'Please select',
          }
        ),
        tags: fields.array(
          fields.relationship({
            label: 'Tag',
            collection: 'tags',
            validation: { isRequired: true },
          }),
          {
            label: 'Tags',
            itemLabel: props => props.value ?? 'Please select',
          }
        ),
        _content: fields.document({
          label: 'Content',
          links: true,
          layouts: [[1], [1, 1]],
          images: {
            directory: 'src/content/blog/_images',
            publicPath: '/src/content/blog/_images/',
            schema: {
              title: fields.text({
                label: 'Caption',
                description:
                  'The text to display under the image in a caption.',
              }),
            },
          },
          dividers: true,
          formatting: {
            headingLevels: true,
            blockTypes: true,
            listTypes: true,
            inlineMarks: {
              code: true,
              bold: true,
              italic: true,
              underline: true,
              strikethrough: true,
            },
          },
          tables: true,
          componentBlocks: {
            videoGif: component({
              label: 'Looping video (muted)',
              preview: () => null,
              schema: {
                src: fields.file({
                  label: 'Video',
                  directory: 'public/writing',
                  publicPath: '/writing/',
                  validation: { isRequired: true },
                }),
                caption: fields.text({ label: 'Caption', multiline: true }),
              },
            }),
            embed: component({
              label: 'Embed',
              preview: () => null,
              schema: {
                mediaType: fields.select({
                  label: 'Media type',
                  options: [
                    { label: 'Video', value: 'video' },
                    { label: 'Audio', value: 'audio' },
                  ],
                  defaultValue: 'video',
                }),
                embedCode: fields.text({
                  label: 'Embed code',
                  multiline: true,
                }),
              },
            }),
            aside: component({
              label: 'Aside',
              preview: props => (
                <aside
                  style={{
                    background: '#e7e7e7',
                    padding: '0.75rem 1rem',
                    borderRadius: 4,
                  }}
                >
                  {props.fields.content.element}
                </aside>
              ),
              chromeless: true,
              schema: {
                content: fields.child({
                  links: 'inherit',
                  placeholder: 'Add content here...',
                  kind: 'block',
                  formatting: 'inherit',
                }),
              },
            }),
          },
        }),
        canonical: fields.text({
          label: 'Canonical URL',
          description:
            'Only fill is the canonical URL for this post is a different URL.',
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
