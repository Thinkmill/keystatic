import { OperationData, OperationVariables, FragmentData } from '@ts-gql/tag';
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
import { CombinedError, useQuery, UseQueryState } from 'urql';
import { getSingletonPath } from '../path-utils';
import {
  getTreeNodeAtPath,
  treeEntriesToTreeNodes,
  TreeEntry,
  TreeNode,
  treeSha,
} from '../trees';
import { DataState, LOADING, mergeDataStates, useData } from '../useData';
import { getEntriesInCollectionWithTreeKey, MaybePromise } from '../utils';
import LRU from 'lru-cache';
import { isDefined } from 'emery';
import { getAuth } from '../auth';
import { SidebarFooter_viewer, ViewerContext } from './sidebar';

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

export const GitHubAppShellDataContext = createContext<null | UseQueryState<
  OperationData<typeof AppShellQuery>,
  OperationVariables<typeof AppShellQuery>
>>(null);

export function GitHubAppShellDataProvider(props: {
  config: GitHubConfig;
  children: ReactNode;
}) {
  const [state] = useQuery({
    query: AppShellQuery,
    variables: {
      name: props.config.storage.repo.name,
      owner: props.config.storage.repo.owner,
    },
  });
  return (
    <GitHubAppShellDataContext.Provider value={state}>
      <ViewerContext.Provider value={state.data?.viewer}>
        {props.children}
      </ViewerContext.Provider>
    </GitHubAppShellDataContext.Provider>
  );
}

const writePermissions = new Set(['WRITE', 'ADMIN', 'MAINTAIN']);

export function GitHubAppShellProvider(props: {
  currentBranch: string;
  config: GitHubConfig;
  children: ReactNode;
}) {
  const router = useRouter();
  const { data, error } = useContext(GitHubAppShellDataContext)!;
  let repo: FragmentData<typeof BaseRepo> | undefined | null = data?.repository;

  if (repo?.viewerPermission && !writePermissions.has(repo?.viewerPermission)) {
    repo = data?.repository?.forks.nodes?.[0] ?? repo;
  }

  const defaultBranchRef = repo?.refs?.nodes?.find(
    (x): x is typeof x & { target: { __typename: 'Commit' } } =>
      x?.name === repo?.defaultBranchRef?.name
  );

  const currentBranchRef = repo?.refs?.nodes?.find(
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
      !repo?.id &&
      error?.graphQLErrors.some(
        err =>
          (err?.originalError as any)?.type === 'NOT_FOUND' ||
          (err?.originalError as any)?.type === 'FORBIDDEN'
      )
    ) {
      window.location.href = `/api/keystatic/github/repo-not-found?from=${router.params.join(
        '/'
      )}`;
    }
  }, [error, router, repo?.id]);
  const baseInfo = useMemo(
    () => ({
      baseCommit: baseCommit || '',
      repositoryId: repo?.id ?? '',
    }),
    [baseCommit, repo?.id]
  );
  const branchInfo = useMemo(
    () => ({
      defaultBranch: repo?.defaultBranchRef?.name ?? '',
      currentBranch: props.currentBranch,
      baseCommit: baseCommit || '',
      repositoryId: repo?.id ?? '',
      allBranches: repo?.refs?.nodes?.map(x => x?.name).filter(isDefined) ?? [],
      hasPullRequests: !!currentBranchRef?.associatedPullRequests.totalCount,
      branchNameToId: new Map(
        repo?.refs?.nodes?.filter(isDefined).map(x => [x.name, x.id])
      ),
      branchNameToBaseCommit: new Map(
        repo?.refs?.nodes?.flatMap(x =>
          x?.target ? [[x.name, x.target.oid]] : []
        )
      ),
    }),
    [
      repo?.defaultBranchRef?.name,
      repo?.id,
      repo?.refs?.nodes,
      props.currentBranch,
      baseCommit,
      currentBranchRef?.associatedPullRequests.totalCount,
    ]
  );
  return (
    <RepoWithWriteAccessContext.Provider
      value={
        repo?.viewerPermission && writePermissions.has(repo.viewerPermission)
          ? { name: repo.name, owner: repo.owner.login }
          : null
      }
    >
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
    </RepoWithWriteAccessContext.Provider>
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
      totalCount: number;
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

const BaseRepo = gql`
  fragment Repo_base on Repository {
    id
    owner {
      id
      login
    }
    name
    defaultBranchRef {
      id
      name
    }
    viewerPermission
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
` as import('../../__generated__/ts-gql/Repo_base').type;

export const AppShellQuery = gql`
  query AppShell($name: String!, $owner: String!) {
    repository(owner: $owner, name: $name) {
      id
      ...Repo_base
      forks(affiliations: [OWNER], first: 1) {
        nodes {
          ...Repo_base
        }
      }
    }
    viewer {
      ...SidebarFooter_viewer
    }
  }
  ${BaseRepo}
  ${SidebarFooter_viewer}
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
        { headers: { Authorization: `Bearer ${auth.accessToken}` } }
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

export const RepoWithWriteAccessContext = createContext<{
  owner: string;
  name: string;
} | null>(null);

export const BranchInfoContext = createContext<{
  currentBranch: string;
  allBranches: string[];
  branchNameToId: Map<string, string>;
  defaultBranch: string;
  hasPullRequests: boolean;
  branchNameToBaseCommit: Map<string, string>;
}>({
  currentBranch: '',
  allBranches: [],
  defaultBranch: '',
  hasPullRequests: false,
  branchNameToId: new Map(),
  branchNameToBaseCommit: new Map(),
});
export function useBranchInfo() {
  return useContext(BranchInfoContext);
}

function getChangedData(
  config: Config,
  trees: { current: TreeData; default: TreeData }
) {
  return {
    collections: new Map(
      Object.keys(config.collections ?? {}).map(collection => {
        const currentBranch = new Map(
          getEntriesInCollectionWithTreeKey(
            config,
            collection,
            trees.current.tree
          ).map(x => [x.slug, x.key])
        );
        const defaultBranch = new Map(
          getEntriesInCollectionWithTreeKey(
            config,
            collection,
            trees.default.tree
          ).map(x => [x.slug, x.key])
        );

        const changed = new Set<string>();
        const added = new Set<string>();
        for (const [key, entry] of currentBranch) {
          const defaultBranchEntry = defaultBranch.get(key);
          if (defaultBranchEntry === undefined) {
            added.add(key);
            continue;
          }
          if (entry !== defaultBranchEntry) {
            changed.add(key);
          }
        }
        const removed = new Set(
          [...defaultBranch.keys()].filter(key => !currentBranch.has(key))
        );
        return [
          collection,
          { removed, added, changed, totalCount: currentBranch.size },
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
