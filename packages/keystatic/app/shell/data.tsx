import { OperationData } from '@ts-gql/tag';
import { gql } from '@ts-gql/tag/no-transform';
import { useRouter } from '../router';
import { Config, GitHubConfig, LocalConfig } from '../../config';
import {
  useMemo,
  useEffect,
  createContext,
  useContext,
  useCallback,
  ReactNode,
  useState,
} from 'react';
import { CombinedError, useQuery } from 'urql';
import {
  getCollectionPath,
  getCollectionFormat,
  getDataFileExtension,
  getSingletonPath,
} from '../path-utils';
import {
  getTreeNodeAtPath,
  treeEntriesToTreeNodes,
  TreeEntry,
  TreeNode,
  treeSha,
} from '../trees';
import { DataState, LOADING, mergeDataStates, useData } from '../useData';
import { getTreeNodeForItem, MaybePromise } from '../utils';
import LRU from 'lru-cache';
import { isDefined } from 'emery';
import { getAuth } from '../auth';

export function fetchLocalTree(sha: string) {
  if (treeCache.has(sha)) {
    return treeCache.get(sha)!;
  }
  const promise = fetch('/api/keystatic/tree', { headers: { 'no-cors': '1' } })
    .then(x => x.json())
    .then(async (entries: TreeEntry[]) => hydrateTreeCacheWithEntries(entries));
  treeCache.set(sha, promise);
  return promise;
}

export function useSetTreeSha() {
  return useContext(SetTreeShaContext);
}

export const SetTreeShaContext = createContext<(sha: string) => void>(() => {
  throw new Error('SetTreeShaContext not set');
});

export function LocalAppShellProvider(props: {
  config: LocalConfig;
  children: ReactNode;
}) {
  const [currentTreeSha, setCurrentTreeSha] = useState<string>('initial');

  const tree = useData(
    useCallback(() => fetchLocalTree(currentTreeSha), [currentTreeSha])
  );

  const allTreeData = useMemo(
    () => ({
      default: tree,
      current: tree,
      merged: mergeDataStates({ default: tree, current: tree }),
    }),
    [tree]
  );
  const changedData = useMemo(() => {
    if (allTreeData.merged.kind !== 'loaded') {
      return {
        collections: new Map<
          string,
          {
            removed: Set<string>;
            added: Set<string>;
            changed: Set<string>;
            totalCount: number;
          }
        >(),
        singletons: new Set<string>(),
      };
    }
    return getChangedData(props.config, allTreeData.merged.data);
  }, [allTreeData, props.config]);

  return (
    <SetTreeShaContext.Provider value={setCurrentTreeSha}>
      <ChangedContext.Provider value={changedData}>
        <TreeContext.Provider value={allTreeData}>
          {props.children}
        </TreeContext.Provider>
      </ChangedContext.Provider>
    </SetTreeShaContext.Provider>
  );
}

export function GitHubAppShellProvider(props: {
  currentBranch: string;
  config: GitHubConfig;
  children: ReactNode;
}) {
  const router = useRouter();
  const [{ data, error }] = useQuery({
    query: AppShellQuery,
    variables: {
      name: props.config.storage.repo.name,
      owner: props.config.storage.repo.owner,
    },
  });
  const defaultBranchRef = data?.repository?.refs?.nodes?.find(
    (x): x is typeof x & { target: { __typename: 'Commit' } } =>
      x?.name === data?.repository?.defaultBranchRef?.name
  );
  const currentBranchRef = data?.repository?.refs?.nodes?.find(
    (x): x is typeof x & { target: { __typename: 'Commit' } } =>
      x?.name === props.currentBranch
  );
  const defaultBranchTreeSha = defaultBranchRef?.target.tree.oid ?? null;
  const currentBranchTreeSha = currentBranchRef?.target.tree.oid ?? null;
  const baseCommit = currentBranchRef?.target?.oid ?? null;

  const defaultBranchTree = useGitHubTreeData(
    defaultBranchTreeSha,
    props.config.storage.repo
  );
  const currentBranchTree = useGitHubTreeData(
    currentBranchTreeSha,
    props.config.storage.repo
  );

  const allTreeData = useMemo(
    () => ({
      default: defaultBranchTree,
      current: currentBranchTree,
      merged: mergeDataStates({
        default: defaultBranchTree,
        current: currentBranchTree,
      }),
    }),
    [currentBranchTree, defaultBranchTree]
  );
  const changedData = useMemo(() => {
    if (allTreeData.merged.kind !== 'loaded') {
      return {
        collections: new Map<
          string,
          {
            removed: Set<string>;
            added: Set<string>;
            changed: Set<string>;
            totalCount: number;
          }
        >(),
        singletons: new Set<string>(),
      };
    }
    return getChangedData(props.config, allTreeData.merged.data);
  }, [allTreeData, props.config]);

  useEffect(() => {
    if (error?.response.status === 401) {
      window.location.href = `/api/keystatic/github/login?from=${router.params.join(
        '/'
      )}`;
    }
    if (
      !data?.repository?.id &&
      error?.graphQLErrors.some(
        err => (err?.originalError as any)?.type === 'NOT_FOUND'
      )
    ) {
      window.location.href = `/api/keystatic/github/repo-not-found?from=${router.params.join(
        '/'
      )}`;
    }
  }, [error, data, router]);
  const baseInfo = useMemo(
    () => ({
      baseCommit: baseCommit || '',
      repositoryId: data?.repository?.id ?? '',
    }),
    [baseCommit, data?.repository?.id]
  );
  const branchInfo = useMemo(
    () => ({
      defaultBranch: data?.repository?.defaultBranchRef?.name ?? '',
      currentBranch: props.currentBranch,
      baseCommit: baseCommit || '',
      repositoryId: data?.repository?.id ?? '',
      allBranches:
        data?.repository?.refs?.nodes?.map(x => x?.name).filter(isDefined) ??
        [],
      hasPullRequests: !!currentBranchRef?.associatedPullRequests.totalCount,
      branchNameToId: new Map(
        data?.repository?.refs?.nodes
          ?.filter(isDefined)
          .map(x => [x.name, x.id])
      ),
    }),
    [
      data?.repository?.defaultBranchRef?.name,
      data?.repository?.id,
      data?.repository?.refs?.nodes,
      props.currentBranch,
      baseCommit,
      currentBranchRef?.associatedPullRequests.totalCount,
    ]
  );
  return (
    <AppShellErrorContext.Provider value={error}>
      <BranchInfoContext.Provider value={branchInfo}>
        <BaseInfoContext.Provider value={baseInfo}>
          <ChangedContext.Provider value={changedData}>
            <TreeContext.Provider value={allTreeData}>
              {props.children}
            </TreeContext.Provider>
          </ChangedContext.Provider>
        </BaseInfoContext.Provider>
      </BranchInfoContext.Provider>
    </AppShellErrorContext.Provider>
  );
}

