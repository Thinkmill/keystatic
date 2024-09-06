import { useLocalizedStringFormatter } from '@react-aria/i18n';
import { isHotkey } from 'is-hotkey';
import {
  FormEvent,
  Key,
  ReactElement,
  ReactNode,
  Suspense,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from 'react';
import * as Y from 'yjs';
import * as s from 'superstruct';

import { ActionGroup, Item } from '@keystar/ui/action-group';
import { Badge } from '@keystar/ui/badge';
import { Button, ButtonGroup } from '@keystar/ui/button';
import { AlertDialog, Dialog, DialogContainer } from '@keystar/ui/dialog';
import { Icon } from '@keystar/ui/icon';
import { copyPlusIcon } from '@keystar/ui/icon/icons/copyPlusIcon';
import { clipboardCopyIcon } from '@keystar/ui/icon/icons/clipboardCopyIcon';
import { clipboardPasteIcon } from '@keystar/ui/icon/icons/clipboardPasteIcon';
import { externalLinkIcon } from '@keystar/ui/icon/icons/externalLinkIcon';
import { githubIcon } from '@keystar/ui/icon/icons/githubIcon';
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
import { ComponentSchema, GenericPreviewProps, ObjectField } from '../form/api';
import { clientSideValidateProp } from '../form/errors';
import { useEventCallback } from '../form/fields/document/DocumentEditor/ui-utils';
import { getYjsValFromParsedValue } from '../form/yjs-props-value';

import {
  prettyErrorForCreateBranchMutation,
  useCreateBranchMutation,
} from './branch-selection';
import { FormForEntry, containerWidthForEntryLayout } from './entry-form';
import { ForkRepoDialog } from './fork-repo';
import l10nMessages from './l10n';
import { NotFoundBoundary, notFound } from './not-found';
import { getDataFileExtension, getPathPrefix } from './path-utils';
import { useRouter } from './router';
import { HeaderBreadcrumbs } from './shell/HeaderBreadcrumbs';
import { useYjsIfAvailable } from './shell/collab';
import { useConfig } from './shell/context';
import { useBaseCommit, useCurrentBranch, useRepoInfo } from './shell/data';
import { PageBody, PageHeader, PageRoot } from './shell/page';
import { useSlugFieldInfo } from './slugs';
import { delDraft, getDraft, setDraft } from './persistence';
import { PresenceAvatars } from './presence';
import {
  serializeEntryToFiles,
  useDeleteItem,
  useUpsertItem,
} from './updating';
import { useHasChanged } from './useHasChanged';
import { parseEntry, useItemData } from './useItemData';
import {
  getBranchPrefix,
  getCollection,
  getCollectionFormat,
  getCollectionItemPath,
  getRepoUrl,
  getSlugFromState,
  isGitHubConfig,
  useShowRestoredDraftMessage,
} from './utils';
import { DataState, LOADING, useData, suspendOnData } from './useData';
import { useYJsValue } from './useYJsValue';
import {
  useCollection,
  usePreviewProps,
  usePreviewPropsFromY,
} from './preview-props';
import { ErrorBoundary } from './error-boundary';
import { copyEntryToClipboard, getPastedEntry } from './entry-clipboard';
import { setValueToPreviewProps } from '../form/get-value';
import { toastQueue } from '@keystar/ui/toast';

type ItemPageProps = {
  collection: string;
  config: Config;
  initialFiles: string[];
  initialState: Record<string, unknown>;
  itemSlug: string;
  localTreeKey: string;
  basePath: string;
};

const storedValSchema = s.type({
  version: s.literal(1),
  savedAt: s.date(),
  slug: s.string(),
  beforeTreeKey: s.string(),
  files: s.map(s.string(), s.instance(Uint8Array)),
});

function ItemPageInner(
  props: ItemPageProps & {
    onUpdate: (options?: { branch: string; sha: string }) => Promise<boolean>;
    onReset: () => void;
    updateResult: ReturnType<typeof useUpsertItem>[0];
    onResetUpdateItem: () => void;
    previewProps: GenericPreviewProps<
      ObjectField<Record<string, ComponentSchema>>,
      undefined
    >;
    hasChanged: boolean;
    state: Record<string, unknown>;
  }
) {
  const {
    collection,
    config,
    itemSlug,
    updateResult,
    onUpdate: parentOnUpdate,
  } = props;
  const { collectionConfig, schema } = useCollection(collection);

  const router = useRouter();
  const baseCommit = useBaseCommit();
  const currentBasePath = getCollectionItemPath(config, collection, itemSlug);
  const formatInfo = getCollectionFormat(config, collection);
  const currentBranch = useCurrentBranch();
  const repoInfo = useRepoInfo();
  const [forceValidation, setForceValidation] = useState(false);
  const previewHref = collectionConfig.previewUrl
    ? collectionConfig.previewUrl
        .replace('{slug}', props.itemSlug)
        .replace('{branch}', currentBranch)
    : undefined;
  const { push, replace } = router;

  const slugInfo = useSlugFieldInfo(collection, itemSlug);

  const [deleteResult, deleteItem, resetDeleteItem] = useDeleteItem({
    initialFiles: props.initialFiles,
    storage: config.storage,
    basePath: currentBasePath,
  });

  const onDelete = useEventCallback(async () => {
    // TODO: delete multiplayer draft
    if (await deleteItem()) {
      push(`${props.basePath}/collection/${encodeURIComponent(collection)}`);
    }
  });

  const onDuplicate = () => {
    push(
      `${props.basePath}/collection/${encodeURIComponent(
        collection
      )}/create?duplicate=${itemSlug}`
    );
  };
  const isSavingDisabled = updateResult.kind === 'loading' || !props.hasChanged;

  const onUpdate = useEventCallback(async () => {
    if (isSavingDisabled) return false;
    if (!clientSideValidateProp(schema, props.state, slugInfo)) {
      setForceValidation(true);
      return false;
    }
    const slug = getSlugFromState(collectionConfig, props.state);
    const hasUpdated = await parentOnUpdate();
    if (hasUpdated && slug !== itemSlug) {
      replace(
        `${props.basePath}/collection/${encodeURIComponent(
          collection
        )}/item/${encodeURIComponent(slug)}`
      );
    }
    return hasUpdated;
  });

  const onCopy = useEventCallback(() => {
    copyEntryToClipboard(props.state, formatInfo, collectionConfig.schema, {
      field: collectionConfig.slugField,
      value: getSlugFromState(collectionConfig, props.state),
    });
  });

  const onPaste = useEventCallback(async () => {
    const entry = await getPastedEntry(formatInfo, collectionConfig.schema, {
      field: collectionConfig.slugField,
      slug: getSlugFromState(collectionConfig, props.state),
    });
    if (entry) {
      setValueToPreviewProps(entry, props.previewProps);
      toastQueue.positive('Entry pasted', {
        shouldCloseOnAction: true,
        actionLabel: 'Undo',
        onAction: () => {
          setValueToPreviewProps(props.state, props.previewProps);
        },
      });
    }
  });

  const viewHref =
    config.storage.kind !== 'local' && repoInfo
      ? `${getRepoUrl(repoInfo)}${
          formatInfo.dataLocation === 'index'
            ? `/tree/${currentBranch}/${
                getPathPrefix(config.storage) ?? ''
              }${currentBasePath}`
            : `/blob/${currentBranch}/${
                getPathPrefix(config.storage) ?? ''
              }${currentBasePath}${getDataFileExtension(formatInfo)}`
        }`
      : undefined;

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
            formID={formID}
            isLoading={updateResult.kind === 'loading'}
            hasChanged={props.hasChanged}
            onDelete={onDelete}
            onDuplicate={onDuplicate}
            onCopy={onCopy}
            onPaste={onPaste}
            onReset={props.onReset}
            viewHref={viewHref}
            previewHref={previewHref}
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
            previewProps={props.previewProps as any}
            forceValidation={forceValidation}
            entryLayout={collectionConfig.entryLayout}
            formatInfo={formatInfo}
            slugField={slugInfo}
          />
        </Box>
        <DialogContainer
          // ideally this would be a popover on desktop but using a DialogTrigger wouldn't work since
          // this doesn't open on click but after doing a network request and it failing and manually wiring about a popover and modal would be a pain
          onDismiss={props.onResetUpdateItem}
        >
          {updateResult.kind === 'needs-new-branch' && (
            <CreateBranchDuringUpdateDialog
              branchOid={baseCommit}
              onCreate={async newBranch => {
                const itemBasePath = `/keystatic/branch/${encodeURIComponent(
                  newBranch
                )}/collection/${encodeURIComponent(collection)}/item/`;
                router.push(itemBasePath + encodeURIComponent(itemSlug));
                const slug = getSlugFromState(collectionConfig, props.state);

                const hasUpdated = await parentOnUpdate({
                  branch: newBranch,
                  sha: baseCommit,
                });
                if (hasUpdated && slug !== itemSlug) {
                  router.replace(itemBasePath + encodeURIComponent(slug));
                }
              }}
              reason={updateResult.reason}
              onDismiss={props.onResetUpdateItem}
            />
          )}
        </DialogContainer>
        <DialogContainer
          // ideally this would be a popover on desktop but using a DialogTrigger
          // wouldn't work since this doesn't open on click but after doing a
          // network request and it failing and manually wiring about a popover
          // and modal would be a pain
          onDismiss={props.onResetUpdateItem}
        >
          {updateResult.kind === 'needs-fork' &&
            isGitHubConfig(props.config) && (
              <ForkRepoDialog
                onCreate={async () => {
                  const slug = getSlugFromState(collectionConfig, props.state);
                  const hasUpdated = await props.onUpdate();
                  if (hasUpdated && slug !== itemSlug) {
                    router.replace(
                      `${props.basePath}/collection/${encodeURIComponent(
                        collection
                      )}/item/${encodeURIComponent(slug)}`
                    );
                  }
                }}
                onDismiss={props.onResetUpdateItem}
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

function LocalItemPage(
  props: ItemPageProps & {
    draft:
      | { state: Record<string, unknown>; savedAt: Date; treeKey: string }
      | undefined;
  }
) {
  const {
    collection,
    config,
    initialFiles,
    initialState,
    localTreeKey,
    draft,
  } = props;
  const { collectionConfig, schema } = useCollection(collection);

  const [{ state, localTreeKey: localTreeKeyInState }, setState] = useState({
    state: draft?.state ?? initialState,
    localTreeKey,
  });

  useShowRestoredDraftMessage(draft, state, localTreeKey);

  if (localTreeKeyInState !== localTreeKey) {
    setState({ state: initialState, localTreeKey });
  }

  const onPreviewPropsChange = useCallback(
    (
      stateUpdater: (state: Record<string, unknown>) => Record<string, unknown>
    ) => {
      setState(state => ({
        localTreeKey: state.localTreeKey,
        state: stateUpdater(state.state),
      }));
    },
    []
  );

  const previewProps = usePreviewProps(schema, onPreviewPropsChange, state);

  const hasChanged = useHasChanged({
    initialState,
    schema,
    state,
    slugField: collectionConfig.slugField,
  });

  const slug = getSlugFromState(collectionConfig, state);
  const formatInfo = getCollectionFormat(config, collection);
  const futureBasePath = getCollectionItemPath(config, collection, slug);
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
        format: getCollectionFormat(config, collection),
        schema: collectionConfig.schema,
        slug: { field: collectionConfig.slugField, value: slug },
        state,
      });
      const files = new Map(serialized.map(x => [x.path, x.contents]));
      const data: s.Infer<typeof storedValSchema> = {
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

  const onReset = () => {
    setState({ state: initialState, localTreeKey });
  };
  return (
    <ItemPageInner
      {...props}
      onUpdate={update}
      onReset={onReset}
      updateResult={updateResult}
      onResetUpdateItem={resetUpdateItem}
      previewProps={previewProps}
      state={state}
      hasChanged={hasChanged}
    />
  );
}

function CollabItemPage(props: ItemPageProps & { map: Y.Map<any> }) {
  const { collection, config, initialFiles, initialState, localTreeKey } =
    props;
  const { collectionConfig, schema } = useCollection(collection);
  const state = useYJsValue(schema, props.map) as Record<string, unknown>;

  const previewProps = usePreviewPropsFromY(schema, props.map, state);

  const slug = getSlugFromState(collectionConfig, state);

  const formatInfo = getCollectionFormat(props.config, props.collection);

  const hasChanged = useHasChanged({
    initialState,
    schema,
    state,
    slugField: collectionConfig.slugField,
  });

  const futureBasePath = getCollectionItemPath(config, collection, slug);
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

  const update = useEventCallback(_update);

  const onReset = () => {
    props.map.doc?.transact(() => {
      for (const [key, value] of Object.entries(collectionConfig.schema)) {
        const val = getYjsValFromParsedValue(value, props.initialState[key]);
        props.map.set(key, val);
      }
    });
  };
  return (
    <ItemPageInner
      {...props}
      onUpdate={update}
      onReset={onReset}
      updateResult={updateResult}
      onResetUpdateItem={resetUpdateItem}
      previewProps={previewProps}
      state={state}
      hasChanged={hasChanged}
    />
  );
}

function HeaderActions(props: {
  formID: string;
  hasChanged: boolean;
  isLoading: boolean;
  onDelete: () => void;
  onDuplicate: () => void;
  onReset: () => void;
  onCopy: () => void;
  onPaste: () => void;
  previewHref?: string;
  viewHref?: string;
}) {
  let {
    formID,
    hasChanged,
    isLoading,
    onDelete,
    onDuplicate,
    onReset,
    onCopy,
    onPaste,
    previewHref,
    viewHref,
  } = props;
  const isBelowDesktop = useMediaQuery(breakpointQueries.below.desktop);
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);
  const [deleteAlertIsOpen, setDeleteAlertOpen] = useState(false);
  const [duplicateAlertIsOpen, setDuplicateAlertOpen] = useState(false);
  const menuActions = useMemo(() => {
    type ActionType = {
      icon: ReactElement;
      isDisabled?: boolean;
      key: Key;
      label: string;
      href?: string;
      target?: string;
      rel?: string;
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
        key: 'copy',
        label: 'Copy entry', // TODO: l10n
        icon: clipboardCopyIcon,
      },
      {
        key: 'paste',
        label: 'Paste entry', // TODO: l10n
        icon: clipboardPasteIcon,
      },
      {
        key: 'duplicate',
        label: 'Duplicate entry…', // TODO: l10n
        icon: copyPlusIcon,
      },
    ];
    if (previewHref) {
      items.push({
        key: 'preview',
        label: 'Preview',
        icon: externalLinkIcon,
        href: previewHref,
        target: '_blank',
        rel: 'noopener noreferrer',
      });
    }
    if (viewHref) {
      items.push({
        key: 'view',
        label: 'View on GitHub',
        icon: githubIcon,
        href: viewHref,
        target: '_blank',
        rel: 'noopener noreferrer',
      });
    }

    return items;
  }, [previewHref, viewHref]);

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
      return isBelowDesktop ? (
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
    <Flex alignItems="center" gap={{ mobile: 'small', tablet: 'regular' }}>
      <PresenceAvatars />
      {indicatorElement}
      <ActionGroup
        buttonLabelBehavior="hide"
        overflowMode="collapse"
        prominence="low"
        density="compact"
        maxWidth={isBelowDesktop ? 'element.regular' : undefined} // force switch to action menu on small devices
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
            case 'copy':
              onCopy();
              break;
            case 'paste':
              onPaste();
              break;
            case 'duplicate':
              if (hasChanged) {
                setDuplicateAlertOpen(true);
              } else {
                onDuplicate();
              }
              break;
          }
        }}
      >
        {item => (
          <Item
            key={item.key}
            textValue={item.label}
            href={item.href}
            target={item.target}
            rel={item.rel}
          >
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
    </Flex>
  );
}

