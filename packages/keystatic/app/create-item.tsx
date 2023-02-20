import { useLocalizedStringFormatter } from '@react-aria/i18n';
import { useMemo, useState } from 'react';

import { Button } from '@voussoir/button';
import { DialogContainer } from '@voussoir/dialog';
import { Icon } from '@voussoir/icon';
import { chevronRightIcon } from '@voussoir/icon/icons/chevronRightIcon';
import { Flex } from '@voussoir/layout';
import { TextLink } from '@voussoir/link';
import { Notice } from '@voussoir/notice';
import { ProgressCircle } from '@voussoir/progress';
import { Heading, Text } from '@voussoir/typography';

import { Config } from '../config';
import { fields } from '../DocumentEditor/component-blocks/api';
import { FormValueContentFromPreviewProps } from '../DocumentEditor/component-blocks/form-from-preview';
import { getInitialPropsValue } from '../DocumentEditor/component-blocks/initial-values';
import { createGetPreviewProps } from '../DocumentEditor/component-blocks/preview-props';
import { clientSideValidateProp } from '../DocumentEditor/component-blocks/utils';
import { useEventCallback } from '../DocumentEditor/utils';
import { useUpsertItem } from '../utils';

import { CreateBranchDuringUpdateDialog } from './ItemPage';
import l10nMessages from './l10n/index.json';
import { useRouter } from './router';
import { AppShellBody, AppShellRoot } from './shell';
import { AppShellHeader } from './shell/header';
import { useBaseCommit, useTree } from './shell/data';
import { TreeNode } from './trees';
import { getCollectionFormat, getCollectionItemPath } from './utils';

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

  const [createResult, _createItem, resetCreateItemState] = useUpsertItem({
    state,
    basePath: getCollectionItemPath(
      props.config,
      props.collection,
      collectionConfig.getItemSlug(state)
    ),
    initialFiles: undefined,
    storage: props.config.storage,
    schema: collectionConfig.schema,
    format: getCollectionFormat(props.config, props.collection),
    currentLocalTreeSha: undefined,
    currentTree:
      tree.current.kind === 'loaded' ? tree.current.data.tree : emptyMap,
  });
  const createItem = useEventCallback(_createItem);

  let collectionPath = `${props.basePath}/collection/${encodeURIComponent(
    props.collection
  )}`;

  const onCreate = async () => {
    if (!clientSideValidateProp(schema, state)) {
      setForceValidation(true);
      return;
    }
    if (await createItem()) {
      const slug = collectionConfig.getItemSlug(state);
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
      <AppShellRoot>
        <AppShellHeader>
          <Heading size="small" visuallyHidden={{ below: 'tablet' }} truncate>
            <TextLink href={collectionPath}>{collectionConfig.label}</TextLink>
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
            {stringFormatter.format('add')}
          </Text>
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
                const slug = collectionConfig.getItemSlug(state);
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
    </>
  );
}
