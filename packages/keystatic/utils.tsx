import { gql } from '@ts-gql/tag/no-transform';
import { fromByteArray } from 'base64-js';
import { assert, assertNever } from 'emery';
import { dump } from 'js-yaml';
import { useContext, useState } from 'react';
import { useMutation } from 'urql';

import { ComponentSchema, fields } from './DocumentEditor/component-blocks/api';
import { asyncTransformProps } from './DocumentEditor/component-blocks/utils';
import {
  BranchInfoContext,
  fetchGitHubTreeData,
  hydrateTreeCacheWithEntries,
  RepoWithWriteAccessContext,
  useBaseCommit,
  useSetTreeSha,
} from './app/shell/data';
import { hydrateBlobCache } from './app/useItemData';
import { FormatInfo, getEntryDataFilepath } from './app/path-utils';
import {
  getTreeNodeAtPath,
  TreeEntry,
  TreeNode,
  treeSha,
  updateTreeWithChanges,
} from './app/trees';
import { Config } from './src';
import { getAuth } from './app/auth';
import { isSlugFormField } from './app/utils';
import { getDirectoriesForTreeKey, getTreeKey } from './app/tree-key';
import { getPropPathPortion } from './app/required-files';
import { AppSlugContext } from './app/onboarding/install-app';

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

