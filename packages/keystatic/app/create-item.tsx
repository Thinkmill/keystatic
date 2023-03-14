import { useLocalizedStringFormatter } from '@react-aria/i18n';
import {
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react';

import { Button } from '@voussoir/button';
import { Breadcrumbs, Item } from '@voussoir/breadcrumbs';
import { DialogContainer } from '@voussoir/dialog';
import { Flex } from '@voussoir/layout';
import { Notice } from '@voussoir/notice';
import { ProgressCircle } from '@voussoir/progress';

import { Config } from '../config';
import {
  ComponentSchema,
  fields,
  ObjectField,
} from '../DocumentEditor/component-blocks/api';
import { FormValueContentFromPreviewProps } from '../DocumentEditor/component-blocks/form-from-preview';
import {
  clientSideValidateProp,
  getInitialYJsValForComponentSchema,
  yjsToVal,
} from '../DocumentEditor/component-blocks/utils';
import { useEventCallback } from '../DocumentEditor/utils';
import { useUpsertItem } from '../utils';

import { CreateBranchDuringUpdateDialog } from './ItemPage';
import l10nMessages from './l10n/index.json';
import { useRouter } from './router';
import { AppShellBody, AppShellRoot } from './shell';
import { AppShellHeader } from './shell/header';
import {
  BranchInfoContext,
  useBaseCommit,
  useTree,
  YjsContext,
} from './shell/data';
import { TreeNode } from './trees';
import {
  getCollectionFormat,
  getCollectionItemPath,
  getSlugFromState,
  isGitHubConfig,
} from './utils';
import { useSlugsInCollection } from './useSlugsInCollection';
import { ForkRepoDialog } from './fork-repo';
import * as Y from 'yjs';
import { createGetPreviewPropsFromY } from '../DocumentEditor/component-blocks/preview-props-yjs';
import { useData } from './useData';

const emptyMap = new Map<string, TreeNode>();

function useYJsValue(
  schema: ComponentSchema,
  type: Y.AbstractType<any>
): unknown {
  const thing = useMemo(() => {
    let lastVal = yjsToVal(schema, type);
    return {
      getSnapshot: () => lastVal,
      subscribe: (cb: () => void) => {
        const handler = () => {
          lastVal = yjsToVal(schema, type);
          cb();
        };
        type.observeDeep(handler);
        return () => {
          type.unobserveDeep(handler);
        };
      },
    };
  }, [schema, type]);
  return useSyncExternalStore(
    thing.subscribe,
    thing.getSnapshot,
    thing.getSnapshot
  );
}

function CreateItemShell(props: {
  children: ReactNode;
  isLoading?: boolean;
  config: Config;
  collection: string;
  basePath: string;
  createFormId?: string;
}) {
  const collectionConfig = props.config.collections![props.collection]!;
  const collectionPath = getCollectionPath(props.basePath, props.collection);
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);
  const router = useRouter();

  return (
    <AppShellRoot>
      <AppShellHeader>
        <Breadcrumbs
          flex
          minWidth={0}
          size="medium"
          onAction={key => {
            if (key === 'collection') {
              router.push(collectionPath);
            }
          }}
        >
          <Item key="collection">{collectionConfig.label}</Item>
          <Item key="current">{stringFormatter.format('add')}</Item>
        </Breadcrumbs>
        {props.isLoading && (
          <ProgressCircle
            aria-label="Creating entry"
            isIndeterminate
            size="small"
          />
        )}
        {props.createFormId && (
          <Button
            isDisabled={props.isLoading}
            prominence="high"
            type="submit"
            form={props.createFormId}
            marginStart="auto"
          >
            {stringFormatter.format('create')}
          </Button>
        )}
      </AppShellHeader>
      <AppShellBody>{props.children}</AppShellBody>
    </AppShellRoot>
  );
}

const getCollectionPath = (basePath: string, collection: string) =>
  `${basePath}/collection/${encodeURIComponent(collection)}`;

