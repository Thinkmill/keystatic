import { Collection, Config, DataFormat, Glob, Singleton } from '../config';
import { ComponentSchema } from '../form/api';

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
  return getFormatInfo(collectionConfig)(
    getConfiguredCollectionPath(config, collection)
  );
}

export function getSingletonFormat(config: Config, singleton: string) {
  const singletonConfig = config.singletons![singleton];
  return getFormatInfo(singletonConfig)(
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
    ? formatInfo.contentField.contentExtension
    : '.' + formatInfo.data;
}

function weakMemoize<Arg extends object, Return>(
  func: (arg: Arg) => Return
): (arg: Arg) => Return {
  const cache = new WeakMap<Arg, Return>();
  return (arg: Arg) => {
    if (cache.has(arg)) {
      return cache.get(arg)!;
    }
    const result = func(arg);
    cache.set(arg, result);
    return result;
  };
}

function memoize<Arg, Return>(
  func: (arg: Arg) => Return
): (arg: Arg) => Return {
  const cache = new Map<Arg, Return>();
  return (arg: Arg) => {
    if (cache.has(arg)) {
      return cache.get(arg)!;
    }
    const result = func(arg);
    cache.set(arg, result);
    return result;
  };
}

const getFormatInfo = weakMemoize(
  (collectionOrSingleton: Collection<any, any> | Singleton<any>) => {
    return memoize((path: string) =>
      _getFormatInfo(collectionOrSingleton, path)
    );
  }
);

function _getFormatInfo(
  collectionOrSingleton: Collection<any, any> | Singleton<any>,
  path: string
): FormatInfo {
  const dataLocation = path.endsWith('/') ? 'index' : 'outer';
  const { schema, format = 'yaml' } = collectionOrSingleton;
  if (typeof format === 'string') {
    return {
      dataLocation,
      contentField: undefined,
      data: format,
    };
  }
  let contentField;
  if (format.contentField) {
    let field: ComponentSchema = { kind: 'object' as const, fields: schema };
    let path = Array.isArray(format.contentField)
      ? format.contentField
      : [format.contentField];

    contentField = {
      path,
      contentExtension: getContentExtension(path, field, () =>
        path.length === 1 ? path[0] : JSON.stringify(path)
      ),
    };
  }
  return {
    data: format.data ?? 'yaml',
    contentField,
    dataLocation,
  };
}

function getContentExtension(
  path: string[],
  schema: ComponentSchema,
  debugName: () => string
): string {
  if (path.length === 0) {
    if (schema.kind !== 'form' || schema.formKind !== 'content') {
      throw new Error(
        `Content field for ${debugName()} is not a content field`
      );
    }
    return schema.contentExtension;
  }
  if (schema.kind === 'object') {
    return getContentExtension(
      path.slice(1),
      schema.fields[path[0]],
      debugName
    );
  }
  if (schema.kind === 'conditional') {
    if (path[0] !== 'value') {
      throw new Error(
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
        throw new Error(
          `contentField ${debugName()} has conflicting content extensions`
        );
      }
    }
    if (!contentExtension) {
      throw new Error(
        `contentField ${debugName()} does not point to a content field`
      );
    }
    return contentExtension;
  }
  throw new Error(
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
