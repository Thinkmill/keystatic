import { useLocalizedStringFormatter } from '@react-aria/i18n';
import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';

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
import { useBaseCommit, useTree } from './shell/data';
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
import { WebsocketProvider } from 'y-websocket';

const emptyMap = new Map<string, TreeNode>();

function useYJsValue<T>(
  schema: ComponentSchema,
  type: Y.AbstractType<any> & { toJSON: () => T }
): T {
  const thing = useMemo(() => {
    let lastVal = type.toJSON();
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

export function CreateItem(props: {
  collection: string;
  config: Config;
  basePath: string;
}) {
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);
  const router = useRouter();
  const collectionConfig = props.config.collections![props.collection]!;
  const [forceValidation, setForceValidation] = useState(false);
  const schema = useMemo(
    () => fields.object(collectionConfig.schema),
    [collectionConfig.schema]
  );
  const doc = useMemo(() => new Y.Doc(), []);
  const map = useMemo(() => doc.getMap('data'), [doc]);
  const state = useYJsValue(schema, map);
  const getPreviewProps = useMemo(
    () => createGetPreviewPropsFromY(schema, map, () => undefined),
    [map, schema]
  );
  const previewProps = Object.keys(state).length
    ? getPreviewProps(state)
    : undefined;

  const provider = useMemo(
    () =>
      new WebsocketProvider(
        'wss://keystatic-multiplayer.thinkmill.workers.dev/',
        props.collection + '2',
        doc,
        {
          connect: true,
        }
      ),
    [doc, props.collection]
  );

  useEffect(() => {
    let hasSynced = false;
    const onSynced = () => {
      if (!hasSynced) {
        hasSynced = true;
        if (map.size === 0) {
          doc.transact(() => {
            for (const [key, value] of Object.entries(schema.fields)) {
              const val = getInitialYJsValForComponentSchema(value);

              map.set(key, val);
            }
          });
        }
      }
      provider.off('synced', onSynced);
    };

    provider.on('synced', onSynced);
    return () => {
      provider.off('synced', onSynced);
    };
  }, [doc, map, provider, schema.fields]);

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

  let collectionPath = `${props.basePath}/collection/${encodeURIComponent(
    props.collection
  )}`;

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
    if (!clientSideValidateProp(schema, state, slugInfo)) {
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

  return previewProps ? (
    <>
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
          {isLoading && (
            <ProgressCircle
              aria-label="Creating entry"
              isIndeterminate
              size="small"
            />
          )}
          <Button
            isDisabled={isLoading}
            prominence="high"
            type="submit"
            form={formID}
            marginStart="auto"
          >
            {stringFormatter.format('create')}
          </Button>
        </AppShellHeader>
        <AppShellBody>
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
        </AppShellBody>
      </AppShellRoot>

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
  ) : null;
}
