import { Config, DataFormat, Glob } from '../config';
import { ComponentSchema } from '../form/api';
import { memoize } from './memoize';

export function fixPath(path: string) {
  return path.replace(/^\.?\/+/, '').replace(/\/*$/, '');
}

export type CollectionPathSegment =
  | { kind: 'static'; value: string }
  | { kind: 'field'; name: string }
  | { kind: 'glob'; glob: Glob };

export type CollectionPathInfo = {
  /** The static directory that all entries in the collection live under. */
  prefix: string;
  /**
   * The segments an entry's slug is made up of, in order. `field` segments
   * are filled in from the value of the named field in the collection's
   * schema and the `glob` segment is filled in with the collection's slug
   * field's slug.
   */
  slugPattern: CollectionPathSegment[];
  glob: Glob;
  /** The static path appended to the path of every entry (e.g. `data`). */
  suffix: string;
};

const globSegment = /^\*\*?$/;
const fieldSegment = /^\{([^{}]+)\}$/;

export const parseCollectionPath = memoize(_parseCollectionPath);

function _parseCollectionPath(path: string): CollectionPathInfo {
  const segments = fixPath(path)
    .split('/')
    .filter(segment => segment !== '');
  let globIndex = -1;
  let glob: Glob = '*';
  for (const [i, segment] of segments.entries()) {
    if (globSegment.test(segment)) {
      if (globIndex !== -1) {
        throw new Error(
          `Collection paths can only contain a single * or ** segment but "${path}" contains more than one`
        );
      }
      globIndex = i;
      glob = segment as Glob;
      continue;
    }
    if (segment.includes('{') || segment.includes('}')) {
      if (!fieldSegment.test(segment)) {
        throw new Error(
          `Collection path "${path}" contains an invalid path segment "${segment}"`
        );
      }
      if (globIndex !== -1) {
        throw new Error(
          `Field placeholders like "${segment}" cannot appear after the * or ** segment in collection path "${path}"`
        );
      }
    }
  }
  if (globIndex === -1) {
    throw new Error(
      `Collection path must end with /* or /** or include /*/ or /**/ but got "${path}"`
    );
  }
  const firstDynamicIndex = segments.findIndex(
    segment => globSegment.test(segment) || fieldSegment.test(segment)
  );
  const slugPattern: CollectionPathSegment[] = segments
    .slice(firstDynamicIndex, globIndex + 1)
    .map(segment => {
      if (globSegment.test(segment)) {
        return { kind: 'glob', glob } as const;
      }
      const fieldMatch = fieldSegment.exec(segment);
      if (fieldMatch) {
        return { kind: 'field', name: fieldMatch[1] } as const;
      }
      return { kind: 'static', value: segment } as const;
    });
  return {
    prefix: segments.slice(0, firstDynamicIndex).join('/'),
    slugPattern,
    glob,
    suffix: segments.slice(globIndex + 1).join('/'),
  };
}

/**
 * The portion of an entry's slug that is provided by the collection's slug
 * field — the part that the `*`/`**` glob segment matches.
 */
export function getSlugFieldSlug(pathInfo: CollectionPathInfo, slug: string) {
  const split = slug.split('/');
  const globIndex = pathInfo.slugPattern.length - 1;
  if (pathInfo.glob === '**') {
    return split.slice(globIndex).join('/');
  }
  return split[globIndex] ?? slug;
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

export const getCollectionPathInfo = memoize(_getCollectionPathInfo);

function _getCollectionPathInfo(
  config: Config,
  collection: string
): CollectionPathInfo {
  const collectionConfig = config.collections![collection];
  const info = parseCollectionPath(
    getConfiguredCollectionPath(config, collection)
  );
  for (const segment of info.slugPattern) {
    if (segment.kind !== 'field') continue;
    const field = collectionConfig.schema[segment.name];
    if (!field) {
      throw new Error(
        `Collection path placeholder "{${segment.name}}" in ${collection} does not match a field in the collection's schema`
      );
    }
    if (field.kind !== 'form') {
      throw new Error(
        `Collection path placeholder "{${segment.name}}" in ${collection} must be a form field`
      );
    }
  }
  return info;
}

export function getCollectionPath(config: Config, collection: string) {
  return getCollectionPathInfo(config, collection).prefix;
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
  return getCollectionPathInfo(config, collection).glob;
}

export function getCollectionItemSlugSuffix(
  config: Config,
  collection: string
) {
  const suffix = getCollectionPathInfo(config, collection).suffix;
  return suffix ? `/${suffix}` : '';
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
