import {
  config,
  collection,
  singleton,
  fields,
  component,
  NotEditable,
} from '@keystatic/core';
import { block, inline, mark } from '@keystatic/core/content-components';
import { highlighterIcon } from '@keystar/ui/icon/icons/highlighterIcon';
import { NoteToolbar, Note } from './note';

const description = 'Some description';

const components = {
  Something: block({
    label: 'Something',
    schema: {},
  }),
  Highlight: mark({
    label: 'Highlight',
    icon: highlighterIcon,
    schema: {
      variant: fields.select({
        label: 'Variant',
        options: [
          { label: 'Fluro', value: 'fluro' },
          { label: 'Minimal', value: 'minimal' },
          { label: 'Brutalist', value: 'brutalist' },
        ],
        defaultValue: 'fluro',
      }),
    },
  }),
  StatusBadge: inline({
    label: 'StatusBadge',
    schema: {
      status: fields.select({
        label: 'Status',
        options: [
          { label: 'To do', value: 'todo' },
          { label: 'In Progress', value: 'in-progress' },
          { label: 'Ready for review', value: 'ready-for-review' },
          { label: 'Done', value: 'done' },
        ],
        defaultValue: 'todo',
      }),
    },
    ContentView(props) {
      return props.value.status;
    },
  }),
};

