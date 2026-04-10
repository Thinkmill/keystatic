import { useLocalizedStringFormatter } from '@react-aria/i18n';
import { isHotkey } from 'is-hotkey';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Selection } from '@react-types/shared';

import { ActionButton, Button } from '@keystar/ui/button';
import { Icon } from '@keystar/ui/icon';
import { alertCircleIcon } from '@keystar/ui/icon/icons/alertCircleIcon';
import { listXIcon } from '@keystar/ui/icon/icons/listXIcon';
import { searchIcon } from '@keystar/ui/icon/icons/searchIcon';
import { searchXIcon } from '@keystar/ui/icon/icons/searchXIcon';
import { diffIcon } from '@keystar/ui/icon/icons/diffIcon';
import { plusSquareIcon } from '@keystar/ui/icon/icons/plusSquareIcon';
import { dotSquareIcon } from '@keystar/ui/icon/icons/dotSquareIcon';
import { trash2Icon } from '@keystar/ui/icon/icons/trash2Icon';
import { downloadIcon } from '@keystar/ui/icon/icons/downloadIcon';
import { TextLink } from '@keystar/ui/link';
import { ProgressCircle } from '@keystar/ui/progress';
import { SearchField } from '@keystar/ui/search-field';
import { ActionBar, ActionBarContainer, Item } from '@keystar/ui/action-bar';
import { toastQueue } from '@keystar/ui/toast';
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
import { Flex } from '@keystar/ui/layout';

import { Config } from '../config';
import { sortBy } from './collection-sort';
import l10nMessages from './l10n';
import { useRouter } from './router';
import { EmptyState } from './shell/empty-state';
import {
  useTree,
  TreeData,
  useBaseCommit,
  useCurrentBranch,
  useRepoInfo,
} from './shell/data';
import { PageRoot, PageHeader } from './shell/page';
import {
  getCollectionFormat,
  getCollectionItemPath,
  getCollectionPath,
  getEntriesInCollectionWithTreeKey,
  getEntryDataFilepath,
  getSlugGlobForCollection,
  isLocalConfig,
} from './utils';
import { notFound } from './not-found';
import { fetchBlob } from './useItemData';
import { loadDataFile } from './required-files';
import { parseProps } from '../form/parse-props';
import { useData } from './useData';
import {
  FilterPanel,
  ActiveFilterChips,
  FilterValue,
  DEFAULT_FILTERS,
} from './FilterPanel';
import { ViewModeToggle, ViewMode } from './ViewModeToggle';
import { CollectionGridView } from './CollectionViews';

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

  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(
    new URLSearchParams(router.search).get('search') ?? ''
  );
  const [filters, setFilters] = useState<FilterValue>(DEFAULT_FILTERS);
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  const setSearchTermFromForm = useCallback(
    (value: string) => {
      setSearchTerm(value);
      const params = new URLSearchParams(router.search);
      if (value) {
        params.set('search', value);
      } else {
        params.delete('search');
      }
      router.replace(router.pathname + '?' + params.toString());
    },
    [router]
  );

  let debouncedSearchTerm = useDebouncedValue(searchTerm, 300);

  return (
    <PageRoot containerWidth={containerWidth}>
      <CollectionPageHeader
        collectionLabel={collectionConfig.label}
        createHref={`${props.basePath}/collection/${encodeURIComponent(
          props.collection
        )}/create`}
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTermFromForm}
        filters={filters}
        onFiltersChange={setFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
      <CollectionPageContent
        searchTerm={debouncedSearchTerm}
        filters={filters}
        viewMode={viewMode}
        {...props}
      />
    </PageRoot>
  );
}

