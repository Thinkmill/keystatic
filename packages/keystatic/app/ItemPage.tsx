import { useLocalizedStringFormatter } from '@react-aria/i18n';
import { assert } from 'emery';
import {
  FormEvent,
  Key,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  useMemo,
  useState,
} from 'react';

import { Badge } from '@voussoir/badge';
import { Breadcrumbs, Item } from '@voussoir/breadcrumbs';
import { Button, ButtonGroup } from '@voussoir/button';
import { AlertDialog, Dialog, DialogContainer } from '@voussoir/dialog';
import { Icon } from '@voussoir/icon';
import { externalLinkIcon } from '@voussoir/icon/icons/externalLinkIcon';
import { historyIcon } from '@voussoir/icon/icons/historyIcon';
import { trash2Icon } from '@voussoir/icon/icons/trash2Icon';
import { Box, Flex } from '@voussoir/layout';
import { ActionMenu, Section } from '@voussoir/menu';
import { Notice } from '@voussoir/notice';
import { ProgressCircle } from '@voussoir/progress';
import { Content } from '@voussoir/slots';
import { TextField } from '@voussoir/text-field';
import { Heading, Text } from '@voussoir/typography';

import { Config } from '../config';
import { FormValueContentFromPreviewProps } from '../DocumentEditor/component-blocks/form-from-preview';
import { createGetPreviewProps } from '../DocumentEditor/component-blocks/preview-props';
import { fields } from '../DocumentEditor/component-blocks/api';
import { clientSideValidateProp } from '../DocumentEditor/component-blocks/utils';
import { useEventCallback } from '../DocumentEditor/ui-utils';
import { useDeleteItem, useUpsertItem } from '../utils';

import { useCreateBranchMutation } from './branch-selection';
import l10nMessages from './l10n/index.json';
import { ForkRepoDialog } from './fork-repo';
import { getDataFileExtension, getSlugGlobForCollection } from './path-utils';
import { useRouter } from './router';
import { AppShellBody, AppShellRoot } from './shell';
import {
  useBaseCommit,
  useTree,
  useRepositoryId,
  useBranchInfo,
} from './shell/data';
import { AppShellHeader } from './shell/header';
import { TreeNode } from './trees';
import {
  getCollectionFormat,
  getCollectionItemPath,
  getRepoUrl,
  getSlugFromState,
  isGitHubConfig,
} from './utils';
import { useItemData } from './useItemData';
import { useHasChanged } from './useHasChanged';
import { mergeDataStates } from './useData';
import { useSlugsInCollection } from './useSlugsInCollection';
import { SlugFieldInfo } from '../DocumentEditor/component-blocks/fields/text/ui';

type ItemPageProps = {
  collection: string;
  config: Config;
  initialFiles: string[];
  initialState: Record<string, unknown>;
  itemSlug: string;
  localTreeKey: string;
  currentTree: Map<string, TreeNode>;
  basePath: string;
  slugInfo: SlugFieldInfo;
};

