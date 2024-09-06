import { useLocalizedStringFormatter } from '@react-aria/i18n';
import { useCallback, useEffect, useMemo, useState } from 'react';
import * as Y from 'yjs';
import * as s from 'superstruct';

import { Button } from '@keystar/ui/button';
import { DialogContainer } from '@keystar/ui/dialog';
import { Icon } from '@keystar/ui/icon';
import { historyIcon } from '@keystar/ui/icon/icons/historyIcon';
import { Flex } from '@keystar/ui/layout';
import { Notice } from '@keystar/ui/notice';
import { ProgressCircle } from '@keystar/ui/progress';
import { toastQueue } from '@keystar/ui/toast';

import { Config } from '../config';
import { ComponentSchema, GenericPreviewProps, ObjectField } from '../form/api';
import { getInitialPropsValue } from '../form/initial-values';
import { clientSideValidateProp } from '../form/errors';
import { useEventCallback } from '../form/fields/document/DocumentEditor/ui-utils';

import { CreateBranchDuringUpdateDialog } from './ItemPage';
import l10nMessages from './l10n';
import { useBaseCommit, useCurrentBranch } from './shell/data';
import { PageRoot, PageHeader, PageBody } from './shell/page';
import { ForkRepoDialog } from './fork-repo';
import { FormForEntry, containerWidthForEntryLayout } from './entry-form';
import { notFound } from './not-found';
import { delDraft, getDraft, setDraft } from './persistence';
import { PresenceAvatars } from './presence';
import { useRouter } from './router';
import { HeaderBreadcrumbs } from './shell/HeaderBreadcrumbs';
import { useYjsIfAvailable } from './shell/collab';
import { useConfig } from './shell/context';
import { useSlugFieldInfo } from './slugs';
import { LOADING, useData } from './useData';
import { serializeEntryToFiles, useUpsertItem } from './updating';
import { parseEntry, useItemData } from './useItemData';
import { useHasChanged } from './useHasChanged';
import { useYJsValue } from './useYJsValue';
import {
  getCollectionFormat,
  getCollectionItemPath,
  getSlugFromState,
  isGitHubConfig,
  useShowRestoredDraftMessage,
} from './utils';
import {
  useCollection,
  usePreviewProps,
  usePreviewPropsFromY,
} from './preview-props';
import { useDuplicateSlug } from './duplicate-slug';
import { getYjsValFromParsedValue } from '../form/yjs-props-value';
import { setValueToPreviewProps } from '../form/get-value';
import { copyEntryToClipboard, getPastedEntry } from './entry-clipboard';
import { clipboardCopyIcon } from '@keystar/ui/icon/icons/clipboardCopyIcon';
import { clipboardPasteIcon } from '@keystar/ui/icon/icons/clipboardPasteIcon';
import { ActionGroup, Item } from '@keystar/ui/action-group';
import { Text } from '@keystar/ui/typography';
import { breakpointQueries, useMediaQuery } from '@keystar/ui/style';

