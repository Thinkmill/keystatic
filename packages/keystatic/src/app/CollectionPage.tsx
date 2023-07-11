import { useLocalizedStringFormatter } from '@react-aria/i18n';
import { Key, useEffect, useMemo, useState } from 'react';

import { Badge } from '@keystar/ui/badge';
import { Breadcrumbs, Item } from '@keystar/ui/breadcrumbs';
import { Button } from '@keystar/ui/button';
import { alertCircleIcon } from '@keystar/ui/icon/icons/alertCircleIcon';
import { folderTreeIcon } from '@keystar/ui/icon/icons/folderTreeIcon';
import { listStartIcon } from '@keystar/ui/icon/icons/listStartIcon';
import { TextLink } from '@keystar/ui/link';
import { ProgressCircle } from '@keystar/ui/progress';
import { SearchField } from '@keystar/ui/search-field';
import {
  TableView,
  TableBody,
  TableHeader,
  Column,
  Cell,
  Row,
  SortDescriptor,
} from '@keystar/ui/table';

import { Config } from '../config';
import { sortByDescriptor } from './collection-sort';
import l10nMessages from './l10n/index.json';
import { useRouter } from './router';
import { AppShellRoot, EmptyState } from './shell';
import { useTree, TreeData } from './shell/data';
import { AppShellHeader } from './shell/header';
import { getCollectionPath, getEntriesInCollectionWithTreeKey } from './utils';

type CollectionPageProps = {
  collection: string;
  config: Config;
  basePath: string;
};
type CollectionStatus = 'loading' | 'loaded' | 'error';
type CollectionState = {
  status: CollectionStatus;
  setStatus: (status: CollectionStatus) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
};

function useCollectionState(collection: string): CollectionState {
  const [status, setStatus] = useState<CollectionStatus>('loaded');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setSearchTerm('');
  }, [collection]);

  return { status, setStatus, searchTerm, setSearchTerm };
}

export function CollectionPage(props: CollectionPageProps) {
  const { collection, config } = props;
  const containerWidth = 'none'; // TODO: use a "large" when we have more columns
  const collectionConfig = config.collections?.[collection];

  let collectionState = useCollectionState(collection);
  let debouncedSearchTerm = useDebouncedValue(collectionState.searchTerm, 300);

  if (!collectionConfig) {
    return (
      <AppShellRoot containerWidth={containerWidth}>
        <AppShellHeader>
          <Breadcrumbs flex minWidth={0}>
            {/* TODO: l10n */}
            <Item key="collection">Error…</Item>
          </Breadcrumbs>
        </AppShellHeader>
        <EmptyState
          icon={alertCircleIcon}
          title="Not found"
          message={`Collection "${collection}" not found in config.`}
          actions={
            <Button tone="accent" href={props.basePath}>
              Dashboard
            </Button>
          }
        />
      </AppShellRoot>
    );
  }

  return (
    <AppShellRoot containerWidth={containerWidth}>
      <CollectionPageHeader
        collectionLabel={collectionConfig.label}
        createHref={`${props.basePath}/collection/${encodeURIComponent(
          props.collection
        )}/create`}
        {...collectionState}
      />
      <CollectionPageContent
        searchTerm={debouncedSearchTerm}
        setStatus={collectionState.setStatus}
        {...props}
      />
    </AppShellRoot>
  );
}

function CollectionPageHeader(
  props: CollectionState & {
    createHref: string;
    collectionLabel: string;
  }
) {
  const { collectionLabel, createHref, searchTerm, setSearchTerm, status } =
    props;
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);

  return (
    <AppShellHeader>
      <Breadcrumbs flex minWidth={0}>
        <Item key="collection">{collectionLabel}</Item>
      </Breadcrumbs>
      <div role="search">
        <SearchField
          isDisabled={status !== 'loaded'}
          aria-label={stringFormatter.format('search')} // TODO: l10n "Search {collection}"?
          onChange={setSearchTerm}
          onClear={() => setSearchTerm('')}
          placeholder={stringFormatter.format('search')}
          value={searchTerm}
          width="scale.2400"
        />
      </div>
      <Button marginStart="auto" prominence="high" href={createHref}>
        {stringFormatter.format('add')}
      </Button>
    </AppShellHeader>
  );
}

type CollectionPageContentProps = CollectionPageProps &
  Pick<CollectionState, 'searchTerm' | 'setStatus'>;
function CollectionPageContent(props: CollectionPageContentProps) {
  const { setStatus } = props;
  const trees = useTree();

  const tree =
    trees.merged.kind === 'loaded'
      ? trees.merged.data.current.entries.get(
          getCollectionPath(props.config, props.collection)
        )
      : null;

  useEffect(() => {
    let status = trees.merged.kind;
    if (tree?.type !== 'tree') {
      status = 'error';
    }
    setStatus(status);
  }, [setStatus, tree?.type, trees.merged.kind]);

  if (trees.merged.kind === 'error') {
    return (
      <EmptyState
        icon={alertCircleIcon}
        title="Unable to load collection"
        message={trees.merged.error.message}
        actions={
          <Button tone="accent" href={props.basePath}>
            Dashboard
          </Button>
        }
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
        actions={
          <Button tone="accent" href={props.basePath}>
            Dashboard
          </Button>
        }
      />
    );
  }

  return <CollectionTable {...props} trees={trees.merged.data} />;
}

function CollectionTable(
  props: CollectionPageContentProps & {
    trees: {
      default: TreeData;
      current: TreeData;
    };
  }
) {
  let { searchTerm } = props;

  let router = useRouter();
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
    <TableView
      aria-labelledby="page-title"
      flex
      selectionMode="none"
      onSortChange={setSortDescriptor}
      sortDescriptor={sortDescriptor}
      overflowMode="truncate"
      // prominence="low"
      margin={{ mobile: 'regular', tablet: 'medium' }}
      onRowAction={key => {
        router.push(getItemPath(props.basePath, props.collection, key));
      }}
    >
      <TableHeader
        columns={[
          { name: 'Name', key: 'name' },
          {
            name: 'Status',
            key: 'status',
            minWidth: 140,
            width: '20%',
          },
        ]}
      >
        {({ name, key, ...options }) => (
          <Column key={key} isRowHeader allowsSorting {...options}>
            {name}
          </Column>
        )}
      </TableHeader>
      <TableBody items={sortedItems}>
        {item => (
          <Row key={item.name}>
            <Cell textValue={item.name}>
              <TextLink
                href={getItemPath(props.basePath, props.collection, item.name)}
              >
                {item.name}
              </TextLink>
            </Cell>
            <Cell textValue={item.status}>
              <Badge tone={statusTones[item.status]}>{item.status}</Badge>
            </Cell>
          </Row>
        )}
      </TableBody>
    </TableView>
    // </Flex>
    // </AppShellBody>
  );
}

function getItemPath(basePath: string, collection: string, key: Key): string {
  return `${basePath}/collection/${encodeURIComponent(
    collection
  )}/item/${encodeURIComponent(key)}`;
}
export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

const statusTones = {
  Added: 'positive',
  Changed: 'accent',
  Unchanged: 'neutral',
} as const;
