import React, { useState, useRef, useEffect, useMemo, createContext, useContext, useCallback } from 'react';
import { ActionButton, Button, ButtonGroup } from '@keystar/ui/button';
import { Icon } from '@keystar/ui/icon';
import { fileX2Icon } from '@keystar/ui/icon/icons/fileX2Icon';
import { githubIcon } from '@keystar/ui/icon/icons/githubIcon';
import { Flex, Box, Divider, VStack } from '@keystar/ui/layout';
import { Heading, Text } from '@keystar/ui/typography';
import { useLocalizedStringFormatter, useLocale } from '@react-aria/i18n';
import isHotkey from 'is-hotkey';
import { alertCircleIcon } from '@keystar/ui/icon/icons/alertCircleIcon';
import { listXIcon } from '@keystar/ui/icon/icons/listXIcon';
import { searchIcon } from '@keystar/ui/icon/icons/searchIcon';
import { searchXIcon } from '@keystar/ui/icon/icons/searchXIcon';
import { TextLink, useLink } from '@keystar/ui/link';
import { ProgressCircle } from '@keystar/ui/progress';
import { SearchField } from '@keystar/ui/search-field';
import { StatusLight } from '@keystar/ui/status-light';
import { useMediaQuery, breakpointQueries, css, tokenSchema, injectGlobal, containerQueries, classNames, transition } from '@keystar/ui/style';
import { TableView, TableHeader, Column, TableBody, Row, Cell } from '@keystar/ui/table';
import { assert } from 'emery';
import { u as useRouter, P as PageRoot, l as l10nMessages, a as PageHeader, b as useTree, g as getCollectionPath, c as useBranchInfo, i as isLocalConfig, d as getEntriesInCollectionWithTreeKey, p as parseRepoConfig, s as serializeRepoConfig, e as getAuth, G as GitHubAppShellQuery, f as getEntryDataFilepath, o as object, h as parseProps, t as toFormattedFormDataError, j as useBaseCommit, k as useIsRepoPrivate, m as getDirectoriesForTreeKey, n as getTreeKey, q as useData, L as LOADING, r as getTreeNodeAtPath, v as isGitHubConfig, w as blobSha, x as getPathPrefix, K as KEYSTATIC_CLOUD_API_URL, y as KEYSTATIC_CLOUD_HEADERS, z as useTheme, T as ThemeProvider, A as getSyncAuth, B as redirectToCloudAuth, C as CloudAppShellQuery, D as BranchInfoContext, E as useSetTreeSha, R as RepoWithWriteAccessContext, F as useCurrentUnscopedTree, H as updateTreeWithChanges, I as hydrateTreeCacheWithEntries, J as scopeEntriesWithPathPrefix, M as fetchGitHubTreeData, N as treeSha, O as serializeProps, Q as getSlugFromState, S as useConfig, U as getSlugGlobForCollection, V as getCollectionFormat, W as getCollectionItemPath, X as PageBody, Y as containerWidthForEntryLayout, Z as createGetPreviewProps, _ as useEventCallback, $ as getRepoUrl, a0 as getDataFileExtension, a1 as clientSideValidateProp, a2 as FormForEntry, a3 as useRepositoryId, a4 as useCreateBranchMutation, a5 as getBranchPrefix, a6 as prettyErrorForCreateBranchMutation, a7 as getInitialPropsValue, a8 as CreateBranchDialog, a9 as useNavItems, aa as pluralize, ab as useViewer, ac as useCloudInfo, ad as useSidebar, ae as useContentPanelState, af as ContentPanelProvider, ag as SidebarDialog, ah as SidebarPanel, ai as AppShellErrorContext, aj as ConfigContext, ak as AppStateContext, al as SidebarProvider, am as GitHubAppShellProvider, an as LocalAppShellProvider, ao as getSingletonFormat, ap as getSingletonPath, aq as isCloudConfig, ar as assertValidRepoConfig, as as RouterProvider, at as GitHubAppShellDataContext, au as CloudInfoProvider, av as GitHubAppShellDataProvider } from '../../dist/index-47692431.esm.js';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { Breadcrumbs, Item } from '@keystar/ui/breadcrumbs';
import { Dialog, DialogContainer, AlertDialog, DialogTrigger } from '@keystar/ui/dialog';
import { Notice } from '@keystar/ui/notice';
import { Toaster, toastQueue } from '@keystar/ui/toast';
import '@keystar/ui/checkbox';
import { TextField } from '@keystar/ui/text-field';
import '@keystar/ui/field';
import '@keystar/ui/number-field';
import '@keystar/ui/combobox';
import 'minimatch';
import '@react-stately/collections';
import '@keystar/ui/picker';
import '@sindresorhus/slugify';
import '@braintree/sanitize-url';
import { Content } from '@keystar/ui/slots';
import '@keystar/ui/drag-and-drop';
import { trash2Icon } from '@keystar/ui/icon/icons/trash2Icon';
import '@keystar/ui/list-view';
import '@keystar/ui/tooltip';
import 'slate';
import 'slate-react';
import '@keystar/ui/menu';
import { ActionGroup, Item as Item$1 } from '@keystar/ui/action-group';
import { Badge } from '@keystar/ui/badge';
import { copyPlusIcon } from '@keystar/ui/icon/icons/copyPlusIcon';
import { externalLinkIcon } from '@keystar/ui/icon/icons/externalLinkIcon';
import { historyIcon } from '@keystar/ui/icon/icons/historyIcon';
import { useClient, Provider as Provider$1, createClient, fetchExchange, useMutation } from 'urql';
import { gql } from '@ts-gql/tag/no-transform';
import { SplitView, SplitPanePrimary, SplitPaneSecondary } from '@keystar/ui/split-view';
import '@keystar/ui/icon/icons/panelLeftOpenIcon';
import '@keystar/ui/icon/icons/panelLeftCloseIcon';
import '@keystar/ui/icon/icons/panelRightOpenIcon';
import '@keystar/ui/icon/icons/panelRightCloseIcon';
import { dump } from 'js-yaml';
import { fromUint8Array } from 'js-base64';
import LRU from 'lru-cache';
import { l as loadDataFile } from '../../dist/required-files-77a6642f.esm.js';
import { KeystarProvider, ClientSideOnlyDocumentElement } from '@keystar/ui/core';
import { cacheExchange } from '@urql/exchange-graphcache';
import { authExchange } from '@urql/exchange-auth';
import { persistedExchange } from '@urql/exchange-persisted';
import isEqual from 'fast-deep-equal';
import { u as useSlugsInCollection } from '../../dist/useSlugsInCollection-fdbc7ce8.esm.js';
import { z } from 'zod';
import { get, createStore, set, del } from 'idb-keyval';
import { Avatar } from '@keystar/ui/avatar';
import { gitBranchIcon } from '@keystar/ui/icon/icons/gitBranchIcon';
import { gitBranchPlusIcon } from '@keystar/ui/icon/icons/gitBranchPlusIcon';
import { gitPullRequestIcon } from '@keystar/ui/icon/icons/gitPullRequestIcon';
import { plusIcon } from '@keystar/ui/icon/icons/plusIcon';
import '@markdoc/markdoc';
import 'emery/assertions';
import '../../dist/hex-35fa8573.esm.js';
import '@react-aria/utils';
import '@keystar/ui/icon/icons/editIcon';
import '@keystar/ui/icon/icons/linkIcon';
import '@keystar/ui/icon/icons/unlinkIcon';
import '@react-aria/overlays';
import '@react-stately/overlays';
import '@keystar/ui/overlays';
import '@keystar/ui/icon/icons/boldIcon';
import '@keystar/ui/icon/icons/chevronDownIcon';
import '@keystar/ui/icon/icons/codeIcon';
import '@keystar/ui/icon/icons/italicIcon';
import '@keystar/ui/icon/icons/maximizeIcon';
import '@keystar/ui/icon/icons/minimizeIcon';
import '@keystar/ui/icon/icons/removeFormattingIcon';
import '@keystar/ui/icon/icons/strikethroughIcon';
import '@keystar/ui/icon/icons/subscriptIcon';
import '@keystar/ui/icon/icons/superscriptIcon';
import '@keystar/ui/icon/icons/typeIcon';
import '@keystar/ui/icon/icons/underlineIcon';
import '@keystar/ui/icon/icons/alignLeftIcon';
import '@keystar/ui/icon/icons/alignRightIcon';
import '@keystar/ui/icon/icons/alignCenterIcon';
import '@keystar/ui/icon/icons/quoteIcon';
import 'match-sorter';
import '@keystar/ui/icon/icons/trashIcon';
import '@emotion/weak-memoize';
import '@keystar/ui/icon/icons/minusIcon';
import '@keystar/ui/icon/icons/columnsIcon';
import '@keystar/ui/icon/icons/listIcon';
import '@keystar/ui/icon/icons/listOrderedIcon';
import '@keystar/ui/icon/icons/fileUpIcon';
import '@keystar/ui/icon/icons/imageIcon';
import 'cookie';
import '@keystar/ui/icon/icons/link2Icon';
import '@keystar/ui/icon/icons/link2OffIcon';
import '@keystar/ui/icon/icons/pencilIcon';
import '@keystar/ui/icon/icons/undo2Icon';
import '@keystar/ui/utils';
import '@keystar/ui/icon/icons/sheetIcon';
import '@keystar/ui/icon/icons/tableIcon';
import 'scroll-into-view-if-needed';
import '@react-stately/list';
import '@keystar/ui/listbox';
import 'slate-history';
import 'mdast-util-from-markdown';
import 'mdast-util-gfm-autolink-literal/from-markdown';
import 'micromark-extension-gfm-autolink-literal';
import 'mdast-util-gfm-strikethrough/from-markdown';
import 'micromark-extension-gfm-strikethrough';
import '@keystar/ui/nav-list';
import '@keystar/ui/icon/icons/logOutIcon';
import '@keystar/ui/icon/icons/gitForkIcon';
import '@keystar/ui/icon/icons/monitorIcon';
import '@keystar/ui/icon/icons/moonIcon';
import '@keystar/ui/icon/icons/sunIcon';
import '@keystar/ui/icon/icons/userIcon';
import '@keystar/ui/radio';

// the collator enables language-sensitive string comparison
const collator = new Intl.Collator(undefined, {
  sensitivity: 'base'
});

/**
 * Creates a comparison function that should be provided to the `sort()` method
 * of your data array.
 */
function sortByDescriptor(sortDescriptor) {
  const key = sortDescriptor.column;
  assert(key != null, '`sortDescriptor.column` is required');
  return (a, b) => {
    const valueA = a[key];
    const valueB = b[key];
    const modifier = sortDescriptor.direction === 'ascending' ? 1 : -1;

    // always push `null` and `undefined` to the bottom
    if (valueA == null) return 1;
    if (valueB == null) return -1;

    // the collator is only appropriate for strings, it fails in subtle
    // ways for floats, dates, etc.
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return collator.compare(valueA, valueB) * modifier;
    }
    return compare(valueA, valueB) * modifier;
  };
}

/** Default comparison for non-string values */
function compare(a, b) {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

function EmptyState(props) {
  return /*#__PURE__*/jsx(Flex, {
    alignItems: "center",
    direction: "column",
    gap: "large",
    justifyContent: "center",
    minHeight: "scale.3000",
    paddingX: {
      mobile: 'medium',
      tablet: 'xlarge',
      desktop: 'xxlarge'
    },
    children: 'children' in props ? props.children : /*#__PURE__*/jsxs(Fragment, {
      children: [props.icon && /*#__PURE__*/jsx(Icon, {
        src: props.icon,
        size: "large",
        color: "neutralEmphasis"
      }), props.title && /*#__PURE__*/jsx(Heading, {
        align: "center",
        size: "medium",
        children: props.title
      }), props.message && /*#__PURE__*/jsx(Text, {
        align: "center",
        children: props.message
      }), props.actions]
    })
  });
}

class NotFoundError extends Error {
  constructor() {
    super('Not found');
    this.name = 'NotFoundError';
  }
}
function isNotFoundError(err) {
  return typeof err === 'object' && err !== null && err instanceof NotFoundError;
}
function notFound() {
  throw new NotFoundError();
}
class NotFoundErrorBoundaryInner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notFound: false,
      lastHref: props.href
    };
  }
  static getDerivedStateFromError(err) {
    if (isNotFoundError(err)) {
      return {
        notFound: true
      };
    }
    throw err;
  }
  static getDerivedStateFromProps(props, state) {
    if (props.href !== state.lastHref && state.notFound) {
      return {
        notFound: false,
        lastHref: props.href
      };
    }
    return {
      notFound: state.notFound,
      lastHref: props.href
    };
  }
  render() {
    if (this.state.notFound) return this.props.fallback;
    return this.props.children;
  }
}
function NotFoundBoundary(props) {
  const router = useRouter();
  return /*#__PURE__*/jsx(NotFoundErrorBoundaryInner, {
    ...props,
    href: router.href
  });
}

