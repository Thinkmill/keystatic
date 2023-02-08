import { gql } from '@ts-gql/tag/no-transform';
import { dump } from 'js-yaml';
import { useMutation } from 'urql';
import { ComponentSchema, fields } from './DocumentEditor/component-blocks/api';
import { fromByteArray } from 'base64-js';
import { assertNever } from './DocumentEditor/component-blocks/utils';
import { fetchTreeData, hydrateTreeCacheWithEntries } from './app/shell';
import { hydrateBlobCache } from './app/useItemData';
import { useState } from 'react';
import { githubRequest } from './github-api';
import { assert } from 'emery';
import { FormatInfo } from './app/path-utils';
import { getTreeNodeAtPath, TreeNode, updateTreeWithChanges } from './app/trees';

const textEncoder = new TextEncoder();

const frontmatterSplit = textEncoder.encode('---\n');

function combineFrontmatterAndContents(frontmatter: Uint8Array, contents: Uint8Array) {
  const array = new Uint8Array(
    frontmatter.byteLength + contents.byteLength + frontmatterSplit.byteLength * 2
  );
  array.set(frontmatterSplit);
  array.set(frontmatter, frontmatterSplit.byteLength);
  array.set(frontmatterSplit, frontmatterSplit.byteLength + frontmatter.byteLength);
  array.set(contents, frontmatterSplit.byteLength * 2 + frontmatter.byteLength);
  return array;
}

