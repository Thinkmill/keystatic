import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import * as s from 'superstruct';

import { Badge } from '@keystar/ui/badge';
import { Button } from '@keystar/ui/button';
import { DialogContainer } from '@keystar/ui/dialog';
import { Box, Flex, VStack } from '@keystar/ui/layout';
import { Notice } from '@keystar/ui/notice';
import { ProgressCircle } from '@keystar/ui/progress';
import { Heading, Text } from '@keystar/ui/typography';

import { Config } from '../config';
import { ComponentSchema, GenericPreviewProps } from '../form/api';
import { clientSideValidateProp } from '../form/errors';
import { FormValueContentFromPreviewProps } from '../form/form-from-preview';
import { getInitialPropsValue } from '../form/initial-values';

import { ForkRepoDialog } from './fork-repo';
import { notFound } from './not-found';
import { delDraft, getDraft, setDraft } from './persistence';
import { usePreviewProps } from './preview-props';
import { useRouter } from './router';
import { PageBody, PageHeader, PageRoot } from './shell/page';
import { useBaseCommit } from './shell/data';
import { useRecentItems } from './shell/navigation-history';
import {
  createStandalonePageItem,
  getStandalonePageCreatePath,
  getStandalonePageItemLabel,
  getStandalonePageItemSlug,
  getStandalonePageItemsFromState,
  getStandalonePagePath,
  getStandalonePageSingleton,
} from './standalone-pages';
import { parseEntry, useItemData } from './useItemData';
import { useData } from './useData';
import { useHasChanged } from './useHasChanged';
import { serializeEntryToFiles, useUpsertItem } from './updating';
import {
  getSingletonFormat,
  getSingletonPath,
  isGitHubConfig,
  useShowRestoredDraftMessage,
} from './utils';
import { CreateBranchDuringUpdateDialog } from './ItemPage';
import { useTrackActivity } from './dashboard/ActivityFeed';

type StandalonePageEditorProps = {
  basePath: string;
  config: Config;
  mode: 'create' | 'edit';
  singleton: string;
  slug?: string;
};

const storedValSchema = s.type({
  version: s.literal(1),
  savedAt: s.date(),
  beforeTreeKey: s.optional(s.string()),
  files: s.map(s.string(), s.instance(Uint8Array)),
  pageIndex: s.number(),
});

