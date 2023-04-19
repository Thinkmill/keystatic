import { useLocalizedStringFormatter } from '@react-aria/i18n';
import { useMemo, useState } from 'react';

import { Badge } from '@keystar-ui/badge';
import { Breadcrumbs, Item } from '@keystar-ui/breadcrumbs';
import { Button } from '@keystar-ui/button';
import { Icon } from '@keystar-ui/icon';
import { alertCircleIcon } from '@keystar-ui/icon/icons/alertCircleIcon';
import { externalLinkIcon } from '@keystar-ui/icon/icons/externalLinkIcon';
import { folderTreeIcon } from '@keystar-ui/icon/icons/folderTreeIcon';
import { listStartIcon } from '@keystar-ui/icon/icons/listStartIcon';
import { Flex } from '@keystar-ui/layout';
import { TextLink } from '@keystar-ui/link';
import { ActionMenu } from '@keystar-ui/menu';
import { ProgressCircle } from '@keystar-ui/progress';
import { SearchField } from '@keystar-ui/search-field';
import {
  TableView,
  TableBody,
  TableHeader,
  Column,
  Cell,
  Row,
  SortDescriptor,
} from '@keystar-ui/table';
import { Text } from '@keystar-ui/typography';

import { Config } from '../config';
import { sortByDescriptor } from './collection-sort';
import l10nMessages from './l10n/index.json';
import { useRouter } from './router';
import { AppShellBody, AppShellRoot, EmptyState } from './shell';
import { useTree, TreeData, useBranchInfo } from './shell/data';
import { AppShellHeader } from './shell/header';
import {
  getCollectionPath,
  getEntriesInCollectionWithTreeKey,
  getRepoUrl,
} from './utils';

type CollectionPageProps = {
  collection: string;
  config: Config;
  basePath: string;
};

export function CollectionPage(props: CollectionPageProps) {
  const { collection, config } = props;
  const containerWidth = 'medium'; // TODO: use a "large" when we have more columns
  const collectionConfig = config.collections?.[collection];
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);
  const branchInfo = useBranchInfo();

  if (!collectionConfig) {
    return (
      <AppShellRoot containerWidth={containerWidth}>
        <div /> {/* Take the "header" grid area */}
        <EmptyState
          icon={alertCircleIcon}
          title="Not found"
          message={`Collection "${collection}" not found in config.`}
        />
      </AppShellRoot>
    );
  }

  return (
    <AppShellRoot containerWidth={containerWidth}>
      <AppShellHeader>
        <Breadcrumbs size="medium" flex minWidth={0}>
          <Item key="collection">{collectionConfig.label}</Item>
        </Breadcrumbs>

        {(config.storage.kind === 'github' ||
          config.storage.kind === 'cloud') && (
          <ActionMenu
            prominence="low"
            onAction={key => {
              switch (key) {
                case 'view':
                  let collectionPath = `/tree/${branchInfo.currentBranch}/${collection}`;
                  window.open(
                    `${getRepoUrl(branchInfo)}${collectionPath}`,
                    '_blank',
                    'noopener,noreferrer'
                  );
                  break;
              }
            }}
          >
            <Item key="view" textValue="View on GitHub">
              <Icon src={externalLinkIcon} />
              <Text>View on GitHub</Text>
            </Item>
          </ActionMenu>
        )}
        <Button
          marginStart="auto"
          prominence="high"
          href={`${props.basePath}/collection/${encodeURIComponent(
            props.collection
          )}/create`}
        >
          {stringFormatter.format('add')}
        </Button>
      </AppShellHeader>

      <CollectionPageContent {...props} />
    </AppShellRoot>
  );
}

