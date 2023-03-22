import { FormFieldWithFileRequiringContentsForReader } from '../api';

export function emptyDocument(): FormFieldWithFileRequiringContentsForReader<
  null,
  undefined,
  null
> {
  return {
    kind: 'form',
    Input() {
      return null;
    },
    options: undefined,
    defaultValue: null,
    validate(value) {
      return value === null || value === undefined;
    },
    serializeToFile: {
      kind: 'multi',
      parse() {
        return null;
      },
      async serialize() {
        return {
          value: undefined,
          primary: new Uint8Array(),
          other: new Map(),
          external: new Map(),
        };
      },
      primaryExtension: '.mdoc',
      reader: {
        requiresContentInReader: true,
        parseToReader() {
          return null;
        },
      },
    },
  };
}
