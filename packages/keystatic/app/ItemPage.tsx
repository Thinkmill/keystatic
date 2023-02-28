import { useLocalizedStringFormatter } from '@react-aria/i18n';
import {
  FormEvent,
  PropsWithChildren,
  ReactNode,
  useMemo,
  useState,
} from 'react';

import { Badge } from '@voussoir/badge';
import { Button, ButtonGroup } from '@voussoir/button';
import {
  AlertDialog,
  Dialog,
  DialogContainer,
  DialogTrigger,
} from '@voussoir/dialog';
import { chevronRightIcon } from '@voussoir/icon/icons/chevronRightIcon';
import { trash2Icon } from '@voussoir/icon/icons/trash2Icon';
import { Icon } from '@voussoir/icon';
import { Box, Flex } from '@voussoir/layout';
import { TextLink } from '@voussoir/link';
import { Notice } from '@voussoir/notice';
import { ProgressCircle } from '@voussoir/progress';
import { Content } from '@voussoir/slots';
import { TextField } from '@voussoir/text-field';
import { Heading, Text } from '@voussoir/typography';

import { Config } from '../config';
import { FormValueContentFromPreviewProps } from '../DocumentEditor/component-blocks/form-from-preview';
import { createGetPreviewProps } from '../DocumentEditor/component-blocks/preview-props';
import { fields } from '../DocumentEditor/component-blocks/api';
import { clientSideValidateProp } from '../DocumentEditor/component-blocks/utils';
import { useEventCallback } from '../DocumentEditor/utils';
import { useDeleteItem, useUpsertItem } from '../utils';

import { useCreateBranchMutation } from './branch-selection';
import l10nMessages from './l10n/index.json';
import { useRouter } from './router';
import { AppShellBody, AppShellRoot } from './shell';
import { useBaseCommit, useTree, useRepositoryId } from './shell/data';
import { AppShellHeader } from './shell/header';
import { TreeNode } from './trees';
import {
  getCollectionFormat,
  getCollectionItemPath,
  getSlugFromState,
} from './utils';
import { useItemData } from './useItemData';
import { useHasChanged } from './useHasChanged';
import { mergeDataStates } from './useData';
import { useSlugsInCollection } from './useSlugsInCollection';

type ItemPageProps = {
  collection: string;
  config: Config;
  initialFiles: string[];
  initialState: Record<string, unknown>;
  itemSlug: string;
  localTreeKey: string;
  currentTree: Map<string, TreeNode>;
  basePath: string;
  slugs: Set<string>;
};