export function useUpsertItem(args: {
  branch: string;
  baseCommit: string;
  state: unknown;
  initialFiles: string[] | undefined;
  schema: Record<string, ComponentSchema>;
  repo: { owner: string; name: string };
  format: FormatInfo;
  currentTree: Map<string, TreeNode>;
  currentLocalTreeSha: string | undefined;
  basePath: string;
}) {
  const [state, setState] = useState<
    | { kind: 'idle' }
    | { kind: 'updated' }
    | { kind: 'loading' }
    | { kind: 'error'; error: Error }
    | { kind: 'needs-new-branch'; reason: string }
  >({
    kind: 'idle',
  });
  const [, mutate] = useMutation(createCommitMutation);
  return [
    state,
    async () => {
      setState({ kind: 'loading' });
      let { value: stateWithExtraFilesRemoved, extraFiles } = await toFiles(
        args.state,
        fields.object(args.schema)
      );
      const dataFormat = typeof args.format === 'string' ? args.format : args.format.frontmatter;
      let dataExtension = '.' + dataFormat;
      let dataContent = textEncoder.encode(
        dataFormat === 'json'
          ? JSON.stringify(stateWithExtraFilesRemoved, null, 2) + '\n'
          : dump(stateWithExtraFilesRemoved)
      );

      if (typeof args.format === 'object') {
        const filename = `${args.format.contentFieldKey}${args.format.contentFieldConfig.serializeToFile.primaryExtension}`;
        let contents: undefined | Uint8Array;
        extraFiles = extraFiles.filter(x => {
          if (x.path !== filename) return true;
          contents = x.contents;
          return false;
        });
        assert(contents !== undefined, 'Expected content field to be present');
        dataExtension = args.format.contentFieldConfig.serializeToFile.primaryExtension;
        dataContent = combineFrontmatterAndContents(dataContent, contents);
      }

      let additions = [
        {
          path: `${args.basePath}/index${dataExtension}`,
          contents: dataContent,
        },
        ...extraFiles.map(file => ({
          path: `${args.basePath}/${file.path}`,
          contents: file.contents,
        })),
      ];
      const additionPathToSha = new Map(
        await Promise.all(
          additions.map(
            async addition => [addition.path, await hydrateBlobCache(addition.contents)] as const
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

      const deletions: { path: string }[] = [...filesToDelete].map(path => ({ path }));
      const updatedTree = await updateTreeWithChanges(
        args.currentTree,
        { additions, deletions: [...filesToDelete] },
        args.repo
      );
      hydrateTreeCacheWithEntries(updatedTree.sha, updatedTree.entries);
      const runMutation = (expectedHeadOid: string) =>
        mutate({
          input: {
            branch: {
              branchName: args.branch,
              repositoryNameWithOwner: `${args.repo.owner}/${args.repo.name}`,
            },
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
      let result = await runMutation(args.baseCommit);
      const gqlError = result.error?.graphQLErrors[0]?.originalError;
      if (gqlError && 'type' in gqlError) {
        if (gqlError.type === 'BRANCH_PROTECTION_RULE_VIOLATION') {
          setState({
            kind: 'needs-new-branch',
            reason:
              'Changes must be made via pull request to this branch. Create a new branch to save changes.',
          });
          return result;
        }
        if (gqlError.type === 'STALE_DATA') {
          const branch = await githubRequest('GET /repos/{owner}/{repo}/branches/{branch}', {
            branch: args.branch,
            owner: args.repo.owner,
            repo: args.repo.name,
          });
          const tree = await fetchTreeData(branch.data.commit.sha, args.repo);
          const entry = tree.entries.get(args.basePath);
          if (entry?.sha === args.currentLocalTreeSha) {
            result = await runMutation(branch.data.commit.sha);
          } else {
            setState({
              kind: 'needs-new-branch',
              reason:
                'This item has been updated since it was opened. Create a new branch to save changes.',
            });
            return result;
          }
        }
      }

      if (result.error) {
        setState({ kind: 'error', error: result.error });
        return result;
      }
      const target = result.data?.createCommitOnBranch?.ref?.target;
      if (target) {
        setState({ kind: 'updated' });
        return result;
      }
      setState({ kind: 'error', error: new Error('Failed to update') });
      return result;
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
  branch: string;
  baseCommit: string;
  basePath: string;
  initialFiles: string[];
  currentTree: Map<string, TreeNode>;
  repo: { owner: string; name: string };
}) {
  const [result, mutate] = useMutation(createCommitMutation);
  return [
    result,
    async () => {
      const updatedTree = await updateTreeWithChanges(
        args.currentTree,
        { additions: [], deletions: args.initialFiles },
        args.repo
      );
      hydrateTreeCacheWithEntries(updatedTree.sha, updatedTree.entries);
      return mutate({
        input: {
          branch: {
            repositoryNameWithOwner: `${args.repo.owner}/${args.repo.name}`,
            branchName: args.branch,
          },
          message: { headline: `Delete ${args.basePath}` },
          expectedHeadOid: args.baseCommit,
          fileChanges: {
            deletions: [...args.initialFiles.map(path => ({ path }))],
          },
        },
      });
    },
  ] as const;
}

export async function toFiles(value: unknown, schema: ComponentSchema) {
  const extraFiles: { path: string; contents: Uint8Array }[] = [];
  return { value: await _toFiles(value, schema, [], extraFiles), extraFiles };
}

async function _toFiles(
  value: unknown,
  schema: ComponentSchema,
  propPath: (string | number)[],
  extraFiles: {
    path: string;
    contents: Uint8Array;
  }[]
): Promise<unknown> {
  if (schema.kind === 'child' || schema.kind === 'relationship') {
    return value;
  }
  if (schema.kind === 'form') {
    if ('serializeToFile' in schema && schema.serializeToFile) {
      if (schema.serializeToFile.kind === 'asset') {
        const suggestedFilenamePrefix = propPath.join('/');

        const { content, value: forYaml } = schema.serializeToFile.serialize(
          value,
          suggestedFilenamePrefix
        );
        if (content) {
          const path = schema.serializeToFile.filename(forYaml, suggestedFilenamePrefix);
          if (path) {
            extraFiles.push({ path, contents: content });
          }
        }
        return forYaml;
      }
      if (schema.serializeToFile.kind === 'multi') {
        const { other, primary, value: forYaml } = await schema.serializeToFile.serialize(value);
        if (primary) {
          extraFiles.push({
            path: propPath.join('/') + schema.serializeToFile.primaryExtension,
            contents: primary,
          });
        }
        for (const [key, contents] of Object.entries(other)) {
          extraFiles.push({ path: propPath.join('/') + '/' + key, contents });
        }
        return forYaml;
      }
      assertNever(schema.serializeToFile);
    }
    return value;
  }
  if (schema.kind === 'object') {
    return Object.fromEntries(
      await Promise.all(
        Object.entries(schema.fields).map(async ([key, val]) => [
          key,
          await _toFiles((value as any)[key], val, [...propPath, key], extraFiles),
        ])
      )
    );
  }
  if (schema.kind === 'array') {
    return Promise.all(
      (value as unknown[]).map((val, index) =>
        _toFiles(val, schema.element, [...propPath, index], extraFiles)
      )
    );
  }
  if (schema.kind === 'conditional') {
    return {
      discriminant: (value as any).discriminant,
      value: await _toFiles(
        (value as any).value,
        schema.values[(value as any).discriminant],
        [...propPath, 'value'],
        extraFiles
      ),
    };
  }
}