function CollectionPage(props) {
  var _config$collections;
  const {
    collection,
    config
  } = props;
  const containerWidth = 'none'; // TODO: use a "large" when we have more columns
  const collectionConfig = (_config$collections = config.collections) === null || _config$collections === void 0 ? void 0 : _config$collections[collection];
  if (!collectionConfig) notFound();
  const [searchTerm, setSearchTerm] = useState('');
  let debouncedSearchTerm = useDebouncedValue(searchTerm, 300);
  return /*#__PURE__*/jsxs(PageRoot, {
    containerWidth: containerWidth,
    children: [/*#__PURE__*/jsx(CollectionPageHeader, {
      collectionLabel: collectionConfig.label,
      createHref: `${props.basePath}/collection/${encodeURIComponent(props.collection)}/create`,
      searchTerm: searchTerm,
      onSearchTermChange: setSearchTerm
    }), /*#__PURE__*/jsx(CollectionPageContent, {
      searchTerm: debouncedSearchTerm,
      ...props
    })]
  });
}
function CollectionPageHeader(props) {
  const {
    collectionLabel,
    createHref
  } = props;
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);
  const isAboveMobile = useMediaQuery(breakpointQueries.above.mobile);
  const [searchVisible, setSearchVisible] = useState(isAboveMobile);
  const searchRef = useRef(null);
  useEffect(() => {
    setSearchVisible(isAboveMobile);
  }, [isAboveMobile]);

  // entries are presented in a virtualized table view, so we replace the
  // default (e.g. ctrl+f) browser search behaviour
  useEffect(() => {
    const listener = event => {
      // bail if the search field is already focused; let users invoke the
      // browser search if they need to
      if (document.activeElement === searchRef.current) {
        return;
      }
      if (isHotkey('mod+f', event)) {
        var _searchRef$current;
        event.preventDefault();
        (_searchRef$current = searchRef.current) === null || _searchRef$current === void 0 || _searchRef$current.select();
      }
    };
    document.addEventListener('keydown', listener);
    return () => document.removeEventListener('keydown', listener);
  }, []);
  return /*#__PURE__*/jsxs(PageHeader, {
    children: [/*#__PURE__*/jsx(Heading, {
      elementType: "h1",
      id: "page-title",
      size: "small",
      flex: true,
      minWidth: 0,
      children: collectionLabel
    }), /*#__PURE__*/jsx("div", {
      role: "search",
      style: {
        display: searchVisible ? 'block' : 'none'
      },
      children: /*#__PURE__*/jsx(SearchField, {
        ref: searchRef,
        "aria-label": stringFormatter.format('search') // TODO: l10n "Search {collection}"?
        ,
        onChange: props.onSearchTermChange,
        onClear: () => {
          props.onSearchTermChange('');
          if (!isAboveMobile) {
            // the timeout ensures that the "add" button isn't pressed
            setTimeout(() => {
              setSearchVisible(false);
            }, 250);
          }
        },
        onBlur: () => {
          if (!isAboveMobile && props.searchTerm === '') {
            setSearchVisible(false);
          }
        },
        placeholder: stringFormatter.format('search'),
        value: props.searchTerm,
        width: "scale.2400"
      })
    }), /*#__PURE__*/jsx(ActionButton, {
      "aria-label": "show search",
      isHidden: searchVisible || {
        above: 'mobile'
      },
      onPress: () => {
        setSearchVisible(true);
        // NOTE: this hack is to force the search field to focus, and invoke
        // the software keyboard on mobile safari
        let tempInput = document.createElement('input');
        tempInput.style.position = 'absolute';
        tempInput.style.opacity = '0';
        document.body.appendChild(tempInput);
        tempInput.focus();
        setTimeout(() => {
          var _searchRef$current2;
          (_searchRef$current2 = searchRef.current) === null || _searchRef$current2 === void 0 || _searchRef$current2.focus();
          tempInput.remove();
        }, 0);
      },
      children: /*#__PURE__*/jsx(Icon, {
        src: searchIcon
      })
    }), /*#__PURE__*/jsx(Button, {
      marginStart: "auto",
      prominence: "high",
      href: createHref,
      isHidden: searchVisible ? {
        below: 'tablet'
      } : undefined,
      children: stringFormatter.format('add')
    })]
  });
}
function CollectionPageContent(props) {
  const trees = useTree();
  const tree = trees.merged.kind === 'loaded' ? trees.merged.data.current.entries.get(getCollectionPath(props.config, props.collection)) : null;
  if (trees.merged.kind === 'error') {
    return /*#__PURE__*/jsx(EmptyState, {
      icon: alertCircleIcon,
      title: "Unable to load collection",
      message: trees.merged.error.message,
      actions: /*#__PURE__*/jsx(Button, {
        tone: "accent",
        href: props.basePath,
        children: "Dashboard"
      })
    });
  }
  if (trees.merged.kind === 'loading') {
    return /*#__PURE__*/jsx(EmptyState, {
      children: /*#__PURE__*/jsx(ProgressCircle, {
        "aria-label": "Loading Entries",
        isIndeterminate: true,
        size: "large"
      })
    });
  }
  if (!tree) {
    return /*#__PURE__*/jsx(EmptyState, {
      icon: listXIcon,
      title: "Empty collection",
      message: /*#__PURE__*/jsxs(Fragment, {
        children: ["There aren't any entries yet.", ' ', /*#__PURE__*/jsx(TextLink, {
          href: `${props.basePath}/collection/${encodeURIComponent(props.collection)}/create`,
          children: "Create the first entry"
        }), ' ', "to see it here."]
      })
    });
  }
  return /*#__PURE__*/jsx(CollectionTable, {
    ...props,
    trees: trees.merged.data
  });
}
function CollectionTable(props) {
  let {
    searchTerm
  } = props;
  let {
    currentBranch,
    defaultBranch
  } = useBranchInfo();
  let isLocalMode = isLocalConfig(props.config);
  let router = useRouter();
  let [sortDescriptor, setSortDescriptor] = useState({
    column: 'name',
    direction: 'ascending'
  });
  let hideStatusColumn = isLocalMode || currentBranch === defaultBranch;
  const entriesWithStatus = useMemo(() => {
    const defaultEntries = new Map(getEntriesInCollectionWithTreeKey(props.config, props.collection, props.trees.default.tree).map(x => [x.slug, x.key]));
    return getEntriesInCollectionWithTreeKey(props.config, props.collection, props.trees.current.tree).map(entry => {
      return {
        name: entry.slug,
        status: defaultEntries.has(entry.slug) ? defaultEntries.get(entry.slug) === entry.key ? 'Unchanged' : 'Changed' : 'Added'
      };
    });
  }, [props.collection, props.config, props.trees]);
  const filteredItems = useMemo(() => {
    return entriesWithStatus.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [entriesWithStatus, searchTerm]);
  const sortedItems = useMemo(() => {
    return [...filteredItems].sort(sortByDescriptor(sortDescriptor));
  }, [filteredItems, sortDescriptor]);
  const columns = useMemo(() => {
    return hideStatusColumn ? [{
      name: 'Name',
      key: 'name'
    }] : [{
      name: 'Name',
      key: 'name'
    }, {
      name: 'Status',
      key: 'status',
      minWidth: 140,
      width: '20%'
    }];
  }, [hideStatusColumn]);
  return /*#__PURE__*/jsxs(TableView, {
    "aria-labelledby": "page-title",
    selectionMode: "none",
    onSortChange: setSortDescriptor,
    sortDescriptor: sortDescriptor,
    density: "spacious",
    overflowMode: "truncate",
    prominence: "low",
    onRowAction: key => {
      router.push(getItemPath(props.basePath, props.collection, key));
    },
    renderEmptyState: () => /*#__PURE__*/jsx(EmptyState, {
      icon: searchXIcon,
      title: "No results",
      message: `No items matching "${searchTerm}" were found.`
    }),
    flex: true,
    marginTop: {
      tablet: 'large'
    },
    marginBottom: {
      mobile: 'regular',
      tablet: 'xlarge'
    },
    UNSAFE_className: css({
      marginInline: tokenSchema.size.space.regular,
      [breakpointQueries.above.mobile]: {
        marginInline: `calc(${tokenSchema.size.space.xlarge} - ${tokenSchema.size.space.medium})`
      },
      [breakpointQueries.above.tablet]: {
        marginInline: `calc(${tokenSchema.size.space.xxlarge} - ${tokenSchema.size.space.medium})`
      },
      '[role=rowheader]': {
        cursor: 'pointer'
      }
    }),
    children: [/*#__PURE__*/jsx(TableHeader, {
      columns: columns,
      children: ({
        name,
        key,
        ...options
      }) => /*#__PURE__*/jsx(Column, {
        isRowHeader: true,
        allowsSorting: true,
        ...options,
        children: name
      }, key)
    }), /*#__PURE__*/jsx(TableBody, {
      items: sortedItems,
      children: item => hideStatusColumn ? /*#__PURE__*/jsx(Row, {
        children: /*#__PURE__*/jsx(Cell, {
          textValue: item.name,
          children: /*#__PURE__*/jsx(Text, {
            weight: "medium",
            children: item.name
          })
        })
      }, item.name) : /*#__PURE__*/jsxs(Row, {
        children: [/*#__PURE__*/jsx(Cell, {
          textValue: item.name,
          children: /*#__PURE__*/jsx(Text, {
            weight: "medium",
            children: item.name
          })
        }), /*#__PURE__*/jsx(Cell, {
          textValue: item.status,
          children: /*#__PURE__*/jsx(StatusLight, {
            tone: statusTones[item.status],
            children: item.status
          })
        })]
      }, item.name)
    })]
  });
}
function getItemPath(basePath, collection, key) {
  return `${basePath}/collection/${encodeURIComponent(collection)}/item/${encodeURIComponent(key)}`;
}
function useDebouncedValue(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);
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
  Unchanged: 'neutral'
};

const AppSlugContext = /*#__PURE__*/createContext(undefined);
const AppSlugProvider = AppSlugContext.Provider;
function InstallGitHubApp(props) {
  var _URL$searchParams$get;
  const router = useRouter();
  const appSlugFromContext = useContext(AppSlugContext);
  const appSlug = (_URL$searchParams$get = new URL(router.href, 'https://example.com').searchParams.get('slug')) !== null && _URL$searchParams$get !== void 0 ? _URL$searchParams$get : appSlugFromContext === null || appSlugFromContext === void 0 ? void 0 : appSlugFromContext.value;
  const parsedRepo = parseRepoConfig(props.config.storage.repo);
  return /*#__PURE__*/jsxs(Flex, {
    direction: "column",
    gap: "regular",
    children: [/*#__PURE__*/jsxs(Flex, {
      alignItems: "end",
      gap: "regular",
      children: [/*#__PURE__*/jsx(TextField, {
        label: "Repo Name",
        width: "100%",
        isReadOnly: true,
        value: parsedRepo.name
      }), /*#__PURE__*/jsx(ActionButton, {
        onPress: () => {
          navigator.clipboard.writeText(parsedRepo.name);
        },
        children: "Copy Repo Name"
      })]
    }), appSlug ? /*#__PURE__*/jsx(Button, {
      prominence: "high",
      href: `https://github.com/apps/${appSlug}/installations/new`,
      children: "Install GitHub App"
    }) : /*#__PURE__*/jsx(Notice, {
      tone: "caution",
      children: appSlugFromContext ? /*#__PURE__*/jsxs(Text, {
        children: ["The ", /*#__PURE__*/jsx("code", {
          children: appSlugFromContext.envName
        }), " environment variable wasn't provided so we can't link to the GitHub app installation page. You should find the App on GitHub and add the repo yourself."]
      }) : /*#__PURE__*/jsx(Text, {
        children: "Find the App on GitHub and add the repo."
      })
    })]
  });
}

function ForkRepoDialog(props) {
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);
  const client = useClient();
  const [state, setState] = useState({
    kind: 'idle'
  });
  useEffect(() => {
    const listener = async event => {
      if (event.key === 'ks-refetch-installations' && event.newValue === 'true') {
        localStorage.removeItem('ks-refetch-installations');
        try {
          var _res$data;
          const auth = await getAuth(props.config);
          if (!auth) throw new Error('Unauthorized');
          const res = await client.query(GitHubAppShellQuery, parseRepoConfig(props.config.storage.repo)).toPromise();
          if ((_res$data = res.data) !== null && _res$data !== void 0 && (_res$data = _res$data.repository) !== null && _res$data !== void 0 && (_res$data = _res$data.forks.nodes) !== null && _res$data !== void 0 && _res$data.some(x => (x === null || x === void 0 ? void 0 : x.viewerPermission) === 'ADMIN' || (x === null || x === void 0 ? void 0 : x.viewerPermission) === 'WRITE' || (x === null || x === void 0 ? void 0 : x.viewerPermission) === 'MAINTAIN')) {
            await new Promise(resolve => setTimeout(resolve, 100));
            props.onCreate();
          }
        } catch (err) {
          setState({
            kind: 'error',
            error: err
          });
        }
      }
    };
    addEventListener('storage', listener);
    return () => removeEventListener('storage', listener);
  }, [client, props]);
  const appSlug = useContext(AppSlugContext);
  return /*#__PURE__*/jsxs(Dialog, {
    size: "small",
    isDismissable: true,
    onDismiss: () => {
      props.onDismiss();
    },
    children: [/*#__PURE__*/jsx(Heading, {
      children: "Fork Repo"
    }), state.kind === 'error' ? /*#__PURE__*/jsxs(Fragment, {
      children: [/*#__PURE__*/jsx(Content, {
        children: /*#__PURE__*/jsx(Notice, {
          tone: "critical",
          children: state.error.message
        })
      }), /*#__PURE__*/jsx(ButtonGroup, {
        children: /*#__PURE__*/jsx(Button, {
          onPress: props.onDismiss,
          children: stringFormatter.format('cancel')
        })
      })]
    }) : /*#__PURE__*/jsx(Fragment, {
      children: /*#__PURE__*/jsx(Content, {
        children: /*#__PURE__*/jsxs(Flex, {
          gap: "large",
          direction: "column",
          marginBottom: "large",
          children: [/*#__PURE__*/jsx(Text, {
            children: "You don't have permission to write to this repo so to save your changes, you need to fork the repo."
          }), /*#__PURE__*/jsxs(Text, {
            children: ["To start,", ' ', /*#__PURE__*/jsx(TextLink, {
              href: `https://github.com/${serializeRepoConfig(props.config.storage.repo)}/fork`,
              target: "_blank",
              rel: "noopener noreferrer",
              children: "fork the repo on GitHub"
            }), ". Then, come back to this page and", ' ', /*#__PURE__*/jsx(TextLink, {
              href: `https://github.com/apps/${appSlug === null || appSlug === void 0 ? void 0 : appSlug.value}/installations/new?state=close`,
              target: "_blank",
              rel: "noopener noreferrer",
              children: "install the Keystatic GitHub App on your fork."
            })]
          })]
        })
      })
    })]
  });
}

