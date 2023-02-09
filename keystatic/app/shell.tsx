import { VisuallyHidden } from '@react-aria/visually-hidden';
import { gql, OperationData, OperationVariables } from '@ts-gql/tag/no-transform';
import { isDefined } from 'emery';
import LRU from 'lru-cache';
import { useRouter } from 'next/router';
import {
  createContext,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import { useQuery, UseQueryResponse } from 'urql';

import { alertCircleIcon } from '@voussoir/icon/icons/alertCircleIcon';
import { folderOpenIcon } from '@voussoir/icon/icons/folderOpenIcon';
import { gitBranchPlusIcon } from '@voussoir/icon/icons/gitBranchPlusIcon';
import { chevronDownIcon } from '@voussoir/icon/icons/chevronDownIcon';
import { menuIcon } from '@voussoir/icon/icons/menuIcon';

import { Badge } from '@voussoir/badge';
import { ActionButton } from '@voussoir/button';
import { DialogContainer } from '@voussoir/dialog';
import { Icon } from '@voussoir/icon';
import { Image } from '@voussoir/image';
import { Box, BoxProps, Flex, Grid } from '@voussoir/layout';
import { NavList, NavGroup, NavItem } from '@voussoir/nav-list';
import { ActionMenu, Item, Menu, MenuTrigger, Section } from '@voussoir/menu';
import { VoussoirTheme, breakpointQueries, css, tokenSchema, transition } from '@voussoir/style';
import { Heading, Text } from '@voussoir/typography';

import { Config } from '../config';
import { githubRequest } from '../github-api';
import { BranchPicker, CreateBranchDialog } from './branch-selection';
import { DataState, LOADING, mergeDataStates, useData } from './useData';
import {
  getCollectionFormat,
  getCollectionPath,
  getDataFileExtension,
  getSingletonPath,
  getTreeNodeForItem,
  MaybePromise,
  pluralize,
} from './utils';
import { getTreeNodeAtPath, treeEntriesToTreeNodes, TreeEntry, TreeNode } from './trees';
import { externalLinkIcon } from '@voussoir/icon/icons/externalLinkIcon';

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
  query AppShell($name: String!, $owner: String!, $branch: String!) {
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
      ref(qualifiedName: $branch) {
        id
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
      refs(refPrefix: "refs/heads/", first: 100) {
        nodes {
          id
          name
        }
      }
    }
  }
` as import('../__generated__/ts-gql/AppShell').type;

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
  }).then(res => hydrateTreeCacheWithEntries(sha, res.data.tree as TreeEntry[]));
  treeCache.set(sha, promise);
  return promise;
}

function useTreeData(sha: string | null, repo: { owner: string; name: string }) {
  return useData(useCallback(() => (sha ? fetchTreeData(sha, repo) : LOADING), [sha, repo]));
}

const SidebarContext = createContext<{
  sidebarIsOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
}>({
  sidebarIsOpen: false,
  setSidebarOpen: () => {
    throw new Error('SidebarContext not set');
  },
});

const SIDEBAR_WIDTH = 320;

export const AppShell = (props: { config: Config; children: ReactNode; currentBranch: string }) => {
  const [sidebarIsOpen, setSidebarOpen] = useState(false);
  const [newBranchDialogVisible, toggleNewBranchDialog] = useReducer(v => !v, false);
  const router = useRouter();
  const hrefBase = `/keystatic/branch/${props.currentBranch}`;
  const isCurrent = (href: string, { exact = false } = {}) => {
    if (exact) {
      return href === router.asPath ? 'page' : undefined;
    }
    return router.asPath.startsWith(href) ? 'page' : undefined;
  };

  const queryData = useQuery({
    query: AppShellQuery,
    variables: {
      branch: props.currentBranch,
      name: props.config.repo.name,
      owner: props.config.repo.owner,
    },
  });
  const [{ data, error }] = queryData;
  const defaultBranchTreeSha =
    data?.repository?.defaultBranchRef?.target?.__typename === 'Commit'
      ? data.repository.defaultBranchRef.target.tree.oid
      : null;
  const currentBranchSha =
    data?.repository?.ref?.target?.__typename === 'Commit'
      ? data.repository.ref.target.tree.oid
      : null;
  const baseCommit = data?.repository?.ref?.target?.oid ?? null;

  const defaultBranchTree = useTreeData(defaultBranchTreeSha, props.config.repo);
  const currentBranchTree = useTreeData(currentBranchSha, props.config.repo);

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

  useEffect(() => {
    setSidebarOpen(false);
  }, [router.asPath]);

  const collectionsArray = Object.entries(props.config.collections || {});
  const singletonsArray = Object.entries(props.config.singletons || {});
  const sidebarContext = { sidebarIsOpen, setSidebarOpen };

  type GitItem = { icon: ReactElement; label: string; description: string; key: string };
  type GitSection = { key: string; label: string; children: GitItem[] };
  const gitMenuItems = useMemo(() => {
    let isDefaultBranch =
      !!data?.repository?.defaultBranchRef &&
      props.currentBranch === data.repository.defaultBranchRef.name;
    let hasPullRequests = !!data?.repository?.ref?.associatedPullRequests.nodes;
    let items: GitSection[] = [
      {
        key: 'branch-section',
        label: 'Branches',
        children: [
          {
            key: 'new-branch',
            icon: gitBranchPlusIcon,
            label: 'New branch',
            description: `Create a new branch based on "${data?.repository?.defaultBranchRef?.name}"`,
          },
        ],
      },
    ];
    if (!isDefaultBranch || hasPullRequests) {
      let prSection: GitItem[] = [];
      if (!isDefaultBranch) {
        prSection.push({
          key: 'create-pull-request',
          icon: externalLinkIcon,
          label: 'Create pull request',
          description: 'Open a PR against this branch',
        });
      }

      if (hasPullRequests) {
        prSection.push({
          key: 'related-pull-requests',
          icon: externalLinkIcon,
          label: 'View pull requests',
          description: 'See the PRs for this branch',
        });
      }

      items.push({
        key: 'pr-section',
        label: 'Pull requests',
        children: prSection,
      });
    }

    return items;
  }, [
    data?.repository?.defaultBranchRef,
    data?.repository?.ref?.associatedPullRequests.nodes,
    props.currentBranch,
  ]);

  return (
    <SidebarContext.Provider value={sidebarContext}>
      <Flex direction={{ mobile: 'column', tablet: 'row' }} width="100vw" minHeight="100vh">
        <Flex
          aria-labelledby="nav-title-id"
          elementType="nav"
          data-visible={sidebarIsOpen}
          // styles
          backgroundColor="surfaceSecondary"
          borderEnd="muted"
          direction="column"
          height="100%"
          position="fixed"
          width={SIDEBAR_WIDTH}
          zIndex={100}
          UNSAFE_className={[
            css({
              [breakpointQueries.above.mobile]: {
                '&::before': {
                  boxShadow: `inset ${tokenSchema.size.shadow.medium} ${tokenSchema.color.shadow.muted}`,
                  content: '""',
                  inset: '-10% 0',
                  position: 'absolute',
                  pointerEvents: 'none',
                  width: 'inherit',
                },
              },
              [breakpointQueries.below.tablet]: {
                boxShadow: `${tokenSchema.size.shadow.large} ${tokenSchema.color.shadow.regular}`,
                left: 'auto',
                outline: 0,
                right: '100%',
                transition: 'transform 200ms, visibility 0s 200ms',
                visibility: 'hidden',

                '&[data-visible=true]': {
                  visibility: 'unset',
                  transitionDelay: '0s',
                  transform: 'translate(100%)',
                },
              },
            }),
            'keystatic-sidebar',
          ]}
        >
          {/*
          ======================================================================
          HEADER
          ======================================================================
          */}

          <Flex
            gap="regular"
            paddingX="xlarge"
            borderBottom="muted"
            height="xlarge"
            alignItems="center"
          >
            <BranchPicker
              currentBranch={props.currentBranch}
              defaultBranch={data?.repository?.defaultBranchRef?.name}
              allBranches={
                data?.repository?.refs?.nodes?.map(branch => branch?.name).filter(isDefined) ?? []
              }
            />
            <ActionMenu
              aria-label="git actions"
              prominence="low"
              items={gitMenuItems}
              onAction={key => {
                let repoURL = `https://github.com/${props.config.repo.owner}/${props.config.repo.name}`;
                switch (key) {
                  case 'new-branch':
                    toggleNewBranchDialog();
                    break;
                  case 'related-pull-requests':
                    let query = [
                      ['is', 'pr'],
                      ['is', 'open'],
                      ['head', props.currentBranch],
                    ]
                      .map(([key, value]) => encodeURIComponent(`${key}:${value}`))
                      .join('+');

                    window.open(`${repoURL}/pulls?q=${query}`);
                    break;
                  case 'create-pull-request':
                    window.open(`${repoURL}/pull/new/${props.currentBranch}`);
                    break;
                }
              }}
            >
              {item => (
                <Section key={item.key} items={item.children} aria-label={item.label}>
                  {item => (
                    <Item key={item.key}>
                      <Icon src={item.icon} />
                      <Text>{item.label}</Text>
                      <Text slot="description">{item.description}</Text>
                    </Item>
                  )}
                </Section>
              )}
            </ActionMenu>

            <DialogContainer onDismiss={toggleNewBranchDialog}>
              {newBranchDialogVisible && (
                <CreateBranchDialog
                  onDismiss={close}
                  onCreate={branchName => {
                    close();
                    router.push(router.asPath.replace(/\/branch\/[^/]+/, '/branch/' + branchName));
                  }}
                  branchOid={baseCommit!}
                  repositoryId={data?.repository?.id ?? ''}
                />
              )}
            </DialogContainer>
          </Flex>

          {/*
          ======================================================================
          NAVIGATION
          ======================================================================
          */}
          <Flex
            // backgroundColor="surface"
            direction="column"
            overflow="auto"
            paddingY="xlarge"
            paddingEnd="xlarge"
            // borderTopEndRadius="large"
            // borderBottomEndRadius="large"
            flex
          >
            <NavList flex>
              <NavItem href={hrefBase} aria-current={isCurrent(hrefBase, { exact: true })}>
                Dashboard
              </NavItem>

              {collectionsArray.length !== 0 && (
                <NavGroup title="Collections">
                  {collectionsArray.map(([key, collection]) => {
                    const href = `${hrefBase}/collection/${key}`;
                    const changes = changedData.collections.get(key);
                    const allChangesCount = changes
                      ? changes.changed.size + changes.added.size + changes.removed.size
                      : 0;
                    return (
                      <NavItem key={key} href={href} aria-current={isCurrent(href)}>
                        <Text>{collection.label}</Text>
                        {!!allChangesCount && (
                          <Badge tone="accent" marginStart="auto">
                            <Text>{allChangesCount}</Text>
                            <Text visuallyHidden>
                              {pluralize(allChangesCount, {
                                singular: 'item',
                                inclusive: false,
                              })}{' '}
                              changed
                            </Text>
                          </Badge>
                        )}
                      </NavItem>
                    );
                  })}
                </NavGroup>
              )}
              {singletonsArray.length !== 0 && (
                <NavGroup title="Singletons">
                  {singletonsArray.map(([key, collection]) => {
                    const href = `${hrefBase}/singleton/${key}`;
                    return (
                      <NavItem key={key} href={href} aria-current={isCurrent(href)}>
                        <Text>{collection.label}</Text>
                        {changedData.singletons.has(key) && (
                          <Badge tone="accent" marginStart="auto">
                            Changed
                          </Badge>
                        )}
                      </NavItem>
                    );
                  })}
                </NavGroup>
              )}
            </NavList>
          </Flex>

          {/*
          ======================================================================
          FOOTER
          ======================================================================
          */}

          <Flex
            elementType="header"
            borderTop="muted"
            paddingX="xlarge"
            height="xlarge"
            alignItems="center"
            justifyContent="space-between"
          >
            <Flex gap="regular" alignItems="center" height="regular">
              <Icon src={folderOpenIcon} />
              <Text
                color="neutralEmphasis"
                weight="semibold"
                size="medium"
                id="nav-title-id"
                truncate
              >
                {props.config.repo.name}
              </Text>
            </Flex>
            <MenuTrigger direction="top">
              <ActionButton prominence="low" aria-label="app actions">
                <Image
                  alt={`${data?.viewer.name ?? data?.viewer.login} avatar`}
                  borderRadius="full"
                  overflow="hidden"
                  aspectRatio="1"
                  height="xsmall"
                  src={data?.viewer.avatarUrl ?? ''}
                />
                <Icon src={chevronDownIcon} />
              </ActionButton>
              <Menu
                onAction={key => {
                  if (key === 'logout') {
                    alert('TODO: logout');
                  }
                  if (key === 'profile') {
                    window.open(`https://github.com/${data?.viewer.login ?? ''}`, '_blank');
                  }
                  if (key === 'repository') {
                    window.open(
                      `https://github.com/${props.config.repo.owner}/${props.config.repo.name}`,
                      '_blank'
                    );
                  }
                }}
              >
                <Item key="logout">Log out</Item>
                <Section title="Github">
                  <Item key="profile">Profile</Item>
                  <Item key="repository">Repository</Item>
                </Section>
              </Menu>
            </MenuTrigger>
          </Flex>

          <VisuallyHidden elementType="button" onClick={() => setSidebarOpen(false)}>
            close sidebar
          </VisuallyHidden>
        </Flex>

        {/*
        ========================================================================
        MAIN
        ========================================================================
        */}
        <BaseCommitContext.Provider value={baseCommit ?? ''}>
          <ChangedContext.Provider value={changedData}>
            <TreeContext.Provider value={allTreeData}>
              <AppShellQueryContext.Provider value={queryData}>
                {error ? (
                  <EmptyState
                    icon={alertCircleIcon}
                    title="Failed to load shell"
                    message={error.message}
                  />
                ) : (
                  props.children
                )}
              </AppShellQueryContext.Provider>
            </TreeContext.Provider>
          </ChangedContext.Provider>
        </BaseCommitContext.Provider>
      </Flex>
    </SidebarContext.Provider>
  );
};

