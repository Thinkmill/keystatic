import { Selection } from '@react-types/shared';
import { useContext, useEffect, useId, useMemo, useRef, useState } from 'react';

import { Badge } from '@keystar/ui/badge';
import { ActionButton, Button, ButtonGroup } from '@keystar/ui/button';
import { Checkbox } from '@keystar/ui/checkbox';
import { Dialog, DialogTrigger, useDialogContainer } from '@keystar/ui/dialog';
import { Icon } from '@keystar/ui/icon';
import { gitBranchIcon } from '@keystar/ui/icon/icons/gitBranchIcon';
import { minusSquareIcon } from '@keystar/ui/icon/icons/minusSquareIcon';
import { plusSquareIcon } from '@keystar/ui/icon/icons/plusSquareIcon';
import { dotSquareIcon } from '@keystar/ui/icon/icons/dotSquareIcon';
import { undoIcon } from '@keystar/ui/icon/icons/undoIcon';
import { Box, HStack, VStack } from '@keystar/ui/layout';
import { TextLink } from '@keystar/ui/link';
import { ListView, Item } from '@keystar/ui/list-view';
import { Content, Header } from '@keystar/ui/slots';
import {
  breakpointQueries,
  css,
  tokenSchema,
  useMediaQuery,
} from '@keystar/ui/style';
import { Tooltip, TooltipTrigger } from '@keystar/ui/tooltip';
import { Heading, Text } from '@keystar/ui/typography';
import { usePrevious } from '@keystar/ui/utils';

import { Config } from '../../config';

import { BranchPicker } from '../branch-selection';
import { useRouter } from '../router';
import { pluralize } from '../pluralize';
import {
  getCollectionFormat,
  getCollectionItemPath,
  getPathPrefix,
  getSingletonFormat,
  getSingletonPath,
} from '../utils';

import { useAppState, useConfig } from './context';
import {
  RepoWithWriteAccessContext,
  hydrateTreeCacheWithEntries,
  useBaseCommit,
  useBranchInfo,
  useChanged,
  useCurrentUnscopedTree,
  useIsRepoPrivate,
  useSetTreeSha,
  useTree,
} from './data';
import { FetchRef, createCommitMutation, useCommit } from '../updating';
import { useMutation } from 'urql';
import { AppSlugContext } from '../onboarding/install-app';
import {
  TreeEntry,
  TreeNode,
  createTreeNodeEntry,
  getDirname,
  getTreeNodeAtPath,
  replaceEntryAtPathInTree,
  treeSha,
  treeToEntries,
  updateTreeWithChanges,
} from '../trees';
import {
  getBlobFromPersistedCache,
  setTreeToPersistedCache,
  useExtraRoots,
} from '../object-store';
import { createUrqlClient } from '../provider';
import { fetchBlob, loadItemData } from '../useItemData';
import { getDirectoriesForTreeKey, getTreeKey } from '../tree-key';
import { base64UrlEncode } from '#base64';

const typeMap = {
  added: {
    icon: plusSquareIcon,
    tone: 'positive',
  },
  changed: {
    icon: dotSquareIcon,
    tone: 'accent',
  },
  removed: {
    icon: minusSquareIcon,
    tone: 'critical',
  },
} as const;

type ChangeType = keyof typeof typeMap;
type Change = {
  href: string;
  type: ChangeType;
} & (
  | { kind: 'collection'; slug: string; collection: string }
  | { kind: 'singleton'; singleton: string }
);

export function BatchCommits() {
  return (
    <Box padding="medium">
      <DialogTrigger>
        <ActionButton>
          <Text>Commit changes…</Text>
        </ActionButton>
        <BatchCommitsDialog />
      </DialogTrigger>
    </Box>
  );
}

