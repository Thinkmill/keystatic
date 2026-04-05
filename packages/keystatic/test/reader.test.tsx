/** @jest-environment node */
import path from 'path';
import { component, fields, collection, config } from '../src';
import { EntryWithResolvedLinkedFiles, createReader } from '../src/reader';
import { expect, test } from '@jest/globals';
// this whole thing is so the tests run with NODE_OPTIONS=--experimental-vm-modules and without it
import { pkgDir } from '#dir';

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
    other: collection({
      label: 'Other',
      path: 'other/*',
      slugField: 'slug',
      schema: {
        slug: fields.text({ label: 'Slug' }),
        date: fields.date({ label: 'Date' }),
        integer: fields.integer({ label: 'Integer' }),
        number: fields.number({ label: 'Number' }),
        text: fields.text({ label: 'Text' }),
        anotherText: fields.text({ label: 'Another Text' }),
      },
    }),
  },
});

type Post = EntryWithResolvedLinkedFiles<
  (typeof localConfig)['collections']['posts']
>;

(() => {
  const post: {
    title: string;
    publishDate: string | null;
    heroImage: any;
    content: any;
    authors: readonly { name: string; bio: any }[];
  } = {} as any as Post;
  console.log(post);
})();

test('list', async () => {
  const reader = createReader(path.join(pkgDir, 'test-data'), localConfig);
  const result = await reader.collections.posts.list();
  expect(result).toMatchInlineSnapshot(`
    [
      "2023-is-finally-here",
    ]
  `);
});

