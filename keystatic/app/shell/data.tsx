import { OperationData, OperationVariables } from '@ts-gql/tag';
import { gql } from '@ts-gql/tag/no-transform';
import { isDefined } from 'emery';
import { useRouter } from 'next/router';
import { Config } from '../../config';
import { useMemo, useEffect, createContext, useContext, useCallback, ReactNode } from 'react';
import { useQuery, UseQueryResponse } from 'urql';
import { githubRequest } from '../../github-api';
import {
  getCollectionPath,
  getCollectionFormat,
  getDataFileExtension,
  getSingletonPath,
} from '../path-utils';
import { getTreeNodeAtPath, treeEntriesToTreeNodes, TreeEntry, TreeNode } from '../trees';
import { DataState, LOADING, mergeDataStates, useData } from '../useData';
import { getTreeNodeForItem, MaybePromise } from '../utils';
import LRU from 'lru-cache';

export function useAppShellData(props: { currentBranch: string; config: Config }) {
  const router = useRouter();
  const queryData = useQuery({
    query: AppShellQuery,
    variables: {
      branch: props.currentBranch,
      name: props.config.repo.name,
      owner: props.config.repo.owner,
    },
  });
  const [{ data, error }] = queryData;
  const defaultBranchRef = data?.repository?.refs?.nodes?.find(
    (x): x is typeof x & { target: { __typename: 'Commit' } } =>
      x?.name === data?.repository?.defaultBranchRef?.name
  );
  const currentBranchRef = data?.repository?.refs?.nodes?.find(
    (x): x is typeof x & { target: { __typename: 'Commit' } } => x?.name === props.currentBranch
  );
  const defaultBranchTreeSha = defaultBranchRef?.target.tree.oid ?? null;
  const currentBranchTreeSha = currentBranchRef?.target.tree.oid ?? null;
  const baseCommit = currentBranchRef?.target?.oid ?? null;

  const defaultBranchTree = useTreeData(defaultBranchTreeSha, props.config.repo);
  const currentBranchTree = useTreeData(currentBranchTreeSha, props.config.repo);

  const allTreeData = useMemo(
    () => ({
      default: defaultBranchTree,
      current: currentBranchTree,
      merged: mergeDataStates({ default: defaultBranchTree, current: currentBranchTree }),
    }),
    [currentBranchTree, defaultBranchTree]
  );
  const changedData = useMemo(() => {
    if (allTreeData.merged.kind !== 'loaded') {
      return {
        collections: new Map<
          string,
          { removed: Set<string>; added: Set<string>; changed: Set<string>; totalCount: number }
        >(),
        singletons: new Set<string>(),
      };
    }
    const trees = allTreeData.merged.data;

    return {
      collections: new Map(
        Object.keys(props.config.collections ?? {}).map(collection => {
          const collectionPath = getCollectionPath(props.config, collection);
          const current = new Map(getTreeNodeAtPath(trees.current.tree, collectionPath)?.children);
          const defaultBranch = new Map(
            getTreeNodeAtPath(trees.default.tree, collectionPath)?.children
          );

          const formatInfo = getCollectionFormat(props.config, collection);
          const extension = getDataFileExtension(formatInfo);
          for (const map of [current, defaultBranch]) {
            for (const [key, entry] of map) {
              const node = getTreeNodeForItem(props.config, collection, entry);
              if (!node || !node.children?.has(`index${extension}`)) {
                map.delete(key);
              } else {
                map.set(key, node);
              }
            }
          }

          const changed = new Set<string>();
          const added = new Set<string>();
          for (const [key, entry] of current) {
            const defaultBranchEntry = defaultBranch.get(key);
            if (defaultBranchEntry === undefined) {
              added.add(key);
              continue;
            }
            if (entry.entry.sha !== defaultBranchEntry.entry.sha) {
              changed.add(key);
            }
          }
          const removed = new Set([...defaultBranch.keys()].filter(key => !current.has(key)));
          return [collection, { removed, added, changed, totalCount: current.size }];
        })
      ),
      singletons: new Set(
        Object.keys(props.config.singletons ?? {}).filter(singleton => {
          const singletonPath = getSingletonPath(props.config, singleton);
          return (
            getTreeNodeAtPath(trees.current.tree, singletonPath)?.entry.sha !==
            getTreeNodeAtPath(trees.default.tree, singletonPath)?.entry.sha
          );
        })
      ),
    };
  }, [allTreeData, props.config]);

  useEffect(() => {
    if (error?.response.status === 401) {
      window.location.href = `/api/keystatic/github/login?from=${(
        router.query.rest as string[]
      ).join('/')}`;
    }
    if (
      !data?.repository?.id &&
      error?.graphQLErrors.some(err => (err?.originalError as any)?.type === 'NOT_FOUND')
    ) {
      router.push('/keystatic/repo-not-found');
    }
  }, [error, data, router]);
  return {
    changedData,
    baseCommit,
    currentBranchRef,
    defaultBranchRef,
    viewer: data?.viewer,
    error,
    allBranches: data?.repository?.refs?.nodes?.map(x => x?.name).filter(isDefined) ?? [],
    repositoryId: data?.repository?.id,
    providers: (children: ReactNode) => (
      <BaseCommitContext.Provider value={baseCommit ?? ''}>
        <ChangedContext.Provider value={changedData}>
          <TreeContext.Provider value={allTreeData}>
            <AppShellQueryContext.Provider value={queryData}>
              {children}
            </AppShellQueryContext.Provider>
          </TreeContext.Provider>
        </ChangedContext.Provider>
      </BaseCommitContext.Provider>
    ),
  };
}

