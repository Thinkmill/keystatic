/** @jest-environment node */
import path from 'path';
import { component, fields, collection, config } from './src';
import { createReader } from './src/reader';

const localConfig = config({
  storage: {
    kind: 'github',
    repo: { owner: 'Thinkmill', name: 'keystatic-test-repo' },
  },
  collections: {
    posts: collection({
      label: 'Posts',
      slugField: 'title',
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        publishDate: fields.date({
          label: 'Publish Date',
        }),
        heroImage: fields.image({ label: 'Hero Image' }),
        content: fields.document({
          label: 'Content',
          formatting: true,
          dividers: true,
          links: true,
          componentBlocks: {
            image: component({
              label: 'Image',
              preview: function Preview() {
                return null;
              },
              schema: {
                image: fields.image({ label: 'Image' }),
                alt: fields.text({ label: 'Alt text', multiline: true }),
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
          { label: 'Authors', itemLabel: props => props.fields.name.value }
        ),
      },
    }),
  },
});

test('list', async () => {
  const reader = createReader(path.join(__dirname, 'test-data'), localConfig);
  const result = await reader.collections.posts.list();
  expect(result).toMatchInlineSnapshot(`
    [
      "2023-is-finally-here",
    ]
  `);
});

test('read', async () => {
  const reader = createReader(path.join(__dirname, 'test-data'), localConfig);
  const result = await reader.collections.posts.read('2023-is-finally-here');
  expect(result).toMatchInlineSnapshot(`
    {
      "authors": [
        {
          "bio": [Function],
          "name": "Dan",
        },
      ],
      "content": [Function],
      "heroImage": "heroImage.png",
      "publishDate": null,
      "title": "oh my there is dark mode, thank god Joss",
    }
  `);
  const content = await result!.content();
  expect(content).toMatchInlineSnapshot(`
    [
      {
        "children": [
          {
            "text": "Cool, and things are direct to GitHub?",
          },
        ],
        "type": "paragraph",
      },
      {
        "children": [
          {
            "children": [
              {
                "text": "",
              },
            ],
            "type": "component-inline-prop",
          },
        ],
        "component": "image",
        "props": {
          "alt": "",
          "image": "blank.png",
        },
        "type": "component-block",
      },
      {
        "children": [
          {
            "text": "",
          },
        ],
        "type": "paragraph",
      },
    ]
  `);
});