// Styled components
// -----------------------------------------------------------------------------

type EmptyStateProps =
  | { children: ReactNode }
  | { title?: ReactNode; icon?: ReactElement; message?: ReactNode; actions?: ReactNode };
export function EmptyState(props: EmptyStateProps) {
  return (
    <Flex
      alignItems="center"
      direction="column"
      gap="large"
      justifyContent="center"
      minHeight="size.scale.3000"
    >
      {'children' in props ? (
        props.children
      ) : (
        <>
          {props.icon && <Icon src={props.icon} size="large" color="neutralEmphasis" />}
          {props.title && <Heading size="medium">{props.title}</Heading>}
          {props.message && <Text align="center">{props.message}</Text>}
          {props.actions}
        </>
      )}
    </Flex>
  );
}

// Composite components
// -----------------------------------------------------------------------------

function documentSelector(selector: string): HTMLElement | null {
  return document.querySelector(selector);
}

export const AppShellHeader = ({ children }: PropsWithChildren) => {
  const { setSidebarOpen } = useContext(SidebarContext);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  let onPress = () => {
    let nav = documentSelector('.keystatic-sidebar');
    let main = documentSelector('main');

    if (nav && main) {
      nav.dataset.visible = nav.dataset.visible === 'true' ? 'false' : 'true';

      if (nav.dataset.visible === 'true') {
        setSidebarOpen(true);
        main.setAttribute('aria-hidden', 'true');
        nav.tabIndex = -1;
        nav.focus();
      } else {
        setSidebarOpen(false);
        main.removeAttribute('aria-hidden');
        nav.removeAttribute('tabindex');
      }
    }
  };

  useEffect(() => {
    let mediaQueryList = window.matchMedia('(max-width: 1020px)');
    let nav = documentSelector('.keystatic-sidebar');
    let main = documentSelector('main');
    let hamburgerButton = menuButtonRef.current;

    let removeVisible = (isNotResponsive = false) => {
      setSidebarOpen(false);

      if (nav && main) {
        if (hamburgerButton && nav.contains(document.activeElement) && !isNotResponsive) {
          hamburgerButton.focus();
        }

        nav.dataset.visible = 'false';
        main.removeAttribute('aria-hidden');
        nav.removeAttribute('tabindex');
      }
    };

    /* collapse nav when underlying content is clicked */
    let onClick = (e: MouseEvent) => {
      if (e.target !== hamburgerButton) {
        removeVisible();
      }
    };

    /* collapse expanded nav when esc key is pressed */
    let onKeydownEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        removeVisible();
      }
    };

    /* trap keyboard focus within expanded nav */
    let onKeydownTab = (event: KeyboardEvent) => {
      if (event.key === 'Tab' && nav && nav.dataset.visible === 'true') {
        let tabbables = nav.querySelectorAll('button, a[href]');
        let first = tabbables[0] as HTMLElement;
        let last = tabbables[tabbables.length - 1] as HTMLElement;

        if (event.shiftKey && event.target === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && event.target === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    /* restore default behavior when responsive media query no longer matches */
    let mediaQueryTest = (event: any) => {
      if (!event.matches) {
        removeVisible(true);
      }
    };

    document.addEventListener('keydown', onKeydownEsc);
    if (nav && main) {
      main.addEventListener('click', onClick);
      nav.addEventListener('keydown', onKeydownTab);
    }

    let useEventListener = typeof mediaQueryList.addEventListener === 'function';
    if (useEventListener) {
      mediaQueryList.addEventListener('change', mediaQueryTest);
    } else {
      mediaQueryList.addListener(mediaQueryTest);
    }

    return () => {
      document.removeEventListener('keydown', onKeydownEsc);
      if (nav && main) {
        main.removeEventListener('click', onClick);
        nav.removeEventListener('keydown', onKeydownTab);
      }

      if (useEventListener) {
        mediaQueryList.removeEventListener('change', mediaQueryTest);
      } else {
        mediaQueryList.removeListener(mediaQueryTest);
      }
    };
  }, [setSidebarOpen, menuButtonRef]);

  return (
    <Box
      backgroundColor="surface"
      borderBottom="muted"
      elementType="header"
      height="xlarge"
      insetTop={0}
      position="sticky"
      zIndex={3}
    >
      <AppShellContainer>
        <Flex alignItems="center" height="xlarge">
          <ActionButton
            prominence="low"
            isHidden={{ above: 'mobile' }}
            onPress={onPress}
            ref={menuButtonRef}
          >
            <Icon src={menuIcon} />
          </ActionButton>
          {children}
        </Flex>
      </AppShellContainer>
    </Box>
  );
};

export const AppShellBody = ({ children }: PropsWithChildren) => {
  return (
    <Box paddingY="xlarge">
      <AppShellContainer>{children}</AppShellContainer>
    </Box>
  );
};

type AppShellContextValue = { containerWidth: keyof VoussoirTheme['size']['container'] };
const AppShellContext = createContext<AppShellContextValue>({
  containerWidth: 'medium',
});
export const AppShellRoot = ({
  children,
  containerWidth = 'medium',
}: PropsWithChildren<Partial<AppShellContextValue>>) => {
  return (
    <AppShellContext.Provider value={{ containerWidth }}>
      <Grid
        elementType="main"
        flex
        minHeight="100vh"
        minWidth={0}
        paddingStart={{ tablet: SIDEBAR_WIDTH }}
        rows={['auto', '1fr', 'auto']}
        UNSAFE_className={css({
          '&::before': {
            backgroundColor: '#0006',
            content: '""',
            inset: 0,
            opacity: 0,
            pointerEvents: 'none',
            position: 'fixed',
            transition: transition('opacity'),
            zIndex: 99,
          },
          'nav[data-visible=true] ~ &::before': {
            opacity: 1,
          },
        })}
      >
        {children}
      </Grid>
    </AppShellContext.Provider>
  );
};

export const AppShellContainer = (props: BoxProps) => {
  const { containerWidth } = useContext(AppShellContext);
  return (
    <Box
      maxWidth={`size.container.${containerWidth}`}
      marginX="auto"
      paddingX={{ mobile: 'regular', tablet: 'xlarge' }}
      {...props}
    />
  );
};