class TrackedMap extends Map {
  #onGet;
  constructor(onGet, entries) {
    super(entries);
    this.#onGet = onGet;
  }
  get(key) {
    this.#onGet(key);
    return super.get(key);
  }
}
function parseEntry(args, files) {
  const dataFilepath = getEntryDataFilepath(args.dirpath, args.format);
  const data = files.get(dataFilepath);
  if (!data) {
    throw new Error(`Could not find data file at ${dataFilepath}`);
  }
  const {
    loaded,
    extraFakeFile
  } = loadDataFile(data, args.format);
  const filesWithFakeFile = new Map(files);
  if (extraFakeFile) {
    filesWithFakeFile.set(`${args.dirpath}/${extraFakeFile.path}`, extraFakeFile.contents);
  }
  const usedFiles = new Set([dataFilepath]);
  const rootSchema = object(args.schema);
  let initialState;
  const getFile = filepath => {
    usedFiles.add(filepath);
    return filesWithFakeFile.get(filepath);
  };
  try {
    initialState = parseProps(rootSchema, loaded, [], [], (schema, value, path, pathWithArrayFieldSlugs) => {
      var _args$slug;
      if (path.length === 1 && path[0] === ((_args$slug = args.slug) === null || _args$slug === void 0 ? void 0 : _args$slug.field)) {
        if (schema.formKind !== 'slug') {
          throw new Error(`slugField is not a slug field`);
        }
        return schema.parse(value, {
          slug: args.slug.slug
        });
      }
      if (schema.formKind === 'asset') {
        var _args$slug2, _args$slug3, _args$slug4;
        const suggestedFilenamePrefix = pathWithArrayFieldSlugs.join('/');
        const filepath = schema.filename(value, {
          suggestedFilenamePrefix,
          slug: (_args$slug2 = args.slug) === null || _args$slug2 === void 0 ? void 0 : _args$slug2.slug
        });
        const asset = filepath ? getFile(`${schema.directory ? `${schema.directory}${((_args$slug3 = args.slug) === null || _args$slug3 === void 0 ? void 0 : _args$slug3.slug) === undefined ? '' : `/${args.slug.slug}`}` : args.dirpath}/${filepath}`) : undefined;
        return schema.parse(value, {
          asset,
          slug: (_args$slug4 = args.slug) === null || _args$slug4 === void 0 ? void 0 : _args$slug4.slug
        });
      }
      if (schema.formKind === 'content') {
        var _args$slug7;
        const rootPath = `${args.dirpath}/${pathWithArrayFieldSlugs.join('/')}`;
        const mainFilepath = rootPath + schema.contentExtension;
        const mainContents = getFile(mainFilepath);
        const otherFiles = new TrackedMap(key => {
          usedFiles.add(`${rootPath}/${key}`);
        });
        const otherDirectories = new Map();
        for (const [filename] of filesWithFakeFile) {
          if (filename.startsWith(rootPath + '/')) {
            const relativePath = filename.slice(rootPath.length + 1);
            otherFiles.set(relativePath, filesWithFakeFile.get(filename));
          }
        }
        for (const dir of (_schema$directories = schema.directories) !== null && _schema$directories !== void 0 ? _schema$directories : []) {
          var _schema$directories, _args$slug5, _args$slug6;
          const dirFiles = new TrackedMap(relativePath => usedFiles.add(start + relativePath));
          const start = `${dir}${((_args$slug5 = args.slug) === null || _args$slug5 === void 0 ? void 0 : _args$slug5.slug) === undefined ? '' : `/${(_args$slug6 = args.slug) === null || _args$slug6 === void 0 ? void 0 : _args$slug6.slug}`}/`;
          for (const [filename, val] of filesWithFakeFile) {
            if (filename.startsWith(start)) {
              const relativePath = filename.slice(start.length);
              dirFiles.set(relativePath, val);
            }
          }
          if (dirFiles.size) {
            otherDirectories.set(dir, dirFiles);
          }
        }
        return schema.parse(value, {
          content: mainContents,
          other: otherFiles,
          external: otherDirectories,
          slug: (_args$slug7 = args.slug) === null || _args$slug7 === void 0 ? void 0 : _args$slug7.slug
        });
      }
      return schema.parse(value, undefined);
    }, false);
  } catch (err) {
    throw toFormattedFormDataError(err);
  }
  if (extraFakeFile) {
    usedFiles.delete(`${args.dirpath}/${extraFakeFile.path}`);
  }
  return {
    initialState,
    initialFiles: [...usedFiles]
  };
}
function getAllFilesInTree(tree) {
  return [...tree.values()].flatMap(val => val.children ? getAllFilesInTree(val.children) : [val.entry]);
}
function useItemData(args) {
  var _args$slug9;
  const {
    current: currentBranch
  } = useTree();
  const baseCommit = useBaseCommit();
  const isRepoPrivate = useIsRepoPrivate();
  const branchInfo = useBranchInfo();
  const rootTree = currentBranch.kind === 'loaded' ? currentBranch.data.tree : undefined;
  const locationsForTreeKey = useMemo(() => {
    var _args$slug8;
    return getDirectoriesForTreeKey(object(args.schema), args.dirpath, (_args$slug8 = args.slug) === null || _args$slug8 === void 0 ? void 0 : _args$slug8.slug, args.format);
  }, [args.dirpath, args.format, args.schema, (_args$slug9 = args.slug) === null || _args$slug9 === void 0 ? void 0 : _args$slug9.slug]);
  const localTreeKey = useMemo(() => getTreeKey(locationsForTreeKey, rootTree !== null && rootTree !== void 0 ? rootTree : new Map()), [locationsForTreeKey, rootTree]);
  const tree = useMemo(() => {
    return rootTree !== null && rootTree !== void 0 ? rootTree : new Map();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localTreeKey, locationsForTreeKey]);
  const hasLoaded = currentBranch.kind === 'loaded';
  return useData(useCallback(() => {
    var _getTreeNodeAtPath;
    if (!hasLoaded) return LOADING;
    const dataFilepathSha = (_getTreeNodeAtPath = getTreeNodeAtPath(tree, getEntryDataFilepath(args.dirpath, args.format))) === null || _getTreeNodeAtPath === void 0 ? void 0 : _getTreeNodeAtPath.entry.sha;
    if (dataFilepathSha === undefined) {
      return 'not-found';
    }
    const _args = {
      config: args.config,
      dirpath: args.dirpath,
      format: args.format,
      schema: args.schema,
      slug: args.slug
    };
    const allBlobs = locationsForTreeKey.flatMap(dir => {
      const node = getTreeNodeAtPath(tree, dir);
      if (!node) return [];
      return node.children ? getAllFilesInTree(node.children) : [node.entry];
    }).map(entry => {
      const blob = fetchBlob(args.config, entry.sha, entry.path, baseCommit, isRepoPrivate, {
        owner: branchInfo.mainOwner,
        name: branchInfo.mainRepo
      });
      if (blob instanceof Uint8Array) {
        return [entry.path, blob];
      }
      return blob.then(blob => [entry.path, blob]);
    });
    if (allBlobs.every(x => Array.isArray(x))) {
      const {
        initialFiles,
        initialState
      } = parseEntry(_args, new Map(allBlobs));
      return {
        initialState,
        initialFiles,
        localTreeKey
      };
    }
    return Promise.all(allBlobs).then(async data => {
      const {
        initialState,
        initialFiles
      } = parseEntry(_args, new Map(data));
      return {
        initialState,
        initialFiles,
        localTreeKey
      };
    });
  }, [hasLoaded, tree, args.dirpath, args.format, args.config, args.schema, args.slug, locationsForTreeKey, baseCommit, isRepoPrivate, branchInfo.mainOwner, branchInfo.mainRepo, localTreeKey]));
}
const blobCache = new LRU({
  max: 200
});
async function hydrateBlobCache(contents) {
  const sha = await blobSha(contents);
  blobCache.set(sha, contents);
  return sha;
}
async function fetchGitHubBlob(config, oid, filepath, commitSha, isRepoPrivate, repo) {
  if (!isRepoPrivate) {
    var _getPathPrefix;
    return fetch(`https://raw.githubusercontent.com/${serializeRepoConfig(repo)}/${commitSha}/${(_getPathPrefix = getPathPrefix(config.storage)) !== null && _getPathPrefix !== void 0 ? _getPathPrefix : ''}${filepath}`);
  }
  const auth = await getAuth(config);
  return fetch(config.storage.kind === 'github' ? `https://api.github.com/repos/${serializeRepoConfig(config.storage.repo)}/git/blobs/${oid}` : `${KEYSTATIC_CLOUD_API_URL}/v1/github/blob/${oid}`, {
    headers: {
      Authorization: `Bearer ${auth.accessToken}`,
      Accept: 'application/vnd.github.raw',
      ...(config.storage.kind === 'cloud' ? KEYSTATIC_CLOUD_HEADERS : {})
    }
  });
}
function fetchBlob(config, oid, filepath, commitSha, isRepoPrivate, repo) {
  if (blobCache.has(oid)) return blobCache.get(oid);
  const promise = (isGitHubConfig(config) || config.storage.kind === 'cloud' ? fetchGitHubBlob(config, oid, filepath, commitSha, isRepoPrivate, repo) : fetch(`/api/keystatic/blob/${oid}/${filepath}`, {
    headers: {
      'no-cors': '1'
    }
  })).then(x => x.arrayBuffer()).then(x => {
    const array = new Uint8Array(x);
    blobCache.set(oid, array);
    return array;
  }).catch(err => {
    blobCache.delete(oid);
    throw err;
  });
  blobCache.set(oid, promise);
  return promise;
}

injectGlobal({
  body: {
    overflow: 'hidden'
  }
});
function createUrqlClient(config) {
  const repo = config.storage.kind === 'github' ? parseRepoConfig(config.storage.repo) : {
    owner: 'repo-owner',
    name: 'repo-name'
  };
  return createClient({
    url: config.storage.kind === 'github' ? 'https://api.github.com/graphql' : `${KEYSTATIC_CLOUD_API_URL}/v1/github/graphql`,
    requestPolicy: 'cache-and-network',
    exchanges: [authExchange(async utils => {
      let authState = await getAuth(config);
      return {
        addAuthToOperation(operation) {
          authState = getSyncAuth(config);
          if (!authState) {
            return operation;
          }
          return utils.appendHeaders(operation, {
            Authorization: `Bearer ${authState.accessToken}`,
            ...(config.storage.kind === 'cloud' ? KEYSTATIC_CLOUD_HEADERS : {})
          });
        },
        didAuthError() {
          return false;
        },
        willAuthError(operation) {
          var _operation$query$defi;
          authState = getSyncAuth(config);
          if (operation.query.definitions[0].kind === 'OperationDefinition' && (_operation$query$defi = operation.query.definitions[0].name) !== null && _operation$query$defi !== void 0 && _operation$query$defi.value.includes('AppShell') && !authState) {
            if (config.storage.kind === 'github') {
              window.location.href = '/api/keystatic/github/login';
            } else {
              redirectToCloudAuth('', config);
            }
            return true;
          }
          if (!authState) {
            return true;
          }
          return false;
        },
        async refreshAuth() {
          authState = await getAuth(config);
        }
      };
    }), cacheExchange({
      updates: {
        Mutation: {
          createRef(result, args, cache, _info) {
            cache.updateQuery({
              query: config.storage.kind === 'github' ? GitHubAppShellQuery : CloudAppShellQuery,
              variables: repo
            }, data => {
              var _data$repository;
              if (data !== null && data !== void 0 && (_data$repository = data.repository) !== null && _data$repository !== void 0 && (_data$repository = _data$repository.refs) !== null && _data$repository !== void 0 && _data$repository.nodes && result.createRef && typeof result.createRef === 'object' && 'ref' in result.createRef) {
                return {
                  ...data,
                  repository: {
                    ...data.repository,
                    refs: {
                      ...data.repository.refs,
                      nodes: [...data.repository.refs.nodes, result.createRef.ref]
                    }
                  }
                };
              }
              return data;
            });
          },
          deleteRef(result, args, cache, _info) {
            cache.updateQuery({
              query: config.storage.kind === 'github' ? GitHubAppShellQuery : CloudAppShellQuery,
              variables: repo
            }, data => {
              var _data$repository2;
              if (data !== null && data !== void 0 && (_data$repository2 = data.repository) !== null && _data$repository2 !== void 0 && (_data$repository2 = _data$repository2.refs) !== null && _data$repository2 !== void 0 && _data$repository2.nodes && result.deleteRef && typeof result.deleteRef === 'object' && '__typename' in result.deleteRef && typeof args.input === 'object' && args.input !== null && 'refId' in args.input && typeof args.input.refId === 'string') {
                const refId = args.input.refId;
                return {
                  ...data,
                  repository: {
                    ...data.repository,
                    refs: {
                      ...data.repository.refs,
                      nodes: data.repository.refs.nodes.filter(x => (x === null || x === void 0 ? void 0 : x.id) !== refId)
                    }
                  }
                };
              }
              return data;
            });
          }
        }
      }
    }), ...(config.storage.kind === 'github' ? [] : [persistedExchange({
      enableForMutation: true,
      enforcePersistedQueries: true
    })]), fetchExchange]
  });
}
function Provider({
  children,
  config
}) {
  const themeContext = useTheme();
  const {
    push: navigate
  } = useRouter();
  const keystarRouter = useMemo(() => ({
    navigate
  }), [navigate]);
  return /*#__PURE__*/jsx(ThemeProvider, {
    value: themeContext,
    children: /*#__PURE__*/jsxs(KeystarProvider, {
      locale: config.locale || 'en-US',
      colorScheme: themeContext.theme,
      router: keystarRouter,
      children: [/*#__PURE__*/jsx(ClientSideOnlyDocumentElement, {}), /*#__PURE__*/jsx("link", {
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
        rel: "stylesheet"
      }), /*#__PURE__*/jsx(Provider$1, {
        value: useMemo(() => createUrqlClient(config), [config]),
        children: children
      }), /*#__PURE__*/jsx(Toaster, {})]
    })
  });
}

const textEncoder = new TextEncoder();
const frontmatterSplit = textEncoder.encode('---\n');
function combineFrontmatterAndContents(frontmatter, contents) {
  const array = new Uint8Array(frontmatter.byteLength + contents.byteLength + frontmatterSplit.byteLength * 2);
  array.set(frontmatterSplit);
  array.set(frontmatter, frontmatterSplit.byteLength);
  array.set(frontmatterSplit, frontmatterSplit.byteLength + frontmatter.byteLength);
  array.set(contents, frontmatterSplit.byteLength * 2 + frontmatter.byteLength);
  return array;
}
function serializeEntryToFiles(args) {
  var _args$slug, _args$slug2;
  let {
    value: stateWithExtraFilesRemoved,
    extraFiles
  } = serializeProps(args.state, object(args.schema), (_args$slug = args.slug) === null || _args$slug === void 0 ? void 0 : _args$slug.field, (_args$slug2 = args.slug) === null || _args$slug2 === void 0 ? void 0 : _args$slug2.value, true);
  const dataFormat = args.format.data;
  let dataContent = textEncoder.encode(dataFormat === 'json' ? JSON.stringify(stateWithExtraFilesRemoved, null, 2) + '\n' : dump(stateWithExtraFilesRemoved));
  if (args.format.contentField) {
    const filename = `${args.format.contentField.key}${args.format.contentField.config.contentExtension}`;
    let contents;
    extraFiles = extraFiles.filter(x => {
      if (x.path !== filename) return true;
      contents = x.contents;
      return false;
    });
    assert(contents !== undefined, 'Expected content field to be present');
    dataContent = combineFrontmatterAndContents(dataContent, contents);
  }
  return [{
    path: getEntryDataFilepath(args.basePath, args.format),
    contents: dataContent
  }, ...extraFiles.map(file => ({
    path: `${file.parent ? args.slug ? `${file.parent}/${args.slug.value}` : file.parent : args.basePath}/${file.path}`,
    contents: file.contents
  }))];
}
function useUpsertItem(args) {
  const [state, setState] = useState({
    kind: 'idle'
  });
  const baseCommit = useBaseCommit();
  const branchInfo = useContext(BranchInfoContext);
  const setTreeSha = useSetTreeSha();
  const [, mutate] = useMutation(createCommitMutation);
  const repoWithWriteAccess = useContext(RepoWithWriteAccessContext);
  const appSlug = useContext(AppSlugContext);
  const unscopedTreeData = useCurrentUnscopedTree();
  return [state, async override => {
    try {
      var _getPathPrefix, _args$initialFiles;
      const unscopedTree = unscopedTreeData.kind === 'loaded' ? unscopedTreeData.data.tree : undefined;
      if (!unscopedTree) return false;
      if (repoWithWriteAccess === null && args.config.storage.kind === 'github' && appSlug !== null && appSlug !== void 0 && appSlug.value) {
        setState({
          kind: 'needs-fork'
        });
        return false;
      }
      setState({
        kind: 'loading'
      });
      const pathPrefix = (_getPathPrefix = getPathPrefix(args.config.storage)) !== null && _getPathPrefix !== void 0 ? _getPathPrefix : '';
      let additions = serializeEntryToFiles({
        basePath: args.basePath,
        config: args.config,
        schema: args.schema,
        format: args.format,
        state: args.state,
        slug: args.slug
      }).map(addition => ({
        ...addition,
        path: pathPrefix + addition.path
      }));
      const additionPathToSha = new Map(await Promise.all(additions.map(async addition => [addition.path, await hydrateBlobCache(addition.contents)])));
      const filesToDelete = new Set((_args$initialFiles = args.initialFiles) === null || _args$initialFiles === void 0 ? void 0 : _args$initialFiles.map(x => pathPrefix + x));
      for (const file of additions) {
        filesToDelete.delete(file.path);
      }
      additions = additions.filter(addition => {
        const sha = additionPathToSha.get(addition.path);
        const existing = getTreeNodeAtPath(unscopedTree, addition.path);
        return (existing === null || existing === void 0 ? void 0 : existing.entry.sha) !== sha;
      });
      const deletions = [...filesToDelete].map(path => ({
        path
      }));
      const updatedTree = await updateTreeWithChanges(unscopedTree, {
        additions,
        deletions: [...filesToDelete]
      });
      await hydrateTreeCacheWithEntries(updatedTree.entries);
      if (args.config.storage.kind === 'github' || args.config.storage.kind === 'cloud') {
        var _override$branch, _override$sha, _result$error, _result$data;
        const branch = {
          branchName: (_override$branch = override === null || override === void 0 ? void 0 : override.branch) !== null && _override$branch !== void 0 ? _override$branch : branchInfo.currentBranch,
          repositoryNameWithOwner: `${repoWithWriteAccess.owner}/${repoWithWriteAccess.name}`
        };
        const runMutation = expectedHeadOid => mutate({
          input: {
            branch,
            expectedHeadOid,
            message: {
              headline: `Update ${args.basePath}`
            },
            fileChanges: {
              additions: additions.map(addition => ({
                ...addition,
                contents: fromUint8Array(addition.contents)
              })),
              deletions
            }
          }
        });
        let result = await runMutation((_override$sha = override === null || override === void 0 ? void 0 : override.sha) !== null && _override$sha !== void 0 ? _override$sha : baseCommit);
        const gqlError = (_result$error = result.error) === null || _result$error === void 0 || (_result$error = _result$error.graphQLErrors[0]) === null || _result$error === void 0 ? void 0 : _result$error.originalError;
        if (gqlError && 'type' in gqlError) {
          if (gqlError.type === 'BRANCH_PROTECTION_RULE_VIOLATION') {
            setState({
              kind: 'needs-new-branch',
              reason: 'Changes must be made via pull request to this branch. Create a new branch to save changes.'
            });
            return false;
          }
          if (gqlError.type === 'STALE_DATA') {
            var _refData$data, _args$slug3;
            // we don't want this to go into the cache yet
            // so we create a new client just for this
            const refData = await createUrqlClient(args.config).query(FetchRef, {
              owner: repoWithWriteAccess.owner,
              name: repoWithWriteAccess.name,
              ref: `refs/heads/${branchInfo.currentBranch}`
            }).toPromise();
            if (!((_refData$data = refData.data) !== null && _refData$data !== void 0 && (_refData$data = _refData$data.repository) !== null && _refData$data !== void 0 && (_refData$data = _refData$data.ref) !== null && _refData$data !== void 0 && _refData$data.target)) {
              throw new Error('Branch not found');
            }
            const tree = scopeEntriesWithPathPrefix(await fetchGitHubTreeData(refData.data.repository.ref.target.oid, args.config), args.config);
            const treeKey = getTreeKey(getDirectoriesForTreeKey(object(args.schema), args.basePath, (_args$slug3 = args.slug) === null || _args$slug3 === void 0 ? void 0 : _args$slug3.value, args.format), tree.tree);
            if (treeKey === args.currentLocalTreeKey) {
              result = await runMutation(refData.data.repository.ref.target.oid);
            } else {
              setState({
                kind: 'needs-new-branch',
                reason: 'This entry has been updated since it was opened. Create a new branch to save changes.'
              });
              return false;
            }
          }
        }
        if (result.error) {
          throw result.error;
        }
        const target = (_result$data = result.data) === null || _result$data === void 0 || (_result$data = _result$data.createCommitOnBranch) === null || _result$data === void 0 || (_result$data = _result$data.ref) === null || _result$data === void 0 ? void 0 : _result$data.target;
        if (target) {
          setState({
            kind: 'updated'
          });
          return true;
        }
        throw new Error('Failed to update');
      } else {
        const res = await fetch('/api/keystatic/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'no-cors': '1'
          },
          body: JSON.stringify({
            additions: additions.map(addition => ({
              ...addition,
              contents: fromUint8Array(addition.contents)
            })),
            deletions
          })
        });
        if (!res.ok) {
          throw new Error(await res.text());
        }
        const newTree = await res.json();
        const {
          tree
        } = await hydrateTreeCacheWithEntries(newTree);
        setTreeSha(await treeSha(tree));
        setState({
          kind: 'updated'
        });
        return true;
      }
    } catch (err) {
      setState({
        kind: 'error',
        error: err
      });
      return false;
    }
  }, () => {
    setState({
      kind: 'idle'
    });
  }];
}
const createCommitMutation = gql`
  mutation CreateCommit($input: CreateCommitOnBranchInput!) {
    createCommitOnBranch(input: $input) {
      ref {
        id
        target {
          id
          oid
          ... on Commit {
            tree {
              id
              oid
            }
          }
        }
      }
    }
  }
`;
function useDeleteItem(args) {
  const [state, setState] = useState({
    kind: 'idle'
  });
  const baseCommit = useBaseCommit();
  const branchInfo = useContext(BranchInfoContext);
  const [, mutate] = useMutation(createCommitMutation);
  const setTreeSha = useSetTreeSha();
  const repoWithWriteAccess = useContext(RepoWithWriteAccessContext);
  const appSlug = useContext(AppSlugContext);
  const unscopedTreeData = useCurrentUnscopedTree();
  return [state, async () => {
    try {
      const unscopedTree = unscopedTreeData.kind === 'loaded' ? unscopedTreeData.data.tree : undefined;
      if (!unscopedTree) return false;
      if (repoWithWriteAccess === null && args.storage.kind === 'github' && appSlug !== null && appSlug !== void 0 && appSlug.value) {
        setState({
          kind: 'needs-fork'
        });
        return false;
      }
      setState({
        kind: 'loading'
      });
      const deletions = args.initialFiles.map(x => {
        var _getPathPrefix2;
        return ((_getPathPrefix2 = getPathPrefix(args.storage)) !== null && _getPathPrefix2 !== void 0 ? _getPathPrefix2 : '') + x;
      });
      const updatedTree = await updateTreeWithChanges(unscopedTree, {
        additions: [],
        deletions
      });
      await hydrateTreeCacheWithEntries(updatedTree.entries);
      if (args.storage.kind === 'github' || args.storage.kind === 'cloud') {
        const {
          error
        } = await mutate({
          input: {
            branch: {
              repositoryNameWithOwner: `${repoWithWriteAccess.owner}/${repoWithWriteAccess.name}`,
              branchName: branchInfo.currentBranch
            },
            message: {
              headline: `Delete ${args.basePath}`
            },
            expectedHeadOid: baseCommit,
            fileChanges: {
              deletions: deletions.map(path => ({
                path
              }))
            }
          }
        });
        if (error) {
          throw error;
        }
        setState({
          kind: 'updated'
        });
        return true;
      } else {
        const res = await fetch('/api/keystatic/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'no-cors': '1'
          },
          body: JSON.stringify({
            additions: [],
            deletions: deletions.map(path => ({
              path
            }))
          })
        });
        if (!res.ok) {
          throw new Error(await res.text());
        }
        const newTree = await res.json();
        const {
          tree
        } = await hydrateTreeCacheWithEntries(newTree);
        setTreeSha(await treeSha(tree));
        setState({
          kind: 'updated'
        });
        return true;
      }
    } catch (err) {
      setState({
        kind: 'error',
        error: err
      });
    }
  }, () => {
    setState({
      kind: 'idle'
    });
  }];
}
const FetchRef = gql`
  query FetchRef($owner: String!, $name: String!, $ref: String!) {
    repository(owner: $owner, name: $name) {
      id
      ref(qualifiedName: $ref) {
        id
        target {
          id
          oid
        }
      }
    }
  }
`;