function CreateItemInner(props: {
  collection: string;
  config: Config;
  basePath: string;
  schema: ObjectField;
  map: Y.Map<unknown>;
}) {
  const collectionConfig = props.config.collections![props.collection]!;
  const router = useRouter();
  const [forceValidation, setForceValidation] = useState(false);

  const state = useYJsValue(props.schema, props.map) as Record<string, unknown>;
  const getPreviewProps = useMemo(
    () => createGetPreviewPropsFromY(props.schema, props.map, () => undefined),
    [props.map, props.schema]
  );
  const previewProps = getPreviewProps(state);

  const baseCommit = useBaseCommit();

  const tree = useTree();

  const slug = getSlugFromState(collectionConfig, state);

  const [createResult, _createItem, resetCreateItemState] = useUpsertItem({
    state,
    basePath: getCollectionItemPath(props.config, props.collection, slug),
    initialFiles: undefined,
    storage: props.config.storage,
    schema: collectionConfig.schema,
    format: getCollectionFormat(props.config, props.collection),
    currentLocalTreeKey: undefined,
    currentTree:
      tree.current.kind === 'loaded' ? tree.current.data.tree : emptyMap,
    slug: { field: collectionConfig.slugField, value: slug },
  });
  const createItem = useEventCallback(_createItem);

  const collectionPath = getCollectionPath(props.basePath, props.collection);

  const slugsArr = useSlugsInCollection(props.collection);
  const currentSlug =
    createResult.kind === 'updated' || createResult.kind === 'loading'
      ? slug
      : undefined;
  const slugInfo = useMemo(() => {
    const slugs = new Set(slugsArr);
    if (currentSlug) {
      slugs.delete(currentSlug);
    }
    return {
      field: collectionConfig.slugField,
      slugs,
    };
  }, [collectionConfig.slugField, slugsArr, currentSlug]);

  const onCreate = async () => {
    if (!clientSideValidateProp(props.schema, state, slugInfo)) {
      setForceValidation(true);
      return;
    }
    if (await createItem()) {
      const slug = getSlugFromState(collectionConfig, state);
      router.push(`${collectionPath}/item/${slug}`);
    }
  };

  // note we're still "loading" when it's already been created
  // since we're waiting to go to the item page
  const isLoading =
    createResult.kind === 'loading' || createResult.kind === 'updated';

  const formID = 'item-create-form';

  return (
    <>
      <CreateItemShell isLoading={isLoading} createFormId={formID} {...props}>
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
          // padding="xlarge"
        >
          {createResult.kind === 'error' && (
            <Notice tone="critical">{createResult.error.message}</Notice>
          )}

          <FormValueContentFromPreviewProps
            forceValidation={forceValidation}
            slugField={slugInfo}
            {...previewProps}
          />
        </Flex>
      </CreateItemShell>

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

export function CreateItem(props: {
  collection: string;
  config: Config;
  basePath: string;
}) {
  const collectionConfig = props.config.collections![props.collection]!;

  const schema = useMemo(
    () => fields.object(collectionConfig.schema),
    [collectionConfig.schema]
  );
  const yJsInfo = useContext(YjsContext);
  if (!yJsInfo) {
    throw new Error('YjsContext not provided');
  }
  const branchInfo = useContext(BranchInfoContext);
  const mapData = useData(
    useCallback(async () => {
      await yJsInfo.doc.whenSynced;
      const key = `${branchInfo.currentBranch}/${props.collection}/create`;
      let doc = yJsInfo.data.get(key);
      if (doc instanceof Y.Doc) {
        const promise = doc.whenLoaded;
        doc.load();
        await promise;
      } else {
        doc = new Y.Doc();
        yJsInfo.data.set(key, doc);
      }
      const data = doc.getMap('data');
      if (!data.size) {
        doc.transact(() => {
          for (const [key, value] of Object.entries(schema.fields)) {
            const val = getInitialYJsValForComponentSchema(value);
            data.set(key, val);
          }
        });
      }
      return data;
    }, [branchInfo.currentBranch, props.collection, schema.fields, yJsInfo])
  );

  if (mapData.kind === 'error') {
    return (
      <CreateItemShell {...props}>
        <Notice tone="critical">{mapData.error.message}</Notice>
      </CreateItemShell>
    );
  }
  if (mapData.kind === 'loading') {
    return (
      <CreateItemShell {...props}>
        <Flex
          alignItems="center"
          justifyContent="center"
          minHeight="size.scale.3000"
        >
          <ProgressCircle
            aria-label="Loading Create Item"
            isIndeterminate
            size="large"
          />
        </Flex>
      </CreateItemShell>
    );
  }
  return <CreateItemInner schema={schema} map={mapData.data} {...props} />;
}
