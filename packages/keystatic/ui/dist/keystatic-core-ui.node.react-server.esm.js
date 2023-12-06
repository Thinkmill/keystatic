import React__default, { useState, useMemo, useEffect, useContext, createContext, startTransition, useCallback, useRef, cloneElement, forwardRef, useReducer, useId, Fragment as Fragment$1, createElement, memo } from 'react';
import { ButtonGroup, Button, ActionButton } from '@keystar/ui/button';
import { Icon } from '@keystar/ui/icon';
import { fileX2Icon } from '@keystar/ui/icon/icons/fileX2Icon';
import { githubIcon } from '@keystar/ui/icon/icons/githubIcon';
import { Flex, Box, Grid, Divider, VStack, HStack, ScrollView as ScrollView$1 } from '@keystar/ui/layout';
import { Heading, Text, Kbd, Prose } from '@keystar/ui/typography';
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
import { css, breakpoints, useMediaQuery, tokenSchema, transition, useBreakpoint, breakpointQueries, containerQueries, toDataAttributes, classNames, injectGlobal } from '@keystar/ui/style';
import { TableView, TableHeader, Column, TableBody, Row, Cell } from '@keystar/ui/table';
import { assert, isDefined, typedKeys, assertNever } from 'emery';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { gql } from '@ts-gql/tag/no-transform';
import { useQuery, useMutation, useClient, Provider as Provider$1, createClient, fetchExchange } from 'urql';
import { g as getPathPrefix, t as treeEntriesToTreeNodes, K as KEYSTATIC_CLOUD_API_URL, a as KEYSTATIC_CLOUD_HEADERS, i as isGitHubConfig, r as redirectToCloudAuth, b as getEntriesInCollectionWithTreeKey, c as getSingletonPath, d as getTreeNodeAtPath, e as treeSha, f as getBranchPrefix, n as nodeTypeMatcher, h as getSplitCloudProject, j as getRepoUrl, k as isLocalConfig, p as pluralize, l as getCollectionPath, u as updateValue, m as getKeysForArrayValue, s as setKeysForArrayValue, o as getSlugFromState, q as getInitialPropsValue, v as getAncestorComponentChildFieldDocumentFeatures, w as isBlock, x as allMarks, y as isListNode, z as isElementActive, A as getInitialPropsValueFromInitializer, B as aliasesToLabel, C as aliasesToCanonicalName, D as canonicalNameToLabel, E as labelToCanonicalName, F as languagesWithAliases, G as transformProps, H as getValueAtPropPath, I as cloneDescendent, J as areArraysEqual, L as getSchemaAtPropPath, M as findChildPropPaths, N as object, O as getSelectedTableArea, P as getRelativeRowPath, Q as cell, R as clearFormatting, S as EditorAfterButIgnoringingPointsWithNoContent, T as getInlineNodes, U as addMarksToChildren, V as setLinkForChildren, W as forceDisableMarkForChildren, X as addMarkToChildren, Y as getPlaceholderTextForPropPath, Z as Prism, _ as _createDocumentEditor, $ as getWholeDocumentFeaturesForChildField, a0 as getEntryDataFilepath, a1 as getDirectoriesForTreeKey, a2 as getTreeKey, a3 as blobSha, a4 as updateTreeWithChanges, a5 as serializeProps, a6 as getSlugGlobForCollection, a7 as getCollectionFormat, a8 as getCollectionItemPath, a9 as getDataFileExtension, aa as getSingletonFormat, ab as isCloudConfig } from '../../dist/index-38c42f5e.node.react-server.esm.js';
import LRU from 'lru-cache';
import { parse } from 'cookie';
import { z } from 'zod';
import { panelLeftOpenIcon } from '@keystar/ui/icon/icons/panelLeftOpenIcon';
import { panelLeftCloseIcon } from '@keystar/ui/icon/icons/panelLeftCloseIcon';
import { panelRightOpenIcon } from '@keystar/ui/icon/icons/panelRightOpenIcon';
import { panelRightCloseIcon } from '@keystar/ui/icon/icons/panelRightCloseIcon';
import { useOverlay, useOverlayPosition, useModalOverlay, DismissButton, useOverlayTrigger } from '@react-aria/overlays';
import { useResizeObserver, useLayoutEffect, mergeProps, useUpdateEffect } from '@react-aria/utils';
import { useOverlayTriggerState } from '@react-stately/overlays';
import { Badge } from '@keystar/ui/badge';
import { NavList, NavItem, NavGroup } from '@keystar/ui/nav-list';
import { Overlay, Blanket, Popover } from '@keystar/ui/overlays';
import { usePrevious as usePrevious$1 } from '@keystar/ui/utils';
import { N as NAVIGATION_DIVIDER_KEY, i as isValidURL } from '../../dist/isValidURL-5dbf1da3.node.react-server.esm.js';
import { useProvider, KeystarProvider, ClientSideOnlyDocumentElement } from '@keystar/ui/core';
import { Item as Item$1, Section } from '@react-stately/collections';
import { Avatar } from '@keystar/ui/avatar';
import { Dialog, DialogContainer, AlertDialog, useDialogContainer, DialogTrigger } from '@keystar/ui/dialog';
import { logOutIcon } from '@keystar/ui/icon/icons/logOutIcon';
import { gitPullRequestIcon } from '@keystar/ui/icon/icons/gitPullRequestIcon';
import { gitBranchPlusIcon } from '@keystar/ui/icon/icons/gitBranchPlusIcon';
import { gitForkIcon } from '@keystar/ui/icon/icons/gitForkIcon';
import { imageIcon } from '@keystar/ui/icon/icons/imageIcon';
import { monitorIcon } from '@keystar/ui/icon/icons/monitorIcon';
import { moonIcon } from '@keystar/ui/icon/icons/moonIcon';
import { sunIcon } from '@keystar/ui/icon/icons/sunIcon';
import { trash2Icon } from '@keystar/ui/icon/icons/trash2Icon';
import { userIcon } from '@keystar/ui/icon/icons/userIcon';
import { MenuTrigger, Menu, ActionMenu, Item as Item$4 } from '@keystar/ui/menu';
import { Content, Footer, ClearSlots } from '@keystar/ui/slots';
import { Combobox, Item } from '@keystar/ui/combobox';
import { gitBranchIcon } from '@keystar/ui/icon/icons/gitBranchIcon';
import { RadioGroup, Radio } from '@keystar/ui/radio';
import { TextField } from '@keystar/ui/text-field';
import { ReactEditor, useSlate, useSlateStatic, useSelected, Slate, Editable, withReact } from 'slate-react';
import '@keystar/ui/icon/icons/link2Icon';
import '@keystar/ui/icon/icons/link2OffIcon';
import '@keystar/ui/icon/icons/pencilIcon';
import '@keystar/ui/icon/icons/undo2Icon';
import '@keystar/ui/number-field';
import { TooltipTrigger, Tooltip } from '@keystar/ui/tooltip';
import { Transforms, Editor, Node, Range, Text as Text$1, Path, Element, Point, createEditor } from 'slate';
import { Breadcrumbs, Item as Item$6 } from '@keystar/ui/breadcrumbs';
import { Notice } from '@keystar/ui/notice';
import { Toaster, toastQueue } from '@keystar/ui/toast';
import '@sindresorhus/slugify';
import '@braintree/sanitize-url';
import { t as toFormattedFormDataError, v as validateArrayLength, P as PropValidationError, l as loadDataFile, p as parseProps } from '../../dist/required-files-0b1772f9.node.react-server.esm.js';
import { Item as Item$3, ActionGroup } from '@keystar/ui/action-group';
import { copyPlusIcon } from '@keystar/ui/icon/icons/copyPlusIcon';
import { externalLinkIcon } from '@keystar/ui/icon/icons/externalLinkIcon';
import { historyIcon } from '@keystar/ui/icon/icons/historyIcon';
import { SplitView, SplitPaneSecondary, SplitPanePrimary } from '@keystar/ui/split-view';
import { useDragAndDrop } from '@keystar/ui/drag-and-drop';
import { FieldLabel, FieldMessage, Field } from '@keystar/ui/field';
import { ListView, Item as Item$2 } from '@keystar/ui/list-view';
import { editIcon } from '@keystar/ui/icon/icons/editIcon';
import { linkIcon } from '@keystar/ui/icon/icons/linkIcon';
import { unlinkIcon } from '@keystar/ui/icon/icons/unlinkIcon';
import { boldIcon } from '@keystar/ui/icon/icons/boldIcon';
import { chevronDownIcon } from '@keystar/ui/icon/icons/chevronDownIcon';
import { codeIcon } from '@keystar/ui/icon/icons/codeIcon';
import { italicIcon } from '@keystar/ui/icon/icons/italicIcon';
import { maximizeIcon } from '@keystar/ui/icon/icons/maximizeIcon';
import { minimizeIcon } from '@keystar/ui/icon/icons/minimizeIcon';
import { plusIcon } from '@keystar/ui/icon/icons/plusIcon';
import { removeFormattingIcon } from '@keystar/ui/icon/icons/removeFormattingIcon';
import { strikethroughIcon } from '@keystar/ui/icon/icons/strikethroughIcon';
import { subscriptIcon } from '@keystar/ui/icon/icons/subscriptIcon';
import { superscriptIcon } from '@keystar/ui/icon/icons/superscriptIcon';
import { typeIcon } from '@keystar/ui/icon/icons/typeIcon';
import { underlineIcon } from '@keystar/ui/icon/icons/underlineIcon';
import { Picker } from '@keystar/ui/picker';
import { alignLeftIcon } from '@keystar/ui/icon/icons/alignLeftIcon';
import { alignRightIcon } from '@keystar/ui/icon/icons/alignRightIcon';
import { alignCenterIcon } from '@keystar/ui/icon/icons/alignCenterIcon';
import { quoteIcon } from '@keystar/ui/icon/icons/quoteIcon';
import { matchSorter } from 'match-sorter';
import { trashIcon } from '@keystar/ui/icon/icons/trashIcon';
import '@emotion/weak-memoize';
import { minusIcon } from '@keystar/ui/icon/icons/minusIcon';
import { columnsIcon } from '@keystar/ui/icon/icons/columnsIcon';
import { listIcon } from '@keystar/ui/icon/icons/listIcon';
import { listOrderedIcon } from '@keystar/ui/icon/icons/listOrderedIcon';
import { fileUpIcon } from '@keystar/ui/icon/icons/fileUpIcon';
import { sheetIcon } from '@keystar/ui/icon/icons/sheetIcon';
import { tableIcon } from '@keystar/ui/icon/icons/tableIcon';
import scrollIntoView from 'scroll-into-view-if-needed';
import { useListState } from '@react-stately/list';
import { Item as Item$5, useListBoxLayout, ListBoxBase } from '@keystar/ui/listbox';
import { withHistory } from 'slate-history';
import mdASTUtilFromMarkdown from 'mdast-util-from-markdown';
import autoLinkLiteralFromMarkdownExtension from 'mdast-util-gfm-autolink-literal/from-markdown';
import autoLinkLiteralMarkdownSyntax from 'micromark-extension-gfm-autolink-literal';
import gfmStrikethroughFromMarkdownExtension from 'mdast-util-gfm-strikethrough/from-markdown';
import gfmStrikethroughMarkdownSyntax from 'micromark-extension-gfm-strikethrough';
import { toUint8Array, fromUint8Array } from 'js-base64';
import { dump } from 'js-yaml';
import { cacheExchange } from '@urql/exchange-graphcache';
import { authExchange } from '@urql/exchange-auth';
import { persistedExchange } from '@urql/exchange-persisted';
import isEqual from 'fast-deep-equal';
import { get, createStore, set, del } from 'idb-keyval';
import '@markdoc/markdoc';
import 'emery/assertions';
import 'crypto';
import '../../dist/empty-field-ui-5b08ee07.node.react-server.esm.js';

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

var l10nMessages = {
	"ar-AE": {
		add: "يضيف",
		basedOn: "مرتكز على",
		branches: "الفروع",
		branchName: "اسم الفرع",
		cancel: "يلغي",
		collections: "المجموعات",
		clear: "مسح",
		collection: "مجموعة",
		create: "يخلق",
		createPullRequest: "إنشاء طلب سحب",
		defaultBranch: "الفرع الافتراضي",
		dashboard: "لوحة القيادة",
		currentBranch: "الفرع الحالي",
		"delete": "يمسح",
		deleteBranch: "حذف الفرع",
		otherBranches: "الفروع الأخرى",
		loading: "جارٍ التحميل",
		pullRequests: "طلبات السحب",
		search: "بحث",
		newBranch: "فرع جديد",
		edit: "يحرر",
		singletons: "الفردي",
		theCurrentlyCheckedOutBranch: "الفرع المعاد حاليا. اختر هذا إذا كنت بحاجة إلى البناء على العمل الحالي من الفرع الحالي.",
		save: "يحفظ",
		singleton: "سينجلتون",
		viewPullRequests: "عرض طلبات السحب",
		theDefaultBranchInYourRepository: "الفرع الافتراضي في المستودع الخاص بك. اختر هذا لبدء شيء جديد لا يعتمد على فرعك الحالي."
	},
	"da-DK": {
		add: "Tilføje",
		basedOn: "Baseret på",
		branchName: "Afdelingsnavn",
		branches: "Grene",
		cancel: "Afbestille",
		collection: "Kollektion",
		collections: "Samlinger",
		clear: "Ryd",
		createPullRequest: "Opret pull-anmodning",
		dashboard: "Dashboard",
		create: "skab",
		defaultBranch: "Standard gren",
		currentBranch: "Nuværende filial",
		"delete": "Slet",
		deleteBranch: "Slet filial",
		edit: "Redigere",
		loading: "Indlæser",
		newBranch: "Ny filial",
		otherBranches: "Andre grene",
		pullRequests: "Træk anmodninger",
		save: "Gemme",
		search: "Søg",
		singleton: "Singleton",
		singletons: "Singletoner",
		theDefaultBranchInYourRepository: "Standardgrenen i dit lager. Vælg dette for at starte på noget nyt, der ikke er afhængigt af din nuværende filial.",
		theCurrentlyCheckedOutBranch: "Den aktuelt tjekkede filial. Vælg dette, hvis du skal bygge videre på eksisterende arbejde fra den nuværende filial.",
		viewPullRequests: "Se pull-anmodninger"
	},
	"cs-CZ": {
		add: "Přidat",
		branchName: "Jméno pobočky",
		basedOn: "Na základě",
		branches: "Větve",
		clear: "Vymazat",
		collection: "Sbírka",
		collections: "Sbírky",
		createPullRequest: "Vytvořit požadavek na stažení",
		currentBranch: "Současná pobočka",
		cancel: "zrušení",
		create: "Vytvořit",
		dashboard: "Přístrojová deska",
		defaultBranch: "Výchozí větev",
		deleteBranch: "Smazat větev",
		"delete": "Vymazat",
		edit: "Upravit",
		newBranch: "Nová pobočka",
		loading: "Načítání",
		pullRequests: "Vytáhněte požadavky",
		save: "Uložit",
		singleton: "Jedináček",
		otherBranches: "Ostatní pobočky",
		search: "Hledat",
		singletons: "Singletons",
		theDefaultBranchInYourRepository: "Výchozí větev ve vašem úložišti. Zvolte tuto možnost, chcete-li začít s něčím novým, co není závislé na vaší aktuální větvi.",
		viewPullRequests: "Zobrazit žádosti o stažení",
		theCurrentlyCheckedOutBranch: "Aktuálně odhlášená pobočka. Tuto možnost vyberte, pokud potřebujete navázat na stávající práci z aktuální pobočky."
	},
	"bg-BG": {
		add: "Добавете",
		basedOn: "Базиран на",
		branches: "Клонове",
		clear: "Изчисти",
		collection: "колекция",
		collections: "Колекции",
		branchName: "Име на клон",
		create: "Създавайте",
		dashboard: "Табло",
		createPullRequest: "Създайте заявка за изтегляне",
		defaultBranch: "Клон по подразбиране",
		"delete": "Изтрий",
		currentBranch: "Текущ клон",
		deleteBranch: "Изтриване на клон",
		newBranch: "Нов клон",
		edit: "редактиране",
		loading: "Зареждане",
		otherBranches: "Други клонове",
		search: "Търсене",
		save: "Запазване",
		pullRequests: "Заявки за изтегляне",
		singleton: "Сингълтън",
		singletons: "Единични",
		theDefaultBranchInYourRepository: "Клонът по подразбиране във вашето хранилище. Изберете това, за да започнете с нещо ново, което не зависи от текущия ви клон.",
		theCurrentlyCheckedOutBranch: "Текущо провереният клон. Изберете това, ако трябва да надграждате върху съществуваща работа от текущия клон.",
		cancel: "Отказ",
		viewPullRequests: "Преглед на заявките за изтегляне"
	},
	"de-DE": {
		add: "Hinzufügen",
		branchName: "Zweigname",
		basedOn: "Bezogen auf",
		cancel: "Stornieren",
		branches: "Geäst",
		clear: "Löschen",
		collection: "Sammlung",
		create: "Erstellen",
		currentBranch: "Aktueller Zweig",
		collections: "Sammlungen",
		createPullRequest: "Pull-Request erstellen",
		"delete": "Löschen",
		dashboard: "Armaturenbrett",
		edit: "Bearbeiten",
		deleteBranch: "Zweig löschen",
		defaultBranch: "Standardzweig",
		loading: "Wird geladen",
		newBranch: "Neue Zweig",
		save: "Speichern",
		otherBranches: "Andere Filialen",
		pullRequests: "Pull-Requests",
		search: "Suchen",
		theDefaultBranchInYourRepository: "Der Standard-Branch in Ihrem Repository. Wählen Sie dies, um etwas Neues zu starten, das nicht von Ihrem aktuellen Zweig abhängt.",
		theCurrentlyCheckedOutBranch: "Der aktuell ausgecheckte Zweig. Wählen Sie diese Option, wenn Sie auf vorhandener Arbeit aus dem aktuellen Zweig aufbauen müssen.",
		singletons: "Singles",
		singleton: "Einzelling",
		viewPullRequests: "Pull-Requests anzeigen"
	},
	"en-US": {
		add: "Add",
		cancel: "Cancel",
		basedOn: "Based on",
		branchName: "Branch name",
		branches: "Branches",
		collection: "Collection",
		clear: "Clear",
		createPullRequest: "Create pull request",
		create: "Create",
		collections: "Collections",
		dashboard: "Dashboard",
		currentBranch: "Current branch",
		defaultBranch: "Default branch",
		"delete": "Delete",
		edit: "Edit",
		deleteBranch: "Delete branch",
		newBranch: "New branch…",
		loading: "Loading",
		pullRequests: "Pull requests",
		search: "Search",
		singleton: "Singleton",
		save: "Save",
		otherBranches: "Other branches",
		singletons: "Singletons",
		theDefaultBranchInYourRepository: "The default branch in your repository. Choose this to start something new that's not dependent on your current branch.",
		viewPullRequests: "View pull requests",
		theCurrentlyCheckedOutBranch: "The currently checked out branch. Choose this if you need to build on existing work from the current branch."
	},
	"el-GR": {
		add: "Προσθήκη",
		basedOn: "Βασισμένο στο",
		branches: "Κλαδια δεντρου",
		branchName: "Όνομα υποκαταστήματος",
		cancel: "Ματαίωση",
		create: "Δημιουργώ",
		clear: "Καθαρισμός",
		collection: "Συλλογή",
		dashboard: "Ταμπλό",
		collections: "Συλλογές",
		createPullRequest: "Δημιουργία αιτήματος έλξης",
		"delete": "Διαγράφω",
		deleteBranch: "Διαγραφή υποκαταστήματος",
		edit: "Επεξεργασία",
		currentBranch: "Τρέχον υποκατάστημα",
		defaultBranch: "Προεπιλεγμένος κλάδος",
		newBranch: "Νέο υποκατάστημα",
		loading: "Φόρτωση",
		otherBranches: "Άλλα υποκαταστήματα",
		search: "Αναζήτηση",
		singleton: "Μοναδικό χαρτί",
		pullRequests: "Τραβήξτε αιτήματα",
		save: "Αποθηκεύσετε",
		singletons: "Singletons",
		theCurrentlyCheckedOutBranch: "Το υποκατάστημα που ελέγχεται αυτήν τη στιγμή. Επιλέξτε αυτό εάν χρειάζεται να βασιστείτε σε υπάρχουσες εργασίες από τον τρέχοντα κλάδο.",
		theDefaultBranchInYourRepository: "Ο προεπιλεγμένος κλάδος στο αποθετήριο σας. Επιλέξτε αυτό για να ξεκινήσετε κάτι νέο που δεν εξαρτάται από το τρέχον υποκατάστημά σας.",
		viewPullRequests: "Προβολή αιτημάτων έλξης"
	},
	"fr-FR": {
		basedOn: "Basé sur",
		branchName: "Nom de la filiale",
		add: "Ajouter",
		branches: "Branches",
		cancel: "Annuler",
		clear: "Effacer",
		collection: "Collection",
		create: "Créer",
		currentBranch: "Succursale actuelle",
		collections: "Collections",
		defaultBranch: "Branche par défaut",
		createPullRequest: "Créer une demande d'extraction",
		deleteBranch: "Supprimer la branche",
		"delete": "Supprimer",
		dashboard: "Tableau de bord",
		edit: "Modifier",
		loading: "Chargement en cours",
		newBranch: "Nouvelle branche",
		save: "Sauvegarder",
		pullRequests: "Demandes d'extraction",
		otherBranches: "Autres succursales",
		search: "Rechercher",
		singleton: "Singleton",
		singletons: "Célibataires",
		theCurrentlyCheckedOutBranch: "La branche actuellement extraite. Choisissez cette option si vous devez vous appuyer sur le travail existant de la branche actuelle.",
		theDefaultBranchInYourRepository: "La branche par défaut de votre référentiel. Choisissez ceci pour commencer quelque chose de nouveau qui ne dépend pas de votre branche actuelle.",
		viewPullRequests: "Afficher les demandes d'extraction"
	},
	"fi-FI": {
		basedOn: "Perustuen",
		add: "Lisätä",
		branchName: "Sivukonttorin nimi",
		cancel: "Tühista",
		branches: "Oksat",
		clear: "Kirkas",
		collections: "Kokoelmat",
		collection: "Kokoelma",
		createPullRequest: "Luo vetopyyntö",
		dashboard: "Kojelauta",
		currentBranch: "Nykyinen haara",
		create: "Luoda",
		defaultBranch: "Oletushaara",
		"delete": "Poistaa",
		deleteBranch: "Poista haara",
		loading: "Ladataan",
		edit: "Muokata",
		otherBranches: "Muut haarat",
		pullRequests: "Vedä pyyntöjä",
		search: "Hae",
		save: "Tallentaa",
		newBranch: "Uusi haara",
		singletons: "Singletons",
		theCurrentlyCheckedOutBranch: "Tällä hetkellä uloskirjautunut sivuliike. Valitse tämä, jos haluat rakentaa nykyisen haaran olemassa olevaan työhön.",
		singleton: "Singleton",
		theDefaultBranchInYourRepository: "Oletushaara arkistossasi. Valitse tämä aloittaaksesi jotain uutta, joka ei ole riippuvainen nykyisestä haarastasi.",
		viewPullRequests: "Näytä vetopyynnöt"
	},
	"et-EE": {
		add: "Lisama",
		branches: "Filiaalid",
		branchName: "Filiaali nimi",
		cancel: "Tühista",
		basedOn: "Põhineb",
		collection: "Kollektsioon",
		collections: "Kollektsioonid",
		currentBranch: "Praegune filiaal",
		createPullRequest: "Loo tõmbamistaotlus",
		create: "Loo",
		clear: "Puhasta",
		dashboard: "Armatuurlaud",
		defaultBranch: "Vaikeharu",
		"delete": "Kustuta",
		deleteBranch: "Kustuta haru",
		newBranch: "Uus filiaal",
		edit: "Muuda",
		loading: "Laadimine",
		otherBranches: "Muud oksad",
		pullRequests: "Tõmbetaotlused",
		search: "Otsi",
		save: "Salvesta",
		singleton: "üksikud",
		singletons: "Üksikud",
		theCurrentlyCheckedOutBranch: "Praegu välja registreeritud filiaal. Valige see, kui peate kasutama praeguse haru olemasolevaid töid.",
		theDefaultBranchInYourRepository: "Vaikeharu teie hoidlas. Valige see, et alustada midagi uut, mis ei sõltu teie praegusest harust.",
		viewPullRequests: "Vaadake tõmbamistaotlusi"
	},
	"es-ES": {
		basedOn: "Residencia en",
		branchName: "Nombre de la sucursal",
		add: "Agregar",
		branches: "Sucursales",
		cancel: "Cancelar",
		clear: "Borrar",
		collection: "Colección",
		collections: "Colecciones",
		create: "Crear",
		currentBranch: "Rama actual",
		createPullRequest: "Crear solicitud de extracción",
		dashboard: "Panel",
		defaultBranch: "Rama predeterminada",
		loading: "Cargando",
		edit: "Editar",
		deleteBranch: "Eliminar rama",
		"delete": "Borrar",
		newBranch: "Nueva sucursal",
		otherBranches: "Otras sucursales",
		pullRequests: "Solicitudes de extracción",
		save: "Ahorrar",
		singleton: "Semifallo",
		search: "Buscar",
		singletons: "Solteros",
		viewPullRequests: "Ver solicitudes de extracción",
		theCurrentlyCheckedOutBranch: "La sucursal actualmente desprotegida. Elija esto si necesita desarrollar el trabajo existente de la rama actual.",
		theDefaultBranchInYourRepository: "La rama predeterminada en su repositorio. Elija esto para comenzar algo nuevo que no dependa de su sucursal actual."
	},
	"he-IL": {
		add: "לְהוֹסִיף",
		branchName: "שם הסניף",
		basedOn: "מבוסס על",
		branches: "ענפים",
		collections: "אוספים",
		collection: "אוסף",
		currentBranch: "סניף נוכחי",
		create: "לִיצוֹר",
		clear: "נקי",
		createPullRequest: "צור בקשת משיכה",
		defaultBranch: "סניף ברירת מחדל",
		dashboard: "לוּחַ מַחווָנִים",
		deleteBranch: "מחק סניף",
		cancel: "לְבַטֵל",
		"delete": "לִמְחוֹק",
		edit: "לַעֲרוֹך",
		save: "להציל",
		newBranch: "סניף חדש",
		pullRequests: "משוך בקשות",
		loading: "טוען",
		singletons: "רווקים",
		search: "חפש",
		singleton: "קְלָף בּוֹדֵד",
		otherBranches: "סניפים אחרים",
		theDefaultBranchInYourRepository: "סניף ברירת המחדל במאגר שלך. בחר באפשרות זו כדי להתחיל משהו חדש שאינו תלוי בסניף הנוכחי שלך.",
		viewPullRequests: "הצג בקשות משיכה",
		theCurrentlyCheckedOutBranch: "הסניף שנקבע כעת. בחר באפשרות זו אם אתה צריך לבנות על עבודה קיימת מהסניף הנוכחי."
	},
	"hu-HU": {
		add: "Hozzáadás",
		branchName: "Fiók neve",
		basedOn: "Alapján",
		collection: "Gyűjtemény",
		branches: "Ágak",
		clear: "Törlés",
		cancel: "Megszünteti",
		create: "Teremt",
		collections: "Gyűjtemények",
		createPullRequest: "Lehívási kérelem létrehozása",
		currentBranch: "Jelenlegi ág",
		dashboard: "Irányítópult",
		edit: "Szerkesztés",
		deleteBranch: "Elágazás törlése",
		defaultBranch: "Alapértelmezett ág",
		loading: "Betöltés folyamatban",
		"delete": "Töröl",
		save: "Megment",
		otherBranches: "Egyéb ágak",
		newBranch: "Új ág",
		singleton: "szingli",
		pullRequests: "Lehívási kérések",
		singletons: "Singletons",
		search: "Keresés",
		theDefaultBranchInYourRepository: "Az alapértelmezett ág az adattárban. Válassza ezt, ha valami újat szeretne indítani, amely nem függ az aktuális ágtól.",
		viewPullRequests: "Lehívási kérelmek megtekintése",
		theCurrentlyCheckedOutBranch: "A jelenleg kivett fiók. Válassza ezt, ha az aktuális ág meglévő munkájára kell építenie."
	},
	"hr-HR": {
		add: "Dodati",
		cancel: "Otkazati",
		branches: "Podružnice",
		basedOn: "Na temelju",
		collection: "Kolekcija",
		clear: "Izbriši",
		branchName: "Naziv podružnice",
		create: "Stvoriti",
		createPullRequest: "Kreirajte zahtjev za povlačenjem",
		currentBranch: "Trenutna grana",
		dashboard: "Nadzorna ploča",
		defaultBranch: "Zadana grana",
		edit: "Uredi",
		collections: "Zbirke",
		loading: "Učitavam",
		newBranch: "Nova grana",
		"delete": "Izbrisati",
		otherBranches: "Ostale grane",
		save: "Uštedjeti",
		search: "Traži",
		deleteBranch: "Izbriši granu",
		singleton: "samac",
		pullRequests: "Zahtjevi za povlačenjem",
		viewPullRequests: "Pregledajte zahtjeve za povlačenjem",
		theDefaultBranchInYourRepository: "Zadana grana u vašem spremištu. Odaberite ovo da započnete nešto novo što ne ovisi o vašoj trenutnoj grani.",
		theCurrentlyCheckedOutBranch: "Trenutno odjavljena poslovnica. Odaberite ovo ako trebate graditi na postojećem radu iz trenutne grane.",
		singletons: "Samci"
	},
	"it-IT": {
		basedOn: "Basato su",
		add: "Aggiungere",
		branchName: "Nome ramo",
		branches: "Rami",
		cancel: "Annulla",
		collections: "Collezioni",
		collection: "Collezione",
		createPullRequest: "Crea richiesta pull",
		clear: "Cancella",
		currentBranch: "Ramo attuale",
		dashboard: "Pannello di controllo",
		defaultBranch: "Ramo predefinito",
		create: "Creare",
		deleteBranch: "Elimina ramo",
		"delete": "Eliminare",
		newBranch: "Nuova filiale",
		otherBranches: "Altri rami",
		edit: "Modificare",
		loading: "Caricamento in corso",
		save: "Salva",
		search: "Cerca",
		singletons: "Singletons",
		pullRequests: "Richieste pull",
		singleton: "Singleton",
		viewPullRequests: "Visualizza le richieste pull",
		theDefaultBranchInYourRepository: "Il ramo predefinito nel tuo repository. Scegli questa opzione per iniziare qualcosa di nuovo che non dipenda dal tuo ramo attuale.",
		theCurrentlyCheckedOutBranch: "La filiale attualmente verificata. Scegli questa opzione se devi basarti su un lavoro esistente dal ramo corrente."
	},
	"ja-JP": {
		add: "追加",
		branchName: "支店名",
		basedOn: "に基づく",
		branches: "支店",
		clear: "クリア",
		collection: "コレクション",
		cancel: "キャンセル",
		create: "作成",
		collections: "コレクション",
		createPullRequest: "プルリクエストを作成",
		dashboard: "ダッシュボード",
		defaultBranch: "デフォルトのブランチ",
		currentBranch: "現在のブランチ",
		"delete": "消去",
		edit: "編集",
		loading: "読み込み中",
		newBranch: "新しい支店",
		deleteBranch: "ブランチを削除",
		save: "保存",
		otherBranches: "その他の支店",
		search: "検索",
		pullRequests: "プルリクエスト",
		singletons: "シングルトン",
		singleton: "シングルトン",
		viewPullRequests: "プル リクエストを表示",
		theCurrentlyCheckedOutBranch: "現在チェックアウトされているブランチ。 現在のブランチの既存の作業に基づいて構築する必要がある場合は、これを選択してください。",
		theDefaultBranchInYourRepository: "リポジトリのデフォルト ブランチ。 これを選択して、現在のブランチに依存しない新しい何かを開始します。"
	},
	"lt-LT": {
		add: "Papildyti",
		branchName: "Filialo pavadinimas",
		branches: "Filialai",
		basedOn: "Remiantis",
		cancel: "Atšaukti",
		collections: "Kolekcijos",
		collection: "Kolekcija",
		clear: "Skaidrus",
		create: "Sukurti",
		createPullRequest: "Sukurti ištraukimo užklausą",
		defaultBranch: "Numatytoji šaka",
		dashboard: "Prietaisų skydelis",
		"delete": "Ištrinti",
		deleteBranch: "Ištrinti šaką",
		currentBranch: "Dabartinis filialas",
		loading: "Įkeliama",
		otherBranches: "Kitos šakos",
		edit: "Redaguoti",
		pullRequests: "Ištraukti užklausas",
		search: "Ieškoti",
		singletons: "Vienišiai",
		newBranch: "Naujas filialas",
		theDefaultBranchInYourRepository: "Numatytoji šaka jūsų saugykloje. Pasirinkite tai, kad pradėtumėte ką nors naujo, nepriklausančio nuo dabartinės šakos.",
		save: "Sutaupyti",
		singleton: "vienvietis",
		theCurrentlyCheckedOutBranch: "Šiuo metu išregistruotas filialas. Pasirinkite tai, jei reikia remtis esamu darbu iš dabartinės šakos.",
		viewPullRequests: "Peržiūrėkite ištraukimo užklausas"
	},
	"ko-KR": {
		add: "추가하다",
		branchName: "지점명",
		basedOn: "기반으로",
		clear: "지우기",
		branches: "가지",
		cancel: "취소",
		collection: "수집",
		createPullRequest: "풀 요청 생성",
		create: "만들다",
		currentBranch: "현재 지점",
		collections: "컬렉션",
		defaultBranch: "기본 분기",
		dashboard: "계기반",
		otherBranches: "기타 지점",
		"delete": "삭제",
		loading: "로드 중",
		newBranch: "새 지점",
		deleteBranch: "분기 삭제",
		save: "구하다",
		search: "검색",
		pullRequests: "풀 리퀘스트",
		edit: "편집하다",
		singleton: "하나씩 일어나는 것",
		theCurrentlyCheckedOutBranch: "현재 체크아웃된 브랜치. 현재 브랜치의 기존 작업을 기반으로 빌드해야 하는 경우 이 옵션을 선택하세요.",
		theDefaultBranchInYourRepository: "리포지토리의 기본 브랜치입니다. 현재 분기에 의존하지 않는 새로운 것을 시작하려면 이것을 선택하십시오.",
		singletons: "싱글톤",
		viewPullRequests: "풀 요청 보기"
	},
	"lv-LV": {
		add: "Pievienot",
		branchName: "Filiāles nosaukums",
		basedOn: "Balstoties uz",
		collection: "Kolekcija",
		clear: "Notīrīt",
		branches: "Nozares",
		collections: "Kolekcijas",
		create: "Izveidot",
		currentBranch: "Pašreizējā filiāle",
		cancel: "Atcelt",
		createPullRequest: "Izveidot izvilkšanas pieprasījumu",
		dashboard: "Mērinstrumentu panelis",
		deleteBranch: "Dzēst filiāli",
		"delete": "Dzēst",
		defaultBranch: "Noklusējuma filiāle",
		loading: "Notiek ielāde",
		edit: "Rediģēt",
		newBranch: "Jauna filiāle",
		otherBranches: "Citas filiāles",
		save: "Saglabāt",
		theDefaultBranchInYourRepository: "Noklusējuma filiāle jūsu repozitorijā. Izvēlieties šo, lai sāktu kaut ko jaunu, kas nav atkarīgs no jūsu pašreizējās filiāles.",
		singleton: "Singleton",
		singletons: "Vientuļi",
		viewPullRequests: "Skatīt izvilkšanas pieprasījumus",
		search: "Meklēt",
		pullRequests: "Izvilkšanas pieprasījumi",
		theCurrentlyCheckedOutBranch: "Pašlaik izrakstītā filiāle. Izvēlieties šo, ja vēlaties izmantot esošo darbu no pašreizējās filiāles."
	},
	"nb-NO": {
		branchName: "Filialnavn",
		basedOn: "Basert på",
		add: "Legg til",
		branches: "Grener",
		collection: "Samling",
		clear: "Tøm",
		cancel: "Avbryt",
		collections: "Samlinger",
		createPullRequest: "Opprett pull-forespørsel",
		create: "Skape",
		dashboard: "Dashbord",
		currentBranch: "Nåværende gren",
		"delete": "Slett",
		defaultBranch: "Standard gren",
		edit: "Redigere",
		loading: "Laster inn",
		deleteBranch: "Slett filial",
		pullRequests: "Trekk forespørsler",
		otherBranches: "Andre grener",
		search: "Søk",
		newBranch: "Ny gren",
		singletons: "Singletoner",
		singleton: "Singleton",
		save: "Lagre",
		theDefaultBranchInYourRepository: "Standardgrenen i depotet ditt. Velg dette for å starte noe nytt som ikke er avhengig av din nåværende filial.",
		viewPullRequests: "Se pull-forespørsler",
		theCurrentlyCheckedOutBranch: "Den utsjekkede grenen. Velg dette hvis du skal bygge på eksisterende arbeid fra gjeldende gren."
	},
	"nl-NL": {
		add: "Toevoegen",
		cancel: "Annuleren",
		branches: "Takken",
		basedOn: "Gebaseerd op",
		clear: "Helder",
		collection: "Verzameling",
		branchName: "Filiaal naam",
		create: "Creëren",
		currentBranch: "Huidige tak",
		dashboard: "Dashboard",
		"delete": "Verwijderen",
		collections: "Collecties",
		defaultBranch: "Standaard filiaal",
		deleteBranch: "Filiaal verwijderen",
		edit: "Bewerking",
		loading: "Laden",
		createPullRequest: "Pull-aanvraag maken",
		otherBranches: "Andere takken",
		newBranch: "Nieuwe tak",
		save: "Redden",
		pullRequests: "Trek verzoeken",
		singleton: "eenling",
		singletons: "Eenlingen",
		theCurrentlyCheckedOutBranch: "Het momenteel uitgecheckte filiaal. Kies dit als u moet voortbouwen op bestaand werk van de huidige branch.",
		search: "Zoeken",
		viewPullRequests: "Bekijk pull-aanvragen",
		theDefaultBranchInYourRepository: "De standaard branch in uw repository. Kies dit om iets nieuws te starten dat niet afhankelijk is van uw huidige branche."
	},
	"pt-BR": {
		branchName: "Nome da filial",
		basedOn: "Baseado em",
		add: "Adicionar",
		collections: "Coleções",
		branches: "Galhos",
		collection: "Coleção",
		cancel: "Cancelar",
		clear: "Limpar",
		create: "Criar",
		createPullRequest: "Criar solicitação pull",
		currentBranch: "filial atual",
		defaultBranch: "ramo padrão",
		"delete": "Excluir",
		dashboard: "Painel",
		edit: "Editar",
		deleteBranch: "Excluir ramificação",
		otherBranches: "Outros ramos",
		loading: "Carregando",
		newBranch: "Nova filial",
		search: "Pesquisar",
		save: "Guardar",
		pullRequests: "Requisições pull",
		singleton: "solteiro",
		theDefaultBranchInYourRepository: "A ramificação padrão em seu repositório. Escolha isso para iniciar algo novo que não dependa de sua ramificação atual.",
		singletons: "Solteiros",
		theCurrentlyCheckedOutBranch: "A ramificação atualmente com check-out. Escolha esta opção se precisar criar um trabalho existente na ramificação atual.",
		viewPullRequests: "Ver solicitações pull"
	},
	"pl-PL": {
		branchName: "Nazwa filii",
		add: "Dodać",
		basedOn: "Oparte na",
		cancel: "Anulować",
		branches: "Gałęzie",
		collection: "Kolekcja",
		collections: "Kolekcje",
		clear: "Wyczyść",
		create: "Tworzyć",
		dashboard: "Panel",
		createPullRequest: "Utwórz żądanie ściągnięcia",
		currentBranch: "Obecny oddział",
		"delete": "Usuwać",
		defaultBranch: "Oddział domyślny",
		deleteBranch: "Usuń oddział",
		edit: "Edytować",
		otherBranches: "Inne gałęzie",
		pullRequests: "Żądania ściągnięcia",
		loading: "Trwa ładowanie",
		save: "Ratować",
		newBranch: "Nowa gałąź",
		singleton: "singel",
		theCurrentlyCheckedOutBranch: "Aktualnie wyewidencjonowana gałąź. Wybierz tę opcję, jeśli chcesz oprzeć się na istniejącej pracy z bieżącej gałęzi.",
		singletons: "Singletony",
		search: "Szukaj",
		viewPullRequests: "Wyświetl żądania ściągnięcia",
		theDefaultBranchInYourRepository: "Domyślna gałąź w twoim repozytorium. Wybierz tę opcję, aby rozpocząć coś nowego, co nie jest zależne od bieżącej gałęzi."
	},
	"pt-PT": {
		add: "Adicionar",
		basedOn: "Baseado em",
		branches: "Galhos",
		clear: "Limpar",
		branchName: "Nome da filial",
		cancel: "Cancelar",
		collections: "Coleções",
		create: "Criar",
		currentBranch: "filial atual",
		"delete": "Excluir",
		createPullRequest: "Criar solicitação pull",
		dashboard: "Painel",
		deleteBranch: "Excluir ramificação",
		edit: "Editar",
		defaultBranch: "ramo padrão",
		newBranch: "Nova filial",
		pullRequests: "Requisições pull",
		loading: "A carregar",
		save: "Guardar",
		search: "Procurar",
		singletons: "Solteiros",
		otherBranches: "Outros ramos",
		collection: "Coleção",
		theCurrentlyCheckedOutBranch: "A ramificação atualmente com check-out. Escolha esta opção se precisar criar um trabalho existente na ramificação atual.",
		singleton: "solteiro",
		viewPullRequests: "Ver solicitações pull",
		theDefaultBranchInYourRepository: "A ramificação padrão em seu repositório. Escolha isso para iniciar algo novo que não dependa de sua ramificação atual."
	},
	"ro-RO": {
		add: "Adăuga",
		basedOn: "Bazat pe",
		branchName: "Numele sucursalei",
		branches: "Ramuri",
		clear: "Golire",
		collection: "Colectie",
		collections: "Colecții",
		createPullRequest: "Creați cerere de tragere",
		dashboard: "Bord",
		cancel: "Anulare",
		create: "Crea",
		defaultBranch: "Ramura implicită",
		currentBranch: "Filiala actuală",
		deleteBranch: "Ștergeți ramura",
		loading: "Se încarcă",
		edit: "Editați",
		otherBranches: "Alte ramuri",
		"delete": "Șterge",
		newBranch: "Filiala noua",
		save: "Salvați",
		search: "Căutare",
		singletons: "Singletons",
		singleton: "Singleton",
		theCurrentlyCheckedOutBranch: "Sucursala verificată în prezent. Alegeți acest lucru dacă trebuie să vă bazați pe munca existentă din ramura curentă.",
		viewPullRequests: "Vizualizați solicitările de extragere",
		pullRequests: "Solicitări de tragere",
		theDefaultBranchInYourRepository: "Ramura implicită din depozitul dvs. Alegeți acest lucru pentru a începe ceva nou, care nu depinde de ramura dvs. actuală."
	},
	"ru-RU": {
		add: "Добавлять",
		basedOn: "На основе",
		branches: "Ветви",
		cancel: "Отмена",
		clear: "Очистить",
		branchName: "Название филиала",
		create: "Создавать",
		collection: "Коллекция",
		createPullRequest: "Создать запрос на включение",
		defaultBranch: "Ветка по умолчанию",
		dashboard: "Панель приборов",
		collections: "Коллекции",
		currentBranch: "Текущая ветвь",
		"delete": "Удалить",
		deleteBranch: "Удалить ветку",
		loading: "Загрузка",
		edit: "Редактировать",
		pullRequests: "Пулл-реквесты",
		otherBranches: "Другие филиалы",
		save: "Сохранять",
		newBranch: "Новая ветка",
		singleton: "Синглтон",
		singletons: "Одиночки",
		theCurrentlyCheckedOutBranch: "Текущая проверенная ветвь. Выберите это, если вам нужно опираться на существующую работу из текущей ветки.",
		theDefaultBranchInYourRepository: "Ветка по умолчанию в вашем репозитории. Выберите это, чтобы начать что-то новое, не зависящее от вашей текущей ветки.",
		search: "Поиск",
		viewPullRequests: "Посмотреть пул-реквесты"
	},
	"sk-SK": {
		basedOn: "Založené na",
		branchName: "Meno pobočky",
		clear: "Vymazať",
		add: "Pridať",
		branches: "Pobočky",
		collections: "zbierky",
		cancel: "Zrušiť",
		collection: "Zbierka",
		createPullRequest: "Vytvorte požiadavku na stiahnutie",
		defaultBranch: "Predvolená vetva",
		create: "Vytvorte",
		dashboard: "Dashboard",
		currentBranch: "Aktuálna pobočka",
		"delete": "Odstrániť",
		edit: "Upraviť",
		deleteBranch: "Odstrániť vetvu",
		newBranch: "Nová pobočka",
		otherBranches: "Ostatné pobočky",
		loading: "Načítava sa",
		search: "Vyhľadávať",
		pullRequests: "Vytiahnite žiadosti",
		save: "Uložiť",
		singleton: "Singleton",
		theCurrentlyCheckedOutBranch: "Aktuálne odhlásená pobočka. Túto možnosť vyberte, ak potrebujete stavať na existujúcej práci z aktuálnej pobočky.",
		singletons: "Singletons",
		viewPullRequests: "Zobraziť požiadavky na stiahnutie",
		theDefaultBranchInYourRepository: "Predvolená vetva vo vašom úložisku. Zvoľte túto možnosť, ak chcete začať niečo nové, čo nezávisí od vašej aktuálnej pobočky."
	},
	"sl-SI": {
		add: "Dodaj",
		basedOn: "Temelji na",
		branchName: "Ime podružnice",
		cancel: "Prekliči",
		clear: "Jasen",
		collection: "Zbirka",
		branches: "Podružnice",
		collections: "Zbirke",
		create: "Ustvari",
		dashboard: "Nadzorna plošča",
		createPullRequest: "Ustvari zahtevo za vleko",
		currentBranch: "Trenutna veja",
		defaultBranch: "Privzeta veja",
		loading: "Nalaganje",
		"delete": "Izbriši",
		deleteBranch: "Izbriši vejo",
		edit: "Uredi",
		pullRequests: "Zahteve za vlečenje",
		newBranch: "Nova podružnica",
		save: "Shrani",
		otherBranches: "Druge veje",
		search: "Iskanje",
		singleton: "Singleton",
		theCurrentlyCheckedOutBranch: "Trenutno odjavljena podružnica. To izberite, če morate graditi na obstoječem delu iz trenutne veje.",
		singletons: "Samski",
		theDefaultBranchInYourRepository: "Privzeta veja v vašem skladišču. Izberite to, da začnete nekaj novega, kar ni odvisno od vaše trenutne veje.",
		viewPullRequests: "Oglejte si zahteve za vlečenje"
	},
	"sv-SE": {
		add: "Lägg till",
		branches: "Grenar",
		basedOn: "Baserat på",
		cancel: "Поништити, отказати",
		clear: "Rensa",
		branchName: "Filialens namn",
		collection: "Samling",
		createPullRequest: "Skapa pull-förfrågan",
		dashboard: "instrumentbräda",
		currentBranch: "Nuvarande gren",
		defaultBranch: "Standardgren",
		collections: "Samlingar",
		create: "Skapa",
		"delete": "Radera",
		edit: "Redigera",
		deleteBranch: "Ta bort gren",
		loading: "Läser in",
		newBranch: "Ny gren",
		pullRequests: "Dra förfrågningar",
		save: "Spara",
		otherBranches: "Andra grenar",
		singleton: "Singleton",
		singletons: "Singlar",
		theCurrentlyCheckedOutBranch: "Den utcheckade filialen. Välj detta om du behöver bygga på befintligt arbete från den aktuella grenen.",
		theDefaultBranchInYourRepository: "Standardgrenen i ditt arkiv. Välj detta för att starta något nytt som inte är beroende av din nuvarande filial.",
		search: "Sök",
		viewPullRequests: "Visa pull-förfrågningar"
	},
	"sr-SP": {
		add: "Додати",
		cancel: "Поништити, отказати",
		branchName: "Назив огранка",
		basedOn: "На бази",
		collection: "Цоллецтион",
		branches: "Огранци",
		create: "Креирај",
		clear: "Izbriši",
		collections: "Збирке",
		createPullRequest: "Креирајте захтев за повлачење",
		currentBranch: "Тренутна грана",
		"delete": "Избриши",
		dashboard: "Командна табла",
		defaultBranch: "Подразумевана грана",
		deleteBranch: "Обриши грану",
		edit: "Уредити",
		loading: "Učitavam",
		newBranch: "Нова грана",
		otherBranches: "Остале гране",
		save: "сачувати",
		singletons: "Синглетонс",
		pullRequests: "Захтеви за повлачење",
		search: "Pretraga",
		singleton: "Синглетон",
		theCurrentlyCheckedOutBranch: "Тренутно одјављена филијала. Изаберите ово ако треба да надоградите постојећи рад из тренутне гране.",
		theDefaultBranchInYourRepository: "Подразумевана грана у вашем спремишту. Изаберите ово да започнете нешто ново што не зависи од ваше тренутне гране.",
		viewPullRequests: "Прегледајте захтеве за повлачењем"
	},
	"uk-UA": {
		basedOn: "На основі",
		add: "додати",
		branchName: "Назва гілки",
		cancel: "скасувати",
		branches: "Відділення",
		clear: "Очистити",
		create: "Створити",
		collections: "Колекції",
		collection: "Колекція",
		createPullRequest: "Створити запит на отримання",
		currentBranch: "Поточне відділення",
		dashboard: "Панель приладів",
		defaultBranch: "Гілка за замовчуванням",
		"delete": "Видалити",
		loading: "Завантаження",
		edit: "Редагувати",
		deleteBranch: "Видалити гілку",
		newBranch: "Нова гілка",
		save: "зберегти",
		search: "Пошук",
		otherBranches: "Інші гілки",
		pullRequests: "Запити на витягування",
		singleton: "Синглтон",
		singletons: "Одиночки",
		viewPullRequests: "Перегляд запитів на отримання",
		theDefaultBranchInYourRepository: "Стандартна гілка у вашому сховищі. Виберіть це, щоб почати щось нове, що не залежить від вашої поточної гілки.",
		theCurrentlyCheckedOutBranch: "Поточна перевірена гілка. Виберіть це, якщо вам потрібно створити на основі існуючої роботи з поточної гілки."
	},
	"tr-TR": {
		basedOn: "Dayalı",
		cancel: "iptal etmek",
		add: "Avbryt",
		branchName: "şube adı",
		branches: "Şubeler",
		clear: "Temizle",
		collection: "Toplamak",
		createPullRequest: "Çekme isteği oluştur",
		collections: "Koleksiyonlar",
		create: "Yaratmak",
		currentBranch: "Mevcut şube",
		dashboard: "Gösterge Paneli",
		defaultBranch: "varsayılan dal",
		"delete": "Silmek",
		deleteBranch: "Şubeyi sil",
		edit: "Düzenlemek",
		loading: "Yükleniyor",
		newBranch: "Yeni dal",
		otherBranches: "Diğer şubeler",
		search: "Ara",
		pullRequests: "Çekme istekleri",
		save: "Kaydetmek",
		singleton: "Tekil",
		singletons: "Singleton'lar",
		theDefaultBranchInYourRepository: "Deponuzdaki varsayılan şube. Mevcut şubenize bağlı olmayan yeni bir şey başlatmak için bunu seçin.",
		theCurrentlyCheckedOutBranch: "Şu anda kontrol edilen şube. Geçerli daldaki mevcut işi geliştirmeniz gerekiyorsa bunu seçin.",
		viewPullRequests: "Çekme isteklerini görüntüle"
	},
	"zh-TW": {
		basedOn: "基於",
		branchName: "分店名稱",
		cancel: "取消",
		add: "添加",
		clear: "清除",
		branches: "分支機構",
		collections: "收藏品",
		create: "創造",
		collection: "收藏",
		createPullRequest: "創建拉取請求",
		currentBranch: "當前分支",
		defaultBranch: "默認分支",
		"delete": "刪除",
		deleteBranch: "刪除分支",
		dashboard: "儀表板",
		loading: "正在載入",
		otherBranches: "其他分行",
		edit: "編輯",
		pullRequests: "拉取請求",
		newBranch: "新分行",
		save: "節省",
		search: "搜尋",
		singleton: "單例",
		theCurrentlyCheckedOutBranch: "當前簽出的分支。 如果您需要在當前分支的現有工作的基礎上構建，請選擇此項。",
		viewPullRequests: "查看拉取請求",
		theDefaultBranchInYourRepository: "存儲庫中的默認分支。 選擇此選項可開始一些不依賴於當前分支的新操作。",
		singletons: "單例"
	},
	"zh-CN": {
		add: "添加",
		basedOn: "基于",
		branchName: "分店名称",
		clear: "透明",
		branches: "分支机构",
		cancel: "取消",
		collection: "收藏",
		create: "创造",
		createPullRequest: "创建拉取请求",
		collections: "收藏品",
		currentBranch: "当前分支",
		dashboard: "仪表板",
		"delete": "删除",
		defaultBranch: "默认分支",
		deleteBranch: "删除分支",
		newBranch: "新分行",
		edit: "编辑",
		otherBranches: "其他分行",
		loading: "正在加载",
		search: "搜索",
		pullRequests: "拉取请求",
		save: "节省",
		singletons: "单例",
		singleton: "单例",
		theCurrentlyCheckedOutBranch: "当前签出的分支。 如果您需要在当前分支的现有工作的基础上构建，请选择此项。",
		theDefaultBranchInYourRepository: "存储库中的默认分支。 选择此选项可开始一些不依赖于当前分支的新操作。",
		viewPullRequests: "查看拉取请求"
	}
};

const RouterContext = /*#__PURE__*/createContext(null);
function RouterProvider(props) {
  const [url, setUrl] = useState(() => window.location.href);
  const router = useMemo(() => {
    function navigate(url, replace) {
      const newUrl = new URL(url, window.location.href);
      if (newUrl.origin !== window.location.origin || !newUrl.pathname.startsWith('/keystatic')) {
        window.location.assign(newUrl);
        return;
      }
      window.history[replace ? 'replaceState' : 'pushState'](null, '', newUrl);
      startTransition(() => {
        setUrl(newUrl.toString());
      });
    }
    const replaced = location.pathname.replace(/^\/keystatic\/?/, '');
    const params = replaced === '' ? [] : replaced.split('/').map(decodeURIComponent);
    const parsedUrl = new URL(url);
    return {
      href: parsedUrl.pathname + parsedUrl.search,
      replace(path) {
        navigate(path, true);
      },
      push(path) {
        navigate(path, false);
      },
      params
    };
  }, [url]);
  useEffect(() => {
    const handleNavigate = () => {
      startTransition(() => {
        setUrl(window.location.href);
      });
    };
    window.addEventListener('popstate', handleNavigate);
    return () => {
      window.removeEventListener('popstate', handleNavigate);
    };
  }, []);
  return /*#__PURE__*/jsx(RouterContext.Provider, {
    value: router,
    children: props.children
  });
}
function useRouter() {
  const router = useContext(RouterContext);
  if (router == null) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return router;
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

const LOADING = Symbol('loading');
function isThenable(value) {
  return value && typeof value.then === 'function';
}
function useData(func) {
  const [state, setState] = useState({
    kind: 'loading'
  });
  let stateToReturn = state;
  const result = useMemo(() => {
    try {
      const result = func();
      // this avoids unhandled promise rejections
      // we actually handle the result in an effect
      if (isThenable(result)) {
        result.then(() => {}, () => {});
      }
      return {
        kind: 'result',
        result
      };
    } catch (error) {
      return {
        kind: 'error',
        error: error
      };
    }
  }, [func]);
  const resultState = useMemo(() => {
    if (result.kind === 'error' && (state.kind !== 'error' || state.error !== result.error)) {
      return {
        kind: 'error',
        error: result.error
      };
    }
    if (result.kind === 'result' && !isThenable(result.result) && result.result !== LOADING && (state.kind !== 'loaded' || state.data !== result.result)) {
      return {
        kind: 'loaded',
        data: result.result
      };
    }
  }, [result, state]);
  if (resultState && resultState !== state) {
    stateToReturn = resultState;
    setState(resultState);
  }
  useEffect(() => {
    if (result.kind === 'result' && isThenable(result.result)) {
      setState({
        kind: 'loading'
      });
      let isActive = true;
      result.result.then(result => {
        if (result === LOADING || !isActive) return;
        setState({
          kind: 'loaded',
          data: result
        });
      }, error => {
        if (!isActive) return;
        setState({
          kind: 'error',
          error
        });
      });
      return () => {
        isActive = false;
      };
    }
  }, [result]);
  return stateToReturn;
}
function mapDataState(state, func) {
  if (state.kind === 'error' || state.kind === 'loading') {
    return state;
  }
  return {
    kind: 'loaded',
    data: func(state.data)
  };
}
function mergeDataStates(input) {
  const entries = Object.entries(input);
  for (const [, value] of entries) {
    if (value.kind === 'error') {
      return {
        kind: 'error',
        error: value.error
      };
    }
  }
  for (const [, value] of entries) {
    if (value.kind === 'loading') {
      return {
        kind: 'loading'
      };
    }
  }
  return {
    kind: 'loaded',
    data: Object.fromEntries(entries.map(([key, val]) => {
      return [key, val.data];
    }))
  };
}

const storedTokenSchema = z.object({
  token: z.string(),
  project: z.string(),
  validUntil: z.number().transform(val => new Date(val))
});
function getSyncAuth(config) {
  if (typeof document === 'undefined') {
    return null;
  }
  if (config.storage.kind === 'github') {
    const cookies = parse(document.cookie);
    const accessToken = cookies['keystatic-gh-access-token'];
    if (!accessToken) {
      return null;
    }
    return {
      accessToken
    };
  }
  if (config.storage.kind === 'cloud') {
    return getCloudAuth(config);
  }
  return null;
}
function getCloudAuth(config) {
  var _config$cloud;
  if (!((_config$cloud = config.cloud) !== null && _config$cloud !== void 0 && _config$cloud.project)) return null;
  const unparsedTokenData = localStorage.getItem('keystatic-cloud-access-token');
  let tokenData;
  try {
    tokenData = storedTokenSchema.parse(JSON.parse(unparsedTokenData));
  } catch (err) {
    return null;
  }
  if (!tokenData || tokenData.validUntil < new Date() || tokenData.project !== config.cloud.project) {
    return null;
  }
  return {
    accessToken: tokenData.token
  };
}
async function getAuth(config) {
  const token = getSyncAuth(config);
  if (config.storage.kind === 'github' && !token) {
    try {
      const res = await fetch('/api/keystatic/github/refresh-token', {
        method: 'POST'
      });
      if (res.status === 200) {
        const cookies = parse(document.cookie);
        const accessToken = cookies['keystatic-gh-access-token'];
        if (accessToken) {
          return {
            accessToken
          };
        }
      }
    } catch {}
    return null;
  }
  return token;
}

const SidebarFooter_viewer = gql`
  fragment SidebarFooter_viewer on User {
    id
    name
    login
    avatarUrl
    databaseId
  }
`;
const ViewerContext = /*#__PURE__*/createContext(undefined);
function useViewer() {
  return useContext(ViewerContext);
}

function parseRepoConfig(repo) {
  if (typeof repo === 'string') {
    const [owner, name] = repo.split('/');
    return {
      owner,
      name
    };
  }
  return repo;
}
function serializeRepoConfig(repo) {
  if (typeof repo === 'string') {
    return repo;
  }
  return `${repo.owner}/${repo.name}`;
}
function assertValidRepoConfig(repo) {
  if (typeof repo === 'string') {
    if (!repo.includes('/')) {
      throw new Error(`Invalid repo config: ${repo}. It must be in the form owner/name`);
    }
  }
  if (typeof repo === 'object') {
    if (!repo.owner && !repo.name) {
      throw new Error(`Invalid repo config: owner and name are missing`);
    }
    if (!repo.owner) {
      throw new Error(`Invalid repo config: owner is missing`);
    }
    if (!repo.name) {
      throw new Error(`Invalid repo config: name is missing`);
    }
  }
}

function scopeEntriesWithPathPrefix(tree, config) {
  const prefix = getPathPrefix(config.storage);
  if (!prefix) return tree;
  const newEntries = [];
  for (const entry of tree.entries.values()) {
    if (entry.path.startsWith(prefix)) {
      newEntries.push({
        ...entry,
        path: entry.path.slice(prefix.length)
      });
    }
  }
  return {
    entries: new Map(newEntries.map(entry => [entry.path, entry])),
    tree: treeEntriesToTreeNodes(newEntries)
  };
}

function fetchLocalTree(sha) {
  if (treeCache.has(sha)) {
    return treeCache.get(sha);
  }
  const promise = fetch('/api/keystatic/tree', {
    headers: {
      'no-cors': '1'
    }
  }).then(x => x.json()).then(async entries => hydrateTreeCacheWithEntries(entries));
  treeCache.set(sha, promise);
  return promise;
}
function useSetTreeSha() {
  return useContext(SetTreeShaContext);
}
const SetTreeShaContext = /*#__PURE__*/createContext(() => {
  throw new Error('SetTreeShaContext not set');
});
function LocalAppShellProvider(props) {
  const [currentTreeSha, setCurrentTreeSha] = useState('initial');
  const tree = useData(useCallback(() => fetchLocalTree(currentTreeSha), [currentTreeSha]));
  const allTreeData = useMemo(() => ({
    unscopedDefault: tree,
    scoped: {
      default: tree,
      current: tree,
      merged: mergeDataStates({
        default: tree,
        current: tree
      })
    }
  }), [tree]);
  const changedData = useMemo(() => {
    if (allTreeData.scoped.merged.kind !== 'loaded') {
      return {
        collections: new Map(),
        singletons: new Set()
      };
    }
    return getChangedData(props.config, allTreeData.scoped.merged.data);
  }, [allTreeData, props.config]);
  return /*#__PURE__*/jsx(SetTreeShaContext.Provider, {
    value: setCurrentTreeSha,
    children: /*#__PURE__*/jsx(ChangedContext.Provider, {
      value: changedData,
      children: /*#__PURE__*/jsx(TreeContext.Provider, {
        value: allTreeData,
        children: props.children
      })
    })
  });
}
const cloudInfoSchema = z.object({
  user: z.object({
    name: z.string(),
    email: z.string(),
    avatarUrl: z.string().optional()
  }),
  project: z.object({
    name: z.string()
  }),
  team: z.object({
    name: z.string(),
    slug: z.string(),
    images: z.boolean()
  })
});
const CloudInfo = /*#__PURE__*/createContext(null);
function useCloudInfo() {
  const context = useContext(CloudInfo);
  return context === 'unauthorized' ? null : context;
}
function useRawCloudInfo() {
  return useContext(CloudInfo);
}
function CloudInfoProvider(props) {
  const data = useData(useCallback(async () => {
    var _props$config$cloud, _getCloudAuth;
    if (!((_props$config$cloud = props.config.cloud) !== null && _props$config$cloud !== void 0 && _props$config$cloud.project)) throw new Error('no cloud project set');
    const token = (_getCloudAuth = getCloudAuth(props.config)) === null || _getCloudAuth === void 0 ? void 0 : _getCloudAuth.accessToken;
    if (!token) {
      return 'unauthorized';
    }
    const res = await fetch(`${KEYSTATIC_CLOUD_API_URL}/v1/info`, {
      headers: {
        ...KEYSTATIC_CLOUD_HEADERS,
        Authorization: `Bearer ${token}`
      }
    });
    if (res.status === 401) return 'unauthorized';
    return cloudInfoSchema.parse(await res.json());
  }, [props.config]));
  return /*#__PURE__*/jsx(CloudInfo.Provider, {
    value: data.kind === 'loaded' ? data.data : null,
    children: props.children
  });
}
const GitHubAppShellDataContext = /*#__PURE__*/createContext(null);
function GitHubAppShellDataProvider(props) {
  const [state] = useQuery({
    query: props.config.storage.kind === 'github' ? GitHubAppShellQuery : CloudAppShellQuery,
    variables: props.config.storage.kind === 'github' ? parseRepoConfig(props.config.storage.repo) : {
      name: 'repo-name',
      owner: 'repo-owner'
    }
  });
  return /*#__PURE__*/jsx(GitHubAppShellDataContext.Provider, {
    value: state,
    children: /*#__PURE__*/jsx(ViewerContext.Provider, {
      value: state.data && 'viewer' in state.data ? state.data.viewer : undefined,
      children: props.children
    })
  });
}
const writePermissions = new Set(['WRITE', 'ADMIN', 'MAINTAIN']);
function GitHubAppShellProvider(props) {
  var _repo, _repo3, _defaultBranchRef$tar, _currentBranchRef$tar, _currentBranchRef$tar2, _currentBranchRef$tar3, _repo5, _repo8, _repo9, _currentBranchRef$ass, _repo15, _repo16, _repo17, _data$repository3, _data$repository4, _repo18;
  const router = useRouter();
  const {
    data,
    error
  } = useContext(GitHubAppShellDataContext);
  let repo = data === null || data === void 0 ? void 0 : data.repository;
  if (repo && 'viewerPermission' in repo && repo.viewerPermission && !writePermissions.has(repo.viewerPermission) && 'forks' in repo) {
    var _repo$forks$nodes$, _repo$forks;
    repo = (_repo$forks$nodes$ = (_repo$forks = repo.forks) === null || _repo$forks === void 0 || (_repo$forks = _repo$forks.nodes) === null || _repo$forks === void 0 ? void 0 : _repo$forks[0]) !== null && _repo$forks$nodes$ !== void 0 ? _repo$forks$nodes$ : repo;
  }
  const defaultBranchRef = (_repo = repo) === null || _repo === void 0 || (_repo = _repo.refs) === null || _repo === void 0 || (_repo = _repo.nodes) === null || _repo === void 0 ? void 0 : _repo.find(x => {
    var _repo2;
    return (x === null || x === void 0 ? void 0 : x.name) === ((_repo2 = repo) === null || _repo2 === void 0 || (_repo2 = _repo2.defaultBranchRef) === null || _repo2 === void 0 ? void 0 : _repo2.name);
  });
  const currentBranchRef = (_repo3 = repo) === null || _repo3 === void 0 || (_repo3 = _repo3.refs) === null || _repo3 === void 0 || (_repo3 = _repo3.nodes) === null || _repo3 === void 0 ? void 0 : _repo3.find(x => (x === null || x === void 0 ? void 0 : x.name) === props.currentBranch);
  const defaultBranchTreeSha = (_defaultBranchRef$tar = defaultBranchRef === null || defaultBranchRef === void 0 ? void 0 : defaultBranchRef.target.tree.oid) !== null && _defaultBranchRef$tar !== void 0 ? _defaultBranchRef$tar : null;
  const currentBranchTreeSha = (_currentBranchRef$tar = currentBranchRef === null || currentBranchRef === void 0 ? void 0 : currentBranchRef.target.tree.oid) !== null && _currentBranchRef$tar !== void 0 ? _currentBranchRef$tar : null;
  const baseCommit = (_currentBranchRef$tar2 = currentBranchRef === null || currentBranchRef === void 0 || (_currentBranchRef$tar3 = currentBranchRef.target) === null || _currentBranchRef$tar3 === void 0 ? void 0 : _currentBranchRef$tar3.oid) !== null && _currentBranchRef$tar2 !== void 0 ? _currentBranchRef$tar2 : null;
  const defaultBranchTree = useGitHubTreeData(defaultBranchTreeSha, props.config);
  const currentBranchTree = useGitHubTreeData(currentBranchTreeSha, props.config);
  const allTreeData = useMemo(() => {
    const scopedDefault = mapDataState(defaultBranchTree, tree => scopeEntriesWithPathPrefix(tree, props.config));
    const scopedCurrent = mapDataState(currentBranchTree, tree => scopeEntriesWithPathPrefix(tree, props.config));
    return {
      unscopedDefault: currentBranchTree,
      scoped: {
        default: scopedDefault,
        current: scopedCurrent,
        merged: mergeDataStates({
          default: scopedDefault,
          current: scopedCurrent
        })
      }
    };
  }, [currentBranchTree, defaultBranchTree, props.config]);
  const changedData = useMemo(() => {
    if (allTreeData.scoped.merged.kind !== 'loaded') {
      return {
        collections: new Map(),
        singletons: new Set()
      };
    }
    return getChangedData(props.config, allTreeData.scoped.merged.data);
  }, [allTreeData, props.config]);
  useEffect(() => {
    var _error$response, _repo4;
    if ((error === null || error === void 0 || (_error$response = error.response) === null || _error$response === void 0 ? void 0 : _error$response.status) === 401) {
      if (isGitHubConfig(props.config)) {
        window.location.href = `/api/keystatic/github/login?from=${router.params.join('/')}`;
      } else {
        redirectToCloudAuth(router.params.join('/'), props.config);
      }
    }
    if (!((_repo4 = repo) !== null && _repo4 !== void 0 && _repo4.id) && error !== null && error !== void 0 && error.graphQLErrors.some(err => {
      var _err$originalError, _err$originalError2;
      return (err === null || err === void 0 || (_err$originalError = err.originalError) === null || _err$originalError === void 0 ? void 0 : _err$originalError.type) === 'NOT_FOUND' || (err === null || err === void 0 || (_err$originalError2 = err.originalError) === null || _err$originalError2 === void 0 ? void 0 : _err$originalError2.type) === 'FORBIDDEN';
    })) {
      window.location.href = `/api/keystatic/github/repo-not-found?from=${router.params.join('/')}`;
    }
  }, [error, router, (_repo5 = repo) === null || _repo5 === void 0 ? void 0 : _repo5.id, props.config]);
  const baseInfo = useMemo(() => {
    var _repo$id, _repo6, _repo$isPrivate, _repo7;
    return {
      baseCommit: baseCommit || '',
      repositoryId: (_repo$id = (_repo6 = repo) === null || _repo6 === void 0 ? void 0 : _repo6.id) !== null && _repo$id !== void 0 ? _repo$id : '',
      isPrivate: (_repo$isPrivate = (_repo7 = repo) === null || _repo7 === void 0 ? void 0 : _repo7.isPrivate) !== null && _repo$isPrivate !== void 0 ? _repo$isPrivate : true
    };
  }, [baseCommit, (_repo8 = repo) === null || _repo8 === void 0 ? void 0 : _repo8.id, (_repo9 = repo) === null || _repo9 === void 0 ? void 0 : _repo9.isPrivate]);
  const pullRequestNumber = currentBranchRef === null || currentBranchRef === void 0 || (_currentBranchRef$ass = currentBranchRef.associatedPullRequests.nodes) === null || _currentBranchRef$ass === void 0 || (_currentBranchRef$ass = _currentBranchRef$ass[0]) === null || _currentBranchRef$ass === void 0 ? void 0 : _currentBranchRef$ass.number;
  const branchInfo = useMemo(() => {
    var _repo$defaultBranchRe, _repo10, _repo$id2, _repo11, _repo$refs$nodes$map$, _repo12, _repo13, _repo14, _data$repository$owne, _data$repository, _data$repository$name, _data$repository2;
    return {
      defaultBranch: (_repo$defaultBranchRe = (_repo10 = repo) === null || _repo10 === void 0 || (_repo10 = _repo10.defaultBranchRef) === null || _repo10 === void 0 ? void 0 : _repo10.name) !== null && _repo$defaultBranchRe !== void 0 ? _repo$defaultBranchRe : '',
      currentBranch: props.currentBranch,
      baseCommit: baseCommit || '',
      repositoryId: (_repo$id2 = (_repo11 = repo) === null || _repo11 === void 0 ? void 0 : _repo11.id) !== null && _repo$id2 !== void 0 ? _repo$id2 : '',
      allBranches: (_repo$refs$nodes$map$ = (_repo12 = repo) === null || _repo12 === void 0 || (_repo12 = _repo12.refs) === null || _repo12 === void 0 || (_repo12 = _repo12.nodes) === null || _repo12 === void 0 ? void 0 : _repo12.map(x => x === null || x === void 0 ? void 0 : x.name).filter(isDefined)) !== null && _repo$refs$nodes$map$ !== void 0 ? _repo$refs$nodes$map$ : [],
      pullRequestNumber,
      branchNameToId: new Map((_repo13 = repo) === null || _repo13 === void 0 || (_repo13 = _repo13.refs) === null || _repo13 === void 0 || (_repo13 = _repo13.nodes) === null || _repo13 === void 0 ? void 0 : _repo13.filter(isDefined).map(x => [x.name, x.id])),
      branchNameToBaseCommit: new Map((_repo14 = repo) === null || _repo14 === void 0 || (_repo14 = _repo14.refs) === null || _repo14 === void 0 || (_repo14 = _repo14.nodes) === null || _repo14 === void 0 ? void 0 : _repo14.flatMap(x => x !== null && x !== void 0 && x.target ? [[x.name, x.target.oid]] : [])),
      mainOwner: (_data$repository$owne = data === null || data === void 0 || (_data$repository = data.repository) === null || _data$repository === void 0 ? void 0 : _data$repository.owner.login) !== null && _data$repository$owne !== void 0 ? _data$repository$owne : '',
      mainRepo: (_data$repository$name = data === null || data === void 0 || (_data$repository2 = data.repository) === null || _data$repository2 === void 0 ? void 0 : _data$repository2.name) !== null && _data$repository$name !== void 0 ? _data$repository$name : ''
    };
  }, [(_repo15 = repo) === null || _repo15 === void 0 || (_repo15 = _repo15.defaultBranchRef) === null || _repo15 === void 0 ? void 0 : _repo15.name, (_repo16 = repo) === null || _repo16 === void 0 ? void 0 : _repo16.id, (_repo17 = repo) === null || _repo17 === void 0 || (_repo17 = _repo17.refs) === null || _repo17 === void 0 ? void 0 : _repo17.nodes, props.currentBranch, baseCommit, pullRequestNumber, data === null || data === void 0 || (_data$repository3 = data.repository) === null || _data$repository3 === void 0 ? void 0 : _data$repository3.owner.login, data === null || data === void 0 || (_data$repository4 = data.repository) === null || _data$repository4 === void 0 ? void 0 : _data$repository4.name]);
  return /*#__PURE__*/jsx(RepoWithWriteAccessContext.Provider, {
    value: repo && (props.config.storage.kind === 'cloud' || 'viewerPermission' in repo && (_repo18 = repo) !== null && _repo18 !== void 0 && _repo18.viewerPermission && writePermissions.has(repo.viewerPermission)) ? {
      name: repo.name,
      owner: repo.owner.login
    } : null,
    children: /*#__PURE__*/jsx(AppShellErrorContext.Provider, {
      value: error,
      children: /*#__PURE__*/jsx(BranchInfoContext.Provider, {
        value: branchInfo,
        children: /*#__PURE__*/jsx(BaseInfoContext.Provider, {
          value: baseInfo,
          children: /*#__PURE__*/jsx(ChangedContext.Provider, {
            value: changedData,
            children: /*#__PURE__*/jsx(TreeContext.Provider, {
              value: allTreeData,
              children: props.children
            })
          })
        })
      })
    })
  });
}
const AppShellErrorContext = /*#__PURE__*/createContext(undefined);
const BaseInfoContext = /*#__PURE__*/createContext({
  baseCommit: '',
  repositoryId: '',
  isPrivate: true
});
const ChangedContext = /*#__PURE__*/createContext({
  collections: new Map(),
  singletons: new Set()
});
const TreeContext = /*#__PURE__*/createContext({
  unscopedDefault: {
    kind: 'loading'
  },
  scoped: {
    current: {
      kind: 'loading'
    },
    default: {
      kind: 'loading'
    },
    merged: {
      kind: 'loading'
    }
  }
});
function useTree() {
  return useContext(TreeContext).scoped;
}
function useCurrentUnscopedTree() {
  return useContext(TreeContext).unscopedDefault;
}
function useChanged() {
  return useContext(ChangedContext);
}
function useBaseCommit() {
  return useContext(BaseInfoContext).baseCommit;
}
function useIsRepoPrivate() {
  return useContext(BaseInfoContext).isPrivate;
}
function useRepositoryId() {
  return useContext(BaseInfoContext).repositoryId;
}
const Ref_base = gql`
  fragment Ref_base on Ref {
    id
    name
    target {
      __typename
      id
      oid
      ... on Commit {
        tree {
          id
          oid
        }
      }
    }
    associatedPullRequests(states: [OPEN], first: 1) {
      nodes {
        id
        number
      }
    }
  }
`;
const BaseRepo = gql`
  fragment Repo_base on Repository {
    id
    isPrivate
    owner {
      id
      login
    }
    name
    defaultBranchRef {
      id
      name
    }
    refs(refPrefix: "refs/heads/", first: 100) {
      nodes {
        ...Ref_base
      }
    }
  }
  ${Ref_base}
`;
const CloudAppShellQuery = gql`
  query CloudAppShell($name: String!, $owner: String!) {
    repository(owner: $owner, name: $name) {
      id
      ...Repo_base
    }
  }
  ${BaseRepo}
`;
const Repo_ghDirect = gql`
  fragment Repo_ghDirect on Repository {
    id
    ...Repo_base
    viewerPermission
  }
  ${BaseRepo}
`;
const Repo_primary = gql`
  fragment Repo_primary on Repository {
    id
    ...Repo_ghDirect
    forks(affiliations: [OWNER], first: 1) {
      nodes {
        ...Repo_ghDirect
      }
    }
  }
  ${Repo_ghDirect}
`;
const GitHubAppShellQuery = gql`
  query GitHubAppShell($name: String!, $owner: String!) {
    repository(owner: $owner, name: $name) {
      id
      ...Repo_primary
    }
    viewer {
      ...SidebarFooter_viewer
    }
  }
  ${Repo_primary}
  ${SidebarFooter_viewer}
`;
const treeCache = new LRU({
  max: 40
});
async function hydrateTreeCacheWithEntries(entries) {
  const data = {
    entries: new Map(entries.map(entry => [entry.path, entry])),
    tree: treeEntriesToTreeNodes(entries)
  };
  const sha = await treeSha(data.tree);
  treeCache.set(sha, data);
  return data;
}
function fetchGitHubTreeData(sha, config) {
  const cached = treeCache.get(sha);
  if (cached) return cached;
  const promise = getAuth(config).then(auth => {
    if (!auth) throw new Error('Not authorized');
    return fetch(config.storage.kind === 'github' ? `https://api.github.com/repos/${serializeRepoConfig(config.storage.repo)}/git/trees/${sha}?recursive=1` : `${KEYSTATIC_CLOUD_API_URL}/v1/github/trees/${sha}`, {
      headers: {
        Authorization: `Bearer ${auth.accessToken}`,
        ...(config.storage.kind === 'cloud' ? KEYSTATIC_CLOUD_HEADERS : {})
      }
    }).then(x => x.json());
  }).then(res => hydrateTreeCacheWithEntries(res.tree.map(({
    url,
    ...rest
  }) => rest)));
  treeCache.set(sha, promise);
  return promise;
}
function useGitHubTreeData(sha, config) {
  return useData(useCallback(() => sha ? fetchGitHubTreeData(sha, config) : LOADING, [sha, config]));
}
const RepoWithWriteAccessContext = /*#__PURE__*/createContext(null);
const BranchInfoContext = /*#__PURE__*/createContext({
  currentBranch: '',
  allBranches: [],
  defaultBranch: '',
  pullRequestNumber: undefined,
  branchNameToId: new Map(),
  branchNameToBaseCommit: new Map(),
  mainOwner: '',
  mainRepo: ''
});
function useBranchInfo() {
  return useContext(BranchInfoContext);
}
function getChangedData(config, trees) {
  var _config$collections, _config$singletons;
  return {
    collections: new Map(Object.keys((_config$collections = config.collections) !== null && _config$collections !== void 0 ? _config$collections : {}).map(collection => {
      const currentBranch = new Map(getEntriesInCollectionWithTreeKey(config, collection, trees.current.tree).map(x => [x.slug, x.key]));
      const defaultBranch = new Map(getEntriesInCollectionWithTreeKey(config, collection, trees.default.tree).map(x => [x.slug, x.key]));
      const changed = new Set();
      const added = new Set();
      for (const [key, entry] of currentBranch) {
        const defaultBranchEntry = defaultBranch.get(key);
        if (defaultBranchEntry === undefined) {
          added.add(key);
          continue;
        }
        if (entry !== defaultBranchEntry) {
          changed.add(key);
        }
      }
      const removed = new Set([...defaultBranch.keys()].filter(key => !currentBranch.has(key)));
      return [collection, {
        removed,
        added,
        changed,
        totalCount: currentBranch.size
      }];
    })),
    singletons: new Set(Object.keys((_config$singletons = config.singletons) !== null && _config$singletons !== void 0 ? _config$singletons : {}).filter(singleton => {
      var _getTreeNodeAtPath, _getTreeNodeAtPath2;
      const singletonPath = getSingletonPath(config, singleton);
      return ((_getTreeNodeAtPath = getTreeNodeAtPath(trees.current.tree, singletonPath)) === null || _getTreeNodeAtPath === void 0 ? void 0 : _getTreeNodeAtPath.entry.sha) !== ((_getTreeNodeAtPath2 = getTreeNodeAtPath(trees.default.tree, singletonPath)) === null || _getTreeNodeAtPath2 === void 0 ? void 0 : _getTreeNodeAtPath2.entry.sha);
    }))
  };
}

const SIDE_PANEL_ID = 'keystatic-side-panel';
const MAIN_PANEL_ID = 'keystatic-main-panel';

const View = props => {
  return /*#__PURE__*/jsx(Box, {
    height: "100%",
    minHeight: 0,
    minWidth: 0,
    ...props
  });
};
const ScrollView = props => {
  let {
    isDisabled,
    ...otherProps
  } = props;
  return /*#__PURE__*/jsx(View, {
    "data-scrollable": isDisabled ? undefined : true,
    UNSAFE_className: css({
      '&[data-scrollable]': {
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch'
      }
    }),
    ...otherProps
  });
};

// Config context
// -----------------------------------------------------------------------------
const ConfigContext = /*#__PURE__*/createContext(null);
function useConfig() {
  const config = useContext(ConfigContext);
  if (!config) {
    throw new Error('ConfigContext.Provider not found');
  }
  return config;
}

// Meta context
// -----------------------------------------------------------------------------
const AppStateContext = /*#__PURE__*/createContext({
  basePath: '/keystatic'
});
function useAppState() {
  const appState = useContext(AppStateContext);
  if (!appState) {
    throw new Error('AppStateContext.Provider not found');
  }
  return appState;
}

// Page context
// -----------------------------------------------------------------------------
const ContentPanelContext = /*#__PURE__*/createContext('mobile');
const ContentPanelProvider = ContentPanelContext.Provider;
function useContentPanelSize() {
  return useContext(ContentPanelContext);
}
function useContentPanelQuery(options) {
  const sizes = ['mobile', 'tablet', 'desktop', 'wide'];
  const size = useContentPanelSize();
  const startIndex = 'above' in options ? sizes.indexOf(options.above) + 1 : 0;
  const endIndex = 'below' in options ? sizes.indexOf(options.below) - 1 : sizes.length - 1;
  const range = sizes.slice(startIndex, endIndex + 1);
  return range.includes(size);
}

/** @private only used to initialize context */
function useContentPanelState(ref) {
  let [contentSize, setContentSize] = useState('mobile');
  const onResize = () => {
    setContentSize(size => {
      let contentPane = ref.current;
      if (!contentPane) {
        return size;
      }
      if (contentPane.offsetWidth >= breakpoints.wide) {
        return 'wide';
      }
      if (contentPane.offsetWidth >= breakpoints.desktop) {
        return 'desktop';
      }
      if (contentPane.offsetWidth >= breakpoints.tablet) {
        return 'tablet';
      }
      return 'mobile';
    });
  };
  useResizeObserver({
    ref,
    onResize
  });
  return contentSize;
}

function useNavItems() {
  var _config$ui;
  let {
    basePath
  } = useAppState();
  let config = useConfig();
  let stringFormatter = useLocalizedStringFormatter(l10nMessages);
  let changeMap = useChanged();
  const collectionKeys = Object.keys(config.collections || {});
  const singletonKeys = Object.keys(config.singletons || {});
  const items = ((_config$ui = config.ui) === null || _config$ui === void 0 ? void 0 : _config$ui.navigation) || {
    ...(!!collectionKeys.length && {
      [stringFormatter.format('collections')]: collectionKeys
    }),
    ...(!!singletonKeys.length && {
      [stringFormatter.format('singletons')]: singletonKeys
    })
  };
  const options = {
    basePath,
    changeMap,
    config
  };
  if (Array.isArray(items)) {
    return items.map(key => populateItemData(key, options));
  }
  return Object.entries(items).map(([section, keys]) => ({
    title: section,
    children: keys.map(key => populateItemData(key, options))
  }));
}
function populateItemData(key, options) {
  let {
    basePath,
    changeMap,
    config
  } = options;

  // divider
  if (key === NAVIGATION_DIVIDER_KEY) {
    return {
      isDivider: true
    };
  }

  // collection
  if (config.collections && key in config.collections) {
    const href = `${basePath}/collection/${encodeURIComponent(key)}`;
    const changes = changeMap.collections.get(key);
    const changed = changes ? changes.changed.size + changes.added.size + changes.removed.size : 0;
    const label = config.collections[key].label;
    return {
      key,
      href,
      label,
      changed,
      entryCount: changes === null || changes === void 0 ? void 0 : changes.totalCount
    };
  }

  // singleton
  if (config.singletons && key in config.singletons) {
    const href = `${basePath}/singleton/${encodeURIComponent(key)}`;
    const changed = changeMap.singletons.has(key);
    const label = config.singletons[key].label;
    return {
      key,
      href,
      label,
      changed
    };
  }
  throw new Error(`Unknown navigation key: "${key}".`);
}

function useBrand() {
  var _config$ui, _config$ui2;
  let {
    colorScheme
  } = useProvider();
  let config = useConfig();
  let prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  let brandMark = /*#__PURE__*/jsx(ZapLogo, {});
  let brandName = 'Keystatic';
  if ((_config$ui = config.ui) !== null && _config$ui !== void 0 && (_config$ui = _config$ui.brand) !== null && _config$ui !== void 0 && _config$ui.mark) {
    let BrandMark = config.ui.brand.mark;
    let resolvedColorScheme = colorScheme === 'auto' ? prefersDark ? 'dark' : 'light' : colorScheme;
    brandMark = /*#__PURE__*/jsx(BrandMark, {
      colorScheme: resolvedColorScheme
    });
  }
  if ('repo' in config.storage) {
    brandName = serializeRepoConfig(config.storage.repo);
  }
  if (config.cloud) {
    brandName = config.cloud.project;
  }
  if ((_config$ui2 = config.ui) !== null && _config$ui2 !== void 0 && (_config$ui2 = _config$ui2.brand) !== null && _config$ui2 !== void 0 && _config$ui2.name) {
    brandName = config.ui.brand.name;
  }
  return {
    brandMark,
    brandName
  };
}
function ZapLogo() {
  let id = 'brand-mark-gradient';
  let size = 24;
  return /*#__PURE__*/jsxs("svg", {
    width: size,
    height: size,
    viewBox: "0 0 32 32",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    children: [/*#__PURE__*/jsx("path", {
      d: "M18 8L14 24L12 32L30 14L18 8Z",
      fill: "currentColor"
    }), /*#__PURE__*/jsx("path", {
      d: "M2 18L20 0L18 8L2 18Z",
      fill: "currentColor"
    }), /*#__PURE__*/jsx("path", {
      d: "M18 8L2 18L14 24L18 8Z",
      fill: `url(#${id})`
    }), /*#__PURE__*/jsx("defs", {
      children: /*#__PURE__*/jsxs("linearGradient", {
        id: id,
        x1: "2",
        y1: "18",
        x2: "20",
        y2: "14",
        gradientUnits: "userSpaceOnUse",
        children: [/*#__PURE__*/jsx("stop", {
          stopColor: "currentColor",
          stopOpacity: "0.2"
        }), /*#__PURE__*/jsx("stop", {
          offset: "1",
          stopColor: "currentColor"
        })]
      })
    })]
  });
}

function BranchPicker() {
  const {
    allBranches,
    currentBranch,
    defaultBranch
  } = useContext(BranchInfoContext);
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);
  const router = useRouter();
  const config = useConfig();
  const branchPrefix = getBranchPrefix(config);
  const items = useMemo(() => {
    let defaultItems = allBranches.map(name => ({
      id: name,
      name
    }));
    if (defaultBranch) {
      return [{
        id: defaultBranch,
        name: defaultBranch,
        description: stringFormatter.format('defaultBranch')
      }, ...defaultItems.filter(i => i.name !== defaultBranch)];
    }
    return defaultItems;
  }, [allBranches, defaultBranch, stringFormatter]);
  const filteredBranches = useMemo(() => items.filter(item => item.name === defaultBranch || !branchPrefix || item.name.startsWith(branchPrefix) || item.name === currentBranch), [branchPrefix, currentBranch, defaultBranch, items]);
  return /*#__PURE__*/jsx(Combobox, {
    "aria-label": stringFormatter.format('currentBranch'),
    defaultItems: filteredBranches // use `defaultItems` so the component handles filtering
    ,
    loadingState: filteredBranches.length === 0 ? 'loading' : undefined,
    selectedKey: currentBranch,
    onSelectionChange: key => {
      if (typeof key === 'string') {
        router.push(router.href.replace(/\/branch\/[^/]+/, '/branch/' + encodeURIComponent(key)));
      }
    },
    menuTrigger: "focus",
    flex: true,
    children: item => /*#__PURE__*/jsxs(Item, {
      textValue: item.name,
      children: [/*#__PURE__*/jsx(Icon, {
        src: gitBranchIcon
      }), /*#__PURE__*/jsx(Text, {
        truncate: true,
        children: item.name
      }), 'description' in item && /*#__PURE__*/jsx(Text, {
        slot: "description",
        children: item.description
      })]
    }, item.id)
  });
}
function CreateBranchDialog(props) {
  const config = useConfig();
  const branchInfo = useContext(BranchInfoContext);
  const isDefaultBranch = branchInfo.defaultBranch === branchInfo.currentBranch;
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);
  const [{
    error,
    fetching
  }, createBranch] = useCreateBranchMutation();
  const repositoryId = useRepositoryId();
  const createBranchSubmitButtonId = 'create-branch-submit-button';
  const [branchName, setBranchName] = useState('');
  const [baseBranch, setBaseBranch] = useState(branchInfo.defaultBranch);
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
    size: "small",
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
            oid: branchInfo.branchNameToBaseCommit.get(baseBranch),
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
        children: isDefaultBranch ? /*#__PURE__*/jsx(TextField, {
          value: branchName,
          onChange: setBranchName,
          label: stringFormatter.format('branchName')
          // description="Your new branch will be based on the currently checked out branch, which is the default branch for this repository."
          ,
          autoFocus: true,
          errorMessage: prettyErrorForCreateBranchMutation(error),
          ...propsForBranchPrefix
        }) : /*#__PURE__*/jsxs(Grid, {
          gap: "xlarge",
          children: [/*#__PURE__*/jsx(TextField, {
            label: stringFormatter.format('branchName'),
            value: branchName,
            onChange: setBranchName,
            autoFocus: true,
            errorMessage: prettyErrorForCreateBranchMutation(error),
            ...propsForBranchPrefix
          }), /*#__PURE__*/jsxs(RadioGroup, {
            label: stringFormatter.format('basedOn'),
            value: baseBranch,
            onChange: setBaseBranch,
            children: [/*#__PURE__*/jsxs(Radio, {
              value: branchInfo.defaultBranch,
              children: [/*#__PURE__*/jsxs(Text, {
                children: [branchInfo.defaultBranch, /*#__PURE__*/jsx(Text, {
                  visuallyHidden: true,
                  children: "."
                })]
              }), /*#__PURE__*/jsx(Text, {
                slot: "description",
                children: stringFormatter.format('theDefaultBranchInYourRepository')
              })]
            }), /*#__PURE__*/jsxs(Radio, {
              value: branchInfo.currentBranch,
              children: [/*#__PURE__*/jsxs(Text, {
                children: [branchInfo.currentBranch, /*#__PURE__*/jsx(Text, {
                  visuallyHidden: true,
                  children: "."
                })]
              }), /*#__PURE__*/jsx(Text, {
                slot: "description",
                children: stringFormatter.format('theCurrentlyCheckedOutBranch')
              })]
            })]
          })]
        })
      }), /*#__PURE__*/jsx(Footer, {
        UNSAFE_style: {
          justifyContent: 'flex-end'
        },
        children: fetching && /*#__PURE__*/jsx(ProgressCircle, {
          "aria-labelledby": createBranchSubmitButtonId,
          isIndeterminate: true,
          size: "small"
        })
      }), /*#__PURE__*/jsxs(ButtonGroup, {
        children: [/*#__PURE__*/jsx(Button, {
          onPress: props.onDismiss,
          isDisabled: fetching,
          children: stringFormatter.format('cancel')
        }), /*#__PURE__*/jsx(Button, {
          isDisabled: fetching,
          prominence: "high",
          type: "submit",
          id: createBranchSubmitButtonId,
          children: stringFormatter.format('create')
        })]
      })]
    })
  });
}

// Data
// -----------------------------------------------------------------------------

// https://git-scm.com/docs/git-check-ref-format
const invalidAnywhere = [' ', '~', '^', ':', '*', '?', '[', '..', '@{', '\\'];
const invalidStart = ['.', '/'];
const invalidEnd = ['.', '/', '.lock'];
function prettyErrorForCreateBranchMutation(error) {
  if (!error) {
    return undefined;
  }
  if (error.message.includes('is not a valid ref name')) {
    let refnameMatch = error.message.match(/"([^"]+)"/);
    let branchname = refnameMatch ? refnameMatch[1].replace('refs/heads/', '') : '';

    // start rules
    for (let char of invalidStart) {
      if (branchname.startsWith(char)) {
        return `Cannot start with "${char}"`;
      }
    }

    // end rules
    for (let char of invalidEnd) {
      if (branchname.endsWith(char)) {
        return `Cannot end with "${char}"`;
      }
    }

    // anywhere rules
    let invalidMatches = invalidAnywhere.filter(c => branchname.includes(c));
    if (invalidMatches.length > 0) {
      let options = {
        style: 'long',
        type: 'conjunction'
      };
      let formatter = new Intl.ListFormat('en-US', options);
      let list = invalidMatches.map(char => `"${char}"`);
      return `Some characters are not allowed: ${formatter.format(list)}`;
    }

    // unknown
    return 'Invalid branch name';
  }
  return error.message;
}
function useCreateBranchMutation() {
  return useMutation(gql`
      mutation CreateBranch($input: CreateRefInput!) {
        createRef(input: $input) {
          __typename
          ref {
            ...Ref_base
          }
        }
      }
      ${Ref_base}
    `);
}

const ThemeContext = /*#__PURE__*/createContext({
  theme: 'auto',
  setTheme: () => {
    throw new Error('ThemeContext was not initialized.');
  }
});
const ThemeProvider = ThemeContext.Provider;
const STORAGE_KEY = 'keystatic-color-scheme';

// only for initializing the provider, for consumption use `useThemeContext()`
function useTheme() {
  let [theme, setThemeValue] = useState(() => {
    let storedValue = localStorage.getItem(STORAGE_KEY);
    if (storedValue === 'light' || storedValue === 'dark') {
      return storedValue;
    }
    return 'auto';
  });
  let setTheme = theme => {
    localStorage.setItem(STORAGE_KEY, theme);
    setThemeValue(theme);
  };
  return {
    theme,
    setTheme
  };
}
function useThemeContext() {
  return useContext(ThemeContext);
}

function focusWithPreviousSelection(editor) {
  const selection = window.getSelection();
  if (selection) {
    selection.removeAllRanges();
    selection.addRange(ReactEditor.toDOMRange(editor, editor.selection));
  }
  ReactEditor.focus(editor);
}
const blockElementSpacing = css({
  marginBlock: '0.75em',
  '&:first-child': {
    marginBlockStart: 0
  },
  '&:last-child': {
    marginBlockEnd: 0
  }
});
const ForceValidationContext = /*#__PURE__*/React__default.createContext(false);
ForceValidationContext.Provider;

// this ensures that when changes happen, they are immediately shown
// this stops the problem of a cursor resetting to the end when a change is made
// because the changes are applied asynchronously
function useElementWithSetNodes(editor, element) {
  const [state, setState] = useState({
    element,
    elementWithChanges: element
  });
  if (state.element !== element) {
    setState({
      element,
      elementWithChanges: element
    });
  }
  const elementRef = useRef(element);
  useEffect(() => {
    elementRef.current = element;
  });
  const setNodes = useCallback(changesOrCallback => {
    const currentElement = elementRef.current;
    const changes = typeof changesOrCallback === 'function' ? changesOrCallback(currentElement) : changesOrCallback;
    Transforms.setNodes(editor, changes, {
      at: ReactEditor.findPath(editor, currentElement)
    });
    setState({
      element: currentElement,
      elementWithChanges: {
        ...currentElement,
        ...changes
      }
    });
  }, [editor]);
  return [state.elementWithChanges, setNodes];
}
function useEventCallback(callback) {
  const callbackRef = useRef(callback);
  const cb = useCallback((...args) => {
    return callbackRef.current(...args);
  }, []);
  useEffect(() => {
    callbackRef.current = callback;
  });
  return cb;
}
function insertNodesButReplaceIfSelectionIsAtEmptyParagraphOrHeading(editor, nodes) {
  var _pathRefForEmptyNodeA;
  let pathRefForEmptyNodeAtCursor;
  const entry = Editor.above(editor, {
    match: node => node.type === 'heading' || node.type === 'paragraph'
  });
  if (entry && Node.string(entry[0]) === '') {
    pathRefForEmptyNodeAtCursor = Editor.pathRef(editor, entry[1]);
  }
  Transforms.insertNodes(editor, nodes);
  let path = (_pathRefForEmptyNodeA = pathRefForEmptyNodeAtCursor) === null || _pathRefForEmptyNodeA === void 0 ? void 0 : _pathRefForEmptyNodeA.unref();
  if (path) {
    Transforms.removeNodes(editor, {
      at: path
    });
    // even though the selection is in the right place after the removeNodes
    // for some reason the editor blurs so we need to focus it again
    ReactEditor.focus(editor);
  }
}

const BlockPopoverContext = /*#__PURE__*/createContext(null);
function useBlockPopoverContext() {
  const context = useContext(BlockPopoverContext);
  if (!context) {
    throw new Error('useBlockPopoverContext must be used within a BlockPopoverTrigger');
  }
  return context;
}
const typeMatcher = nodeTypeMatcher('code', 'component-block', 'image', 'layout', 'link', 'table', 'heading');
const ActiveBlockPopoverContext = /*#__PURE__*/createContext(undefined);
function useActiveBlockPopover() {
  return useContext(ActiveBlockPopoverContext);
}
function ActiveBlockPopoverProvider(props) {
  const nodeWithPopover = Editor.above(props.editor, {
    match: typeMatcher
  });
  return /*#__PURE__*/jsx(ActiveBlockPopoverContext.Provider, {
    value: nodeWithPopover === null || nodeWithPopover === void 0 ? void 0 : nodeWithPopover[0],
    children: props.children
  });
}
const BlockPopoverTrigger = ({
  children,
  element
}) => {
  const [trigger, popover] = children;
  const activePopoverElement = useActiveBlockPopover();
  const triggerRef = useRef(null);
  const state = useOverlayTriggerState({
    isOpen: activePopoverElement === element
  });
  const context = useMemo(() => ({
    state,
    triggerRef
  }), [state, triggerRef]);
  return /*#__PURE__*/jsxs(BlockPopoverContext.Provider, {
    value: context,
    children: [/*#__PURE__*/cloneElement(trigger, {
      ref: triggerRef
    }), popover]
  });
};
function BlockPopover(props) {
  const {
    state
  } = useBlockPopoverContext();
  let wrapperRef = useRef(null);
  return (
    /*#__PURE__*/
    /* @ts-expect-error FIXME: resolve ref inconsistencies */
    jsx(Overlay, {
      isOpen: state.isOpen,
      nodeRef: wrapperRef,
      children: /*#__PURE__*/jsx(BlockPopoverWrapper, {
        wrapperRef: wrapperRef,
        ...props
      })
    })
  );
}
const BlockPopoverWrapper = ({
  children,
  placement: preferredPlacement = 'bottom'
}) => {
  let popoverRef = useRef(null);
  let {
    state,
    triggerRef
  } = useBlockPopoverContext();
  let {
    placement,
    popoverProps
  } = useBlockPopover({
    isNonModal: true,
    isKeyboardDismissDisabled: false,
    placement: preferredPlacement,
    triggerRef,
    popoverRef
  }, state);
  return /*#__PURE__*/jsx("div", {
    ref: popoverRef,
    ...popoverProps,
    "data-open": state.isOpen,
    "data-placement": placement,
    contentEditable: false,
    className: css({
      backgroundColor: tokenSchema.color.background.surface,
      // TODO: component token?
      borderRadius: tokenSchema.size.radius.medium,
      // TODO: component token?
      border: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.border.emphasis}`,
      boxSizing: 'content-box',
      // resolves measurement/scroll issues related to border
      // boxShadow: `0 0 0 ${tokenSchema.size.border.regular} ${tokenSchema.color.border.emphasis}`,
      minHeight: tokenSchema.size.element.regular,
      minWidth: tokenSchema.size.element.regular,
      opacity: 0,
      outline: 0,
      pointerEvents: 'auto',
      position: 'absolute',
      // use filter:drop-shadow instead of box-shadow so the arrow is included
      filter: `drop-shadow(0 1px 4px ${tokenSchema.color.shadow.regular})`,
      // filter bug in safari: https://stackoverflow.com/questions/56478925/safari-drop-shadow-filter-remains-visible-even-with-hidden-element
      willChange: 'filter',
      userSelect: 'none',
      // placement
      '&[data-placement="top"]': {
        marginBottom: tokenSchema.size.space.regular,
        transform: `translateY(${tokenSchema.size.space.regular})`
      },
      '&[data-placement="bottom"]': {
        marginTop: tokenSchema.size.space.regular,
        transform: `translateY(calc(${tokenSchema.size.space.regular} * -1))`
      },
      '&[data-open="true"]': {
        opacity: 1,
        transform: `translateX(0) translateY(0)`,
        // enter animation
        transition: transition(['opacity', 'transform'], {
          easing: 'easeOut'
        })
      }
    }),
    children: typeof children === 'function' ? children(state.close) : children
  });
};

/**
 * Provides the behavior and accessibility implementation for a popover component.
 * A popover is an overlay element positioned relative to a trigger.
 */
function useBlockPopover(props, state) {
  var _triggerRef$current2;
  let {
    triggerRef,
    popoverRef,
    isNonModal,
    isKeyboardDismissDisabled,
    ...otherProps
  } = props;
  let [isSticky, setSticky] = useState(false);
  let {
    overlayProps,
    underlayProps
  } = useOverlay({
    isOpen: state.isOpen,
    onClose: state.close,
    shouldCloseOnBlur: true,
    isDismissable: !isNonModal,
    isKeyboardDismissDisabled: false
  }, popoverRef);

  // stick the popover to the bottom of the viewport instead of flipping
  const containerPadding = 8;
  useEffect(() => {
    if (state.isOpen) {
      const checkForStickiness = () => {
        var _popoverRef$current, _triggerRef$current;
        const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
        let popoverRect = (_popoverRef$current = popoverRef.current) === null || _popoverRef$current === void 0 ? void 0 : _popoverRef$current.getBoundingClientRect();
        let triggerRect = (_triggerRef$current = triggerRef.current) === null || _triggerRef$current === void 0 ? void 0 : _triggerRef$current.getBoundingClientRect();
        if (popoverRect && triggerRect) {
          setSticky(triggerRect.bottom + popoverRect.height + containerPadding * 2 > vh && triggerRect.top < vh);
        }
      };
      checkForStickiness();
      window.addEventListener('scroll', checkForStickiness);
      return () => {
        checkForStickiness();
        window.removeEventListener('scroll', checkForStickiness);
      };
    }
  }, [popoverRef, triggerRef, state.isOpen]);
  let {
    overlayProps: positionProps,
    arrowProps,
    placement,
    updatePosition
  } = useOverlayPosition({
    ...otherProps,
    containerPadding,
    shouldFlip: false,
    targetRef: triggerRef,
    overlayRef: popoverRef,
    isOpen: state.isOpen,
    onClose: undefined
  });

  // force update position when the trigger changes
  let previousBoundingRect = usePrevious((_triggerRef$current2 = triggerRef.current) === null || _triggerRef$current2 === void 0 ? void 0 : _triggerRef$current2.getBoundingClientRect());
  useLayoutEffect(() => {
    if (previousBoundingRect) {
      var _triggerRef$current3;
      const currentBoundingRect = (_triggerRef$current3 = triggerRef.current) === null || _triggerRef$current3 === void 0 ? void 0 : _triggerRef$current3.getBoundingClientRect();
      if (currentBoundingRect) {
        const hasChanged = previousBoundingRect.height !== currentBoundingRect.height || previousBoundingRect.width !== currentBoundingRect.width || previousBoundingRect.x !== currentBoundingRect.x || previousBoundingRect.y !== currentBoundingRect.y;
        if (hasChanged) {
          updatePosition();
        }
      }
    }
  }, [previousBoundingRect, triggerRef, updatePosition]);

  // make sure popovers are below modal dialogs and their blanket
  if (positionProps.style) {
    positionProps.style.zIndex = 1;
  }

  // switching to position: fixed will undoubtedly bite me later, but this hack works for now
  if (isSticky) {
    positionProps.style = {
      ...positionProps.style,
      // @ts-expect-error
      maxHeight: null,
      position: 'fixed',
      // @ts-expect-error
      top: null,
      bottom: containerPadding
    };
  }
  return {
    arrowProps,
    placement,
    popoverProps: mergeProps(overlayProps, positionProps),
    underlayProps,
    updatePosition
  };
}
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const BlockWrapper = props => {
  let {
    attributes,
    children,
    draggable = false
  } = props;
  return /*#__PURE__*/jsx("div", {
    draggable: draggable,
    className: blockElementSpacing,
    ...attributes,
    children: children
  });
};

const NotEditable = /*#__PURE__*/forwardRef(function NotEditable({
  className,
  ...props
}, ref) {
  return /*#__PURE__*/jsx("div", {
    ...props,
    ref: ref,
    className: [css({
      userSelect: 'none',
      whiteSpace: 'initial'
    }), className].join(' '),
    contentEditable: false
  });
});

const ToolbarSeparator = () => {
  return /*#__PURE__*/jsx(Divider, {
    orientation: "vertical",
    flexShrink: 0
  });
};

z.object({
  src: z.string(),
  alt: z.string(),
  width: z.number(),
  height: z.number()
});
function useImageLibraryURL() {
  const config = useConfig();
  const split = getSplitCloudProject(config);
  if (!split) return 'https://keystatic.cloud/';
  return `https://keystatic.cloud/teams/${split.team}/project/${split.project}/images`;
}

// Theme controls
// -----------------------------------------------------------------------------
const THEME_MODE = {
  light: {
    icon: sunIcon,
    label: 'Light'
  },
  dark: {
    icon: moonIcon,
    label: 'Dark'
  },
  auto: {
    icon: monitorIcon,
    label: 'System'
  }
};
const themeItems = Object.entries(THEME_MODE).map(([id, {
  icon,
  label
}]) => ({
  id,
  icon,
  label
}));
function ThemeMenu() {
  let {
    theme,
    setTheme
  } = useThemeContext();
  let matchesDark = useMediaQuery('(prefers-color-scheme: dark)');
  let icon = THEME_MODE[theme].icon;
  if (theme === 'auto') {
    icon = matchesDark ? moonIcon : sunIcon;
  }
  return /*#__PURE__*/jsxs(MenuTrigger, {
    align: "end",
    children: [/*#__PURE__*/jsx(ActionButton, {
      "aria-label": "theme",
      prominence: "low",
      children: /*#__PURE__*/jsx(Icon, {
        src: icon
      })
    }), /*#__PURE__*/jsx(Menu, {
      items: themeItems,
      onSelectionChange: ([key]) => setTheme(key),
      disallowEmptySelection: true,
      selectedKeys: [theme],
      selectionMode: "single",
      children: item => /*#__PURE__*/jsxs(Item$1, {
        textValue: item.label,
        children: [/*#__PURE__*/jsx(Icon, {
          src: item.icon
        }), /*#__PURE__*/jsx(Text, {
          children: item.label
        })]
      })
    })]
  });
}

// User controls
// -----------------------------------------------------------------------------
function UserActions() {
  let config = useConfig();
  let userData = useUserData();
  let router = useRouter();
  if (!userData) {
    return null;
  }
  if (userData === 'unauthorized') {
    return /*#__PURE__*/jsx(ActionButton, {
      onPress: () => {
        redirectToCloudAuth(router.params.join('/'), config);
      },
      flex: true,
      children: "Sign into Cloud"
    });
  }
  return /*#__PURE__*/jsx(UserMenu, {
    ...userData
  });
}
function UserMenu(user) {
  let config = useConfig();
  const cloudInfo = useCloudInfo();
  const imageLibraryUrl = useImageLibraryURL();
  const menuItems = useMemo(() => {
    var _config$cloud;
    let items = [{
      key: 'logout',
      label: 'Log out',
      icon: logOutIcon
    }];
    if ((_config$cloud = config.cloud) !== null && _config$cloud !== void 0 && _config$cloud.project) {
      items.unshift({
        key: 'manage',
        label: 'Account',
        icon: userIcon,
        href: 'https://keystatic.cloud/account',
        target: '_blank',
        rel: 'noopener noreferrer'
      });
    }
    if (cloudInfo !== null && cloudInfo !== void 0 && cloudInfo.team.images) {
      items.unshift({
        key: 'image-library',
        label: 'Image library',
        icon: imageIcon,
        href: imageLibraryUrl,
        target: '_blank',
        rel: 'noopener noreferrer'
      });
    }
    return items;
  }, [cloudInfo, config, imageLibraryUrl]);
  if (!user) {
    return null;
  }
  return /*#__PURE__*/jsxs(MenuTrigger, {
    children: [/*#__PURE__*/jsx(UserDetailsButton, {
      ...user
    }), /*#__PURE__*/jsx(Fragment, {
      children: /*#__PURE__*/jsx(Menu, {
        items: menuItems,
        minWidth: "scale.2400",
        onAction: key => {
          switch (key) {
            case 'logout':
              switch (config.storage.kind) {
                case 'github':
                  window.location.href = '/api/keystatic/github/logout';
                  break;
                case 'cloud':
                case 'local':
                  localStorage.removeItem('keystatic-cloud-access-token');
                  window.location.reload();
                  break;
              }
          }
        },
        children: item => /*#__PURE__*/jsxs(Item$1, {
          textValue: item.label,
          href: item.href,
          rel: item.rel,
          target: item.target,
          children: [/*#__PURE__*/jsx(Icon, {
            src: item.icon
          }), /*#__PURE__*/jsx(Text, {
            children: item.label
          })]
        }, item.key)
      })
    })]
  });
}
const UserDetailsButton = /*#__PURE__*/forwardRef(function UserDetailsButton(props, ref) {
  let {
    avatarUrl,
    login,
    name,
    ...otherProps
  } = props;
  return /*#__PURE__*/jsx(ActionButton, {
    ...otherProps,
    ref: ref,
    "aria-label": "User menu",
    prominence: "low",
    flexGrow: 1,
    UNSAFE_className: css({
      justifyContent: 'start',
      textAlign: 'start'
    }),
    children: /*#__PURE__*/jsxs(Flex, {
      alignItems: "center",
      gap: "regular",
      children: [/*#__PURE__*/jsx(Avatar, {
        src: avatarUrl,
        name: name !== null && name !== void 0 ? name : undefined,
        size: "small"
      }), /*#__PURE__*/jsx(ClearSlots, {
        children: /*#__PURE__*/jsxs(Flex, {
          direction: "column",
          gap: "small",
          children: [/*#__PURE__*/jsx(Text, {
            size: "small",
            weight: "semibold",
            color: "neutralEmphasis",
            children: name
          }), name === login ? null : /*#__PURE__*/jsx(Text, {
            size: "small",
            color: "neutralTertiary",
            children: login
          })]
        })
      })]
    })
  });
});

// Git controls
// -----------------------------------------------------------------------------

function GitMenu() {
  var _appShellData$data, _appShellData$data$re;
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);
  const data = useContext(BranchInfoContext);
  const [newBranchDialogVisible, toggleNewBranchDialog] = useReducer(v => !v, false);
  const [deleteBranchDialogVisible, toggleDeleteBranchDialog] = useReducer(v => !v, false);
  const [, deleteBranch] = useMutation(gql`
      mutation DeleteBranch($refId: ID!) {
        deleteRef(input: { refId: $refId }) {
          __typename
        }
      }
    `);
  const repoURL = getRepoUrl(data);
  const appShellData = useContext(GitHubAppShellDataContext);
  const fork = (appShellData === null || appShellData === void 0 || (_appShellData$data = appShellData.data) === null || _appShellData$data === void 0 ? void 0 : _appShellData$data.repository) && 'forks' in appShellData.data.repository && ((_appShellData$data$re = appShellData.data.repository.forks.nodes) === null || _appShellData$data$re === void 0 ? void 0 : _appShellData$data$re[0]);
  const gitMenuItems = useMemo(() => {
    let isDefaultBranch = data.currentBranch === data.defaultBranch;
    let items = [];
    let branchSection = [{
      key: 'new-branch',
      icon: gitBranchPlusIcon,
      label: stringFormatter.format('newBranch')
    }];
    let prSection = [];
    let repoSection = [{
      key: 'repo',
      icon: githubIcon,
      href: repoURL,
      target: '_blank',
      rel: 'noopener noreferrer',
      label: 'Github repo' // TODO: l10n
    }];

    if (!isDefaultBranch) {
      if (data.pullRequestNumber === undefined) {
        prSection.push({
          key: 'create-pull-request',
          icon: gitPullRequestIcon,
          href: `${repoURL}/pull/new/${data.currentBranch}`,
          target: '_blank',
          rel: 'noopener noreferrer',
          label: stringFormatter.format('createPullRequest')
        });
      } else {
        prSection.push({
          key: 'view-pull-request',
          icon: gitPullRequestIcon,
          href: `${repoURL}/pull/${data.pullRequestNumber}`,
          target: '_blank',
          rel: 'noopener noreferrer',
          label: `Pull Request #${data.pullRequestNumber}`
        });
      }
      if (data.pullRequestNumber === undefined) {
        branchSection.push({
          key: 'delete-branch',
          icon: trash2Icon,
          label: stringFormatter.format('deleteBranch')
        });
      }
    }
    if (fork) {
      repoSection.push({
        key: 'fork',
        icon: gitForkIcon,
        href: `https://github.com/${fork.owner.login}/${fork.name}`,
        target: '_blank',
        rel: 'noopener noreferrer',
        label: 'View fork' // TODO: l10n
      });
    }

    if (branchSection.length) {
      items.push({
        key: 'branch-section',
        label: stringFormatter.format('branches'),
        children: branchSection
      });
    }
    if (prSection.length) {
      items.push({
        key: 'pr-section',
        label: stringFormatter.format('pullRequests'),
        children: prSection
      });
    }
    if (repoSection.length) {
      items.push({
        key: 'repo-section',
        label: 'Repository',
        // TODO: l10n
        children: repoSection
      });
    }
    return items;
  }, [fork, data.currentBranch, data.defaultBranch, data.pullRequestNumber, repoURL, stringFormatter]);
  const router = useRouter();
  return /*#__PURE__*/jsxs(Fragment, {
    children: [/*#__PURE__*/jsx(ActionMenu, {
      "aria-label": "git actions",
      align: "end",
      items: gitMenuItems,
      onAction: key => {
        switch (key) {
          case 'new-branch':
            toggleNewBranchDialog();
            break;
          case 'delete-branch':
            {
              toggleDeleteBranchDialog();
              break;
            }
        }
      },
      children: item => /*#__PURE__*/jsx(Section, {
        items: item.children,
        "aria-label": item.label,
        children: item => /*#__PURE__*/jsxs(Item$1, {
          textValue: item.label,
          href: item.href,
          rel: item.rel,
          target: item.target,
          children: [/*#__PURE__*/jsx(Icon, {
            src: item.icon
          }), /*#__PURE__*/jsx(Text, {
            children: item.label
          })]
        }, item.key)
      }, item.key)
    }), /*#__PURE__*/jsx(DialogContainer, {
      onDismiss: toggleNewBranchDialog,
      children: newBranchDialogVisible && /*#__PURE__*/jsx(CreateBranchDialog, {
        onDismiss: toggleNewBranchDialog,
        onCreate: branchName => {
          toggleNewBranchDialog();
          router.push(router.href.replace(/\/branch\/[^/]+/, '/branch/' + encodeURIComponent(branchName)));
        }
      })
    }), /*#__PURE__*/jsx(DialogContainer, {
      onDismiss: toggleDeleteBranchDialog,
      children: deleteBranchDialogVisible && /*#__PURE__*/jsxs(AlertDialog, {
        title: "Delete branch",
        tone: "critical",
        cancelLabel: "Cancel",
        primaryActionLabel: "Yes, delete",
        autoFocusButton: "cancel",
        onPrimaryAction: async () => {
          await deleteBranch({
            refId: data.branchNameToId.get(data.currentBranch)
          });
          router.push(router.href.replace(/\/branch\/[^/]+/, '/branch/' + encodeURIComponent(data.defaultBranch)));
        },
        children: ["Are you sure you want to delete the \"", data.currentBranch, "\" branch? This cannot be undone."]
      })
    })]
  });
}

// Utils
// -----------------------------------------------------------------------------

function useUserData() {
  const config = useConfig();
  const user = useViewer();
  const rawCloudInfo = useRawCloudInfo();
  if (rawCloudInfo) {
    if (rawCloudInfo === 'unauthorized') {
      return rawCloudInfo;
    }
    return {
      avatarUrl: rawCloudInfo.user.avatarUrl,
      login: rawCloudInfo.user.email,
      name: rawCloudInfo.user.name
    };
  }
  if (isGitHubConfig(config) && user) {
    var _user$name;
    return {
      avatarUrl: user.avatarUrl,
      login: user.login,
      name: (_user$name = user.name) !== null && _user$name !== void 0 ? _user$name : user.login
    };
  }
  return undefined;
}

const SidebarContext = /*#__PURE__*/createContext(null);
function useSidebar() {
  let context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be within a SidebarProvider');
  }
  return context;
}
const breakpointNames = typedKeys(breakpoints);
function SidebarProvider(props) {
  const matchedBreakpoints = useBreakpoint();
  const state = useOverlayTriggerState({
    defaultOpen: matchedBreakpoints.includes('desktop')
  });
  let breakpointIndex = breakpointNames.indexOf(matchedBreakpoints[0]);
  let previousIndex = usePrevious$1(breakpointIndex) || 0;
  useUpdateEffect(() => {
    let larger = previousIndex < breakpointIndex;
    if (larger && breakpointIndex >= 2) {
      state.open();
    } else if (breakpointIndex < 2) {
      state.close();
    }
  }, [matchedBreakpoints]);
  return /*#__PURE__*/jsx(SidebarContext.Provider, {
    value: state,
    children: props.children
  });
}
function SidebarPanel() {
  return /*#__PURE__*/jsxs(VStack, {
    backgroundColor: "surface",
    height: "100%",
    children: [/*#__PURE__*/jsx(SidebarHeader, {}), /*#__PURE__*/jsx(SidebarGitActions, {}), /*#__PURE__*/jsx(SidebarNav, {}), /*#__PURE__*/jsx(SidebarFooter, {})]
  });
}
function SidebarHeader() {
  let isLocalNoCloud = useIsLocalNoCloud();
  let {
    brandMark,
    brandName
  } = useBrand();
  return /*#__PURE__*/jsxs(HStack, {
    alignItems: "center",
    gap: "regular",
    paddingY: "regular",
    paddingX: "medium",
    height: {
      mobile: 'element.large',
      tablet: 'element.xlarge'
    },
    children: [/*#__PURE__*/jsxs(HStack, {
      flex: true,
      alignItems: "center",
      gap: "regular",
      UNSAFE_className: css({
        // let consumers use "currentColor" in SVG for their brand mark
        color: tokenSchema.color.foreground.neutralEmphasis,
        // ensure that the brand mark doesn't get squashed
        '& :first-child': {
          flexShrink: 0
        }
      }),
      children: [brandMark, /*#__PURE__*/jsx(Text, {
        color: "inherit",
        weight: "medium",
        truncate: true,
        children: brandName
      })]
    }), isLocalNoCloud && /*#__PURE__*/jsx(ThemeMenu, {})]
  });
}

// when local mode w/o cloud there's no user actions, so we hide the footer and
// move the theme menu to the header
function SidebarFooter() {
  let isLocalNoCloud = useIsLocalNoCloud();
  if (isLocalNoCloud) {
    return null;
  }
  return /*#__PURE__*/jsxs(HStack, {
    alignItems: "center",
    paddingY: "regular",
    paddingX: "medium",
    gap: "regular",
    children: [/*#__PURE__*/jsx(UserActions, {}), /*#__PURE__*/jsx(ThemeMenu, {})]
  });
}

// no git actions in local mode
function SidebarGitActions() {
  let config = useConfig();
  if (isLocalConfig(config)) {
    return null;
  }
  return /*#__PURE__*/jsxs(HStack, {
    gap: "regular",
    paddingY: "regular",
    paddingX: "medium",
    children: [/*#__PURE__*/jsx(BranchPicker, {}), /*#__PURE__*/jsx(GitMenu, {})]
  });
}
function SidebarDialog() {
  const state = useSidebar();
  const router = useRouter();

  // close the sidebar when the route changes
  useUpdateEffect(() => {
    state.close();
  }, [router.href]);
  let dialogRef = useRef(null);
  let {
    modalProps,
    underlayProps
  } = useModalOverlay({
    isDismissable: true
  }, state, dialogRef);
  return /*#__PURE__*/jsxs(Fragment, {
    children: [/*#__PURE__*/jsx(Blanket, {
      ...underlayProps,
      isOpen: state.isOpen,
      zIndex: 10
    }), /*#__PURE__*/jsxs("div", {
      "data-visible": state.isOpen,
      id: SIDE_PANEL_ID,
      ref: dialogRef,
      ...modalProps,
      // styles
      className: css({
        backgroundColor: tokenSchema.color.background.surface,
        boxShadow: `${tokenSchema.size.shadow.large} ${tokenSchema.color.shadow.regular}`,
        display: 'flex',
        flexDirection: 'column',
        inset: 0,
        insetInlineEnd: 'auto',
        // ensure that there's always enough of gutter for the user to press
        // and exit the sidebar
        maxWidth: `calc(100% - ${tokenSchema.size.element.medium})`,
        minWidth: tokenSchema.size.scale[3000],
        outline: 0,
        pointerEvents: 'none',
        position: 'fixed',
        transform: 'translateX(-100%)',
        visibility: 'hidden',
        zIndex: 10,
        // exit animation
        transition: [transition('transform', {
          easing: 'easeIn',
          duration: 'short'
          // delay: 'short',
        }), transition('visibility', {
          delay: 'regular',
          duration: 0,
          easing: 'linear'
        })].join(', '),
        '&[data-visible=true]': {
          transform: 'translateX(0)',
          // enter animation
          transition: transition('transform', {
            easing: 'easeOut'
          }),
          pointerEvents: 'auto',
          visibility: 'visible'
        }
      }),
      children: [/*#__PURE__*/jsx(SidebarHeader, {}), /*#__PURE__*/jsx(SidebarGitActions, {}), /*#__PURE__*/jsx(SidebarNav, {}), /*#__PURE__*/jsx(SidebarFooter, {}), /*#__PURE__*/jsx(DismissButton, {
        onDismiss: state.close
      })]
    })]
  });
}
function SidebarNav() {
  const {
    basePath
  } = useAppState();
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);
  const navItems = useNavItems();
  const isCurrent = useIsCurrent();
  return /*#__PURE__*/jsx(ScrollView$1, {
    flex: true,
    paddingY: "large",
    paddingEnd: "medium",
    children: /*#__PURE__*/jsxs(NavList, {
      children: [/*#__PURE__*/jsx(NavItem, {
        href: basePath,
        "aria-current": isCurrent(basePath, {
          exact: true
        }),
        children: stringFormatter.format('dashboard')
      }), navItems.map(item => renderItemOrGroup$1(item, isCurrent))]
    })
  });
}

// Utils
// ----------------------------------------------------------------------------

function useIsLocalNoCloud() {
  const config = useConfig();
  return isLocalConfig(config) && !config.cloud;
}
function useIsCurrent() {
  const router = useRouter();
  return useCallback((href, {
    exact = false
  } = {}) => {
    if (exact) {
      return href === router.href ? 'page' : undefined;
    }
    return href === router.href || router.href.startsWith(`${href}/`) ? 'page' : undefined;
  }, [router.href]);
}

// Renderers
// ----------------------------------------------------------------------------
let dividerCount$1 = 0;
function renderItemOrGroup$1(itemOrGroup, isCurrent) {
  if ('isDivider' in itemOrGroup) {
    return /*#__PURE__*/jsx(Divider, {}, dividerCount$1++);
  }
  if ('children' in itemOrGroup) {
    return /*#__PURE__*/jsx(NavGroup, {
      title: itemOrGroup.title,
      children: itemOrGroup.children.map(child => renderItemOrGroup$1(child, isCurrent))
    }, itemOrGroup.title);
  }
  let changeElement = (() => {
    if (!itemOrGroup.changed) {
      return null;
    }
    return typeof itemOrGroup.changed === 'number' ? /*#__PURE__*/jsxs(Badge, {
      tone: "accent",
      marginStart: "auto",
      children: [/*#__PURE__*/jsx(Text, {
        children: itemOrGroup.changed
      }), /*#__PURE__*/jsx(Text, {
        visuallyHidden: true,
        children: pluralize(itemOrGroup.changed, {
          singular: 'change',
          plural: 'changes',
          inclusive: false
        })
      })]
    }) : /*#__PURE__*/jsx(StatusLight, {
      tone: "accent",
      marginStart: "auto",
      "aria-label": "Changed",
      role: "status"
    });
  })();
  return /*#__PURE__*/jsxs(NavItem, {
    href: itemOrGroup.href,
    "aria-current": isCurrent(itemOrGroup.href),
    children: [/*#__PURE__*/jsx(Text, {
      truncate: true,
      title: itemOrGroup.label,
      children: itemOrGroup.label
    }), changeElement]
  }, itemOrGroup.key);
}

const PageContext = /*#__PURE__*/createContext({
  containerWidth: 'medium'
});
const PageRoot = ({
  children,
  containerWidth = 'medium'
}) => {
  return /*#__PURE__*/jsx(PageContext.Provider, {
    value: {
      containerWidth
    },
    children: /*#__PURE__*/jsx(Flex, {
      elementType: "main",
      direction: "column",
      id: MAIN_PANEL_ID,
      flex: true,
      height: "100%"
      // fix flexbox issues
      ,
      minHeight: 0,
      minWidth: 0,
      children: children
    })
  });
};
const PageHeader = ({
  children
}) => {
  const sidebarState = useSidebar();
  const menuButtonRef = useRef(null);
  const {
    direction
  } = useLocale();
  let icon = sidebarState.isOpen ? panelLeftCloseIcon : panelLeftOpenIcon;
  if (direction === 'rtl') {
    icon = sidebarState.isOpen ? panelRightCloseIcon : panelRightOpenIcon;
  }
  return /*#__PURE__*/jsx(Box, {
    borderBottom: "muted",
    elementType: "header",
    height: {
      mobile: 'element.large',
      tablet: 'element.xlarge'
    },
    flexShrink: 0,
    children: /*#__PURE__*/jsx(Box, {
      minHeight: 0,
      minWidth: 0,
      paddingX: {
        mobile: 'medium',
        tablet: 'xlarge',
        desktop: 'xxlarge'
      },
      children: /*#__PURE__*/jsxs(Flex, {
        alignItems: "center",
        gap: {
          mobile: 'small',
          tablet: 'regular'
        },
        height: {
          mobile: 'element.large',
          tablet: 'element.xlarge'
        },
        children: [/*#__PURE__*/jsx(ActionButton, {
          prominence: "low",
          "aria-label": "Open app navigation",
          "aria-pressed": sidebarState.isOpen,
          isHidden: sidebarState.isOpen ? {
            above: 'tablet'
          } : undefined,
          onPress: sidebarState.toggle,
          ref: menuButtonRef,
          UNSAFE_className: css({
            marginInlineStart: `calc(${tokenSchema.size.space.regular} * -1)`
          }),
          children: /*#__PURE__*/jsx(Icon, {
            src: icon
          })
        }), children]
      })
    })
  });
};
const PageBody = ({
  children,
  isScrollable
}) => {
  return /*#__PURE__*/jsx(ScrollView, {
    isDisabled: !isScrollable,
    children: /*#__PURE__*/jsx(PageContainer
    // padding on the container so descendants can use sticky positioning
    // with simple relative offsets
    , {
      paddingY: "xxlarge",
      children: children
    })
  });
};
const PageContainer = props => {
  const {
    containerWidth
  } = useContext(PageContext);
  const maxWidth = containerWidth === 'none' ? undefined : `container.${containerWidth}`;
  return /*#__PURE__*/jsx(Box, {
    minHeight: 0,
    minWidth: 0,
    maxWidth: maxWidth
    // marginX="auto"
    ,
    paddingX: {
      mobile: 'medium',
      tablet: 'xlarge',
      desktop: 'xxlarge'
    },
    ...props
  });
};

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
class NotFoundErrorBoundaryInner extends React__default.Component {
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

function castToMemoizedInfoForSchema(val) {
  return val;
}
function getOrInsert(map, key, val) {
  if (!map.has(key)) {
    map.set(key, val(key));
  }
  return map.get(key);
}
const childFieldData = new WeakMap();
function storeChildFieldData(value) {
  let key = {};
  childFieldData.set(key, value);
  return key;
}
function getChildFieldData(props) {
  const val = childFieldData.get(props._);
  if (!val) {
    throw new Error('expected child field data to exist');
  }
  return val;
}
function createGetPreviewProps(rootSchema, rootOnChange, getChildFieldElement) {
  const memoizedInfoForSchema = castToMemoizedInfoForSchema({
    form(schema, onChange) {
      return newVal => onChange(() => newVal);
    },
    array(schema, onChange) {
      return {
        rawOnChange: onChange,
        inner: new Map(),
        onChange(updater) {
          onChange(value => updateValue(schema, value, updater));
        }
      };
    },
    child(schema, onChange) {
      return newVal => onChange(() => newVal);
    },
    conditional(schema, onChange) {
      return {
        onChange: (discriminant, value) => onChange(val => updateValue(schema, val, {
          discriminant,
          value
        })),
        onChangeForValue: cb => onChange(val => ({
          discriminant: val.discriminant,
          value: cb(val.value)
        }))
      };
    },
    object(schema, onChange) {
      return {
        onChange: updater => {
          onChange(value => updateValue(schema, value, updater));
        },
        innerOnChanges: Object.fromEntries(Object.keys(schema.fields).map(key => {
          return [key, newVal => {
            onChange(val => ({
              ...val,
              [key]: newVal(val[key])
            }));
          }];
        }))
      };
    }
  });
  const previewPropsFactories = {
    form(schema, value, onChange) {
      return {
        value: value,
        onChange,
        schema: schema
      };
    },
    child(schema, value, onChange, path) {
      return {
        element: getChildFieldElement(path),
        schema: schema,
        _: storeChildFieldData({
          value,
          onChange
        })
      };
    },
    object(schema, value, memoized, path, getInnerProp) {
      const fields = {};
      for (const key of Object.keys(schema.fields)) {
        fields[key] = getInnerProp(schema.fields[key], value[key], memoized.innerOnChanges[key], key);
      }
      const previewProps = {
        fields,
        onChange: memoized.onChange,
        schema: schema
      };
      return previewProps;
    },
    array(schema, value, memoized, path, getInnerProp) {
      const arrayValue = value;
      const keys = getKeysForArrayValue(arrayValue);
      const unusedKeys = new Set(getKeysForArrayValue(value));
      const props = {
        elements: arrayValue.map((val, i) => {
          const key = keys[i];
          unusedKeys.delete(key);
          const element = getOrInsert(memoized.inner, key, () => {
            const onChange = val => {
              memoized.rawOnChange(prev => {
                const keys = getKeysForArrayValue(prev);
                const index = keys.indexOf(key);
                const newValue = [...prev];
                newValue[index] = val(newValue[index]);
                setKeysForArrayValue(newValue, keys);
                return newValue;
              });
            };
            const element = getInnerProp(schema.element, val, onChange, key);
            return {
              element,
              elementWithKey: {
                ...element,
                key
              },
              onChange
            };
          });
          const currentInnerProp = getInnerProp(schema.element, val, element.onChange, key);
          if (element.element !== currentInnerProp) {
            element.element = currentInnerProp;
            element.elementWithKey = {
              ...currentInnerProp,
              key
            };
          }
          return element.elementWithKey;
        }),
        schema: schema,
        onChange: memoized.onChange
      };
      for (const key of unusedKeys) {
        memoized.inner.delete(key);
      }
      return props;
    },
    conditional(schema, value, memoized, path, getInnerProp) {
      const props = {
        discriminant: value.discriminant,
        onChange: memoized.onChange,
        value: getInnerProp(schema.values[value.discriminant.toString()], value.value, memoized.onChangeForValue, 'value'),
        schema: schema
      };
      return props;
    }
  };
  function getPreviewPropsForProp(schema, value, memoedThing, path, getInnerProp) {
    return previewPropsFactories[schema.kind](schema, value, memoedThing, path, getInnerProp);
  }
  function getInitialMemoState(schema, value, onChange, path) {
    const innerState = new Map();
    const memoizedInfo = memoizedInfoForSchema[schema.kind](schema, onChange);
    const state = {
      value,
      inner: innerState,
      props: getPreviewPropsForProp(schema, value, memoizedInfo, path, (schema, value, onChange, key) => {
        const state = getInitialMemoState(schema, value, onChange, path.concat(key));
        innerState.set(key, state);
        return state.props;
      }),
      schema: schema,
      cached: memoizedInfo
    };
    return state;
  }
  function getUpToDateProps(schema, value, onChange, memoState, path) {
    if (memoState.schema !== schema) {
      Object.assign(memoState, getInitialMemoState(schema, value, onChange, path));
      return memoState.props;
    }
    if (memoState.value === value) {
      return memoState.props;
    }
    memoState.value = value;
    const unusedKeys = new Set(memoState.inner.keys());
    memoState.props = getPreviewPropsForProp(schema, value, memoState.cached, path, (schema, value, onChange, innerMemoStateKey) => {
      unusedKeys.delete(innerMemoStateKey);
      if (!memoState.inner.has(innerMemoStateKey)) {
        const innerState = getInitialMemoState(schema, value, onChange, path.concat(innerMemoStateKey));
        memoState.inner.set(innerMemoStateKey, innerState);
        return innerState.props;
      }
      return getUpToDateProps(schema, value, onChange, memoState.inner.get(innerMemoStateKey), path.concat(innerMemoStateKey));
    });
    for (const key of unusedKeys) {
      memoState.inner.delete(key);
    }
    return memoState.props;
  }
  let memoState;
  return value => {
    if (memoState === undefined) {
      memoState = getInitialMemoState(rootSchema, value, rootOnChange, []);
      return memoState.props;
    }
    return getUpToDateProps(rootSchema, value, rootOnChange, memoState, []);
  };
}

function clientSideValidateProp(schema, value, slugField) {
  try {
    validateValueWithSchema(schema, value, slugField);
    return true;
  } catch (error) {
    console.warn(toFormattedFormDataError(error));
    return false;
  }
}
function validateValueWithSchema(schema, value, slugField, path = []) {
  switch (schema.kind) {
    case 'child':
      {
        return;
      }
    case 'form':
      {
        try {
          if (slugField && path[path.length - 1] === (slugField === null || slugField === void 0 ? void 0 : slugField.field)) {
            schema.validate(value, {
              slugField: {
                slugs: slugField.slugs,
                glob: slugField.glob
              }
            });
            return;
          }
          schema.validate(value, undefined);
        } catch (err) {
          throw new PropValidationError(err, path, schema);
        }
        return;
      }
    case 'conditional':
      {
        schema.discriminant.validate(value.discriminant);
        validateValueWithSchema(schema.values[value.discriminant], value.value, undefined, path.concat('value'));
        return;
      }
    case 'object':
      {
        const errors = [];
        for (const [key, childProp] of Object.entries(schema.fields)) {
          try {
            validateValueWithSchema(childProp, value[key], key === (slugField === null || slugField === void 0 ? void 0 : slugField.field) ? slugField : undefined, path.concat(key));
          } catch (err) {
            errors.push(err);
          }
        }
        if (errors.length > 0) {
          throw new AggregateError(errors);
        }
        return;
      }
    case 'array':
      {
        let slugInfo;
        if (schema.slugField !== undefined && schema.element.kind === 'object') {
          const innerSchema = schema.element.fields;
          const {
            slugField
          } = schema;
          slugInfo = {
            slugField,
            slugs: value.map(val => getSlugFromState({
              schema: innerSchema,
              slugField
            }, val))
          };
        }
        const errors = [];
        const val = value;
        const error = validateArrayLength(schema, value, path);
        if (error !== undefined) {
          errors.push(error);
        }
        for (const [idx, innerVal] of val.entries()) {
          try {
            validateValueWithSchema(schema.element, innerVal, slugInfo === undefined ? undefined : {
              field: slugInfo.slugField,
              slugs: new Set(slugInfo.slugs.filter((_, i) => idx !== i)),
              glob: '*'
            }, path.concat(idx));
          } catch (err) {
            errors.push(err);
          }
        }
        if (errors.length > 0) {
          throw new AggregateError(errors);
        }
        return;
      }
  }
}

function AddToPathProvider(props) {
  const path = useContext(PathContext);
  return /*#__PURE__*/jsx(PathContext.Provider, {
    value: useMemo(() => path.concat(props.part), [path, props.part]),
    children: props.children
  });
}
const SlugFieldContext = /*#__PURE__*/createContext(undefined);
const SlugFieldProvider = SlugFieldContext.Provider;
const PathContext = /*#__PURE__*/createContext([]);
const PathContextProvider = PathContext.Provider;

const FIELD_GRID_COLUMNS = 12;
const FieldContext = /*#__PURE__*/createContext({
  span: FIELD_GRID_COLUMNS
});
const FieldContextProvider = FieldContext.Provider;

function ObjectFieldInput({
  schema,
  autoFocus,
  fields,
  forceValidation
}) {
  validateLayout(schema);
  const firstFocusable = autoFocus ? findFocusableObjectFieldKey(schema) : undefined;
  const inner = /*#__PURE__*/jsx(Grid, {
    columns: `repeat(${FIELD_GRID_COLUMNS}, minmax(auto, 1fr))`,
    columnGap: "medium",
    rowGap: "xlarge",
    children: Object.entries(fields).map(([key, propVal], index) => {
      var _schema$layout$index, _schema$layout;
      let span = (_schema$layout$index = (_schema$layout = schema.layout) === null || _schema$layout === void 0 ? void 0 : _schema$layout[index]) !== null && _schema$layout$index !== void 0 ? _schema$layout$index : FIELD_GRID_COLUMNS;
      return /*#__PURE__*/jsx(FieldContextProvider, {
        value: {
          span
        },
        children: /*#__PURE__*/jsx("div", {
          className: css({
            gridColumn: `span ${span}`,
            [containerQueries.below.tablet]: {
              gridColumn: `span ${FIELD_GRID_COLUMNS}`
            }
          }),
          children: /*#__PURE__*/jsx(AddToPathProvider, {
            part: key,
            children: /*#__PURE__*/jsx(InnerFormValueContentFromPreviewProps, {
              forceValidation: forceValidation,
              autoFocus: key === firstFocusable,
              marginBottom: "xlarge",
              ...propVal
            })
          })
        })
      }, key);
    })
  });
  const id = useId();
  if (!schema.label) {
    return inner;
  }
  const labelId = `${id}-label`;
  const descriptionId = `${id}-description`;
  return /*#__PURE__*/jsxs(Grid, {
    role: "group",
    gap: "medium",
    marginY: "xlarge",
    "aria-labelledby": labelId,
    "aria-describedby": schema.description ? descriptionId : undefined,
    children: [/*#__PURE__*/jsx(Text, {
      color: "neutralEmphasis",
      size: "medium",
      weight: "semibold",
      id: labelId,
      children: schema.label
    }), !!schema.description && /*#__PURE__*/jsx(Text, {
      id: descriptionId,
      size: "regular",
      color: "neutralSecondary",
      children: schema.description
    }), /*#__PURE__*/jsx("div", {}), inner]
  });
}
function validateLayout(schema) {
  if (!schema.layout) {
    return;
  }
  assert(schema.layout.length === Object.keys(schema.fields).length, 'A column "span" is required for every field in the layout');
  assert(schema.layout.every(span => span > 0), 'The layout must not contain empty columns');
  assert(schema.layout.every(span => span <= 12), 'Fields may not span more than 12 columns');
  assert(schema.layout.reduce((acc, cur) => acc + cur, 0) % 12 === 0, 'The layout must span exactly 12 columns');
}
function findFocusableObjectFieldKey(schema) {
  for (const [key, innerProp] of Object.entries(schema.fields)) {
    const childFocusable = canFieldBeFocused(innerProp);
    if (childFocusable) {
      return key;
    }
  }
  return undefined;
}
function canFieldBeFocused(schema) {
  if (schema.kind === 'array' || schema.kind === 'conditional' || schema.kind === 'form') {
    return true;
  }
  if (schema.kind === 'child') {
    return false;
  }
  if (schema.kind === 'object') {
    for (const innerProp of Object.values(schema.fields)) {
      if (canFieldBeFocused(innerProp)) {
        return true;
      }
    }
    return false;
  }
  assertNever(schema);
}

function ConditionalFieldInput({
  schema,
  autoFocus,
  discriminant,
  onChange,
  value,
  forceValidation
}) {
  const schemaDiscriminant = schema.discriminant;
  return /*#__PURE__*/jsxs(Flex, {
    gap: "xlarge",
    direction: "column",
    children: [useMemo(() => /*#__PURE__*/jsx(AddToPathProvider, {
      part: "discriminant",
      children: /*#__PURE__*/jsx(schemaDiscriminant.Input, {
        autoFocus: !!autoFocus,
        value: discriminant,
        onChange: onChange,
        forceValidation: forceValidation
      })
    }), [autoFocus, schemaDiscriminant, discriminant, onChange, forceValidation]), /*#__PURE__*/jsx(AddToPathProvider, {
      part: "value",
      children: /*#__PURE__*/jsx(InnerFormValueContentFromPreviewProps, {
        forceValidation: forceValidation,
        ...value
      })
    })]
  });
}

const previewPropsToValueConverter = {
  child(props) {
    const childFieldData = getChildFieldData(props);
    return childFieldData.value;
  },
  form(props) {
    return props.value;
  },
  array(props) {
    const values = props.elements.map(x => previewPropsToValue(x));
    setKeysForArrayValue(values, props.elements.map(x => x.key));
    return values;
  },
  conditional(props) {
    return {
      discriminant: props.discriminant,
      value: previewPropsToValue(props.value)
    };
  },
  object(props) {
    return Object.fromEntries(Object.entries(props.fields).map(([key, val]) => [key, previewPropsToValue(val)]));
  }
};
function previewPropsToValue(props) {
  return previewPropsToValueConverter[props.schema.kind](props);
}
const valueToUpdaters = {
  child(value) {
    return value !== null && value !== void 0 ? value : undefined;
  },
  form(value) {
    return value;
  },
  array(value, schema) {
    const keys = getKeysForArrayValue(value);
    return value.map((x, i) => ({
      key: keys[i],
      value: valueToUpdater(x, schema.element)
    }));
  },
  conditional(value, schema) {
    return {
      discriminant: value.discriminant,
      value: valueToUpdater(value.value, schema.values[value.discriminant.toString()])
    };
  },
  object(value, schema) {
    return Object.fromEntries(Object.entries(schema.fields).map(([key, schema]) => [key, valueToUpdater(value[key], schema)]));
  }
};
function valueToUpdater(value, schema) {
  return valueToUpdaters[schema.kind](value, schema);
}
function setValueToPreviewProps(value, props) {
  if (isKind(props, 'child')) {
    const {
      onChange
    } = getChildFieldData(props);
    onChange(value);
    return;
  }
  if (isKind(props, 'form') || isKind(props, 'object') || isKind(props, 'array')) {
    props.onChange(valueToUpdater(value, props.schema));
    return;
  }
  if (isKind(props, 'conditional')) {
    const updater = valueToUpdater(value, props.schema);
    props.onChange(updater.discriminant, updater.value);
    return;
  }
  assertNever(props);
}

// this exists because for props.schema.kind === 'form', ts doesn't narrow props, only props.schema
function isKind(props, kind) {
  return props.schema.kind === kind;
}

function ArrayFieldInput(props) {
  const labelId = useId();
  const descriptionId = useId();
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);
  const [modalState, setModalState] = useState({
    state: 'closed'
  });
  const onModalChange = useCallback(cb => {
    setModalState(state => {
      if (state.state === 'open') {
        return {
          state: 'open',
          forceValidation: state.forceValidation,
          value: cb(state.value),
          index: state.index
        };
      }
      return state;
    });
  }, [setModalState]);
  const formId = useId();
  const modalStateIndex = modalState.state === 'open' ? modalState.index : undefined;
  const slugInfo = useMemo(() => {
    if (props.schema.slugField === undefined || modalState.state !== 'open' || props.schema.element.kind !== 'object') {
      return;
    }
    const val = previewPropsToValue(props);
    const schema = props.schema.element.fields;
    const slugField = props.schema.slugField;
    const slugs = new Set(val.filter((x, i) => i !== modalStateIndex).map(x => getSlugFromState({
      schema,
      slugField
    }, x)));
    return {
      slugs,
      field: slugField,
      glob: '*'
    };
  }, [modalStateIndex, props, modalState.state]);
  return /*#__PURE__*/jsxs(Flex, {
    elementType: "section",
    gap: "medium",
    role: "group",
    "aria-labelledby": labelId,
    "aria-describedby": props.schema.description ? descriptionId : undefined,
    direction: "column",
    children: [/*#__PURE__*/jsx(FieldLabel, {
      elementType: "h3",
      id: labelId,
      children: props.schema.label
    }), props.schema.description && /*#__PURE__*/jsx(Text, {
      id: descriptionId,
      size: "small",
      color: "neutralSecondary",
      children: props.schema.description
    }), /*#__PURE__*/jsx(ActionButton, {
      autoFocus: props.autoFocus,
      onPress: () => {
        setModalState({
          state: 'open',
          value: getInitialPropsValue(props.schema.element),
          forceValidation: false,
          index: undefined
        });
      },
      alignSelf: "start",
      children: stringFormatter.format('add')
    }), /*#__PURE__*/jsx(ArrayFieldListView, {
      ...props,
      labelId: labelId,
      onOpenItem: idx => {
        console.log(previewPropsToValue(props.elements[idx]));
        setModalState({
          state: 'open',
          value: previewPropsToValue(props.elements[idx]),
          forceValidation: false,
          index: idx
        });
      }
    }), /*#__PURE__*/jsx(ArrayFieldValidationMessages, {
      ...props
    }), /*#__PURE__*/jsx(DialogContainer, {
      onDismiss: () => {
        setModalState({
          state: 'closed'
        });
      },
      children: (() => {
        if (modalState.state !== 'open' || props.schema.element.kind === 'child') {
          return;
        }
        return /*#__PURE__*/jsxs(Dialog, {
          children: [/*#__PURE__*/jsx(Heading, {
            children: "Edit item"
          }), /*#__PURE__*/jsx(Content, {
            children: /*#__PURE__*/jsx(Flex, {
              id: formId,
              elementType: "form",
              onSubmit: event => {
                if (event.target !== event.currentTarget) return;
                event.preventDefault();
                if (modalState.state !== 'open') return;
                if (!clientSideValidateProp(props.schema.element, modalState.value, undefined)) {
                  setModalState(state => ({
                    ...state,
                    forceValidation: true
                  }));
                  return;
                }
                if (modalState.index === undefined) {
                  props.onChange([...props.elements.map(x => ({
                    key: x.key
                  })), {
                    key: undefined,
                    value: valueToUpdater(modalState.value, props.schema.element)
                  }]);
                } else {
                  setValueToPreviewProps(modalState.value, props.elements[modalState.index]);
                }
                setModalState({
                  state: 'closed'
                });
              },
              direction: "column",
              gap: "xxlarge",
              children: /*#__PURE__*/jsx(ArrayFieldItemModalContent, {
                onChange: onModalChange,
                schema: props.schema.element,
                value: modalState.value,
                slugField: slugInfo
              })
            })
          }), /*#__PURE__*/jsxs(ButtonGroup, {
            children: [/*#__PURE__*/jsx(Button, {
              onPress: () => {
                setModalState({
                  state: 'closed'
                });
              },
              children: stringFormatter.format('cancel')
            }), /*#__PURE__*/jsx(Button, {
              form: formId,
              prominence: "high",
              type: "submit",
              children: modalState.index === undefined ? stringFormatter.format('add') : 'Done'
            })]
          })]
        });
      })()
    })]
  });
}
function ArrayFieldValidationMessages(props) {
  var _props$schema$validat, _props$schema$validat2;
  return /*#__PURE__*/jsx(Fragment, {
    children: props.forceValidation && (((_props$schema$validat = props.schema.validation) === null || _props$schema$validat === void 0 || (_props$schema$validat = _props$schema$validat.length) === null || _props$schema$validat === void 0 ? void 0 : _props$schema$validat.min) !== undefined && props.elements.length < props.schema.validation.length.min ? /*#__PURE__*/jsxs(FieldMessage, {
      children: ["Must have at least ", props.schema.validation.length.min, " item", props.schema.validation.length.min === 1 ? '' : 's']
    }) : ((_props$schema$validat2 = props.schema.validation) === null || _props$schema$validat2 === void 0 || (_props$schema$validat2 = _props$schema$validat2.length) === null || _props$schema$validat2 === void 0 ? void 0 : _props$schema$validat2.max) !== undefined && props.elements.length > props.schema.validation.length.max ? /*#__PURE__*/jsxs(FieldMessage, {
      children: ["Must have at most ", props.schema.validation.length.max, " item", props.schema.validation.length.max === 1 ? '' : 's']
    }) : undefined)
  });
}
function ArrayFieldListView(props) {
  let onMove = (keys, target) => {
    const targetIndex = props.elements.findIndex(x => x.key === target.key);
    if (targetIndex === -1) return;
    const allKeys = props.elements.map(x => ({
      key: x.key
    }));
    const indexToMoveTo = target.dropPosition === 'before' ? targetIndex : targetIndex + 1;
    const indices = keys.map(key => allKeys.findIndex(x => x.key === key));
    props.onChange(move(allKeys, indices, indexToMoveTo));
  };
  const dragType = useMemo(() => Math.random().toString(36), []);
  let {
    dragAndDropHooks
  } = useDragAndDrop({
    getItems(keys) {
      // Use a drag type so the items can only be reordered within this list
      // and not dragged elsewhere.
      return [...keys].map(key => {
        key = JSON.stringify(key);
        return {
          [dragType]: key,
          'text/plain': key
        };
      });
    },
    getAllowedDropOperations() {
      return ['move', 'cancel'];
    },
    async onDrop(e) {
      if (e.target.type !== 'root' && e.target.dropPosition !== 'on') {
        let keys = [];
        for (let item of e.items) {
          if (item.kind === 'text') {
            let key;
            if (item.types.has(dragType)) {
              key = JSON.parse(await item.getText(dragType));
              keys.push(key);
            } else if (item.types.has('text/plain')) {
              // Fallback for Chrome Android case: https://bugs.chromium.org/p/chromium/issues/detail?id=1293803
              // Multiple drag items are contained in a single string so we need to split them out
              key = await item.getText('text/plain');
              keys = key.split('\n').map(val => val.replaceAll('"', ''));
            }
          }
        }
        onMove(keys, e.target);
      }
    },
    getDropOperation(target) {
      if (target.type === 'root' || target.dropPosition === 'on') {
        return 'cancel';
      }
      return 'move';
    }
  });
  const onRemoveKey = useEventCallback(key => {
    props.onChange(props.elements.map(x => ({
      key: x.key
    })).filter(val => val.key !== key));
  });
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);
  return /*#__PURE__*/jsx(ListView, {
    "aria-labelledby": props.labelId,
    items: props.elements,
    dragAndDropHooks: dragAndDropHooks,
    height: props.elements.length ? undefined : 'scale.2000',
    renderEmptyState: () => /*#__PURE__*/jsxs(Flex, {
      direction: "column",
      gap: "large",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      padding: "regular",
      children: [/*#__PURE__*/jsx(Text, {
        elementType: "h3",
        align: "center",
        color: "neutralSecondary",
        size: "large",
        weight: "medium",
        children: "Empty list"
      }), /*#__PURE__*/jsx(Text, {
        align: "center",
        color: "neutralTertiary",
        children: "Add the first item to see it here."
      })]
    }),
    onAction: key => {
      const idx = props.elements.findIndex(x => x.key === key);
      if (idx === -1) return;
      props.onOpenItem(idx);
    },
    children: item => {
      var _props$schema$itemLab, _props$schema;
      const label = ((_props$schema$itemLab = (_props$schema = props.schema).itemLabel) === null || _props$schema$itemLab === void 0 ? void 0 : _props$schema$itemLab.call(_props$schema, item)) || `Item ${props.elements.indexOf(item) + 1}`;
      return /*#__PURE__*/jsxs(Item$2, {
        textValue: label,
        children: [/*#__PURE__*/jsx(Text, {
          children: label
        }), /*#__PURE__*/jsxs(TooltipTrigger, {
          placement: "start",
          children: [/*#__PURE__*/jsx(ActionButton, {
            onPress: () => {
              onRemoveKey(item.key);
            },
            children: /*#__PURE__*/jsx(Icon, {
              src: trash2Icon
            })
          }), /*#__PURE__*/jsx(Tooltip, {
            tone: "critical",
            children: stringFormatter.format('delete')
          })]
        })]
      }, item.key);
    }
  });
}

// https://github.com/adobe/react-spectrum/blob/97ff9f95d91befaf87251e52ea484f81daae8f3a/packages/%40react-stately/data/src/useListData.ts#L263
function move(items, indices, toIndex) {
  // Shift the target down by the number of items being moved from before the target
  toIndex -= indices.filter(index => index < toIndex).length;
  let moves = indices.map(from => ({
    from,
    to: toIndex++
  }));

  // Shift later from indices down if they have a larger index
  for (let i = 0; i < moves.length; i++) {
    let a = moves[i].from;
    for (let j = i; j < moves.length; j++) {
      let b = moves[j].from;
      if (b > a) {
        moves[j].from--;
      }
    }
  }

  // Interleave the moves so they can be applied one by one rather than all at once
  for (let i = 0; i < moves.length; i++) {
    let a = moves[i];
    for (let j = moves.length - 1; j > i; j--) {
      let b = moves[j];
      if (b.from < a.to) {
        a.to++;
      } else {
        b.from++;
      }
    }
  }
  let copy = items.slice();
  for (let move of moves) {
    let [item] = copy.splice(move.from, 1);
    copy.splice(move.to, 0, item);
  }
  return copy;
}
function ArrayFieldItemModalContent(props) {
  const previewProps = useMemo(() => createGetPreviewProps(props.schema, props.onChange, () => undefined), [props.schema, props.onChange])(props.value);
  return /*#__PURE__*/jsx(FormValueContentFromPreviewProps, {
    slugField: props.slugField,
    autoFocus: true,
    ...previewProps
  });
}

const ToolbarStateContext = /*#__PURE__*/React__default.createContext(null);
function useToolbarState() {
  const toolbarState = useContext(ToolbarStateContext);
  if (!toolbarState) {
    throw new Error('ToolbarStateProvider must be used to use useToolbarState');
  }
  return toolbarState;
}
const createToolbarState = (editor, componentBlocks, editorDocumentFeatures) => {
  const locationDocumentFeatures = getAncestorComponentChildFieldDocumentFeatures(editor, editorDocumentFeatures, componentBlocks) || {
    kind: 'block',
    inlineMarks: 'inherit',
    documentFeatures: {
      dividers: true,
      formatting: {
        alignment: {
          center: true,
          end: true
        },
        blockTypes: {
          blockquote: true,
          code: editorDocumentFeatures.formatting.blockTypes.code
        },
        headings: editorDocumentFeatures.formatting.headings,
        listTypes: {
          ordered: true,
          unordered: true
        }
      },
      layouts: editorDocumentFeatures.layouts,
      links: true,
      images: editorDocumentFeatures.images,
      tables: true
    },
    softBreaks: true,
    componentBlocks: true
  };
  let [maybeCodeBlockEntry] = Editor.nodes(editor, {
    match: node => node.type !== 'code' && isBlock(node)
  });
  const editorMarks = Editor.marks(editor) || {};
  const marks = Object.fromEntries(allMarks.map(mark => [mark, {
    isDisabled: locationDocumentFeatures.inlineMarks !== 'inherit' && !locationDocumentFeatures.inlineMarks[mark] || !maybeCodeBlockEntry,
    isSelected: !!editorMarks[mark]
  }]));

  // Editor.marks is "what are the marks that would be applied if text was inserted now"
  // that's not really the UX we want, if we have some a document like this
  // <paragraph>
  //   <text>
  //     <anchor />
  //     content
  //   </text>
  //   <text bold>bold</text>
  //   <text>
  //     content
  //     <focus />
  //   </text>
  // </paragraph>

  // we want bold to be shown as selected even though if you inserted text from that selection, it wouldn't be bold
  // so we look at all the text nodes in the selection to get their marks
  // but only if the selection is expanded because if you're in the middle of some text
  // with your selection collapsed with a mark but you've removed it(i.e. editor.removeMark)
  // the text nodes you're in will have the mark but the ui should show the mark as not being selected
  if (editor.selection && Range.isExpanded(editor.selection)) {
    for (const node of Editor.nodes(editor, {
      match: Text$1.isText
    })) {
      for (const key of Object.keys(node[0])) {
        if (key === 'insertMenu' || key === 'text') {
          continue;
        }
        if (key in marks) {
          marks[key].isSelected = true;
        }
      }
    }
  }
  let [headingEntry] = Editor.nodes(editor, {
    match: nodeTypeMatcher('heading')
  });
  let [listEntry] = Editor.nodes(editor, {
    match: isListNode
  });
  let [alignableEntry] = Editor.nodes(editor, {
    match: nodeTypeMatcher('paragraph', 'heading')
  });

  // (we're gonna use markdown here because the equivelant slate structure is quite large and doesn't add value here)
  // let's imagine a document that looks like this:
  // - thing
  //   1. something<cursor />
  // in the toolbar, you don't want to see that both ordered and unordered lists are selected
  // you want to see only ordered list selected, because
  // - you want to know what list you're actually in, you don't really care about the outer list
  // - when you want to change the list to a unordered list, the unordered list button should be inactive to show you can change to it
  const listTypeAbove = getListTypeAbove(editor);
  return {
    marks,
    textStyles: {
      selected: headingEntry ? headingEntry[0].level : 'normal',
      allowedHeadingLevels: locationDocumentFeatures.kind === 'block' && !listEntry ? locationDocumentFeatures.documentFeatures.formatting.headings.levels : []
    },
    code: {
      isSelected: isElementActive(editor, 'code'),
      isDisabled: !(locationDocumentFeatures.kind === 'block' && locationDocumentFeatures.documentFeatures.formatting.blockTypes.code)
    },
    lists: {
      ordered: {
        isSelected: isElementActive(editor, 'ordered-list') && (listTypeAbove === 'none' || listTypeAbove === 'ordered-list'),
        isDisabled: !(locationDocumentFeatures.kind === 'block' && locationDocumentFeatures.documentFeatures.formatting.listTypes.ordered && !headingEntry)
      },
      unordered: {
        isSelected: isElementActive(editor, 'unordered-list') && (listTypeAbove === 'none' || listTypeAbove === 'unordered-list'),
        isDisabled: !(locationDocumentFeatures.kind === 'block' && locationDocumentFeatures.documentFeatures.formatting.listTypes.unordered && !headingEntry)
      }
    },
    alignment: {
      isDisabled: !alignableEntry && !(locationDocumentFeatures.kind === 'block' && locationDocumentFeatures.documentFeatures.formatting.alignment),
      selected: (alignableEntry === null || alignableEntry === void 0 ? void 0 : alignableEntry[0].textAlign) || 'start'
    },
    blockquote: {
      isDisabled: !(locationDocumentFeatures.kind === 'block' && locationDocumentFeatures.documentFeatures.formatting.blockTypes.blockquote),
      isSelected: isElementActive(editor, 'blockquote')
    },
    layouts: {
      isSelected: isElementActive(editor, 'layout')
    },
    links: {
      isDisabled: !editor.selection || Range.isCollapsed(editor.selection) || !locationDocumentFeatures.documentFeatures.links,
      isSelected: isElementActive(editor, 'link')
    },
    editor,
    dividers: {
      isDisabled: locationDocumentFeatures.kind === 'inline' || !locationDocumentFeatures.documentFeatures.dividers
    },
    clearFormatting: {
      isDisabled: !(Object.values(marks).some(x => x.isSelected) || !!hasBlockThatClearsOnClearFormatting(editor))
    },
    editorDocumentFeatures
  };
};
function hasBlockThatClearsOnClearFormatting(editor) {
  const [node] = Editor.nodes(editor, {
    match: node => node.type === 'heading' || node.type === 'code' || node.type === 'blockquote'
  });
  return !!node;
}
function getListTypeAbove(editor) {
  const listAbove = Editor.above(editor, {
    match: isListNode
  });
  if (!listAbove) {
    return 'none';
  }
  return listAbove[0].type;
}
const DocumentEditorConfigContext = /*#__PURE__*/createContext(null);
function useDocumentEditorConfig() {
  const context = useContext(DocumentEditorConfigContext);
  if (!context) {
    throw new Error('useDocumentEditorConfig must be used within a DocumentEditorConfigContext.Provider');
  }
  return context;
}
const ToolbarStateProvider = ({
  children,
  componentBlocks,
  editorDocumentFeatures
}) => {
  const editor = useSlate();
  return /*#__PURE__*/jsx(DocumentEditorConfigContext.Provider, {
    value: useMemo(() => ({
      componentBlocks,
      documentFeatures: editorDocumentFeatures
    }), [componentBlocks, editorDocumentFeatures]),
    children: /*#__PURE__*/jsx(ToolbarStateContext.Provider, {
      value: createToolbarState(editor, componentBlocks, editorDocumentFeatures),
      children: children
    })
  });
};

const isLinkActive = editor => {
  return isElementActive(editor, 'link');
};
const wrapLink = (editor, url) => {
  if (isLinkActive(editor)) {
    Transforms.unwrapNodes(editor, {
      match: n => n.type === 'link'
    });
    return;
  }
  const {
    selection
  } = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);
  if (isCollapsed) {
    Transforms.insertNodes(editor, {
      type: 'link',
      href: url,
      children: [{
        text: url
      }]
    });
  } else {
    Transforms.wrapNodes(editor, {
      type: 'link',
      href: url,
      children: [{
        text: ''
      }]
    }, {
      split: true
    });
  }
};
const LinkElement = ({
  attributes,
  children,
  element: __elementForGettingPath
}) => {
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);
  const editor = useSlateStatic();
  const [currentElement, setNode] = useElementWithSetNodes(editor, __elementForGettingPath);
  const href = currentElement.href;
  const text = Node.string(currentElement);
  const [dialogOpen, setDialogOpen] = useState(false);
  const activePopoverElement = useActiveBlockPopover();
  const selected = activePopoverElement === __elementForGettingPath;
  useEffect(() => {
    if (selected && !href) {
      setDialogOpen(true);
    }
  }, [href, selected]);
  const unlink = useEventCallback(() => {
    Transforms.unwrapNodes(editor, {
      at: ReactEditor.findPath(editor, __elementForGettingPath)
    });
    ReactEditor.focus(editor);
  });
  return /*#__PURE__*/jsxs(Fragment, {
    children: [/*#__PURE__*/jsxs(BlockPopoverTrigger, {
      element: __elementForGettingPath,
      children: [/*#__PURE__*/jsx("a", {
        href: href,
        ...attributes,
        children: children
      }), /*#__PURE__*/jsx(BlockPopover, {
        placement: "bottom start",
        children: /*#__PURE__*/jsxs(Flex, {
          gap: "small",
          padding: "regular",
          children: [/*#__PURE__*/jsxs(TooltipTrigger, {
            children: [/*#__PURE__*/jsx(ActionButton, {
              prominence: "low",
              onPress: () => setDialogOpen(true),
              children: /*#__PURE__*/jsx(Icon, {
                src: editIcon
              })
            }), /*#__PURE__*/jsx(Tooltip, {
              children: stringFormatter.format('edit')
            })]
          }), /*#__PURE__*/jsxs(TooltipTrigger, {
            children: [/*#__PURE__*/jsx(ActionButton, {
              prominence: "low",
              onPress: () => {
                window.open(href, '_blank', 'noopener,noreferrer');
              },
              children: /*#__PURE__*/jsx(Icon, {
                src: externalLinkIcon
              })
            }), /*#__PURE__*/jsx(Tooltip, {
              children: /*#__PURE__*/jsx(Text, {
                truncate: 3,
                children: href
              })
            })]
          }), /*#__PURE__*/jsxs(TooltipTrigger, {
            children: [/*#__PURE__*/jsx(ActionButton, {
              prominence: "low",
              onPress: unlink,
              children: /*#__PURE__*/jsx(Icon, {
                src: unlinkIcon
              })
            }), /*#__PURE__*/jsx(Tooltip, {
              children: "Unlink"
            })]
          })]
        })
      })]
    }), /*#__PURE__*/jsx(DialogContainer, {
      onDismiss: () => {
        setDialogOpen(false);
        focusWithPreviousSelection(editor);
      },
      children: dialogOpen && /*#__PURE__*/jsx(LinkDialog, {
        text: text,
        href: href,
        onSubmit: ({
          href
        }) => {
          setNode({
            href
          });
        }
      })
    })]
  });
};
function LinkDialog({
  onSubmit,
  ...props
}) {
  let [href, setHref] = useState(props.href || '');
  let [touched, setTouched] = useState(false);
  let {
    dismiss
  } = useDialogContainer();
  let stringFormatter = useLocalizedStringFormatter(l10nMessages);
  const showInvalidState = touched && !isValidURL(href);
  return /*#__PURE__*/jsx(Dialog, {
    size: "small",
    children: /*#__PURE__*/jsxs("form", {
      style: {
        display: 'contents'
      },
      onSubmit: event => {
        if (event.target !== event.currentTarget) return;
        event.preventDefault();
        if (!showInvalidState) {
          dismiss();
          onSubmit({
            href
          });
        }
      },
      children: [/*#__PURE__*/jsxs(Heading, {
        children: [props.href ? 'Edit' : 'Add', " link"]
      }), /*#__PURE__*/jsx(Content, {
        children: /*#__PURE__*/jsxs(Flex, {
          gap: "large",
          direction: "column",
          children: [/*#__PURE__*/jsx(TextField, {
            label: "Text",
            value: props.text,
            isReadOnly: true
          }), /*#__PURE__*/jsx(TextField, {
            autoFocus: true,
            isRequired: true,
            onBlur: () => setTouched(true),
            label: "Link",
            onChange: setHref,
            value: href,
            errorMessage: showInvalidState && 'Please provide a valid URL.'
          })]
        })
      }), /*#__PURE__*/jsxs(ButtonGroup, {
        children: [/*#__PURE__*/jsx(Button, {
          onPress: dismiss,
          children: stringFormatter.format('cancel')
        }), /*#__PURE__*/jsx(Button, {
          prominence: "high",
          type: "submit",
          children: stringFormatter.format('save')
        })]
      })]
    })
  });
}
let _linkIcon = /*#__PURE__*/jsx(Icon, {
  src: linkIcon
});
function LinkButton() {
  const {
    editor,
    links: {
      isDisabled,
      isSelected
    }
  } = useToolbarState();
  return useMemo(() => /*#__PURE__*/jsx(ActionButton, {
    prominence: "low",
    isDisabled: isDisabled,
    isSelected: isSelected,
    onPress: () => {
      wrapLink(editor, '');
      ReactEditor.focus(editor);
    },
    children: _linkIcon
  }), [isSelected, isDisabled, editor]);
}
const linkButton = /*#__PURE__*/jsxs(TooltipTrigger, {
  children: [/*#__PURE__*/jsx(LinkButton, {}), /*#__PURE__*/jsx(Tooltip, {
    children: /*#__PURE__*/jsx(Text, {
      children: "Link"
    })
  })]
});

const values = {
  start: {
    key: 'start',
    label: 'Align Start',
    icon: /*#__PURE__*/jsx(Icon, {
      src: alignLeftIcon
    })
  },
  center: {
    key: 'center',
    label: 'Align Center',
    icon: /*#__PURE__*/jsx(Icon, {
      src: alignCenterIcon
    })
  },
  end: {
    key: 'end',
    label: 'Align End',
    icon: /*#__PURE__*/jsx(Icon, {
      src: alignRightIcon
    })
  }
};
const TextAlignMenu = ({
  alignment
}) => {
  const toolbarState = useToolbarState();
  const items = useMemo(() => [values.start, ...Object.keys(alignment).map(x => values[x])], [alignment]);
  return useMemo(() => /*#__PURE__*/jsxs(MenuTrigger, {
    children: [/*#__PURE__*/jsxs(TooltipTrigger, {
      children: [/*#__PURE__*/jsxs(ActionButton, {
        prominence: "low",
        children: [values[toolbarState.alignment.selected].icon, /*#__PURE__*/jsx(Icon, {
          src: chevronDownIcon
        })]
      }), /*#__PURE__*/jsx(Tooltip, {
        children: /*#__PURE__*/jsx(Text, {
          children: "Text Alignment"
        })
      })]
    }), /*#__PURE__*/jsx(Menu, {
      selectionMode: "single",
      selectedKeys: [toolbarState.alignment.selected],
      items: items,
      onAction: key => {
        if (key === 'start') {
          Transforms.unsetNodes(toolbarState.editor, 'textAlign', {
            match: node => node.type === 'paragraph' || node.type === 'heading'
          });
        } else {
          Transforms.setNodes(toolbarState.editor, {
            textAlign: key
          }, {
            match: node => node.type === 'paragraph' || node.type === 'heading'
          });
        }
        ReactEditor.focus(toolbarState.editor);
      },
      children: item => {
        return /*#__PURE__*/jsxs(Item$3, {
          textValue: item.label,
          children: [/*#__PURE__*/jsx(Text, {
            children: item.label
          }), item.icon]
        }, item.key);
      }
    })]
  }), [items, toolbarState.alignment.selected, toolbarState.editor]);
};

const insertBlockquote = editor => {
  const isActive = isElementActive(editor, 'blockquote');
  if (isActive) {
    Transforms.unwrapNodes(editor, {
      match: node => node.type === 'blockquote'
    });
  } else {
    Transforms.wrapNodes(editor, {
      type: 'blockquote',
      children: []
    });
  }
};
const BlockquoteButton = () => {
  const {
    editor,
    blockquote: {
      isDisabled,
      isSelected
    }
  } = useToolbarState();
  return useMemo(() => /*#__PURE__*/jsx(ActionButton, {
    prominence: "low",
    isSelected: isSelected,
    isDisabled: isDisabled,
    onPress: () => {
      insertBlockquote(editor);
      ReactEditor.focus(editor);
    },
    children: /*#__PURE__*/jsx(Icon, {
      src: quoteIcon
    })
  }), [editor, isDisabled, isSelected]);
};
const blockquoteButton = /*#__PURE__*/jsxs(TooltipTrigger, {
  children: [/*#__PURE__*/jsx(BlockquoteButton, {}), /*#__PURE__*/jsxs(Tooltip, {
    children: [/*#__PURE__*/jsx(Text, {
      children: "Quote"
    }), /*#__PURE__*/jsx(Kbd, {
      children: '>⎵'
    })]
  })]
});

function CustomAttributesDialogInner(props) {
  const editor = useSlateStatic();
  const [state, setState] = useState(() => {
    return getInitialPropsValueFromInitializer(props.schema, Object.fromEntries(Object.keys(props.schema.fields).map(key => [key, props.element[key]])));
  });
  const [forceValidation, setForceValidation] = useState(false);
  const previewProps = useMemo(() => createGetPreviewProps(props.schema, setState, () => undefined), [props.schema])(state);
  let {
    dismiss
  } = useDialogContainer();
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);
  return /*#__PURE__*/jsx(Dialog, {
    size: "small",
    children: /*#__PURE__*/jsxs("form", {
      style: {
        display: 'contents'
      },
      onSubmit: event => {
        if (event.target !== event.currentTarget) return;
        event.preventDefault();
        setForceValidation(true);
        if (clientSideValidateProp(props.schema, state, undefined)) {
          dismiss();
          const path = ReactEditor.findPath(editor, props.element);
          console.log(state);
          Transforms.setNodes(editor, state, {
            at: path
          });
        }
      },
      children: [/*#__PURE__*/jsxs(Heading, {
        children: [props.nodeLabel, " details"]
      }), /*#__PURE__*/jsx(Content, {
        children: /*#__PURE__*/jsx(FormValueContentFromPreviewProps, {
          forceValidation: forceValidation,
          autoFocus: true,
          ...previewProps
        })
      }), /*#__PURE__*/jsxs(ButtonGroup, {
        children: [/*#__PURE__*/jsx(Button, {
          onPress: dismiss,
          children: stringFormatter.format('cancel')
        }), /*#__PURE__*/jsx(Button, {
          prominence: "high",
          type: "submit",
          children: stringFormatter.format('save')
        })]
      })]
    })
  });
}
function CustomAttributesEditButton(props) {
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);
  return /*#__PURE__*/jsxs(TooltipTrigger, {
    children: [/*#__PURE__*/jsx(ActionButton, {
      prominence: "low",
      onPress: props.onPress,
      children: /*#__PURE__*/jsx(Icon, {
        src: editIcon
      })
    }), /*#__PURE__*/jsx(Tooltip, {
      children: stringFormatter.format('edit')
    })]
  });
}
function CustomAttributesDialog(props) {
  const editor = useSlateStatic();
  return /*#__PURE__*/jsx(DialogContainer, {
    onDismiss: () => {
      props.onDismiss();
      focusWithPreviousSelection(editor);
    },
    children: props.isOpen && /*#__PURE__*/jsx(CustomAttributesDialogInner, {
      element: props.element,
      nodeLabel: props.nodeLabel,
      schema: props.schema
    })
  });
}

function CodeButton() {
  const {
    editor,
    code: {
      isDisabled,
      isSelected
    }
  } = useToolbarState();
  return useMemo(() => /*#__PURE__*/jsx(ActionButton, {
    isSelected: isSelected,
    isDisabled: isDisabled,
    prominence: "low",
    onPress: () => {
      if (isSelected) {
        Transforms.unwrapNodes(editor, {
          match: node => node.type === 'code'
        });
      } else {
        Transforms.wrapNodes(editor, {
          type: 'code',
          children: [{
            text: ''
          }]
        });
      }
      ReactEditor.focus(editor);
    },
    children: /*#__PURE__*/jsx(Icon, {
      src: codeIcon
    })
  }), [isDisabled, isSelected, editor]);
}
const codeButton = /*#__PURE__*/jsxs(TooltipTrigger, {
  children: [/*#__PURE__*/jsx(CodeButton, {}), /*#__PURE__*/jsxs(Tooltip, {
    children: [/*#__PURE__*/jsx(Text, {
      children: "Code block"
    }), /*#__PURE__*/jsx(Kbd, {
      children: "```"
    })]
  })]
});
function CodeElement({
  attributes,
  children,
  element
}) {
  var _aliasesToLabel$get;
  const editor = useSlateStatic();
  const triggerRef = useRef(null);
  const [inputValue, setInputValue] = useState(element.language ? (_aliasesToLabel$get = aliasesToLabel.get(element.language)) !== null && _aliasesToLabel$get !== void 0 ? _aliasesToLabel$get : element.language : 'Plain text');
  const [dialogOpen, setDialogOpen] = useState(false);
  const {
    documentFeatures
  } = useDocumentEditorConfig();
  const customAttributesSchema = documentFeatures.formatting.blockTypes.code && Object.keys(documentFeatures.formatting.blockTypes.code.schema.fields).length ? documentFeatures.formatting.blockTypes.code.schema : undefined;
  return /*#__PURE__*/jsxs(Fragment, {
    children: [/*#__PURE__*/jsx(BlockWrapper, {
      children: /*#__PURE__*/jsxs(BlockPopoverTrigger, {
        element: element,
        children: [/*#__PURE__*/jsx("pre", {
          spellCheck: "false",
          ref: triggerRef,
          children: /*#__PURE__*/jsx("code", {
            ...attributes,
            children: children
          })
        }), /*#__PURE__*/jsx(BlockPopover, {
          children: /*#__PURE__*/jsxs(Flex, {
            gap: "regular",
            padding: "regular",
            children: [/*#__PURE__*/jsx(Combobox, {
              "aria-label": "Language",
              width: "scale.2000",
              allowsCustomValue: true // allow consumers to support other languages
              ,
              inputValue: inputValue,
              onInputChange: setInputValue,
              onBlur: () => {
                const path = ReactEditor.findPath(editor, element);
                const canonicalName = aliasesToCanonicalName.get(inputValue);
                if (canonicalName !== undefined) {
                  if (canonicalName === 'plain') {
                    Transforms.unsetNodes(editor, 'language', {
                      at: path
                    });
                    return;
                  }
                  setInputValue(canonicalNameToLabel.get(canonicalName));
                  Transforms.setNodes(editor, {
                    language: canonicalName
                  }, {
                    at: path
                  });
                  return;
                }
                const nameFromLabel = labelToCanonicalName.get(inputValue);
                if (nameFromLabel !== undefined) {
                  if (nameFromLabel === 'plain') {
                    Transforms.unsetNodes(editor, 'language', {
                      at: path
                    });
                    return;
                  }
                  Transforms.setNodes(editor, {
                    language: nameFromLabel
                  }, {
                    at: path
                  });
                  return;
                }
                if (inputValue === '') {
                  Transforms.unsetNodes(editor, 'language', {
                    at: path
                  });
                  setInputValue('Plain text');
                  return;
                }
                if (inputValue !== element.language) {
                  Transforms.setNodes(editor, {
                    language: inputValue
                  }, {
                    at: path
                  });
                }
              },
              onSelectionChange: selection => {
                const path = ReactEditor.findPath(editor, element);
                if (aliasesToCanonicalName.has(inputValue)) {
                  selection = aliasesToCanonicalName.get(inputValue);
                }
                if (selection === null) {
                  if (inputValue === '') {
                    Transforms.unsetNodes(editor, 'language', {
                      at: path
                    });
                  } else {
                    Transforms.setNodes(editor, {
                      language: inputValue
                    }, {
                      at: path
                    });
                  }
                } else if (typeof selection === 'string') {
                  if (selection === 'plain') {
                    Transforms.unsetNodes(editor, 'language', {
                      at: path
                    });
                    setInputValue('Plain text');
                    return;
                  }
                  Transforms.setNodes(editor, {
                    language: selection
                  }, {
                    at: path
                  });
                  const label = canonicalNameToLabel.get(selection);
                  if (label) {
                    setInputValue(label);
                  }
                }
              },
              selectedKey: element.language ? aliasesToCanonicalName.get(element.language) : 'plain',
              items: useMemo(() => inputValue === 'Plain text' || labelToCanonicalName.has(inputValue) ? languagesWithAliases : matchSorter(languagesWithAliases, inputValue, {
                keys: ['label', 'value', 'aliases']
              }), [inputValue]),
              children: item => /*#__PURE__*/jsx(Item$1, {
                children: item.label
              }, item.value)
            }), /*#__PURE__*/jsx(ToolbarSeparator, {}), customAttributesSchema !== undefined && /*#__PURE__*/jsx(CustomAttributesEditButton, {
              onPress: () => setDialogOpen(true)
            }), /*#__PURE__*/jsxs(TooltipTrigger, {
              children: [/*#__PURE__*/jsx(ActionButton, {
                prominence: "low",
                onPress: () => {
                  Transforms.removeNodes(editor, {
                    at: ReactEditor.findPath(editor, element)
                  });
                },
                children: /*#__PURE__*/jsx(Icon, {
                  src: trash2Icon
                })
              }), /*#__PURE__*/jsx(Tooltip, {
                tone: "critical",
                children: "Remove"
              })]
            })]
          })
        })]
      })
    }), customAttributesSchema !== undefined && /*#__PURE__*/jsx(CustomAttributesDialog, {
      element: element,
      isOpen: dialogOpen,
      nodeLabel: "Code block",
      schema: customAttributesSchema,
      onDismiss: () => {
        setDialogOpen(false);
      }
    })]
  });
}

function updateComponentBlockElementProps(editor, componentBlock, prevProps, _newProps, basePath, setElement, ignoreChildFields) {
  Editor.withoutNormalizing(editor, () => {
    const propPathsWithNodesToReplace = new Map();
    const schema = {
      kind: 'object',
      fields: componentBlock.schema
    };
    const newProps = transformProps(schema, _newProps, {
      child(schema, value, path) {
        if (!ignoreChildFields && schema.options.kind === 'block' && value) {
          try {
            let prevVal = getValueAtPropPath(prevProps, path);
            if (prevVal === value) {
              return null;
            }
          } catch {}
          propPathsWithNodesToReplace.set(JSON.stringify(path), value.map(cloneDescendent));
        }
        return null;
      }
    });
    setElement({
      props: newProps
    });
    const childPropPaths = findChildPropPathsWithPrevious(newProps, prevProps, schema, [], [], []);
    const getNode = () => Node.get(editor, basePath);
    const elementForChildren = getNode();
    if (childPropPaths.length === 0) {
      const indexes = elementForChildren.children.map((_, i) => i).reverse();
      for (const idx of indexes) {
        Transforms.removeNodes(editor, {
          at: [...basePath, idx]
        });
      }
      Transforms.insertNodes(editor, {
        type: 'component-inline-prop',
        propPath: undefined,
        children: [{
          text: ''
        }]
      }, {
        at: [...basePath, 0]
      });
      return;
    }
    const initialPropPathsToEditorPath = new Map();
    for (const [idx, node] of elementForChildren.children.entries()) {
      assert(node.type === 'component-block-prop' || node.type === 'component-inline-prop');
      initialPropPathsToEditorPath.set(node.propPath === undefined ? undefined : JSON.stringify(node.propPath), idx);
    }
    const childrenLeftToAdd = new Set(childPropPaths);
    for (const childProp of childPropPaths) {
      if (childProp.prevPath === undefined) {
        continue;
      }
      const stringifiedPath = JSON.stringify(childProp.prevPath);
      const idxInChildren = initialPropPathsToEditorPath.get(stringifiedPath);
      if (idxInChildren !== undefined) {
        const prevNode = elementForChildren.children[idxInChildren];
        assert(prevNode.propPath !== undefined);
        if (!areArraysEqual(childProp.path, prevNode.propPath)) {
          Transforms.setNodes(editor, {
            propPath: childProp.path
          }, {
            at: [...basePath, idxInChildren]
          });
        }
        childrenLeftToAdd.delete(childProp);
        initialPropPathsToEditorPath.delete(stringifiedPath);
      }
    }
    let newIdx = getNode().children.length;
    for (const childProp of childrenLeftToAdd) {
      Transforms.insertNodes(editor, {
        type: `component-${childProp.options.kind}-prop`,
        propPath: childProp.path,
        children: [childProp.options.kind === 'block' ? {
          type: 'paragraph',
          children: [{
            text: ''
          }]
        } : {
          text: ''
        }]
      }, {
        at: [...basePath, newIdx]
      });
      newIdx++;
    }
    const pathsToRemove = [];
    for (const [, idxInChildren] of initialPropPathsToEditorPath) {
      pathsToRemove.push(Editor.pathRef(editor, [...basePath, idxInChildren]));
    }
    for (const pathRef of pathsToRemove) {
      const path = pathRef.unref();
      assert(path !== null);
      Transforms.removeNodes(editor, {
        at: path
      });
    }
    const propPathsToExpectedIndexes = new Map();
    for (const [idx, thing] of childPropPaths.entries()) {
      propPathsToExpectedIndexes.set(JSON.stringify(thing.path), idx);
    }
    outer: while (true) {
      for (const [idx, childNode] of getNode().children.entries()) {
        assert(childNode.type === 'component-block-prop' || childNode.type === 'component-inline-prop');
        const expectedIndex = propPathsToExpectedIndexes.get(JSON.stringify(childNode.propPath));
        assert(expectedIndex !== undefined);
        if (idx === expectedIndex) continue;
        Transforms.moveNodes(editor, {
          at: [...basePath, idx],
          to: [...basePath, expectedIndex]
        });

        // start the for-loop again
        continue outer;
      }
      break;
    }
    for (const [propPath, val] of propPathsWithNodesToReplace) {
      const idx = propPathsToExpectedIndexes.get(propPath);
      if (idx !== undefined) {
        Transforms.removeNodes(editor, {
          at: [...basePath, idx]
        });
        Transforms.insertNodes(editor, {
          type: 'component-block-prop',
          propPath: JSON.parse(propPath),
          children: val
        }, {
          at: [...basePath, idx]
        });
      }
    }
  });
}
function findChildPropPathsWithPrevious(value, prevValue, schema, newPath, prevPath, pathWithKeys) {
  switch (schema.kind) {
    case 'form':
      return [];
    case 'child':
      return [{
        path: newPath,
        prevPath,
        options: schema.options
      }];
    case 'conditional':
      const hasChangedDiscriminant = value.discriminant === prevValue.discriminant;
      return findChildPropPathsWithPrevious(value.value, hasChangedDiscriminant ? prevValue.value : getInitialPropsValue(schema.values[value.discriminant]), schema.values[value.discriminant], newPath.concat('value'), hasChangedDiscriminant ? undefined : prevPath === null || prevPath === void 0 ? void 0 : prevPath.concat('value'), hasChangedDiscriminant ? undefined : pathWithKeys === null || pathWithKeys === void 0 ? void 0 : pathWithKeys.concat('value'));
    case 'object':
      {
        const paths = [];
        for (const key of Object.keys(schema.fields)) {
          paths.push(...findChildPropPathsWithPrevious(value[key], prevValue[key], schema.fields[key], newPath.concat(key), prevPath === null || prevPath === void 0 ? void 0 : prevPath.concat(key), pathWithKeys === null || pathWithKeys === void 0 ? void 0 : pathWithKeys.concat(key)));
        }
        return paths;
      }
    case 'array':
      {
        const paths = [];
        const prevKeys = getKeysForArrayValue(prevValue);
        const keys = getKeysForArrayValue(value);
        for (const [i, val] of value.entries()) {
          const key = keys[i];
          const prevIdx = prevKeys.indexOf(key);
          let prevVal;
          if (prevIdx === -1) {
            prevVal = getInitialPropsValue(schema.element);
          } else {
            prevVal = prevValue[prevIdx];
          }
          paths.push(...findChildPropPathsWithPrevious(val, prevVal, schema.element, newPath.concat(i), prevIdx === -1 ? undefined : prevPath === null || prevPath === void 0 ? void 0 : prevPath.concat(prevIdx), prevIdx === -1 ? undefined : pathWithKeys === null || pathWithKeys === void 0 ? void 0 : pathWithKeys.concat(key)));
        }
        return paths;
      }
  }
}

const ChildrenByPathContext = /*#__PURE__*/React__default.createContext({});
function ChildFieldEditable({
  path
}) {
  const childrenByPath = useContext(ChildrenByPathContext);
  const child = childrenByPath[JSON.stringify(path)];
  if (child === undefined) {
    return null;
  }
  return child;
}
function ComponentBlockRender({
  componentBlock,
  element,
  onChange,
  children,
  onRemove
}) {
  const getPreviewProps = useMemo(() => {
    return createGetPreviewProps({
      kind: 'object',
      fields: componentBlock.schema
    }, cb => onChange(cb, true), path => /*#__PURE__*/jsx(ChildFieldEditable, {
      path: path
    }));
  }, [onChange, componentBlock]);
  const previewProps = getPreviewProps(element.props);
  const childrenByPath = {};
  let maybeChild;
  let extraChildren = [];
  children.forEach(child => {
    const propPath = child.props.children.props.element.propPath;
    if (propPath === undefined) {
      maybeChild = child;
    } else {
      const schema = getSchemaAtPropPath(propPath, element.props, componentBlock.schema);
      if ((schema === null || schema === void 0 ? void 0 : schema.kind) === 'child' && schema.options.kind === 'block' && schema.options.editIn === 'modal') {
        extraChildren.push(child);
        return;
      }
      childrenByPath[JSON.stringify(propPathWithIndiciesToKeys(propPath, element.props))] = child;
    }
  });
  const ComponentBlockPreview = componentBlock.preview;
  return /*#__PURE__*/jsxs(ChildrenByPathContext.Provider, {
    value: childrenByPath,
    children: [useMemo(() => /*#__PURE__*/jsx(ComponentBlockPreview, {
      onRemove: onRemove,
      ...previewProps
    }), [ComponentBlockPreview, onRemove, previewProps]), /*#__PURE__*/jsxs("span", {
      className: css({
        caretColor: 'transparent',
        '& ::selection': {
          backgroundColor: 'transparent'
        },
        overflow: 'hidden',
        width: 1,
        height: 1,
        position: 'absolute'
      }),
      children: [maybeChild, extraChildren]
    })]
  });
}

// note this is written to avoid crashing when the given prop path doesn't exist in the value
// this is because editor updates happen asynchronously but we have some logic to ensure
// that updating the props of a component block synchronously updates it
// (this is primarily to not mess up things like cursors in inputs)
// this means that sometimes the child elements will be inconsistent with the values
// so to deal with this, we return a prop path this is "wrong" but won't break anything
function propPathWithIndiciesToKeys(propPath, val) {
  return propPath.map(key => {
    var _val2;
    if (typeof key === 'string') {
      var _val;
      val = (_val = val) === null || _val === void 0 ? void 0 : _val[key];
      return key;
    }
    if (!Array.isArray(val)) {
      val = undefined;
      return '';
    }
    const keys = getKeysForArrayValue(val);
    val = (_val2 = val) === null || _val2 === void 0 ? void 0 : _val2[key];
    return keys[key];
  });
}

function ChromefulComponentBlockElement(props) {
  var _props$componentBlock;
  const selected = useSelected();
  const isValid = useMemo(() => clientSideValidateProp({
    kind: 'object',
    fields: props.componentBlock.schema
  }, props.elementProps, undefined), [props.componentBlock, props.elementProps]);
  const [editMode, setEditMode] = useState(false);
  const onCloseEditMode = useCallback(() => {
    setEditMode(false);
  }, []);
  const onShowEditMode = useCallback(() => {
    setEditMode(true);
  }, []);
  const ChromefulToolbar = (_props$componentBlock = props.componentBlock.toolbar) !== null && _props$componentBlock !== void 0 ? _props$componentBlock : DefaultToolbarWithChrome;
  return /*#__PURE__*/jsx(BlockPrimitive, {
    selected: selected,
    ...props.attributes,
    children: /*#__PURE__*/jsxs(Flex, {
      gap: "medium",
      direction: "column",
      children: [/*#__PURE__*/jsx(NotEditable, {
        children: /*#__PURE__*/jsx(Text, {
          casing: "uppercase",
          color: "neutralSecondary",
          weight: "medium",
          size: "small",
          children: props.componentBlock.label
        })
      }), /*#__PURE__*/jsxs(Fragment$1, {
        children: [props.renderedBlock, /*#__PURE__*/jsx(ChromefulToolbar, {
          isValid: isValid,
          onRemove: props.onRemove,
          props: props.previewProps,
          onShowEditMode: onShowEditMode
        }), /*#__PURE__*/jsx(DialogContainer, {
          onDismiss: () => onCloseEditMode(),
          children: (() => {
            if (!editMode) {
              return;
            }
            return /*#__PURE__*/jsxs(Dialog, {
              children: [/*#__PURE__*/jsxs(Heading, {
                children: ["Edit ", props.componentBlock.label]
              }), /*#__PURE__*/jsx(FormValue, {
                props: props.previewProps,
                onClose: onCloseEditMode
              })]
            });
          })()
        })]
      })]
    })
  });
}

/**
 * Wrap block content, delimiting it from surrounding content, and provide a
 * focus indicator because the cursor may not be present.
 */
const BlockPrimitive = /*#__PURE__*/forwardRef(function BlockPrimitive({
  children,
  selected,
  ...attributes
}, ref) {
  return /*#__PURE__*/jsx("div", {
    ...attributes,
    ref: ref,
    className: css(blockElementSpacing, {
      position: 'relative',
      paddingInlineStart: tokenSchema.size.space.xlarge,
      marginBottom: tokenSchema.size.space.xlarge,
      '::before': {
        display: 'block',
        content: '" "',
        backgroundColor: selected ? tokenSchema.color.alias.borderSelected : tokenSchema.color.alias.borderIdle,
        borderRadius: 4,
        width: 4,
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 1
      }
    }),
    children: children
  });
});
function DefaultToolbarWithChrome({
  onShowEditMode,
  onRemove,
  isValid
}) {
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);
  return /*#__PURE__*/jsx(NotEditable, {
    children: /*#__PURE__*/jsxs(Flex, {
      direction: "column",
      gap: "medium",
      children: [/*#__PURE__*/jsxs(Flex, {
        alignItems: "center",
        gap: "regular",
        UNSAFE_style: {
          userSelect: 'none'
        },
        children: [/*#__PURE__*/jsx(ActionButton, {
          onPress: () => onShowEditMode(),
          children: stringFormatter.format('edit')
        }), /*#__PURE__*/jsxs(TooltipTrigger, {
          children: [/*#__PURE__*/jsx(ActionButton, {
            prominence: "low",
            onPress: onRemove,
            children: /*#__PURE__*/jsx(Icon, {
              src: trash2Icon
            })
          }), /*#__PURE__*/jsx(Tooltip, {
            tone: "critical",
            children: stringFormatter.format('delete')
          })]
        })]
      }), !isValid && /*#__PURE__*/jsx(FieldMessage, {
        children: "Contains invalid fields. Please edit."
      })]
    })
  });
}
function FormValue({
  onClose,
  props
}) {
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);
  const formId = useId();
  const [forceValidation, setForceValidation] = useState(false);
  const [state, setState] = useState(() => previewPropsToValue(props));
  const previewProps = useMemo(() => createGetPreviewProps(props.schema, setState, () => undefined), [props.schema])(state);
  return /*#__PURE__*/jsxs(Fragment, {
    children: [/*#__PURE__*/jsx(Content, {
      children: /*#__PURE__*/jsx(Flex, {
        id: formId,
        elementType: "form",
        onSubmit: event => {
          if (event.target !== event.currentTarget) return;
          event.preventDefault();
          if (!clientSideValidateProp(props.schema, state, undefined)) {
            setForceValidation(true);
          } else {
            console.log(valueToUpdater(state, props.schema));
            setValueToPreviewProps(state, props);
            onClose();
          }
        },
        direction: "column",
        gap: "xxlarge",
        children: /*#__PURE__*/jsx(FormValueContentFromPreviewProps, {
          ...previewProps,
          forceValidation: forceValidation
        })
      })
    }), /*#__PURE__*/jsxs(ButtonGroup, {
      children: [/*#__PURE__*/jsx(Button, {
        onPress: onClose,
        children: stringFormatter.format('cancel')
      }), /*#__PURE__*/jsx(Button, {
        form: formId,
        prominence: "high",
        type: "submit",
        children: "Done"
      })]
    })]
  });
}

function ChromelessComponentBlockElement(props) {
  var _props$componentBlock;
  const hasToolbar = props.componentBlock.toolbar !== null;
  const ChromelessToolbar = (_props$componentBlock = props.componentBlock.toolbar) !== null && _props$componentBlock !== void 0 ? _props$componentBlock : DefaultToolbarWithoutChrome;
  return /*#__PURE__*/jsx("div", {
    ...props.attributes,
    className: blockElementSpacing,
    children: hasToolbar ? /*#__PURE__*/jsxs(BlockPopoverTrigger, {
      element: props.element,
      children: [/*#__PURE__*/jsx("div", {
        children: props.renderedBlock
      }), /*#__PURE__*/jsx(BlockPopover, {
        children: /*#__PURE__*/jsx(ChromelessToolbar, {
          onRemove: props.onRemove,
          props: props.previewProps
        })
      })]
    }) : /*#__PURE__*/jsx("div", {
      children: props.renderedBlock
    })
  });
}
function DefaultToolbarWithoutChrome({
  onRemove
}) {
  return /*#__PURE__*/jsxs(TooltipTrigger, {
    children: [/*#__PURE__*/jsx(ActionButton, {
      onPress: onRemove,
      margin: "regular",
      children: /*#__PURE__*/jsx(Icon, {
        src: trashIcon
      })
    }), /*#__PURE__*/jsx(Tooltip, {
      tone: "critical",
      children: "Remove"
    })]
  });
}

function ComponentInlineProp(props) {
  return /*#__PURE__*/jsx("span", {
    ...props.attributes,
    children: props.children
  });
}
function getInitialValue(type, componentBlock) {
  const props = getInitialPropsValue({
    kind: 'object',
    fields: componentBlock.schema
  });
  return {
    type: 'component-block',
    component: type,
    props,
    children: findChildPropPaths(props, componentBlock.schema).map(x => ({
      type: `component-${x.options.kind}-prop`,
      propPath: x.path,
      children: [x.options.kind === 'block' ? {
        type: 'paragraph',
        children: [{
          text: ''
        }]
      } : {
        text: ''
      }]
    }))
  };
}
function insertComponentBlock(editor, componentBlocks, componentBlock) {
  const node = getInitialValue(componentBlock, componentBlocks[componentBlock]);
  insertNodesButReplaceIfSelectionIsAtEmptyParagraphOrHeading(editor, node);
  const componentBlockEntry = Editor.above(editor, {
    match: node => node.type === 'component-block'
  });
  if (componentBlockEntry) {
    const start = Editor.start(editor, componentBlockEntry[1]);
    Transforms.setSelection(editor, {
      anchor: start,
      focus: start
    });
  }
}
const ComponentBlocksElement = ({
  attributes,
  children,
  element: __elementToGetPath
}) => {
  const editor = useSlateStatic();
  const [currentElement, setElement] = useElementWithSetNodes(editor, __elementToGetPath);
  const blockComponents = useDocumentEditorConfig().componentBlocks;
  const componentBlock = blockComponents[currentElement.component];
  const propsWithChildFields = useMemo(() => {
    if (!componentBlock) return;
    const blockChildrenByPath = new Map();
    for (const child of currentElement.children) {
      if (child.type === 'component-block-prop' && child.propPath) {
        blockChildrenByPath.set(JSON.stringify(child.propPath), child.children);
      }
    }
    if (!blockChildrenByPath.size) return currentElement.props;
    return transformProps({
      kind: 'object',
      fields: componentBlock.schema
    }, currentElement.props, {
      child(schema, value, propPath) {
        if (schema.options.kind === 'block') {
          const key = JSON.stringify(propPath);
          const children = blockChildrenByPath.get(key);
          if (children) {
            return children.map(cloneDescendent);
          }
        }
        return value;
      }
    });
  }, [componentBlock, currentElement]);
  const elementToGetPathRef = useRef({
    __elementToGetPath,
    currentElement,
    propsWithChildFields
  });
  useEffect(() => {
    elementToGetPathRef.current = {
      __elementToGetPath,
      currentElement,
      propsWithChildFields
    };
  });
  const onRemove = useEventCallback(() => {
    const path = ReactEditor.findPath(editor, __elementToGetPath);
    Transforms.removeNodes(editor, {
      at: path
    });
  });
  const onPropsChange = useCallback((cb, ignoreChildFields) => {
    const prevProps = elementToGetPathRef.current.propsWithChildFields;
    updateComponentBlockElementProps(editor, componentBlock, prevProps, cb(prevProps), ReactEditor.findPath(editor, elementToGetPathRef.current.__elementToGetPath), setElement, ignoreChildFields);
  }, [setElement, componentBlock, editor]);
  const getToolbarPreviewProps = useMemo(() => {
    if (!componentBlock) {
      return () => {
        throw new Error('expected component block to exist when called');
      };
    }
    return createGetPreviewProps({
      kind: 'object',
      fields: componentBlock.schema
    }, cb => onPropsChange(cb, false), () => undefined);
  }, [componentBlock, onPropsChange]);
  if (!componentBlock) {
    return /*#__PURE__*/jsxs("div", {
      style: {
        border: 'red 4px solid',
        padding: 8
      },
      children: [/*#__PURE__*/jsx("pre", {
        contentEditable: false,
        style: {
          userSelect: 'none'
        },
        children: `The block "${currentElement.component}" no longer exists.

Props:

${JSON.stringify(currentElement.props, null, 2)}

Content:`
      }), children]
    });
  }
  const toolbarPreviewProps = getToolbarPreviewProps(propsWithChildFields);
  const renderedBlock = /*#__PURE__*/jsx(ComponentBlockRender, {
    children: children,
    componentBlock: componentBlock,
    element: currentElement,
    onChange: onPropsChange,
    onRemove: onRemove
  });
  return componentBlock.chromeless ? /*#__PURE__*/jsx(ChromelessComponentBlockElement, {
    element: __elementToGetPath,
    attributes: attributes,
    renderedBlock: renderedBlock,
    componentBlock: componentBlock,
    onRemove: onRemove,
    previewProps: toolbarPreviewProps
  }) : /*#__PURE__*/jsx(ChromefulComponentBlockElement, {
    attributes: attributes,
    children: children,
    componentBlock: componentBlock,
    onRemove: onRemove,
    previewProps: toolbarPreviewProps,
    renderedBlock: renderedBlock,
    elementProps: currentElement.props
  });
};

function insertDivider(editor) {
  insertNodesButReplaceIfSelectionIsAtEmptyParagraphOrHeading(editor, {
    type: 'divider',
    children: [{
      text: ''
    }]
  });
  Editor.insertNode(editor, {
    type: 'paragraph',
    children: [{
      text: ''
    }]
  });
}
const DividerButton = () => {
  const {
    editor,
    dividers: {
      isDisabled
    }
  } = useToolbarState();
  return useMemo(() => /*#__PURE__*/jsx(ActionButton, {
    prominence: "low",
    isDisabled: isDisabled,
    onPress: () => {
      insertDivider(editor);
    },
    children: /*#__PURE__*/jsx(Icon, {
      src: minusIcon
    })
  }), [editor, isDisabled]);
};
const dividerButton = /*#__PURE__*/jsxs(TooltipTrigger, {
  delay: 200,
  children: [/*#__PURE__*/jsx(DividerButton, {}), /*#__PURE__*/jsxs(Tooltip, {
    children: [/*#__PURE__*/jsx(Text, {
      children: "Divider"
    }), /*#__PURE__*/jsx(Kbd, {
      children: "---"
    })]
  })]
});
function DividerElement({
  attributes,
  children
}) {
  const selected = useSelected();
  return /*#__PURE__*/jsxs("div", {
    ...attributes,
    style: {
      caretColor: 'transparent'
    },
    children: [/*#__PURE__*/jsx("hr", {
      style: {
        backgroundColor: selected ? tokenSchema.color.alias.borderSelected : tokenSchema.color.alias.borderIdle
      }
    }), children]
  });
}

const LayoutContainer = ({
  attributes,
  children,
  element
}) => {
  const editor = useSlateStatic();
  const layout = element.layout;
  const layoutOptions = useDocumentEditorConfig().documentFeatures.layouts;
  const currentLayoutIndex = layoutOptions.findIndex(x => x.toString() === layout.toString());
  return /*#__PURE__*/jsx("div", {
    className: blockElementSpacing,
    ...attributes,
    children: /*#__PURE__*/jsxs(BlockPopoverTrigger, {
      element: element,
      children: [/*#__PURE__*/jsx("div", {
        className: css({
          columnGap: tokenSchema.size.space.regular,
          display: 'grid'
        }),
        style: {
          gridTemplateColumns: layout.map(x => `${x}fr`).join(' ')
        },
        children: children
      }), /*#__PURE__*/jsx(BlockPopover, {
        children: /*#__PURE__*/jsxs(Flex, {
          padding: "regular",
          gap: "regular",
          children: [/*#__PURE__*/jsx(ActionGroup, {
            selectionMode: "single",
            prominence: "low",
            density: "compact",
            onAction: key => {
              const path = ReactEditor.findPath(editor, element);
              const layoutOption = layoutOptions[key];
              Transforms.setNodes(editor, {
                type: 'layout',
                layout: layoutOption
              }, {
                at: path
              });
              ReactEditor.focus(editor);
            },
            selectedKeys: currentLayoutIndex !== -1 ? [currentLayoutIndex.toString()] : [],
            children: layoutOptions.map((layoutOption, i) => /*#__PURE__*/jsx(Item$3, {
              children: makeLayoutIcon(layoutOption)
            }, i))
          }), /*#__PURE__*/jsx(ToolbarSeparator, {}), /*#__PURE__*/jsxs(TooltipTrigger, {
            children: [/*#__PURE__*/jsx(ActionButton, {
              prominence: "low",
              onPress: () => {
                const path = ReactEditor.findPath(editor, element);
                Transforms.removeNodes(editor, {
                  at: path
                });
              },
              children: /*#__PURE__*/jsx(Icon, {
                src: trash2Icon
              })
            }), /*#__PURE__*/jsx(Tooltip, {
              tone: "critical",
              children: "Remove"
            })]
          })]
        })
      })]
    })
  });
};
const LayoutArea = ({
  attributes,
  children
}) => {
  return /*#__PURE__*/jsx("div", {
    className: css({
      borderColor: tokenSchema.color.border.neutral,
      borderRadius: tokenSchema.size.radius.regular,
      borderStyle: 'dashed',
      borderWidth: tokenSchema.size.border.regular,
      padding: tokenSchema.size.space.medium
    }),
    ...attributes,
    children: children
  });
};
const insertLayout = (editor, layout) => {
  insertNodesButReplaceIfSelectionIsAtEmptyParagraphOrHeading(editor, [{
    type: 'layout',
    layout,
    children: [{
      type: 'layout-area',
      children: [{
        type: 'paragraph',
        children: [{
          text: ''
        }]
      }]
    }]
  }]);
  const layoutEntry = Editor.above(editor, {
    match: x => x.type === 'layout'
  });
  if (layoutEntry) {
    Transforms.select(editor, [...layoutEntry[1], 0]);
  }
};

// Utils
// ------------------------------

function makeLayoutIcon(ratios) {
  const size = 16;
  const element = /*#__PURE__*/jsx("div", {
    role: "img",
    className: css({
      display: 'grid',
      gridTemplateColumns: ratios.map(r => `${r}fr`).join(' '),
      gap: 2,
      width: size,
      height: size
    }),
    children: ratios.map((_, i) => {
      return /*#__PURE__*/jsx("div", {
        className: css({
          backgroundColor: 'currentcolor',
          borderRadius: 1
        })
      }, i);
    })
  });
  return element;
}
const layoutsIcon = /*#__PURE__*/jsx(Icon, {
  src: columnsIcon
});
const LayoutsButton = ({
  layouts
}) => {
  const {
    editor,
    layouts: {
      isSelected
    }
  } = useToolbarState();
  return useMemo(() => /*#__PURE__*/jsxs(TooltipTrigger, {
    children: [/*#__PURE__*/jsx(ActionButton, {
      prominence: "low",
      isSelected: isSelected,
      onPress: () => {
        if (isElementActive(editor, 'layout')) {
          Transforms.unwrapNodes(editor, {
            match: node => node.type === 'layout'
          });
        } else {
          insertLayout(editor, layouts[0]);
        }
        ReactEditor.focus(editor);
      },
      children: layoutsIcon
    }), /*#__PURE__*/jsx(Tooltip, {
      children: "Layouts"
    })]
  }), [editor, isSelected, layouts]);
};

const toggleList = (editor, format) => {
  const listAbove = getListTypeAbove(editor);
  const isActive = isElementActive(editor, format) && (listAbove === 'none' || listAbove === format);
  Editor.withoutNormalizing(editor, () => {
    Transforms.unwrapNodes(editor, {
      match: isListNode,
      split: true,
      mode: isActive ? 'all' : 'lowest'
    });
    if (!isActive) {
      Transforms.wrapNodes(editor, {
        type: format,
        children: []
      }, {
        match: x => x.type !== 'list-item-content' && isBlock(x)
      });
    }
  });
};
function ListButtons(props) {
  const {
    editor,
    lists
  } = useToolbarState();
  return useMemo(() => {
    const disabledKeys = [];
    if (lists.ordered.isDisabled) disabledKeys.push('ordered');
    if (lists.unordered.isDisabled) disabledKeys.push('unordered');
    const selectedKeys = [];
    if (lists.ordered.isSelected) selectedKeys.push('ordered');
    if (lists.unordered.isSelected) selectedKeys.push('unordered');
    return /*#__PURE__*/jsx(ActionGroup, {
      flexShrink: 0,
      "aria-label": "Lists",
      selectionMode: "single",
      buttonLabelBehavior: "hide",
      density: "compact"
      // overflowMode="collapse"
      ,
      prominence: "low",
      summaryIcon: /*#__PURE__*/jsx(Icon, {
        src: listIcon
      }),
      selectedKeys: selectedKeys,
      disabledKeys: disabledKeys,
      onAction: key => {
        const format = `${key}-list`;
        toggleList(editor, format);
        ReactEditor.focus(editor);
      },
      children: [props.lists.unordered && /*#__PURE__*/jsxs(Item$3, {
        textValue: "Bullet List (- )",
        children: [/*#__PURE__*/jsx(Icon, {
          src: listIcon
        }), /*#__PURE__*/jsx(Text, {
          children: "Bullet List"
        }), /*#__PURE__*/jsx(Kbd, {
          children: "-\u23B5"
        })]
      }, "unordered"), props.lists.ordered && /*#__PURE__*/jsxs(Item$3, {
        textValue: "Numbered List (1.)",
        children: [/*#__PURE__*/jsx(Icon, {
          src: listOrderedIcon
        }), /*#__PURE__*/jsx(Text, {
          children: "Numbered List"
        }), /*#__PURE__*/jsx(Kbd, {
          children: "1.\u23B5"
        })]
      }, "ordered")].filter(x => x !== false)
    });
  }, [editor, lists.ordered.isDisabled, lists.ordered.isSelected, lists.unordered.isDisabled, lists.unordered.isSelected, props.lists.ordered, props.lists.unordered]);
}
function nestList(editor) {
  const block = Editor.above(editor, {
    match: isBlock
  });
  if (!block || block[0].type !== 'list-item-content') {
    return false;
  }
  const listItemPath = Path.parent(block[1]);
  // we're the first item in the list therefore we can't nest
  if (listItemPath[listItemPath.length - 1] === 0) {
    return false;
  }
  const previousListItemPath = Path.previous(listItemPath);
  const previousListItemNode = Node.get(editor, previousListItemPath);
  if (previousListItemNode.children.length !== 1) {
    // there's a list nested inside our previous sibling list item so move there
    Transforms.moveNodes(editor, {
      at: listItemPath,
      to: [...previousListItemPath, previousListItemNode.children.length - 1, previousListItemNode.children[previousListItemNode.children.length - 1].children.length]
    });
    return true;
  }
  const type = Editor.parent(editor, Path.parent(block[1]))[0].type;
  Editor.withoutNormalizing(editor, () => {
    Transforms.wrapNodes(editor, {
      type,
      children: []
    }, {
      at: listItemPath
    });
    Transforms.moveNodes(editor, {
      to: [...previousListItemPath, previousListItemNode.children.length],
      at: listItemPath
    });
  });
  return true;
}
function unnestList(editor) {
  const block = Editor.above(editor, {
    match: isBlock
  });
  if (block && block[0].type === 'list-item-content') {
    Transforms.unwrapNodes(editor, {
      match: isListNode,
      split: true
    });
    return true;
  }
  return false;
}

function getUploadedFileObject(accept) {
  return new Promise(resolve => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.onchange = () => {
      var _input$files;
      const file = (_input$files = input.files) === null || _input$files === void 0 ? void 0 : _input$files[0];
      if (file) {
        resolve(file);
      }
    };
    document.body.appendChild(input);
    input.click();
  });
}
async function getUploadedFile(accept) {
  const file = await getUploadedFileObject(accept);
  if (!file) return undefined;
  return {
    content: new Uint8Array(await file.arrayBuffer()),
    filename: file.name
  };
}
function getUploadedImage() {
  return getUploadedFile('image/*');
}
function useObjectURL(data) {
  const [url, setUrl] = useState(null);
  useEffect(() => {
    if (data) {
      const url = URL.createObjectURL(new Blob([data]));
      setUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setUrl(null);
    }
  }, [data]);
  return url;
}

const ImageElement = ({
  attributes,
  children,
  element: __elementForGettingPath
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [aspectRatio, setAspectRatio] = useState();
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);
  const editor = useSlateStatic();
  const [currentElement, setNode] = useElementWithSetNodes(editor, __elementForGettingPath);
  const objectUrl = useObjectURL(currentElement.src.content);
  const activePopoverElement = useActiveBlockPopover();
  const selected = activePopoverElement === __elementForGettingPath;
  return /*#__PURE__*/jsxs(Fragment, {
    children: [/*#__PURE__*/jsxs(BlockWrapper, {
      attributes: attributes,
      children: [children, /*#__PURE__*/jsxs(BlockPopoverTrigger, {
        element: __elementForGettingPath,
        children: [/*#__PURE__*/jsx("div", {
          style: {
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column'
          },
          children: /*#__PURE__*/jsx(NotEditable, {
            children: /*#__PURE__*/jsx("img", {
              ...attributes,
              src: objectUrl,
              alt: currentElement.alt,
              "data-selected": selected,
              onLoad: e => {
                const target = e.target;
                setAspectRatio(target.width / target.height);
              },
              className: css({
                boxSizing: 'border-box',
                borderRadius: tokenSchema.size.radius.regular,
                display: 'block',
                maxHeight: tokenSchema.size.scale[3600],
                maxWidth: '100%',
                transition: transition('box-shadow'),
                '&[data-selected=true]': {
                  boxShadow: `0 0 0 ${tokenSchema.size.border.regular} ${tokenSchema.color.alias.borderSelected}`
                }
              })
            })
          })
        }), /*#__PURE__*/jsx(BlockPopover, {
          hideArrow: true,
          children: /*#__PURE__*/jsxs(Flex, {
            gap: "regular",
            padding: "regular",
            children: [/*#__PURE__*/jsxs(Flex, {
              gap: "small",
              children: [/*#__PURE__*/jsxs(TooltipTrigger, {
                children: [/*#__PURE__*/jsx(ActionButton, {
                  prominence: "low",
                  onPress: () => setDialogOpen(true),
                  children: /*#__PURE__*/jsx(Icon, {
                    src: editIcon
                  })
                }), /*#__PURE__*/jsx(Tooltip, {
                  children: stringFormatter.format('edit')
                })]
              }), /*#__PURE__*/jsxs(TooltipTrigger, {
                children: [/*#__PURE__*/jsx(ActionButton, {
                  prominence: "low",
                  onPress: async () => {
                    const src = await getUploadedImage();
                    if (src) {
                      setNode({
                        src
                      });
                    }
                  },
                  children: /*#__PURE__*/jsx(Icon, {
                    src: fileUpIcon
                  })
                }), /*#__PURE__*/jsx(Tooltip, {
                  children: "Choose file"
                })]
              })]
            }), /*#__PURE__*/jsx(Divider, {
              orientation: "vertical"
            }), /*#__PURE__*/jsxs(TooltipTrigger, {
              children: [/*#__PURE__*/jsx(ActionButton, {
                prominence: "low",
                onPress: () => {
                  Transforms.removeNodes(editor, {
                    at: ReactEditor.findPath(editor, __elementForGettingPath)
                  });
                },
                children: /*#__PURE__*/jsx(Icon, {
                  src: trash2Icon
                })
              }), /*#__PURE__*/jsx(Tooltip, {
                tone: "critical",
                children: "Remove"
              })]
            })]
          })
        })]
      }, aspectRatio)]
    }), /*#__PURE__*/jsx(DialogContainer, {
      onDismiss: () => {
        setDialogOpen(false);
        focusWithPreviousSelection(editor);
      },
      children: dialogOpen && /*#__PURE__*/jsx(ImageDialog, {
        alt: currentElement.alt,
        title: currentElement.title,
        filename: currentElement.src.filename,
        onSubmit: ({
          alt,
          filename,
          title
        }) => {
          setNode({
            alt,
            title,
            src: {
              content: currentElement.src.content,
              filename
            }
          });
        }
      })
    })]
  });
};
function ImageDialog(props) {
  const {
    images
  } = useDocumentEditorConfig().documentFeatures;
  if (!images) {
    throw new Error('unexpected image rendered when images are disabled');
  }
  const schema = useMemo(() => object(images.schema), [images]);
  const [state, setState] = useState({
    alt: props.alt,
    title: props.title
  });
  const previewProps = useMemo(() => createGetPreviewProps(schema, setState, () => undefined), [schema])(state);
  const [filenameWithoutExtension, filenameExtension] = splitFilename(props.filename);
  const [forceValidation, setForceValidation] = useState(false);
  let [fileName, setFileName] = useState(filenameWithoutExtension);
  let [fileNameTouched, setFileNameTouched] = useState(false);
  let {
    dismiss
  } = useDialogContainer();
  let stringFormatter = useLocalizedStringFormatter(l10nMessages);
  return /*#__PURE__*/jsx(Dialog, {
    size: "small",
    children: /*#__PURE__*/jsxs("form", {
      style: {
        display: 'contents'
      },
      onSubmit: event => {
        if (event.target !== event.currentTarget) return;
        event.preventDefault();
        setForceValidation(true);
        if (fileName && clientSideValidateProp(schema, state, undefined)) {
          dismiss();
          props.onSubmit({
            alt: state.alt,
            title: state.title,
            filename: [fileName, filenameExtension].join('.')
          });
        }
      },
      children: [/*#__PURE__*/jsx(Heading, {
        children: "Image details"
      }), /*#__PURE__*/jsx(Content, {
        children: /*#__PURE__*/jsxs(Flex, {
          gap: "large",
          direction: "column",
          children: [/*#__PURE__*/jsx(TextField, {
            label: "File name",
            onChange: setFileName,
            onBlur: () => setFileNameTouched(true),
            value: fileName,
            isRequired: true,
            errorMessage: (fileNameTouched || forceValidation) && !fileName ? 'Please provide a file name.' : undefined,
            endElement: filenameExtension ? /*#__PURE__*/jsx(Flex, {
              alignItems: "center",
              justifyContent: "center",
              paddingEnd: "regular",
              children: /*#__PURE__*/jsxs(Text, {
                color: "neutralTertiary",
                children: [".", filenameExtension]
              })
            }) : null
          }), /*#__PURE__*/jsx(FormValueContentFromPreviewProps, {
            forceValidation: forceValidation,
            autoFocus: true,
            ...previewProps
          })]
        })
      }), /*#__PURE__*/jsxs(ButtonGroup, {
        children: [/*#__PURE__*/jsx(Button, {
          onPress: dismiss,
          children: stringFormatter.format('cancel')
        }), /*#__PURE__*/jsx(Button, {
          prominence: "high",
          type: "submit",
          children: stringFormatter.format('save')
        })]
      })]
    })
  });
}
function splitFilename(filename) {
  const dotIndex = filename.lastIndexOf('.');
  if (dotIndex === -1) {
    return [filename, ''];
  }
  return [filename.substring(0, dotIndex), filename.substring(dotIndex + 1)];
}
let _imageIcon = /*#__PURE__*/jsx(Icon, {
  src: imageIcon
});
function ImageButton() {
  const editor = useSlateStatic();
  return /*#__PURE__*/jsx(Fragment, {
    children: /*#__PURE__*/jsx(ActionButton, {
      prominence: "low",
      onPress: async () => {
        const src = await getUploadedImage();
        if (src) {
          Transforms.insertNodes(editor, {
            type: 'image',
            src,
            alt: '',
            title: '',
            children: [{
              text: ''
            }]
          });
        }
      },
      children: _imageIcon
    })
  });
}
const imageButton = /*#__PURE__*/jsxs(TooltipTrigger, {
  children: [/*#__PURE__*/jsx(ImageButton, {}), /*#__PURE__*/jsx(Tooltip, {
    children: /*#__PURE__*/jsx(Text, {
      children: "Image"
    })
  })]
});
function withImages(editor) {
  const {
    insertData
  } = editor;
  editor.insertData = data => {
    const images = Array.from(data.files).filter(x => x.type.startsWith('image/'));
    if (images.length) {
      Promise.all(images.map(async file => ({
        name: file.name,
        data: new Uint8Array(await file.arrayBuffer())
      }))).then(images => {
        insertNodesButReplaceIfSelectionIsAtEmptyParagraphOrHeading(editor, {
          type: 'image',
          src: {
            content: images[0].data,
            filename: images[0].name
          },
          alt: '',
          title: '',
          children: [{
            text: ''
          }]
        });
      });
      return;
    }
    insertData(data);
  };
  return editor;
}

const insertTable = editor => {
  Transforms.insertNodes(editor, {
    type: 'table',
    children: [{
      type: 'table-head',
      children: [{
        type: 'table-row',
        children: [cell(true), cell(true), cell(true)]
      }]
    }, {
      type: 'table-body',
      children: [{
        type: 'table-row',
        children: [cell(false), cell(false), cell(false)]
      }, {
        type: 'table-row',
        children: [cell(false), cell(false), cell(false)]
      }]
    }]
  });
};
const SelectedCellsContext = /*#__PURE__*/createContext(undefined);
function getSelectedCells(table, row, column) {
  var _table$children$;
  const selectedCells = new Set();
  const first = table.children[0].type === 'table-head' || table.children[0].type === 'table-body' ? table.children[0] : undefined;
  if (!first) return selectedCells;
  const second = ((_table$children$ = table.children[1]) === null || _table$children$ === void 0 ? void 0 : _table$children$.type) === 'table-body' ? table.children[1] : undefined;
  for (let rowIndex = row.start; rowIndex <= row.end; rowIndex++) {
    const row = second ? rowIndex === 0 ? first.children[0] : second.children[rowIndex - 1] : first.children[rowIndex];
    if (!Element.isElement(row)) continue;
    for (let cellIndex = column.start; cellIndex <= column.end; cellIndex++) {
      selectedCells.add(row.children[cellIndex]);
    }
  }
  return selectedCells;
}
function TableSelectionProvider(props) {
  const editor = useSlate();
  const selectedTableArea = getSelectedTableArea(editor);
  if (selectedTableArea) {
    var _Editor$above, _editor$selection;
    return /*#__PURE__*/jsx(SelectedCellsContext.Provider, {
      value: {
        cells: selectedTableArea.singleCell === 'not-selected' ? new Set() : getSelectedCells(selectedTableArea.table, selectedTableArea.row, selectedTableArea.column),
        table: selectedTableArea.table,
        focus: (_Editor$above = Editor.above(editor, {
          match: nodeTypeMatcher('table-cell'),
          at: (_editor$selection = editor.selection) === null || _editor$selection === void 0 ? void 0 : _editor$selection.focus.path
        })) === null || _Editor$above === void 0 ? void 0 : _Editor$above[0]
      },
      children: props.children
    });
  }
  return /*#__PURE__*/jsx(SelectedCellsContext.Provider, {
    value: undefined,
    children: props.children
  });
}
const StartElementsContext = /*#__PURE__*/createContext({
  top: new Map(),
  left: new Map()
});
const TableElement = ({
  attributes,
  children,
  element
}) => {
  var _element$children$;
  const editor = useSlateStatic();
  const selectedCellsContext = useContext(SelectedCellsContext);
  const selectedCells = (selectedCellsContext === null || selectedCellsContext === void 0 ? void 0 : selectedCellsContext.table) === element ? selectedCellsContext : undefined;
  const startElements = useMemo(() => {
    const firstTableChild = element.children[0];
    if (!Element.isElement(firstTableChild) || !Element.isElement(firstTableChild.children[0])) {
      return {
        top: new Map(),
        left: new Map()
      };
    }
    const top = new Map();
    const left = new Map();
    for (const [idx, cell] of firstTableChild.children[0].children.entries()) {
      if (cell.type !== 'table-cell') continue;
      top.set(cell, element.children.every(headOrBody => Element.isElement(headOrBody) ? headOrBody.children.every(row => Element.isElement(row) && (selectedCells === null || selectedCells === void 0 ? void 0 : selectedCells.cells.has(row.children[idx]))) : false));
    }
    for (const headOrBody of element.children) {
      if (headOrBody.type !== 'table-head' && headOrBody.type !== 'table-body') {
        continue;
      }
      for (const row of headOrBody.children) {
        if (row.type !== 'table-row' || row.children[0].type !== 'table-cell') {
          continue;
        }
        left.set(row.children[0], row.children.every(element => selectedCells === null || selectedCells === void 0 ? void 0 : selectedCells.cells.has(element)));
      }
    }
    return {
      top,
      left
    };
  }, [element, selectedCells]);
  return /*#__PURE__*/jsx(StartElementsContext.Provider, {
    value: startElements,
    children: /*#__PURE__*/jsx(SelectedCellsContext.Provider, {
      value: selectedCells,
      children: /*#__PURE__*/jsx(BlockWrapper, {
        attributes: attributes,
        children: /*#__PURE__*/jsxs(BlockPopoverTrigger, {
          element: element,
          children: [/*#__PURE__*/jsx("table", {
            className: css({
              width: '100%',
              tableLayout: 'fixed',
              position: 'relative',
              borderSpacing: 0,
              '& *::selection': selectedCells !== null && selectedCells !== void 0 && selectedCells.cells.size ? {
                backgroundColor: 'transparent'
              } : undefined
            }),
            children: children
          }), /*#__PURE__*/jsx(BlockPopover, {
            children: /*#__PURE__*/jsxs(Flex, {
              gap: "regular",
              padding: "regular",
              children: [/*#__PURE__*/jsxs(TooltipTrigger, {
                children: [/*#__PURE__*/jsx(ActionButton, {
                  prominence: "low",
                  isSelected: ((_element$children$ = element.children[0]) === null || _element$children$ === void 0 ? void 0 : _element$children$.type) === 'table-head',
                  onPress: () => {
                    const tablePath = ReactEditor.findPath(editor, element);
                    Editor.withoutNormalizing(editor, () => {
                      if (element.children[0].type === 'table-head') {
                        Transforms.moveNodes(editor, {
                          at: [...tablePath, 0, 0],
                          to: [...tablePath, 1, 0]
                        });
                        Transforms.removeNodes(editor, {
                          at: [...tablePath, 0]
                        });
                        return;
                      }
                      Transforms.insertNodes(editor, {
                        type: 'table-head',
                        children: []
                      }, {
                        at: [...tablePath, 0]
                      });
                      Transforms.moveNodes(editor, {
                        at: [...tablePath, 1, 0],
                        to: [...tablePath, 0, 0]
                      });
                    });
                  },
                  children: /*#__PURE__*/jsx(Icon, {
                    src: sheetIcon
                  })
                }), /*#__PURE__*/jsx(Tooltip, {
                  children: "Header row"
                })]
              }), /*#__PURE__*/jsx(ToolbarSeparator, {}), /*#__PURE__*/jsxs(TooltipTrigger, {
                children: [/*#__PURE__*/jsx(ActionButton, {
                  prominence: "low",
                  onPress: () => {
                    Transforms.removeNodes(editor, {
                      at: ReactEditor.findPath(editor, element)
                    });
                  },
                  children: /*#__PURE__*/jsx(Icon, {
                    src: trash2Icon
                  })
                }), /*#__PURE__*/jsx(Tooltip, {
                  tone: "critical",
                  children: "Remove"
                })]
              })]
            })
          })]
        })
      })
    })
  });
};
const TableBodyElement = ({
  attributes,
  children
}) => {
  return /*#__PURE__*/jsx("tbody", {
    ...attributes,
    children: children
  });
};
const TableHeadElement = ({
  attributes,
  children
}) => {
  return /*#__PURE__*/jsx("thead", {
    ...attributes,
    children: children
  });
};
const TableRowElement = ({
  attributes,
  children,
  element
}) => {
  var _useContext, _table$children$index;
  const table = (_useContext = useContext(SelectedCellsContext)) === null || _useContext === void 0 ? void 0 : _useContext.table;
  return /*#__PURE__*/jsx(RowIndexContext.Provider, {
    value: (_table$children$index = table === null || table === void 0 ? void 0 : table.children.indexOf(element)) !== null && _table$children$index !== void 0 ? _table$children$index : -1,
    children: /*#__PURE__*/jsx("tr", {
      ...attributes,
      children: children
    })
  });
};
const RowIndexContext = /*#__PURE__*/createContext(-1);
function TableCellElement({
  attributes,
  children,
  element
}) {
  const editor = useSlateStatic();
  const selectedCellsContext = useContext(SelectedCellsContext);
  const startElements = useContext(StartElementsContext);
  const isSelected = selectedCellsContext === null || selectedCellsContext === void 0 ? void 0 : selectedCellsContext.cells.has(element);
  const size = `calc(100% + 2px)`;
  const ElementType = element.header ? 'th' : 'td';
  const borderColor = isSelected ? tokenSchema.color.alias.borderSelected : tokenSchema.color.alias.borderIdle;
  return /*#__PURE__*/jsxs(ElementType, {
    className: css({
      borderInlineEnd: `1px solid ${borderColor}`,
      borderBottom: `1px solid ${borderColor}`,
      borderTop: startElements.top.has(element) ? `1px solid ${borderColor}` : undefined,
      borderInlineStart: startElements.left.has(element) ? `1px solid ${borderColor}` : undefined,
      backgroundColor: selectedCellsContext !== null && selectedCellsContext !== void 0 && selectedCellsContext.cells.has(element) ? tokenSchema.color.alias.backgroundSelected : element.header ? tokenSchema.color.scale.slate3 : undefined,
      position: 'relative',
      margin: 0,
      padding: tokenSchema.size.space.regular,
      fontWeight: 'inherit',
      boxSizing: 'border-box',
      textAlign: 'start',
      verticalAlign: 'top'
    }),
    ...attributes,
    children: [isSelected && /*#__PURE__*/jsxs(Fragment, {
      children: [/*#__PURE__*/jsx("div", {
        contentEditable: false,
        className: css({
          position: 'absolute',
          top: -1,
          insetInlineStart: -1,
          background: tokenSchema.color.alias.borderSelected,
          height: size,
          width: 1
        })
      }), /*#__PURE__*/jsx("div", {
        contentEditable: false,
        className: css({
          position: 'absolute',
          top: -1,
          insetInlineStart: -1,
          background: tokenSchema.color.alias.borderSelected,
          height: 1,
          width: size
        })
      })]
    }), startElements.top.has(element) && /*#__PURE__*/jsx(CellSelection, {
      location: "top",
      selected: !!startElements.top.get(element),
      label: "Select Column",
      onClick: () => {
        const path = ReactEditor.findPath(editor, element);
        const table = Editor.above(editor, {
          match: nodeTypeMatcher('table'),
          at: path
        });
        if (!table) return;
        const lastTableIndex = table[0].children.length - 1;
        const tableBody = table[0].children[lastTableIndex];
        if (tableBody.type !== 'table-body') return;
        const cellIndex = path[path.length - 1];
        const endPath = [...table[1], table[0].children.length - 1, tableBody.children.length - 1, cellIndex];
        Transforms.select(editor, {
          anchor: Editor.start(editor, path),
          focus: Editor.end(editor, endPath)
        });
      }
    }), startElements.left.has(element) && /*#__PURE__*/jsx(CellSelection, {
      location: "left",
      selected: !!startElements.left.get(element),
      label: "Select Row",
      onClick: () => {
        const path = ReactEditor.findPath(editor, element);
        Transforms.select(editor, {
          anchor: Editor.start(editor, Path.parent(path)),
          focus: Editor.end(editor, Path.parent(path))
        });
      }
    }), startElements.left.has(element) && startElements.top.has(element) && /*#__PURE__*/jsx(CellSelection, {
      location: "top-left",
      selected: !!(startElements.top.get(element) && startElements.left.get(element)),
      label: "Select Table",
      onClick: () => {
        const path = ReactEditor.findPath(editor, element);
        const table = Editor.above(editor, {
          match: nodeTypeMatcher('table'),
          at: path
        });
        if (!table) return;
        Transforms.select(editor, {
          anchor: Editor.start(editor, table[1]),
          focus: Editor.end(editor, table[1])
        });
      }
    }), /*#__PURE__*/jsx("div", {
      children: children
    }), (selectedCellsContext === null || selectedCellsContext === void 0 ? void 0 : selectedCellsContext.focus) === element && /*#__PURE__*/jsx(CellMenu, {
      cell: element,
      table: selectedCellsContext.table
    })]
  });
}
function CellSelection(props) {
  const selectedCellsContext = useContext(SelectedCellsContext);
  const editor = useSlateStatic();
  let {
    location,
    selected
  } = props;
  return /*#__PURE__*/jsxs("div", {
    contentEditable: false,
    children: [/*#__PURE__*/jsx("button", {
      tabIndex: -1,
      type: "button",
      ...toDataAttributes({
        location,
        selected
      }),
      className: css({
        background: tokenSchema.color.scale.slate3,
        border: `1px solid ${tokenSchema.color.alias.borderIdle}`,
        margin: 0,
        padding: 0,
        position: 'absolute',
        ':hover': {
          background: tokenSchema.color.scale.slate4
        },
        // ever so slightly larger hit area
        '::before': {
          content: '""',
          inset: -1,
          position: 'absolute'
        },
        // location
        '&[data-location=top]': {
          top: -9,
          insetInlineStart: -1,
          width: 'calc(100% + 2px)',
          height: 8
        },
        '&[data-location=left]': {
          top: -1,
          insetInlineStart: -9,
          width: 8,
          height: 'calc(100% + 2px)'
        },
        '&[data-location=top-left]': {
          top: -9,
          insetInlineStart: -9,
          width: 8,
          height: 8
        },
        '&:not([data-location=top])': {
          borderInlineEnd: 'none'
        },
        '&:not([data-location=left])': {
          borderBottom: 'none'
        },
        // state
        '&[data-selected=true]': {
          background: tokenSchema.color.scale.indigo8,
          borderColor: tokenSchema.color.alias.borderSelected
        }
      }),
      style: {
        visibility: selectedCellsContext !== null && selectedCellsContext !== void 0 && selectedCellsContext.focus ? 'visible' : 'hidden'
      },
      "aria-label": props.label,
      onClick: () => {
        ReactEditor.focus(editor);
        props.onClick();
      }
    }), props.selected && (props.location === 'top' ? /*#__PURE__*/jsx("div", {
      className: css({
        position: 'absolute',
        top: -9,
        insetInlineEnd: -1,
        background: tokenSchema.color.alias.borderSelected,
        height: 8,
        width: 1,
        zIndex: 2
      })
    }) : /*#__PURE__*/jsx("div", {
      className: css({
        position: 'absolute',
        bottom: -1,
        insetInlineStart: -9,
        background: tokenSchema.color.alias.borderSelected,
        height: 1,
        width: 8,
        zIndex: 2
      })
    }))]
  });
}
const cellActions = {
  deleteRow: {
    label: 'Delete row',
    action: (editor, cellPath) => {
      const tablePath = cellPath.slice(0, -3);
      const table = Node.get(editor, tablePath);
      if (table.type !== 'table') return;
      const hasHead = table.children[0].type === 'table-head';
      const rowPath = Path.parent(cellPath);
      Transforms.removeNodes(editor, {
        at: hasHead && rowPath[cellPath.length - 3] === 0 ? Path.parent(rowPath) : rowPath
      });
    }
  },
  deleteColumn: {
    label: 'Delete column',
    action: (editor, path) => {
      const cellIndex = path[path.length - 1];
      const tablePath = path.slice(0, -3);
      const table = Node.get(editor, tablePath);
      if (table.type !== 'table') return;
      Editor.withoutNormalizing(editor, () => {
        for (const [headOrBodyIdx, headOrBody] of table.children.entries()) {
          if (headOrBody.type !== 'table-head' && headOrBody.type !== 'table-body') {
            continue;
          }
          for (const idx of headOrBody.children.keys()) {
            Transforms.removeNodes(editor, {
              at: [...tablePath, headOrBodyIdx, idx, cellIndex]
            });
          }
        }
      });
    }
  },
  insertRowBelow: {
    label: 'Insert row below',
    action: (editor, path) => {
      const tableRow = Node.get(editor, Path.parent(path));
      const tablePath = path.slice(0, -3);
      const table = Node.get(editor, tablePath);
      if (tableRow.type !== 'table-row' || table.type !== 'table') {
        return;
      }
      const hasHead = table.children[0].type === 'table-head';
      const newRowPath = [...tablePath, hasHead ? 1 : 0, hasHead && path[path.length - 3] === 0 ? 0 : path[path.length - 2] + 1];
      Editor.withoutNormalizing(editor, () => {
        Transforms.insertNodes(editor, {
          type: 'table-row',
          children: tableRow.children.map(() => cell(false))
        }, {
          at: newRowPath
        });
        Transforms.select(editor, [...newRowPath, path[path.length - 1]]);
      });
    }
  },
  insertColumnRight: {
    label: 'Insert column right',
    action: (editor, path) => {
      const newCellIndex = path[path.length - 1] + 1;
      const tablePath = path.slice(0, -3);
      const table = Node.get(editor, tablePath);
      if (table.type !== 'table') return;
      Editor.withoutNormalizing(editor, () => {
        for (const [headOrBodyIdx, headOrBody] of table.children.entries()) {
          if (headOrBody.type !== 'table-head' && headOrBody.type !== 'table-body') {
            continue;
          }
          for (const rowIdx of headOrBody.children.keys()) {
            Transforms.insertNodes(editor, cell(headOrBody.type === 'table-head'), {
              at: [...tablePath, headOrBodyIdx, rowIdx, newCellIndex]
            });
          }
        }
        Transforms.select(editor, Editor.start(editor, Path.next(path)));
      });
    }
  }
};
const _cellActions = cellActions;
function CellMenu(props) {
  const editor = useSlateStatic();
  const gutter = tokenSchema.size.space.small;
  return /*#__PURE__*/jsx("div", {
    contentEditable: false,
    className: css({
      top: gutter,
      insetInlineEnd: gutter,
      position: 'absolute'
    }),
    children: /*#__PURE__*/jsxs(TooltipTrigger, {
      children: [/*#__PURE__*/jsxs(MenuTrigger, {
        align: "end",
        children: [/*#__PURE__*/jsx(ActionButton, {
          prominence: "low",
          UNSAFE_className: css({
            borderRadius: tokenSchema.size.radius.small,
            height: 'auto',
            minWidth: 0,
            padding: 0,
            // tiny buttons; increase the hit area
            '&::before': {
              content: '""',
              inset: `calc(${gutter} * -1)`,
              position: 'absolute'
            }
          }),
          children: /*#__PURE__*/jsx(Icon, {
            src: chevronDownIcon
          })
        }), /*#__PURE__*/jsx(Menu, {
          onAction: key => {
            if (key in _cellActions) {
              _cellActions[key].action(editor, ReactEditor.findPath(editor, props.cell));
            }
          },
          items: Object.entries(_cellActions).map(([key, item]) => ({
            ...item,
            key
          })),
          children: item => /*#__PURE__*/jsx(Item$4, {
            children: item.label
          }, item.key)
        })]
      }), /*#__PURE__*/jsx(Tooltip, {
        children: "Options"
      })]
    })
  });
}
const TableButton = () => {
  const {
    editor,
    blockquote: {
      isDisabled,
      isSelected
    }
  } = useToolbarState();
  return useMemo(() => /*#__PURE__*/jsx(ActionButton, {
    prominence: "low",
    isSelected: isSelected,
    isDisabled: isDisabled,
    onPress: () => {
      insertTable(editor);
      ReactEditor.focus(editor);
    },
    children: /*#__PURE__*/jsx(Icon, {
      src: tableIcon
    })
  }), [editor, isDisabled, isSelected]);
};
const tableButton = /*#__PURE__*/jsxs(TooltipTrigger, {
  children: [/*#__PURE__*/jsx(TableButton, {}), /*#__PURE__*/jsx(Tooltip, {
    children: /*#__PURE__*/jsx(Text, {
      children: "Table"
    })
  })]
});
function getCellPathInDirection(editor, path, direction) {
  if (direction === 'left' || direction === 'right') {
    const row = Editor.above(editor, {
      match: nodeTypeMatcher('table-row'),
      at: path
    });
    if (!row) return;
    const currentCellIdx = path[path.length - 1];
    const diff = direction === 'left' ? -1 : 1;
    const nextCellIdx = currentCellIdx + diff;
    const nextCell = row[0].children[nextCellIdx];
    if (!nextCell) return;
    return [...row[1], nextCellIdx];
  }
  const table = Editor.above(editor, {
    match: nodeTypeMatcher('table'),
    at: path
  });
  if (!table) return;
  const diff = direction === 'up' ? -1 : 1;
  const rowIndex = path[path.length - 3] + path[path.length - 2];
  const nextRowIndex = rowIndex + diff;
  const relativeRowPath = getRelativeRowPath(table[0].children[0].type === 'table-head', nextRowIndex);
  if (!Node.has(table[0], relativeRowPath)) return;
  return [...table[1], ...relativeRowPath, path[path.length - 1]];
}

function Toolbar({
  documentFeatures,
  viewState
}) {
  const componentBlocks = useDocumentEditorConfig().componentBlocks;
  let hasComponentBlocksForInsertMenu = false,
    hasComponentBlocksForToolbar = false;
  for (const componentBlock of Object.values(componentBlocks)) {
    if (componentBlock.toolbarIcon) {
      hasComponentBlocksForToolbar = true;
    }
    if (!componentBlock.toolbarIcon) {
      hasComponentBlocksForInsertMenu = true;
    }
  }
  const hasMarks = Object.values(documentFeatures.formatting.inlineMarks).some(x => x);
  const hasAlignment = documentFeatures.formatting.alignment.center || documentFeatures.formatting.alignment.end;
  const hasLists = documentFeatures.formatting.listTypes.unordered || documentFeatures.formatting.listTypes.ordered;
  return /*#__PURE__*/jsxs(ToolbarWrapper, {
    children: [/*#__PURE__*/jsxs(ToolbarScrollArea, {
      children: [!!documentFeatures.formatting.headings.levels.length && /*#__PURE__*/jsx(HeadingMenu, {
        headingLevels: documentFeatures.formatting.headings.levels
      }), hasMarks && /*#__PURE__*/jsx(InlineMarks, {
        marks: documentFeatures.formatting.inlineMarks
      }), (hasAlignment || hasLists) && /*#__PURE__*/jsxs(ToolbarGroup, {
        children: [hasAlignment && /*#__PURE__*/jsx(TextAlignMenu, {
          alignment: documentFeatures.formatting.alignment
        }), hasLists && /*#__PURE__*/jsx(ListButtons, {
          lists: documentFeatures.formatting.listTypes
        })]
      }), (documentFeatures.dividers || documentFeatures.links || !!documentFeatures.images || documentFeatures.formatting.blockTypes.blockquote || documentFeatures.tables || !!documentFeatures.layouts.length || documentFeatures.formatting.blockTypes.code || hasComponentBlocksForToolbar) && /*#__PURE__*/jsxs(ToolbarGroup, {
        children: [documentFeatures.dividers && dividerButton, documentFeatures.links && linkButton, documentFeatures.images && imageButton, documentFeatures.formatting.blockTypes.blockquote && blockquoteButton, !!documentFeatures.layouts.length && /*#__PURE__*/jsx(LayoutsButton, {
          layouts: documentFeatures.layouts
        }), documentFeatures.formatting.blockTypes.code && codeButton, documentFeatures.tables && tableButton, hasComponentBlocksForInsertMenu && insertBlocksInToolbar]
      }), /*#__PURE__*/jsx(Box, {
        flex: true
      })]
    }), useMemo(() => {
      return viewState && /*#__PURE__*/jsxs(Flex, {
        gap: "xsmall",
        children: [/*#__PURE__*/jsx(ToolbarSeparator, {}), /*#__PURE__*/jsxs(TooltipTrigger, {
          children: [/*#__PURE__*/jsx(Button, {
            prominence: "low",
            onPress: () => {
              viewState.toggle();
            },
            children: /*#__PURE__*/jsx(Icon, {
              src: viewState.expanded ? minimizeIcon : maximizeIcon
            })
          }), /*#__PURE__*/jsx(Tooltip, {
            children: viewState.expanded ? 'Collapse' : 'Expand'
          })]
        })]
      });
    }, [viewState]), !!hasComponentBlocksForInsertMenu && /*#__PURE__*/jsx(InsertBlockMenu, {})]
  });
}

/** Group buttons together that don't fit into an `ActionGroup` semantically. */
const ToolbarGroup = ({
  children
}) => {
  return /*#__PURE__*/jsx(Flex, {
    gap: "regular",
    children: children
  });
};
const ToolbarContainer = ({
  children
}) => {
  let entryLayoutPane = useEntryLayoutSplitPaneContext();
  if (entryLayoutPane === 'main') {
    return /*#__PURE__*/jsx("div", {
      className: css({
        boxSizing: 'border-box',
        display: 'flex',
        paddingInline: tokenSchema.size.space.medium,
        minWidth: 0,
        maxWidth: 800,
        marginInline: 'auto',
        [breakpointQueries.above.mobile]: {
          paddingInline: tokenSchema.size.space.xlarge
        },
        [breakpointQueries.above.tablet]: {
          paddingInline: tokenSchema.size.space.xxlarge
        }
      }),
      children: children
    });
  }
  return /*#__PURE__*/jsx("div", {
    className: css({
      display: 'flex'
    }),
    children: children
  });
};
const ToolbarWrapper = ({
  children
}) => {
  let entryLayoutPane = useEntryLayoutSplitPaneContext();
  return /*#__PURE__*/jsx(Fragment, {
    children: /*#__PURE__*/jsx("div", {
      "data-layout": entryLayoutPane,
      className: css({
        backdropFilter: 'blur(8px)',
        backgroundClip: 'padding-box',
        backgroundColor: `color-mix(in srgb, transparent, ${tokenSchema.color.background.canvas} 90%)`,
        borderBottom: `${tokenSchema.size.border.regular} solid color-mix(in srgb, transparent, ${tokenSchema.color.foreground.neutral} 10%)`,
        borderStartEndRadius: tokenSchema.size.radius.medium,
        borderStartStartRadius: tokenSchema.size.radius.medium,
        minWidth: 0,
        position: 'sticky',
        top: 0,
        zIndex: 2,
        '&[data-layout="main"]': {
          borderRadius: 0
        }
      }),
      children: /*#__PURE__*/jsx(ToolbarContainer, {
        children: children
      })
    })
  });
};
const ToolbarScrollArea = props => {
  let entryLayoutPane = useEntryLayoutSplitPaneContext();
  return /*#__PURE__*/jsx(Flex, {
    "data-layout": entryLayoutPane,
    paddingY: "regular",
    paddingX: "medium",
    gap: "large",
    flex: true,
    minWidth: 0,
    UNSAFE_className: css({
      msOverflowStyle: 'none' /* for Internet Explorer, Edge */,
      scrollbarWidth: 'none' /* for Firefox */,
      overflowX: 'auto',
      /* for Chrome, Safari, and Opera */
      '&::-webkit-scrollbar': {
        display: 'none'
      },
      '&[data-layout="main"]': {
        paddingInline: 0
      }
    }),
    ...props
  });
};
const headingMenuVals = new Map([['normal', 'normal'], ['1', 1], ['2', 2], ['3', 3], ['4', 4], ['5', 5], ['6', 6]]);
const HeadingMenu = ({
  headingLevels
}) => {
  const {
    editor,
    textStyles
  } = useToolbarState();
  const isDisabled = textStyles.allowedHeadingLevels.length === 0;
  const items = useMemo(() => {
    let resolvedItems = [{
      name: 'Paragraph',
      id: 'normal'
    }];
    headingLevels.forEach(level => {
      resolvedItems.push({
        name: `Heading ${level}`,
        id: level.toString()
      });
    });
    return resolvedItems;
  }, [headingLevels]);
  const selected = textStyles.selected.toString();
  return useMemo(() => /*#__PURE__*/jsx(Picker, {
    flexShrink: 0,
    width: "scale.1700",
    prominence: "low",
    "aria-label": "Text block",
    items: items,
    isDisabled: isDisabled,
    selectedKey: selected,
    onSelectionChange: selected => {
      let key = headingMenuVals.get(selected);
      if (key === 'normal') {
        Editor.withoutNormalizing(editor, () => {
          Transforms.unsetNodes(editor, 'level', {
            match: n => n.type === 'heading'
          });
          Transforms.setNodes(editor, {
            type: 'paragraph'
          }, {
            match: n => n.type === 'heading'
          });
        });
      } else if (key) {
        Transforms.setNodes(editor, {
          type: 'heading',
          level: key
        }, {
          match: node => node.type === 'paragraph' || node.type === 'heading'
        });
      }
      ReactEditor.focus(editor);
    },
    children: item => /*#__PURE__*/jsx(Item$3, {
      children: item.name
    }, item.id)
  }), [editor, isDisabled, items, selected]);
};
const insertBlocksInToolbar = /*#__PURE__*/jsx(InsertBlocksInToolbar, {});
function InsertBlocksInToolbar() {
  const editor = useSlateStatic();
  const componentBlocks = useDocumentEditorConfig().componentBlocks;
  return Object.entries(componentBlocks).filter(([, val]) => val.toolbarIcon).map(([key, item]) => {
    return /*#__PURE__*/jsxs(TooltipTrigger, {
      children: [/*#__PURE__*/jsx(ActionButton, {
        prominence: "low",
        onPress: () => {
          insertComponentBlock(editor, componentBlocks, key);
          ReactEditor.focus(editor);
        },
        children: /*#__PURE__*/jsx(Icon, {
          src: item.toolbarIcon
        })
      }), /*#__PURE__*/jsx(Tooltip, {
        children: item.label
      })]
    }, key);
  });
}
function InsertBlockMenu() {
  let entryLayoutPane = useEntryLayoutSplitPaneContext();
  const editor = useSlateStatic();
  const componentBlocks = useDocumentEditorConfig().componentBlocks;
  return /*#__PURE__*/jsxs(MenuTrigger, {
    align: "end",
    children: [/*#__PURE__*/jsxs(TooltipTrigger, {
      children: [/*#__PURE__*/jsxs(ActionButton, {
        marginY: "regular",
        marginEnd: entryLayoutPane === 'main' ? undefined : 'medium',
        children: [/*#__PURE__*/jsx(Icon, {
          src: plusIcon
        }), /*#__PURE__*/jsx(Icon, {
          src: chevronDownIcon
        })]
      }), /*#__PURE__*/jsxs(Tooltip, {
        children: [/*#__PURE__*/jsx(Text, {
          children: "Insert"
        }), /*#__PURE__*/jsx(Kbd, {
          children: "/"
        })]
      })]
    }), /*#__PURE__*/jsx(Menu, {
      onAction: key => {
        insertComponentBlock(editor, componentBlocks, key);
      },
      items: Object.entries(componentBlocks).filter(([, val]) => !val.toolbarIcon),
      children: ([key, item]) => /*#__PURE__*/jsx(Item$3, {
        children: item.label
      }, key)
    })]
  });
}
const inlineMarks = [{
  key: 'bold',
  label: 'Bold',
  icon: boldIcon,
  shortcut: `B`
}, {
  key: 'italic',
  label: 'Italic',
  icon: italicIcon,
  shortcut: `I`
}, {
  key: 'underline',
  label: 'Underline',
  icon: underlineIcon,
  shortcut: `U`
}, {
  key: 'strikethrough',
  label: 'Strikethrough',
  icon: strikethroughIcon
}, {
  key: 'code',
  label: 'Code',
  icon: codeIcon
}, {
  key: 'superscript',
  label: 'Superscript',
  icon: superscriptIcon
}, {
  key: 'subscript',
  label: 'Subscript',
  icon: subscriptIcon
}, {
  key: 'clearFormatting',
  label: 'Clear formatting',
  icon: removeFormattingIcon
}];
function InlineMarks({
  marks: _marksShown
}) {
  const {
    editor,
    clearFormatting: {
      isDisabled
    },
    marks
  } = useToolbarState();
  const marksShown = useMemoStringified(_marksShown);
  const selectedKeys = useMemoStringified(Object.keys(marks).filter(key => marks[key].isSelected));
  const disabledKeys = useMemoStringified(Object.keys(marks).filter(key => marks[key].isDisabled).concat(isDisabled ? 'clearFormatting' : []));
  return useMemo(() => {
    const items = inlineMarks.filter(item => item.key === 'clearFormatting' || marksShown[item.key]);
    return /*#__PURE__*/jsx(ActionGroup, {
      UNSAFE_className: css({
        minWidth: `calc(${tokenSchema.size.element.medium} * 4)`
      }),
      prominence: "low",
      density: "compact",
      buttonLabelBehavior: "hide",
      overflowMode: "collapse",
      summaryIcon: /*#__PURE__*/jsx(Icon, {
        src: typeIcon
      }),
      items: items,
      selectionMode: "multiple",
      selectedKeys: selectedKeys,
      disabledKeys: disabledKeys,
      onAction: key => {
        if (key === 'clearFormatting') {
          clearFormatting(editor);
        } else {
          var _Editor$marks;
          const mark = key;
          if ((_Editor$marks = Editor.marks(editor)) !== null && _Editor$marks !== void 0 && _Editor$marks[mark]) {
            Editor.removeMark(editor, mark);
          } else {
            Editor.addMark(editor, mark, true);
          }
        }
        ReactEditor.focus(editor);
      },
      children: item => {
        return /*#__PURE__*/jsxs(Item$3, {
          textValue: item.label,
          children: [/*#__PURE__*/jsx(Text, {
            children: item.label
          }), 'shortcut' in item && /*#__PURE__*/jsx(Kbd, {
            meta: true,
            children: item.shortcut
          }), /*#__PURE__*/jsx(Icon, {
            src: item.icon
          })]
        }, item.key);
      }
    });
  }, [disabledKeys, editor, marksShown, selectedKeys]);
}
function useMemoStringified(value) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => value, [JSON.stringify(value)]);
}

const HeadingElement = ({
  attributes,
  children,
  element
}) => {
  const ElementType = `h${element.level}`;
  const editor = useSlateStatic();
  const {
    documentFeatures
  } = useDocumentEditorConfig();
  const [dialogOpen, setDialogOpen] = useState(false);
  if (Object.keys(documentFeatures.formatting.headings.schema.fields).length === 0) {
    return /*#__PURE__*/jsx(ElementType, {
      ...attributes,
      style: {
        textAlign: element.textAlign
      },
      children: children
    });
  }
  return /*#__PURE__*/jsxs(Fragment, {
    children: [/*#__PURE__*/jsx(ElementType, {
      style: {
        textAlign: element.textAlign
      },
      children: /*#__PURE__*/jsxs(BlockPopoverTrigger, {
        element: element,
        children: [/*#__PURE__*/jsx("div", {
          children: children
        }), /*#__PURE__*/jsx(BlockPopover, {
          children: /*#__PURE__*/jsxs(Flex, {
            gap: "regular",
            padding: "regular",
            children: [/*#__PURE__*/jsx(CustomAttributesEditButton, {
              onPress: () => setDialogOpen(true)
            }), /*#__PURE__*/jsxs(TooltipTrigger, {
              children: [/*#__PURE__*/jsx(ActionButton, {
                prominence: "low",
                onPress: () => {
                  Transforms.removeNodes(editor, {
                    at: ReactEditor.findPath(editor, element)
                  });
                },
                children: /*#__PURE__*/jsx(Icon, {
                  src: trash2Icon
                })
              }), /*#__PURE__*/jsx(Tooltip, {
                tone: "critical",
                children: "Remove"
              })]
            })]
          })
        })]
      })
    }), /*#__PURE__*/jsx(CustomAttributesDialog, {
      element: element,
      schema: documentFeatures.formatting.headings.schema,
      isOpen: dialogOpen,
      nodeLabel: "Heading",
      onDismiss: () => setDialogOpen(false)
    })]
  });
};

const renderElement = props => {
  switch (props.element.type) {
    case 'layout':
      return /*#__PURE__*/jsx(LayoutContainer, {
        attributes: props.attributes,
        children: props.children,
        element: props.element
      });
    case 'layout-area':
      return /*#__PURE__*/jsx(LayoutArea, {
        ...props
      });
    case 'code':
      return /*#__PURE__*/jsx(CodeElement, {
        attributes: props.attributes,
        children: props.children,
        element: props.element
      });
    case 'component-block':
      {
        return /*#__PURE__*/jsx(ComponentBlocksElement, {
          attributes: props.attributes,
          children: props.children,
          element: props.element
        });
      }
    case 'component-inline-prop':
    case 'component-block-prop':
      return /*#__PURE__*/jsx(ComponentInlineProp, {
        ...props
      });
    case 'heading':
      return /*#__PURE__*/jsx(HeadingElement, {
        attributes: props.attributes,
        children: props.children,
        element: props.element
      });
    case 'link':
      return /*#__PURE__*/jsx(LinkElement, {
        attributes: props.attributes,
        children: props.children,
        element: props.element
      });
    case 'ordered-list':
      return /*#__PURE__*/jsx("ol", {
        ...props.attributes,
        children: props.children
      });
    case 'unordered-list':
      return /*#__PURE__*/jsx("ul", {
        ...props.attributes,
        children: props.children
      });
    case 'list-item':
      return /*#__PURE__*/jsx("li", {
        ...props.attributes,
        children: props.children
      });
    case 'list-item-content':
      return /*#__PURE__*/jsx("span", {
        ...props.attributes,
        children: props.children
      });
    case 'blockquote':
      return /*#__PURE__*/jsx("blockquote", {
        ...props.attributes,
        children: props.children
      });
    case 'divider':
      return /*#__PURE__*/jsx(DividerElement, {
        ...props
      });
    case 'image':
      return /*#__PURE__*/jsx(ImageElement, {
        attributes: props.attributes,
        children: props.children,
        element: props.element
      });
    case 'table':
      return /*#__PURE__*/jsx(TableElement, {
        attributes: props.attributes,
        children: props.children,
        element: props.element
      });
    case 'table-head':
      return /*#__PURE__*/jsx(TableHeadElement, {
        attributes: props.attributes,
        children: props.children,
        element: props.element
      });
    case 'table-body':
      return /*#__PURE__*/jsx(TableBodyElement, {
        attributes: props.attributes,
        children: props.children,
        element: props.element
      });
    case 'table-row':
      return /*#__PURE__*/jsx(TableRowElement, {
        attributes: props.attributes,
        children: props.children,
        element: props.element
      });
    case 'table-cell':
      return /*#__PURE__*/jsx(TableCellElement, {
        attributes: props.attributes,
        children: props.children,
        element: props.element
      });
    default:
      let {
        textAlign
      } = props.element;
      return /*#__PURE__*/jsx("p", {
        style: {
          textAlign
        },
        ...props.attributes,
        children: props.children
      });
  }
};

function getOptions(toolbarState, componentBlocks) {
  const options = [...Object.keys(componentBlocks).map(key => ({
    label: componentBlocks[key].label,
    insert: editor => {
      insertComponentBlock(editor, componentBlocks, key);
    }
  })), ...toolbarState.textStyles.allowedHeadingLevels.filter(a => toolbarState.editorDocumentFeatures.formatting.headings.levels.includes(a)).map(level => ({
    label: `Heading ${level}`,
    insert(editor) {
      insertNodesButReplaceIfSelectionIsAtEmptyParagraphOrHeading(editor, {
        type: 'heading',
        level,
        children: [{
          text: ''
        }]
      });
    }
  })), !toolbarState.blockquote.isDisabled && toolbarState.editorDocumentFeatures.formatting.blockTypes.blockquote && {
    label: 'Blockquote',
    insert(editor) {
      insertNodesButReplaceIfSelectionIsAtEmptyParagraphOrHeading(editor, {
        type: 'blockquote',
        children: [{
          text: ''
        }]
      });
    }
  }, !toolbarState.code.isDisabled && toolbarState.editorDocumentFeatures.formatting.blockTypes.code && {
    label: 'Code block',
    insert(editor) {
      insertNodesButReplaceIfSelectionIsAtEmptyParagraphOrHeading(editor, {
        type: 'code',
        children: [{
          text: ''
        }]
      });
    }
  }, !!toolbarState.editorDocumentFeatures.images && {
    label: 'Image',
    async insert(editor) {
      const image = await getUploadedImage();
      if (image) {
        insertNodesButReplaceIfSelectionIsAtEmptyParagraphOrHeading(editor, {
          type: 'image',
          src: image,
          alt: '',
          title: '',
          children: [{
            text: ''
          }]
        });
      }
    }
  }, !!toolbarState.editorDocumentFeatures.tables && {
    label: 'Table',
    insert: insertTable
  }, !toolbarState.dividers.isDisabled && toolbarState.editorDocumentFeatures.dividers && {
    label: 'Divider',
    insert(editor) {
      insertNodesButReplaceIfSelectionIsAtEmptyParagraphOrHeading(editor, {
        type: 'divider',
        children: [{
          text: ''
        }]
      });
    }
  }, !!toolbarState.editorDocumentFeatures.layouts.length && {
    label: 'Layout',
    insert(editor) {
      insertLayout(editor, toolbarState.editorDocumentFeatures.layouts[0]);
    }
  }, !toolbarState.lists.ordered.isDisabled && toolbarState.editorDocumentFeatures.formatting.listTypes.ordered && {
    label: 'Numbered List',
    keywords: ['ordered list'],
    insert(editor) {
      insertNodesButReplaceIfSelectionIsAtEmptyParagraphOrHeading(editor, {
        type: 'ordered-list',
        children: [{
          text: ''
        }]
      });
    }
  }, !toolbarState.lists.unordered.isDisabled && toolbarState.editorDocumentFeatures.formatting.listTypes.unordered && {
    label: 'Bullet List',
    keywords: ['unordered list'],
    insert(editor) {
      insertNodesButReplaceIfSelectionIsAtEmptyParagraphOrHeading(editor, {
        type: 'unordered-list',
        children: [{
          text: ''
        }]
      });
    }
  }];
  return options.filter(x => typeof x !== 'boolean');
}
function insertOption(editor, text, option) {
  const path = ReactEditor.findPath(editor, text);
  Transforms.delete(editor, {
    at: {
      focus: Editor.start(editor, path),
      anchor: Editor.end(editor, path)
    }
  });
  option.insert(editor);
}
function InsertMenu({
  children,
  text
}) {
  const toolbarState = useToolbarState();
  const {
    editor
  } = toolbarState;
  const {
    componentBlocks
  } = useDocumentEditorConfig();
  const options = matchSorter(getOptions(toolbarState, componentBlocks), text.text.slice(1), {
    keys: ['label', 'keywords']
  }).map((option, index) => ({
    ...option,
    index
  }));
  const stateRef = useRef({
    options,
    text
  });
  useEffect(() => {
    stateRef.current = {
      options,
      text
    };
  });
  const listenerRef = useRef(_event => {});
  useEffect(() => {
    listenerRef.current = event => {
      if (event.defaultPrevented) return;
      switch (event.key) {
        case 'ArrowDown':
          {
            if (stateRef.current.options.length) {
              event.preventDefault();
              state.selectionManager.setFocused(true);
              state.selectionManager.setFocusedKey((Number(state.selectionManager.focusedKey) === stateRef.current.options.length - 1 ? 0 : Number(state.selectionManager.focusedKey) + 1).toString());
            }
            return;
          }
        case 'ArrowUp':
          {
            if (stateRef.current.options.length) {
              event.preventDefault();
              state.selectionManager.setFocused(true);
              state.selectionManager.setFocusedKey((state.selectionManager.focusedKey === '0' ? stateRef.current.options.length - 1 : Number(state.selectionManager.focusedKey) - 1).toString());
            }
            return;
          }
        case 'Enter':
          {
            const option = stateRef.current.options[Number(state.selectionManager.focusedKey)];
            if (option) {
              insertOption(editor, stateRef.current.text, option);
              event.preventDefault();
            }
            return;
          }
        case 'Escape':
          {
            const path = ReactEditor.findPath(editor, stateRef.current.text);
            Transforms.unsetNodes(editor, 'insertMenu', {
              at: path
            });
            event.preventDefault();
            return;
          }
      }
    };
  });
  useEffect(() => {
    const domNode = ReactEditor.toDOMNode(editor, editor);
    let listener = event => listenerRef.current(event);
    domNode.addEventListener('keydown', listener);
    return () => {
      domNode.removeEventListener('keydown', listener);
    };
  }, [editor]);
  const triggerRef = useRef(null);
  const overlayState = useOverlayTriggerState({
    isOpen: true
  });
  const {
    triggerProps: {
      onPress,
      ...triggerProps
    },
    overlayProps
  } = useOverlayTrigger({
    type: 'listbox'
  }, overlayState, triggerRef);
  let state = useListState({
    items: options,
    children: item => /*#__PURE__*/jsx(Item$5, {
      children: item.label
    }, item.index)
  });
  useEffect(() => {
    if (!state.selectionManager.isFocused && state.collection.size) {
      state.selectionManager.setFocused(true);
      state.selectionManager.setFocusedKey('0');
    }
  }, [state]);
  const scrollableRef = useRef(null);
  useEffect(() => {
    var _scrollableRef$curren;
    const element = (_scrollableRef$curren = scrollableRef.current) === null || _scrollableRef$curren === void 0 || (_scrollableRef$curren = _scrollableRef$curren.querySelector('[role="listbox"] [role="presentation"]')) === null || _scrollableRef$curren === void 0 ? void 0 : _scrollableRef$curren.children[state.selectionManager.focusedKey];
    if (element) {
      scrollIntoView(element, {
        scrollMode: 'if-needed',
        boundary: scrollableRef.current,
        block: 'nearest'
      });
    }
  }, [state.selectionManager.focusedKey]);
  const listboxRef = useRef(null);
  let layout = useListBoxLayout(state);
  return /*#__PURE__*/jsxs(Fragment$1, {
    children: [/*#__PURE__*/jsx("span", {
      ...triggerProps,
      role: "button",
      className: css({
        color: tokenSchema.color.foreground.accent,
        fontWeight: tokenSchema.typography.fontWeight.medium
      }),
      ref: triggerRef,
      children: children
    }), /*#__PURE__*/jsx(Popover, {
      width: "alias.singleLineWidth",
      placement: "bottom start",
      isNonModal: true,
      hideArrow: true,
      ...overlayProps,
      state: overlayState,
      triggerRef: triggerRef,
      children: /*#__PURE__*/jsx("div", {
        className: css({
          overflow: 'scroll',
          maxHeight: 300
        }),
        ref: scrollableRef,
        children: /*#__PURE__*/jsx(ListBoxBase, {
          "aria-label": "Insert block",
          state: state,
          shouldUseVirtualFocus: true,
          layout: layout,
          ref: listboxRef,
          onAction: key => {
            insertOption(editor, text, options[key]);
          }
        })
      })
    })]
  });
}
const nodeListsWithoutInsertMenu = new WeakSet();
const nodesWithoutInsertMenu = new WeakSet();
function findPathWithInsertMenu(node, path) {
  if (Text$1.isText(node)) {
    return node.insertMenu ? path : undefined;
  }
  if (nodeListsWithoutInsertMenu.has(node.children)) {
    return;
  }
  for (const [index, child] of node.children.entries()) {
    if (nodesWithoutInsertMenu.has(child)) continue;
    let maybePath = findPathWithInsertMenu(child, [...path, index]);
    if (maybePath) {
      return maybePath;
    }
    nodesWithoutInsertMenu.add(child);
  }
  nodeListsWithoutInsertMenu.add(node.children);
}
function removeInsertMenuMarkWhenOutsideOfSelection(editor) {
  var _Editor$marks;
  const path = findPathWithInsertMenu(editor, []);
  if (path && !((_Editor$marks = Editor.marks(editor)) !== null && _Editor$marks !== void 0 && _Editor$marks.insertMenu) && (!editor.selection || !Path.equals(editor.selection.anchor.path, path) || !Path.equals(editor.selection.focus.path, path))) {
    Transforms.unsetNodes(editor, 'insertMenu', {
      at: path
    });
    return true;
  }
  return false;
}
function withInsertMenu(editor) {
  const {
    normalizeNode,
    apply,
    insertText
  } = editor;
  editor.normalizeNode = ([node, path]) => {
    if (Text$1.isText(node) && node.insertMenu) {
      if (node.text[0] !== '/') {
        Transforms.unsetNodes(editor, 'insertMenu', {
          at: path
        });
        return;
      }
      const whitespaceMatch = /\s/.exec(node.text);
      if (whitespaceMatch) {
        Transforms.unsetNodes(editor, 'insertMenu', {
          at: {
            anchor: {
              path,
              offset: whitespaceMatch.index
            },
            focus: Editor.end(editor, path)
          },
          match: Text$1.isText,
          split: true
        });
        return;
      }
    }
    if (Editor.isEditor(editor) && removeInsertMenuMarkWhenOutsideOfSelection(editor)) {
      return;
    }
    normalizeNode([node, path]);
  };
  editor.apply = op => {
    apply(op);
    // we're calling this here AND in normalizeNode
    // because normalizeNode won't be called on selection changes
    // but apply will
    // we're still calling this from normalizeNode though because we want it to happen
    // when normalization happens
    if (op.type === 'set_selection') {
      removeInsertMenuMarkWhenOutsideOfSelection(editor);
    }
  };
  editor.insertText = text => {
    insertText(text);
    if (editor.selection && text === '/') {
      const startOfBlock = Editor.start(editor, Editor.above(editor, {
        match: isBlock
      })[1]);
      const before = Editor.before(editor, editor.selection.anchor, {
        unit: 'character'
      });
      if (before && (Point.equals(startOfBlock, before) || before.offset !== 0 && /\s/.test(Node.get(editor, before.path).text[before.offset - 1]))) {
        Transforms.setNodes(editor, {
          insertMenu: true
        }, {
          at: {
            anchor: before,
            focus: editor.selection.anchor
          },
          match: Text$1.isText,
          split: true
        });
      }
    }
  };
  return editor;
}

function Placeholder({
  placeholder,
  children
}) {
  const [width, setWidth] = useState(0);
  return /*#__PURE__*/jsxs("span", {
    className: css({
      position: 'relative',
      display: 'inline-block',
      width
    }),
    children: [/*#__PURE__*/jsx("span", {
      contentEditable: false,
      className: css({
        position: 'absolute',
        pointerEvents: 'none',
        display: 'inline-block',
        left: 0,
        top: 0,
        maxWidth: '100%',
        whiteSpace: 'nowrap',
        opacity: '0.5',
        userSelect: 'none',
        fontStyle: 'normal',
        fontWeight: 'normal',
        textDecoration: 'none',
        textAlign: 'left'
      }),
      children: /*#__PURE__*/jsx("span", {
        ref: node => {
          if (node) {
            const offsetWidth = node.offsetWidth;
            if (offsetWidth !== width) {
              setWidth(offsetWidth);
            }
          }
        },
        children: placeholder
      })
    }), children]
  });
}
const Leaf = ({
  leaf,
  text,
  children,
  attributes
}) => {
  const {
    underline,
    strikethrough,
    bold,
    italic,
    code,
    keyboard,
    superscript,
    subscript,
    placeholder,
    insertMenu,
    ...rest
  } = leaf;
  if (placeholder !== undefined) {
    children = /*#__PURE__*/jsx(Placeholder, {
      placeholder: placeholder,
      children: children
    });
  }
  if (insertMenu) {
    children = /*#__PURE__*/jsx(InsertMenu, {
      text: text,
      children: children
    });
  }
  if (code) {
    children = /*#__PURE__*/jsx("code", {
      children: children
    });
  }
  if (bold) {
    children = /*#__PURE__*/jsx("strong", {
      children: children
    });
  }
  if (strikethrough) {
    children = /*#__PURE__*/jsx("s", {
      children: children
    });
  }
  if (italic) {
    children = /*#__PURE__*/jsx("em", {
      children: children
    });
  }
  if (keyboard) {
    children = /*#__PURE__*/jsx("kbd", {
      children: children
    });
  }
  if (superscript) {
    children = /*#__PURE__*/jsx("sup", {
      children: children
    });
  }
  if (subscript) {
    children = /*#__PURE__*/jsx("sub", {
      children: children
    });
  }
  if (underline) {
    children = /*#__PURE__*/jsx("u", {
      children: children
    });
  }
  const prismClassNames = Object.keys(rest).filter(x => x.startsWith('prism_')).map(x => styles$1.get(x.replace('prism_', '')));
  if (prismClassNames.length) {
    const className = prismClassNames.join(' ');
    children = /*#__PURE__*/jsx("span", {
      className: className,
      children: children
    });
  }
  return /*#__PURE__*/jsx("span", {
    ...attributes,
    children: children
  });
};
const renderLeaf = props => {
  return /*#__PURE__*/jsx(Leaf, {
    ...props
  });
};
const styles$1 = new Map([{
  types: ['comment', 'prolog', 'doctype', 'cdata'],
  style: {
    color: tokenSchema.color.foreground.neutralTertiary,
    fontStyle: 'italic'
  }
}, {
  types: ['atrule', 'attr-name', 'class-name', 'selector'],
  style: {
    color: tokenSchema.color.scale.amber11
  }
}, {
  types: ['boolean', 'constant', 'inserted-sign', 'entity', 'inserted', 'number', 'regex', 'symbol', 'variable'],
  style: {
    color: tokenSchema.color.scale.green11
  }
}, {
  types: ['attr-value', 'builtin', 'char', 'constant', 'generics', 'url'],
  style: {
    color: tokenSchema.color.scale.pink11
  }
}, {
  types: ['string'],
  style: {
    color: tokenSchema.color.scale.indigo9
  }
}, {
  types: ['annotation', 'deleted', 'deleted-sign', 'decorator', 'important', 'tag'],
  style: {
    color: tokenSchema.color.scale.red11
  }
}, {
  types: ['function', 'function-variable', 'operator'],
  style: {
    color: tokenSchema.color.scale.purple11
  }
}, {
  types: ['tag', 'selector', 'keyword'],
  style: {
    color: tokenSchema.color.scale.indigo11
  }
}, {
  types: ['punctuation'],
  style: {
    color: tokenSchema.color.foreground.neutralSecondary
  }
}].flatMap(style => {
  const className = css(style.style);
  return style.types.map(x => [x, className]);
}));

function withBlockMarkdownShortcuts(documentFeatures, componentBlocks, editor) {
  const {
    insertText
  } = editor;
  const shortcuts = Object.create(null);
  const editorDocumentFeaturesForNormalizationToCheck = {
    ...documentFeatures
  };
  let addShortcut = (text, insert, shouldBeEnabledInComponentBlock, type = 'paragraph') => {
    if (!shouldBeEnabledInComponentBlock(editorDocumentFeaturesForNormalizationToCheck)) {
      return;
    }
    const trigger = text[text.length - 1];
    if (!shortcuts[trigger]) {
      shortcuts[trigger] = Object.create(null);
    }
    shortcuts[trigger][text] = {
      insert,
      type,
      shouldBeEnabledInComponentBlock
    };
  };
  addShortcut('1. ', () => {
    Transforms.wrapNodes(editor, {
      type: 'ordered-list',
      children: []
    }, {
      match: isBlock
    });
  }, features => features.formatting.listTypes.ordered);
  addShortcut('- ', () => {
    Transforms.wrapNodes(editor, {
      type: 'unordered-list',
      children: []
    }, {
      match: isBlock
    });
  }, features => features.formatting.listTypes.unordered);
  addShortcut('* ', () => {
    Transforms.wrapNodes(editor, {
      type: 'unordered-list',
      children: []
    }, {
      match: isBlock
    });
  }, features => features.formatting.listTypes.unordered);
  documentFeatures.formatting.headings.levels.forEach(level => {
    addShortcut('#'.repeat(level) + ' ', () => {
      Transforms.setNodes(editor, {
        type: 'heading',
        level
      }, {
        match: node => node.type === 'paragraph' || node.type === 'heading'
      });
    }, features => features.formatting.headings.levels.includes(level), 'heading-or-paragraph');
  });
  addShortcut('> ', () => {
    Transforms.wrapNodes(editor, {
      type: 'blockquote',
      children: []
    }, {
      match: node => node.type === 'paragraph'
    });
  }, features => features.formatting.blockTypes.blockquote);
  addShortcut('---', () => {
    insertDivider(editor);
  }, features => features.dividers);
  editor.insertText = text => {
    insertText(text);
    const shortcutsForTrigger = shortcuts[text];
    if (shortcutsForTrigger && editor.selection && Range.isCollapsed(editor.selection)) {
      const {
        anchor
      } = editor.selection;
      const block = Editor.above(editor, {
        match: isBlock
      });
      if (!block || block[0].type !== 'paragraph' && block[0].type !== 'heading') {
        return;
      }
      const start = Editor.start(editor, block[1]);
      const range = {
        anchor,
        focus: start
      };
      const shortcutText = Editor.string(editor, range);
      const shortcut = shortcutsForTrigger[shortcutText];
      if (!shortcut || shortcut.type === 'paragraph' && block[0].type !== 'paragraph') {
        return;
      }
      const locationDocumentFeatures = getAncestorComponentChildFieldDocumentFeatures(editor, documentFeatures, componentBlocks);
      if (locationDocumentFeatures && (locationDocumentFeatures.kind === 'inline' || !shortcut.shouldBeEnabledInComponentBlock(locationDocumentFeatures.documentFeatures))) {
        return;
      }

      // so that this starts a new undo group
      editor.history.undos.push({
        operations: [],
        selectionBefore: editor.selection
      });
      Transforms.select(editor, range);
      Transforms.delete(editor);
      shortcut.insert();
    }
  };
  return editor;
}

function getDirectBlockquoteParentFromSelection(editor) {
  if (!editor.selection) return {
    isInside: false
  };
  const [, parentPath] = Editor.parent(editor, editor.selection);
  if (!parentPath.length) {
    return {
      isInside: false
    };
  }
  const [maybeBlockquoteParent, maybeBlockquoteParentPath] = Editor.parent(editor, parentPath);
  const isBlockquote = maybeBlockquoteParent.type === 'blockquote';
  return isBlockquote ? {
    isInside: true,
    path: maybeBlockquoteParentPath
  } : {
    isInside: false
  };
}
function withBlockquote(editor) {
  const {
    insertBreak,
    deleteBackward
  } = editor;
  editor.deleteBackward = unit => {
    if (editor.selection) {
      const parentBlockquote = getDirectBlockquoteParentFromSelection(editor);
      if (parentBlockquote.isInside && Range.isCollapsed(editor.selection) &&
      // the selection is at the start of the paragraph
      editor.selection.anchor.offset === 0 &&
      // it's the first paragraph in the panel
      editor.selection.anchor.path[editor.selection.anchor.path.length - 2] === 0) {
        Transforms.unwrapNodes(editor, {
          match: node => node.type === 'blockquote',
          split: true
        });
        return;
      }
    }
    deleteBackward(unit);
  };
  editor.insertBreak = () => {
    const panel = getDirectBlockquoteParentFromSelection(editor);
    if (editor.selection && panel.isInside) {
      const [node, nodePath] = Editor.node(editor, editor.selection);
      if (Path.isDescendant(nodePath, panel.path) && Node.string(node) === '') {
        Transforms.unwrapNodes(editor, {
          match: node => node.type === 'blockquote',
          split: true
        });
        return;
      }
    }
    insertBreak();
  };
  return editor;
}

function withHeading(editor) {
  const {
    insertBreak
  } = editor;
  editor.insertBreak = () => {
    insertBreak();
    const entry = Editor.above(editor, {
      match: n => n.type === 'heading'
    });
    if (!entry || !editor.selection || !Range.isCollapsed(editor.selection)) {
      return;
    }
    const path = entry[1];
    if (
    // we want to unwrap the heading when the user inserted a break at the end of the heading
    // when the user inserts a break at the end of a heading, the new heading
    // that we want to unwrap will be empty so the end will be equal to the selection
    Point.equals(Editor.end(editor, path), editor.selection.anchor)) {
      Transforms.unwrapNodes(editor, {
        at: path
      });
      return;
    }
    // we also want to unwrap the _previous_ heading when the user inserted a break
    // at the start of the heading, essentially just inserting an empty paragraph above the heading
    if (!Path.hasPrevious(path)) {
      return;
    }
    const previousPath = Path.previous(path);
    const previousNode = Node.get(editor, previousPath);
    if (previousNode.type === 'heading' && previousNode.children.length === 1 && Text$1.isText(previousNode.children[0]) && previousNode.children[0].text === '') {
      Transforms.unwrapNodes(editor, {
        at: previousPath
      });
    }
  };
  return editor;
}

const allMarkdownShortcuts = {
  bold: ['**', '__'],
  italic: ['*', '_'],
  strikethrough: ['~~'],
  code: ['`']
};
function applyMark(editor, mark, shortcutText, startOfStartPoint) {
  // so that this starts a new undo group
  editor.history.undos.push({
    operations: [],
    selectionBefore: editor.selection
  });
  const startPointRef = Editor.pointRef(editor, startOfStartPoint);
  Transforms.delete(editor, {
    at: editor.selection.anchor,
    distance: shortcutText.length,
    reverse: true
  });
  Transforms.delete(editor, {
    at: startOfStartPoint,
    distance: shortcutText.length
  });
  Transforms.setNodes(editor, {
    [mark]: true
  }, {
    match: Text$1.isText,
    split: true,
    at: {
      anchor: startPointRef.unref(),
      focus: editor.selection.anchor
    }
  });
  // once you've ended the shortcut, you're done with the mark
  // so we need to remove it so the text you insert after doesn't have it
  editor.removeMark(mark);
}
function withMarks(editorDocumentFeatures, componentBlocks, editor) {
  const {
    insertText,
    insertBreak
  } = editor;
  editor.insertBreak = () => {
    insertBreak();
    const marksAfterInsertBreak = Editor.marks(editor);
    if (!marksAfterInsertBreak || !editor.selection) return;
    const parentBlock = Editor.above(editor, {
      match: isBlock
    });
    if (!parentBlock) return;
    const point = EditorAfterButIgnoringingPointsWithNoContent(editor, editor.selection.anchor);
    const marksAfterInsertBreakArr = Object.keys(marksAfterInsertBreak);
    if (!point || !Path.isDescendant(point.path, parentBlock[1])) {
      for (const mark of marksAfterInsertBreakArr) {
        editor.removeMark(mark);
      }
      return;
    }
    const textNode = Node.get(editor, point.path);
    for (const mark of marksAfterInsertBreakArr) {
      if (!textNode[mark]) {
        editor.removeMark(mark);
      }
    }
  };
  const selectedMarkdownShortcuts = {};
  const enabledMarks = editorDocumentFeatures.formatting.inlineMarks;
  Object.keys(allMarkdownShortcuts).forEach(mark => {
    if (enabledMarks[mark]) {
      selectedMarkdownShortcuts[mark] = allMarkdownShortcuts[mark];
    }
  });
  if (Object.keys(selectedMarkdownShortcuts).length === 0) return editor;
  editor.insertText = text => {
    insertText(text);
    if (editor.selection && Range.isCollapsed(editor.selection)) {
      for (const [mark, shortcuts] of Object.entries(selectedMarkdownShortcuts)) {
        for (const shortcutText of shortcuts) {
          if (text === shortcutText[shortcutText.length - 1]) {
            // this function is not inlined because
            // https://github.com/swc-project/swc/issues/2622
            const startOfBlock = getStartOfBlock(editor);
            let startOfBlockToEndOfShortcutString = Editor.string(editor, {
              anchor: editor.selection.anchor,
              focus: startOfBlock
            });
            const hasWhitespaceBeforeEndOfShortcut = /\s/.test(startOfBlockToEndOfShortcutString.slice(-shortcutText.length - 1, -shortcutText.length));
            const endOfShortcutContainsExpectedContent = shortcutText === startOfBlockToEndOfShortcutString.slice(-shortcutText.length);
            if (hasWhitespaceBeforeEndOfShortcut || !endOfShortcutContainsExpectedContent) {
              continue;
            }
            const strToMatchOn = startOfBlockToEndOfShortcutString.slice(0, -shortcutText.length - 1);
            // TODO: use regex probs
            for (const [offsetFromStartOfBlock] of [...strToMatchOn].reverse().entries()) {
              const expectedShortcutText = strToMatchOn.slice(offsetFromStartOfBlock, offsetFromStartOfBlock + shortcutText.length);
              if (expectedShortcutText !== shortcutText) {
                continue;
              }
              const startOfStartOfShortcut = offsetFromStartOfBlock === 0 ? startOfBlock : EditorAfterButIgnoringingPointsWithNoContent(editor, startOfBlock, {
                distance: offsetFromStartOfBlock
              });
              const endOfStartOfShortcut = Editor.after(editor, startOfStartOfShortcut, {
                distance: shortcutText.length
              });
              if (offsetFromStartOfBlock !== 0 && !/\s/.test(Editor.string(editor, {
                anchor: Editor.before(editor, startOfStartOfShortcut, {
                  unit: 'character'
                }),
                focus: startOfStartOfShortcut
              }))) {
                continue;
              }
              const contentBetweenShortcuts = Editor.string(editor, {
                anchor: endOfStartOfShortcut,
                focus: editor.selection.anchor
              }).slice(0, -shortcutText.length);
              if (contentBetweenShortcuts === '' || /\s/.test(contentBetweenShortcuts[0])) {
                continue;
              }

              // this is a bit of a weird one
              // let's say you had <text>__thing _<cursor /></text> and you insert `_`.
              // without the below, that would turn into <text italic>_thing _<cursor /></text>
              // but it's probably meant to be bold but it's not because of the space before the ending _
              // there's probably a better way to do this but meh, this works
              if (mark === 'italic' && (contentBetweenShortcuts[0] === '_' || contentBetweenShortcuts[0] === '*')) {
                continue;
              }
              // this is the start of a code block shortcut
              if (mark === 'code' && contentBetweenShortcuts === '`') {
                continue;
              }
              const ancestorComponentChildFieldDocumentFeatures = getAncestorComponentChildFieldDocumentFeatures(editor, editorDocumentFeatures, componentBlocks);
              if (ancestorComponentChildFieldDocumentFeatures && ancestorComponentChildFieldDocumentFeatures.inlineMarks !== 'inherit' && ancestorComponentChildFieldDocumentFeatures.inlineMarks[mark] === false) {
                continue;
              }
              applyMark(editor, mark, shortcutText, startOfStartOfShortcut);
              return;
            }
          }
        }
      }
    }
  };
  return editor;
}
function getStartOfBlock(editor) {
  return Editor.start(editor, Editor.above(editor, {
    match: isBlock
  })[1]);
}

// very loosely based on https://github.com/ianstormtaylor/slate/blob/d22c76ae1313fe82111317417912a2670e73f5c9/site/examples/paste-html.tsx
function getAlignmentFromElement(element) {
  const parent = element.parentElement;
  // confluence
  const attribute = parent === null || parent === void 0 ? void 0 : parent.getAttribute('data-align');
  // note: we don't show html that confluence would parse as alignment
  // we could change that but meh
  // (they match on div.fabric-editor-block-mark with data-align)
  if (attribute === 'center' || attribute === 'end') {
    return attribute;
  }
  if (element instanceof HTMLElement) {
    // Google docs
    const textAlign = element.style.textAlign;
    if (textAlign === 'center') {
      return 'center';
    }
    // TODO: RTL things?
    if (textAlign === 'right' || textAlign === 'end') {
      return 'end';
    }
  }
}
const headings = {
  H1: 1,
  H2: 2,
  H3: 3,
  H4: 4,
  H5: 5,
  H6: 6
};
const TEXT_TAGS = {
  CODE: 'code',
  DEL: 'strikethrough',
  S: 'strikethrough',
  STRIKE: 'strikethrough',
  EM: 'italic',
  I: 'italic',
  STRONG: 'bold',
  U: 'underline',
  SUP: 'superscript',
  SUB: 'subscript',
  KBD: 'keyboard'
};
function marksFromElementAttributes(element) {
  const marks = new Set();
  const style = element.style;
  const {
    nodeName
  } = element;
  const markFromNodeName = TEXT_TAGS[nodeName];
  if (markFromNodeName) {
    marks.add(markFromNodeName);
  }
  const {
    fontWeight,
    textDecoration,
    verticalAlign
  } = style;
  if (textDecoration === 'underline') {
    marks.add('underline');
  } else if (textDecoration === 'line-through') {
    marks.add('strikethrough');
  }
  // confluence
  if (nodeName === 'SPAN' && element.classList.contains('code')) {
    marks.add('code');
  }
  // Google Docs does weird things with <b>
  if (nodeName === 'B' && fontWeight !== 'normal') {
    marks.add('bold');
  } else if (typeof fontWeight === 'string' && (fontWeight === 'bold' || fontWeight === 'bolder' || fontWeight === '1000' || /^[5-9]\d{2}$/.test(fontWeight))) {
    marks.add('bold');
  }
  if (style.fontStyle === 'italic') {
    marks.add('italic');
  }
  // Google Docs uses vertical align for subscript and superscript instead of <sup> and <sub>
  if (verticalAlign === 'super') {
    marks.add('superscript');
  } else if (verticalAlign === 'sub') {
    marks.add('subscript');
  }
  return marks;
}
function deserializeHTML(html) {
  const parsed = new DOMParser().parseFromString(html, 'text/html');
  return fixNodesForBlockChildren(deserializeNodes(parsed.body.childNodes));
}
function deserializeHTMLNode(el) {
  if (!(el instanceof globalThis.HTMLElement)) {
    const text = el.textContent;
    if (!text) {
      return [];
    }
    return getInlineNodes(text);
  }
  if (el.nodeName === 'BR') {
    return getInlineNodes('\n');
  }
  if (el.nodeName === 'IMG') {
    const alt = el.getAttribute('alt');
    return getInlineNodes(alt !== null && alt !== void 0 ? alt : '');
  }
  if (el.nodeName === 'HR') {
    return [{
      type: 'divider',
      children: [{
        text: ''
      }]
    }];
  }
  const marks = marksFromElementAttributes(el);

  // Dropbox Paper displays blockquotes as lists for some reason
  if (el.classList.contains('listtype-quote')) {
    marks.delete('italic');
    return addMarksToChildren(marks, () => [{
      type: 'blockquote',
      children: fixNodesForBlockChildren(deserializeNodes(el.childNodes))
    }]);
  }
  return addMarksToChildren(marks, () => {
    const {
      nodeName
    } = el;
    if (nodeName === 'A') {
      const href = el.getAttribute('href');
      if (href) {
        return setLinkForChildren(href, () => forceDisableMarkForChildren('underline', () => deserializeNodes(el.childNodes)));
      }
    }
    if (nodeName === 'PRE' && el.textContent) {
      return [{
        type: 'code',
        children: [{
          text: el.textContent || ''
        }]
      }];
    }
    const deserialized = deserializeNodes(el.childNodes);
    const children = fixNodesForBlockChildren(deserialized);
    if (nodeName === 'LI') {
      let nestedList;
      const listItemContent = {
        type: 'list-item-content',
        children: children.filter(node => {
          if (nestedList === undefined && (node.type === 'ordered-list' || node.type === 'unordered-list')) {
            nestedList = node;
            return false;
          }
          return true;
        })
      };
      const listItemChildren = nestedList ? [listItemContent, nestedList] : [listItemContent];
      return [{
        type: 'list-item',
        children: listItemChildren
      }];
    }
    if (nodeName === 'P') {
      return [{
        type: 'paragraph',
        textAlign: getAlignmentFromElement(el),
        children
      }];
    }
    const headingLevel = headings[nodeName];
    if (typeof headingLevel === 'number') {
      return [{
        type: 'heading',
        level: headingLevel,
        textAlign: getAlignmentFromElement(el),
        children
      }];
    }
    if (nodeName === 'BLOCKQUOTE') {
      return [{
        type: 'blockquote',
        children
      }];
    }
    if (nodeName === 'OL') {
      return [{
        type: 'ordered-list',
        children
      }];
    }
    if (nodeName === 'UL') {
      return [{
        type: 'unordered-list',
        children
      }];
    }
    if (nodeName === 'DIV' && !isBlock(children[0])) {
      return [{
        type: 'paragraph',
        children
      }];
    }
    return deserialized;
  });
}
function deserializeNodes(nodes) {
  const outputNodes = [];
  for (const node of nodes) {
    outputNodes.push(...deserializeHTMLNode(node));
  }
  return outputNodes;
}
function fixNodesForBlockChildren(deserializedNodes) {
  if (!deserializedNodes.length) {
    // Slate also gets unhappy if an element has no children
    // the empty text nodes will get normalized away if they're not needed
    return [{
      text: ''
    }];
  }
  if (deserializedNodes.some(isBlock)) {
    const result = [];
    let queuedInlines = [];
    const flushInlines = () => {
      if (queuedInlines.length) {
        result.push({
          type: 'paragraph',
          children: queuedInlines
        });
        queuedInlines = [];
      }
    };
    for (const node of deserializedNodes) {
      if (isBlock(node)) {
        flushInlines();
        result.push(node);
        continue;
      }
      // we want to ignore whitespace between block level elements
      // useful info about whitespace in html:
      // https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Whitespace
      if (Node.string(node).trim() !== '') {
        queuedInlines.push(node);
      }
    }
    flushInlines();
    return result;
  }
  return deserializedNodes;
}

const markdownConfig = {
  mdastExtensions: [autoLinkLiteralFromMarkdownExtension, gfmStrikethroughFromMarkdownExtension],
  extensions: [autoLinkLiteralMarkdownSyntax, gfmStrikethroughMarkdownSyntax()]
};
function deserializeMarkdown(markdown) {
  const root = mdASTUtilFromMarkdown(markdown, markdownConfig);
  let nodes = root.children;
  if (nodes.length === 1 && nodes[0].type === 'paragraph') {
    nodes = nodes[0].children;
  }
  return deserializeChildren(nodes, markdown);
}
function deserializeChildren(nodes, input) {
  const outputNodes = [];
  for (const node of nodes) {
    const result = deserializeMarkdownNode(node, input);
    if (result.length) {
      outputNodes.push(...result);
    }
  }
  if (!outputNodes.length) {
    outputNodes.push({
      text: ''
    });
  }
  return outputNodes;
}
function deserializeMarkdownNode(node, input) {
  switch (node.type) {
    case 'blockquote':
      {
        return [{
          type: 'blockquote',
          children: deserializeChildren(node.children, input)
        }];
      }
    case 'link':
      {
        // arguably this could just return a link node rather than use setLinkForChildren since the children _should_ only be inlines
        // but rather than relying on the markdown parser we use being correct in this way since it isn't nicely codified in types
        // let's be safe since we already have the code to do it the safer way because of html pasting
        return setLinkForChildren(node.url, () => deserializeChildren(node.children, input));
      }
    case 'code':
      {
        return [{
          type: 'code',
          children: [{
            text: node.value
          }]
        }];
      }
    case 'paragraph':
      {
        return [{
          type: 'paragraph',
          children: deserializeChildren(node.children, input)
        }];
      }
    case 'heading':
      {
        return [{
          type: 'heading',
          level: node.depth,
          children: deserializeChildren(node.children, input)
        }];
      }
    case 'list':
      {
        return [{
          type: node.ordered ? 'ordered-list' : 'unordered-list',
          children: deserializeChildren(node.children, input)
        }];
      }
    case 'listItem':
      {
        return [{
          type: 'list-item',
          children: deserializeChildren(node.children, input)
        }];
      }
    case 'thematicBreak':
      {
        return [{
          type: 'divider',
          children: [{
            text: ''
          }]
        }];
      }
    case 'break':
      {
        return getInlineNodes('\n');
      }
    case 'delete':
      {
        return addMarkToChildren('strikethrough', () => deserializeChildren(node.children, input));
      }
    case 'strong':
      {
        return addMarkToChildren('bold', () => deserializeChildren(node.children, input));
      }
    case 'emphasis':
      {
        return addMarkToChildren('italic', () => deserializeChildren(node.children, input));
      }
    case 'inlineCode':
      {
        return addMarkToChildren('code', () => getInlineNodes(node.value));
      }
    case 'text':
      {
        return getInlineNodes(node.value);
      }
  }
  return getInlineNodes(input.slice(node.position.start.offset, node.position.end.offset));
}

const urlPattern = /https?:\/\//;
function insertFragmentButDifferent(editor, nodes) {
  if (isBlock(nodes[0])) {
    insertNodesButReplaceIfSelectionIsAtEmptyParagraphOrHeading(editor, nodes);
  } else {
    Transforms.insertFragment(editor, nodes);
  }
}
const clipboardFormatKey = 'x-keystatic-fragment';
const getDefaultView = value => {
  return value && value.ownerDocument && value.ownerDocument.defaultView || null;
};
const isDOMNode = value => {
  const window = getDefaultView(value);
  return !!window && value instanceof window.Node;
};
const isDOMText = value => {
  return isDOMNode(value) && value.nodeType === 3;
};
const isDOMElement = value => {
  return isDOMNode(value) && value.nodeType === 1;
};
const getPlainText = domNode => {
  let text = '';
  if (isDOMText(domNode) && domNode.nodeValue) {
    return domNode.nodeValue;
  }
  if (isDOMElement(domNode)) {
    for (const childNode of Array.from(domNode.childNodes)) {
      text += getPlainText(childNode);
    }
    const display = getComputedStyle(domNode).getPropertyValue('display');
    if (display === 'block' || display === 'list' || domNode.tagName === 'BR') {
      text += '\n';
    }
  }
  return text;
};
function setFragmentData(e, data) {
  const {
    selection
  } = e;
  if (!selection) {
    return;
  }
  const [start, end] = Range.edges(selection);
  const startVoid = Editor.void(e, {
    at: start.path
  });
  const endVoid = Editor.void(e, {
    at: end.path
  });
  if (Range.isCollapsed(selection) && !startVoid) {
    return;
  }

  // Create a fake selection so that we can add a Base64-encoded copy of the
  // fragment to the HTML, to decode on future pastes.
  const domRange = ReactEditor.toDOMRange(e, selection);
  let contents = domRange.cloneContents();
  let attach = contents.childNodes[0];

  // Make sure attach is non-empty, since empty nodes will not get copied.
  contents.childNodes.forEach(node => {
    if (node.textContent && node.textContent.trim() !== '') {
      attach = node;
    }
  });

  // COMPAT: If the end node is a void node, we need to move the end of the
  // range from the void node's spacer span, to the end of the void node's
  // content, since the spacer is before void's content in the DOM.
  if (endVoid) {
    const [voidNode] = endVoid;
    const r = domRange.cloneRange();
    const domNode = ReactEditor.toDOMNode(e, voidNode);
    r.setEndAfter(domNode);
    contents = r.cloneContents();
  }

  // COMPAT: If the start node is a void node, we need to attach the encoded
  // fragment to the void node's content node instead of the spacer, because
  // attaching it to empty `<div>/<span>` nodes will end up having it erased by
  // most browsers. (2018/04/27)
  if (startVoid) {
    attach = contents.querySelector('[data-slate-spacer]');
  }

  // Remove any zero-width space spans from the cloned DOM so that they don't
  // show up elsewhere when pasted.
  Array.from(contents.querySelectorAll('[data-slate-zero-width]')).forEach(zw => {
    const isNewline = zw.getAttribute('data-slate-zero-width') === 'n';
    zw.textContent = isNewline ? '\n' : '';
  });

  // Set a `data-slate-fragment` attribute on a non-empty node, so it shows up
  // in the HTML, and can be used for intra-Slate pasting. If it's a text
  // node, wrap it in a `<span>` so we have something to set an attribute on.
  if (isDOMText(attach)) {
    const span = attach.ownerDocument.createElement('span');
    // COMPAT: In Chrome and Safari, if we don't add the `white-space` style
    // then leading and trailing spaces will be ignored. (2017/09/21)
    span.style.whiteSpace = 'pre';
    span.appendChild(attach);
    contents.appendChild(span);
    attach = span;
  }
  const fragment = e.getFragment();
  const string = JSON.stringify(fragment, (key, val) => {
    if (val instanceof Uint8Array) {
      return {
        [bytesName]: fromUint8Array(val)
      };
    }
    return val;
  });
  const encoded = window.btoa(encodeURIComponent(string));
  attach.setAttribute('data-keystatic-fragment', encoded);
  data.setData(`application/${clipboardFormatKey}`, encoded);

  // Add the content to a <div> so that we can get its inner HTML.
  const div = contents.ownerDocument.createElement('div');
  div.appendChild(contents);
  div.setAttribute('hidden', 'true');
  contents.ownerDocument.body.appendChild(div);
  data.setData('text/html', div.innerHTML);
  data.setData('text/plain', getPlainText(div));
  contents.ownerDocument.body.removeChild(div);
}
const catchSlateFragment = /data-keystatic-fragment="(.+?)"/m;
const getSlateFragmentAttribute = dataTransfer => {
  const htmlData = dataTransfer.getData('text/html');
  const [, fragment] = htmlData.match(catchSlateFragment) || [];
  return fragment;
};
const bytesName = '$$keystaticUint8Array$$';
function withPasting(editor) {
  const {
    insertTextData
  } = editor;
  editor.setFragmentData = data => {
    setFragmentData(editor, data);
  };
  editor.insertFragmentData = data => {
    /**
     * Checking copied fragment from application/x-slate-fragment or data-slate-fragment
     */
    const fragment = data.getData(`application/${clipboardFormatKey}`) || getSlateFragmentAttribute(data);
    if (fragment) {
      const decoded = decodeURIComponent(window.atob(fragment));
      const parsed = JSON.parse(decoded, (key, val) => typeof val === 'object' && val !== null && bytesName in val && typeof val[bytesName] === 'string' ? toUint8Array(val[bytesName]) : val);
      editor.insertFragment(parsed);
      return true;
    }
    return false;
  };
  editor.insertTextData = data => {
    const blockAbove = Editor.above(editor, {
      match: isBlock
    });
    if ((blockAbove === null || blockAbove === void 0 ? void 0 : blockAbove[0].type) === 'code') {
      const plain = data.getData('text/plain');
      editor.insertText(plain);
      return true;
    }
    let vsCodeEditorData = data.getData('vscode-editor-data');
    if (vsCodeEditorData) {
      try {
        const vsCodeData = JSON.parse(vsCodeEditorData);
        if ((vsCodeData === null || vsCodeData === void 0 ? void 0 : vsCodeData.mode) === 'markdown' || (vsCodeData === null || vsCodeData === void 0 ? void 0 : vsCodeData.mode) === 'mdx') {
          const plain = data.getData('text/plain');
          if (plain) {
            const fragment = deserializeMarkdown(plain);
            insertFragmentButDifferent(editor, fragment);
            return true;
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
    const plain = data.getData('text/plain');
    if (
    // isValidURL is a bit more permissive than a user might expect
    // so for pasting, we'll constrain it to starting with https:// or http://
    urlPattern.test(plain) && isValidURL(plain) && editor.selection && !Range.isCollapsed(editor.selection) &&
    // we only want to turn the selected text into a link if the selection is within the same block
    Editor.above(editor, {
      match: node => isBlock(node) && !isBlock(node.children[0])
    }) &&
    // and there is only text(potentially with marks) in the selection
    // no other links
    Editor.nodes(editor, {
      match: node => node.type === 'link'
    }).next().done) {
      Transforms.wrapNodes(editor, {
        type: 'link',
        href: plain,
        children: []
      }, {
        split: true
      });
      return true;
    }
    const html = data.getData('text/html');
    if (html) {
      const fragment = deserializeHTML(html);
      insertFragmentButDifferent(editor, fragment);
      return true;
    }
    if (plain) {
      const fragment = deserializeMarkdown(plain);
      insertFragmentButDifferent(editor, fragment);
      return true;
    }
    return insertTextData(data);
  };
  return editor;
}

const shortcuts = {
  '...': '…',
  '-->': '→',
  '->': '→',
  '<-': '←',
  '<--': '←',
  '--': '–'
};
function withShortcuts(editor) {
  const {
    insertText
  } = editor;
  editor.insertText = text => {
    insertText(text);
    if (text === ' ' && editor.selection && Range.isCollapsed(editor.selection)) {
      const selectionPoint = editor.selection.anchor;
      const ancestorBlock = Editor.above(editor, {
        match: isBlock
      });
      if (ancestorBlock) {
        Object.keys(shortcuts).forEach(shortcut => {
          const pointBefore = Editor.before(editor, selectionPoint, {
            unit: 'character',
            distance: shortcut.length + 1
          });
          if (pointBefore && Path.isDescendant(pointBefore.path, ancestorBlock[1])) {
            const range = {
              anchor: selectionPoint,
              focus: pointBefore
            };
            const str = Editor.string(editor, range);
            if (str.slice(0, shortcut.length) === shortcut) {
              editor.history.undos.push({
                operations: [],
                selectionBefore: editor.selection
              });
              Transforms.select(editor, range);
              editor.insertText(shortcuts[shortcut] + ' ');
            }
          }
        });
      }
    }
  };
  return editor;
}

function withSoftBreaks(editor) {
  // TODO: should soft breaks only work in particular places
  editor.insertSoftBreak = () => {
    Transforms.insertText(editor, '\n');
  };
  return editor;
}

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline'
};
function isMarkActive(editor, mark) {
  const marks = Editor.marks(editor);
  if (marks !== null && marks !== void 0 && marks[mark]) {
    return true;
  }
  // see the stuff about marks in toolbar-state for why this is here
  for (const entry of Editor.nodes(editor, {
    match: Text$1.isText
  })) {
    if (entry[0][mark]) {
      return true;
    }
  }
  return false;
}
const arrowKeyToDirection = new Map([['ArrowUp', 'up'], ['ArrowDown', 'down'], ['ArrowLeft', 'left'], ['ArrowRight', 'right']]);
const getKeyDownHandler = (editor, documentFeatures) => event => {
  if (event.defaultPrevented) return;
  for (const hotkey in HOTKEYS) {
    if (documentFeatures.formatting.inlineMarks[HOTKEYS[hotkey]] && isHotkey(hotkey, event.nativeEvent)) {
      event.preventDefault();
      const mark = HOTKEYS[hotkey];
      const isActive = isMarkActive(editor, mark);
      if (isActive) {
        Editor.removeMark(editor, mark);
      } else {
        Editor.addMark(editor, mark, true);
      }
      return;
    }
  }
  if (isHotkey('mod+\\', event.nativeEvent)) {
    clearFormatting(editor);
    return;
  }
  if (documentFeatures.links && isHotkey('mod+k', event.nativeEvent)) {
    event.preventDefault();
    wrapLink(editor, '');
    return;
  }
  if (event.key === 'Tab') {
    const didAction = event.shiftKey ? unnestList(editor) : nestList(editor);
    if (didAction) {
      event.preventDefault();
      return;
    }
  }
  if (event.key === 'Tab' && editor.selection) {
    const layoutArea = Editor.above(editor, {
      match: node => node.type === 'layout-area' || node.type === 'table-cell'
    });
    if (layoutArea) {
      const layoutAreaToEnter = event.shiftKey ? Editor.before(editor, layoutArea[1], {
        unit: 'block'
      }) : Editor.after(editor, layoutArea[1], {
        unit: 'block'
      });
      Transforms.setSelection(editor, {
        anchor: layoutAreaToEnter,
        focus: layoutAreaToEnter
      });
      event.preventDefault();
    }
  }
  if (isHotkey('mod+a', event)) {
    const parentTable = Editor.above(editor, {
      match: nodeTypeMatcher('table')
    });
    if (parentTable) {
      Transforms.select(editor, parentTable[1]);
      event.preventDefault();
      return;
    }
  }
  const direction = arrowKeyToDirection.get(event.key);
  const {
    selection
  } = editor;
  if (direction && selection) {
    const selectedTableArea = getSelectedTableArea(editor);
    if (selectedTableArea) {
      var _Editor$above, _Editor$above2;
      const focusCellPath = (_Editor$above = Editor.above(editor, {
        match: nodeTypeMatcher('table-cell'),
        at: selection.focus.path
      })) === null || _Editor$above === void 0 ? void 0 : _Editor$above[1];
      const anchorCellPath = (_Editor$above2 = Editor.above(editor, {
        match: nodeTypeMatcher('table-cell'),
        at: selection.anchor.path
      })) === null || _Editor$above2 === void 0 ? void 0 : _Editor$above2[1];
      if (!focusCellPath || !anchorCellPath) return;
      const newCellPath = getCellPathInDirection(editor, focusCellPath, direction);
      if (newCellPath) {
        if (selectedTableArea.singleCell === 'not-selected') {
          if (direction !== 'up' && direction !== 'down') return;
          const [node, offset] = ReactEditor.toDOMPoint(editor, selection.focus);
          const blockElement = Editor.above(editor, {
            match: isBlock,
            at: selection.focus.path
          });
          if (!blockElement) return;
          if (direction === 'up' && blockElement[1].slice(focusCellPath.length).some(idx => idx !== 0)) {
            return;
          }
          if (direction === 'down') {
            const [parentNode] = Editor.parent(editor, blockElement[1]);
            if (parentNode.children.length - 1 !== blockElement[1][blockElement[1].length - 1]) {
              return;
            }
            for (const [node, path] of Node.ancestors(editor, blockElement[1], {
              reverse: true
            })) {
              if (node.type === 'table-cell') break;
              const [parentNode] = Editor.parent(editor, path);
              if (parentNode.children.length - 1 === path[path.length - 1]) {
                continue;
              }
              return;
            }
          }
          const domNodeForBlockElement = ReactEditor.toDOMNode(editor, blockElement[0]);
          const rangeOfWholeBlock = document.createRange();
          rangeOfWholeBlock.selectNodeContents(domNodeForBlockElement);
          const rectsOfRangeOfWholeBlock = Array.from(rangeOfWholeBlock.getClientRects());
          const newRange = document.createRange();
          newRange.setStart(node, offset);
          newRange.setEnd(node, offset);
          const rangeRects = Array.from(newRange.getClientRects());
          const lastRangeRect = rangeRects[rangeRects.length - 1];
          const key = direction === 'up' ? 'top' : 'bottom';
          const expected = key === 'top' ? Math.min(...rectsOfRangeOfWholeBlock.map(x => x.top)) : Math.max(...rectsOfRangeOfWholeBlock.map(x => x.bottom));
          if (lastRangeRect[key] === expected) {
            const focus = Editor[direction === 'up' ? 'end' : 'start'](editor, newCellPath);
            Transforms.select(editor, {
              focus,
              anchor: event.shiftKey ? selection.anchor : focus
            });
            event.preventDefault();
          }
          return;
        }
        if (!event.shiftKey) return;
        if (Path.equals(newCellPath, anchorCellPath)) {
          Transforms.select(editor, newCellPath);
        } else {
          Transforms.select(editor, {
            anchor: selection.anchor,
            focus: Editor.start(editor, newCellPath)
          });
        }
        event.preventDefault();
      }
    }
  }
};
function createDocumentEditor(documentFeatures, componentBlocks) {
  return withPasting(withImages(withSoftBreaks(withInsertMenu(withShortcuts(withHeading(withBlockquote(withMarks(documentFeatures, componentBlocks, withBlockMarkdownShortcuts(documentFeatures, componentBlocks, _createDocumentEditor(withHistory(withReact(createEditor())), documentFeatures, componentBlocks))))))))));
}
function DocumentEditor({
  onChange,
  value,
  componentBlocks,
  documentFeatures,
  ...props
}) {
  let entryLayoutPane = useEntryLayoutSplitPaneContext();
  const editor = useMemo(() => createDocumentEditor(documentFeatures, componentBlocks), [documentFeatures, componentBlocks]);
  return /*#__PURE__*/jsx("div", {
    "data-layout": entryLayoutPane,
    className: classNames(css({
      backgroundColor: tokenSchema.color.background.canvas,
      minWidth: 0,
      '&[data-layout="main"]': {
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      },
      '&:not([data-layout="main"])': {
        border: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.border.neutral}`,
        borderRadius: tokenSchema.size.radius.medium
      }
    }), 'keystar-document-editor'),
    children: /*#__PURE__*/jsxs(DocumentEditorProvider, {
      componentBlocks: componentBlocks,
      documentFeatures: documentFeatures,
      editor: editor,
      value: value,
      onChange: value => {
        onChange === null || onChange === void 0 || onChange(value);
        // this fixes a strange issue in Safari where the selection stays inside of the editor
        // after a blur event happens but the selection is still in the editor
        // so the cursor is visually in the wrong place and it inserts text backwards
        const selection = window.getSelection();
        if (selection && !ReactEditor.isFocused(editor)) {
          const editorNode = ReactEditor.toDOMNode(editor, editor);
          if (selection.anchorNode === editorNode) {
            ReactEditor.focus(editor);
          }
        }
      },
      children: [useMemo(() => onChange !== undefined && /*#__PURE__*/jsx(Toolbar, {
        documentFeatures: documentFeatures
      }), [documentFeatures, onChange]), /*#__PURE__*/jsx(DocumentEditorEditable, {
        ...props,
        readOnly: onChange === undefined
      }),
      // for debugging
      false ]
    })
  });
}
const IsInEditorContext = /*#__PURE__*/createContext(false);
function DocumentEditorProvider({
  children,
  editor,
  onChange,
  value,
  componentBlocks,
  documentFeatures
}) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const identity = useMemo(() => Math.random().toString(36), [editor]);
  return /*#__PURE__*/jsx(IsInEditorContext.Provider, {
    value: true,
    children: /*#__PURE__*/jsx(Slate
    // this fixes issues with Slate crashing when a fast refresh occcurs
    , {
      editor: editor,
      value: value,
      onChange: value => {
        onChange(value);
        // this fixes a strange issue in Safari where the selection stays inside of the editor
        // after a blur event happens but the selection is still in the editor
        // so the cursor is visually in the wrong place and it inserts text backwards
        const selection = window.getSelection();
        if (selection && !ReactEditor.isFocused(editor)) {
          const editorNode = ReactEditor.toDOMNode(editor, editor);
          if (selection.anchorNode === editorNode) {
            ReactEditor.focus(editor);
          }
        }
      },
      children: /*#__PURE__*/jsx(TableSelectionProvider, {
        children: /*#__PURE__*/jsx(ToolbarStateProvider, {
          componentBlocks: componentBlocks,
          editorDocumentFeatures: documentFeatures,
          children: children
        })
      })
    }, identity)
  });
}
function getPrismTokenLength(token) {
  if (typeof token === 'string') {
    return token.length;
  } else if (Array.isArray(token.content)) {
    return token.content.reduce((l, t) => l + getPrismTokenLength(t), 0);
  } else {
    return getPrismTokenLength(token.content);
  }
}
function DocumentEditorEditable(props) {
  const containerSize = useContentPanelSize();
  const entryLayoutPane = useEntryLayoutSplitPaneContext();
  const editor = useSlate();
  const {
    componentBlocks,
    documentFeatures
  } = useDocumentEditorConfig();
  const onKeyDown = useMemo(() => getKeyDownHandler(editor, documentFeatures), [editor, documentFeatures]);
  return /*#__PURE__*/jsx(ActiveBlockPopoverProvider, {
    editor: editor,
    children: /*#__PURE__*/jsx(Prose, {
      size: entryLayoutPane === 'main' ? 'medium' : 'regular',
      children: /*#__PURE__*/jsx(Editable, {
        placeholder: "Start writing or press \"/\" for commands...",
        decorate: useCallback(([node, path]) => {
          let decorations = [];
          if (node.type === 'component-block') {
            if (node.children.length === 1 && Element.isElement(node.children[0]) && node.children[0].type === 'component-inline-prop' && node.children[0].propPath === undefined) {
              return decorations;
            }
            node.children.forEach((child, index) => {
              if (Node.string(child) === '' && Element.isElement(child) && (child.type === 'component-block-prop' || child.type === 'component-inline-prop') && child.propPath !== undefined) {
                const start = Editor.start(editor, [...path, index]);
                const placeholder = getPlaceholderTextForPropPath(child.propPath, componentBlocks[node.component].schema, node.props);
                if (placeholder) {
                  decorations.push({
                    placeholder,
                    anchor: start,
                    focus: start
                  });
                }
              }
            });
          }
          if (node.type === 'code' && node.children.length === 1 && node.children[0].type === undefined && node.language && node.language in Prism.languages) {
            const textPath = [...path, 0];
            const tokens = Prism.tokenize(node.children[0].text, Prism.languages[node.language]);
            function consumeTokens(start, tokens) {
              for (const token of tokens) {
                const length = getPrismTokenLength(token);
                const end = start + length;
                if (typeof token !== 'string') {
                  decorations.push({
                    ['prism_' + token.type]: true,
                    anchor: {
                      path: textPath,
                      offset: start
                    },
                    focus: {
                      path: textPath,
                      offset: end
                    }
                  });
                  consumeTokens(start, Array.isArray(token.content) ? token.content : [token.content]);
                }
                start = end;
              }
            }
            consumeTokens(0, tokens);
          }
          return decorations;
        }, [editor, componentBlocks]),
        onKeyDown: onKeyDown,
        renderElement: renderElement,
        renderLeaf: renderLeaf,
        ...props,
        ...toDataAttributes({
          container: containerSize,
          layout: entryLayoutPane
        }),
        className: classNames(editableStyles, props.className)
      })
    })
  });
}
let styles = {
  flex: 1,
  height: 'auto',
  minHeight: tokenSchema.size.scale[2000],
  minWidth: 0,
  padding: tokenSchema.size.space.medium,
  '&[data-layout="main"]': {
    boxSizing: 'border-box',
    height: '100%',
    padding: 0,
    paddingTop: tokenSchema.size.space.medium,
    minHeight: 0,
    minWidth: 0,
    maxWidth: 800,
    marginInline: 'auto',
    [breakpointQueries.above.mobile]: {
      padding: tokenSchema.size.space.xlarge
    },
    [breakpointQueries.above.tablet]: {
      padding: tokenSchema.size.space.xxlarge
    },
    '&[data-container="wide"]': {
      padding: tokenSchema.size.scale[600]
    }
  }
};
const editableStyles = css({
  ...styles,
  a: {
    color: tokenSchema.color.foreground.accent
  }
});

const emptyObj = {};
let i = 0;
function newKey() {
  return i++;
}
function InnerChildFieldInput(props) {
  const outerConfig = useDocumentEditorConfig();
  const [state, setState] = useState(() => ({
    key: newKey(),
    value: props.value
  }));
  const documentFeatures = useMemo(() => {
    return getWholeDocumentFeaturesForChildField(outerConfig.documentFeatures, props.schema.options);
  }, [props.schema, outerConfig.documentFeatures]);
  if (state.value !== props.value) {
    setState({
      key: newKey(),
      value: props.value
    });
  }
  return /*#__PURE__*/jsx(ResetEntryLayoutContext, {
    children: /*#__PURE__*/jsx(Field, {
      label: props.schema.options.label,
      children: inputProps => /*#__PURE__*/createElement(DocumentEditor, {
        ...inputProps,
        key: state.key,
        componentBlocks: props.schema.options.componentBlocks === 'inherit' ? outerConfig.componentBlocks : emptyObj,
        documentFeatures: documentFeatures,
        onChange: val => {
          setState(state => ({
            key: state.key,
            value: val
          }));
          props.onChange(val);
        },
        value: state.value
      })
    })
  });
}
function ChildFieldInput(props) {
  const data = getChildFieldData(props);
  if (props.schema.options.kind === 'block' && (props.schema.options.editIn === 'both' || props.schema.options.editIn === 'modal') && data.value) {
    return /*#__PURE__*/jsx(InnerChildFieldInput, {
      schema: props.schema,
      ...data
    });
  }
  return null;
}

function getInputComponent(schema) {
  if (schema.kind === 'object') {
    var _schema$Input;
    return (_schema$Input = schema.Input) !== null && _schema$Input !== void 0 ? _schema$Input : ObjectFieldInput;
  }
  if (schema.kind === 'conditional') {
    var _schema$Input2;
    return (_schema$Input2 = schema.Input) !== null && _schema$Input2 !== void 0 ? _schema$Input2 : ConditionalFieldInput;
  }
  if (schema.kind === 'array') {
    var _schema$Input3;
    return (_schema$Input3 = schema.Input) !== null && _schema$Input3 !== void 0 ? _schema$Input3 : ArrayFieldInput;
  }
  if (schema.kind === 'child') {
    return ChildFieldInput;
  }
  return schema.Input;
}
const InnerFormValueContentFromPreviewProps = /*#__PURE__*/memo(function InnerFormValueContentFromPreview(props) {
  let Input = getInputComponent(props.schema);
  return /*#__PURE__*/jsx(Input, {
    ...props,
    autoFocus: !!props.autoFocus,
    forceValidation: !!props.forceValidation
  });
});
const emptyArray$1 = [];
const FormValueContentFromPreviewProps = /*#__PURE__*/memo(function FormValueContentFromPreview({
  slugField,
  ...props
}) {
  let Input = getInputComponent(props.schema);
  return /*#__PURE__*/jsx(PathContextProvider, {
    value: emptyArray$1,
    children: /*#__PURE__*/jsx(SlugFieldProvider, {
      value: slugField,
      children: /*#__PURE__*/jsx(Input, {
        ...props,
        autoFocus: !!props.autoFocus,
        forceValidation: !!props.forceValidation
      })
    })
  });
});

const emptyArray = [];
const RESPONSIVE_PADDING = {
  mobile: 'medium',
  tablet: 'xlarge',
  desktop: 'xxlarge'
};
function containerWidthForEntryLayout(config) {
  return config.entryLayout === 'content' ? 'none' : 'medium';
}
const EntryLayoutSplitPaneContext = /*#__PURE__*/createContext(null);
function useEntryLayoutSplitPaneContext() {
  return useContext(EntryLayoutSplitPaneContext);
}
function ResetEntryLayoutContext(props) {
  return /*#__PURE__*/jsx(EntryLayoutSplitPaneContext.Provider, {
    value: null,
    children: props.children
  });
}
function FormForEntry({
  formatInfo,
  forceValidation,
  slugField,
  entryLayout,
  previewProps: props
}) {
  const isAboveMobile = useContentPanelQuery({
    above: 'mobile'
  });
  if (entryLayout === 'content' && formatInfo.contentField && isAboveMobile) {
    const {
      contentField
    } = formatInfo;
    return /*#__PURE__*/jsx(PathContextProvider, {
      value: emptyArray,
      children: /*#__PURE__*/jsx(SlugFieldProvider, {
        value: slugField,
        children: /*#__PURE__*/jsxs(SplitView, {
          autoSaveId: "keystatic-content-split-view",
          defaultSize: 320,
          minSize: 240,
          maxSize: 480,
          flex: true,
          children: [/*#__PURE__*/jsx(SplitPaneSecondary, {
            children: /*#__PURE__*/jsx(EntryLayoutSplitPaneContext.Provider, {
              value: "main",
              children: /*#__PURE__*/jsx(ScrollView, {
                children: /*#__PURE__*/jsx(AddToPathProvider, {
                  part: contentField.key,
                  children: /*#__PURE__*/jsx(InnerFormValueContentFromPreviewProps, {
                    forceValidation: forceValidation,
                    ...props.fields[contentField.key]
                  })
                })
              })
            })
          }), /*#__PURE__*/jsx(SplitPanePrimary, {
            children: /*#__PURE__*/jsx(EntryLayoutSplitPaneContext.Provider, {
              value: "side",
              children: /*#__PURE__*/jsx(ScrollView, {
                children: /*#__PURE__*/jsx(Grid, {
                  gap: "xlarge",
                  padding: RESPONSIVE_PADDING,
                  children: Object.entries(props.fields).map(([key, propVal]) => key === contentField.key ? null : /*#__PURE__*/jsx(AddToPathProvider, {
                    part: key,
                    children: /*#__PURE__*/jsx(InnerFormValueContentFromPreviewProps, {
                      forceValidation: forceValidation,
                      ...propVal
                    })
                  }, key))
                })
              })
            })
          })]
        })
      })
    });
  }
  return /*#__PURE__*/jsx(ScrollView, {
    children: /*#__PURE__*/jsx(PageContainer, {
      paddingY: RESPONSIVE_PADDING,
      children: /*#__PURE__*/jsx(FormValueContentFromPreviewProps
      // autoFocus
      , {
        forceValidation: forceValidation,
        slugField: slugField,
        ...props
      })
    })
  });
}

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

function useSlugsInCollection(collection) {
  const config = useConfig();
  const tree = useTree().current;
  return useMemo(() => {
    const loadedTree = tree.kind === 'loaded' ? tree.data.tree : new Map();
    return getEntriesInCollectionWithTreeKey(config, collection, loadedTree).map(x => x.slug);
  }, [config, tree, collection]);
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
      children: item => /*#__PURE__*/jsxs(Item$6, {
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
        children: [/*#__PURE__*/jsx(Item$6, {
          children: collectionConfig.label
        }, "collection"), /*#__PURE__*/jsx(Item$6, {
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
          children: [/*#__PURE__*/jsx(Item$6, {
            children: collectionConfig.label
          }, "collection"), /*#__PURE__*/jsx(Item$6, {
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
        children: item => /*#__PURE__*/jsxs(Item$3, {
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
