import { css } from '@voussoir/style';
import { EditorNodeSpec } from '../schema';
import { Schema } from 'prosemirror-model';
import { weakMemoize } from '../utils';

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
      key: {},
    },
    content: 'attribute_expression',
    inline: true,
    atom: true,
    toDOM(node) {
      return [
        'span',
        { class: css({ border: '1px black solid' }), contenteditable: false },
        [
          'span',
          {
            'data-attr':
              node.attrs.key === 'id'
                ? '#'
                : node.attrs.key === 'class'
                ? '.'
                : `${node.attrs.key}=`,
            class: css({ content: 'attr(data-attr)' }),
          },
        ],
        [
          'span',
          { class: css({ minWidth: 50, width: 50, display: 'inline-block' }) },
          0,
        ],
      ];
    },
  },
  attribute_string: {
    group: 'attribute_expression',
    content: 'text*',
    marks: '',
    toDOM() {
      return ['span', { class: css({ color: 'green' }) }, 0];
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
