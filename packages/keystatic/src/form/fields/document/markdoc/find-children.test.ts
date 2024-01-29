/** @jest-environment node */
import { ComponentSchema, fields } from '../../../..';
import { expect, test } from '@jest/globals';
import { findSingleChildField } from './find-children';

test('one child field', () => {
  const schema = fields.object({
    a: fields.child({ kind: 'block', placeholder: 'a' }),
  });

  expect(findSingleChildField(schema)).toMatchInlineSnapshot(`
    {
      "kind": "child",
      "options": {
        "componentBlocks": undefined,
        "dividers": undefined,
        "formatting": undefined,
        "images": undefined,
        "kind": "block",
        "links": undefined,
        "placeholder": "a",
        "tables": undefined,
      },
      "relativePath": [
        "a",
      ],
    }
  `);
});

test('nested one child field', () => {
  const schema = fields.object({
    a: fields.object({
      b: fields.child({ kind: 'block', placeholder: 'a' }),
    }),
  });
  expect(findSingleChildField(schema)).toMatchInlineSnapshot(`
    {
      "kind": "child",
      "options": {
        "componentBlocks": undefined,
        "dividers": undefined,
        "formatting": undefined,
        "images": undefined,
        "kind": "block",
        "links": undefined,
        "placeholder": "a",
        "tables": undefined,
      },
      "relativePath": [
        "a",
        "b",
      ],
    }
  `);
});

test('two child fields', () => {
  const schema = fields.object({
    a: fields.child({ kind: 'block', placeholder: 'a' }),
    b: fields.child({ kind: 'block', placeholder: 'b' }),
  });
  expect(findSingleChildField(schema)).toBe(undefined);
});

test('child field in array field', () => {
  const schema = fields.object({
    a: fields.array(
      fields.object({
        item: fields.child({ kind: 'block', placeholder: 'a' }),
      })
    ),
  });
  expect(findSingleChildField(schema)).toBe(undefined);
});

test('child field in conditional field', () => {
  const schema = fields.object({
    a: fields.conditional(fields.checkbox({ label: 'A' }), {
      true: fields.child({ kind: 'block', placeholder: 'a' }),
      false: fields.text({ label: 'a' }),
    }),
  });
  expect(findSingleChildField(schema)).toBe(undefined);
});

test('recursive', () => {
  const schema: ComponentSchema = fields.array(
    fields.object({
      get children() {
        return schema;
      },
      a: fields.child({ kind: 'block', placeholder: 'a' }),
    })
  );
  expect(findSingleChildField(schema)).toEqual(undefined);
});

test('array', () => {
  const schema = fields.array(
    fields.object({
      heading: fields.text({ label: 'Heading' }),
      href: fields.url({ label: 'Link' }),
      content: fields.child({ kind: 'inline', placeholder: 'Content' }),
    }),
    {
      asChildTag: 'related-link',
    }
  );
  expect(findSingleChildField(schema)).toMatchInlineSnapshot(`
    {
      "asChildTag": "related-link",
      "child": {
        "kind": "child",
        "options": {
          "formatting": undefined,
          "kind": "inline",
          "links": undefined,
          "placeholder": "Content",
        },
        "relativePath": [
          "content",
        ],
      },
      "field": {
        "asChildTag": "related-link",
        "description": undefined,
        "element": {
          "fields": {
            "content": {
              "kind": "child",
              "options": {
                "formatting": undefined,
                "kind": "inline",
                "links": undefined,
                "placeholder": "Content",
              },
            },
            "heading": {
              "Input": [Function],
              "defaultValue": [Function],
              "formKind": "slug",
              "kind": "form",
              "label": "Heading",
              "parse": [Function],
              "reader": {
                "parse": [Function],
                "parseWithSlug": [Function],
              },
              "serialize": [Function],
              "serializeWithSlug": [Function],
              "validate": [Function],
            },
            "href": {
              "Input": [Function],
              "defaultValue": [Function],
              "kind": "form",
              "label": "Link",
              "parse": [Function],
              "reader": {
                "parse": [Function],
              },
              "serialize": [Function],
              "validate": [Function],
            },
          },
          "kind": "object",
        },
        "itemLabel": undefined,
        "kind": "array",
        "label": "Items",
        "slugField": undefined,
        "validation": undefined,
      },
      "kind": "array",
      "relativePath": [],
    }
  `);
});