function ItemPage(props: ItemPageProps) {
  const {
    collection,
    config,
    itemSlug,
    initialFiles,
    initialState,
    localTreeKey,
    currentTree,
  } = props;
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);
  const router = useRouter();
  const [deleteAlertIsOpen, setDeleteAlertOpen] = useState(false);
  const [forceValidation, setForceValidation] = useState(false);
  const collectionConfig = config.collections![collection]!;
  const schema = useMemo(
    () => fields.object(collectionConfig.schema),
    [collectionConfig.schema]
  );

  const [{ state, localTreeKey: localTreeKeyInState }, setState] = useState({
    state: initialState,
    localTreeKey,
  });
  if (localTreeKeyInState !== localTreeKey) {
    setState({ state: initialState, localTreeKey });
  }

  const previewProps = useMemo(
    () =>
      createGetPreviewProps(
        schema,
        stateUpdater => {
          setState(state => ({
            localTreeKey: state.localTreeKey,
            state: stateUpdater(state.state),
          }));
        },
        () => undefined
      ),
    [schema]
  )(state as Record<string, unknown>);

  const hasChanged = useHasChanged({
    initialState,
    schema,
    state,
    slugField: collectionConfig.slugField,
  });

  const baseCommit = useBaseCommit();
  const slug = getSlugFromState(collectionConfig, state);
  const formatInfo = getCollectionFormat(config, collection);
  const currentBasePath = getCollectionItemPath(config, collection, itemSlug);
  const futureBasePath = getCollectionItemPath(config, collection, slug);
  const branchInfo = useBranchInfo();
  const [updateResult, _update, resetUpdateItem] = useUpsertItem({
    state,
    initialFiles,
    config,
    schema: collectionConfig.schema,
    basePath: futureBasePath,
    format: formatInfo,
    currentLocalTreeKey: localTreeKey,
    currentTree,
    slug: { field: collectionConfig.slugField, value: slug },
  });
  const update = useEventCallback(_update);
  const [deleteResult, deleteItem, resetDeleteItem] = useDeleteItem({
    initialFiles,
    storage: config.storage,
    basePath: currentBasePath,
    currentTree,
  });

  const onUpdate = async () => {
    if (!clientSideValidateProp(schema, state, props.slugInfo)) {
      setForceValidation(true);
      return;
    }
    const slug = getSlugFromState(collectionConfig, state);
    const hasUpdated = await update();
    if (hasUpdated && slug !== itemSlug) {
      router.replace(
        `${props.basePath}/collection/${encodeURIComponent(
          collection
        )}/item/${encodeURIComponent(slug)}`
      );
    }
  };
  const formID = 'item-edit-form';

  const menuActions = useMemo(() => {
    type SectionType = { label: string; children: ActionType[] };
    type ActionType = {
      icon: ReactElement;
      isDisabled?: boolean;
      key: Key;
      label: string;
    };
    let items: SectionType[] = [];
    let keystaticSection: ActionType[] = [
      {
        key: 'reset',
        label: 'Reset changes', // TODO: l10n
        isDisabled: hasChanged,
        icon: historyIcon,
      },
      {
        key: 'delete',
        label: 'Delete entry', // TODO: l10n
        icon: trash2Icon,
      },
    ];
    let githubSection: ActionType[] = [];
    items.push({ label: 'Entry actions', children: keystaticSection });

    if (isGitHubConfig(props.config)) {
      githubSection.push({
        key: 'view',
        label: 'View on GitHub',
        icon: externalLinkIcon,
      });
    }
    if (githubSection.length > 0) {
      items.push({ label: 'GitHub actions', children: githubSection });
    }

    return items;
  }, [hasChanged, props.config]);

  return (
    <>
      <ItemPageShell
        headerActions={
          <>
            {updateResult.kind === 'loading' ? (
              <ProgressCircle
                aria-label="Updating entry"
                isIndeterminate
                size="small"
                alignSelf="center"
              />
            ) : (
              hasChanged && <Badge tone="pending">Unsaved</Badge>
            )}
            <ActionMenu
              items={menuActions}
              prominence="low"
              disabledKeys={!hasChanged ? ['reset'] : []}
              isDisabled={
                deleteResult.kind === 'loading' ||
                updateResult.kind === 'loading'
              }
              onAction={key => {
                switch (key) {
                  case 'reset':
                    window.location.reload(); // TODO: can we do this w/o a full reload?
                    break;
                  case 'delete':
                    setDeleteAlertOpen(true);
                    break;
                  case 'view':
                    assert(isGitHubConfig(config));
                    let filePath =
                      formatInfo.dataLocation === 'index'
                        ? `/tree/${branchInfo.currentBranch}/${currentBasePath}`
                        : `/blob/${
                            branchInfo.currentBranch
                          }/${currentBasePath}${getDataFileExtension(
                            formatInfo
                          )}`;
                    window.open(
                      `${getRepoUrl(branchInfo)}${filePath}`,
                      '_blank',
                      'noopener,noreferrer'
                    );
                    break;
                }
              }}
            >
              {section => (
                <Section
                  key={section.label}
                  items={section.children}
                  aria-label={section.label}
                >
                  {item => (
                    <Item key={item.key} textValue={item.label}>
                      <Icon src={item.icon} />
                      <Text>{item.label}</Text>
                    </Item>
                  )}
                </Section>
              )}
            </ActionMenu>
            <Button
              form={formID}
              isDisabled={updateResult.kind === 'loading'}
              prominence="high"
              type="submit"
            >
              {stringFormatter.format('save')}
            </Button>
            <DialogContainer onDismiss={() => setDeleteAlertOpen(false)}>
              {deleteAlertIsOpen && (
                <AlertDialog
                  title="Delete entry"
                  tone="critical"
                  cancelLabel="Cancel"
                  primaryActionLabel="Yes, delete"
                  autoFocusButton="cancel"
                  onPrimaryAction={async () => {
                    if (await deleteItem()) {
                      router.push(
                        `${props.basePath}/collection/${encodeURIComponent(
                          collection
                        )}`
                      );
                    }
                  }}
                >
                  Are you sure? This action cannot be undone.
                </AlertDialog>
              )}
            </DialogContainer>
          </>
        }
        {...props}
      >
        <Box
          id={formID}
          minWidth={0}
          elementType="form"
          onSubmit={(event: FormEvent) => {
            if (event.target !== event.currentTarget) return;
            event.preventDefault();
            onUpdate();
          }}
        >
          {updateResult.kind === 'error' && (
            <Notice tone="critical">{updateResult.error.message}</Notice>
          )}
          {deleteResult.kind === 'error' && (
            <Notice tone="critical">{deleteResult.error.message}</Notice>
          )}
          <AppShellBody>
            <FormValueContentFromPreviewProps
              key={localTreeKey}
              forceValidation={forceValidation}
              slugField={props.slugInfo}
              {...previewProps}
            />
          </AppShellBody>
          <DialogContainer
            // ideally this would be a popover on desktop but using a DialogTrigger wouldn't work since
            // this doesn't open on click but after doing a network request and it failing and manually wiring about a popover and modal would be a pain
            onDismiss={resetUpdateItem}
          >
            {updateResult.kind === 'needs-new-branch' && (
              <CreateBranchDuringUpdateDialog
                branchOid={baseCommit}
                onCreate={async newBranch => {
                  const itemBasePath = `/keystatic/branch/${encodeURIComponent(
                    newBranch
                  )}/collection/${encodeURIComponent(collection)}/item/`;
                  router.push(itemBasePath + encodeURIComponent(itemSlug));
                  const slug = getSlugFromState(collectionConfig, state);

                  const hasUpdated = await update({
                    branch: newBranch,
                    sha: baseCommit,
                  });
                  if (hasUpdated && slug !== itemSlug) {
                    router.replace(itemBasePath + encodeURIComponent(slug));
                  }
                }}
                reason={updateResult.reason}
                onDismiss={resetUpdateItem}
              />
            )}
          </DialogContainer>
          <DialogContainer
            // ideally this would be a popover on desktop but using a DialogTrigger
            // wouldn't work since this doesn't open on click but after doing a
            // network request and it failing and manually wiring about a popover
            // and modal would be a pain
            onDismiss={resetUpdateItem}
          >
            {updateResult.kind === 'needs-fork' &&
              isGitHubConfig(props.config) && (
                <ForkRepoDialog
                  onCreate={async () => {
                    const slug = getSlugFromState(collectionConfig, state);
                    const hasUpdated = await update();
                    if (hasUpdated && slug !== itemSlug) {
                      router.replace(
                        `${props.basePath}/collection/${encodeURIComponent(
                          collection
                        )}/item/${encodeURIComponent(slug)}`
                      );
                    }
                  }}
                  onDismiss={resetUpdateItem}
                  config={props.config}
                />
              )}
          </DialogContainer>
          <DialogContainer
            // ideally this would be a popover on desktop but using a DialogTrigger
            // wouldn't work since this doesn't open on click but after doing a
            // network request and it failing and manually wiring about a popover
            // and modal would be a pain
            onDismiss={resetDeleteItem}
          >
            {deleteResult.kind === 'needs-fork' &&
              isGitHubConfig(props.config) && (
                <ForkRepoDialog
                  onCreate={async () => {
                    await deleteItem();
                    router.push(
                      `${props.basePath}/collection/${encodeURIComponent(
                        collection
                      )}`
                    );
                  }}
                  onDismiss={resetDeleteItem}
                  config={props.config}
                />
              )}
          </DialogContainer>
        </Box>
      </ItemPageShell>
    </>
  );
}

