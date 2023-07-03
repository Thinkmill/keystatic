import { useLocalizedStringFormatter } from '@react-aria/i18n';
import { useContext, useMemo } from 'react';

import { Breadcrumbs, Item } from '@keystar/ui/breadcrumbs';
import { ActionButton } from '@keystar/ui/button';
import { DialogTrigger } from '@keystar/ui/dialog';
import { Icon } from '@keystar/ui/icon';
import { plusIcon } from '@keystar/ui/icon/icons/plusIcon';
import { Flex, Grid } from '@keystar/ui/layout';
import { ListView } from '@keystar/ui/list-view';
import { ProgressCircle } from '@keystar/ui/progress';
import { Tooltip, TooltipTrigger } from '@keystar/ui/tooltip';
import { Heading, Text } from '@keystar/ui/typography';

import { Config } from '../../config';

import { CreateBranchDialog } from '../branch-selection';
import l10nMessages from '../l10n/index.json';
import { useRouter } from '../router';
import { AppShellBody, AppShellRoot } from '../shell';
import { keyedEntries, pluralize } from '../utils';

import { useChanged, BranchInfoContext } from '../shell/data';
import { AppShellHeader } from '../shell/header';

export function DashboardPage(props: { config: Config; basePath: string }) {
  const { config } = props;

  const stringFormatter = useLocalizedStringFormatter(l10nMessages);
  const changes = useChanged();
  const router = useRouter();

  let link = (path: string) => props.basePath + path;
  let collections = keyedEntries(config.collections ?? {});
  let singletons = keyedEntries(config.singletons ?? {});

  return (
    <AppShellRoot containerWidth="large">
      <AppShellHeader>
        <Breadcrumbs flex size="medium" minWidth={0}>
          <Item key="dashboard">{stringFormatter.format('dashboard')}</Item>
        </Breadcrumbs>
      </AppShellHeader>
      <AppShellBody>
        <Flex direction="column" gap="xlarge">
          <Grid
            columns={{ tablet: '5fr 3fr', desktop: '3fr 1fr' }}
            gap="xxlarge"
          >
            <Flex direction="column" gap="xxlarge" minWidth={0}>
              <Grid gap="xlarge">
                <Heading size="medium" id="collections-heading">
                  {stringFormatter.format('collections')}
                </Heading>
                <ListView
                  aria-labelledby="collections-heading"
                  items={collections}
                  onAction={key => {
                    router.push(link(`/collection/${encodeURIComponent(key)}`));
                  }}
                >
                  {ref => {
                    const counts = getCountsForCollection({
                      collection: ref.key,
                      changes,
                    });
                    const allChangesCount =
                      counts.changed + counts.added + counts.removed;

                    return (
                      <Item
                        textValue={
                          ref.label + allChangesCount
                            ? ` (${allChangesCount} changed)`
                            : undefined
                        }
                      >
                        <Text>{ref.label}</Text>
                        <Text slot="description">
                          {pluralize(counts.total, {
                            singular: 'entry',
                            plural: 'entries',
                          })}
                          {allChangesCount ? (
                            <>
                              {' '}
                              &middot;{' '}
                              {pluralize(allChangesCount, {
                                singular: 'change',
                              })}
                            </>
                          ) : null}
                          {counts.added || counts.removed ? (
                            <> &middot; </>
                          ) : null}
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
                              router.push(
                                link(
                                  `/collection/${encodeURIComponent(
                                    ref.key
                                  )}/create`
                                )
                              );
                            }}
                          >
                            <Icon src={plusIcon} />
                          </ActionButton>
                          <Tooltip>{stringFormatter.format('add')}</Tooltip>
                        </TooltipTrigger>
                      </Item>
                    );
                  }}
                </ListView>
              </Grid>

              {!!singletons.length && (
                <Grid gap="large">
                  <Heading size="medium" id="singletons-heading">
                    {stringFormatter.format('singletons')}
                  </Heading>

                  <ListView
                    aria-labelledby="singletons-heading"
                    items={singletons}
                    onAction={key => {
                      router.push(link(`/singleton/${key}`));
                    }}
                  >
                    {ref => {
                      const description = changes.singletons.has(ref.key)
                        ? 'Changed'
                        : 'Unchanged';
                      return (
                        <Item textValue={`${ref.label} (${description})`}>
                          <Text>{ref.label}</Text>
                          <Text slot="description">{description}</Text>
                        </Item>
                      );
                    }}
                  </ListView>
                </Grid>
              )}
            </Flex>
            {props.config.storage.kind === 'github' && <Branches />}
          </Grid>
        </Flex>
      </AppShellBody>
    </AppShellRoot>
  );
}

function Branches() {
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);
  const router = useRouter();
  const branchInfo = useContext(BranchInfoContext);
  let branches = useMemo(() => {
    return branchInfo.allBranches
      .map(name => {
        return {
          name,
          description:
            name === branchInfo.defaultBranch
              ? stringFormatter.format('defaultBranch')
              : undefined,
        };
      })
      .sort(branch => {
        if (branch.name === branchInfo.defaultBranch) {
          return -1;
        }
        return 1;
      });
  }, [branchInfo.allBranches, branchInfo.defaultBranch, stringFormatter]);

  return (
    <Flex
      elementType="section"
      direction="column"
      gap="xlarge"
      order={{ mobile: -1, tablet: 1 }}
      minWidth={0}
    >
      <Heading size="medium" id="branches-heading">
        {stringFormatter.format('branches')}
      </Heading>

      {branchInfo.allBranches.length === 0 ? (
        <Flex justifyContent="center">
          <ProgressCircle
            isIndeterminate
            size="medium"
            aria-label={stringFormatter.format('loading')}
          />
        </Flex>
      ) : (
        <Flex direction="column" gap="regular">
          <ListView
            aria-labelledby="branches-heading"
            items={branches}
            maxHeight="scale.3000"
            selectionMode="single"
            selectionStyle="highlight"
            selectedKeys={[branchInfo.currentBranch]}
            onSelectionChange={([key]) => {
              if (typeof key === 'string') {
                router.push(
                  router.href.replace(
                    /\/branch\/[^/]+/,
                    '/branch/' + encodeURIComponent(key)
                  )
                );
              }
            }}
          >
            {ref => (
              <Item key={ref.name} textValue={ref.name}>
                <Text>{ref.name}</Text>
                {ref.description && (
                  <Text slot="description">{ref.description}</Text>
                )}
              </Item>
            )}
          </ListView>
          <DialogTrigger>
            <div>
              <ActionButton>{stringFormatter.format('newBranch')}</ActionButton>
            </div>
            {close => (
              <CreateBranchDialog
                onDismiss={close}
                onCreate={branchName => {
                  close();
                  router.push(
                    router.href.replace(
                      /\/branch\/[^/]+/,
                      '/branch/' + encodeURIComponent(branchName)
                    )
                  );
                }}
              />
            )}
          </DialogTrigger>
        </Flex>
      )}
    </Flex>
  );
}

// Utils
// ------------------------------

type Changes = ReturnType<typeof useChanged>;

function getCountsForCollection(options: {
  collection: string;
  changes: Changes;
}) {
  let { changes, collection } = options;
  let added = 0;
  let removed = 0;
  let changed = 0;
  let total = 0;

  const collectionChanged = changes.collections.get(collection);

  if (collectionChanged) {
    added = collectionChanged.added.size;
    removed = collectionChanged.removed.size;
    changed = collectionChanged.changed.size;
    total = collectionChanged.totalCount;
  }

  return { added, removed, changed, total };
}
