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
    settings: singleton({
      label: 'Settings',
      schema: {
        something: fields.checkbox({ label: 'Something' }),
        logo: fields.image({ label: 'Logo' }),
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
