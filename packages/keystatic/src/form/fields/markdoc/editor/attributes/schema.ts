import { css } from '@voussoir/style';
import { EditorNodeSpec } from '../schema';
import { Schema } from 'prosemirror-model';
import { markdocIdentifierPattern, weakMemoize } from '../utils';

export const getAttributeType = weakMemoize(function getAttributesType(
  schema: Schema
) {
  for (const node of Object.values(schema.nodes)) {
    if (node.spec === attributeSchema.attribute) {
      return node;
    }
  }
  throw new Error('No attributes node found in the schema');
});

export const attributeSchema = {
  attribute: {
    attrs: {
      name: {},
    },
    content: 'attribute_expression',
    inline: true,
    atom: true,
    parseDOM: [
      {
        tag: '[data-markdoc-attribute]',
        getAttrs(node) {
          if (typeof node === 'string') return false;
          let name = node.getAttribute('data-markdoc-attribute');
          if (name === '#') name = 'id';
          if (name === '.') name = 'class';
          if (name === null || !markdocIdentifierPattern.test(name)) {
            return false;
          }
          return { name };
        },
      },
    ],
    toDOM(node) {
      return [
        'span',
        {
          'data-markdoc-attribute':
            node.attrs.name === 'id'
              ? '#'
              : node.attrs.name === 'class'
              ? '.'
              : `${node.attrs.name}`,
        },
        0,
      ];
    },
  },
  attribute_string: {
    group: 'attribute_expression',
    content: 'text*',
    marks: '',
    parseDOM: [{ tag: '[data-markdoc-expression="string"]' }],
    toDOM() {
      return ['span', { 'data-markdoc-expression': 'string' }, 0];
    },
  },
  attribute_null: {
    group: 'attribute_expression',
    toDOM() {
      return ['span', { class: css({ color: 'lightsteelblue' }) }, 'null'];
    },
  },
  attribute_true: {
    group: 'attribute_expression',
    toDOM() {
      return ['span', { class: css({ color: 'lightsteelblue' }) }, 'true'];
    },
  },
  attribute_false: {
    group: 'attribute_expression',
    toDOM() {
      return ['span', { class: css({ color: 'lightsteelblue' }) }, 'false'];
    },
  },
  attribute_number: {
    group: 'attribute_expression',
    content: 'text*',
    marks: '',
    toDOM() {
      return ['span', { class: css({ color: 'lightsteelblue' }) }, 'null'];
    },
  },
  attribute_variable: {
    group: 'attribute_expression',
    content: 'text*',
    marks: '',
    toDOM() {
      return [
        'span',
        { class: css({ color: 'lightsteelblue' }) },
        '$',
        ['span', 0],
      ];
    },
  },
  attribute_object: {
    group: 'attribute_expression',
    content: 'attribute*',
    marks: '',
    toDOM() {
      return [
        'span',
        [
          'span',
          { class: css({ color: 'green' }), contenteditable: false },
          '{',
        ],
        ['span', 0],
        [
          'span',
          { class: css({ color: 'green' }), contenteditable: false },
          '}',
        ],
      ];
    },
  },
} satisfies Record<string, EditorNodeSpec>;
