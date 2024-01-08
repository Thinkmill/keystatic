import { useLocalizedStringFormatter } from '@react-aria/i18n';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { Button } from '@keystar/ui/button';
import { Breadcrumbs, Item } from '@keystar/ui/breadcrumbs';
import { DialogContainer } from '@keystar/ui/dialog';
import { Flex } from '@keystar/ui/layout';
import { Notice } from '@keystar/ui/notice';
import { ProgressCircle } from '@keystar/ui/progress';
import { toastQueue } from '@keystar/ui/toast';

import { Config } from '../config';
import { fields } from '../form/api';
import { getInitialPropsValue } from '../form/initial-values';
import { createGetPreviewProps } from '../form/preview-props';
import { clientSideValidateProp } from '../form/errors';
import { useEventCallback } from '../form/fields/document/DocumentEditor/ui-utils';
import {
  getCollectionFormat,
  getCollectionItemPath,
  getSlugFromState,
  isGitHubConfig,
} from './utils';

import { CreateBranchDuringUpdateDialog } from './ItemPage';
import l10nMessages from './l10n/index.json';
import { useRouter } from './router';
import { PageRoot, PageHeader, PageBody } from './shell/page';
import { useBaseCommit } from './shell/data';
import { ForkRepoDialog } from './fork-repo';
import { serializeEntryToFiles, useUpsertItem } from './updating';
import { FormForEntry, containerWidthForEntryLayout } from './entry-form';
import { notFound } from './not-found';
import { parseEntry, useItemData } from './useItemData';
import { useSlugFieldInfo } from './slugs';
import { z } from 'zod';
import {
  delDraft,
  getDraft,
  setDraft,
  showDraftRestoredToast,
} from './persistence';
import { useHasChanged } from './useHasChanged';
import { useData } from './useData';
import { Tooltip, TooltipTrigger } from '@keystar/ui/tooltip';
import { Icon } from '@keystar/ui/icon';
import { historyIcon } from '@keystar/ui/icon/icons/historyIcon';

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
  }, [duplicateSlug, collectionConfig.slugField]);

  const itemData = useItemData({
    config: props.config,
    dirpath: getCollectionItemPath(
      props.config,
      props.collection,
      duplicateSlug ?? ''
    ),
    schema: collectionConfig.schema,
    format,
    slug,
  });

  const duplicateInitalState =
    duplicateSlug && itemData.kind === 'loaded' && itemData.data !== 'not-found'
      ? itemData.data.initialState
      : undefined;

  const duplicateInitalStateWithUpdatedSlug = useMemo(() => {
    if (duplicateInitalState) {
      let slugFieldValue = duplicateInitalState[collectionConfig.slugField];
      // we'll make a best effort to add something to the slug after duplicated so it's different
      // but if it fails a user can change it before creating
      // (e.g. potentially it's not just a text field so appending -copy might not work)
      try {
        const slugFieldSchema =
          collectionConfig.schema[collectionConfig.slugField];
        if (
          slugFieldSchema.kind !== 'form' ||
          slugFieldSchema.formKind !== 'slug'
        ) {
          throw new Error('not slug field');
        }
        const serialized = slugFieldSchema.serializeWithSlug(slugFieldValue);
        slugFieldValue = slugFieldSchema.parse(serialized.value, {
          slug: `${serialized.slug}-copy`,
        });
      } catch {}
      return {
        ...duplicateInitalState,
        [collectionConfig.slugField]: slugFieldValue,
      };
    }
  }, [
    collectionConfig.schema,
    collectionConfig.slugField,
    duplicateInitalState,
  ]);

  if (duplicateSlug && itemData.kind === 'error') {
    return (
      <PageBody>
        <Notice tone="critical">{itemData.error.message}</Notice>
      </PageBody>
    );
  }
  if (
    (duplicateSlug && itemData.kind === 'loading') ||
    draftData.kind === 'loading'
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
    duplicateSlug &&
    itemData.kind === 'loaded' &&
    itemData.data === 'not-found'
  ) {
    return (
      <PageBody>
        <Notice tone="caution">Entry not found.</Notice>
      </PageBody>
    );
  }

  return (
    <CreateItem
      collection={props.collection}
      config={props.config}
      basePath={props.basePath}
      draft={draftData.kind === 'loaded' ? draftData.data : undefined}
      duplicateSlug={duplicateSlug}
      initialState={duplicateInitalStateWithUpdatedSlug}
    />
  );
}

const storedValSchema = z.object({
  version: z.literal(1),
  savedAt: z.date(),
  slug: z.string(),
  files: z.map(z.string(), z.instanceof(Uint8Array)),
});

