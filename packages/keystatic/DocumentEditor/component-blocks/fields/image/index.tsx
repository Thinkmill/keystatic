import { fixPath } from '../../../../app/path-utils';
import { FormFieldWithFileNotRequiringContentsForReader } from '../../api';
import { RequiredValidation } from '../utils';
import { ImageFieldInput } from './ui';

export function image<IsRequired extends boolean | undefined>({
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
} & RequiredValidation<IsRequired>): FormFieldWithFileNotRequiringContentsForReader<
  | {
      kind: 'uploaded';
      data: Uint8Array;
      extension: string;
      filename: string;
    }
  | { kind: 'none' },
  string | (IsRequired extends true ? never : null)
> {
  return {
    kind: 'form',
    Input(props) {
      return (
        <ImageFieldInput
          label={label}
          description={description}
          validation={validation}
          {...props}
        />
      );
    },
    defaultValue: { kind: 'none' },
    validate(value) {
      if (
        typeof value === 'object' &&
        value !== null &&
        'kind' in value &&
        value.kind === 'none' &&
        validation?.isRequired
      ) {
        return false;
      }
      return true;
    },
    serializeToFile: {
      kind: 'asset',
      directory: directory ? fixPath(directory) : undefined,
      filename(value, suggestedFilenamePrefix, slug) {
        if (typeof value === 'string') {
          return value.slice(getSrcPrefix(publicPath, slug).length);
        }
        if (
          typeof value === 'object' &&
          value !== null &&
          'extension' in value &&
          typeof value.extension === 'string'
        ) {
          return suggestedFilenamePrefix + '.' + value.extension;
        }
      },
      parse({ content, value, slug }) {
        if (!content) {
          return { kind: 'none' };
        }
        return {
          kind: 'uploaded',
          data: content,
          extension:
            value && typeof value === 'object' && 'extension' in value
              ? (value as any).extension
              : typeof value === 'string'
              ? value.match(/\.([^.]+$)/)?.[1]
              : '',
          filename:
            typeof value === 'string'
              ? value.slice(getSrcPrefix(publicPath, slug).length)
              : '',
        };
      },
      serialize(value, suggestedFilenamePrefix, slug) {
        if (value.kind === 'none') {
          return { value: null, content: undefined };
        }
        const filename = suggestedFilenamePrefix
          ? suggestedFilenamePrefix + '.' + value.extension
          : value.filename;
        return {
          value: `${getSrcPrefix(publicPath, slug)}${filename}`,
          content: value.data,
          filename,
        };
      },
      reader: {
        requiresContentInReader: false,
        parseToReader({ value, suggestedFilenamePrefix }) {
          if (!value) return null as any;
          return typeof value === 'string'
            ? value
            : suggestedFilenamePrefix + '.' + (value as any).extension;
        },
      },
    },
  };
}

export function getSrcPrefix(
  publicPath: string | undefined,
  slug: string | undefined
) {
  return typeof publicPath === 'string'
    ? `/${fixPath(publicPath)}/${slug === undefined ? '' : slug + '/'}`
    : '';
}
