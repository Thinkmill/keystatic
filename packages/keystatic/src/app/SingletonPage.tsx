import {
  ReactElement,
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { Flex } from '@keystar/ui/layout';
import { Notice } from '@keystar/ui/notice';
import { ProgressCircle } from '@keystar/ui/progress';
import { Heading, Text } from '@keystar/ui/typography';

import { Config } from '../config';
import { getInitialPropsValue } from '../form/initial-values';
import {
  getDataFileExtension,
  getPathPrefix,
  getRepoUrl,
  getSingletonFormat,
  getSingletonPath,
  isCloudConfig,
  isGitHubConfig,
} from './utils';

import { PageBody, PageHeader, PageRoot } from './shell/page';
import { useBranchInfo, useCurrentUnscopedTree } from './shell/data';
import { useHasChanged } from './useHasChanged';
import { useItemData } from './useItemData';
import { serializeEntryToFiles } from './updating';
import { Icon } from '@keystar/ui/icon';
import { FormForEntry, containerWidthForEntryLayout } from './entry-form';
import { notFound } from './not-found';
import { LOADING, useData } from './useData';
import { ActionGroup, Item } from '@keystar/ui/action-group';
import { useMediaQuery, breakpointQueries } from '@keystar/ui/style';
import { githubIcon } from '@keystar/ui/icon/icons/githubIcon';
import { externalLinkIcon } from '@keystar/ui/icon/icons/externalLinkIcon';
import { historyIcon } from '@keystar/ui/icon/icons/historyIcon';
import { getYjsValFromParsedValue } from '../form/yjs-props-value';
import * as Y from 'yjs';
import { useYjsIfAvailable } from './shell/collab';
import { useYJsValue } from './useYJsValue';
import { PresenceAvatars } from './presence';
import {
  usePreviewProps,
  usePreviewPropsFromY,
  useSingleton,
} from './preview-props';
import { ComponentSchema, GenericPreviewProps } from '..';
import { useExtraRoots, writeChangesToLocalObjectStore } from './object-store';
import { Badge } from '@keystar/ui/badge';

type SingletonPageProps = {
  singleton: string;
  config: Config;
  initialState: Record<string, unknown> | null;
  committedState: Record<string, unknown> | null;
  initialFiles: string[];
  localTreeKey: string | undefined;
};

function SingletonPageInner(
  props: SingletonPageProps & {
    hasChanged: boolean;
    state: Record<string, unknown>;
    onReset: () => void;
    previewProps: GenericPreviewProps<ComponentSchema, undefined>;
  }
) {
  const isBelowDesktop = useMediaQuery(breakpointQueries.below.desktop);
  const branchInfo = useBranchInfo();

  const { singletonConfig } = useSingleton(props.singleton);

  const previewHref = useMemo(() => {
    if (!singletonConfig.previewUrl) return undefined;
    return singletonConfig.previewUrl.replace(
      '{branch}',
      branchInfo.currentBranch
    );
  }, [branchInfo.currentBranch, singletonConfig.previewUrl]);
  const isGitHub = isGitHubConfig(props.config) || isCloudConfig(props.config);
  const formatInfo = getSingletonFormat(props.config, props.singleton);
  const singletonExists = !!props.initialState;
  const singletonPath = getSingletonPath(props.config, props.singleton);

  const viewHref =
    isGitHub && singletonExists
      ? `${getRepoUrl(branchInfo)}${
          formatInfo.dataLocation === 'index'
            ? `/tree/${branchInfo.currentBranch}/${
                getPathPrefix(props.config.storage) ?? ''
              }${singletonPath}`
            : `/blob/${getPathPrefix(props.config.storage) ?? ''}${
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
          {props.hasChanged && <Badge tone="pending">Unsaved</Badge>}
        </Flex>
        <PresenceAvatars />
        <ActionGroup
          buttonLabelBehavior="hide"
          overflowMode="collapse"
          prominence="low"
          density="compact"
          maxWidth={isBelowDesktop ? 'element.regular' : undefined} // force switch to action menu on small devices
          items={menuActions}
          disabledKeys={props.hasChanged ? [] : ['reset']}
          onAction={key => {
            switch (key) {
              case 'reset':
                props.onReset();
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
      </PageHeader>
      <Flex
        direction="column"
        gap="xxlarge"
        height="100%"
        minHeight={0}
        minWidth={0}
      >
        <FormForEntry
          previewProps={props.previewProps as any}
          forceValidation
          entryLayout={singletonConfig.entryLayout}
          formatInfo={formatInfo}
          slugField={undefined}
        />
      </Flex>
    </PageRoot>
  );
}

function LocalSingletonPage(props: SingletonPageProps) {
  const { singleton, initialState, localTreeKey, config } = props;
  const { schema, singletonConfig } = useSingleton(props.singleton);
  const singletonPath = getSingletonPath(config, singleton);

  const [{ state, localTreeKey: localTreeKeyInState }, setState] = useState(
    () => ({
      localTreeKey: localTreeKey,
      state:
        initialState === null ? getInitialPropsValue(schema) : initialState,
    })
  );

  if (localTreeKeyInState !== localTreeKey) {
    setState({
      localTreeKey: localTreeKey,
      state:
        initialState === null ? getInitialPropsValue(schema) : initialState,
    });
  }

  const unscopedTreeData = useCurrentUnscopedTree();
  const branchInfo = useBranchInfo();
  const extraRoots = useExtraRoots();

  useEffect(() => {
    if (unscopedTreeData.kind !== 'loaded') return;
    const unscopedTree = unscopedTreeData.data.tree;
    const pathPrefix = getPathPrefix(config.storage) ?? '';
    let additions = serializeEntryToFiles({
      basePath: singletonPath,
      config,
      format: getSingletonFormat(config, singleton),
      schema: singletonConfig.schema,
      slug: undefined,
      state,
    }).map(addition => ({
      ...addition,
      path: pathPrefix + addition.path,
    }));

    let shouldSet = true;

    (async () => {
      const newTreeSha = await writeChangesToLocalObjectStore({
        additions,
        initialFiles: props.initialFiles.map(x => pathPrefix + x),
        unscopedTree,
      });
      if (
        shouldSet &&
        newTreeSha !== extraRoots.roots.get(branchInfo.currentBranch)?.sha
      ) {
        startTransition(() => {
          extraRoots.set(branchInfo.currentBranch, newTreeSha);
        });
      }
    })();
    return () => {
      shouldSet = false;
    };
  }, [
    branchInfo.currentBranch,
    config,
    extraRoots,
    props.initialFiles,
    singleton,
    singletonConfig.schema,
    singletonPath,
    state,
    unscopedTreeData,
  ]);

  const hasChanged = useHasChanged({
    initialState: props.committedState,
    state,
    schema,
    slugField: undefined,
  });

  const onPreviewPropsChange = useCallback(
    (cb: (state: Record<string, unknown>) => Record<string, unknown>) => {
      setState(state => ({
        localTreeKey: state.localTreeKey,
        state: cb(state.state),
      }));
    },
    []
  );

  const previewProps = usePreviewProps(
    schema,
    onPreviewPropsChange,
    state as Record<string, unknown>
  );

  const onReset = () =>
    setState({
      localTreeKey: localTreeKey,
      state:
        initialState === null ? getInitialPropsValue(schema) : initialState,
    });
  return (
    <SingletonPageInner
      {...props}
      hasChanged={hasChanged}
      onReset={onReset}
      state={state}
      previewProps={previewProps}
    />
  );
}

function CollabSingletonPage(
  props: SingletonPageProps & {
    map: Y.Map<unknown>;
  }
) {
  const { initialState } = props;
  const { schema, singletonConfig } = useSingleton(props.singleton);

  const state = useYJsValue(schema, props.map) as Record<string, unknown>;
  const previewProps = usePreviewPropsFromY(
    schema,
    props.map,
    state as Record<string, unknown>
  );

  const isCreating = initialState === null;
  const hasChanged =
    useHasChanged({ initialState, state, schema, slugField: undefined }) ||
    isCreating;

  const onReset = () => {
    props.map.doc!.transact(() => {
      for (const [key, value] of Object.entries(singletonConfig.schema)) {
        const val = getYjsValFromParsedValue(
          value,
          props.initialState?.[key] ?? getInitialPropsValue(value)
        );
        props.map.set(key, val);
      }
    });
  };
  return (
    <SingletonPageInner
      {...props}
      hasChanged={hasChanged}
      onReset={onReset}
      state={state}
      previewProps={previewProps}
    />
  );
}

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

  const itemDataConfig = {
    config: props.config,
    dirpath,
    schema: singletonConfig.schema,
    format,
    slug: undefined,
  };
  const itemData = useItemData(itemDataConfig);
  const committedItemData = useItemData(itemDataConfig, 'committed');

  const branchInfo = useBranchInfo();

  const key = `${branchInfo.currentBranch}/${props.singleton}`;

  const yjsInfo = useYjsIfAvailable();

  const isItemDataLoading = itemData.kind === 'loading';

  const mapData = useData(
    useCallback(async () => {
      if (!yjsInfo) return;
      if (yjsInfo === 'loading') return LOADING;
      await yjsInfo.doc.whenSynced;
      if (isItemDataLoading) return LOADING;
      let doc = yjsInfo.data.get(key);
      if (doc instanceof Y.Doc) {
        const promise = doc.whenLoaded;
        doc.load();
        await promise;
      } else {
        doc = new Y.Doc();
        yjsInfo.data.set(key, doc);
      }
      return doc.getMap('data');
    }, [yjsInfo, isItemDataLoading, key])
  );

  useMemo(() => {
    if (
      mapData.kind !== 'loaded' ||
      itemData.kind !== 'loaded' ||
      !mapData.data ||
      mapData.data.size
    ) {
      return;
    }
    const data = mapData.data;
    data.doc!.transact(() => {
      for (const [key, value] of Object.entries(singletonConfig.schema)) {
        const val = getYjsValFromParsedValue(
          value,
          itemData.data === 'not-found'
            ? getInitialPropsValue(value)
            : itemData.data.initialState[key]
        );
        data.set(key, val);
      }
    });
  }, [itemData, mapData, singletonConfig]);
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

  if (committedItemData.kind === 'error') {
    return (
      <PageRoot>
        {header}
        <PageBody>
          <Notice margin="xxlarge" tone="critical">
            {committedItemData.error.message}
          </Notice>
        </PageBody>
      </PageRoot>
    );
  }

  if (mapData.kind === 'error') {
    return (
      <PageRoot>
        {header}
        <PageBody>
          <Notice margin="xxlarge" tone="critical">
            {mapData.error.message}
          </Notice>
        </PageBody>
      </PageRoot>
    );
  }

  if (
    itemData.kind === 'loading' ||
    mapData.kind === 'loading' ||
    committedItemData.kind === 'loading'
  ) {
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

  const committedItemState =
    committedItemData.data === 'not-found'
      ? null
      : committedItemData.data.initialState;

  if (mapData.data) {
    return (
      <CollabSingletonPage
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
        map={mapData.data}
        committedState={committedItemState}
      />
    );
  }

  return (
    <LocalSingletonPage
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
      committedState={committedItemState}
    />
  );
}

export { SingletonPageWrapper as SingletonPage };