const pageBuilderComponents = {
  section: component({
    label: 'Section',
    chromeless: true,
    schema: {
      title: fields.text({ label: 'Section title' }),
      content: fields.child({
        kind: 'block',
        formatting: 'inherit',
        componentBlocks: 'inherit',
        placeholder: 'Write section content...',
      }),
    },
    preview: props => (
      <div
        style={{ border: '1px dashed #cbd5e1', borderRadius: 8, padding: 12 }}
      >
        {props.fields.title.value ? (
          <NotEditable>
            <h3 style={{ marginBottom: 8 }}>{props.fields.title.value}</h3>
          </NotEditable>
        ) : null}
        {props.fields.content.element}
      </div>
    ),
  }),
  twoColumns: component({
    label: 'Two Columns',
    chromeless: true,
    schema: {
      left: fields.child({
        kind: 'block',
        formatting: 'inherit',
        componentBlocks: 'inherit',
        placeholder: 'Left column...',
      }),
      right: fields.child({
        kind: 'block',
        formatting: 'inherit',
        componentBlocks: 'inherit',
        placeholder: 'Right column...',
      }),
    },
    preview: props => (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div
          style={{ border: '1px dashed #cbd5e1', borderRadius: 8, padding: 8 }}
        >
          {props.fields.left.element}
        </div>
        <div
          style={{ border: '1px dashed #cbd5e1', borderRadius: 8, padding: 8 }}
        >
          {props.fields.right.element}
        </div>
      </div>
    ),
  }),
  callToAction: component({
    label: 'Call To Action',
    schema: {
      text: fields.text({ label: 'Text', multiline: true }),
      buttonLabel: fields.text({ label: 'Button label' }),
      buttonHref: fields.text({ label: 'Button href' }),
    },
    preview: props => (
      <NotEditable>
        <div
          style={{
            borderRadius: 10,
            border: '1px solid #bfdbfe',
            background: '#eff6ff',
            padding: 12,
          }}
        >
          <p style={{ margin: 0 }}>
            {props.fields.text.value || 'CTA text...'}
          </p>
          <p style={{ margin: '8px 0 0', fontSize: 12, color: '#1e3a8a' }}>
            {props.fields.buttonLabel.value || 'Button'} →{' '}
            {props.fields.buttonHref.value || '/'}
          </p>
        </div>
      </NotEditable>
    ),
  }),
  imageBlock: component({
    label: 'Image',
    schema: {
      image: fields.image({
        label: 'Image',
        directory: 'public/page-builder/images',
        publicPath: '/page-builder/images/',
      }),
      alt: fields.text({ label: 'Alt text' }),
      caption: fields.text({ label: 'Caption', multiline: true }),
    },
    preview: props => (
      <NotEditable>
        <div
          style={{
            border: '1px dashed #cbd5e1',
            borderRadius: 10,
            padding: 12,
          }}
        >
          <p style={{ margin: 0 }}>
            {props.fields.image.value ? 'Image selected' : 'Upload an image'}
          </p>
        </div>
      </NotEditable>
    ),
  }),
  videoBlock: component({
    label: 'Video',
    schema: {
      video: fields.file({
        label: 'Video file',
        directory: 'public/page-builder/videos',
        publicPath: '/page-builder/videos/',
      }),
      poster: fields.image({
        label: 'Poster image',
        directory: 'public/page-builder/images',
        publicPath: '/page-builder/images/',
      }),
      caption: fields.text({ label: 'Caption', multiline: true }),
    },
    preview: props => (
      <NotEditable>
        <div
          style={{
            border: '1px dashed #cbd5e1',
            borderRadius: 10,
            padding: 12,
          }}
        >
          <p style={{ margin: 0 }}>
            {props.fields.video.value?.filename || 'Upload a video file'}
          </p>
        </div>
      </NotEditable>
    ),
  }),
  fileBlock: component({
    label: 'File',
    schema: {
      file: fields.file({
        label: 'File',
        directory: 'public/page-builder/files',
        publicPath: '/page-builder/files/',
      }),
      label: fields.text({ label: 'Link label' }),
      description: fields.text({ label: 'Description', multiline: true }),
    },
    preview: props => (
      <NotEditable>
        <div
          style={{
            border: '1px dashed #cbd5e1',
            borderRadius: 10,
            padding: 12,
          }}
        >
          <p style={{ margin: 0 }}>
            {props.fields.label.value ||
              props.fields.file.value?.filename ||
              'Upload a file'}
          </p>
        </div>
      </NotEditable>
    ),
  }),
  textBlock: component({
    label: 'Text',
    schema: {
      text: fields.child({
        kind: 'block',
        formatting: 'inherit',
        placeholder: 'Write text...',
      }),
    },
    preview: props => (
      <div
        style={{
          border: '1px dashed #cbd5e1',
          borderRadius: 10,
          padding: 12,
        }}
      >
        {props.fields.text.element}
      </div>
    ),
  }),
  imageWithText: component({
    label: 'Image With Text',
    schema: {
      title: fields.text({ label: 'Title' }),
      image: fields.image({
        label: 'Image',
        directory: 'public/page-builder/images',
        publicPath: '/page-builder/images/',
      }),
      alt: fields.text({ label: 'Alt text' }),
      content: fields.child({
        kind: 'block',
        formatting: 'inherit',
        placeholder: 'Write text next to the image...',
      }),
      imagePosition: fields.select({
        label: 'Image position',
        options: [
          { label: 'Left', value: 'left' },
          { label: 'Right', value: 'right' },
        ],
        defaultValue: 'left',
      }),
    },
    preview: props => (
      <div style={{ border: '1px dashed #cbd5e1', borderRadius: 10, padding: 12 }}>
        <p style={{ margin: 0 }}>{props.fields.title.value || 'Image With Text'}</p>
      </div>
    ),
  }),
  videoHeader: component({
    label: 'Video Header',
    schema: {
      title: fields.text({ label: 'Title' }),
      subtitle: fields.text({ label: 'Subtitle', multiline: true }),
      video: fields.file({
        label: 'Video',
        directory: 'public/page-builder/videos',
        publicPath: '/page-builder/videos/',
      }),
      poster: fields.image({
        label: 'Poster image',
        directory: 'public/page-builder/images',
        publicPath: '/page-builder/images/',
      }),
    },
    preview: props => (
      <div style={{ border: '1px dashed #cbd5e1', borderRadius: 10, padding: 12 }}>
        <p style={{ margin: 0 }}>{props.fields.title.value || 'Video Header'}</p>
      </div>
    ),
  }),
  contentBlock: component({
    label: 'Content',
    schema: {
      eyebrow: fields.text({ label: 'Eyebrow' }),
      heading: fields.text({ label: 'Heading' }),
      body: fields.child({
        kind: 'block',
        formatting: 'inherit',
        placeholder: 'Write your content...',
      }),
    },
    preview: props => (
      <div style={{ border: '1px dashed #cbd5e1', borderRadius: 10, padding: 12 }}>
        <p style={{ margin: 0 }}>{props.fields.heading.value || 'Content Block'}</p>
      </div>
    ),
  }),
};

