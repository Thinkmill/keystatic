import Markdoc, { Ast } from '@markdoc/markdoc';
import { Transforms, Editor, Node, Element as Element$1, Text as Text$1, Path, Range, Point, createEditor } from 'slate';
import { assertNever as assertNever$1, assert as assert$1 } from 'emery/assertions';
import { assert, assertNever, isDefined, typedKeys } from 'emery';
import { fromUint8Array, toUint8Array } from 'js-base64';
import { createHash } from 'crypto';
import React, { useState, useMemo, useEffect, useContext, createContext, startTransition, useCallback, useRef, cloneElement, forwardRef, useReducer, useId as useId$1, Fragment as Fragment$1, createElement, memo } from 'react';
import { TextField, TextArea } from '@keystar/ui/text-field';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { FieldMessage, FieldLabel, Field } from '@keystar/ui/field';
import { Box, Flex, Grid, Divider, VStack, HStack, ScrollView as ScrollView$1 } from '@keystar/ui/layout';
import { SplitView, SplitPaneSecondary, SplitPanePrimary } from '@keystar/ui/split-view';
import { css, breakpoints, useMediaQuery, tokenSchema, transition, useBreakpoint, containerQueries, toDataAttributes, breakpointQueries, classNames } from '@keystar/ui/style';
import { Text, Heading, Kbd, Prose } from '@keystar/ui/typography';
import { ButtonGroup, Button, ActionButton, ToggleButton, ClearButton } from '@keystar/ui/button';
import { Dialog, DialogContainer, DialogTrigger, AlertDialog, useDialogContainer } from '@keystar/ui/dialog';
import { useDragAndDrop } from '@keystar/ui/drag-and-drop';
import { Icon } from '@keystar/ui/icon';
import { trash2Icon } from '@keystar/ui/icon/icons/trash2Icon';
import { ListView, Item as Item$2 } from '@keystar/ui/list-view';
import { Content, Footer, ClearSlots } from '@keystar/ui/slots';
import { TooltipTrigger, Tooltip } from '@keystar/ui/tooltip';
import { useLocalizedStringFormatter, useLocale } from '@react-aria/i18n';
import { ReactEditor, useSlateStatic, useSelected, useSlate, Slate, Editable, withReact } from 'slate-react';
import isHotkey from 'is-hotkey';
import { useResizeObserver, useLayoutEffect, mergeProps, useUpdateEffect } from '@react-aria/utils';
import { editIcon } from '@keystar/ui/icon/icons/editIcon';
import { externalLinkIcon } from '@keystar/ui/icon/icons/externalLinkIcon';
import { linkIcon } from '@keystar/ui/icon/icons/linkIcon';
import { unlinkIcon } from '@keystar/ui/icon/icons/unlinkIcon';
import { useOverlay, useOverlayPosition, useModalOverlay, DismissButton, useOverlayTrigger } from '@react-aria/overlays';
import { useOverlayTriggerState } from '@react-stately/overlays';
import { Overlay, Blanket, Popover } from '@keystar/ui/overlays';
import { sanitizeUrl } from '@braintree/sanitize-url';
import { Item as Item$3, ActionGroup } from '@keystar/ui/action-group';
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
import { MenuTrigger, Menu, ActionMenu, Item as Item$4 } from '@keystar/ui/menu';
import { Picker } from '@keystar/ui/picker';
import { alignLeftIcon } from '@keystar/ui/icon/icons/alignLeftIcon';
import { alignRightIcon } from '@keystar/ui/icon/icons/alignRightIcon';
import { alignCenterIcon } from '@keystar/ui/icon/icons/alignCenterIcon';
import { quoteIcon } from '@keystar/ui/icon/icons/quoteIcon';
import { Item as Item$1, Section } from '@react-stately/collections';
import { matchSorter } from 'match-sorter';
import { Combobox, Item } from '@keystar/ui/combobox';
import { trashIcon } from '@keystar/ui/icon/icons/trashIcon';
import weakMemoize from '@emotion/weak-memoize';
import { minusIcon } from '@keystar/ui/icon/icons/minusIcon';
import { columnsIcon } from '@keystar/ui/icon/icons/columnsIcon';
import { listIcon } from '@keystar/ui/icon/icons/listIcon';
import { listOrderedIcon } from '@keystar/ui/icon/icons/listOrderedIcon';
import { fileUpIcon } from '@keystar/ui/icon/icons/fileUpIcon';
import { imageIcon } from '@keystar/ui/icon/icons/imageIcon';
import '@keystar/ui/checkbox';
import { NumberField } from '@keystar/ui/number-field';
import 'minimatch';
import { gql } from '@ts-gql/tag/no-transform';
import { useQuery, useMutation } from 'urql';
import LRU from 'lru-cache';
import { parse } from 'cookie';
import { z } from 'zod';
import '@sindresorhus/slugify';
import { TextLink } from '@keystar/ui/link';
import { ProgressCircle } from '@keystar/ui/progress';
import { link2Icon } from '@keystar/ui/icon/icons/link2Icon';
import { link2OffIcon } from '@keystar/ui/icon/icons/link2OffIcon';
import { pencilIcon } from '@keystar/ui/icon/icons/pencilIcon';
import { undo2Icon } from '@keystar/ui/icon/icons/undo2Icon';
import { useId, usePrevious as usePrevious$1 } from '@keystar/ui/utils';
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
import { panelLeftOpenIcon } from '@keystar/ui/icon/icons/panelLeftOpenIcon';
import { panelLeftCloseIcon } from '@keystar/ui/icon/icons/panelLeftCloseIcon';
import { panelRightOpenIcon } from '@keystar/ui/icon/icons/panelRightOpenIcon';
import { panelRightCloseIcon } from '@keystar/ui/icon/icons/panelRightCloseIcon';
import { Badge } from '@keystar/ui/badge';
import { NavList, NavItem, NavGroup } from '@keystar/ui/nav-list';
import { StatusLight } from '@keystar/ui/status-light';
import { useProvider } from '@keystar/ui/core';
import { Avatar } from '@keystar/ui/avatar';
import { logOutIcon } from '@keystar/ui/icon/icons/logOutIcon';
import { gitPullRequestIcon } from '@keystar/ui/icon/icons/gitPullRequestIcon';
import { gitBranchPlusIcon } from '@keystar/ui/icon/icons/gitBranchPlusIcon';
import { githubIcon } from '@keystar/ui/icon/icons/githubIcon';
import { gitForkIcon } from '@keystar/ui/icon/icons/gitForkIcon';
import { monitorIcon } from '@keystar/ui/icon/icons/monitorIcon';
import { moonIcon } from '@keystar/ui/icon/icons/moonIcon';
import { sunIcon } from '@keystar/ui/icon/icons/sunIcon';
import { userIcon } from '@keystar/ui/icon/icons/userIcon';
import { gitBranchIcon } from '@keystar/ui/icon/icons/gitBranchIcon';
import { RadioGroup, Radio } from '@keystar/ui/radio';

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

function fixPath(path) {
  return path.replace(/^\.?\/+/, '').replace(/\/*$/, '');
}
const collectionPath = /\/\*\*?(?:$|\/)/;
function getConfiguredCollectionPath(config, collection) {
  var _collectionConfig$pat;
  const collectionConfig = config.collections[collection];
  const path = (_collectionConfig$pat = collectionConfig.path) !== null && _collectionConfig$pat !== void 0 ? _collectionConfig$pat : `${collection}/*/`;
  if (!collectionPath.test(path)) {
    throw new Error(`Collection path must end with /* or /** or include /*/ or /**/ but ${collection} has ${path}`);
  }
  return path;
}
function getCollectionPath(config, collection) {
  const configuredPath = getConfiguredCollectionPath(config, collection);
  const path = fixPath(configuredPath.replace(/\*\*?.*$/, ''));
  return path;
}
function getCollectionFormat(config, collection) {
  var _collectionConfig$for;
  const collectionConfig = config.collections[collection];
  return getFormatInfo((_collectionConfig$for = collectionConfig.format) !== null && _collectionConfig$for !== void 0 ? _collectionConfig$for : 'yaml', collectionConfig.schema, getConfiguredCollectionPath(config, collection));
}
function getSingletonFormat(config, singleton) {
  var _singletonConfig$form, _singletonConfig$path;
  const singletonConfig = config.singletons[singleton];
  return getFormatInfo((_singletonConfig$form = singletonConfig.format) !== null && _singletonConfig$form !== void 0 ? _singletonConfig$form : 'yaml', singletonConfig.schema, (_singletonConfig$path = singletonConfig.path) !== null && _singletonConfig$path !== void 0 ? _singletonConfig$path : `${singleton}/`);
}
function getCollectionItemPath(config, collection, slug) {
  const basePath = getCollectionPath(config, collection);
  const suffix = getCollectionItemSlugSuffix(config, collection);
  return `${basePath}/${slug}${suffix}`;
}
function getEntryDataFilepath(dir, formatInfo) {
  return `${dir}${formatInfo.dataLocation === 'index' ? '/index' : ''}${getDataFileExtension(formatInfo)}`;
}
function getSlugGlobForCollection(config, collection) {
  const collectionPath = getConfiguredCollectionPath(config, collection);
  return collectionPath.includes('**') ? '**' : '*';
}
function getCollectionItemSlugSuffix(config, collection) {
  const configuredPath = getConfiguredCollectionPath(config, collection);
  const path = fixPath(configuredPath.replace(/^[^*]+\*\*?/, ''));
  return path ? `/${path}` : '';
}
function getSingletonPath(config, singleton) {
  var _singleton$path, _singleton$path2;
  if ((_singleton$path = config.singletons[singleton].path) !== null && _singleton$path !== void 0 && _singleton$path.includes('*')) {
    throw new Error(`Singleton paths cannot include * but ${singleton} has ${config.singletons[singleton].path}`);
  }
  return fixPath((_singleton$path2 = config.singletons[singleton].path) !== null && _singleton$path2 !== void 0 ? _singleton$path2 : singleton);
}
function getDataFileExtension(formatInfo) {
  return formatInfo.contentField ? formatInfo.contentField.config.contentExtension : '.' + formatInfo.data;
}
function getFormatInfo(format, schema, path) {
  var _format$data;
  const dataLocation = path.endsWith('/') ? 'index' : 'outer';
  if (typeof format === 'string') {
    return {
      dataLocation,
      contentField: undefined,
      data: format
    };
  }
  let contentField;
  if (format.contentField) {
    const field = schema[format.contentField];
    assert((field === null || field === void 0 ? void 0 : field.kind) === 'form', `${format.contentField} is not a form field`);
    assert(field.formKind === 'content', `${format.contentField} is not a content field`);
    contentField = {
      key: format.contentField,
      config: field
    };
  }
  return {
    data: (_format$data = format.data) !== null && _format$data !== void 0 ? _format$data : 'yaml',
    contentField,
    dataLocation
  };
}
function getPathPrefix(storage) {
  if (storage.kind === 'local' || !storage.pathPrefix) {
    return undefined;
  }
  return fixPath(storage.pathPrefix) + '/';
}

async function sha1(content) {
  return createHash('sha1').update(content).digest('hex');
}

const textEncoder$2 = new TextEncoder();
function blobSha(contents) {
  const blobPrefix = textEncoder$2.encode('blob ' + contents.length + '\0');
  const array = new Uint8Array(blobPrefix.byteLength + contents.byteLength);
  array.set(blobPrefix, 0);
  array.set(contents, blobPrefix.byteLength);
  return sha1(array);
}
function getTreeNodeAtPath(root, path) {
  const parts = path.split('/');
  let node = root.get(parts[0]);
  for (const part of parts.slice(1)) {
    if (!node) return undefined;
    if (!node.children) return undefined;
    node = node.children.get(part);
  }
  return node;
}
function getNodeAtPath(tree, path) {
  let node = tree;
  for (const part of path.split('/')) {
    if (!node.has(part)) {
      node.set(part, new Map());
    }
    const innerNode = node.get(part);
    assert(innerNode instanceof Map, 'expected tree');
    node = innerNode;
  }
  return node;
}
function getFilename(path) {
  return path.replace(/.*\//, '');
}
function getDirname(path) {
  return path.replace(/\/[^/]+$/, '');
}
function toTreeChanges(changes) {
  const changesRoot = new Map();
  for (const deletion of changes.deletions) {
    const parentTree = getNodeAtPath(changesRoot, getDirname(deletion));
    parentTree.set(getFilename(deletion), 'delete');
  }
  for (const addition of changes.additions) {
    const parentTree = getNodeAtPath(changesRoot, getDirname(addition.path));
    parentTree.set(getFilename(addition.path), addition.contents);
  }
  return changesRoot;
}
const SPACE_CHAR_CODE = 32;
const space = new Uint8Array([SPACE_CHAR_CODE]);
const nullchar = new Uint8Array([0]);
const tree = textEncoder$2.encode('tree ');

// based on https://github.com/isomorphic-git/isomorphic-git/blob/c09dfa20ffe0ab9e6602e0fa172d72ba8994e443/src/models/GitTree.js#L108-L122
function treeSha(children) {
  const entries = [...children].map(([name, node]) => ({
    name,
    sha: node.entry.sha,
    mode: node.entry.mode
  }));
  entries.sort((a, b) => {
    const aName = a.mode === '040000' ? a.name + '/' : a.name;
    const bName = b.mode === '040000' ? b.name + '/' : b.name;
    return aName === bName ? 0 : aName < bName ? -1 : 1;
  });
  const treeObject = entries.flatMap(entry => {
    const mode = textEncoder$2.encode(entry.mode.replace(/^0/, ''));
    const name = textEncoder$2.encode(entry.name);
    const sha = hexToBytes(entry.sha);
    return [mode, space, name, nullchar, sha];
  });
  return sha1(concatBytes([tree, textEncoder$2.encode(treeObject.reduce((sum, val) => sum + val.byteLength, 0).toString()), nullchar, ...treeObject]));
}
function concatBytes(byteArrays) {
  const totalLength = byteArrays.reduce((sum, arr) => sum + arr.byteLength, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const arr of byteArrays) {
    result.set(arr, offset);
    offset += arr.byteLength;
  }
  return result;
}
function hexToBytes(str) {
  const bytes = new Uint8Array(str.length / 2);
  for (var i = 0; i < bytes.byteLength; i += 1) {
    const start = i * 2;
    bytes[i] = parseInt(str.slice(start, start + 2), 16);
  }
  return bytes;
}
async function createTreeNodeEntry(path, children) {
  const sha = await treeSha(children);
  return {
    path,
    mode: '040000',
    type: 'tree',
    sha
  };
}
async function createBlobNodeEntry(path, contents) {
  const sha = 'sha' in contents ? contents.sha : await blobSha(contents);
  return {
    path,
    mode: '100644',
    type: 'blob',
    sha,
    size: contents.byteLength
  };
}
async function updateTreeWithChanges(tree, changes) {
  var _await$updateTree;
  const newTree = (_await$updateTree = await updateTree(tree, toTreeChanges(changes), [])) !== null && _await$updateTree !== void 0 ? _await$updateTree : new Map();
  return {
    entries: treeToEntries(newTree),
    sha: await treeSha(newTree !== null && newTree !== void 0 ? newTree : new Map())
  };
}
function treeToEntries(tree) {
  return [...tree.values()].flatMap(x => x.children ? [x.entry, ...treeToEntries(x.children)] : [x.entry]);
}
async function updateTree(tree, changedTree, path) {
  const newTree = new Map(tree);
  for (const [key, value] of changedTree) {
    if (value === 'delete') {
      newTree.delete(key);
    }
    if (value instanceof Map) {
      var _newTree$get$children, _newTree$get;
      const existingChildren = (_newTree$get$children = (_newTree$get = newTree.get(key)) === null || _newTree$get === void 0 ? void 0 : _newTree$get.children) !== null && _newTree$get$children !== void 0 ? _newTree$get$children : new Map();
      const children = await updateTree(existingChildren, value, path.concat(key));
      if (children === undefined) {
        newTree.delete(key);
        continue;
      }
      const entry = await createTreeNodeEntry(path.concat(key).join('/'), children);
      newTree.set(key, {
        entry,
        children
      });
    }
    if (value instanceof Uint8Array || typeof value === 'object' && 'sha' in value) {
      const entry = await createBlobNodeEntry(path.concat(key).join('/'), value);
      newTree.set(key, {
        entry
      });
    }
  }
  if (newTree.size === 0) {
    return undefined;
  }
  return newTree;
}
function treeEntriesToTreeNodes(entries) {
  const root = new Map();
  const getChildrenAtPath = parts => {
    var _node;
    if (parts.length === 0) {
      return root;
    }
    let node = root.get(parts[0]);
    for (const part of parts.slice(1)) {
      if (!node) return undefined;
      if (!node.children) return undefined;
      node = node.children.get(part);
    }
    return (_node = node) === null || _node === void 0 ? void 0 : _node.children;
  };
  for (const entry of entries) {
    const split = entry.path.split('/');
    const children = getChildrenAtPath(split.slice(0, -1));
    if (children) {
      children.set(split[split.length - 1], {
        entry,
        children: entry.type === 'tree' ? new Map() : undefined
      });
    }
  }
  return root;
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

function collectDirectoriesUsedInSchemaInner(schema, directories, seenSchemas) {
  if (seenSchemas.has(schema)) {
    return;
  }
  seenSchemas.add(schema);
  if (schema.kind === 'array') {
    return collectDirectoriesUsedInSchemaInner(schema.element, directories, seenSchemas);
  }
  if (schema.kind === 'child') {
    return;
  }
  if (schema.kind === 'form') {
    if (schema.formKind === 'asset' && schema.directory !== undefined) {
      directories.add(fixPath(schema.directory));
    }
    if (schema.formKind === 'content' && schema.directories !== undefined) {
      for (const directory of schema.directories) {
        directories.add(fixPath(directory));
      }
    }
    return;
  }
  if (schema.kind === 'object') {
    for (const field of Object.values(schema.fields)) {
      collectDirectoriesUsedInSchemaInner(field, directories, seenSchemas);
    }
    return;
  }
  if (schema.kind === 'conditional') {
    for (const innerSchema of Object.values(schema.values)) {
      collectDirectoriesUsedInSchemaInner(innerSchema, directories, seenSchemas);
    }
    return;
  }
  assertNever(schema);
}
function collectDirectoriesUsedInSchema(schema) {
  const directories = new Set();
  collectDirectoriesUsedInSchemaInner(schema, directories, new Set());
  return directories;
}
function getDirectoriesForTreeKey(schema, directory, slug, format) {
  const directories = [fixPath(directory)];
  if (format.dataLocation === 'outer') {
    directories.push(fixPath(directory) + getDataFileExtension(format));
  }
  const toAdd = slug === undefined ? '' : `/${slug}`;
  for (const directory of collectDirectoriesUsedInSchema(schema)) {
    directories.push(directory + toAdd);
  }
  return directories;
}
function getTreeKey(directories, tree) {
  return directories.map(d => {
    var _getTreeNodeAtPath;
    return (_getTreeNodeAtPath = getTreeNodeAtPath(tree, d)) === null || _getTreeNodeAtPath === void 0 ? void 0 : _getTreeNodeAtPath.entry.sha;
  }).join('-');
}

var pkgJson = {
	name: "@keystatic/core",
	version: "0.2.4",
	license: "MIT",
	repository: {
		type: "git",
		url: "https://github.com/Thinkmill/keystatic/",
		directory: "packages/keystatic"
	},
	exports: {
		"./ui": {
			types: "./ui/dist/keystatic-core-ui.cjs.js",
			node: {
				"react-server": {
					module: "./ui/dist/keystatic-core-ui.node.react-server.esm.js",
					"default": "./ui/dist/keystatic-core-ui.node.react-server.cjs.js"
				},
				module: "./ui/dist/keystatic-core-ui.node.esm.js",
				"default": "./ui/dist/keystatic-core-ui.node.cjs.js"
			},
			"react-server": {
				module: "./ui/dist/keystatic-core-ui.react-server.esm.js",
				"default": "./ui/dist/keystatic-core-ui.react-server.cjs.js"
			},
			module: "./ui/dist/keystatic-core-ui.esm.js",
			"default": "./ui/dist/keystatic-core-ui.cjs.js"
		},
		".": {
			types: "./dist/keystatic-core.cjs.js",
			node: {
				"react-server": {
					module: "./dist/keystatic-core.node.react-server.esm.js",
					"default": "./dist/keystatic-core.node.react-server.cjs.js"
				},
				module: "./dist/keystatic-core.node.esm.js",
				"default": "./dist/keystatic-core.node.cjs.js"
			},
			"react-server": {
				module: "./dist/keystatic-core.react-server.esm.js",
				"default": "./dist/keystatic-core.react-server.cjs.js"
			},
			module: "./dist/keystatic-core.esm.js",
			"default": "./dist/keystatic-core.cjs.js"
		},
		"./api/utils": {
			types: "./api/utils/dist/keystatic-core-api-utils.cjs.js",
			node: {
				"react-server": {
					module: "./api/utils/dist/keystatic-core-api-utils.node.react-server.esm.js",
					"default": "./api/utils/dist/keystatic-core-api-utils.node.react-server.cjs.js"
				},
				module: "./api/utils/dist/keystatic-core-api-utils.node.esm.js",
				"default": "./api/utils/dist/keystatic-core-api-utils.node.cjs.js"
			},
			"react-server": {
				module: "./api/utils/dist/keystatic-core-api-utils.react-server.esm.js",
				"default": "./api/utils/dist/keystatic-core-api-utils.react-server.cjs.js"
			},
			module: "./api/utils/dist/keystatic-core-api-utils.esm.js",
			"default": "./api/utils/dist/keystatic-core-api-utils.cjs.js"
		},
		"./renderer": {
			types: "./renderer/dist/keystatic-core-renderer.cjs.js",
			node: {
				"react-server": {
					module: "./renderer/dist/keystatic-core-renderer.node.react-server.esm.js",
					"default": "./renderer/dist/keystatic-core-renderer.node.react-server.cjs.js"
				},
				module: "./renderer/dist/keystatic-core-renderer.node.esm.js",
				"default": "./renderer/dist/keystatic-core-renderer.node.cjs.js"
			},
			"react-server": {
				module: "./renderer/dist/keystatic-core-renderer.react-server.esm.js",
				"default": "./renderer/dist/keystatic-core-renderer.react-server.cjs.js"
			},
			module: "./renderer/dist/keystatic-core-renderer.esm.js",
			"default": "./renderer/dist/keystatic-core-renderer.cjs.js"
		},
		"./api/generic": {
			types: "./api/generic/dist/keystatic-core-api-generic.cjs.js",
			node: {
				"react-server": {
					module: "./api/generic/dist/keystatic-core-api-generic.node.react-server.esm.js",
					"default": "./api/generic/dist/keystatic-core-api-generic.node.react-server.cjs.js"
				},
				module: "./api/generic/dist/keystatic-core-api-generic.node.esm.js",
				"default": "./api/generic/dist/keystatic-core-api-generic.node.cjs.js"
			},
			"react-server": {
				module: "./api/generic/dist/keystatic-core-api-generic.react-server.esm.js",
				"default": "./api/generic/dist/keystatic-core-api-generic.react-server.cjs.js"
			},
			module: "./api/generic/dist/keystatic-core-api-generic.esm.js",
			"default": "./api/generic/dist/keystatic-core-api-generic.cjs.js"
		},
		"./reader": {
			types: "./reader/dist/keystatic-core-reader.cjs.js",
			node: {
				"react-server": {
					module: "./reader/dist/keystatic-core-reader.node.react-server.esm.js",
					"default": "./reader/dist/keystatic-core-reader.node.react-server.cjs.js"
				},
				module: "./reader/dist/keystatic-core-reader.node.esm.js",
				"default": "./reader/dist/keystatic-core-reader.node.cjs.js"
			},
			"react-server": {
				module: "./reader/dist/keystatic-core-reader.react-server.esm.js",
				"default": "./reader/dist/keystatic-core-reader.react-server.cjs.js"
			},
			module: "./reader/dist/keystatic-core-reader.esm.js",
			"default": "./reader/dist/keystatic-core-reader.cjs.js"
		},
		"./reader/github": {
			types: "./reader/github/dist/keystatic-core-reader-github.cjs.js",
			node: {
				"react-server": {
					module: "./reader/github/dist/keystatic-core-reader-github.node.react-server.esm.js",
					"default": "./reader/github/dist/keystatic-core-reader-github.node.react-server.cjs.js"
				},
				module: "./reader/github/dist/keystatic-core-reader-github.node.esm.js",
				"default": "./reader/github/dist/keystatic-core-reader-github.node.cjs.js"
			},
			"react-server": {
				module: "./reader/github/dist/keystatic-core-reader-github.react-server.esm.js",
				"default": "./reader/github/dist/keystatic-core-reader-github.react-server.cjs.js"
			},
			module: "./reader/github/dist/keystatic-core-reader-github.esm.js",
			"default": "./reader/github/dist/keystatic-core-reader-github.cjs.js"
		},
		"./component-blocks": {
			types: "./component-blocks/dist/keystatic-core-component-blocks.cjs.js",
			node: {
				"react-server": {
					module: "./component-blocks/dist/keystatic-core-component-blocks.node.react-server.esm.js",
					"default": "./component-blocks/dist/keystatic-core-component-blocks.node.react-server.cjs.js"
				},
				module: "./component-blocks/dist/keystatic-core-component-blocks.node.esm.js",
				"default": "./component-blocks/dist/keystatic-core-component-blocks.node.cjs.js"
			},
			"react-server": {
				module: "./component-blocks/dist/keystatic-core-component-blocks.react-server.esm.js",
				"default": "./component-blocks/dist/keystatic-core-component-blocks.react-server.cjs.js"
			},
			module: "./component-blocks/dist/keystatic-core-component-blocks.esm.js",
			"default": "./component-blocks/dist/keystatic-core-component-blocks.cjs.js"
		},
		"./form/fields/markdoc": {
			types: "./form/fields/markdoc/dist/keystatic-core-form-fields-markdoc.cjs.js",
			node: {
				"react-server": {
					module: "./form/fields/markdoc/dist/keystatic-core-form-fields-markdoc.node.react-server.esm.js",
					"default": "./form/fields/markdoc/dist/keystatic-core-form-fields-markdoc.node.react-server.cjs.js"
				},
				module: "./form/fields/markdoc/dist/keystatic-core-form-fields-markdoc.node.esm.js",
				"default": "./form/fields/markdoc/dist/keystatic-core-form-fields-markdoc.node.cjs.js"
			},
			"react-server": {
				module: "./form/fields/markdoc/dist/keystatic-core-form-fields-markdoc.react-server.esm.js",
				"default": "./form/fields/markdoc/dist/keystatic-core-form-fields-markdoc.react-server.cjs.js"
			},
			module: "./form/fields/markdoc/dist/keystatic-core-form-fields-markdoc.esm.js",
			"default": "./form/fields/markdoc/dist/keystatic-core-form-fields-markdoc.cjs.js"
		},
		"./package.json": "./package.json"
	},
	main: "dist/keystatic-core.cjs.js",
	module: "dist/keystatic-core.esm.js",
	files: [
		"dist",
		"api",
		"reader",
		"renderer",
		"ui",
		"form",
		"component-blocks"
	],
	scripts: {
		setup: "ts-gql build && tsx scripts/l10n.ts && tsx scripts/build-prism.ts",
		build: "pnpm run setup && next build",
		dev: "next dev",
		start: "next start"
	},
	dependencies: {
		"@babel/runtime": "^7.18.3",
		"@braintree/sanitize-url": "^6.0.2",
		"@emotion/css": "^11.9.0",
		"@emotion/weak-memoize": "^0.3.0",
		"@floating-ui/react": "^0.24.0",
		"@internationalized/string": "^3.1.1",
		"@keystar/ui": "^0.4.4",
		"@markdoc/markdoc": "^0.3.0",
		"@react-aria/focus": "^3.14.3",
		"@react-aria/i18n": "^3.8.0",
		"@react-aria/interactions": "^3.19.1",
		"@react-aria/overlays": "^3.18.1",
		"@react-aria/selection": "^3.17.1",
		"@react-aria/utils": "^3.21.1",
		"@react-aria/visually-hidden": "^3.8.6",
		"@react-stately/collections": "^3.10.2",
		"@react-stately/list": "^3.10.0",
		"@react-stately/overlays": "^3.6.3",
		"@react-stately/utils": "^3.8.0",
		"@react-types/shared": "^3.21.0",
		"@sindresorhus/slugify": "^1.1.2",
		"@ts-gql/tag": "^0.7.0",
		"@types/node": "16.11.13",
		"@types/react": "^18.2.8",
		"@types/react-dom": "^18.0.11",
		"@urql/core": "^4.1.3",
		"@urql/exchange-auth": "^2.1.6",
		"@urql/exchange-graphcache": "^6.3.3",
		"@urql/exchange-persisted": "^4.1.0",
		cookie: "^0.5.0",
		emery: "^1.4.1",
		"escape-string-regexp": "^4.0.0",
		"fast-deep-equal": "^3.1.3",
		graphql: "^16.6.0",
		"idb-keyval": "^6.2.1",
		ignore: "^5.2.4",
		"iron-webcrypto": "^0.10.1",
		"is-hotkey": "^0.2.0",
		"js-base64": "^3.7.5",
		"js-yaml": "^4.1.0",
		"lru-cache": "^7.14.1",
		"match-sorter": "^6.3.1",
		"mdast-util-from-markdown": "^0.8.5",
		"mdast-util-gfm-autolink-literal": "^0.1.3",
		"mdast-util-gfm-strikethrough": "^0.2.3",
		"micromark-extension-gfm-autolink-literal": "0.5.7",
		"micromark-extension-gfm-strikethrough": "0.6.5",
		minimatch: "^7.1.0",
		"prosemirror-commands": "^1.5.1",
		"prosemirror-history": "^1.3.0",
		"prosemirror-keymap": "^1.2.1",
		"prosemirror-model": "^1.19.0",
		"prosemirror-state": "^1.4.2",
		"prosemirror-tables": "^1.3.4",
		"prosemirror-transform": "^1.7.1",
		"prosemirror-view": "^1.30.2",
		"scroll-into-view-if-needed": "^3.0.3",
		slate: "^0.91.4",
		"slate-history": "^0.86.0",
		"slate-react": "^0.91.9",
		urql: "^4.0.0",
		zod: "^3.20.2"
	},
	devDependencies: {
		"@testing-library/user-event": "^14.4.3",
		"@ts-gql/compiler": "^0.16.1",
		"@ts-gql/eslint-plugin": "^0.8.5",
		"@ts-gql/next": "^17.0.0",
		"@types/cookie": "^0.5.1",
		"@types/is-hotkey": "^0.1.7",
		"@types/js-yaml": "^4.0.5",
		"@types/prismjs": "^1.26.0",
		"@types/signal-exit": "^3.0.1",
		eslint: "^8.18.0",
		"fast-glob": "^3.2.12",
		"jest-diff": "^29.0.1",
		outdent: "^0.8.0",
		"pretty-format": "^29.0.1",
		prismjs: "^1.29.0",
		react: "^18.2.0",
		"react-dom": "^18.2.0",
		"react-element-to-jsx-string": "^15.0.0",
		"resize-observer-polyfill": "^1.5.1",
		"signal-exit": "^3.0.7",
		"slate-hyperscript": "^0.77.0",
		tsx: "^3.8.0",
		typescript: "^5.2.2"
	},
	peerDependencies: {
		react: "^18.2.0",
		"react-dom": "^18.2.0"
	},
	preconstruct: {
		entrypoints: [
			"index.ts",
			"api/generic.ts",
			"api/utils.ts",
			"reader/index.ts",
			"reader/github.ts",
			"renderer.tsx",
			"ui.tsx",
			"form/fields/markdoc/index.tsx",
			"component-blocks/index.tsx"
		]
	},
	"ts-gql": {
		schema: "./github.graphql",
		mode: "no-transform",
		addTypename: false,
		scalars: {
			GitObjectID: "string"
		}
	},
	imports: {
		"#react-cache-in-react-server": {
			"react-server": "./src/reader/react-server-cache.ts",
			"default": "./src/reader/noop-cache.ts"
		},
		"#sha1": {
			node: "./src/sha1/node.ts",
			"default": "./src/sha1/webcrypto.ts"
		},
		"#webcrypto": {
			node: "./src/api/webcrypto/node.ts",
			"default": "./src/api/webcrypto/default.ts"
		},
		"#api-handler": {
			node: "./src/api/api-node.ts",
			"default": "./src/api/api-noop.ts"
		},
		"#field-ui/*": {
			"react-server": "./src/form/fields/empty-field-ui.tsx",
			"default": "./src/form/fields/*/ui.tsx"
		},
		"#component-block-primitives": {
			"react-server": "./src/form/fields/document/DocumentEditor/primitives/blank-for-react-server.tsx",
			"default": "./src/form/fields/document/DocumentEditor/primitives/index.tsx"
		},
		"#cloud-image-preview": {
			"react-server": "./src/component-blocks/blank-for-react-server.tsx",
			"default": "./src/component-blocks/cloud-image-preview.tsx"
		}
	}
};

function object(fields, opts) {
  return {
    ...opts,
    kind: 'object',
    fields
  };
}

function pluralize(count, options) {
  const {
    singular,
    plural = singular + 's',
    inclusive = true
  } = options;
  const variant = count === 1 ? singular : plural;
  return inclusive ? `${count} ${variant}` : variant;
}
function getBranchPrefix(config) {
  return config.storage.kind !== 'local' ? config.storage.branchPrefix : undefined;
}
function isGitHubConfig(config) {
  return config.storage.kind === 'github';
}
function isLocalConfig(config) {
  return config.storage.kind === 'local';
}
function isCloudConfig(config) {
  var _config$cloud;
  if (config.storage.kind !== 'cloud') return false;
  if (!((_config$cloud = config.cloud) !== null && _config$cloud !== void 0 && _config$cloud.project) || !config.cloud.project.includes('/')) {
    throw new Error(`Keystatic is set to \`storage: { kind: 'cloud' }\` but \`cloud.project\` isn't set.
config({
  storage: { kind: 'cloud' },
  cloud: { project: 'team/project' },
})`);
  }
  return true;
}
function getSplitCloudProject(config) {
  var _config$cloud2;
  if (!((_config$cloud2 = config.cloud) !== null && _config$cloud2 !== void 0 && _config$cloud2.project)) return undefined;
  const [team, project] = config.cloud.project.split('/');
  return {
    team,
    project
  };
}
function getRepoPath(config) {
  return `${config.mainOwner}/${config.mainRepo}`;
}
function getRepoUrl(config) {
  return `https://github.com/${getRepoPath(config)}`;
}
function getSlugFromState(collectionConfig, state) {
  const value = state[collectionConfig.slugField];
  const field = collectionConfig.schema[collectionConfig.slugField];
  if (field.kind !== 'form' || field.formKind !== 'slug') {
    throw new Error(`slugField is not a slug field`);
  }
  return field.serializeWithSlug(value).slug;
}
function getEntriesInCollectionWithTreeKey(config, collection, rootTree) {
  var _getTreeNodeAtPath$ch, _getTreeNodeAtPath;
  const collectionConfig = config.collections[collection];
  const schema = object(collectionConfig.schema);
  const formatInfo = getCollectionFormat(config, collection);
  const extension = getDataFileExtension(formatInfo);
  const glob = getSlugGlobForCollection(config, collection);
  const collectionPath = getCollectionPath(config, collection);
  const directory = (_getTreeNodeAtPath$ch = (_getTreeNodeAtPath = getTreeNodeAtPath(rootTree, collectionPath)) === null || _getTreeNodeAtPath === void 0 ? void 0 : _getTreeNodeAtPath.children) !== null && _getTreeNodeAtPath$ch !== void 0 ? _getTreeNodeAtPath$ch : new Map();
  const entries = [];
  const directoriesUsedInSchema = [...collectDirectoriesUsedInSchema(schema)];
  const suffix = getCollectionItemSlugSuffix(config, collection);
  const possibleEntries = new Map(directory);
  if (glob === '**') {
    const handleDirectory = (dir, prefix) => {
      for (const [key, entry] of dir) {
        if (entry.children) {
          possibleEntries.set(`${prefix}${key}`, entry);
          handleDirectory(entry.children, `${prefix}${key}/`);
        } else {
          possibleEntries.set(`${prefix}${key}`, entry);
        }
      }
    };
    handleDirectory(directory, '');
  }
  for (const [key, entry] of possibleEntries) {
    if (formatInfo.dataLocation === 'index') {
      var _actualEntry$children;
      const actualEntry = getTreeNodeAtPath(rootTree, getCollectionItemPath(config, collection, key));
      if (!(actualEntry !== null && actualEntry !== void 0 && (_actualEntry$children = actualEntry.children) !== null && _actualEntry$children !== void 0 && _actualEntry$children.has('index' + extension))) continue;
      entries.push({
        key: getTreeKey([actualEntry.entry.path, ...directoriesUsedInSchema.map(x => `${x}/${key}`)], rootTree),
        slug: key
      });
    } else {
      if (suffix) {
        const newEntry = getTreeNodeAtPath(rootTree, getCollectionItemPath(config, collection, key) + extension);
        if (!newEntry || newEntry.children) continue;
        entries.push({
          key: getTreeKey([entry.entry.path, getCollectionItemPath(config, collection, key), ...directoriesUsedInSchema.map(x => `${x}/${key}`)], rootTree),
          slug: key
        });
      }
      if (entry.children || !key.endsWith(extension)) continue;
      const slug = key.slice(0, -extension.length);
      entries.push({
        key: getTreeKey([entry.entry.path, getCollectionItemPath(config, collection, slug), ...directoriesUsedInSchema.map(x => `${x}/${slug}`)], rootTree),
        slug
      });
    }
  }
  return entries;
}
const KEYSTATIC_CLOUD_API_URL = 'https://api.keystatic.cloud';
const KEYSTATIC_CLOUD_HEADERS = {
  'x-keystatic-version': pkgJson.version
};
const textEncoder$1 = new TextEncoder();
async function redirectToCloudAuth(from, config) {
  var _config$cloud3;
  if (!((_config$cloud3 = config.cloud) !== null && _config$cloud3 !== void 0 && _config$cloud3.project)) {
    throw new Error('Not a cloud config');
  }
  const code_verifier = fromUint8Array(crypto.getRandomValues(new Uint8Array(32)), true);
  const code_challenge = fromUint8Array(new Uint8Array(await crypto.subtle.digest('SHA-256', textEncoder$1.encode(code_verifier))), true);
  const state = fromUint8Array(crypto.getRandomValues(new Uint8Array(32)), true);
  localStorage.setItem('keystatic-cloud-state', JSON.stringify({
    state,
    from,
    code_verifier
  }));
  const url = new URL(`${KEYSTATIC_CLOUD_API_URL}/oauth/authorize`);
  url.searchParams.set('state', state);
  url.searchParams.set('client_id', config.cloud.project);
  url.searchParams.set('redirect_uri', `${window.location.origin}/keystatic/cloud/oauth/callback`);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('code_challenge_method', 'S256');
  url.searchParams.set('code_challenge', code_challenge);
  url.searchParams.set('keystatic_version', pkgJson.version);
  window.location.href = url.toString();
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

// Common
// ----------------------------------------------------------------------------
// Interface
// ----------------------------------------------------------------------------
const NAVIGATION_DIVIDER_KEY = '---';

// Storage
// ----------------------------------------------------------------------------
// ============================================================================
// Functions
// ============================================================================
function config(config) {
  return config;
}
function collection(collection) {
  return collection;
}
function singleton(collection) {
  return collection;
}

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
const ForceValidationContext = /*#__PURE__*/React.createContext(false);
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

const tableCellChildren = ['paragraph', 'code', 'heading', 'ordered-list', 'unordered-list', 'divider', 'image'];
const blockquoteChildren = [...tableCellChildren, 'table'];
const paragraphLike = [...blockquoteChildren, 'blockquote'];
const insideOfLayouts = [...paragraphLike, 'component-block'];
function blockContainer(args) {
  return {
    kind: 'blocks',
    allowedChildren: new Set(args.allowedChildren),
    blockToWrapInlinesIn: args.allowedChildren[0],
    invalidPositionHandleMode: args.invalidPositionHandleMode
  };
}
function inlineContainer(args) {
  return {
    kind: 'inlines',
    invalidPositionHandleMode: args.invalidPositionHandleMode
  };
}
const editorSchema = {
  editor: blockContainer({
    allowedChildren: [...insideOfLayouts, 'layout'],
    invalidPositionHandleMode: 'move'
  }),
  layout: blockContainer({
    allowedChildren: ['layout-area'],
    invalidPositionHandleMode: 'move'
  }),
  'layout-area': blockContainer({
    allowedChildren: insideOfLayouts,
    invalidPositionHandleMode: 'unwrap'
  }),
  blockquote: blockContainer({
    allowedChildren: blockquoteChildren,
    invalidPositionHandleMode: 'move'
  }),
  paragraph: inlineContainer({
    invalidPositionHandleMode: 'unwrap'
  }),
  code: inlineContainer({
    invalidPositionHandleMode: 'move'
  }),
  divider: inlineContainer({
    invalidPositionHandleMode: 'move'
  }),
  heading: inlineContainer({
    invalidPositionHandleMode: 'unwrap'
  }),
  'component-block': blockContainer({
    allowedChildren: ['component-block-prop', 'component-inline-prop'],
    invalidPositionHandleMode: 'move'
  }),
  'component-inline-prop': inlineContainer({
    invalidPositionHandleMode: 'unwrap'
  }),
  'component-block-prop': blockContainer({
    allowedChildren: insideOfLayouts,
    invalidPositionHandleMode: 'unwrap'
  }),
  'ordered-list': blockContainer({
    allowedChildren: ['list-item'],
    invalidPositionHandleMode: 'move'
  }),
  'unordered-list': blockContainer({
    allowedChildren: ['list-item'],
    invalidPositionHandleMode: 'move'
  }),
  'list-item': blockContainer({
    allowedChildren: ['list-item-content', 'ordered-list', 'unordered-list'],
    invalidPositionHandleMode: 'unwrap'
  }),
  'list-item-content': inlineContainer({
    invalidPositionHandleMode: 'unwrap'
  }),
  image: inlineContainer({
    invalidPositionHandleMode: 'move'
  }),
  table: blockContainer({
    invalidPositionHandleMode: 'move',
    allowedChildren: ['table-head', 'table-body']
  }),
  'table-body': blockContainer({
    invalidPositionHandleMode: 'move',
    allowedChildren: ['table-row']
  }),
  'table-row': blockContainer({
    invalidPositionHandleMode: 'move',
    allowedChildren: ['table-cell']
  }),
  'table-cell': blockContainer({
    invalidPositionHandleMode: 'move',
    allowedChildren: tableCellChildren
  }),
  'table-head': blockContainer({
    invalidPositionHandleMode: 'move',
    allowedChildren: ['table-row']
  })
};
const inlineContainerTypes = new Set(Object.entries(editorSchema).filter(([, value]) => value.kind === 'inlines').map(([type]) => type));
function isInlineContainer(node) {
  return node.type !== undefined && inlineContainerTypes.has(node.type);
}
const blockTypes = new Set(Object.keys(editorSchema).filter(x => x !== 'editor'));
function isBlock(node) {
  return blockTypes.has(node.type);
}

// to print the editor schema in Graphviz if you want to visualize it
// function printEditorSchema(editorSchema: EditorSchema) {
//   return `digraph G {
//   concentrate=true;
//   ${Object.keys(editorSchema)
//     .map(key => {
//       let val = editorSchema[key];
//       if (val.kind === 'inlines') {
//         return `"${key}" -> inlines`;
//       }
//       if (val.kind === 'blocks') {
//         return `"${key}" -> {${[...val.allowedChildren].map(x => JSON.stringify(x)).join(' ')}}`;
//       }
//     })
//     .join('\n  ')}
// }`;
// }

function getWholeDocumentFeaturesForChildField(editorDocumentFeatures, options) {
  var _options$formatting, _options$formatting2, _options$formatting3, _options$formatting4, _options$formatting5, _options$formatting6, _options$formatting7;
  const inlineMarksFromOptions = (_options$formatting = options.formatting) === null || _options$formatting === void 0 ? void 0 : _options$formatting.inlineMarks;
  const inlineMarks = Object.fromEntries(Object.keys(editorDocumentFeatures.formatting.inlineMarks).map(_mark => {
    const mark = _mark;
    return [mark, inlineMarksFromOptions === 'inherit' || (inlineMarksFromOptions === null || inlineMarksFromOptions === void 0 ? void 0 : inlineMarksFromOptions[mark]) === 'inherit' ? editorDocumentFeatures.formatting.inlineMarks[mark] : false];
  }));
  const headingLevels = (_options$formatting2 = options.formatting) === null || _options$formatting2 === void 0 ? void 0 : _options$formatting2.headingLevels;
  return {
    formatting: {
      inlineMarks,
      softBreaks: ((_options$formatting3 = options.formatting) === null || _options$formatting3 === void 0 ? void 0 : _options$formatting3.softBreaks) === 'inherit' && editorDocumentFeatures.formatting.softBreaks,
      alignment: {
        center: editorDocumentFeatures.formatting.alignment.center && ((_options$formatting4 = options.formatting) === null || _options$formatting4 === void 0 ? void 0 : _options$formatting4.alignment) === 'inherit',
        end: editorDocumentFeatures.formatting.alignment.end && ((_options$formatting5 = options.formatting) === null || _options$formatting5 === void 0 ? void 0 : _options$formatting5.alignment) === 'inherit'
      },
      blockTypes: ((_options$formatting6 = options.formatting) === null || _options$formatting6 === void 0 ? void 0 : _options$formatting6.blockTypes) === 'inherit' ? editorDocumentFeatures.formatting.blockTypes : {
        blockquote: false,
        code: false
      },
      headings: headingLevels === 'inherit' ? editorDocumentFeatures.formatting.headings : {
        levels: headingLevels ? editorDocumentFeatures.formatting.headings.levels.filter(level => headingLevels.includes(level)) : [],
        schema: editorDocumentFeatures.formatting.headings.schema
      },
      listTypes: ((_options$formatting7 = options.formatting) === null || _options$formatting7 === void 0 ? void 0 : _options$formatting7.listTypes) === 'inherit' ? editorDocumentFeatures.formatting.listTypes : {
        ordered: false,
        unordered: false
      }
    },
    dividers: options.dividers === 'inherit' ? editorDocumentFeatures.dividers : false,
    images: options.images === 'inherit' && editorDocumentFeatures.images,
    layouts: [],
    links: options.links === 'inherit' && editorDocumentFeatures.links,
    tables: options.tables === 'inherit' && editorDocumentFeatures.tables
  };
}
function getDocumentFeaturesForChildField(editorDocumentFeatures, options) {
  var _options$formatting8, _options$formatting10, _options$formatting11, _options$formatting12, _options$formatting13, _options$formatting14;
  // an important note for this: normalization based on document features
  // is done based on the document features returned here
  // and the editor document features
  // so the result for any given child prop will be the things that are
  // allowed by both these document features
  // AND the editor document features
  const inlineMarksFromOptions = (_options$formatting8 = options.formatting) === null || _options$formatting8 === void 0 ? void 0 : _options$formatting8.inlineMarks;
  const inlineMarks = inlineMarksFromOptions === 'inherit' ? 'inherit' : Object.fromEntries(Object.keys(editorDocumentFeatures.formatting.inlineMarks).map(mark => {
    return [mark, !!(inlineMarksFromOptions || {})[mark]];
  }));
  if (options.kind === 'inline') {
    var _options$formatting9;
    return {
      kind: 'inline',
      inlineMarks,
      documentFeatures: {
        links: options.links === 'inherit'
      },
      softBreaks: ((_options$formatting9 = options.formatting) === null || _options$formatting9 === void 0 ? void 0 : _options$formatting9.softBreaks) === 'inherit'
    };
  }
  const headingLevels = (_options$formatting10 = options.formatting) === null || _options$formatting10 === void 0 ? void 0 : _options$formatting10.headingLevels;
  return {
    kind: 'block',
    inlineMarks,
    softBreaks: ((_options$formatting11 = options.formatting) === null || _options$formatting11 === void 0 ? void 0 : _options$formatting11.softBreaks) === 'inherit',
    documentFeatures: {
      layouts: [],
      dividers: options.dividers === 'inherit' ? editorDocumentFeatures.dividers : false,
      formatting: {
        alignment: ((_options$formatting12 = options.formatting) === null || _options$formatting12 === void 0 ? void 0 : _options$formatting12.alignment) === 'inherit' ? editorDocumentFeatures.formatting.alignment : {
          center: false,
          end: false
        },
        blockTypes: ((_options$formatting13 = options.formatting) === null || _options$formatting13 === void 0 ? void 0 : _options$formatting13.blockTypes) === 'inherit' ? editorDocumentFeatures.formatting.blockTypes : {
          blockquote: false,
          code: false
        },
        headings: headingLevels === 'inherit' ? editorDocumentFeatures.formatting.headings : {
          levels: headingLevels ? editorDocumentFeatures.formatting.headings.levels.filter(level => headingLevels.includes(level)) : [],
          schema: editorDocumentFeatures.formatting.headings.schema
        },
        listTypes: ((_options$formatting14 = options.formatting) === null || _options$formatting14 === void 0 ? void 0 : _options$formatting14.listTypes) === 'inherit' ? editorDocumentFeatures.formatting.listTypes : {
          ordered: false,
          unordered: false
        }
      },
      links: options.links === 'inherit',
      images: options.images === 'inherit' ? editorDocumentFeatures.images : false,
      tables: options.tables === 'inherit'
    },
    componentBlocks: options.componentBlocks === 'inherit'
  };
}
function getSchemaAtPropPathInner(path, value, schema) {
  // because we're checking the length here
  // the non-null asserts on shift below are fine
  if (path.length === 0) {
    return schema;
  }
  if (schema.kind === 'child' || schema.kind === 'form') {
    return;
  }
  if (schema.kind === 'conditional') {
    const key = path.shift();
    if (key === 'discriminant') {
      return getSchemaAtPropPathInner(path, value.discriminant, schema.discriminant);
    }
    if (key === 'value') {
      const propVal = schema.values[value.discriminant];
      return getSchemaAtPropPathInner(path, value.value, propVal);
    }
    return;
  }
  if (schema.kind === 'object') {
    const key = path.shift();
    return getSchemaAtPropPathInner(path, value[key], schema.fields[key]);
  }
  if (schema.kind === 'array') {
    const index = path.shift();
    return getSchemaAtPropPathInner(path, value[index], schema.element);
  }
  assertNever(schema);
}
function getSchemaAtPropPath(path, value, props) {
  return getSchemaAtPropPathInner([...path], value, {
    kind: 'object',
    fields: props
  });
}
function getAncestorSchemas(rootSchema, path, value) {
  const ancestors = [];
  const currentPath = [...path];
  let currentProp = rootSchema;
  let currentValue = value;
  while (currentPath.length) {
    ancestors.push(currentProp);
    const key = currentPath.shift(); // this code only runs when path.length is truthy so this non-null assertion is fine
    if (currentProp.kind === 'array') {
      currentProp = currentProp.element;
      currentValue = currentValue[key];
    } else if (currentProp.kind === 'conditional') {
      currentProp = currentProp.values[value.discriminant];
      currentValue = currentValue.value;
    } else if (currentProp.kind === 'object') {
      currentValue = currentValue[key];
      currentProp = currentProp.fields[key];
    } else if (currentProp.kind === 'child' || currentProp.kind === 'form') {
      throw new Error(`unexpected prop "${key}"`);
    } else {
      assertNever(currentProp);
    }
  }
  return ancestors;
}
function getPlaceholderTextForPropPath(propPath, fields, formProps) {
  const field = getSchemaAtPropPath(propPath, formProps, fields);
  if ((field === null || field === void 0 ? void 0 : field.kind) === 'child' && (field.options.kind === 'block' && field.options.editIn !== 'modal' || field.options.kind === 'inline')) {
    return field.options.placeholder;
  }
  return '';
}
function cloneDescendent(node) {
  if (Element$1.isElement(node)) {
    return {
      ...node,
      children: node.children.map(cloneDescendent)
    };
  }
  return {
    ...node
  };
}

const allMarks = ['bold', 'italic', 'underline', 'strikethrough', 'code', 'superscript', 'subscript', 'keyboard'];
const isElementActive = (editor, format) => {
  const [match] = Editor.nodes(editor, {
    match: n => n.type === format
  });
  return !!match;
};
function clearFormatting(editor) {
  Transforms.unwrapNodes(editor, {
    match: node => node.type === 'heading' || node.type === 'blockquote' || node.type === 'code'
  });
  Transforms.unsetNodes(editor, allMarks, {
    match: Text$1.isText
  });
}
function moveChildren(editor, parent, to, shouldMoveNode = () => true) {
  const parentPath = Path.isPath(parent) ? parent : parent[1];
  const parentNode = Path.isPath(parent) ? Node.get(editor, parentPath) : parent[0];
  if (!isBlock(parentNode)) return;
  for (let i = parentNode.children.length - 1; i >= 0; i--) {
    if (shouldMoveNode(parentNode.children[i], i)) {
      const childPath = [...parentPath, i];
      Transforms.moveNodes(editor, {
        at: childPath,
        to
      });
    }
  }
}

/**
 * This is equivalent to Editor.after except that it ignores points that have no content
 * like the point in a void text node, an empty text node and the last point in a text node
 */
// TODO: this would probably break if you were trying to get the last point in the editor?
function EditorAfterButIgnoringingPointsWithNoContent(editor, at, {
  distance = 1
} = {}) {
  const anchor = Editor.point(editor, at, {
    edge: 'end'
  });
  const focus = Editor.end(editor, []);
  const range = {
    anchor,
    focus
  };
  let d = 0;
  let target;
  for (const p of Editor.positions(editor, {
    at: range
  })) {
    if (d > distance) {
      break;
    }

    // this is the important change
    const node = Node.get(editor, p.path);
    if (node.text.length === p.offset) {
      continue;
    }
    if (d !== 0) {
      target = p;
    }
    d++;
  }
  return target;
}
function nodeTypeMatcher(...args) {
  if (args.length === 1) {
    const type = args[0];
    return node => node.type === type;
  }
  const set = new Set(args);
  return node => typeof node.type === 'string' && set.has(node.type);
}
function getAncestorComponentChildFieldDocumentFeatures(editor, editorDocumentFeatures, componentBlocks) {
  const ancestorComponentProp = Editor.above(editor, {
    match: nodeTypeMatcher('component-block-prop', 'component-inline-prop')
  });
  if (ancestorComponentProp) {
    const propPath = ancestorComponentProp[0].propPath;
    const ancestorComponent = Editor.parent(editor, ancestorComponentProp[1]);
    if (ancestorComponent[0].type === 'component-block') {
      const component = ancestorComponent[0].component;
      const componentBlock = componentBlocks[component];
      if (componentBlock && propPath) {
        const childField = getSchemaAtPropPath(propPath, ancestorComponent[0].props, componentBlock.schema);
        if ((childField === null || childField === void 0 ? void 0 : childField.kind) === 'child') {
          return getDocumentFeaturesForChildField(editorDocumentFeatures, childField.options);
        }
      }
    }
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

function parseImageData(data) {
  try {
    const parsed = JSON.parse(data);
    if (typeof parsed === 'object' && parsed !== null && 'src' in parsed && typeof parsed.src === 'string') {
      return {
        src: parsed.src,
        alt: 'alt' in parsed && typeof parsed.alt === 'string' ? parsed.alt : '',
        height: 'height' in parsed && typeof parsed.height === 'number' && Number.isInteger(parsed.height) ? parsed.height : undefined,
        width: 'width' in parsed && typeof parsed.width === 'number' && Number.isInteger(parsed.width) ? parsed.width : undefined
      };
    }
  } catch (err) {}
  const pattern = /^\s*!\[(.*)\]\(([a-z0-9_\-/:.]+)\)\s*$/;
  const match = data.match(pattern);
  if (match) {
    return {
      src: match[2],
      alt: match[1]
    };
  }
  return {
    src: data,
    alt: ''
  };
}
function useImageDimensions(src) {
  const [dimensions, setDimensions] = useState({});
  useEffect(() => {
    if (!src || !isValidURL$1(src)) {
      setDimensions({});
      return;
    }
    let shouldSet = true;
    loadImageDimensions(src).then(dimensions => {
      if (shouldSet) setDimensions(dimensions);
    });
    return () => {
      shouldSet = false;
    };
  }, [src]);
  return dimensions;
}
function loadImageDimensions(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height
      });
    };
    img.onerror = () => {
      reject();
    };
    img.src = url;
  });
}
const imageDataSchema = z.object({
  src: z.string(),
  alt: z.string(),
  width: z.number(),
  height: z.number()
});
async function loadImageData(url, config) {
  const auth = getCloudAuth(config);
  if (auth) {
    const res = await fetch(`${KEYSTATIC_CLOUD_API_URL}/v1/image?${new URLSearchParams({
      url
    })}`, {
      headers: {
        Authorization: `Bearer ${auth.accessToken}`,
        ...KEYSTATIC_CLOUD_HEADERS
      }
    });
    if (res.ok) {
      const data = await res.json();
      const parsed = imageDataSchema.safeParse(data);
      if (parsed.success) {
        return parsed.data;
      }
    }
  }
  return loadImageDimensions(url).then(dimensions => ({
    src: url,
    alt: '',
    ...dimensions
  }));
}
function ImageDimensionsInput(props) {
  const dimensions = useImageDimensions(props.src);
  const [constrainProportions, setConstrainProportions] = useState(true);
  const revertLabel = `Revert to original (${dimensions.width} × ${dimensions.height})`;
  const dimensionsMatchOriginal = dimensions.width === props.image.width && dimensions.height === props.image.height;
  return /*#__PURE__*/jsxs(HStack, {
    gap: "regular",
    alignItems: "end",
    children: [/*#__PURE__*/jsx(NumberField, {
      label: "Width",
      width: "scale.1600",
      formatOptions: {
        maximumFractionDigits: 0
      },
      value: props.image.width,
      onChange: width => {
        if (constrainProportions) {
          props.onChange({
            width,
            height: Math.round(width / getAspectRatio(props.image))
          });
        } else {
          props.onChange({
            width
          });
        }
      }
    }), /*#__PURE__*/jsxs(TooltipTrigger, {
      children: [/*#__PURE__*/jsx(ToggleButton, {
        isSelected: constrainProportions,
        "aria-label": "Constrain proportions",
        prominence: "low",
        onPress: () => {
          setConstrainProportions(state => !state);
        },
        children: /*#__PURE__*/jsx(Icon, {
          src: constrainProportions ? link2Icon : link2OffIcon
        })
      }), /*#__PURE__*/jsx(Tooltip, {
        children: "Constrain proportions"
      })]
    }), /*#__PURE__*/jsx(NumberField, {
      label: "Height",
      width: "scale.1600",
      formatOptions: {
        maximumFractionDigits: 0
      },
      value: props.image.height,
      onChange: height => {
        if (constrainProportions) {
          props.onChange({
            height,
            width: Math.round(height * getAspectRatio(props.image))
          });
        } else {
          props.onChange({
            height
          });
        }
      }
    }), /*#__PURE__*/jsxs(TooltipTrigger, {
      children: [/*#__PURE__*/jsx(ActionButton, {
        "aria-label": revertLabel,
        isDisabled: dimensionsMatchOriginal || !dimensions.width || !dimensions.height,
        onPress: () => {
          props.onChange({
            height: dimensions.height,
            width: dimensions.width
          });
        },
        children: /*#__PURE__*/jsx(Icon, {
          src: undo2Icon
        })
      }), /*#__PURE__*/jsx(Tooltip, {
        maxWidth: "100%",
        children: revertLabel
      })]
    })]
  });
}
const emptyImageData = {
  src: '',
  alt: ''
};
function ImageDialog$1(props) {
  const {
    image,
    onCancel,
    onChange,
    onClose
  } = props;
  const [state, setState] = useState(image !== null && image !== void 0 ? image : emptyImageData);
  const [status, setStatus] = useState(image ? 'good' : '');
  const formId = useId();
  const imageLibraryURL = useImageLibraryURL();
  const onPaste = event => {
    event.preventDefault();
    const text = event.clipboardData.getData('text/plain');
    setState(parseImageData(text));
  };
  const config = useConfig();
  const hasSetFields = !!(state.alt || state.width || state.height);
  useEffect(() => {
    if (!state.src) {
      setStatus('');
      return;
    }
    if (!isValidURL$1(state.src)) {
      return;
    }
    if (hasSetFields) {
      setStatus('good');
      return;
    }
    setStatus('loading');
    loadImageData(state.src, config).then(newData => {
      setState(state => ({
        ...state,
        ...newData
      }));
      setStatus('good');
    }).catch(() => {
      setStatus('error');
    });
  }, [config, hasSetFields, state.src]);
  return /*#__PURE__*/jsxs(Dialog, {
    children: [/*#__PURE__*/jsx(Heading, {
      children: "Cloud image"
    }), /*#__PURE__*/jsx(Content, {
      children: /*#__PURE__*/jsxs(VStack, {
        elementType: "form",
        id: formId,
        gap: "xlarge",
        onSubmit: e => {
          e.preventDefault();
          if (status !== 'good') return;
          onChange(state);
          onClose();
        },
        children: [/*#__PURE__*/jsx(TextField, {
          label: "Image URL",
          autoFocus: true,
          onPaste: onPaste,
          onKeyDown: e => {
            if (e.code === 'Backspace' || e.code === 'Delete') {
              setState(emptyImageData);
            } else {
              e.continuePropagation();
            }
          },
          value: state.src,
          description: /*#__PURE__*/jsxs(Text, {
            children: ["Copy an image URL from the", ' ', /*#__PURE__*/jsx(TextLink, {
              prominence: "high",
              href: imageLibraryURL,
              target: "_blank",
              rel: "noreferrer",
              children: "Image Library"
            }), ' ', "and paste it into this field."]
          }),
          endElement: status === 'loading' ? /*#__PURE__*/jsx(Flex, {
            height: "element.regular",
            width: "element.regular",
            alignItems: "center",
            justifyContent: "center",
            children: /*#__PURE__*/jsx(ProgressCircle, {
              size: "small",
              "aria-label": "Checking\u2026",
              isIndeterminate: true
            })
          }) : state.src ? /*#__PURE__*/jsx(ClearButton, {
            onPress: () => setState(emptyImageData),
            preventFocus: true
          }) : null
        }), status === 'good' ? /*#__PURE__*/jsxs(Fragment, {
          children: [/*#__PURE__*/jsx(TextArea, {
            label: "Alt text",
            value: state.alt,
            onChange: alt => setState(state => ({
              ...state,
              alt
            }))
          }), /*#__PURE__*/jsx(ImageDimensionsInput, {
            src: state.src,
            image: state,
            onChange: dimensions => {
              setState(state => ({
                ...state,
                ...dimensions
              }));
            }
          })]
        }) : null]
      })
    }), /*#__PURE__*/jsxs(ButtonGroup, {
      children: [/*#__PURE__*/jsx(Button, {
        onPress: onCancel,
        children: "Cancel"
      }), /*#__PURE__*/jsx(Button, {
        prominence: "high",
        type: "submit",
        form: formId,
        isDisabled: status !== 'good',
        children: image ? 'Done' : 'Insert'
      })]
    })]
  });
}
function Placeholder$1(props) {
  const editor = useSlateStatic();
  const selected = useSelected();
  const state = useOverlayTriggerState({
    defaultOpen: false
  });
  useEffect(() => {
    if (selected) {
      state.open();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);
  const closeAndCleanup = () => {
    state.close();
    focusWithPreviousSelection(editor);
    props.onRemove();
  };
  return /*#__PURE__*/jsxs(NotEditable, {
    children: [/*#__PURE__*/jsxs(Flex, {
      alignItems: "center",
      backgroundColor: "surface",
      borderRadius: "regular",
      gap: "regular",
      height: "element.large",
      paddingX: "large",
      onClick: () => state.open(),
      children: [/*#__PURE__*/jsx(Icon, {
        src: imageIcon
      }), /*#__PURE__*/jsxs(Text, {
        children: ["Cloud image", state.isOpen ? '' : '(click to configure)']
      })]
    }), /*#__PURE__*/jsx(DialogContainer, {
      onDismiss: closeAndCleanup,
      children: state.isOpen && /*#__PURE__*/jsx(ImageDialog$1, {
        onChange: props.onChange,
        onCancel: closeAndCleanup,
        onClose: state.close
      })
    })]
  });
}
function ImagePreview({
  image,
  onChange,
  onRemove
}) {
  const selected = useSelected();
  const maxHeight = 368; // size.scale.4600 — TODO: it'd be nice to get this from some token artefact
  const maxWidth = 734; // roughly the max width that an editor container will allow

  return /*#__PURE__*/jsx(Fragment, {
    children: /*#__PURE__*/jsx(NotEditable, {
      children: /*#__PURE__*/jsxs(VStack, {
        backgroundColor: selected ? 'accent' : 'surface',
        borderRadius: "medium",
        border: selected ? 'color.alias.borderFocused' : 'neutral',
        overflow: "hidden",
        children: [/*#__PURE__*/jsx(Flex, {
          backgroundColor: "canvas",
          justifyContent: "center",
          UNSAFE_style: {
            maxHeight
          },
          children: /*#__PURE__*/jsx("img", {
            alt: image.alt,
            src: imageWithTransforms({
              source: image.src,
              // 2x for retina etc.
              height: maxHeight * 2,
              width: maxWidth * 2
            }),
            style: {
              objectFit: 'contain'
            }
          })
        }), /*#__PURE__*/jsxs(HStack, {
          padding: "large",
          gap: "xlarge",
          borderTop: selected ? 'color.alias.borderFocused' : 'neutral',
          children: [/*#__PURE__*/jsxs(VStack, {
            flex: "1",
            gap: "medium",
            justifyContent: "center",
            children: [image.alt ? /*#__PURE__*/jsx(Text, {
              truncate: 2,
              children: image.alt
            }) : null, /*#__PURE__*/jsxs(Text, {
              color: "neutralTertiary",
              size: "small",
              children: [image.width, " \xD7 ", image.height]
            })]
          }), /*#__PURE__*/jsxs(HStack, {
            gap: "regular",
            children: [/*#__PURE__*/jsxs(DialogTrigger, {
              children: [/*#__PURE__*/jsxs(TooltipTrigger, {
                children: [/*#__PURE__*/jsx(ActionButton, {
                  children: /*#__PURE__*/jsx(Icon, {
                    src: pencilIcon
                  })
                }), /*#__PURE__*/jsx(Tooltip, {
                  children: "Edit Image Options"
                })]
              }), onClose => /*#__PURE__*/jsx(ImageDialog$1, {
                image: image,
                onChange: onChange,
                onCancel: onClose,
                onClose: onClose
              })]
            }), /*#__PURE__*/jsxs(TooltipTrigger, {
              children: [/*#__PURE__*/jsx(ActionButton, {
                onPress: onRemove,
                children: /*#__PURE__*/jsx(Icon, {
                  src: trash2Icon
                })
              }), /*#__PURE__*/jsx(Tooltip, {
                children: "Remove Image"
              })]
            })]
          })]
        })]
      })
    })
  });
}
function CloudImagePreview(props) {
  var _props$fields$width$v, _props$fields$height$;
  if (!props.fields.src.value) {
    return /*#__PURE__*/jsx(Placeholder$1, {
      onChange: props.onChange,
      onRemove: props.onRemove
    });
  }
  return /*#__PURE__*/jsx(ImagePreview, {
    image: {
      src: props.fields.src.value,
      alt: props.fields.alt.value,
      width: (_props$fields$width$v = props.fields.width.value) !== null && _props$fields$width$v !== void 0 ? _props$fields$width$v : undefined,
      height: (_props$fields$height$ = props.fields.height.value) !== null && _props$fields$height$ !== void 0 ? _props$fields$height$ : undefined
    },
    onChange: props.onChange,
    onRemove: props.onRemove
  });
}

// Utils
// -----------------------------------------------------------------------------
function imageWithTransforms(options) {
  let {
    fit = 'scale-down',
    source,
    height,
    width
  } = options;
  if (!/^https?:\/\/[^\.]+\.keystatic\.net/.test(source)) {
    return source;
  }
  return `${source}?` + new URLSearchParams({
    fit,
    height: height.toString(),
    width: width.toString()
  }).toString();
}
function isValidURL$1(str) {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}
function useImageLibraryURL() {
  const config = useConfig();
  const split = getSplitCloudProject(config);
  if (!split) return 'https://keystatic.cloud/';
  return `https://keystatic.cloud/teams/${split.team}/project/${split.project}/images`;
}
function getAspectRatio(state) {
  if (!state.width || !state.height) return 1;
  return state.width / state.height;
}
const cloudImageToolbarIcon = imageIcon;

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
      }), navItems.map(item => renderItemOrGroup(item, isCurrent))]
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
let dividerCount = 0;
function renderItemOrGroup(itemOrGroup, isCurrent) {
  if ('isDivider' in itemOrGroup) {
    return /*#__PURE__*/jsx(Divider, {}, dividerCount++);
  }
  if ('children' in itemOrGroup) {
    return /*#__PURE__*/jsx(NavGroup, {
      title: itemOrGroup.title,
      children: itemOrGroup.children.map(child => renderItemOrGroup(child, isCurrent))
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

class FieldDataError extends Error {
  constructor(message) {
    super(message);
    this.name = 'FieldDataError';
  }
}

function assertRequired(value, validation, label) {
  if (value === null && validation !== null && validation !== void 0 && validation.isRequired) {
    throw new FieldDataError(`${label} is required`);
  }
}
function basicFormFieldWithSimpleReaderParse(config) {
  return {
    kind: 'form',
    Input: config.Input,
    defaultValue: config.defaultValue,
    parse: config.parse,
    serialize: config.serialize,
    validate: config.validate,
    reader: {
      parse(value) {
        return config.validate(config.parse(value));
      }
    }
  };
}

const arrayValuesToElementKeys = new WeakMap();
let counter = 0;
function getKeysForArrayValue(value) {
  if (!arrayValuesToElementKeys.has(value)) {
    arrayValuesToElementKeys.set(value, Array.from({
      length: value.length
    }, getNewArrayElementKey));
  }
  return arrayValuesToElementKeys.get(value);
}
function setKeysForArrayValue(value, elementIds) {
  arrayValuesToElementKeys.set(value, elementIds);
}
function getNewArrayElementKey() {
  return (counter++).toString();
}
const getInitialPropsValue = _getInitialPropsValue;
function _getInitialPropsValue(schema) {
  switch (schema.kind) {
    case 'form':
      return schema.defaultValue();
    case 'child':
      return schema.options.kind === 'block' ? [{
        type: 'paragraph',
        children: [{
          text: ''
        }]
      }] : null;
    case 'conditional':
      {
        const defaultValue = schema.discriminant.defaultValue();
        return {
          discriminant: defaultValue,
          value: getInitialPropsValue(schema.values[defaultValue.toString()])
        };
      }
    case 'object':
      {
        const obj = {};
        for (const key of Object.keys(schema.fields)) {
          obj[key] = getInitialPropsValue(schema.fields[key]);
        }
        return obj;
      }
    case 'array':
      {
        return [];
      }
  }
  assertNever(schema);
}
function getInitialPropsValueFromInitializer(schema, initializer) {
  switch (schema.kind) {
    case 'form':
      return initializer === undefined ? schema.defaultValue() : initializer;
    case 'child':
      return initializer !== null && initializer !== void 0 ? initializer : schema.options.kind === 'block' ? [{
        type: 'paragraph',
        children: [{
          text: ''
        }]
      }] : null;
    case 'conditional':
      {
        const defaultValue = initializer === undefined ? schema.discriminant.defaultValue() : initializer.discriminant;
        return {
          discriminant: defaultValue,
          value: getInitialPropsValueFromInitializer(schema.values[defaultValue.toString()], initializer === undefined ? undefined : initializer.value)
        };
      }
    case 'object':
      {
        const obj = {};
        for (const key of Object.keys(schema.fields)) {
          obj[key] = getInitialPropsValueFromInitializer(schema.fields[key], initializer === undefined ? undefined : initializer[key]);
        }
        return obj;
      }
    case 'array':
      {
        return (initializer !== null && initializer !== void 0 ? initializer : []).map(x => getInitialPropsValueFromInitializer(schema.element, x.value));
      }
  }
  assertNever(schema);
}
function updateValue(schema, currentValue, updater) {
  if (updater === undefined) return currentValue;
  switch (schema.kind) {
    case 'form':
      return updater;
    case 'child':
      return updater;
    case 'conditional':
      {
        return {
          discriminant: updater.discriminant,
          value: updater.discriminant === currentValue.discriminant ? updateValue(schema.values[updater.discriminant.toString()], currentValue.value, updater.value) : getInitialPropsValueFromInitializer(schema.values[updater.discriminant.toString()], updater.value)
        };
      }
    case 'object':
      {
        const obj = {};
        for (const key of Object.keys(schema.fields)) {
          obj[key] = updateValue(schema.fields[key], currentValue[key], updater[key]);
        }
        return obj;
      }
    case 'array':
      {
        const currentArrVal = currentValue;
        const newVal = updater;
        const uniqueKeys = new Set();
        for (const x of newVal) {
          if (x.key !== undefined) {
            if (uniqueKeys.has(x.key)) {
              throw new Error('Array elements must have unique keys');
            }
            uniqueKeys.add(x.key);
          }
        }
        const keys = newVal.map(x => {
          if (x.key !== undefined) return x.key;
          let elementKey = getNewArrayElementKey();
          // just in case someone gives a key that is above our counter
          while (uniqueKeys.has(elementKey)) {
            elementKey = getNewArrayElementKey();
          }
          uniqueKeys.add(elementKey);
          return elementKey;
        });
        const prevKeys = getKeysForArrayValue(currentArrVal);
        const prevValuesByKey = new Map(currentArrVal.map((value, i) => {
          return [prevKeys[i], value];
        }));
        const val = newVal.map((x, i) => {
          const id = keys[i];
          if (prevValuesByKey.has(id)) {
            return updateValue(schema.element, prevValuesByKey.get(id), x.value);
          }
          return getInitialPropsValueFromInitializer(schema.element, x.value);
        });
        setKeysForArrayValue(val, keys);
        return val;
      }
  }
  assertNever(schema);
}

function getValueAtPropPath(value, inputPath) {
  const path = [...inputPath];
  while (path.length) {
    const key = path.shift();
    value = value[key];
  }
  return value;
}
function traverseProps(schema, value, visitor, path = []) {
  if (schema.kind === 'form' || schema.kind === 'child') {
    visitor(schema, value, path);
    return;
  }
  if (schema.kind === 'object') {
    for (const [key, childProp] of Object.entries(schema.fields)) {
      traverseProps(childProp, value[key], visitor, [...path, key]);
    }
    visitor(schema, value, path);
    return;
  }
  if (schema.kind === 'array') {
    for (const [idx, val] of value.entries()) {
      traverseProps(schema.element, val, visitor, path.concat(idx));
    }
    return visitor(schema, value, path);
  }
  if (schema.kind === 'conditional') {
    const discriminant = value.discriminant;
    visitor(schema, discriminant, path.concat('discriminant'));
    traverseProps(schema.values[discriminant.toString()], value.value, visitor, path.concat('value'));
    visitor(schema, value, path);
    return;
  }
  assertNever$1(schema);
}
function transformProps(schema, value, visitors, path = []) {
  if (schema.kind === 'form' || schema.kind === 'child') {
    if (visitors[schema.kind]) {
      return visitors[schema.kind](schema, value, path);
    }
    return value;
  }
  if (schema.kind === 'object') {
    const val = Object.fromEntries(Object.entries(schema.fields).map(([key, val]) => {
      return [key, transformProps(val, value[key], visitors, [...path, key])];
    }));
    if (visitors.object) {
      return visitors[schema.kind](schema, val, path);
    }
    return val;
  }
  if (schema.kind === 'array') {
    const val = value.map((val, idx) => transformProps(schema.element, val, visitors, path.concat(idx)));
    if (visitors.array) {
      return visitors[schema.kind](schema, val, path);
    }
    return val;
  }
  if (schema.kind === 'conditional') {
    const discriminant = transformProps(schema.discriminant, value.discriminant, visitors, path.concat('discriminant'));
    const conditionalVal = transformProps(schema.values[discriminant.toString()], value.value, visitors, path.concat('value'));
    const val = {
      discriminant,
      value: conditionalVal
    };
    if (visitors.conditional) {
      return visitors[schema.kind](schema, val, path);
    }
    return val;
  }
  assertNever$1(schema);
}
function replaceValueAtPropPath(schema, value, newValue, path) {
  if (path.length === 0) {
    return newValue;
  }
  const [key, ...newPath] = path;
  if (schema.kind === 'object') {
    return {
      ...value,
      [key]: replaceValueAtPropPath(schema.fields[key], value[key], newValue, newPath)
    };
  }
  if (schema.kind === 'conditional') {
    const conditionalValue = value;
    // replaceValueAtPropPath should not be used to only update the discriminant of a conditional field
    // if you want to update the discriminant of a conditional field, replace the value of the whole conditional field
    assert$1(key === 'value');
    return {
      discriminant: conditionalValue.discriminant,
      value: replaceValueAtPropPath(schema.values[key], conditionalValue.value, newValue, newPath)
    };
  }
  if (schema.kind === 'array') {
    const prevVal = value;
    const newVal = [...prevVal];
    setKeysForArrayValue(newVal, getKeysForArrayValue(prevVal));
    newVal[key] = replaceValueAtPropPath(schema.element, newVal[key], newValue, newPath);
    return newVal;
  }

  // we should never reach here since form or child fields don't contain other fields
  // so the only thing that can happen to them is to be replaced which happens at the start of this function when path.length === 0
  assert$1(schema.kind !== 'form' && schema.kind !== 'child');
  assertNever$1(schema);
}

// a v important note
// marks in the markdown ast/html are represented quite differently to how they are in slate
// if you had the markdown **something https://keystonejs.com something**
// the bold node is the parent of the link node
// but in slate, marks are only represented on text nodes
const currentlyActiveMarks = new Set();
const currentlyDisabledMarks = new Set();
let currentLink = null;
function addMarkToChildren(mark, cb) {
  const wasPreviouslyActive = currentlyActiveMarks.has(mark);
  currentlyActiveMarks.add(mark);
  try {
    return cb();
  } finally {
    if (!wasPreviouslyActive) {
      currentlyActiveMarks.delete(mark);
    }
  }
}
function setLinkForChildren(href, cb) {
  // we'll only use the outer link
  if (currentLink !== null) {
    return cb();
  }
  currentLink = href;
  try {
    return cb();
  } finally {
    currentLink = null;
  }
}
function addMarksToChildren(marks, cb) {
  const marksToRemove = new Set();
  for (const mark of marks) {
    if (!currentlyActiveMarks.has(mark)) {
      marksToRemove.add(mark);
    }
    currentlyActiveMarks.add(mark);
  }
  try {
    return cb();
  } finally {
    for (const mark of marksToRemove) {
      currentlyActiveMarks.delete(mark);
    }
  }
}
function forceDisableMarkForChildren(mark, cb) {
  const wasPreviouslyDisabled = currentlyDisabledMarks.has(mark);
  currentlyDisabledMarks.add(mark);
  try {
    return cb();
  } finally {
    if (!wasPreviouslyDisabled) {
      currentlyDisabledMarks.delete(mark);
    }
  }
}

/**
 * This type is more strict than `Element & { type: 'link'; }` because `children`
 * is constrained to only contain Text nodes. This can't be assumed generally around the editor
 * (because of potentially future inline components or nested links(which are normalized away but the editor needs to not break if it happens))
 * but where this type is used, we're only going to allow links to contain Text and that's important
 * so that we know a block will never be inside an inline because Slate gets unhappy when that happens
 * (really the link inline should probably be a mark rather than an inline,
 * non-void inlines are probably always bad but that would imply changing the document
 * structure which would be such unnecessary breakage)
 */

function getInlineNodes(text) {
  const node = {
    text
  };
  for (const mark of currentlyActiveMarks) {
    if (!currentlyDisabledMarks.has(mark)) {
      node[mark] = true;
    }
  }
  if (currentLink !== null) {
    return [{
      text: ''
    }, {
      type: 'link',
      href: currentLink,
      children: [node]
    }, {
      text: ''
    }];
  }
  return [node];
}

class VariableChildFields extends Error {
  constructor() {
    super('There are a variable number of child fields');
  }
}
function findSingleChildField(schema) {
  try {
    const result = _findConstantChildFields(schema, [], new Set());
    if (result.length === 1) {
      return result[0];
    }
    return;
  } catch (err) {
    if (err instanceof VariableChildFields) {
      return;
    }
    throw err;
  }
}
function _findConstantChildFields(schema, path, seenSchemas) {
  if (seenSchemas.has(schema)) {
    return [];
  }
  seenSchemas.add(schema);
  switch (schema.kind) {
    case 'form':
      return [];
    case 'child':
      return [{
        relativePath: path,
        options: schema.options,
        kind: 'child'
      }];
    case 'conditional':
      {
        if (couldContainChildField(schema)) {
          throw new VariableChildFields();
        }
        return [];
      }
    case 'array':
      {
        if (schema.asChildTag) {
          const child = _findConstantChildFields(schema.element, [], seenSchemas);
          if (child.length > 1) {
            return [];
          }
          return [{
            kind: 'array',
            asChildTag: schema.asChildTag,
            field: schema,
            relativePath: path,
            child: child[0]
          }];
        }
        if (couldContainChildField(schema)) {
          throw new VariableChildFields();
        }
        return [];
      }
    case 'object':
      {
        const paths = [];
        for (const [key, value] of Object.entries(schema.fields)) {
          paths.push(..._findConstantChildFields(value, path.concat(key), seenSchemas));
        }
        return paths;
      }
  }
}
function couldContainChildField(schema, seen = new Set()) {
  if (seen.has(schema)) {
    return false;
  }
  seen.add(schema);
  switch (schema.kind) {
    case 'form':
      return false;
    case 'child':
      return true;
    case 'conditional':
      return Object.values(schema.values).some(value => couldContainChildField(value, seen));
    case 'object':
      return Object.keys(schema.fields).some(key => couldContainChildField(schema.fields[key], seen));
    case 'array':
      return couldContainChildField(schema.element, seen);
  }
}

function inlineNodeFromMarkdoc(node) {
  if (node.type === 'inline') {
    return inlineChildrenFromMarkdoc(node.children);
  }
  if (node.type === 'link') {
    return setLinkForChildren(node.attributes.href, () => inlineChildrenFromMarkdoc(node.children));
  }
  if (node.type === 'text') {
    return getInlineNodes(node.attributes.content);
  }
  if (node.type === 'strong') {
    return addMarkToChildren('bold', () => inlineChildrenFromMarkdoc(node.children));
  }
  if (node.type === 'code') {
    return addMarkToChildren('code', () => getInlineNodes(node.attributes.content));
  }
  if (node.type === 'em') {
    return addMarkToChildren('italic', () => inlineChildrenFromMarkdoc(node.children));
  }
  if (node.type === 's') {
    return addMarkToChildren('strikethrough', () => inlineChildrenFromMarkdoc(node.children));
  }
  if (node.type === 'tag') {
    if (node.tag === 'u') {
      return addMarkToChildren('underline', () => inlineChildrenFromMarkdoc(node.children));
    }
    if (node.tag === 'kbd') {
      return addMarkToChildren('keyboard', () => inlineChildrenFromMarkdoc(node.children));
    }
    if (node.tag === 'sub') {
      return addMarkToChildren('subscript', () => inlineChildrenFromMarkdoc(node.children));
    }
    if (node.tag === 'sup') {
      return addMarkToChildren('superscript', () => inlineChildrenFromMarkdoc(node.children));
    }
  }
  if (node.type === 'softbreak') {
    return getInlineNodes(' ');
  }
  if (node.type === 'hardbreak') {
    return getInlineNodes('\n');
  }
  if (node.tag === 'component-inline-prop' && Array.isArray(node.attributes.propPath) && node.attributes.propPath.every(x => typeof x === 'string' || typeof x === 'number')) {
    return {
      type: 'component-inline-prop',
      children: inlineFromMarkdoc(node.children),
      propPath: node.attributes.propPath
    };
  }
  throw new Error(`Unknown inline node type: ${node.type}`);
}
function inlineChildrenFromMarkdoc(nodes) {
  return nodes.flatMap(inlineNodeFromMarkdoc);
}
function inlineFromMarkdoc(nodes) {
  const transformedNodes = nodes.flatMap(inlineNodeFromMarkdoc);
  const nextNodes = [];
  let lastNode;
  for (const [idx, node] of transformedNodes.entries()) {
    var _lastNode;
    if (node.type === undefined && node.text === '' && ((_lastNode = lastNode) === null || _lastNode === void 0 ? void 0 : _lastNode.type) === undefined && idx !== transformedNodes.length - 1) {
      continue;
    }
    nextNodes.push(node);
    lastNode = node;
  }
  if (!nextNodes.length) {
    nextNodes.push({
      text: ''
    });
  }
  return nextNodes;
}
function fromMarkdoc(node, componentBlocks) {
  const nodes = node.children.flatMap(x => fromMarkdocNode(x, componentBlocks));
  if (nodes.length === 0) {
    return [{
      type: 'paragraph',
      children: [{
        text: ''
      }]
    }];
  }
  if (nodes[nodes.length - 1].type !== 'paragraph') {
    nodes.push({
      type: 'paragraph',
      children: [{
        text: ''
      }]
    });
  }
  return nodes;
}
function fromMarkdocNode(node, componentBlocks) {
  if (node.type === 'blockquote') {
    return {
      type: 'blockquote',
      children: node.children.flatMap(x => fromMarkdocNode(x, componentBlocks))
    };
  }
  if (node.type === 'fence') {
    const {
      language,
      content,
      ...rest
    } = node.attributes;
    return {
      type: 'code',
      children: [{
        text: content.replace(/\n$/, '')
      }],
      ...(typeof language === 'string' ? {
        language
      } : {}),
      ...rest
    };
  }
  if (node.type === 'heading') {
    return {
      ...node.attributes,
      level: node.attributes.level,
      type: 'heading',
      children: inlineFromMarkdoc(node.children)
    };
  }
  if (node.type === 'list') {
    return {
      type: node.attributes.ordered ? 'ordered-list' : 'unordered-list',
      children: node.children.flatMap(x => fromMarkdocNode(x, componentBlocks))
    };
  }
  if (node.type === 'item') {
    var _node$children$;
    const children = [{
      type: 'list-item-content',
      children: node.children.length ? inlineFromMarkdoc([node.children[0]]) : [{
        text: ''
      }]
    }];
    if (((_node$children$ = node.children[1]) === null || _node$children$ === void 0 ? void 0 : _node$children$.type) === 'list') {
      const list = node.children[1];
      children.push({
        type: list.attributes.ordered ? 'ordered-list' : 'unordered-list',
        children: list.children.flatMap(x => fromMarkdocNode(x, componentBlocks))
      });
    }
    return {
      type: 'list-item',
      children
    };
  }
  if (node.type === 'paragraph') {
    if (node.children.length === 1 && node.children[0].type === 'inline' && node.children[0].children.length === 1 && node.children[0].children[0].type === 'image') {
      var _image$attributes$tit;
      const image = node.children[0].children[0];
      return {
        type: 'image',
        src: decodeURI(image.attributes.src),
        alt: image.attributes.alt,
        title: (_image$attributes$tit = image.attributes.title) !== null && _image$attributes$tit !== void 0 ? _image$attributes$tit : '',
        children: [{
          text: ''
        }]
      };
    }
    const children = inlineFromMarkdoc(node.children);
    if (children.length === 1 && children[0].type === 'component-inline-prop') {
      return children[0];
    }
    return {
      type: 'paragraph',
      children,
      textAlign: node.attributes.textAlign
    };
  }
  if (node.type === 'hr') {
    return {
      type: 'divider',
      children: [{
        text: ''
      }]
    };
  }
  if (node.type === 'table') {
    return {
      type: 'table',
      children: node.children.flatMap(x => fromMarkdocNode(x, componentBlocks))
    };
  }
  if (node.type === 'tbody') {
    return {
      type: 'table-body',
      children: node.children.flatMap(x => fromMarkdocNode(x, componentBlocks))
    };
  }
  if (node.type === 'thead') {
    if (!node.children.length) return [];
    return {
      type: 'table-head',
      children: node.children.flatMap(x => fromMarkdocNode(x, componentBlocks))
    };
  }
  if (node.type === 'tr') {
    return {
      type: 'table-row',
      children: node.children.flatMap(x => fromMarkdocNode(x, componentBlocks))
    };
  }
  if (node.type === 'td') {
    return {
      type: 'table-cell',
      children: node.children.flatMap(x => fromMarkdocNode(x, componentBlocks))
    };
  }
  if (node.type === 'th') {
    return {
      type: 'table-cell',
      header: true,
      children: node.children.flatMap(x => fromMarkdocNode(x, componentBlocks))
    };
  }
  if (node.type === 'tag') {
    if (node.tag === 'table') {
      return fromMarkdocNode(node.children[0], componentBlocks);
    }
    if (node.tag === 'layout') {
      return {
        type: 'layout',
        layout: node.attributes.layout,
        children: node.children.flatMap(x => fromMarkdocNode(x, componentBlocks))
      };
    }
    if (node.tag === 'layout-area') {
      return {
        type: 'layout-area',
        children: node.children.flatMap(x => fromMarkdocNode(x, componentBlocks))
      };
    }
    if (node.tag === 'component-block') {
      return {
        type: 'component-block',
        component: node.attributes.component,
        props: node.attributes.props,
        children: node.children.length === 0 ? [{
          type: 'component-inline-prop',
          children: [{
            text: ''
          }]
        }] : node.children.flatMap(x => fromMarkdocNode(x, componentBlocks))
      };
    }
    if (node.tag === 'component-block-prop' && Array.isArray(node.attributes.propPath) && node.attributes.propPath.every(x => typeof x === 'string' || typeof x === 'number')) {
      return {
        type: 'component-block-prop',
        children: node.children.flatMap(x => fromMarkdocNode(x, componentBlocks)),
        propPath: node.attributes.propPath
      };
    }
    if (node.tag) {
      const componentBlock = componentBlocks[node.tag];
      if (componentBlock) {
        const singleChildField = findSingleChildField({
          kind: 'object',
          fields: componentBlock.schema
        });
        if (singleChildField) {
          const newAttributes = JSON.parse(JSON.stringify(node.attributes));
          const children = [];
          toChildrenAndProps$1(node.children, children, newAttributes, singleChildField, [], componentBlocks);
          return {
            type: 'component-block',
            component: node.tag,
            props: newAttributes,
            children
          };
        }
        return {
          type: 'component-block',
          component: node.tag,
          props: node.attributes,
          children: node.children.length === 0 ? [{
            type: 'component-inline-prop',
            children: [{
              text: ''
            }]
          }] : node.children.flatMap(x => fromMarkdocNode(x, componentBlocks))
        };
      }
    }
    throw new Error(`Unknown tag: ${node.tag}`);
  }
  return inlineNodeFromMarkdoc(node);
}
function toChildrenAndProps$1(fromMarkdoc, resultingChildren, value, singleChildField, parentPropPath, componentBlocks) {
  if (singleChildField.kind === 'child') {
    const children = fromMarkdoc.flatMap(x => fromMarkdocNode(x, componentBlocks));
    resultingChildren.push({
      type: `component-${singleChildField.options.kind}-prop`,
      propPath: [...parentPropPath, ...singleChildField.relativePath],
      children
    });
  }
  if (singleChildField.kind === 'array') {
    const arr = [];
    for (let [idx, child] of fromMarkdoc.entries()) {
      if (child.type === 'paragraph') {
        child = child.children[0].children[0];
      }
      if (child.type !== 'tag') {
        throw new Error(`expected tag ${singleChildField.asChildTag}, found type: ${child.type}`);
      }
      if (child.tag !== singleChildField.asChildTag) {
        throw new Error(`expected tag ${singleChildField.asChildTag}, found tag: ${child.tag}`);
      }
      const attributes = JSON.parse(JSON.stringify(child.attributes));
      if (singleChildField.child) {
        toChildrenAndProps$1(child.children, resultingChildren, attributes, singleChildField.child, [...parentPropPath, ...singleChildField.relativePath, idx], componentBlocks);
      }
      arr.push(attributes);
    }
    const key = singleChildField.relativePath[singleChildField.relativePath.length - 1];
    const parent = getValueAtPropPath(value, singleChildField.relativePath.slice(0, -1));
    parent[key] = arr;
  }
}

function areArraysEqual(a, b) {
  return a.length === b.length && a.every((x, i) => x === b[i]);
}
function normalizeTextBasedOnInlineMarksAndSoftBreaks([node, path], editor, inlineMarks, softBreaks) {
  const marksToRemove = Object.keys(node).filter(x => x !== 'text' && x !== 'insertMenu' && inlineMarks[x] !== true);
  if (marksToRemove.length) {
    Transforms.unsetNodes(editor, marksToRemove, {
      at: path
    });
    return true;
  }
  if (!softBreaks) {
    const hasSoftBreaks = node.text.includes('\n');
    if (hasSoftBreaks) {
      const [parentNode] = Editor.parent(editor, path);
      if (parentNode.type !== 'code') {
        for (const position of Editor.positions(editor, {
          at: path
        })) {
          const character = Node.get(editor, position.path).text[position.offset];
          if (character === '\n') {
            Transforms.delete(editor, {
              at: position
            });
            return true;
          }
        }
      }
    }
  }
  return false;
}
function normalizeInlineBasedOnLinks([node, path], editor, links) {
  if (node.type === 'link' && !links) {
    Transforms.insertText(editor, ` (${node.href})`, {
      at: Editor.end(editor, path)
    });
    Transforms.unwrapNodes(editor, {
      at: path
    });
    return true;
  }
  return false;
}
function normalizeElementBasedOnDocumentFeatures([node, path], editor, {
  formatting,
  dividers,
  layouts,
  links,
  images,
  tables
}) {
  if (node.type === 'heading' && (!formatting.headings.levels.length || !formatting.headings.levels.includes(node.level)) || node.type === 'ordered-list' && !formatting.listTypes.ordered || node.type === 'unordered-list' && !formatting.listTypes.unordered || node.type === 'code' && !formatting.blockTypes.code || node.type === 'blockquote' && !formatting.blockTypes.blockquote || node.type === 'image' && !images || node.type === 'table' && !tables || node.type === 'layout' && (layouts.length === 0 || !layouts.some(layout => areArraysEqual(layout, node.layout)))) {
    Transforms.unwrapNodes(editor, {
      at: path
    });
    return true;
  }
  if ((node.type === 'paragraph' || node.type === 'heading') && (!formatting.alignment.center && node.textAlign === 'center' || !formatting.alignment.end && node.textAlign === 'end' || 'textAlign' in node && node.textAlign !== 'center' && node.textAlign !== 'end')) {
    Transforms.unsetNodes(editor, 'textAlign', {
      at: path
    });
    return true;
  }
  if (node.type === 'divider' && !dividers) {
    Transforms.removeNodes(editor, {
      at: path
    });
    return true;
  }
  return normalizeInlineBasedOnLinks([node, path], editor, links);
}
function withDocumentFeaturesNormalization(documentFeatures, editor) {
  const {
    normalizeNode
  } = editor;
  editor.normalizeNode = ([node, path]) => {
    if (Text$1.isText(node)) {
      normalizeTextBasedOnInlineMarksAndSoftBreaks([node, path], editor, documentFeatures.formatting.inlineMarks, documentFeatures.formatting.softBreaks);
    } else if (Element$1.isElement(node)) {
      normalizeElementBasedOnDocumentFeatures([node, path], editor, documentFeatures);
    }
    normalizeNode([node, path]);
  };
  return editor;
}

function getSrcPrefix(publicPath, slug) {
  return typeof publicPath === 'string' ? `${publicPath.replace(/\/*$/, '')}/${slug === undefined ? '' : slug + '/'}` : '';
}

function deserializeFiles(nodes, componentBlocks, files, otherFiles, mode, documentFeatures, slug) {
  return nodes.map(node => {
    if (node.type === 'component-block') {
      const componentBlock = componentBlocks[node.component];
      if (!componentBlock) return node;
      const schema = object(componentBlock.schema);
      return {
        ...node,
        props: deserializeProps(schema, node.props, files, otherFiles, mode, slug)
      };
    }
    if (node.type === 'image' && typeof node.src === 'string' && mode === 'edit') {
      var _ref;
      const prefix = getSrcPrefixForImageBlock(documentFeatures, slug);
      const filename = node.src.slice(prefix.length);
      const content = (_ref = typeof documentFeatures.images === 'object' && typeof documentFeatures.images.directory === 'string' ? otherFiles.get(fixPath(documentFeatures.images.directory)) : files) === null || _ref === void 0 ? void 0 : _ref.get(filename);
      if (!content) {
        return {
          type: 'paragraph',
          children: [{
            text: `Missing image ${filename}`
          }]
        };
      }
      return {
        type: 'image',
        src: {
          filename,
          content
        },
        alt: node.alt,
        title: node.title,
        children: [{
          text: ''
        }]
      };
    }
    if (typeof node.type === 'string') {
      const children = deserializeFiles(node.children, componentBlocks, files, otherFiles, mode, documentFeatures, slug);
      return {
        ...node,
        children
      };
    }
    return node;
  });
}
function deserializeProps(schema, value, files, otherFiles, mode, slug) {
  return transformProps(schema, value, {
    form: (schema, value) => {
      if (schema.formKind === 'asset') {
        var _otherFiles$get;
        if (mode === 'read') {
          return schema.reader.parse(value);
        }
        const filename = schema.filename(value, {
          slug,
          suggestedFilenamePrefix: undefined
        });
        return schema.parse(value, {
          asset: filename ? schema.directory ? (_otherFiles$get = otherFiles.get(schema.directory)) === null || _otherFiles$get === void 0 ? void 0 : _otherFiles$get.get(filename) : files.get(filename) : undefined,
          slug
        });
      }
      if (schema.formKind === 'content') {
        throw new Error('Not implemented');
      }
      if (mode === 'read') {
        return schema.reader.parse(value);
      }
      return schema.parse(value, undefined);
    }
  });
}
function getSrcPrefixForImageBlock(documentFeatures, slug) {
  return getSrcPrefix(typeof documentFeatures.images === 'object' ? documentFeatures.images.publicPath : undefined, slug);
}

function serializeProps(rootValue, rootSchema,
// note you might have a slug without a slug field when serializing props inside a component block or etc. in the editor
slugField, slug, shouldSuggestFilenamePrefix) {
  const extraFiles = [];
  return {
    value: transformProps(rootSchema, rootValue, {
      form(schema, value, propPath) {
        if (propPath.length === 1 && slugField === propPath[0]) {
          if (schema.formKind !== 'slug') {
            throw new Error('slugField is a not a slug field');
          }
          return schema.serializeWithSlug(value).value;
        }
        if (schema.formKind === 'asset') {
          const {
            asset,
            value: forYaml
          } = schema.serialize(value, {
            suggestedFilenamePrefix: shouldSuggestFilenamePrefix ? getPropPathPortion(propPath, rootSchema, rootValue) : undefined,
            slug
          });
          if (asset) {
            extraFiles.push({
              path: asset.filename,
              contents: asset.content,
              parent: schema.directory
            });
          }
          return forYaml;
        }
        if (schema.formKind === 'content') {
          const {
            other,
            external,
            content,
            value: forYaml
          } = schema.serialize(value, {
            slug
          });
          if (content) {
            extraFiles.push({
              path: getPropPathPortion(propPath, rootSchema, rootValue) + schema.contentExtension,
              contents: content,
              parent: undefined
            });
          }
          for (const [key, contents] of other) {
            extraFiles.push({
              path: getPropPathPortion(propPath, rootSchema, rootValue) + '/' + key,
              contents,
              parent: undefined
            });
          }
          const allowedDirectories = new Set(schema.directories);
          for (const [directory, contents] of external) {
            if (!allowedDirectories.has(directory)) {
              throw new Error(`Invalid directory ${directory} in content field serialization`);
            }
            for (const [filename, fileContents] of contents) {
              extraFiles.push({
                path: filename,
                contents: fileContents,
                parent: directory
              });
            }
          }
          return forYaml;
        }
        return schema.serialize(value).value;
      },
      object(_schema, value) {
        return Object.fromEntries(Object.entries(value).filter(([_, val]) => val !== undefined));
      },
      array(_schema, value) {
        return value.map(val => val === undefined ? null : val);
      },
      child() {
        return undefined;
      }
    }),
    extraFiles
  };
}
function getPropPathPortion(path, schema, value) {
  const end = [];
  for (const portion of path) {
    if (schema.kind === 'array') {
      value = value[portion];
      if (schema.slugField && schema.element.kind === 'object') {
        const slug = getSlugFromState({
          schema: schema.element.fields,
          slugField: schema.slugField
        }, value);
        end.push(slug);
      } else {
        end.push(portion);
      }
      schema = schema.element;
      continue;
    }
    end.push(portion);
    if (schema.kind === 'object') {
      value = value[portion];
      schema = schema.fields[portion];
      continue;
    }
    if (schema.kind === 'conditional') {
      if (portion === 'discriminant') {
        schema = schema.discriminant;
      } else if (portion === 'value') {
        schema = schema.values[value.discriminant];
      }
      value = value[portion];
      continue;
    }
    throw new Error(`unexpected ${schema.kind}`);
  }
  return end.join('/');
}

function toInline(nodes) {
  return new Ast.Node('inline', {}, nodes.flatMap(toMarkdocInline));
}
const markToMarkdoc = {
  bold: {
    type: 'strong'
  },
  code: {
    type: 'code'
  },
  italic: {
    type: 'em'
  },
  underline: {
    type: 'tag',
    tag: 'u'
  },
  keyboard: {
    type: 'tag',
    tag: 'kbd'
  },
  strikethrough: {
    type: 's'
  },
  subscript: {
    type: 'tag',
    tag: 'sub'
  },
  superscript: {
    type: 'tag',
    tag: 'sup'
  }
};
function toMarkdocInline(node) {
  if (node.type === 'link') {
    return new Ast.Node('link', {
      href: node.href
    }, node.children.flatMap(toMarkdocInline));
  }
  if (node.type !== undefined) {
    throw new Error(`unexpected inline node type: ${node.type}`);
  }
  const marks = Object.keys(node).filter(mark => mark !== 'text' && mark !== 'code').sort();
  let markdocNode = node.code ? new Ast.Node('code', {
    content: node.text
  }, []) : new Ast.Node('text', {
    content: node.text
  });
  for (const mark of marks) {
    const config = markToMarkdoc[mark];
    if (config) {
      markdocNode = new Ast.Node(config.type, {}, [markdocNode], config.tag);
    }
  }
  return markdocNode;
}
function toMarkdocDocument(nodes, _config) {
  const extraFiles = [];
  const config = {
    ..._config,
    extraFiles
  };
  const node = new Ast.Node('document', {}, nodes.flatMap(x => toMarkdoc(x, config)));
  return {
    node,
    extraFiles
  };
}
function toChildrenAndProps(childrenAsMarkdoc, resultingChildren, value, singleChildField) {
  if (singleChildField.kind === 'child') {
    const child = childrenAsMarkdoc.find(x => areArraysEqual(x.propPath, singleChildField.relativePath));
    if (child) {
      resultingChildren.push(...child.children);
    }
    return;
  }
  if (singleChildField.kind === 'array') {
    const key = singleChildField.relativePath[singleChildField.relativePath.length - 1];
    const parent = getValueAtPropPath(value, singleChildField.relativePath.slice(0, -1));
    const valueAtPropPath = parent[key];
    delete parent[key];
    const childNodes = new Map();
    for (const child of childrenAsMarkdoc) {
      const innerPropPath = child.propPath.slice(singleChildField.relativePath.length + 1);
      const num = child.propPath[singleChildField.relativePath.length];
      if (childNodes.get(num) === undefined) {
        childNodes.set(num, []);
      }
      childNodes.get(num).push({
        children: child.children,
        propPath: innerPropPath
      });
    }
    resultingChildren.push(...valueAtPropPath.map((x, i) => {
      var _childNodes$get;
      const newChildrenAsMarkdoc = (_childNodes$get = childNodes.get(i)) !== null && _childNodes$get !== void 0 ? _childNodes$get : [];
      const children = [];
      toChildrenAndProps(newChildrenAsMarkdoc, children, x, singleChildField.child);
      return new Ast.Node('tag', x, children, singleChildField.asChildTag);
    }));
  }
}
function toMarkdoc(node, config) {
  if (node.type === 'paragraph') {
    const markdocNode = new Ast.Node('paragraph', node.textAlign ? {
      textAlign: node.textAlign
    } : {}, [toInline(node.children)]);
    if (node.textAlign) {
      markdocNode.annotations.push({
        name: 'textAlign',
        value: node.textAlign,
        type: 'attribute'
      });
    }
    return markdocNode;
  }
  if (node.type === 'image') {
    config.extraFiles.push({
      contents: node.src.content,
      path: node.src.filename,
      parent: typeof config.documentFeatures.images === 'object' && typeof config.documentFeatures.images.directory === 'string' ? fixPath(config.documentFeatures.images.directory) : undefined
    });
    return new Ast.Node('paragraph', {}, [new Ast.Node('inline', {}, [new Ast.Node('image', {
      src: encodeURI(`${getSrcPrefixForImageBlock(config.documentFeatures, config.slug)}${node.src.filename}`),
      alt: node.alt,
      title: node.title
    })])]);
  }
  if (node.type === 'code') {
    const extraAttributes = {};
    const {
      children,
      language,
      type,
      ...rest
    } = node;
    const schema = typeof config.documentFeatures.formatting.blockTypes.code === 'object' ? config.documentFeatures.formatting.blockTypes.code.schema : undefined;
    if (schema && Object.keys(schema.fields).length > 0) {
      const serialized = serializeProps(getInitialPropsValueFromInitializer(schema, rest), schema, undefined, config.slug, false);
      Object.assign(extraAttributes, serialized.value);
      config.extraFiles.push(...serialized.extraFiles);
    }
    let content = children[0].text + '\n';
    const markdocNode = new Ast.Node('fence', {
      content,
      language,
      ...extraAttributes
    }, [new Ast.Node('text', {
      content
    })]);
    for (const [key, value] of Object.entries(extraAttributes)) {
      markdocNode.annotations.push({
        name: key,
        value,
        type: 'attribute'
      });
    }
    return markdocNode;
  }
  const _toMarkdoc = node => toMarkdoc(node, config);
  if (node.type === 'blockquote') {
    return new Ast.Node('blockquote', {}, node.children.map(_toMarkdoc));
  }
  if (node.type === 'divider') {
    return new Ast.Node('hr');
  }
  if (node.type === 'table') {
    const head = node.children.find(x => x.type === 'table-head');
    return new Ast.Node('tag', {}, [new Ast.Node('table', {}, [new Ast.Node('thead', {}, head ? head.children.map(_toMarkdoc) : []), _toMarkdoc(node.children.find(x => x.type === 'table-body'))])], 'table');
  }
  if (node.type === 'table-body') {
    return new Ast.Node('tbody', {}, node.children.map(_toMarkdoc));
  }
  if (node.type === 'table-row') {
    return new Ast.Node('tr', {}, node.children.map(_toMarkdoc));
  }
  if (node.type === 'table-cell') {
    return new Ast.Node(node.header ? 'th' : 'td', {}, node.children.map(_toMarkdoc));
  }
  if (node.type === 'heading') {
    const extraAttributes = {};
    if (node.textAlign) {
      extraAttributes.textAlign = node.textAlign;
    }
    const {
      children,
      level,
      textAlign,
      type,
      ...rest
    } = node;
    const schema = config.documentFeatures.formatting.headings.schema;
    if (Object.keys(schema.fields).length > 0) {
      Object.assign(extraAttributes, serializeProps(getInitialPropsValueFromInitializer(schema, rest), schema, undefined, config.slug, false).value);
    }
    const markdocNode = new Ast.Node('heading', {
      level: node.level,
      ...extraAttributes
    }, [toInline(node.children)]);
    for (const [key, value] of Object.entries(extraAttributes)) {
      markdocNode.annotations.push({
        name: key,
        value,
        type: 'attribute'
      });
    }
    return markdocNode;
  }
  if (node.type === 'ordered-list') {
    return new Ast.Node('list', {
      ordered: true
    }, node.children.map(_toMarkdoc));
  }
  if (node.type === 'unordered-list') {
    return new Ast.Node('list', {
      ordered: false
    }, node.children.map(_toMarkdoc));
  }
  if (node.type === 'layout') {
    return new Ast.Node('tag', {
      layout: node.layout
    }, node.children.map(_toMarkdoc), 'layout');
  }
  if (node.type === 'layout-area') {
    return new Ast.Node('tag', {}, node.children.flatMap(_toMarkdoc), 'layout-area');
  }
  if (node.type === 'component-block') {
    const isVoid = node.children.length === 1 && node.children[0].type === 'component-inline-prop' && node.children[0].propPath === undefined;
    const componentBlock = config.componentBlocks[node.component];
    const childrenAsMarkdoc = [];
    for (const child of node.children) {
      if ((child.type === 'component-block-prop' || child.type === 'component-inline-prop') && child.propPath !== undefined) {
        childrenAsMarkdoc.push({
          type: child.type,
          propPath: child.propPath,
          children: child.type === 'component-block-prop' ? child.children.flatMap(_toMarkdoc) : [toInline(child.children)]
        });
      }
    }
    let attributes = node.props;
    if (componentBlock) {
      const serialized = serializeProps(node.props, {
        kind: 'object',
        fields: componentBlock.schema
      }, undefined, config.slug, false);
      attributes = serialized.value;
      config.extraFiles.push(...serialized.extraFiles);
      const singleChildField = findSingleChildField({
        kind: 'object',
        fields: componentBlock.schema
      });
      if (singleChildField) {
        const children = [];
        toChildrenAndProps(childrenAsMarkdoc, children, attributes, singleChildField);
        return new Ast.Node('tag', attributes, children, node.component);
      }
    }
    const children = isVoid ? [] : childrenAsMarkdoc.map(x => new Ast.Node('tag', {
      propPath: x.propPath
    }, x.children, x.type));
    return new Ast.Node('tag', attributes, children, node.component);
  }
  if (node.type === 'component-block-prop' || node.type === 'component-inline-prop') {
    return new Ast.Node('tag', {
      propPath: node.propPath
    }, node.type === 'component-inline-prop' ? [toInline(node.children)] : node.children.flatMap(_toMarkdoc), node.type);
  }
  if (node.type === 'list-item') {
    const listItemContent = node.children[0];
    if (listItemContent.type !== 'list-item-content') {
      throw new Error('list item content must contain a list-item-content');
    }
    const inline = toInline(listItemContent.children);
    const children = [inline];
    const nestedList = node.children[1];
    if (nestedList) {
      children.push(toMarkdoc(nestedList, config));
    }
    return new Ast.Node('item', {}, children);
  }
  if (node.type === 'list-item-content') {
    throw new Error('list-item-content in unexpected position');
  }
  debugger;
  throw new Error(`unexpected node type: ${node.type}`);
}

function validateText(val, min, max, fieldLabel, slugInfo) {
  if (val.length < min) {
    if (min === 1) {
      return `${fieldLabel} must not be empty`;
    } else {
      return `${fieldLabel} must be at least ${min} characters long`;
    }
  }
  if (val.length > max) {
    return `${fieldLabel} must be no longer than ${max} characters`;
  }
  if (slugInfo) {
    if (val === '') {
      return `${fieldLabel} must not be empty`;
    }
    if (val === '..') {
      return `${fieldLabel} must not be ..`;
    }
    if (val === '.') {
      return `${fieldLabel} must not be .`;
    }
    if (slugInfo.glob === '**') {
      const split = val.split('/');
      if (split.some(s => s === '..')) {
        return `${fieldLabel} must not contain ..`;
      }
      if (split.some(s => s === '.')) {
        return `${fieldLabel} must not be .`;
      }
    }
    if ((slugInfo.glob === '*' ? /[\\/]/ : /[\\]/).test(val)) {
      return `${fieldLabel} must not contain slashes`;
    }
    if (/^\s|\s$/.test(val)) {
      return `${fieldLabel} must not start or end with spaces`;
    }
    if (slugInfo.slugs.has(val)) {
      return `${fieldLabel} must be unique`;
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

function TextFieldInput(props) {
  const TextFieldComponent = props.multiline ? TextArea : TextField;
  const [blurred, setBlurred] = useState(false);
  const slugContext = useContext(SlugFieldContext);
  const path = useContext(PathContext);
  return /*#__PURE__*/jsx(TextFieldComponent, {
    label: props.label,
    description: props.description,
    autoFocus: props.autoFocus,
    value: props.value,
    onChange: props.onChange,
    onBlur: () => setBlurred(true),
    isRequired: props.min > 0,
    errorMessage: props.forceValidation || blurred ? validateText(props.value, props.min, props.max, props.label, path.length === 1 && (slugContext === null || slugContext === void 0 ? void 0 : slugContext.field) === path[0] ? slugContext : undefined) : undefined
  });
}

function parseAsNormalField(value) {
  if (value === undefined) {
    return '';
  }
  if (typeof value !== 'string') {
    throw new FieldDataError('Must be a string');
  }
  return value;
}
const emptySet = new Set();
function text({
  label,
  defaultValue = '',
  validation: {
    length: {
      max = Infinity,
      min = 0
    } = {}
  } = {},
  description,
  multiline = false
}) {
  function validate(value, slugField) {
    const message = validateText(value, min, max, label, slugField);
    if (message !== undefined) {
      throw new FieldDataError(message);
    }
    return value;
  }
  return {
    kind: 'form',
    formKind: 'slug',
    Input(props) {
      return /*#__PURE__*/jsx(TextFieldInput, {
        label: label,
        description: description,
        min: min,
        max: max,
        multiline: multiline,
        ...props
      });
    },
    defaultValue() {
      return typeof defaultValue === 'string' ? defaultValue : defaultValue();
    },
    parse(value, args) {
      if ((args === null || args === void 0 ? void 0 : args.slug) !== undefined) {
        return args.slug;
      }
      return parseAsNormalField(value);
    },
    serialize(value) {
      return {
        value: value === '' ? undefined : value
      };
    },
    serializeWithSlug(value) {
      return {
        slug: value,
        value: undefined
      };
    },
    reader: {
      parse(value) {
        const parsed = parseAsNormalField(value);
        return validate(parsed, undefined);
      },
      parseWithSlug(_value, args) {
        validate(parseAsNormalField(args.slug), {
          glob: args.glob,
          slugs: emptySet
        });
        return null;
      }
    },
    validate(value, args) {
      return validate(value, args === null || args === void 0 ? void 0 : args.slugField);
    }
  };
}

const FIELD_GRID_COLUMNS = 12;
const FieldContext = /*#__PURE__*/createContext({
  span: FIELD_GRID_COLUMNS
});
const useFieldContext = () => useContext(FieldContext);
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
  const id = useId$1();
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

function validateArrayLength(schema, val, path) {
  var _schema$validation, _schema$validation2;
  if (((_schema$validation = schema.validation) === null || _schema$validation === void 0 || (_schema$validation = _schema$validation.length) === null || _schema$validation === void 0 ? void 0 : _schema$validation.min) !== undefined && val.length < schema.validation.length.min) {
    return new PropValidationError(new FieldDataError(`Must have at least ${schema.validation.length.min} element${schema.validation.length.min === 1 ? '' : 's'}`), path, schema);
  }
  if (((_schema$validation2 = schema.validation) === null || _schema$validation2 === void 0 || (_schema$validation2 = _schema$validation2.length) === null || _schema$validation2 === void 0 ? void 0 : _schema$validation2.max) !== undefined && val.length > schema.validation.length.max) {
    return new PropValidationError(new FieldDataError(`Must have at most ${schema.validation.length.max} element${schema.validation.length.max === 1 ? '' : 's'}}`), path, schema);
  }
}

class PropValidationError extends Error {
  constructor(cause, path, schema) {
    super(`field error at ${path.join('.')}`, {
      cause
    });
    this.path = path;
    this.schema = schema;
    this.cause = cause;
  }
}
function toFormFieldStoredValue(val) {
  if (val === null) {
    return undefined;
  }
  return val;
}
const isArray = Array.isArray;
function parseProps(schema, _value, path, pathWithArrayFieldSlugs, parseFormField, /** This should be true for the reader and false elsewhere */
validateArrayFieldLength) {
  let value = toFormFieldStoredValue(_value);
  if (schema.kind === 'form') {
    try {
      return parseFormField(schema, value, path, pathWithArrayFieldSlugs);
    } catch (err) {
      throw new PropValidationError(err, path, schema);
    }
  }
  if (schema.kind === 'child') {
    return null;
  }
  if (schema.kind === 'conditional') {
    if (value === undefined) {
      return getInitialPropsValue(schema);
    }
    try {
      if (typeof value !== 'object' || value === null || isArray(value)) {
        throw new FieldDataError('Must be an object');
      }
      for (const key of Object.keys(value)) {
        if (key !== 'discriminant' && key !== 'value') {
          throw new FieldDataError(`Must only contain keys "discriminant" and "value", not "${key}"`);
        }
      }
    } catch (err) {
      throw new PropValidationError(err, path, schema);
    }
    const parsedDiscriminant = parseProps(schema.discriminant, value.discriminant, path.concat('discriminant'), pathWithArrayFieldSlugs.concat('discriminant'), parseFormField, validateArrayFieldLength);
    return {
      discriminant: parsedDiscriminant,
      value: parseProps(schema.values[parsedDiscriminant], value.value, path.concat('value'), pathWithArrayFieldSlugs.concat('value'), parseFormField, validateArrayFieldLength)
    };
  }
  if (schema.kind === 'object') {
    if (value === undefined) {
      value = {};
    }
    try {
      if (typeof value !== 'object' || value === null || isArray(value)) {
        throw new FieldDataError('Must be an object');
      }
      const allowedKeysSet = new Set(Object.keys(schema.fields));
      for (const key of Object.keys(value)) {
        if (!allowedKeysSet.has(key)) {
          throw new FieldDataError(`Key on object value "${key}" is not allowed`);
        }
      }
    } catch (err) {
      throw new PropValidationError(err, path, schema);
    }
    const val = {};
    const errors = [];
    for (const key of Object.keys(schema.fields)) {
      let individualVal = value[key];
      try {
        const propVal = parseProps(schema.fields[key], individualVal, path.concat(key), pathWithArrayFieldSlugs.concat(key), parseFormField, validateArrayFieldLength);
        val[key] = propVal;
      } catch (err) {
        errors.push(err);
      }
    }
    if (errors.length) {
      throw new AggregateError(errors);
    }
    return val;
  }
  if (schema.kind === 'array') {
    if (value === undefined) {
      return [];
    }
    try {
      if (!isArray(value)) {
        throw new FieldDataError('Must be an array');
      }
    } catch (err) {
      throw new PropValidationError(err, path, schema);
    }
    const errors = [];
    try {
      if (validateArrayFieldLength) {
        const error = validateArrayLength(schema, value, path);
        if (error !== undefined) {
          errors.push(error);
        }
      }
      return value.map((innerVal, i) => {
        try {
          let slug = i.toString();
          if (schema.slugField && typeof innerVal === 'object' && innerVal !== null && !isArray(innerVal)) {
            if (schema.element.kind !== 'object') {
              throw new Error('slugField on array fields requires the an object field element');
            }
            const slugField = schema.element.fields[schema.slugField];
            if (!slugField) {
              throw new Error(`slugField "${schema.slugField}" does not exist on object field`);
            }
            if (slugField.kind !== 'form') {
              throw new Error(`slugField "${schema.slugField}" is not a form field`);
            }
            if (slugField.formKind !== 'slug') {
              throw new Error(`slugField "${schema.slugField}" is not a slug field`);
            }
            let parsedSlugFieldValue;
            try {
              parsedSlugFieldValue = slugField.parse(toFormFieldStoredValue(innerVal[schema.slugField]), undefined);
            } catch (err) {
              throw new AggregateError([err]);
            }
            slug = slugField.serializeWithSlug(parsedSlugFieldValue).slug;
          }
          return parseProps(schema.element, innerVal, path.concat(i), pathWithArrayFieldSlugs.concat(slug), parseFormField, validateArrayFieldLength);
        } catch (err) {
          errors.push(err);
        }
      });
    } finally {
      if (errors.length) {
        throw new AggregateError(errors);
      }
    }
  }
  assertNever(schema);
}

function flattenErrors(error) {
  if (error instanceof AggregateError) {
    return error.errors.flatMap(flattenErrors);
  }
  return [error];
}
function formatFormDataError(error) {
  const flatErrors = flattenErrors(error);
  return flatErrors.map(error => {
    if (error instanceof PropValidationError) {
      const path = error.path.join('.');
      return `${path}: ${error.cause instanceof FieldDataError ? error.cause.message : `Unexpected error: ${error.cause}`}`;
    }
    return `Unexpected error: ${error}`;
  }).join('\n');
}
function toFormattedFormDataError(error) {
  const formatted = formatFormDataError(error);
  return new Error(`Field validation failed:\n` + formatted);
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

function ArrayFieldInput(props) {
  const labelId = useId$1();
  const descriptionId = useId$1();
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
  const formId = useId$1();
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

const isListType = type => type === 'ordered-list' || type === 'unordered-list';
const isListNode = node => isListType(node.type);
function getAncestorList(editor) {
  if (editor.selection) {
    const listItem = Editor.above(editor, {
      match: nodeTypeMatcher('list-item')
    });
    const list = Editor.above(editor, {
      match: isListNode
    });
    if (listItem && list) {
      return {
        isInside: true,
        listItem,
        list
      };
    }
  }
  return {
    isInside: false
  };
}
function withList(editor) {
  const {
    insertBreak,
    normalizeNode,
    deleteBackward
  } = editor;
  editor.deleteBackward = unit => {
    if (editor.selection) {
      const ancestorList = getAncestorList(editor);
      if (ancestorList.isInside && Range.isCollapsed(editor.selection) && Editor.isStart(editor, editor.selection.anchor, ancestorList.list[1])) {
        Transforms.unwrapNodes(editor, {
          match: isListNode,
          split: true
        });
        return;
      }
    }
    deleteBackward(unit);
  };
  editor.insertBreak = () => {
    const [listItem] = Editor.nodes(editor, {
      match: node => node.type === 'list-item',
      mode: 'lowest'
    });
    if (listItem && Node.string(listItem[0]) === '') {
      Transforms.unwrapNodes(editor, {
        match: isListNode,
        split: true
      });
      return;
    }
    insertBreak();
  };
  editor.normalizeNode = entry => {
    const [node, path] = entry;
    if (Element$1.isElement(node) || Editor.isEditor(node)) {
      const isElementBeingNormalizedAList = isListNode(node);
      for (const [childNode, childPath] of Node.children(editor, path)) {
        const index = childPath[childPath.length - 1];
        // merge sibling lists
        if (isListNode(childNode)) {
          var _node$children;
          if (((_node$children = node.children[childPath[childPath.length - 1] + 1]) === null || _node$children === void 0 ? void 0 : _node$children.type) === childNode.type) {
            const siblingNodePath = Path.next(childPath);
            moveChildren(editor, siblingNodePath, [...childPath, childNode.children.length]);
            Transforms.removeNodes(editor, {
              at: siblingNodePath
            });
            return;
          }
          if (isElementBeingNormalizedAList) {
            const previousChild = node.children[index - 1];
            if (Element$1.isElement(previousChild)) {
              Transforms.moveNodes(editor, {
                at: childPath,
                to: [...Path.previous(childPath), previousChild.children.length - 1]
              });
            } else {
              Transforms.unwrapNodes(editor, {
                at: childPath
              });
            }
            return;
          }
        }
        if (node.type === 'list-item' && childNode.type !== 'list-item-content' && index === 0 && isBlock(childNode)) {
          if (path[path.length - 1] !== 0) {
            const previousChild = Node.get(editor, Path.previous(path));
            if (Element$1.isElement(previousChild)) {
              Transforms.moveNodes(editor, {
                at: path,
                to: [...Path.previous(path), previousChild.children.length]
              });
              return;
            }
          }
          Transforms.unwrapNodes(editor, {
            at: childPath
          });
          return;
        }
        if (node.type === 'list-item' && childNode.type === 'list-item-content' && index !== 0) {
          Transforms.splitNodes(editor, {
            at: childPath
          });
          return;
        }
      }
    }
    normalizeNode(entry);
  };
  return editor;
}

const ToolbarStateContext = /*#__PURE__*/React.createContext(null);
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

/* eslint-disable */
globalThis.Prism = {
  manual: true
};

/* **********************************************
     Begin prism-core.js
********************************************** */

/// <reference lib="WebWorker"/>

var _self = globalThis;

/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 *
 * @license MIT <https://opensource.org/licenses/MIT>
 * @author Lea Verou <https://lea.verou.me>
 * @namespace
 * @public
 */
var Prism = function (_self) {
  // Private helper vars
  var lang = /(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i;
  var uniqueId = 0;

  // The grammar object for plaintext
  var plainTextGrammar = {};
  var _ = {
    /**
     * By default, Prism will attempt to highlight all code elements (by calling {@link Prism.highlightAll}) on the
     * current page after the page finished loading. This might be a problem if e.g. you wanted to asynchronously load
     * additional languages or plugins yourself.
     *
     * By setting this value to `true`, Prism will not automatically highlight all code elements on the page.
     *
     * You obviously have to change this value before the automatic highlighting started. To do this, you can add an
     * empty Prism object into the global scope before loading the Prism script like this:
     *
     * ```js
     * window.Prism = window.Prism || {};
     * Prism.manual = true;
     * // add a new <script> to load Prism's script
     * ```
     *
     * @default false
     * @type {boolean}
     * @memberof Prism
     * @public
     */
    manual: _self.Prism && _self.Prism.manual,
    /**
     * By default, if Prism is in a web worker, it assumes that it is in a worker it created itself, so it uses
     * `addEventListener` to communicate with its parent instance. However, if you're using Prism manually in your
     * own worker, you don't want it to do this.
     *
     * By setting this value to `true`, Prism will not add its own listeners to the worker.
     *
     * You obviously have to change this value before Prism executes. To do this, you can add an
     * empty Prism object into the global scope before loading the Prism script like this:
     *
     * ```js
     * window.Prism = window.Prism || {};
     * Prism.disableWorkerMessageHandler = true;
     * // Load Prism's script
     * ```
     *
     * @default false
     * @type {boolean}
     * @memberof Prism
     * @public
     */
    disableWorkerMessageHandler: _self.Prism && _self.Prism.disableWorkerMessageHandler,
    /**
     * A namespace for utility methods.
     *
     * All function in this namespace that are not explicitly marked as _public_ are for __internal use only__ and may
     * change or disappear at any time.
     *
     * @namespace
     * @memberof Prism
     */
    util: {
      encode: function encode(tokens) {
        if (tokens instanceof Token) {
          return new Token(tokens.type, encode(tokens.content), tokens.alias);
        } else if (Array.isArray(tokens)) {
          return tokens.map(encode);
        } else {
          return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
        }
      },
      /**
       * Returns the name of the type of the given value.
       *
       * @param {any} o
       * @returns {string}
       * @example
       * type(null)      === 'Null'
       * type(undefined) === 'Undefined'
       * type(123)       === 'Number'
       * type('foo')     === 'String'
       * type(true)      === 'Boolean'
       * type([1, 2])    === 'Array'
       * type({})        === 'Object'
       * type(String)    === 'Function'
       * type(/abc+/)    === 'RegExp'
       */
      type: function (o) {
        return Object.prototype.toString.call(o).slice(8, -1);
      },
      /**
       * Returns a unique number for the given object. Later calls will still return the same number.
       *
       * @param {Object} obj
       * @returns {number}
       */
      objId: function (obj) {
        if (!obj['__id']) {
          Object.defineProperty(obj, '__id', {
            value: ++uniqueId
          });
        }
        return obj['__id'];
      },
      /**
       * Creates a deep clone of the given object.
       *
       * The main intended use of this function is to clone language definitions.
       *
       * @param {T} o
       * @param {Record<number, any>} [visited]
       * @returns {T}
       * @template T
       */
      clone: function deepClone(o, visited) {
        visited = visited || {};
        var clone;
        var id;
        switch (_.util.type(o)) {
          case 'Object':
            id = _.util.objId(o);
            if (visited[id]) {
              return visited[id];
            }
            clone = /** @type {Record<string, any>} */{};
            visited[id] = clone;
            for (var key in o) {
              if (o.hasOwnProperty(key)) {
                clone[key] = deepClone(o[key], visited);
              }
            }
            return (/** @type {any} */clone
            );
          case 'Array':
            id = _.util.objId(o);
            if (visited[id]) {
              return visited[id];
            }
            clone = [];
            visited[id] = clone;
            /** @type {Array} */ /** @type {any} */o.forEach(function (v, i) {
              clone[i] = deepClone(v, visited);
            });
            return (/** @type {any} */clone
            );
          default:
            return o;
        }
      },
      /**
       * Returns the Prism language of the given element set by a `language-xxxx` or `lang-xxxx` class.
       *
       * If no language is set for the element or the element is `null` or `undefined`, `none` will be returned.
       *
       * @param {Element} element
       * @returns {string}
       */
      getLanguage: function (element) {
        while (element) {
          var m = lang.exec(element.className);
          if (m) {
            return m[1].toLowerCase();
          }
          element = element.parentElement;
        }
        return 'none';
      },
      /**
       * Sets the Prism `language-xxxx` class of the given element.
       *
       * @param {Element} element
       * @param {string} language
       * @returns {void}
       */
      setLanguage: function (element, language) {
        // remove all `language-xxxx` classes
        // (this might leave behind a leading space)
        element.className = element.className.replace(RegExp(lang, 'gi'), '');

        // add the new `language-xxxx` class
        // (using `classList` will automatically clean up spaces for us)
        element.classList.add('language-' + language);
      },
      /**
       * Returns the script element that is currently executing.
       *
       * This does __not__ work for line script element.
       *
       * @returns {HTMLScriptElement | null}
       */
      currentScript: function () {
        if (typeof document === 'undefined') {
          return null;
        }
        if ('currentScript' in document && 1 < 2 /* hack to trip TS' flow analysis */) {
          return (/** @type {any} */document.currentScript
          );
        }

        // IE11 workaround
        // we'll get the src of the current script by parsing IE11's error stack trace
        // this will not work for inline scripts

        try {
          throw new Error();
        } catch (err) {
          // Get file src url from stack. Specifically works with the format of stack traces in IE.
          // A stack will look like this:
          //
          // Error
          //    at _.util.currentScript (http://localhost/components/prism-core.js:119:5)
          //    at Global code (http://localhost/components/prism-core.js:606:1)

          var src = (/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(err.stack) || [])[1];
          if (src) {
            var scripts = document.getElementsByTagName('script');
            for (var i in scripts) {
              if (scripts[i].src == src) {
                return scripts[i];
              }
            }
          }
          return null;
        }
      },
      /**
       * Returns whether a given class is active for `element`.
       *
       * The class can be activated if `element` or one of its ancestors has the given class and it can be deactivated
       * if `element` or one of its ancestors has the negated version of the given class. The _negated version_ of the
       * given class is just the given class with a `no-` prefix.
       *
       * Whether the class is active is determined by the closest ancestor of `element` (where `element` itself is
       * closest ancestor) that has the given class or the negated version of it. If neither `element` nor any of its
       * ancestors have the given class or the negated version of it, then the default activation will be returned.
       *
       * In the paradoxical situation where the closest ancestor contains __both__ the given class and the negated
       * version of it, the class is considered active.
       *
       * @param {Element} element
       * @param {string} className
       * @param {boolean} [defaultActivation=false]
       * @returns {boolean}
       */
      isActive: function (element, className, defaultActivation) {
        var no = 'no-' + className;
        while (element) {
          var classList = element.classList;
          if (classList.contains(className)) {
            return true;
          }
          if (classList.contains(no)) {
            return false;
          }
          element = element.parentElement;
        }
        return !!defaultActivation;
      }
    },
    /**
     * This namespace contains all currently loaded languages and the some helper functions to create and modify languages.
     *
     * @namespace
     * @memberof Prism
     * @public
     */
    languages: {
      /**
       * The grammar for plain, unformatted text.
       */
      plain: plainTextGrammar,
      plaintext: plainTextGrammar,
      text: plainTextGrammar,
      txt: plainTextGrammar,
      /**
       * Creates a deep copy of the language with the given id and appends the given tokens.
       *
       * If a token in `redef` also appears in the copied language, then the existing token in the copied language
       * will be overwritten at its original position.
       *
       * ## Best practices
       *
       * Since the position of overwriting tokens (token in `redef` that overwrite tokens in the copied language)
       * doesn't matter, they can technically be in any order. However, this can be confusing to others that trying to
       * understand the language definition because, normally, the order of tokens matters in Prism grammars.
       *
       * Therefore, it is encouraged to order overwriting tokens according to the positions of the overwritten tokens.
       * Furthermore, all non-overwriting tokens should be placed after the overwriting ones.
       *
       * @param {string} id The id of the language to extend. This has to be a key in `Prism.languages`.
       * @param {Grammar} redef The new tokens to append.
       * @returns {Grammar} The new language created.
       * @public
       * @example
       * Prism.languages['css-with-colors'] = Prism.languages.extend('css', {
       *     // Prism.languages.css already has a 'comment' token, so this token will overwrite CSS' 'comment' token
       *     // at its original position
       *     'comment': { ... },
       *     // CSS doesn't have a 'color' token, so this token will be appended
       *     'color': /\b(?:red|green|blue)\b/
       * });
       */
      extend: function (id, redef) {
        var lang = _.util.clone(_.languages[id]);
        for (var key in redef) {
          lang[key] = redef[key];
        }
        return lang;
      },
      /**
       * Inserts tokens _before_ another token in a language definition or any other grammar.
       *
       * ## Usage
       *
       * This helper method makes it easy to modify existing languages. For example, the CSS language definition
       * not only defines CSS highlighting for CSS documents, but also needs to define highlighting for CSS embedded
       * in HTML through `<style>` elements. To do this, it needs to modify `Prism.languages.markup` and add the
       * appropriate tokens. However, `Prism.languages.markup` is a regular JavaScript object literal, so if you do
       * this:
       *
       * ```js
       * Prism.languages.markup.style = {
       *     // token
       * };
       * ```
       *
       * then the `style` token will be added (and processed) at the end. `insertBefore` allows you to insert tokens
       * before existing tokens. For the CSS example above, you would use it like this:
       *
       * ```js
       * Prism.languages.insertBefore('markup', 'cdata', {
       *     'style': {
       *         // token
       *     }
       * });
       * ```
       *
       * ## Special cases
       *
       * If the grammars of `inside` and `insert` have tokens with the same name, the tokens in `inside`'s grammar
       * will be ignored.
       *
       * This behavior can be used to insert tokens after `before`:
       *
       * ```js
       * Prism.languages.insertBefore('markup', 'comment', {
       *     'comment': Prism.languages.markup.comment,
       *     // tokens after 'comment'
       * });
       * ```
       *
       * ## Limitations
       *
       * The main problem `insertBefore` has to solve is iteration order. Since ES2015, the iteration order for object
       * properties is guaranteed to be the insertion order (except for integer keys) but some browsers behave
       * differently when keys are deleted and re-inserted. So `insertBefore` can't be implemented by temporarily
       * deleting properties which is necessary to insert at arbitrary positions.
       *
       * To solve this problem, `insertBefore` doesn't actually insert the given tokens into the target object.
       * Instead, it will create a new object and replace all references to the target object with the new one. This
       * can be done without temporarily deleting properties, so the iteration order is well-defined.
       *
       * However, only references that can be reached from `Prism.languages` or `insert` will be replaced. I.e. if
       * you hold the target object in a variable, then the value of the variable will not change.
       *
       * ```js
       * var oldMarkup = Prism.languages.markup;
       * var newMarkup = Prism.languages.insertBefore('markup', 'comment', { ... });
       *
       * assert(oldMarkup !== Prism.languages.markup);
       * assert(newMarkup === Prism.languages.markup);
       * ```
       *
       * @param {string} inside The property of `root` (e.g. a language id in `Prism.languages`) that contains the
       * object to be modified.
       * @param {string} before The key to insert before.
       * @param {Grammar} insert An object containing the key-value pairs to be inserted.
       * @param {Object<string, any>} [root] The object containing `inside`, i.e. the object that contains the
       * object to be modified.
       *
       * Defaults to `Prism.languages`.
       * @returns {Grammar} The new grammar object.
       * @public
       */
      insertBefore: function (inside, before, insert, root) {
        root = root || /** @type {any} */_.languages;
        var grammar = root[inside];
        /** @type {Grammar} */
        var ret = {};
        for (var token in grammar) {
          if (grammar.hasOwnProperty(token)) {
            if (token == before) {
              for (var newToken in insert) {
                if (insert.hasOwnProperty(newToken)) {
                  ret[newToken] = insert[newToken];
                }
              }
            }

            // Do not insert token which also occur in insert. See #1525
            if (!insert.hasOwnProperty(token)) {
              ret[token] = grammar[token];
            }
          }
        }
        var old = root[inside];
        root[inside] = ret;

        // Update references in other language definitions
        _.languages.DFS(_.languages, function (key, value) {
          if (value === old && key != inside) {
            this[key] = ret;
          }
        });
        return ret;
      },
      // Traverse a language definition with Depth First Search
      DFS: function DFS(o, callback, type, visited) {
        visited = visited || {};
        var objId = _.util.objId;
        for (var i in o) {
          if (o.hasOwnProperty(i)) {
            callback.call(o, i, o[i], type || i);
            var property = o[i];
            var propertyType = _.util.type(property);
            if (propertyType === 'Object' && !visited[objId(property)]) {
              visited[objId(property)] = true;
              DFS(property, callback, null, visited);
            } else if (propertyType === 'Array' && !visited[objId(property)]) {
              visited[objId(property)] = true;
              DFS(property, callback, i, visited);
            }
          }
        }
      }
    },
    plugins: {},
    /**
     * This is the most high-level function in Prism’s API.
     * It fetches all the elements that have a `.language-xxxx` class and then calls {@link Prism.highlightElement} on
     * each one of them.
     *
     * This is equivalent to `Prism.highlightAllUnder(document, async, callback)`.
     *
     * @param {boolean} [async=false] Same as in {@link Prism.highlightAllUnder}.
     * @param {HighlightCallback} [callback] Same as in {@link Prism.highlightAllUnder}.
     * @memberof Prism
     * @public
     */
    highlightAll: function (async, callback) {
      _.highlightAllUnder(document, async, callback);
    },
    /**
     * Fetches all the descendants of `container` that have a `.language-xxxx` class and then calls
     * {@link Prism.highlightElement} on each one of them.
     *
     * The following hooks will be run:
     * 1. `before-highlightall`
     * 2. `before-all-elements-highlight`
     * 3. All hooks of {@link Prism.highlightElement} for each element.
     *
     * @param {ParentNode} container The root element, whose descendants that have a `.language-xxxx` class will be highlighted.
     * @param {boolean} [async=false] Whether each element is to be highlighted asynchronously using Web Workers.
     * @param {HighlightCallback} [callback] An optional callback to be invoked on each element after its highlighting is done.
     * @memberof Prism
     * @public
     */
    highlightAllUnder: function (container, async, callback) {
      var env = {
        callback: callback,
        container: container,
        selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
      };
      _.hooks.run('before-highlightall', env);
      env.elements = Array.prototype.slice.apply(env.container.querySelectorAll(env.selector));
      _.hooks.run('before-all-elements-highlight', env);
      for (var i = 0, element; element = env.elements[i++];) {
        _.highlightElement(element, async === true, env.callback);
      }
    },
    /**
     * Highlights the code inside a single element.
     *
     * The following hooks will be run:
     * 1. `before-sanity-check`
     * 2. `before-highlight`
     * 3. All hooks of {@link Prism.highlight}. These hooks will be run by an asynchronous worker if `async` is `true`.
     * 4. `before-insert`
     * 5. `after-highlight`
     * 6. `complete`
     *
     * Some the above hooks will be skipped if the element doesn't contain any text or there is no grammar loaded for
     * the element's language.
     *
     * @param {Element} element The element containing the code.
     * It must have a class of `language-xxxx` to be processed, where `xxxx` is a valid language identifier.
     * @param {boolean} [async=false] Whether the element is to be highlighted asynchronously using Web Workers
     * to improve performance and avoid blocking the UI when highlighting very large chunks of code. This option is
     * [disabled by default](https://prismjs.com/faq.html#why-is-asynchronous-highlighting-disabled-by-default).
     *
     * Note: All language definitions required to highlight the code must be included in the main `prism.js` file for
     * asynchronous highlighting to work. You can build your own bundle on the
     * [Download page](https://prismjs.com/download.html).
     * @param {HighlightCallback} [callback] An optional callback to be invoked after the highlighting is done.
     * Mostly useful when `async` is `true`, since in that case, the highlighting is done asynchronously.
     * @memberof Prism
     * @public
     */
    highlightElement: function (element, async, callback) {
      // Find language
      var language = _.util.getLanguage(element);
      var grammar = _.languages[language];

      // Set language on the element, if not present
      _.util.setLanguage(element, language);

      // Set language on the parent, for styling
      var parent = element.parentElement;
      if (parent && parent.nodeName.toLowerCase() === 'pre') {
        _.util.setLanguage(parent, language);
      }
      var code = element.textContent;
      var env = {
        element: element,
        language: language,
        grammar: grammar,
        code: code
      };
      function insertHighlightedCode(highlightedCode) {
        env.highlightedCode = highlightedCode;
        _.hooks.run('before-insert', env);
        env.element.innerHTML = env.highlightedCode;
        _.hooks.run('after-highlight', env);
        _.hooks.run('complete', env);
        callback && callback.call(env.element);
      }
      _.hooks.run('before-sanity-check', env);

      // plugins may change/add the parent/element
      parent = env.element.parentElement;
      if (parent && parent.nodeName.toLowerCase() === 'pre' && !parent.hasAttribute('tabindex')) {
        parent.setAttribute('tabindex', '0');
      }
      if (!env.code) {
        _.hooks.run('complete', env);
        callback && callback.call(env.element);
        return;
      }
      _.hooks.run('before-highlight', env);
      if (!env.grammar) {
        insertHighlightedCode(_.util.encode(env.code));
        return;
      }
      if (async && _self.Worker) {
        var worker = new Worker(_.filename);
        worker.onmessage = function (evt) {
          insertHighlightedCode(evt.data);
        };
        worker.postMessage(JSON.stringify({
          language: env.language,
          code: env.code,
          immediateClose: true
        }));
      } else {
        insertHighlightedCode(_.highlight(env.code, env.grammar, env.language));
      }
    },
    /**
     * Low-level function, only use if you know what you’re doing. It accepts a string of text as input
     * and the language definitions to use, and returns a string with the HTML produced.
     *
     * The following hooks will be run:
     * 1. `before-tokenize`
     * 2. `after-tokenize`
     * 3. `wrap`: On each {@link Token}.
     *
     * @param {string} text A string with the code to be highlighted.
     * @param {Grammar} grammar An object containing the tokens to use.
     *
     * Usually a language definition like `Prism.languages.markup`.
     * @param {string} language The name of the language definition passed to `grammar`.
     * @returns {string} The highlighted HTML.
     * @memberof Prism
     * @public
     * @example
     * Prism.highlight('var foo = true;', Prism.languages.javascript, 'javascript');
     */
    highlight: function (text, grammar, language) {
      var env = {
        code: text,
        grammar: grammar,
        language: language
      };
      _.hooks.run('before-tokenize', env);
      if (!env.grammar) {
        throw new Error('The language "' + env.language + '" has no grammar.');
      }
      env.tokens = _.tokenize(env.code, env.grammar);
      _.hooks.run('after-tokenize', env);
      return Token.stringify(_.util.encode(env.tokens), env.language);
    },
    /**
     * This is the heart of Prism, and the most low-level function you can use. It accepts a string of text as input
     * and the language definitions to use, and returns an array with the tokenized code.
     *
     * When the language definition includes nested tokens, the function is called recursively on each of these tokens.
     *
     * This method could be useful in other contexts as well, as a very crude parser.
     *
     * @param {string} text A string with the code to be highlighted.
     * @param {Grammar} grammar An object containing the tokens to use.
     *
     * Usually a language definition like `Prism.languages.markup`.
     * @returns {TokenStream} An array of strings and tokens, a token stream.
     * @memberof Prism
     * @public
     * @example
     * let code = `var foo = 0;`;
     * let tokens = Prism.tokenize(code, Prism.languages.javascript);
     * tokens.forEach(token => {
     *     if (token instanceof Prism.Token && token.type === 'number') {
     *         console.log(`Found numeric literal: ${token.content}`);
     *     }
     * });
     */
    tokenize: function (text, grammar) {
      var rest = grammar.rest;
      if (rest) {
        for (var token in rest) {
          grammar[token] = rest[token];
        }
        delete grammar.rest;
      }
      var tokenList = new LinkedList();
      addAfter(tokenList, tokenList.head, text);
      matchGrammar(text, tokenList, grammar, tokenList.head, 0);
      return toArray(tokenList);
    },
    /**
     * @namespace
     * @memberof Prism
     * @public
     */
    hooks: {
      all: {},
      /**
       * Adds the given callback to the list of callbacks for the given hook.
       *
       * The callback will be invoked when the hook it is registered for is run.
       * Hooks are usually directly run by a highlight function but you can also run hooks yourself.
       *
       * One callback function can be registered to multiple hooks and the same hook multiple times.
       *
       * @param {string} name The name of the hook.
       * @param {HookCallback} callback The callback function which is given environment variables.
       * @public
       */
      add: function (name, callback) {
        var hooks = _.hooks.all;
        hooks[name] = hooks[name] || [];
        hooks[name].push(callback);
      },
      /**
       * Runs a hook invoking all registered callbacks with the given environment variables.
       *
       * Callbacks will be invoked synchronously and in the order in which they were registered.
       *
       * @param {string} name The name of the hook.
       * @param {Object<string, any>} env The environment variables of the hook passed to all callbacks registered.
       * @public
       */
      run: function (name, env) {
        var callbacks = _.hooks.all[name];
        if (!callbacks || !callbacks.length) {
          return;
        }
        for (var i = 0, callback; callback = callbacks[i++];) {
          callback(env);
        }
      }
    },
    Token: Token
  };
  _self.Prism = _;

  // Typescript note:
  // The following can be used to import the Token type in JSDoc:
  //
  //   @typedef {InstanceType<import("./prism-core")["Token"]>} Token

  /**
   * Creates a new token.
   *
   * @param {string} type See {@link Token#type type}
   * @param {string | TokenStream} content See {@link Token#content content}
   * @param {string|string[]} [alias] The alias(es) of the token.
   * @param {string} [matchedStr=""] A copy of the full string this token was created from.
   * @class
   * @global
   * @public
   */
  function Token(type, content, alias, matchedStr) {
    /**
     * The type of the token.
     *
     * This is usually the key of a pattern in a {@link Grammar}.
     *
     * @type {string}
     * @see GrammarToken
     * @public
     */
    this.type = type;
    /**
     * The strings or tokens contained by this token.
     *
     * This will be a token stream if the pattern matched also defined an `inside` grammar.
     *
     * @type {string | TokenStream}
     * @public
     */
    this.content = content;
    /**
     * The alias(es) of the token.
     *
     * @type {string|string[]}
     * @see GrammarToken
     * @public
     */
    this.alias = alias;
    // Copy of the full string this token was created from
    this.length = (matchedStr || '').length | 0;
  }

  /**
   * A token stream is an array of strings and {@link Token Token} objects.
   *
   * Token streams have to fulfill a few properties that are assumed by most functions (mostly internal ones) that process
   * them.
   *
   * 1. No adjacent strings.
   * 2. No empty strings.
   *
   *    The only exception here is the token stream that only contains the empty string and nothing else.
   *
   * @typedef {Array<string | Token>} TokenStream
   * @global
   * @public
   */

  /**
   * Converts the given token or token stream to an HTML representation.
   *
   * The following hooks will be run:
   * 1. `wrap`: On each {@link Token}.
   *
   * @param {string | Token | TokenStream} o The token or token stream to be converted.
   * @param {string} language The name of current language.
   * @returns {string} The HTML representation of the token or token stream.
   * @memberof Token
   * @static
   */
  Token.stringify = function stringify(o, language) {
    if (typeof o == 'string') {
      return o;
    }
    if (Array.isArray(o)) {
      var s = '';
      o.forEach(function (e) {
        s += stringify(e, language);
      });
      return s;
    }
    var env = {
      type: o.type,
      content: stringify(o.content, language),
      tag: 'span',
      classes: ['token', o.type],
      attributes: {},
      language: language
    };
    var aliases = o.alias;
    if (aliases) {
      if (Array.isArray(aliases)) {
        Array.prototype.push.apply(env.classes, aliases);
      } else {
        env.classes.push(aliases);
      }
    }
    _.hooks.run('wrap', env);
    var attributes = '';
    for (var name in env.attributes) {
      attributes += ' ' + name + '="' + (env.attributes[name] || '').replace(/"/g, '&quot;') + '"';
    }
    return '<' + env.tag + ' class="' + env.classes.join(' ') + '"' + attributes + '>' + env.content + '</' + env.tag + '>';
  };

  /**
   * @param {RegExp} pattern
   * @param {number} pos
   * @param {string} text
   * @param {boolean} lookbehind
   * @returns {RegExpExecArray | null}
   */
  function matchPattern(pattern, pos, text, lookbehind) {
    pattern.lastIndex = pos;
    var match = pattern.exec(text);
    if (match && lookbehind && match[1]) {
      // change the match to remove the text matched by the Prism lookbehind group
      var lookbehindLength = match[1].length;
      match.index += lookbehindLength;
      match[0] = match[0].slice(lookbehindLength);
    }
    return match;
  }

  /**
   * @param {string} text
   * @param {LinkedList<string | Token>} tokenList
   * @param {any} grammar
   * @param {LinkedListNode<string | Token>} startNode
   * @param {number} startPos
   * @param {RematchOptions} [rematch]
   * @returns {void}
   * @private
   *
   * @typedef RematchOptions
   * @property {string} cause
   * @property {number} reach
   */
  function matchGrammar(text, tokenList, grammar, startNode, startPos, rematch) {
    for (var token in grammar) {
      if (!grammar.hasOwnProperty(token) || !grammar[token]) {
        continue;
      }
      var patterns = grammar[token];
      patterns = Array.isArray(patterns) ? patterns : [patterns];
      for (var j = 0; j < patterns.length; ++j) {
        if (rematch && rematch.cause == token + ',' + j) {
          return;
        }
        var patternObj = patterns[j];
        var inside = patternObj.inside;
        var lookbehind = !!patternObj.lookbehind;
        var greedy = !!patternObj.greedy;
        var alias = patternObj.alias;
        if (greedy && !patternObj.pattern.global) {
          // Without the global flag, lastIndex won't work
          var flags = patternObj.pattern.toString().match(/[imsuy]*$/)[0];
          patternObj.pattern = RegExp(patternObj.pattern.source, flags + 'g');
        }

        /** @type {RegExp} */
        var pattern = patternObj.pattern || patternObj;
        for (
        // iterate the token list and keep track of the current token/string position
        var currentNode = startNode.next, pos = startPos; currentNode !== tokenList.tail; pos += currentNode.value.length, currentNode = currentNode.next) {
          if (rematch && pos >= rematch.reach) {
            break;
          }
          var str = currentNode.value;
          if (tokenList.length > text.length) {
            // Something went terribly wrong, ABORT, ABORT!
            return;
          }
          if (str instanceof Token) {
            continue;
          }
          var removeCount = 1; // this is the to parameter of removeBetween
          var match;
          if (greedy) {
            match = matchPattern(pattern, pos, text, lookbehind);
            if (!match || match.index >= text.length) {
              break;
            }
            var from = match.index;
            var to = match.index + match[0].length;
            var p = pos;

            // find the node that contains the match
            p += currentNode.value.length;
            while (from >= p) {
              currentNode = currentNode.next;
              p += currentNode.value.length;
            }
            // adjust pos (and p)
            p -= currentNode.value.length;
            pos = p;

            // the current node is a Token, then the match starts inside another Token, which is invalid
            if (currentNode.value instanceof Token) {
              continue;
            }

            // find the last node which is affected by this match
            for (var k = currentNode; k !== tokenList.tail && (p < to || typeof k.value === 'string'); k = k.next) {
              removeCount++;
              p += k.value.length;
            }
            removeCount--;

            // replace with the new match
            str = text.slice(pos, p);
            match.index -= pos;
          } else {
            match = matchPattern(pattern, 0, str, lookbehind);
            if (!match) {
              continue;
            }
          }

          // eslint-disable-next-line no-redeclare
          var from = match.index;
          var matchStr = match[0];
          var before = str.slice(0, from);
          var after = str.slice(from + matchStr.length);
          var reach = pos + str.length;
          if (rematch && reach > rematch.reach) {
            rematch.reach = reach;
          }
          var removeFrom = currentNode.prev;
          if (before) {
            removeFrom = addAfter(tokenList, removeFrom, before);
            pos += before.length;
          }
          removeRange(tokenList, removeFrom, removeCount);
          var wrapped = new Token(token, inside ? _.tokenize(matchStr, inside) : matchStr, alias, matchStr);
          currentNode = addAfter(tokenList, removeFrom, wrapped);
          if (after) {
            addAfter(tokenList, currentNode, after);
          }
          if (removeCount > 1) {
            // at least one Token object was removed, so we have to do some rematching
            // this can only happen if the current pattern is greedy

            /** @type {RematchOptions} */
            var nestedRematch = {
              cause: token + ',' + j,
              reach: reach
            };
            matchGrammar(text, tokenList, grammar, currentNode.prev, pos, nestedRematch);

            // the reach might have been extended because of the rematching
            if (rematch && nestedRematch.reach > rematch.reach) {
              rematch.reach = nestedRematch.reach;
            }
          }
        }
      }
    }
  }

  /**
   * @typedef LinkedListNode
   * @property {T} value
   * @property {LinkedListNode<T> | null} prev The previous node.
   * @property {LinkedListNode<T> | null} next The next node.
   * @template T
   * @private
   */

  /**
   * @template T
   * @private
   */
  function LinkedList() {
    /** @type {LinkedListNode<T>} */
    var head = {
      value: null,
      prev: null,
      next: null
    };
    /** @type {LinkedListNode<T>} */
    var tail = {
      value: null,
      prev: head,
      next: null
    };
    head.next = tail;

    /** @type {LinkedListNode<T>} */
    this.head = head;
    /** @type {LinkedListNode<T>} */
    this.tail = tail;
    this.length = 0;
  }

  /**
   * Adds a new node with the given value to the list.
   *
   * @param {LinkedList<T>} list
   * @param {LinkedListNode<T>} node
   * @param {T} value
   * @returns {LinkedListNode<T>} The added node.
   * @template T
   */
  function addAfter(list, node, value) {
    // assumes that node != list.tail && values.length >= 0
    var next = node.next;
    var newNode = {
      value: value,
      prev: node,
      next: next
    };
    node.next = newNode;
    next.prev = newNode;
    list.length++;
    return newNode;
  }
  /**
   * Removes `count` nodes after the given node. The given node will not be removed.
   *
   * @param {LinkedList<T>} list
   * @param {LinkedListNode<T>} node
   * @param {number} count
   * @template T
   */
  function removeRange(list, node, count) {
    var next = node.next;
    for (var i = 0; i < count && next !== list.tail; i++) {
      next = next.next;
    }
    node.next = next;
    next.prev = node;
    list.length -= i;
  }
  /**
   * @param {LinkedList<T>} list
   * @returns {T[]}
   * @template T
   */
  function toArray(list) {
    var array = [];
    var node = list.head.next;
    while (node !== list.tail) {
      array.push(node.value);
      node = node.next;
    }
    return array;
  }
  if (!_self.document) {
    if (!_self.addEventListener) {
      // in Node.js
      return _;
    }
    if (!_.disableWorkerMessageHandler) {
      // In worker
      _self.addEventListener('message', function (evt) {
        var message = JSON.parse(evt.data);
        var lang = message.language;
        var code = message.code;
        var immediateClose = message.immediateClose;
        _self.postMessage(_.highlight(code, _.languages[lang], lang));
        if (immediateClose) {
          _self.close();
        }
      }, false);
    }
    return _;
  }

  // Get current script and highlight
  var script = _.util.currentScript();
  if (script) {
    _.filename = script.src;
    if (script.hasAttribute('data-manual')) {
      _.manual = true;
    }
  }
  function highlightAutomaticallyCallback() {
    if (!_.manual) {
      _.highlightAll();
    }
  }
  if (!_.manual) {
    // If the document state is "loading", then we'll use DOMContentLoaded.
    // If the document state is "interactive" and the prism.js script is deferred, then we'll also use the
    // DOMContentLoaded event because there might be some plugins or languages which have also been deferred and they
    // might take longer one animation frame to execute which can create a race condition where only some plugins have
    // been loaded when Prism.highlightAll() is executed, depending on how fast resources are loaded.
    // See https://github.com/PrismJS/prism/issues/2102
    var readyState = document.readyState;
    if (readyState === 'loading' || readyState === 'interactive' && script && script.defer) {
      document.addEventListener('DOMContentLoaded', highlightAutomaticallyCallback);
    } else {
      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(highlightAutomaticallyCallback);
      } else {
        window.setTimeout(highlightAutomaticallyCallback, 16);
      }
    }
  }
  return _;
}(_self);

// some additional documentation/types

/**
 * The expansion of a simple `RegExp` literal to support additional properties.
 *
 * @typedef GrammarToken
 * @property {RegExp} pattern The regular expression of the token.
 * @property {boolean} [lookbehind=false] If `true`, then the first capturing group of `pattern` will (effectively)
 * behave as a lookbehind group meaning that the captured text will not be part of the matched text of the new token.
 * @property {boolean} [greedy=false] Whether the token is greedy.
 * @property {string|string[]} [alias] An optional alias or list of aliases.
 * @property {Grammar} [inside] The nested grammar of this token.
 *
 * The `inside` grammar will be used to tokenize the text value of each token of this kind.
 *
 * This can be used to make nested and even recursive language definitions.
 *
 * Note: This can cause infinite recursion. Be careful when you embed different languages or even the same language into
 * each another.
 * @global
 * @public
 */

/**
 * @typedef Grammar
 * @type {Object<string, RegExp | GrammarToken | Array<RegExp | GrammarToken>>}
 * @property {Grammar} [rest] An optional grammar object that will be appended to this grammar.
 * @global
 * @public
 */

/**
 * A function which will invoked after an element was successfully highlighted.
 *
 * @callback HighlightCallback
 * @param {Element} element The element successfully highlighted.
 * @returns {void}
 * @global
 * @public
 */

/**
 * @callback HookCallback
 * @param {Object<string, any>} env The environment variables of the hook.
 * @returns {void}
 * @global
 * @public
 */

/* **********************************************
     Begin prism-markup.js
********************************************** */

Prism.languages.markup = {
  'comment': {
    pattern: /<!--(?:(?!<!--)[\s\S])*?-->/,
    greedy: true
  },
  'prolog': {
    pattern: /<\?[\s\S]+?\?>/,
    greedy: true
  },
  'doctype': {
    // https://www.w3.org/TR/xml/#NT-doctypedecl
    pattern: /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
    greedy: true,
    inside: {
      'internal-subset': {
        pattern: /(^[^\[]*\[)[\s\S]+(?=\]>$)/,
        lookbehind: true,
        greedy: true,
        inside: null // see below
      },

      'string': {
        pattern: /"[^"]*"|'[^']*'/,
        greedy: true
      },
      'punctuation': /^<!|>$|[[\]]/,
      'doctype-tag': /^DOCTYPE/i,
      'name': /[^\s<>'"]+/
    }
  },
  'cdata': {
    pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
    greedy: true
  },
  'tag': {
    pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
    greedy: true,
    inside: {
      'tag': {
        pattern: /^<\/?[^\s>\/]+/,
        inside: {
          'punctuation': /^<\/?/,
          'namespace': /^[^\s>\/:]+:/
        }
      },
      'special-attr': [],
      'attr-value': {
        pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
        inside: {
          'punctuation': [{
            pattern: /^=/,
            alias: 'attr-equals'
          }, {
            pattern: /^(\s*)["']|["']$/,
            lookbehind: true
          }]
        }
      },
      'punctuation': /\/?>/,
      'attr-name': {
        pattern: /[^\s>\/]+/,
        inside: {
          'namespace': /^[^\s>\/:]+:/
        }
      }
    }
  },
  'entity': [{
    pattern: /&[\da-z]{1,8};/i,
    alias: 'named-entity'
  }, /&#x?[\da-f]{1,8};/i]
};
Prism.languages.markup['tag'].inside['attr-value'].inside['entity'] = Prism.languages.markup['entity'];
Prism.languages.markup['doctype'].inside['internal-subset'].inside = Prism.languages.markup;

// Plugin to make entity title show the real entity, idea by Roman Komarov
Prism.hooks.add('wrap', function (env) {
  if (env.type === 'entity') {
    env.attributes['title'] = env.content.replace(/&amp;/, '&');
  }
});
Object.defineProperty(Prism.languages.markup.tag, 'addInlined', {
  /**
   * Adds an inlined language to markup.
   *
   * An example of an inlined language is CSS with `<style>` tags.
   *
   * @param {string} tagName The name of the tag that contains the inlined language. This name will be treated as
   * case insensitive.
   * @param {string} lang The language key.
   * @example
   * addInlined('style', 'css');
   */
  value: function addInlined(tagName, lang) {
    var includedCdataInside = {};
    includedCdataInside['language-' + lang] = {
      pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
      lookbehind: true,
      inside: Prism.languages[lang]
    };
    includedCdataInside['cdata'] = /^<!\[CDATA\[|\]\]>$/i;
    var inside = {
      'included-cdata': {
        pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
        inside: includedCdataInside
      }
    };
    inside['language-' + lang] = {
      pattern: /[\s\S]+/,
      inside: Prism.languages[lang]
    };
    var def = {};
    def[tagName] = {
      pattern: RegExp(/(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g, function () {
        return tagName;
      }), 'i'),
      lookbehind: true,
      greedy: true,
      inside: inside
    };
    Prism.languages.insertBefore('markup', 'cdata', def);
  }
});
Object.defineProperty(Prism.languages.markup.tag, 'addAttribute', {
  /**
   * Adds an pattern to highlight languages embedded in HTML attributes.
   *
   * An example of an inlined language is CSS with `style` attributes.
   *
   * @param {string} attrName The name of the tag that contains the inlined language. This name will be treated as
   * case insensitive.
   * @param {string} lang The language key.
   * @example
   * addAttribute('style', 'css');
   */
  value: function (attrName, lang) {
    Prism.languages.markup.tag.inside['special-attr'].push({
      pattern: RegExp(/(^|["'\s])/.source + '(?:' + attrName + ')' + /\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source, 'i'),
      lookbehind: true,
      inside: {
        'attr-name': /^[^\s=]+/,
        'attr-value': {
          pattern: /=[\s\S]+/,
          inside: {
            'value': {
              pattern: /(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,
              lookbehind: true,
              alias: [lang, 'language-' + lang],
              inside: Prism.languages[lang]
            },
            'punctuation': [{
              pattern: /^=/,
              alias: 'attr-equals'
            }, /"|'/]
          }
        }
      }
    });
  }
});
Prism.languages.html = Prism.languages.markup;
Prism.languages.mathml = Prism.languages.markup;
Prism.languages.svg = Prism.languages.markup;
Prism.languages.xml = Prism.languages.extend('markup', {});
Prism.languages.ssml = Prism.languages.xml;
Prism.languages.atom = Prism.languages.xml;
Prism.languages.rss = Prism.languages.xml;

/* **********************************************
     Begin prism-css.js
********************************************** */

(function (Prism) {
  var string = /(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;
  Prism.languages.css = {
    'comment': /\/\*[\s\S]*?\*\//,
    'atrule': {
      pattern: RegExp('@[\\w-](?:' + /[^;{\s"']|\s+(?!\s)/.source + '|' + string.source + ')*?' + /(?:;|(?=\s*\{))/.source),
      inside: {
        'rule': /^@[\w-]+/,
        'selector-function-argument': {
          pattern: /(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,
          lookbehind: true,
          alias: 'selector'
        },
        'keyword': {
          pattern: /(^|[^\w-])(?:and|not|only|or)(?![\w-])/,
          lookbehind: true
        }
        // See rest below
      }
    },

    'url': {
      // https://drafts.csswg.org/css-values-3/#urls
      pattern: RegExp('\\burl\\((?:' + string.source + '|' + /(?:[^\\\r\n()"']|\\[\s\S])*/.source + ')\\)', 'i'),
      greedy: true,
      inside: {
        'function': /^url/i,
        'punctuation': /^\(|\)$/,
        'string': {
          pattern: RegExp('^' + string.source + '$'),
          alias: 'url'
        }
      }
    },
    'selector': {
      pattern: RegExp('(^|[{}\\s])[^{}\\s](?:[^{};"\'\\s]|\\s+(?![\\s{])|' + string.source + ')*(?=\\s*\\{)'),
      lookbehind: true
    },
    'string': {
      pattern: string,
      greedy: true
    },
    'property': {
      pattern: /(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,
      lookbehind: true
    },
    'important': /!important\b/i,
    'function': {
      pattern: /(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,
      lookbehind: true
    },
    'punctuation': /[(){};:,]/
  };
  Prism.languages.css['atrule'].inside.rest = Prism.languages.css;
  var markup = Prism.languages.markup;
  if (markup) {
    markup.tag.addInlined('style', 'css');
    markup.tag.addAttribute('style', 'css');
  }
})(Prism);

/* **********************************************
     Begin prism-clike.js
********************************************** */

Prism.languages.clike = {
  'comment': [{
    pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
    lookbehind: true,
    greedy: true
  }, {
    pattern: /(^|[^\\:])\/\/.*/,
    lookbehind: true,
    greedy: true
  }],
  'string': {
    pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
    greedy: true
  },
  'class-name': {
    pattern: /(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,
    lookbehind: true,
    inside: {
      'punctuation': /[.\\]/
    }
  },
  'keyword': /\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,
  'boolean': /\b(?:false|true)\b/,
  'function': /\b\w+(?=\()/,
  'number': /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
  'operator': /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
  'punctuation': /[{}[\];(),.:]/
};

/* **********************************************
     Begin prism-javascript.js
********************************************** */

Prism.languages.javascript = Prism.languages.extend('clike', {
  'class-name': [Prism.languages.clike['class-name'], {
    pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,
    lookbehind: true
  }],
  'keyword': [{
    pattern: /((?:^|\})\s*)catch\b/,
    lookbehind: true
  }, {
    pattern: /(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
    lookbehind: true
  }],
  // Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
  'function': /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
  'number': {
    pattern: RegExp(/(^|[^\w$])/.source + '(?:' + (
    // constant
    /NaN|Infinity/.source + '|' +
    // binary integer
    /0[bB][01]+(?:_[01]+)*n?/.source + '|' +
    // octal integer
    /0[oO][0-7]+(?:_[0-7]+)*n?/.source + '|' +
    // hexadecimal integer
    /0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source + '|' +
    // decimal bigint
    /\d+(?:_\d+)*n/.source + '|' +
    // decimal number (integer or float) but no bigint
    /(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/.source) + ')' + /(?![\w$])/.source),
    lookbehind: true
  },
  'operator': /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/
});
Prism.languages.javascript['class-name'][0].pattern = /(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/;
Prism.languages.insertBefore('javascript', 'keyword', {
  'regex': {
    pattern: RegExp(
    // lookbehind
    // eslint-disable-next-line regexp/no-dupe-characters-character-class
    /((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source +
    // Regex pattern:
    // There are 2 regex patterns here. The RegExp set notation proposal added support for nested character
    // classes if the `v` flag is present. Unfortunately, nested CCs are both context-free and incompatible
    // with the only syntax, so we have to define 2 different regex patterns.
    /\//.source + '(?:' + /(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/.source + '|' +
    // `v` flag syntax. This supports 3 levels of nested character classes.
    /(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/.source + ')' +
    // lookahead
    /(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/.source),
    lookbehind: true,
    greedy: true,
    inside: {
      'regex-source': {
        pattern: /^(\/)[\s\S]+(?=\/[a-z]*$)/,
        lookbehind: true,
        alias: 'language-regex',
        inside: Prism.languages.regex
      },
      'regex-delimiter': /^\/|\/$/,
      'regex-flags': /^[a-z]+$/
    }
  },
  // This must be declared before keyword because we use "function" inside the look-forward
  'function-variable': {
    pattern: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,
    alias: 'function'
  },
  'parameter': [{
    pattern: /(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,
    lookbehind: true,
    inside: Prism.languages.javascript
  }, {
    pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,
    lookbehind: true,
    inside: Prism.languages.javascript
  }, {
    pattern: /(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,
    lookbehind: true,
    inside: Prism.languages.javascript
  }, {
    pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,
    lookbehind: true,
    inside: Prism.languages.javascript
  }],
  'constant': /\b[A-Z](?:[A-Z_]|\dx?)*\b/
});
Prism.languages.insertBefore('javascript', 'string', {
  'hashbang': {
    pattern: /^#!.*/,
    greedy: true,
    alias: 'comment'
  },
  'template-string': {
    pattern: /`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,
    greedy: true,
    inside: {
      'template-punctuation': {
        pattern: /^`|`$/,
        alias: 'string'
      },
      'interpolation': {
        pattern: /((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,
        lookbehind: true,
        inside: {
          'interpolation-punctuation': {
            pattern: /^\$\{|\}$/,
            alias: 'punctuation'
          },
          rest: Prism.languages.javascript
        }
      },
      'string': /[\s\S]+/
    }
  },
  'string-property': {
    pattern: /((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,
    lookbehind: true,
    greedy: true,
    alias: 'property'
  }
});
Prism.languages.insertBefore('javascript', 'operator', {
  'literal-property': {
    pattern: /((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,
    lookbehind: true,
    alias: 'property'
  }
});
if (Prism.languages.markup) {
  Prism.languages.markup.tag.addInlined('script', 'javascript');

  // add attribute support for all DOM events.
  // https://developer.mozilla.org/en-US/docs/Web/Events#Standard_events
  Prism.languages.markup.tag.addAttribute(/on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/.source, 'javascript');
}
Prism.languages.js = Prism.languages.javascript;

/* **********************************************
     Begin prism-file-highlight.js
********************************************** */

(function () {
  if (typeof Prism === 'undefined' || typeof document === 'undefined') {
    return;
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Element/matches#Polyfill
  if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
  }
  var LOADING_MESSAGE = 'Loading…';
  var FAILURE_MESSAGE = function (status, message) {
    return '✖ Error ' + status + ' while fetching file: ' + message;
  };
  var FAILURE_EMPTY_MESSAGE = '✖ Error: File does not exist or is empty';
  var EXTENSIONS = {
    'js': 'javascript',
    'py': 'python',
    'rb': 'ruby',
    'ps1': 'powershell',
    'psm1': 'powershell',
    'sh': 'bash',
    'bat': 'batch',
    'h': 'c',
    'tex': 'latex'
  };
  var STATUS_ATTR = 'data-src-status';
  var STATUS_LOADING = 'loading';
  var STATUS_LOADED = 'loaded';
  var STATUS_FAILED = 'failed';
  var SELECTOR = 'pre[data-src]:not([' + STATUS_ATTR + '="' + STATUS_LOADED + '"])' + ':not([' + STATUS_ATTR + '="' + STATUS_LOADING + '"])';

  /**
   * Loads the given file.
   *
   * @param {string} src The URL or path of the source file to load.
   * @param {(result: string) => void} success
   * @param {(reason: string) => void} error
   */
  function loadFile(src, success, error) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', src, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        if (xhr.status < 400 && xhr.responseText) {
          success(xhr.responseText);
        } else {
          if (xhr.status >= 400) {
            error(FAILURE_MESSAGE(xhr.status, xhr.statusText));
          } else {
            error(FAILURE_EMPTY_MESSAGE);
          }
        }
      }
    };
    xhr.send(null);
  }

  /**
   * Parses the given range.
   *
   * This returns a range with inclusive ends.
   *
   * @param {string | null | undefined} range
   * @returns {[number, number | undefined] | undefined}
   */
  function parseRange(range) {
    var m = /^\s*(\d+)\s*(?:(,)\s*(?:(\d+)\s*)?)?$/.exec(range || '');
    if (m) {
      var start = Number(m[1]);
      var comma = m[2];
      var end = m[3];
      if (!comma) {
        return [start, start];
      }
      if (!end) {
        return [start, undefined];
      }
      return [start, Number(end)];
    }
    return undefined;
  }
  Prism.hooks.add('before-highlightall', function (env) {
    env.selector += ', ' + SELECTOR;
  });
  Prism.hooks.add('before-sanity-check', function (env) {
    var pre = /** @type {HTMLPreElement} */env.element;
    if (pre.matches(SELECTOR)) {
      env.code = ''; // fast-path the whole thing and go to complete

      pre.setAttribute(STATUS_ATTR, STATUS_LOADING); // mark as loading

      // add code element with loading message
      var code = pre.appendChild(document.createElement('CODE'));
      code.textContent = LOADING_MESSAGE;
      var src = pre.getAttribute('data-src');
      var language = env.language;
      if (language === 'none') {
        // the language might be 'none' because there is no language set;
        // in this case, we want to use the extension as the language
        var extension = (/\.(\w+)$/.exec(src) || [, 'none'])[1];
        language = EXTENSIONS[extension] || extension;
      }

      // set language classes
      Prism.util.setLanguage(code, language);
      Prism.util.setLanguage(pre, language);

      // preload the language
      var autoloader = Prism.plugins.autoloader;
      if (autoloader) {
        autoloader.loadLanguages(language);
      }

      // load file
      loadFile(src, function (text) {
        // mark as loaded
        pre.setAttribute(STATUS_ATTR, STATUS_LOADED);

        // handle data-range
        var range = parseRange(pre.getAttribute('data-range'));
        if (range) {
          var lines = text.split(/\r\n?|\n/g);

          // the range is one-based and inclusive on both ends
          var start = range[0];
          var end = range[1] == null ? lines.length : range[1];
          if (start < 0) {
            start += lines.length;
          }
          start = Math.max(0, Math.min(start - 1, lines.length));
          if (end < 0) {
            end += lines.length;
          }
          end = Math.max(0, Math.min(end, lines.length));
          text = lines.slice(start, end).join('\n');

          // add data-start for line numbers
          if (!pre.hasAttribute('data-start')) {
            pre.setAttribute('data-start', String(start + 1));
          }
        }

        // highlight code
        code.textContent = text;
        Prism.highlightElement(code);
      }, function (error) {
        // mark as failed
        pre.setAttribute(STATUS_ATTR, STATUS_FAILED);
        code.textContent = error;
      });
    }
  });
  Prism.plugins.fileHighlight = {
    /**
     * Executes the File Highlight plugin for all matching `pre` elements under the given container.
     *
     * Note: Elements which are already loaded or currently loading will not be touched by this method.
     *
     * @param {ParentNode} [container=document]
     */
    highlight: function highlight(container) {
      var elements = (container || document).querySelectorAll(SELECTOR);
      for (var i = 0, element; element = elements[i++];) {
        Prism.highlightElement(element);
      }
    }
  };
  var logged = false;
  /** @deprecated Use `Prism.plugins.fileHighlight.highlight` instead. */
  Prism.fileHighlight = function () {
    if (!logged) {
      console.warn('Prism.fileHighlight is deprecated. Use `Prism.plugins.fileHighlight.highlight` instead.');
      logged = true;
    }
    Prism.plugins.fileHighlight.highlight.apply(this, arguments);
  };
})();
Prism.languages.clike = {
  'comment': [{
    pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
    lookbehind: true,
    greedy: true
  }, {
    pattern: /(^|[^\\:])\/\/.*/,
    lookbehind: true,
    greedy: true
  }],
  'string': {
    pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
    greedy: true
  },
  'class-name': {
    pattern: /(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,
    lookbehind: true,
    inside: {
      'punctuation': /[.\\]/
    }
  },
  'keyword': /\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,
  'boolean': /\b(?:false|true)\b/,
  'function': /\b\w+(?=\()/,
  'number': /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
  'operator': /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
  'punctuation': /[{}[\];(),.:]/
};
Prism.languages.c = Prism.languages.extend('clike', {
  'comment': {
    pattern: /\/\/(?:[^\r\n\\]|\\(?:\r\n?|\n|(?![\r\n])))*|\/\*[\s\S]*?(?:\*\/|$)/,
    greedy: true
  },
  'string': {
    // https://en.cppreference.com/w/c/language/string_literal
    pattern: /"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"/,
    greedy: true
  },
  'class-name': {
    pattern: /(\b(?:enum|struct)\s+(?:__attribute__\s*\(\([\s\S]*?\)\)\s*)?)\w+|\b[a-z]\w*_t\b/,
    lookbehind: true
  },
  'keyword': /\b(?:_Alignas|_Alignof|_Atomic|_Bool|_Complex|_Generic|_Imaginary|_Noreturn|_Static_assert|_Thread_local|__attribute__|asm|auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|inline|int|long|register|return|short|signed|sizeof|static|struct|switch|typedef|typeof|union|unsigned|void|volatile|while)\b/,
  'function': /\b[a-z_]\w*(?=\s*\()/i,
  'number': /(?:\b0x(?:[\da-f]+(?:\.[\da-f]*)?|\.[\da-f]+)(?:p[+-]?\d+)?|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?)[ful]{0,4}/i,
  'operator': />>=?|<<=?|->|([-+&|:])\1|[?:~]|[-+*/%&|^!=<>]=?/
});
Prism.languages.insertBefore('c', 'string', {
  'char': {
    // https://en.cppreference.com/w/c/language/character_constant
    pattern: /'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n]){0,32}'/,
    greedy: true
  }
});
Prism.languages.insertBefore('c', 'string', {
  'macro': {
    // allow for multiline macro definitions
    // spaces after the # character compile fine with gcc
    pattern: /(^[\t ]*)#\s*[a-z](?:[^\r\n\\/]|\/(?!\*)|\/\*(?:[^*]|\*(?!\/))*\*\/|\\(?:\r\n|[\s\S]))*/im,
    lookbehind: true,
    greedy: true,
    alias: 'property',
    inside: {
      'string': [{
        // highlight the path of the include statement as a string
        pattern: /^(#\s*include\s*)<[^>]+>/,
        lookbehind: true
      }, Prism.languages.c['string']],
      'char': Prism.languages.c['char'],
      'comment': Prism.languages.c['comment'],
      'macro-name': [{
        pattern: /(^#\s*define\s+)\w+\b(?!\()/i,
        lookbehind: true
      }, {
        pattern: /(^#\s*define\s+)\w+\b(?=\()/i,
        lookbehind: true,
        alias: 'function'
      }],
      // highlight macro directives as keywords
      'directive': {
        pattern: /^(#\s*)[a-z]+/,
        lookbehind: true,
        alias: 'keyword'
      },
      'directive-hash': /^#/,
      'punctuation': /##|\\(?=[\r\n])/,
      'expression': {
        pattern: /\S[\s\S]*/,
        inside: Prism.languages.c
      }
    }
  }
});
Prism.languages.insertBefore('c', 'function', {
  // highlight predefined macros as constants
  'constant': /\b(?:EOF|NULL|SEEK_CUR|SEEK_END|SEEK_SET|__DATE__|__FILE__|__LINE__|__TIMESTAMP__|__TIME__|__func__|stderr|stdin|stdout)\b/
});
delete Prism.languages.c['boolean'];
(function (Prism) {
  var keyword = /\b(?:alignas|alignof|asm|auto|bool|break|case|catch|char|char16_t|char32_t|char8_t|class|co_await|co_return|co_yield|compl|concept|const|const_cast|consteval|constexpr|constinit|continue|decltype|default|delete|do|double|dynamic_cast|else|enum|explicit|export|extern|final|float|for|friend|goto|if|import|inline|int|int16_t|int32_t|int64_t|int8_t|long|module|mutable|namespace|new|noexcept|nullptr|operator|override|private|protected|public|register|reinterpret_cast|requires|return|short|signed|sizeof|static|static_assert|static_cast|struct|switch|template|this|thread_local|throw|try|typedef|typeid|typename|uint16_t|uint32_t|uint64_t|uint8_t|union|unsigned|using|virtual|void|volatile|wchar_t|while)\b/;
  var modName = /\b(?!<keyword>)\w+(?:\s*\.\s*\w+)*\b/.source.replace(/<keyword>/g, function () {
    return keyword.source;
  });
  Prism.languages.cpp = Prism.languages.extend('c', {
    'class-name': [{
      pattern: RegExp(/(\b(?:class|concept|enum|struct|typename)\s+)(?!<keyword>)\w+/.source.replace(/<keyword>/g, function () {
        return keyword.source;
      })),
      lookbehind: true
    },
    // This is intended to capture the class name of method implementations like:
    //   void foo::bar() const {}
    // However! The `foo` in the above example could also be a namespace, so we only capture the class name if
    // it starts with an uppercase letter. This approximation should give decent results.
    /\b[A-Z]\w*(?=\s*::\s*\w+\s*\()/,
    // This will capture the class name before destructors like:
    //   Foo::~Foo() {}
    /\b[A-Z_]\w*(?=\s*::\s*~\w+\s*\()/i,
    // This also intends to capture the class name of method implementations but here the class has template
    // parameters, so it can't be a namespace (until C++ adds generic namespaces).
    /\b\w+(?=\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>\s*::\s*\w+\s*\()/],
    'keyword': keyword,
    'number': {
      pattern: /(?:\b0b[01']+|\b0x(?:[\da-f']+(?:\.[\da-f']*)?|\.[\da-f']+)(?:p[+-]?[\d']+)?|(?:\b[\d']+(?:\.[\d']*)?|\B\.[\d']+)(?:e[+-]?[\d']+)?)[ful]{0,4}/i,
      greedy: true
    },
    'operator': />>=?|<<=?|->|--|\+\+|&&|\|\||[?:~]|<=>|[-+*/%&|^!=<>]=?|\b(?:and|and_eq|bitand|bitor|not|not_eq|or|or_eq|xor|xor_eq)\b/,
    'boolean': /\b(?:false|true)\b/
  });
  Prism.languages.insertBefore('cpp', 'string', {
    'module': {
      // https://en.cppreference.com/w/cpp/language/modules
      pattern: RegExp(/(\b(?:import|module)\s+)/.source + '(?:' +
      // header-name
      /"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|<[^<>\r\n]*>/.source + '|' +
      // module name or partition or both
      /<mod-name>(?:\s*:\s*<mod-name>)?|:\s*<mod-name>/.source.replace(/<mod-name>/g, function () {
        return modName;
      }) + ')'),
      lookbehind: true,
      greedy: true,
      inside: {
        'string': /^[<"][\s\S]+/,
        'operator': /:/,
        'punctuation': /\./
      }
    },
    'raw-string': {
      pattern: /R"([^()\\ ]{0,16})\([\s\S]*?\)\1"/,
      alias: 'string',
      greedy: true
    }
  });
  Prism.languages.insertBefore('cpp', 'keyword', {
    'generic-function': {
      pattern: /\b(?!operator\b)[a-z_]\w*\s*<(?:[^<>]|<[^<>]*>)*>(?=\s*\()/i,
      inside: {
        'function': /^\w+/,
        'generic': {
          pattern: /<[\s\S]+/,
          alias: 'class-name',
          inside: Prism.languages.cpp
        }
      }
    }
  });
  Prism.languages.insertBefore('cpp', 'operator', {
    'double-colon': {
      pattern: /::/,
      alias: 'punctuation'
    }
  });
  Prism.languages.insertBefore('cpp', 'class-name', {
    // the base clause is an optional list of parent classes
    // https://en.cppreference.com/w/cpp/language/class
    'base-clause': {
      pattern: /(\b(?:class|struct)\s+\w+\s*:\s*)[^;{}"'\s]+(?:\s+[^;{}"'\s]+)*(?=\s*[;{])/,
      lookbehind: true,
      greedy: true,
      inside: Prism.languages.extend('cpp', {})
    }
  });
  Prism.languages.insertBefore('inside', 'double-colon', {
    // All untokenized words that are not namespaces should be class names
    'class-name': /\b[a-z_]\w*\b(?!\s*::)/i
  }, Prism.languages.cpp['base-clause']);
})(Prism);
Prism.languages.arduino = Prism.languages.extend('cpp', {
  'keyword': /\b(?:String|array|bool|boolean|break|byte|case|catch|continue|default|do|double|else|finally|for|function|goto|if|in|instanceof|int|integer|long|loop|new|null|return|setup|string|switch|throw|try|void|while|word)\b/,
  'constant': /\b(?:ANALOG_MESSAGE|DEFAULT|DIGITAL_MESSAGE|EXTERNAL|FIRMATA_STRING|HIGH|INPUT|INPUT_PULLUP|INTERNAL|INTERNAL1V1|INTERNAL2V56|LED_BUILTIN|LOW|OUTPUT|REPORT_ANALOG|REPORT_DIGITAL|SET_PIN_MODE|SYSEX_START|SYSTEM_RESET)\b/,
  'builtin': /\b(?:Audio|BSSID|Bridge|Client|Console|EEPROM|Esplora|EsploraTFT|Ethernet|EthernetClient|EthernetServer|EthernetUDP|File|FileIO|FileSystem|Firmata|GPRS|GSM|GSMBand|GSMClient|GSMModem|GSMPIN|GSMScanner|GSMServer|GSMVoiceCall|GSM_SMS|HttpClient|IPAddress|IRread|Keyboard|KeyboardController|LiquidCrystal|LiquidCrystal_I2C|Mailbox|Mouse|MouseController|PImage|Process|RSSI|RobotControl|RobotMotor|SD|SPI|SSID|Scheduler|Serial|Server|Servo|SoftwareSerial|Stepper|Stream|TFT|Task|USBHost|WiFi|WiFiClient|WiFiServer|WiFiUDP|Wire|YunClient|YunServer|abs|addParameter|analogRead|analogReadResolution|analogReference|analogWrite|analogWriteResolution|answerCall|attach|attachGPRS|attachInterrupt|attached|autoscroll|available|background|beep|begin|beginPacket|beginSD|beginSMS|beginSpeaker|beginTFT|beginTransmission|beginWrite|bit|bitClear|bitRead|bitSet|bitWrite|blink|blinkVersion|buffer|changePIN|checkPIN|checkPUK|checkReg|circle|cityNameRead|cityNameWrite|clear|clearScreen|click|close|compassRead|config|connect|connected|constrain|cos|countryNameRead|countryNameWrite|createChar|cursor|debugPrint|delay|delayMicroseconds|detach|detachInterrupt|digitalRead|digitalWrite|disconnect|display|displayLogos|drawBMP|drawCompass|encryptionType|end|endPacket|endSMS|endTransmission|endWrite|exists|exitValue|fill|find|findUntil|flush|gatewayIP|get|getAsynchronously|getBand|getButton|getCurrentCarrier|getIMEI|getKey|getModifiers|getOemKey|getPINUsed|getResult|getSignalStrength|getSocket|getVoiceCallStatus|getXChange|getYChange|hangCall|height|highByte|home|image|interrupts|isActionDone|isDirectory|isListening|isPIN|isPressed|isValid|keyPressed|keyReleased|keyboardRead|knobRead|leftToRight|line|lineFollowConfig|listen|listenOnLocalhost|loadImage|localIP|lowByte|macAddress|maintain|map|max|messageAvailable|micros|millis|min|mkdir|motorsStop|motorsWrite|mouseDragged|mouseMoved|mousePressed|mouseReleased|move|noAutoscroll|noBlink|noBuffer|noCursor|noDisplay|noFill|noInterrupts|noListenOnLocalhost|noStroke|noTone|onReceive|onRequest|open|openNextFile|overflow|parseCommand|parseFloat|parseInt|parsePacket|pauseMode|peek|pinMode|playFile|playMelody|point|pointTo|position|pow|prepare|press|print|printFirmwareVersion|printVersion|println|process|processInput|pulseIn|put|random|randomSeed|read|readAccelerometer|readBlue|readButton|readBytes|readBytesUntil|readGreen|readJoystickButton|readJoystickSwitch|readJoystickX|readJoystickY|readLightSensor|readMessage|readMicrophone|readNetworks|readRed|readSlider|readString|readStringUntil|readTemperature|ready|rect|release|releaseAll|remoteIP|remoteNumber|remotePort|remove|requestFrom|retrieveCallingNumber|rewindDirectory|rightToLeft|rmdir|robotNameRead|robotNameWrite|run|runAsynchronously|runShellCommand|runShellCommandAsynchronously|running|scanNetworks|scrollDisplayLeft|scrollDisplayRight|seek|sendAnalog|sendDigitalPortPair|sendDigitalPorts|sendString|sendSysex|serialEvent|setBand|setBitOrder|setClockDivider|setCursor|setDNS|setDataMode|setFirmwareVersion|setMode|setPINUsed|setSpeed|setTextSize|setTimeout|shiftIn|shiftOut|shutdown|sin|size|sqrt|startLoop|step|stop|stroke|subnetMask|switchPIN|tan|tempoWrite|text|tone|transfer|tuneWrite|turn|updateIR|userNameRead|userNameWrite|voiceCall|waitContinue|width|write|writeBlue|writeGreen|writeJSON|writeMessage|writeMicroseconds|writeRGB|writeRed|yield)\b/
});
Prism.languages.ino = Prism.languages.arduino;
(function (Prism) {
  // $ set | grep '^[A-Z][^[:space:]]*=' | cut -d= -f1 | tr '\n' '|'
  // + LC_ALL, RANDOM, REPLY, SECONDS.
  // + make sure PS1..4 are here as they are not always set,
  // - some useless things.
  var envVars = '\\b(?:BASH|BASHOPTS|BASH_ALIASES|BASH_ARGC|BASH_ARGV|BASH_CMDS|BASH_COMPLETION_COMPAT_DIR|BASH_LINENO|BASH_REMATCH|BASH_SOURCE|BASH_VERSINFO|BASH_VERSION|COLORTERM|COLUMNS|COMP_WORDBREAKS|DBUS_SESSION_BUS_ADDRESS|DEFAULTS_PATH|DESKTOP_SESSION|DIRSTACK|DISPLAY|EUID|GDMSESSION|GDM_LANG|GNOME_KEYRING_CONTROL|GNOME_KEYRING_PID|GPG_AGENT_INFO|GROUPS|HISTCONTROL|HISTFILE|HISTFILESIZE|HISTSIZE|HOME|HOSTNAME|HOSTTYPE|IFS|INSTANCE|JOB|LANG|LANGUAGE|LC_ADDRESS|LC_ALL|LC_IDENTIFICATION|LC_MEASUREMENT|LC_MONETARY|LC_NAME|LC_NUMERIC|LC_PAPER|LC_TELEPHONE|LC_TIME|LESSCLOSE|LESSOPEN|LINES|LOGNAME|LS_COLORS|MACHTYPE|MAILCHECK|MANDATORY_PATH|NO_AT_BRIDGE|OLDPWD|OPTERR|OPTIND|ORBIT_SOCKETDIR|OSTYPE|PAPERSIZE|PATH|PIPESTATUS|PPID|PS1|PS2|PS3|PS4|PWD|RANDOM|REPLY|SECONDS|SELINUX_INIT|SESSION|SESSIONTYPE|SESSION_MANAGER|SHELL|SHELLOPTS|SHLVL|SSH_AUTH_SOCK|TERM|UID|UPSTART_EVENTS|UPSTART_INSTANCE|UPSTART_JOB|UPSTART_SESSION|USER|WINDOWID|XAUTHORITY|XDG_CONFIG_DIRS|XDG_CURRENT_DESKTOP|XDG_DATA_DIRS|XDG_GREETER_DATA_DIR|XDG_MENU_PREFIX|XDG_RUNTIME_DIR|XDG_SEAT|XDG_SEAT_PATH|XDG_SESSION_DESKTOP|XDG_SESSION_ID|XDG_SESSION_PATH|XDG_SESSION_TYPE|XDG_VTNR|XMODIFIERS)\\b';
  var commandAfterHeredoc = {
    pattern: /(^(["']?)\w+\2)[ \t]+\S.*/,
    lookbehind: true,
    alias: 'punctuation',
    // this looks reasonably well in all themes
    inside: null // see below
  };

  var insideString = {
    'bash': commandAfterHeredoc,
    'environment': {
      pattern: RegExp('\\$' + envVars),
      alias: 'constant'
    },
    'variable': [
    // [0]: Arithmetic Environment
    {
      pattern: /\$?\(\([\s\S]+?\)\)/,
      greedy: true,
      inside: {
        // If there is a $ sign at the beginning highlight $(( and )) as variable
        'variable': [{
          pattern: /(^\$\(\([\s\S]+)\)\)/,
          lookbehind: true
        }, /^\$\(\(/],
        'number': /\b0x[\dA-Fa-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[Ee]-?\d+)?/,
        // Operators according to https://www.gnu.org/software/bash/manual/bashref.html#Shell-Arithmetic
        'operator': /--|\+\+|\*\*=?|<<=?|>>=?|&&|\|\||[=!+\-*/%<>^&|]=?|[?~:]/,
        // If there is no $ sign at the beginning highlight (( and )) as punctuation
        'punctuation': /\(\(?|\)\)?|,|;/
      }
    },
    // [1]: Command Substitution
    {
      pattern: /\$\((?:\([^)]+\)|[^()])+\)|`[^`]+`/,
      greedy: true,
      inside: {
        'variable': /^\$\(|^`|\)$|`$/
      }
    },
    // [2]: Brace expansion
    {
      pattern: /\$\{[^}]+\}/,
      greedy: true,
      inside: {
        'operator': /:[-=?+]?|[!\/]|##?|%%?|\^\^?|,,?/,
        'punctuation': /[\[\]]/,
        'environment': {
          pattern: RegExp('(\\{)' + envVars),
          lookbehind: true,
          alias: 'constant'
        }
      }
    }, /\$(?:\w+|[#?*!@$])/],
    // Escape sequences from echo and printf's manuals, and escaped quotes.
    'entity': /\\(?:[abceEfnrtv\\"]|O?[0-7]{1,3}|U[0-9a-fA-F]{8}|u[0-9a-fA-F]{4}|x[0-9a-fA-F]{1,2})/
  };
  Prism.languages.bash = {
    'shebang': {
      pattern: /^#!\s*\/.*/,
      alias: 'important'
    },
    'comment': {
      pattern: /(^|[^"{\\$])#.*/,
      lookbehind: true
    },
    'function-name': [
    // a) function foo {
    // b) foo() {
    // c) function foo() {
    // but not “foo {”
    {
      // a) and c)
      pattern: /(\bfunction\s+)[\w-]+(?=(?:\s*\(?:\s*\))?\s*\{)/,
      lookbehind: true,
      alias: 'function'
    }, {
      // b)
      pattern: /\b[\w-]+(?=\s*\(\s*\)\s*\{)/,
      alias: 'function'
    }],
    // Highlight variable names as variables in for and select beginnings.
    'for-or-select': {
      pattern: /(\b(?:for|select)\s+)\w+(?=\s+in\s)/,
      alias: 'variable',
      lookbehind: true
    },
    // Highlight variable names as variables in the left-hand part
    // of assignments (“=” and “+=”).
    'assign-left': {
      pattern: /(^|[\s;|&]|[<>]\()\w+(?:\.\w+)*(?=\+?=)/,
      inside: {
        'environment': {
          pattern: RegExp('(^|[\\s;|&]|[<>]\\()' + envVars),
          lookbehind: true,
          alias: 'constant'
        }
      },
      alias: 'variable',
      lookbehind: true
    },
    // Highlight parameter names as variables
    'parameter': {
      pattern: /(^|\s)-{1,2}(?:\w+:[+-]?)?\w+(?:\.\w+)*(?=[=\s]|$)/,
      alias: 'variable',
      lookbehind: true
    },
    'string': [
    // Support for Here-documents https://en.wikipedia.org/wiki/Here_document
    {
      pattern: /((?:^|[^<])<<-?\s*)(\w+)\s[\s\S]*?(?:\r?\n|\r)\2/,
      lookbehind: true,
      greedy: true,
      inside: insideString
    },
    // Here-document with quotes around the tag
    // → No expansion (so no “inside”).
    {
      pattern: /((?:^|[^<])<<-?\s*)(["'])(\w+)\2\s[\s\S]*?(?:\r?\n|\r)\3/,
      lookbehind: true,
      greedy: true,
      inside: {
        'bash': commandAfterHeredoc
      }
    },
    // “Normal” string
    {
      // https://www.gnu.org/software/bash/manual/html_node/Double-Quotes.html
      pattern: /(^|[^\\](?:\\\\)*)"(?:\\[\s\S]|\$\([^)]+\)|\$(?!\()|`[^`]+`|[^"\\`$])*"/,
      lookbehind: true,
      greedy: true,
      inside: insideString
    }, {
      // https://www.gnu.org/software/bash/manual/html_node/Single-Quotes.html
      pattern: /(^|[^$\\])'[^']*'/,
      lookbehind: true,
      greedy: true
    }, {
      // https://www.gnu.org/software/bash/manual/html_node/ANSI_002dC-Quoting.html
      pattern: /\$'(?:[^'\\]|\\[\s\S])*'/,
      greedy: true,
      inside: {
        'entity': insideString.entity
      }
    }],
    'environment': {
      pattern: RegExp('\\$?' + envVars),
      alias: 'constant'
    },
    'variable': insideString.variable,
    'function': {
      pattern: /(^|[\s;|&]|[<>]\()(?:add|apropos|apt|apt-cache|apt-get|aptitude|aspell|automysqlbackup|awk|basename|bash|bc|bconsole|bg|bzip2|cal|cargo|cat|cfdisk|chgrp|chkconfig|chmod|chown|chroot|cksum|clear|cmp|column|comm|composer|cp|cron|crontab|csplit|curl|cut|date|dc|dd|ddrescue|debootstrap|df|diff|diff3|dig|dir|dircolors|dirname|dirs|dmesg|docker|docker-compose|du|egrep|eject|env|ethtool|expand|expect|expr|fdformat|fdisk|fg|fgrep|file|find|fmt|fold|format|free|fsck|ftp|fuser|gawk|git|gparted|grep|groupadd|groupdel|groupmod|groups|grub-mkconfig|gzip|halt|head|hg|history|host|hostname|htop|iconv|id|ifconfig|ifdown|ifup|import|install|ip|java|jobs|join|kill|killall|less|link|ln|locate|logname|logrotate|look|lpc|lpr|lprint|lprintd|lprintq|lprm|ls|lsof|lynx|make|man|mc|mdadm|mkconfig|mkdir|mke2fs|mkfifo|mkfs|mkisofs|mknod|mkswap|mmv|more|most|mount|mtools|mtr|mutt|mv|nano|nc|netstat|nice|nl|node|nohup|notify-send|npm|nslookup|op|open|parted|passwd|paste|pathchk|ping|pkill|pnpm|podman|podman-compose|popd|pr|printcap|printenv|ps|pushd|pv|quota|quotacheck|quotactl|ram|rar|rcp|reboot|remsync|rename|renice|rev|rm|rmdir|rpm|rsync|scp|screen|sdiff|sed|sendmail|seq|service|sftp|sh|shellcheck|shuf|shutdown|sleep|slocate|sort|split|ssh|stat|strace|su|sudo|sum|suspend|swapon|sync|sysctl|tac|tail|tar|tee|time|timeout|top|touch|tr|traceroute|tsort|tty|umount|uname|unexpand|uniq|units|unrar|unshar|unzip|update-grub|uptime|useradd|userdel|usermod|users|uudecode|uuencode|v|vcpkg|vdir|vi|vim|virsh|vmstat|wait|watch|wc|wget|whereis|which|who|whoami|write|xargs|xdg-open|yarn|yes|zenity|zip|zsh|zypper)(?=$|[)\s;|&])/,
      lookbehind: true
    },
    'keyword': {
      pattern: /(^|[\s;|&]|[<>]\()(?:case|do|done|elif|else|esac|fi|for|function|if|in|select|then|until|while)(?=$|[)\s;|&])/,
      lookbehind: true
    },
    // https://www.gnu.org/software/bash/manual/html_node/Shell-Builtin-Commands.html
    'builtin': {
      pattern: /(^|[\s;|&]|[<>]\()(?:\.|:|alias|bind|break|builtin|caller|cd|command|continue|declare|echo|enable|eval|exec|exit|export|getopts|hash|help|let|local|logout|mapfile|printf|pwd|read|readarray|readonly|return|set|shift|shopt|source|test|times|trap|type|typeset|ulimit|umask|unalias|unset)(?=$|[)\s;|&])/,
      lookbehind: true,
      // Alias added to make those easier to distinguish from strings.
      alias: 'class-name'
    },
    'boolean': {
      pattern: /(^|[\s;|&]|[<>]\()(?:false|true)(?=$|[)\s;|&])/,
      lookbehind: true
    },
    'file-descriptor': {
      pattern: /\B&\d\b/,
      alias: 'important'
    },
    'operator': {
      // Lots of redirections here, but not just that.
      pattern: /\d?<>|>\||\+=|=[=~]?|!=?|<<[<-]?|[&\d]?>>|\d[<>]&?|[<>][&=]?|&[>&]?|\|[&|]?/,
      inside: {
        'file-descriptor': {
          pattern: /^\d/,
          alias: 'important'
        }
      }
    },
    'punctuation': /\$?\(\(?|\)\)?|\.\.|[{}[\];\\]/,
    'number': {
      pattern: /(^|\s)(?:[1-9]\d*|0)(?:[.,]\d+)?\b/,
      lookbehind: true
    }
  };
  commandAfterHeredoc.inside = Prism.languages.bash;

  /* Patterns in command substitution. */
  var toBeCopied = ['comment', 'function-name', 'for-or-select', 'assign-left', 'parameter', 'string', 'environment', 'function', 'keyword', 'builtin', 'boolean', 'file-descriptor', 'operator', 'punctuation', 'number'];
  var inside = insideString.variable[1].inside;
  for (var i = 0; i < toBeCopied.length; i++) {
    inside[toBeCopied[i]] = Prism.languages.bash[toBeCopied[i]];
  }
  Prism.languages.sh = Prism.languages.bash;
  Prism.languages.shell = Prism.languages.bash;
})(Prism);
(function (Prism) {
  /**
   * Replaces all placeholders "<<n>>" of given pattern with the n-th replacement (zero based).
   *
   * Note: This is a simple text based replacement. Be careful when using backreferences!
   *
   * @param {string} pattern the given pattern.
   * @param {string[]} replacements a list of replacement which can be inserted into the given pattern.
   * @returns {string} the pattern with all placeholders replaced with their corresponding replacements.
   * @example replace(/a<<0>>a/.source, [/b+/.source]) === /a(?:b+)a/.source
   */
  function replace(pattern, replacements) {
    return pattern.replace(/<<(\d+)>>/g, function (m, index) {
      return '(?:' + replacements[+index] + ')';
    });
  }
  /**
   * @param {string} pattern
   * @param {string[]} replacements
   * @param {string} [flags]
   * @returns {RegExp}
   */
  function re(pattern, replacements, flags) {
    return RegExp(replace(pattern, replacements), flags || '');
  }

  /**
   * Creates a nested pattern where all occurrences of the string `<<self>>` are replaced with the pattern itself.
   *
   * @param {string} pattern
   * @param {number} depthLog2
   * @returns {string}
   */
  function nested(pattern, depthLog2) {
    for (var i = 0; i < depthLog2; i++) {
      pattern = pattern.replace(/<<self>>/g, function () {
        return '(?:' + pattern + ')';
      });
    }
    return pattern.replace(/<<self>>/g, '[^\\s\\S]');
  }

  // https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/
  var keywordKinds = {
    // keywords which represent a return or variable type
    type: 'bool byte char decimal double dynamic float int long object sbyte short string uint ulong ushort var void',
    // keywords which are used to declare a type
    typeDeclaration: 'class enum interface record struct',
    // contextual keywords
    // ("var" and "dynamic" are missing because they are used like types)
    contextual: 'add alias and ascending async await by descending from(?=\\s*(?:\\w|$)) get global group into init(?=\\s*;) join let nameof not notnull on or orderby partial remove select set unmanaged value when where with(?=\\s*{)',
    // all other keywords
    other: 'abstract as base break case catch checked const continue default delegate do else event explicit extern finally fixed for foreach goto if implicit in internal is lock namespace new null operator out override params private protected public readonly ref return sealed sizeof stackalloc static switch this throw try typeof unchecked unsafe using virtual volatile while yield'
  };

  // keywords
  function keywordsToPattern(words) {
    return '\\b(?:' + words.trim().replace(/ /g, '|') + ')\\b';
  }
  var typeDeclarationKeywords = keywordsToPattern(keywordKinds.typeDeclaration);
  var keywords = RegExp(keywordsToPattern(keywordKinds.type + ' ' + keywordKinds.typeDeclaration + ' ' + keywordKinds.contextual + ' ' + keywordKinds.other));
  var nonTypeKeywords = keywordsToPattern(keywordKinds.typeDeclaration + ' ' + keywordKinds.contextual + ' ' + keywordKinds.other);
  var nonContextualKeywords = keywordsToPattern(keywordKinds.type + ' ' + keywordKinds.typeDeclaration + ' ' + keywordKinds.other);

  // types
  var generic = nested(/<(?:[^<>;=+\-*/%&|^]|<<self>>)*>/.source, 2); // the idea behind the other forbidden characters is to prevent false positives. Same for tupleElement.
  var nestedRound = nested(/\((?:[^()]|<<self>>)*\)/.source, 2);
  var name = /@?\b[A-Za-z_]\w*\b/.source;
  var genericName = replace(/<<0>>(?:\s*<<1>>)?/.source, [name, generic]);
  var identifier = replace(/(?!<<0>>)<<1>>(?:\s*\.\s*<<1>>)*/.source, [nonTypeKeywords, genericName]);
  var array = /\[\s*(?:,\s*)*\]/.source;
  var typeExpressionWithoutTuple = replace(/<<0>>(?:\s*(?:\?\s*)?<<1>>)*(?:\s*\?)?/.source, [identifier, array]);
  var tupleElement = replace(/[^,()<>[\];=+\-*/%&|^]|<<0>>|<<1>>|<<2>>/.source, [generic, nestedRound, array]);
  var tuple = replace(/\(<<0>>+(?:,<<0>>+)+\)/.source, [tupleElement]);
  var typeExpression = replace(/(?:<<0>>|<<1>>)(?:\s*(?:\?\s*)?<<2>>)*(?:\s*\?)?/.source, [tuple, identifier, array]);
  var typeInside = {
    'keyword': keywords,
    'punctuation': /[<>()?,.:[\]]/
  };

  // strings & characters
  // https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/language-specification/lexical-structure#character-literals
  // https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/language-specification/lexical-structure#string-literals
  var character = /'(?:[^\r\n'\\]|\\.|\\[Uux][\da-fA-F]{1,8})'/.source; // simplified pattern
  var regularString = /"(?:\\.|[^\\"\r\n])*"/.source;
  var verbatimString = /@"(?:""|\\[\s\S]|[^\\"])*"(?!")/.source;
  Prism.languages.csharp = Prism.languages.extend('clike', {
    'string': [{
      pattern: re(/(^|[^$\\])<<0>>/.source, [verbatimString]),
      lookbehind: true,
      greedy: true
    }, {
      pattern: re(/(^|[^@$\\])<<0>>/.source, [regularString]),
      lookbehind: true,
      greedy: true
    }],
    'class-name': [{
      // Using static
      // using static System.Math;
      pattern: re(/(\busing\s+static\s+)<<0>>(?=\s*;)/.source, [identifier]),
      lookbehind: true,
      inside: typeInside
    }, {
      // Using alias (type)
      // using Project = PC.MyCompany.Project;
      pattern: re(/(\busing\s+<<0>>\s*=\s*)<<1>>(?=\s*;)/.source, [name, typeExpression]),
      lookbehind: true,
      inside: typeInside
    }, {
      // Using alias (alias)
      // using Project = PC.MyCompany.Project;
      pattern: re(/(\busing\s+)<<0>>(?=\s*=)/.source, [name]),
      lookbehind: true
    }, {
      // Type declarations
      // class Foo<A, B>
      // interface Foo<out A, B>
      pattern: re(/(\b<<0>>\s+)<<1>>/.source, [typeDeclarationKeywords, genericName]),
      lookbehind: true,
      inside: typeInside
    }, {
      // Single catch exception declaration
      // catch(Foo)
      // (things like catch(Foo e) is covered by variable declaration)
      pattern: re(/(\bcatch\s*\(\s*)<<0>>/.source, [identifier]),
      lookbehind: true,
      inside: typeInside
    }, {
      // Name of the type parameter of generic constraints
      // where Foo : class
      pattern: re(/(\bwhere\s+)<<0>>/.source, [name]),
      lookbehind: true
    }, {
      // Casts and checks via as and is.
      // as Foo<A>, is Bar<B>
      // (things like if(a is Foo b) is covered by variable declaration)
      pattern: re(/(\b(?:is(?:\s+not)?|as)\s+)<<0>>/.source, [typeExpressionWithoutTuple]),
      lookbehind: true,
      inside: typeInside
    }, {
      // Variable, field and parameter declaration
      // (Foo bar, Bar baz, Foo[,,] bay, Foo<Bar, FooBar<Bar>> bax)
      pattern: re(/\b<<0>>(?=\s+(?!<<1>>|with\s*\{)<<2>>(?:\s*[=,;:{)\]]|\s+(?:in|when)\b))/.source, [typeExpression, nonContextualKeywords, name]),
      inside: typeInside
    }],
    'keyword': keywords,
    // https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/language-specification/lexical-structure#literals
    'number': /(?:\b0(?:x[\da-f_]*[\da-f]|b[01_]*[01])|(?:\B\.\d+(?:_+\d+)*|\b\d+(?:_+\d+)*(?:\.\d+(?:_+\d+)*)?)(?:e[-+]?\d+(?:_+\d+)*)?)(?:[dflmu]|lu|ul)?\b/i,
    'operator': />>=?|<<=?|[-=]>|([-+&|])\1|~|\?\?=?|[-+*/%&|^!=<>]=?/,
    'punctuation': /\?\.?|::|[{}[\];(),.:]/
  });
  Prism.languages.insertBefore('csharp', 'number', {
    'range': {
      pattern: /\.\./,
      alias: 'operator'
    }
  });
  Prism.languages.insertBefore('csharp', 'punctuation', {
    'named-parameter': {
      pattern: re(/([(,]\s*)<<0>>(?=\s*:)/.source, [name]),
      lookbehind: true,
      alias: 'punctuation'
    }
  });
  Prism.languages.insertBefore('csharp', 'class-name', {
    'namespace': {
      // namespace Foo.Bar {}
      // using Foo.Bar;
      pattern: re(/(\b(?:namespace|using)\s+)<<0>>(?:\s*\.\s*<<0>>)*(?=\s*[;{])/.source, [name]),
      lookbehind: true,
      inside: {
        'punctuation': /\./
      }
    },
    'type-expression': {
      // default(Foo), typeof(Foo<Bar>), sizeof(int)
      pattern: re(/(\b(?:default|sizeof|typeof)\s*\(\s*(?!\s))(?:[^()\s]|\s(?!\s)|<<0>>)*(?=\s*\))/.source, [nestedRound]),
      lookbehind: true,
      alias: 'class-name',
      inside: typeInside
    },
    'return-type': {
      // Foo<Bar> ForBar(); Foo IFoo.Bar() => 0
      // int this[int index] => 0; T IReadOnlyList<T>.this[int index] => this[index];
      // int Foo => 0; int Foo { get; set } = 0;
      pattern: re(/<<0>>(?=\s+(?:<<1>>\s*(?:=>|[({]|\.\s*this\s*\[)|this\s*\[))/.source, [typeExpression, identifier]),
      inside: typeInside,
      alias: 'class-name'
    },
    'constructor-invocation': {
      // new List<Foo<Bar[]>> { }
      pattern: re(/(\bnew\s+)<<0>>(?=\s*[[({])/.source, [typeExpression]),
      lookbehind: true,
      inside: typeInside,
      alias: 'class-name'
    },
    /*'explicit-implementation': {
    	// int IFoo<Foo>.Bar => 0; void IFoo<Foo<Foo>>.Foo<T>();
    	pattern: replace(/\b<<0>>(?=\.<<1>>)/, className, methodOrPropertyDeclaration),
    	inside: classNameInside,
    	alias: 'class-name'
    },*/
    'generic-method': {
      // foo<Bar>()
      pattern: re(/<<0>>\s*<<1>>(?=\s*\()/.source, [name, generic]),
      inside: {
        'function': re(/^<<0>>/.source, [name]),
        'generic': {
          pattern: RegExp(generic),
          alias: 'class-name',
          inside: typeInside
        }
      }
    },
    'type-list': {
      // The list of types inherited or of generic constraints
      // class Foo<F> : Bar, IList<FooBar>
      // where F : Bar, IList<int>
      pattern: re(/\b((?:<<0>>\s+<<1>>|record\s+<<1>>\s*<<5>>|where\s+<<2>>)\s*:\s*)(?:<<3>>|<<4>>|<<1>>\s*<<5>>|<<6>>)(?:\s*,\s*(?:<<3>>|<<4>>|<<6>>))*(?=\s*(?:where|[{;]|=>|$))/.source, [typeDeclarationKeywords, genericName, name, typeExpression, keywords.source, nestedRound, /\bnew\s*\(\s*\)/.source]),
      lookbehind: true,
      inside: {
        'record-arguments': {
          pattern: re(/(^(?!new\s*\()<<0>>\s*)<<1>>/.source, [genericName, nestedRound]),
          lookbehind: true,
          greedy: true,
          inside: Prism.languages.csharp
        },
        'keyword': keywords,
        'class-name': {
          pattern: RegExp(typeExpression),
          greedy: true,
          inside: typeInside
        },
        'punctuation': /[,()]/
      }
    },
    'preprocessor': {
      pattern: /(^[\t ]*)#.*/m,
      lookbehind: true,
      alias: 'property',
      inside: {
        // highlight preprocessor directives as keywords
        'directive': {
          pattern: /(#)\b(?:define|elif|else|endif|endregion|error|if|line|nullable|pragma|region|undef|warning)\b/,
          lookbehind: true,
          alias: 'keyword'
        }
      }
    }
  });

  // attributes
  var regularStringOrCharacter = regularString + '|' + character;
  var regularStringCharacterOrComment = replace(/\/(?![*/])|\/\/[^\r\n]*[\r\n]|\/\*(?:[^*]|\*(?!\/))*\*\/|<<0>>/.source, [regularStringOrCharacter]);
  var roundExpression = nested(replace(/[^"'/()]|<<0>>|\(<<self>>*\)/.source, [regularStringCharacterOrComment]), 2);

  // https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/attributes/#attribute-targets
  var attrTarget = /\b(?:assembly|event|field|method|module|param|property|return|type)\b/.source;
  var attr = replace(/<<0>>(?:\s*\(<<1>>*\))?/.source, [identifier, roundExpression]);
  Prism.languages.insertBefore('csharp', 'class-name', {
    'attribute': {
      // Attributes
      // [Foo], [Foo(1), Bar(2, Prop = "foo")], [return: Foo(1), Bar(2)], [assembly: Foo(Bar)]
      pattern: re(/((?:^|[^\s\w>)?])\s*\[\s*)(?:<<0>>\s*:\s*)?<<1>>(?:\s*,\s*<<1>>)*(?=\s*\])/.source, [attrTarget, attr]),
      lookbehind: true,
      greedy: true,
      inside: {
        'target': {
          pattern: re(/^<<0>>(?=\s*:)/.source, [attrTarget]),
          alias: 'keyword'
        },
        'attribute-arguments': {
          pattern: re(/\(<<0>>*\)/.source, [roundExpression]),
          inside: Prism.languages.csharp
        },
        'class-name': {
          pattern: RegExp(identifier),
          inside: {
            'punctuation': /\./
          }
        },
        'punctuation': /[:,]/
      }
    }
  });

  // string interpolation
  var formatString = /:[^}\r\n]+/.source;
  // multi line
  var mInterpolationRound = nested(replace(/[^"'/()]|<<0>>|\(<<self>>*\)/.source, [regularStringCharacterOrComment]), 2);
  var mInterpolation = replace(/\{(?!\{)(?:(?![}:])<<0>>)*<<1>>?\}/.source, [mInterpolationRound, formatString]);
  // single line
  var sInterpolationRound = nested(replace(/[^"'/()]|\/(?!\*)|\/\*(?:[^*]|\*(?!\/))*\*\/|<<0>>|\(<<self>>*\)/.source, [regularStringOrCharacter]), 2);
  var sInterpolation = replace(/\{(?!\{)(?:(?![}:])<<0>>)*<<1>>?\}/.source, [sInterpolationRound, formatString]);
  function createInterpolationInside(interpolation, interpolationRound) {
    return {
      'interpolation': {
        pattern: re(/((?:^|[^{])(?:\{\{)*)<<0>>/.source, [interpolation]),
        lookbehind: true,
        inside: {
          'format-string': {
            pattern: re(/(^\{(?:(?![}:])<<0>>)*)<<1>>(?=\}$)/.source, [interpolationRound, formatString]),
            lookbehind: true,
            inside: {
              'punctuation': /^:/
            }
          },
          'punctuation': /^\{|\}$/,
          'expression': {
            pattern: /[\s\S]+/,
            alias: 'language-csharp',
            inside: Prism.languages.csharp
          }
        }
      },
      'string': /[\s\S]+/
    };
  }
  Prism.languages.insertBefore('csharp', 'string', {
    'interpolation-string': [{
      pattern: re(/(^|[^\\])(?:\$@|@\$)"(?:""|\\[\s\S]|\{\{|<<0>>|[^\\{"])*"/.source, [mInterpolation]),
      lookbehind: true,
      greedy: true,
      inside: createInterpolationInside(mInterpolation, mInterpolationRound)
    }, {
      pattern: re(/(^|[^@\\])\$"(?:\\.|\{\{|<<0>>|[^\\"{])*"/.source, [sInterpolation]),
      lookbehind: true,
      greedy: true,
      inside: createInterpolationInside(sInterpolation, sInterpolationRound)
    }],
    'char': {
      pattern: RegExp(character),
      greedy: true
    }
  });
  Prism.languages.dotnet = Prism.languages.cs = Prism.languages.csharp;
})(Prism);
Prism.languages.markup = {
  'comment': {
    pattern: /<!--(?:(?!<!--)[\s\S])*?-->/,
    greedy: true
  },
  'prolog': {
    pattern: /<\?[\s\S]+?\?>/,
    greedy: true
  },
  'doctype': {
    // https://www.w3.org/TR/xml/#NT-doctypedecl
    pattern: /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
    greedy: true,
    inside: {
      'internal-subset': {
        pattern: /(^[^\[]*\[)[\s\S]+(?=\]>$)/,
        lookbehind: true,
        greedy: true,
        inside: null // see below
      },

      'string': {
        pattern: /"[^"]*"|'[^']*'/,
        greedy: true
      },
      'punctuation': /^<!|>$|[[\]]/,
      'doctype-tag': /^DOCTYPE/i,
      'name': /[^\s<>'"]+/
    }
  },
  'cdata': {
    pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
    greedy: true
  },
  'tag': {
    pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
    greedy: true,
    inside: {
      'tag': {
        pattern: /^<\/?[^\s>\/]+/,
        inside: {
          'punctuation': /^<\/?/,
          'namespace': /^[^\s>\/:]+:/
        }
      },
      'special-attr': [],
      'attr-value': {
        pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
        inside: {
          'punctuation': [{
            pattern: /^=/,
            alias: 'attr-equals'
          }, {
            pattern: /^(\s*)["']|["']$/,
            lookbehind: true
          }]
        }
      },
      'punctuation': /\/?>/,
      'attr-name': {
        pattern: /[^\s>\/]+/,
        inside: {
          'namespace': /^[^\s>\/:]+:/
        }
      }
    }
  },
  'entity': [{
    pattern: /&[\da-z]{1,8};/i,
    alias: 'named-entity'
  }, /&#x?[\da-f]{1,8};/i]
};
Prism.languages.markup['tag'].inside['attr-value'].inside['entity'] = Prism.languages.markup['entity'];
Prism.languages.markup['doctype'].inside['internal-subset'].inside = Prism.languages.markup;

// Plugin to make entity title show the real entity, idea by Roman Komarov
Prism.hooks.add('wrap', function (env) {
  if (env.type === 'entity') {
    env.attributes['title'] = env.content.replace(/&amp;/, '&');
  }
});
Object.defineProperty(Prism.languages.markup.tag, 'addInlined', {
  /**
   * Adds an inlined language to markup.
   *
   * An example of an inlined language is CSS with `<style>` tags.
   *
   * @param {string} tagName The name of the tag that contains the inlined language. This name will be treated as
   * case insensitive.
   * @param {string} lang The language key.
   * @example
   * addInlined('style', 'css');
   */
  value: function addInlined(tagName, lang) {
    var includedCdataInside = {};
    includedCdataInside['language-' + lang] = {
      pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
      lookbehind: true,
      inside: Prism.languages[lang]
    };
    includedCdataInside['cdata'] = /^<!\[CDATA\[|\]\]>$/i;
    var inside = {
      'included-cdata': {
        pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
        inside: includedCdataInside
      }
    };
    inside['language-' + lang] = {
      pattern: /[\s\S]+/,
      inside: Prism.languages[lang]
    };
    var def = {};
    def[tagName] = {
      pattern: RegExp(/(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g, function () {
        return tagName;
      }), 'i'),
      lookbehind: true,
      greedy: true,
      inside: inside
    };
    Prism.languages.insertBefore('markup', 'cdata', def);
  }
});
Object.defineProperty(Prism.languages.markup.tag, 'addAttribute', {
  /**
   * Adds an pattern to highlight languages embedded in HTML attributes.
   *
   * An example of an inlined language is CSS with `style` attributes.
   *
   * @param {string} attrName The name of the tag that contains the inlined language. This name will be treated as
   * case insensitive.
   * @param {string} lang The language key.
   * @example
   * addAttribute('style', 'css');
   */
  value: function (attrName, lang) {
    Prism.languages.markup.tag.inside['special-attr'].push({
      pattern: RegExp(/(^|["'\s])/.source + '(?:' + attrName + ')' + /\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source, 'i'),
      lookbehind: true,
      inside: {
        'attr-name': /^[^\s=]+/,
        'attr-value': {
          pattern: /=[\s\S]+/,
          inside: {
            'value': {
              pattern: /(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,
              lookbehind: true,
              alias: [lang, 'language-' + lang],
              inside: Prism.languages[lang]
            },
            'punctuation': [{
              pattern: /^=/,
              alias: 'attr-equals'
            }, /"|'/]
          }
        }
      }
    });
  }
});
Prism.languages.html = Prism.languages.markup;
Prism.languages.mathml = Prism.languages.markup;
Prism.languages.svg = Prism.languages.markup;
Prism.languages.xml = Prism.languages.extend('markup', {});
Prism.languages.ssml = Prism.languages.xml;
Prism.languages.atom = Prism.languages.xml;
Prism.languages.rss = Prism.languages.xml;
(function (Prism) {
  var string = /(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;
  Prism.languages.css = {
    'comment': /\/\*[\s\S]*?\*\//,
    'atrule': {
      pattern: RegExp('@[\\w-](?:' + /[^;{\s"']|\s+(?!\s)/.source + '|' + string.source + ')*?' + /(?:;|(?=\s*\{))/.source),
      inside: {
        'rule': /^@[\w-]+/,
        'selector-function-argument': {
          pattern: /(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,
          lookbehind: true,
          alias: 'selector'
        },
        'keyword': {
          pattern: /(^|[^\w-])(?:and|not|only|or)(?![\w-])/,
          lookbehind: true
        }
        // See rest below
      }
    },

    'url': {
      // https://drafts.csswg.org/css-values-3/#urls
      pattern: RegExp('\\burl\\((?:' + string.source + '|' + /(?:[^\\\r\n()"']|\\[\s\S])*/.source + ')\\)', 'i'),
      greedy: true,
      inside: {
        'function': /^url/i,
        'punctuation': /^\(|\)$/,
        'string': {
          pattern: RegExp('^' + string.source + '$'),
          alias: 'url'
        }
      }
    },
    'selector': {
      pattern: RegExp('(^|[{}\\s])[^{}\\s](?:[^{};"\'\\s]|\\s+(?![\\s{])|' + string.source + ')*(?=\\s*\\{)'),
      lookbehind: true
    },
    'string': {
      pattern: string,
      greedy: true
    },
    'property': {
      pattern: /(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,
      lookbehind: true
    },
    'important': /!important\b/i,
    'function': {
      pattern: /(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,
      lookbehind: true
    },
    'punctuation': /[(){};:,]/
  };
  Prism.languages.css['atrule'].inside.rest = Prism.languages.css;
  var markup = Prism.languages.markup;
  if (markup) {
    markup.tag.addInlined('style', 'css');
    markup.tag.addAttribute('style', 'css');
  }
})(Prism);
(function (Prism) {
  Prism.languages.diff = {
    'coord': [
    // Match all kinds of coord lines (prefixed by "+++", "---" or "***").
    /^(?:\*{3}|-{3}|\+{3}).*$/m,
    // Match "@@ ... @@" coord lines in unified diff.
    /^@@.*@@$/m,
    // Match coord lines in normal diff (starts with a number).
    /^\d.*$/m]

    // deleted, inserted, unchanged, diff
  };

  /**
   * A map from the name of a block to its line prefix.
   *
   * @type {Object<string, string>}
   */
  var PREFIXES = {
    'deleted-sign': '-',
    'deleted-arrow': '<',
    'inserted-sign': '+',
    'inserted-arrow': '>',
    'unchanged': ' ',
    'diff': '!'
  };

  // add a token for each prefix
  Object.keys(PREFIXES).forEach(function (name) {
    var prefix = PREFIXES[name];
    var alias = [];
    if (!/^\w+$/.test(name)) {
      // "deleted-sign" -> "deleted"
      alias.push(/\w+/.exec(name)[0]);
    }
    if (name === 'diff') {
      alias.push('bold');
    }
    Prism.languages.diff[name] = {
      pattern: RegExp('^(?:[' + prefix + '].*(?:\r\n?|\n|(?![\\s\\S])))+', 'm'),
      alias: alias,
      inside: {
        'line': {
          pattern: /(.)(?=[\s\S]).*(?:\r\n?|\n)?/,
          lookbehind: true
        },
        'prefix': {
          pattern: /[\s\S]/,
          alias: /\w+/.exec(name)[0]
        }
      }
    };
  });

  // make prefixes available to Diff plugin
  Object.defineProperty(Prism.languages.diff, 'PREFIXES', {
    value: PREFIXES
  });
})(Prism);
Prism.languages.go = Prism.languages.extend('clike', {
  'string': {
    pattern: /(^|[^\\])"(?:\\.|[^"\\\r\n])*"|`[^`]*`/,
    lookbehind: true,
    greedy: true
  },
  'keyword': /\b(?:break|case|chan|const|continue|default|defer|else|fallthrough|for|func|go(?:to)?|if|import|interface|map|package|range|return|select|struct|switch|type|var)\b/,
  'boolean': /\b(?:_|false|iota|nil|true)\b/,
  'number': [
  // binary and octal integers
  /\b0(?:b[01_]+|o[0-7_]+)i?\b/i,
  // hexadecimal integers and floats
  /\b0x(?:[a-f\d_]+(?:\.[a-f\d_]*)?|\.[a-f\d_]+)(?:p[+-]?\d+(?:_\d+)*)?i?(?!\w)/i,
  // decimal integers and floats
  /(?:\b\d[\d_]*(?:\.[\d_]*)?|\B\.\d[\d_]*)(?:e[+-]?[\d_]+)?i?(?!\w)/i],
  'operator': /[*\/%^!=]=?|\+[=+]?|-[=-]?|\|[=|]?|&(?:=|&|\^=?)?|>(?:>=?|=)?|<(?:<=?|=|-)?|:=|\.\.\./,
  'builtin': /\b(?:append|bool|byte|cap|close|complex|complex(?:64|128)|copy|delete|error|float(?:32|64)|u?int(?:8|16|32|64)?|imag|len|make|new|panic|print(?:ln)?|real|recover|rune|string|uintptr)\b/
});
Prism.languages.insertBefore('go', 'string', {
  'char': {
    pattern: /'(?:\\.|[^'\\\r\n]){0,10}'/,
    greedy: true
  }
});
delete Prism.languages.go['class-name'];
Prism.languages.ini = {
  /**
   * The component mimics the behavior of the Win32 API parser.
   *
   * @see {@link https://github.com/PrismJS/prism/issues/2775#issuecomment-787477723}
   */

  'comment': {
    pattern: /(^[ \f\t\v]*)[#;][^\n\r]*/m,
    lookbehind: true
  },
  'section': {
    pattern: /(^[ \f\t\v]*)\[[^\n\r\]]*\]?/m,
    lookbehind: true,
    inside: {
      'section-name': {
        pattern: /(^\[[ \f\t\v]*)[^ \f\t\v\]]+(?:[ \f\t\v]+[^ \f\t\v\]]+)*/,
        lookbehind: true,
        alias: 'selector'
      },
      'punctuation': /\[|\]/
    }
  },
  'key': {
    pattern: /(^[ \f\t\v]*)[^ \f\n\r\t\v=]+(?:[ \f\t\v]+[^ \f\n\r\t\v=]+)*(?=[ \f\t\v]*=)/m,
    lookbehind: true,
    alias: 'attr-name'
  },
  'value': {
    pattern: /(=[ \f\t\v]*)[^ \f\n\r\t\v]+(?:[ \f\t\v]+[^ \f\n\r\t\v]+)*/,
    lookbehind: true,
    alias: 'attr-value',
    inside: {
      'inner-value': {
        pattern: /^("|').+(?=\1$)/,
        lookbehind: true
      }
    }
  },
  'punctuation': /=/
};
(function (Prism) {
  var keywords = /\b(?:abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|exports|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|module|native|new|non-sealed|null|open|opens|package|permits|private|protected|provides|public|record(?!\s*[(){}[\]<>=%~.:,;?+\-*/&|^])|requires|return|sealed|short|static|strictfp|super|switch|synchronized|this|throw|throws|to|transient|transitive|try|uses|var|void|volatile|while|with|yield)\b/;

  // full package (optional) + parent classes (optional)
  var classNamePrefix = /(?:[a-z]\w*\s*\.\s*)*(?:[A-Z]\w*\s*\.\s*)*/.source;

  // based on the java naming conventions
  var className = {
    pattern: RegExp(/(^|[^\w.])/.source + classNamePrefix + /[A-Z](?:[\d_A-Z]*[a-z]\w*)?\b/.source),
    lookbehind: true,
    inside: {
      'namespace': {
        pattern: /^[a-z]\w*(?:\s*\.\s*[a-z]\w*)*(?:\s*\.)?/,
        inside: {
          'punctuation': /\./
        }
      },
      'punctuation': /\./
    }
  };
  Prism.languages.java = Prism.languages.extend('clike', {
    'string': {
      pattern: /(^|[^\\])"(?:\\.|[^"\\\r\n])*"/,
      lookbehind: true,
      greedy: true
    },
    'class-name': [className, {
      // variables, parameters, and constructor references
      // this to support class names (or generic parameters) which do not contain a lower case letter (also works for methods)
      pattern: RegExp(/(^|[^\w.])/.source + classNamePrefix + /[A-Z]\w*(?=\s+\w+\s*[;,=()]|\s*(?:\[[\s,]*\]\s*)?::\s*new\b)/.source),
      lookbehind: true,
      inside: className.inside
    }, {
      // class names based on keyword
      // this to support class names (or generic parameters) which do not contain a lower case letter (also works for methods)
      pattern: RegExp(/(\b(?:class|enum|extends|implements|instanceof|interface|new|record|throws)\s+)/.source + classNamePrefix + /[A-Z]\w*\b/.source),
      lookbehind: true,
      inside: className.inside
    }],
    'keyword': keywords,
    'function': [Prism.languages.clike.function, {
      pattern: /(::\s*)[a-z_]\w*/,
      lookbehind: true
    }],
    'number': /\b0b[01][01_]*L?\b|\b0x(?:\.[\da-f_p+-]+|[\da-f_]+(?:\.[\da-f_p+-]+)?)\b|(?:\b\d[\d_]*(?:\.[\d_]*)?|\B\.\d[\d_]*)(?:e[+-]?\d[\d_]*)?[dfl]?/i,
    'operator': {
      pattern: /(^|[^.])(?:<<=?|>>>?=?|->|--|\+\+|&&|\|\||::|[?:~]|[-+*/%&|^!=<>]=?)/m,
      lookbehind: true
    },
    'constant': /\b[A-Z][A-Z_\d]+\b/
  });
  Prism.languages.insertBefore('java', 'string', {
    'triple-quoted-string': {
      // http://openjdk.java.net/jeps/355#Description
      pattern: /"""[ \t]*[\r\n](?:(?:"|"")?(?:\\.|[^"\\]))*"""/,
      greedy: true,
      alias: 'string'
    },
    'char': {
      pattern: /'(?:\\.|[^'\\\r\n]){1,6}'/,
      greedy: true
    }
  });
  Prism.languages.insertBefore('java', 'class-name', {
    'annotation': {
      pattern: /(^|[^.])@\w+(?:\s*\.\s*\w+)*/,
      lookbehind: true,
      alias: 'punctuation'
    },
    'generics': {
      pattern: /<(?:[\w\s,.?]|&(?!&)|<(?:[\w\s,.?]|&(?!&)|<(?:[\w\s,.?]|&(?!&)|<(?:[\w\s,.?]|&(?!&))*>)*>)*>)*>/,
      inside: {
        'class-name': className,
        'keyword': keywords,
        'punctuation': /[<>(),.:]/,
        'operator': /[?&|]/
      }
    },
    'import': [{
      pattern: RegExp(/(\bimport\s+)/.source + classNamePrefix + /(?:[A-Z]\w*|\*)(?=\s*;)/.source),
      lookbehind: true,
      inside: {
        'namespace': className.inside.namespace,
        'punctuation': /\./,
        'operator': /\*/,
        'class-name': /\w+/
      }
    }, {
      pattern: RegExp(/(\bimport\s+static\s+)/.source + classNamePrefix + /(?:\w+|\*)(?=\s*;)/.source),
      lookbehind: true,
      alias: 'static',
      inside: {
        'namespace': className.inside.namespace,
        'static': /\b\w+$/,
        'punctuation': /\./,
        'operator': /\*/,
        'class-name': /\w+/
      }
    }],
    'namespace': {
      pattern: RegExp(/(\b(?:exports|import(?:\s+static)?|module|open|opens|package|provides|requires|to|transitive|uses|with)\s+)(?!<keyword>)[a-z]\w*(?:\.[a-z]\w*)*\.?/.source.replace(/<keyword>/g, function () {
        return keywords.source;
      })),
      lookbehind: true,
      inside: {
        'punctuation': /\./
      }
    }
  });
})(Prism);
(function (Prism) {
  var specialEscape = {
    pattern: /\\[\\(){}[\]^$+*?|.]/,
    alias: 'escape'
  };
  var escape = /\\(?:x[\da-fA-F]{2}|u[\da-fA-F]{4}|u\{[\da-fA-F]+\}|0[0-7]{0,2}|[123][0-7]{2}|c[a-zA-Z]|.)/;
  var charSet = {
    pattern: /\.|\\[wsd]|\\p\{[^{}]+\}/i,
    alias: 'class-name'
  };
  var charSetWithoutDot = {
    pattern: /\\[wsd]|\\p\{[^{}]+\}/i,
    alias: 'class-name'
  };
  var rangeChar = '(?:[^\\\\-]|' + escape.source + ')';
  var range = RegExp(rangeChar + '-' + rangeChar);

  // the name of a capturing group
  var groupName = {
    pattern: /(<|')[^<>']+(?=[>']$)/,
    lookbehind: true,
    alias: 'variable'
  };
  Prism.languages.regex = {
    'char-class': {
      pattern: /((?:^|[^\\])(?:\\\\)*)\[(?:[^\\\]]|\\[\s\S])*\]/,
      lookbehind: true,
      inside: {
        'char-class-negation': {
          pattern: /(^\[)\^/,
          lookbehind: true,
          alias: 'operator'
        },
        'char-class-punctuation': {
          pattern: /^\[|\]$/,
          alias: 'punctuation'
        },
        'range': {
          pattern: range,
          inside: {
            'escape': escape,
            'range-punctuation': {
              pattern: /-/,
              alias: 'operator'
            }
          }
        },
        'special-escape': specialEscape,
        'char-set': charSetWithoutDot,
        'escape': escape
      }
    },
    'special-escape': specialEscape,
    'char-set': charSet,
    'backreference': [{
      // a backreference which is not an octal escape
      pattern: /\\(?![123][0-7]{2})[1-9]/,
      alias: 'keyword'
    }, {
      pattern: /\\k<[^<>']+>/,
      alias: 'keyword',
      inside: {
        'group-name': groupName
      }
    }],
    'anchor': {
      pattern: /[$^]|\\[ABbGZz]/,
      alias: 'function'
    },
    'escape': escape,
    'group': [{
      // https://docs.oracle.com/javase/10/docs/api/java/util/regex/Pattern.html
      // https://docs.microsoft.com/en-us/dotnet/standard/base-types/regular-expression-language-quick-reference?view=netframework-4.7.2#grouping-constructs

      // (), (?<name>), (?'name'), (?>), (?:), (?=), (?!), (?<=), (?<!), (?is-m), (?i-m:)
      pattern: /\((?:\?(?:<[^<>']+>|'[^<>']+'|[>:]|<?[=!]|[idmnsuxU]+(?:-[idmnsuxU]+)?:?))?/,
      alias: 'punctuation',
      inside: {
        'group-name': groupName
      }
    }, {
      pattern: /\)/,
      alias: 'punctuation'
    }],
    'quantifier': {
      pattern: /(?:[+*?]|\{\d+(?:,\d*)?\})[?+]?/,
      alias: 'number'
    },
    'alternation': {
      pattern: /\|/,
      alias: 'keyword'
    }
  };
})(Prism);
Prism.languages.javascript = Prism.languages.extend('clike', {
  'class-name': [Prism.languages.clike['class-name'], {
    pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,
    lookbehind: true
  }],
  'keyword': [{
    pattern: /((?:^|\})\s*)catch\b/,
    lookbehind: true
  }, {
    pattern: /(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
    lookbehind: true
  }],
  // Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
  'function': /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
  'number': {
    pattern: RegExp(/(^|[^\w$])/.source + '(?:' + (
    // constant
    /NaN|Infinity/.source + '|' +
    // binary integer
    /0[bB][01]+(?:_[01]+)*n?/.source + '|' +
    // octal integer
    /0[oO][0-7]+(?:_[0-7]+)*n?/.source + '|' +
    // hexadecimal integer
    /0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source + '|' +
    // decimal bigint
    /\d+(?:_\d+)*n/.source + '|' +
    // decimal number (integer or float) but no bigint
    /(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/.source) + ')' + /(?![\w$])/.source),
    lookbehind: true
  },
  'operator': /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/
});
Prism.languages.javascript['class-name'][0].pattern = /(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/;
Prism.languages.insertBefore('javascript', 'keyword', {
  'regex': {
    pattern: RegExp(
    // lookbehind
    // eslint-disable-next-line regexp/no-dupe-characters-character-class
    /((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source +
    // Regex pattern:
    // There are 2 regex patterns here. The RegExp set notation proposal added support for nested character
    // classes if the `v` flag is present. Unfortunately, nested CCs are both context-free and incompatible
    // with the only syntax, so we have to define 2 different regex patterns.
    /\//.source + '(?:' + /(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/.source + '|' +
    // `v` flag syntax. This supports 3 levels of nested character classes.
    /(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/.source + ')' +
    // lookahead
    /(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/.source),
    lookbehind: true,
    greedy: true,
    inside: {
      'regex-source': {
        pattern: /^(\/)[\s\S]+(?=\/[a-z]*$)/,
        lookbehind: true,
        alias: 'language-regex',
        inside: Prism.languages.regex
      },
      'regex-delimiter': /^\/|\/$/,
      'regex-flags': /^[a-z]+$/
    }
  },
  // This must be declared before keyword because we use "function" inside the look-forward
  'function-variable': {
    pattern: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,
    alias: 'function'
  },
  'parameter': [{
    pattern: /(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,
    lookbehind: true,
    inside: Prism.languages.javascript
  }, {
    pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,
    lookbehind: true,
    inside: Prism.languages.javascript
  }, {
    pattern: /(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,
    lookbehind: true,
    inside: Prism.languages.javascript
  }, {
    pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,
    lookbehind: true,
    inside: Prism.languages.javascript
  }],
  'constant': /\b[A-Z](?:[A-Z_]|\dx?)*\b/
});
Prism.languages.insertBefore('javascript', 'string', {
  'hashbang': {
    pattern: /^#!.*/,
    greedy: true,
    alias: 'comment'
  },
  'template-string': {
    pattern: /`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,
    greedy: true,
    inside: {
      'template-punctuation': {
        pattern: /^`|`$/,
        alias: 'string'
      },
      'interpolation': {
        pattern: /((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,
        lookbehind: true,
        inside: {
          'interpolation-punctuation': {
            pattern: /^\$\{|\}$/,
            alias: 'punctuation'
          },
          rest: Prism.languages.javascript
        }
      },
      'string': /[\s\S]+/
    }
  },
  'string-property': {
    pattern: /((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,
    lookbehind: true,
    greedy: true,
    alias: 'property'
  }
});
Prism.languages.insertBefore('javascript', 'operator', {
  'literal-property': {
    pattern: /((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,
    lookbehind: true,
    alias: 'property'
  }
});
if (Prism.languages.markup) {
  Prism.languages.markup.tag.addInlined('script', 'javascript');

  // add attribute support for all DOM events.
  // https://developer.mozilla.org/en-US/docs/Web/Events#Standard_events
  Prism.languages.markup.tag.addAttribute(/on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/.source, 'javascript');
}
Prism.languages.js = Prism.languages.javascript;
(function (Prism) {
  var javascript = Prism.util.clone(Prism.languages.javascript);
  var space = /(?:\s|\/\/.*(?!.)|\/\*(?:[^*]|\*(?!\/))\*\/)/.source;
  var braces = /(?:\{(?:\{(?:\{[^{}]*\}|[^{}])*\}|[^{}])*\})/.source;
  var spread = /(?:\{<S>*\.{3}(?:[^{}]|<BRACES>)*\})/.source;

  /**
   * @param {string} source
   * @param {string} [flags]
   */
  function re(source, flags) {
    source = source.replace(/<S>/g, function () {
      return space;
    }).replace(/<BRACES>/g, function () {
      return braces;
    }).replace(/<SPREAD>/g, function () {
      return spread;
    });
    return RegExp(source, flags);
  }
  spread = re(spread).source;
  Prism.languages.jsx = Prism.languages.extend('markup', javascript);
  Prism.languages.jsx.tag.pattern = re(/<\/?(?:[\w.:-]+(?:<S>+(?:[\w.:$-]+(?:=(?:"(?:\\[\s\S]|[^\\"])*"|'(?:\\[\s\S]|[^\\'])*'|[^\s{'"/>=]+|<BRACES>))?|<SPREAD>))*<S>*\/?)?>/.source);
  Prism.languages.jsx.tag.inside['tag'].pattern = /^<\/?[^\s>\/]*/;
  Prism.languages.jsx.tag.inside['attr-value'].pattern = /=(?!\{)(?:"(?:\\[\s\S]|[^\\"])*"|'(?:\\[\s\S]|[^\\'])*'|[^\s'">]+)/;
  Prism.languages.jsx.tag.inside['tag'].inside['class-name'] = /^[A-Z]\w*(?:\.[A-Z]\w*)*$/;
  Prism.languages.jsx.tag.inside['comment'] = javascript['comment'];
  Prism.languages.insertBefore('inside', 'attr-name', {
    'spread': {
      pattern: re(/<SPREAD>/.source),
      inside: Prism.languages.jsx
    }
  }, Prism.languages.jsx.tag);
  Prism.languages.insertBefore('inside', 'special-attr', {
    'script': {
      // Allow for two levels of nesting
      pattern: re(/=<BRACES>/.source),
      alias: 'language-javascript',
      inside: {
        'script-punctuation': {
          pattern: /^=(?=\{)/,
          alias: 'punctuation'
        },
        rest: Prism.languages.jsx
      }
    }
  }, Prism.languages.jsx.tag);

  // The following will handle plain text inside tags
  var stringifyToken = function (token) {
    if (!token) {
      return '';
    }
    if (typeof token === 'string') {
      return token;
    }
    if (typeof token.content === 'string') {
      return token.content;
    }
    return token.content.map(stringifyToken).join('');
  };
  var walkTokens = function (tokens) {
    var openedTags = [];
    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];
      var notTagNorBrace = false;
      if (typeof token !== 'string') {
        if (token.type === 'tag' && token.content[0] && token.content[0].type === 'tag') {
          // We found a tag, now find its kind

          if (token.content[0].content[0].content === '</') {
            // Closing tag
            if (openedTags.length > 0 && openedTags[openedTags.length - 1].tagName === stringifyToken(token.content[0].content[1])) {
              // Pop matching opening tag
              openedTags.pop();
            }
          } else {
            if (token.content[token.content.length - 1].content === '/>') ; else {
              // Opening tag
              openedTags.push({
                tagName: stringifyToken(token.content[0].content[1]),
                openedBraces: 0
              });
            }
          }
        } else if (openedTags.length > 0 && token.type === 'punctuation' && token.content === '{') {
          // Here we might have entered a JSX context inside a tag
          openedTags[openedTags.length - 1].openedBraces++;
        } else if (openedTags.length > 0 && openedTags[openedTags.length - 1].openedBraces > 0 && token.type === 'punctuation' && token.content === '}') {
          // Here we might have left a JSX context inside a tag
          openedTags[openedTags.length - 1].openedBraces--;
        } else {
          notTagNorBrace = true;
        }
      }
      if (notTagNorBrace || typeof token === 'string') {
        if (openedTags.length > 0 && openedTags[openedTags.length - 1].openedBraces === 0) {
          // Here we are inside a tag, and not inside a JSX context.
          // That's plain text: drop any tokens matched.
          var plainText = stringifyToken(token);

          // And merge text with adjacent text
          if (i < tokens.length - 1 && (typeof tokens[i + 1] === 'string' || tokens[i + 1].type === 'plain-text')) {
            plainText += stringifyToken(tokens[i + 1]);
            tokens.splice(i + 1, 1);
          }
          if (i > 0 && (typeof tokens[i - 1] === 'string' || tokens[i - 1].type === 'plain-text')) {
            plainText = stringifyToken(tokens[i - 1]) + plainText;
            tokens.splice(i - 1, 1);
            i--;
          }
          tokens[i] = new Prism.Token('plain-text', plainText, null, plainText);
        }
      }
      if (token.content && typeof token.content !== 'string') {
        walkTokens(token.content);
      }
    }
  };
  Prism.hooks.add('after-tokenize', function (env) {
    if (env.language !== 'jsx' && env.language !== 'tsx') {
      return;
    }
    walkTokens(env.tokens);
  });
})(Prism);

// https://www.json.org/json-en.html
Prism.languages.json = {
  'property': {
    pattern: /(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?=\s*:)/,
    lookbehind: true,
    greedy: true
  },
  'string': {
    pattern: /(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,
    lookbehind: true,
    greedy: true
  },
  'comment': {
    pattern: /\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/,
    greedy: true
  },
  'number': /-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,
  'punctuation': /[{}[\],]/,
  'operator': /:/,
  'boolean': /\b(?:false|true)\b/,
  'null': {
    pattern: /\bnull\b/,
    alias: 'keyword'
  }
};
Prism.languages.webmanifest = Prism.languages.json;
(function (Prism) {
  Prism.languages.kotlin = Prism.languages.extend('clike', {
    'keyword': {
      // The lookbehind prevents wrong highlighting of e.g. kotlin.properties.get
      pattern: /(^|[^.])\b(?:abstract|actual|annotation|as|break|by|catch|class|companion|const|constructor|continue|crossinline|data|do|dynamic|else|enum|expect|external|final|finally|for|fun|get|if|import|in|infix|init|inline|inner|interface|internal|is|lateinit|noinline|null|object|open|operator|out|override|package|private|protected|public|reified|return|sealed|set|super|suspend|tailrec|this|throw|to|try|typealias|val|var|vararg|when|where|while)\b/,
      lookbehind: true
    },
    'function': [{
      pattern: /(?:`[^\r\n`]+`|\b\w+)(?=\s*\()/,
      greedy: true
    }, {
      pattern: /(\.)(?:`[^\r\n`]+`|\w+)(?=\s*\{)/,
      lookbehind: true,
      greedy: true
    }],
    'number': /\b(?:0[xX][\da-fA-F]+(?:_[\da-fA-F]+)*|0[bB][01]+(?:_[01]+)*|\d+(?:_\d+)*(?:\.\d+(?:_\d+)*)?(?:[eE][+-]?\d+(?:_\d+)*)?[fFL]?)\b/,
    'operator': /\+[+=]?|-[-=>]?|==?=?|!(?:!|==?)?|[\/*%<>]=?|[?:]:?|\.\.|&&|\|\||\b(?:and|inv|or|shl|shr|ushr|xor)\b/
  });
  delete Prism.languages.kotlin['class-name'];
  var interpolationInside = {
    'interpolation-punctuation': {
      pattern: /^\$\{?|\}$/,
      alias: 'punctuation'
    },
    'expression': {
      pattern: /[\s\S]+/,
      inside: Prism.languages.kotlin
    }
  };
  Prism.languages.insertBefore('kotlin', 'string', {
    // https://kotlinlang.org/spec/expressions.html#string-interpolation-expressions
    'string-literal': [{
      pattern: /"""(?:[^$]|\$(?:(?!\{)|\{[^{}]*\}))*?"""/,
      alias: 'multiline',
      inside: {
        'interpolation': {
          pattern: /\$(?:[a-z_]\w*|\{[^{}]*\})/i,
          inside: interpolationInside
        },
        'string': /[\s\S]+/
      }
    }, {
      pattern: /"(?:[^"\\\r\n$]|\\.|\$(?:(?!\{)|\{[^{}]*\}))*"/,
      alias: 'singleline',
      inside: {
        'interpolation': {
          pattern: /((?:^|[^\\])(?:\\{2})*)\$(?:[a-z_]\w*|\{[^{}]*\})/i,
          lookbehind: true,
          inside: interpolationInside
        },
        'string': /[\s\S]+/
      }
    }],
    'char': {
      // https://kotlinlang.org/spec/expressions.html#character-literals
      pattern: /'(?:[^'\\\r\n]|\\(?:.|u[a-fA-F0-9]{0,4}))'/,
      greedy: true
    }
  });
  delete Prism.languages.kotlin['string'];
  Prism.languages.insertBefore('kotlin', 'keyword', {
    'annotation': {
      pattern: /\B@(?:\w+:)?(?:[A-Z]\w*|\[[^\]]+\])/,
      alias: 'builtin'
    }
  });
  Prism.languages.insertBefore('kotlin', 'function', {
    'label': {
      pattern: /\b\w+@|@\w+\b/,
      alias: 'symbol'
    }
  });
  Prism.languages.kt = Prism.languages.kotlin;
  Prism.languages.kts = Prism.languages.kotlin;
})(Prism);

/* FIXME :
 :extend() is not handled specifically : its highlighting is buggy.
 Mixin usage must be inside a ruleset to be highlighted.
 At-rules (e.g. import) containing interpolations are buggy.
 Detached rulesets are highlighted as at-rules.
 A comment before a mixin usage prevents the latter to be properly highlighted.
 */

Prism.languages.less = Prism.languages.extend('css', {
  'comment': [/\/\*[\s\S]*?\*\//, {
    pattern: /(^|[^\\])\/\/.*/,
    lookbehind: true
  }],
  'atrule': {
    pattern: /@[\w-](?:\((?:[^(){}]|\([^(){}]*\))*\)|[^(){};\s]|\s+(?!\s))*?(?=\s*\{)/,
    inside: {
      'punctuation': /[:()]/
    }
  },
  // selectors and mixins are considered the same
  'selector': {
    pattern: /(?:@\{[\w-]+\}|[^{};\s@])(?:@\{[\w-]+\}|\((?:[^(){}]|\([^(){}]*\))*\)|[^(){};@\s]|\s+(?!\s))*?(?=\s*\{)/,
    inside: {
      // mixin parameters
      'variable': /@+[\w-]+/
    }
  },
  'property': /(?:@\{[\w-]+\}|[\w-])+(?:\+_?)?(?=\s*:)/,
  'operator': /[+\-*\/]/
});
Prism.languages.insertBefore('less', 'property', {
  'variable': [
  // Variable declaration (the colon must be consumed!)
  {
    pattern: /@[\w-]+\s*:/,
    inside: {
      'punctuation': /:/
    }
  },
  // Variable usage
  /@@?[\w-]+/],
  'mixin-usage': {
    pattern: /([{;]\s*)[.#](?!\d)[\w-].*?(?=[(;])/,
    lookbehind: true,
    alias: 'function'
  }
});
Prism.languages.lua = {
  'comment': /^#!.+|--(?:\[(=*)\[[\s\S]*?\]\1\]|.*)/m,
  // \z may be used to skip the following space
  'string': {
    pattern: /(["'])(?:(?!\1)[^\\\r\n]|\\z(?:\r\n|\s)|\\(?:\r\n|[^z]))*\1|\[(=*)\[[\s\S]*?\]\2\]/,
    greedy: true
  },
  'number': /\b0x[a-f\d]+(?:\.[a-f\d]*)?(?:p[+-]?\d+)?\b|\b\d+(?:\.\B|(?:\.\d*)?(?:e[+-]?\d+)?\b)|\B\.\d+(?:e[+-]?\d+)?\b/i,
  'keyword': /\b(?:and|break|do|else|elseif|end|false|for|function|goto|if|in|local|nil|not|or|repeat|return|then|true|until|while)\b/,
  'function': /(?!\d)\w+(?=\s*(?:[({]))/,
  'operator': [/[-+*%^&|#]|\/\/?|<[<=]?|>[>=]?|[=~]=?/, {
    // Match ".." but don't break "..."
    pattern: /(^|[^.])\.\.(?!\.)/,
    lookbehind: true
  }],
  'punctuation': /[\[\](){},;]|\.+|:+/
};
Prism.languages.makefile = {
  'comment': {
    pattern: /(^|[^\\])#(?:\\(?:\r\n|[\s\S])|[^\\\r\n])*/,
    lookbehind: true
  },
  'string': {
    pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
    greedy: true
  },
  'builtin-target': {
    pattern: /\.[A-Z][^:#=\s]+(?=\s*:(?!=))/,
    alias: 'builtin'
  },
  'target': {
    pattern: /^(?:[^:=\s]|[ \t]+(?![\s:]))+(?=\s*:(?!=))/m,
    alias: 'symbol',
    inside: {
      'variable': /\$+(?:(?!\$)[^(){}:#=\s]+|(?=[({]))/
    }
  },
  'variable': /\$+(?:(?!\$)[^(){}:#=\s]+|\([@*%<^+?][DF]\)|(?=[({]))/,
  // Directives
  'keyword': /-include\b|\b(?:define|else|endef|endif|export|ifn?def|ifn?eq|include|override|private|sinclude|undefine|unexport|vpath)\b/,
  'function': {
    pattern: /(\()(?:abspath|addsuffix|and|basename|call|dir|error|eval|file|filter(?:-out)?|findstring|firstword|flavor|foreach|guile|if|info|join|lastword|load|notdir|or|origin|patsubst|realpath|shell|sort|strip|subst|suffix|value|warning|wildcard|word(?:list|s)?)(?=[ \t])/,
    lookbehind: true
  },
  'operator': /(?:::|[?:+!])?=|[|@]/,
  'punctuation': /[:;(){}]/
};
(function (Prism) {
  // https://yaml.org/spec/1.2/spec.html#c-ns-anchor-property
  // https://yaml.org/spec/1.2/spec.html#c-ns-alias-node
  var anchorOrAlias = /[*&][^\s[\]{},]+/;
  // https://yaml.org/spec/1.2/spec.html#c-ns-tag-property
  var tag = /!(?:<[\w\-%#;/?:@&=+$,.!~*'()[\]]+>|(?:[a-zA-Z\d-]*!)?[\w\-%#;/?:@&=+$.~*'()]+)?/;
  // https://yaml.org/spec/1.2/spec.html#c-ns-properties(n,c)
  var properties = '(?:' + tag.source + '(?:[ \t]+' + anchorOrAlias.source + ')?|' + anchorOrAlias.source + '(?:[ \t]+' + tag.source + ')?)';
  // https://yaml.org/spec/1.2/spec.html#ns-plain(n,c)
  // This is a simplified version that doesn't support "#" and multiline keys
  // All these long scarry character classes are simplified versions of YAML's characters
  var plainKey = /(?:[^\s\x00-\x08\x0e-\x1f!"#%&'*,\-:>?@[\]`{|}\x7f-\x84\x86-\x9f\ud800-\udfff\ufffe\uffff]|[?:-]<PLAIN>)(?:[ \t]*(?:(?![#:])<PLAIN>|:<PLAIN>))*/.source.replace(/<PLAIN>/g, function () {
    return /[^\s\x00-\x08\x0e-\x1f,[\]{}\x7f-\x84\x86-\x9f\ud800-\udfff\ufffe\uffff]/.source;
  });
  var string = /"(?:[^"\\\r\n]|\\.)*"|'(?:[^'\\\r\n]|\\.)*'/.source;

  /**
   *
   * @param {string} value
   * @param {string} [flags]
   * @returns {RegExp}
   */
  function createValuePattern(value, flags) {
    flags = (flags || '').replace(/m/g, '') + 'm'; // add m flag
    var pattern = /([:\-,[{]\s*(?:\s<<prop>>[ \t]+)?)(?:<<value>>)(?=[ \t]*(?:$|,|\]|\}|(?:[\r\n]\s*)?#))/.source.replace(/<<prop>>/g, function () {
      return properties;
    }).replace(/<<value>>/g, function () {
      return value;
    });
    return RegExp(pattern, flags);
  }
  Prism.languages.yaml = {
    'scalar': {
      pattern: RegExp(/([\-:]\s*(?:\s<<prop>>[ \t]+)?[|>])[ \t]*(?:((?:\r?\n|\r)[ \t]+)\S[^\r\n]*(?:\2[^\r\n]+)*)/.source.replace(/<<prop>>/g, function () {
        return properties;
      })),
      lookbehind: true,
      alias: 'string'
    },
    'comment': /#.*/,
    'key': {
      pattern: RegExp(/((?:^|[:\-,[{\r\n?])[ \t]*(?:<<prop>>[ \t]+)?)<<key>>(?=\s*:\s)/.source.replace(/<<prop>>/g, function () {
        return properties;
      }).replace(/<<key>>/g, function () {
        return '(?:' + plainKey + '|' + string + ')';
      })),
      lookbehind: true,
      greedy: true,
      alias: 'atrule'
    },
    'directive': {
      pattern: /(^[ \t]*)%.+/m,
      lookbehind: true,
      alias: 'important'
    },
    'datetime': {
      pattern: createValuePattern(/\d{4}-\d\d?-\d\d?(?:[tT]|[ \t]+)\d\d?:\d{2}:\d{2}(?:\.\d*)?(?:[ \t]*(?:Z|[-+]\d\d?(?::\d{2})?))?|\d{4}-\d{2}-\d{2}|\d\d?:\d{2}(?::\d{2}(?:\.\d*)?)?/.source),
      lookbehind: true,
      alias: 'number'
    },
    'boolean': {
      pattern: createValuePattern(/false|true/.source, 'i'),
      lookbehind: true,
      alias: 'important'
    },
    'null': {
      pattern: createValuePattern(/null|~/.source, 'i'),
      lookbehind: true,
      alias: 'important'
    },
    'string': {
      pattern: createValuePattern(string),
      lookbehind: true,
      greedy: true
    },
    'number': {
      pattern: createValuePattern(/[+-]?(?:0x[\da-f]+|0o[0-7]+|(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?|\.inf|\.nan)/.source, 'i'),
      lookbehind: true
    },
    'tag': tag,
    'important': anchorOrAlias,
    'punctuation': /---|[:[\]{}\-,|>?]|\.\.\./
  };
  Prism.languages.yml = Prism.languages.yaml;
})(Prism);
(function (Prism) {
  // Allow only one line break
  var inner = /(?:\\.|[^\\\n\r]|(?:\n|\r\n?)(?![\r\n]))/.source;

  /**
   * This function is intended for the creation of the bold or italic pattern.
   *
   * This also adds a lookbehind group to the given pattern to ensure that the pattern is not backslash-escaped.
   *
   * _Note:_ Keep in mind that this adds a capturing group.
   *
   * @param {string} pattern
   * @returns {RegExp}
   */
  function createInline(pattern) {
    pattern = pattern.replace(/<inner>/g, function () {
      return inner;
    });
    return RegExp(/((?:^|[^\\])(?:\\{2})*)/.source + '(?:' + pattern + ')');
  }
  var tableCell = /(?:\\.|``(?:[^`\r\n]|`(?!`))+``|`[^`\r\n]+`|[^\\|\r\n`])+/.source;
  var tableRow = /\|?__(?:\|__)+\|?(?:(?:\n|\r\n?)|(?![\s\S]))/.source.replace(/__/g, function () {
    return tableCell;
  });
  var tableLine = /\|?[ \t]*:?-{3,}:?[ \t]*(?:\|[ \t]*:?-{3,}:?[ \t]*)+\|?(?:\n|\r\n?)/.source;
  Prism.languages.markdown = Prism.languages.extend('markup', {});
  Prism.languages.insertBefore('markdown', 'prolog', {
    'front-matter-block': {
      pattern: /(^(?:\s*[\r\n])?)---(?!.)[\s\S]*?[\r\n]---(?!.)/,
      lookbehind: true,
      greedy: true,
      inside: {
        'punctuation': /^---|---$/,
        'front-matter': {
          pattern: /\S+(?:\s+\S+)*/,
          alias: ['yaml', 'language-yaml'],
          inside: Prism.languages.yaml
        }
      }
    },
    'blockquote': {
      // > ...
      pattern: /^>(?:[\t ]*>)*/m,
      alias: 'punctuation'
    },
    'table': {
      pattern: RegExp('^' + tableRow + tableLine + '(?:' + tableRow + ')*', 'm'),
      inside: {
        'table-data-rows': {
          pattern: RegExp('^(' + tableRow + tableLine + ')(?:' + tableRow + ')*$'),
          lookbehind: true,
          inside: {
            'table-data': {
              pattern: RegExp(tableCell),
              inside: Prism.languages.markdown
            },
            'punctuation': /\|/
          }
        },
        'table-line': {
          pattern: RegExp('^(' + tableRow + ')' + tableLine + '$'),
          lookbehind: true,
          inside: {
            'punctuation': /\||:?-{3,}:?/
          }
        },
        'table-header-row': {
          pattern: RegExp('^' + tableRow + '$'),
          inside: {
            'table-header': {
              pattern: RegExp(tableCell),
              alias: 'important',
              inside: Prism.languages.markdown
            },
            'punctuation': /\|/
          }
        }
      }
    },
    'code': [{
      // Prefixed by 4 spaces or 1 tab and preceded by an empty line
      pattern: /((?:^|\n)[ \t]*\n|(?:^|\r\n?)[ \t]*\r\n?)(?: {4}|\t).+(?:(?:\n|\r\n?)(?: {4}|\t).+)*/,
      lookbehind: true,
      alias: 'keyword'
    }, {
      // ```optional language
      // code block
      // ```
      pattern: /^```[\s\S]*?^```$/m,
      greedy: true,
      inside: {
        'code-block': {
          pattern: /^(```.*(?:\n|\r\n?))[\s\S]+?(?=(?:\n|\r\n?)^```$)/m,
          lookbehind: true
        },
        'code-language': {
          pattern: /^(```).+/,
          lookbehind: true
        },
        'punctuation': /```/
      }
    }],
    'title': [{
      // title 1
      // =======

      // title 2
      // -------
      pattern: /\S.*(?:\n|\r\n?)(?:==+|--+)(?=[ \t]*$)/m,
      alias: 'important',
      inside: {
        punctuation: /==+$|--+$/
      }
    }, {
      // # title 1
      // ###### title 6
      pattern: /(^\s*)#.+/m,
      lookbehind: true,
      alias: 'important',
      inside: {
        punctuation: /^#+|#+$/
      }
    }],
    'hr': {
      // ***
      // ---
      // * * *
      // -----------
      pattern: /(^\s*)([*-])(?:[\t ]*\2){2,}(?=\s*$)/m,
      lookbehind: true,
      alias: 'punctuation'
    },
    'list': {
      // * item
      // + item
      // - item
      // 1. item
      pattern: /(^\s*)(?:[*+-]|\d+\.)(?=[\t ].)/m,
      lookbehind: true,
      alias: 'punctuation'
    },
    'url-reference': {
      // [id]: http://example.com "Optional title"
      // [id]: http://example.com 'Optional title'
      // [id]: http://example.com (Optional title)
      // [id]: <http://example.com> "Optional title"
      pattern: /!?\[[^\]]+\]:[\t ]+(?:\S+|<(?:\\.|[^>\\])+>)(?:[\t ]+(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\)))?/,
      inside: {
        'variable': {
          pattern: /^(!?\[)[^\]]+/,
          lookbehind: true
        },
        'string': /(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\))$/,
        'punctuation': /^[\[\]!:]|[<>]/
      },
      alias: 'url'
    },
    'bold': {
      // **strong**
      // __strong__

      // allow one nested instance of italic text using the same delimiter
      pattern: createInline(/\b__(?:(?!_)<inner>|_(?:(?!_)<inner>)+_)+__\b|\*\*(?:(?!\*)<inner>|\*(?:(?!\*)<inner>)+\*)+\*\*/.source),
      lookbehind: true,
      greedy: true,
      inside: {
        'content': {
          pattern: /(^..)[\s\S]+(?=..$)/,
          lookbehind: true,
          inside: {} // see below
        },

        'punctuation': /\*\*|__/
      }
    },
    'italic': {
      // *em*
      // _em_

      // allow one nested instance of bold text using the same delimiter
      pattern: createInline(/\b_(?:(?!_)<inner>|__(?:(?!_)<inner>)+__)+_\b|\*(?:(?!\*)<inner>|\*\*(?:(?!\*)<inner>)+\*\*)+\*/.source),
      lookbehind: true,
      greedy: true,
      inside: {
        'content': {
          pattern: /(^.)[\s\S]+(?=.$)/,
          lookbehind: true,
          inside: {} // see below
        },

        'punctuation': /[*_]/
      }
    },
    'strike': {
      // ~~strike through~~
      // ~strike~
      // eslint-disable-next-line regexp/strict
      pattern: createInline(/(~~?)(?:(?!~)<inner>)+\2/.source),
      lookbehind: true,
      greedy: true,
      inside: {
        'content': {
          pattern: /(^~~?)[\s\S]+(?=\1$)/,
          lookbehind: true,
          inside: {} // see below
        },

        'punctuation': /~~?/
      }
    },
    'code-snippet': {
      // `code`
      // ``code``
      pattern: /(^|[^\\`])(?:``[^`\r\n]+(?:`[^`\r\n]+)*``(?!`)|`[^`\r\n]+`(?!`))/,
      lookbehind: true,
      greedy: true,
      alias: ['code', 'keyword']
    },
    'url': {
      // [example](http://example.com "Optional title")
      // [example][id]
      // [example] [id]
      pattern: createInline(/!?\[(?:(?!\])<inner>)+\](?:\([^\s)]+(?:[\t ]+"(?:\\.|[^"\\])*")?\)|[ \t]?\[(?:(?!\])<inner>)+\])/.source),
      lookbehind: true,
      greedy: true,
      inside: {
        'operator': /^!/,
        'content': {
          pattern: /(^\[)[^\]]+(?=\])/,
          lookbehind: true,
          inside: {} // see below
        },

        'variable': {
          pattern: /(^\][ \t]?\[)[^\]]+(?=\]$)/,
          lookbehind: true
        },
        'url': {
          pattern: /(^\]\()[^\s)]+/,
          lookbehind: true
        },
        'string': {
          pattern: /(^[ \t]+)"(?:\\.|[^"\\])*"(?=\)$)/,
          lookbehind: true
        }
      }
    }
  });
  ['url', 'bold', 'italic', 'strike'].forEach(function (token) {
    ['url', 'bold', 'italic', 'strike', 'code-snippet'].forEach(function (inside) {
      if (token !== inside) {
        Prism.languages.markdown[token].inside.content.inside[inside] = Prism.languages.markdown[inside];
      }
    });
  });
  Prism.hooks.add('after-tokenize', function (env) {
    if (env.language !== 'markdown' && env.language !== 'md') {
      return;
    }
    function walkTokens(tokens) {
      if (!tokens || typeof tokens === 'string') {
        return;
      }
      for (var i = 0, l = tokens.length; i < l; i++) {
        var token = tokens[i];
        if (token.type !== 'code') {
          walkTokens(token.content);
          continue;
        }

        /*
         * Add the correct `language-xxxx` class to this code block. Keep in mind that the `code-language` token
         * is optional. But the grammar is defined so that there is only one case we have to handle:
         *
         * token.content = [
         *     <span class="punctuation">```</span>,
         *     <span class="code-language">xxxx</span>,
         *     '\n', // exactly one new lines (\r or \n or \r\n)
         *     <span class="code-block">...</span>,
         *     '\n', // exactly one new lines again
         *     <span class="punctuation">```</span>
         * ];
         */

        var codeLang = token.content[1];
        var codeBlock = token.content[3];
        if (codeLang && codeBlock && codeLang.type === 'code-language' && codeBlock.type === 'code-block' && typeof codeLang.content === 'string') {
          // this might be a language that Prism does not support

          // do some replacements to support C++, C#, and F#
          var lang = codeLang.content.replace(/\b#/g, 'sharp').replace(/\b\+\+/g, 'pp');
          // only use the first word
          lang = (/[a-z][\w-]*/i.exec(lang) || [''])[0].toLowerCase();
          var alias = 'language-' + lang;

          // add alias
          if (!codeBlock.alias) {
            codeBlock.alias = [alias];
          } else if (typeof codeBlock.alias === 'string') {
            codeBlock.alias = [codeBlock.alias, alias];
          } else {
            codeBlock.alias.push(alias);
          }
        }
      }
    }
    walkTokens(env.tokens);
  });
  Prism.hooks.add('wrap', function (env) {
    if (env.type !== 'code-block') {
      return;
    }
    var codeLang = '';
    for (var i = 0, l = env.classes.length; i < l; i++) {
      var cls = env.classes[i];
      var match = /language-(.+)/.exec(cls);
      if (match) {
        codeLang = match[1];
        break;
      }
    }
    var grammar = Prism.languages[codeLang];
    if (!grammar) {
      if (codeLang && codeLang !== 'none' && Prism.plugins.autoloader) {
        var id = 'md-' + new Date().valueOf() + '-' + Math.floor(Math.random() * 1e16);
        env.attributes['id'] = id;
        Prism.plugins.autoloader.loadLanguages(codeLang, function () {
          var ele = document.getElementById(id);
          if (ele) {
            ele.innerHTML = Prism.highlight(ele.textContent, Prism.languages[codeLang], codeLang);
          }
        });
      }
    } else {
      env.content = Prism.highlight(textContent(env.content), grammar, codeLang);
    }
  });
  var tagPattern = RegExp(Prism.languages.markup.tag.pattern.source, 'gi');

  /**
   * A list of known entity names.
   *
   * This will always be incomplete to save space. The current list is the one used by lowdash's unescape function.
   *
   * @see {@link https://github.com/lodash/lodash/blob/2da024c3b4f9947a48517639de7560457cd4ec6c/unescape.js#L2}
   */
  var KNOWN_ENTITY_NAMES = {
    'amp': '&',
    'lt': '<',
    'gt': '>',
    'quot': '"'
  };

  // IE 11 doesn't support `String.fromCodePoint`
  var fromCodePoint = String.fromCodePoint || String.fromCharCode;

  /**
   * Returns the text content of a given HTML source code string.
   *
   * @param {string} html
   * @returns {string}
   */
  function textContent(html) {
    // remove all tags
    var text = html.replace(tagPattern, '');

    // decode known entities
    text = text.replace(/&(\w{1,8}|#x?[\da-f]{1,8});/gi, function (m, code) {
      code = code.toLowerCase();
      if (code[0] === '#') {
        var value;
        if (code[1] === 'x') {
          value = parseInt(code.slice(2), 16);
        } else {
          value = Number(code.slice(1));
        }
        return fromCodePoint(value);
      } else {
        var known = KNOWN_ENTITY_NAMES[code];
        if (known) {
          return known;
        }

        // unable to decode
        return m;
      }
    });
    return text;
  }
  Prism.languages.md = Prism.languages.markdown;
})(Prism);
Prism.languages.objectivec = Prism.languages.extend('c', {
  'string': {
    pattern: /@?"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"/,
    greedy: true
  },
  'keyword': /\b(?:asm|auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|in|inline|int|long|register|return|self|short|signed|sizeof|static|struct|super|switch|typedef|typeof|union|unsigned|void|volatile|while)\b|(?:@interface|@end|@implementation|@protocol|@class|@public|@protected|@private|@property|@try|@catch|@finally|@throw|@synthesize|@dynamic|@selector)\b/,
  'operator': /-[->]?|\+\+?|!=?|<<?=?|>>?=?|==?|&&?|\|\|?|[~^%?*\/@]/
});
delete Prism.languages.objectivec['class-name'];
Prism.languages.objc = Prism.languages.objectivec;
(function (Prism) {
  var brackets = /(?:\((?:[^()\\]|\\[\s\S])*\)|\{(?:[^{}\\]|\\[\s\S])*\}|\[(?:[^[\]\\]|\\[\s\S])*\]|<(?:[^<>\\]|\\[\s\S])*>)/.source;
  Prism.languages.perl = {
    'comment': [{
      // POD
      pattern: /(^\s*)=\w[\s\S]*?=cut.*/m,
      lookbehind: true,
      greedy: true
    }, {
      pattern: /(^|[^\\$])#.*/,
      lookbehind: true,
      greedy: true
    }],
    // TODO Could be nice to handle Heredoc too.
    'string': [{
      pattern: RegExp(/\b(?:q|qq|qw|qx)(?![a-zA-Z0-9])\s*/.source + '(?:' + [
      // q/.../
      /([^a-zA-Z0-9\s{(\[<])(?:(?!\1)[^\\]|\\[\s\S])*\1/.source,
      // q a...a
      // eslint-disable-next-line regexp/strict
      /([a-zA-Z0-9])(?:(?!\2)[^\\]|\\[\s\S])*\2/.source,
      // q(...)
      // q{...}
      // q[...]
      // q<...>
      brackets].join('|') + ')'),
      greedy: true
    },
    // "...", `...`
    {
      pattern: /("|`)(?:(?!\1)[^\\]|\\[\s\S])*\1/,
      greedy: true
    },
    // '...'
    // FIXME Multi-line single-quoted strings are not supported as they would break variables containing '
    {
      pattern: /'(?:[^'\\\r\n]|\\.)*'/,
      greedy: true
    }],
    'regex': [{
      pattern: RegExp(/\b(?:m|qr)(?![a-zA-Z0-9])\s*/.source + '(?:' + [
      // m/.../
      /([^a-zA-Z0-9\s{(\[<])(?:(?!\1)[^\\]|\\[\s\S])*\1/.source,
      // m a...a
      // eslint-disable-next-line regexp/strict
      /([a-zA-Z0-9])(?:(?!\2)[^\\]|\\[\s\S])*\2/.source,
      // m(...)
      // m{...}
      // m[...]
      // m<...>
      brackets].join('|') + ')' + /[msixpodualngc]*/.source),
      greedy: true
    },
    // The lookbehinds prevent -s from breaking
    {
      pattern: RegExp(/(^|[^-])\b(?:s|tr|y)(?![a-zA-Z0-9])\s*/.source + '(?:' + [
      // s/.../.../
      // eslint-disable-next-line regexp/strict
      /([^a-zA-Z0-9\s{(\[<])(?:(?!\2)[^\\]|\\[\s\S])*\2(?:(?!\2)[^\\]|\\[\s\S])*\2/.source,
      // s a...a...a
      // eslint-disable-next-line regexp/strict
      /([a-zA-Z0-9])(?:(?!\3)[^\\]|\\[\s\S])*\3(?:(?!\3)[^\\]|\\[\s\S])*\3/.source,
      // s(...)(...)
      // s{...}{...}
      // s[...][...]
      // s<...><...>
      // s(...)[...]
      brackets + /\s*/.source + brackets].join('|') + ')' + /[msixpodualngcer]*/.source),
      lookbehind: true,
      greedy: true
    },
    // /.../
    // The look-ahead tries to prevent two divisions on
    // the same line from being highlighted as regex.
    // This does not support multi-line regex.
    {
      pattern: /\/(?:[^\/\\\r\n]|\\.)*\/[msixpodualngc]*(?=\s*(?:$|[\r\n,.;})&|\-+*~<>!?^]|(?:and|cmp|eq|ge|gt|le|lt|ne|not|or|x|xor)\b))/,
      greedy: true
    }],
    // FIXME Not sure about the handling of ::, ', and #
    'variable': [
    // ${^POSTMATCH}
    /[&*$@%]\{\^[A-Z]+\}/,
    // $^V
    /[&*$@%]\^[A-Z_]/,
    // ${...}
    /[&*$@%]#?(?=\{)/,
    // $foo
    /[&*$@%]#?(?:(?:::)*'?(?!\d)[\w$]+(?![\w$]))+(?:::)*/,
    // $1
    /[&*$@%]\d+/,
    // $_, @_, %!
    // The negative lookahead prevents from breaking the %= operator
    /(?!%=)[$@%][!"#$%&'()*+,\-.\/:;<=>?@[\\\]^_`{|}~]/],
    'filehandle': {
      // <>, <FOO>, _
      pattern: /<(?![<=])\S*?>|\b_\b/,
      alias: 'symbol'
    },
    'v-string': {
      // v1.2, 1.2.3
      pattern: /v\d+(?:\.\d+)*|\d+(?:\.\d+){2,}/,
      alias: 'string'
    },
    'function': {
      pattern: /(\bsub[ \t]+)\w+/,
      lookbehind: true
    },
    'keyword': /\b(?:any|break|continue|default|delete|die|do|else|elsif|eval|for|foreach|given|goto|if|last|local|my|next|our|package|print|redo|require|return|say|state|sub|switch|undef|unless|until|use|when|while)\b/,
    'number': /\b(?:0x[\dA-Fa-f](?:_?[\dA-Fa-f])*|0b[01](?:_?[01])*|(?:(?:\d(?:_?\d)*)?\.)?\d(?:_?\d)*(?:[Ee][+-]?\d+)?)\b/,
    'operator': /-[rwxoRWXOezsfdlpSbctugkTBMAC]\b|\+[+=]?|-[-=>]?|\*\*?=?|\/\/?=?|=[=~>]?|~[~=]?|\|\|?=?|&&?=?|<(?:=>?|<=?)?|>>?=?|![~=]?|[%^]=?|\.(?:=|\.\.?)?|[\\?]|\bx(?:=|\b)|\b(?:and|cmp|eq|ge|gt|le|lt|ne|not|or|xor)\b/,
    'punctuation': /[{}[\];(),:]/
  };
})(Prism);
(function (Prism) {
  /**
   * Returns the placeholder for the given language id and index.
   *
   * @param {string} language
   * @param {string|number} index
   * @returns {string}
   */
  function getPlaceholder(language, index) {
    return '___' + language.toUpperCase() + index + '___';
  }
  Object.defineProperties(Prism.languages['markup-templating'] = {}, {
    buildPlaceholders: {
      /**
       * Tokenize all inline templating expressions matching `placeholderPattern`.
       *
       * If `replaceFilter` is provided, only matches of `placeholderPattern` for which `replaceFilter` returns
       * `true` will be replaced.
       *
       * @param {object} env The environment of the `before-tokenize` hook.
       * @param {string} language The language id.
       * @param {RegExp} placeholderPattern The matches of this pattern will be replaced by placeholders.
       * @param {(match: string) => boolean} [replaceFilter]
       */
      value: function (env, language, placeholderPattern, replaceFilter) {
        if (env.language !== language) {
          return;
        }
        var tokenStack = env.tokenStack = [];
        env.code = env.code.replace(placeholderPattern, function (match) {
          if (typeof replaceFilter === 'function' && !replaceFilter(match)) {
            return match;
          }
          var i = tokenStack.length;
          var placeholder;

          // Check for existing strings
          while (env.code.indexOf(placeholder = getPlaceholder(language, i)) !== -1) {
            ++i;
          }

          // Create a sparse array
          tokenStack[i] = match;
          return placeholder;
        });

        // Switch the grammar to markup
        env.grammar = Prism.languages.markup;
      }
    },
    tokenizePlaceholders: {
      /**
       * Replace placeholders with proper tokens after tokenizing.
       *
       * @param {object} env The environment of the `after-tokenize` hook.
       * @param {string} language The language id.
       */
      value: function (env, language) {
        if (env.language !== language || !env.tokenStack) {
          return;
        }

        // Switch the grammar back
        env.grammar = Prism.languages[language];
        var j = 0;
        var keys = Object.keys(env.tokenStack);
        function walkTokens(tokens) {
          for (var i = 0; i < tokens.length; i++) {
            // all placeholders are replaced already
            if (j >= keys.length) {
              break;
            }
            var token = tokens[i];
            if (typeof token === 'string' || token.content && typeof token.content === 'string') {
              var k = keys[j];
              var t = env.tokenStack[k];
              var s = typeof token === 'string' ? token : token.content;
              var placeholder = getPlaceholder(language, k);
              var index = s.indexOf(placeholder);
              if (index > -1) {
                ++j;
                var before = s.substring(0, index);
                var middle = new Prism.Token(language, Prism.tokenize(t, env.grammar), 'language-' + language, t);
                var after = s.substring(index + placeholder.length);
                var replacement = [];
                if (before) {
                  replacement.push.apply(replacement, walkTokens([before]));
                }
                replacement.push(middle);
                if (after) {
                  replacement.push.apply(replacement, walkTokens([after]));
                }
                if (typeof token === 'string') {
                  tokens.splice.apply(tokens, [i, 1].concat(replacement));
                } else {
                  token.content = replacement;
                }
              }
            } else if (token.content /* && typeof token.content !== 'string' */) {
              walkTokens(token.content);
            }
          }
          return tokens;
        }
        walkTokens(env.tokens);
      }
    }
  });
})(Prism);

/**
 * Original by Aaron Harun: http://aahacreative.com/2012/07/31/php-syntax-highlighting-prism/
 * Modified by Miles Johnson: http://milesj.me
 * Rewritten by Tom Pavelec
 *
 * Supports PHP 5.3 - 8.0
 */
(function (Prism) {
  var comment = /\/\*[\s\S]*?\*\/|\/\/.*|#(?!\[).*/;
  var constant = [{
    pattern: /\b(?:false|true)\b/i,
    alias: 'boolean'
  }, {
    pattern: /(::\s*)\b[a-z_]\w*\b(?!\s*\()/i,
    greedy: true,
    lookbehind: true
  }, {
    pattern: /(\b(?:case|const)\s+)\b[a-z_]\w*(?=\s*[;=])/i,
    greedy: true,
    lookbehind: true
  }, /\b(?:null)\b/i, /\b[A-Z_][A-Z0-9_]*\b(?!\s*\()/];
  var number = /\b0b[01]+(?:_[01]+)*\b|\b0o[0-7]+(?:_[0-7]+)*\b|\b0x[\da-f]+(?:_[\da-f]+)*\b|(?:\b\d+(?:_\d+)*\.?(?:\d+(?:_\d+)*)?|\B\.\d+)(?:e[+-]?\d+)?/i;
  var operator = /<?=>|\?\?=?|\.{3}|\??->|[!=]=?=?|::|\*\*=?|--|\+\+|&&|\|\||<<|>>|[?~]|[/^|%*&<>.+-]=?/;
  var punctuation = /[{}\[\](),:;]/;
  Prism.languages.php = {
    'delimiter': {
      pattern: /\?>$|^<\?(?:php(?=\s)|=)?/i,
      alias: 'important'
    },
    'comment': comment,
    'variable': /\$+(?:\w+\b|(?=\{))/,
    'package': {
      pattern: /(namespace\s+|use\s+(?:function\s+)?)(?:\\?\b[a-z_]\w*)+\b(?!\\)/i,
      lookbehind: true,
      inside: {
        'punctuation': /\\/
      }
    },
    'class-name-definition': {
      pattern: /(\b(?:class|enum|interface|trait)\s+)\b[a-z_]\w*(?!\\)\b/i,
      lookbehind: true,
      alias: 'class-name'
    },
    'function-definition': {
      pattern: /(\bfunction\s+)[a-z_]\w*(?=\s*\()/i,
      lookbehind: true,
      alias: 'function'
    },
    'keyword': [{
      pattern: /(\(\s*)\b(?:array|bool|boolean|float|int|integer|object|string)\b(?=\s*\))/i,
      alias: 'type-casting',
      greedy: true,
      lookbehind: true
    }, {
      pattern: /([(,?]\s*)\b(?:array(?!\s*\()|bool|callable|(?:false|null)(?=\s*\|)|float|int|iterable|mixed|object|self|static|string)\b(?=\s*\$)/i,
      alias: 'type-hint',
      greedy: true,
      lookbehind: true
    }, {
      pattern: /(\)\s*:\s*(?:\?\s*)?)\b(?:array(?!\s*\()|bool|callable|(?:false|null)(?=\s*\|)|float|int|iterable|mixed|never|object|self|static|string|void)\b/i,
      alias: 'return-type',
      greedy: true,
      lookbehind: true
    }, {
      pattern: /\b(?:array(?!\s*\()|bool|float|int|iterable|mixed|object|string|void)\b/i,
      alias: 'type-declaration',
      greedy: true
    }, {
      pattern: /(\|\s*)(?:false|null)\b|\b(?:false|null)(?=\s*\|)/i,
      alias: 'type-declaration',
      greedy: true,
      lookbehind: true
    }, {
      pattern: /\b(?:parent|self|static)(?=\s*::)/i,
      alias: 'static-context',
      greedy: true
    }, {
      // yield from
      pattern: /(\byield\s+)from\b/i,
      lookbehind: true
    },
    // `class` is always a keyword unlike other keywords
    /\bclass\b/i, {
      // https://www.php.net/manual/en/reserved.keywords.php
      //
      // keywords cannot be preceded by "->"
      // the complex lookbehind means `(?<!(?:->|::)\s*)`
      pattern: /((?:^|[^\s>:]|(?:^|[^-])>|(?:^|[^:]):)\s*)\b(?:abstract|and|array|as|break|callable|case|catch|clone|const|continue|declare|default|die|do|echo|else|elseif|empty|enddeclare|endfor|endforeach|endif|endswitch|endwhile|enum|eval|exit|extends|final|finally|fn|for|foreach|function|global|goto|if|implements|include|include_once|instanceof|insteadof|interface|isset|list|match|namespace|never|new|or|parent|print|private|protected|public|readonly|require|require_once|return|self|static|switch|throw|trait|try|unset|use|var|while|xor|yield|__halt_compiler)\b/i,
      lookbehind: true
    }],
    'argument-name': {
      pattern: /([(,]\s*)\b[a-z_]\w*(?=\s*:(?!:))/i,
      lookbehind: true
    },
    'class-name': [{
      pattern: /(\b(?:extends|implements|instanceof|new(?!\s+self|\s+static))\s+|\bcatch\s*\()\b[a-z_]\w*(?!\\)\b/i,
      greedy: true,
      lookbehind: true
    }, {
      pattern: /(\|\s*)\b[a-z_]\w*(?!\\)\b/i,
      greedy: true,
      lookbehind: true
    }, {
      pattern: /\b[a-z_]\w*(?!\\)\b(?=\s*\|)/i,
      greedy: true
    }, {
      pattern: /(\|\s*)(?:\\?\b[a-z_]\w*)+\b/i,
      alias: 'class-name-fully-qualified',
      greedy: true,
      lookbehind: true,
      inside: {
        'punctuation': /\\/
      }
    }, {
      pattern: /(?:\\?\b[a-z_]\w*)+\b(?=\s*\|)/i,
      alias: 'class-name-fully-qualified',
      greedy: true,
      inside: {
        'punctuation': /\\/
      }
    }, {
      pattern: /(\b(?:extends|implements|instanceof|new(?!\s+self\b|\s+static\b))\s+|\bcatch\s*\()(?:\\?\b[a-z_]\w*)+\b(?!\\)/i,
      alias: 'class-name-fully-qualified',
      greedy: true,
      lookbehind: true,
      inside: {
        'punctuation': /\\/
      }
    }, {
      pattern: /\b[a-z_]\w*(?=\s*\$)/i,
      alias: 'type-declaration',
      greedy: true
    }, {
      pattern: /(?:\\?\b[a-z_]\w*)+(?=\s*\$)/i,
      alias: ['class-name-fully-qualified', 'type-declaration'],
      greedy: true,
      inside: {
        'punctuation': /\\/
      }
    }, {
      pattern: /\b[a-z_]\w*(?=\s*::)/i,
      alias: 'static-context',
      greedy: true
    }, {
      pattern: /(?:\\?\b[a-z_]\w*)+(?=\s*::)/i,
      alias: ['class-name-fully-qualified', 'static-context'],
      greedy: true,
      inside: {
        'punctuation': /\\/
      }
    }, {
      pattern: /([(,?]\s*)[a-z_]\w*(?=\s*\$)/i,
      alias: 'type-hint',
      greedy: true,
      lookbehind: true
    }, {
      pattern: /([(,?]\s*)(?:\\?\b[a-z_]\w*)+(?=\s*\$)/i,
      alias: ['class-name-fully-qualified', 'type-hint'],
      greedy: true,
      lookbehind: true,
      inside: {
        'punctuation': /\\/
      }
    }, {
      pattern: /(\)\s*:\s*(?:\?\s*)?)\b[a-z_]\w*(?!\\)\b/i,
      alias: 'return-type',
      greedy: true,
      lookbehind: true
    }, {
      pattern: /(\)\s*:\s*(?:\?\s*)?)(?:\\?\b[a-z_]\w*)+\b(?!\\)/i,
      alias: ['class-name-fully-qualified', 'return-type'],
      greedy: true,
      lookbehind: true,
      inside: {
        'punctuation': /\\/
      }
    }],
    'constant': constant,
    'function': {
      pattern: /(^|[^\\\w])\\?[a-z_](?:[\w\\]*\w)?(?=\s*\()/i,
      lookbehind: true,
      inside: {
        'punctuation': /\\/
      }
    },
    'property': {
      pattern: /(->\s*)\w+/,
      lookbehind: true
    },
    'number': number,
    'operator': operator,
    'punctuation': punctuation
  };
  var string_interpolation = {
    pattern: /\{\$(?:\{(?:\{[^{}]+\}|[^{}]+)\}|[^{}])+\}|(^|[^\\{])\$+(?:\w+(?:\[[^\r\n\[\]]+\]|->\w+)?)/,
    lookbehind: true,
    inside: Prism.languages.php
  };
  var string = [{
    pattern: /<<<'([^']+)'[\r\n](?:.*[\r\n])*?\1;/,
    alias: 'nowdoc-string',
    greedy: true,
    inside: {
      'delimiter': {
        pattern: /^<<<'[^']+'|[a-z_]\w*;$/i,
        alias: 'symbol',
        inside: {
          'punctuation': /^<<<'?|[';]$/
        }
      }
    }
  }, {
    pattern: /<<<(?:"([^"]+)"[\r\n](?:.*[\r\n])*?\1;|([a-z_]\w*)[\r\n](?:.*[\r\n])*?\2;)/i,
    alias: 'heredoc-string',
    greedy: true,
    inside: {
      'delimiter': {
        pattern: /^<<<(?:"[^"]+"|[a-z_]\w*)|[a-z_]\w*;$/i,
        alias: 'symbol',
        inside: {
          'punctuation': /^<<<"?|[";]$/
        }
      },
      'interpolation': string_interpolation
    }
  }, {
    pattern: /`(?:\\[\s\S]|[^\\`])*`/,
    alias: 'backtick-quoted-string',
    greedy: true
  }, {
    pattern: /'(?:\\[\s\S]|[^\\'])*'/,
    alias: 'single-quoted-string',
    greedy: true
  }, {
    pattern: /"(?:\\[\s\S]|[^\\"])*"/,
    alias: 'double-quoted-string',
    greedy: true,
    inside: {
      'interpolation': string_interpolation
    }
  }];
  Prism.languages.insertBefore('php', 'variable', {
    'string': string,
    'attribute': {
      pattern: /#\[(?:[^"'\/#]|\/(?![*/])|\/\/.*$|#(?!\[).*$|\/\*(?:[^*]|\*(?!\/))*\*\/|"(?:\\[\s\S]|[^\\"])*"|'(?:\\[\s\S]|[^\\'])*')+\](?=\s*[a-z$#])/im,
      greedy: true,
      inside: {
        'attribute-content': {
          pattern: /^(#\[)[\s\S]+(?=\]$)/,
          lookbehind: true,
          // inside can appear subset of php
          inside: {
            'comment': comment,
            'string': string,
            'attribute-class-name': [{
              pattern: /([^:]|^)\b[a-z_]\w*(?!\\)\b/i,
              alias: 'class-name',
              greedy: true,
              lookbehind: true
            }, {
              pattern: /([^:]|^)(?:\\?\b[a-z_]\w*)+/i,
              alias: ['class-name', 'class-name-fully-qualified'],
              greedy: true,
              lookbehind: true,
              inside: {
                'punctuation': /\\/
              }
            }],
            'constant': constant,
            'number': number,
            'operator': operator,
            'punctuation': punctuation
          }
        },
        'delimiter': {
          pattern: /^#\[|\]$/,
          alias: 'punctuation'
        }
      }
    }
  });
  Prism.hooks.add('before-tokenize', function (env) {
    if (!/<\?/.test(env.code)) {
      return;
    }
    var phpPattern = /<\?(?:[^"'/#]|\/(?![*/])|("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|(?:\/\/|#(?!\[))(?:[^?\n\r]|\?(?!>))*(?=$|\?>|[\r\n])|#\[|\/\*(?:[^*]|\*(?!\/))*(?:\*\/|$))*?(?:\?>|$)/g;
    Prism.languages['markup-templating'].buildPlaceholders(env, 'php', phpPattern);
  });
  Prism.hooks.add('after-tokenize', function (env) {
    Prism.languages['markup-templating'].tokenizePlaceholders(env, 'php');
  });
})(Prism);
Prism.languages.python = {
  'comment': {
    pattern: /(^|[^\\])#.*/,
    lookbehind: true,
    greedy: true
  },
  'string-interpolation': {
    pattern: /(?:f|fr|rf)(?:("""|''')[\s\S]*?\1|("|')(?:\\.|(?!\2)[^\\\r\n])*\2)/i,
    greedy: true,
    inside: {
      'interpolation': {
        // "{" <expression> <optional "!s", "!r", or "!a"> <optional ":" format specifier> "}"
        pattern: /((?:^|[^{])(?:\{\{)*)\{(?!\{)(?:[^{}]|\{(?!\{)(?:[^{}]|\{(?!\{)(?:[^{}])+\})+\})+\}/,
        lookbehind: true,
        inside: {
          'format-spec': {
            pattern: /(:)[^:(){}]+(?=\}$)/,
            lookbehind: true
          },
          'conversion-option': {
            pattern: /![sra](?=[:}]$)/,
            alias: 'punctuation'
          },
          rest: null
        }
      },
      'string': /[\s\S]+/
    }
  },
  'triple-quoted-string': {
    pattern: /(?:[rub]|br|rb)?("""|''')[\s\S]*?\1/i,
    greedy: true,
    alias: 'string'
  },
  'string': {
    pattern: /(?:[rub]|br|rb)?("|')(?:\\.|(?!\1)[^\\\r\n])*\1/i,
    greedy: true
  },
  'function': {
    pattern: /((?:^|\s)def[ \t]+)[a-zA-Z_]\w*(?=\s*\()/g,
    lookbehind: true
  },
  'class-name': {
    pattern: /(\bclass\s+)\w+/i,
    lookbehind: true
  },
  'decorator': {
    pattern: /(^[\t ]*)@\w+(?:\.\w+)*/m,
    lookbehind: true,
    alias: ['annotation', 'punctuation'],
    inside: {
      'punctuation': /\./
    }
  },
  'keyword': /\b(?:_(?=\s*:)|and|as|assert|async|await|break|case|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|match|nonlocal|not|or|pass|print|raise|return|try|while|with|yield)\b/,
  'builtin': /\b(?:__import__|abs|all|any|apply|ascii|basestring|bin|bool|buffer|bytearray|bytes|callable|chr|classmethod|cmp|coerce|compile|complex|delattr|dict|dir|divmod|enumerate|eval|execfile|file|filter|float|format|frozenset|getattr|globals|hasattr|hash|help|hex|id|input|int|intern|isinstance|issubclass|iter|len|list|locals|long|map|max|memoryview|min|next|object|oct|open|ord|pow|property|range|raw_input|reduce|reload|repr|reversed|round|set|setattr|slice|sorted|staticmethod|str|sum|super|tuple|type|unichr|unicode|vars|xrange|zip)\b/,
  'boolean': /\b(?:False|None|True)\b/,
  'number': /\b0(?:b(?:_?[01])+|o(?:_?[0-7])+|x(?:_?[a-f0-9])+)\b|(?:\b\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\B\.\d+(?:_\d+)*)(?:e[+-]?\d+(?:_\d+)*)?j?(?!\w)/i,
  'operator': /[-+%=]=?|!=|:=|\*\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]/,
  'punctuation': /[{}[\];(),.:]/
};
Prism.languages.python['string-interpolation'].inside['interpolation'].inside.rest = Prism.languages.python;
Prism.languages.py = Prism.languages.python;
Prism.languages.r = {
  'comment': /#.*/,
  'string': {
    pattern: /(['"])(?:\\.|(?!\1)[^\\\r\n])*\1/,
    greedy: true
  },
  'percent-operator': {
    // Includes user-defined operators
    // and %%, %*%, %/%, %in%, %o%, %x%
    pattern: /%[^%\s]*%/,
    alias: 'operator'
  },
  'boolean': /\b(?:FALSE|TRUE)\b/,
  'ellipsis': /\.\.(?:\.|\d+)/,
  'number': [/\b(?:Inf|NaN)\b/, /(?:\b0x[\dA-Fa-f]+(?:\.\d*)?|\b\d+(?:\.\d*)?|\B\.\d+)(?:[EePp][+-]?\d+)?[iL]?/],
  'keyword': /\b(?:NA|NA_character_|NA_complex_|NA_integer_|NA_real_|NULL|break|else|for|function|if|in|next|repeat|while)\b/,
  'operator': /->?>?|<(?:=|<?-)?|[>=!]=?|::?|&&?|\|\|?|[+*\/^$@~]/,
  'punctuation': /[(){}\[\],;]/
};

/**
 * Original by Samuel Flores
 *
 * Adds the following new token classes:
 *     constant, builtin, variable, symbol, regex
 */
(function (Prism) {
  Prism.languages.ruby = Prism.languages.extend('clike', {
    'comment': {
      pattern: /#.*|^=begin\s[\s\S]*?^=end/m,
      greedy: true
    },
    'class-name': {
      pattern: /(\b(?:class|module)\s+|\bcatch\s+\()[\w.\\]+|\b[A-Z_]\w*(?=\s*\.\s*new\b)/,
      lookbehind: true,
      inside: {
        'punctuation': /[.\\]/
      }
    },
    'keyword': /\b(?:BEGIN|END|alias|and|begin|break|case|class|def|define_method|defined|do|each|else|elsif|end|ensure|extend|for|if|in|include|module|new|next|nil|not|or|prepend|private|protected|public|raise|redo|require|rescue|retry|return|self|super|then|throw|undef|unless|until|when|while|yield)\b/,
    'operator': /\.{2,3}|&\.|===|<?=>|[!=]?~|(?:&&|\|\||<<|>>|\*\*|[+\-*/%<>!^&|=])=?|[?:]/,
    'punctuation': /[(){}[\].,;]/
  });
  Prism.languages.insertBefore('ruby', 'operator', {
    'double-colon': {
      pattern: /::/,
      alias: 'punctuation'
    }
  });
  var interpolation = {
    pattern: /((?:^|[^\\])(?:\\{2})*)#\{(?:[^{}]|\{[^{}]*\})*\}/,
    lookbehind: true,
    inside: {
      'content': {
        pattern: /^(#\{)[\s\S]+(?=\}$)/,
        lookbehind: true,
        inside: Prism.languages.ruby
      },
      'delimiter': {
        pattern: /^#\{|\}$/,
        alias: 'punctuation'
      }
    }
  };
  delete Prism.languages.ruby.function;
  var percentExpression = '(?:' + [/([^a-zA-Z0-9\s{(\[<=])(?:(?!\1)[^\\]|\\[\s\S])*\1/.source, /\((?:[^()\\]|\\[\s\S]|\((?:[^()\\]|\\[\s\S])*\))*\)/.source, /\{(?:[^{}\\]|\\[\s\S]|\{(?:[^{}\\]|\\[\s\S])*\})*\}/.source, /\[(?:[^\[\]\\]|\\[\s\S]|\[(?:[^\[\]\\]|\\[\s\S])*\])*\]/.source, /<(?:[^<>\\]|\\[\s\S]|<(?:[^<>\\]|\\[\s\S])*>)*>/.source].join('|') + ')';
  var symbolName = /(?:"(?:\\.|[^"\\\r\n])*"|(?:\b[a-zA-Z_]\w*|[^\s\0-\x7F]+)[?!]?|\$.)/.source;
  Prism.languages.insertBefore('ruby', 'keyword', {
    'regex-literal': [{
      pattern: RegExp(/%r/.source + percentExpression + /[egimnosux]{0,6}/.source),
      greedy: true,
      inside: {
        'interpolation': interpolation,
        'regex': /[\s\S]+/
      }
    }, {
      pattern: /(^|[^/])\/(?!\/)(?:\[[^\r\n\]]+\]|\\.|[^[/\\\r\n])+\/[egimnosux]{0,6}(?=\s*(?:$|[\r\n,.;})#]))/,
      lookbehind: true,
      greedy: true,
      inside: {
        'interpolation': interpolation,
        'regex': /[\s\S]+/
      }
    }],
    'variable': /[@$]+[a-zA-Z_]\w*(?:[?!]|\b)/,
    'symbol': [{
      pattern: RegExp(/(^|[^:]):/.source + symbolName),
      lookbehind: true,
      greedy: true
    }, {
      pattern: RegExp(/([\r\n{(,][ \t]*)/.source + symbolName + /(?=:(?!:))/.source),
      lookbehind: true,
      greedy: true
    }],
    'method-definition': {
      pattern: /(\bdef\s+)\w+(?:\s*\.\s*\w+)?/,
      lookbehind: true,
      inside: {
        'function': /\b\w+$/,
        'keyword': /^self\b/,
        'class-name': /^\w+/,
        'punctuation': /\./
      }
    }
  });
  Prism.languages.insertBefore('ruby', 'string', {
    'string-literal': [{
      pattern: RegExp(/%[qQiIwWs]?/.source + percentExpression),
      greedy: true,
      inside: {
        'interpolation': interpolation,
        'string': /[\s\S]+/
      }
    }, {
      pattern: /("|')(?:#\{[^}]+\}|#(?!\{)|\\(?:\r\n|[\s\S])|(?!\1)[^\\#\r\n])*\1/,
      greedy: true,
      inside: {
        'interpolation': interpolation,
        'string': /[\s\S]+/
      }
    }, {
      pattern: /<<[-~]?([a-z_]\w*)[\r\n](?:.*[\r\n])*?[\t ]*\1/i,
      alias: 'heredoc-string',
      greedy: true,
      inside: {
        'delimiter': {
          pattern: /^<<[-~]?[a-z_]\w*|\b[a-z_]\w*$/i,
          inside: {
            'symbol': /\b\w+/,
            'punctuation': /^<<[-~]?/
          }
        },
        'interpolation': interpolation,
        'string': /[\s\S]+/
      }
    }, {
      pattern: /<<[-~]?'([a-z_]\w*)'[\r\n](?:.*[\r\n])*?[\t ]*\1/i,
      alias: 'heredoc-string',
      greedy: true,
      inside: {
        'delimiter': {
          pattern: /^<<[-~]?'[a-z_]\w*'|\b[a-z_]\w*$/i,
          inside: {
            'symbol': /\b\w+/,
            'punctuation': /^<<[-~]?'|'$/
          }
        },
        'string': /[\s\S]+/
      }
    }],
    'command-literal': [{
      pattern: RegExp(/%x/.source + percentExpression),
      greedy: true,
      inside: {
        'interpolation': interpolation,
        'command': {
          pattern: /[\s\S]+/,
          alias: 'string'
        }
      }
    }, {
      pattern: /`(?:#\{[^}]+\}|#(?!\{)|\\(?:\r\n|[\s\S])|[^\\`#\r\n])*`/,
      greedy: true,
      inside: {
        'interpolation': interpolation,
        'command': {
          pattern: /[\s\S]+/,
          alias: 'string'
        }
      }
    }]
  });
  delete Prism.languages.ruby.string;
  Prism.languages.insertBefore('ruby', 'number', {
    'builtin': /\b(?:Array|Bignum|Binding|Class|Continuation|Dir|Exception|FalseClass|File|Fixnum|Float|Hash|IO|Integer|MatchData|Method|Module|NilClass|Numeric|Object|Proc|Range|Regexp|Stat|String|Struct|Symbol|TMS|Thread|ThreadGroup|Time|TrueClass)\b/,
    'constant': /\b[A-Z][A-Z0-9_]*(?:[?!]|\b)/
  });
  Prism.languages.rb = Prism.languages.ruby;
})(Prism);
(function (Prism) {
  var multilineComment = /\/\*(?:[^*/]|\*(?!\/)|\/(?!\*)|<self>)*\*\//.source;
  for (var i = 0; i < 2; i++) {
    // support 4 levels of nested comments
    multilineComment = multilineComment.replace(/<self>/g, function () {
      return multilineComment;
    });
  }
  multilineComment = multilineComment.replace(/<self>/g, function () {
    return /[^\s\S]/.source;
  });
  Prism.languages.rust = {
    'comment': [{
      pattern: RegExp(/(^|[^\\])/.source + multilineComment),
      lookbehind: true,
      greedy: true
    }, {
      pattern: /(^|[^\\:])\/\/.*/,
      lookbehind: true,
      greedy: true
    }],
    'string': {
      pattern: /b?"(?:\\[\s\S]|[^\\"])*"|b?r(#*)"(?:[^"]|"(?!\1))*"\1/,
      greedy: true
    },
    'char': {
      pattern: /b?'(?:\\(?:x[0-7][\da-fA-F]|u\{(?:[\da-fA-F]_*){1,6}\}|.)|[^\\\r\n\t'])'/,
      greedy: true
    },
    'attribute': {
      pattern: /#!?\[(?:[^\[\]"]|"(?:\\[\s\S]|[^\\"])*")*\]/,
      greedy: true,
      alias: 'attr-name',
      inside: {
        'string': null // see below
      }
    },

    // Closure params should not be confused with bitwise OR |
    'closure-params': {
      pattern: /([=(,:]\s*|\bmove\s*)\|[^|]*\||\|[^|]*\|(?=\s*(?:\{|->))/,
      lookbehind: true,
      greedy: true,
      inside: {
        'closure-punctuation': {
          pattern: /^\||\|$/,
          alias: 'punctuation'
        },
        rest: null // see below
      }
    },

    'lifetime-annotation': {
      pattern: /'\w+/,
      alias: 'symbol'
    },
    'fragment-specifier': {
      pattern: /(\$\w+:)[a-z]+/,
      lookbehind: true,
      alias: 'punctuation'
    },
    'variable': /\$\w+/,
    'function-definition': {
      pattern: /(\bfn\s+)\w+/,
      lookbehind: true,
      alias: 'function'
    },
    'type-definition': {
      pattern: /(\b(?:enum|struct|trait|type|union)\s+)\w+/,
      lookbehind: true,
      alias: 'class-name'
    },
    'module-declaration': [{
      pattern: /(\b(?:crate|mod)\s+)[a-z][a-z_\d]*/,
      lookbehind: true,
      alias: 'namespace'
    }, {
      pattern: /(\b(?:crate|self|super)\s*)::\s*[a-z][a-z_\d]*\b(?:\s*::(?:\s*[a-z][a-z_\d]*\s*::)*)?/,
      lookbehind: true,
      alias: 'namespace',
      inside: {
        'punctuation': /::/
      }
    }],
    'keyword': [
    // https://github.com/rust-lang/reference/blob/master/src/keywords.md
    /\b(?:Self|abstract|as|async|await|become|box|break|const|continue|crate|do|dyn|else|enum|extern|final|fn|for|if|impl|in|let|loop|macro|match|mod|move|mut|override|priv|pub|ref|return|self|static|struct|super|trait|try|type|typeof|union|unsafe|unsized|use|virtual|where|while|yield)\b/,
    // primitives and str
    // https://doc.rust-lang.org/stable/rust-by-example/primitives.html
    /\b(?:bool|char|f(?:32|64)|[ui](?:8|16|32|64|128|size)|str)\b/],
    // functions can technically start with an upper-case letter, but this will introduce a lot of false positives
    // and Rust's naming conventions recommend snake_case anyway.
    // https://doc.rust-lang.org/1.0.0/style/style/naming/README.html
    'function': /\b[a-z_]\w*(?=\s*(?:::\s*<|\())/,
    'macro': {
      pattern: /\b\w+!/,
      alias: 'property'
    },
    'constant': /\b[A-Z_][A-Z_\d]+\b/,
    'class-name': /\b[A-Z]\w*\b/,
    'namespace': {
      pattern: /(?:\b[a-z][a-z_\d]*\s*::\s*)*\b[a-z][a-z_\d]*\s*::(?!\s*<)/,
      inside: {
        'punctuation': /::/
      }
    },
    // Hex, oct, bin, dec numbers with visual separators and type suffix
    'number': /\b(?:0x[\dA-Fa-f](?:_?[\dA-Fa-f])*|0o[0-7](?:_?[0-7])*|0b[01](?:_?[01])*|(?:(?:\d(?:_?\d)*)?\.)?\d(?:_?\d)*(?:[Ee][+-]?\d+)?)(?:_?(?:f32|f64|[iu](?:8|16|32|64|size)?))?\b/,
    'boolean': /\b(?:false|true)\b/,
    'punctuation': /->|\.\.=|\.{1,3}|::|[{}[\];(),:]/,
    'operator': /[-+*\/%!^]=?|=[=>]?|&[&=]?|\|[|=]?|<<?=?|>>?=?|[@?]/
  };
  Prism.languages.rust['closure-params'].inside.rest = Prism.languages.rust;
  Prism.languages.rust['attribute'].inside['string'] = Prism.languages.rust['string'];
})(Prism);
(function (Prism) {
  Prism.languages.sass = Prism.languages.extend('css', {
    // Sass comments don't need to be closed, only indented
    'comment': {
      pattern: /^([ \t]*)\/[\/*].*(?:(?:\r?\n|\r)\1[ \t].+)*/m,
      lookbehind: true,
      greedy: true
    }
  });
  Prism.languages.insertBefore('sass', 'atrule', {
    // We want to consume the whole line
    'atrule-line': {
      // Includes support for = and + shortcuts
      pattern: /^(?:[ \t]*)[@+=].+/m,
      greedy: true,
      inside: {
        'atrule': /(?:@[\w-]+|[+=])/
      }
    }
  });
  delete Prism.languages.sass.atrule;
  var variable = /\$[-\w]+|#\{\$[-\w]+\}/;
  var operator = [/[+*\/%]|[=!]=|<=?|>=?|\b(?:and|not|or)\b/, {
    pattern: /(\s)-(?=\s)/,
    lookbehind: true
  }];
  Prism.languages.insertBefore('sass', 'property', {
    // We want to consume the whole line
    'variable-line': {
      pattern: /^[ \t]*\$.+/m,
      greedy: true,
      inside: {
        'punctuation': /:/,
        'variable': variable,
        'operator': operator
      }
    },
    // We want to consume the whole line
    'property-line': {
      pattern: /^[ \t]*(?:[^:\s]+ *:.*|:[^:\s].*)/m,
      greedy: true,
      inside: {
        'property': [/[^:\s]+(?=\s*:)/, {
          pattern: /(:)[^:\s]+/,
          lookbehind: true
        }],
        'punctuation': /:/,
        'variable': variable,
        'operator': operator,
        'important': Prism.languages.sass.important
      }
    }
  });
  delete Prism.languages.sass.property;
  delete Prism.languages.sass.important;

  // Now that whole lines for other patterns are consumed,
  // what's left should be selectors
  Prism.languages.insertBefore('sass', 'punctuation', {
    'selector': {
      pattern: /^([ \t]*)\S(?:,[^,\r\n]+|[^,\r\n]*)(?:,[^,\r\n]+)*(?:,(?:\r?\n|\r)\1[ \t]+\S(?:,[^,\r\n]+|[^,\r\n]*)(?:,[^,\r\n]+)*)*/m,
      lookbehind: true,
      greedy: true
    }
  });
})(Prism);
Prism.languages.scss = Prism.languages.extend('css', {
  'comment': {
    pattern: /(^|[^\\])(?:\/\*[\s\S]*?\*\/|\/\/.*)/,
    lookbehind: true
  },
  'atrule': {
    pattern: /@[\w-](?:\([^()]+\)|[^()\s]|\s+(?!\s))*?(?=\s+[{;])/,
    inside: {
      'rule': /@[\w-]+/
      // See rest below
    }
  },

  // url, compassified
  'url': /(?:[-a-z]+-)?url(?=\()/i,
  // CSS selector regex is not appropriate for Sass
  // since there can be lot more things (var, @ directive, nesting..)
  // a selector must start at the end of a property or after a brace (end of other rules or nesting)
  // it can contain some characters that aren't used for defining rules or end of selector, & (parent selector), or interpolated variable
  // the end of a selector is found when there is no rules in it ( {} or {\s}) or if there is a property (because an interpolated var
  // can "pass" as a selector- e.g: proper#{$erty})
  // this one was hard to do, so please be careful if you edit this one :)
  'selector': {
    // Initial look-ahead is used to prevent matching of blank selectors
    pattern: /(?=\S)[^@;{}()]?(?:[^@;{}()\s]|\s+(?!\s)|#\{\$[-\w]+\})+(?=\s*\{(?:\}|\s|[^}][^:{}]*[:{][^}]))/,
    inside: {
      'parent': {
        pattern: /&/,
        alias: 'important'
      },
      'placeholder': /%[-\w]+/,
      'variable': /\$[-\w]+|#\{\$[-\w]+\}/
    }
  },
  'property': {
    pattern: /(?:[-\w]|\$[-\w]|#\{\$[-\w]+\})+(?=\s*:)/,
    inside: {
      'variable': /\$[-\w]+|#\{\$[-\w]+\}/
    }
  }
});
Prism.languages.insertBefore('scss', 'atrule', {
  'keyword': [/@(?:content|debug|each|else(?: if)?|extend|for|forward|function|if|import|include|mixin|return|use|warn|while)\b/i, {
    pattern: /( )(?:from|through)(?= )/,
    lookbehind: true
  }]
});
Prism.languages.insertBefore('scss', 'important', {
  // var and interpolated vars
  'variable': /\$[-\w]+|#\{\$[-\w]+\}/
});
Prism.languages.insertBefore('scss', 'function', {
  'module-modifier': {
    pattern: /\b(?:as|hide|show|with)\b/i,
    alias: 'keyword'
  },
  'placeholder': {
    pattern: /%[-\w]+/,
    alias: 'selector'
  },
  'statement': {
    pattern: /\B!(?:default|optional)\b/i,
    alias: 'keyword'
  },
  'boolean': /\b(?:false|true)\b/,
  'null': {
    pattern: /\bnull\b/,
    alias: 'keyword'
  },
  'operator': {
    pattern: /(\s)(?:[-+*\/%]|[=!]=|<=?|>=?|and|not|or)(?=\s)/,
    lookbehind: true
  }
});
Prism.languages.scss['atrule'].inside.rest = Prism.languages.scss;
Prism.languages.sql = {
  'comment': {
    pattern: /(^|[^\\])(?:\/\*[\s\S]*?\*\/|(?:--|\/\/|#).*)/,
    lookbehind: true
  },
  'variable': [{
    pattern: /@(["'`])(?:\\[\s\S]|(?!\1)[^\\])+\1/,
    greedy: true
  }, /@[\w.$]+/],
  'string': {
    pattern: /(^|[^@\\])("|')(?:\\[\s\S]|(?!\2)[^\\]|\2\2)*\2/,
    greedy: true,
    lookbehind: true
  },
  'identifier': {
    pattern: /(^|[^@\\])`(?:\\[\s\S]|[^`\\]|``)*`/,
    greedy: true,
    lookbehind: true,
    inside: {
      'punctuation': /^`|`$/
    }
  },
  'function': /\b(?:AVG|COUNT|FIRST|FORMAT|LAST|LCASE|LEN|MAX|MID|MIN|MOD|NOW|ROUND|SUM|UCASE)(?=\s*\()/i,
  // Should we highlight user defined functions too?
  'keyword': /\b(?:ACTION|ADD|AFTER|ALGORITHM|ALL|ALTER|ANALYZE|ANY|APPLY|AS|ASC|AUTHORIZATION|AUTO_INCREMENT|BACKUP|BDB|BEGIN|BERKELEYDB|BIGINT|BINARY|BIT|BLOB|BOOL|BOOLEAN|BREAK|BROWSE|BTREE|BULK|BY|CALL|CASCADED?|CASE|CHAIN|CHAR(?:ACTER|SET)?|CHECK(?:POINT)?|CLOSE|CLUSTERED|COALESCE|COLLATE|COLUMNS?|COMMENT|COMMIT(?:TED)?|COMPUTE|CONNECT|CONSISTENT|CONSTRAINT|CONTAINS(?:TABLE)?|CONTINUE|CONVERT|CREATE|CROSS|CURRENT(?:_DATE|_TIME|_TIMESTAMP|_USER)?|CURSOR|CYCLE|DATA(?:BASES?)?|DATE(?:TIME)?|DAY|DBCC|DEALLOCATE|DEC|DECIMAL|DECLARE|DEFAULT|DEFINER|DELAYED|DELETE|DELIMITERS?|DENY|DESC|DESCRIBE|DETERMINISTIC|DISABLE|DISCARD|DISK|DISTINCT|DISTINCTROW|DISTRIBUTED|DO|DOUBLE|DROP|DUMMY|DUMP(?:FILE)?|DUPLICATE|ELSE(?:IF)?|ENABLE|ENCLOSED|END|ENGINE|ENUM|ERRLVL|ERRORS|ESCAPED?|EXCEPT|EXEC(?:UTE)?|EXISTS|EXIT|EXPLAIN|EXTENDED|FETCH|FIELDS|FILE|FILLFACTOR|FIRST|FIXED|FLOAT|FOLLOWING|FOR(?: EACH ROW)?|FORCE|FOREIGN|FREETEXT(?:TABLE)?|FROM|FULL|FUNCTION|GEOMETRY(?:COLLECTION)?|GLOBAL|GOTO|GRANT|GROUP|HANDLER|HASH|HAVING|HOLDLOCK|HOUR|IDENTITY(?:COL|_INSERT)?|IF|IGNORE|IMPORT|INDEX|INFILE|INNER|INNODB|INOUT|INSERT|INT|INTEGER|INTERSECT|INTERVAL|INTO|INVOKER|ISOLATION|ITERATE|JOIN|KEYS?|KILL|LANGUAGE|LAST|LEAVE|LEFT|LEVEL|LIMIT|LINENO|LINES|LINESTRING|LOAD|LOCAL|LOCK|LONG(?:BLOB|TEXT)|LOOP|MATCH(?:ED)?|MEDIUM(?:BLOB|INT|TEXT)|MERGE|MIDDLEINT|MINUTE|MODE|MODIFIES|MODIFY|MONTH|MULTI(?:LINESTRING|POINT|POLYGON)|NATIONAL|NATURAL|NCHAR|NEXT|NO|NONCLUSTERED|NULLIF|NUMERIC|OFF?|OFFSETS?|ON|OPEN(?:DATASOURCE|QUERY|ROWSET)?|OPTIMIZE|OPTION(?:ALLY)?|ORDER|OUT(?:ER|FILE)?|OVER|PARTIAL|PARTITION|PERCENT|PIVOT|PLAN|POINT|POLYGON|PRECEDING|PRECISION|PREPARE|PREV|PRIMARY|PRINT|PRIVILEGES|PROC(?:EDURE)?|PUBLIC|PURGE|QUICK|RAISERROR|READS?|REAL|RECONFIGURE|REFERENCES|RELEASE|RENAME|REPEAT(?:ABLE)?|REPLACE|REPLICATION|REQUIRE|RESIGNAL|RESTORE|RESTRICT|RETURN(?:ING|S)?|REVOKE|RIGHT|ROLLBACK|ROUTINE|ROW(?:COUNT|GUIDCOL|S)?|RTREE|RULE|SAVE(?:POINT)?|SCHEMA|SECOND|SELECT|SERIAL(?:IZABLE)?|SESSION(?:_USER)?|SET(?:USER)?|SHARE|SHOW|SHUTDOWN|SIMPLE|SMALLINT|SNAPSHOT|SOME|SONAME|SQL|START(?:ING)?|STATISTICS|STATUS|STRIPED|SYSTEM_USER|TABLES?|TABLESPACE|TEMP(?:ORARY|TABLE)?|TERMINATED|TEXT(?:SIZE)?|THEN|TIME(?:STAMP)?|TINY(?:BLOB|INT|TEXT)|TOP?|TRAN(?:SACTIONS?)?|TRIGGER|TRUNCATE|TSEQUAL|TYPES?|UNBOUNDED|UNCOMMITTED|UNDEFINED|UNION|UNIQUE|UNLOCK|UNPIVOT|UNSIGNED|UPDATE(?:TEXT)?|USAGE|USE|USER|USING|VALUES?|VAR(?:BINARY|CHAR|CHARACTER|YING)|VIEW|WAITFOR|WARNINGS|WHEN|WHERE|WHILE|WITH(?: ROLLUP|IN)?|WORK|WRITE(?:TEXT)?|YEAR)\b/i,
  'boolean': /\b(?:FALSE|NULL|TRUE)\b/i,
  'number': /\b0x[\da-f]+\b|\b\d+(?:\.\d*)?|\B\.\d+\b/i,
  'operator': /[-+*\/=%^~]|&&?|\|\|?|!=?|<(?:=>?|<|>)?|>[>=]?|\b(?:AND|BETWEEN|DIV|ILIKE|IN|IS|LIKE|NOT|OR|REGEXP|RLIKE|SOUNDS LIKE|XOR)\b/i,
  'punctuation': /[;[\]()`,.]/
};
Prism.languages.swift = {
  'comment': {
    // Nested comments are supported up to 2 levels
    pattern: /(^|[^\\:])(?:\/\/.*|\/\*(?:[^/*]|\/(?!\*)|\*(?!\/)|\/\*(?:[^*]|\*(?!\/))*\*\/)*\*\/)/,
    lookbehind: true,
    greedy: true
  },
  'string-literal': [
  // https://docs.swift.org/swift-book/LanguageGuide/StringsAndCharacters.html
  {
    pattern: RegExp(/(^|[^"#])/.source + '(?:'
    // single-line string
    + /"(?:\\(?:\((?:[^()]|\([^()]*\))*\)|\r\n|[^(])|[^\\\r\n"])*"/.source + '|'
    // multi-line string
    + /"""(?:\\(?:\((?:[^()]|\([^()]*\))*\)|[^(])|[^\\"]|"(?!""))*"""/.source + ')' + /(?!["#])/.source),
    lookbehind: true,
    greedy: true,
    inside: {
      'interpolation': {
        pattern: /(\\\()(?:[^()]|\([^()]*\))*(?=\))/,
        lookbehind: true,
        inside: null // see below
      },

      'interpolation-punctuation': {
        pattern: /^\)|\\\($/,
        alias: 'punctuation'
      },
      'punctuation': /\\(?=[\r\n])/,
      'string': /[\s\S]+/
    }
  }, {
    pattern: RegExp(/(^|[^"#])(#+)/.source + '(?:'
    // single-line string
    + /"(?:\\(?:#+\((?:[^()]|\([^()]*\))*\)|\r\n|[^#])|[^\\\r\n])*?"/.source + '|'
    // multi-line string
    + /"""(?:\\(?:#+\((?:[^()]|\([^()]*\))*\)|[^#])|[^\\])*?"""/.source + ')' + '\\2'),
    lookbehind: true,
    greedy: true,
    inside: {
      'interpolation': {
        pattern: /(\\#+\()(?:[^()]|\([^()]*\))*(?=\))/,
        lookbehind: true,
        inside: null // see below
      },

      'interpolation-punctuation': {
        pattern: /^\)|\\#+\($/,
        alias: 'punctuation'
      },
      'string': /[\s\S]+/
    }
  }],
  'directive': {
    // directives with conditions
    pattern: RegExp(/#/.source + '(?:' + (/(?:elseif|if)\b/.source + '(?:[ \t]*'
    // This regex is a little complex. It's equivalent to this:
    //   (?:![ \t]*)?(?:\b\w+\b(?:[ \t]*<round>)?|<round>)(?:[ \t]*(?:&&|\|\|))?
    // where <round> is a general parentheses expression.
    + /(?:![ \t]*)?(?:\b\w+\b(?:[ \t]*\((?:[^()]|\([^()]*\))*\))?|\((?:[^()]|\([^()]*\))*\))(?:[ \t]*(?:&&|\|\|))?/.source + ')+') + '|' + /(?:else|endif)\b/.source + ')'),
    alias: 'property',
    inside: {
      'directive-name': /^#\w+/,
      'boolean': /\b(?:false|true)\b/,
      'number': /\b\d+(?:\.\d+)*\b/,
      'operator': /!|&&|\|\||[<>]=?/,
      'punctuation': /[(),]/
    }
  },
  'literal': {
    pattern: /#(?:colorLiteral|column|dsohandle|file(?:ID|Literal|Path)?|function|imageLiteral|line)\b/,
    alias: 'constant'
  },
  'other-directive': {
    pattern: /#\w+\b/,
    alias: 'property'
  },
  'attribute': {
    pattern: /@\w+/,
    alias: 'atrule'
  },
  'function-definition': {
    pattern: /(\bfunc\s+)\w+/,
    lookbehind: true,
    alias: 'function'
  },
  'label': {
    // https://docs.swift.org/swift-book/LanguageGuide/ControlFlow.html#ID141
    pattern: /\b(break|continue)\s+\w+|\b[a-zA-Z_]\w*(?=\s*:\s*(?:for|repeat|while)\b)/,
    lookbehind: true,
    alias: 'important'
  },
  'keyword': /\b(?:Any|Protocol|Self|Type|actor|as|assignment|associatedtype|associativity|async|await|break|case|catch|class|continue|convenience|default|defer|deinit|didSet|do|dynamic|else|enum|extension|fallthrough|fileprivate|final|for|func|get|guard|higherThan|if|import|in|indirect|infix|init|inout|internal|is|isolated|lazy|left|let|lowerThan|mutating|none|nonisolated|nonmutating|open|operator|optional|override|postfix|precedencegroup|prefix|private|protocol|public|repeat|required|rethrows|return|right|safe|self|set|some|static|struct|subscript|super|switch|throw|throws|try|typealias|unowned|unsafe|var|weak|where|while|willSet)\b/,
  'boolean': /\b(?:false|true)\b/,
  'nil': {
    pattern: /\bnil\b/,
    alias: 'constant'
  },
  'short-argument': /\$\d+\b/,
  'omit': {
    pattern: /\b_\b/,
    alias: 'keyword'
  },
  'number': /\b(?:[\d_]+(?:\.[\de_]+)?|0x[a-f0-9_]+(?:\.[a-f0-9p_]+)?|0b[01_]+|0o[0-7_]+)\b/i,
  // A class name must start with an upper-case letter and be either 1 letter long or contain a lower-case letter.
  'class-name': /\b[A-Z](?:[A-Z_\d]*[a-z]\w*)?\b/,
  'function': /\b[a-z_]\w*(?=\s*\()/i,
  'constant': /\b(?:[A-Z_]{2,}|k[A-Z][A-Za-z_]+)\b/,
  // Operators are generic in Swift. Developers can even create new operators (e.g. +++).
  // https://docs.swift.org/swift-book/ReferenceManual/zzSummaryOfTheGrammar.html#ID481
  // This regex only supports ASCII operators.
  'operator': /[-+*/%=!<>&|^~?]+|\.[.\-+*/%=!<>&|^~?]+/,
  'punctuation': /[{}[\]();,.:\\]/
};
Prism.languages.swift['string-literal'].forEach(function (rule) {
  rule.inside['interpolation'].inside = Prism.languages.swift;
});
(function (Prism) {
  Prism.languages.typescript = Prism.languages.extend('javascript', {
    'class-name': {
      pattern: /(\b(?:class|extends|implements|instanceof|interface|new|type)\s+)(?!keyof\b)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?:\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>)?/,
      lookbehind: true,
      greedy: true,
      inside: null // see below
    },

    'builtin': /\b(?:Array|Function|Promise|any|boolean|console|never|number|string|symbol|unknown)\b/
  });

  // The keywords TypeScript adds to JavaScript
  Prism.languages.typescript.keyword.push(/\b(?:abstract|declare|is|keyof|readonly|require)\b/,
  // keywords that have to be followed by an identifier
  /\b(?:asserts|infer|interface|module|namespace|type)\b(?=\s*(?:[{_$a-zA-Z\xA0-\uFFFF]|$))/,
  // This is for `import type *, {}`
  /\btype\b(?=\s*(?:[\{*]|$))/);

  // doesn't work with TS because TS is too complex
  delete Prism.languages.typescript['parameter'];
  delete Prism.languages.typescript['literal-property'];

  // a version of typescript specifically for highlighting types
  var typeInside = Prism.languages.extend('typescript', {});
  delete typeInside['class-name'];
  Prism.languages.typescript['class-name'].inside = typeInside;
  Prism.languages.insertBefore('typescript', 'function', {
    'decorator': {
      pattern: /@[$\w\xA0-\uFFFF]+/,
      inside: {
        'at': {
          pattern: /^@/,
          alias: 'operator'
        },
        'function': /^[\s\S]+/
      }
    },
    'generic-function': {
      // e.g. foo<T extends "bar" | "baz">( ...
      pattern: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>(?=\s*\()/,
      greedy: true,
      inside: {
        'function': /^#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*/,
        'generic': {
          pattern: /<[\s\S]+/,
          // everything after the first <
          alias: 'class-name',
          inside: typeInside
        }
      }
    }
  });
  Prism.languages.ts = Prism.languages.typescript;
})(Prism);
(function (Prism) {
  var typescript = Prism.util.clone(Prism.languages.typescript);
  Prism.languages.tsx = Prism.languages.extend('jsx', typescript);

  // doesn't work with TS because TS is too complex
  delete Prism.languages.tsx['parameter'];
  delete Prism.languages.tsx['literal-property'];

  // This will prevent collisions between TSX tags and TS generic types.
  // Idea by https://github.com/karlhorky
  // Discussion: https://github.com/PrismJS/prism/issues/2594#issuecomment-710666928
  var tag = Prism.languages.tsx.tag;
  tag.pattern = RegExp(/(^|[^\w$]|(?=<\/))/.source + '(?:' + tag.pattern.source + ')', tag.pattern.flags);
  tag.lookbehind = true;
})(Prism);
Prism.languages.basic = {
  'comment': {
    pattern: /(?:!|REM\b).+/i,
    inside: {
      'keyword': /^REM/i
    }
  },
  'string': {
    pattern: /"(?:""|[!#$%&'()*,\/:;<=>?^\w +\-.])*"/,
    greedy: true
  },
  'number': /(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:E[+-]?\d+)?/i,
  'keyword': /\b(?:AS|BEEP|BLOAD|BSAVE|CALL(?: ABSOLUTE)?|CASE|CHAIN|CHDIR|CLEAR|CLOSE|CLS|COM|COMMON|CONST|DATA|DECLARE|DEF(?: FN| SEG|DBL|INT|LNG|SNG|STR)|DIM|DO|DOUBLE|ELSE|ELSEIF|END|ENVIRON|ERASE|ERROR|EXIT|FIELD|FILES|FOR|FUNCTION|GET|GOSUB|GOTO|IF|INPUT|INTEGER|IOCTL|KEY|KILL|LINE INPUT|LOCATE|LOCK|LONG|LOOP|LSET|MKDIR|NAME|NEXT|OFF|ON(?: COM| ERROR| KEY| TIMER)?|OPEN|OPTION BASE|OUT|POKE|PUT|READ|REDIM|REM|RESTORE|RESUME|RETURN|RMDIR|RSET|RUN|SELECT CASE|SHARED|SHELL|SINGLE|SLEEP|STATIC|STEP|STOP|STRING|SUB|SWAP|SYSTEM|THEN|TIMER|TO|TROFF|TRON|TYPE|UNLOCK|UNTIL|USING|VIEW PRINT|WAIT|WEND|WHILE|WRITE)(?:\$|\b)/i,
  'function': /\b(?:ABS|ACCESS|ACOS|ANGLE|AREA|ARITHMETIC|ARRAY|ASIN|ASK|AT|ATN|BASE|BEGIN|BREAK|CAUSE|CEIL|CHR|CLIP|COLLATE|COLOR|CON|COS|COSH|COT|CSC|DATE|DATUM|DEBUG|DECIMAL|DEF|DEG|DEGREES|DELETE|DET|DEVICE|DISPLAY|DOT|ELAPSED|EPS|ERASABLE|EXLINE|EXP|EXTERNAL|EXTYPE|FILETYPE|FIXED|FP|GO|GRAPH|HANDLER|IDN|IMAGE|IN|INT|INTERNAL|IP|IS|KEYED|LBOUND|LCASE|LEFT|LEN|LENGTH|LET|LINE|LINES|LOG|LOG10|LOG2|LTRIM|MARGIN|MAT|MAX|MAXNUM|MID|MIN|MISSING|MOD|NATIVE|NUL|NUMERIC|OF|OPTION|ORD|ORGANIZATION|OUTIN|OUTPUT|PI|POINT|POINTER|POINTS|POS|PRINT|PROGRAM|PROMPT|RAD|RADIANS|RANDOMIZE|RECORD|RECSIZE|RECTYPE|RELATIVE|REMAINDER|REPEAT|REST|RETRY|REWRITE|RIGHT|RND|ROUND|RTRIM|SAME|SEC|SELECT|SEQUENTIAL|SET|SETTER|SGN|SIN|SINH|SIZE|SKIP|SQR|STANDARD|STATUS|STR|STREAM|STYLE|TAB|TAN|TANH|TEMPLATE|TEXT|THERE|TIME|TIMEOUT|TRACE|TRANSFORM|TRUNCATE|UBOUND|UCASE|USE|VAL|VARIABLE|VIEWPORT|WHEN|WINDOW|WITH|ZER|ZONEWIDTH)(?:\$|\b)/i,
  'operator': /<[=>]?|>=?|[+\-*\/^=&]|\b(?:AND|EQV|IMP|NOT|OR|XOR)\b/i,
  'punctuation': /[,;:()]/
};
Prism.languages.vbnet = Prism.languages.extend('basic', {
  'comment': [{
    pattern: /(?:!|REM\b).+/i,
    inside: {
      'keyword': /^REM/i
    }
  }, {
    pattern: /(^|[^\\:])'.*/,
    lookbehind: true,
    greedy: true
  }],
  'string': {
    pattern: /(^|[^"])"(?:""|[^"])*"(?!")/,
    lookbehind: true,
    greedy: true
  },
  'keyword': /(?:\b(?:ADDHANDLER|ADDRESSOF|ALIAS|AND|ANDALSO|AS|BEEP|BLOAD|BOOLEAN|BSAVE|BYREF|BYTE|BYVAL|CALL(?: ABSOLUTE)?|CASE|CATCH|CBOOL|CBYTE|CCHAR|CDATE|CDBL|CDEC|CHAIN|CHAR|CHDIR|CINT|CLASS|CLEAR|CLNG|CLOSE|CLS|COBJ|COM|COMMON|CONST|CONTINUE|CSBYTE|CSHORT|CSNG|CSTR|CTYPE|CUINT|CULNG|CUSHORT|DATA|DATE|DECIMAL|DECLARE|DEF(?: FN| SEG|DBL|INT|LNG|SNG|STR)|DEFAULT|DELEGATE|DIM|DIRECTCAST|DO|DOUBLE|ELSE|ELSEIF|END|ENUM|ENVIRON|ERASE|ERROR|EVENT|EXIT|FALSE|FIELD|FILES|FINALLY|FOR(?: EACH)?|FRIEND|FUNCTION|GET|GETTYPE|GETXMLNAMESPACE|GLOBAL|GOSUB|GOTO|HANDLES|IF|IMPLEMENTS|IMPORTS|IN|INHERITS|INPUT|INTEGER|INTERFACE|IOCTL|IS|ISNOT|KEY|KILL|LET|LIB|LIKE|LINE INPUT|LOCATE|LOCK|LONG|LOOP|LSET|ME|MKDIR|MOD|MODULE|MUSTINHERIT|MUSTOVERRIDE|MYBASE|MYCLASS|NAME|NAMESPACE|NARROWING|NEW|NEXT|NOT|NOTHING|NOTINHERITABLE|NOTOVERRIDABLE|OBJECT|OF|OFF|ON(?: COM| ERROR| KEY| TIMER)?|OPEN|OPERATOR|OPTION(?: BASE)?|OPTIONAL|OR|ORELSE|OUT|OVERLOADS|OVERRIDABLE|OVERRIDES|PARAMARRAY|PARTIAL|POKE|PRIVATE|PROPERTY|PROTECTED|PUBLIC|PUT|RAISEEVENT|READ|READONLY|REDIM|REM|REMOVEHANDLER|RESTORE|RESUME|RETURN|RMDIR|RSET|RUN|SBYTE|SELECT(?: CASE)?|SET|SHADOWS|SHARED|SHELL|SHORT|SINGLE|SLEEP|STATIC|STEP|STOP|STRING|STRUCTURE|SUB|SWAP|SYNCLOCK|SYSTEM|THEN|THROW|TIMER|TO|TROFF|TRON|TRUE|TRY|TRYCAST|TYPE|TYPEOF|UINTEGER|ULONG|UNLOCK|UNTIL|USHORT|USING|VIEW PRINT|WAIT|WEND|WHEN|WHILE|WIDENING|WITH|WITHEVENTS|WRITE|WRITEONLY|XOR)|\B(?:#CONST|#ELSE|#ELSEIF|#END|#IF))(?:\$|\b)/i,
  'punctuation': /[,;:(){}]/
});

function isValidURL(url) {
  return url === sanitizeUrl(url);
}

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

const languages = [{
  label: 'C',
  value: 'c'
}, {
  label: 'C++',
  value: 'cpp'
}, {
  label: 'Arduino',
  value: 'arduino'
}, {
  label: 'Bash',
  value: 'bash'
}, {
  label: 'C#',
  value: 'csharp'
}, {
  label: 'CSS',
  value: 'css'
}, {
  label: 'Diff',
  value: 'diff'
}, {
  label: 'Go',
  value: 'go'
}, {
  label: 'INI',
  value: 'ini'
}, {
  label: 'Java',
  value: 'java'
}, {
  label: 'JavaScript',
  value: 'javascript'
}, {
  label: 'JSX',
  value: 'jsx'
}, {
  label: 'JSON',
  value: 'json'
}, {
  label: 'Kotlin',
  value: 'kotlin'
}, {
  label: 'Less',
  value: 'less'
}, {
  label: 'Lua',
  value: 'lua'
}, {
  label: 'Makefile',
  value: 'makefile'
}, {
  label: 'Markdown',
  value: 'markdown'
}, {
  label: 'Objective-C',
  value: 'objectivec'
}, {
  label: 'Perl',
  value: 'perl'
}, {
  label: 'PHP',
  value: 'php'
}, {
  label: 'Python',
  value: 'python'
}, {
  label: 'R',
  value: 'r'
}, {
  label: 'Ruby',
  value: 'ruby'
}, {
  label: 'Rust',
  value: 'rust'
}, {
  label: 'Sass',
  value: 'sass'
}, {
  label: 'SCSS',
  value: 'scss'
}, {
  label: 'SQL',
  value: 'sql'
}, {
  label: 'Swift',
  value: 'swift'
}, {
  label: 'TypeScript',
  value: 'typescript'
}, {
  label: 'TSX',
  value: 'tsx'
}, {
  label: 'VB.NET',
  value: 'vbnet'
}, {
  label: 'YAML',
  value: 'yaml'
}];
const canonicalNameToLabel = new Map(languages.map(x => [x.value, x.label]));
const labelToCanonicalName = new Map(languages.map(x => [x.label, x.value]));
const languageToCanonicalName = new Map(languages.map(lang => [Prism.languages[lang.value], lang.value]));
const aliasesToCanonicalName = new Map(Object.keys(Prism.languages).flatMap(lang => {
  const canonicalName = languageToCanonicalName.get(Prism.languages[lang]);
  if (canonicalName === undefined) {
    return [];
  }
  return [[lang, canonicalName]];
}));
const languagesToAliases = new Map(languages.map(lang => [lang.value, []]));
for (const [alias, canonicalName] of aliasesToCanonicalName) {
  languagesToAliases.get(canonicalName).push(alias);
}
const languagesWithAliases = [{
  label: 'Plain text',
  value: 'plain',
  aliases: []
}, ...[...languagesToAliases].map(([canonicalName, aliases]) => ({
  label: canonicalNameToLabel.get(canonicalName),
  value: canonicalName,
  aliases
}))];
const aliasesToLabel = new Map([...aliasesToCanonicalName].map(([alias, canonicalName]) => [alias, canonicalNameToLabel.get(canonicalName)]));

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

const ChildrenByPathContext = /*#__PURE__*/React.createContext({});
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
  const formId = useId$1();
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

function findChildPropPathsForProp(value, schema, path) {
  switch (schema.kind) {
    case 'form':
      return [];
    case 'child':
      return [{
        path: path,
        options: schema.options
      }];
    case 'conditional':
      return findChildPropPathsForProp(value.value, schema.values[value.discriminant], path.concat('value'));
    case 'object':
      {
        const paths = [];
        Object.keys(schema.fields).forEach(key => {
          paths.push(...findChildPropPathsForProp(value[key], schema.fields[key], path.concat(key)));
        });
        return paths;
      }
    case 'array':
      {
        const paths = [];
        value.forEach((val, i) => {
          paths.push(...findChildPropPathsForProp(val, schema.element, path.concat(i)));
        });
        return paths;
      }
  }
}
function findChildPropPaths(value, props) {
  const propPaths = findChildPropPathsForProp(value, {
    kind: 'object',
    fields: props
  }, []);
  if (!propPaths.length) {
    return [{
      path: undefined,
      options: {
        kind: 'inline',
        placeholder: ''
      }
    }];
  }
  return propPaths;
}

function getAncestorComponentBlock(editor) {
  if (editor.selection) {
    const ancestorEntry = Editor.above(editor, {
      match: node => isBlock(node) && node.type !== 'paragraph'
    });
    if (ancestorEntry && (ancestorEntry[0].type === 'component-block-prop' || ancestorEntry[0].type === 'component-inline-prop')) {
      return {
        isInside: true,
        componentBlock: Editor.parent(editor, ancestorEntry[1]),
        prop: ancestorEntry
      };
    }
  }
  return {
    isInside: false
  };
}
const alreadyNormalizedThings = new WeakMap();
function normalizeNodeWithinComponentProp([node, path], editor, fieldOptions) {
  let alreadyNormalizedNodes = alreadyNormalizedThings.get(fieldOptions);
  if (!alreadyNormalizedNodes) {
    alreadyNormalizedNodes = new WeakSet();
    alreadyNormalizedThings.set(fieldOptions, alreadyNormalizedNodes);
  }
  if (alreadyNormalizedNodes.has(node)) {
    return false;
  }
  let didNormalization = false;
  if (fieldOptions.inlineMarks !== 'inherit' && Text$1.isText(node)) {
    didNormalization = normalizeTextBasedOnInlineMarksAndSoftBreaks([node, path], editor, fieldOptions.inlineMarks, fieldOptions.softBreaks);
  }
  if (Element$1.isElement(node)) {
    let childrenHasChanged = node.children.map((node, i) => normalizeNodeWithinComponentProp([node, [...path, i]], editor, fieldOptions))
    // .map then .some because we don't want to exit early
    .some(x => x);
    if (fieldOptions.kind === 'block') {
      if (node.type === 'component-block') {
        if (!fieldOptions.componentBlocks) {
          Transforms.unwrapNodes(editor, {
            at: path
          });
          didNormalization = true;
        }
      } else {
        didNormalization = normalizeElementBasedOnDocumentFeatures([node, path], editor, fieldOptions.documentFeatures) || childrenHasChanged;
      }
    } else {
      didNormalization = normalizeInlineBasedOnLinks([node, path], editor, fieldOptions.documentFeatures.links);
    }
  }
  if (didNormalization === false) {
    alreadyNormalizedNodes.add(node);
  }
  return didNormalization;
}
function canSchemaContainChildField(rootSchema) {
  const queue = new Set([rootSchema]);
  for (const schema of queue) {
    if (schema.kind === 'form') ; else if (schema.kind === 'child') {
      return true;
    } else if (schema.kind === 'array') {
      queue.add(schema.element);
    } else if (schema.kind === 'object') {
      for (const innerProp of Object.values(schema.fields)) {
        queue.add(innerProp);
      }
    } else if (schema.kind === 'conditional') {
      for (const innerProp of Object.values(schema.values)) {
        queue.add(innerProp);
      }
    } else {
      assertNever(schema);
    }
  }
  return false;
}
function doesSchemaOnlyEverContainASingleChildField(rootSchema) {
  const queue = new Set([rootSchema]);
  let hasFoundChildField = false;
  for (const schema of queue) {
    if (schema.kind === 'form') ; else if (schema.kind === 'child') {
      if (hasFoundChildField) {
        return false;
      }
      hasFoundChildField = true;
    } else if (schema.kind === 'array') {
      if (canSchemaContainChildField(schema.element)) {
        return false;
      }
    } else if (schema.kind === 'object') {
      for (const innerProp of Object.values(schema.fields)) {
        queue.add(innerProp);
      }
    } else if (schema.kind === 'conditional') {
      for (const innerProp of Object.values(schema.values)) {
        queue.add(innerProp);
      }
    } else {
      assertNever(schema);
    }
  }
  return hasFoundChildField;
}
function findArrayFieldsWithSingleChildField(schema, value) {
  const propPaths = [];
  traverseProps(schema, value, (schema, value, path) => {
    if (schema.kind === 'array' && doesSchemaOnlyEverContainASingleChildField(schema.element)) {
      propPaths.push([path, schema]);
    }
  });
  return propPaths;
}
function isEmptyChildFieldNode(element) {
  const firstChild = element.children[0];
  return element.children.length === 1 && (element.type === 'component-inline-prop' && firstChild.type === undefined && firstChild.text === '' || element.type === 'component-block-prop' && firstChild.type === 'paragraph' && firstChild.children.length === 1 && firstChild.children[0].type === undefined && firstChild.children[0].text === '');
}
function withComponentBlocks(blockComponents, editorDocumentFeatures, editor) {
  // note that conflicts between the editor document features
  // and the child field document features are dealt with elsewhere
  const memoizedGetDocumentFeaturesForChildField = weakMemoize(options => {
    return getDocumentFeaturesForChildField(editorDocumentFeatures, options);
  });
  const {
    normalizeNode,
    deleteBackward,
    insertBreak
  } = editor;
  editor.deleteBackward = unit => {
    if (editor.selection) {
      const ancestorComponentBlock = getAncestorComponentBlock(editor);
      if (ancestorComponentBlock.isInside && Range.isCollapsed(editor.selection) && Editor.isStart(editor, editor.selection.anchor, ancestorComponentBlock.prop[1]) && ancestorComponentBlock.prop[1][ancestorComponentBlock.prop[1].length - 1] === 0) {
        Transforms.unwrapNodes(editor, {
          at: ancestorComponentBlock.componentBlock[1]
        });
        return;
      }
    }
    deleteBackward(unit);
  };
  editor.insertBreak = () => {
    const ancestorComponentBlock = getAncestorComponentBlock(editor);
    if (editor.selection && ancestorComponentBlock.isInside) {
      const {
        prop: [componentPropNode, componentPropPath],
        componentBlock: [componentBlockNode, componentBlockPath]
      } = ancestorComponentBlock;
      const isLastProp = componentPropPath[componentPropPath.length - 1] === componentBlockNode.children.length - 1;
      if (componentPropNode.type === 'component-block-prop') {
        const [[paragraphNode, paragraphPath]] = Editor.nodes(editor, {
          match: node => node.type === 'paragraph'
        });
        const isLastParagraph = paragraphPath[paragraphPath.length - 1] === componentPropNode.children.length - 1;
        if (Node.string(paragraphNode) === '' && isLastParagraph) {
          if (isLastProp) {
            Transforms.moveNodes(editor, {
              at: paragraphPath,
              to: Path.next(ancestorComponentBlock.componentBlock[1])
            });
          } else {
            Transforms.move(editor, {
              distance: 1,
              unit: 'line'
            });
            Transforms.removeNodes(editor, {
              at: paragraphPath
            });
          }
          return;
        }
      }
      if (componentPropNode.type === 'component-inline-prop') {
        Editor.withoutNormalizing(editor, () => {
          const componentBlock = blockComponents[componentBlockNode.component];
          if (componentPropNode.propPath !== undefined && componentBlock !== undefined) {
            const rootSchema = {
              kind: 'object',
              fields: componentBlock.schema
            };
            const ancestorFields = getAncestorSchemas(rootSchema, componentPropNode.propPath, componentBlockNode.props);
            const idx = [...ancestorFields].reverse().findIndex(item => item.kind === 'array');
            if (idx !== -1) {
              const arrayFieldIdx = ancestorFields.length - 1 - idx;
              const arrayField = ancestorFields[arrayFieldIdx];
              assert(arrayField.kind === 'array');
              const val = getValueAtPropPath(componentBlockNode.props, componentPropNode.propPath.slice(0, arrayFieldIdx));
              if (doesSchemaOnlyEverContainASingleChildField(arrayField.element)) {
                if (Node.string(componentPropNode) === '' && val.length - 1 === componentPropNode.propPath[arrayFieldIdx]) {
                  Transforms.removeNodes(editor, {
                    at: componentPropPath
                  });
                  if (isLastProp) {
                    Transforms.insertNodes(editor, {
                      type: 'paragraph',
                      children: [{
                        text: ''
                      }]
                    }, {
                      at: Path.next(componentBlockPath)
                    });
                    Transforms.select(editor, Path.next(componentBlockPath));
                  } else {
                    Transforms.move(editor, {
                      distance: 1,
                      unit: 'line'
                    });
                  }
                } else {
                  insertBreak();
                }
                return;
              }
            }
          }
          Transforms.splitNodes(editor, {
            always: true
          });
          const splitNodePath = Path.next(componentPropPath);
          if (isLastProp) {
            Transforms.moveNodes(editor, {
              at: splitNodePath,
              to: Path.next(componentBlockPath)
            });
          } else {
            moveChildren(editor, splitNodePath, [...Path.next(splitNodePath), 0]);
            Transforms.removeNodes(editor, {
              at: splitNodePath
            });
          }
        });
        return;
      }
    }
    insertBreak();
  };
  editor.normalizeNode = entry => {
    const [node, path] = entry;
    if (node.type === 'component-inline-prop' && !node.propPath && (node.children.length !== 1 || !Text$1.isText(node.children[0]) || node.children[0].text !== '')) {
      Transforms.removeNodes(editor, {
        at: path
      });
      return;
    }
    if (node.type === 'component-block') {
      const componentBlock = blockComponents[node.component];
      if (componentBlock) {
        const rootSchema = {
          kind: 'object',
          fields: componentBlock.schema
        };
        const updatedProps = addMissingFields(node.props, rootSchema);
        if (updatedProps !== node.props) {
          Transforms.setNodes(editor, {
            props: updatedProps
          }, {
            at: path
          });
          return;
        }
        for (const [propPath, arrayField] of findArrayFieldsWithSingleChildField(rootSchema, node.props)) {
          if (node.children.length === 1 && node.children[0].type === 'component-inline-prop' && node.children[0].propPath === undefined) {
            break;
          }
          const nodesWithin = [];
          for (const [idx, childNode] of node.children.entries()) {
            if ((childNode.type === 'component-block-prop' || childNode.type === 'component-inline-prop') && childNode.propPath !== undefined) {
              const subPath = childNode.propPath.concat();
              while (subPath.length) {
                if (typeof subPath.pop() === 'number') break;
              }
              if (areArraysEqual(propPath, subPath)) {
                nodesWithin.push([idx, childNode]);
              }
            }
          }
          const arrVal = getValueAtPropPath(node.props, propPath);
          const prevKeys = getKeysForArrayValue(arrVal);
          const prevKeysSet = new Set(prevKeys);
          const alreadyUsedIndicies = new Set();
          const newVal = [];
          const newKeys = [];
          const getNewKey = () => {
            let key = getNewArrayElementKey();
            while (prevKeysSet.has(key)) {
              key = getNewArrayElementKey();
            }
            return key;
          };
          for (const [, node] of nodesWithin) {
            const idxFromValue = node.propPath[propPath.length];
            assert(typeof idxFromValue === 'number');
            if (arrVal.length <= idxFromValue || alreadyUsedIndicies.has(idxFromValue) && isEmptyChildFieldNode(node)) {
              newVal.push(getInitialPropsValue(arrayField.element));
              newKeys.push(getNewKey());
            } else {
              alreadyUsedIndicies.add(idxFromValue);
              newVal.push(arrVal[idxFromValue]);
              newKeys.push(alreadyUsedIndicies.has(idxFromValue) ? getNewKey() : prevKeys[idxFromValue]);
            }
          }
          setKeysForArrayValue(newVal, newKeys);
          if (!areArraysEqual(arrVal, newVal)) {
            const transformedProps = replaceValueAtPropPath(rootSchema, node.props, newVal, propPath);
            Transforms.setNodes(editor, {
              props: transformedProps
            }, {
              at: path
            });
            for (const [idx, [idxInChildrenOfBlock, nodeWithin]] of nodesWithin.entries()) {
              const newPropPath = [...nodeWithin.propPath];
              newPropPath[propPath.length] = idx;
              Transforms.setNodes(editor, {
                propPath: newPropPath
              }, {
                at: [...path, idxInChildrenOfBlock]
              });
            }
            return;
          }
        }
        const missingKeys = new Map(findChildPropPaths(node.props, componentBlock.schema).map(x => [JSON.stringify(x.path), x.options.kind]));
        node.children.forEach(node => {
          assert(node.type === 'component-block-prop' || node.type === 'component-inline-prop');
          missingKeys.delete(JSON.stringify(node.propPath));
        });
        if (missingKeys.size) {
          Transforms.insertNodes(editor, [...missingKeys].map(([prop, kind]) => ({
            type: `component-${kind}-prop`,
            propPath: prop ? JSON.parse(prop) : prop,
            children: [{
              text: ''
            }]
          })), {
            at: [...path, node.children.length]
          });
          return;
        }
        const foundProps = new Set();
        const stringifiedInlinePropPaths = {};
        findChildPropPaths(node.props, blockComponents[node.component].schema).forEach((x, index) => {
          stringifiedInlinePropPaths[JSON.stringify(x.path)] = {
            options: x.options,
            index
          };
        });
        for (const [index, childNode] of node.children.entries()) {
          if (
          // children that are not these will be handled by
          // the generic allowedChildren normalization
          childNode.type !== 'component-inline-prop' && childNode.type !== 'component-block-prop') {
            continue;
          }
          const childPath = [...path, index];
          const stringifiedPropPath = JSON.stringify(childNode.propPath);
          if (stringifiedInlinePropPaths[stringifiedPropPath] === undefined) {
            Transforms.removeNodes(editor, {
              at: childPath
            });
            return;
          }
          if (foundProps.has(stringifiedPropPath)) {
            Transforms.removeNodes(editor, {
              at: childPath
            });
            return;
          }
          foundProps.add(stringifiedPropPath);
          const propInfo = stringifiedInlinePropPaths[stringifiedPropPath];
          const expectedIndex = propInfo.index;
          if (index !== expectedIndex) {
            Transforms.moveNodes(editor, {
              at: childPath,
              to: [...path, expectedIndex]
            });
            return;
          }
          const expectedChildNodeType = `component-${propInfo.options.kind}-prop`;
          if (childNode.type !== expectedChildNodeType) {
            Transforms.setNodes(editor, {
              type: expectedChildNodeType
            }, {
              at: childPath
            });
            return;
          }
          const documentFeatures = memoizedGetDocumentFeaturesForChildField(propInfo.options);
          if (normalizeNodeWithinComponentProp([childNode, childPath], editor, documentFeatures)) {
            return;
          }
        }
      }
    }
    normalizeNode(entry);
  };
  return editor;
}

// the only thing that this will fix is a new field being added to an object field, nothing else.
function addMissingFields(value, schema) {
  if (schema.kind === 'child' || schema.kind === 'form') {
    return value;
  }
  if (schema.kind === 'conditional') {
    const conditionalValue = value;
    const updatedInnerValue = addMissingFields(conditionalValue.value, schema.values[conditionalValue.discriminant.toString()]);
    if (updatedInnerValue === conditionalValue.value) {
      return value;
    }
    return {
      discriminant: conditionalValue.discriminant,
      value: updatedInnerValue
    };
  }
  if (schema.kind === 'array') {
    const arrValue = value;
    const newArrValue = arrValue.map(x => addMissingFields(x, schema.element));
    if (areArraysEqual(arrValue, newArrValue)) {
      return value;
    }
    return newArrValue;
  }
  if (schema.kind === 'object') {
    const objectValue = value;
    let hasChanged = false;
    const newObjectValue = {};
    for (const [key, innerSchema] of Object.entries(schema.fields)) {
      const innerValue = objectValue[key];
      if (innerValue === undefined) {
        hasChanged = true;
        newObjectValue[key] = getInitialPropsValue(innerSchema);
        continue;
      }
      const newInnerValue = addMissingFields(innerValue, innerSchema);
      if (newInnerValue !== innerValue) {
        hasChanged = true;
      }
      newObjectValue[key] = newInnerValue;
    }
    if (hasChanged) {
      return newObjectValue;
    }
    return value;
  }
  assertNever(schema);
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

// TODO: button labels ("Choose file", "Remove") need i18n support
function ImageFieldInput(props) {
  var _props$validation, _props$validation2;
  const {
    value
  } = props;
  const [blurred, onBlur] = useReducer(() => true, false);
  const isInEditor = useIsInDocumentEditor();
  const objectUrl = useObjectURL(value === null ? null : value.data);
  const labelId = useId$1();
  const descriptionId = useId$1();
  return /*#__PURE__*/jsxs(Flex, {
    "aria-describedby": props.description ? descriptionId : undefined,
    "aria-labelledby": labelId,
    direction: "column",
    gap: "medium",
    role: "group",
    children: [/*#__PURE__*/jsx(FieldLabel, {
      id: labelId,
      elementType: "span",
      isRequired: (_props$validation = props.validation) === null || _props$validation === void 0 ? void 0 : _props$validation.isRequired,
      children: props.label
    }), props.description && /*#__PURE__*/jsx(Text, {
      size: "small",
      color: "neutralSecondary",
      id: descriptionId,
      children: props.description
    }), /*#__PURE__*/jsxs(ButtonGroup, {
      children: [/*#__PURE__*/jsx(ActionButton, {
        onPress: async () => {
          const image = await getUploadedImage();
          if (image) {
            var _image$filename$match;
            const extension = (_image$filename$match = image.filename.match(/\.([^.]+$)/)) === null || _image$filename$match === void 0 ? void 0 : _image$filename$match[1];
            if (extension) {
              props.onChange({
                data: image.content,
                extension,
                filename: image.filename
              });
            }
          }
        },
        children: "Choose file"
      }), value !== null && /*#__PURE__*/jsx(ActionButton, {
        prominence: "low",
        onPress: () => {
          props.onChange(null);
          onBlur();
        },
        children: "Remove"
      })]
    }), objectUrl && /*#__PURE__*/jsx(Box, {
      alignSelf: "start",
      backgroundColor: "canvas",
      borderRadius: "regular",
      border: "neutral",
      padding: "regular",
      children: /*#__PURE__*/jsx("img", {
        src: objectUrl,
        alt: "",
        style: {
          display: 'block',
          maxHeight: tokenSchema.size.alias.singleLineWidth,
          maxWidth: '100%'
        }
      })
    }), isInEditor && value !== null && /*#__PURE__*/jsx(TextField, {
      label: "Filename",
      onChange: filename => {
        props.onChange({
          ...value,
          filename
        });
      },
      value: value.filename
    }), (props.forceValidation || blurred) && ((_props$validation2 = props.validation) === null || _props$validation2 === void 0 ? void 0 : _props$validation2.isRequired) && value === null && /*#__PURE__*/jsxs(FieldMessage, {
      children: [props.label, " is required"]
    })]
  });
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

function order(a, b) {
  return {
    start: Math.min(a, b),
    end: Math.max(a, b)
  };
}
function getRelativeRowPath(hasHead, rowIndex) {
  return hasHead ? rowIndex === 0 ? [0, 0] : [1, rowIndex - 1] : [0, rowIndex];
}
function getSelectedTableArea(editor) {
  var _Editor$above, _editor$selection, _Editor$above2, _editor$selection2;
  const anchor = (_Editor$above = Editor.above(editor, {
    match: nodeTypeMatcher('table-cell'),
    at: (_editor$selection = editor.selection) === null || _editor$selection === void 0 ? void 0 : _editor$selection.anchor.path
  })) === null || _Editor$above === void 0 ? void 0 : _Editor$above[1];
  const focus = (_Editor$above2 = Editor.above(editor, {
    match: nodeTypeMatcher('table-cell'),
    at: (_editor$selection2 = editor.selection) === null || _editor$selection2 === void 0 ? void 0 : _editor$selection2.focus.path
  })) === null || _Editor$above2 === void 0 ? void 0 : _Editor$above2[1];
  const table = Editor.above(editor, {
    match: nodeTypeMatcher('table')
  });
  if (editor.selection && table && Element$1.isElement(table[0].children[0]) && anchor && focus && Path.equals(anchor.slice(0, -3), focus.slice(0, -3))) {
    const [start, end] = Editor.edges(editor, editor.selection);
    return {
      tablePath: table[1],
      table: table[0],
      singleCell: Path.equals(anchor, focus) ? Point.equals(Editor.start(editor, anchor), start) && Point.equals(Editor.end(editor, anchor), end) && !Point.equals(start, end) ? 'selected' : 'not-selected' : 'many',
      row: order(anchor[anchor.length - 2] + anchor[anchor.length - 3], focus[focus.length - 2] + focus[anchor.length - 3]),
      column: order(anchor[anchor.length - 1], focus[focus.length - 1])
    };
  }
}
const cell = header => ({
  type: 'table-cell',
  ...(header ? {
    header: true
  } : {}),
  children: [{
    type: 'paragraph',
    children: [{
      text: ''
    }]
  }]
});
function cloneDescendant(node) {
  if (Text$1.isText(node)) return {
    ...node
  };
  return {
    ...node,
    children: node.children.map(cloneDescendant)
  };
}
function withTable(editor) {
  const {
    deleteFragment,
    normalizeNode,
    getFragment,
    insertFragment,
    deleteBackward
  } = editor;
  editor.insertFragment = fragment => {
    const selectedTableArea = getSelectedTableArea(editor);
    if (!selectedTableArea || fragment.length !== 1 || fragment[0].type !== 'table') {
      insertFragment(fragment);
      return;
    }
    const newRows = fragment[0].children.flatMap(child => child.type === 'table-head' || child.type === 'table-body' ? child.children : []);
    if (!newRows.every(nodeTypeMatcher('table-row'))) {
      insertFragment(fragment);
      return;
    }
    let {
      row,
      column,
      tablePath,
      table
    } = selectedTableArea;
    const existingBody = selectedTableArea.table.children[selectedTableArea.table.children.length === 1 ? 0 : 1];
    if (newRows[0].type !== 'table-row' || existingBody.type !== 'table-body' || existingBody.children[0].type !== 'table-row') {
      insertFragment(fragment);
      return;
    }
    const hasHead = table.children[0].type === 'table-head';
    if (selectedTableArea.singleCell !== 'many') {
      row = {
        start: row.start,
        end: Math.min(row.start + newRows.length - 1, existingBody.children.length - 1 + (hasHead ? 1 : 0))
      };
      column = {
        start: column.start,
        end: Math.min(column.start + newRows[0].children.length - 1, existingBody.children[0].children.length - 1)
      };
    }
    Editor.withoutNormalizing(editor, () => {
      for (let rowIndex = row.start; rowIndex <= row.end; rowIndex++) {
        const newRow = newRows[(rowIndex - row.start) % newRows.length];
        for (let cellIndex = column.start; cellIndex <= column.end; cellIndex++) {
          const relativeCellPath = [...getRelativeRowPath(hasHead, rowIndex), cellIndex];
          const cell = Node.get(table, relativeCellPath);
          const newCell = newRow.children[(cellIndex - column.start) % newRow.children.length];
          if (cell.type !== 'table-cell' || newCell.type !== 'table-cell') {
            continue;
          }
          const cellPath = [...tablePath, ...relativeCellPath];
          for (const childIdx of [...cell.children.keys()].reverse()) {
            Transforms.removeNodes(editor, {
              at: [...cellPath, childIdx]
            });
          }
          Transforms.insertNodes(editor, newCell.children.map(cloneDescendant), {
            at: [...cellPath, 0]
          });
        }
      }
      Transforms.setSelection(editor, {
        anchor: Editor.start(editor, [...tablePath, ...getRelativeRowPath(hasHead, row.start), column.start]),
        focus: Editor.end(editor, [...tablePath, ...getRelativeRowPath(hasHead, row.end), column.end])
      });
    });
  };
  editor.deleteBackward = unit => {
    if (editor.selection && Range.isCollapsed(editor.selection) && editor.selection.anchor.offset === 0) {
      const tableCell = Editor.above(editor, {
        match: nodeTypeMatcher('table-cell')
      });
      if (tableCell && tableCell[0].children[0].type === 'paragraph' && tableCell[0].children[0].children[0].type === undefined && Path.equals(editor.selection.anchor.path, [...tableCell[1], 0, 0])) {
        return;
      }
    }
    deleteBackward(unit);
  };
  editor.getFragment = () => {
    const selectedTableArea = getSelectedTableArea(editor);
    if (selectedTableArea && selectedTableArea.singleCell !== 'not-selected') {
      var _table$children$;
      const {
        table
      } = selectedTableArea;
      const first = table.children[0].type === 'table-head' || table.children[0].type === 'table-body' ? table.children[0] : undefined;
      if (!first) {
        return getFragment();
      }
      const second = ((_table$children$ = table.children[1]) === null || _table$children$ === void 0 ? void 0 : _table$children$.type) === 'table-body' ? table.children[1] : undefined;
      const body = second || first;
      const hasHead = first.type === 'table-head';
      const isSelectionInHead = selectedTableArea.row.start === 0 && !!second;
      const columnLength = selectedTableArea.column.end - selectedTableArea.column.start + 1;
      return [{
        type: 'table',
        children: [...(isSelectionInHead ? [{
          type: 'table-head',
          children: [{
            type: 'table-row',
            children: Array.from({
              length: columnLength
            }).map((_, columnIndex) => first.children[0].children[columnIndex + selectedTableArea.column.start])
          }]
        }] : []), {
          type: 'table-body',
          children: Array.from({
            length: selectedTableArea.row.end - selectedTableArea.row.start + (isSelectionInHead ? 0 : 1)
          }).map((_, rowIndex) => ({
            type: 'table-row',
            children: Array.from({
              length: columnLength
            }).map((_, columnIndex) => body.children[rowIndex + selectedTableArea.row.start - (hasHead && !isSelectionInHead ? 1 : 0)].children[columnIndex + selectedTableArea.column.start])
          }))
        }]
      }];
    }
    return getFragment();
  };
  editor.deleteFragment = direction => {
    if (!editor.selection || Range.isCollapsed(editor.selection)) {
      deleteFragment(direction);
      return;
    }
    const selectedTableArea = getSelectedTableArea(editor);
    if (!selectedTableArea || selectedTableArea.singleCell === 'not-selected') {
      deleteFragment(direction);
      return;
    }
    const headOrBody = selectedTableArea.table.children[0];
    if (!Element$1.isElement(headOrBody) || !Element$1.isElement(headOrBody.children[0])) {
      deleteFragment(direction);
      return;
    }
    const maxRowIdx = selectedTableArea.table.children.reduce((sum, headOrBody) => sum + (headOrBody.type === 'table-head' || headOrBody.type === 'table-body' ? headOrBody.children.length : 0), 0) - 1;
    const {
      row,
      column,
      tablePath
    } = selectedTableArea;
    // note the fact that hasWholeColumnSelected uses row and hasWholeRowSelected uses column
    // is not a mistake. if a whole column has been selected, then the starting row is 0 and the end is the last row
    const hasWholeColumnSelected = row.start === 0 && row.end === maxRowIdx;
    const hasWholeRowSelected = column.start === 0 && column.end === headOrBody.children[0].children.length - 1;
    if (hasWholeColumnSelected && hasWholeRowSelected) {
      Transforms.removeNodes(editor, {
        at: tablePath
      });
      return;
    }
    const hasHead = headOrBody.type === 'table-head';
    if (hasWholeRowSelected) {
      Editor.withoutNormalizing(editor, () => {
        for (let i = row.end; i >= row.start; i--) {
          if (hasHead) {
            if (i === 0) {
              Transforms.removeNodes(editor, {
                at: [...tablePath, 0]
              });
              continue;
            }
            Transforms.removeNodes(editor, {
              at: [...tablePath, 1, i - 1]
            });
            continue;
          }
          Transforms.removeNodes(editor, {
            at: [...tablePath, 0, i]
          });
        }
      });
      return;
    }
    if (hasWholeColumnSelected) {
      Editor.withoutNormalizing(editor, () => {
        for (let i = column.end; i >= column.start; i--) {
          for (let rowIdx = 0; rowIdx <= maxRowIdx; rowIdx++) {
            Transforms.removeNodes(editor, {
              at: [...tablePath, ...getRelativeRowPath(hasHead, rowIdx), i]
            });
          }
        }
        const selectionPath = [...tablePath, 0, 0, column.start];
        const point = Editor.start(editor, column.start === 0 ? selectionPath : Path.previous(selectionPath));
        Transforms.select(editor, point);
      });
      return;
    }
    const selectionStart = Editor.start(editor, editor.selection).path;
    Editor.withoutNormalizing(editor, () => {
      for (let rowIndex = row.start; rowIndex <= row.end; rowIndex++) {
        for (let cellIndex = column.start; cellIndex <= column.end; cellIndex++) {
          const relativeCellPath = [...getRelativeRowPath(hasHead, rowIndex), cellIndex];
          const cell = Node.get(selectedTableArea.table, relativeCellPath);
          if (!Element$1.isElement(cell)) {
            continue;
          }
          const cellPath = [...tablePath, ...relativeCellPath];
          Transforms.insertNodes(editor, {
            type: 'paragraph',
            children: [{
              text: ''
            }]
          }, {
            at: [...cellPath, 0]
          });
          for (const childIdx of [...cell.children.keys()].reverse()) {
            Transforms.removeNodes(editor, {
              at: [...cellPath, childIdx + 1]
            });
          }
        }
      }
      Transforms.select(editor, selectionStart);
    });
  };
  editor.normalizeNode = entry => {
    const [node, path] = entry;
    if (node.type === 'table-head' && node.children.length > 1) {
      moveChildren(editor, path, Path.next(path), (_, i) => i !== 0);
      return;
    }
    let didUpdateThings = false;
    for (const parent of ['table-body', 'table-head']) {
      if (node.type === parent) {
        for (const [rowIdx, row] of node.children.entries()) {
          if (row.type === 'table-row') {
            for (const [cellIdx, cell] of row.children.entries()) {
              if (cell.type === 'table-cell') {
                const at = [...path, rowIdx, cellIdx];
                if (cell.header && parent === 'table-body') {
                  Transforms.unsetNodes(editor, 'header', {
                    at
                  });
                  didUpdateThings = true;
                }
                if (!cell.header && parent === 'table-head') {
                  Transforms.setNodes(editor, {
                    header: true
                  }, {
                    at
                  });
                  didUpdateThings = true;
                }
              }
            }
          }
        }
      }
    }
    if (didUpdateThings) {
      return;
    }
    if (node.type === 'table') {
      const maxRowCount = node.children.reduce((max, node) => node.type === 'table-head' || node.type === 'table-body' ? node.children.reduce((max, node) => node.type === 'table-row' ? Math.max(max, node.children.length) : max, max) : max, 0);
      let didInsert = false;
      for (const [idx, child] of node.children.entries()) {
        if (child.type === 'table-body' || child.type === 'table-head') {
          for (const [rowIdx, row] of child.children.entries()) {
            if (row.type === 'table-row' && row.children.length !== maxRowCount) {
              Transforms.insertNodes(editor, Array.from({
                length: maxRowCount - row.children.length
              }, () => cell(child.type === 'table-head')), {
                at: [...path, idx, rowIdx, row.children.length]
              });
              didInsert = true;
            }
          }
        }
      }
      if (didInsert) {
        return;
      }
      if (node.children.length === 1 && node.children[0].type === 'table-head') {
        Transforms.insertNodes(editor, {
          type: 'table-body',
          children: Array.from({
            length: node.children[0].children.length
          }, () => cell(false))
        }, {
          at: [...path, 1]
        });
        return;
      }
      if (node.children.length === 2 && node.children[1].type === 'table-head') {
        Transforms.moveNodes(editor, {
          at: [...path, 1],
          to: [...path, 0]
        });
        return;
      }
      if (node.children.length > 2) {
        moveChildren(editor, path, Path.next(path), (_, i) => i !== 0 && i !== 1);
        return;
      }
    }
    normalizeNode(entry);
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
    if (!Element$1.isElement(row)) continue;
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
    if (!Element$1.isElement(firstTableChild) || !Element$1.isElement(firstTableChild.children[0])) {
      return {
        top: new Map(),
        left: new Map()
      };
    }
    const top = new Map();
    const left = new Map();
    for (const [idx, cell] of firstTableChild.children[0].children.entries()) {
      if (cell.type !== 'table-cell') continue;
      top.set(cell, element.children.every(headOrBody => Element$1.isElement(headOrBody) ? headOrBody.children.every(row => Element$1.isElement(row) && (selectedCells === null || selectedCells === void 0 ? void 0 : selectedCells.cells.has(row.children[idx]))) : false));
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

const codeBlockShortcutPattern = /^```(\w+)? ?$/;
function withCodeBlock(documentFeatures, componentBlocks, editor) {
  const {
    insertBreak,
    normalizeNode,
    insertText
  } = editor;
  function codeBlockShortcut(block) {
    var _aliasesToCanonicalNa;
    if ((block === null || block === void 0 ? void 0 : block[0].type) !== 'paragraph' || block[0].children.length !== 1 || block[0].children[0].type !== undefined) {
      return false;
    }
    const match = codeBlockShortcutPattern.exec(block[0].children[0].text);
    if (!match) {
      return false;
    }
    const locationDocumentFeatures = getAncestorComponentChildFieldDocumentFeatures(editor, documentFeatures, componentBlocks);
    if (locationDocumentFeatures && (locationDocumentFeatures.kind === 'inline' || !locationDocumentFeatures.documentFeatures.formatting.blockTypes.code)) {
      return false;
    }

    // so that this starts a new undo group
    editor.history.undos.push({
      operations: [],
      selectionBefore: editor.selection
    });
    Transforms.select(editor, block[1]);
    Transforms.delete(editor);
    Transforms.wrapNodes(editor, {
      type: 'code',
      ...(match[1] ? {
        language: (_aliasesToCanonicalNa = aliasesToCanonicalName.get(match[1].toLowerCase())) !== null && _aliasesToCanonicalNa !== void 0 ? _aliasesToCanonicalNa : match[1]
      } : {}),
      children: []
    }, {
      match: node => node.type === 'paragraph'
    });
    return true;
  }
  editor.insertBreak = () => {
    const block = Editor.above(editor, {
      match: isBlock
    });
    if ((block === null || block === void 0 ? void 0 : block[0].type) === 'code' && Text$1.isText(block[0].children[0])) {
      const text = block[0].children[0].text;
      if (text[text.length - 1] === '\n' && editor.selection && Range.isCollapsed(editor.selection) && Point.equals(Editor.end(editor, block[1]), editor.selection.anchor)) {
        insertBreak();
        Transforms.setNodes(editor, {
          type: 'paragraph',
          children: []
        });
        Transforms.delete(editor, {
          distance: 1,
          at: {
            path: [...block[1], 0],
            offset: text.length - 1
          }
        });
        return;
      }
      editor.insertText('\n');
      return;
    }
    if (editor.selection && Range.isCollapsed(editor.selection) && codeBlockShortcut(block)) {
      return;
    }
    insertBreak();
  };
  editor.insertText = text => {
    insertText(text);
    if (text === ' ' && editor.selection && Range.isCollapsed(editor.selection)) {
      codeBlockShortcut(Editor.above(editor, {
        match: isBlock
      }));
    }
  };
  editor.normalizeNode = ([node, path]) => {
    if (node.type === 'code' && Element$1.isElement(node)) {
      for (const [index, childNode] of node.children.entries()) {
        if (!Text$1.isText(childNode)) {
          if (editor.isVoid(childNode)) {
            Transforms.removeNodes(editor, {
              at: [...path, index]
            });
          } else {
            Transforms.unwrapNodes(editor, {
              at: [...path, index]
            });
          }
          return;
        }
        const marks = Object.keys(childNode).filter(x => x !== 'text');
        if (marks.length) {
          Transforms.unsetNodes(editor, marks, {
            at: [...path, index]
          });
          return;
        }
      }
    }
    normalizeNode([node, path]);
  };
  return editor;
}

const paragraphElement = () => ({
  type: 'paragraph',
  children: [{
    text: ''
  }]
});
function withParagraphs(editor) {
  const {
    normalizeNode
  } = editor;
  editor.normalizeNode = entry => {
    const [node, path] = entry;
    if (Editor.isEditor(node)) {
      let lastNode = node.children[node.children.length - 1];
      if ((lastNode === null || lastNode === void 0 ? void 0 : lastNode.type) !== 'paragraph') {
        Transforms.insertNodes(editor, paragraphElement(), {
          at: [...path, node.children.length]
        });
        return;
      }
    }
    normalizeNode(entry);
  };
  return editor;
}

function withLayouts(editor) {
  const {
    normalizeNode,
    deleteBackward
  } = editor;
  editor.deleteBackward = unit => {
    if (editor.selection && Range.isCollapsed(editor.selection) &&
    // this is just an little optimisation
    // we're only doing things if we're at the start of a layout area
    // and the start of anything will always be offset 0
    // so we'll bailout if we're not at offset 0
    editor.selection.anchor.offset === 0) {
      const [aboveNode, abovePath] = Editor.above(editor, {
        match: node => node.type === 'layout-area'
      }) || [editor, []];
      if (aboveNode.type === 'layout-area' && Point.equals(Editor.start(editor, abovePath), editor.selection.anchor)) {
        return;
      }
    }
    deleteBackward(unit);
  };
  editor.normalizeNode = entry => {
    const [node, path] = entry;
    if (Element$1.isElement(node) && node.type === 'layout') {
      if (node.layout === undefined) {
        Transforms.unwrapNodes(editor, {
          at: path
        });
        return;
      }
      if (node.children.length < node.layout.length) {
        Transforms.insertNodes(editor, Array.from({
          length: node.layout.length - node.children.length
        }).map(() => ({
          type: 'layout-area',
          children: [paragraphElement()]
        })), {
          at: [...path, node.children.length]
        });
        return;
      }
      if (node.children.length > node.layout.length) {
        Array.from({
          length: node.children.length - node.layout.length
        }).map((_, i) => i).reverse().forEach(i => {
          const layoutAreaToRemovePath = [...path, i + node.layout.length];
          const child = node.children[i + node.layout.length];
          moveChildren(editor, layoutAreaToRemovePath, [...path, node.layout.length - 1, node.children[node.layout.length - 1].children.length], node => node.type !== 'paragraph' || Node.string(child) !== '');
          Transforms.removeNodes(editor, {
            at: layoutAreaToRemovePath
          });
        });
        return;
      }
    }
    normalizeNode(entry);
  };
  return editor;
}

const markdownLinkPattern = /(^|\s)\[(.+?)\]\((\S+)\)$/;
function withLink(editorDocumentFeatures, componentBlocks, editor) {
  const {
    insertText,
    isInline,
    normalizeNode
  } = editor;
  editor.isInline = element => {
    return element.type === 'link' ? true : isInline(element);
  };
  if (editorDocumentFeatures.links) {
    editor.insertText = text => {
      insertText(text);
      if (text !== ')' || !editor.selection) {
        return;
      }
      const startOfBlock = Editor.start(editor, Editor.above(editor, {
        match: isBlock
      })[1]);
      const startOfBlockToEndOfShortcutString = Editor.string(editor, {
        anchor: editor.selection.anchor,
        focus: startOfBlock
      });
      const match = markdownLinkPattern.exec(startOfBlockToEndOfShortcutString);
      if (!match) {
        return;
      }
      const ancestorComponentChildFieldDocumentFeatures = getAncestorComponentChildFieldDocumentFeatures(editor, editorDocumentFeatures, componentBlocks);
      if ((ancestorComponentChildFieldDocumentFeatures === null || ancestorComponentChildFieldDocumentFeatures === void 0 ? void 0 : ancestorComponentChildFieldDocumentFeatures.documentFeatures.links) === false) {
        return;
      }
      const [, maybeWhitespace, linkText, href] = match;
      // by doing this, the insertText(')') above will happen in a different undo than the link replacement
      // so that means that when someone does an undo after this
      // it will undo to the state of "[content](link)" rather than "[content](link" (note the missing closing bracket)
      editor.history.undos.push({
        operations: [],
        selectionBefore: editor.selection
      });
      const startOfShortcut = match.index === 0 ? startOfBlock : EditorAfterButIgnoringingPointsWithNoContent(editor, startOfBlock, {
        distance: match.index
      });
      const startOfLinkText = EditorAfterButIgnoringingPointsWithNoContent(editor, startOfShortcut, {
        distance: maybeWhitespace === '' ? 1 : 2
      });
      const endOfLinkText = EditorAfterButIgnoringingPointsWithNoContent(editor, startOfLinkText, {
        distance: linkText.length
      });
      Transforms.delete(editor, {
        at: {
          anchor: endOfLinkText,
          focus: editor.selection.anchor
        }
      });
      Transforms.delete(editor, {
        at: {
          anchor: startOfShortcut,
          focus: startOfLinkText
        }
      });
      Transforms.wrapNodes(editor, {
        type: 'link',
        href,
        children: []
      }, {
        at: {
          anchor: editor.selection.anchor,
          focus: startOfShortcut
        },
        split: true
      });
      const nextNode = Editor.next(editor);
      if (nextNode) {
        Transforms.select(editor, nextNode[1]);
      }
    };
  }
  editor.normalizeNode = ([node, path]) => {
    if (node.type === 'link') {
      if (Node.string(node) === '') {
        Transforms.unwrapNodes(editor, {
          at: path
        });
        return;
      }
      for (const [idx, child] of node.children.entries()) {
        if (child.type === 'link') {
          // links cannot contain links
          Transforms.unwrapNodes(editor, {
            at: [...path, idx]
          });
          return;
        }
      }
    }
    if (isInlineContainer(node)) {
      let lastMergableLink = null;
      for (const [idx, child] of node.children.entries()) {
        var _lastMergableLink;
        if (child.type === 'link' && child.href === ((_lastMergableLink = lastMergableLink) === null || _lastMergableLink === void 0 ? void 0 : _lastMergableLink.node.href)) {
          const firstLinkPath = [...path, lastMergableLink.index];
          const secondLinkPath = [...path, idx];
          const to = [...firstLinkPath, lastMergableLink.node.children.length];
          // note this is going in reverse, js doesn't have double-ended iterators so it's a for(;;)
          for (let i = child.children.length - 1; i >= 0; i--) {
            const childPath = [...secondLinkPath, i];
            Transforms.moveNodes(editor, {
              at: childPath,
              to
            });
          }
          Transforms.removeNodes(editor, {
            at: secondLinkPath
          });
          return;
        }
        if (!Text$1.isText(child) || child.text !== '') {
          lastMergableLink = null;
        }
        if (child.type === 'link') {
          lastMergableLink = {
            index: idx,
            node: child
          };
        }
      }
    }
    normalizeNode([node, path]);
  };
  return editor;
}

function createDocumentEditorForNormalization(documentFeatures, componentBlocks) {
  return _createDocumentEditor(createEditor(), documentFeatures, componentBlocks);
}
function _createDocumentEditor(baseEditor, documentFeatures, componentBlocks) {
  return withBlocksSchema(withParagraphs(withLink(documentFeatures, componentBlocks, withList(withTable(withComponentBlocks(componentBlocks, documentFeatures, withVoidElements(withLayouts(withCodeBlock(documentFeatures, componentBlocks, withDocumentFeaturesNormalization(documentFeatures, baseEditor))))))))));
}
function withBlocksSchema(editor) {
  const {
    normalizeNode
  } = editor;
  editor.normalizeNode = ([node, path]) => {
    if (!Text$1.isText(node) && node.type !== 'link') {
      const nodeType = Editor.isEditor(node) ? 'editor' : node.type;
      if (typeof nodeType !== 'string' || editorSchema[nodeType] === undefined) {
        Transforms.unwrapNodes(editor, {
          at: path
        });
        return;
      }
      const info = editorSchema[nodeType];
      if (info.kind === 'blocks' && node.children.length !== 0 && node.children.every(child => !isBlock(child))) {
        Transforms.wrapNodes(editor, {
          type: info.blockToWrapInlinesIn,
          children: []
        }, {
          at: path,
          match: node => !isBlock(node)
        });
        return;
      }
      let didUpdate = false;
      for (const [index, childNode] of [...node.children.entries()].reverse()) {
        const childPath = [...path, index];
        if (info.kind === 'inlines') {
          if (!Text$1.isText(childNode) && isBlock(childNode)) {
            handleNodeInInvalidPosition(editor, [childNode, childPath], path);
            didUpdate = true;
            continue;
          }
        } else {
          if (!isBlock(childNode)) {
            Transforms.wrapNodes(editor, {
              type: info.blockToWrapInlinesIn,
              children: []
            }, {
              at: childPath
            });
            didUpdate = true;
            continue;
          }
          if (!info.allowedChildren.has(childNode.type)) {
            handleNodeInInvalidPosition(editor, [childNode, childPath], path);
            didUpdate = true;
            continue;
          }
        }
      }
      if (didUpdate) {
        return;
      }
    }
    normalizeNode([node, path]);
  };
  return editor;
}
function handleNodeInInvalidPosition(editor, [node, path], ancestorPath) {
  const nodeType = node.type;
  const childNodeInfo = editorSchema[nodeType];
  // the parent of a block will never be an inline so this casting is okay
  const ancestorNode = Node.get(editor, ancestorPath);
  const parentNodeType = Editor.isEditor(ancestorNode) ? 'editor' : ancestorNode.type;
  const parentNodeInfo = editorSchema[parentNodeType];
  if (!childNodeInfo || childNodeInfo.invalidPositionHandleMode === 'unwrap') {
    if (parentNodeInfo.kind === 'blocks' && parentNodeInfo.blockToWrapInlinesIn) {
      Transforms.setNodes(editor, {
        type: parentNodeInfo.blockToWrapInlinesIn,
        ...Object.fromEntries(Object.keys(node).filter(key => key !== 'type' && key !== 'children').map(key => [key, null])) // the Slate types don't understand that null is allowed and it will unset properties with setNodes
      }, {
        at: path
      });
      return;
    }
    Transforms.unwrapNodes(editor, {
      at: path
    });
    return;
  }
  const info = editorSchema[ancestorNode.type || 'editor'];
  if ((info === null || info === void 0 ? void 0 : info.kind) === 'blocks' && info.allowedChildren.has(nodeType)) {
    if (ancestorPath.length === 0) {
      Transforms.moveNodes(editor, {
        at: path,
        to: [path[0] + 1]
      });
    } else {
      Transforms.moveNodes(editor, {
        at: path,
        to: Path.next(ancestorPath)
      });
    }
    return;
  }
  if (Editor.isEditor(ancestorNode)) {
    Transforms.moveNodes(editor, {
      at: path,
      to: [path[0] + 1]
    });
    Transforms.unwrapNodes(editor, {
      at: [path[0] + 1]
    });
    return;
  }
  handleNodeInInvalidPosition(editor, [node, path], ancestorPath.slice(0, -1));
}
function withVoidElements(editor) {
  const {
    isVoid
  } = editor;
  editor.isVoid = node => {
    return node.type === 'divider' || node.type === 'image' || isVoid(node);
  };
  return editor;
}

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
function useIsInDocumentEditor() {
  return useContext(IsInEditorContext);
}
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
            if (node.children.length === 1 && Element$1.isElement(node.children[0]) && node.children[0].type === 'component-inline-prop' && node.children[0].propPath === undefined) {
              return decorations;
            }
            node.children.forEach((child, index) => {
              if (Node.string(child) === '' && Element$1.isElement(child) && (child.type === 'component-block-prop' || child.type === 'component-inline-prop') && child.propPath !== undefined) {
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
let i$1 = 0;
function newKey$1() {
  return i$1++;
}
function InnerChildFieldInput(props) {
  const outerConfig = useDocumentEditorConfig();
  const [state, setState] = useState(() => ({
    key: newKey$1(),
    value: props.value
  }));
  const documentFeatures = useMemo(() => {
    return getWholeDocumentFeaturesForChildField(outerConfig.documentFeatures, props.schema.options);
  }, [props.schema, outerConfig.documentFeatures]);
  if (state.value !== props.value) {
    setState({
      key: newKey$1(),
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

let i = 0;
function newKey() {
  return i++;
}
function DocumentFieldInput(props) {
  let entryLayoutPane = useEntryLayoutSplitPaneContext();
  const [state, setState] = useState(() => ({
    key: newKey(),
    value: props.value
  }));
  if (state.value !== props.value) {
    setState({
      key: newKey(),
      value: props.value
    });
  }
  let fieldProps = {
    label: props.label,
    labelElementType: 'span',
    // the editor element isn't an input, so we need to use a span for the label
    description: props.description
  };
  if (entryLayoutPane === 'main') {
    fieldProps = {
      'aria-label': props.label
      // `aria-description` is still in W3C Editor's Draft for ARIA 1.3.
    };
  }

  return /*#__PURE__*/jsx(Field, {
    height: entryLayoutPane === 'main' ? '100%' : undefined,
    ...fieldProps,
    children: inputProps => /*#__PURE__*/createElement(DocumentEditor, {
      ...inputProps,
      key: state.key,
      componentBlocks: props.componentBlocks,
      documentFeatures: props.documentFeatures,
      onChange: val => {
        setState(state => ({
          key: state.key,
          value: val
        }));
        props.onChange(val);
      },
      value: state.value
    })
  });
}

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();
const defaultAltField = text({
  label: 'Alt text',
  description: 'This text will be used by screen readers and search engines.'
});
const emptyTitleField = basicFormFieldWithSimpleReaderParse({
  Input() {
    return null;
  },
  defaultValue() {
    return '';
  },
  parse(value) {
    if (value === undefined) return '';
    if (typeof value !== 'string') {
      throw new FieldDataError('Must be string');
    }
    return value;
  },
  validate(value) {
    return value;
  },
  serialize(value) {
    return {
      value
    };
  }
});
function normaliseDocumentFeatures(config) {
  var _config$formatting, _formatting$alignment, _formatting$alignment2, _formatting$blockType, _formatting$inlineMar, _formatting$inlineMar2, _formatting$inlineMar3, _formatting$inlineMar4, _formatting$inlineMar5, _formatting$inlineMar6, _formatting$inlineMar7, _formatting$inlineMar8, _formatting$listTypes, _formatting$listTypes2, _imagesConfig$schema$, _imagesConfig$schema, _imagesConfig$schema$2, _imagesConfig$schema2;
  const formatting = config.formatting === true ? {
    // alignment: true, // not supported natively in markdown
    blockTypes: true,
    headingLevels: true,
    inlineMarks: true,
    listTypes: true,
    softBreaks: true
  } : (_config$formatting = config.formatting) !== null && _config$formatting !== void 0 ? _config$formatting : {};
  const imagesConfig = config.images === true ? {} : config.images;
  return {
    formatting: {
      alignment: formatting.alignment === true ? {
        center: true,
        end: true
      } : {
        center: !!((_formatting$alignment = formatting.alignment) !== null && _formatting$alignment !== void 0 && _formatting$alignment.center),
        end: !!((_formatting$alignment2 = formatting.alignment) !== null && _formatting$alignment2 !== void 0 && _formatting$alignment2.end)
      },
      blockTypes: (formatting === null || formatting === void 0 ? void 0 : formatting.blockTypes) === true ? {
        blockquote: true,
        code: {
          schema: object({})
        }
      } : {
        blockquote: !!((_formatting$blockType = formatting.blockTypes) !== null && _formatting$blockType !== void 0 && _formatting$blockType.blockquote),
        code: (_formatting$blockType2 => {
          if (((_formatting$blockType2 = formatting.blockTypes) === null || _formatting$blockType2 === void 0 ? void 0 : _formatting$blockType2.code) === undefined) {
            return false;
          }
          if (formatting.blockTypes.code === true || !formatting.blockTypes.code.schema) {
            return {
              schema: object({})
            };
          }
          for (const key of ['type', 'children', 'language']) {
            if (key in formatting.blockTypes.code.schema) {
              throw new Error(`"${key}" cannot be a key in the schema for code blocks`);
            }
          }
          return {
            schema: object(formatting.blockTypes.code.schema)
          };
        })()
      },
      headings: (_obj$schema => {
        const opt = formatting === null || formatting === void 0 ? void 0 : formatting.headingLevels;
        const obj = typeof opt === 'object' && 'levels' in opt ? opt : {
          levels: opt,
          schema: undefined
        };
        if (obj.schema) {
          for (const key of ['type', 'children', 'level', 'textAlign']) {
            if (key in obj.schema) {
              throw new Error(`"${key}" cannot be a key in the schema for headings`);
            }
          }
        }
        return {
          levels: [...new Set(obj.levels === true ? [1, 2, 3, 4, 5, 6] : obj.levels)],
          schema: object((_obj$schema = obj.schema) !== null && _obj$schema !== void 0 ? _obj$schema : {})
        };
      })(),
      inlineMarks: formatting.inlineMarks === true ? {
        bold: true,
        code: true,
        italic: true,
        keyboard: false,
        // not supported natively in markdown
        strikethrough: true,
        subscript: false,
        // not supported natively in markdown
        superscript: false,
        // not supported natively in markdown
        underline: false // not supported natively in markdown
      } : {
        bold: !!((_formatting$inlineMar = formatting.inlineMarks) !== null && _formatting$inlineMar !== void 0 && _formatting$inlineMar.bold),
        code: !!((_formatting$inlineMar2 = formatting.inlineMarks) !== null && _formatting$inlineMar2 !== void 0 && _formatting$inlineMar2.code),
        italic: !!((_formatting$inlineMar3 = formatting.inlineMarks) !== null && _formatting$inlineMar3 !== void 0 && _formatting$inlineMar3.italic),
        strikethrough: !!((_formatting$inlineMar4 = formatting.inlineMarks) !== null && _formatting$inlineMar4 !== void 0 && _formatting$inlineMar4.strikethrough),
        underline: !!((_formatting$inlineMar5 = formatting.inlineMarks) !== null && _formatting$inlineMar5 !== void 0 && _formatting$inlineMar5.underline),
        keyboard: !!((_formatting$inlineMar6 = formatting.inlineMarks) !== null && _formatting$inlineMar6 !== void 0 && _formatting$inlineMar6.keyboard),
        subscript: !!((_formatting$inlineMar7 = formatting.inlineMarks) !== null && _formatting$inlineMar7 !== void 0 && _formatting$inlineMar7.subscript),
        superscript: !!((_formatting$inlineMar8 = formatting.inlineMarks) !== null && _formatting$inlineMar8 !== void 0 && _formatting$inlineMar8.superscript)
      },
      listTypes: formatting.listTypes === true ? {
        ordered: true,
        unordered: true
      } : {
        ordered: !!((_formatting$listTypes = formatting.listTypes) !== null && _formatting$listTypes !== void 0 && _formatting$listTypes.ordered),
        unordered: !!((_formatting$listTypes2 = formatting.listTypes) !== null && _formatting$listTypes2 !== void 0 && _formatting$listTypes2.unordered)
      },
      softBreaks: !!formatting.softBreaks
    },
    links: !!config.links,
    layouts: [...new Set((config.layouts || []).map(x => JSON.stringify(x)))].map(x => JSON.parse(x)),
    dividers: !!config.dividers,
    images: imagesConfig === undefined ? false : {
      ...imagesConfig,
      schema: {
        alt: (_imagesConfig$schema$ = (_imagesConfig$schema = imagesConfig.schema) === null || _imagesConfig$schema === void 0 ? void 0 : _imagesConfig$schema.alt) !== null && _imagesConfig$schema$ !== void 0 ? _imagesConfig$schema$ : defaultAltField,
        title: (_imagesConfig$schema$2 = (_imagesConfig$schema2 = imagesConfig.schema) === null || _imagesConfig$schema2 === void 0 ? void 0 : _imagesConfig$schema2.title) !== null && _imagesConfig$schema$2 !== void 0 ? _imagesConfig$schema$2 : emptyTitleField
      }
    },
    tables: !!config.tables
  };
}
function document$1({
  label,
  componentBlocks = {},
  description,
  ...documentFeaturesConfig
}) {
  const documentFeatures = normaliseDocumentFeatures(documentFeaturesConfig);
  const parse = mode => (_value, data) => {
    const markdoc = textDecoder.decode(data.content);
    const document = fromMarkdoc(Markdoc.parse(markdoc), componentBlocks);
    const editor = createDocumentEditorForNormalization(documentFeatures, componentBlocks);
    editor.children = document;
    Editor.normalize(editor, {
      force: true
    });
    return deserializeFiles(editor.children, componentBlocks, data.other, data.external || new Map(), mode, documentFeatures, data.slug);
  };
  return {
    kind: 'form',
    formKind: 'content',
    defaultValue() {
      return [{
        type: 'paragraph',
        children: [{
          text: ''
        }]
      }];
    },
    Input(props) {
      return /*#__PURE__*/jsx(DocumentFieldInput, {
        componentBlocks: componentBlocks,
        description: description,
        label: label,
        documentFeatures: documentFeatures,
        ...props
      });
    },
    parse: parse('edit'),
    contentExtension: '.mdoc',
    validate(value) {
      return value;
    },
    directories: [...collectDirectoriesUsedInSchema(object(Object.fromEntries(Object.entries(componentBlocks).map(([name, block]) => [name, object(block.schema)])))), ...(typeof documentFeatures.images === 'object' && typeof documentFeatures.images.directory === 'string' ? [fixPath(documentFeatures.images.directory)] : [])],
    serialize(value, opts) {
      const {
        extraFiles,
        node
      } = toMarkdocDocument(value, {
        componentBlocks,
        documentFeatures,
        slug: opts.slug
      });
      const other = new Map();
      const external = new Map();
      for (const file of extraFiles) {
        if (file.parent === undefined) {
          other.set(file.path, file.contents);
          continue;
        }
        if (!external.has(file.parent)) {
          external.set(file.parent, new Map());
        }
        external.get(file.parent).set(file.path, file.contents);
      }
      return {
        content: textEncoder.encode(Markdoc.format(Markdoc.parse(Markdoc.format(node)))),
        other,
        external,
        value: undefined
      };
    },
    reader: {
      parse: parse('read')
    }
  };
}

export { getRepoUrl as $, getSyncAuth as A, redirectToCloudAuth as B, CloudAppShellQuery as C, BranchInfoContext as D, useSetTreeSha as E, useCurrentUnscopedTree as F, GitHubAppShellQuery as G, updateTreeWithChanges as H, hydrateTreeCacheWithEntries as I, scopeEntriesWithPathPrefix as J, KEYSTATIC_CLOUD_API_URL as K, LOADING as L, fetchGitHubTreeData as M, treeSha as N, serializeProps as O, PageRoot as P, getSlugFromState as Q, RepoWithWriteAccessContext as R, useConfig as S, ThemeProvider as T, getSlugGlobForCollection as U, getCollectionFormat as V, getCollectionItemPath as W, PageBody as X, containerWidthForEntryLayout as Y, createGetPreviewProps as Z, useEventCallback as _, PageHeader as a, text as a$, getDataFileExtension as a0, clientSideValidateProp as a1, FormForEntry as a2, useRepositoryId as a3, useCreateBranchMutation as a4, getBranchPrefix as a5, prettyErrorForCreateBranchMutation as a6, getInitialPropsValue as a7, CreateBranchDialog as a8, useNavItems as a9, collection as aA, singleton as aB, BlockWrapper as aC, NotEditable as aD, ToolbarSeparator as aE, ImageFieldInput as aF, getSrcPrefix as aG, fixPath as aH, useIsInDocumentEditor as aI, useObjectURL as aJ, getUploadedFile as aK, useFieldContext as aL, SlugFieldContext as aM, PathContext as aN, validateText as aO, isValidURL as aP, ArrayFieldListView as aQ, previewPropsToValue as aR, ArrayFieldValidationMessages as aS, valueToUpdater as aT, setValueToPreviewProps as aU, FormValueContentFromPreviewProps as aV, useImageLibraryURL as aW, loadImageData as aX, emptyImageData as aY, ImageDimensionsInput as aZ, parseImageData as a_, pluralize as aa, useViewer as ab, useCloudInfo as ac, useSidebar as ad, useContentPanelState as ae, ContentPanelProvider as af, SidebarDialog as ag, SidebarPanel as ah, AppShellErrorContext as ai, ConfigContext as aj, AppStateContext as ak, SidebarProvider as al, GitHubAppShellProvider as am, LocalAppShellProvider as an, getSingletonFormat as ao, getSingletonPath as ap, isCloudConfig as aq, assertValidRepoConfig as ar, RouterProvider as as, GitHubAppShellDataContext as at, CloudInfoProvider as au, GitHubAppShellDataProvider as av, basicFormFieldWithSimpleReaderParse as aw, FieldDataError as ax, assertRequired as ay, config as az, useTree as b, document$1 as b0, sha1 as b1, getValueAtPropPath as b2, formatFormDataError as b3, treeEntriesToTreeNodes as b4, CloudImagePreview as b5, cloudImageToolbarIcon as b6, getUploadedFileObject as b7, aliasesToLabel as b8, aliasesToCanonicalName as b9, canonicalNameToLabel as ba, labelToCanonicalName as bb, languagesWithAliases as bc, useEntryLayoutSplitPaneContext as bd, useContentPanelSize as be, Prism as bf, useBranchInfo as c, getEntriesInCollectionWithTreeKey as d, getAuth as e, getEntryDataFilepath as f, getCollectionPath as g, parseProps as h, isLocalConfig as i, useBaseCommit as j, useIsRepoPrivate as k, l10nMessages as l, getDirectoriesForTreeKey as m, getTreeKey as n, object as o, parseRepoConfig as p, useData as q, getTreeNodeAtPath as r, serializeRepoConfig as s, toFormattedFormDataError as t, useRouter as u, isGitHubConfig as v, blobSha as w, getPathPrefix as x, KEYSTATIC_CLOUD_HEADERS as y, useTheme as z };