function useHasChanged(args) {
  const serialize = useCallback(state => {
    const slug = args.slugField ? getSlugFromState({
      schema: args.schema.fields,
      slugField: args.slugField
    }, state) : undefined;
    return {
      slug,
      state: serializeProps(state, args.schema, args.slugField, slug, true)
    };
  }, [args.schema, args.slugField]);
  const initialFilesForUpdate = useMemo(() => args.initialState === null ? null : serialize(args.initialState), [args.initialState, serialize]);
  const filesForUpdate = useMemo(() => serialize(args.state), [serialize, args.state]);
  return useMemo(() => {
    return !isEqual(initialFilesForUpdate, filesForUpdate);
  }, [initialFilesForUpdate, filesForUpdate]);
}

function useSlugFieldInfo(collection, slugToExclude) {
  const config = useConfig();
  const allSlugs = useSlugsInCollection(collection);
  return useMemo(() => {
    const slugs = new Set(allSlugs);
    if (slugToExclude) {
      slugs.delete(slugToExclude);
    }
    const collectionConfig = config.collections[collection];
    return {
      field: collectionConfig.slugField,
      slugs,
      glob: getSlugGlobForCollection(config, collection)
    };
  }, [allSlugs, collection, config, slugToExclude]);
}

const units = {
  seconds: 60,
  minutes: 60,
  hours: 24,
  days: 7,
  weeks: 4,
  months: 12,
  years: Infinity
};
function formatTimeAgo(targetDate, currentDate, formatter) {
  let duration = (targetDate.getTime() - currentDate.getTime()) / 1000;
  for (const [name, amount] of Object.entries(units)) {
    if (Math.abs(duration) < amount) {
      return formatter.format(Math.round(duration), name);
    }
    duration /= amount;
  }
  return 'unknown';
}
function RelativeTime(props) {
  const {
    locale
  } = useLocale();
  const [now] = useState(() => new Date());
  const formatted = useMemo(() => {
    const formatter = new Intl.RelativeTimeFormat(locale);
    formatter.format(props.date.getTime() - now.getTime(), 'second');
    return formatTimeAgo(props.date, now, formatter);
  }, [locale, now, props.date]);
  return /*#__PURE__*/jsx("time", {
    dateTime: props.date.toISOString(),
    children: formatted
  });
}
function showDraftRestoredToast(savedAt, hasChangedSince) {
  toastQueue.info( /*#__PURE__*/jsxs(Text, {
    children: ["Restored draft from ", /*#__PURE__*/jsx(RelativeTime, {
      date: savedAt
    }), ".", ' ', hasChangedSince && /*#__PURE__*/jsx(Text, {
      color: "accent",
      children: "Other changes have been made to this entry since the draft. You may want to discard the draft changes."
    })]
  }), {
    timeout: 8000
  });
}
let store;
function getStore() {
  if (!store) {
    store = createStore('keystatic', 'items');
  }
  return store;
}
// the as anys are because the indexeddb types dont't accept readonly arrays

function setDraft(key, val) {
  return set(key, val, getStore());
}
function delDraft(key) {
  return del(key, getStore());
}
function getDraft(key) {
  return get(key, getStore());
}