export function CreateBranchDuringUpdateDialog(props: {
  branchOid: string;
  onCreate: (branchName: string) => void;
  onDismiss: () => void;
  reason: string;
}) {
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);
  const repoInfo = useRepoInfo();
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
            input: { name, oid: props.branchOid, repositoryId: repoInfo!.id },
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
              errorMessage={prettyErrorForCreateBranchMutation(error)}
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

function ItemPageOuterWrapper(props: ItemPageWrapperProps) {
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
      try {
        const raw = await getDraft([
          'collection',
          props.collection,
          props.itemSlug,
        ]);
        if (!raw) throw new Error('No draft found');
        const stored = storedValSchema.create(raw);
        const parsed = parseEntry(
          {
            dirpath: getCollectionItemPath(
              props.config,
              props.collection,
              stored.slug
            ),
            format: getCollectionFormat(props.config, props.collection),
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
      } catch {}
    }, [collectionConfig, props.collection, props.config, props.itemSlug])
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

  const currentBranch = useCurrentBranch();

  const key = `${currentBranch}/${props.collection}/item/${props.itemSlug}`;

  const yjsInfo = useYjsIfAvailable();

  const isItemDataLoading = itemData.kind !== 'loaded';
  const isItemNotFound = !isItemDataLoading && itemData.data === 'not-found';
  const mapData = useData(
    useCallback(() => {
      if (!yjsInfo) return;
      if (yjsInfo === 'loading') return LOADING;
      if (isItemDataLoading) return LOADING;
      if (isItemNotFound) return;
      return (async () => {
        await yjsInfo.doc.whenSynced;
        let doc = yjsInfo.data.get(key);
        if (doc instanceof Y.Doc) {
          const promise = doc.whenLoaded;
          doc.load();
          await promise;
        } else {
          doc = new Y.Doc();
          yjsInfo.data.set(key, doc);
        }
        const data = doc.getMap('data');

        return data;
      })();
    }, [isItemDataLoading, isItemNotFound, key, yjsInfo])
  );

  return (
    <NotFoundBoundary
      fallback={
        <ItemPageShell {...props}>
          <PageBody>
            <Notice tone="caution">Entry not found.</Notice>
          </PageBody>
        </ItemPageShell>
      }
    >
      <ErrorBoundary
        fallback={message => (
          <ItemPageShell {...props}>
            <PageBody>
              <Notice tone="critical">{message}</Notice>
            </PageBody>
          </ItemPageShell>
        )}
      >
        <Suspense
          fallback={
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
          }
        >
          <ItemPageWrapper
            mapData={mapData}
            draftData={draftData}
            itemData={itemData}
            {...props}
          />
        </Suspense>
      </ErrorBoundary>
    </NotFoundBoundary>
  );
}