export function StandalonePageEditor(props: StandalonePageEditorProps) {
  const standalonePageSingleton = getStandalonePageSingleton(props.config);
  if (
    !standalonePageSingleton ||
    standalonePageSingleton.key !== props.singleton
  ) {
    notFound();
  }

  const singletonConfig = props.config.singletons?.[props.singleton];
  if (!singletonConfig) {
    notFound();
  }

  const singletonSchema = useMemo(
    () => ({ kind: 'object' as const, fields: singletonConfig.schema }),
    [singletonConfig.schema]
  );
  const format = useMemo(
    () => getSingletonFormat(props.config, props.singleton),
    [props.config, props.singleton]
  );
  const dirpath = useMemo(
    () => getSingletonPath(props.config, props.singleton),
    [props.config, props.singleton]
  );
  const draftKey = useMemo(
    () =>
      [
        'standalone-page',
        props.singleton,
        props.mode === 'create' ? 'create' : props.slug ?? '',
        [
          props.basePath,
          props.config.storage.kind,
          props.config.storage.kind === 'github'
            ? getRepoIdentifier(props.config.storage.repo)
            : 'local',
        ].join(':'),
      ] as const,
    [props.basePath, props.config.storage, props.mode, props.singleton, props.slug]
  );

  const draftData = useData(
    useCallback(async () => {
      if (props.mode === 'create') {
        throw new Error('No draft restore for create mode');
      }
      const raw = await getDraft(draftKey);
      if (!raw) {
        throw new Error('No draft found');
      }
      const stored = storedValSchema.create(raw);
      const parsed = parseEntry(
        {
          dirpath,
          format,
          schema: singletonConfig.schema,
          slug: undefined,
        },
        stored.files
      );
      return {
        pageIndex: stored.pageIndex,
        savedAt: stored.savedAt,
        state: parsed.initialState,
        treeKey: stored.beforeTreeKey,
      };
    }, [dirpath, draftKey, format, props.mode, singletonConfig.schema])
  );

  const itemData = useItemData({
    config: props.config,
    dirpath,
    format,
    schema: singletonConfig.schema,
    slug: undefined,
  });
  const settingsConfig = props.config.singletons?.settings;
  const settingsFormat = useMemo(
    () =>
      settingsConfig
        ? getSingletonFormat(props.config, 'settings')
        : getSingletonFormat(props.config, props.singleton),
    [props.config, props.singleton, settingsConfig]
  );
  const settingsDirpath = useMemo(
    () =>
      settingsConfig
        ? getSingletonPath(props.config, 'settings')
        : getSingletonPath(props.config, props.singleton),
    [props.config, props.singleton, settingsConfig]
  );
  const settingsItemData = useItemData({
    config: props.config,
    dirpath: settingsDirpath,
    format: settingsFormat,
    schema: settingsConfig?.schema ?? singletonConfig.schema,
    slug: undefined,
  });

  if (itemData.kind === 'error') {
    return (
      <PageRoot>
        <PageBody>
          <Notice tone="critical">{itemData.error.message}</Notice>
        </PageBody>
      </PageRoot>
    );
  }

  if (
    draftData.kind === 'loading' ||
    itemData.kind === 'loading' ||
    settingsItemData.kind === 'loading'
  ) {
    return (
      <PageRoot>
        <PageBody>
          <Flex
            alignItems="center"
            justifyContent="center"
            minHeight="scale.3000"
          >
            <ProgressCircle
              aria-label="Loading page builder"
              isIndeterminate
              size="large"
            />
          </Flex>
        </PageBody>
      </PageRoot>
    );
  }

  return (
    <StandalonePageEditorLocal
      {...props}
      draft={draftData.kind === 'loaded' ? draftData.data : undefined}
      initialFiles={
        itemData.data === 'not-found' ? [] : itemData.data.initialFiles
      }
      initialState={
        itemData.data === 'not-found' ? null : itemData.data.initialState
      }
      localTreeKey={
        itemData.data === 'not-found' ? undefined : itemData.data.localTreeKey
      }
      singletonConfig={singletonConfig}
      singletonSchema={singletonSchema}
      standalonePageSingleton={standalonePageSingleton}
      settingsSync={
        settingsConfig && settingsItemData.kind === 'loaded'
          ? {
              format: settingsFormat,
              initialFiles:
                settingsItemData.data === 'not-found'
                  ? []
                  : settingsItemData.data.initialFiles,
              localTreeKey:
                settingsItemData.data === 'not-found'
                  ? undefined
                  : settingsItemData.data.localTreeKey,
              path: settingsDirpath,
              schema: settingsConfig.schema,
              state:
                settingsItemData.data === 'not-found'
                  ? {}
                  : settingsItemData.data.initialState,
            }
          : null
      }
    />
  );
}