export const AppShellErrorContext = createContext<CombinedError | undefined>(
  undefined
);

const BaseInfoContext = createContext({ baseCommit: '', repositoryId: '' });

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
  return useContext(BaseInfoContext).baseCommit;
}

export function useRepositoryId() {
  return useContext(BaseInfoContext).repositoryId;
}

export const AppShellQuery = gql`
  query AppShell($name: String!, $owner: String!) {
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
          associatedPullRequests(states: [OPEN]) {
            totalCount
          }
        }
      }
    }
  }
` as import('../../__generated__/ts-gql/AppShell').type;

export type AppShellData = OperationData<typeof AppShellQuery>;

const treeCache = new LRU<
  string,
  MaybePromise<{
    entries: Map<Filepath, TreeEntry>;
    tree: Map<string, TreeNode>;
  }>
>({
  max: 40,
});

export async function hydrateTreeCacheWithEntries(entries: TreeEntry[]) {
  const data = {
    entries: new Map(entries.map(entry => [entry.path, entry])),
    tree: treeEntriesToTreeNodes(entries),
  };
  const sha = await treeSha(data.tree);
  treeCache.set(sha, data);
  return data;
}

export function fetchGitHubTreeData(
  sha: string,
  repo: { owner: string; name: string }
) {
  const cached = treeCache.get(sha);
  if (cached) return cached;
  const promise = getAuth()
    .then(auth => {
      if (!auth) throw new Error('Not authorized');
      return fetch(
        `https://api.github.com/repos/${repo.owner}/${repo.name}/git/trees/${sha}?recursive=1`,
        {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
        }
      ).then(x => x.json());
    })
    .then((res: { tree: (TreeEntry & { url: string })[] }) =>
      hydrateTreeCacheWithEntries(
        res.tree.map(({ url, ...rest }) => rest as TreeEntry)
      )
    );
  treeCache.set(sha, promise);
  return promise;
}

function useGitHubTreeData(
  sha: string | null,
  repo: { owner: string; name: string }
) {
  return useData(
    useCallback(
      () => (sha ? fetchGitHubTreeData(sha, repo) : LOADING),
      [sha, repo]
    )
  );
}

export const BranchInfoContext = createContext<{
  currentBranch: string;
  allBranches: string[];
  branchNameToId: Map<string, string>;
  defaultBranch: string;
  hasPullRequests: boolean;
}>({
  currentBranch: '',
  allBranches: [],
  defaultBranch: '',
  hasPullRequests: false,
  branchNameToId: new Map(),
});

function getChangedData(
  config: Config,
  trees: { current: TreeData; default: TreeData }
) {
  return {
    collections: new Map(
      Object.keys(config.collections ?? {}).map(collection => {
        const collectionPath = getCollectionPath(config, collection);
        const current = new Map(
          getTreeNodeAtPath(trees.current.tree, collectionPath)?.children
        );
        const defaultBranch = new Map(
          getTreeNodeAtPath(trees.default.tree, collectionPath)?.children
        );

        const formatInfo = getCollectionFormat(config, collection);
        const extension = getDataFileExtension(formatInfo);
        for (const map of [current, defaultBranch]) {
          for (const [key, entry] of map) {
            const node = getTreeNodeForItem(config, collection, entry);
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
        const removed = new Set(
          [...defaultBranch.keys()].filter(key => !current.has(key))
        );
        return [
          collection,
          { removed, added, changed, totalCount: current.size },
        ];
      })
    ),
    singletons: new Set(
      Object.keys(config.singletons ?? {}).filter(singleton => {
        const singletonPath = getSingletonPath(config, singleton);
        return (
          getTreeNodeAtPath(trees.current.tree, singletonPath)?.entry.sha !==
          getTreeNodeAtPath(trees.default.tree, singletonPath)?.entry.sha
        );
      })
    ),
  };
}