export function CreateBranchDuringUpdateDialog(props: {
  branchOid: string;
  onCreate: (branchName: string) => void;
  onDismiss: () => void;
  reason: string;
}) {
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);
  const repositoryId = useRepositoryId();
  const [branchName, setBranchName] = useState('');
  const [{ error, fetching, data }, createBranch] = useCreateBranchMutation();
  const isLoading = fetching || !!data?.createRef?.__typename;
  return (
    <Dialog>
      <form
        style={{ display: 'contents' }}
        onSubmit={async event => {
          if (event.target !== event.currentTarget) return;
          event.preventDefault();
          const name = `refs/heads/${branchName}`;
          const result = await createBranch({
            input: { name, oid: props.branchOid, repositoryId },
          });
          if (result.data?.createRef?.__typename) {
            props.onCreate(branchName);
          }
        }}
      >
        <Heading>{stringFormatter.format('newBranch')}</Heading>
        <Content>
          <Flex gap="large" direction="column">
            <TextField
              value={branchName}
              onChange={setBranchName}
              label="Branch name"
              description={props.reason}
              autoFocus
              errorMessage={error?.message}
            />
          </Flex>
        </Content>
        <ButtonGroup>
          {isLoading && (
            <ProgressCircle
              isIndeterminate
              size="small"
              aria-label="Creating Branch"
            />
          )}
          <Button isDisabled={isLoading} onPress={props.onDismiss}>
            {stringFormatter.format('cancel')}
          </Button>
          <Button isDisabled={isLoading} prominence="high" type="submit">
            Create branch and save
          </Button>
        </ButtonGroup>
      </form>
    </Dialog>
  );
}

