import { OperationData, OperationVariables, FragmentData } from '@ts-gql/tag';
import { gql } from '@ts-gql/tag/no-transform';
import { useRouter } from '../router';
import { Config, LocalConfig } from '../../config';
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
import {
  getEntriesInCollectionWithTreeKey,
  isGitHubConfig,
  KEYSTATIC_CLOUD_API_URL,
  KEYSTATIC_CLOUD_HEADERS,
  MaybePromise,
  redirectToCloudAuth,
} from '../utils';
import LRU from 'lru-cache';
import { isDefined } from 'emery';
import { getAuth } from '../auth';
import { ViewerContext, SidebarFooter_viewer } from './sidebar-data';

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
  OperationData<typeof GitHubAppShellQuery | typeof CloudAppShellQuery>,
  OperationVariables<typeof GitHubAppShellQuery | typeof CloudAppShellQuery>
>>(null);

export function GitHubAppShellDataProvider(props: {
  config: Config;
  children: ReactNode;
}) {
  const [state] = useQuery<
    OperationData<typeof GitHubAppShellQuery | typeof CloudAppShellQuery>,
    OperationVariables<typeof GitHubAppShellQuery | typeof CloudAppShellQuery>
  >({
    query:
      props.config.storage.kind === 'github'
        ? GitHubAppShellQuery
        : CloudAppShellQuery,
    variables: {
      name:
        props.config.storage.kind === 'github'
          ? props.config.storage.repo.name
          : 'repo-name',
      owner:
        props.config.storage.kind === 'github'
          ? props.config.storage.repo.owner
          : 'repo-owner',
    },
  });
  return (
    <GitHubAppShellDataContext.Provider value={state}>
      <ViewerContext.Provider
        value={
          state.data && 'viewer' in state.data ? state.data.viewer : undefined
        }
      >
        {props.children}
      </ViewerContext.Provider>
    </GitHubAppShellDataContext.Provider>
  );
}

const writePermissions = new Set(['WRITE', 'ADMIN', 'MAINTAIN']);

export function GitHubAppShellProvider(props: {
  currentBranch: string;
  config: Config;
  children: ReactNode;
}) {
  const router = useRouter();
  const { data, error } = useContext(GitHubAppShellDataContext)!;
  let repo:
    | FragmentData<typeof Repo_ghDirect>
    | FragmentData<typeof Repo_primary>
    | FragmentData<typeof BaseRepo>
    | undefined
    | null = data?.repository;

  if (
    repo &&
    'viewerPermission' in repo &&
    repo.viewerPermission &&
    !writePermissions.has(repo.viewerPermission) &&
    'forks' in repo
  ) {
    repo = repo.forks?.nodes?.[0] ?? repo;
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
    props.config
  );
  const currentBranchTree = useGitHubTreeData(
    currentBranchTreeSha,
    props.config
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
    if (error?.response?.status === 401) {
      if (isGitHubConfig(props.config)) {
        window.location.href = `/api/keystatic/github/login?from=${router.params.join(
          '/'
        )}`;
      } else {
        redirectToCloudAuth(router.params.join('/'), props.config);
      }
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
  }, [error, router, repo?.id, props.config]);
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
      mainOwner: data?.repository?.owner.login ?? '',
      mainRepo: data?.repository?.name ?? '',
    }),
    [
      repo?.defaultBranchRef?.name,
      repo?.id,
      repo?.refs?.nodes,
      props.currentBranch,
      baseCommit,
      currentBranchRef?.associatedPullRequests.totalCount,
      data?.repository?.owner.login,
      data?.repository?.name,
    ]
  );
  return (
    <RepoWithWriteAccessContext.Provider
      value={
        repo &&
        (props.config.storage.kind === 'cloud' ||
          ('viewerPermission' in repo &&
            repo?.viewerPermission &&
            writePermissions.has(repo.viewerPermission)))
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

export const Ref_base = gql`
  fragment Ref_base on Ref {
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
` as import('../../../__generated__/ts-gql/Ref_base').type;

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
    refs(refPrefix: "refs/heads/", first: 100) {
      nodes {
        ...Ref_base
      }
    }
  }
  ${Ref_base}
` as import('../../../__generated__/ts-gql/Repo_base').type;

export const CloudAppShellQuery = gql`
  query CloudAppShell($name: String!, $owner: String!) {
    repository(owner: $owner, name: $name) {
      id
      ...Repo_base
    }
  }
  ${BaseRepo}
` as import('../../../__generated__/ts-gql/CloudAppShell').type;

const Repo_ghDirect = gql`
  fragment Repo_ghDirect on Repository {
    id
    ...Repo_base
    viewerPermission
  }
  ${BaseRepo}
` as import('../../../__generated__/ts-gql/Repo_ghDirect').type;

const Repo_primary = gql`
  fragment Repo_primary on Repository {
    id
    ...Repo_ghDirect
    forks(affiliations: [OWNER], first: 1) {
      nodes {
        ...Repo_ghDirect
      }
    }
  }
  ${Repo_ghDirect}
` as import('../../../__generated__/ts-gql/Repo_primary').type;

export const GitHubAppShellQuery = gql`
  query GitHubAppShell($name: String!, $owner: String!) {
    repository(owner: $owner, name: $name) {
      id
      ...Repo_primary
    }
    viewer {
      ...SidebarFooter_viewer
    }
  }
  ${Repo_primary}
  ${SidebarFooter_viewer}
` as import('../../../__generated__/ts-gql/GitHubAppShell').type;

export type AppShellData = OperationData<typeof GitHubAppShellQuery>;

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

export function fetchGitHubTreeData(sha: string, config: Config) {
  const cached = treeCache.get(sha);
  if (cached) return cached;
  const promise = getAuth(config)
    .then(auth => {
      if (!auth) throw new Error('Not authorized');
      return fetch(
        config.storage.kind === 'github'
          ? `https://api.github.com/repos/${config.storage.repo.owner}/${config.storage.repo.name}/git/trees/${sha}?recursive=1`
          : `${KEYSTATIC_CLOUD_API_URL}/v1/github/trees/${sha}`,
        {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
            ...(config.storage.kind === 'cloud' ? KEYSTATIC_CLOUD_HEADERS : {}),
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

function useGitHubTreeData(sha: string | null, config: Config) {
  return useData(
    useCallback(
      () => (sha ? fetchGitHubTreeData(sha, config) : LOADING),
      [sha, config]
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
  mainOwner: string;
  mainRepo: string;
}>({
  currentBranch: '',
  allBranches: [],
  defaultBranch: '',
  hasPullRequests: false,
  branchNameToId: new Map(),
  branchNameToBaseCommit: new Map(),
  mainOwner: '',
  mainRepo: '',
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