function getLeafPaths(tree: Map<string, TreeNode>): string[] {
  const paths: string[] = [];
  for (const [path, node] of tree) {
    if (node.entry.type === 'tree') {
      if (!node.children) continue;
      const result = getLeafPaths(node.children);
      for (const childPath of result) {
        paths.push(`${path}/${childPath}`);
      }
    } else {
      paths.push(path);
    }
  }
  return paths;
}

function diffTrees(
  oldTree: Map<string, TreeNode>,
  newTree: Map<string, TreeNode>
): {
  additions: {
    path: string;
    sha: string;
  }[];
  deletions: string[];
} {
  const additions: {
    path: string;
    sha: string;
  }[] = [];
  const deletions = new Set<string>([...oldTree.keys()]);
  const allDeletions = [];
  for (const [path, node] of newTree) {
    deletions.delete(path);
    const oldNode = oldTree.get(path);
    if (!oldNode || oldNode.entry.sha !== node.entry.sha) {
      if (node.entry.type === 'blob') {
        additions.push({
          path,
          sha: node.entry.sha,
        });
      }
      if (node.entry.type === 'tree' && node.children) {
        const result = diffTrees(oldNode?.children ?? new Map(), node.children);
        additions.push(
          ...result.additions.map(addition => ({
            path: `${path}/${addition.path}`,
            sha: addition.sha,
          }))
        );
        allDeletions.push(
          ...result.deletions.map(deletion => `${path}/${deletion}`)
        );
      }
    }
  }

  for (const deletion of deletions) {
    const node = oldTree.get(deletion);
    if (node?.entry.type === 'tree' && node.children) {
      allDeletions.push(
        ...getLeafPaths(node.children).map(path => `${deletion}/${path}`)
      );
    } else {
      allDeletions.push(deletion);
    }
  }

  return {
    additions,
    deletions: allDeletions,
  };
}

