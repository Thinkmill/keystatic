import { gql } from '@ts-gql/tag/no-transform';
import { assert } from 'emery';
import { useContext, useState } from 'react';

import { ComponentSchema, fields } from '../form/api';
import { dump } from 'js-yaml';
import { useMutation } from 'urql';
import {
  BranchInfoContext,
  hydrateTreeCacheWithEntries,
  RepoWithWriteAccessContext,
  useBaseCommit,
  useCurrentUnscopedTree,
  useSetTreeSha,
} from './shell/data';
import { FormatInfo, getEntryDataFilepath } from './path-utils';
import { TreeEntry, treeSha } from './trees';
import { Config } from '..';
import { AppSlugContext } from './onboarding/install-app';
import { serializeProps } from '../form/serialize-props';
import { useConfig } from './shell/context';
import { base64Encode } from '#base64';

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

export function serializeEntryToFiles(args: {
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
    const filename = `${args.format.contentField.path.join('/')}${
      args.format.contentField.contentExtension
    }`;
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

export function useCommit() {
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
  const config = useConfig();
  const baseCommit = useBaseCommit();
  const branchInfo = useContext(BranchInfoContext);
  const setTreeSha = useSetTreeSha();
  const [, mutate] = useMutation(createCommitMutation);
  const repoWithWriteAccess = useContext(RepoWithWriteAccessContext);
  const appSlug = useContext(AppSlugContext);
  const unscopedTreeData = useCurrentUnscopedTree();

  return [
    state,
    async (
      opts: {
        additions: { path: string; contents: Uint8Array }[];
        deletions: string[];
        commitMessage: string;
      },
      override?: { sha: string; branch: string }
    ): Promise<boolean> => {
      try {
        const unscopedTree =
          unscopedTreeData.kind === 'loaded'
            ? unscopedTreeData.data.tree
            : undefined;
        if (!unscopedTree) return false;
        if (
          repoWithWriteAccess === null &&
          config.storage.kind === 'github' &&
          appSlug?.value
        ) {
          setState({ kind: 'needs-fork' });
          return false;
        }
        setState({ kind: 'loading' });

        const deletions: { path: string }[] = [...opts.deletions].map(path => ({
          path,
        }));
        if (
          config.storage.kind === 'github' ||
          config.storage.kind === 'cloud'
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
                message: { headline: opts.commitMessage },
                fileChanges: {
                  additions: opts.additions.map(addition => ({
                    ...addition,
                    contents: base64Encode(addition.contents),
                  })),
                  deletions,
                },
              },
            });
          let result = await runMutation(override?.sha ?? baseCommit);
          // const gqlError = result.error?.graphQLErrors[0]?.originalError;
          // if (gqlError && 'type' in gqlError) {
          //   if (gqlError.type === 'BRANCH_PROTECTION_RULE_VIOLATION') {
          //     setState({
          //       kind: 'needs-new-branch',
          //       reason:
          //         'Changes must be made via pull request to this branch. Create a new branch to save changes.',
          //     });
          //     return false;
          //   }
          //   if (gqlError.type === 'STALE_DATA') {
          //     // we don't want this to go into the cache yet
          //     // so we create a new client just for this
          //     const refData = await createUrqlClient(config)
          //       .query(FetchRef, {
          //         owner: repoWithWriteAccess!.owner,
          //         name: repoWithWriteAccess!.name,
          //         ref: `refs/heads/${branchInfo.currentBranch}`,
          //       })
          //       .toPromise();
          //     if (!refData.data?.repository?.ref?.target) {
          //       throw new Error('Branch not found');
          //     }

          //     const tree = scopeEntriesWithPathPrefix(
          //       await fetchGitHubTreeData(
          //         refData.data.repository.ref.target.oid,
          //         config
          //       ),
          //       config
          //     );
          //     if (treeKey === args.currentLocalTreeKey) {
          //       result = await runMutation(
          //         refData.data.repository.ref.target.oid
          //       );
          //     } else {
          //       setState({
          //         kind: 'needs-new-branch',
          //         reason:
          //           'This entry has been updated since it was opened. Create a new branch to save changes.',
          //       });
          //       return false;
          //     }
          //   }
          // }

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
              additions: opts.additions.map(addition => ({
                ...addition,
                contents: base64Encode(addition.contents),
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

export const createCommitMutation = gql`
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

export const FetchRef = gql`
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
