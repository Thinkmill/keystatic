import { useRouter } from './router';
import { FormEvent, useMemo, useState } from 'react';

import { Badge } from '@voussoir/badge';
import { Button, ButtonGroup } from '@voussoir/button';
import { DialogContainer } from '@voussoir/dialog';
import { Flex } from '@voussoir/layout';
import { Notice } from '@voussoir/notice';
import { ProgressCircle } from '@voussoir/progress';
import { Heading, Text } from '@voussoir/typography';

import { Config } from '../config';
import { FormValueContentFromPreviewProps } from '../DocumentEditor/component-blocks/form-from-preview';
import { createGetPreviewProps } from '../DocumentEditor/component-blocks/preview-props';
import { fields } from '../DocumentEditor/component-blocks/api';
import { clientSideValidateProp } from '../DocumentEditor/component-blocks/utils';
import { getInitialPropsValue } from '../DocumentEditor/component-blocks/initial-values';
import { useEventCallback } from '../DocumentEditor/utils';
import { useUpsertItem } from '../utils';

import { CreateBranchDuringUpdateDialog } from './ItemPage';
import { AppShellBody, AppShellRoot } from './shell';
import { useBaseCommit, useTree } from './shell/data';
import { AppShellHeader } from './shell/header';
import { TreeNode } from './trees';
import { mergeDataStates } from './useData';
import { useHasChanged } from './useHasChanged';
import { useItemData } from './useItemData';
import { getSingletonFormat, getSingletonPath } from './utils';
import { Icon } from '@voussoir/icon';
import { refreshCwIcon } from '@voussoir/icon/icons/refreshCwIcon';

type SingletonPageProps = {
  singleton: string;
  config: Config;
  initialState: Record<string, unknown> | null;
  initialFiles: string[];
  localTreeSha: string | undefined;
  currentTree: Map<string, TreeNode>;
};

function SingletonPage({
  singleton,
  initialFiles,
  initialState,
  localTreeSha,
  config,
  currentTree,
}: SingletonPageProps) {
  const [forceValidation, setForceValidation] = useState(false);
  const singletonConfig = config.singletons![singleton]!;
  const schema = useMemo(
    () => fields.object(singletonConfig.schema),
    [singletonConfig.schema]
  );
  const singletonPath = getSingletonPath(config, singleton);

  const router = useRouter();

  const [{ state, localTreeSha: localTreeShaInState }, setState] = useState(
    () => ({
      localTreeSha,
      state:
        initialState === null ? getInitialPropsValue(schema) : initialState,
    })
  );
  if (localTreeShaInState !== localTreeSha) {
    setState({
      localTreeSha,
      state:
        initialState === null ? getInitialPropsValue(schema) : initialState,
    });
  }

  const isCreating = initialState === null;
  const hasChanged =
    useHasChanged({ initialState, state, schema, slugField: undefined }) ||
    isCreating;

  const previewProps = useMemo(
    () =>
      createGetPreviewProps(
        schema,
        stateUpdater => {
          setState(state => ({
            localTreeSha: state.localTreeSha,
            state: stateUpdater(state.state),
          }));
        },
        () => undefined
      ),
    [schema]
  )(state as Record<string, unknown>);

  const baseCommit = useBaseCommit();
  const [updateResult, _update, resetUpdateItem] = useUpsertItem({
    state,
    initialFiles,
    storage: config.storage,
    schema: singletonConfig.schema,
    basePath: singletonPath,
    format: getSingletonFormat(config, singleton),
    currentLocalTreeSha: localTreeSha,
    currentTree,
    slugField: undefined,
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

  return (
    <AppShellRoot>
      <AppShellHeader>
        <Flex alignItems="center" gap="regular">
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

        <ButtonGroup marginStart="auto">
          <Button
            aria-label="Reset"
            // prominence="low"
            isDisabled={updateResult.kind === 'loading' || !hasChanged}
            onPress={() => window.location.reload()}
          >
            <Icon isHidden={{ above: 'mobile' }} src={refreshCwIcon} />
            <Text isHidden={{ below: 'tablet' }}>Reset</Text>
          </Button>
          <Button
            form={formID}
            isDisabled={updateResult.kind === 'loading'}
            prominence="high"
            type="submit"
          >
            {isCreating ? 'Create' : 'Save'}
          </Button>
        </ButtonGroup>
      </AppShellHeader>
      <AppShellBody>
        <form
          id={formID}
          onSubmit={(event: FormEvent) => {
            if (event.target !== event.currentTarget) return;
            event.preventDefault();
            onCreate();
          }}
        >
          <Flex direction="column" gap="xxlarge" paddingBottom="xlarge">
            {updateResult.kind === 'error' && (
              <Notice tone="critical">{updateResult.error.message}</Notice>
            )}
            <FormValueContentFromPreviewProps
              key={localTreeSha}
              forceValidation={forceValidation}
              {...previewProps}
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
          </Flex>
        </form>
      </AppShellBody>
    </AppShellRoot>
  );
}

function SingletonPageWrapper(props: { singleton: string; config: Config }) {
  const singletonConfig = props.config.singletons![props.singleton]!;
  const header = (
    <AppShellHeader>
      <Heading elementType="h1" id="page-title" size="small">
        {singletonConfig.label}
      </Heading>
    </AppShellHeader>
  );
  const format = useMemo(
    () => getSingletonFormat(props.config, props.singleton),
    [props.config, props.singleton]
  );
  const itemData = useItemData({
    config: props.config,
    dirpath: getSingletonPath(props.config, props.singleton),
    schema: props.config.singletons![props.singleton]!.schema,
    format,
    slug: undefined,
  });
  const { current: tree } = useTree();
  const combined = useMemo(
    () => mergeDataStates({ tree, item: itemData }),
    [itemData, tree]
  );
  if (combined.kind === 'error') {
    return (
      <AppShellRoot>
        {header}
        <AppShellBody>
          <Notice margin="xxlarge" tone="critical">
            {combined.error.message}
          </Notice>
        </AppShellBody>
      </AppShellRoot>
    );
  }

  if (combined.kind === 'loading') {
    return (
      <AppShellRoot>
        {header}
        <AppShellBody>
          <Flex
            alignItems="center"
            justifyContent="center"
            minHeight="size.scale.3000"
          >
            <ProgressCircle
              aria-label={`Loading ${singletonConfig.label}`}
              isIndeterminate
              size="large"
            />
          </Flex>
        </AppShellBody>
      </AppShellRoot>
    );
  }

  return (
    <SingletonPage
      singleton={props.singleton}
      config={props.config}
      initialState={
        combined.data.item === 'not-found'
          ? null
          : combined.data.item.initialState
      }
      initialFiles={
        combined.data.item === 'not-found'
          ? []
          : combined.data.item.initialFiles
      }
      localTreeSha={
        combined.data.item === 'not-found'
          ? undefined
          : combined.data.item.localTreeSha
      }
      currentTree={combined.data.tree.tree}
    />
  );
}

export { SingletonPageWrapper as SingletonPage };
