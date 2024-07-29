import { LRUCache } from 'lru-cache';
import { useCallback, useMemo } from 'react';
import { Config } from '../config';
import {
  AssetsFormField,
  ComponentSchema,
  ContentFormField,
  fields,
} from '../form/api';
import { parseProps } from '../form/parse-props';
import { getAuth } from './auth';
import { loadDataFile } from './required-files';
import { useBaseCommit, useRepoInfo, useTree } from './shell/data';
import { getDirectoriesForTreeKey, getTreeKey } from './tree-key';
import { TreeNode, getTreeNodeAtPath, TreeEntry, blobSha } from './trees';
import { LOADING, useData } from './useData';
import {
  FormatInfo,
  getEntryDataFilepath,
  getPathPrefix,
  KEYSTATIC_CLOUD_API_URL,
  KEYSTATIC_CLOUD_HEADERS,
  MaybePromise,
} from './utils';
import { toFormattedFormDataError } from '../form/error-formatting';
import { serializeRepoConfig } from './repo-config';
import {
  getBlobFromPersistedCache,
  setBlobToPersistedCache,
} from './object-cache';

class TrackedMap<K, V> extends Map<K, V> {
  #onGet: (key: K) => void;
  constructor(
    onGet: (key: K) => void,
    entries?: readonly (readonly [K, V])[] | null
  ) {
    super(entries);
    this.#onGet = onGet;
  }
  get(key: K) {
    this.#onGet(key);
    return super.get(key);
  }
}

export function parseEntry(
  args: {
    dirpath: string;
    format: FormatInfo;
    schema: Record<string, ComponentSchema>;
    slug: { slug: string; field: string } | undefined;
    requireFrontmatter?: boolean;
  },
  files: Map<string, Uint8Array>
) {
  const dataFilepath = getEntryDataFilepath(args.dirpath, args.format);
  const data = files.get(dataFilepath);
  if (!data) {
    throw new Error(`Could not find data file at ${dataFilepath}`);
  }
  const { loaded, extraFakeFile } = loadDataFile(
    data,
    args.format,
    args.requireFrontmatter
  );
  const filesWithFakeFile = new Map(files);
  if (extraFakeFile) {
    filesWithFakeFile.set(
      `${args.dirpath}/${extraFakeFile.path}`,
      extraFakeFile.contents
    );
  }
  const usedFiles = new Set([dataFilepath]);
  const rootSchema = fields.object(args.schema);
  let initialState;

  const getFile = (filepath: string) => {
    usedFiles.add(filepath);
    return filesWithFakeFile.get(filepath);
  };
  const getFilesForAssetsOrContentField = (
    rootPath: string,
    schema: ContentFormField<any, any, any> | AssetsFormField<any, any, any>
  ) => {
    const otherFiles = new TrackedMap<string, Uint8Array>(key => {
      usedFiles.add(`${rootPath}/${key}`);
    });
    const otherDirectories = new Map<string, TrackedMap<string, Uint8Array>>();

    for (const [filename] of filesWithFakeFile) {
      if (filename.startsWith(rootPath + '/')) {
        const relativePath = filename.slice(rootPath.length + 1);
        otherFiles.set(relativePath, filesWithFakeFile.get(filename)!);
      }
    }
    for (const dir of schema.directories ?? []) {
      const dirFiles = new TrackedMap<string, Uint8Array>(relativePath =>
        usedFiles.add(start + relativePath)
      );
      const start = `${dir}${
        args.slug?.slug === undefined ? '' : `/${args.slug?.slug}`
      }/`;
      for (const [filename, val] of filesWithFakeFile) {
        if (filename.startsWith(start)) {
          const relativePath = filename.slice(start.length);
          dirFiles.set(relativePath, val);
        }
      }
      if (dirFiles.size) {
        otherDirectories.set(dir, dirFiles);
      }
    }
    return { other: otherFiles, external: otherDirectories };
  };
  try {
    initialState = parseProps(
      rootSchema,
      loaded,
      [],
      [],
      (schema, value, path, pathWithArrayFieldSlugs) => {
        if (path.length === 1 && path[0] === args.slug?.field) {
          if (schema.formKind !== 'slug') {
            throw new Error(`slugField is not a slug field`);
          }
          return schema.parse(value, { slug: args.slug.slug });
        }
        if (schema.formKind === 'asset') {
          const suggestedFilenamePrefix = pathWithArrayFieldSlugs.join('/');
          const filepath = schema.filename(value, {
            suggestedFilenamePrefix,
            slug: args.slug?.slug,
          });
          const asset = filepath
            ? getFile(
                `${
                  schema.directory
                    ? `${schema.directory}${
                        args.slug?.slug === undefined
                          ? ''
                          : `/${args.slug.slug}`
                      }`
                    : args.dirpath
                }/${filepath}`
              )
            : undefined;

          return schema.parse(value, { asset, slug: args.slug?.slug });
        }
        if (schema.formKind === 'content' || schema.formKind === 'assets') {
          const rootPath = `${args.dirpath}/${pathWithArrayFieldSlugs.join(
            '/'
          )}`;
          const { external, other } = getFilesForAssetsOrContentField(
            rootPath,
            schema
          );

          if (schema.formKind === 'content') {
            const mainFilepath = rootPath + schema.contentExtension;
            const mainContents = getFile(mainFilepath);
            return schema.parse(value, {
              content: mainContents,
              other,
              external,
              slug: args.slug?.slug,
            });
          }
          if (schema.formKind === 'assets') {
            return schema.parse(value, {
              other,
              external,
              slug: args.slug?.slug,
            });
          }
        }

        return schema.parse(value, undefined);
      },
      false
    );
  } catch (err) {
    throw toFormattedFormDataError(err);
  }

  if (extraFakeFile) {
    usedFiles.delete(`${args.dirpath}/${extraFakeFile.path}`);
  }

  return { initialState, initialFiles: [...usedFiles] };
}