function CreateItemWrapper(props: {
  collection: string;
  config: Config;
  basePath: string;
}) {
  const router = useRouter();
  const duplicateSlug = useMemo(() => {
    const url = new URL(router.href, 'http://localhost');
    return url.searchParams.get('duplicate');
  }, [router.href]);

  const collectionConfig = props.config.collections?.[props.collection];
  if (!collectionConfig) notFound();
  const format = useMemo(
    () => getCollectionFormat(props.config, props.collection),
    [props.config, props.collection]
  );

  const draftData = useData(
    useCallback(async () => {
      const raw = await getDraft([
        'collection-create',
        props.collection,
        ...(duplicateSlug ? ([duplicateSlug] as const) : ([] as const)),
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
          format,
          schema: collectionConfig.schema,
          slug: { field: collectionConfig.slugField, slug: stored.slug },
        },
        stored.files
      );
      return { state: parsed.initialState, savedAt: stored.savedAt };
    }, [
      collectionConfig,
      duplicateSlug,
      format,
      props.collection,
      props.config,
    ])
  );

  const slug = useMemo(() => {
    if (duplicateSlug) {
      return { field: collectionConfig.slugField, slug: duplicateSlug };
    }
    if (collectionConfig.template) {
      return { field: collectionConfig.slugField, slug: '' };
    }
  }, [duplicateSlug, collectionConfig]);

  const isFromTemplate = !!duplicateSlug || !!collectionConfig.template;

  const itemData = useItemData({
    config: props.config,
    dirpath:
      collectionConfig.template && !duplicateSlug
        ? collectionConfig.template
        : getCollectionItemPath(
            props.config,
            props.collection,
            duplicateSlug ?? ''
          ),
    schema: collectionConfig.schema,
    format,
    slug,
  });

  const duplicateInitalState =
    isFromTemplate &&
    itemData.kind === 'loaded' &&
    itemData.data !== 'not-found'
      ? itemData.data.initialState
      : undefined;

  const duplicateInitalStateWithUpdatedSlug = useDuplicateSlug(
    duplicateInitalState,
    collectionConfig
  );

  const currentBranch = useCurrentBranch();
  const yjsInfo = useYjsIfAvailable();
  const key = `${currentBranch}/${props.collection}/create${
    duplicateSlug?.length ? `?duplicate=${duplicateSlug}` : ''
  }`;

  const mapData = useData(
    useCallback(async () => {
      if (!yjsInfo) return;
      if (yjsInfo === 'loading') return LOADING;
      await yjsInfo.doc.whenSynced;
      if (isFromTemplate && !duplicateInitalState) return LOADING;
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
      if (!data.size) {
        doc.transact(() => {
          for (const [key, value] of Object.entries(collectionConfig.schema)) {
            const val = getYjsValFromParsedValue(
              value,
              duplicateInitalState?.[key] ?? getInitialPropsValue(value)
            );
            data.set(key, val);
          }
        });
      }
      return data;
    }, [collectionConfig, duplicateInitalState, isFromTemplate, key, yjsInfo])
  );

  if (isFromTemplate && itemData.kind === 'error') {
    return (
      <PageBody>
        <Notice tone="critical">{itemData.error.message}</Notice>
      </PageBody>
    );
  }
  if (mapData.kind === 'error') {
    console.log(mapData.error);
    return (
      <PageBody>
        <Notice tone="critical">{mapData.error.message}</Notice>
      </PageBody>
    );
  }
  if (
    (isFromTemplate && itemData.kind === 'loading') ||
    draftData.kind === 'loading' ||
    mapData.kind === 'loading'
  ) {
    return (
      <Flex alignItems="center" justifyContent="center" minHeight="scale.3000">
        <ProgressCircle
          aria-label="Loading Item"
          isIndeterminate
          size="large"
        />
      </Flex>
    );
  }
  if (
    isFromTemplate &&
    itemData.kind === 'loaded' &&
    itemData.data === 'not-found'
  ) {
    return (
      <PageBody>
        <Notice tone="caution">Entry not found.</Notice>
      </PageBody>
    );
  }

  if (!mapData.data) {
    return (
      <CreateItemLocal
        collection={props.collection}
        config={props.config}
        basePath={props.basePath}
        draft={draftData.kind === 'loaded' ? draftData.data : undefined}
        duplicateSlug={duplicateSlug}
        initialState={duplicateInitalStateWithUpdatedSlug}
      />
    );
  }
  return (
    <CreateItemCollab
      collection={props.collection}
      config={props.config}
      basePath={props.basePath}
      duplicateSlug={duplicateSlug}
      initialState={duplicateInitalStateWithUpdatedSlug}
      map={mapData.data}
    />
  );
}

const storedValSchema = s.type({
  version: s.literal(1),
  savedAt: s.date(),
  slug: s.string(),
  files: s.map(s.string(), s.instance(Uint8Array)),
});

