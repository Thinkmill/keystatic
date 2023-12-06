'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var button = require('@keystar/ui/button');
var icon = require('@keystar/ui/icon');
var fileX2Icon = require('@keystar/ui/icon/icons/fileX2Icon');
var githubIcon = require('@keystar/ui/icon/icons/githubIcon');
var layout = require('@keystar/ui/layout');
var typography = require('@keystar/ui/typography');
var i18n = require('@react-aria/i18n');
var isHotkey = require('is-hotkey');
var alertCircleIcon = require('@keystar/ui/icon/icons/alertCircleIcon');
var listXIcon = require('@keystar/ui/icon/icons/listXIcon');
var searchIcon = require('@keystar/ui/icon/icons/searchIcon');
var searchXIcon = require('@keystar/ui/icon/icons/searchXIcon');
var link = require('@keystar/ui/link');
var progress = require('@keystar/ui/progress');
var searchField = require('@keystar/ui/search-field');
var statusLight = require('@keystar/ui/status-light');
var style = require('@keystar/ui/style');
var table = require('@keystar/ui/table');
var emery = require('emery');
var index = require('../../dist/index-acec34fd.cjs.js');
var jsxRuntime = require('react/jsx-runtime');
var breadcrumbs = require('@keystar/ui/breadcrumbs');
var dialog = require('@keystar/ui/dialog');
var notice = require('@keystar/ui/notice');
var toast = require('@keystar/ui/toast');
require('@keystar/ui/checkbox');
var textField = require('@keystar/ui/text-field');
require('@keystar/ui/field');
require('@keystar/ui/number-field');
require('@keystar/ui/combobox');
require('minimatch');
require('@react-stately/collections');
require('@keystar/ui/picker');
require('@sindresorhus/slugify');
require('@braintree/sanitize-url');
var slots = require('@keystar/ui/slots');
require('@keystar/ui/drag-and-drop');
var trash2Icon = require('@keystar/ui/icon/icons/trash2Icon');
require('@keystar/ui/list-view');
require('@keystar/ui/tooltip');
require('slate');
require('slate-react');
require('@keystar/ui/menu');
var actionGroup = require('@keystar/ui/action-group');
var badge = require('@keystar/ui/badge');
var copyPlusIcon = require('@keystar/ui/icon/icons/copyPlusIcon');
var externalLinkIcon = require('@keystar/ui/icon/icons/externalLinkIcon');
var historyIcon = require('@keystar/ui/icon/icons/historyIcon');
var urql = require('urql');
var noTransform = require('@ts-gql/tag/no-transform');
var splitView = require('@keystar/ui/split-view');
require('@keystar/ui/icon/icons/panelLeftOpenIcon');
require('@keystar/ui/icon/icons/panelLeftCloseIcon');
require('@keystar/ui/icon/icons/panelRightOpenIcon');
require('@keystar/ui/icon/icons/panelRightCloseIcon');
var jsYaml = require('js-yaml');
var jsBase64 = require('js-base64');
var LRU = require('lru-cache');
var requiredFiles = require('../../dist/required-files-80a983cf.cjs.js');
var core = require('@keystar/ui/core');
var exchangeGraphcache = require('@urql/exchange-graphcache');
var exchangeAuth = require('@urql/exchange-auth');
var exchangePersisted = require('@urql/exchange-persisted');
var isEqual = require('fast-deep-equal');
var useSlugsInCollection = require('../../dist/useSlugsInCollection-bbdff519.cjs.js');
var z = require('zod');
var idbKeyval = require('idb-keyval');
var avatar = require('@keystar/ui/avatar');
var gitBranchIcon = require('@keystar/ui/icon/icons/gitBranchIcon');
var gitBranchPlusIcon = require('@keystar/ui/icon/icons/gitBranchPlusIcon');
var gitPullRequestIcon = require('@keystar/ui/icon/icons/gitPullRequestIcon');
var plusIcon = require('@keystar/ui/icon/icons/plusIcon');
require('@markdoc/markdoc');
require('emery/assertions');
require('../../dist/hex-35fdf290.cjs.js');
require('@react-aria/utils');
require('@keystar/ui/icon/icons/editIcon');
require('@keystar/ui/icon/icons/linkIcon');
require('@keystar/ui/icon/icons/unlinkIcon');
require('@react-aria/overlays');
require('@react-stately/overlays');
require('@keystar/ui/overlays');
require('@keystar/ui/icon/icons/boldIcon');
require('@keystar/ui/icon/icons/chevronDownIcon');
require('@keystar/ui/icon/icons/codeIcon');
require('@keystar/ui/icon/icons/italicIcon');
require('@keystar/ui/icon/icons/maximizeIcon');
require('@keystar/ui/icon/icons/minimizeIcon');
require('@keystar/ui/icon/icons/removeFormattingIcon');
require('@keystar/ui/icon/icons/strikethroughIcon');
require('@keystar/ui/icon/icons/subscriptIcon');
require('@keystar/ui/icon/icons/superscriptIcon');
require('@keystar/ui/icon/icons/typeIcon');
require('@keystar/ui/icon/icons/underlineIcon');
require('@keystar/ui/icon/icons/alignLeftIcon');
require('@keystar/ui/icon/icons/alignRightIcon');
require('@keystar/ui/icon/icons/alignCenterIcon');
require('@keystar/ui/icon/icons/quoteIcon');
require('match-sorter');
require('@keystar/ui/icon/icons/trashIcon');
require('@emotion/weak-memoize');
require('@keystar/ui/icon/icons/minusIcon');
require('@keystar/ui/icon/icons/columnsIcon');
require('@keystar/ui/icon/icons/listIcon');
require('@keystar/ui/icon/icons/listOrderedIcon');
require('@keystar/ui/icon/icons/fileUpIcon');
require('@keystar/ui/icon/icons/imageIcon');
require('cookie');
require('@keystar/ui/icon/icons/link2Icon');
require('@keystar/ui/icon/icons/link2OffIcon');
require('@keystar/ui/icon/icons/pencilIcon');
require('@keystar/ui/icon/icons/undo2Icon');
require('@keystar/ui/utils');
require('@keystar/ui/icon/icons/sheetIcon');
require('@keystar/ui/icon/icons/tableIcon');
require('scroll-into-view-if-needed');
require('@react-stately/list');
require('@keystar/ui/listbox');
require('slate-history');
require('mdast-util-from-markdown');
require('mdast-util-gfm-autolink-literal/from-markdown');
require('micromark-extension-gfm-autolink-literal');
require('mdast-util-gfm-strikethrough/from-markdown');
require('micromark-extension-gfm-strikethrough');
require('@keystar/ui/nav-list');
require('@keystar/ui/icon/icons/logOutIcon');
require('@keystar/ui/icon/icons/gitForkIcon');
require('@keystar/ui/icon/icons/monitorIcon');
require('@keystar/ui/icon/icons/moonIcon');
require('@keystar/ui/icon/icons/sunIcon');
require('@keystar/ui/icon/icons/userIcon');
require('@keystar/ui/radio');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefault(React);
var isHotkey__default = /*#__PURE__*/_interopDefault(isHotkey);
var LRU__default = /*#__PURE__*/_interopDefault(LRU);
var isEqual__default = /*#__PURE__*/_interopDefault(isEqual);

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
  emery.assert(key != null, '`sortDescriptor.column` is required');
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
  return /*#__PURE__*/jsxRuntime.jsx(layout.Flex, {
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
    children: 'children' in props ? props.children : /*#__PURE__*/jsxRuntime.jsxs(jsxRuntime.Fragment, {
      children: [props.icon && /*#__PURE__*/jsxRuntime.jsx(icon.Icon, {
        src: props.icon,
        size: "large",
        color: "neutralEmphasis"
      }), props.title && /*#__PURE__*/jsxRuntime.jsx(typography.Heading, {
        align: "center",
        size: "medium",
        children: props.title
      }), props.message && /*#__PURE__*/jsxRuntime.jsx(typography.Text, {
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
class NotFoundErrorBoundaryInner extends React__default["default"].Component {
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
  const router = index.useRouter();
  return /*#__PURE__*/jsxRuntime.jsx(NotFoundErrorBoundaryInner, {
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
  const [searchTerm, setSearchTerm] = React.useState('');
  let debouncedSearchTerm = useDebouncedValue(searchTerm, 300);
  return /*#__PURE__*/jsxRuntime.jsxs(index.PageRoot, {
    containerWidth: containerWidth,
    children: [/*#__PURE__*/jsxRuntime.jsx(CollectionPageHeader, {
      collectionLabel: collectionConfig.label,
      createHref: `${props.basePath}/collection/${encodeURIComponent(props.collection)}/create`,
      searchTerm: searchTerm,
      onSearchTermChange: setSearchTerm
    }), /*#__PURE__*/jsxRuntime.jsx(CollectionPageContent, {
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
  const stringFormatter = i18n.useLocalizedStringFormatter(index.l10nMessages);
  const isAboveMobile = style.useMediaQuery(style.breakpointQueries.above.mobile);
  const [searchVisible, setSearchVisible] = React.useState(isAboveMobile);
  const searchRef = React.useRef(null);
  React.useEffect(() => {
    setSearchVisible(isAboveMobile);
  }, [isAboveMobile]);

  // entries are presented in a virtualized table view, so we replace the
  // default (e.g. ctrl+f) browser search behaviour
  React.useEffect(() => {
    const listener = event => {
      // bail if the search field is already focused; let users invoke the
      // browser search if they need to
      if (document.activeElement === searchRef.current) {
        return;
      }
      if (isHotkey__default["default"]('mod+f', event)) {
        var _searchRef$current;
        event.preventDefault();
        (_searchRef$current = searchRef.current) === null || _searchRef$current === void 0 || _searchRef$current.select();
      }
    };
    document.addEventListener('keydown', listener);
    return () => document.removeEventListener('keydown', listener);
  }, []);
  return /*#__PURE__*/jsxRuntime.jsxs(index.PageHeader, {
    children: [/*#__PURE__*/jsxRuntime.jsx(typography.Heading, {
      elementType: "h1",
      id: "page-title",
      size: "small",
      flex: true,
      minWidth: 0,
      children: collectionLabel
    }), /*#__PURE__*/jsxRuntime.jsx("div", {
      role: "search",
      style: {
        display: searchVisible ? 'block' : 'none'
      },
      children: /*#__PURE__*/jsxRuntime.jsx(searchField.SearchField, {
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
    }), /*#__PURE__*/jsxRuntime.jsx(button.ActionButton, {
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
      children: /*#__PURE__*/jsxRuntime.jsx(icon.Icon, {
        src: searchIcon.searchIcon
      })
    }), /*#__PURE__*/jsxRuntime.jsx(button.Button, {
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
  const trees = index.useTree();
  const tree = trees.merged.kind === 'loaded' ? trees.merged.data.current.entries.get(index.getCollectionPath(props.config, props.collection)) : null;
  if (trees.merged.kind === 'error') {
    return /*#__PURE__*/jsxRuntime.jsx(EmptyState, {
      icon: alertCircleIcon.alertCircleIcon,
      title: "Unable to load collection",
      message: trees.merged.error.message,
      actions: /*#__PURE__*/jsxRuntime.jsx(button.Button, {
        tone: "accent",
        href: props.basePath,
        children: "Dashboard"
      })
    });
  }
  if (trees.merged.kind === 'loading') {
    return /*#__PURE__*/jsxRuntime.jsx(EmptyState, {
      children: /*#__PURE__*/jsxRuntime.jsx(progress.ProgressCircle, {
        "aria-label": "Loading Entries",
        isIndeterminate: true,
        size: "large"
      })
    });
  }
  if (!tree) {
    return /*#__PURE__*/jsxRuntime.jsx(EmptyState, {
      icon: listXIcon.listXIcon,
      title: "Empty collection",
      message: /*#__PURE__*/jsxRuntime.jsxs(jsxRuntime.Fragment, {
        children: ["There aren't any entries yet.", ' ', /*#__PURE__*/jsxRuntime.jsx(link.TextLink, {
          href: `${props.basePath}/collection/${encodeURIComponent(props.collection)}/create`,
          children: "Create the first entry"
        }), ' ', "to see it here."]
      })
    });
  }
  return /*#__PURE__*/jsxRuntime.jsx(CollectionTable, {
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
  } = index.useBranchInfo();
  let isLocalMode = index.isLocalConfig(props.config);
  let router = index.useRouter();
  let [sortDescriptor, setSortDescriptor] = React.useState({
    column: 'name',
    direction: 'ascending'
  });
  let hideStatusColumn = isLocalMode || currentBranch === defaultBranch;
  const entriesWithStatus = React.useMemo(() => {
    const defaultEntries = new Map(index.getEntriesInCollectionWithTreeKey(props.config, props.collection, props.trees.default.tree).map(x => [x.slug, x.key]));
    return index.getEntriesInCollectionWithTreeKey(props.config, props.collection, props.trees.current.tree).map(entry => {
      return {
        name: entry.slug,
        status: defaultEntries.has(entry.slug) ? defaultEntries.get(entry.slug) === entry.key ? 'Unchanged' : 'Changed' : 'Added'
      };
    });
  }, [props.collection, props.config, props.trees]);
  const filteredItems = React.useMemo(() => {
    return entriesWithStatus.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [entriesWithStatus, searchTerm]);
  const sortedItems = React.useMemo(() => {
    return [...filteredItems].sort(sortByDescriptor(sortDescriptor));
  }, [filteredItems, sortDescriptor]);
  const columns = React.useMemo(() => {
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
  return /*#__PURE__*/jsxRuntime.jsxs(table.TableView, {
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
    renderEmptyState: () => /*#__PURE__*/jsxRuntime.jsx(EmptyState, {
      icon: searchXIcon.searchXIcon,
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
    UNSAFE_className: style.css({
      marginInline: style.tokenSchema.size.space.regular,
      [style.breakpointQueries.above.mobile]: {
        marginInline: `calc(${style.tokenSchema.size.space.xlarge} - ${style.tokenSchema.size.space.medium})`
      },
      [style.breakpointQueries.above.tablet]: {
        marginInline: `calc(${style.tokenSchema.size.space.xxlarge} - ${style.tokenSchema.size.space.medium})`
      },
      '[role=rowheader]': {
        cursor: 'pointer'
      }
    }),
    children: [/*#__PURE__*/jsxRuntime.jsx(table.TableHeader, {
      columns: columns,
      children: ({
        name,
        key,
        ...options
      }) => /*#__PURE__*/jsxRuntime.jsx(table.Column, {
        isRowHeader: true,
        allowsSorting: true,
        ...options,
        children: name
      }, key)
    }), /*#__PURE__*/jsxRuntime.jsx(table.TableBody, {
      items: sortedItems,
      children: item => hideStatusColumn ? /*#__PURE__*/jsxRuntime.jsx(table.Row, {
        children: /*#__PURE__*/jsxRuntime.jsx(table.Cell, {
          textValue: item.name,
          children: /*#__PURE__*/jsxRuntime.jsx(typography.Text, {
            weight: "medium",
            children: item.name
          })
        })
      }, item.name) : /*#__PURE__*/jsxRuntime.jsxs(table.Row, {
        children: [/*#__PURE__*/jsxRuntime.jsx(table.Cell, {
          textValue: item.name,
          children: /*#__PURE__*/jsxRuntime.jsx(typography.Text, {
            weight: "medium",
            children: item.name
          })
        }), /*#__PURE__*/jsxRuntime.jsx(table.Cell, {
          textValue: item.status,
          children: /*#__PURE__*/jsxRuntime.jsx(statusLight.StatusLight, {
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
  const [debouncedValue, setDebouncedValue] = React.useState(value);
  React.useEffect(() => {
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

const AppSlugContext = /*#__PURE__*/React.createContext(undefined);
const AppSlugProvider = AppSlugContext.Provider;
function InstallGitHubApp(props) {
  var _URL$searchParams$get;
  const router = index.useRouter();
  const appSlugFromContext = React.useContext(AppSlugContext);
  const appSlug = (_URL$searchParams$get = new URL(router.href, 'https://example.com').searchParams.get('slug')) !== null && _URL$searchParams$get !== void 0 ? _URL$searchParams$get : appSlugFromContext === null || appSlugFromContext === void 0 ? void 0 : appSlugFromContext.value;
  const parsedRepo = index.parseRepoConfig(props.config.storage.repo);
  return /*#__PURE__*/jsxRuntime.jsxs(layout.Flex, {
    direction: "column",
    gap: "regular",
    children: [/*#__PURE__*/jsxRuntime.jsxs(layout.Flex, {
      alignItems: "end",
      gap: "regular",
      children: [/*#__PURE__*/jsxRuntime.jsx(textField.TextField, {
        label: "Repo Name",
        width: "100%",
        isReadOnly: true,
        value: parsedRepo.name
      }), /*#__PURE__*/jsxRuntime.jsx(button.ActionButton, {
        onPress: () => {
          navigator.clipboard.writeText(parsedRepo.name);
        },
        children: "Copy Repo Name"
      })]
    }), appSlug ? /*#__PURE__*/jsxRuntime.jsx(button.Button, {
      prominence: "high",
      href: `https://github.com/apps/${appSlug}/installations/new`,
      children: "Install GitHub App"
    }) : /*#__PURE__*/jsxRuntime.jsx(notice.Notice, {
      tone: "caution",
      children: appSlugFromContext ? /*#__PURE__*/jsxRuntime.jsxs(typography.Text, {
        children: ["The ", /*#__PURE__*/jsxRuntime.jsx("code", {
          children: appSlugFromContext.envName
        }), " environment variable wasn't provided so we can't link to the GitHub app installation page. You should find the App on GitHub and add the repo yourself."]
      }) : /*#__PURE__*/jsxRuntime.jsx(typography.Text, {
        children: "Find the App on GitHub and add the repo."
      })
    })]
  });
}

function ForkRepoDialog(props) {
  const stringFormatter = i18n.useLocalizedStringFormatter(index.l10nMessages);
  const client = urql.useClient();
  const [state, setState] = React.useState({
    kind: 'idle'
  });
  React.useEffect(() => {
    const listener = async event => {
      if (event.key === 'ks-refetch-installations' && event.newValue === 'true') {
        localStorage.removeItem('ks-refetch-installations');
        try {
          var _res$data;
          const auth = await index.getAuth(props.config);
          if (!auth) throw new Error('Unauthorized');
          const res = await client.query(index.GitHubAppShellQuery, index.parseRepoConfig(props.config.storage.repo)).toPromise();
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
  const appSlug = React.useContext(AppSlugContext);
  return /*#__PURE__*/jsxRuntime.jsxs(dialog.Dialog, {
    size: "small",
    isDismissable: true,
    onDismiss: () => {
      props.onDismiss();
    },
    children: [/*#__PURE__*/jsxRuntime.jsx(typography.Heading, {
      children: "Fork Repo"
    }), state.kind === 'error' ? /*#__PURE__*/jsxRuntime.jsxs(jsxRuntime.Fragment, {
      children: [/*#__PURE__*/jsxRuntime.jsx(slots.Content, {
        children: /*#__PURE__*/jsxRuntime.jsx(notice.Notice, {
          tone: "critical",
          children: state.error.message
        })
      }), /*#__PURE__*/jsxRuntime.jsx(button.ButtonGroup, {
        children: /*#__PURE__*/jsxRuntime.jsx(button.Button, {
          onPress: props.onDismiss,
          children: stringFormatter.format('cancel')
        })
      })]
    }) : /*#__PURE__*/jsxRuntime.jsx(jsxRuntime.Fragment, {
      children: /*#__PURE__*/jsxRuntime.jsx(slots.Content, {
        children: /*#__PURE__*/jsxRuntime.jsxs(layout.Flex, {
          gap: "large",
          direction: "column",
          marginBottom: "large",
          children: [/*#__PURE__*/jsxRuntime.jsx(typography.Text, {
            children: "You don't have permission to write to this repo so to save your changes, you need to fork the repo."
          }), /*#__PURE__*/jsxRuntime.jsxs(typography.Text, {
            children: ["To start,", ' ', /*#__PURE__*/jsxRuntime.jsx(link.TextLink, {
              href: `https://github.com/${index.serializeRepoConfig(props.config.storage.repo)}/fork`,
              target: "_blank",
              rel: "noopener noreferrer",
              children: "fork the repo on GitHub"
            }), ". Then, come back to this page and", ' ', /*#__PURE__*/jsxRuntime.jsx(link.TextLink, {
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
  const dataFilepath = index.getEntryDataFilepath(args.dirpath, args.format);
  const data = files.get(dataFilepath);
  if (!data) {
    throw new Error(`Could not find data file at ${dataFilepath}`);
  }
  const {
    loaded,
    extraFakeFile
  } = requiredFiles.loadDataFile(data, args.format);
  const filesWithFakeFile = new Map(files);
  if (extraFakeFile) {
    filesWithFakeFile.set(`${args.dirpath}/${extraFakeFile.path}`, extraFakeFile.contents);
  }
  const usedFiles = new Set([dataFilepath]);
  const rootSchema = index.object(args.schema);
  let initialState;
  const getFile = filepath => {
    usedFiles.add(filepath);
    return filesWithFakeFile.get(filepath);
  };
  try {
    initialState = index.parseProps(rootSchema, loaded, [], [], (schema, value, path, pathWithArrayFieldSlugs) => {
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
    throw index.toFormattedFormDataError(err);
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
  } = index.useTree();
  const baseCommit = index.useBaseCommit();
  const isRepoPrivate = index.useIsRepoPrivate();
  const branchInfo = index.useBranchInfo();
  const rootTree = currentBranch.kind === 'loaded' ? currentBranch.data.tree : undefined;
  const locationsForTreeKey = React.useMemo(() => {
    var _args$slug8;
    return index.getDirectoriesForTreeKey(index.object(args.schema), args.dirpath, (_args$slug8 = args.slug) === null || _args$slug8 === void 0 ? void 0 : _args$slug8.slug, args.format);
  }, [args.dirpath, args.format, args.schema, (_args$slug9 = args.slug) === null || _args$slug9 === void 0 ? void 0 : _args$slug9.slug]);
  const localTreeKey = React.useMemo(() => index.getTreeKey(locationsForTreeKey, rootTree !== null && rootTree !== void 0 ? rootTree : new Map()), [locationsForTreeKey, rootTree]);
  const tree = React.useMemo(() => {
    return rootTree !== null && rootTree !== void 0 ? rootTree : new Map();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localTreeKey, locationsForTreeKey]);
  const hasLoaded = currentBranch.kind === 'loaded';
  return index.useData(React.useCallback(() => {
    var _getTreeNodeAtPath;
    if (!hasLoaded) return index.LOADING;
    const dataFilepathSha = (_getTreeNodeAtPath = index.getTreeNodeAtPath(tree, index.getEntryDataFilepath(args.dirpath, args.format))) === null || _getTreeNodeAtPath === void 0 ? void 0 : _getTreeNodeAtPath.entry.sha;
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
      const node = index.getTreeNodeAtPath(tree, dir);
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
const blobCache = new LRU__default["default"]({
  max: 200
});
async function hydrateBlobCache(contents) {
  const sha = await index.blobSha(contents);
  blobCache.set(sha, contents);
  return sha;
}
async function fetchGitHubBlob(config, oid, filepath, commitSha, isRepoPrivate, repo) {
  if (!isRepoPrivate) {
    var _getPathPrefix;
    return fetch(`https://raw.githubusercontent.com/${index.serializeRepoConfig(repo)}/${commitSha}/${(_getPathPrefix = index.getPathPrefix(config.storage)) !== null && _getPathPrefix !== void 0 ? _getPathPrefix : ''}${filepath}`);
  }
  const auth = await index.getAuth(config);
  return fetch(config.storage.kind === 'github' ? `https://api.github.com/repos/${index.serializeRepoConfig(config.storage.repo)}/git/blobs/${oid}` : `${index.KEYSTATIC_CLOUD_API_URL}/v1/github/blob/${oid}`, {
    headers: {
      Authorization: `Bearer ${auth.accessToken}`,
      Accept: 'application/vnd.github.raw',
      ...(config.storage.kind === 'cloud' ? index.KEYSTATIC_CLOUD_HEADERS : {})
    }
  });
}
function fetchBlob(config, oid, filepath, commitSha, isRepoPrivate, repo) {
  if (blobCache.has(oid)) return blobCache.get(oid);
  const promise = (index.isGitHubConfig(config) || config.storage.kind === 'cloud' ? fetchGitHubBlob(config, oid, filepath, commitSha, isRepoPrivate, repo) : fetch(`/api/keystatic/blob/${oid}/${filepath}`, {
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

style.injectGlobal({
  body: {
    overflow: 'hidden'
  }
});
function createUrqlClient(config) {
  const repo = config.storage.kind === 'github' ? index.parseRepoConfig(config.storage.repo) : {
    owner: 'repo-owner',
    name: 'repo-name'
  };
  return urql.createClient({
    url: config.storage.kind === 'github' ? 'https://api.github.com/graphql' : `${index.KEYSTATIC_CLOUD_API_URL}/v1/github/graphql`,
    requestPolicy: 'cache-and-network',
    exchanges: [exchangeAuth.authExchange(async utils => {
      let authState = await index.getAuth(config);
      return {
        addAuthToOperation(operation) {
          authState = index.getSyncAuth(config);
          if (!authState) {
            return operation;
          }
          return utils.appendHeaders(operation, {
            Authorization: `Bearer ${authState.accessToken}`,
            ...(config.storage.kind === 'cloud' ? index.KEYSTATIC_CLOUD_HEADERS : {})
          });
        },
        didAuthError() {
          return false;
        },
        willAuthError(operation) {
          var _operation$query$defi;
          authState = index.getSyncAuth(config);
          if (operation.query.definitions[0].kind === 'OperationDefinition' && (_operation$query$defi = operation.query.definitions[0].name) !== null && _operation$query$defi !== void 0 && _operation$query$defi.value.includes('AppShell') && !authState) {
            if (config.storage.kind === 'github') {
              window.location.href = '/api/keystatic/github/login';
            } else {
              index.redirectToCloudAuth('', config);
            }
            return true;
          }
          if (!authState) {
            return true;
          }
          return false;
        },
        async refreshAuth() {
          authState = await index.getAuth(config);
        }
      };
    }), exchangeGraphcache.cacheExchange({
      updates: {
        Mutation: {
          createRef(result, args, cache, _info) {
            cache.updateQuery({
              query: config.storage.kind === 'github' ? index.GitHubAppShellQuery : index.CloudAppShellQuery,
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
              query: config.storage.kind === 'github' ? index.GitHubAppShellQuery : index.CloudAppShellQuery,
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
    }), ...(config.storage.kind === 'github' ? [] : [exchangePersisted.persistedExchange({
      enableForMutation: true,
      enforcePersistedQueries: true
    })]), urql.fetchExchange]
  });
}
function Provider({
  children,
  config
}) {
  const themeContext = index.useTheme();
  const {
    push: navigate
  } = index.useRouter();
  const keystarRouter = React.useMemo(() => ({
    navigate
  }), [navigate]);
  return /*#__PURE__*/jsxRuntime.jsx(index.ThemeProvider, {
    value: themeContext,
    children: /*#__PURE__*/jsxRuntime.jsxs(core.KeystarProvider, {
      locale: config.locale || 'en-US',
      colorScheme: themeContext.theme,
      router: keystarRouter,
      children: [/*#__PURE__*/jsxRuntime.jsx(core.ClientSideOnlyDocumentElement, {}), /*#__PURE__*/jsxRuntime.jsx("link", {
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
        rel: "stylesheet"
      }), /*#__PURE__*/jsxRuntime.jsx(urql.Provider, {
        value: React.useMemo(() => createUrqlClient(config), [config]),
        children: children
      }), /*#__PURE__*/jsxRuntime.jsx(toast.Toaster, {})]
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
  } = index.serializeProps(args.state, index.object(args.schema), (_args$slug = args.slug) === null || _args$slug === void 0 ? void 0 : _args$slug.field, (_args$slug2 = args.slug) === null || _args$slug2 === void 0 ? void 0 : _args$slug2.value, true);
  const dataFormat = args.format.data;
  let dataContent = textEncoder.encode(dataFormat === 'json' ? JSON.stringify(stateWithExtraFilesRemoved, null, 2) + '\n' : jsYaml.dump(stateWithExtraFilesRemoved));
  if (args.format.contentField) {
    const filename = `${args.format.contentField.key}${args.format.contentField.config.contentExtension}`;
    let contents;
    extraFiles = extraFiles.filter(x => {
      if (x.path !== filename) return true;
      contents = x.contents;
      return false;
    });
    emery.assert(contents !== undefined, 'Expected content field to be present');
    dataContent = combineFrontmatterAndContents(dataContent, contents);
  }
  return [{
    path: index.getEntryDataFilepath(args.basePath, args.format),
    contents: dataContent
  }, ...extraFiles.map(file => ({
    path: `${file.parent ? args.slug ? `${file.parent}/${args.slug.value}` : file.parent : args.basePath}/${file.path}`,
    contents: file.contents
  }))];
}
function useUpsertItem(args) {
  const [state, setState] = React.useState({
    kind: 'idle'
  });
  const baseCommit = index.useBaseCommit();
  const branchInfo = React.useContext(index.BranchInfoContext);
  const setTreeSha = index.useSetTreeSha();
  const [, mutate] = urql.useMutation(createCommitMutation);
  const repoWithWriteAccess = React.useContext(index.RepoWithWriteAccessContext);
  const appSlug = React.useContext(AppSlugContext);
  const unscopedTreeData = index.useCurrentUnscopedTree();
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
      const pathPrefix = (_getPathPrefix = index.getPathPrefix(args.config.storage)) !== null && _getPathPrefix !== void 0 ? _getPathPrefix : '';
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
        const existing = index.getTreeNodeAtPath(unscopedTree, addition.path);
        return (existing === null || existing === void 0 ? void 0 : existing.entry.sha) !== sha;
      });
      const deletions = [...filesToDelete].map(path => ({
        path
      }));
      const updatedTree = await index.updateTreeWithChanges(unscopedTree, {
        additions,
        deletions: [...filesToDelete]
      });
      await index.hydrateTreeCacheWithEntries(updatedTree.entries);
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
                contents: jsBase64.fromUint8Array(addition.contents)
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
            const tree = index.scopeEntriesWithPathPrefix(await index.fetchGitHubTreeData(refData.data.repository.ref.target.oid, args.config), args.config);
            const treeKey = index.getTreeKey(index.getDirectoriesForTreeKey(index.object(args.schema), args.basePath, (_args$slug3 = args.slug) === null || _args$slug3 === void 0 ? void 0 : _args$slug3.value, args.format), tree.tree);
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
              contents: jsBase64.fromUint8Array(addition.contents)
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
        } = await index.hydrateTreeCacheWithEntries(newTree);
        setTreeSha(await index.treeSha(tree));
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
const createCommitMutation = noTransform.gql`
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
  const [state, setState] = React.useState({
    kind: 'idle'
  });
  const baseCommit = index.useBaseCommit();
  const branchInfo = React.useContext(index.BranchInfoContext);
  const [, mutate] = urql.useMutation(createCommitMutation);
  const setTreeSha = index.useSetTreeSha();
  const repoWithWriteAccess = React.useContext(index.RepoWithWriteAccessContext);
  const appSlug = React.useContext(AppSlugContext);
  const unscopedTreeData = index.useCurrentUnscopedTree();
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
        return ((_getPathPrefix2 = index.getPathPrefix(args.storage)) !== null && _getPathPrefix2 !== void 0 ? _getPathPrefix2 : '') + x;
      });
      const updatedTree = await index.updateTreeWithChanges(unscopedTree, {
        additions: [],
        deletions
      });
      await index.hydrateTreeCacheWithEntries(updatedTree.entries);
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
        } = await index.hydrateTreeCacheWithEntries(newTree);
        setTreeSha(await index.treeSha(tree));
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
const FetchRef = noTransform.gql`
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
  const serialize = React.useCallback(state => {
    const slug = args.slugField ? index.getSlugFromState({
      schema: args.schema.fields,
      slugField: args.slugField
    }, state) : undefined;
    return {
      slug,
      state: index.serializeProps(state, args.schema, args.slugField, slug, true)
    };
  }, [args.schema, args.slugField]);
  const initialFilesForUpdate = React.useMemo(() => args.initialState === null ? null : serialize(args.initialState), [args.initialState, serialize]);
  const filesForUpdate = React.useMemo(() => serialize(args.state), [serialize, args.state]);
  return React.useMemo(() => {
    return !isEqual__default["default"](initialFilesForUpdate, filesForUpdate);
  }, [initialFilesForUpdate, filesForUpdate]);
}

function useSlugFieldInfo(collection, slugToExclude) {
  const config = index.useConfig();
  const allSlugs = useSlugsInCollection.useSlugsInCollection(collection);
  return React.useMemo(() => {
    const slugs = new Set(allSlugs);
    if (slugToExclude) {
      slugs.delete(slugToExclude);
    }
    const collectionConfig = config.collections[collection];
    return {
      field: collectionConfig.slugField,
      slugs,
      glob: index.getSlugGlobForCollection(config, collection)
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
  } = i18n.useLocale();
  const [now] = React.useState(() => new Date());
  const formatted = React.useMemo(() => {
    const formatter = new Intl.RelativeTimeFormat(locale);
    formatter.format(props.date.getTime() - now.getTime(), 'second');
    return formatTimeAgo(props.date, now, formatter);
  }, [locale, now, props.date]);
  return /*#__PURE__*/jsxRuntime.jsx("time", {
    dateTime: props.date.toISOString(),
    children: formatted
  });
}
function showDraftRestoredToast(savedAt, hasChangedSince) {
  toast.toastQueue.info( /*#__PURE__*/jsxRuntime.jsxs(typography.Text, {
    children: ["Restored draft from ", /*#__PURE__*/jsxRuntime.jsx(RelativeTime, {
      date: savedAt
    }), ".", ' ', hasChangedSince && /*#__PURE__*/jsxRuntime.jsx(typography.Text, {
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
    store = idbKeyval.createStore('keystatic', 'items');
  }
  return store;
}
// the as anys are because the indexeddb types dont't accept readonly arrays

function setDraft(key, val) {
  return idbKeyval.set(key, val, getStore());
}
function delDraft(key) {
  return idbKeyval.del(key, getStore());
}
function getDraft(key) {
  return idbKeyval.get(key, getStore());
}

const storedValSchema$1 = z.z.object({
  version: z.z.literal(1),
  savedAt: z.z.date(),
  slug: z.z.string(),
  beforeTreeKey: z.z.string(),
  files: z.z.map(z.z.string(), z.z.instanceof(Uint8Array))
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
  const router = index.useRouter();
  const [forceValidation, setForceValidation] = React.useState(false);
  const collectionConfig = config.collections[collection];
  const schema = React.useMemo(() => index.object(collectionConfig.schema), [collectionConfig.schema]);
  const [{
    state,
    localTreeKey: localTreeKeyInState
  }, setState] = React.useState({
    state: (_draft$state = draft === null || draft === void 0 ? void 0 : draft.state) !== null && _draft$state !== void 0 ? _draft$state : initialState,
    localTreeKey
  });
  React.useEffect(() => {
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
  const previewProps = React.useMemo(() => index.createGetPreviewProps(schema, stateUpdater => {
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
  const baseCommit = index.useBaseCommit();
  const slug = index.getSlugFromState(collectionConfig, state);
  const formatInfo = index.getCollectionFormat(config, collection);
  const currentBasePath = index.getCollectionItemPath(config, collection, itemSlug);
  const futureBasePath = index.getCollectionItemPath(config, collection, slug);
  const branchInfo = index.useBranchInfo();
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
  React.useEffect(() => {
    const key = ['collection', collection, props.itemSlug];
    if (hasChanged) {
      const serialized = serializeEntryToFiles({
        basePath: futureBasePath,
        config,
        format: index.getCollectionFormat(config, collection),
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
  const update = index.useEventCallback(_update);
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
  const viewHref = config.storage.kind !== 'local' ? `${index.getRepoUrl(branchInfo)}${formatInfo.dataLocation === 'index' ? `/tree/${branchInfo.currentBranch}/${index.getPathPrefix(config.storage)}${currentBasePath}` : `/blob/${branchInfo.currentBranch}/${index.getPathPrefix(config.storage)}${currentBasePath}${index.getDataFileExtension(formatInfo)}`}` : undefined;
  const previewHref = React.useMemo(() => {
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
  const onUpdate = React.useCallback(async () => {
    if (!index.clientSideValidateProp(schema, state, slugInfo)) {
      setForceValidation(true);
      return false;
    }
    const slug = index.getSlugFromState(collectionConfig, state);
    const hasUpdated = await update();
    if (hasUpdated && slug !== itemSlug) {
      router.replace(`${props.basePath}/collection/${encodeURIComponent(collection)}/item/${encodeURIComponent(slug)}`);
    }
    return hasUpdated;
  }, [collection, collectionConfig, itemSlug, props.basePath, router, schema, slugInfo, state, update]);
  const formID = 'item-edit-form';

  // allow shortcuts "cmd+s" and "ctrl+s" to save
  React.useEffect(() => {
    const listener = event => {
      if (updateResult.kind === 'loading') {
        return;
      }
      if (isHotkey__default["default"]('mod+s', event)) {
        event.preventDefault();
        onUpdate();
      }
    };
    document.addEventListener('keydown', listener);
    return () => document.removeEventListener('keydown', listener);
  }, [updateResult.kind, onUpdate]);
  return /*#__PURE__*/jsxRuntime.jsx(jsxRuntime.Fragment, {
    children: /*#__PURE__*/jsxRuntime.jsxs(ItemPageShell, {
      headerActions: /*#__PURE__*/jsxRuntime.jsx(HeaderActions, {
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
      children: [updateResult.kind === 'error' && /*#__PURE__*/jsxRuntime.jsx(notice.Notice, {
        tone: "critical",
        children: updateResult.error.message
      }), deleteResult.kind === 'error' && /*#__PURE__*/jsxRuntime.jsx(notice.Notice, {
        tone: "critical",
        children: deleteResult.error.message
      }), /*#__PURE__*/jsxRuntime.jsx(layout.Box, {
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
        children: /*#__PURE__*/jsxRuntime.jsx(index.FormForEntry, {
          previewProps: previewProps,
          forceValidation: forceValidation,
          entryLayout: collectionConfig.entryLayout,
          formatInfo: formatInfo,
          slugField: slugInfo
        })
      }), /*#__PURE__*/jsxRuntime.jsx(dialog.DialogContainer
      // ideally this would be a popover on desktop but using a DialogTrigger wouldn't work since
      // this doesn't open on click but after doing a network request and it failing and manually wiring about a popover and modal would be a pain
      , {
        onDismiss: resetUpdateItem,
        children: updateResult.kind === 'needs-new-branch' && /*#__PURE__*/jsxRuntime.jsx(CreateBranchDuringUpdateDialog, {
          branchOid: baseCommit,
          onCreate: async newBranch => {
            const itemBasePath = `/keystatic/branch/${encodeURIComponent(newBranch)}/collection/${encodeURIComponent(collection)}/item/`;
            router.push(itemBasePath + encodeURIComponent(itemSlug));
            const slug = index.getSlugFromState(collectionConfig, state);
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
      }), /*#__PURE__*/jsxRuntime.jsx(dialog.DialogContainer
      // ideally this would be a popover on desktop but using a DialogTrigger
      // wouldn't work since this doesn't open on click but after doing a
      // network request and it failing and manually wiring about a popover
      // and modal would be a pain
      , {
        onDismiss: resetUpdateItem,
        children: updateResult.kind === 'needs-fork' && index.isGitHubConfig(props.config) && /*#__PURE__*/jsxRuntime.jsx(ForkRepoDialog, {
          onCreate: async () => {
            const slug = index.getSlugFromState(collectionConfig, state);
            const hasUpdated = await update();
            if (hasUpdated && slug !== itemSlug) {
              router.replace(`${props.basePath}/collection/${encodeURIComponent(collection)}/item/${encodeURIComponent(slug)}`);
            }
          },
          onDismiss: resetUpdateItem,
          config: props.config
        })
      }), /*#__PURE__*/jsxRuntime.jsx(dialog.DialogContainer
      // ideally this would be a popover on desktop but using a DialogTrigger
      // wouldn't work since this doesn't open on click but after doing a
      // network request and it failing and manually wiring about a popover
      // and modal would be a pain
      , {
        onDismiss: resetDeleteItem,
        children: deleteResult.kind === 'needs-fork' && index.isGitHubConfig(props.config) && /*#__PURE__*/jsxRuntime.jsx(ForkRepoDialog, {
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
  const isBelowTablet = style.useMediaQuery(style.breakpointQueries.below.tablet);
  const stringFormatter = i18n.useLocalizedStringFormatter(index.l10nMessages);
  const [deleteAlertIsOpen, setDeleteAlertOpen] = React.useState(false);
  const [duplicateAlertIsOpen, setDuplicateAlertOpen] = React.useState(false);
  const menuActions = React.useMemo(() => {
    let items = [{
      key: 'reset',
      label: 'Reset changes',
      // TODO: l10n
      icon: historyIcon.historyIcon
    }, {
      key: 'delete',
      label: 'Delete entry…',
      // TODO: l10n
      icon: trash2Icon.trash2Icon
    }, {
      key: 'duplicate',
      label: 'Duplicate entry…',
      // TODO: l10n
      icon: copyPlusIcon.copyPlusIcon
    }];
    if (previewHref) {
      items.push({
        key: 'preview',
        label: 'Preview',
        icon: externalLinkIcon.externalLinkIcon,
        href: previewHref,
        target: '_blank',
        rel: 'noopener noreferrer'
      });
    }
    if (viewHref) {
      items.push({
        key: 'view',
        label: 'View on GitHub',
        icon: githubIcon.githubIcon,
        href: viewHref,
        target: '_blank',
        rel: 'noopener noreferrer'
      });
    }
    return items;
  }, [previewHref, viewHref]);
  const indicatorElement = (() => {
    if (isLoading) {
      return /*#__PURE__*/jsxRuntime.jsx(progress.ProgressCircle, {
        "aria-label": "Saving changes",
        isIndeterminate: true,
        size: "small",
        alignSelf: "center"
      });
    }
    if (hasChanged) {
      return isBelowTablet ? /*#__PURE__*/jsxRuntime.jsx(layout.Box, {
        backgroundColor: "pendingEmphasis",
        height: "scale.75",
        width: "scale.75",
        borderRadius: "full",
        children: /*#__PURE__*/jsxRuntime.jsx(typography.Text, {
          visuallyHidden: true,
          children: "Unsaved"
        })
      }) : /*#__PURE__*/jsxRuntime.jsx(badge.Badge, {
        tone: "pending",
        children: "Unsaved"
      });
    }
    return null;
  })();
  return /*#__PURE__*/jsxRuntime.jsxs(jsxRuntime.Fragment, {
    children: [indicatorElement, /*#__PURE__*/jsxRuntime.jsx(actionGroup.ActionGroup, {
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
      children: item => /*#__PURE__*/jsxRuntime.jsxs(breadcrumbs.Item, {
        textValue: item.label,
        href: item.href,
        target: item.target,
        rel: item.rel,
        children: [/*#__PURE__*/jsxRuntime.jsx(icon.Icon, {
          src: item.icon
        }), /*#__PURE__*/jsxRuntime.jsx(typography.Text, {
          children: item.label
        })]
      }, item.key)
    }), /*#__PURE__*/jsxRuntime.jsx(button.Button, {
      form: formID,
      isDisabled: isLoading,
      prominence: "high",
      type: "submit",
      children: stringFormatter.format('save')
    }), /*#__PURE__*/jsxRuntime.jsx(dialog.DialogContainer, {
      onDismiss: () => setDeleteAlertOpen(false),
      children: deleteAlertIsOpen && /*#__PURE__*/jsxRuntime.jsx(dialog.AlertDialog, {
        title: "Delete entry",
        tone: "critical",
        cancelLabel: "Cancel",
        primaryActionLabel: "Yes, delete",
        autoFocusButton: "cancel",
        onPrimaryAction: onDelete,
        children: "Are you sure? This action cannot be undone."
      })
    }), /*#__PURE__*/jsxRuntime.jsx(dialog.DialogContainer, {
      onDismiss: () => setDuplicateAlertOpen(false),
      children: duplicateAlertIsOpen && /*#__PURE__*/jsxRuntime.jsx(dialog.AlertDialog, {
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
  const stringFormatter = i18n.useLocalizedStringFormatter(index.l10nMessages);
  const repositoryId = index.useRepositoryId();
  const [branchName, setBranchName] = React.useState('');
  const [{
    error,
    fetching,
    data
  }, createBranch] = index.useCreateBranchMutation();
  const isLoading = fetching || !!(data !== null && data !== void 0 && (_data$createRef = data.createRef) !== null && _data$createRef !== void 0 && _data$createRef.__typename);
  const config = index.useConfig();
  const branchPrefix = index.getBranchPrefix(config);
  const propsForBranchPrefix = branchPrefix ? {
    UNSAFE_className: style.css({
      '& input': {
        paddingInlineStart: style.tokenSchema.size.space.xsmall
      }
    }),
    startElement: /*#__PURE__*/jsxRuntime.jsx(layout.Flex, {
      alignItems: "center",
      paddingStart: "regular",
      justifyContent: "center",
      pointerEvents: "none",
      children: /*#__PURE__*/jsxRuntime.jsx(typography.Text, {
        color: "neutralSecondary",
        children: branchPrefix
      })
    })
  } : {};
  return /*#__PURE__*/jsxRuntime.jsx(dialog.Dialog, {
    children: /*#__PURE__*/jsxRuntime.jsxs("form", {
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
      children: [/*#__PURE__*/jsxRuntime.jsx(typography.Heading, {
        children: stringFormatter.format('newBranch')
      }), /*#__PURE__*/jsxRuntime.jsx(slots.Content, {
        children: /*#__PURE__*/jsxRuntime.jsx(layout.Flex, {
          gap: "large",
          direction: "column",
          children: /*#__PURE__*/jsxRuntime.jsx(textField.TextField, {
            value: branchName,
            onChange: setBranchName,
            label: "Branch name",
            description: props.reason,
            autoFocus: true,
            errorMessage: index.prettyErrorForCreateBranchMutation(error),
            ...propsForBranchPrefix
          })
        })
      }), /*#__PURE__*/jsxRuntime.jsxs(button.ButtonGroup, {
        children: [isLoading && /*#__PURE__*/jsxRuntime.jsx(progress.ProgressCircle, {
          isIndeterminate: true,
          size: "small",
          "aria-label": "Creating Branch"
        }), /*#__PURE__*/jsxRuntime.jsx(button.Button, {
          isDisabled: isLoading,
          onPress: props.onDismiss,
          children: stringFormatter.format('cancel')
        }), /*#__PURE__*/jsxRuntime.jsx(button.Button, {
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
  const format = React.useMemo(() => index.getCollectionFormat(props.config, props.collection), [props.config, props.collection]);
  const slugInfo = React.useMemo(() => {
    return {
      slug: props.itemSlug,
      field: collectionConfig.slugField
    };
  }, [collectionConfig.slugField, props.itemSlug]);
  const draftData = index.useData(React.useCallback(async () => {
    const raw = await getDraft(['collection', props.collection, props.itemSlug]);
    if (!raw) throw new Error('No draft found');
    const stored = storedValSchema$1.parse(raw);
    const parsed = parseEntry({
      config: props.config,
      dirpath: index.getCollectionItemPath(props.config, props.collection, stored.slug),
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
    dirpath: index.getCollectionItemPath(props.config, props.collection, props.itemSlug),
    schema: collectionConfig.schema,
    format,
    slug: slugInfo
  });
  if (itemData.kind === 'error') {
    return /*#__PURE__*/jsxRuntime.jsx(ItemPageShell, {
      ...props,
      children: /*#__PURE__*/jsxRuntime.jsx(index.PageBody, {
        children: /*#__PURE__*/jsxRuntime.jsx(notice.Notice, {
          tone: "critical",
          children: itemData.error.message
        })
      })
    });
  }
  if (itemData.kind === 'loading' || draftData.kind === 'loading') {
    return /*#__PURE__*/jsxRuntime.jsx(ItemPageShell, {
      ...props,
      children: /*#__PURE__*/jsxRuntime.jsx(layout.Flex, {
        alignItems: "center",
        justifyContent: "center",
        minHeight: "scale.3000",
        children: /*#__PURE__*/jsxRuntime.jsx(progress.ProgressCircle, {
          "aria-label": "Loading Item",
          isIndeterminate: true,
          size: "large"
        })
      })
    });
  }
  if (itemData.data === 'not-found') {
    return /*#__PURE__*/jsxRuntime.jsx(ItemPageShell, {
      ...props,
      children: /*#__PURE__*/jsxRuntime.jsx(index.PageBody, {
        children: /*#__PURE__*/jsxRuntime.jsx(notice.Notice, {
          tone: "caution",
          children: "Entry not found."
        })
      })
    });
  }
  const loadedDraft = draftData.kind === 'loaded' ? draftData.data : undefined;
  return /*#__PURE__*/jsxRuntime.jsx(ItemPage, {
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
  const router = index.useRouter();
  const collectionConfig = props.config.collections[props.collection];
  return /*#__PURE__*/jsxRuntime.jsxs(index.PageRoot, {
    containerWidth: index.containerWidthForEntryLayout(collectionConfig),
    children: [/*#__PURE__*/jsxRuntime.jsxs(index.PageHeader, {
      children: [/*#__PURE__*/jsxRuntime.jsxs(breadcrumbs.Breadcrumbs, {
        flex: true,
        size: "medium",
        minWidth: 0,
        onAction: key => {
          if (key === 'collection') {
            router.push(`${props.basePath}/collection/${encodeURIComponent(props.collection)}`);
          }
        },
        children: [/*#__PURE__*/jsxRuntime.jsx(breadcrumbs.Item, {
          children: collectionConfig.label
        }, "collection"), /*#__PURE__*/jsxRuntime.jsx(breadcrumbs.Item, {
          children: props.itemSlug
        }, "item")]
      }), props.headerActions]
    }), props.children]
  });
};

function CreateItemWrapper(props) {
  var _props$config$collect;
  const router = index.useRouter();
  const duplicateSlug = React.useMemo(() => {
    const url = new URL(router.href, 'http://localhost');
    return url.searchParams.get('duplicate');
  }, [router.href]);
  const collectionConfig = (_props$config$collect = props.config.collections) === null || _props$config$collect === void 0 ? void 0 : _props$config$collect[props.collection];
  if (!collectionConfig) notFound();
  const format = React.useMemo(() => index.getCollectionFormat(props.config, props.collection), [props.config, props.collection]);
  const slug = React.useMemo(() => {
    if (duplicateSlug) {
      return {
        field: collectionConfig.slugField,
        slug: duplicateSlug
      };
    }
  }, [duplicateSlug, collectionConfig.slugField]);
  const itemData = useItemData({
    config: props.config,
    dirpath: index.getCollectionItemPath(props.config, props.collection, duplicateSlug !== null && duplicateSlug !== void 0 ? duplicateSlug : ''),
    schema: collectionConfig.schema,
    format,
    slug
  });
  const duplicateInitalState = duplicateSlug && itemData.kind === 'loaded' && itemData.data !== 'not-found' ? itemData.data.initialState : undefined;
  const duplicateInitalStateWithUpdatedSlug = React.useMemo(() => {
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
    return /*#__PURE__*/jsxRuntime.jsx(index.PageBody, {
      children: /*#__PURE__*/jsxRuntime.jsx(notice.Notice, {
        tone: "critical",
        children: itemData.error.message
      })
    });
  }
  if (duplicateSlug && itemData.kind === 'loading') {
    return /*#__PURE__*/jsxRuntime.jsx(layout.Flex, {
      alignItems: "center",
      justifyContent: "center",
      minHeight: "scale.3000",
      children: /*#__PURE__*/jsxRuntime.jsx(progress.ProgressCircle, {
        "aria-label": "Loading Item",
        isIndeterminate: true,
        size: "large"
      })
    });
  }
  if (duplicateSlug && itemData.kind === 'loaded' && itemData.data === 'not-found') {
    return /*#__PURE__*/jsxRuntime.jsx(index.PageBody, {
      children: /*#__PURE__*/jsxRuntime.jsx(notice.Notice, {
        tone: "caution",
        children: "Entry not found."
      })
    });
  }
  return /*#__PURE__*/jsxRuntime.jsx(CreateItem, {
    collection: props.collection,
    config: props.config,
    basePath: props.basePath,
    initialState: duplicateInitalStateWithUpdatedSlug
  });
}
function CreateItem(props) {
  var _props$config$collect2;
  const stringFormatter = i18n.useLocalizedStringFormatter(index.l10nMessages);
  const router = index.useRouter();
  const collectionConfig = (_props$config$collect2 = props.config.collections) === null || _props$config$collect2 === void 0 ? void 0 : _props$config$collect2[props.collection];
  if (!collectionConfig) notFound();
  const [forceValidation, setForceValidation] = React.useState(false);
  const schema = React.useMemo(() => index.object(collectionConfig.schema), [collectionConfig.schema]);
  const [state, setState] = React.useState(() => {
    var _props$initialState;
    return (_props$initialState = props.initialState) !== null && _props$initialState !== void 0 ? _props$initialState : index.getInitialPropsValue(schema);
  });
  const previewProps = React.useMemo(() => index.createGetPreviewProps(schema, setState, () => undefined), [schema])(state);
  const baseCommit = index.useBaseCommit();
  const slug = index.getSlugFromState(collectionConfig, state);
  const formatInfo = index.getCollectionFormat(props.config, props.collection);
  const [createResult, _createItem, resetCreateItemState] = useUpsertItem({
    state,
    basePath: index.getCollectionItemPath(props.config, props.collection, slug),
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
  const createItem = index.useEventCallback(_createItem);
  let collectionPath = `${props.basePath}/collection/${encodeURIComponent(props.collection)}`;
  const currentSlug = createResult.kind === 'updated' || createResult.kind === 'loading' ? slug : undefined;
  const slugInfo = useSlugFieldInfo(props.collection, currentSlug);
  const onCreate = async () => {
    if (!index.clientSideValidateProp(schema, state, slugInfo)) {
      setForceValidation(true);
      return;
    }
    if (await createItem()) {
      const slug = index.getSlugFromState(collectionConfig, state);
      router.push(`${collectionPath}/item/${encodeURIComponent(slug)}`);
      toast.toastQueue.positive('Entry created', {
        timeout: 5000
      }); // TODO: l10n
    }
  };

  // note we're still "loading" when it's already been created
  // since we're waiting to go to the item page
  const isLoading = createResult.kind === 'loading' || createResult.kind === 'updated';
  const formID = 'item-create-form';
  return /*#__PURE__*/jsxRuntime.jsxs(jsxRuntime.Fragment, {
    children: [/*#__PURE__*/jsxRuntime.jsxs(index.PageRoot, {
      containerWidth: index.containerWidthForEntryLayout(collectionConfig),
      children: [/*#__PURE__*/jsxRuntime.jsxs(index.PageHeader, {
        children: [/*#__PURE__*/jsxRuntime.jsxs(breadcrumbs.Breadcrumbs, {
          size: "medium",
          flex: true,
          minWidth: 0,
          onAction: key => {
            if (key === 'collection') {
              router.push(collectionPath);
            }
          },
          children: [/*#__PURE__*/jsxRuntime.jsx(breadcrumbs.Item, {
            children: collectionConfig.label
          }, "collection"), /*#__PURE__*/jsxRuntime.jsx(breadcrumbs.Item, {
            children: stringFormatter.format('add')
          }, "current")]
        }), isLoading && /*#__PURE__*/jsxRuntime.jsx(progress.ProgressCircle, {
          "aria-label": "Creating entry",
          isIndeterminate: true,
          size: "small"
        }), /*#__PURE__*/jsxRuntime.jsx(button.Button, {
          isDisabled: isLoading,
          prominence: "high",
          type: "submit",
          form: formID,
          marginStart: "auto",
          children: stringFormatter.format('create')
        })]
      }), /*#__PURE__*/jsxRuntime.jsxs(layout.Flex, {
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
        children: [createResult.kind === 'error' && /*#__PURE__*/jsxRuntime.jsx(notice.Notice, {
          tone: "critical",
          children: createResult.error.message
        }), /*#__PURE__*/jsxRuntime.jsx(index.FormForEntry, {
          previewProps: previewProps,
          forceValidation: forceValidation,
          entryLayout: collectionConfig.entryLayout,
          formatInfo: formatInfo,
          slugField: slugInfo
        })]
      })]
    }), /*#__PURE__*/jsxRuntime.jsx(dialog.DialogContainer
    // ideally this would be a popover on desktop but using a DialogTrigger
    // wouldn't work since this doesn't open on click but after doing a
    // network request and it failing and manually wiring about a popover
    // and modal would be a pain
    , {
      onDismiss: resetCreateItemState,
      children: createResult.kind === 'needs-new-branch' && /*#__PURE__*/jsxRuntime.jsx(CreateBranchDuringUpdateDialog, {
        branchOid: baseCommit,
        onCreate: async newBranch => {
          router.push(`/keystatic/branch/${encodeURIComponent(newBranch)}/collection/${encodeURIComponent(props.collection)}/create`);
          if (await createItem({
            branch: newBranch,
            sha: baseCommit
          })) {
            const slug = index.getSlugFromState(collectionConfig, state);
            router.push(`/keystatic/branch/${encodeURIComponent(newBranch)}/collection/${encodeURIComponent(props.collection)}/item/${encodeURIComponent(slug)}`);
          }
        },
        reason: createResult.reason,
        onDismiss: resetCreateItemState
      })
    }), /*#__PURE__*/jsxRuntime.jsx(dialog.DialogContainer
    // ideally this would be a popover on desktop but using a DialogTrigger
    // wouldn't work since this doesn't open on click but after doing a
    // network request and it failing and manually wiring about a popover
    // and modal would be a pain
    , {
      onDismiss: resetCreateItemState,
      children: createResult.kind === 'needs-fork' && index.isGitHubConfig(props.config) && /*#__PURE__*/jsxRuntime.jsx(ForkRepoDialog, {
        onCreate: async () => {
          if (await createItem()) {
            const slug = index.getSlugFromState(collectionConfig, state);
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
  return /*#__PURE__*/jsxRuntime.jsxs(layout.Flex, {
    elementType: "section",
    direction: "column",
    gap: "medium",
    children: [/*#__PURE__*/jsxRuntime.jsx(typography.Text, {
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
  return /*#__PURE__*/jsxRuntime.jsx("div", {
    className: style.css({
      display: 'grid',
      gap: style.tokenSchema.size.space.large,
      gridAutoRows: style.tokenSchema.size.element.xlarge,
      gridTemplateColumns: `[${FILL_COLS}-start] 1fr [${FILL_COLS}-end]`,
      [style.containerQueries.above.mobile]: {
        gridTemplateColumns: `[${FILL_COLS}-start] 1fr 1fr [${FILL_COLS}-end]`
      },
      [style.containerQueries.above.tablet]: {
        gridTemplateColumns: `[${FILL_COLS}-start] 1fr 1fr 1fr [${FILL_COLS}-end]`
      }
    }),
    ...props
  });
};
const DashboardCard = props => {
  const ref = React.useRef(null);
  const {
    linkProps
  } = link.useLink(props, ref);
  return /*#__PURE__*/jsxRuntime.jsxs(layout.Flex, {
    alignItems: "center",
    backgroundColor: "canvas",
    padding: "large",
    position: "relative",
    children: [/*#__PURE__*/jsxRuntime.jsxs(layout.Flex, {
      direction: "column",
      gap: "medium",
      flex: true,
      children: [/*#__PURE__*/jsxRuntime.jsx(typography.Heading, {
        elementType: "h3",
        size: "small",
        truncate: true,
        children: /*#__PURE__*/jsxRuntime.jsx("a", {
          ref: ref,
          href: props.href,
          ...linkProps,
          className: style.classNames(style.css({
            color: style.tokenSchema.color.foreground.neutral,
            outline: 'none',
            '&:hover': {
              color: style.tokenSchema.color.foreground.neutralEmphasis,
              '::before': {
                backgroundColor: style.tokenSchema.color.alias.backgroundIdle,
                borderColor: style.tokenSchema.color.border.neutral
              }
            },
            '&:active': {
              '::before': {
                backgroundColor: style.tokenSchema.color.alias.backgroundHovered,
                borderColor: style.tokenSchema.color.alias.borderHovered
              }
            },
            '&:focus-visible::before': {
              outline: `${style.tokenSchema.size.alias.focusRing} solid ${style.tokenSchema.color.alias.focusRing}`,
              outlineOffset: style.tokenSchema.size.alias.focusRingGap
            },
            // fill the available space so that the card is clickable
            '::before': {
              border: `${style.tokenSchema.size.border.regular} solid ${style.tokenSchema.color.border.muted}`,
              borderRadius: style.tokenSchema.size.radius.medium,
              content: '""',
              position: 'absolute',
              inset: 0,
              transition: style.transition(['background-color', 'border-color'])
            }
          })),
          children: props.label
        })
      }), props.children]
    }), props.endElement]
  });
};

function useLocalizedString() {
  let stringFormatter = i18n.useLocalizedStringFormatter(index.l10nMessages);
  return stringFormatter;
}

function BranchSection(props) {
  let branchInfo = index.useBranchInfo();
  let router = index.useRouter();
  let localizedString = useLocalizedString();
  if (index.isLocalConfig(props.config)) {
    return null;
  }
  let repoURL = index.getRepoUrl(branchInfo);
  let isDefaultBranch = branchInfo.currentBranch === branchInfo.defaultBranch;
  return /*#__PURE__*/jsxRuntime.jsxs(DashboardSection, {
    title: localizedString.format('currentBranch'),
    children: [/*#__PURE__*/jsxRuntime.jsxs(layout.Flex, {
      alignItems: "center",
      gap: "regular",
      border: "muted",
      borderRadius: "medium",
      backgroundColor: "canvas",
      padding: "large",
      children: [/*#__PURE__*/jsxRuntime.jsx(icon.Icon, {
        src: gitBranchIcon.gitBranchIcon,
        color: "neutralTertiary"
      }), /*#__PURE__*/jsxRuntime.jsx(typography.Text, {
        size: "medium",
        weight: "semibold",
        children: branchInfo.currentBranch
      })]
    }), /*#__PURE__*/jsxRuntime.jsxs(layout.Flex, {
      gap: "regular",
      wrap: true,
      children: [/*#__PURE__*/jsxRuntime.jsxs(dialog.DialogTrigger, {
        children: [/*#__PURE__*/jsxRuntime.jsxs(button.ActionButton, {
          children: [/*#__PURE__*/jsxRuntime.jsx(icon.Icon, {
            src: gitBranchPlusIcon.gitBranchPlusIcon
          }), /*#__PURE__*/jsxRuntime.jsx(typography.Text, {
            children: localizedString.format('newBranch')
          })]
        }), close => /*#__PURE__*/jsxRuntime.jsx(index.CreateBranchDialog, {
          onDismiss: close,
          onCreate: branchName => {
            close();
            router.push(router.href.replace(/\/branch\/[^/]+/, '/branch/' + encodeURIComponent(branchName)));
          }
        })]
      }), !isDefaultBranch && (branchInfo.pullRequestNumber === undefined ? /*#__PURE__*/jsxRuntime.jsxs(button.ActionButton, {
        href: `${repoURL}/pull/new/${branchInfo.currentBranch}`,
        target: "_blank",
        children: [/*#__PURE__*/jsxRuntime.jsx(icon.Icon, {
          src: gitPullRequestIcon.gitPullRequestIcon
        }), /*#__PURE__*/jsxRuntime.jsx(typography.Text, {
          children: localizedString.format('createPullRequest')
        })]
      }) : /*#__PURE__*/jsxRuntime.jsxs(button.ActionButton, {
        href: `${repoURL}/pull/${branchInfo.pullRequestNumber}`,
        target: "_blank",
        children: [/*#__PURE__*/jsxRuntime.jsx(icon.Icon, {
          src: gitPullRequestIcon.gitPullRequestIcon
        }), /*#__PURE__*/jsxRuntime.jsxs(typography.Text, {
          children: ["Pull request #", branchInfo.pullRequestNumber]
        })]
      }))]
    })]
  });
}

function DashboardCards() {
  const navItems = index.useNavItems();
  const hasSections = navItems.some(item => 'children' in item);
  const items = navItems.map(item => renderItemOrGroup(item));
  return hasSections ? /*#__PURE__*/jsxRuntime.jsx(jsxRuntime.Fragment, {
    children: items
  }) : /*#__PURE__*/jsxRuntime.jsx(DashboardSection, {
    title: "Content",
    children: /*#__PURE__*/jsxRuntime.jsx(DashboardGrid, {
      children: items
    })
  });
}
let dividerCount = 0;
function renderItemOrGroup(itemOrGroup) {
  if ('isDivider' in itemOrGroup) {
    return /*#__PURE__*/jsxRuntime.jsx(layout.Flex, {
      gridColumn: FILL_COLS,
      children: /*#__PURE__*/jsxRuntime.jsx(layout.Divider, {
        alignSelf: "center",
        size: "medium",
        width: "alias.singleLineWidth"
      })
    }, dividerCount++);
  }
  if ('children' in itemOrGroup) {
    return /*#__PURE__*/jsxRuntime.jsx(DashboardSection, {
      title: itemOrGroup.title,
      children: /*#__PURE__*/jsxRuntime.jsx(DashboardGrid, {
        children: itemOrGroup.children.map(child => renderItemOrGroup(child))
      })
    }, itemOrGroup.title);
  }
  let changeElement = (() => {
    if (!itemOrGroup.changed) {
      return undefined;
    }
    return typeof itemOrGroup.changed === 'number' ? /*#__PURE__*/jsxRuntime.jsx(badge.Badge, {
      tone: "accent",
      marginStart: "auto",
      children: index.pluralize(itemOrGroup.changed, {
        singular: 'change',
        plural: 'changes'
      })
    }) : /*#__PURE__*/jsxRuntime.jsx(badge.Badge, {
      tone: "accent",
      children: "Changed"
    });
  })();
  let endElement = (() => {
    // entry counts are only available for collections
    if (typeof itemOrGroup.entryCount !== 'number') {
      return changeElement;
    }
    return /*#__PURE__*/jsxRuntime.jsxs(layout.Flex, {
      gap: "medium",
      alignItems: "center",
      children: [changeElement, /*#__PURE__*/jsxRuntime.jsx(button.ActionButton, {
        "aria-label": "Add",
        href: `${itemOrGroup.href}/create`,
        children: /*#__PURE__*/jsxRuntime.jsx(icon.Icon, {
          src: plusIcon.plusIcon
        })
      })]
    });
  })();
  return /*#__PURE__*/jsxRuntime.jsx(DashboardCard, {
    label: itemOrGroup.label,
    href: itemOrGroup.href,
    endElement: endElement,
    children: typeof itemOrGroup.entryCount === 'number' ? /*#__PURE__*/jsxRuntime.jsx(typography.Text, {
      color: "neutralSecondary",
      children: index.pluralize(itemOrGroup.entryCount, {
        singular: 'entry',
        plural: 'entries'
      })
    }) : null
  }, itemOrGroup.key);
}

function DashboardPage(props) {
  var _viewer$name;
  const stringFormatter = i18n.useLocalizedStringFormatter(index.l10nMessages);
  const viewer = index.useViewer();
  const cloudInfo = index.useCloudInfo();
  const user = viewer ? {
    name: (_viewer$name = viewer.name) !== null && _viewer$name !== void 0 ? _viewer$name : viewer.login,
    avatarUrl: viewer.avatarUrl
  } : cloudInfo === null || cloudInfo === void 0 ? void 0 : cloudInfo.user;
  return /*#__PURE__*/jsxRuntime.jsxs(index.PageRoot, {
    containerWidth: "large",
    children: [/*#__PURE__*/jsxRuntime.jsx(index.PageHeader, {
      children: /*#__PURE__*/jsxRuntime.jsx(typography.Heading, {
        elementType: "h1",
        id: "page-title",
        size: "small",
        children: stringFormatter.format('dashboard')
      })
    }), /*#__PURE__*/jsxRuntime.jsx(index.PageBody, {
      isScrollable: true,
      children: /*#__PURE__*/jsxRuntime.jsxs(layout.Flex, {
        direction: "column",
        gap: "xxlarge",
        children: [user && /*#__PURE__*/jsxRuntime.jsx(UserInfo, {
          user: user,
          manageAccount: !!cloudInfo
        }), /*#__PURE__*/jsxRuntime.jsx(BranchSection, {
          config: props.config
        }), /*#__PURE__*/jsxRuntime.jsx(DashboardCards, {})]
      })
    })]
  });
}
function UserInfo({
  user,
  manageAccount
}) {
  return /*#__PURE__*/jsxRuntime.jsxs(layout.Flex, {
    alignItems: "center",
    gap: "medium",
    isHidden: {
      below: 'tablet'
    },
    children: [/*#__PURE__*/jsxRuntime.jsx(avatar.Avatar, {
      src: user.avatarUrl,
      name: user.name,
      size: "large"
    }), /*#__PURE__*/jsxRuntime.jsxs(layout.VStack, {
      gap: "medium",
      children: [/*#__PURE__*/jsxRuntime.jsxs(typography.Heading, {
        size: "medium",
        elementType: "p",
        UNSAFE_style: {
          fontWeight: style.tokenSchema.typography.fontWeight.bold
        },
        children: ["Hello, ", user.name, "!"]
      }), manageAccount && /*#__PURE__*/jsxRuntime.jsx(link.TextLink, {
        href: "https://keystatic.cloud/account",
        children: "Manage Account"
      })]
    })]
  });
}

const MainPanelLayout = props => {
  let isBelowDesktop = style.useMediaQuery(style.breakpointQueries.below.desktop);
  let sidebarState = index.useSidebar();
  let ref = React.useRef(null);
  let context = index.useContentPanelState(ref);
  return /*#__PURE__*/jsxRuntime.jsx(index.ContentPanelProvider, {
    value: context,
    children: /*#__PURE__*/jsxRuntime.jsxs(splitView.SplitView, {
      autoSaveId: "keystatic-app-split-view",
      isCollapsed: isBelowDesktop || !sidebarState.isOpen,
      onCollapseChange: sidebarState.toggle,
      defaultSize: 260,
      minSize: 180,
      maxSize: 400
      // styles
      ,
      height: "100vh",
      children: [isBelowDesktop ? /*#__PURE__*/jsxRuntime.jsx(index.SidebarDialog, {}) : /*#__PURE__*/jsxRuntime.jsx(splitView.SplitPanePrimary, {
        children: /*#__PURE__*/jsxRuntime.jsx(index.SidebarPanel, {})
      }), /*#__PURE__*/jsxRuntime.jsx(splitView.SplitPaneSecondary, {
        ref: ref,
        children: props.children
      })]
    })
  });
};

const AppShell = props => {
  const content = /*#__PURE__*/jsxRuntime.jsx(index.AppShellErrorContext.Consumer, {
    children: error => error && !(error !== null && error !== void 0 && error.graphQLErrors.some(err => {
      var _err$originalError;
      return (err === null || err === void 0 || (_err$originalError = err.originalError) === null || _err$originalError === void 0 ? void 0 : _err$originalError.type) === 'NOT_FOUND';
    })) ? /*#__PURE__*/jsxRuntime.jsx(EmptyState, {
      icon: alertCircleIcon.alertCircleIcon,
      title: "Failed to load shell",
      message: error.message
    }) : props.children
  });
  const inner = /*#__PURE__*/jsxRuntime.jsx(index.ConfigContext.Provider, {
    value: props.config,
    children: /*#__PURE__*/jsxRuntime.jsx(index.AppStateContext.Provider, {
      value: {
        basePath: props.basePath
      },
      children: /*#__PURE__*/jsxRuntime.jsx(index.SidebarProvider, {
        children: /*#__PURE__*/jsxRuntime.jsx(MainPanelLayout, {
          children: content
        })
      })
    })
  });
  if (index.isGitHubConfig(props.config) || props.config.storage.kind === 'cloud') {
    return /*#__PURE__*/jsxRuntime.jsx(index.GitHubAppShellProvider, {
      currentBranch: props.currentBranch,
      config: props.config,
      children: inner
    });
  }
  if (index.isLocalConfig(props.config)) {
    return /*#__PURE__*/jsxRuntime.jsx(index.LocalAppShellProvider, {
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
  const [forceValidation, setForceValidation] = React.useState(false);
  const singletonConfig = config.singletons[singleton];
  const schema = React.useMemo(() => index.object(singletonConfig.schema), [singletonConfig.schema]);
  const singletonPath = index.getSingletonPath(config, singleton);
  const router = index.useRouter();
  const [{
    state,
    localTreeKey: localTreeKeyInState
  }, setState] = React.useState(() => {
    var _draft$state;
    return {
      localTreeKey: localTreeKey,
      state: (_draft$state = draft === null || draft === void 0 ? void 0 : draft.state) !== null && _draft$state !== void 0 ? _draft$state : initialState === null ? index.getInitialPropsValue(schema) : initialState
    };
  });
  React.useEffect(() => {
    if (draft && state === draft.state) {
      showDraftRestoredToast(draft.savedAt, localTreeKey !== draft.treeKey);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);
  if (localTreeKeyInState !== localTreeKey) {
    setState({
      localTreeKey: localTreeKey,
      state: initialState === null ? index.getInitialPropsValue(schema) : initialState
    });
  }
  const isCreating = initialState === null;
  const hasChanged = useHasChanged({
    initialState,
    state,
    schema,
    slugField: undefined
  }) || isCreating;
  React.useEffect(() => {
    const key = ['singleton', singleton];
    if (hasChanged) {
      const serialized = serializeEntryToFiles({
        basePath: singletonPath,
        config,
        format: index.getSingletonFormat(config, singleton),
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
  const previewProps = React.useMemo(() => index.createGetPreviewProps(schema, stateUpdater => {
    setState(state => ({
      localTreeKey: state.localTreeKey,
      state: stateUpdater(state.state)
    }));
  }, () => undefined), [schema])(state);
  const baseCommit = index.useBaseCommit();
  const formatInfo = index.getSingletonFormat(config, singleton);
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
  const update = index.useEventCallback(_update);
  const onCreate = async () => {
    if (!index.clientSideValidateProp(schema, state, undefined)) {
      setForceValidation(true);
      return;
    }
    await update();
  };
  const formID = 'singleton-form';
  const onReset = () => setState({
    localTreeKey: localTreeKey,
    state: initialState === null ? index.getInitialPropsValue(schema) : initialState
  });
  const isBelowTablet = style.useMediaQuery(style.breakpointQueries.below.tablet);
  const branchInfo = index.useBranchInfo();
  const previewHref = React.useMemo(() => {
    if (!singletonConfig.previewUrl) return undefined;
    return singletonConfig.previewUrl.replace('{branch}', branchInfo.currentBranch);
  }, [branchInfo.currentBranch, singletonConfig.previewUrl]);
  const isGitHub = index.isGitHubConfig(config) || index.isCloudConfig(config);
  const singletonExists = !!initialState;
  const viewHref = isGitHub && singletonExists ? `${index.getRepoUrl(branchInfo)}${formatInfo.dataLocation === 'index' ? `/tree/${branchInfo.currentBranch}/${index.getPathPrefix(config.storage)}${singletonPath}` : `/blob/${index.getPathPrefix(config.storage)}${branchInfo.currentBranch}/${singletonPath}${index.getDataFileExtension(formatInfo)}`}` : undefined;
  const menuActions = React.useMemo(() => {
    const actions = [{
      key: 'reset',
      label: 'Reset',
      icon: historyIcon.historyIcon
    }];
    if (previewHref) {
      actions.push({
        key: 'preview',
        label: 'Preview',
        icon: externalLinkIcon.externalLinkIcon,
        href: previewHref,
        target: '_blank',
        rel: 'noopener noreferrer'
      });
    }
    if (viewHref) {
      actions.push({
        key: 'view',
        label: 'View on GitHub',
        icon: githubIcon.githubIcon,
        href: viewHref,
        target: '_blank',
        rel: 'noopener noreferrer'
      });
    }
    return actions;
  }, [previewHref, viewHref]);
  return /*#__PURE__*/jsxRuntime.jsxs(index.PageRoot, {
    containerWidth: index.containerWidthForEntryLayout(singletonConfig),
    children: [/*#__PURE__*/jsxRuntime.jsxs(index.PageHeader, {
      children: [/*#__PURE__*/jsxRuntime.jsxs(layout.Flex, {
        flex: true,
        alignItems: "center",
        gap: "regular",
        children: [/*#__PURE__*/jsxRuntime.jsx(typography.Heading, {
          elementType: "h1",
          id: "page-title",
          size: "small",
          children: singletonConfig.label
        }), updateResult.kind === 'loading' ? /*#__PURE__*/jsxRuntime.jsx(progress.ProgressCircle, {
          "aria-label": `Updating ${singletonConfig.label}`,
          isIndeterminate: true,
          size: "small",
          alignSelf: "center"
        }) : hasChanged && /*#__PURE__*/jsxRuntime.jsx(badge.Badge, {
          tone: "pending",
          children: "Unsaved"
        })]
      }), /*#__PURE__*/jsxRuntime.jsx(actionGroup.ActionGroup, {
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
        children: item => /*#__PURE__*/jsxRuntime.jsxs(actionGroup.Item, {
          textValue: item.label,
          href: item.href,
          target: item.target,
          rel: item.rel,
          children: [/*#__PURE__*/jsxRuntime.jsx(icon.Icon, {
            src: item.icon
          }), /*#__PURE__*/jsxRuntime.jsx(typography.Text, {
            children: item.label
          })]
        }, item.key)
      }), /*#__PURE__*/jsxRuntime.jsx(button.Button, {
        form: formID,
        isDisabled: updateResult.kind === 'loading',
        prominence: "high",
        type: "submit",
        children: isCreating ? 'Create' : 'Save'
      })]
    }), /*#__PURE__*/jsxRuntime.jsxs(layout.Flex, {
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
      children: [updateResult.kind === 'error' && /*#__PURE__*/jsxRuntime.jsx(notice.Notice, {
        tone: "critical",
        children: updateResult.error.message
      }), /*#__PURE__*/jsxRuntime.jsx(index.FormForEntry, {
        previewProps: previewProps,
        forceValidation: forceValidation,
        entryLayout: singletonConfig.entryLayout,
        formatInfo: formatInfo,
        slugField: undefined
      }), /*#__PURE__*/jsxRuntime.jsx(dialog.DialogContainer
      // ideally this would be a popover on desktop but using a DialogTrigger wouldn't work since
      // this doesn't open on click but after doing a network request and it failing and manually wiring about a popover and modal would be a pain
      , {
        onDismiss: resetUpdateItem,
        children: updateResult.kind === 'needs-new-branch' && /*#__PURE__*/jsxRuntime.jsx(CreateBranchDuringUpdateDialog, {
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
      }), /*#__PURE__*/jsxRuntime.jsx(dialog.DialogContainer
      // ideally this would be a popover on desktop but using a DialogTrigger
      // wouldn't work since this doesn't open on click but after doing a
      // network request and it failing and manually wiring about a popover
      // and modal would be a pain
      , {
        onDismiss: resetUpdateItem,
        children: updateResult.kind === 'needs-fork' && index.isGitHubConfig(config) && /*#__PURE__*/jsxRuntime.jsx(ForkRepoDialog, {
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
const storedValSchema = z.z.object({
  version: z.z.literal(1),
  savedAt: z.z.date(),
  beforeTreeKey: z.z.string().optional(),
  files: z.z.map(z.z.string(), z.z.instanceof(Uint8Array))
});
function SingletonPageWrapper(props) {
  var _props$config$singlet;
  const singletonConfig = (_props$config$singlet = props.config.singletons) === null || _props$config$singlet === void 0 ? void 0 : _props$config$singlet[props.singleton];
  if (!singletonConfig) notFound();
  const header = /*#__PURE__*/jsxRuntime.jsx(index.PageHeader, {
    children: /*#__PURE__*/jsxRuntime.jsx(typography.Heading, {
      elementType: "h1",
      id: "page-title",
      size: "small",
      children: singletonConfig.label
    })
  });
  const format = React.useMemo(() => index.getSingletonFormat(props.config, props.singleton), [props.config, props.singleton]);
  const dirpath = index.getSingletonPath(props.config, props.singleton);
  const draftData = index.useData(React.useCallback(async () => {
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
    return /*#__PURE__*/jsxRuntime.jsxs(index.PageRoot, {
      children: [header, /*#__PURE__*/jsxRuntime.jsx(index.PageBody, {
        children: /*#__PURE__*/jsxRuntime.jsx(notice.Notice, {
          margin: "xxlarge",
          tone: "critical",
          children: itemData.error.message
        })
      })]
    });
  }
  if (itemData.kind === 'loading' || draftData.kind === 'loading') {
    return /*#__PURE__*/jsxRuntime.jsxs(index.PageRoot, {
      children: [header, /*#__PURE__*/jsxRuntime.jsx(index.PageBody, {
        children: /*#__PURE__*/jsxRuntime.jsx(layout.Flex, {
          alignItems: "center",
          justifyContent: "center",
          minHeight: "scale.3000",
          children: /*#__PURE__*/jsxRuntime.jsx(progress.ProgressCircle, {
            "aria-label": `Loading ${singletonConfig.label}`,
            isIndeterminate: true,
            size: "large"
          })
        })
      })]
    });
  }
  return /*#__PURE__*/jsxRuntime.jsx(SingletonPage, {
    singleton: props.singleton,
    config: props.config,
    initialState: itemData.data === 'not-found' ? null : itemData.data.initialState,
    initialFiles: itemData.data === 'not-found' ? [] : itemData.data.initialFiles,
    localTreeKey: itemData.data === 'not-found' ? undefined : itemData.data.localTreeKey,
    draft: draftData.kind === 'loaded' ? draftData.data : undefined
  });
}

function CreatedGitHubApp(props) {
  return /*#__PURE__*/jsxRuntime.jsx(layout.Flex, {
    alignItems: "center",
    justifyContent: "center",
    margin: "xxlarge",
    children: /*#__PURE__*/jsxRuntime.jsxs(layout.Flex, {
      backgroundColor: "surface",
      padding: "large",
      border: "color.alias.borderIdle",
      borderRadius: "medium",
      direction: "column",
      justifyContent: "center",
      gap: "xlarge",
      maxWidth: "scale.4600",
      children: [/*#__PURE__*/jsxRuntime.jsx(typography.Heading, {
        children: "You've installed Keystatic! \uD83C\uDF89"
      }), /*#__PURE__*/jsxRuntime.jsx(typography.Text, {
        children: "To start using Keystatic, you need to install the GitHub app you've created."
      }), /*#__PURE__*/jsxRuntime.jsxs(typography.Text, {
        children: ["Make sure to add the App to the", ' ', /*#__PURE__*/jsxRuntime.jsx("code", {
          children: index.serializeRepoConfig(props.config.storage.repo)
        }), ' ', "repository."]
      }), /*#__PURE__*/jsxRuntime.jsx(InstallGitHubApp, {
        config: props.config
      })]
    })
  });
}

function KeystaticSetup(props) {
  const [deployedURL, setDeployedURL] = React.useState('');
  const [organization, setOrganization] = React.useState('');
  return /*#__PURE__*/jsxRuntime.jsx(layout.Flex, {
    alignItems: "center",
    justifyContent: "center",
    margin: "xxlarge",
    children: /*#__PURE__*/jsxRuntime.jsxs(layout.Flex, {
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
      children: [/*#__PURE__*/jsxRuntime.jsx(layout.Flex, {
        justifyContent: "center",
        children: /*#__PURE__*/jsxRuntime.jsx(typography.Heading, {
          children: "Keystatic Setup"
        })
      }), /*#__PURE__*/jsxRuntime.jsx(typography.Text, {
        children: "Keystatic doesn't have the required config."
      }), /*#__PURE__*/jsxRuntime.jsx(typography.Text, {
        children: "If you've already created your GitHub app, make sure to add the following environment variables:"
      }), /*#__PURE__*/jsxRuntime.jsxs(layout.Box, {
        elementType: "ul",
        children: [/*#__PURE__*/jsxRuntime.jsx("li", {
          children: /*#__PURE__*/jsxRuntime.jsx("code", {
            children: "KEYSTATIC_GITHUB_CLIENT_ID"
          })
        }), /*#__PURE__*/jsxRuntime.jsx("li", {
          children: /*#__PURE__*/jsxRuntime.jsx("code", {
            children: "KEYSTATIC_GITHUB_CLIENT_SECRET"
          })
        }), /*#__PURE__*/jsxRuntime.jsx("li", {
          children: /*#__PURE__*/jsxRuntime.jsx("code", {
            children: "KEYSTATIC_SECRET"
          })
        })]
      }), /*#__PURE__*/jsxRuntime.jsx(typography.Text, {
        children: "If you haven't created your GitHub app for Keystatic, you can create one below."
      }), /*#__PURE__*/jsxRuntime.jsx(textField.TextField, {
        label: "Deployed App URL",
        description: "This should the root of your domain. If you're not sure where Keystatic will be deployed, leave this blank and you can update the GitHub app later.",
        value: deployedURL,
        onChange: setDeployedURL
      }), /*#__PURE__*/jsxRuntime.jsx(textField.TextField, {
        label: "GitHub organization (if any)",
        description: "You must be an owner or GitHub App manager in the organization to create the GitHub App. Leave this blank to create the app in your personal account.",
        value: organization,
        onChange: setOrganization
      }), /*#__PURE__*/jsxRuntime.jsxs(typography.Text, {
        children: ["After visiting GitHub to create the GitHub app, you'll be redirected back here and secrets generated from GitHub will be written to your", ' ', /*#__PURE__*/jsxRuntime.jsx("code", {
          children: ".env"
        }), " file."]
      }), /*#__PURE__*/jsxRuntime.jsx("input", {
        type: "text",
        name: "manifest",
        className: style.css({
          display: 'none'
        }),
        value: JSON.stringify({
          name: `${index.parseRepoConfig(props.config.storage.repo).owner} Keystatic`,
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
      }), /*#__PURE__*/jsxRuntime.jsx(button.Button, {
        prominence: "high",
        type: "submit",
        children: "Create GitHub App"
      })]
    })
  });
}

function RepoNotFound(props) {
  const repo = index.serializeRepoConfig(props.config.storage.repo);
  return /*#__PURE__*/jsxRuntime.jsx(layout.Flex, {
    alignItems: "center",
    justifyContent: "center",
    margin: "xxlarge",
    children: /*#__PURE__*/jsxRuntime.jsxs(layout.Flex, {
      backgroundColor: "surface",
      padding: "large",
      border: "color.alias.borderIdle",
      borderRadius: "medium",
      direction: "column",
      justifyContent: "center",
      gap: "xlarge",
      maxWidth: "scale.4600",
      children: [/*#__PURE__*/jsxRuntime.jsx(layout.Flex, {
        justifyContent: "center",
        children: /*#__PURE__*/jsxRuntime.jsx(typography.Heading, {
          children: "Repo not found"
        })
      }), /*#__PURE__*/jsxRuntime.jsxs(typography.Text, {
        children: ["Keystatic is configured for the", ' ', /*#__PURE__*/jsxRuntime.jsx("a", {
          href: `https://github.com/${repo}`,
          children: repo
        }), " GitHub repo but Keystatic isn't able to access this repo. This is either because you don't have access to this repo or you haven't added the GitHub app to it."]
      }), /*#__PURE__*/jsxRuntime.jsx(InstallGitHubApp, {
        config: props.config
      })]
    })
  });
}

const storedStateSchema = z.z.object({
  state: z.z.string(),
  from: z.z.string(),
  code_verifier: z.z.string()
});
const tokenResponseSchema = z.z.object({
  access_token: z.z.string(),
  token_type: z.z.string(),
  expires_in: z.z.number()
});
function KeystaticCloudAuthCallback({
  config
}) {
  var _config$cloud2;
  const router = index.useRouter();
  const url = new URL(window.location.href);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const storedState = React.useMemo(() => {
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
  const [error, setError] = React.useState(null);
  React.useEffect(() => {
    var _config$cloud;
    if (code && state && storedState.success && (_config$cloud = config.cloud) !== null && _config$cloud !== void 0 && _config$cloud.project) {
      const {
        project
      } = config.cloud;
      (async () => {
        const res = await fetch(`${index.KEYSTATIC_CLOUD_API_URL}/oauth/token`, {
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
            ...index.KEYSTATIC_CLOUD_HEADERS
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
    return /*#__PURE__*/jsxRuntime.jsx(typography.Text, {
      children: "Missing Keystatic Cloud config"
    });
  }
  if (!code || !state) {
    return /*#__PURE__*/jsxRuntime.jsx(typography.Text, {
      children: "Missing code or state"
    });
  }
  if (storedState.success === false || state !== storedState.data.state) {
    return /*#__PURE__*/jsxRuntime.jsx(typography.Text, {
      children: "Invalid state"
    });
  }
  if (error) {
    return /*#__PURE__*/jsxRuntime.jsx(typography.Text, {
      children: error.message
    });
  }
  return /*#__PURE__*/jsxRuntime.jsx(layout.Flex, {
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    children: /*#__PURE__*/jsxRuntime.jsx(progress.ProgressCircle, {
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
  } = index.useRouter();
  const {
    data,
    error
  } = React.useContext(index.GitHubAppShellDataContext);
  React.useEffect(() => {
    var _error$response, _data$repository, _data$repository2, _error$graphQLErrors, _error$graphQLErrors2;
    if ((error === null || error === void 0 || (_error$response = error.response) === null || _error$response === void 0 ? void 0 : _error$response.status) === 401) {
      if (props.config.storage.kind === 'github') {
        window.location.href = '/api/keystatic/github/login';
      } else {
        index.redirectToCloudAuth('', props.config);
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
  } = index.useRouter();
  let branch = null,
    parsedParams,
    basePath;
  if (params.join('/') === 'cloud/oauth/callback') {
    return /*#__PURE__*/jsxRuntime.jsx(KeystaticCloudAuthCallback, {
      config: config
    });
  }
  let wrapper = x => x;
  if (index.isCloudConfig(config) || index.isLocalConfig(config) && (_config$cloud = config.cloud) !== null && _config$cloud !== void 0 && _config$cloud.project) {
    wrapper = element => /*#__PURE__*/jsxRuntime.jsx(index.CloudInfoProvider, {
      config: config,
      children: element
    });
  }
  if (index.isGitHubConfig(config) || index.isCloudConfig(config)) {
    const origWrapper = wrapper;
    wrapper = element => /*#__PURE__*/jsxRuntime.jsx(AuthWrapper, {
      config: config,
      children: /*#__PURE__*/jsxRuntime.jsx(index.GitHubAppShellDataProvider, {
        config: config,
        children: origWrapper(element)
      })
    });
    if (params.length === 0) {
      return wrapper( /*#__PURE__*/jsxRuntime.jsx(RedirectToBranch, {
        config: config
      }));
    }
    if (params.length === 1 && index.isGitHubConfig(config)) {
      if (params[0] === 'setup') return /*#__PURE__*/jsxRuntime.jsx(KeystaticSetup, {
        config: config
      });
      if (params[0] === 'repo-not-found') {
        return /*#__PURE__*/jsxRuntime.jsx(RepoNotFound, {
          config: config
        });
      }
      if (params[0] === 'created-github-app') {
        return /*#__PURE__*/jsxRuntime.jsx(CreatedGitHubApp, {
          config: config
        });
      }
    }
    if (params[0] !== 'branch' || params.length < 2) {
      return /*#__PURE__*/jsxRuntime.jsx(typography.Text, {
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
  return wrapper( /*#__PURE__*/jsxRuntime.jsx(AppShell, {
    config: config,
    currentBranch: branch || '',
    basePath: basePath,
    children: /*#__PURE__*/jsxRuntime.jsx(NotFoundBoundary, {
      fallback: /*#__PURE__*/jsxRuntime.jsx(index.PageRoot, {
        children: /*#__PURE__*/jsxRuntime.jsx(index.PageBody, {
          children: /*#__PURE__*/jsxRuntime.jsx(EmptyState, {
            icon: fileX2Icon.fileX2Icon,
            title: "Not found",
            message: "This page could not be found."
          })
        })
      }),
      children: parsedParams === null ? /*#__PURE__*/jsxRuntime.jsx(AlwaysNotFound, {}) : parsedParams.collection ? parsedParams.kind === 'create' ? /*#__PURE__*/jsxRuntime.jsx(CreateItemWrapper, {
        collection: parsedParams.collection,
        config: config,
        basePath: basePath
      }, parsedParams.collection) : parsedParams.kind === 'edit' ? /*#__PURE__*/jsxRuntime.jsx(ItemPageWrapper, {
        collection: parsedParams.collection,
        basePath: basePath,
        config: config,
        itemSlug: parsedParams.slug
      }, parsedParams.collection) : /*#__PURE__*/jsxRuntime.jsx(CollectionPage, {
        basePath: basePath,
        collection: parsedParams.collection,
        config: config
      }, parsedParams.collection) : parsedParams.singleton ? /*#__PURE__*/jsxRuntime.jsx(SingletonPageWrapper, {
        config: config,
        singleton: parsedParams.singleton
      }, parsedParams.singleton) : /*#__PURE__*/jsxRuntime.jsx(DashboardPage, {
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
  const [state, setState] = React.useState('unknown');
  const router = index.useRouter();
  React.useEffect(() => {
    index.getAuth(props.config).then(auth => {
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
      return /*#__PURE__*/jsxRuntime.jsx(layout.Flex, {
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        children: /*#__PURE__*/jsxRuntime.jsxs(button.Button, {
          href: `/api/keystatic/github/login${router.params.length ? `?${new URLSearchParams({
            from: router.params.join('/')
          })}` : ''}`
          // even though we'll never be in an iframe, so this isn't really distinct from _self
          // it makes react-aria avoid using client-side routing which we need here
          ,
          target: "_top",
          children: [/*#__PURE__*/jsxRuntime.jsx(icon.Icon, {
            src: githubIcon.githubIcon
          }), /*#__PURE__*/jsxRuntime.jsx(typography.Text, {
            children: "Log in with GitHub"
          })]
        })
      });
    }
    if (props.config.storage.kind === 'cloud') {
      return /*#__PURE__*/jsxRuntime.jsx(layout.Flex, {
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        children: /*#__PURE__*/jsxRuntime.jsx(button.Button, {
          onPress: () => {
            index.redirectToCloudAuth(router.params.join('/'), props.config);
          },
          children: /*#__PURE__*/jsxRuntime.jsx(typography.Text, {
            children: "Log in with Keystatic Cloud"
          })
        })
      });
    }
  }
  return null;
}
function RedirectToLoopback(props) {
  React.useEffect(() => {
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
    index.assertValidRepoConfig(props.config.storage.repo);
  }
  return /*#__PURE__*/jsxRuntime.jsx(ClientOnly, {
    children: /*#__PURE__*/jsxRuntime.jsx(RedirectToLoopback, {
      children: /*#__PURE__*/jsxRuntime.jsx(AppSlugProvider, {
        value: props.appSlug,
        children: /*#__PURE__*/jsxRuntime.jsx(index.RouterProvider, {
          children: /*#__PURE__*/jsxRuntime.jsx(Provider, {
            config: props.config,
            children: /*#__PURE__*/jsxRuntime.jsx(PageInner, {
              config: props.config
            })
          })
        })
      })
    })
  });
}
function ClientOnly(props) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return props.children;
}

exports.Keystatic = Keystatic;
