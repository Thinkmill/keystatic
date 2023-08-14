import {
  config,
  fields,
  collection,
  singleton,
  component,
  NotEditable,
} from '@keystatic/core';
import { __experimental_markdoc_field } from '@keystatic/core/form/fields/markdoc';
import { CloudImagePreview } from './src/components/previews/CloudImagePreview';
import { Config } from '@markdoc/markdoc';
import { CloudImage2Preview } from './src/components/previews/CloudImage2Preview';

export const cloudImage2Schema = {
  src: fields.text({
    label: 'URL',
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
};

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
        description: 'Optionally override the default sizes',
      }),
      caption: fields.text({
        label: 'Caption',
        description:
          'Optionally add a caption to display in small text below the image',
      }),
    },
    chromeless: false,
  }),
  'cloud-image-2': component({
    preview: CloudImage2Preview,
    label: 'Cloud image 2',
    schema: cloudImage2Schema,
    chromeless: true,
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
    label: 'Project',
    schema: {
      tags: fields.multiselect({
        label: 'Project tags',
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
    preview: props => <div>{props.fields.embedCode.value}</div>,
    schema: {
      mediaType: fields.select({
        label: 'Media type',
        options: [
          { label: 'Video', value: 'video' },
          { label: 'Tweet', value: 'tweet' },
        ],
        defaultValue: 'video',
      }),
      embedCode: fields.text({
        label: 'Embed code',
        multiline: true,
      }),
    },
  }),
};

const formatting = {
  headingLevels: [2, 3],
  blockTypes: true,
  listTypes: true,
  inlineMarks: true,
} as const;

const markdocConfig: Config = {
  tags: {
    aside: {
      render: 'Aside',
      attributes: {
        icon: {
          type: String,
          required: true,
        },
      },
    },
    'cloud-image': {
      render: 'CloudImage',
      attributes: {
        href: {
          type: String,
          required: true,
        },
        alt: {
          type: String,
        },
      },
    },
    tags: {
      render: 'Tags',
      attributes: {
        tags: {
          type: Array,
          validate(value) {
            if (
              !Array.isArray(value) ||
              value.some(v => typeof v !== 'string')
            ) {
              return [
                {
                  message: 'tags must be text',
                  id: 'tags-text',
                  level: 'critical',
                },
              ];
            }
            return [];
          },
        },
      },
    },
  },
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
      label: 'Docs pages',
      slugField: 'title',
      entryLayout: 'content',
      format: { contentField: 'content' },
      path: 'src/content/pages/**',
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        summary: fields.text({
          label: 'Summary',
          description: 'The summary is used for the metadata description.',
          multiline: true,
        }),
        content: fields.document({
          label: 'Content',
          dividers: true,
          layouts: [[1, 1]],
          links: true,
          componentBlocks,
          formatting,
        }),
      },
    }),

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
        summary: fields.text({
          label: 'Summary',
          description:
            'The summary is displayed on the blog list page and also the metadata description.',
          multiline: true,
        }),
        content: fields.document({
          label: 'Content',
          links: true,
          layouts: [[1, 1]],
          dividers: true,
          tables: true,
          componentBlocks,
          formatting,
        }),
        authors: fields.array(
          fields.relationship({
            label: 'Author',
            collection: 'authors',
            validation: { isRequired: true },
          }),
          {
            label: 'Authors',
            itemLabel: props => props.value ?? 'Please select',
            validation: { length: { min: 1 } },
          }
        ),
      },
    }),

    // ------------------------------
    // Authors
    // ------------------------------
    authors: collection({
      label: 'Authors',
      slugField: 'name',
      path: 'src/content/authors/**',
      schema: {
        name: fields.slug({
          name: {
            label: 'Name',
            validation: {
              length: { min: 1 },
            },
          },
        }),
        link: fields.url({
          label: 'URL',
          description:
            'Optionally link the author name to e.g. their social media.',
          validation: {
            isRequired: false,
          },
        }),
      },
    }),

    // ------------------------------
    // For testing purposes only
    // ------------------------------
    pagesWithMarkdocField: collection({
      label: 'Pages with new editor',
      slugField: 'title',
      format: { contentField: 'content' },
      path: 'src/content/pages/**',
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        content: __experimental_markdoc_field({
          label: 'Content',
          config: markdocConfig,
        }),
      },
    }),
  },
  singletons: {
    // ------------------------------
    // Docs navigation
    // ------------------------------
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
