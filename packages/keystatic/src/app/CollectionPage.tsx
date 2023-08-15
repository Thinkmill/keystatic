import { useLocalizedStringFormatter } from '@react-aria/i18n';
import React, { Key, useEffect, useMemo, useRef, useState } from 'react';

import { ActionButton, Button } from '@keystar/ui/button';
import { Icon } from '@keystar/ui/icon';
import { alertCircleIcon } from '@keystar/ui/icon/icons/alertCircleIcon';
import { listXIcon } from '@keystar/ui/icon/icons/listXIcon';
import { searchIcon } from '@keystar/ui/icon/icons/searchIcon';
import { searchXIcon } from '@keystar/ui/icon/icons/searchXIcon';
import { TextLink } from '@keystar/ui/link';
import { ProgressCircle } from '@keystar/ui/progress';
import { SearchField } from '@keystar/ui/search-field';
import { StatusLight } from '@keystar/ui/status-light';
import {
  breakpointQueries,
  css,
  tokenSchema,
  useMediaQuery,
} from '@keystar/ui/style';
import {
  TableView,
  TableBody,
  TableHeader,
  Column,
  Cell,
  Row,
  SortDescriptor,
} from '@keystar/ui/table';
import { Heading, Text } from '@keystar/ui/typography';

import { Config } from '../config';
import { sortByDescriptor } from './collection-sort';
import l10nMessages from './l10n/index.json';
import { useRouter } from './router';
import { EmptyState } from './shell/empty-state';
import { useTree, TreeData } from './shell/data';
import { PageRoot, PageHeader } from './shell/page';
import { getCollectionPath, getEntriesInCollectionWithTreeKey } from './utils';
import { notFound } from './not-found';

type CollectionPageProps = {
  collection: string;
  config: Config;
  basePath: string;
};

export function CollectionPage(props: CollectionPageProps) {
  const { collection, config } = props;
  const containerWidth = 'none'; // TODO: use a "large" when we have more columns
  const collectionConfig = config.collections?.[collection];
  if (!collectionConfig) notFound();
  const [searchTerm, setSearchTerm] = useState('');

  let debouncedSearchTerm = useDebouncedValue(searchTerm, 300);

  return (
    <PageRoot containerWidth={containerWidth}>
      <CollectionPageHeader
        collectionLabel={collectionConfig.label}
        createHref={`${props.basePath}/collection/${encodeURIComponent(
          props.collection
        )}/create`}
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
      />
      <CollectionPageContent searchTerm={debouncedSearchTerm} {...props} />
    </PageRoot>
  );
}

function CollectionPageHeader(props: {
  createHref: string;
  collectionLabel: string;
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
}) {
  const { collectionLabel, createHref } = props;
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);
  const isAboveMobile = useMediaQuery(breakpointQueries.above.mobile);
  const [searchVisible, setSearchVisible] = useState(isAboveMobile);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSearchVisible(isAboveMobile);
  }, [isAboveMobile]);

  return (
    <PageHeader>
      <Heading elementType="h1" id="page-title" size="small" flex minWidth={0}>
        {collectionLabel}
      </Heading>
      <div
        role="search"
        style={{
          display: searchVisible ? 'block' : 'none',
        }}
      >
        <SearchField
          ref={searchRef}
          aria-label={stringFormatter.format('search')} // TODO: l10n "Search {collection}"?
          onChange={props.onSearchTermChange}
          onClear={() => {
            props.onSearchTermChange('');
            if (!isAboveMobile) {
              // the timeout ensures that the "add" button isn't pressed
              setTimeout(() => {
                setSearchVisible(false);
              }, 250);
            }
          }}
          onBlur={() => {
            if (!isAboveMobile && props.searchTerm === '') {
              setSearchVisible(false);
            }
          }}
          placeholder={stringFormatter.format('search')}
          value={props.searchTerm}
          width="scale.2400"
        />
      </div>
      <ActionButton
        aria-label="show search"
        isHidden={searchVisible || { above: 'mobile' }}
        onPress={() => {
          setSearchVisible(true);
          // NOTE: this hack is to force the search field to focus, and invoke
          // the software keyboard on mobile safari
          let tempInput = document.createElement('input');
          tempInput.style.position = 'absolute';
          tempInput.style.opacity = '0';
          document.body.appendChild(tempInput);
          tempInput.focus();

          setTimeout(() => {
            searchRef.current?.focus();
            tempInput.remove();
          }, 0);
        }}
      >
        <Icon src={searchIcon} />
      </ActionButton>
      <Button
        marginStart="auto"
        prominence="high"
        href={createHref}
        isHidden={searchVisible ? { below: 'tablet' } : undefined}
      >
        {stringFormatter.format('add')}
      </Button>
    </PageHeader>
  );
}

type CollectionPageContentProps = CollectionPageProps & { searchTerm: string };
function CollectionPageContent(props: CollectionPageContentProps) {
  const trees = useTree();

  const tree =
    trees.merged.kind === 'loaded'
      ? trees.merged.data.current.entries.get(
          getCollectionPath(props.config, props.collection)
        )
      : null;

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
        icon={listXIcon}
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
      selectionMode="none"
      onSortChange={setSortDescriptor}
      sortDescriptor={sortDescriptor}
      overflowMode="truncate"
      onRowAction={key => {
        router.push(getItemPath(props.basePath, props.collection, key));
      }}
      renderEmptyState={() => (
        <EmptyState
          icon={searchXIcon}
          title="No results"
          message={`No items matching "${searchTerm}" were found.`}
        />
      )}
      prominence="low"
      flex
      marginTop={{ tablet: 'large' }}
      marginBottom={{ mobile: 'regular', tablet: 'xlarge' }}
      UNSAFE_className={css({
        marginInline: tokenSchema.size.space.regular,
        [breakpointQueries.above.mobile]: {
          marginInline: `calc(${tokenSchema.size.space.xlarge} - ${tokenSchema.size.space.medium})`,
        },
        [breakpointQueries.above.tablet]: {
          marginInline: `calc(${tokenSchema.size.space.xxlarge} - ${tokenSchema.size.space.medium})`,
        },

        '[role=rowheader]': {
          cursor: 'pointer',
        },
      })}
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
              <Text weight="medium">{item.name}</Text>
            </Cell>
            <Cell textValue={item.status}>
              <StatusLight tone={statusTones[item.status]}>
                {item.status}
              </StatusLight>
            </Cell>
          </Row>
        )}
      </TableBody>
    </TableView>
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