type UseItemDataArgs = {
  config: Config;
  schema: Record<string, ComponentSchema>;
  dirpath: string;
  format: FormatInfo;
  slug: { slug: string; field: string } | undefined;
};

function getAllFilesInTree(tree: Map<string, TreeNode>): TreeEntry[] {
  return [...tree.values()].flatMap(val =>
    val.children ? getAllFilesInTree(val.children) : [val.entry]
  );
}

export function useItemData(args: UseItemDataArgs) {
  const { current: currentBranch } = useTree();
  const baseCommit = useBaseCommit();
  const repoInfo = useRepoInfo();

  const rootTree =
    currentBranch.kind === 'loaded' ? currentBranch.data.tree : undefined;
  const locationsForTreeKey = useMemo(
    () =>
      getDirectoriesForTreeKey(
        fields.object(args.schema),
        args.dirpath,
        args.slug?.slug,
        args.format
      ),
    [args.dirpath, args.format, args.schema, args.slug?.slug]
  );
  const localTreeKey = useMemo(
    () => getTreeKey(locationsForTreeKey, rootTree ?? new Map()),
    [locationsForTreeKey, rootTree]
  );
  const tree = useMemo(() => {
    return rootTree ?? new Map();
    // eslint-disable-next-line react-compiler/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localTreeKey, locationsForTreeKey]);

  const hasLoaded = currentBranch.kind === 'loaded';

  return useData(
    useCallback((): MaybePromise<
      | 'not-found'
      | {
          initialState: Record<string, unknown>;
          initialFiles: string[];
          localTreeKey: string;
        }
    > => {
      if (!hasLoaded) return LOADING;
      const dataFilepathSha = getTreeNodeAtPath(
        tree,
        getEntryDataFilepath(args.dirpath, args.format)
      )?.entry.sha;
      if (dataFilepathSha === undefined) {
        return 'not-found' as const;
      }
      const _args = {
        dirpath: args.dirpath,
        format: args.format,
        schema: args.schema,
        slug: args.slug,
      };
      const allBlobs = locationsForTreeKey
        .flatMap(dir => {
          const node = getTreeNodeAtPath(tree, dir);
          if (!node) return [];
          return node.children
            ? getAllFilesInTree(node.children)
            : [node.entry];
        })
        .map(entry => {
          const blob = fetchBlob(
            args.config,
            entry.sha,
            entry.path,
            baseCommit,
            repoInfo
          );
          if (blob instanceof Uint8Array) {
            return [entry.path, blob] as const;
          }
          return blob.then(blob => [entry.path, blob] as const);
        });

      if (
        allBlobs.every((x): x is readonly [string, Uint8Array] =>
          Array.isArray(x)
        )
      ) {
        const { initialFiles, initialState } = parseEntry(
          _args,
          new Map(allBlobs)
        );

        return {
          initialState,
          initialFiles,
          localTreeKey,
        };
      }

      return Promise.all(allBlobs).then(async data => {
        const { initialState, initialFiles } = parseEntry(_args, new Map(data));
        return {
          initialState,
          initialFiles,
          localTreeKey,
        };
      });
    }, [
      hasLoaded,
      tree,
      args.dirpath,
      args.format,
      args.config,
      args.schema,
      args.slug,
      locationsForTreeKey,
      baseCommit,
      repoInfo,
      localTreeKey,
    ])
  );
}

const blobCache = new LRUCache<string, MaybePromise<Uint8Array>>({ max: 200 });

export async function hydrateBlobCache(contents: Uint8Array) {
  const sha = await blobSha(contents);
  blobCache.set(sha, contents);
  await setBlobToPersistedCache(sha, contents);
  return sha;
}

async function fetchGitHubBlob(
  config: Config,
  oid: string,
  filepath: string,
  commitSha: string,
  repoInfo: { owner: string; name: string; isPrivate: boolean } | null
): Promise<Response> {
  if (repoInfo?.isPrivate === false) {
    return fetch(
      `https://raw.githubusercontent.com/${serializeRepoConfig(
        repoInfo
      )}/${commitSha}/${getPathPrefix(config.storage) ?? ''}${filepath}`
    );
  }
  const auth = await getAuth(config);
  return fetch(
    config.storage.kind === 'github'
      ? `https://api.github.com/repos/${serializeRepoConfig(
          config.storage.repo
        )}/git/blobs/${oid}`
      : `${KEYSTATIC_CLOUD_API_URL}/v1/github/blob/${oid}`,
    {
      headers: {
        Authorization: `Bearer ${auth!.accessToken}`,
        Accept: 'application/vnd.github.raw',
        ...(config.storage.kind === 'cloud' ? KEYSTATIC_CLOUD_HEADERS : {}),
      },
    }
  );
}

export function fetchBlob(
  config: Config,
  oid: string,
  filepath: string,
  commitSha: string,
  repoInfo: { owner: string; name: string; isPrivate: boolean } | null
): MaybePromise<Uint8Array> {
  if (blobCache.has(oid)) return blobCache.get(oid)!;

  const promise = (async () => {
    const isLocal = config.storage.kind === 'local';
    if (!isLocal) {
      const stored = await getBlobFromPersistedCache(oid);
      if (stored) {
        blobCache.set(oid, stored);
        return stored;
      }
    }
    return (
      isLocal
        ? fetch(`/api/keystatic/blob/${oid}/${filepath}`, {
            headers: { 'no-cors': '1' },
          })
        : fetchGitHubBlob(config, oid, filepath, commitSha, repoInfo)
    )
      .then(async x => {
        if (!x.ok) {
          throw new Error(
            `Could not fetch blob ${oid} (${filepath}): ${
              x.status
            }\n${await x.text()}`
          );
        }
        return x.arrayBuffer();
      })
      .then(x => {
        const array = new Uint8Array(x);
        blobCache.set(oid, array);
        if (config.storage.kind !== 'local') {
          setBlobToPersistedCache(oid, array);
        }
        return array;
      })
      .catch(err => {
        blobCache.delete(oid);
        throw err;
      });
  })();

  blobCache.set(oid, promise);
  return promise;
}