function CollectionPageHeader(props: {
  createHref: string;
  collectionLabel: string;
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  filters: FilterValue;
  onFiltersChange: (filters: FilterValue) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}) {
  const {
    collectionLabel,
    createHref,
    filters,
    onFiltersChange,
    viewMode,
    onViewModeChange,
  } = props;
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);
  const isAboveMobile = useMediaQuery(breakpointQueries.above.mobile);
  const [searchVisible, setSearchVisible] = useState(isAboveMobile);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSearchVisible(isAboveMobile);
  }, [isAboveMobile]);

  // entries are presented in a virtualized table view, so we replace the
  // default (e.g. ctrl+f) browser search behaviour
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      // bail if the search field is already focused; let users invoke the
      // browser search if they need to
      if (document.activeElement === searchRef.current) {
        return;
      }

      if (isHotkey('mod+f', event)) {
        event.preventDefault();
        searchRef.current?.select();
      }
    };
    document.addEventListener('keydown', listener);
    return () => document.removeEventListener('keydown', listener);
  }, []);

  return (
    <PageHeader>
      <Flex direction="column" gap="regular" flex>
        <Flex alignItems="center" gap="regular">
          <Heading elementType="h1" id="page-title" size="small" flex minWidth={0}>
            {collectionLabel}
          </Heading>
          <div
            role="search"
            style={{
              display: searchVisible ? 'block' : 'none',
              minWidth: 0,
              maxWidth: '100%',
            }}
          >
            <SearchField
              ref={searchRef}
              aria-label={stringFormatter.format('search')}
              onChange={props.onSearchTermChange}
              onClear={() => {
                props.onSearchTermChange('');
                if (!isAboveMobile) {
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
              width={isAboveMobile ? 'scale.2400' : 'scale.2000'}
            />
          </div>
          <ActionButton
            aria-label="show search"
            isHidden={searchVisible || { above: 'mobile' }}
            onPress={() => {
              setSearchVisible(true);
              requestAnimationFrame(() => {
                searchRef.current?.focus();
              });
            }}
          >
            <Icon src={searchIcon} />
          </ActionButton>
          <FilterPanel
            filters={filters}
            onFiltersChange={onFiltersChange}
            showStatusFilter={true}
          />
          <ViewModeToggle value={viewMode} onChange={onViewModeChange} />
          <Button
            marginStart="auto"
            prominence="high"
            href={createHref}
            isHidden={searchVisible ? { below: 'tablet' } : undefined}
          >
            {stringFormatter.format('add')}
          </Button>
        </Flex>
        <ActiveFilterChips filters={filters} onFiltersChange={onFiltersChange} />
      </Flex>
    </PageHeader>
  );
}

type CollectionPageContentProps = CollectionPageProps & {
  searchTerm: string;
  filters: FilterValue;
  viewMode: ViewMode;
};
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

const SLUG = '@@slug';
const STATUS = '@@status';

function CollectionTable(
  props: CollectionPageContentProps & {
    trees: {
      default: TreeData;
      current: TreeData;
    };
  }
) {
  let { searchTerm } = props;

  const repoInfo = useRepoInfo();
  const currentBranch = useCurrentBranch();
  let isLocalMode = isLocalConfig(props.config);
  let router = useRouter();
  let [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: SLUG,
    direction: 'ascending',
  });
  let [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());
  let hideStatusColumn =
    isLocalMode || currentBranch === repoInfo?.defaultBranch;

  const baseCommit = useBaseCommit();

  const collection = props.config.collections![props.collection]!;

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
        sha: entry.sha,
      };
    });
  }, [props.collection, props.config, props.trees]);

  const mainFiles = useData(
    useCallback(async () => {
      if (!collection.columns?.length) return undefined;
      const formatInfo = getCollectionFormat(props.config, props.collection);
      const entries = await Promise.all(
        entriesWithStatus.map(async entry => {
          return [
            entry.name,
            await fetchBlob(
              props.config,
              entry.sha,
              getEntryDataFilepath(
                getCollectionItemPath(
                  props.config,
                  props.collection,
                  entry.name
                ),
                formatInfo
              ),
              baseCommit,
              repoInfo
            ),
          ] as const;
        })
      );
      const glob = getSlugGlobForCollection(props.config, props.collection);
      const rootSchema = { kind: 'object' as const, fields: collection.schema };
      const parsedEntries = new Map<string, Record<string, unknown>>();
      for (const [slug, dataFile] of entries) {
        try {
          const { loaded } = loadDataFile(dataFile, formatInfo);
          const validated = parseProps(
            rootSchema,
            loaded,
            [],
            [],
            (schema, value, path) => {
              if (schema.formKind === 'asset') {
                return schema.reader.parse(value);
              }
              if (
                schema.formKind === 'content' ||
                schema.formKind === 'assets'
              ) {
                return;
              }
              if (path.length === 1 && slug !== undefined) {
                if (path[0] === collection.slugField) {
                  if (schema.formKind !== 'slug') {
                    throw new Error(
                      `Slug field ${collection.slugField} is not a slug field`
                    );
                  }
                  return schema.reader.parseWithSlug(value, {
                    slug,
                    glob,
                  });
                }
              }
              return schema.reader.parse(value);
            },
            true
          );
          parsedEntries.set(slug, validated as Record<string, unknown>);
        } catch {}
      }
      return parsedEntries;
    }, [
      collection,
      props.config,
      props.collection,
      entriesWithStatus,
      baseCommit,
      repoInfo,
    ])
  );

  const entriesWithData = useMemo((): {
    name: string;
    status: string;
    sha: string;
    data?: Record<string, unknown>;
  }[] => {
    if (mainFiles.kind !== 'loaded' || !mainFiles.data) {
      return entriesWithStatus;
    }
    const { data } = mainFiles;
    return entriesWithStatus.map(entry => {
      return {
        ...entry,
        data: data.get(entry.name),
      };
    });
  }, [entriesWithStatus, mainFiles]);

  const filteredItems = useMemo(() => {
    return entriesWithData.filter(item => {
      // Search filter
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      // Status filter
      const { filters } = props;
      const hasStatusFilter =
        filters.status.added || filters.status.changed || filters.status.unchanged;
      const matchesStatus =
        !hasStatusFilter ||
        (filters.status.added && item.status === 'Added') ||
        (filters.status.changed && item.status === 'Changed') ||
        (filters.status.unchanged && item.status === 'Unchanged');

      return matchesSearch && matchesStatus;
    });
  }, [entriesWithData, searchTerm, props.filters]);
  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      const readCol = (
        row: typeof a,
        other: Record<string, unknown> | undefined
      ) => {
        if (sortDescriptor.column === SLUG) {
          return collection.parseSlugForSort?.(row.name) ?? row.name;
        }
        if (sortDescriptor.column === STATUS) {
          return row.status;
        }
        return other?.[sortDescriptor.column!] ?? row.name;
      };
      const other = mainFiles.kind === 'loaded' ? mainFiles.data : undefined;
      return sortBy(
        sortDescriptor.direction!,
        readCol(a, other?.get(a.name)),
        readCol(b, other?.get(b.name))
      );
    });
  }, [
    collection,
    filteredItems,
    mainFiles,
    sortDescriptor.column,
    sortDescriptor.direction,
  ]);

  const columns = useMemo(() => {
    if (collection.columns?.length) {
      return [
        ...(hideStatusColumn
          ? []
          : [{ name: 'Status', key: STATUS, minWidth: 32, width: 32 }]),
        {
          name: 'Slug',
          key: SLUG,
        },
        ...collection.columns.map(column => {
          const schema = collection.schema[column];
          return {
            name: ('label' in schema && schema.label) || column,
            key: column,
          };
        }),
      ];
    }
    return hideStatusColumn
      ? [{ name: 'Name', key: SLUG }]
      : [
          { name: 'Status', key: STATUS, minWidth: 32, width: 32 },
          { name: 'Name', key: SLUG },
        ];
  }, [collection, hideStatusColumn]);

  // Handle bulk actions
  const handleBulkAction = useCallback(
    (action: React.Key) => {
      const selectedSlugs = selectedKeys === 'all'
        ? sortedItems.map(item => item.name)
        : Array.from(selectedKeys).map(key => key.toString().slice('key:'.length));

      switch (action) {
        case 'delete':
          // Delete will be handled by a confirmation dialog
          break;
        case 'export':
          // Export selected entries as JSON
          const exportData = sortedItems
            .filter(item => selectedSlugs.includes(item.name))
            .map(item => ({
              slug: item.name,
              status: item.status,
              data: item.data,
            }));
          const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json',
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${props.collection}-export.json`;
          a.click();
          URL.revokeObjectURL(url);
          toastQueue.positive(`Exported ${selectedSlugs.length} entries`);
          setSelectedKeys(new Set());
          break;
        case 'duplicate':
          if (selectedSlugs.length === 1) {
            router.push(
              `${props.basePath}/collection/${encodeURIComponent(
                props.collection
              )}/item/${encodeURIComponent(selectedSlugs[0])}`
            );
          }
          break;
      }
    },
    [selectedKeys, sortedItems, props.collection, props.basePath, router]
  );

  const selectedCount =
    selectedKeys === 'all' ? sortedItems.length : selectedKeys.size;

  // Render grid or list view
  if (props.viewMode === 'grid') {
    return (
      <ActionBarContainer height="100%">
        <CollectionGridView
          items={sortedItems}
          basePath={props.basePath}
          collection={props.collection}
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
          columns={collection.columns?.map(c => ({ key: c, label: c }))}
        />
        <ActionBar
          selectedItemCount={selectedCount}
          onAction={handleBulkAction}
          onClearSelection={() => setSelectedKeys(new Set())}
        >
          <Item key="export">
            <Icon src={downloadIcon} />
            <Text>Export</Text>
          </Item>
          <Item key="delete">
            <Icon src={trash2Icon} />
            <Text>Delete</Text>
          </Item>
        </ActionBar>
      </ActionBarContainer>
    );
  }

  // Default table view
  return (
    <ActionBarContainer height="100%">
      <TableView
        aria-labelledby="page-title"
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
        sortDescriptor={sortDescriptor}
        density="spacious"
        overflowMode="truncate"
        prominence="low"
        onAction={key => {
          router.push(
            getItemPath(
              props.basePath,
              props.collection,
              key.toString().slice('key:'.length)
            )
          );
        }}
        renderEmptyState={() => (
          <EmptyState
            icon={searchXIcon}
            title="No results"
            message={`No items matching "${searchTerm}" were found.`}
          />
        )}
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
      <TableHeader columns={columns}>
        {({ name, key, ...options }) =>
          key === STATUS ? (
            <Column key={key} isRowHeader allowsSorting {...options}>
              <Icon aria-label="Status" src={diffIcon} />
            </Column>
          ) : (
            <Column key={key} isRowHeader allowsSorting {...options}>
              {name}
            </Column>
          )
        }
      </TableHeader>
      <TableBody items={sortedItems}>
        {item => {
          const statusCell = (
            <Cell key={STATUS + item.name} textValue={item.status}>
              {item.status === 'Added' ? (
                <Icon color="positive" src={plusSquareIcon} />
              ) : item.status === 'Changed' ? (
                <Icon color="accent" src={dotSquareIcon} />
              ) : null}
            </Cell>
          );
          const nameCell = (
            <Cell key={SLUG + item.name} textValue={item.name as string}>
              <Text weight="medium">{item.name as string}</Text>
            </Cell>
          );
          if (collection.columns?.length) {
            return (
              <Row key={'key:' + item.name}>
                {[
                  ...(hideStatusColumn ? [] : [statusCell]),
                  nameCell,
                  ...collection.columns.map(column => {
                    let val;
                    val = item.data?.[column];

                    if (val == null) {
                      val = undefined;
                    } else {
                      val = val + '';
                    }
                    return (
                      <Cell key={column + item.name} textValue={val}>
                        <Text weight="medium">{val}</Text>
                      </Cell>
                    );
                  }),
                ]}
              </Row>
            );
          }
          return hideStatusColumn ? (
            <Row key={'key:' + item.name}>{nameCell}</Row>
          ) : (
            <Row key={'key:' + item.name}>
              {statusCell}
              {nameCell}
            </Row>
          );
        }}
      </TableBody>
    </TableView>
    <ActionBar
      selectedItemCount={selectedCount}
      onAction={handleBulkAction}
      onClearSelection={() => setSelectedKeys(new Set())}
    >
      <Item key="export">
        <Icon src={downloadIcon} />
        <Text>Export</Text>
      </Item>
      <Item key="delete">
        <Icon src={trash2Icon} />
        <Text>Delete</Text>
      </Item>
    </ActionBar>
  </ActionBarContainer>
  );
}

function getItemPath(
  basePath: string,
  collection: string,
  key: string | number
): string {
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
