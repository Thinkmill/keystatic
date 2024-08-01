import { config, fields, collection, singleton } from '@keystatic/core';
import {
  block,
  cloudImage,
  repeating,
  wrapper,
} from '@keystatic/core/content-components';
import { Badge } from '@keystar/ui/badge';
import { Flex } from '@keystar/ui/layout';
import { tagIcon } from '@keystar/ui/icon/icons/tagIcon';
import { isNonEmptyArray } from 'emery/guards';
import { assert } from 'emery/assertions';
import Markdoc, { Config, Node, ValidateError } from '@markdoc/markdoc';

export const components = {
  tags: block({
    label: 'Tags',
    description: 'Insert tags',
    icon: tagIcon,
    schema: {
      tags: fields.multiselect({
        label: 'Project tags',
        options: [
          { label: 'Local', value: 'Local' },
          { label: 'GitHub', value: 'GitHub' },
          { label: 'Cloud', value: 'Cloud' },
          { label: 'New project', value: 'New project' },
          { label: 'Existing project', value: 'Existing project' },
          { label: 'Astro', value: 'Astro' },
          { label: 'Next.js', value: 'Next.js' },
          { label: 'Remix', value: 'Remix' },
        ],
      }),
    },
    ContentView({ value }) {
      return (
        <Flex gap="small">
          {value.tags.map(tag => (
            <Badge>{tag}</Badge>
          ))}
        </Flex>
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
          { label: 'Number', value: 'number' },
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
  'cloud-image': cloudImage({
    label: 'Cloud Image',
  }),
  layout: repeating({
    children: 'layout-area',
    label: 'Layout',
    schema: {},
    validation: { children: { min: 2, max: 2 } },
    ContentView(props) {
      return (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
          }}
        >
          {props.children}
        </div>
      );
    },
  }),
  'layout-area': wrapper({
    label: 'Layout area',
    schema: {},
    forSpecificLocations: true,
  }),
};

const markdocConfig: Config = {
  tags: fields.markdoc.createMarkdocConfig({
    components,
    render: {
      tags: {
        tags: 'Tags',
        'cloud-image': 'CloudImage',
        embed: 'Embed',
        'field-demo': 'FieldDemo',
        aside: 'Aside',
        layout: 'Layout',
        'layout-area': 'LayoutArea',
      },
    },
  }).tags,
  nodes: {
    document: { ...Markdoc.nodes.document, render: 'Fragment' },
    link: { ...Markdoc.nodes.link, render: 'Link' },
    heading: {
      children: ['inline'],
      render: 'Heading',
      attributes: {
        level: { type: Number, required: true },
      },
    },
    paragraph: { ...Markdoc.nodes.paragraph, render: 'Paragraph' },
    fence: {
      render: 'CodeBlock',
      attributes: {
        content: { type: String, required: true },
        language: { type: String },
        process: { type: Boolean, render: false, default: true },
      },
    },
    item: { ...Markdoc.nodes.item, render: 'ListItem' },
    hr: { ...Markdoc.nodes.hr, render: 'Divider' },
    code: {
      render: 'Code',
      attributes: {
        content: { type: String, required: true },
      },
    },
    list: {
      render: 'List',
      children: ['item'],
      attributes: {
        ordered: { type: Boolean, required: true },
        start: { type: Number },
        marker: { type: String, render: false },
      },
    },
  },
};

class MarkdocFailure extends Error {
  constructor(errors: [ValidateError, ...ValidateError[]]) {
    super();
    this.name = 'MarkdocValidationFailure';
    this.message =
      `Errors in ${errors[0].location?.file}:\n` +
      errors
        .map(error => {
          const location = error.error.location || error.location;
          return `${errors[0].location?.file}:${
            // the +1 is because location.start.line is 0-based
            // but tools generally use 1-based line numbers
            location?.start.line ? location.start.line + 1 : '(unknown line)'
          }${
            location?.start.character ? `:${location.start.character}` : ''
          }: ${error.error.message}`;
        })
        .join('\n');
  }
}

export function transformMarkdoc(node: Node) {
  const errors = Markdoc.validate(node, markdocConfig);
  if (isNonEmptyArray(errors)) {
    throw new MarkdocFailure(errors);
  }
  const renderableNode = Markdoc.transform(node, markdocConfig);

  assert(renderableNode !== null && typeof renderableNode !== 'string');
  return renderableNode;
}

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
      columns: ['title'],
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        summary: fields.text({
          label: 'Summary',
          description: 'The summary is used for the metadata description.',
          multiline: true,
        }),
        content: fields.markdoc({
          label: 'Content',
          components,
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
      columns: ['title', 'publishedOn'],
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
        content: fields.markdoc({
          label: 'Content',
          components,
        }),
        authors: fields.multiRelationship({
          label: 'Authors',
          collection: 'authors',
          validation: { length: { min: 1 } },
        }),
      },
    }),

    // ------------------------------
    // Authors
    // ------------------------------
    authors: collection({
      label: 'Authors',
      slugField: 'name',
      path: 'src/content/authors/**',
      columns: ['name', 'link'],
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
      columns: ['title', 'type', 'url', 'repoUrl', 'sortIndex'],
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
        content: fields.markdoc({
          label: 'Content',
          description:
            'The long form copy for the project page. A link to a dedicated page will be available if this field is filled.',
          components: {
            aside: components['aside'],
            'cloud-image': components['cloud-image'],
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
                status: fields.select({
                  label: 'Status',
                  options: [
                    { label: 'Default', value: 'default' },
                    { label: 'New', value: 'new' },
                    { label: 'Experimental', value: 'experimental' },
                    { label: 'Deprecated', value: 'deprecated' },
                  ],
                  defaultValue: 'default',
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
