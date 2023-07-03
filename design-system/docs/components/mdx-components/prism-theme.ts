import { PrismTheme } from 'prism-react-renderer';

import { tokenSchema } from '@keystar/ui/style';

export function usePrismTheme(): PrismTheme {
  const { color } = tokenSchema;
  return {
    plain: {},
    styles: [
      {
        types: ['cdata', 'comment', 'doctype', 'prolog'],
        style: {
          color: color.foreground.neutralSecondary,
        },
      },
      {
        types: ['punctuation', 'operator'],
        style: {
          color: color.foreground.neutralSecondary,
        },
      },
      {
        types: ['attr-value', 'constant', 'deleted', 'property'],
        style: {
          color: color.foreground.positive,
        },
      },
      {
        types: ['parameter', 'script'],
        style: {
          color: color.foreground.pending,
        },
      },
      {
        types: ['boolean', 'number', 'string', 'symbol'],
        style: {
          color: color.foreground.caution,
        },
      },
      {
        types: ['builtin', 'char', 'inserted', 'selector'],
        style: {
          color: color.foreground.critical,
        },
      },
      {
        types: ['attr-name', 'atrule', 'keyword'],
        style: {
          // color: color.foreground.pending,
          color: color.foreground.accent,
          // opacity: 0.75,
        },
      },
      {
        types: ['function', 'class-name', 'tag'],
        style: {
          color: color.foreground.highlight,
        },
      },
      {
        types: ['important', 'regex', 'variable'],
        style: {
          color: color.foreground.critical,
        },
      },
      {
        types: ['bold', 'important'],
        style: {
          fontWeight: 'bold',
        },
      },
      {
        types: ['italic'],
        style: {
          fontStyle: 'italic',
        },
      },
      {
        types: ['entity'],
        style: {
          cursor: 'help',
        },
      },
      {
        types: ['namespace'],
        style: {
          opacity: 0.7,
        },
      },
    ],
  };
}
