import { Config, DataFormat, Glob } from '../config';
import { ComponentSchema } from '../form/api';
import { memoize } from './memoize';

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
  return getFormatInfo(config, 'collections', collection);
}

export function getSingletonFormat(config: Config, singleton: string) {
  return getFormatInfo(config, 'singletons', singleton);
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
    ? formatInfo.contentField.contentExtension
    : '.' + formatInfo.data;
}

const getFormatInfo = memoize(_getFormatInfo);

function _getFormatInfo(
  config: Config,
  type: 'collections' | 'singletons',
  key: string
): FormatInfo {
  const collectionOrSingleton =
    type === 'collections' ? config.collections![key] : config.singletons![key];
  const path =
    type === 'collections'
      ? getConfiguredCollectionPath(config, key)
      : collectionOrSingleton.path ?? `${key}/`;
  const dataLocation = path.endsWith('/') ? 'index' : 'outer';
  const { schema, format = 'yaml' } = collectionOrSingleton;
  if (typeof format === 'string') {
    return {
      dataLocation,
      contentField: undefined,
      data: format,
    };
  }
  let contentField: FormatInfo['contentField'];
  if (format.contentField) {
    let field: ComponentSchema = { kind: 'object' as const, fields: schema };
    let path = Array.isArray(format.contentField)
      ? format.contentField
      : [format.contentField];
    let contentExtension;
    try {
      contentExtension = getContentExtension(path, field, () =>
        JSON.stringify(format.contentField)
      );
    } catch (err) {
      if (err instanceof ContentFieldLocationError) {
        throw new Error(`${err.message} (${type}.${key})`);
      }
      throw err;
    }
    contentField = { path, contentExtension };
  }
  return {
    data: format.data ?? 'yaml',
    contentField,
    dataLocation,
  };
}

class ContentFieldLocationError extends Error {
  constructor(message: string) {
    super(message);
  }
}

function getContentExtension(
  path: string[],
  schema: ComponentSchema,
  debugName: () => string
): string {
  if (path.length === 0) {
    if (schema.kind !== 'form' || schema.formKind !== 'content') {
      throw new ContentFieldLocationError(
        `Content field for ${debugName()} is not a content field`
      );
    }
    return schema.contentExtension;
  }
  if (schema.kind === 'object') {
    const field = schema.fields[path[0]];
    if (!field) {
      throw new ContentFieldLocationError(
        `Field ${debugName()} specified in contentField does not exist`
      );
    }
    return getContentExtension(path.slice(1), field, debugName);
  }
  if (schema.kind === 'conditional') {
    if (path[0] !== 'value') {
      throw new ContentFieldLocationError(
        `Conditional fields referenced in a contentField path must only reference the value field (${debugName()})`
      );
    }
    let contentExtension;
    const innerPath = path.slice(1);
    for (const value of Object.values(schema.values)) {
      const foundContentExtension = getContentExtension(
        innerPath,
        value,
        debugName
      );
      if (!contentExtension) {
        contentExtension = foundContentExtension;
        continue;
      }
      if (contentExtension !== foundContentExtension) {
        throw new ContentFieldLocationError(
          `contentField ${debugName()} has conflicting content extensions`
        );
      }
    }
    if (!contentExtension) {
      throw new ContentFieldLocationError(
        `contentField ${debugName()} does not point to a content field`
      );
    }
    return contentExtension;
  }
  throw new ContentFieldLocationError(
    `Path specified in contentField ${debugName()} does not point to a content field`
  );
}

export type FormatInfo = {
  data: DataFormat;
  contentField:
    | {
        path: string[];
        contentExtension: string;
      }
    | undefined;
  dataLocation: 'index' | 'outer';
};

export function getPathPrefix(storage: Config['storage']) {
  if (storage.kind === 'local' || !storage.pathPrefix) {
    return undefined;
  }
  return fixPath(storage.pathPrefix) + '/';
}