function StandalonePageEditorLocal(
  props: StandalonePageEditorProps & {
    draft:
      | {
          pageIndex: number;
          savedAt: Date;
          state: Record<string, unknown>;
          treeKey: string | undefined;
        }
      | undefined;
    initialFiles: string[];
    initialState: Record<string, unknown> | null;
    localTreeKey: string | undefined;
    singletonConfig: { schema: Record<string, ComponentSchema> };
    singletonSchema: {
      kind: 'object';
      fields: Record<string, ComponentSchema>;
    };
    standalonePageSingleton: NonNullable<
      ReturnType<typeof getStandalonePageSingleton>
    >;
    settingsSync:
      | {
          format: ReturnType<typeof getSingletonFormat>;
          initialFiles: string[];
          localTreeKey: string | undefined;
          path: string;
          schema: Record<string, ComponentSchema>;
          state: Record<string, unknown> | null;
        }
      | null;
  }
) {
  const router = useRouter();
  const baseCommit = useBaseCommit();
  const { addRecentItem } = useRecentItems();
  const trackActivity = useTrackActivity();
  const [forceValidation, setForceValidation] = useState(false);
  const routeKey = props.mode === 'create' ? 'create' : props.slug ?? '';
  const draftScope = useMemo(
    () =>
      [
        props.basePath,
        props.config.storage.kind,
        props.config.storage.kind === 'github'
          ? getRepoIdentifier(props.config.storage.repo)
          : 'local',
      ].join(':'),
    [props.basePath, props.config.storage]
  );
  const format = useMemo(
    () => getSingletonFormat(props.config, props.singleton),
    [props.config, props.singleton]
  );
  const singletonPath = useMemo(
    () => getSingletonPath(props.config, props.singleton),
    [props.config, props.singleton]
  );

  const buildInitialEditorState = useCallback(() => {
    const baseState =
      props.initialState ?? getInitialPropsValue(props.singletonSchema);
    const nextState =
      props.draft?.state ??
      (props.mode === 'create'
        ? {
            ...baseState,
            [props.standalonePageSingleton.itemsField]: [
              ...getStandalonePageItemsFromState(
                props.standalonePageSingleton,
                baseState
              ),
              createStandalonePageItem(props.standalonePageSingleton),
            ],
          }
        : baseState);

    const items = getStandalonePageItemsFromState(
      props.standalonePageSingleton,
      nextState
    );
    const pageIndex =
      props.draft?.pageIndex ??
      (props.mode === 'create'
        ? items.length - 1
        : items.findIndex(item => {
            try {
              return (
                getStandalonePageItemSlug(
                  props.standalonePageSingleton,
                  item
                ) === props.slug
              );
            } catch {
              return false;
            }
          }));

    const safePageIndex =
      pageIndex < 0 ? Math.max(items.length - 1, 0) : Math.min(pageIndex, Math.max(items.length - 1, 0));

    return {
      initialState: nextState,
      localTreeKey: props.localTreeKey,
      pageIndex: safePageIndex,
      routeKey,
      state: nextState,
    };
  }, [
    props.draft?.pageIndex,
    props.draft?.state,
    props.initialState,
    props.localTreeKey,
    props.mode,
    props.singletonSchema,
    props.slug,
    props.standalonePageSingleton,
    routeKey,
  ]);

  const [editorState, setEditorState] = useState(buildInitialEditorState);

  useShowRestoredDraftMessage(
    props.draft,
    editorState.state,
    props.localTreeKey
  );

  const onPreviewPropsChange = useCallback(
    (cb: (state: Record<string, unknown>) => Record<string, unknown>) => {
      setEditorState(state => ({
        ...state,
        state: cb(state.state),
      }));
    },
    []
  );

  const previewProps = usePreviewProps(
    props.singletonSchema,
    onPreviewPropsChange,
    editorState.state
  );
  const itemsPreview = previewProps.fields[
    props.standalonePageSingleton.itemsField
  ] as any;
  const pagePreview = itemsPreview.elements[editorState.pageIndex] as
    | GenericPreviewProps<ComponentSchema, unknown>
    | undefined;
  const currentItems = getStandalonePageItemsFromState(
    props.standalonePageSingleton,
    editorState.state
  );
  const currentPage = currentItems[editorState.pageIndex];
  if (editorState.pageIndex < 0 || !pagePreview || !currentPage) {
    notFound();
  }

  const { key: pagePreviewKey, ...pagePreviewProps } =
    pagePreview as GenericPreviewProps<ComponentSchema, unknown> & {
      key?: string;
    };

  useEffect(() => {
    if (
      editorState.localTreeKey !== props.localTreeKey ||
      editorState.routeKey !== routeKey
    ) {
      setEditorState(buildInitialEditorState());
    }
  }, [
    buildInitialEditorState,
    editorState.localTreeKey,
    editorState.routeKey,
    props.localTreeKey,
    routeKey,
  ]);

  const pageSlugInfo = {
    field: props.standalonePageSingleton.slugField,
    glob: '*' as const,
    slugs: new Set(
      currentItems.flatMap((item, index) => {
        if (index === editorState.pageIndex) {
          return [];
        }
        try {
          return [
            getStandalonePageItemSlug(props.standalonePageSingleton, item),
          ];
        } catch {
          return [];
        }
      })
    ),
  };

  const hasChangedFromRemote = useHasChanged({
    initialState: props.initialState,
    schema: props.singletonSchema,
    slugField: undefined,
    state: editorState.state,
  });
  const hasChangedFromCreateBase = useHasChanged({
    initialState: editorState.initialState,
    schema: props.singletonSchema,
    slugField: undefined,
    state: editorState.state,
  });
  const hasChanged =
    hasChangedFromRemote ||
    (props.mode === 'create' && hasChangedFromCreateBase);

  useEffect(() => {
    const key = [
      'standalone-page',
      props.singleton,
      props.mode === 'create' ? 'create' : props.slug ?? '',
      draftScope,
    ] as const;
    if (props.mode !== 'create' && hasChanged) {
      const serialized = serializeEntryToFiles({
        basePath: singletonPath,
        format,
        schema: props.singletonConfig.schema,
        slug: undefined,
        state: editorState.state,
      });
      const files = new Map(serialized.map(file => [file.path, file.contents]));
      const data: s.Infer<typeof storedValSchema> = {
        beforeTreeKey: props.localTreeKey,
        files,
        pageIndex: editorState.pageIndex,
        savedAt: new Date(),
        version: 1,
      };
      setDraft(key, data);
    } else {
      delDraft(key);
    }
  }, [
    editorState.pageIndex,
    editorState.state,
    format,
    hasChanged,
    props.localTreeKey,
    props.mode,
    props.singleton,
    props.singletonConfig.schema,
    props.slug,
    singletonPath,
    draftScope,
  ]);

  const [updateResult, onUpdate, resetUpdateResult] = useUpsertItem({
    basePath: singletonPath,
    config: props.config,
    currentLocalTreeKey: props.localTreeKey,
    format,
    initialFiles: props.initialFiles,
    schema: props.singletonConfig.schema,
    slug: undefined,
    state: editorState.state,
  });
  const [settingsUpdateResult, onUpdateSettings] = useUpsertItem({
    basePath: props.settingsSync?.path ?? singletonPath,
    config: props.config,
    currentLocalTreeKey: props.settingsSync?.localTreeKey,
    format: props.settingsSync?.format ?? format,
    initialFiles: props.settingsSync?.initialFiles ?? [],
    schema: props.settingsSync?.schema ?? props.singletonConfig.schema,
    slug: undefined,
    state: props.settingsSync?.state ?? {},
  });

  const pageLabel = getStandalonePageItemLabel(
    props.standalonePageSingleton,
    currentPage
  );

  const formID = 'standalone-page-builder-form';

  const savePage = async (override?: { branch: string; sha: string }) => {
    if (updateResult.kind === 'loading') {
      return;
    }
    if (
      !clientSideValidateProp(
        props.standalonePageSingleton.itemSchema,
        currentPage,
        pageSlugInfo
      )
    ) {
      setForceValidation(true);
      return;
    }
    if (await onUpdate(override)) {
      delDraft([
        'standalone-page',
        props.singleton,
        props.mode === 'create' ? 'create' : props.slug ?? '',
        draftScope,
      ]);
      const slug = getStandalonePageItemSlug(
        props.standalonePageSingleton,
        getStandalonePageItemsFromState(
          props.standalonePageSingleton,
          editorState.state
        )[editorState.pageIndex]
      );
      const nextHref = getStandalonePagePath(
        props.config,
        props.basePath,
        props.singleton,
        slug
      );
      const nextPage = getStandalonePageItemsFromState(
        props.standalonePageSingleton,
        editorState.state
      )[editorState.pageIndex];
      const nextLabel = getStandalonePageItemLabel(
        props.standalonePageSingleton,
        nextPage
      );
      addRecentItem({
        type: 'entry',
        key: `${props.singleton}/${slug}`,
        label: nextLabel,
        href: nextHref,
        collectionKey: props.singleton,
      });
      trackActivity(
        props.mode === 'create' ? 'created' : 'updated',
        props.singleton,
        slug,
        nextLabel
      );
      if (props.settingsSync) {
        const nextSettingsState = upsertNavigationItem(props.settingsSync.state, {
          label: nextLabel,
          previousSlug: props.mode === 'edit' ? props.slug : undefined,
          slug,
        });
        Object.assign(props.settingsSync.state, nextSettingsState);
        if (settingsUpdateResult.kind !== 'loading') {
          await onUpdateSettings(override);
        }
      }
      if (props.mode === 'create') {
        router.push(nextHref);
      } else if (props.slug !== slug) {
        router.replace(nextHref);
      }
    }
  };

  return (
    <PageRoot containerWidth="none">
      <PageHeader>
        <Flex
          alignItems="center"
          justifyContent="space-between"
          gap="regular"
          width="100%"
          wrap
        >
          <VStack gap="xsmall" minWidth={0} flex>
            <Flex alignItems="center" gap="small" wrap>
              <Heading elementType="h1" id="page-title" size="small">
                {pageLabel || 'New page'}
              </Heading>
              {updateResult.kind === 'loading' ? (
                <ProgressCircle
                  aria-label="Saving page"
                  isIndeterminate
                  size="small"
                />
              ) : hasChanged ? (
                <Badge tone="pending">Unsaved</Badge>
              ) : null}
            </Flex>
            <Text color="neutralSecondary" size="small">
              Build this page on its own route. It will appear in the sidebar
              using the page title after you save it.
            </Text>
          </VStack>
          <Flex gap="regular" alignItems="center">
            <Button
              prominence="low"
              onPress={() => {
                setForceValidation(false);
                setEditorState(buildInitialEditorState());
              }}
            >
              Reset
            </Button>
            <Button form={formID} prominence="high" type="submit">
              {props.mode === 'create' ? 'Create page' : 'Save page'}
            </Button>
          </Flex>
        </Flex>
      </PageHeader>
      <PageBody isScrollable>
        <Box
          borderRadius="large"
          padding="xlarge"
          UNSAFE_style={{
            background:
              'linear-gradient(180deg, var(--ks-color-background-surface) 0%, var(--ks-color-background-canvas) 100%)',
          }}
        >
          <VStack gap="xlarge">
            {updateResult.kind === 'error' && (
              <Notice tone="critical">{updateResult.error.message}</Notice>
            )}
            <Box
              elementType="form"
              id={formID}
              onSubmit={(event: FormEvent) => {
                if (event.target !== event.currentTarget) {
                  return;
                }
                event.preventDefault();
                savePage();
              }}
            >
              <FormValueContentFromPreviewProps
                key={pagePreviewKey}
                {...pagePreviewProps}
                autoFocus
                forceValidation={forceValidation}
                slugField={pageSlugInfo}
              />
            </Box>
          </VStack>
        </Box>
      </PageBody>

      <DialogContainer onDismiss={resetUpdateResult}>
        {updateResult.kind === 'needs-new-branch' && (
          <CreateBranchDuringUpdateDialog
            branchOid={baseCommit}
            onCreate={async newBranch => {
              const nextBasePath = `/keystatic/branch/${encodeURIComponent(
                newBranch
              )}`;
              router.push(
                props.mode === 'create'
                  ? getStandalonePageCreatePath(
                      props.config,
                      nextBasePath,
                      props.singleton
                    )
                  : getStandalonePagePath(
                      props.config,
                      nextBasePath,
                      props.singleton,
                      props.slug!
                    )
              );
              savePage({ branch: newBranch, sha: baseCommit });
            }}
            onDismiss={resetUpdateResult}
            reason={updateResult.reason}
          />
        )}
      </DialogContainer>
      <DialogContainer onDismiss={resetUpdateResult}>
        {updateResult.kind === 'needs-fork' && isGitHubConfig(props.config) && (
          <ForkRepoDialog
            config={props.config}
            onCreate={async () => {
              savePage();
            }}
            onDismiss={resetUpdateResult}
          />
        )}
      </DialogContainer>
    </PageRoot>
  );
}

