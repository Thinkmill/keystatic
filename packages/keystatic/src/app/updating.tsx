import { gql } from '@ts-gql/tag/no-transform';
import { assert } from 'emery';
import { useContext, useState } from 'react';

import { ComponentSchema, fields } from '../form/api';
import { dump } from 'js-yaml';
import { useMutation } from 'urql';
import { fromUint8Array } from 'js-base64';
import {
  BranchInfoContext,
  fetchGitHubTreeData,
  hydrateTreeCacheWithEntries,
  RepoWithWriteAccessContext,
  useBaseCommit,
  useCurrentUnscopedTree,
  useSetTreeSha,
} from './shell/data';
import { hydrateBlobCache } from './useItemData';
import { FormatInfo, getEntryDataFilepath, getPathPrefix } from './path-utils';
import {
  getTreeNodeAtPath,
  TreeEntry,
  treeSha,
  updateTreeWithChanges,
} from './trees';
import { Config } from '..';
import { getDirectoriesForTreeKey, getTreeKey } from './tree-key';
import { AppSlugContext } from './onboarding/install-app';
import { createUrqlClient } from './provider';
import { serializeProps } from '../form/serialize-props';
import { scopeEntriesWithPathPrefix } from './shell/path-prefix';

const textEncoder = new TextEncoder();

const frontmatterSplit = textEncoder.encode('---\n');

function combineFrontmatterAndContents(
  frontmatter: Uint8Array,
  contents: Uint8Array
) {
  const array = new Uint8Array(
    frontmatter.byteLength +
      contents.byteLength +
      frontmatterSplit.byteLength * 2
  );
  array.set(frontmatterSplit);
  array.set(frontmatter, frontmatterSplit.byteLength);
  array.set(
    frontmatterSplit,
    frontmatterSplit.byteLength + frontmatter.byteLength
  );
  array.set(contents, frontmatterSplit.byteLength * 2 + frontmatter.byteLength);
  return array;
}

function serializeEntryToFiles(args: {
  basePath: string;
  config: Config;
  schema: Record<string, ComponentSchema>;
  format: FormatInfo;
  state: unknown;
  slug: { value: string; field: string } | undefined;
}) {
  let { value: stateWithExtraFilesRemoved, extraFiles } = serializeProps(
    args.state,
    fields.object(args.schema),
    args.slug?.field,
    args.slug?.value,
    true
  );
  const dataFormat = args.format.data;
  let dataContent = textEncoder.encode(
    dataFormat === 'json'
      ? JSON.stringify(stateWithExtraFilesRemoved, null, 2) + '\n'
      : dump(stateWithExtraFilesRemoved)
  );

  if (args.format.contentField) {
    const filename = `${args.format.contentField.key}${args.format.contentField.config.contentExtension}`;
    let contents: undefined | Uint8Array;
    extraFiles = extraFiles.filter(x => {
      if (x.path !== filename) return true;
      contents = x.contents;
      return false;
    });
    assert(contents !== undefined, 'Expected content field to be present');
    dataContent = combineFrontmatterAndContents(dataContent, contents);
  }

  return [
    {
      path: getEntryDataFilepath(args.basePath, args.format),
      contents: dataContent,
    },
    ...extraFiles.map(file => ({
      path: `${
        file.parent
          ? args.slug
            ? `${file.parent}/${args.slug.value}`
            : file.parent
          : args.basePath
      }/${file.path}`,
      contents: file.contents,
    })),
  ];
}

