import { ResultOf, VariablesOf, readFragment } from 'gql.tada';
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
import LRU from 'lru-cache';
import { isDefined } from 'emery';
import { getAuth, getCloudAuth } from '../auth';
import { ViewerContext, SidebarFooter_viewer } from './viewer-data';
import { parseRepoConfig, serializeRepoConfig } from '../repo-config';
import { z } from 'zod';
import { scopeEntriesWithPathPrefix } from './path-prefix';
import {
  garbageCollectGitObjects,
  getTreeFromPersistedCache,
  setTreeToPersistedCache,
} from '../object-cache';
import { graphql } from '../../graphql';

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
      unscopedDefault: tree,
      scoped: {
        default: tree,
        current: tree,
        merged: mergeDataStates({ default: tree, current: tree }),
      },
    }),
    [tree]
  );
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

const cloudInfoSchema = z.object({
  user: z.object({
    name: z.string(),
    email: z.string(),
    avatarUrl: z.string().optional(),
  }),
  project: z.object({
    name: z.string(),
  }),
  team: z.object({
    name: z.string(),
    slug: z.string(),
    images: z.boolean(),
  }),
});

const CloudInfo = createContext<
  null | z.infer<typeof cloudInfoSchema> | 'unauthorized'
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
      return cloudInfoSchema.parse(await res.json());
    }, [props.config])
  );
  return (
    <CloudInfo.Provider value={data.kind === 'loaded' ? data.data : null}>
      {props.children}
    </CloudInfo.Provider>
  );
}

