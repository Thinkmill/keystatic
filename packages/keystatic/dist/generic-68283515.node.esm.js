import '@keystar/ui/checkbox';
import '@keystar/ui/typography';
import 'react/jsx-runtime';
import '@keystar/ui/text-field';
import 'react';
import { V as getCollectionFormat, g as getCollectionPath, o as object, U as getSlugGlobForCollection, a0 as getDataFileExtension, ao as getSingletonFormat, ap as getSingletonPath, W as getCollectionItemPath, f as getEntryDataFilepath, h as parseProps, b2 as getValueAtPropPath, b3 as formatFormDataError } from './index-b6d17606.node.esm.js';
import '@keystar/ui/button';
import '@keystar/ui/field';
import '@keystar/ui/layout';
import '@keystar/ui/style';
import '@keystar/ui/number-field';
import '@keystar/ui/combobox';
import 'minimatch';
import '@react-stately/collections';
import '@keystar/ui/picker';
import '@sindresorhus/slugify';
import '@braintree/sanitize-url';
import '@react-aria/i18n';
import '@keystar/ui/dialog';
import '@keystar/ui/slots';
import 'emery';
import '@keystar/ui/drag-and-drop';
import '@keystar/ui/icon';
import '@keystar/ui/icon/icons/trash2Icon';
import '@keystar/ui/list-view';
import '@keystar/ui/tooltip';
import 'slate';
import 'slate-react';
import '@keystar/ui/split-view';
import '@keystar/ui/icon/icons/panelLeftOpenIcon';
import '@keystar/ui/icon/icons/panelLeftCloseIcon';
import '@keystar/ui/icon/icons/panelRightOpenIcon';
import '@keystar/ui/icon/icons/panelRightCloseIcon';
import '@keystar/ui/menu';
import '@keystar/ui/link';
import '@keystar/ui/progress';
import { l as loadDataFile } from './required-files-f12cd7f9.node.esm.js';

function cache(func) {
  return func;
}