export function useCommitTree() {
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
  const branchInfo = useBranchInfo();
  const setTreeSha = useSetTreeSha();
  const tree = useTree();
  const [, mutate] = useMutation(createCommitMutation);
  const unscopedTreeData = useCurrentUnscopedTree();
  const repoWithWriteAccess = useContext(RepoWithWriteAccessContext);
  const appSlug = useContext(AppSlugContext);

  return [
    state,
    async (override?: { sha: string; branch: string }): Promise<boolean> => {
      try {
        const scopedTrees =
          tree.merged.kind === 'loaded' ? tree.merged.data : undefined;
        const unscopedTree =
          unscopedTreeData.kind === 'loaded'
            ? unscopedTreeData.data
            : undefined;
        if (!scopedTrees || !unscopedTree) return false;
        if (
          repoWithWriteAccess === null &&
          config.storage.kind === 'github' &&
          appSlug?.value
        ) {
          setState({ kind: 'needs-fork' });
          return false;
        }
        setState({ kind: 'loading' });
        const diff = diffTrees(
          scopedTrees.committed.tree,
          scopedTrees.current.tree
        );
        const additions = await Promise.all(
          diff.additions.map(async addition => {
            const contents = await getBlobFromPersistedCache(addition.sha);
            if (!contents) {
              throw new Error(
                `Failed to get blob ${addition.sha} for path ${addition.path}`
              );
            }
            return { path: addition.path, contents };
          })
        );
        const deletions = diff.deletions.map(path => ({ path }));
        const pathPrefix = getPathPrefix(config.storage);
        if (pathPrefix) {
          const dirname = getDirname(pathPrefix);
          const innerName = pathPrefix.slice(dirname.length + 1);
          await hydrateTreeCacheWithEntries(
            treeToEntries(
              await replaceEntryAtPathInTree(
                unscopedTree.tree,
                {
                  entry: await createTreeNodeEntry(
                    innerName,
                    scopedTrees.current.tree
                  ),
                  children: scopedTrees.current.tree,
                },
                dirname
              )
            )
          );
        }
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
                message: { headline: `Update` },
                fileChanges: {
                  additions: additions.map(addition => ({
                    ...addition,
                    contents: base64UrlEncode(addition.contents),
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
              // we don't want this to go into the cache yet
              // so we create a new client just for this
              const refData = await createUrqlClient(config)
                .query(FetchRef, {
                  owner: repoWithWriteAccess!.owner,
                  name: repoWithWriteAccess!.name,
                  ref: `refs/heads/${branchInfo.currentBranch}`,
                })
                .toPromise();
              if (!refData.data?.repository?.ref?.target) {
                throw new Error('Branch not found');
              }

              result = await runMutation(
                refData.data.repository.ref.target.oid
              );
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
                contents: base64UrlEncode(addition.contents),
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

function BatchCommitsDialog() {
  let router = useRouter();
  const config = useConfig();
  let isBelowTablet = useMediaQuery(breakpointQueries.below.tablet);
  let { currentBranch } = useBranchInfo();
  let previousBranch = usePrevious(currentBranch);
  let previousHref = usePrevious(router.href);
  let { dismiss } = useDialogContainer();

  let dialogRef = useRef<HTMLDivElement>(null);
  let headingRef = useRef<HTMLHeadingElement>(null);

  const { items, loadingState } = useChangedItems();
  const selection = useListSelection(items);

  useEffect(() => {
    // if we've changed branches, keep the dialog open and clear the selection
    if (previousBranch && previousBranch !== currentBranch) {
      selection.clearAll();
      return;
    }

    // if we've navigated away from the page, dismiss the dialog
    if (previousHref && previousHref !== router.href) {
      dismiss();
    }
  }, [
    selection,
    previousHref,
    previousBranch,
    dismiss,
    router.href,
    currentBranch,
  ]);

  const formId = useId();
  const branchInfo = useBranchInfo();
  const isRepoPrivate = useIsRepoPrivate();
  const baseCommit = useBaseCommit();
  const trees = useTree();
  const extraRoots = useExtraRoots();
  const unscopedTree = useCurrentUnscopedTree();
  const [, commit] = useCommit();

  return (
    <Dialog size="large" ref={dialogRef} aria-label="Review changes">
      {!isBelowTablet && (
        <>
          <Heading ref={headingRef}>Review changes</Heading>
          {config.storage.kind !== 'local' && (
            <Header>
              <BranchPicker />
            </Header>
          )}
        </>
      )}
      <Content
        UNSAFE_className={css({
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        })}
      >
        <form
          id={formId}
          onSubmit={async event => {
            if (event.target !== event.currentTarget) return;
            event.preventDefault();
            if (trees.merged.kind !== 'loaded') return;
            const diff = diffTrees(
              trees.merged.data.committed.tree,
              trees.merged.data.current.tree
            );
            if (
              await commit({
                additions: await Promise.all(
                  diff.additions.map(async addition => {
                    const fullPath =
                      (getPathPrefix(config.storage) ?? '') + addition.path;
                    return {
                      path: fullPath,
                      contents: await fetchBlob(
                        config,
                        addition.sha,
                        fullPath,
                        baseCommit,
                        isRepoPrivate,
                        {
                          owner: branchInfo.mainOwner,
                          name: branchInfo.mainRepo,
                        }
                      ),
                    };
                  })
                ),
                deletions: diff.deletions.map(
                  path => (getPathPrefix(config.storage) ?? '') + path
                ),
                commitMessage: 'Update',
              })
            ) {
              dismiss();
            }
          }}
          className={css({
            display: 'contents',
          })}
        >
          <Checkbox
            autoFocus
            isDisabled={items.length === 0}
            isIndeterminate={!selection.isEmpty && !selection.isSelectAll}
            onChange={selection.toggleAll}
            isSelected={selection.isSelectAll}
            UNSAFE_className={css({
              marginInlineEnd: 'auto',
              paddingTop: tokenSchema.size.alias.focusRing, // avoid clipping focus ring
              paddingInline: tokenSchema.size.space.medium, // align with list view checkboxes
              height: tokenSchema.size.element.regular, // ensure decent hit area
            })}
          >
            <Text weight="medium">
              <Text visuallyHidden>Select </Text>
              {pluralize(items.length, {
                singular: 'change',
                plural: 'changes',
              })}
            </Text>
          </Checkbox>
          <ListView
            aria-label={`Changes to "${currentBranch}" branch.`}
            density="compact"
            items={items}
            selectionMode="multiple"
            selectedKeys={selection.keys}
            onSelectionChange={selection.setKeys}
            loadingState={loadingState}
            renderEmptyState={() => (
              <VStack
                gap="medium"
                alignItems="center"
                justifyContent="center"
                height="alias.singleLineWidth"
              >
                <Icon
                  src={gitBranchIcon}
                  color="neutralSecondary"
                  size="large"
                  strokeScaling={false}
                />
                <Text color="neutralSecondary" size="medium">
                  No changes to commit
                </Text>
              </VStack>
            )}
            UNSAFE_style={{
              height:
                items.length > 0
                  ? 'auto'
                  : tokenSchema.size.alias.singleLineWidth,
            }}
            flex={items.length > 0}
          >
            {item => (
              <Item
                key={`${item.kind}/${
                  item.kind === 'collection'
                    ? item.collection + '/' + item.slug
                    : item.singleton
                }`}
                textValue={`${item.kind}/${
                  item.kind === 'collection'
                    ? item.collection + '/' + item.slug
                    : item.singleton
                }, ${item.type}`}
              >
                <HStack
                  gridArea="content"
                  alignItems="center"
                  minWidth={0}
                  gap="regular"
                >
                  {item.type === 'removed' ? (
                    <Text color="color.alias.foregroundDisabled">
                      {item.kind === 'collection'
                        ? item.collection + '/' + item.slug
                        : item.singleton}
                    </Text>
                  ) : (
                    <TextLink href={item.href}>
                      {item.kind === 'collection'
                        ? item.collection + '/' + item.slug
                        : item.singleton}
                    </TextLink>
                  )}
                  <ChangeTypeIndicator type={item.type} />
                </HStack>
                <TooltipTrigger>
                  <ActionButton
                    aria-label="Revert changes to item"
                    marginStart="regular"
                    onPress={async () => {
                      const loadedTrees =
                        trees.merged.kind === 'loaded'
                          ? trees.merged.data
                          : undefined;
                      const unscopedLoadedTree =
                        unscopedTree.kind === 'loaded'
                          ? unscopedTree.data
                          : undefined;

                      if (!loadedTrees || !unscopedLoadedTree) return;
                      let schema, format, dirpath, slug;
                      if (item.kind === 'collection') {
                        const collectionConfig =
                          config.collections![item.collection];
                        schema = collectionConfig.schema;
                        format = getCollectionFormat(config, item.collection);
                        dirpath = getCollectionItemPath(
                          config,
                          item.collection,
                          item.slug
                        );
                        slug = {
                          slug: item.slug,
                          field: collectionConfig.slugField,
                        };
                      } else {
                        schema = config.singletons![item.singleton].schema;
                        format = getSingletonFormat(config, item.singleton);
                        dirpath = getSingletonPath(config, item.singleton);
                        slug = undefined;
                      }

                      const locationsForTreeKey = getDirectoriesForTreeKey(
                        { kind: 'object', fields: schema },
                        dirpath,
                        item.kind === 'collection' ? item.slug : undefined,
                        format
                      );

                      if (item.type === 'added') {
                        const localTreeKey = getTreeKey(
                          locationsForTreeKey,
                          loadedTrees.current.tree
                        );
                        const itemData = await loadItemData(
                          { config, dirpath, format, schema, slug },
                          loadedTrees.current.tree,
                          baseCommit,
                          branchInfo,
                          locationsForTreeKey,
                          isRepoPrivate,
                          localTreeKey
                        );
                        const newTree = await updateTreeWithChanges(
                          unscopedLoadedTree.tree,
                          {
                            deletions: itemData.initialFiles.map(
                              x => (getPathPrefix(config.storage) ?? '') + x
                            ),
                            additions: [],
                          }
                        );
                        await setTreeToPersistedCache(
                          newTree.sha,
                          newTree.tree
                        );
                        extraRoots.set(branchInfo.currentBranch, newTree.sha);
                        return;
                      }
                      if (item.type === 'removed') {
                        const localTreeKey = getTreeKey(
                          locationsForTreeKey,
                          loadedTrees.committed.tree
                        );
                        const itemData = await loadItemData(
                          { config, dirpath, format, schema, slug },
                          loadedTrees.committed.tree,
                          baseCommit,
                          branchInfo,
                          locationsForTreeKey,
                          isRepoPrivate,
                          localTreeKey
                        );
                        const newTree = await updateTreeWithChanges(
                          unscopedLoadedTree.tree,
                          {
                            deletions: [],
                            additions: itemData.initialFiles.map(x => {
                              return {
                                contents: {
                                  sha: getTreeNodeAtPath(
                                    loadedTrees.committed.tree,
                                    x
                                  )!.entry.sha,
                                },
                                path: (getPathPrefix(config.storage) ?? '') + x,
                              };
                            }),
                          }
                        );
                        await setTreeToPersistedCache(
                          newTree.sha,
                          newTree.tree
                        );
                        extraRoots.set(branchInfo.currentBranch, newTree.sha);
                        return;
                      }
                      if (item.type === 'changed') {
                        const committedTreeKey = getTreeKey(
                          locationsForTreeKey,
                          loadedTrees.committed.tree
                        );
                        const committedItemData = await loadItemData(
                          { config, dirpath, format, schema, slug },
                          loadedTrees.committed.tree,
                          baseCommit,
                          branchInfo,
                          locationsForTreeKey,
                          isRepoPrivate,
                          committedTreeKey
                        );
                        const currentTreeKey = getTreeKey(
                          locationsForTreeKey,
                          loadedTrees.current.tree
                        );
                        const currentItemData = await loadItemData(
                          { config, dirpath, format, schema, slug },
                          loadedTrees.committed.tree,
                          baseCommit,
                          branchInfo,
                          locationsForTreeKey,
                          isRepoPrivate,
                          currentTreeKey
                        );

                        const filesForDeletion = new Set<string>(
                          currentItemData.initialFiles
                        );
                        for (const file of committedItemData.initialFiles) {
                          filesForDeletion.delete(file);
                        }

                        const newTree = await updateTreeWithChanges(
                          unscopedLoadedTree.tree,
                          {
                            deletions: [...filesForDeletion].map(
                              x => (getPathPrefix(config.storage) ?? '') + x
                            ),
                            additions: committedItemData.initialFiles.map(
                              x => ({
                                path: (getPathPrefix(config.storage) ?? '') + x,
                                contents: {
                                  sha: getTreeNodeAtPath(
                                    loadedTrees.committed.tree,
                                    x
                                  )!.entry.sha,
                                },
                              })
                            ),
                          }
                        );
                        await setTreeToPersistedCache(
                          newTree.sha,
                          newTree.tree
                        );
                        extraRoots.set(branchInfo.currentBranch, newTree.sha);
                        return;
                      }
                    }}
                  >
                    <Icon src={undoIcon} />
                  </ActionButton>
                  <Tooltip>Revert changes to item</Tooltip>
                </TooltipTrigger>
              </Item>
            )}
          </ListView>
        </form>
      </Content>
      <ButtonGroup>
        <Button onPress={dismiss}>Cancel</Button>
        <TooltipTrigger isDisabled={!selection.isEmpty}>
          <Button
            form={formId}
            type="submit"
            prominence="high"
            isDisabled={selection.isEmpty}
          >
            Commit
          </Button>
          <Tooltip>Select files to commit.</Tooltip>
        </TooltipTrigger>
      </ButtonGroup>
    </Dialog>
  );
}

/** Displays an icon on mobile, and a badge above. */
function ChangeTypeIndicator(props: { type: ChangeType }) {
  let type = typeMap[props.type];

  return (
    <>
      <Icon
        aria-label={props.type}
        color={type.tone}
        src={type.icon}
        isHidden={{ above: 'mobile' }}
      />
      <Badge tone={type.tone} isHidden={{ below: 'tablet' }}>
        {props.type}
      </Badge>
    </>
  );
}

// Utils
// ----------------------------------------------------------------------------

// TODO: move somewhere more appropriate
// NOTE: expected to be able to use `require('../utils').getCollectionItemPath` but that doesn't work
function getCollectionItemHref(
  basePath: string,
  collection: string,
  key: string
): string {
  return `${basePath}/collection/${encodeURIComponent(
    collection
  )}/item/${encodeURIComponent(key)}`;
}

function useListSelection(items: Change[]) {
  let [keys, setKeys] = useState<Selection>('all');

  let isEmpty = keys !== 'all' && !keys.size;

  let toggleAll = (isSelected: boolean) => {
    setKeys(isSelected ? 'all' : new Set());
  };
  let clearAll = () => {
    toggleAll(false);
  };

  return {
    isEmpty,
    get isSelectAll() {
      if (isEmpty) {
        return false;
      }

      if (keys === 'all') {
        return true;
      }

      let _keys = keys; // appease the type gods
      return items.map(item => item.slug).every(k => _keys.has(k));
    },
    keys,
    setKeys,
    clearAll,
    toggleAll,
  };
}

function useChangedItems() {
  let { basePath } = useAppState();
  let config = useConfig();
  let changeMap = useChanged();
  const { merged } = useTree();

  let items = useMemo(
    () => getChangedItems(basePath, config, changeMap),
    [basePath, changeMap, config]
  );
  // show old items while loading
  let oldItems = usePrevious(items) || [];
  return {
    items: merged.kind === 'loaded' ? items : oldItems,
    loadingState: merged.kind === 'loaded' ? ('idle' as const) : merged.kind,
  };
}

function getChangedItems(
  basePath: string,
  config: Config,
  changeMap: ReturnType<typeof useChanged>
) {
  let items: Change[] = [];
  if (config.collections) {
    for (const key of Object.keys(config.collections)) {
      const counts = changeMap.collections.get(key);

      if (
        !counts?.added.size &&
        !counts?.changed.size &&
        !counts?.removed.size
      ) {
        continue;
      }

      if (counts?.changed.size) {
        items.push(
          ...Array.from(counts.changed).map(slug => ({
            href: getCollectionItemHref(basePath, key, slug),
            slug,
            kind: 'collection' as const,
            collection: key,
            type: 'changed' as const,
          }))
        );
      }
      if (counts?.added.size) {
        items.push(
          ...Array.from(counts.added).map(slug => ({
            href: getCollectionItemHref(basePath, key, slug),
            slug,
            kind: 'collection' as const,
            collection: key,
            type: 'added' as const,
          }))
        );
      }
      if (counts?.removed.size) {
        items.push(
          ...Array.from(counts.removed).map(slug => ({
            href: getCollectionItemHref(basePath, key, slug),
            type: 'removed' as const,
            slug,
            kind: 'collection' as const,
            collection: key,
          }))
        );
      }
    }
  }

  if (config.singletons) {
    for (const singleton of Object.keys(config.singletons)) {
      let changes = changeMap.singletons.has(singleton);

      if (!changes) {
        continue;
      }

      items.push({
        href: `${basePath}/singleton/${encodeURIComponent(singleton)}`,
        type: 'changed' as const,
        kind: 'singleton',
        singleton,
      });
    }
  }

  return items;
}