function CreateItem(props: {
  collection: string;
  config: Config;
  basePath: string;
  duplicateSlug: string | null;
  draft: { state: Record<string, unknown>; savedAt: Date } | undefined;
  initialState: Record<string, unknown> | undefined;
}) {
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);
  const router = useRouter();
  const collectionConfig = props.config.collections?.[props.collection];
  if (!collectionConfig) notFound();
  const [forceValidation, setForceValidation] = useState(false);
  const schema = useMemo(
    () => fields.object(collectionConfig.schema),
    [collectionConfig.schema]
  );
  const initialState = useMemo(() => {
    return props.initialState ?? getInitialPropsValue(schema);
  }, [props.initialState, schema]);
  const [state, setState] = useState(props.draft?.state ?? initialState);

  useEffect(() => {
    if (props.draft && state === props.draft.state) {
      showDraftRestoredToast(props.draft.savedAt, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.draft]);

  const previewProps = useMemo(
    () => createGetPreviewProps(schema, setState, () => undefined),
    [schema]
  )(state);

  const baseCommit = useBaseCommit();

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
        config: props.config,
        format: formatInfo,
        schema: collectionConfig.schema,
        slug: { field: collectionConfig.slugField, value: slug },
        state,
      });
      const files = new Map(serialized.map(x => [x.path, x.contents]));
      const data: z.infer<typeof storedValSchema> = {
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
    props.config,
    basePath,
    formatInfo,
    hasCreated,
  ]);

  let collectionPath = `${props.basePath}/collection/${encodeURIComponent(
    props.collection
  )}`;

  const currentSlug =
    createResult.kind === 'updated' || createResult.kind === 'loading'
      ? slug
      : undefined;
  const slugInfo = useSlugFieldInfo(props.collection, currentSlug);

  const onCreate = async () => {
    if (createResult.kind === 'loading') return;
    if (!clientSideValidateProp(schema, state, slugInfo)) {
      setForceValidation(true);
      return;
    }
    if (await createItem()) {
      const slug = getSlugFromState(collectionConfig, state);
      router.push(`${collectionPath}/item/${encodeURIComponent(slug)}`);
      toastQueue.positive('Entry created', { timeout: 5000 }); // TODO: l10n
    }
  };

  // note we're still "loading" when it's already been created
  // since we're waiting to go to the item page
  const isLoading =
    createResult.kind === 'loading' || createResult.kind === 'updated';

  const formID = 'item-create-form';

  return (
    <>
      <PageRoot containerWidth={containerWidthForEntryLayout(collectionConfig)}>
        <PageHeader>
          <Breadcrumbs
            size="medium"
            flex
            minWidth={0}
            onAction={key => {
              if (key === 'collection') {
                router.push(collectionPath);
              }
            }}
          >
            <Item key="collection">{collectionConfig.label}</Item>
            <Item key="current">{stringFormatter.format('add')}</Item>
          </Breadcrumbs>
          {isLoading && (
            <ProgressCircle
              aria-label="Creating entry"
              isIndeterminate
              size="small"
            />
          )}
          <TooltipTrigger>
            <Button
              prominence="low"
              aria-label="Reset"
              onPress={() => {
                setState(initialState);
                setForceValidation(false);
              }}
            >
              <Icon src={historyIcon} />
            </Button>
            <Tooltip>Reset</Tooltip>
          </TooltipTrigger>
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
            previewProps={previewProps}
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
        onDismiss={resetCreateItemState}
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
              if (await createItem({ branch: newBranch, sha: baseCommit })) {
                const slug = getSlugFromState(collectionConfig, state);

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
            onDismiss={resetCreateItemState}
          />
        )}
      </DialogContainer>
      <DialogContainer
        // ideally this would be a popover on desktop but using a DialogTrigger
        // wouldn't work since this doesn't open on click but after doing a
        // network request and it failing and manually wiring about a popover
        // and modal would be a pain
        onDismiss={resetCreateItemState}
      >
        {createResult.kind === 'needs-fork' && isGitHubConfig(props.config) && (
          <ForkRepoDialog
            onCreate={async () => {
              if (await createItem()) {
                const slug = getSlugFromState(collectionConfig, state);
                router.push(
                  `${collectionPath}/item/${encodeURIComponent(slug)}`
                );
              }
            }}
            onDismiss={resetCreateItemState}
            config={props.config}
          />
        )}
      </DialogContainer>
    </>
  );
}

export { CreateItemWrapper as CreateItem };