const storedValSchema$1 = z.object({
  version: z.literal(1),
  savedAt: z.date(),
  slug: z.string(),
  beforeTreeKey: z.string(),
  files: z.map(z.string(), z.instanceof(Uint8Array))
});
function ItemPage(props) {
  var _draft$state;
  const {
    collection,
    config,
    itemSlug,
    initialFiles,
    initialState,
    localTreeKey,
    draft
  } = props;
  const router = useRouter();
  const [forceValidation, setForceValidation] = useState(false);
  const collectionConfig = config.collections[collection];
  const schema = useMemo(() => object(collectionConfig.schema), [collectionConfig.schema]);
  const [{
    state,
    localTreeKey: localTreeKeyInState
  }, setState] = useState({
    state: (_draft$state = draft === null || draft === void 0 ? void 0 : draft.state) !== null && _draft$state !== void 0 ? _draft$state : initialState,
    localTreeKey
  });
  useEffect(() => {
    if (draft && state === draft.state) {
      showDraftRestoredToast(draft.savedAt, localTreeKey !== draft.treeKey);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);
  if (localTreeKeyInState !== localTreeKey) {
    setState({
      state: initialState,
      localTreeKey
    });
  }
  const previewProps = useMemo(() => createGetPreviewProps(schema, stateUpdater => {
    setState(state => ({
      localTreeKey: state.localTreeKey,
      state: stateUpdater(state.state)
    }));
  }, () => undefined), [schema])(state);
  const hasChanged = useHasChanged({
    initialState,
    schema,
    state,
    slugField: collectionConfig.slugField
  });
  const baseCommit = useBaseCommit();
  const slug = getSlugFromState(collectionConfig, state);
  const formatInfo = getCollectionFormat(config, collection);
  const currentBasePath = getCollectionItemPath(config, collection, itemSlug);
  const futureBasePath = getCollectionItemPath(config, collection, slug);
  const branchInfo = useBranchInfo();
  const [updateResult, _update, resetUpdateItem] = useUpsertItem({
    state,
    initialFiles,
    config,
    schema: collectionConfig.schema,
    basePath: futureBasePath,
    format: formatInfo,
    currentLocalTreeKey: localTreeKey,
    slug: {
      field: collectionConfig.slugField,
      value: slug
    }
  });
  useEffect(() => {
    const key = ['collection', collection, props.itemSlug];
    if (hasChanged) {
      const serialized = serializeEntryToFiles({
        basePath: futureBasePath,
        config,
        format: getCollectionFormat(config, collection),
        schema: collectionConfig.schema,
        slug: {
          field: collectionConfig.slugField,
          value: slug
        },
        state
      });
      const files = new Map(serialized.map(x => [x.path, x.contents]));
      const data = {
        beforeTreeKey: localTreeKey,
        slug,
        files,
        savedAt: new Date(),
        version: 1
      };
      setDraft(key, data);
    } else {
      delDraft(key);
    }
  }, [collection, collectionConfig, config, futureBasePath, localTreeKey, props.itemSlug, slug, state, hasChanged]);
  const update = useEventCallback(_update);
  const [deleteResult, deleteItem, resetDeleteItem] = useDeleteItem({
    initialFiles,
    storage: config.storage,
    basePath: currentBasePath
  });
  const onReset = () => {
    setState({
      state: initialState,
      localTreeKey
    });
  };
  const viewHref = config.storage.kind !== 'local' ? `${getRepoUrl(branchInfo)}${formatInfo.dataLocation === 'index' ? `/tree/${branchInfo.currentBranch}/${getPathPrefix(config.storage)}${currentBasePath}` : `/blob/${branchInfo.currentBranch}/${getPathPrefix(config.storage)}${currentBasePath}${getDataFileExtension(formatInfo)}`}` : undefined;
  const previewHref = useMemo(() => {
    return collectionConfig.previewUrl ? collectionConfig.previewUrl.replace('{slug}', props.itemSlug).replace('{branch}', branchInfo.currentBranch) : undefined;
  }, [branchInfo.currentBranch, collectionConfig.previewUrl, props.itemSlug]);
  const onDelete = async () => {
    if (await deleteItem()) {
      router.push(`${props.basePath}/collection/${encodeURIComponent(collection)}`);
    }
  };
  const onDuplicate = async () => {
    let hasUpdated = true;
    if (hasChanged) {
      hasUpdated = await onUpdate();
    }
    if (hasUpdated) {
      router.push(`${props.basePath}/collection/${encodeURIComponent(collection)}/create?duplicate=${slug}`);
    }
  };
  const slugInfo = useSlugFieldInfo(collection, itemSlug);
  const onUpdate = useCallback(async () => {
    if (!clientSideValidateProp(schema, state, slugInfo)) {
      setForceValidation(true);
      return false;
    }
    const slug = getSlugFromState(collectionConfig, state);
    const hasUpdated = await update();
    if (hasUpdated && slug !== itemSlug) {
      router.replace(`${props.basePath}/collection/${encodeURIComponent(collection)}/item/${encodeURIComponent(slug)}`);
    }
    return hasUpdated;
  }, [collection, collectionConfig, itemSlug, props.basePath, router, schema, slugInfo, state, update]);
  const formID = 'item-edit-form';

  // allow shortcuts "cmd+s" and "ctrl+s" to save
  useEffect(() => {
    const listener = event => {
      if (updateResult.kind === 'loading') {
        return;
      }
      if (isHotkey('mod+s', event)) {
        event.preventDefault();
        onUpdate();
      }
    };
    document.addEventListener('keydown', listener);
    return () => document.removeEventListener('keydown', listener);
  }, [updateResult.kind, onUpdate]);
  return /*#__PURE__*/jsx(Fragment, {
    children: /*#__PURE__*/jsxs(ItemPageShell, {
      headerActions: /*#__PURE__*/jsx(HeaderActions, {
        formID: formID,
        isLoading: updateResult.kind === 'loading',
        hasChanged: hasChanged,
        onDelete: onDelete,
        onDuplicate: onDuplicate,
        onReset: onReset,
        viewHref: viewHref,
        previewHref: previewHref
      }),
      ...props,
      children: [updateResult.kind === 'error' && /*#__PURE__*/jsx(Notice, {
        tone: "critical",
        children: updateResult.error.message
      }), deleteResult.kind === 'error' && /*#__PURE__*/jsx(Notice, {
        tone: "critical",
        children: deleteResult.error.message
      }), /*#__PURE__*/jsx(Box, {
        id: formID,
        height: "100%",
        minHeight: 0,
        minWidth: 0,
        elementType: "form",
        onSubmit: event => {
          if (event.target !== event.currentTarget) return;
          event.preventDefault();
          onUpdate();
        },
        children: /*#__PURE__*/jsx(FormForEntry, {
          previewProps: previewProps,
          forceValidation: forceValidation,
          entryLayout: collectionConfig.entryLayout,
          formatInfo: formatInfo,
          slugField: slugInfo
        })
      }), /*#__PURE__*/jsx(DialogContainer
      // ideally this would be a popover on desktop but using a DialogTrigger wouldn't work since
      // this doesn't open on click but after doing a network request and it failing and manually wiring about a popover and modal would be a pain
      , {
        onDismiss: resetUpdateItem,
        children: updateResult.kind === 'needs-new-branch' && /*#__PURE__*/jsx(CreateBranchDuringUpdateDialog, {
          branchOid: baseCommit,
          onCreate: async newBranch => {
            const itemBasePath = `/keystatic/branch/${encodeURIComponent(newBranch)}/collection/${encodeURIComponent(collection)}/item/`;
            router.push(itemBasePath + encodeURIComponent(itemSlug));
            const slug = getSlugFromState(collectionConfig, state);
            const hasUpdated = await update({
              branch: newBranch,
              sha: baseCommit
            });
            if (hasUpdated && slug !== itemSlug) {
              router.replace(itemBasePath + encodeURIComponent(slug));
            }
          },
          reason: updateResult.reason,
          onDismiss: resetUpdateItem
        })
      }), /*#__PURE__*/jsx(DialogContainer
      // ideally this would be a popover on desktop but using a DialogTrigger
      // wouldn't work since this doesn't open on click but after doing a
      // network request and it failing and manually wiring about a popover
      // and modal would be a pain
      , {
        onDismiss: resetUpdateItem,
        children: updateResult.kind === 'needs-fork' && isGitHubConfig(props.config) && /*#__PURE__*/jsx(ForkRepoDialog, {
          onCreate: async () => {
            const slug = getSlugFromState(collectionConfig, state);
            const hasUpdated = await update();
            if (hasUpdated && slug !== itemSlug) {
              router.replace(`${props.basePath}/collection/${encodeURIComponent(collection)}/item/${encodeURIComponent(slug)}`);
            }
          },
          onDismiss: resetUpdateItem,
          config: props.config
        })
      }), /*#__PURE__*/jsx(DialogContainer
      // ideally this would be a popover on desktop but using a DialogTrigger
      // wouldn't work since this doesn't open on click but after doing a
      // network request and it failing and manually wiring about a popover
      // and modal would be a pain
      , {
        onDismiss: resetDeleteItem,
        children: deleteResult.kind === 'needs-fork' && isGitHubConfig(props.config) && /*#__PURE__*/jsx(ForkRepoDialog, {
          onCreate: async () => {
            await deleteItem();
            router.push(`${props.basePath}/collection/${encodeURIComponent(collection)}`);
          },
          onDismiss: resetDeleteItem,
          config: props.config
        })
      })]
    })
  });
}
function HeaderActions(props) {
  let {
    formID,
    hasChanged,
    isLoading,
    onDelete,
    onDuplicate,
    onReset,
    previewHref,
    viewHref
  } = props;
  const isBelowTablet = useMediaQuery(breakpointQueries.below.tablet);
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);
  const [deleteAlertIsOpen, setDeleteAlertOpen] = useState(false);
  const [duplicateAlertIsOpen, setDuplicateAlertOpen] = useState(false);
  const menuActions = useMemo(() => {
    let items = [{
      key: 'reset',
      label: 'Reset changes',
      // TODO: l10n
      icon: historyIcon
    }, {
      key: 'delete',
      label: 'Delete entry…',
      // TODO: l10n
      icon: trash2Icon
    }, {
      key: 'duplicate',
      label: 'Duplicate entry…',
      // TODO: l10n
      icon: copyPlusIcon
    }];
    if (previewHref) {
      items.push({
        key: 'preview',
        label: 'Preview',
        icon: externalLinkIcon,
        href: previewHref,
        target: '_blank',
        rel: 'noopener noreferrer'
      });
    }
    if (viewHref) {
      items.push({
        key: 'view',
        label: 'View on GitHub',
        icon: githubIcon,
        href: viewHref,
        target: '_blank',
        rel: 'noopener noreferrer'
      });
    }
    return items;
  }, [previewHref, viewHref]);
  const indicatorElement = (() => {
    if (isLoading) {
      return /*#__PURE__*/jsx(ProgressCircle, {
        "aria-label": "Saving changes",
        isIndeterminate: true,
        size: "small",
        alignSelf: "center"
      });
    }
    if (hasChanged) {
      return isBelowTablet ? /*#__PURE__*/jsx(Box, {
        backgroundColor: "pendingEmphasis",
        height: "scale.75",
        width: "scale.75",
        borderRadius: "full",
        children: /*#__PURE__*/jsx(Text, {
          visuallyHidden: true,
          children: "Unsaved"
        })
      }) : /*#__PURE__*/jsx(Badge, {
        tone: "pending",
        children: "Unsaved"
      });
    }
    return null;
  })();
  return /*#__PURE__*/jsxs(Fragment, {
    children: [indicatorElement, /*#__PURE__*/jsx(ActionGroup, {
      buttonLabelBehavior: "hide",
      overflowMode: "collapse",
      prominence: "low",
      density: "compact",
      maxWidth: isBelowTablet ? 'element.regular' : undefined // force switch to action menu on small devices
      ,
      items: menuActions,
      disabledKeys: hasChanged ? [] : ['reset'],
      onAction: key => {
        switch (key) {
          case 'reset':
            onReset();
            break;
          case 'delete':
            setDeleteAlertOpen(true);
            break;
          case 'duplicate':
            if (hasChanged) {
              setDuplicateAlertOpen(true);
            } else {
              onDuplicate();
            }
            break;
        }
      },
      children: item => /*#__PURE__*/jsxs(Item, {
        textValue: item.label,
        href: item.href,
        target: item.target,
        rel: item.rel,
        children: [/*#__PURE__*/jsx(Icon, {
          src: item.icon
        }), /*#__PURE__*/jsx(Text, {
          children: item.label
        })]
      }, item.key)
    }), /*#__PURE__*/jsx(Button, {
      form: formID,
      isDisabled: isLoading,
      prominence: "high",
      type: "submit",
      children: stringFormatter.format('save')
    }), /*#__PURE__*/jsx(DialogContainer, {
      onDismiss: () => setDeleteAlertOpen(false),
      children: deleteAlertIsOpen && /*#__PURE__*/jsx(AlertDialog, {
        title: "Delete entry",
        tone: "critical",
        cancelLabel: "Cancel",
        primaryActionLabel: "Yes, delete",
        autoFocusButton: "cancel",
        onPrimaryAction: onDelete,
        children: "Are you sure? This action cannot be undone."
      })
    }), /*#__PURE__*/jsx(DialogContainer, {
      onDismiss: () => setDuplicateAlertOpen(false),
      children: duplicateAlertIsOpen && /*#__PURE__*/jsx(AlertDialog, {
        title: "Save and duplicate entry",
        tone: "neutral",
        cancelLabel: "Cancel",
        primaryActionLabel: "Save and duplicate",
        autoFocusButton: "primary",
        onPrimaryAction: onDuplicate,
        children: "You have unsaved changes. Save this entry to duplicate it."
      })
    })]
  });
}
function CreateBranchDuringUpdateDialog(props) {
  var _data$createRef;
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);
  const repositoryId = useRepositoryId();
  const [branchName, setBranchName] = useState('');
  const [{
    error,
    fetching,
    data
  }, createBranch] = useCreateBranchMutation();
  const isLoading = fetching || !!(data !== null && data !== void 0 && (_data$createRef = data.createRef) !== null && _data$createRef !== void 0 && _data$createRef.__typename);
  const config = useConfig();
  const branchPrefix = getBranchPrefix(config);
  const propsForBranchPrefix = branchPrefix ? {
    UNSAFE_className: css({
      '& input': {
        paddingInlineStart: tokenSchema.size.space.xsmall
      }
    }),
    startElement: /*#__PURE__*/jsx(Flex, {
      alignItems: "center",
      paddingStart: "regular",
      justifyContent: "center",
      pointerEvents: "none",
      children: /*#__PURE__*/jsx(Text, {
        color: "neutralSecondary",
        children: branchPrefix
      })
    })
  } : {};
  return /*#__PURE__*/jsx(Dialog, {
    children: /*#__PURE__*/jsxs("form", {
      style: {
        display: 'contents'
      },
      onSubmit: async event => {
        var _result$data;
        if (event.target !== event.currentTarget) return;
        event.preventDefault();
        const fullBranchName = (branchPrefix !== null && branchPrefix !== void 0 ? branchPrefix : '') + branchName;
        const name = `refs/heads/${fullBranchName}`;
        const result = await createBranch({
          input: {
            name,
            oid: props.branchOid,
            repositoryId
          }
        });
        if ((_result$data = result.data) !== null && _result$data !== void 0 && (_result$data = _result$data.createRef) !== null && _result$data !== void 0 && _result$data.__typename) {
          props.onCreate(fullBranchName);
        }
      },
      children: [/*#__PURE__*/jsx(Heading, {
        children: stringFormatter.format('newBranch')
      }), /*#__PURE__*/jsx(Content, {
        children: /*#__PURE__*/jsx(Flex, {
          gap: "large",
          direction: "column",
          children: /*#__PURE__*/jsx(TextField, {
            value: branchName,
            onChange: setBranchName,
            label: "Branch name",
            description: props.reason,
            autoFocus: true,
            errorMessage: prettyErrorForCreateBranchMutation(error),
            ...propsForBranchPrefix
          })
        })
      }), /*#__PURE__*/jsxs(ButtonGroup, {
        children: [isLoading && /*#__PURE__*/jsx(ProgressCircle, {
          isIndeterminate: true,
          size: "small",
          "aria-label": "Creating Branch"
        }), /*#__PURE__*/jsx(Button, {
          isDisabled: isLoading,
          onPress: props.onDismiss,
          children: stringFormatter.format('cancel')
        }), /*#__PURE__*/jsx(Button, {
          isDisabled: isLoading,
          prominence: "high",
          type: "submit",
          children: "Create branch and save"
        })]
      })]
    })
  });
}
function ItemPageWrapper(props) {
  var _props$config$collect;
  const collectionConfig = (_props$config$collect = props.config.collections) === null || _props$config$collect === void 0 ? void 0 : _props$config$collect[props.collection];
  if (!collectionConfig) notFound();
  const format = useMemo(() => getCollectionFormat(props.config, props.collection), [props.config, props.collection]);
  const slugInfo = useMemo(() => {
    return {
      slug: props.itemSlug,
      field: collectionConfig.slugField
    };
  }, [collectionConfig.slugField, props.itemSlug]);
  const draftData = useData(useCallback(async () => {
    const raw = await getDraft(['collection', props.collection, props.itemSlug]);
    if (!raw) throw new Error('No draft found');
    const stored = storedValSchema$1.parse(raw);
    const parsed = parseEntry({
      config: props.config,
      dirpath: getCollectionItemPath(props.config, props.collection, stored.slug),
      format,
      schema: collectionConfig.schema,
      slug: {
        field: collectionConfig.slugField,
        slug: stored.slug
      }
    }, stored.files);
    return {
      state: parsed.initialState,
      savedAt: stored.savedAt,
      treeKey: stored.beforeTreeKey
    };
  }, [collectionConfig, format, props.collection, props.config, props.itemSlug]));
  const itemData = useItemData({
    config: props.config,
    dirpath: getCollectionItemPath(props.config, props.collection, props.itemSlug),
    schema: collectionConfig.schema,
    format,
    slug: slugInfo
  });
  if (itemData.kind === 'error') {
    return /*#__PURE__*/jsx(ItemPageShell, {
      ...props,
      children: /*#__PURE__*/jsx(PageBody, {
        children: /*#__PURE__*/jsx(Notice, {
          tone: "critical",
          children: itemData.error.message
        })
      })
    });
  }
  if (itemData.kind === 'loading' || draftData.kind === 'loading') {
    return /*#__PURE__*/jsx(ItemPageShell, {
      ...props,
      children: /*#__PURE__*/jsx(Flex, {
        alignItems: "center",
        justifyContent: "center",
        minHeight: "scale.3000",
        children: /*#__PURE__*/jsx(ProgressCircle, {
          "aria-label": "Loading Item",
          isIndeterminate: true,
          size: "large"
        })
      })
    });
  }
  if (itemData.data === 'not-found') {
    return /*#__PURE__*/jsx(ItemPageShell, {
      ...props,
      children: /*#__PURE__*/jsx(PageBody, {
        children: /*#__PURE__*/jsx(Notice, {
          tone: "caution",
          children: "Entry not found."
        })
      })
    });
  }
  const loadedDraft = draftData.kind === 'loaded' ? draftData.data : undefined;
  return /*#__PURE__*/jsx(ItemPage, {
    collection: props.collection,
    basePath: props.basePath,
    config: props.config,
    itemSlug: props.itemSlug,
    initialState: itemData.data.initialState,
    initialFiles: itemData.data.initialFiles,
    draft: loadedDraft,
    localTreeKey: itemData.data.localTreeKey
  });
}
const ItemPageShell = props => {
  const router = useRouter();
  const collectionConfig = props.config.collections[props.collection];
  return /*#__PURE__*/jsxs(PageRoot, {
    containerWidth: containerWidthForEntryLayout(collectionConfig),
    children: [/*#__PURE__*/jsxs(PageHeader, {
      children: [/*#__PURE__*/jsxs(Breadcrumbs, {
        flex: true,
        size: "medium",
        minWidth: 0,
        onAction: key => {
          if (key === 'collection') {
            router.push(`${props.basePath}/collection/${encodeURIComponent(props.collection)}`);
          }
        },
        children: [/*#__PURE__*/jsx(Item, {
          children: collectionConfig.label
        }, "collection"), /*#__PURE__*/jsx(Item, {
          children: props.itemSlug
        }, "item")]
      }), props.headerActions]
    }), props.children]
  });
};

