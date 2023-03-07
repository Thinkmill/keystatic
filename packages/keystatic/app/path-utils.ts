import { assert } from 'emery';
import { Config, DataFormat, Format } from '../config';
import {
  ComponentSchema,
  FormFieldWithFile,
} from '../DocumentEditor/component-blocks/api';

export function fixPath(path: string) {
  return path.replace(/^\.?\/+/, '').replace(/\/*$/, '');
}

function getConfiguredCollectionPath(config: Config, collection: string) {
  const collectionConfig = config.collections![collection];
  const path = collectionConfig.path ?? `${collection}/*/`;
  if (!path.endsWith('/*') && !path.includes('/*/')) {
    throw new Error(
      `Collection path must end with /* or include /*/ but ${collection} has ${path}`
    );
  }
  return path;
}

export function getCollectionPath(config: Config, collection: string) {
  const configuredPath = getConfiguredCollectionPath(config, collection);
  const path = fixPath(configuredPath.replace(/\*.*$/, ''));
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

export function getCollectionItemSlugSuffix(
  config: Config,
  collection: string
) {
  const configuredPath = getConfiguredCollectionPath(config, collection);
  const path = fixPath(configuredPath.replace(/^[^*]+\*/, ''));
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
    ? formatInfo.contentField.config.serializeToFile.primaryExtension
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
      'serializeToFile' in field && field.serializeToFile?.kind === 'multi',
      `${format.contentField} does not have a multi serializeToFile config`
    );
    contentField = {
      key: format.contentField,
      config: field as typeof field & {
        serializeToFile: { kind: 'multi' };
      },
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
        config: FormFieldWithFile<any, any, any> & {
          serializeToFile: { kind: 'multi' };
        };
      }
    | undefined;
  dataLocation: 'index' | 'outer';
};