const pageBlocks = {
  hero: {
    label: 'Hero',
    schema: fields.object({
      eyebrow: fields.text({ label: 'Eyebrow' }),
      heading: fields.text({ label: 'Heading' }),
      subheading: fields.text({ label: 'Subheading', multiline: true }),
      backgroundImage: fields.image({
        label: 'Background image',
        directory: 'public/page-builder/images',
        publicPath: '/page-builder/images/',
      }),
      primaryCtaLabel: fields.text({ label: 'Primary button label' }),
      primaryCtaHref: fields.text({ label: 'Primary button link' }),
      secondaryCtaLabel: fields.text({ label: 'Secondary button label' }),
      secondaryCtaHref: fields.text({ label: 'Secondary button link' }),
    }),
  },
  content: {
    label: 'Content',
    schema: fields.object({
      eyebrow: fields.text({ label: 'Eyebrow' }),
      heading: fields.text({ label: 'Heading' }),
      body: fields.text({ label: 'Body', multiline: true }),
    }),
  },
  image: {
    label: 'Image',
    schema: fields.object({
      image: fields.image({
        label: 'Image',
        directory: 'public/page-builder/images',
        publicPath: '/page-builder/images/',
      }),
      alt: fields.text({ label: 'Alt text' }),
      caption: fields.text({ label: 'Caption', multiline: true }),
    }),
  },
  videoHeader: {
    label: 'Video Hero',
    schema: fields.object({
      title: fields.text({ label: 'Title' }),
      subtitle: fields.text({ label: 'Subtitle', multiline: true }),
      video: fields.file({
        label: 'Video',
        directory: 'public/page-builder/videos',
        publicPath: '/page-builder/videos/',
      }),
      poster: fields.image({
        label: 'Poster image',
        directory: 'public/page-builder/images',
        publicPath: '/page-builder/images/',
      }),
    }),
  },
  imageWithText: {
    label: 'Image With Text',
    schema: fields.object({
      title: fields.text({ label: 'Title' }),
      image: fields.image({
        label: 'Image',
        directory: 'public/page-builder/images',
        publicPath: '/page-builder/images/',
      }),
      alt: fields.text({ label: 'Alt text' }),
      content: fields.text({ label: 'Content', multiline: true }),
      imagePosition: fields.select({
        label: 'Image position',
        options: [
          { label: 'Left', value: 'left' },
          { label: 'Right', value: 'right' },
        ],
        defaultValue: 'left',
      }),
    }),
  },
  file: {
    label: 'File',
    schema: fields.object({
      file: fields.file({
        label: 'File',
        directory: 'public/page-builder/files',
        publicPath: '/page-builder/files/',
      }),
      label: fields.text({ label: 'Link label' }),
      description: fields.text({ label: 'Description', multiline: true }),
    }),
  },
  stats: {
    label: 'Stats',
    schema: fields.object({
      title: fields.text({ label: 'Title' }),
      items: fields.array(
        fields.object({
          label: fields.text({ label: 'Label' }),
          value: fields.text({ label: 'Value' }),
        }),
        {
          label: 'Stats',
          itemLabel: props => props.fields.label.value || props.fields.value.value,
        }
      ),
    }),
  },
  testimonial: {
    label: 'Testimonial',
    schema: fields.object({
      quote: fields.text({ label: 'Quote', multiline: true }),
      name: fields.text({ label: 'Name' }),
      role: fields.text({ label: 'Role' }),
      avatar: fields.image({
        label: 'Avatar',
        directory: 'public/page-builder/images',
        publicPath: '/page-builder/images/',
      }),
    }),
  },
  spacer: {
    label: 'Spacer',
    schema: fields.object({
      size: fields.select({
        label: 'Size',
        options: [
          { label: 'Small', value: 'small' },
          { label: 'Medium', value: 'medium' },
          { label: 'Large', value: 'large' },
        ],
        defaultValue: 'medium',
      }),
    }),
  },
  featureGrid: {
    label: 'Feature Grid',
    schema: fields.object({
      title: fields.text({ label: 'Title' }),
      items: fields.array(
        fields.object({
          title: fields.text({ label: 'Item title' }),
          description: fields.text({ label: 'Description', multiline: true }),
        }),
        {
          label: 'Features',
          itemLabel: props => props.fields.title.value || 'Feature',
        }
      ),
    }),
  },
  faq: {
    label: 'FAQ',
    schema: fields.object({
      title: fields.text({ label: 'Title' }),
      items: fields.array(
        fields.object({
          question: fields.text({ label: 'Question' }),
          answer: fields.text({ label: 'Answer', multiline: true }),
        }),
        {
          label: 'FAQ items',
          itemLabel: props => props.fields.question.value || 'Question',
        }
      ),
    }),
  },
  logoCloud: {
    label: 'Logo Cloud',
    schema: fields.object({
      title: fields.text({ label: 'Title' }),
      logos: fields.array(
        fields.object({
          name: fields.text({ label: 'Name' }),
          logo: fields.image({
            label: 'Logo',
            directory: 'public/page-builder/images',
            publicPath: '/page-builder/images/',
          }),
        }),
        {
          label: 'Logos',
          itemLabel: props => props.fields.name.value || 'Logo',
        }
      ),
    }),
  },
};

