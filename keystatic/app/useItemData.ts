import LRUCache from 'lru-cache';
import { useCallback, useMemo } from 'react';
import { Config } from '../config';
import { getValueAtPropPath } from '../DocumentEditor/component-blocks/utils';
import { ComponentSchema, fields } from '../src';
import { validateComponentBlockProps } from '../validate-component-block-props';
import { getAuth } from './auth';
import {
  getRequiredFiles,
  loadDataFile,
  parseSerializedFormField,
  RequiredFile,
} from './required-files';
import { useTree } from './shell';
import { TreeNode, getTreeNodeAtPath } from './trees';
import { LOADING, useData } from './useData';
import { blobSha, FormatInfo, getDataFileExtension, MaybePromise } from './utils';

function parseFromValueFile(
  args: UseItemDataArgs,
  data: Uint8Array,
  localTree: Map<string, TreeNode>
) {
  const { loaded, extraFakeFile } = loadDataFile(data, args.format);
  const schema = fields.object(args.schema);
  const validated = validateComponentBlockProps(schema, loaded, {}, []);
  const requiredFiles = getRequiredFiles(validated, schema);
  const binaryFiles = requiredFiles.flatMap(requiredFile =>
    requiredFile.files.flatMap(filename => {
      const file = getTreeNodeAtPath(localTree, filename)?.entry;
      return file ? [{ filename, oid: file.sha }] : [];
    })
  );
  const maybeLoadedBinaryFiles = binaryFiles.map(file => {
    const result = fetchGithubBlob(args.config, file.oid);
    if (result instanceof Uint8Array) {
      return [file.filename, result] as const;
    }
    return result.then(array => [file.filename, array] as const);
  });
  if (extraFakeFile) {
    maybeLoadedBinaryFiles.push([extraFakeFile.path, extraFakeFile.contents]);
  }
  const initialFiles = [
    `${args.dirpath}/index${getDataFileExtension(args.format)}`,
    ...binaryFiles.map(x => `${args.dirpath}/${x.filename}`),
  ];

  return { validated, initialFiles, requiredFiles, maybeLoadedBinaryFiles };
}

function parseWithExtraFiles(
  requiredFiles: RequiredFile[],
  validated: unknown,
  loadedBinaryFiles: Map<string, Uint8Array>
) {
  for (const file of requiredFiles) {
    const parentValue = getValueAtPropPath(validated, file.path.slice(0, -1)) as any;
    const keyOnParent = file.path[file.path.length - 1];
    parentValue[keyOnParent] = parseSerializedFormField(
      parentValue[keyOnParent],
      file,
      loadedBinaryFiles,
      'edit'
    );
  }
  return validated as Record<string, unknown>;
}

type UseItemDataArgs = {
  config: Config;
  schema: Record<string, ComponentSchema>;
  dirpath: string;
  format: FormatInfo;
};

export function useItemData(args: UseItemDataArgs) {
  const { current: currentBranch } = useTree();

  const rootTree = currentBranch.kind === 'loaded' ? currentBranch.data.tree : undefined;
  const _localTree = useMemo(() => {
    return rootTree ? getTreeNodeAtPath(rootTree, args.dirpath) : undefined;
  }, [rootTree, args.dirpath]);

  const localTreeNode = useMemo(() => {
    return _localTree?.children
      ? { entry: _localTree.entry, children: _localTree.children }
      : undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_localTree?.entry.sha]);

  const hasLoaded = currentBranch.kind === 'loaded';

  return useData(
    useCallback(() => {
      if (!hasLoaded) return LOADING;
      if (localTreeNode === undefined) return 'not-found' as const;
      const localTree = localTreeNode.children;
      const dataFilepathSha = localTree.get(`index${getDataFileExtension(args.format)}`)?.entry.sha;
      if (dataFilepathSha === undefined) {
        return 'not-found' as const;
      }
      const _args = {
        config: args.config,
        dirpath: args.dirpath,
        format: args.format,
        schema: args.schema,
      };
      const dataResult = fetchGithubBlob(args.config, dataFilepathSha);
      if (dataResult instanceof Uint8Array) {
        const { validated, initialFiles, requiredFiles, maybeLoadedBinaryFiles } =
          parseFromValueFile(_args, dataResult, localTree);
        if (maybeLoadedBinaryFiles.every((x): x is [string, Uint8Array] => Array.isArray(x))) {
          const loadedBinaryFiles = new Map(maybeLoadedBinaryFiles);
          const initialState = parseWithExtraFiles(requiredFiles, validated, loadedBinaryFiles);
          return { initialState, initialFiles, localTreeSha: localTreeNode.entry.sha };
        }
      }
      return Promise.resolve(dataResult).then(async data => {
        const { validated, initialFiles, requiredFiles, maybeLoadedBinaryFiles } =
          parseFromValueFile(_args, data, localTree);
        const loadedBinaryFiles = new Map(await Promise.all(maybeLoadedBinaryFiles));
        const initialState = parseWithExtraFiles(requiredFiles, validated, loadedBinaryFiles);
        return { initialState, initialFiles, localTreeSha: localTreeNode.entry.sha };
      });
    }, [args.config, args.dirpath, args.format, args.schema, localTreeNode, hasLoaded])
  );
}

const blobCache = new LRUCache<string, MaybePromise<Uint8Array>>({ max: 200 });

export async function hydrateBlobCache(contents: Uint8Array) {
  const sha = await blobSha(contents);
  blobCache.set(sha, contents);
  return sha;
}

function fetchGithubBlob(config: Config, oid: string): MaybePromise<Uint8Array> {
  if (blobCache.has(oid)) return blobCache.get(oid)!;
  const promise = getAuth()
    .then(auth =>
      fetch(
        `https://api.github.com/repos/${config.repo.owner}/${config.repo.name}/git/blobs/${oid}`,
        {
          headers: {
            Authorization: `Bearer ${auth!.accessToken}`,
            Accept: 'application/vnd.github.raw',
          },
        }
      )
        .then(x => x.arrayBuffer())
        .then(x => {
          const array = new Uint8Array(x);
          blobCache.set(oid, array);
          return array;
        })
    )
    .catch(err => {
      blobCache.delete(oid);
      throw err;
    });
  blobCache.set(oid, promise);
  return promise;
}
