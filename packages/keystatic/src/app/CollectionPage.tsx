import { useLocalizedStringFormatter } from '@react-aria/i18n';
import { isHotkey } from 'is-hotkey';
import React, {
  Key,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { ActionButton, Button } from '@keystar/ui/button';
import { Icon } from '@keystar/ui/icon';
import { alertCircleIcon } from '@keystar/ui/icon/icons/alertCircleIcon';
import { listXIcon } from '@keystar/ui/icon/icons/listXIcon';
import { searchIcon } from '@keystar/ui/icon/icons/searchIcon';
import { searchXIcon } from '@keystar/ui/icon/icons/searchXIcon';
import { diffIcon } from '@keystar/ui/icon/icons/diffIcon';
import { plusSquareIcon } from '@keystar/ui/icon/icons/plusSquareIcon';
import { dotSquareIcon } from '@keystar/ui/icon/icons/dotSquareIcon';
import { TextLink } from '@keystar/ui/link';
import { ProgressCircle } from '@keystar/ui/progress';
import { SearchField } from '@keystar/ui/search-field';
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
import { sortBy } from './collection-sort';
import l10nMessages from './l10n/index.json';
import { useRouter } from './router';
import { EmptyState } from './shell/empty-state';
import {
  useTree,
  TreeData,
  useBranchInfo,
  useBaseCommit,
  useIsRepoPrivate,
} from './shell/data';
import { PageRoot, PageHeader } from './shell/page';
import {
  getCollectionFormat,
  getCollectionItemPath,
  getCollectionPath,
  getEntriesInCollectionWithTreeKey,
  getEntryDataFilepath,
  getSlugGlobForCollection,
} from './utils';
import { notFound } from './not-found';
import { fetchBlob } from './useItemData';
import { loadDataFile } from './required-files';
import { parseProps } from '../form/parse-props';
import { useData } from './useData';

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

const SLUG = '@@slug';
const STATUS = '@@status';

function CollectionTable(
  props: CollectionPageContentProps & {
    trees: {
      committed: TreeData;
      current: TreeData;
    };
  }
) {
  let { searchTerm } = props;

  let router = useRouter();
  let [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: SLUG,
    direction: 'ascending',
  });

  const branchInfo = useBranchInfo();
  const isRepoPrivate = useIsRepoPrivate();
  const baseCommit = useBaseCommit();

  const collection = props.config.collections![props.collection]!;

  const entriesWithStatus = useMemo(() => {
    const defaultEntries = new Map(
      getEntriesInCollectionWithTreeKey(
        props.config,
        props.collection,
        props.trees.committed.tree
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
              isRepoPrivate,
              { owner: branchInfo.mainOwner, name: branchInfo.mainRepo }
            ),
          ] as const;
        })
      );
      const glob = getSlugGlobForCollection(props.config, props.collection);
      const rootSchema = { kind: 'object' as const, fields: collection.schema };
      return new Map(
        entries.map(([slug, dataFile]) => {
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
              if (schema.formKind === 'content') {
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
          return [slug, validated as Record<string, unknown>] as const;
        })
      );
    }, [
      baseCommit,
      branchInfo.mainOwner,
      branchInfo.mainRepo,
      collection,
      entriesWithStatus,
      isRepoPrivate,
      props.collection,
      props.config,
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
    return entriesWithData.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [entriesWithData, searchTerm]);
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
        { name: 'Status', key: STATUS, minWidth: 32, width: 32 },
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
    return [
      { name: 'Status', key: STATUS, minWidth: 32, width: 32 },
      { name: 'Name', key: SLUG },
    ];
  }, [collection]);

  return (
    <TableView
      aria-labelledby="page-title"
      selectionMode="none"
      onSortChange={setSortDescriptor}
      sortDescriptor={sortDescriptor}
      density="spacious"
      overflowMode="truncate"
      prominence="low"
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
              <Row key={item.name}>
                {[
                  statusCell,
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
          return (
            <Row key={item.name}>
              {statusCell}
              {nameCell}
            </Row>
          );
        }}
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