export function useUpsertItem(args: {
  state: unknown;
  initialFiles: string[] | undefined;
  schema: Record<string, ComponentSchema>;
  config: Config;
  format: FormatInfo;
  currentLocalTreeKey: string | undefined;
  basePath: string;
  slug: { value: string; field: string } | undefined;
}) {
  const [state, setState] = useState<
    | { kind: 'idle' }
    | { kind: 'updated' }
    | { kind: 'loading' }
    | { kind: 'needs-fork' }
    | { kind: 'error'; error: Error }
    | { kind: 'needs-new-branch'; reason: string }
  >({
    kind: 'idle',
  });
  const baseCommit = useBaseCommit();
  const branchInfo = useContext(BranchInfoContext);
  const setTreeSha = useSetTreeSha();
  const [, mutate] = useMutation(createCommitMutation);
  const repoWithWriteAccess = useContext(RepoWithWriteAccessContext);
  const appSlug = useContext(AppSlugContext);
  const unscopedTreeData = useCurrentUnscopedTree();

  return [
    state,
    async (override?: { sha: string; branch: string }): Promise<boolean> => {
      try {
        const unscopedTree =
          unscopedTreeData.kind === 'loaded'
            ? unscopedTreeData.data.tree
            : undefined;
        if (!unscopedTree) return false;
        if (
          repoWithWriteAccess === null &&
          args.config.storage.kind === 'github' &&
          appSlug?.value
        ) {
          setState({ kind: 'needs-fork' });
          return false;
        }
        setState({ kind: 'loading' });

        const pathPrefix = getPathPrefix(args.config.storage) ?? '';
        let additions = serializeEntryToFiles({
          basePath: args.basePath,
          config: args.config,
          schema: args.schema,
          format: args.format,
          state: args.state,
          slug: args.slug,
        }).map(addition => ({
          ...addition,
          path: pathPrefix + addition.path,
        }));

        const additionPathToSha = new Map(
          await Promise.all(
            additions.map(
              async addition =>
                [
                  addition.path,
                  await hydrateBlobCache(addition.contents),
                ] as const
            )
          )
        );

        const filesToDelete = new Set(
          args.initialFiles?.map(x => pathPrefix + x)
        );
        for (const file of additions) {
          filesToDelete.delete(file.path);
        }

        additions = additions.filter(addition => {
          const sha = additionPathToSha.get(addition.path)!;
          const existing = getTreeNodeAtPath(unscopedTree, addition.path);
          return existing?.entry.sha !== sha;
        });

        const deletions: { path: string }[] = [...filesToDelete].map(path => ({
          path,
        }));
        const updatedTree = await updateTreeWithChanges(unscopedTree, {
          additions,
          deletions: [...filesToDelete],
        });
        await hydrateTreeCacheWithEntries(updatedTree.entries);
        if (
          args.config.storage.kind === 'github' ||
          args.config.storage.kind === 'cloud'
        ) {
          const branch = {
            branchName: override?.branch ?? branchInfo.currentBranch,
            repositoryNameWithOwner: `${repoWithWriteAccess!.owner}/${
              repoWithWriteAccess!.name
            }`,
          };
          const runMutation = (expectedHeadOid: string) =>
            mutate({
              input: {
                branch,
                expectedHeadOid,
                message: { headline: `Update ${args.basePath}` },
                fileChanges: {
                  additions: additions.map(addition => ({
                    ...addition,
                    contents: fromUint8Array(addition.contents),
                  })),
                  deletions,
                },
              },
            });
          let result = await runMutation(override?.sha ?? baseCommit);
          const gqlError = result.error?.graphQLErrors[0]?.originalError;
          if (gqlError && 'type' in gqlError) {
            if (gqlError.type === 'BRANCH_PROTECTION_RULE_VIOLATION') {
              setState({
                kind: 'needs-new-branch',
                reason:
                  'Changes must be made via pull request to this branch. Create a new branch to save changes.',
              });
              return false;
            }
            if (gqlError.type === 'STALE_DATA') {
              // we don't want this to go into the cache yet
              // so we create a new client just for this
              const refData = await createUrqlClient(args.config)
                .query(FetchRef, {
                  owner: repoWithWriteAccess!.owner,
                  name: repoWithWriteAccess!.name,
                  ref: `refs/heads/${branchInfo.currentBranch}`,
                })
                .toPromise();
              if (!refData.data?.repository?.ref?.target) {
                throw new Error('Branch not found');
              }

              const tree = scopeEntriesWithPathPrefix(
                await fetchGitHubTreeData(
                  refData.data.repository.ref.target.oid,
                  args.config
                ),
                args.config
              );
              const treeKey = getTreeKey(
                getDirectoriesForTreeKey(
                  fields.object(args.schema),
                  args.basePath,
                  args.slug?.value,
                  args.format
                ),
                tree.tree
              );
              if (treeKey === args.currentLocalTreeKey) {
                result = await runMutation(
                  refData.data.repository.ref.target.oid
                );
              } else {
                setState({
                  kind: 'needs-new-branch',
                  reason:
                    'This entry has been updated since it was opened. Create a new branch to save changes.',
                });
                return false;
              }
            }
          }

          if (result.error) {
            throw result.error;
          }
          const target = result.data?.createCommitOnBranch?.ref?.target;
          if (target) {
            setState({ kind: 'updated' });
            return true;
          }
          throw new Error('Failed to update');
        } else {
          const res = await fetch('/api/keystatic/update', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'no-cors': '1',
            },
            body: JSON.stringify({
              additions: additions.map(addition => ({
                ...addition,
                contents: fromUint8Array(addition.contents),
              })),
              deletions,
            }),
          });
          if (!res.ok) {
            throw new Error(await res.text());
          }
          const newTree: TreeEntry[] = await res.json();
          const { tree } = await hydrateTreeCacheWithEntries(newTree);
          setTreeSha(await treeSha(tree));
          setState({ kind: 'updated' });
          return true;
        }
      } catch (err) {
        setState({ kind: 'error', error: err as Error });
        return false;
      }
    },
    () => {
      setState({ kind: 'idle' });
    },
  ] as const;
}