export default config({
  storage: {
    kind: 'github',
    repo: 'Thinkmill/keystatic-test-repo',
  },
  ui: {
    brand: {
      name: 'Dev: Next.js (app)',
    },
  },
  // storage: {
  //   kind: 'local',
  // },
  collections: {
    posts: collection({
      label: 'Posts',
      slugField: 'slug',
      schema: {
        title: fields.text({
          label: 'Title',
        }),
        slug: fields.text({
          label: 'Slug',
          validation: {
            length: { min: 4 },
            pattern: {
              regex: /^[a-zA-Z0-9-]+$/,
              message: 'Slug must only contain alphanumeric characters and -',
            },
          },
        }),
        blocks: fields.blocks(
          {
            a: {
              label: 'A',
              schema: fields.object({
                onA: fields.text({ label: 'On A' }),
              }),
            },
            b: {
              label: 'B',
              itemLabel: props => `B: ${props.fields.onB.value}`,
              schema: fields.object({
                onB: fields.text({ label: 'On B' }),
              }),
            },
          },
          { label: 'Blocks' }
        ),
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
            blockChild: component({
              label: 'Block Child',
              preview: props => <div>{props.fields.child.element}</div>,
              schema: {
                child: fields.child({
                  kind: 'block',
                  placeholder: 'Content...',
                }),
              },
            }),
            inlineChild: component({
              label: 'Inline Child',
              preview: props => (
                <div>
                  <div>{props.fields.child.element}</div>{' '}
                  <div>{props.fields.child2.element}</div>
                </div>
              ),
              schema: {
                child: fields.child({
                  kind: 'inline',
                  placeholder: 'Content...',
                }),
                child2: fields.child({
                  kind: 'inline',
                  placeholder: 'Content...',
                }),
              },
            }),
            something: component({
              label: 'Some Component',
              preview: () => null,
              schema: {},
            }),
            notice: component({
              preview: function (props) {
                return (
                  <Note tone={props.fields.tone.value}>
                    {props.fields.content.element}
                  </Note>
                );
              },
              label: 'Note',
              chromeless: true,
              schema: {
                tone: fields.select({
                  label: 'Tone',
                  options: [
                    { value: 'info', label: 'Info' },
                    { value: 'caution', label: 'Caution' },
                    { value: 'positive', label: 'Positive' },
                    { value: 'critical', label: 'Critical' },
                  ],
                  defaultValue: 'info',
                }),
                content: fields.child({
                  kind: 'block',
                  placeholder: '',
                  formatting: 'inherit',
                  dividers: 'inherit',
                  links: 'inherit',
                  componentBlocks: 'inherit',
                  images: 'inherit',
                }),
              },
              toolbar({ props, onRemove }) {
                return (
                  <NoteToolbar
                    onChange={tone => {
                      props.fields.tone.onChange(tone);
                    }}
                    onRemove={onRemove}
                    tone={props.fields.tone.value}
                    tones={props.fields.tone.schema.options}
                  />
                );
              },
            }),
            'related-links': component({
              label: 'Related Links',
              preview: props => (
                <div>
                  {props.fields.links.elements.map(element => {
                    return (
                      <div key={element.key}>
                        <NotEditable>
                          <h1>{element.fields.heading.value}</h1>
                        </NotEditable>
                        {element.fields.content.element}
                      </div>
                    );
                  })}
                </div>
              ),
              schema: {
                links: fields.array(
                  fields.object({
                    heading: fields.text({ label: 'Heading' }),
                    content: fields.child({
                      kind: 'inline',
                      placeholder: 'Content...',
                    }),
                    href: fields.text({ label: 'Link' }),
                  }),
                  {
                    asChildTag: 'related-link',
                  }
                ),
              },
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
    people: collection({
      label: 'People',
      path: 'some/directory/people/*/',
      slugField: 'username',
      entryLayout: 'content',
      format: { contentField: 'bio' },
      schema: {
        name: fields.text({ label: 'Name' }),
        username: fields.text({
          label: 'Username',
          validation: { length: { min: 4 } },
        }),
        bio: fields.document({
          label: 'Bio',
          images: true,
          formatting: true,
          dividers: true,
          links: true,
        }),
        notes: fields.document({
          label: 'Notes',
          formatting: {
            inlineMarks: {
              bold: true,
              code: true,
              italic: true,
              strikethrough: true,
            },
            listTypes: true,
            softBreaks: true,
          },
        }),
        favouritePost: fields.relationship({
          label: 'Favourite Post',
          collection: 'posts',
          validation: { isRequired: true },
        }),
      },
    }),
    packages: collection({
      label: 'Packages',
      path: 'packages/*/somewhere/else/',
      slugField: 'name',
      format: 'json',
      schema: {
        name: fields.text({ label: 'Name' }),
        someFilepath: fields.pathReference({ label: 'Some Filepath' }),
        someFilepathInPosts: fields.pathReference({
          label: 'Some Filepath in posts',
          pattern: 'posts/**',
          validation: { isRequired: true },
        }),
      },
    }),
    singlefileposts: collection({
      label: 'Single File Posts',
      path: 'single-file-posts/**',
      slugField: 'title',
      format: { contentField: 'content' },
      entryLayout: 'content',
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        content: fields.document({
          label: 'Content',
          formatting: true,
          dividers: true,
          links: true,
        }),
      },
    }),
    mdx: collection({
      label: 'MDX',
      path: 'mdx/**',
      slugField: 'title',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        summary: fields.mdx.inline({
          label: 'Summary',
        }),
        content: fields.mdx({
          label: 'Content',
          components,
        }),
      },
    }),
    markdocCollection: collection({
      label: 'Markdoc',
      path: 'markdoc/**',
      slugField: 'title',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        summary: fields.markdoc.inline({
          label: 'Summary',
        }),
        content: fields.markdoc({
          label: 'Content',
          components,
        }),
      },
    }),
    conditionalContent: collection({
      label: 'Conditional Content',
      path: 'conditionalContent/**',
      slugField: 'title',
      format: { contentField: ['content', 'value', 'content'] },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        content: fields.conditional(
          fields.checkbox({ label: 'With content' }),
          {
            true: fields.object({
              summary: fields.text({ label: 'Summary' }),
              content: fields.markdoc({ label: 'Content' }),
            }),
            false: fields.object({
              content: fields.emptyContent({ extension: 'mdoc' }),
            }),
          }
        ),
      },
    }),
  },
  singletons: {
    pages: singleton({
      label: 'Pages',
      path: 'pages/index',
      schema: {
        items: fields.array(
          fields.object({
            title: fields.text({ label: 'Page title' }),
            isHomepage: fields.checkbox({
              label: 'Use as homepage (/)',
              defaultValue: false,
            }),
            slug: fields.slug({ name: { label: 'Slug' } }),
            excerpt: fields.text({
              label: 'Excerpt',
              description: 'Short description shown above content.',
              multiline: true,
            }),
            blocks: fields.blocks(pageBlocks, {
              label: 'Page blocks',
            }),
          }),
          {
            label: 'Pages',
            itemLabel: props =>
              props.fields.title.value ||
              props.fields.slug.value.slug ||
              'Untitled page',
          }
        ),
      },
    }),
    settings: singleton({
      label: 'Settings',
      schema: {
        something: fields.checkbox({ label: 'Something' }),
        logo: fields.image({ label: 'Logo' }),
        navigation: fields.array(
          fields.object({
            label: fields.text({ label: 'Label' }),
            slug: fields.text({
              label: 'Page slug',
              description:
                'Use the page slug without a leading slash, for example: about/team',
            }),
            visible: fields.checkbox({
              label: 'Visible in navigation',
              defaultValue: true,
            }),
          }),
          {
            label: 'Navigation',
            itemLabel: props =>
              props.fields.label.value ||
              props.fields.slug.value ||
              'Navigation item',
          }
        ),
      },
    }),
    markdoc: singleton({
      label: 'Markdoc',
      schema: {
        markdoc: fields.markdoc({ label: 'Markdoc' }),
      },
    }),
    fields: singleton({
      label: 'All Fields',
      schema: {
        text: fields.text({ label: 'Text', description }),
        title: fields.slug({
          name: { label: 'Title', description },
          slug: { description },
        }),
        integer: fields.integer({ label: 'Integer', description }),
        number: fields.number({ label: 'Number', description }),
        numberWithSteps: fields.number({
          label: 'Number with steps',
          description,
          step: 0.02,
          validation: { step: true },
        }),
        checkbox: fields.checkbox({ label: 'Checkbox', description }),
        select: fields.select({
          label: 'Select',
          description,
          options: [
            { value: 'one', label: 'One' },
            { value: 'two', label: 'Two' },
            { value: 'three', label: 'Three' },
          ],
          defaultValue: 'one',
        }),
        multiselect: fields.multiselect({
          label: 'Multiselect',
          description,
          options: [
            { value: 'one', label: 'One' },
            { value: 'two', label: 'Two' },
            { value: 'three', label: 'Three' },
          ],
          defaultValue: ['one'],
        }),
        array: fields.array(fields.text({ label: 'Text', description }), {
          label: 'Array',
          description,
        }),
        date: fields.date({ label: 'Date', description }),
        document: fields.document({
          label: 'Document',
          description,
          formatting: true,
          dividers: true,
          links: true,
        }),
        file: fields.file({ label: 'File', description }),
        image: fields.image({ label: 'Image', description }),
        object: fields.object({
          a: fields.text({ label: 'Object.A' }),
          b: fields.text({ label: 'Object.B' }),
        }),
        objectLayout: fields.object(
          {
            a: fields.text({ label: 'ObjectLayout.A' }),
            b: fields.text({ label: 'ObjectLayout.B' }),
          },
          { layout: [6, 6] }
        ),
        address: fields.object(
          {
            street1: fields.text({ label: 'Address line 1' }),
            street2: fields.text({ label: 'Address line 2' }),
            city: fields.text({
              label: 'City',
              validation: { length: { min: 1 } },
            }),
            state: fields.select({
              label: 'State',
              options: [
                { value: 'nsw', label: 'New South Wales' },
                { value: 'vic', label: 'Victoria' },
                { value: 'qld', label: 'Queensland' },
                { value: 'sa', label: 'South Australia' },
                { value: 'wa', label: 'Western Australia' },
                { value: 'tas', label: 'Tasmania' },
                { value: 'nt', label: 'Northern Territory' },
                { value: 'act', label: 'Australian Capital Territory' },
              ],
              defaultValue: 'nsw',
            }),
            postcode: fields.text({ label: 'Postcode' }),
            country: fields.text({ label: 'Country' }),
          },
          {
            label: 'Address',
            description,
            layout: [12, 12, 6, 3, 3, 12],
          }
        ),
        pathReference: fields.pathReference({
          label: 'Path Reference',
          description,
        }),
        relationship: fields.relationship({
          label: 'Relationship',
          description,
          collection: 'posts',
        }),
        markdoc: fields.markdoc({ label: 'Markdoc' }),
      },
    }),
  },
});
