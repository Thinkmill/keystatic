import { Flex } from '@voussoir/layout';
import { Heading, Text } from '@voussoir/typography';

import { Config } from '../config';
import { useRouter } from 'next/router';
import { Button } from '@voussoir/button';
import { FormValueContentFromPreviewProps } from '../DocumentEditor/component-blocks/form-from-preview';
import { createGetPreviewProps } from '../DocumentEditor/component-blocks/preview-props';
import { useMemo, useState } from 'react';
import { getInitialPropsValue } from '../DocumentEditor/component-blocks/initial-values';
import { fields } from '../DocumentEditor/component-blocks/api';
import { useUpsertItem } from '../utils';
import { clientSideValidateProp } from '../DocumentEditor/component-blocks/utils';
import { AppShellBody, AppShellRoot } from './shell';
import { AppShellHeader } from './shell/header';
import { useBaseCommit, useTree } from './shell/data';
import { Notice } from '@voussoir/notice';
import { getCollectionFormat, getCollectionItemPath } from './utils';
import { TextLink } from '@voussoir/link';
import { Icon } from '@voussoir/icon';
import { chevronRightIcon } from '@voussoir/icon/icons/chevronRightIcon';
import { ProgressCircle } from '@voussoir/progress';
import { DialogContainer } from '@voussoir/dialog';
import { CreateBranchDuringUpdateDialog } from './ItemPage';
import { useEventCallback } from '../DocumentEditor/utils';
import { TreeNode } from './trees';

const emptyMap = new Map<string, TreeNode>();

export function CreateItem(props: { collection: string; config: Config; currentBranch: string }) {
  const router = useRouter();
  const collectionConfig = props.config.collections![props.collection]!;
  const [forceValidation, setForceValidation] = useState(false);
  const schema = useMemo(() => fields.object(collectionConfig.schema), [collectionConfig.schema]);
  const [state, setState] = useState(() => getInitialPropsValue(schema));
  const previewProps = useMemo(
    () => createGetPreviewProps(schema, setState, () => undefined),
    [schema]
  )(state);

  const baseCommit = useBaseCommit();

  const tree = useTree();

  const [createResult, _createItem, resetCreateItemState] = useUpsertItem({
    baseCommit,
    branch: props.currentBranch,
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
    currentTree: tree.current.kind === 'loaded' ? tree.current.data.tree : emptyMap,
  });
  const createItem = useEventCallback(_createItem);

  let collectionPath = `/keystatic/branch/${props.currentBranch}/collection/${props.collection}`;

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
  const isLoading = createResult.kind === 'loading' || createResult.kind === 'updated';

  const formID = 'item-create-form';

  return (
    <>
      <AppShellRoot>
        <AppShellHeader>
          <Heading size="small" visuallyHidden={{ below: 'tablet' }} truncate>
            <TextLink href={collectionPath}>{collectionConfig.label}</TextLink>
          </Heading>
          <Icon src={chevronRightIcon} color="neutralSecondary" isHidden={{ below: 'tablet' }} />
          <Text color="neutralEmphasis" size="medium" weight="bold" marginEnd="regular">
            New item
          </Text>
          {isLoading && <ProgressCircle aria-label="Creating Item" isIndeterminate size="small" />}
          <Button
            isDisabled={isLoading}
            prominence="high"
            type="submit"
            form={formID}
            marginStart="auto"
          >
            Create
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

            <FormValueContentFromPreviewProps forceValidation={forceValidation} {...previewProps} />
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
              await router.push(
                `/keystatic/branch/${newBranch}/collection/${props.collection}/create`
              );
              if (await createItem()) {
                const slug = collectionConfig.getItemSlug(state);
                router.push(
                  `/keystatic/branch/${newBranch}/collection/${props.collection}/item/${slug}`
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