function CreateItemWrapper(props) {
  var _props$config$collect;
  const router = useRouter();
  const duplicateSlug = useMemo(() => {
    const url = new URL(router.href, 'http://localhost');
    return url.searchParams.get('duplicate');
  }, [router.href]);
  const collectionConfig = (_props$config$collect = props.config.collections) === null || _props$config$collect === void 0 ? void 0 : _props$config$collect[props.collection];
  if (!collectionConfig) notFound();
  const format = useMemo(() => getCollectionFormat(props.config, props.collection), [props.config, props.collection]);
  const slug = useMemo(() => {
    if (duplicateSlug) {
      return {
        field: collectionConfig.slugField,
        slug: duplicateSlug
      };
    }
  }, [duplicateSlug, collectionConfig.slugField]);
  const itemData = useItemData({
    config: props.config,
    dirpath: getCollectionItemPath(props.config, props.collection, duplicateSlug !== null && duplicateSlug !== void 0 ? duplicateSlug : ''),
    schema: collectionConfig.schema,
    format,
    slug
  });
  const duplicateInitalState = duplicateSlug && itemData.kind === 'loaded' && itemData.data !== 'not-found' ? itemData.data.initialState : undefined;
  const duplicateInitalStateWithUpdatedSlug = useMemo(() => {
    if (duplicateInitalState) {
      let slugFieldValue = duplicateInitalState[collectionConfig.slugField];
      // we'll make a best effort to add something to the slug after duplicated so it's different
      // but if it fails a user can change it before creating
      // (e.g. potentially it's not just a text field so appending -copy might not work)
      try {
        const slugFieldSchema = collectionConfig.schema[collectionConfig.slugField];
        if (slugFieldSchema.kind !== 'form' || slugFieldSchema.formKind !== 'slug') {
          throw new Error('not slug field');
        }
        const serialized = slugFieldSchema.serializeWithSlug(slugFieldValue);
        slugFieldValue = slugFieldSchema.parse(serialized.value, {
          slug: `${serialized.slug}-copy`
        });
      } catch {}
      return {
        ...duplicateInitalState,
        [collectionConfig.slugField]: slugFieldValue
      };
    }
  }, [collectionConfig.schema, collectionConfig.slugField, duplicateInitalState]);
  if (duplicateSlug && itemData.kind === 'error') {
    return /*#__PURE__*/jsx(PageBody, {
      children: /*#__PURE__*/jsx(Notice, {
        tone: "critical",
        children: itemData.error.message
      })
    });
  }
  if (duplicateSlug && itemData.kind === 'loading') {
    return /*#__PURE__*/jsx(Flex, {
      alignItems: "center",
      justifyContent: "center",
      minHeight: "scale.3000",
      children: /*#__PURE__*/jsx(ProgressCircle, {
        "aria-label": "Loading Item",
        isIndeterminate: true,
        size: "large"
      })
    });
  }
  if (duplicateSlug && itemData.kind === 'loaded' && itemData.data === 'not-found') {
    return /*#__PURE__*/jsx(PageBody, {
      children: /*#__PURE__*/jsx(Notice, {
        tone: "caution",
        children: "Entry not found."
      })
    });
  }
  return /*#__PURE__*/jsx(CreateItem, {
    collection: props.collection,
    config: props.config,
    basePath: props.basePath,
    initialState: duplicateInitalStateWithUpdatedSlug
  });
}
function CreateItem(props) {
  var _props$config$collect2;
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);
  const router = useRouter();
  const collectionConfig = (_props$config$collect2 = props.config.collections) === null || _props$config$collect2 === void 0 ? void 0 : _props$config$collect2[props.collection];
  if (!collectionConfig) notFound();
  const [forceValidation, setForceValidation] = useState(false);
  const schema = useMemo(() => object(collectionConfig.schema), [collectionConfig.schema]);
  const [state, setState] = useState(() => {
    var _props$initialState;
    return (_props$initialState = props.initialState) !== null && _props$initialState !== void 0 ? _props$initialState : getInitialPropsValue(schema);
  });
  const previewProps = useMemo(() => createGetPreviewProps(schema, setState, () => undefined), [schema])(state);
  const baseCommit = useBaseCommit();
  const slug = getSlugFromState(collectionConfig, state);
  const formatInfo = getCollectionFormat(props.config, props.collection);
  const [createResult, _createItem, resetCreateItemState] = useUpsertItem({
    state,
    basePath: getCollectionItemPath(props.config, props.collection, slug),
    initialFiles: undefined,
    config: props.config,
    schema: collectionConfig.schema,
    format: formatInfo,
    currentLocalTreeKey: undefined,
    slug: {
      field: collectionConfig.slugField,
      value: slug
    }
  });
  const createItem = useEventCallback(_createItem);
  let collectionPath = `${props.basePath}/collection/${encodeURIComponent(props.collection)}`;
  const currentSlug = createResult.kind === 'updated' || createResult.kind === 'loading' ? slug : undefined;
  const slugInfo = useSlugFieldInfo(props.collection, currentSlug);
  const onCreate = async () => {
    if (!clientSideValidateProp(schema, state, slugInfo)) {
      setForceValidation(true);
      return;
    }
    if (await createItem()) {
      const slug = getSlugFromState(collectionConfig, state);
      router.push(`${collectionPath}/item/${encodeURIComponent(slug)}`);
      toastQueue.positive('Entry created', {
        timeout: 5000
      }); // TODO: l10n
    }
  };

  // note we're still "loading" when it's already been created
  // since we're waiting to go to the item page
  const isLoading = createResult.kind === 'loading' || createResult.kind === 'updated';
  const formID = 'item-create-form';
  return /*#__PURE__*/jsxs(Fragment, {
    children: [/*#__PURE__*/jsxs(PageRoot, {
      containerWidth: containerWidthForEntryLayout(collectionConfig),
      children: [/*#__PURE__*/jsxs(PageHeader, {
        children: [/*#__PURE__*/jsxs(Breadcrumbs, {
          size: "medium",
          flex: true,
          minWidth: 0,
          onAction: key => {
            if (key === 'collection') {
              router.push(collectionPath);
            }
          },
          children: [/*#__PURE__*/jsx(Item, {
            children: collectionConfig.label
          }, "collection"), /*#__PURE__*/jsx(Item, {
            children: stringFormatter.format('add')
          }, "current")]
        }), isLoading && /*#__PURE__*/jsx(ProgressCircle, {
          "aria-label": "Creating entry",
          isIndeterminate: true,
          size: "small"
        }), /*#__PURE__*/jsx(Button, {
          isDisabled: isLoading,
          prominence: "high",
          type: "submit",
          form: formID,
          marginStart: "auto",
          children: stringFormatter.format('create')
        })]
      }), /*#__PURE__*/jsxs(Flex, {
        id: formID,
        elementType: "form",
        onSubmit: event => {
          if (event.target !== event.currentTarget) return;
          event.preventDefault();
          onCreate();
        },
        direction: "column",
        gap: "xxlarge",
        height: "100%",
        minHeight: 0,
        minWidth: 0,
        children: [createResult.kind === 'error' && /*#__PURE__*/jsx(Notice, {
          tone: "critical",
          children: createResult.error.message
        }), /*#__PURE__*/jsx(FormForEntry, {
          previewProps: previewProps,
          forceValidation: forceValidation,
          entryLayout: collectionConfig.entryLayout,
          formatInfo: formatInfo,
          slugField: slugInfo
        })]
      })]
    }), /*#__PURE__*/jsx(DialogContainer
    // ideally this would be a popover on desktop but using a DialogTrigger
    // wouldn't work since this doesn't open on click but after doing a
    // network request and it failing and manually wiring about a popover
    // and modal would be a pain
    , {
      onDismiss: resetCreateItemState,
      children: createResult.kind === 'needs-new-branch' && /*#__PURE__*/jsx(CreateBranchDuringUpdateDialog, {
        branchOid: baseCommit,
        onCreate: async newBranch => {
          router.push(`/keystatic/branch/${encodeURIComponent(newBranch)}/collection/${encodeURIComponent(props.collection)}/create`);
          if (await createItem({
            branch: newBranch,
            sha: baseCommit
          })) {
            const slug = getSlugFromState(collectionConfig, state);
            router.push(`/keystatic/branch/${encodeURIComponent(newBranch)}/collection/${encodeURIComponent(props.collection)}/item/${encodeURIComponent(slug)}`);
          }
        },
        reason: createResult.reason,
        onDismiss: resetCreateItemState
      })
    }), /*#__PURE__*/jsx(DialogContainer
    // ideally this would be a popover on desktop but using a DialogTrigger
    // wouldn't work since this doesn't open on click but after doing a
    // network request and it failing and manually wiring about a popover
    // and modal would be a pain
    , {
      onDismiss: resetCreateItemState,
      children: createResult.kind === 'needs-fork' && isGitHubConfig(props.config) && /*#__PURE__*/jsx(ForkRepoDialog, {
        onCreate: async () => {
          if (await createItem()) {
            const slug = getSlugFromState(collectionConfig, state);
            router.push(`${collectionPath}/item/${encodeURIComponent(slug)}`);
          }
        },
        onDismiss: resetCreateItemState,
        config: props.config
      })
    })]
  });
}