function ItemPageWrapper(
  props: ItemPageWrapperProps & {
    draftData: DataState<
      { state: any; savedAt: Date; treeKey: string } | undefined
    >;
    mapData: DataState<Y.Map<any> | undefined>;
    itemData: DataState<
      | 'not-found'
      | {
          initialState: Record<string, unknown>;
          initialFiles: string[];
          localTreeKey: string;
        }
    >;
  }
) {
  const collectionConfig = getCollection(props.config, props.collection);
  const deferredDraftData = useDeferredValue(props.draftData);
  const itemData = suspendOnData(props.itemData);
  if (itemData === 'not-found') notFound();
  const mapData = suspendOnData(props.mapData);

  useMemo(() => {
    if (!mapData || mapData.size) {
      return;
    }

    const { initialState } = itemData;
    mapData.doc?.transact(() => {
      for (const [key, value] of Object.entries(collectionConfig.schema)) {
        const val = getYjsValFromParsedValue(value, initialState[key]);
        mapData.set(key, val);
      }
    });
  }, [collectionConfig.schema, itemData, mapData]);

  const loadedDraft = suspendOnData(deferredDraftData);
  if (mapData) {
    return (
      <CollabItemPage
        collection={props.collection}
        basePath={props.basePath}
        config={props.config}
        itemSlug={props.itemSlug}
        initialState={itemData.initialState}
        initialFiles={itemData.initialFiles}
        localTreeKey={itemData.localTreeKey}
        map={mapData}
      />
    );
  }
  return (
    <LocalItemPage
      collection={props.collection}
      basePath={props.basePath}
      config={props.config}
      itemSlug={props.itemSlug}
      initialState={itemData.initialState}
      initialFiles={itemData.initialFiles}
      draft={loadedDraft}
      localTreeKey={itemData.localTreeKey}
    />
  );
}

function ItemPageShell(
  props: ItemPageWrapperProps & {
    children: ReactNode;
    headerActions?: ReactNode;
  }
) {
  const collectionConfig = getCollection(props.config, props.collection);
  const collectionHref = `${props.basePath}/collection/${props.collection}`;
  const breadcrumbItems = [
    {
      key: 'collection',
      label: collectionConfig.label,
      href: collectionHref,
    },
    { key: 'item', label: props.itemSlug },
  ];

  return (
    <PageRoot containerWidth={containerWidthForEntryLayout(collectionConfig)}>
      <PageHeader>
        <HeaderBreadcrumbs items={breadcrumbItems} />
        {props.headerActions}
      </PageHeader>

      {props.children}
    </PageRoot>
  );
}

export { ItemPageOuterWrapper as ItemPage };