function getRepoIdentifier(repo: string | { owner: string; name: string }) {
  return typeof repo === 'string' ? repo : `${repo.owner}/${repo.name}`;
}

function upsertNavigationItem(
  currentState: Record<string, unknown>,
  item: { label: string; previousSlug?: string; slug: string }
) {
  const currentNav = Array.isArray(currentState.navigation)
    ? currentState.navigation
    : [];
  const normalizedSlug = item.slug.replace(/^\/+|\/+$/g, '');
  const normalizedPreviousSlug = item.previousSlug
    ? item.previousSlug.replace(/^\/+|\/+$/g, '')
    : undefined;
  const nextNav = currentNav.map(entry => ({ ...entry })) as Record<
    string,
    unknown
  >[];
  const existingIndex = nextNav.findIndex(entry => {
    const value = entry.slug;
    if (typeof value !== 'string') {
      return false;
    }
    const normalizedEntrySlug = value.replace(/^\/+|\/+$/g, '');
    return (
      normalizedEntrySlug === normalizedSlug ||
      (normalizedPreviousSlug !== undefined &&
        normalizedEntrySlug === normalizedPreviousSlug)
    );
  });
  if (existingIndex >= 0) {
    nextNav[existingIndex].label = item.label;
    nextNav[existingIndex].slug = normalizedSlug;
    if (typeof nextNav[existingIndex].visible !== 'boolean') {
      nextNav[existingIndex].visible = true;
    }
  } else {
    nextNav.push({
      label: item.label,
      slug: normalizedSlug,
      visible: true,
    });
  }
  return {
    ...currentState,
    navigation: nextNav,
  };
}