function CollectionPageContent(props: CollectionPageProps) {
  const trees = useTree();
  if (trees.merged.kind === 'error') {
    return (
      <EmptyState
        icon={alertCircleIcon}
        title="Unable to load collection"
        message={trees.merged.error.message}
      />
    );
  }

  if (trees.merged.kind === 'loading') {
    return (
      <EmptyState>
        <ProgressCircle
          aria-label="Loading Entries"
          isIndeterminate
          size="large"
        />
      </EmptyState>
    );
  }

  const tree = trees.merged.data.current.entries.get(
    getCollectionPath(props.config, props.collection)
  );
  if (!tree) {
    return (
      <EmptyState
        icon={listStartIcon}
        title="Empty collection"
        message={
          <>
            There aren't any entries yet.{' '}
            <TextLink
              href={`${props.basePath}/collection/${encodeURIComponent(
                props.collection
              )}/create`}
            >
              Create the first entry
            </TextLink>{' '}
            to see it here.
          </>
        }
      />
    );
  }

  if (tree.type !== 'tree') {
    return (
      <EmptyState
        icon={folderTreeIcon}
        title="Unable to load collection"
        message="Could not find collection directory in repository."
      />
    );
  }

  return <CollectionTable {...props} trees={trees.merged.data} />;
}

function CollectionTable(
  props: CollectionPageProps & {
    trees: {
      default: TreeData;
      current: TreeData;
    };
  }
) {
  let stringFormatter = useLocalizedStringFormatter(l10nMessages);
  let router = useRouter();
  let [searchTerm, setSearchTerm] = useState('');
  let [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'name',
    direction: 'ascending',
  });

  const entriesWithStatus = useMemo(() => {
    const defaultEntries = new Map(
      getEntriesInCollectionWithTreeKey(
        props.config,
        props.collection,
        props.trees.default.tree
      ).map(x => [x.slug, x.key])
    );
    return getEntriesInCollectionWithTreeKey(
      props.config,
      props.collection,
      props.trees.current.tree
    ).map(entry => {
      return {
        name: entry.slug,
        status: defaultEntries.has(entry.slug)
          ? defaultEntries.get(entry.slug) === entry.key
            ? 'Unchanged'
            : 'Changed'
          : 'Added',
      } as const;
    });
  }, [props.collection, props.config, props.trees]);

  const filteredItems = useMemo(() => {
    return entriesWithStatus.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [entriesWithStatus, searchTerm]);
  const sortedItems = useMemo(() => {
    return [...filteredItems].sort(sortByDescriptor(sortDescriptor));
  }, [filteredItems, sortDescriptor]);

  return (
    <AppShellBody>
      <Flex direction="column" gap="large">
        <Flex gap="large" alignItems="start" justifyContent="space-between">
          <SearchField
            aria-label={stringFormatter.format('search')}
            onChange={setSearchTerm}
            onClear={() => setSearchTerm('')}
            placeholder={stringFormatter.format('search')}
            value={searchTerm}
          />
        </Flex>
        <TableView
          aria-labelledby="page-title"
          width="100%"
          selectionMode="none"
          onSortChange={setSortDescriptor}
          sortDescriptor={sortDescriptor}
          overflowMode="truncate"
          onRowAction={key => {
            router.push(
              `${props.basePath}/collection/${encodeURIComponent(
                props.collection
              )}/item/${encodeURIComponent(key)}`
            );
          }}
          // UNSAFE_className={css({
          //   '[role=row]> :first-child': { paddingInlineStart: tokenSchema.size.space.xlarge },
          //   '[role=row]> :last-child': { paddingInlineStart: tokenSchema.size.space.xlarge },
          // })}
        >
          <TableHeader
            columns={[
              { name: 'Name', key: 'name' },
              { name: 'Status', key: 'status', width: 140 },
            ]}
          >
            {column => (
              <Column isRowHeader allowsSorting width={column.width}>
                {column.name}
              </Column>
            )}
          </TableHeader>
          <TableBody items={sortedItems}>
            {item => (
              <Row key={item.name}>
                <Cell textValue={item.name}>{item.name}</Cell>
                <Cell textValue={item.status}>
                  <Badge tone={statusTones[item.status]}>{item.status}</Badge>
                </Cell>
              </Row>
            )}
          </TableBody>
        </TableView>
      </Flex>
    </AppShellBody>
  );
}

const statusTones = {
  Added: 'positive',
  Changed: 'accent',
  Unchanged: 'neutral',
} as const;
