import { expect, test } from '@jest/globals';
import {
  ComponentSchema,
  ParsedValueForComponentSchema,
  component,
  fields,
} from '..';
import { getInitialPropsValue } from './initial-values';
import { serializeProps as _serializeProps } from './serialize-props';

const serializeProps: <Schema extends ComponentSchema>(
  rootValue: ParsedValueForComponentSchema<Schema>,
  rootSchema: Schema,
  // note you might have a slug without a slug field when serializing props inside a component block or etc. in the editor
  slugField: string | undefined,
  slug: string | undefined,
  shouldSuggestFilenamePrefix: boolean
) => {
  value: unknown;
  extraFiles: {
    path: string;
    parent: string | undefined;
    contents: Uint8Array;
  }[];
} = _serializeProps as any;

test('serialize empty image', () => {
  const schema = fields.object({
    image: fields.image({ label: 'Image' }),
  });
  const initial = getInitialPropsValue(schema);
  expect(initial).toMatchInlineSnapshot(`
    {
      "image": null,
    }
  `);
  expect(serializeProps(initial, schema, undefined, undefined, true))
    .toMatchInlineSnapshot(`
    {
      "extraFiles": [],
      "value": {},
    }
  `);
});

test('serialize image in collection', () => {
  const schema = fields.object({
    slug: fields.text({ label: 'Slug' }),
    image: fields.image({ label: 'Image' }),
  });
  const val: ParsedValueForComponentSchema<typeof schema> = {
    image: {
      data: new Uint8Array([1]),
      extension: 'png',
      filename: 'image.png',
    },
    slug: 'my-slug',
  };
  expect(serializeProps(val, schema, 'slug', val.slug, true))
    .toMatchInlineSnapshot(`
    {
      "extraFiles": [
        {
          "contents": Uint8Array [
            1,
          ],
          "parent": undefined,
          "path": "image.png",
        },
      ],
      "value": {
        "image": "image.png",
      },
    }
  `);
});

test('serialize image in singleton', () => {
  const schema = fields.object({
    image: fields.image({ label: 'Image' }),
  });
  const val: ParsedValueForComponentSchema<typeof schema> = {
    image: {
      data: new Uint8Array([1]),
      extension: 'png',
      filename: 'image.png',
    },
  };
  expect(serializeProps(val, schema, undefined, undefined, true))
    .toMatchInlineSnapshot(`
    {
      "extraFiles": [
        {
          "contents": Uint8Array [
            1,
          ],
          "parent": undefined,
          "path": "image.png",
        },
      ],
      "value": {
        "image": "image.png",
      },
    }
  `);
});

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

test('serialize image in document', () => {
  const schema = fields.object({
    document: fields.document({
      label: 'Document',
      images: true,
    }),
  });
  const val: ParsedValueForComponentSchema<typeof schema> = {
    document: [
      {
        type: 'image',
        src: {
          data: textEncoder.encode('text'),
          extension: 'png',
          filename: 'my-image.png',
        },
        alt: 'blah',
        title: 'title',
      } as any,
      { type: 'paragraph', children: [{ text: 'hello' }] },
    ],
  };
  const serialized = serializeProps(val, schema, undefined, undefined, true);
  expect(serialized.value).toEqual({});
  expect(
    serialized.extraFiles.map(x => ({
      ...x,
      contents: textDecoder.decode(x.contents),
    }))
  ).toMatchInlineSnapshot(`
    [
      {
        "contents": "![blah](my-image.png "title")

    hello
    ",
        "parent": undefined,
        "path": "document.mdoc",
      },
      {
        "contents": "",
        "parent": undefined,
        "path": "document/my-image.png",
      },
    ]
  `);
});

test('serialize image in document with directory', () => {
  const schema = fields.object({
    document: fields.document({
      label: 'Document',
      images: { directory: 'a/b', publicPath: '/a/b/c/' },
    }),
  });
  const val: ParsedValueForComponentSchema<typeof schema> = {
    document: [
      {
        type: 'image',
        src: {
          data: textEncoder.encode('image'),
          extension: 'png',
          filename: 'my-image.png',
        },
        alt: 'blah',
        title: 'title',
      } as any,
      {
        type: 'image',
        src: {
          data: textEncoder.encode('other'),
          extension: 'png',
          filename: 'another.png',
        },
        alt: 'blah',
        title: 'title',
      } as any,
      { type: 'paragraph', children: [{ text: 'hello' }] },
    ],
  };
  const serialized = serializeProps(val, schema, undefined, undefined, true);
  expect(serialized.value).toEqual({});
  expect(
    serialized.extraFiles.map(x => ({
      ...x,
      contents: textDecoder.decode(x.contents),
    }))
  ).toMatchInlineSnapshot(`
    [
      {
        "contents": "![blah](/a/b/c/my-image.png "title")

    ![blah](/a/b/c/another.png "title")

    hello
    ",
        "parent": undefined,
        "path": "document.mdoc",
      },
      {
        "contents": "",
        "parent": "a/b",
        "path": "my-image.png",
      },
      {
        "contents": "",
        "parent": "a/b",
        "path": "another.png",
      },
    ]
  `);
});

test('serialize image in component block', () => {
  const schema = fields.object({
    document: fields.document({
      label: 'Document',
      componentBlocks: {
        image: component({
          label: 'Image',
          preview: () => null,
          schema: {
            image: fields.image({ label: 'Image' }),
          },
        }),
      },
    }),
  });
  const val: ParsedValueForComponentSchema<typeof schema> = {
    document: [
      {
        type: 'component-block',
        component: 'image',
        props: {
          image: {
            data: textEncoder.encode('my-image'),
            extension: 'png',
            filename: 'my-image.png',
          },
        },
        children: [
          {
            type: 'component-inline-prop',
            propPath: undefined,
            children: [{ text: '' }],
          },
        ],
      } as any,

      { type: 'paragraph', children: [{ text: 'hello' }] },
    ],
  };
  const serialized = serializeProps(val, schema, undefined, undefined, true);
  expect(serialized.value).toEqual({});
  expect(
    serialized.extraFiles.map(x => ({
      ...x,
      contents: textDecoder.decode(x.contents),
    }))
  ).toMatchInlineSnapshot(`
    [
      {
        "contents": "{% image image="my-image.png" /%}

    hello
    ",
        "parent": undefined,
        "path": "document.mdoc",
      },
      {
        "contents": "my-image",
        "parent": undefined,
        "path": "document/my-image.png",
      },
    ]
  `);
});
