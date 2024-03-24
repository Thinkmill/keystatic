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
  treeToEntries,
} from '../trees';
import {
  DataState,
  LOADING,
  mapDataState,
  mergeDataStates,
  useData,
} from '../useData';
import {
  getEntriesInCollectionWithTreeKey,
  isGitHubConfig,
  KEYSTATIC_CLOUD_API_URL,
  KEYSTATIC_CLOUD_HEADERS,
  MaybePromise,
  redirectToCloudAuth,
} from '../utils';
import { LRUCache as LRU } from 'lru-cache';
import { isDefined } from 'emery';
import { getAuth, getCloudAuth } from '../auth';
import { ViewerContext, SidebarFooter_viewer } from './viewer-data';
import { parseRepoConfig, serializeRepoConfig } from '../repo-config';
import * as s from 'superstruct';
import { scopeEntriesWithPathPrefix } from './path-prefix';
import {
  garbageCollectGitObjects,
  getTreeFromPersistedCache,
  setTreeToPersistedCache,
  useExtraRoots,
} from '../object-store';
import { CollabProvider } from './collab';

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

  const localTree = useLocalTreeData('');
  const tree = useData(
    useCallback(() => fetchLocalTree(currentTreeSha), [currentTreeSha])
  );

  const allTreeData = useMemo((): AllTreeData => {
    const mappedLocal = mapDataState(localTree, tree =>
      tree
        ? {
            tree: tree.children!,
            entries: new Map(
              treeToEntries(tree.children!).map(x => [x.path, x])
            ),
          }
        : undefined
    );
    const trees = {
      current:
        mappedLocal.kind === 'loaded' && !mappedLocal.data
          ? tree
          : (mappedLocal as DataState<{
              tree: Map<string, TreeNode>;
              entries: Map<string, TreeEntry>;
            }>),
      committed: tree,
    };

    return {
      unscoped: trees,
      scoped: {
        ...trees,
        merged: mergeDataStates({
          current:
            mappedLocal.kind === 'loaded' && !mappedLocal.data
              ? tree
              : (mappedLocal as DataState<{
                  tree: Map<string, TreeNode>;
                  entries: Map<string, TreeEntry>;
                }>),
          committed: tree,
        }),
      },
    };
  }, [localTree, tree]);
  const changedData = useMemo(() => {
    if (allTreeData.scoped.merged.kind !== 'loaded') {
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
    return getChangedData(props.config, allTreeData.scoped.merged.data);
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

const cloudInfoSchema = s.type({
  user: s.type({
    id: s.string(),
    name: s.string(),
    email: s.string(),
    avatarUrl: s.optional(s.string()),
  }),
  project: s.type({
    name: s.string(),
  }),
  team: s.object({
    name: s.string(),
    slug: s.string(),
    images: s.boolean(),
    multiplayer: s.boolean(),
  }),
});

const CloudInfo = createContext<
  null | s.Infer<typeof cloudInfoSchema> | 'unauthorized'
>(null);

export function useCloudInfo() {
  const context = useContext(CloudInfo);
  return context === 'unauthorized' ? null : context;
}

export function useRawCloudInfo() {
  return useContext(CloudInfo);
}

export function CloudInfoProvider(props: {
  children: ReactNode;
  config: Config;
}) {
  const data = useData(
    useCallback(async () => {
      if (!props.config.cloud?.project) throw new Error('no cloud project set');
      const token = getCloudAuth(props.config)?.accessToken;
      if (!token) {
        return 'unauthorized' as const;
      }
      const res = await fetch(`${KEYSTATIC_CLOUD_API_URL}/v1/info`, {
        headers: {
          ...KEYSTATIC_CLOUD_HEADERS,
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 401) return 'unauthorized' as const;
      return cloudInfoSchema.create(await res.json());
    }, [props.config])
  );
  return (
    <CloudInfo.Provider value={data.kind === 'loaded' ? data.data : null}>
      {props.children}
    </CloudInfo.Provider>
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
  const repo =
    props.config.storage.kind === 'github'
      ? parseRepoConfig(props.config.storage.repo)
      : { name: 'repo-name', owner: 'repo-owner' };
  const [state] = useQuery<
    OperationData<typeof GitHubAppShellQuery | typeof CloudAppShellQuery>,
    OperationVariables<typeof GitHubAppShellQuery | typeof CloudAppShellQuery>
  >({
    query:
      props.config.storage.kind === 'github'
        ? GitHubAppShellQuery
        : CloudAppShellQuery,
    variables: repo,
  });

  const [cursorState, setCursorState] = useState<string | null>(null);

  const [moreRefsState] = useQuery({
    query: gql`
      query FetchMoreRefs($owner: String!, $name: String!, $after: String) {
        repository(owner: $owner, name: $name) {
          __typename
          id
          refs(refPrefix: "refs/heads/", first: 100, after: $after) {
            __typename
            nodes {
              ...Ref_base
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      }
      ${Ref_base}
    ` as import('../../../__generated__/ts-gql/FetchMoreRefs').type,
    pause: !state.data?.repository?.refs?.pageInfo.hasNextPage,
    variables: {
      ...repo,
      after: cursorState ?? state.data?.repository?.refs?.pageInfo.endCursor,
    },
  });

  const pageInfo = moreRefsState.data?.repository?.refs?.pageInfo;
  if (
    pageInfo?.hasNextPage &&
    pageInfo.endCursor !== cursorState &&
    pageInfo.endCursor
  ) {
    setCursorState(pageInfo.endCursor);
  }

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

function useLocalTreeData(branch: string | undefined) {
  const { roots } = useExtraRoots();
  const sha = branch !== undefined ? roots.get(branch)?.sha : undefined;
  return useData(
    useCallback(() => {
      if (!sha) return undefined;
      return getTreeFromPersistedCache(sha);
    }, [sha])
  );
}

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

  const currentBranchRef = repo?.refs?.nodes?.find(
    (x): x is typeof x & { target: { __typename: 'Commit' } } =>
      x?.name === props.currentBranch
  );

  useEffect(() => {
    if (repo?.refs?.nodes) {
      garbageCollectGitObjects(
        props.config,
        repo.refs.nodes
          .map(x =>
            x?.target?.__typename === 'Commit' ? x.target.tree.oid : undefined
          )
          .filter(isDefined)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repo?.id, props.config]);

  const currentBranchTreeSha = currentBranchRef?.target.tree.oid ?? null;
  const baseCommit = currentBranchRef?.target?.oid ?? null;

  const localTree = useLocalTreeData(props.currentBranch);
  const currentBranchTree = useGitHubTreeData(
    currentBranchTreeSha,
    props.config
  );

  const allTreeData = useMemo((): AllTreeData => {
    const scopedCommitted = mapDataState(currentBranchTree, tree =>
      scopeEntriesWithPathPrefix(tree, props.config)
    );
    const _unscopedCurrent = mapDataState(localTree, tree =>
      tree
        ? {
            tree: tree.children!,
            entries: new Map(
              treeToEntries(tree.children!).map(x => [x.path, x])
            ),
          }
        : undefined
    );
    const _scopedCurrent = mapDataState(_unscopedCurrent, tree =>
      tree ? scopeEntriesWithPathPrefix(tree, props.config) : undefined
    );
    const scopedCurrent =
      _scopedCurrent.kind === 'loaded' && !_scopedCurrent.data
        ? scopedCommitted
        : (_scopedCurrent as DataState<{
            entries: Map<string, TreeEntry>;
            tree: Map<string, TreeNode>;
          }>);
    const unscopedCurrent =
      _unscopedCurrent.kind === 'loaded' && !_unscopedCurrent.data
        ? currentBranchTree
        : (_unscopedCurrent as DataState<{
            entries: Map<string, TreeEntry>;
            tree: Map<string, TreeNode>;
          }>);
    return {
      unscoped: {
        current: unscopedCurrent,
        committed: currentBranchTree,
      },
      scoped: {
        committed: scopedCommitted,
        current: scopedCurrent,
        merged: mergeDataStates({
          committed: scopedCommitted,
          current: scopedCurrent,
        }),
      },
    };
  }, [currentBranchTree, localTree, props.config]);
  const changedData = useMemo(() => {
    if (allTreeData.scoped.merged.kind !== 'loaded') {
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
    return getChangedData(props.config, allTreeData.scoped.merged.data);
  }, [allTreeData, props.config]);

  useEffect(() => {
    if (error?.response?.status === 401) {
      if (isGitHubConfig(props.config)) {
        window.location.href = `/api/keystatic/github/login?from=${router.params
          .map(encodeURIComponent)
          .join('/')}`;
      } else {
        redirectToCloudAuth(
          router.params.map(encodeURIComponent).join('/'),
          props.config
        );
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
      window.location.href = `/api/keystatic/github/repo-not-found?from=${router.params
        .map(encodeURIComponent)
        .join('/')}`;
    }
  }, [error, router, repo?.id, props.config]);
  const baseInfo = useMemo(
    () => ({
      baseCommit: baseCommit || '',
      repositoryId: repo?.id ?? '',
      isPrivate: repo?.isPrivate ?? true,
    }),
    [baseCommit, repo?.id, repo?.isPrivate]
  );
  const branchInfo = useMemo(
    () => ({
      defaultBranch: repo?.defaultBranchRef?.name ?? '',
      currentBranch: props.currentBranch,
      baseCommit: baseCommit || '',
      repositoryId: repo?.id ?? '',
      allBranches: repo?.refs?.nodes?.map(x => x?.name).filter(isDefined) ?? [],
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
      hasLoadedAllBranches: repo?.refs?.pageInfo.hasNextPage === false,
    }),
    [data?.repository, repo, props.currentBranch, baseCommit]
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
                {props.config.storage.kind === 'cloud' ? (
                  <CollabProvider config={props.config}>
                    {props.children}
                  </CollabProvider>
                ) : (
                  props.children
                )}
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

const BaseInfoContext = createContext({
  baseCommit: '',
  repositoryId: '',
  isPrivate: true,
});

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
  unscoped: {
    current: DataState<TreeData>;
    committed: DataState<TreeData>;
  };
  scoped: {
    current: DataState<TreeData>;
    committed: DataState<TreeData>;
    merged: DataState<{
      current: TreeData;
      committed: TreeData;
    }>;
  };
};

const TreeContext = createContext<AllTreeData>({
  unscoped: {
    current: { kind: 'loading' },
    committed: { kind: 'loading' },
  },
  scoped: {
    current: { kind: 'loading' },
    committed: { kind: 'loading' },
    merged: { kind: 'loading' },
  },
});

export function useTree() {
  return useContext(TreeContext).scoped;
}

export function useCurrentUnscopedTree() {
  return useContext(TreeContext).unscoped.current;
}

export function useChanged() {
  return useContext(ChangedContext);
}

export function useBaseCommit() {
  return useContext(BaseInfoContext).baseCommit;
}

export function useIsRepoPrivate() {
  return useContext(BaseInfoContext).isPrivate;
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
  }
` as import('../../../__generated__/ts-gql/Ref_base').type;

const BaseRepo = gql`
  fragment Repo_base on Repository {
    id
    isPrivate
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
      pageInfo {
        hasNextPage
        endCursor
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
  const cachedFromPersisted = getTreeFromPersistedCache(sha);
  if (cachedFromPersisted && !(cachedFromPersisted instanceof Promise)) {
    const entries = treeToEntries(cachedFromPersisted.children!);
    const result = {
      entries: new Map(entries.map(entry => [entry.path, entry])),
      tree: cachedFromPersisted.children!,
    };
    treeCache.set(sha, result);
    return result;
  }
  const promise = (async () => {
    const cached = await cachedFromPersisted;
    if (cached) {
      const entries = treeToEntries(cached.children!);
      const result = {
        entries: new Map(entries.map(entry => [entry.path, entry])),
        tree: cached.children!,
      };
      treeCache.set(sha, result);
      return result;
    }
    const auth = await getAuth(config);
    if (!auth) throw new Error('Not authorized');
    const { tree }: { tree: (TreeEntry & { url: string; size?: number })[] } =
      await fetch(
        config.storage.kind === 'github'
          ? `https://api.github.com/repos/${serializeRepoConfig(
              config.storage.repo
            )}/git/trees/${sha}?recursive=1`
          : `${KEYSTATIC_CLOUD_API_URL}/v1/github/trees/${sha}`,
        {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
            ...(config.storage.kind === 'cloud' ? KEYSTATIC_CLOUD_HEADERS : {}),
          },
        }
      ).then(x => x.json());
    const treeEntries = tree.map(({ url, size, ...rest }) => rest as TreeEntry);
    await setTreeToPersistedCache(sha, treeEntriesToTreeNodes(treeEntries));
    return hydrateTreeCacheWithEntries(treeEntries);
  })();
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
  branchNameToBaseCommit: Map<string, string>;
  mainOwner: string;
  mainRepo: string;
  hasLoadedAllBranches: boolean;
}>({
  currentBranch: '',
  allBranches: [],
  defaultBranch: '',
  branchNameToId: new Map(),
  branchNameToBaseCommit: new Map(),
  mainOwner: '',
  mainRepo: '',
  hasLoadedAllBranches: false,
});
export function useBranchInfo() {
  return useContext(BranchInfoContext);
}

export function getChangedData(
  config: Config,
  trees: {
    current: { tree: Map<string, TreeNode> };
    committed: { tree: Map<string, TreeNode> };
  }
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
            trees.committed.tree
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
          getTreeNodeAtPath(trees.committed.tree, singletonPath)?.entry.sha
        );
      })
    ),
  };
}
