import { Config, DataFormat, Glob } from '../config';
import { ComponentSchema } from '../form/api';
import { memoize } from './memoize';

export function fixPath(path: string) {
  return path.replace(/^\.?\/+/, '').replace(/\/*$/, '');
}

export const LOCALE_TOKEN = '{locale}';

export function substituteLocale(path: string, locale: string | undefined) {
  if (!path.includes(LOCALE_TOKEN)) {
    return path;
  }
  if (locale === undefined) {
    throw new Error(
      `Path "${path}" contains the ${LOCALE_TOKEN} token but no locale was provided. Pass a locale (e.g. \`createReader(dir, config, { locale })\`) or set config.i18n.`
    );
  }
  return path.split(LOCALE_TOKEN).join(locale);
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

export function getCollectionPath(
  config: Config,
  collection: string,
  locale?: string
) {
  const configuredPath = getConfiguredCollectionPath(config, collection);
  const path = fixPath(configuredPath.replace(/\*\*?.*$/, ''));
  return substituteLocale(path, locale);
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
  slug: string,
  locale?: string
) {
  const basePath = getCollectionPath(config, collection, locale);
  const suffix = getCollectionItemSlugSuffix(config, collection);
  return substituteLocale(`${basePath}/${slug}${suffix}`, locale);
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

export function getSingletonPath(
  config: Config,
  singleton: string,
  locale?: string
) {
  if (config.singletons![singleton].path?.includes('*')) {
    throw new Error(
      `Singleton paths cannot include * but ${singleton} has ${
        config.singletons![singleton].path
      }`
    );
  }
  return substituteLocale(
    fixPath(config.singletons![singleton].path ?? singleton),
    locale
  );
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

export function getContentLocales(config: Config): string[] {
  return Object.keys(config.i18n?.locales ?? {});
}

export function isLocalized(
  entryConfig: { localized?: boolean } | undefined
): boolean {
  return entryConfig?.localized === true;
}

export function assertValidI18nConfig(config: Config): void {
  const i18n = config.i18n;
  if (i18n) {
    const localeCodes = Object.keys(i18n.locales ?? {});
    if (localeCodes.length === 0) {
      throw new Error(`config.i18n.locales must contain at least one locale`);
    }
    if (!localeCodes.includes(i18n.defaultLocale)) {
      throw new Error(
        `config.i18n.defaultLocale "${
          i18n.defaultLocale
        }" is not one of config.i18n.locales (${localeCodes.join(', ')})`
      );
    }
  }

  const checkEntry = (
    type: 'Collection' | 'Singleton',
    key: string,
    entry: { path?: string; localized?: boolean }
  ) => {
    const hasToken = !!entry.path?.includes(LOCALE_TOKEN);
    const localized = isLocalized(entry);
    if (hasToken && !i18n) {
      throw new Error(
        `${type} "${key}" uses the ${LOCALE_TOKEN} token in its path but config.i18n is not set`
      );
    }
    if (localized && !i18n) {
      throw new Error(
        `${type} "${key}" is marked localized but config.i18n is not set`
      );
    }
    if (localized && !hasToken) {
      throw new Error(
        `${type} "${key}" is marked localized but its path does not contain the ${LOCALE_TOKEN} token`
      );
    }
    if (hasToken && !localized) {
      throw new Error(
        `${type} "${key}" uses the ${LOCALE_TOKEN} token in its path but is not marked localized`
      );
    }
  };

  for (const [key, collection] of Object.entries(config.collections ?? {})) {
    checkEntry('Collection', key, collection);
  }
  for (const [key, singleton] of Object.entries(config.singletons ?? {})) {
    checkEntry('Singleton', key, singleton);
  }
}