function ItemPage(props: ItemPageProps) {
  const {
    collection,
    config,
    itemSlug,
    initialFiles,
    initialState,
    localTreeKey,
    currentTree,
  } = props;
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);
  const router = useRouter();
  const [forceValidation, setForceValidation] = useState(false);
  const collectionConfig = config.collections![collection]!;
  const schema = useMemo(
    () => fields.object(collectionConfig.schema),
    [collectionConfig.schema]
  );

  const [{ state, localTreeKey: localTreeKeyInState }, setState] = useState({
    state: initialState,
    localTreeKey,
  });
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
  const [updateResult, _update, resetUpdateItem] = useUpsertItem({
    state,
    initialFiles,
    storage: config.storage,
    schema: collectionConfig.schema,
    basePath: getCollectionItemPath(
      config,
      collection,
      getSlugFromState(collectionConfig, state)
    ),
    format: getCollectionFormat(config, collection),
    currentLocalTreeKey: localTreeKey,
    currentTree,
    slugField: collectionConfig.slugField,
  });
  const update = useEventCallback(_update);
  const [deleteResult, deleteItem] = useDeleteItem({
    initialFiles,
    storage: config.storage,
    basePath: getCollectionItemPath(config, collection, itemSlug),
    currentTree,
  });
  const onUpdate = async () => {
    if (
      !clientSideValidateProp(schema, state, {
        currentSlug: props.itemSlug,
        field: collectionConfig.slugField,
        slugs: props.slugs,
      })
    ) {
      setForceValidation(true);
      return;
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
  };
  const formID = 'item-edit-form';

  const slugFieldInfo = useMemo(
    () => ({
      collection: props.collection,
      currentSlug: props.itemSlug,
      slugField: collectionConfig.slugField,
    }),
    [collectionConfig.slugField, props.collection, props.itemSlug]
  );

  return (
    <>
      <ItemPageShell
        headerActions={
          <>
            {updateResult.kind === 'loading' ? (
              <ProgressCircle
                aria-label="Updating entry"
                isIndeterminate
                size="small"
                alignSelf="center"
              />
            ) : (
              hasChanged && <Badge tone="pending">Unsaved</Badge>
            )}
            <ButtonGroup marginStart="auto">
              {/* <Button
                aria-label="Reset"
                isDisabled={updateResult.kind === 'loading' || !hasChanged}
                onPress={() => window.location.reload()}
              >
                <Icon isHidden={{ above: 'mobile' }} src={refreshCwIcon} />
                <Text isHidden={{ below: 'tablet' }}>Reset</Text>
              </Button> */}
              <DialogTrigger>
                <Button
                  // tone="critical"
                  aria-label={stringFormatter.format('delete')}
                  isDisabled={
                    deleteResult.kind === 'loading' ||
                    updateResult.kind === 'loading'
                  }
                >
                  <Icon isHidden={{ above: 'mobile' }} src={trash2Icon} />
                  <Text isHidden={{ below: 'tablet' }}>
                    {stringFormatter.format('delete')}
                  </Text>
                </Button>
                <AlertDialog
                  title="Delete entry"
                  tone="critical"
                  cancelLabel="Cancel"
                  primaryActionLabel="Yes, delete"
                  autoFocusButton="cancel"
                  onPrimaryAction={async () => {
                    await deleteItem();
                    router.push(
                      `${props.basePath}/collection/${encodeURIComponent(
                        collection
                      )}`
                    );
                  }}
                >
                  Are you sure? This action cannot be undone.
                </AlertDialog>
              </DialogTrigger>
              <Button
                form={formID}
                isDisabled={updateResult.kind === 'loading'}
                prominence="high"
                type="submit"
              >
                {stringFormatter.format('save')}
              </Button>
            </ButtonGroup>
          </>
        }
        {...props}
      >
        <Box
          id={formID}
          minWidth={0}
          elementType="form"
          onSubmit={(event: FormEvent) => {
            if (event.target !== event.currentTarget) return;
            event.preventDefault();
            onUpdate();
          }}
        >
          {updateResult.kind === 'error' && (
            <Notice tone="critical">{updateResult.error.message}</Notice>
          )}
          {deleteResult.kind === 'error' && (
            <Notice tone="critical">{deleteResult.error.message}</Notice>
          )}
          <AppShellBody>
            <FormValueContentFromPreviewProps
              key={localTreeKey}
              forceValidation={forceValidation}
              slugField={slugFieldInfo}
              {...previewProps}
            />
          </AppShellBody>
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
                    )}/collection/${encodeURIComponent(
                      collection
                    )}/item/${encodeURIComponent(itemSlug)}`
                  );
                  const slug = getSlugFromState(collectionConfig, state);

                  const hasUpdated = await update({
                    branch: newBranch,
                    sha: baseCommit,
                  });
                  if (hasUpdated && slug !== itemSlug) {
                    router.replace(
                      `${props.basePath}/collection/${encodeURIComponent(
                        collection
                      )}/item/${encodeURIComponent(slug)}`
                    );
                  }
                }}
                reason={updateResult.reason}
                onDismiss={resetUpdateItem}
              />
            )}
          </DialogContainer>
        </Box>
      </ItemPageShell>
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
  return (
    <Dialog>
      <form
        style={{ display: 'contents' }}
        onSubmit={async event => {
          event.preventDefault();
          const name = `refs/heads/${branchName}`;
          const result = await createBranch({
            input: { name, oid: props.branchOid, repositoryId },
          });
          if (result.data?.createRef?.__typename) {
            props.onCreate(branchName);
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

function ItemPageWrapper(props: {
  collection: string;
  itemSlug: string;
  config: Config;
  basePath: string;
}) {
  const format = useMemo(
    () => getCollectionFormat(props.config, props.collection),
    [props.config, props.collection]
  );

  const allSlugs = useSlugsInCollection(props.collection);

  const collectionConfig = props.config.collections![props.collection]!;
  const slugInfo = useMemo(
    () => ({
      slug: props.itemSlug,
      slugField: collectionConfig.slugField,
      slugs: new Set(allSlugs),
    }),
    [allSlugs, collectionConfig.slugField, props.itemSlug]
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
  const { current: tree } = useTree();
  const combined = useMemo(
    () => mergeDataStates({ item: itemData, tree }),
    [itemData, tree]
  );

  if (combined.kind === 'error') {
    return (
      <ItemPageShell {...props}>
        <AppShellBody>
          <Notice tone="critical">{combined.error.message}</Notice>
        </AppShellBody>
      </ItemPageShell>
    );
  }
  if (combined.kind === 'loading') {
    return (
      <ItemPageShell {...props}>
        <Flex
          alignItems="center"
          justifyContent="center"
          minHeight="size.scale.3000"
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

  if (combined.data.item === 'not-found') {
    return (
      <ItemPageShell {...props}>
        <AppShellBody>
          <Notice tone="caution">Entry not found.</Notice>
        </AppShellBody>
      </ItemPageShell>
    );
  }
  return (
    <ItemPage
      collection={props.collection}
      basePath={props.basePath}
      config={props.config}
      itemSlug={props.itemSlug}
      initialState={combined.data.item.initialState}
      initialFiles={combined.data.item.initialFiles}
      localTreeKey={combined.data.item.localTreeKey}
      currentTree={combined.data.tree.tree}
      slugs={slugInfo.slugs}
    />
  );
}

const ItemPageShell = (
  props: PropsWithChildren<
    Pick<ItemPageProps, 'collection' | 'config' | 'basePath'> & {
      headerActions?: ReactNode;
    }
  >
) => {
  const collectionConfig = props.config.collections![props.collection]!;
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);

  return (
    <AppShellRoot>
      <AppShellHeader>
        <Heading size="small" visuallyHidden={{ below: 'tablet' }} truncate>
          <TextLink
            href={`${props.basePath}/collection/${encodeURIComponent(
              props.collection
            )}`}
          >
            {collectionConfig.label}
          </TextLink>
        </Heading>
        <Icon
          src={chevronRightIcon}
          color="neutralSecondary"
          isHidden={{ below: 'tablet' }}
        />
        <Text
          color="neutralEmphasis"
          size="medium"
          weight="bold"
          marginEnd="regular"
        >
          {stringFormatter.format('edit')}
        </Text>
        {props.headerActions}
      </AppShellHeader>

      {props.children}
    </AppShellRoot>
  );
};

export { ItemPageWrapper as ItemPage };