export function useUpsertItem(args: {
  state: unknown;
  initialFiles: string[] | undefined;
  schema: Record<string, ComponentSchema>;
  storage: Config['storage'];
  format: FormatInfo;
  currentTree: Map<string, TreeNode>;
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

  return [
    state,
    async (override?: { sha: string; branch: string }): Promise<boolean> => {
      try {
        if (
          repoWithWriteAccess === null &&
          args.storage.kind === 'github' &&
          appSlug?.value
        ) {
          setState({ kind: 'needs-fork' });
          return false;
        }
        setState({ kind: 'loading' });
        let { value: stateWithExtraFilesRemoved, extraFiles } = await toFiles(
          args.state,
          fields.object(args.schema),
          args.slug
        );
        const dataFormat = args.format.data;
        let dataContent = textEncoder.encode(
          dataFormat === 'json'
            ? JSON.stringify(stateWithExtraFilesRemoved, null, 2) + '\n'
            : dump(stateWithExtraFilesRemoved)
        );

        if (args.format.contentField) {
          const filename = `${args.format.contentField.key}${args.format.contentField.config.serializeToFile.primaryExtension}`;
          let contents: undefined | Uint8Array;
          extraFiles = extraFiles.filter(x => {
            if (x.path !== filename) return true;
            contents = x.contents;
            return false;
          });
          assert(
            contents !== undefined,
            'Expected content field to be present'
          );
          dataContent = combineFrontmatterAndContents(dataContent, contents);
        }

        let additions = [
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

        const filesToDelete = new Set(args.initialFiles);
        for (const file of additions) {
          filesToDelete.delete(file.path);
        }

        additions = additions.filter(addition => {
          const sha = additionPathToSha.get(addition.path)!;
          const existing = getTreeNodeAtPath(args.currentTree, addition.path);
          return existing?.entry.sha !== sha;
        });

        const deletions: { path: string }[] = [...filesToDelete].map(path => ({
          path,
        }));
        const updatedTree = await updateTreeWithChanges(args.currentTree, {
          additions,
          deletions: [...filesToDelete],
        });
        await hydrateTreeCacheWithEntries(updatedTree.entries);
        if (args.storage.kind === 'github') {
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
                    contents: fromByteArray(addition.contents),
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
              const branch = await fetch(
                `https://api.github.com/repos/${args.storage.repo.owner}/${
                  args.storage.repo.name
                }/branches/${encodeURIComponent(branchInfo.currentBranch)}`,
                {
                  headers: {
                    Authorization: `Bearer ${(await getAuth())?.accessToken}`,
                  },
                }
              ).then(x => x.json());
              const tree = await fetchGitHubTreeData(
                branch.commit.sha,
                args.storage.repo
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
                result = await runMutation(branch.data.commit.sha);
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
                contents: fromByteArray(addition.contents),
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
` as import('./__generated__/ts-gql/CreateCommit').type;

export function useDeleteItem(args: {
  basePath: string;
  initialFiles: string[];
  currentTree: Map<string, TreeNode>;
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

  return [
    state,
    async () => {
      try {
        if (
          repoWithWriteAccess === null &&
          args.storage.kind === 'github' &&
          appSlug?.value
        ) {
          setState({ kind: 'needs-fork' });
          return false;
        }
        setState({ kind: 'loading' });
        const updatedTree = await updateTreeWithChanges(args.currentTree, {
          additions: [],
          deletions: args.initialFiles,
        });
        await hydrateTreeCacheWithEntries(updatedTree.entries);
        if (args.storage.kind === 'github') {
          const { error } = await mutate({
            input: {
              branch: {
                repositoryNameWithOwner: `${args.storage.repo.owner}/${args.storage.repo.name}`,
                branchName: branchInfo.currentBranch,
              },
              message: { headline: `Delete ${args.basePath}` },
              expectedHeadOid: baseCommit,
              fileChanges: {
                deletions: args.initialFiles.map(path => ({ path })),
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
              deletions: args.initialFiles.map(path => ({ path })),
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

export async function toFiles(
  rootValue: unknown,
  rootSchema: ComponentSchema,
  slug: { field: string; value: string } | undefined
) {
  const extraFiles: {
    path: string;
    parent: string | undefined;
    contents: Uint8Array;
  }[] = [];
  return {
    value: await asyncTransformProps(rootSchema, rootValue, {
      async form(schema, value, propPath) {
        if (propPath.length === 1 && slug?.field === propPath[0]) {
          if (!isSlugFormField(schema)) {
            throw new Error('slugField is a not a slug field');
          }
          return schema.slug.serialize(value).value;
        }
        if ('serializeToFile' in schema && schema.serializeToFile) {
          if (schema.serializeToFile.kind === 'asset') {
            const suggestedFilenamePrefix = getPropPathPortion(
              propPath,
              rootSchema,
              rootValue
            );

            const { content, value: forYaml } =
              schema.serializeToFile.serialize(
                value,
                suggestedFilenamePrefix,
                slug?.value
              );
            if (content) {
              const path = schema.serializeToFile.filename(
                forYaml,
                suggestedFilenamePrefix,
                slug?.value
              );
              if (path) {
                extraFiles.push({
                  path,
                  contents: content,
                  parent: schema.serializeToFile.directory,
                });
              }
            }
            return forYaml;
          }
          if (schema.serializeToFile.kind === 'multi') {
            const {
              other,
              external,
              primary,
              value: forYaml,
            } = await schema.serializeToFile.serialize(value, slug?.value);
            if (primary) {
              extraFiles.push({
                path:
                  getPropPathPortion(propPath, rootSchema, rootValue) +
                  schema.serializeToFile.primaryExtension,
                contents: primary,
                parent: undefined,
              });
            }
            for (const [key, contents] of other) {
              extraFiles.push({
                path:
                  getPropPathPortion(propPath, rootSchema, rootValue) +
                  '/' +
                  key,
                contents,
                parent: undefined,
              });
            }
            const allowedDirectories = new Set(
              schema.serializeToFile.directories
            );
            for (const [directory, contents] of external) {
              if (!allowedDirectories.has(directory)) {
                throw new Error(
                  `Invalid directory ${directory} in multi-file serialization`
                );
              }
              for (const [filename, fileContents] of contents) {
                extraFiles.push({
                  path: filename,
                  contents: fileContents,
                  parent: directory,
                });
              }
            }
            return forYaml;
          }
          assertNever(schema.serializeToFile);
        }
        return value;
      },
    }),
    extraFiles,
  };
}
