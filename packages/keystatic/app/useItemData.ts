import LRUCache from 'lru-cache';
import { useCallback, useMemo } from 'react';
import { Config } from '../config';
import { transformProps } from '../DocumentEditor/component-blocks/utils';
import { ComponentSchema, fields, GitHubConfig } from '../src';
import { validateComponentBlockProps } from '../validate-component-block-props';
import { getAuth } from './auth';
import { loadDataFile, parseSerializedFormField } from './required-files';
import { useTree } from './shell/data';
import { getDirectoriesForTreeKey, getTreeKey } from './tree-key';
import { TreeNode, getTreeNodeAtPath, TreeEntry } from './trees';
import { LOADING, useData } from './useData';
import {
  blobSha,
  FormatInfo,
  getDataFileExtension,
  isGitHubConfig,
  MaybePromise,
} from './utils';

function parseEntry(args: UseItemDataArgs, files: Map<string, Uint8Array>) {
  const dataFilepath = `${args.dirpath}/index${getDataFileExtension(
    args.format
  )}`;
  const data = files.get(dataFilepath);
  if (!data) {
    throw new Error(`Could not find data file at ${dataFilepath}`);
  }
  const { loaded, extraFakeFile } = loadDataFile(data, args.format);
  const schema = fields.object(args.schema);
  const validated = validateComponentBlockProps(
    schema,
    loaded,
    [],
    args.slug
      ? {
          slug: args.slug.slug,
          field: args.slug.slugField,
          mode: 'parse',
          slugs: args.slug.slugs,
        }
      : undefined
  );
  const filesWithFakeFile = new Map(
    [...files].map(x => [x[0].replace(args.dirpath + '/', ''), x[1]])
  );
  if (extraFakeFile) {
    filesWithFakeFile.set(extraFakeFile.path, extraFakeFile.contents);
  }

  const initialState = transformProps(schema, validated, {
    form(schema, val, path) {
      if ('serializeToFile' in schema) {
        return parseSerializedFormField(
          val,
          { path, schema },
          filesWithFakeFile,
          'edit'
        );
      }
      return val;
    },
  }) as Record<string, unknown>;
  const initialFiles = [...files.keys()];

  return { initialState, initialFiles };
}

type UseItemDataArgs = {
  config: Config;
  schema: Record<string, ComponentSchema>;
  dirpath: string;
  format: FormatInfo;
  slug: { slugs: Set<string>; slugField: string; slug: string } | undefined;
};

function getAllFilesInTree(tree: Map<string, TreeNode>): TreeEntry[] {
  return [...tree.values()].flatMap(val =>
    val.children ? getAllFilesInTree(val.children) : [val.entry]
  );
}

export function useItemData(args: UseItemDataArgs) {
  const { current: currentBranch } = useTree();

  const rootTree =
    currentBranch.kind === 'loaded' ? currentBranch.data.tree : undefined;
  const directoriesForTreeKey = useMemo(
    () => getDirectoriesForTreeKey(fields.object(args.schema), args.dirpath),
    [args.dirpath, args.schema]
  );
  const localTreeKey = useMemo(
    () => getTreeKey(directoriesForTreeKey, rootTree ?? new Map()),
    [directoriesForTreeKey, rootTree]
  );
  const tree = useMemo(() => {
    return rootTree ?? new Map();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localTreeKey, directoriesForTreeKey]);

  const hasLoaded = currentBranch.kind === 'loaded';

  return useData(
    useCallback((): MaybePromise<
      | 'not-found'
      | typeof LOADING
      | {
          initialState: Record<string, unknown>;
          initialFiles: string[];
          localTreeKey: string;
        }
    > => {
      if (!hasLoaded) return LOADING;
      const localTreeNode = getTreeNodeAtPath(tree, args.dirpath);
      if (localTreeNode === undefined || !localTreeNode.children) {
        return 'not-found' as const;
      }
      const localTree = localTreeNode.children;
      const dataFilepath = `index${getDataFileExtension(args.format)}`;
      const dataFilepathSha = localTree.get(dataFilepath)?.entry.sha;
      if (dataFilepathSha === undefined) {
        return 'not-found' as const;
      }
      const _args = {
        config: args.config,
        dirpath: args.dirpath,
        format: args.format,
        schema: args.schema,
        slug: args.slug,
      };

      const allBlobs = getAllFilesInTree(localTreeNode.children).map(entry => {
        const blob = fetchBlob(args.config, entry.sha, entry.path);
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
      localTreeKey,
    ])
  );
}

const blobCache = new LRUCache<string, MaybePromise<Uint8Array>>({ max: 200 });

export async function hydrateBlobCache(contents: Uint8Array) {
  const sha = await blobSha(contents);
  blobCache.set(sha, contents);
  return sha;
}

async function fetchGitHubBlob(
  config: GitHubConfig,
  oid: string
): Promise<Response> {
  const auth = await getAuth();
  return fetch(
    `https://api.github.com/repos/${config.storage.repo.owner}/${config.storage.repo.name}/git/blobs/${oid}`,
    {
      headers: {
        Authorization: `Bearer ${auth!.accessToken}`,
        Accept: 'application/vnd.github.raw',
      },
    }
  );
}

function fetchBlob(
  config: Config,
  oid: string,
  filepath: string
): MaybePromise<Uint8Array> {
  if (blobCache.has(oid)) return blobCache.get(oid)!;
  const promise = (
    isGitHubConfig(config)
      ? fetchGitHubBlob(config, oid)
      : fetch(`/api/keystatic/blob/${oid}/${filepath}`, {
          headers: { 'no-cors': '1' },
        })
  )

    .then(x => x.arrayBuffer())
    .then(x => {
      const array = new Uint8Array(x);
      blobCache.set(oid, array);
      return array;
    })

    .catch(err => {
      blobCache.delete(oid);
      throw err;
    });
  blobCache.set(oid, promise);
  return promise;
}
