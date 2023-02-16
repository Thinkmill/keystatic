import { assert } from 'emery';
import { Config, DataFormat, Format } from '../config';
import {
  ComponentSchema,
  FormFieldWithFile,
} from '../DocumentEditor/component-blocks/api';

function fixPath(path: string) {
  return path.replace(/^\.?\//, '').replace(/\/$/, '');
}

export function getCollectionPath(config: Config, collection: string) {
  return fixPath(config.collections![collection].directory ?? collection);
}

export function getCollectionFormat(config: Config, collection: string) {
  const collectionConfig = config.collections![collection];
  return getFormatInfo(
    collectionConfig.format ?? 'yaml',
    collectionConfig.schema
  );
}

export function getSingletonFormat(config: Config, singleton: string) {
  const singletonConfig = config.singletons![singleton];
  return getFormatInfo(
    singletonConfig.format ?? 'yaml',
    singletonConfig.schema
  );
}

export function getCollectionItemPath(
  config: Config,
  collection: string,
  slug: string
) {
  const basePath = getCollectionPath(config, collection);
  const suffix = getCollectionItemSlugSuffix(config, collection);
  return `${basePath}/${slug}${suffix}`;
}

export function getCollectionItemSlugSuffix(
  config: Config,
  collection: string
) {
  const path = fixPath(config.collections![collection].directorySuffix ?? '');
  return path ? `/${path}` : '';
}

export function getSingletonPath(config: Config, singleton: string) {
  return fixPath(config.singletons![singleton].directory ?? singleton);
}

export function getDataFileExtension(formatInfo: FormatInfo) {
  return typeof formatInfo === 'string'
    ? '.' + formatInfo
    : formatInfo.contentFieldConfig.serializeToFile.primaryExtension;
}

function getFormatInfo(
  format: Format,
  schema: Record<string, ComponentSchema>
): FormatInfo {
  if (typeof format === 'string') {
    return format;
  }
  const field = schema[format.contentField];
  assert(field?.kind === 'form', `${format.contentField} is not a form field`);
  assert(
    'serializeToFile' in field && field.serializeToFile?.kind === 'multi',
    `${format.contentField} does not have a multi serializeToFile config`
  );
  return {
    frontmatter: format.frontmatter,
    contentFieldKey: format.contentField,
    contentFieldConfig: field as typeof field & {
      serializeToFile: { kind: 'multi' };
    },
  };
}

export type FormatInfo =
  | DataFormat
  | {
      frontmatter: DataFormat;
      contentFieldKey: string;
      contentFieldConfig: FormFieldWithFile<any, any, any> & {
        serializeToFile: { kind: 'multi' };
      };
    };
