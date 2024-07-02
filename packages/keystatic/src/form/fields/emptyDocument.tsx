import { ContentFormField } from '../api';

/**
 * @deprecated `emptyDocument` has been replaced with the `emptyContent` field
 */
export function emptyDocument(): ContentFormField<null, null, null> {
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
    contentExtension: '.mdoc',
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
