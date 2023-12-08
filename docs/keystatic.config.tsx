import { config, fields, collection, singleton } from '@keystatic/core';
import {
  __experimental_markdoc_field,
  __experimental_markdoc_field_cloudImageBlock,
} from '@keystatic/core/form/fields/markdoc';
import { cloudImage } from '@keystatic/core/component-blocks';
import {
  block,
  inline,
  mark,
  wrapper,
} from '@keystatic/core/content-components';
import { highlighterIcon } from '@keystar/ui/icon/icons/highlighterIcon';

import { aside, embed, fieldDemo, tags } from './src/component-blocks';
import { Flex } from '@keystar/ui/layout';

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

const shouldUseCloudStorage = process.env.NODE_ENV === 'production';

function makePreviewUrl(previewUrl: string) {
  return shouldUseCloudStorage
    ? `/preview/start?branch={branch}&to=${previewUrl}`
    : previewUrl;
}

export default config({
  storage: shouldUseCloudStorage
    ? { kind: 'cloud', pathPrefix: 'docs' }
    : { kind: 'local' },
  cloud: {
    project: 'thinkmill-labs/keystatic-site',
  },
  ui: {
    brand: {
      name: 'Keystatic Docs',
    },
    navigation: {
      Pages: ['pages', 'blog', 'projects', 'resources'],
      Config: ['authors', 'navigation'],
      Experimental: ['pagesWithMarkdocField'],
    },
  },
  collections: {
    // ------------------------------
    // Docs pages
    // ------------------------------
    pages: collection({
      label: 'Documentation',
      slugField: 'title',
      entryLayout: 'content',
      format: { contentField: 'content' },
      path: 'src/content/pages/**',
      previewUrl: makePreviewUrl('/docs/{slug}'),
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
      label: 'Blog',
      slugField: 'title',
      path: 'src/content/blog/**',
      entryLayout: 'content',
      format: {
        contentField: 'content',
      },
      previewUrl: makePreviewUrl('/blog/{slug}'),
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
      label: 'Showcase',
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
    // Resources
    // ------------------------------
    resources: collection({
      label: 'Resources',
      path: 'src/content/resources/*',
      slugField: 'title',
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        type: fields.conditional(
          fields.select({
            label: 'Resource type',
            options: [
              { label: 'YouTube video', value: 'youtube-video' },
              { label: 'YouTube playlist', value: 'youtube-playlist' },
              { label: 'Article', value: 'article' },
            ],
            defaultValue: 'youtube-video',
          }),
          {
            // Single videos
            'youtube-video': fields.object({
              videoId: fields.text({
                label: 'Video ID',
                description: 'The ID of the video (not the URL!)',
                validation: { length: { min: 1 } },
              }),
              thumbnail: fields.cloudImage({
                label: 'Video thumbnail',
                description: 'A 16/9 thumbnail image for the video.',
              }),
              kind: fields.select({
                label: 'Video kind',
                options: [
                  { label: 'Talk', value: 'talk' },
                  { label: 'Screencast', value: 'screencast' },
                ],
                defaultValue: 'screencast',
              }),
              description: fields.text({
                label: 'Video description',
                multiline: true,
                validation: { length: { min: 1 } },
              }),
            }),
            // Playlists
            'youtube-playlist': fields.object({
              playlistId: fields.text({
                label: 'Playlist ID',
                description: 'The ID of the playlist (not the URL!)',
                validation: { length: { min: 1 } },
              }),
              thumbnail: fields.cloudImage({
                label: 'Video thumbnail',
                description: 'A 16/9 thumbnail image for the video.',
              }),
              description: fields.text({
                label: 'Playlist description',
                multiline: true,
                validation: { length: { min: 1 } },
              }),
            }),
            // Articles
            article: fields.object({
              url: fields.url({
                label: 'Article URL',
                validation: { isRequired: true },
              }),
              authorName: fields.text({
                label: 'Author name',
                validation: { length: { min: 1 } },
              }),
              description: fields.text({
                label: 'Article description',
                multiline: true,
              }),
            }),
          }
        ),
        sortIndex: fields.integer({
          label: 'Sort index',
          description:
            'A number value to sort items (low to high) on the front end.',
          defaultValue: 10,
        }),
      },
    }),

    // ------------------------------
    // For testing purposes only
    // ------------------------------
    pagesWithMarkdocField: collection({
      label: 'ProseMirror editor',
      slugField: 'title',
      format: { contentField: 'content' },
      path: 'src/content/pages/**',
      entryLayout: 'content',
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        summary: fields.text({
          label: 'Summary',
          description: 'The summary is used for the metadata description.',
          multiline: true,
        }),
        content: __experimental_markdoc_field({
          label: 'Content',
          components: {
            tags: block({
              label: 'Tags',
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
              ContentView({ value }) {
                return (
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    {value.tags.map(tag => (
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
            }),
            embed: block({
              label: 'Embed',
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
              ContentView({ value }) {
                return (
                  <pre>
                    <code>{value.embedCode || '(no embed code set)'}</code>
                  </pre>
                );
              },
            }),
            'field-demo': block({
              label: 'Field demo',
              schema: {
                field: fields.select({
                  label: 'Field',
                  defaultValue: 'text',
                  options: [
                    { label: 'Date', value: 'date' },
                    { label: 'Datetime', value: 'datetime' },
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
              ContentView({ value }) {
                return value.field ? (
                  <>
                    Field: <code>{value.field}</code>
                  </>
                ) : (
                  '(no field selected)'
                );
              },
            }),
            aside: wrapper({
              label: 'Aside',
              schema: {
                icon: fields.text({
                  label: 'Emoji icon...',
                }),
              },
              ContentView({ value, children }) {
                return (
                  <Flex gap="medium">
                    <span contentEditable={false}>{value.icon}</span>
                    <div>{children}</div>
                  </Flex>
                );
              },
            }),
            something: block({
              label: 'Something',
              schema: {
                text: fields.text({ label: 'Text' }),
              },
            }),
            'cloud-image': __experimental_markdoc_field_cloudImageBlock({
              label: 'Cloud Image',
            }),
            'inline-thing': inline({
              label: 'Inline thing',
              schema: {
                something: fields.text({ label: 'Something' }),
              },
            }),
            highlight: mark({
              label: 'Highlight',
              icon: highlighterIcon,
              schema: {},
              tag: 'mark',
            }),
            wrapper: wrapper({
              label: 'Wrapper',
              schema: {},
            }),
          },
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
                isNew: fields.checkbox({
                  label: 'Is new?',
                  description: 'Show a "new" badge next to this item',
                  defaultValue: false,
                }),
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
