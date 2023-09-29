import { config, fields, collection, singleton } from '@keystatic/core';
import { __experimental_markdoc_field } from '@keystatic/core/form/fields/markdoc';
import { cloudImage } from '@keystatic/core/component-blocks';
import { Config } from '@markdoc/markdoc';

import { aside, embed, fieldDemo, tags } from './src/component-blocks';

export const componentBlocks = {
  aside,
  'cloud-image': cloudImage({ label: 'Cloud Image' }),
  tags,
  'field-demo': fieldDemo,
  embed,
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

const shouldUseCloudStorage = process.env.NODE_ENV === 'production';

export default config({
  storage: shouldUseCloudStorage
    ? { kind: 'cloud', pathPrefix: 'docs' }
    : { kind: 'local' },
  cloud: {
    project: 'thinkmill-labs/keystatic-site',
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
      previewUrl: '/docs/{slug}',
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
      previewUrl: '/blog/{slug}',
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
    // Projects
    // ------------------------------
    projects: collection({
      label: 'Projects (Showcase)',
      slugField: 'title',
      path: 'src/content/projects/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        type: fields.select({
          label: 'Type',
          options: [
            { label: 'Production', value: 'production' },
            { label: 'Demo', value: 'demo' },
          ],
          defaultValue: 'demo',
        }),
        url: fields.url({ label: 'URL' }),
        repoUrl: fields.url({
          label: 'Repo URL',
          description:
            'Fill this only for pulic repos, where it makes sense to share.',
        }),
        summary: fields.text({
          label: 'Summary',
          multiline: true,
          description: 'This will be used on the homepage listing.',
        }),
        coverImage: fields.cloudImage({
          label: 'Cover image',
        }),
        sortIndex: fields.integer({ label: 'Sort Index', defaultValue: 100 }),
        content: fields.document({
          label: 'Content',
          description:
            'The long form copy for the project page. A link to a dedicated page will be available if this field is filled.',
          formatting: true,
          links: true,
          componentBlocks: {
            aside: componentBlocks['aside'],
            'cloud-image': componentBlocks['cloud-image'],
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
        summary: fields.text({
          label: 'Summary',
          description: 'The summary is used for the metadata description.',
          multiline: true,
        }),
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
