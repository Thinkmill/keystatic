import { assert } from 'emery';
import { Config, DataFormat, Format, Glob } from '../config';
import { ComponentSchema, ContentFormField } from '../form/api';

export function fixPath(path: string) {
  return path.replace(/^\.?\/+/, '').replace(/\/*$/, '');
}

const collectionPath = /\/\*\*?(?:$|\/)/;

function getConfiguredCollectionPath(config: Config, collection: string) {
  const collectionConfig = config.collections![collection];
  const path = collectionConfig.path ?? `${collection}/*/`;
  if (!collectionPath.test(path)) {
    throw new Error(
      `Collection path must end with /* or /** or include /*/ or /**/ but ${collection} has ${path}`
    );
  }
  return path;
}

export function getCollectionPath(config: Config, collection: string) {
  const configuredPath = getConfiguredCollectionPath(config, collection);
  const path = fixPath(configuredPath.replace(/\*\*?.*$/, ''));
  return path;
}

export function getCollectionFormat(config: Config, collection: string) {
  const collectionConfig = config.collections![collection];
  return getFormatInfo(
    collectionConfig.format ?? 'yaml',
    collectionConfig.schema,
    getConfiguredCollectionPath(config, collection)
  );
}

export function getSingletonFormat(config: Config, singleton: string) {
  const singletonConfig = config.singletons![singleton];
  return getFormatInfo(
    singletonConfig.format ?? 'yaml',
    singletonConfig.schema,
    singletonConfig.path ?? `${singleton}/`
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

export function getEntryDataFilepath(dir: string, formatInfo: FormatInfo) {
  return `${dir}${
    formatInfo.dataLocation === 'index' ? '/index' : ''
  }${getDataFileExtension(formatInfo)}`;
}

export function getSlugGlobForCollection(
  config: Config,
  collection: string
): Glob {
  const collectionPath = getConfiguredCollectionPath(config, collection);
  return collectionPath.includes('**') ? '**' : '*';
}

export function getCollectionItemSlugSuffix(
  config: Config,
  collection: string
) {
  const configuredPath = getConfiguredCollectionPath(config, collection);
  const path = fixPath(configuredPath.replace(/^[^*]+\*\*?/, ''));
  return path ? `/${path}` : '';
}

export function getSingletonPath(config: Config, singleton: string) {
  if (config.singletons![singleton].path?.includes('*')) {
    throw new Error(
      `Singleton paths cannot include * but ${singleton} has ${
        config.singletons![singleton].path
      }`
    );
  }
  return fixPath(config.singletons![singleton].path ?? singleton);
}

export function getDataFileExtension(formatInfo: FormatInfo) {
  return formatInfo.contentField
    ? formatInfo.contentField.config.contentExtension
    : '.' + formatInfo.data;
}

function getFormatInfo(
  format: Format,
  schema: Record<string, ComponentSchema>,
  path: string
): FormatInfo {
  const dataLocation = path.endsWith('/') ? 'index' : 'outer';
  if (typeof format === 'string') {
    return {
      dataLocation,
      contentField: undefined,
      data: format,
    };
  }
  let contentField;
  if (format.contentField) {
    const field = schema[format.contentField];
    assert(
      field?.kind === 'form',
      `${format.contentField} is not a form field`
    );
    assert(
      field.formKind === 'content',
      `${format.contentField} is not a content field`
    );
    contentField = {
      key: format.contentField,
      config: field as ContentFormField<any, any, any>,
    };
  }
  return {
    data: format.data ?? 'yaml',
    contentField,
    dataLocation,
  };
}

export type FormatInfo = {
  data: DataFormat;
  contentField:
    | {
        key: string;
        config: ContentFormField<any, any, any>;
      }
    | undefined;
  dataLocation: 'index' | 'outer';
};
