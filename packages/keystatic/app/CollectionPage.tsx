import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';

import { Badge } from '@voussoir/badge';
import { Button } from '@voussoir/button';
import { folderTreeIcon } from '@voussoir/icon/icons/folderTreeIcon';
import { listStartIcon } from '@voussoir/icon/icons/listStartIcon';
import { alertCircleIcon } from '@voussoir/icon/icons/alertCircleIcon';
import { Flex } from '@voussoir/layout';
import { TextLink } from '@voussoir/link';
import { ProgressCircle } from '@voussoir/progress';
import { SearchField } from '@voussoir/search-field';
import {
  TableView,
  TableBody,
  TableHeader,
  Column,
  Cell,
  Row,
  SortDescriptor,
} from '@voussoir/table';
import { Heading } from '@voussoir/typography';

import { Config } from '../config';
import { sortByDescriptor } from './collection-sort';
import { AppShellBody, AppShellRoot, EmptyState } from './shell';
import { getTreeNodeAtPath, TreeNode } from './trees';
import {
  getCollectionFormat,
  getCollectionPath,
  getDataFileExtension,
  getTreeNodeForItem,
} from './utils';
import { useTree, TreeData } from './shell/data';
import { AppShellHeader } from './shell/header';

type CollectionPageProps = {
  collection: string;
  config: Config;
  basePath: string;
};

export function CollectionPage(props: CollectionPageProps) {
  const containerWidth = 'large'; // TODO: use a "large" when we have more columns
  const collectionConfig = props.config.collections?.[props.collection];

  if (!collectionConfig) {
    return (
      <AppShellRoot containerWidth={containerWidth}>
        <div /> {/* Take the "header" grid area */}
        <EmptyState
          icon={alertCircleIcon}
          title="Not found"
          message={`Collection "${props.collection}" not found in config.`}
        />
      </AppShellRoot>
    );
  }

  return (
    <AppShellRoot containerWidth={containerWidth}>
      <AppShellHeader>
        <Heading elementType="h1" id="page-title" size="small" truncate>
          {collectionConfig.label}
        </Heading>

        <Button
          marginStart="auto"
          prominence="high"
          href={`${props.basePath}/collection/${encodeURIComponent(
            props.collection
          )}/create`}
        >
          New entry
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
  let router = useRouter();
  let [searchTerm, setSearchTerm] = useState('');
  let [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'name',
    direction: 'ascending',
  });

  const entries = useMemo(() => {
    const collectionPath = getCollectionPath(props.config, props.collection);
    const fallback = new Map<string, TreeNode>();
    return {
      current:
        getTreeNodeAtPath(props.trees.current.tree, collectionPath)?.children ??
        fallback,
      default:
        getTreeNodeAtPath(props.trees.default.tree, collectionPath)?.children ??
        fallback,
    };
  }, [props.collection, props.config, props.trees]);

  const entriesWithStatus = useMemo(() => {
    return [...entries.current]
      .filter(([, entry]) =>
        getTreeNodeForItem(
          props.config,
          props.collection,
          entry
        )?.children?.has(
          `index${getDataFileExtension(
            getCollectionFormat(props.config, props.collection)
          )}`
        )
      )
      .map(([name, entry]) => {
        return {
          name,
          status: entries.default.has(name)
            ? entries.default.get(name)?.entry.sha === entry.entry.sha
              ? 'Unchanged'
              : 'Changed'
            : 'Added',
        } as const;
      });
  }, [entries, props.collection, props.config]);

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
            aria-label="Filter entries"
            onChange={setSearchTerm}
            onClear={() => setSearchTerm('')}
            placeholder="Filter..."
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
