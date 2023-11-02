import { useRouter } from './router';
import {
  FormEvent,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { Badge } from '@keystar/ui/badge';
import { Button } from '@keystar/ui/button';
import { DialogContainer } from '@keystar/ui/dialog';
import { Flex } from '@keystar/ui/layout';
import { Notice } from '@keystar/ui/notice';
import { ProgressCircle } from '@keystar/ui/progress';
import { Heading, Text } from '@keystar/ui/typography';

import { Config } from '../config';
import { createGetPreviewProps } from '../form/preview-props';
import { fields } from '../form/api';
import { clientSideValidateProp } from '../form/errors';
import { getInitialPropsValue } from '../form/initial-values';
import { useEventCallback } from '../form/fields/document/DocumentEditor/ui-utils';
import {
  getDataFileExtension,
  getPathPrefix,
  getRepoUrl,
  getSingletonFormat,
  getSingletonPath,
  isCloudConfig,
  isGitHubConfig,
} from './utils';

import { CreateBranchDuringUpdateDialog } from './ItemPage';
import { PageBody, PageHeader, PageRoot } from './shell/page';
import { useBaseCommit, useBranchInfo } from './shell/data';
import { useHasChanged } from './useHasChanged';
import { parseEntry, useItemData } from './useItemData';
import { serializeEntryToFiles, useUpsertItem } from './updating';
import { Icon } from '@keystar/ui/icon';
import { ForkRepoDialog } from './fork-repo';
import { FormForEntry, containerWidthForEntryLayout } from './entry-form';
import { notFound } from './not-found';
import {
  delDraft,
  getDraft,
  setDraft,
  showDraftRestoredToast,
} from './persistence';
import { z } from 'zod';
import { useData } from './useData';
import { ActionGroup, Item } from '@keystar/ui/action-group';
import { useMediaQuery, breakpointQueries } from '@keystar/ui/style';
import { githubIcon } from '@keystar/ui/icon/icons/githubIcon';
import { externalLinkIcon } from '@keystar/ui/icon/icons/externalLinkIcon';
import { historyIcon } from '@keystar/ui/icon/icons/historyIcon';

type SingletonPageProps = {
  singleton: string;
  config: Config;
  initialState: Record<string, unknown> | null;
  initialFiles: string[];
  localTreeKey: string | undefined;
  draft:
    | {
        state: Record<string, unknown>;
        savedAt: Date;
        treeKey: string | undefined;
      }
    | undefined;
};

function SingletonPage({
  singleton,
  initialFiles,
  initialState,
  localTreeKey,
  config,
  draft,
}: SingletonPageProps) {
  const [forceValidation, setForceValidation] = useState(false);
  const singletonConfig = config.singletons![singleton]!;
  const schema = useMemo(
    () => fields.object(singletonConfig.schema),
    [singletonConfig.schema]
  );
  const singletonPath = getSingletonPath(config, singleton);

  const router = useRouter();

  const [{ state, localTreeKey: localTreeKeyInState }, setState] = useState(
    () => ({
      localTreeKey: localTreeKey,
      state:
        draft?.state ??
        (initialState === null ? getInitialPropsValue(schema) : initialState),
    })
  );
  useEffect(() => {
    if (draft && state === draft.state) {
      showDraftRestoredToast(draft.savedAt, localTreeKey !== draft.treeKey);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);

  if (localTreeKeyInState !== localTreeKey) {
    setState({
      localTreeKey: localTreeKey,
      state:
        initialState === null ? getInitialPropsValue(schema) : initialState,
    });
  }

  const isCreating = initialState === null;
  const hasChanged =
    useHasChanged({ initialState, state, schema, slugField: undefined }) ||
    isCreating;

  useEffect(() => {
    const key = ['singleton', singleton] as const;
    if (hasChanged) {
      const serialized = serializeEntryToFiles({
        basePath: singletonPath,
        config,
        format: getSingletonFormat(config, singleton),
        schema: singletonConfig.schema,
        slug: undefined,
        state,
      });
      const files = new Map(serialized.map(x => [x.path, x.contents]));
      const data: z.infer<typeof storedValSchema> = {
        beforeTreeKey: localTreeKey,
        files,
        savedAt: new Date(),
        version: 1,
      };
      setDraft(key, data);
    } else {
      delDraft(key);
    }
  }, [
    config,
    localTreeKey,
    state,
    hasChanged,
    singleton,
    singletonPath,
    singletonConfig,
  ]);

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

  const baseCommit = useBaseCommit();
  const formatInfo = getSingletonFormat(config, singleton);
  const [updateResult, _update, resetUpdateItem] = useUpsertItem({
    state,
    initialFiles,
    config,
    schema: singletonConfig.schema,
    basePath: singletonPath,
    format: formatInfo,
    currentLocalTreeKey: localTreeKey,
    slug: undefined,
  });
  const update = useEventCallback(_update);
  const onCreate = async () => {
    if (!clientSideValidateProp(schema, state, undefined)) {
      setForceValidation(true);
      return;
    }
    await update();
  };
  const formID = 'singleton-form';

  const onReset = () =>
    setState({
      localTreeKey: localTreeKey,
      state:
        initialState === null ? getInitialPropsValue(schema) : initialState,
    });

  const isBelowTablet = useMediaQuery(breakpointQueries.below.tablet);

  const branchInfo = useBranchInfo();
  const previewHref = useMemo(() => {
    if (!singletonConfig.previewUrl) return undefined;
    return singletonConfig.previewUrl.replace(
      '{branch}',
      branchInfo.currentBranch
    );
  }, [branchInfo.currentBranch, singletonConfig.previewUrl]);
  const isGitHub = isGitHubConfig(config) || isCloudConfig(config);
  const singletonExists = !!initialState;
  const viewHref =
    isGitHub && singletonExists
      ? `${getRepoUrl(branchInfo)}${
          formatInfo.dataLocation === 'index'
            ? `/tree/${branchInfo.currentBranch}/${getPathPrefix(
                config.storage
              )}${singletonPath}`
            : `/blob/${getPathPrefix(config.storage)}${
                branchInfo.currentBranch
              }/${singletonPath}${getDataFileExtension(formatInfo)}`
        }`
      : undefined;

  const menuActions = useMemo(() => {
    const actions: {
      key: string;
      label: string;
      icon: ReactElement;
      href?: string;
      target?: string;
      rel?: string;
    }[] = [
      {
        key: 'reset',
        label: 'Reset',
        icon: historyIcon,
      },
    ];
    if (previewHref) {
      actions.push({
        key: 'preview',
        label: 'Preview',
        icon: externalLinkIcon,
        href: previewHref,
        target: '_blank',
        rel: 'noopener noreferrer',
      });
    }
    if (viewHref) {
      actions.push({
        key: 'view',
        label: 'View on GitHub',
        icon: githubIcon,
        href: viewHref,
        target: '_blank',
        rel: 'noopener noreferrer',
      });
    }
    return actions;
  }, [previewHref, viewHref]);

  return (
    <PageRoot containerWidth={containerWidthForEntryLayout(singletonConfig)}>
      <PageHeader>
        <Flex flex alignItems="center" gap="regular">
          <Heading elementType="h1" id="page-title" size="small">
            {singletonConfig.label}
          </Heading>
          {updateResult.kind === 'loading' ? (
            <ProgressCircle
              aria-label={`Updating ${singletonConfig.label}`}
              isIndeterminate
              size="small"
              alignSelf="center"
            />
          ) : (
            hasChanged && <Badge tone="pending">Unsaved</Badge>
          )}
        </Flex>
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
          isDisabled={updateResult.kind === 'loading'}
          prominence="high"
          type="submit"
        >
          {isCreating ? 'Create' : 'Save'}
        </Button>
      </PageHeader>
      <Flex
        elementType="form"
        id={formID}
        onSubmit={(event: FormEvent) => {
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
        {updateResult.kind === 'error' && (
          <Notice tone="critical">{updateResult.error.message}</Notice>
        )}
        <FormForEntry
          previewProps={previewProps}
          forceValidation={forceValidation}
          entryLayout={singletonConfig.entryLayout}
          formatInfo={formatInfo}
          slugField={undefined}
        />
        <DialogContainer
          // ideally this would be a popover on desktop but using a DialogTrigger wouldn't work since
          // this doesn't open on click but after doing a network request and it failing and manually wiring about a popover and modal would be a pain
          onDismiss={resetUpdateItem}
        >
          {updateResult.kind === 'needs-new-branch' && (
            <CreateBranchDuringUpdateDialog
              branchOid={baseCommit}
              onCreate={async newBranch => {
                router.push(
                  `/keystatic/branch/${encodeURIComponent(
                    newBranch
                  )}/singleton/${encodeURIComponent(singleton)}`
                );
                update({ branch: newBranch, sha: baseCommit });
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
          {updateResult.kind === 'needs-fork' && isGitHubConfig(config) && (
            <ForkRepoDialog
              onCreate={async () => {
                update();
              }}
              onDismiss={resetUpdateItem}
              config={config}
            />
          )}
        </DialogContainer>
      </Flex>
    </PageRoot>
  );
}

const storedValSchema = z.object({
  version: z.literal(1),
  savedAt: z.date(),
  beforeTreeKey: z.string().optional(),
  files: z.map(z.string(), z.instanceof(Uint8Array)),
});

function SingletonPageWrapper(props: { singleton: string; config: Config }) {
  const singletonConfig = props.config.singletons?.[props.singleton];
  if (!singletonConfig) notFound();
  const header = (
    <PageHeader>
      <Heading elementType="h1" id="page-title" size="small">
        {singletonConfig.label}
      </Heading>
    </PageHeader>
  );
  const format = useMemo(
    () => getSingletonFormat(props.config, props.singleton),
    [props.config, props.singleton]
  );

  const dirpath = getSingletonPath(props.config, props.singleton);

  const draftData = useData(
    useCallback(async () => {
      const raw = await getDraft(['singleton', props.singleton]);
      if (!raw) throw new Error('No draft found');
      const stored = storedValSchema.parse(raw);
      const parsed = parseEntry(
        {
          config: props.config,
          dirpath,
          format,
          schema: singletonConfig.schema,
          slug: undefined,
        },
        stored.files
      );
      return {
        state: parsed.initialState,
        savedAt: stored.savedAt,
        treeKey: stored.beforeTreeKey,
      };
    }, [dirpath, format, props.config, props.singleton, singletonConfig.schema])
  );

  const itemData = useItemData({
    config: props.config,
    dirpath,
    schema: singletonConfig.schema,
    format,
    slug: undefined,
  });
  if (itemData.kind === 'error') {
    return (
      <PageRoot>
        {header}
        <PageBody>
          <Notice margin="xxlarge" tone="critical">
            {itemData.error.message}
          </Notice>
        </PageBody>
      </PageRoot>
    );
  }

  if (itemData.kind === 'loading' || draftData.kind === 'loading') {
    return (
      <PageRoot>
        {header}
        <PageBody>
          <Flex
            alignItems="center"
            justifyContent="center"
            minHeight="scale.3000"
          >
            <ProgressCircle
              aria-label={`Loading ${singletonConfig.label}`}
              isIndeterminate
              size="large"
            />
          </Flex>
        </PageBody>
      </PageRoot>
    );
  }

  return (
    <SingletonPage
      singleton={props.singleton}
      config={props.config}
      initialState={
        itemData.data === 'not-found' ? null : itemData.data.initialState
      }
      initialFiles={
        itemData.data === 'not-found' ? [] : itemData.data.initialFiles
      }
      localTreeKey={
        itemData.data === 'not-found' ? undefined : itemData.data.localTreeKey
      }
      draft={draftData.kind === 'loaded' ? draftData.data : undefined}
    />
  );
}

export { SingletonPageWrapper as SingletonPage };