const createCommitMutation = gql`
  mutation CreateCommit($input: CreateCommitOnBranchInput!) {
    createCommitOnBranch(input: $input) {
      ref {
        id
        target {
          id
          oid
          ... on Commit {
            tree {
              id
              oid
            }
          }
        }
      }
    }
  }
` as import('../../__generated__/ts-gql/CreateCommit').type;

export function useDeleteItem(args: {
  basePath: string;
  initialFiles: string[];
  storage: Config['storage'];
}) {
  const [state, setState] = useState<
    | { kind: 'idle' }
    | { kind: 'updated' }
    | { kind: 'loading' }
    | { kind: 'needs-fork' }
    | { kind: 'error'; error: Error }
  >({
    kind: 'idle',
  });
  const baseCommit = useBaseCommit();
  const branchInfo = useContext(BranchInfoContext);

  const [, mutate] = useMutation(createCommitMutation);
  const setTreeSha = useSetTreeSha();
  const repoWithWriteAccess = useContext(RepoWithWriteAccessContext);
  const appSlug = useContext(AppSlugContext);
  const unscopedTreeData = useCurrentUnscopedTree();

  return [
    state,
    async () => {
      try {
        const unscopedTree =
          unscopedTreeData.kind === 'loaded'
            ? unscopedTreeData.data.tree
            : undefined;
        if (!unscopedTree) return false;
        if (
          repoWithWriteAccess === null &&
          args.storage.kind === 'github' &&
          appSlug?.value
        ) {
          setState({ kind: 'needs-fork' });
          return false;
        }
        setState({ kind: 'loading' });
        const deletions = args.initialFiles.map(
          x => getPathPrefix(args.storage) + x
        );
        const updatedTree = await updateTreeWithChanges(unscopedTree, {
          additions: [],
          deletions,
        });
        await hydrateTreeCacheWithEntries(updatedTree.entries);
        if (args.storage.kind === 'github' || args.storage.kind === 'cloud') {
          const { error } = await mutate({
            input: {
              branch: {
                repositoryNameWithOwner: `${repoWithWriteAccess!.owner}/${
                  repoWithWriteAccess!.name
                }`,
                branchName: branchInfo.currentBranch,
              },
              message: { headline: `Delete ${args.basePath}` },
              expectedHeadOid: baseCommit,
              fileChanges: {
                deletions: deletions.map(path => ({ path })),
              },
            },
          });
          if (error) {
            throw error;
          }
          setState({ kind: 'updated' });
          return true;
        } else {
          const res = await fetch('/api/keystatic/update', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'no-cors': '1',
            },
            body: JSON.stringify({
              additions: [],
              deletions: deletions.map(path => ({ path })),
            }),
          });
          if (!res.ok) {
            throw new Error(await res.text());
          }
          const newTree: TreeEntry[] = await res.json();
          const { tree } = await hydrateTreeCacheWithEntries(newTree);
          setTreeSha(await treeSha(tree));
          setState({ kind: 'updated' });
          return true;
        }
      } catch (err) {
        setState({ kind: 'error', error: err as Error });
      }
    },
    () => {
      setState({ kind: 'idle' });
    },
  ] as const;
}

const FetchRef = gql`
  query FetchRef($owner: String!, $name: String!, $ref: String!) {
    repository(owner: $owner, name: $name) {
      id
      ref(qualifiedName: $ref) {
        id
        target {
          id
          oid
        }
      }
    }
  }
` as import('../../__generated__/ts-gql/FetchRef').type;