const DashboardSection = ({
  children,
  title
}) => {
  return /*#__PURE__*/jsxs(Flex, {
    elementType: "section",
    direction: "column",
    gap: "medium",
    children: [/*#__PURE__*/jsx(Text, {
      casing: "uppercase",
      color: "neutralTertiary",
      size: "small",
      weight: "bold",
      elementType: "h2",
      children: title
    }), children]
  });
};
const FILL_COLS = 'fill';
const DashboardGrid = props => {
  return /*#__PURE__*/jsx("div", {
    className: css({
      display: 'grid',
      gap: tokenSchema.size.space.large,
      gridAutoRows: tokenSchema.size.element.xlarge,
      gridTemplateColumns: `[${FILL_COLS}-start] 1fr [${FILL_COLS}-end]`,
      [containerQueries.above.mobile]: {
        gridTemplateColumns: `[${FILL_COLS}-start] 1fr 1fr [${FILL_COLS}-end]`
      },
      [containerQueries.above.tablet]: {
        gridTemplateColumns: `[${FILL_COLS}-start] 1fr 1fr 1fr [${FILL_COLS}-end]`
      }
    }),
    ...props
  });
};
const DashboardCard = props => {
  const ref = useRef(null);
  const {
    linkProps
  } = useLink(props, ref);
  return /*#__PURE__*/jsxs(Flex, {
    alignItems: "center",
    backgroundColor: "canvas",
    padding: "large",
    position: "relative",
    children: [/*#__PURE__*/jsxs(Flex, {
      direction: "column",
      gap: "medium",
      flex: true,
      children: [/*#__PURE__*/jsx(Heading, {
        elementType: "h3",
        size: "small",
        truncate: true,
        children: /*#__PURE__*/jsx("a", {
          ref: ref,
          href: props.href,
          ...linkProps,
          className: classNames(css({
            color: tokenSchema.color.foreground.neutral,
            outline: 'none',
            '&:hover': {
              color: tokenSchema.color.foreground.neutralEmphasis,
              '::before': {
                backgroundColor: tokenSchema.color.alias.backgroundIdle,
                borderColor: tokenSchema.color.border.neutral
              }
            },
            '&:active': {
              '::before': {
                backgroundColor: tokenSchema.color.alias.backgroundHovered,
                borderColor: tokenSchema.color.alias.borderHovered
              }
            },
            '&:focus-visible::before': {
              outline: `${tokenSchema.size.alias.focusRing} solid ${tokenSchema.color.alias.focusRing}`,
              outlineOffset: tokenSchema.size.alias.focusRingGap
            },
            // fill the available space so that the card is clickable
            '::before': {
              border: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.border.muted}`,
              borderRadius: tokenSchema.size.radius.medium,
              content: '""',
              position: 'absolute',
              inset: 0,
              transition: transition(['background-color', 'border-color'])
            }
          })),
          children: props.label
        })
      }), props.children]
    }), props.endElement]
  });
};

function useLocalizedString() {
  let stringFormatter = useLocalizedStringFormatter(l10nMessages);
  return stringFormatter;
}

function BranchSection(props) {
  let branchInfo = useBranchInfo();
  let router = useRouter();
  let localizedString = useLocalizedString();
  if (isLocalConfig(props.config)) {
    return null;
  }
  let repoURL = getRepoUrl(branchInfo);
  let isDefaultBranch = branchInfo.currentBranch === branchInfo.defaultBranch;
  return /*#__PURE__*/jsxs(DashboardSection, {
    title: localizedString.format('currentBranch'),
    children: [/*#__PURE__*/jsxs(Flex, {
      alignItems: "center",
      gap: "regular",
      border: "muted",
      borderRadius: "medium",
      backgroundColor: "canvas",
      padding: "large",
      children: [/*#__PURE__*/jsx(Icon, {
        src: gitBranchIcon,
        color: "neutralTertiary"
      }), /*#__PURE__*/jsx(Text, {
        size: "medium",
        weight: "semibold",
        children: branchInfo.currentBranch
      })]
    }), /*#__PURE__*/jsxs(Flex, {
      gap: "regular",
      wrap: true,
      children: [/*#__PURE__*/jsxs(DialogTrigger, {
        children: [/*#__PURE__*/jsxs(ActionButton, {
          children: [/*#__PURE__*/jsx(Icon, {
            src: gitBranchPlusIcon
          }), /*#__PURE__*/jsx(Text, {
            children: localizedString.format('newBranch')
          })]
        }), close => /*#__PURE__*/jsx(CreateBranchDialog, {
          onDismiss: close,
          onCreate: branchName => {
            close();
            router.push(router.href.replace(/\/branch\/[^/]+/, '/branch/' + encodeURIComponent(branchName)));
          }
        })]
      }), !isDefaultBranch && (branchInfo.pullRequestNumber === undefined ? /*#__PURE__*/jsxs(ActionButton, {
        href: `${repoURL}/pull/new/${branchInfo.currentBranch}`,
        target: "_blank",
        children: [/*#__PURE__*/jsx(Icon, {
          src: gitPullRequestIcon
        }), /*#__PURE__*/jsx(Text, {
          children: localizedString.format('createPullRequest')
        })]
      }) : /*#__PURE__*/jsxs(ActionButton, {
        href: `${repoURL}/pull/${branchInfo.pullRequestNumber}`,
        target: "_blank",
        children: [/*#__PURE__*/jsx(Icon, {
          src: gitPullRequestIcon
        }), /*#__PURE__*/jsxs(Text, {
          children: ["Pull request #", branchInfo.pullRequestNumber]
        })]
      }))]
    })]
  });
}

function DashboardCards() {
  const navItems = useNavItems();
  const hasSections = navItems.some(item => 'children' in item);
  const items = navItems.map(item => renderItemOrGroup(item));
  return hasSections ? /*#__PURE__*/jsx(Fragment, {
    children: items
  }) : /*#__PURE__*/jsx(DashboardSection, {
    title: "Content",
    children: /*#__PURE__*/jsx(DashboardGrid, {
      children: items
    })
  });
}
let dividerCount = 0;
function renderItemOrGroup(itemOrGroup) {
  if ('isDivider' in itemOrGroup) {
    return /*#__PURE__*/jsx(Flex, {
      gridColumn: FILL_COLS,
      children: /*#__PURE__*/jsx(Divider, {
        alignSelf: "center",
        size: "medium",
        width: "alias.singleLineWidth"
      })
    }, dividerCount++);
  }
  if ('children' in itemOrGroup) {
    return /*#__PURE__*/jsx(DashboardSection, {
      title: itemOrGroup.title,
      children: /*#__PURE__*/jsx(DashboardGrid, {
        children: itemOrGroup.children.map(child => renderItemOrGroup(child))
      })
    }, itemOrGroup.title);
  }
  let changeElement = (() => {
    if (!itemOrGroup.changed) {
      return undefined;
    }
    return typeof itemOrGroup.changed === 'number' ? /*#__PURE__*/jsx(Badge, {
      tone: "accent",
      marginStart: "auto",
      children: pluralize(itemOrGroup.changed, {
        singular: 'change',
        plural: 'changes'
      })
    }) : /*#__PURE__*/jsx(Badge, {
      tone: "accent",
      children: "Changed"
    });
  })();
  let endElement = (() => {
    // entry counts are only available for collections
    if (typeof itemOrGroup.entryCount !== 'number') {
      return changeElement;
    }
    return /*#__PURE__*/jsxs(Flex, {
      gap: "medium",
      alignItems: "center",
      children: [changeElement, /*#__PURE__*/jsx(ActionButton, {
        "aria-label": "Add",
        href: `${itemOrGroup.href}/create`,
        children: /*#__PURE__*/jsx(Icon, {
          src: plusIcon
        })
      })]
    });
  })();
  return /*#__PURE__*/jsx(DashboardCard, {
    label: itemOrGroup.label,
    href: itemOrGroup.href,
    endElement: endElement,
    children: typeof itemOrGroup.entryCount === 'number' ? /*#__PURE__*/jsx(Text, {
      color: "neutralSecondary",
      children: pluralize(itemOrGroup.entryCount, {
        singular: 'entry',
        plural: 'entries'
      })
    }) : null
  }, itemOrGroup.key);
}

function DashboardPage(props) {
  var _viewer$name;
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);
  const viewer = useViewer();
  const cloudInfo = useCloudInfo();
  const user = viewer ? {
    name: (_viewer$name = viewer.name) !== null && _viewer$name !== void 0 ? _viewer$name : viewer.login,
    avatarUrl: viewer.avatarUrl
  } : cloudInfo === null || cloudInfo === void 0 ? void 0 : cloudInfo.user;
  return /*#__PURE__*/jsxs(PageRoot, {
    containerWidth: "large",
    children: [/*#__PURE__*/jsx(PageHeader, {
      children: /*#__PURE__*/jsx(Heading, {
        elementType: "h1",
        id: "page-title",
        size: "small",
        children: stringFormatter.format('dashboard')
      })
    }), /*#__PURE__*/jsx(PageBody, {
      isScrollable: true,
      children: /*#__PURE__*/jsxs(Flex, {
        direction: "column",
        gap: "xxlarge",
        children: [user && /*#__PURE__*/jsx(UserInfo, {
          user: user,
          manageAccount: !!cloudInfo
        }), /*#__PURE__*/jsx(BranchSection, {
          config: props.config
        }), /*#__PURE__*/jsx(DashboardCards, {})]
      })
    })]
  });
}
function UserInfo({
  user,
  manageAccount
}) {
  return /*#__PURE__*/jsxs(Flex, {
    alignItems: "center",
    gap: "medium",
    isHidden: {
      below: 'tablet'
    },
    children: [/*#__PURE__*/jsx(Avatar, {
      src: user.avatarUrl,
      name: user.name,
      size: "large"
    }), /*#__PURE__*/jsxs(VStack, {
      gap: "medium",
      children: [/*#__PURE__*/jsxs(Heading, {
        size: "medium",
        elementType: "p",
        UNSAFE_style: {
          fontWeight: tokenSchema.typography.fontWeight.bold
        },
        children: ["Hello, ", user.name, "!"]
      }), manageAccount && /*#__PURE__*/jsx(TextLink, {
        href: "https://keystatic.cloud/account",
        children: "Manage Account"
      })]
    })]
  });
}

const MainPanelLayout = props => {
  let isBelowDesktop = useMediaQuery(breakpointQueries.below.desktop);
  let sidebarState = useSidebar();
  let ref = useRef(null);
  let context = useContentPanelState(ref);
  return /*#__PURE__*/jsx(ContentPanelProvider, {
    value: context,
    children: /*#__PURE__*/jsxs(SplitView, {
      autoSaveId: "keystatic-app-split-view",
      isCollapsed: isBelowDesktop || !sidebarState.isOpen,
      onCollapseChange: sidebarState.toggle,
      defaultSize: 260,
      minSize: 180,
      maxSize: 400
      // styles
      ,
      height: "100vh",
      children: [isBelowDesktop ? /*#__PURE__*/jsx(SidebarDialog, {}) : /*#__PURE__*/jsx(SplitPanePrimary, {
        children: /*#__PURE__*/jsx(SidebarPanel, {})
      }), /*#__PURE__*/jsx(SplitPaneSecondary, {
        ref: ref,
        children: props.children
      })]
    })
  });
};

const AppShell = props => {
  const content = /*#__PURE__*/jsx(AppShellErrorContext.Consumer, {
    children: error => error && !(error !== null && error !== void 0 && error.graphQLErrors.some(err => {
      var _err$originalError;
      return (err === null || err === void 0 || (_err$originalError = err.originalError) === null || _err$originalError === void 0 ? void 0 : _err$originalError.type) === 'NOT_FOUND';
    })) ? /*#__PURE__*/jsx(EmptyState, {
      icon: alertCircleIcon,
      title: "Failed to load shell",
      message: error.message
    }) : props.children
  });
  const inner = /*#__PURE__*/jsx(ConfigContext.Provider, {
    value: props.config,
    children: /*#__PURE__*/jsx(AppStateContext.Provider, {
      value: {
        basePath: props.basePath
      },
      children: /*#__PURE__*/jsx(SidebarProvider, {
        children: /*#__PURE__*/jsx(MainPanelLayout, {
          children: content
        })
      })
    })
  });
  if (isGitHubConfig(props.config) || props.config.storage.kind === 'cloud') {
    return /*#__PURE__*/jsx(GitHubAppShellProvider, {
      currentBranch: props.currentBranch,
      config: props.config,
      children: inner
    });
  }
  if (isLocalConfig(props.config)) {
    return /*#__PURE__*/jsx(LocalAppShellProvider, {
      config: props.config,
      children: inner
    });
  }
  return null;
};

function SingletonPage({
  singleton,
  initialFiles,
  initialState,
  localTreeKey,
  config,
  draft
}) {
  const [forceValidation, setForceValidation] = useState(false);
  const singletonConfig = config.singletons[singleton];
  const schema = useMemo(() => object(singletonConfig.schema), [singletonConfig.schema]);
  const singletonPath = getSingletonPath(config, singleton);
  const router = useRouter();
  const [{
    state,
    localTreeKey: localTreeKeyInState
  }, setState] = useState(() => {
    var _draft$state;
    return {
      localTreeKey: localTreeKey,
      state: (_draft$state = draft === null || draft === void 0 ? void 0 : draft.state) !== null && _draft$state !== void 0 ? _draft$state : initialState === null ? getInitialPropsValue(schema) : initialState
    };
  });
  useEffect(() => {
    if (draft && state === draft.state) {
      showDraftRestoredToast(draft.savedAt, localTreeKey !== draft.treeKey);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);
  if (localTreeKeyInState !== localTreeKey) {
    setState({
      localTreeKey: localTreeKey,
      state: initialState === null ? getInitialPropsValue(schema) : initialState
    });
  }
  const isCreating = initialState === null;
  const hasChanged = useHasChanged({
    initialState,
    state,
    schema,
    slugField: undefined
  }) || isCreating;
  useEffect(() => {
    const key = ['singleton', singleton];
    if (hasChanged) {
      const serialized = serializeEntryToFiles({
        basePath: singletonPath,
        config,
        format: getSingletonFormat(config, singleton),
        schema: singletonConfig.schema,
        slug: undefined,
        state
      });
      const files = new Map(serialized.map(x => [x.path, x.contents]));
      const data = {
        beforeTreeKey: localTreeKey,
        files,
        savedAt: new Date(),
        version: 1
      };
      setDraft(key, data);
    } else {
      delDraft(key);
    }
  }, [config, localTreeKey, state, hasChanged, singleton, singletonPath, singletonConfig]);
  const previewProps = useMemo(() => createGetPreviewProps(schema, stateUpdater => {
    setState(state => ({
      localTreeKey: state.localTreeKey,
      state: stateUpdater(state.state)
    }));
  }, () => undefined), [schema])(state);
  const baseCommit = useBaseCommit();
  const formatInfo = getSingletonFormat(config, singleton);
  const [updateResult, _update, resetUpdateItem] = useUpsertItem({
    state,
    initialFiles,
    config,
    schema: singletonConfig.schema,
    basePath: singletonPath,
    format: formatInfo,
    currentLocalTreeKey: localTreeKey,
    slug: undefined
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
  const onReset = () => setState({
    localTreeKey: localTreeKey,
    state: initialState === null ? getInitialPropsValue(schema) : initialState
  });
  const isBelowTablet = useMediaQuery(breakpointQueries.below.tablet);
  const branchInfo = useBranchInfo();
  const previewHref = useMemo(() => {
    if (!singletonConfig.previewUrl) return undefined;
    return singletonConfig.previewUrl.replace('{branch}', branchInfo.currentBranch);
  }, [branchInfo.currentBranch, singletonConfig.previewUrl]);
  const isGitHub = isGitHubConfig(config) || isCloudConfig(config);
  const singletonExists = !!initialState;
  const viewHref = isGitHub && singletonExists ? `${getRepoUrl(branchInfo)}${formatInfo.dataLocation === 'index' ? `/tree/${branchInfo.currentBranch}/${getPathPrefix(config.storage)}${singletonPath}` : `/blob/${getPathPrefix(config.storage)}${branchInfo.currentBranch}/${singletonPath}${getDataFileExtension(formatInfo)}`}` : undefined;
  const menuActions = useMemo(() => {
    const actions = [{
      key: 'reset',
      label: 'Reset',
      icon: historyIcon
    }];
    if (previewHref) {
      actions.push({
        key: 'preview',
        label: 'Preview',
        icon: externalLinkIcon,
        href: previewHref,
        target: '_blank',
        rel: 'noopener noreferrer'
      });
    }
    if (viewHref) {
      actions.push({
        key: 'view',
        label: 'View on GitHub',
        icon: githubIcon,
        href: viewHref,
        target: '_blank',
        rel: 'noopener noreferrer'
      });
    }
    return actions;
  }, [previewHref, viewHref]);
  return /*#__PURE__*/jsxs(PageRoot, {
    containerWidth: containerWidthForEntryLayout(singletonConfig),
    children: [/*#__PURE__*/jsxs(PageHeader, {
      children: [/*#__PURE__*/jsxs(Flex, {
        flex: true,
        alignItems: "center",
        gap: "regular",
        children: [/*#__PURE__*/jsx(Heading, {
          elementType: "h1",
          id: "page-title",
          size: "small",
          children: singletonConfig.label
        }), updateResult.kind === 'loading' ? /*#__PURE__*/jsx(ProgressCircle, {
          "aria-label": `Updating ${singletonConfig.label}`,
          isIndeterminate: true,
          size: "small",
          alignSelf: "center"
        }) : hasChanged && /*#__PURE__*/jsx(Badge, {
          tone: "pending",
          children: "Unsaved"
        })]
      }), /*#__PURE__*/jsx(ActionGroup, {
        buttonLabelBehavior: "hide",
        overflowMode: "collapse",
        prominence: "low",
        density: "compact",
        maxWidth: isBelowTablet ? 'element.regular' : undefined // force switch to action menu on small devices
        ,
        items: menuActions,
        disabledKeys: hasChanged ? [] : ['reset'],
        onAction: key => {
          switch (key) {
            case 'reset':
              onReset();
              break;
          }
        },
        children: item => /*#__PURE__*/jsxs(Item$1, {
          textValue: item.label,
          href: item.href,
          target: item.target,
          rel: item.rel,
          children: [/*#__PURE__*/jsx(Icon, {
            src: item.icon
          }), /*#__PURE__*/jsx(Text, {
            children: item.label
          })]
        }, item.key)
      }), /*#__PURE__*/jsx(Button, {
        form: formID,
        isDisabled: updateResult.kind === 'loading',
        prominence: "high",
        type: "submit",
        children: isCreating ? 'Create' : 'Save'
      })]
    }), /*#__PURE__*/jsxs(Flex, {
      elementType: "form",
      id: formID,
      onSubmit: event => {
        if (event.target !== event.currentTarget) return;
        event.preventDefault();
        onCreate();
      },
      direction: "column",
      gap: "xxlarge",
      height: "100%",
      minHeight: 0,
      minWidth: 0,
      children: [updateResult.kind === 'error' && /*#__PURE__*/jsx(Notice, {
        tone: "critical",
        children: updateResult.error.message
      }), /*#__PURE__*/jsx(FormForEntry, {
        previewProps: previewProps,
        forceValidation: forceValidation,
        entryLayout: singletonConfig.entryLayout,
        formatInfo: formatInfo,
        slugField: undefined
      }), /*#__PURE__*/jsx(DialogContainer
      // ideally this would be a popover on desktop but using a DialogTrigger wouldn't work since
      // this doesn't open on click but after doing a network request and it failing and manually wiring about a popover and modal would be a pain
      , {
        onDismiss: resetUpdateItem,
        children: updateResult.kind === 'needs-new-branch' && /*#__PURE__*/jsx(CreateBranchDuringUpdateDialog, {
          branchOid: baseCommit,
          onCreate: async newBranch => {
            router.push(`/keystatic/branch/${encodeURIComponent(newBranch)}/singleton/${encodeURIComponent(singleton)}`);
            update({
              branch: newBranch,
              sha: baseCommit
            });
          },
          reason: updateResult.reason,
          onDismiss: resetUpdateItem
        })
      }), /*#__PURE__*/jsx(DialogContainer
      // ideally this would be a popover on desktop but using a DialogTrigger
      // wouldn't work since this doesn't open on click but after doing a
      // network request and it failing and manually wiring about a popover
      // and modal would be a pain
      , {
        onDismiss: resetUpdateItem,
        children: updateResult.kind === 'needs-fork' && isGitHubConfig(config) && /*#__PURE__*/jsx(ForkRepoDialog, {
          onCreate: async () => {
            update();
          },
          onDismiss: resetUpdateItem,
          config: config
        })
      })]
    })]
  });
}
const storedValSchema = z.object({
  version: z.literal(1),
  savedAt: z.date(),
  beforeTreeKey: z.string().optional(),
  files: z.map(z.string(), z.instanceof(Uint8Array))
});
function SingletonPageWrapper(props) {
  var _props$config$singlet;
  const singletonConfig = (_props$config$singlet = props.config.singletons) === null || _props$config$singlet === void 0 ? void 0 : _props$config$singlet[props.singleton];
  if (!singletonConfig) notFound();
  const header = /*#__PURE__*/jsx(PageHeader, {
    children: /*#__PURE__*/jsx(Heading, {
      elementType: "h1",
      id: "page-title",
      size: "small",
      children: singletonConfig.label
    })
  });
  const format = useMemo(() => getSingletonFormat(props.config, props.singleton), [props.config, props.singleton]);
  const dirpath = getSingletonPath(props.config, props.singleton);
  const draftData = useData(useCallback(async () => {
    const raw = await getDraft(['singleton', props.singleton]);
    if (!raw) throw new Error('No draft found');
    const stored = storedValSchema.parse(raw);
    const parsed = parseEntry({
      config: props.config,
      dirpath,
      format,
      schema: singletonConfig.schema,
      slug: undefined
    }, stored.files);
    return {
      state: parsed.initialState,
      savedAt: stored.savedAt,
      treeKey: stored.beforeTreeKey
    };
  }, [dirpath, format, props.config, props.singleton, singletonConfig.schema]));
  const itemData = useItemData({
    config: props.config,
    dirpath,
    schema: singletonConfig.schema,
    format,
    slug: undefined
  });
  if (itemData.kind === 'error') {
    return /*#__PURE__*/jsxs(PageRoot, {
      children: [header, /*#__PURE__*/jsx(PageBody, {
        children: /*#__PURE__*/jsx(Notice, {
          margin: "xxlarge",
          tone: "critical",
          children: itemData.error.message
        })
      })]
    });
  }
  if (itemData.kind === 'loading' || draftData.kind === 'loading') {
    return /*#__PURE__*/jsxs(PageRoot, {
      children: [header, /*#__PURE__*/jsx(PageBody, {
        children: /*#__PURE__*/jsx(Flex, {
          alignItems: "center",
          justifyContent: "center",
          minHeight: "scale.3000",
          children: /*#__PURE__*/jsx(ProgressCircle, {
            "aria-label": `Loading ${singletonConfig.label}`,
            isIndeterminate: true,
            size: "large"
          })
        })
      })]
    });
  }
  return /*#__PURE__*/jsx(SingletonPage, {
    singleton: props.singleton,
    config: props.config,
    initialState: itemData.data === 'not-found' ? null : itemData.data.initialState,
    initialFiles: itemData.data === 'not-found' ? [] : itemData.data.initialFiles,
    localTreeKey: itemData.data === 'not-found' ? undefined : itemData.data.localTreeKey,
    draft: draftData.kind === 'loaded' ? draftData.data : undefined
  });
}

function CreatedGitHubApp(props) {
  return /*#__PURE__*/jsx(Flex, {
    alignItems: "center",
    justifyContent: "center",
    margin: "xxlarge",
    children: /*#__PURE__*/jsxs(Flex, {
      backgroundColor: "surface",
      padding: "large",
      border: "color.alias.borderIdle",
      borderRadius: "medium",
      direction: "column",
      justifyContent: "center",
      gap: "xlarge",
      maxWidth: "scale.4600",
      children: [/*#__PURE__*/jsx(Heading, {
        children: "You've installed Keystatic! \uD83C\uDF89"
      }), /*#__PURE__*/jsx(Text, {
        children: "To start using Keystatic, you need to install the GitHub app you've created."
      }), /*#__PURE__*/jsxs(Text, {
        children: ["Make sure to add the App to the", ' ', /*#__PURE__*/jsx("code", {
          children: serializeRepoConfig(props.config.storage.repo)
        }), ' ', "repository."]
      }), /*#__PURE__*/jsx(InstallGitHubApp, {
        config: props.config
      })]
    })
  });
}

function KeystaticSetup(props) {
  const [deployedURL, setDeployedURL] = useState('');
  const [organization, setOrganization] = useState('');
  return /*#__PURE__*/jsx(Flex, {
    alignItems: "center",
    justifyContent: "center",
    margin: "xxlarge",
    children: /*#__PURE__*/jsxs(Flex, {
      backgroundColor: "surface",
      padding: "large",
      border: "color.alias.borderIdle",
      borderRadius: "medium",
      direction: "column",
      justifyContent: "center",
      gap: "xlarge",
      maxWidth: "scale.4600",
      elementType: "form",
      action: `https://github.com${organization ? `/organizations/${organization}` : ''}/settings/apps/new`,
      method: "post",
      children: [/*#__PURE__*/jsx(Flex, {
        justifyContent: "center",
        children: /*#__PURE__*/jsx(Heading, {
          children: "Keystatic Setup"
        })
      }), /*#__PURE__*/jsx(Text, {
        children: "Keystatic doesn't have the required config."
      }), /*#__PURE__*/jsx(Text, {
        children: "If you've already created your GitHub app, make sure to add the following environment variables:"
      }), /*#__PURE__*/jsxs(Box, {
        elementType: "ul",
        children: [/*#__PURE__*/jsx("li", {
          children: /*#__PURE__*/jsx("code", {
            children: "KEYSTATIC_GITHUB_CLIENT_ID"
          })
        }), /*#__PURE__*/jsx("li", {
          children: /*#__PURE__*/jsx("code", {
            children: "KEYSTATIC_GITHUB_CLIENT_SECRET"
          })
        }), /*#__PURE__*/jsx("li", {
          children: /*#__PURE__*/jsx("code", {
            children: "KEYSTATIC_SECRET"
          })
        })]
      }), /*#__PURE__*/jsx(Text, {
        children: "If you haven't created your GitHub app for Keystatic, you can create one below."
      }), /*#__PURE__*/jsx(TextField, {
        label: "Deployed App URL",
        description: "This should the root of your domain. If you're not sure where Keystatic will be deployed, leave this blank and you can update the GitHub app later.",
        value: deployedURL,
        onChange: setDeployedURL
      }), /*#__PURE__*/jsx(TextField, {
        label: "GitHub organization (if any)",
        description: "You must be an owner or GitHub App manager in the organization to create the GitHub App. Leave this blank to create the app in your personal account.",
        value: organization,
        onChange: setOrganization
      }), /*#__PURE__*/jsxs(Text, {
        children: ["After visiting GitHub to create the GitHub app, you'll be redirected back here and secrets generated from GitHub will be written to your", ' ', /*#__PURE__*/jsx("code", {
          children: ".env"
        }), " file."]
      }), /*#__PURE__*/jsx("input", {
        type: "text",
        name: "manifest",
        className: css({
          display: 'none'
        }),
        value: JSON.stringify({
          name: `${parseRepoConfig(props.config.storage.repo).owner} Keystatic`,
          url: deployedURL ? `${deployedURL}/keystatic` : `${window.location.origin}/keystatic`,
          public: true,
          redirect_url: `${window.location.origin}/api/keystatic/github/created-app`,
          callback_urls: [`${window.location.origin}/api/keystatic/github/oauth/callback`, `http://127.0.0.1/api/keystatic/github/oauth/callback`, ...(deployedURL ? [`${deployedURL}/api/keystatic/github/oauth/callback`] : [])],
          request_oauth_on_install: true,
          default_permissions: {
            contents: 'write',
            metadata: 'read',
            pull_requests: 'read'
          }
        })
      }), /*#__PURE__*/jsx(Button, {
        prominence: "high",
        type: "submit",
        children: "Create GitHub App"
      })]
    })
  });
}

function RepoNotFound(props) {
  const repo = serializeRepoConfig(props.config.storage.repo);
  return /*#__PURE__*/jsx(Flex, {
    alignItems: "center",
    justifyContent: "center",
    margin: "xxlarge",
    children: /*#__PURE__*/jsxs(Flex, {
      backgroundColor: "surface",
      padding: "large",
      border: "color.alias.borderIdle",
      borderRadius: "medium",
      direction: "column",
      justifyContent: "center",
      gap: "xlarge",
      maxWidth: "scale.4600",
      children: [/*#__PURE__*/jsx(Flex, {
        justifyContent: "center",
        children: /*#__PURE__*/jsx(Heading, {
          children: "Repo not found"
        })
      }), /*#__PURE__*/jsxs(Text, {
        children: ["Keystatic is configured for the", ' ', /*#__PURE__*/jsx("a", {
          href: `https://github.com/${repo}`,
          children: repo
        }), " GitHub repo but Keystatic isn't able to access this repo. This is either because you don't have access to this repo or you haven't added the GitHub app to it."]
      }), /*#__PURE__*/jsx(InstallGitHubApp, {
        config: props.config
      })]
    })
  });
}

const storedStateSchema = z.object({
  state: z.string(),
  from: z.string(),
  code_verifier: z.string()
});
const tokenResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
  expires_in: z.number()
});
function KeystaticCloudAuthCallback({
  config
}) {
  var _config$cloud2;
  const router = useRouter();
  const url = new URL(window.location.href);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const storedState = useMemo(() => {
    const _storedState = localStorage.getItem('keystatic-cloud-state');
    const storedState = storedStateSchema.safeParse((() => {
      try {
        return JSON.parse(_storedState || '');
      } catch {
        return null;
      }
    })());
    return storedState;
  }, []);
  const [error, setError] = useState(null);
  useEffect(() => {
    var _config$cloud;
    if (code && state && storedState.success && (_config$cloud = config.cloud) !== null && _config$cloud !== void 0 && _config$cloud.project) {
      const {
        project
      } = config.cloud;
      (async () => {
        const res = await fetch(`${KEYSTATIC_CLOUD_API_URL}/oauth/token`, {
          method: 'POST',
          body: new URLSearchParams({
            code,
            client_id: project,
            redirect_uri: `${window.location.origin}/keystatic/cloud/oauth/callback`,
            code_verifier: storedState.data.code_verifier,
            grant_type: 'authorization_code'
          }).toString(),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            ...KEYSTATIC_CLOUD_HEADERS
          }
        });
        if (!res.ok) {
          throw new Error(`Bad response: ${res.status} ${res.statusText}\n\n${await res.text()}`);
        }
        const data = await res.json();
        const parsed = tokenResponseSchema.parse(data);
        localStorage.setItem('keystatic-cloud-access-token', JSON.stringify({
          token: parsed.access_token,
          project,
          validUntil: Date.now() + parsed.expires_in * 1000
        }));
        router.push(`/keystatic/${storedState.data.from}`);
      })().catch(error => {
        setError(error);
      });
    }
  }, [code, state, router, storedState, config]);
  if (!((_config$cloud2 = config.cloud) !== null && _config$cloud2 !== void 0 && _config$cloud2.project)) {
    return /*#__PURE__*/jsx(Text, {
      children: "Missing Keystatic Cloud config"
    });
  }
  if (!code || !state) {
    return /*#__PURE__*/jsx(Text, {
      children: "Missing code or state"
    });
  }
  if (storedState.success === false || state !== storedState.data.state) {
    return /*#__PURE__*/jsx(Text, {
      children: "Invalid state"
    });
  }
  if (error) {
    return /*#__PURE__*/jsx(Text, {
      children: error.message
    });
  }
  return /*#__PURE__*/jsx(Flex, {
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    children: /*#__PURE__*/jsx(ProgressCircle, {
      size: "large",
      isIndeterminate: true,
      "aria-label": "Authenticating"
    })
  });
}

function parseParamsWithoutBranch(params) {
  if (params.length === 0) {
    return {};
  }
  if (params.length === 2 && params[0] === 'singleton') {
    return {
      singleton: params[1]
    };
  }
  if (params.length < 2 || params[0] !== 'collection') return null;
  const collection = params[1];
  if (params.length === 2) {
    return {
      collection
    };
  }
  if (params.length === 3 && params[2] === 'create') {
    return {
      collection,
      kind: 'create'
    };
  }
  if (params.length === 4 && params[2] === 'item') {
    const slug = params[3];
    return {
      collection,
      kind: 'edit',
      slug
    };
  }
  return null;
}
function RedirectToBranch(props) {
  const {
    push
  } = useRouter();
  const {
    data,
    error
  } = useContext(GitHubAppShellDataContext);
  useEffect(() => {
    var _error$response, _data$repository, _data$repository2, _error$graphQLErrors, _error$graphQLErrors2;
    if ((error === null || error === void 0 || (_error$response = error.response) === null || _error$response === void 0 ? void 0 : _error$response.status) === 401) {
      if (props.config.storage.kind === 'github') {
        window.location.href = '/api/keystatic/github/login';
      } else {
        redirectToCloudAuth('', props.config);
      }
    }
    if (data !== null && data !== void 0 && (_data$repository = data.repository) !== null && _data$repository !== void 0 && _data$repository.defaultBranchRef) {
      push(`/keystatic/branch/${encodeURIComponent(data.repository.defaultBranchRef.name)}`);
    }
    if (props.config.storage.kind === 'github' && !(data !== null && data !== void 0 && (_data$repository2 = data.repository) !== null && _data$repository2 !== void 0 && _data$repository2.id) && (error === null || error === void 0 || (_error$graphQLErrors = error.graphQLErrors) === null || _error$graphQLErrors === void 0 || (_error$graphQLErrors = _error$graphQLErrors[0]) === null || _error$graphQLErrors === void 0 || (_error$graphQLErrors = _error$graphQLErrors.originalError) === null || _error$graphQLErrors === void 0 ? void 0 : _error$graphQLErrors.type) === 'NOT_FOUND' || (error === null || error === void 0 || (_error$graphQLErrors2 = error.graphQLErrors) === null || _error$graphQLErrors2 === void 0 || (_error$graphQLErrors2 = _error$graphQLErrors2[0]) === null || _error$graphQLErrors2 === void 0 || (_error$graphQLErrors2 = _error$graphQLErrors2.originalError) === null || _error$graphQLErrors2 === void 0 ? void 0 : _error$graphQLErrors2.type) === 'FORBIDDEN') {
      window.location.href = '/api/keystatic/github/repo-not-found';
    }
  }, [data, error, push, props.config]);
  return null;
}
function PageInner({
  config
}) {
  var _config$cloud;
  const {
    params
  } = useRouter();
  let branch = null,
    parsedParams,
    basePath;
  if (params.join('/') === 'cloud/oauth/callback') {
    return /*#__PURE__*/jsx(KeystaticCloudAuthCallback, {
      config: config
    });
  }
  let wrapper = x => x;
  if (isCloudConfig(config) || isLocalConfig(config) && (_config$cloud = config.cloud) !== null && _config$cloud !== void 0 && _config$cloud.project) {
    wrapper = element => /*#__PURE__*/jsx(CloudInfoProvider, {
      config: config,
      children: element
    });
  }
  if (isGitHubConfig(config) || isCloudConfig(config)) {
    const origWrapper = wrapper;
    wrapper = element => /*#__PURE__*/jsx(AuthWrapper, {
      config: config,
      children: /*#__PURE__*/jsx(GitHubAppShellDataProvider, {
        config: config,
        children: origWrapper(element)
      })
    });
    if (params.length === 0) {
      return wrapper( /*#__PURE__*/jsx(RedirectToBranch, {
        config: config
      }));
    }
    if (params.length === 1 && isGitHubConfig(config)) {
      if (params[0] === 'setup') return /*#__PURE__*/jsx(KeystaticSetup, {
        config: config
      });
      if (params[0] === 'repo-not-found') {
        return /*#__PURE__*/jsx(RepoNotFound, {
          config: config
        });
      }
      if (params[0] === 'created-github-app') {
        return /*#__PURE__*/jsx(CreatedGitHubApp, {
          config: config
        });
      }
    }
    if (params[0] !== 'branch' || params.length < 2) {
      return /*#__PURE__*/jsx(Text, {
        children: "Not found"
      });
    }
    branch = params[1];
    basePath = `/keystatic/branch/${encodeURIComponent(branch)}`;
    parsedParams = parseParamsWithoutBranch(params.slice(2));
  } else {
    parsedParams = parseParamsWithoutBranch(params);
    basePath = '/keystatic';
  }
  return wrapper( /*#__PURE__*/jsx(AppShell, {
    config: config,
    currentBranch: branch || '',
    basePath: basePath,
    children: /*#__PURE__*/jsx(NotFoundBoundary, {
      fallback: /*#__PURE__*/jsx(PageRoot, {
        children: /*#__PURE__*/jsx(PageBody, {
          children: /*#__PURE__*/jsx(EmptyState, {
            icon: fileX2Icon,
            title: "Not found",
            message: "This page could not be found."
          })
        })
      }),
      children: parsedParams === null ? /*#__PURE__*/jsx(AlwaysNotFound, {}) : parsedParams.collection ? parsedParams.kind === 'create' ? /*#__PURE__*/jsx(CreateItemWrapper, {
        collection: parsedParams.collection,
        config: config,
        basePath: basePath
      }, parsedParams.collection) : parsedParams.kind === 'edit' ? /*#__PURE__*/jsx(ItemPageWrapper, {
        collection: parsedParams.collection,
        basePath: basePath,
        config: config,
        itemSlug: parsedParams.slug
      }, parsedParams.collection) : /*#__PURE__*/jsx(CollectionPage, {
        basePath: basePath,
        collection: parsedParams.collection,
        config: config
      }, parsedParams.collection) : parsedParams.singleton ? /*#__PURE__*/jsx(SingletonPageWrapper, {
        config: config,
        singleton: parsedParams.singleton
      }, parsedParams.singleton) : /*#__PURE__*/jsx(DashboardPage, {
        config: config,
        basePath: basePath
      })
    })
  }));
}
function AlwaysNotFound() {
  notFound();
}
function AuthWrapper(props) {
  const [state, setState] = useState('unknown');
  const router = useRouter();
  useEffect(() => {
    getAuth(props.config).then(auth => {
      if (auth) {
        setState('valid');
        return;
      }
      setState('explicit-auth');
    });
  }, [props.config]);
  if (state === 'valid') {
    return props.children;
  }
  if (state === 'explicit-auth') {
    if (props.config.storage.kind === 'github') {
      return /*#__PURE__*/jsx(Flex, {
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        children: /*#__PURE__*/jsxs(Button, {
          href: `/api/keystatic/github/login${router.params.length ? `?${new URLSearchParams({
            from: router.params.join('/')
          })}` : ''}`
          // even though we'll never be in an iframe, so this isn't really distinct from _self
          // it makes react-aria avoid using client-side routing which we need here
          ,
          target: "_top",
          children: [/*#__PURE__*/jsx(Icon, {
            src: githubIcon
          }), /*#__PURE__*/jsx(Text, {
            children: "Log in with GitHub"
          })]
        })
      });
    }
    if (props.config.storage.kind === 'cloud') {
      return /*#__PURE__*/jsx(Flex, {
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        children: /*#__PURE__*/jsx(Button, {
          onPress: () => {
            redirectToCloudAuth(router.params.join('/'), props.config);
          },
          children: /*#__PURE__*/jsx(Text, {
            children: "Log in with Keystatic Cloud"
          })
        })
      });
    }
  }
  return null;
}
function RedirectToLoopback(props) {
  useEffect(() => {
    if (window.location.hostname === 'localhost') {
      window.location.href = window.location.href.replace('localhost', '127.0.0.1');
    }
  }, []);
  if (window.location.hostname === 'localhost') {
    return null;
  }
  return props.children;
}
function Keystatic(props) {
  if (props.config.storage.kind === 'github') {
    assertValidRepoConfig(props.config.storage.repo);
  }
  return /*#__PURE__*/jsx(ClientOnly, {
    children: /*#__PURE__*/jsx(RedirectToLoopback, {
      children: /*#__PURE__*/jsx(AppSlugProvider, {
        value: props.appSlug,
        children: /*#__PURE__*/jsx(RouterProvider, {
          children: /*#__PURE__*/jsx(Provider, {
            config: props.config,
            children: /*#__PURE__*/jsx(PageInner, {
              config: props.config
            })
          })
        })
      })
    })
  });
}
function ClientOnly(props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return props.children;
}

export { Keystatic };