function CreateItemLocal(props: {
  collection: string;
  config: Config;
  basePath: string;
  duplicateSlug: string | null;
  draft: { state: Record<string, unknown>; savedAt: Date } | undefined;
  initialState: Record<string, unknown> | undefined;
}) {
  const { collectionConfig, schema } = useCollection(props.collection);
  const initialState = useMemo(() => {
    return props.initialState ?? getInitialPropsValue(schema);
  }, [props.initialState, schema]);
  const [state, setState] = useState(props.draft?.state ?? initialState);

  const previewProps = usePreviewProps(schema, setState, state);

  useShowRestoredDraftMessage(props.draft, state, undefined);

  const slug = getSlugFromState(collectionConfig, state);

  const formatInfo = getCollectionFormat(props.config, props.collection);

  const basePath = getCollectionItemPath(props.config, props.collection, slug);
  const [createResult, _createItem, resetCreateItemState] = useUpsertItem({
    state,
    basePath,
    initialFiles: undefined,
    config: props.config,
    schema: collectionConfig.schema,
    format: formatInfo,
    currentLocalTreeKey: undefined,
    slug: { field: collectionConfig.slugField, value: slug },
  });
  const createItem = useEventCallback(_createItem);

  const hasChanged = useHasChanged({
    initialState,
    schema,
    state,
    slugField: collectionConfig.slugField,
  });
  const hasCreated =
    createResult.kind === 'updated' || createResult.kind === 'loading';

  useEffect(() => {
    const key = [
      'collection-create',
      props.collection,
      ...(props.duplicateSlug
        ? ([props.duplicateSlug] as const)
        : ([] as const)),
    ] as const;
    if (hasChanged && !hasCreated) {
      const serialized = serializeEntryToFiles({
        basePath,
        format: formatInfo,
        schema: collectionConfig.schema,
        slug: { field: collectionConfig.slugField, value: slug },
        state,
      });
      const files = new Map(serialized.map(x => [x.path, x.contents]));
      const data: s.Infer<typeof storedValSchema> = {
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
    collectionConfig,
    slug,
    state,
    hasChanged,
    props.duplicateSlug,
    props.collection,
    basePath,
    formatInfo,
    hasCreated,
  ]);
  return (
    <CreateItemInner
      basePath={props.basePath}
      collection={props.collection}
      createResult={createResult}
      createItem={createItem}
      resetCreateItemState={resetCreateItemState}
      state={state}
      slug={slug}
      previewProps={previewProps}
      onReset={() => {
        setState(initialState);
      }}
    />
  );
}

function CreateItemCollab(props: {
  collection: string;
  config: Config;
  basePath: string;
  duplicateSlug: string | null;
  initialState: Record<string, unknown> | undefined;
  map: Y.Map<unknown>;
}) {
  const { collectionConfig, schema } = useCollection(props.collection);
  const state = useYJsValue(schema, props.map) as Record<string, unknown>;
  const previewProps = usePreviewPropsFromY(schema, props.map, state);

  const slug = getSlugFromState(collectionConfig, state);

  const formatInfo = getCollectionFormat(props.config, props.collection);

  const basePath = getCollectionItemPath(props.config, props.collection, slug);
  const [createResult, _createItem, resetCreateItemState] = useUpsertItem({
    state,
    basePath,
    initialFiles: undefined,
    config: props.config,
    schema: collectionConfig.schema,
    format: formatInfo,
    currentLocalTreeKey: undefined,
    slug: { field: collectionConfig.slugField, value: slug },
  });
  const createItem = useEventCallback(_createItem);

  return (
    <CreateItemInner
      basePath={props.basePath}
      collection={props.collection}
      createResult={createResult}
      createItem={createItem}
      resetCreateItemState={resetCreateItemState}
      state={state}
      slug={slug}
      previewProps={previewProps}
      onReset={() => {
        props.map.doc?.transact(() => {
          for (const [key, value] of Object.entries(collectionConfig.schema)) {
            const val = getYjsValFromParsedValue(
              value,
              props.initialState?.[key] ?? getInitialPropsValue(value)
            );
            props.map.set(key, val);
          }
        });
      }}
    />
  );
}

function CreateItemInner(props: {
  basePath: string;
  collection: string;
  createResult: ReturnType<typeof useUpsertItem>[0];
  createItem: ReturnType<typeof useUpsertItem>[1];
  resetCreateItemState: ReturnType<typeof useUpsertItem>[2];
  state: Record<string, unknown>;
  slug: string;
  previewProps: GenericPreviewProps<
    ObjectField<Record<string, ComponentSchema>>,
    undefined
  >;
  onReset: () => void;
}) {
  const { onReset } = props;
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);
  const router = useRouter();
  const config = useConfig();

  const { collectionConfig, schema } = useCollection(props.collection);

  const [forceValidation, setForceValidation] = useState(false);
  const formatInfo = getCollectionFormat(config, props.collection);

  const baseCommit = useBaseCommit();

  let collectionPath = `${props.basePath}/collection/${encodeURIComponent(
    props.collection
  )}`;

  const { createResult } = props;

  const currentSlug =
    createResult.kind === 'updated' || createResult.kind === 'loading'
      ? props.slug
      : undefined;
  const slugInfo = useSlugFieldInfo(props.collection, currentSlug);

  const onCreate = async () => {
    if (createResult.kind === 'loading') return;
    if (!clientSideValidateProp(schema, props.state, slugInfo)) {
      setForceValidation(true);
      return;
    }
    if (await props.createItem()) {
      const slug = getSlugFromState(collectionConfig, props.state);
      router.push(`${collectionPath}/item/${encodeURIComponent(slug)}`);
      toastQueue.positive('Entry created', { timeout: 5000 }); // TODO: l10n
    }
  };

  const onCopy = () => {
    copyEntryToClipboard(props.state, formatInfo, collectionConfig.schema, {
      field: collectionConfig.slugField,
      value: getSlugFromState(collectionConfig, props.state),
    });
  };

  const onPaste = async () => {
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
  };

  // note we're still "loading" when it's already been created
  // since we're waiting to go to the item page
  const isLoading =
    createResult.kind === 'loading' || createResult.kind === 'updated';

  const formID = 'item-create-form';
  const breadcrumbItems = useMemo(
    () => [
      {
        key: 'collection',
        label: collectionConfig.label,
        href: collectionPath,
      },
      { key: 'current', label: stringFormatter.format('add') },
    ],
    [collectionConfig.label, stringFormatter, collectionPath]
  );

  const isBelowDesktop = useMediaQuery(breakpointQueries.below.desktop);

  return (
    <>
      <PageRoot containerWidth={containerWidthForEntryLayout(collectionConfig)}>
        <PageHeader>
          <HeaderBreadcrumbs items={breadcrumbItems} />
          <PresenceAvatars />
          {isLoading && (
            <ProgressCircle
              aria-label="Creating entry"
              isIndeterminate
              size="small"
            />
          )}
          <ActionGroup
            buttonLabelBehavior="hide"
            overflowMode="collapse"
            prominence="low"
            density="compact"
            maxWidth={isBelowDesktop ? 'element.regular' : undefined} // force switch to action menu on small devices
            items={menuActions}
            onAction={key => {
              switch (key) {
                case 'reset':
                  onReset();
                  setForceValidation(false);
                  break;
                case 'copy':
                  onCopy();
                  break;
                case 'paste':
                  onPaste();
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
            isDisabled={isLoading}
            prominence="high"
            type="submit"
            form={formID}
            marginStart="auto"
          >
            {stringFormatter.format('create')}
          </Button>
        </PageHeader>
        <Flex
          id={formID}
          elementType="form"
          onSubmit={event => {
            if (event.target !== event.currentTarget) return;
            event.preventDefault();
            onCreate();
          }}
          direction="column"
          gap="xxlarge"
          height="100%"
          minHeight={0}
          minWidth={0}
        >
          {createResult.kind === 'error' && (
            <Notice tone="critical">{createResult.error.message}</Notice>
          )}
          <FormForEntry
            previewProps={props.previewProps}
            forceValidation={forceValidation}
            entryLayout={collectionConfig.entryLayout}
            formatInfo={formatInfo}
            slugField={slugInfo}
          />
        </Flex>
      </PageRoot>

      <DialogContainer
        // ideally this would be a popover on desktop but using a DialogTrigger
        // wouldn't work since this doesn't open on click but after doing a
        // network request and it failing and manually wiring about a popover
        // and modal would be a pain
        onDismiss={props.resetCreateItemState}
      >
        {createResult.kind === 'needs-new-branch' && (
          <CreateBranchDuringUpdateDialog
            branchOid={baseCommit}
            onCreate={async newBranch => {
              router.push(
                `/keystatic/branch/${encodeURIComponent(
                  newBranch
                )}/collection/${encodeURIComponent(props.collection)}/create`
              );
              if (
                await props.createItem({ branch: newBranch, sha: baseCommit })
              ) {
                const slug = getSlugFromState(collectionConfig, props.state);

                router.push(
                  `/keystatic/branch/${encodeURIComponent(
                    newBranch
                  )}/collection/${encodeURIComponent(
                    props.collection
                  )}/item/${encodeURIComponent(slug)}`
                );
              }
            }}
            reason={createResult.reason}
            onDismiss={props.resetCreateItemState}
          />
        )}
      </DialogContainer>
      <DialogContainer
        // ideally this would be a popover on desktop but using a DialogTrigger
        // wouldn't work since this doesn't open on click but after doing a
        // network request and it failing and manually wiring about a popover
        // and modal would be a pain
        onDismiss={props.resetCreateItemState}
      >
        {createResult.kind === 'needs-fork' && isGitHubConfig(config) && (
          <ForkRepoDialog
            onCreate={async () => {
              if (await props.createItem()) {
                const slug = getSlugFromState(collectionConfig, props.state);
                router.push(
                  `${collectionPath}/item/${encodeURIComponent(slug)}`
                );
              }
            }}
            onDismiss={props.resetCreateItemState}
            config={config}
          />
        )}
      </DialogContainer>
    </>
  );
}

const menuActions = [
  {
    key: 'reset',
    label: 'Reset',
    icon: historyIcon,
  },
  {
    key: 'copy',
    label: 'Copy entry',
    icon: clipboardCopyIcon,
  },
  {
    key: 'paste',
    label: 'Paste entry',
    icon: clipboardPasteIcon,
  },
];

export { CreateItemWrapper as CreateItem };
