import { useLocalizedStringFormatter } from '@react-aria/i18n';
import isHotkey from 'is-hotkey';
import {
  FormEvent,
  Key,
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { ActionGroup } from '@keystar/ui/action-group';
import { Badge } from '@keystar/ui/badge';
import { Breadcrumbs, Item } from '@keystar/ui/breadcrumbs';
import { Button, ButtonGroup } from '@keystar/ui/button';
import { AlertDialog, Dialog, DialogContainer } from '@keystar/ui/dialog';
import { Icon } from '@keystar/ui/icon';
import { copyPlusIcon } from '@keystar/ui/icon/icons/copyPlusIcon';
import { externalLinkIcon } from '@keystar/ui/icon/icons/externalLinkIcon';
import { historyIcon } from '@keystar/ui/icon/icons/historyIcon';
import { trash2Icon } from '@keystar/ui/icon/icons/trash2Icon';
import { Box, Flex } from '@keystar/ui/layout';
import { Notice } from '@keystar/ui/notice';
import { ProgressCircle } from '@keystar/ui/progress';
import { Content } from '@keystar/ui/slots';
import {
  breakpointQueries,
  css,
  tokenSchema,
  useMediaQuery,
} from '@keystar/ui/style';
import { TextField } from '@keystar/ui/text-field';
import { Heading, Text } from '@keystar/ui/typography';

import { Config } from '../config';
import { createGetPreviewProps } from '../form/preview-props';
import { fields } from '../form/api';
import { clientSideValidateProp } from '../form/errors';
import { useEventCallback } from '../form/fields/document/DocumentEditor/ui-utils';

import { useCreateBranchMutation } from './branch-selection';
import { FormForEntry, containerWidthForEntryLayout } from './entry-form';
import { ForkRepoDialog } from './fork-repo';
import l10nMessages from './l10n/index.json';
import { getDataFileExtension } from './path-utils';
import { useRouter } from './router';
import { PageBody, PageHeader, PageRoot } from './shell/page';
import { useBaseCommit, useRepositoryId, useBranchInfo } from './shell/data';
import {
  serializeEntryToFiles,
  useDeleteItem,
  useUpsertItem,
} from './updating';
import { parseEntry, useItemData } from './useItemData';
import { useHasChanged } from './useHasChanged';
import {
  getBranchPrefix,
  getCollectionFormat,
  getCollectionItemPath,
  getRepoUrl,
  getSlugFromState,
  isCloudConfig,
  isGitHubConfig,
} from './utils';
import { notFound } from './not-found';
import { useConfig } from './shell/context';
import { useSlugFieldInfo } from './slugs';
import { z } from 'zod';
import { useData } from './useData';
import {
  delDraft,
  getDraft,
  setDraft,
  showDraftRestoredToast,
} from './persistence';
import { githubIcon } from '@keystar/ui/icon/icons/githubIcon';

type ItemPageProps = {
  collection: string;
  config: Config;
  initialFiles: string[];
  initialState: Record<string, unknown>;
  itemSlug: string;
  localTreeKey: string;
  basePath: string;
  draft:
    | { state: Record<string, unknown>; savedAt: Date; treeKey: string }
    | undefined;
};

const storedValSchema = z.object({
  version: z.literal(1),
  savedAt: z.date(),
  slug: z.string(),
  beforeTreeKey: z.string(),
  files: z.map(z.string(), z.instanceof(Uint8Array)),
});

function ItemPage(props: ItemPageProps) {
  const {
    collection,
    config,
    itemSlug,
    initialFiles,
    initialState,
    localTreeKey,
    draft,
  } = props;
  const router = useRouter();
  const [forceValidation, setForceValidation] = useState(false);
  const collectionConfig = config.collections![collection]!;
  const schema = useMemo(
    () => fields.object(collectionConfig.schema),
    [collectionConfig.schema]
  );

  const [{ state, localTreeKey: localTreeKeyInState }, setState] = useState({
    state: draft?.state ?? initialState,
    localTreeKey,
  });
  useEffect(() => {
    if (draft && state === draft.state) {
      showDraftRestoredToast(draft.savedAt, localTreeKey !== draft.treeKey);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);
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
    slug: { field: collectionConfig.slugField, value: slug },
  });

  useEffect(() => {
    const key = ['collection', collection, props.itemSlug] as const;
    if (hasChanged) {
      const serialized = serializeEntryToFiles({
        basePath: futureBasePath,
        config,
        format: getCollectionFormat(config, collection),
        schema: collectionConfig.schema,
        slug: { field: collectionConfig.slugField, value: slug },
        state,
      });
      const files = new Map(serialized.map(x => [x.path, x.contents]));
      const data: z.infer<typeof storedValSchema> = {
        beforeTreeKey: localTreeKey,
        slug,
        files,
        savedAt: new Date(),
        version: 1,
      };
      setDraft(key, data);
    } else {
      delDraft(key);
    }
  }, [
    collection,
    collectionConfig,
    config,
    futureBasePath,
    localTreeKey,
    props.itemSlug,
    slug,
    state,
    hasChanged,
  ]);
  const update = useEventCallback(_update);
  const [deleteResult, deleteItem, resetDeleteItem] = useDeleteItem({
    initialFiles,
    storage: config.storage,
    basePath: currentBasePath,
  });

  const onReset = () => {
    setState({ state: initialState, localTreeKey });
  };
  const onView = () => {
    let filePath =
      formatInfo.dataLocation === 'index'
        ? `/tree/${branchInfo.currentBranch}/${currentBasePath}`
        : `/blob/${
            branchInfo.currentBranch
          }/${currentBasePath}${getDataFileExtension(formatInfo)}`;
    window.open(
      `${getRepoUrl(branchInfo)}${filePath}`,
      '_blank',
      'noopener,noreferrer'
    );
  };
  const onPreview = collectionConfig.previewUrl
    ? () => {
        window.open(
          collectionConfig.previewUrl!.replace('{slug}', props.itemSlug),
          '_blank',
          'noopener,noreferrer'
        );
      }
    : undefined;
  const onDelete = async () => {
    if (await deleteItem()) {
      router.push(
        `${props.basePath}/collection/${encodeURIComponent(collection)}`
      );
    }
  };

  const onDuplicate = async () => {
    let hasUpdated = true;
    if (hasChanged) {
      hasUpdated = await onUpdate();
    }

    if (hasUpdated) {
      router.push(
        `${props.basePath}/collection/${encodeURIComponent(
          collection
        )}/create?duplicate=${slug}`
      );
    }
  };

  const slugInfo = useSlugFieldInfo(collection, itemSlug);

  const onUpdate = useCallback(async () => {
    if (!clientSideValidateProp(schema, state, slugInfo)) {
      setForceValidation(true);
      return false;
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
    return hasUpdated;
  }, [
    collection,
    collectionConfig,
    itemSlug,
    props.basePath,
    router,
    schema,
    slugInfo,
    state,
    update,
  ]);
  const formID = 'item-edit-form';

  // allow shortcuts "cmd+s" and "ctrl+s" to save
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (updateResult.kind === 'loading') {
        return;
      }
      if (isHotkey('mod+s', event)) {
        event.preventDefault();
        onUpdate();
      }
    };
    document.addEventListener('keydown', listener);
    return () => document.removeEventListener('keydown', listener);
  }, [updateResult.kind, onUpdate]);

  return (
    <>
      <ItemPageShell
        headerActions={
          <HeaderActions
            config={config}
            formID={formID}
            isLoading={updateResult.kind === 'loading'}
            hasChanged={hasChanged}
            onDelete={onDelete}
            onDuplicate={onDuplicate}
            onReset={onReset}
            onView={onView}
            onPreview={onPreview}
          />
        }
        {...props}
      >
        {updateResult.kind === 'error' && (
          <Notice tone="critical">{updateResult.error.message}</Notice>
        )}
        {deleteResult.kind === 'error' && (
          <Notice tone="critical">{deleteResult.error.message}</Notice>
        )}
        <Box
          id={formID}
          height="100%"
          minHeight={0}
          minWidth={0}
          elementType="form"
          onSubmit={(event: FormEvent) => {
            if (event.target !== event.currentTarget) return;
            event.preventDefault();
            onUpdate();
          }}
        >
          <FormForEntry
            previewProps={previewProps}
            forceValidation={forceValidation}
            entryLayout={collectionConfig.entryLayout}
            formatInfo={formatInfo}
            slugField={slugInfo}
          />
        </Box>
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
      </ItemPageShell>
    </>
  );
}