export const GitHubAppShellDataContext = createContext<null | UseQueryState<
  ResultOf<typeof GitHubAppShellQuery | typeof CloudAppShellQuery>,
  VariablesOf<typeof GitHubAppShellQuery | typeof CloudAppShellQuery>
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
    ResultOf<typeof GitHubAppShellQuery | typeof CloudAppShellQuery>,
    VariablesOf<typeof GitHubAppShellQuery | typeof CloudAppShellQuery>
  >({
    query:
      props.config.storage.kind === 'github'
        ? GitHubAppShellQuery
        : CloudAppShellQuery,
    variables: repo,
  });

  const [cursorState, setCursorState] = useState<string | null>(null);

  const [moreRefsState] = useQuery({
    query: graphql(
      `
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
      
    ` as const,
      [Ref_base]
    ),
    pause: !(state.data?.repository as any)?.refs?.pageInfo.hasNextPage,
    variables: {
      ...repo,
      after:
        cursorState ??
        (state.data?.repository as any)?.refs?.pageInfo.endCursor,
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

export function GitHubAppShellProvider(props: {
  currentBranch: string;
  config: Config;
  children: ReactNode;
}) {
  const router = useRouter();
  const { data, error } = useContext(GitHubAppShellDataContext)!;
  let repo;
  repo = data?.repository;

  if (
    repo &&
    'viewerPermission' in repo &&
    repo.viewerPermission &&
    !writePermissions.has(repo.viewerPermission) &&
    'forks' in repo
  ) {
    repo = repo.forks?.nodes?.[0] ?? repo;
  }

  const baseRepo = repo ? readFragment(BaseRepo, repo) : null;

  let defaultBranchRef;
  defaultBranchRef = baseRepo?.refs?.nodes?.find(
    x =>
      x && readFragment(Ref_base, x).name === baseRepo?.defaultBranchRef?.name
  );
  defaultBranchRef = defaultBranchRef
    ? readFragment(Ref_base, defaultBranchRef)
    : undefined;

  let currentBranchRef;
  currentBranchRef = baseRepo?.refs?.nodes?.find(
    x => x && readFragment(Ref_base, x).name === props.currentBranch
  );
  currentBranchRef = currentBranchRef
    ? readFragment(Ref_base, currentBranchRef)
    : undefined;

  useEffect(() => {
    if (baseRepo?.refs?.nodes) {
      garbageCollectGitObjects(
        baseRepo.refs.nodes
          .map(x => {
            if (!x) return;
            const ref = readFragment(Ref_base, x);
            return ref?.target?.__typename === 'Commit'
              ? ref.target.tree.oid
              : undefined;
          })
          .filter(isDefined)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseRepo?.id]);

  const defaultBranchTreeSha =
    defaultBranchRef?.target?.__typename === 'Commit'
      ? defaultBranchRef?.target?.tree?.oid ?? null
      : null;
  const currentBranchTreeSha =
    currentBranchRef?.target?.__typename === 'Commit'
      ? currentBranchRef?.target?.tree?.oid ?? null
      : null;
  const baseCommit = currentBranchRef?.target?.oid ?? null;

  const defaultBranchTree = useGitHubTreeData(
    defaultBranchTreeSha,
    props.config
  );
  const currentBranchTree = useGitHubTreeData(
    currentBranchTreeSha,
    props.config
  );

  const allTreeData = useMemo(() => {
    const scopedDefault = mapDataState(defaultBranchTree, tree =>
      scopeEntriesWithPathPrefix(tree, props.config)
    );
    const scopedCurrent = mapDataState(currentBranchTree, tree =>
      scopeEntriesWithPathPrefix(tree, props.config)
    );
    return {
      unscopedDefault: currentBranchTree,
      scoped: {
        default: scopedDefault,
        current: scopedCurrent,
        merged: mergeDataStates({
          default: scopedDefault,
          current: scopedCurrent,
        }),
      },
    };
  }, [currentBranchTree, defaultBranchTree, props.config]);
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
      !baseRepo?.id &&
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
  }, [error, router, baseRepo?.id, props.config]);
  const baseInfo = useMemo(
    () => ({
      baseCommit: baseCommit || '',
      repositoryId: baseRepo?.id ?? '',
      isPrivate: baseRepo?.isPrivate ?? true,
    }),
    [baseCommit, baseRepo?.id, baseRepo?.isPrivate]
  );
  const pullRequestNumber =
    currentBranchRef?.associatedPullRequests.nodes?.[0]?.number;
  const branchInfo = useMemo(
    () => ({
      defaultBranch: baseRepo?.defaultBranchRef?.name ?? '',
      currentBranch: props.currentBranch,
      baseCommit: baseCommit || '',
      repositoryId: baseRepo?.id ?? '',
      allBranches:
        baseRepo?.refs?.nodes?.map((x: any) => x?.name).filter(isDefined) ?? [],
      pullRequestNumber,
      branchNameToId: new Map(
        baseRepo?.refs?.nodes?.filter(isDefined).map(x => {
          const ref = readFragment(Ref_base, x);
          return [ref.name, ref.id];
        })
      ),
      branchNameToBaseCommit: new Map(
        baseRepo?.refs?.nodes?.flatMap(x => {
          if (!x) return [];
          const ref = readFragment(Ref_base, x);
          return ref?.target ? [[ref.name, ref.target.oid]] : [];
        })
      ),
      mainOwner: baseRepo?.owner.login ?? '',
      mainRepo: baseRepo?.name ?? '',
    }),
    [baseRepo, props.currentBranch, baseCommit, pullRequestNumber]
  );
  return (
    <RepoWithWriteAccessContext.Provider
      value={
        baseRepo &&
        (props.config.storage.kind === 'cloud' ||
          ('viewerPermission' in baseRepo &&
            baseRepo?.viewerPermission &&
            writePermissions.has(baseRepo.viewerPermission as any)))
          ? { name: baseRepo.name, owner: baseRepo.owner.login }
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
  unscopedDefault: DataState<TreeData>;
  scoped: {
    current: DataState<TreeData>;
    default: DataState<TreeData>;
    merged: DataState<{
      current: TreeData;
      default: TreeData;
    }>;
  };
};

const TreeContext = createContext<AllTreeData>({
  unscopedDefault: { kind: 'loading' },
  scoped: {
    current: { kind: 'loading' },
    default: { kind: 'loading' },
    merged: { kind: 'loading' },
  },
});

export function useTree() {
  return useContext(TreeContext).scoped;
}

export function useCurrentUnscopedTree() {
  return useContext(TreeContext).unscopedDefault;
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

export const Ref_base = graphql(`
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
    associatedPullRequests(states: [OPEN], first: 1) {
      nodes {
        id
        number
      }
    }
  }
`);

export const BaseRepo = graphql(
  `
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
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  ` as const,
  [Ref_base]
);

export const CloudAppShellQuery = graphql(
  `
    query CloudAppShell($name: String!, $owner: String!) {
      repository(owner: $owner, name: $name) {
        id
        ...Repo_base
      }
    }
  ` as const,
  [BaseRepo]
);

export const GitHubAppShellQuery = graphql(
  `
    query GitHubAppShell($name: String!, $owner: String!) {
      repository(owner: $owner, name: $name) {
        id
        ...Repo_base
        viewerPermission
        forks(affiliations: [OWNER], first: 1) {
          nodes {
            ...Repo_base
            viewerPermission
          }
        }
      }
      viewer {
        ...SidebarFooter_viewer
      }
    }
  ` as const,
  [BaseRepo, SidebarFooter_viewer]
);

export type AppShellData = ResultOf<typeof GitHubAppShellQuery>;

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
  pullRequestNumber: number | undefined;
  branchNameToBaseCommit: Map<string, string>;
  mainOwner: string;
  mainRepo: string;
}>({
  currentBranch: '',
  allBranches: [],
  defaultBranch: '',
  pullRequestNumber: undefined,
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