const BaseCommitContext = createContext('');

const ChangedContext = createContext<{
  collections: Map<
    string,
    {
      added: Set<string>;
      removed: Set<string>;
      changed: Set<string>;
    }
  >;
  singletons: Set<string>;
}>({ collections: new Map(), singletons: new Set() });

type Filepath = string;

export type TreeData = {
  entries: Map<Filepath, TreeEntry>;
  tree: Map<string, TreeNode>;
};

type AllTreeData = {
  current: DataState<TreeData>;
  default: DataState<TreeData>;
  merged: DataState<{
    current: TreeData;
    default: TreeData;
  }>;
};

const TreeContext = createContext<AllTreeData>({
  current: { kind: 'loading' },
  default: { kind: 'loading' },
  merged: { kind: 'loading' },
});

export function useTree() {
  return useContext(TreeContext);
}

export function useChanged() {
  return useContext(ChangedContext);
}

export function useBaseCommit() {
  return useContext(BaseCommitContext);
}

const AppShellQueryContext = createContext<null | UseQueryResponse<
  OperationData<typeof AppShellQuery>,
  OperationVariables<typeof AppShellQuery>
>>(null);

export function useAppShellQuery() {
  const value = useContext(AppShellQueryContext);
  if (!value) {
    throw new Error('AppShellQueryContext not set');
  }
  return value;
}

const AppShellQuery = gql`
  query AppShell($name: String!, $owner: String!) {
    viewer {
      id
      name
      login
      avatarUrl
    }
    repository(owner: $owner, name: $name) {
      id
      defaultBranchRef {
        id
        name
      }
      refs(refPrefix: "refs/heads/", first: 100) {
        nodes {
          id
          name
          target {
            __typename
            id
            oid
            ... on Commit {
              tree {
                id
                oid
              }
            }
          }
          associatedPullRequests(first: 1, states: [OPEN]) {
            nodes {
              id
              number
            }
          }
        }
      }
    }
  }
` as import('../../__generated__/ts-gql/AppShell').type;

export type AppShellData = OperationData<typeof AppShellQuery>;

const treeCache = new LRU<
  string,
  MaybePromise<{ entries: Map<Filepath, TreeEntry>; tree: Map<string, TreeNode> }>
>({
  max: 40,
});

export function hydrateTreeCacheWithEntries(sha: string, entries: TreeEntry[]) {
  const data = {
    entries: new Map(entries.map(entry => [entry.path, entry])),
    tree: treeEntriesToTreeNodes(entries),
  };
  treeCache.set(sha, data);
  return data;
}

export function fetchTreeData(sha: string, repo: { owner: string; name: string }) {
  const cached = treeCache.get(sha);
  if (cached) return cached;
  const promise = githubRequest('GET /repos/{owner}/{repo}/git/trees/{tree_sha}', {
    owner: repo.owner,
    repo: repo.name,
    tree_sha: sha,
    recursive: '1',
  }).then(res =>
    hydrateTreeCacheWithEntries(
      sha,
      res.data.tree.map(({ url, ...rest }) => rest as TreeEntry)
    )
  );
  treeCache.set(sha, promise);
  return promise;
}

function useTreeData(sha: string | null, repo: { owner: string; name: string }) {
  return useData(useCallback(() => (sha ? fetchTreeData(sha, repo) : LOADING), [sha, repo]));
}