function HeaderActions(props: {
  config: Config;
  formID: string;
  hasChanged: boolean;
  isLoading: boolean;
  onDelete: () => void;
  onDuplicate: () => void;
  onReset: () => void;
  onView: () => void;
  onPreview?: () => void;
}) {
  let {
    config,
    formID,
    hasChanged,
    isLoading,
    onDelete,
    onDuplicate,
    onReset,
    onView,
    onPreview,
  } = props;
  const isBelowTablet = useMediaQuery(breakpointQueries.below.tablet);
  const isGithub = isGitHubConfig(config) || isCloudConfig(config);
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);
  const [deleteAlertIsOpen, setDeleteAlertOpen] = useState(false);
  const [duplicateAlertIsOpen, setDuplicateAlertOpen] = useState(false);
  const hasPreview = !!onPreview;
  const menuActions = useMemo(() => {
    type ActionType = {
      icon: ReactElement;
      isDisabled?: boolean;
      key: Key;
      label: string;
    };
    let items: ActionType[] = [
      {
        key: 'reset',
        label: 'Reset changes', // TODO: l10n
        icon: historyIcon,
      },
      {
        key: 'delete',
        label: 'Delete entry…', // TODO: l10n
        icon: trash2Icon,
      },
      {
        key: 'duplicate',
        label: 'Duplicate entry…', // TODO: l10n
        icon: copyPlusIcon,
      },
    ];
    if (hasPreview) {
      items.push({
        key: 'preview',
        label: 'Preview',
        icon: externalLinkIcon,
      });
    }
    if (isGithub) {
      items.push({
        key: 'view',
        label: 'View on GitHub',
        icon: githubIcon,
      });
    }

    return items;
  }, [isGithub, hasPreview]);

  const indicatorElement = (() => {
    if (isLoading) {
      return (
        <ProgressCircle
          aria-label="Saving changes"
          isIndeterminate
          size="small"
          alignSelf="center"
        />
      );
    }

    if (hasChanged) {
      return isBelowTablet ? (
        <Box
          backgroundColor="pendingEmphasis"
          height="scale.75"
          width="scale.75"
          borderRadius="full"
        >
          <Text visuallyHidden>Unsaved</Text>
        </Box>
      ) : (
        <Badge tone="pending">Unsaved</Badge>
      );
    }

    return null;
  })();

  return (
    <>
      {indicatorElement}
      <ActionGroup
        buttonLabelBehavior="hide"
        overflowMode="collapse"
        prominence="low"
        density="compact"
        maxWidth={isBelowTablet ? 'element.regular' : undefined} // force switch to action menu on small devices
        items={menuActions}
        disabledKeys={hasChanged ? [] : ['reset']}
        onAction={key => {
          switch (key) {
            case 'reset':
              onReset();
              break;
            case 'delete':
              setDeleteAlertOpen(true);
              break;
            case 'duplicate':
              if (hasChanged) {
                setDuplicateAlertOpen(true);
              } else {
                onDuplicate();
              }
              break;
            case 'preview':
              onPreview?.();
              break;
            case 'view':
              onView();
              break;
          }
        }}
      >
        {item => (
          <Item key={item.key} textValue={item.label}>
            <Icon src={item.icon} />
            <Text>{item.label}</Text>
          </Item>
        )}
      </ActionGroup>
      <Button
        form={formID}
        isDisabled={isLoading}
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
            onPrimaryAction={onDelete}
          >
            Are you sure? This action cannot be undone.
          </AlertDialog>
        )}
      </DialogContainer>
      <DialogContainer onDismiss={() => setDuplicateAlertOpen(false)}>
        {duplicateAlertIsOpen && (
          <AlertDialog
            title="Save and duplicate entry"
            tone="neutral"
            cancelLabel="Cancel"
            primaryActionLabel="Save and duplicate"
            autoFocusButton="primary"
            onPrimaryAction={onDuplicate}
          >
            You have unsaved changes. Save this entry to duplicate it.
          </AlertDialog>
        )}
      </DialogContainer>
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

  const config = useConfig();
  const branchPrefix = getBranchPrefix(config);
  const propsForBranchPrefix = branchPrefix
    ? {
        UNSAFE_className: css({
          '& input': {
            paddingInlineStart: tokenSchema.size.space.xsmall,
          },
        }),
        startElement: (
          <Flex
            alignItems="center"
            paddingStart="regular"
            justifyContent="center"
            pointerEvents="none"
          >
            <Text color="neutralSecondary">{branchPrefix}</Text>
          </Flex>
        ),
      }
    : {};
  return (
    <Dialog>
      <form
        style={{ display: 'contents' }}
        onSubmit={async event => {
          if (event.target !== event.currentTarget) return;
          event.preventDefault();
          const fullBranchName = (branchPrefix ?? '') + branchName;
          const name = `refs/heads/${fullBranchName}`;
          const result = await createBranch({
            input: { name, oid: props.branchOid, repositoryId },
          });
          if (result.data?.createRef?.__typename) {
            props.onCreate(fullBranchName);
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
              {...propsForBranchPrefix}
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

type ItemPageWrapperProps = {
  collection: string;
  itemSlug: string;
  config: Config;
  basePath: string;
};

function ItemPageWrapper(props: ItemPageWrapperProps) {
  const collectionConfig = props.config.collections?.[props.collection];
  if (!collectionConfig) notFound();
  const format = useMemo(
    () => getCollectionFormat(props.config, props.collection),
    [props.config, props.collection]
  );

  const slugInfo = useMemo(() => {
    return { slug: props.itemSlug, field: collectionConfig.slugField };
  }, [collectionConfig.slugField, props.itemSlug]);

  const draftData = useData(
    useCallback(async () => {
      const raw = await getDraft([
        'collection',
        props.collection,
        props.itemSlug,
      ]);
      if (!raw) throw new Error('No draft found');
      const stored = storedValSchema.parse(raw);
      const parsed = parseEntry(
        {
          config: props.config,
          dirpath: getCollectionItemPath(
            props.config,
            props.collection,
            stored.slug
          ),
          format,
          schema: collectionConfig.schema,
          slug: { field: collectionConfig.slugField, slug: stored.slug },
        },
        stored.files
      );
      return {
        state: parsed.initialState,
        savedAt: stored.savedAt,
        treeKey: stored.beforeTreeKey,
      };
    }, [
      collectionConfig,
      format,
      props.collection,
      props.config,
      props.itemSlug,
    ])
  );

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

  if (itemData.kind === 'error') {
    return (
      <ItemPageShell {...props}>
        <PageBody>
          <Notice tone="critical">{itemData.error.message}</Notice>
        </PageBody>
      </ItemPageShell>
    );
  }
  if (itemData.kind === 'loading' || draftData.kind === 'loading') {
    return (
      <ItemPageShell {...props}>
        <Flex
          alignItems="center"
          justifyContent="center"
          minHeight="scale.3000"
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

  if (itemData.data === 'not-found') {
    return (
      <ItemPageShell {...props}>
        <PageBody>
          <Notice tone="caution">Entry not found.</Notice>
        </PageBody>
      </ItemPageShell>
    );
  }
  const loadedDraft = draftData.kind === 'loaded' ? draftData.data : undefined;
  return (
    <ItemPage
      collection={props.collection}
      basePath={props.basePath}
      config={props.config}
      itemSlug={props.itemSlug}
      initialState={itemData.data.initialState}
      initialFiles={itemData.data.initialFiles}
      draft={loadedDraft}
      localTreeKey={itemData.data.localTreeKey}
    />
  );
}

const ItemPageShell = (
  props: ItemPageWrapperProps & {
    children: ReactNode;
    headerActions?: ReactNode;
  }
) => {
  const router = useRouter();
  const collectionConfig = props.config.collections![props.collection]!;

  return (
    <PageRoot containerWidth={containerWidthForEntryLayout(collectionConfig)}>
      <PageHeader>
        <Breadcrumbs
          flex
          size="medium"
          minWidth={0}
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
      </PageHeader>

      {props.children}
    </PageRoot>
  );
};

export { ItemPageWrapper as ItemPage };
