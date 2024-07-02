import { ContentFormField } from '../api';

export function emptyContent(opts: {
  extension: 'mdoc' | 'md' | 'mdx';
}): ContentFormField<null, null, null> {
  return {
    kind: 'form',
    formKind: 'content',
    Input() {
      return null;
    },
    defaultValue() {
      return null;
    },
    parse() {
      return null;
    },
    contentExtension: `.${opts.extension}`,
    serialize() {
      return {
        value: undefined,
        content: new Uint8Array(),
        external: new Map(),
        other: new Map(),
      };
    },
    validate(value) {
      return value;
    },
    reader: {
      parse() {
        return null;
      },
    },
  };
}