function ItemPageWrapper(props: {
  collection: string;
  itemSlug: string;
  config: Config;
  basePath: string;
}) {
  const format = useMemo(
    () => getCollectionFormat(props.config, props.collection),
    [props.config, props.collection]
  );

  const allSlugs = useSlugsInCollection(props.collection);

  const collectionConfig = props.config.collections![props.collection]!;
  const slugInfo = useMemo(() => {
    const slugs = new Set(allSlugs);
    slugs.delete(props.itemSlug);
    return {
      slug: props.itemSlug,
      field: collectionConfig.slugField,
      slugs,
      glob: getSlugGlobForCollection(props.config, props.collection),
    };
  }, [
    allSlugs,
    collectionConfig.slugField,
    props.collection,
    props.config,
    props.itemSlug,
  ]);
  const itemData = useItemData({
    config: props.config,
    dirpath: getCollectionItemPath(
      props.config,
      props.collection,
      props.itemSlug
    ),
    schema: collectionConfig.schema,
    format,
    slug: slugInfo,
  });
  const { current: tree } = useTree();
  const combined = useMemo(
    () => mergeDataStates({ item: itemData, tree }),
    [itemData, tree]
  );

  if (combined.kind === 'error') {
    return (
      <ItemPageShell {...props}>
        <AppShellBody>
          <Notice tone="critical">{combined.error.message}</Notice>
        </AppShellBody>
      </ItemPageShell>
    );
  }
  if (combined.kind === 'loading') {
    return (
      <ItemPageShell {...props}>
        <Flex
          alignItems="center"
          justifyContent="center"
          minHeight="size.scale.3000"
        >
          <ProgressCircle
            aria-label="Loading Item"
            isIndeterminate
            size="large"
          />
        </Flex>
      </ItemPageShell>
    );
  }

  if (combined.data.item === 'not-found') {
    return (
      <ItemPageShell {...props}>
        <AppShellBody>
          <Notice tone="caution">Entry not found.</Notice>
        </AppShellBody>
      </ItemPageShell>
    );
  }
  return (
    <ItemPage
      collection={props.collection}
      basePath={props.basePath}
      config={props.config}
      itemSlug={props.itemSlug}
      initialState={combined.data.item.initialState}
      initialFiles={combined.data.item.initialFiles}
      localTreeKey={combined.data.item.localTreeKey}
      currentTree={combined.data.tree.tree}
      slugInfo={slugInfo}
    />
  );
}

const ItemPageShell = (
  props: PropsWithChildren<
    Omit<
      ItemPageProps,
      | 'initialFiles'
      | 'initialState'
      | 'localTreeKey'
      | 'currentTree'
      | 'slugInfo'
    > & {
      headerActions?: ReactNode;
    }
  >
) => {
  const router = useRouter();
  const collectionConfig = props.config.collections![props.collection]!;

  return (
    <AppShellRoot>
      <AppShellHeader>
        <Breadcrumbs
          flex
          minWidth={0}
          size="medium"
          onAction={key => {
            if (key === 'collection') {
              router.push(
                `${props.basePath}/collection/${encodeURIComponent(
                  props.collection
                )}`
              );
            }
          }}
        >
          <Item key="collection">{collectionConfig.label}</Item>
          <Item key="item">{props.itemSlug}</Item>
        </Breadcrumbs>
        {props.headerActions}
      </AppShellHeader>

      {props.children}
    </AppShellRoot>
  );
};

export { ItemPageWrapper as ItemPage };