test('read', async () => {
  const reader = createReader(path.join(pkgDir, 'test-data'), localConfig);
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
        "textAlign": undefined,
        "type": "paragraph",
      },
      {
        "alt": "",
        "children": [
          {
            "text": "",
          },
        ],
        "src": "blank.png",
        "title": "",
        "type": "image",
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

test('read deep', async () => {
  const reader = createReader(path.join(pkgDir, 'test-data'), localConfig);
  const result = await reader.collections.posts.read('2023-is-finally-here', {
    resolveLinkedFiles: true,
  });
  expect(result).toMatchInlineSnapshot(`
    {
      "authors": [
        {
          "bio": [
            {
              "children": [
                {
                  "text": "Dan Cousens",
                },
              ],
              "textAlign": undefined,
              "type": "paragraph",
            },
          ],
          "name": "Dan",
        },
      ],
      "content": [
        {
          "children": [
            {
              "text": "Cool, and things are direct to GitHub?",
            },
          ],
          "textAlign": undefined,
          "type": "paragraph",
        },
        {
          "alt": "",
          "children": [
            {
              "text": "",
            },
          ],
          "src": "blank.png",
          "title": "",
          "type": "image",
        },
        {
          "children": [
            {
              "text": "",
            },
          ],
          "type": "paragraph",
        },
      ],
      "heroImage": "heroImage.png",
      "publishDate": null,
      "title": "oh my there is dark mode, thank god Joss",
    }
  `);
});

test('read all shallow', async () => {
  const reader = createReader(path.join(pkgDir, 'test-data'), localConfig);
  const result = await reader.collections.posts.all();
  expect(result).toMatchInlineSnapshot(`
    [
      {
        "entry": {
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
        },
        "slug": "2023-is-finally-here",
      },
    ]
  `);
});

test('read all deep', async () => {
  const reader = createReader(path.join(pkgDir, 'test-data'), localConfig);
  const result = await reader.collections.posts.all({
    resolveLinkedFiles: true,
  });
  expect(result).toMatchInlineSnapshot(`
    [
      {
        "entry": {
          "authors": [
            {
              "bio": [
                {
                  "children": [
                    {
                      "text": "Dan Cousens",
                    },
                  ],
                  "textAlign": undefined,
                  "type": "paragraph",
                },
              ],
              "name": "Dan",
            },
          ],
          "content": [
            {
              "children": [
                {
                  "text": "Cool, and things are direct to GitHub?",
                },
              ],
              "textAlign": undefined,
              "type": "paragraph",
            },
            {
              "alt": "",
              "children": [
                {
                  "text": "",
                },
              ],
              "src": "blank.png",
              "title": "",
              "type": "image",
            },
            {
              "children": [
                {
                  "text": "",
                },
              ],
              "type": "paragraph",
            },
          ],
          "heroImage": "heroImage.png",
          "publishDate": null,
          "title": "oh my there is dark mode, thank god Joss",
        },
        "slug": "2023-is-finally-here",
      },
    ]
  `);
});

test('errors', async () => {
  const reader = createReader(path.join(pkgDir, 'test-data'), localConfig);
  await expect(reader.collections.other.read('invalid')).rejects
    .toMatchInlineSnapshot(`
    [Error: Invalid data for "invalid" in collection "other":
    date: Date is not a valid date
    integer: Must be a number
    number: Must be a number
    text: Must be a string]
  `);
});

const customReaderPosts = [
  {
    slug: 'custom-post-1',
    entry: {
      title: 'Custom Post 1',
      publishDate: '2024-01-01',
      heroImage: 'image1.png',
      content: [{ type: 'paragraph', children: [{ text: 'Content 1' }] }],
      authors: [
        {
          name: 'Author 1',
          bio: [{ type: 'paragraph', children: [{ text: 'Bio 1' }] }],
        },
      ],
    },
  },
  {
    slug: 'custom-post-2',
    entry: {
      title: 'Custom Post 2',
      publishDate: '2024-02-01',
      heroImage: 'image2.png',
      content: [{ type: 'paragraph', children: [{ text: 'Content 2' }] }],
      authors: [],
    },
  },
];

const customReaderConfig = config({
  storage: { kind: 'local' },
  collections: {
    posts: collection({
      label: 'Posts',
      slugField: 'title',
      path: 'posts/*',
      reader: (() => {
        const data = customReaderPosts;
        return {
          read: async (slug: string, ..._: any[]) => {
            const entry = data.find((item: any) => item.slug === slug);
            return entry?.entry ?? null;
          },
          readOrThrow: async (slug: string, ..._: any[]) => {
            const entry = data.find((item: any) => item.slug === slug);
            if (!entry) {
              throw new Error(
                `Entry "${slug}" not found in collection "posts"`
              );
            }
            return entry.entry;
          },
          all: async () => data,
          list: async () => data.map((item: any) => item.slug),
        };
      })() as any,
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        publishDate: fields.date({ label: 'Publish Date' }),
        heroImage: fields.image({ label: 'Hero Image' }),
        content: fields.document({
          label: 'Content',
          formatting: true,
          dividers: true,
          links: true,
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

test('custom reader list', async () => {
  const reader = createReader(
    path.join(pkgDir, 'test-data'),
    customReaderConfig
  );
  const result = await reader.collections.posts.list();
  expect(result).toEqual(['custom-post-1', 'custom-post-2']);
});

test('custom reader read', async () => {
  const reader = createReader(
    path.join(pkgDir, 'test-data'),
    customReaderConfig
  );
  const result = await reader.collections.posts.read('custom-post-1');
  expect(result).toEqual({
    title: 'Custom Post 1',
    publishDate: '2024-01-01',
    heroImage: 'image1.png',
    content: [{ type: 'paragraph', children: [{ text: 'Content 1' }] }],
    authors: [{ name: 'Author 1', bio: [{ type: 'paragraph', children: [{ text: 'Bio 1' }] }] }],
  });
});

test('custom reader readOrThrow throws for non-existent', async () => {
  const reader = createReader(
    path.join(pkgDir, 'test-data'),
    customReaderConfig
  );
  await expect(
    reader.collections.posts.readOrThrow('non-existent')
  ).rejects.toThrow('Entry "non-existent" not found in collection "posts"');
});

test('custom reader all', async () => {
  const reader = createReader(
    path.join(pkgDir, 'test-data'),
    customReaderConfig
  );
  const result = await reader.collections.posts.all();
  expect(result).toEqual(customReaderPosts);
});

test('custom reader read returns null for non-existent', async () => {
  const reader = createReader(
    path.join(pkgDir, 'test-data'),
    customReaderConfig
  );
  const result = await reader.collections.posts.read('non-existent');
  expect(result).toBeNull();
});
