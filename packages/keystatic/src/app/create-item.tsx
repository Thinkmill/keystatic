import { useLocalizedStringFormatter } from '@react-aria/i18n';
import { useMemo, useState } from 'react';

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
  getSlugGlobForCollection,
  isGitHubConfig,
} from './utils';

import { CreateBranchDuringUpdateDialog } from './ItemPage';
import l10nMessages from './l10n/index.json';
import { useRouter } from './router';
import { AppShellRoot } from './shell';
import { AppShellHeader } from './shell/header';
import { useBaseCommit, useTree } from './shell/data';
import { TreeNode } from './trees';
import { useSlugsInCollection } from './useSlugsInCollection';
import { ForkRepoDialog } from './fork-repo';
import { useUpsertItem } from './updating';
import { FormForEntry, containerWidthForEntryLayout } from './entry-form';

const emptyMap = new Map<string, TreeNode>();

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
  const [state, setState] = useState(() => getInitialPropsValue(schema));
  const previewProps = useMemo(
    () => createGetPreviewProps(schema, setState, () => undefined),
    [schema]
  )(state);

  const baseCommit = useBaseCommit();

  const tree = useTree();

  const slug = getSlugFromState(collectionConfig, state);

  const formatInfo = getCollectionFormat(props.config, props.collection);
  const [createResult, _createItem, resetCreateItemState] = useUpsertItem({
    state,
    basePath: getCollectionItemPath(props.config, props.collection, slug),
    initialFiles: undefined,
    config: props.config,
    schema: collectionConfig.schema,
    format: formatInfo,
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
      glob: getSlugGlobForCollection(props.config, props.collection),
    };
  }, [
    slugsArr,
    currentSlug,
    collectionConfig.slugField,
    props.config,
    props.collection,
  ]);

  const onCreate = async () => {
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
      <AppShellRoot
        containerWidth={containerWidthForEntryLayout(collectionConfig)}
      >
        <AppShellHeader>
          <Breadcrumbs
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
  );
}