async function getAllEntries(parent, fsReader) {
  return (await Promise.all((await fsReader.readdir(parent)).map(async dirent => {
    const name = `${parent}${dirent.name}`;
    const entry = {
      entry: dirent,
      name
    };
    if (dirent.kind === 'directory') {
      return [entry, ...(await getAllEntries(`${name}/`, fsReader))];
    }
    return entry;
  }))).flat();
}
const listCollection = cache(async function listCollection(collectionPath, glob, formatInfo, extension, fsReader) {
  const entries = glob === '*' ? (await fsReader.readdir(collectionPath)).map(entry => ({
    entry,
    name: entry.name
  })) : (await getAllEntries(`${collectionPath}/`, fsReader)).map(x => ({
    entry: x.entry,
    name: x.name.slice(collectionPath.length + 1)
  }));
  return (await Promise.all(entries.map(async x => {
    if (formatInfo.dataLocation === 'index') {
      if (x.entry.kind !== 'directory') return [];
      if (!(await fsReader.fileExists(getEntryDataFilepath(`${collectionPath}/${x.name}`, formatInfo)))) {
        return [];
      }
      return [x.name];
    } else {
      if (x.entry.kind !== 'file' || !x.name.endsWith(extension)) {
        return [];
      }
      return [x.name.slice(0, -extension.length)];
    }
  }))).flat();
});
function collectionReader(collection, config, fsReader) {
  const formatInfo = getCollectionFormat(config, collection);
  const collectionPath = getCollectionPath(config, collection);
  const collectionConfig = config.collections[collection];
  const schema = object(collectionConfig.schema);
  const glob = getSlugGlobForCollection(config, collection);
  const extension = getDataFileExtension(formatInfo);
  const read = (slug, ...args) => {
    var _args$;
    return readItem(schema, formatInfo, getCollectionItemPath(config, collection, slug), (_args$ = args[0]) === null || _args$ === void 0 ? void 0 : _args$.resolveLinkedFiles, `"${slug}" in collection "${collection}"`, fsReader, slug, collectionConfig.slugField, glob);
  };
  const list = () => listCollection(collectionPath, glob, formatInfo, extension, fsReader);
  return {
    read,
    readOrThrow: async (...args) => {
      const entry = await read(...args);
      if (entry === null) {
        throw new Error(`Entry "${args[0]}" not found in collection "${collection}"`);
      }
      return entry;
    },
    // TODO: this could drop the fs.stat call that list does for each item
    // since we just immediately read it
    all: async (...args) => {
      const slugs = await list();
      return (await Promise.all(slugs.map(async slug => {
        const entry = await read(slug, args[0]);
        if (entry === null) return [];
        return [{
          slug,
          entry
        }];
      }))).flat();
    },
    list
  };
}
const readItem = cache(async function readItem(rootSchema, formatInfo, itemDir, resolveLinkedFiles, debugReference, fsReader, ...slugInfo) {
  const dataFile = await fsReader.readFile(getEntryDataFilepath(itemDir, formatInfo));
  if (dataFile === null) return null;
  const {
    loaded,
    extraFakeFile
  } = loadDataFile(dataFile, formatInfo);
  const contentFieldPathsToEagerlyResolve = resolveLinkedFiles ? [] : undefined;
  let validated;
  try {
    validated = parseProps(rootSchema, loaded, [], [], (schema, value, path, pathWithArrayFieldSlugs) => {
      if (schema.formKind === 'asset') {
        return schema.reader.parse(value);
      }
      if (schema.formKind === 'content') {
        contentFieldPathsToEagerlyResolve === null || contentFieldPathsToEagerlyResolve === void 0 || contentFieldPathsToEagerlyResolve.push(path);
        return async () => {
          let content;
          const filename = pathWithArrayFieldSlugs.join('/') + schema.contentExtension;
          if (filename === (extraFakeFile === null || extraFakeFile === void 0 ? void 0 : extraFakeFile.path)) {
            content = extraFakeFile.contents;
          } else {
            var _await$fsReader$readF;
            content = (_await$fsReader$readF = await fsReader.readFile(`${itemDir}/${filename}`)) !== null && _await$fsReader$readF !== void 0 ? _await$fsReader$readF : undefined;
          }
          return schema.reader.parse(value, {
            content
          });
        };
      }
      if (path.length === 1 && slugInfo[0] !== undefined) {
        const [slug, slugField, glob] = slugInfo;
        if (path[0] === slugField) {
          if (schema.formKind !== 'slug') {
            throw new Error(`Slug field ${slugInfo[1]} is not a slug field`);
          }
          return schema.reader.parseWithSlug(value, {
            slug,
            glob
          });
        }
      }
      return schema.reader.parse(value);
    }, true);
    if (contentFieldPathsToEagerlyResolve !== null && contentFieldPathsToEagerlyResolve !== void 0 && contentFieldPathsToEagerlyResolve.length) {
      await Promise.all(contentFieldPathsToEagerlyResolve.map(async path => {
        const parentValue = getValueAtPropPath(validated, path.slice(0, -1));
        const keyOnParent = path[path.length - 1];
        const originalValue = parentValue[keyOnParent];
        parentValue[keyOnParent] = await originalValue();
      }));
    }
  } catch (err) {
    const formatted = formatFormDataError(err);
    throw new Error(`Invalid data for ${debugReference}:\n${formatted}`);
  }
  return validated;
});
function singletonReader(singleton, config, fsReader) {
  const formatInfo = getSingletonFormat(config, singleton);
  const singletonPath = getSingletonPath(config, singleton);
  const schema = object(config.singletons[singleton].schema);
  const read = (...args) => {
    var _args$2;
    return readItem(schema, formatInfo, singletonPath, (_args$2 = args[0]) === null || _args$2 === void 0 ? void 0 : _args$2.resolveLinkedFiles, `singleton "${singleton}"`, fsReader, undefined);
  };
  return {
    read,
    readOrThrow: async (...opts) => {
      const entry = await read(...opts);
      if (entry === null) {
        throw new Error(`Singleton "${singleton}" not found`);
      }
      return entry;
    }
  };
}

export { cache as a, collectionReader as c, singletonReader as s };
