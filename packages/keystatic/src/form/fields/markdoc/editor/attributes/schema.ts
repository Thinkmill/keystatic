import { css } from '@keystar/ui/style';
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
    content: 'text* | attribute_expression',
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
  attribute_expression: {
    attrs: {
      value: {},
    },
    inline: true,
    toDOM(node) {
      return [
        'span',
        {
          'data-markdoc-attribute-expression': node.attrs.value,
          class: css({
            '::before': {
              display: 'inline',
              content: 'attr(data-markdoc-attribute-expression)',
            },
          }),
        },
      ];
    },
  },
} satisfies Record<string, EditorNodeSpec>;
