import { useRouter } from 'next/router';
import { ReactNode, useMemo } from 'react';

import { ActionButton } from '@voussoir/button';
import { DialogTrigger } from '@voussoir/dialog';
import { Icon } from '@voussoir/icon';
import { alertCircleIcon } from '@voussoir/icon/icons/alertCircleIcon';
import { plusIcon } from '@voussoir/icon/icons/plusIcon';
import { Flex, Grid } from '@voussoir/layout';
import { Item, ListView } from '@voussoir/list-view';
import { ProgressCircle } from '@voussoir/progress';
import { Tooltip, TooltipTrigger } from '@voussoir/tooltip';
import { Heading, Text } from '@voussoir/typography';

import { Config } from '../../config';

import {
  AppShellBody,
  AppShellData,
  AppShellHeader,
  AppShellRoot,
  EmptyState,
  TreeData,
  useAppShellQuery,
  useBaseCommit,
  useChanged,
  useTree,
} from '../shell';
import { CreateBranchDialog } from '../branch-selection';
import { DataState } from '../useData';
import { arrayOf, getCollectionPath, keyedEntries, pluralize } from '../utils';

import { CONTENT } from './content';
import { SummaryBlock } from './components';
import { getTreeNodeAtPath } from '../trees';

export function DashboardPage(props: { config: Config; currentBranch: string }) {
  const [{ data, error, fetching }] = useAppShellQuery();

  if (error) {
    return (
      <DashboardShell>
        <EmptyState icon={alertCircleIcon} title="Unable to load content" message={error.message} />
      </DashboardShell>
    );
  }

  if (fetching || !data) {
    return (
      <DashboardShell>
        <EmptyState>
          <ProgressCircle aria-label="Loading content" isIndeterminate size="large" />
        </EmptyState>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <AppShellBody>
        <Flex direction="column" gap="xlarge">
          <DashboardContent {...props} data={data} />
        </Flex>
      </AppShellBody>
    </DashboardShell>
  );
}

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <AppShellRoot containerWidth="large">
      <AppShellHeader>
        <Heading elementType="h1" id="page-title" size="small">
          Dashboard
        </Heading>
      </AppShellHeader>
      {children}
    </AppShellRoot>
  );
}
export function DashboardContent(props: {
  config: Config;
  currentBranch: string;
  data: AppShellData;
}) {
  const { config, data } = props;
  const baseCommit = useBaseCommit();
  const changes = useChanged();
  const router = useRouter();
  const allTreeData = useTree();

  let link = (path: string) => `/keystatic/branch/${props.currentBranch}` + path;
  let collections = arrayOf(keyedEntries(config.collections ?? {}));
  let singletons = arrayOf(keyedEntries(config.singletons ?? {}));
  let branches = useMemo(() => {
    if (data?.repository?.refs?.nodes) {
      let defaultBranch = data?.repository?.defaultBranchRef?.name;
      return arrayOf(data?.repository?.refs?.nodes)
        .sort(node => {
          if (node.name === defaultBranch) {
            return -1;
          }
          return 1;
        })
        .map(node => {
          return {
            ...node,
            description: node.name === defaultBranch ? 'Default branch' : undefined,
          };
        });
    }

    return [];
  }, [data]);

  return (
    <Grid columns={{ tablet: ['5fr', '3fr'], desktop: ['3fr', '1fr'] }} gap="xxlarge">
      <Flex direction="column" gap="xxlarge" minWidth={0}>
        <Grid gap="large">
          <Heading size="medium" id="collections-heading">
            Collections
          </Heading>
          <SummaryBlock>{CONTENT.collections}</SummaryBlock>
          <ListView
            aria-labelledby="collections-heading"
            items={collections}
            onAction={key => {
              router.push(link(`/collection/${key}`));
            }}
          >
            {ref => {
              const counts = getCountsForCollection({
                config,
                collection: ref.key,
                changes,
                tree: allTreeData.current,
              });
              const allChangesCount = counts.changed + counts.added + counts.removed;
              return (
                <Item>
                  <Text>{ref.label}</Text>
                  <Text slot="description">
                    {pluralize(counts.total, { singular: 'item' })}
                    {allChangesCount ? (
                      <> &middot; {pluralize(allChangesCount, { singular: 'change' })}</>
                    ) : null}
                    {counts.added || counts.removed ? <> &middot; </> : null}
                    {!!counts.added && (
                      <Text color="positive" slot="none">
                        +{counts.added}
                      </Text>
                    )}{' '}
                    {!!counts.removed && (
                      <Text color="critical" slot="none">
                        -{counts.removed}
                      </Text>
                    )}
                  </Text>
                  <TooltipTrigger placement="start">
                    <ActionButton
                      onPress={() => {
                        router.push(link(`/collection/${ref.key}/create`));
                      }}
                    >
                      <Icon src={plusIcon} />
                    </ActionButton>
                    <Tooltip>New item</Tooltip>
                  </TooltipTrigger>
                </Item>
              );
            }}
          </ListView>
        </Grid>

        {!!singletons.length && (
          <Grid gap="large">
            <Heading size="medium" id="singletons-heading">
              Singletons
            </Heading>
            <SummaryBlock>{CONTENT.singletons}</SummaryBlock>

            <ListView
              aria-labelledby="singletons-heading"
              items={singletons}
              onAction={key => {
                router.push(link(`/singleton/${key}`));
              }}
            >
              {ref => {
                return (
                  <Item>
                    <Text>{ref.label}</Text>
                    <Text slot="description">
                      {changes.singletons.has(ref.key) ? 'Changed' : 'Unchanged'}
                    </Text>
                  </Item>
                );
              }}
            </ListView>
          </Grid>
        )}
      </Flex>

      <Flex direction="column" gap="xlarge" order={{ mobile: -1, tablet: 1 }} minWidth={0}>
        <Grid gap="xlarge">
          <Heading size="medium" id="branches-heading">
            Branches
          </Heading>
          <SummaryBlock>{CONTENT.branches}</SummaryBlock>
        </Grid>

        <Flex direction="column" gap="regular">
          <ListView
            aria-labelledby="branches-heading"
            items={branches}
            maxHeight="size.scale.3000"
            selectionMode="single"
            selectionStyle="highlight"
            selectedKeys={[props.currentBranch]}
            onSelectionChange={([key]) => {
              if (typeof key === 'string') {
                router.push(router.asPath.replace(/\/branch\/[^/]+/, '/branch/' + key));
              }
            }}
          >
            {ref => (
              <Item key={ref.name} textValue={ref.name}>
                <Text>{ref.name}</Text>
                {ref.description && <Text slot="description">{ref.description}</Text>}
              </Item>
            )}
          </ListView>
          <DialogTrigger type="popover" mobileType="tray" placement="bottom start">
            <div>
              <ActionButton>New branch</ActionButton>
            </div>
            {close => (
              <CreateBranchDialog
                onDismiss={close}
                onCreate={branchName => {
                  close();
                  router.push(router.asPath.replace(/\/branch\/[^/]+/, '/branch/' + branchName));
                }}
                branchOid={baseCommit}
                repositoryId={data?.repository?.id ?? ''}
              />
            )}
          </DialogTrigger>
        </Flex>
      </Flex>
    </Grid>
  );
}

// Utils
// ------------------------------

type Changes = ReturnType<typeof useChanged>;

function getCountsForCollection(options: {
  config: Config;
  collection: string;
  changes: Changes;
  tree: DataState<TreeData>;
}) {
  let { changes, collection, config, tree } = options;
  const collectionPath = getCollectionPath(config, collection);

  let added = 0;
  let removed = 0;
  let changed = 0;
  let total = 0;

  const collectionChanged = changes.collections.get(collection);

  if (collectionChanged) {
    added = collectionChanged.added.size;
    removed = collectionChanged.removed.size;
    changed = collectionChanged.changed.size;
  }
  if (tree.kind === 'loaded') {
    let node = getTreeNodeAtPath(tree.data.tree, collectionPath);
    total = node && node.children ? node.children.size : 0;
  }

  return { added, removed, changed, total };
}
