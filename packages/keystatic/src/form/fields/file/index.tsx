import { fixPath } from '../../../app/path-utils';
import { AssetFormField } from '../../api';
import { FieldDataError } from '../error';
import { getSrcPrefix } from '../image/getSrcPrefix';
import { RequiredValidation, assertRequired } from '../utils';
import { FileFieldInput } from '#field-ui/file';

export function file<IsRequired extends boolean | undefined>({
  label,
  directory,
  validation,
  description,
  publicPath,
}: {
  label: string;
  directory?: string;
  validation?: { isRequired?: IsRequired };
  description?: string;
  publicPath?: string;
} & RequiredValidation<IsRequired>): AssetFormField<
  { data: Uint8Array; extension: string; filename: string } | null,
  | { data: Uint8Array; extension: string; filename: string }
  | (IsRequired extends true ? never : null),
  string | (IsRequired extends true ? never : null)
> {
  return {
    kind: 'form',
    formKind: 'asset',
    Input(props) {
      return (
        <FileFieldInput
          label={label}
          description={description}
          validation={validation}
          {...props}
        />
      );
    },
    defaultValue() {
      return null;
    },
    filename(value, args) {
      if (typeof value === 'string') {
        return value.slice(getSrcPrefix(publicPath, args.slug).length);
      }
      return undefined;
    },
    parse(value, args) {
      if (value === undefined) {
        return null;
      }
      if (typeof value !== 'string') {
        throw new FieldDataError('Must be a string');
      }
      if (args.asset === undefined) {
        return null;
      }
      return {
        data: args.asset,
        filename: value.slice(getSrcPrefix(publicPath, args.slug).length),
        extension: value.match(/\.([^.]+$)/)?.[1] ?? '',
      };
    },
    validate(value) {
      assertRequired(value, validation, label);
      return value;
    },
    serialize(value, args) {
      if (value === null) {
        return { value: undefined, asset: undefined };
      }
      const filename = args.suggestedFilenamePrefix
        ? args.suggestedFilenamePrefix + '.' + value.extension
        : value.filename;
      return {
        value: `${getSrcPrefix(publicPath, args.slug)}${filename}`,
        asset: { filename, content: value.data },
      };
    },
    directory: directory ? fixPath(directory) : undefined,
    reader: {
      parse(value) {
        if (typeof value !== 'string' && value !== undefined) {
          throw new FieldDataError('Must be a string');
        }
        const val = value === undefined ? null : value;
        assertRequired(val, validation, label);
        return val;
      },
    },
  };
}
