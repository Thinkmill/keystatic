# @keystar/ui

## 0.7.13

### Patch Changes

- [#1351](https://github.com/Thinkmill/keystatic/pull/1351) [`cf76aff`](https://github.com/Thinkmill/keystatic/commit/cf76affbbe2cabd58f5ec6a88339e87183d6cec4) Thanks [@jossmac](https://github.com/jossmac)! - Add `ComboboxMulti` component.

- [#1345](https://github.com/Thinkmill/keystatic/pull/1345) [`35575f5`](https://github.com/Thinkmill/keystatic/commit/35575f5ded96bd12a79f4b2670f426fe86637733) Thanks [@jossmac](https://github.com/jossmac)! - Fix quirks and bugs in various components.

## 0.7.12

### Patch Changes

- [#1338](https://github.com/Thinkmill/keystatic/pull/1338) [`dccad1a`](https://github.com/Thinkmill/keystatic/commit/dccad1ac9913a7d31415150cb12e4f80b192c5a5) Thanks [@emmatown](https://github.com/emmatown)! - Fix `Menu` `onAction` being double called

## 0.7.11

### Patch Changes

- [#1308](https://github.com/Thinkmill/keystatic/pull/1308) [`7e0065e`](https://github.com/Thinkmill/keystatic/commit/7e0065e042d44171d8a7386ec069c3d785b75521) Thanks [@emmatown](https://github.com/emmatown)! - Fix error when rendering empty cell in `<TableView>`

## 0.7.10

### Patch Changes

- [#1295](https://github.com/Thinkmill/keystatic/pull/1295) [`650633c`](https://github.com/Thinkmill/keystatic/commit/650633c291f64ddbafbd45ebc81967c9fc787199) Thanks [@jossmac](https://github.com/jossmac)! - New package "@keystar/ui/tag" exports `TagGroup` component.

- [#1275](https://github.com/Thinkmill/keystatic/pull/1275) [`fac7ba4`](https://github.com/Thinkmill/keystatic/commit/fac7ba4605cf81fdac44694b1cd7dcc730b4c1a9) Thanks [@jossmac](https://github.com/jossmac)! - Misc. fixes and updates.

  Fixes:

  - Allow "focus" method on `Picker` ref
  - Defensive "current" selector on `NavItem` styles
  - Fix text truncation on `Picker` selected text
  - Clear slots of `Content` children—resolves issue with `Calendar` elements within `Dialog` receiving incorrect props
  - Fix issue with `Tray` when "size" provided to `Dialog` component

  Updates:

  - Support "isPending" prop on `Button`
  - Support "low" prominence `Checkbox`
  - Emphasise "selected" state on `ActionButton`
  - More prominent `ActionBar`
  - Increase `TextArea` min-height to 3 lines

- [#1296](https://github.com/Thinkmill/keystatic/pull/1296) [`385faf9`](https://github.com/Thinkmill/keystatic/commit/385faf9006e9d089ef317a9cdb421e4c13bc354b) Thanks [@jossmac](https://github.com/jossmac)! - Fix tag docs typo.

- [#1294](https://github.com/Thinkmill/keystatic/pull/1294) [`58a49e4`](https://github.com/Thinkmill/keystatic/commit/58a49e40e1362b6700097cf427b7951c07161245) Thanks [@emmatown](https://github.com/emmatown)! - Updates to localisation build tooling

- [#1289](https://github.com/Thinkmill/keystatic/pull/1289) [`1b48613`](https://github.com/Thinkmill/keystatic/commit/1b4861332cd14d0b9296dee95ca2973790c52194) Thanks [@jossmac](https://github.com/jossmac)! - Update react-aria and friends. Fix tests/types etc. from update.

## 0.7.9

### Patch Changes

- [#1222](https://github.com/Thinkmill/keystatic/pull/1222) [`ff04331`](https://github.com/Thinkmill/keystatic/commit/ff043317372926d99f03f77a9e6ded0ceed45a53) Thanks [@emmatown](https://github.com/emmatown)! - Fix `DialogContainer` when not compiled with React Compiler

## 0.7.8

### Patch Changes

- [#1215](https://github.com/Thinkmill/keystatic/pull/1215) [`824760e`](https://github.com/Thinkmill/keystatic/commit/824760e3f39cbd5866a8670785126905f9d9e95e) Thanks [@emmatown](https://github.com/emmatown)! - Add missing `@types/react` dependency and remove need for `@types/facepaint` to be installed

## 0.7.7

### Patch Changes

- [#1203](https://github.com/Thinkmill/keystatic/pull/1203) [`d3c99d7`](https://github.com/Thinkmill/keystatic/commit/d3c99d7c22f2688ec7c514289b134f9575180b18) Thanks [@emmatown](https://github.com/emmatown)! - Enable React Compiler again with fix in dialog implementation that caused dialogs to not show with the React Compiler enabled

## 0.7.6

### Patch Changes

- [#1182](https://github.com/Thinkmill/keystatic/pull/1182) [`69d429a`](https://github.com/Thinkmill/keystatic/commit/69d429a67b2777fd8cfd236ce6ceaad4d1975e07) Thanks [@emmatown](https://github.com/emmatown)! - Fix some overlays not showing

## 0.7.5

### Patch Changes

- [#1173](https://github.com/Thinkmill/keystatic/pull/1173) [`34dee8c`](https://github.com/Thinkmill/keystatic/commit/34dee8cd8829d2a8c3d91949fd96dcee9d9749d0) Thanks [@emmatown](https://github.com/emmatown)! - Build with React Compiler

## 0.7.4

### Patch Changes

- [#1155](https://github.com/Thinkmill/keystatic/pull/1155) [`dc7e028`](https://github.com/Thinkmill/keystatic/commit/dc7e0287b1cd1e6b4d09e3b39d390054b60fe130) Thanks [@emmatown](https://github.com/emmatown)! - Fixes for React tooling

## 0.7.3

### Patch Changes

- [#1152](https://github.com/Thinkmill/keystatic/pull/1152) [`7924ef8`](https://github.com/Thinkmill/keystatic/commit/7924ef87cb4338e0296d715acd3ab9fb7d39aa51) Thanks [@emmatown](https://github.com/emmatown)! - Fix peer dependency on Next being fixed to a single version

## 0.7.2

### Patch Changes

- 282ab553: New "@keystar/ui/action-bar" package exports `ActionBar` and `ActionBarContainer` components.
- bd923de5: Refactor breakpoint matching: state initialisation used to assume SSR—now CSR is optimised, conditionally.
- e819d5f2: Support links in breadcrumbs.

## 0.7.1

### Patch Changes

- b3501e95: Performance improvements in the new editor

## 0.7.0

### Minor Changes

- dad16ba6: Reduce size of icons

## 0.6.0

### Minor Changes

- 53d8fcc7: Update icons

### Patch Changes

- ad59430d: Fix `onEnter` callback in overlays

## 0.5.0

### Minor Changes

- f4aaa8e3: Switch build to ESM-only

## 0.4.9

### Patch Changes

- 05a71cde: Remove `react-transition-group`

## 0.4.8

### Patch Changes

- bebaa922: Fix `NumberField` not showing error messages

## 0.4.7

### Patch Changes

- 90fd3809: Filter out DOM props TableVirtualizer

## 0.4.6

### Patch Changes

- d76af081: Fix default exports in Node ESM

## 0.4.5

### Patch Changes

- 0ca7f47a: Support "boundary" + "portal" props on `EditorPopover` component. Simulate clipping for portal'd popovers.
- 13206393: Support "labelElementType" on `Field` component.
- 56b6b121: Remove support for "uncontrolled state" in `EditorToolbar*` components.
- bd28cfd4: Fix `transitionProperty` typo in `ActionButton` styles.
- 0e81263b: Refactor `ProgressCircle` — split animation properties across elements to fix transform-origin issue in safari.
- 267845b1: New `ScrollView` component from "@keystar/ui/layout" package.
- 3288c624: Expose `useProseStyleProps` from "@keystar/ui/typography" package.

## 0.4.4

### Patch Changes

- 0673fb03: Fix field types.

## 0.4.3

### Patch Changes

- a3f86e8f: New component `DropZone` and companion `FileTrigger` from "@keystar/ui/drag-and-drop" package.
- 2b4f24b8: Changes to `Checkbox`, `Radio`, and `Dialog` resolve overflow issues within dialogs. Updated "@react-[aria|stately]/virtualizer" to latest.

## 0.4.2

### Patch Changes

- 9854c6b1: Fix for `StatusLight` passing attributes through to DOM element.
- 0229959f: Replace hard-coded class names with `ClassList` instances.

## 0.4.1

### Patch Changes

- cd03b1cd: Fix `next` peer dependency being pinned to an exact version

## 0.4.0

### Minor Changes

- be85e097: Introduce [client-side routing](https://react-spectrum.adobe.com/react-aria/routing.html) concept from react-aria:

  - Include `RouterProvider` with `KeystarProvider` (renamed from "VoussoirProvider"), conditionally when _new_ `router` prop is provided. This new router behaviour makes `linkComponent` and friends unnecessary; they have been removed.
  - Re-export `useLink` from [react-aria](https://react-spectrum.adobe.com/react-aria/useLink.html), which manages router behaviour on click (among other things), for use outside of the component library. Internally we reference "@react-aria/link" directly.
  - Replace instances of link component references with appropriate alternative.
  - Support link props e.g. "href", "target" etc. on `Menu` items.
  - Consolidate cursor behaviour: `ActionButton`, `Button`, and (Menu) `Item` will now use "pointer" for anchors.

  Supporting/related changes:

  - Update react-aria dependencies to latest: "@react-aria/\*", "@react-stately/\*", "@react-types/\*", "@internationalized/\*".
  - Remove linking behaviour from storybook. Might revisit later, but for now it added unnecessary complexity.

  App changes:

  - Deprecate `link` prop on `Keystatic` component. We can now abstract that behaviour from the existing `router` prop.
  - Refactor topbar menu items to use link API; mostly to confirm expected behaviour.

### Patch Changes

- 9eaefd73: Support link as `ActionGroup` items.

## 0.3.4

### Patch Changes

- 221cb5d5: Component library: support props "align" and "menuWidth" on `Combobox` component.

  App interface: replace the branch-selection picker with a combobox to create a better experience for instances with many branches.

- 4875c21f: `TableView` fixes and improvements, since windowing.

## 0.3.3

### Patch Changes

- e8492482: Virtualized table view.

## 0.3.2

### Patch Changes

- b9ca5380: Support "hideHeader" prop on table `Column` components.

## 0.3.1

### Patch Changes

- bcb3b8ec: Support constrained proportions on cloud image block and field. Refactor `Tooltip` styles to allow consumer overrides via style props.

## 0.3.0

### Minor Changes

- 7dafe782: Calendar widgets for date selection:

  - New package "@keystar/ui/calendar" exposes new components, `Calendar` and `RangeCalendar`
  - Update to "@keystar/ui/date-time" exposes new components, `DatePicker` and `DateRangePicker`

  Related fixes and improvements:

  - Truncate `ActionButton` label text
  - Support "aria-hidden" on `Heading` and `Text` components

### Patch Changes

- 5f9dd460: Remove lodash and dedent
- 083ee638: Revert adding `"use client"` to `@keystar/ui/style`
- ba3e4a0b: fix vertical divider styles
- 7ed2a7d8: New package "@keystar/ui/contextual-help" exposes `ContextualHelp` component.

  Support "contextualHelp" prop on field components, `Field` and `FieldPrimitive`.

## 0.2.2

### Patch Changes

- f7e0692e: Move `toDataAttributes` to "style" package:

  - add tests
  - improve API
  - improve implementation

- 12f95d48: Added "use client" to style entrypoint in keystar-ui.

  This means that `import { css, tokenSchema } from '@keystar/ui/style'` won't break in a Next.js 13 server component.

## 0.2.1

### Patch Changes

- 6d6226be: Ensure `TooltipTrigger` works with `DialogTrigger` and `MenuTrigger`. The tooltip trigger must be the inner-most wrapper around the button.
- 1e96432c: omit legacy attributes from `forwardRefWithAs` util
- 6895c566: - list-item + table-row: background change only on hover (not focus)
  - allow shortcuts "cmd+s" and "ctrl+s" to save entry
  - remove unused `flattenChildren` utility
- 7ec4e84f: increase line-height on `TextArea` component
- ecd9213a: prevent undesirable panel animation during mount of the `SplitView` component
- 7767c69a: Optimise the editor appearance when `entryLayout="content"` for a more focused experience.

  Component library:

  - Update the antialiasing behaviour everywhere
  - New `Prose` component from "@keystar/ui/typography" package.
  - Improve `Field` implementation and types

## 0.2.0

### Minor Changes

- ad46c9dd: token schema updates

## 0.1.7

### Patch Changes

- 6b4c476c: Frontend changes:

  - collection: on mobile, toggle the seach field visibility
  - dashboard: fix card focus appearance
  - page header always full-width

- 29586e33: support "position" and "placement" props on toaster

## 0.1.6

### Patch Changes

- 78c98496: A few updates and additions for work on the cloud app:

  - expose `HStack` and `VStack` components from the "layout" package
  - adjust `Tray` appearance on larger screens
  - fix `Button` icon appearance
  - expose `StatusLight` component from new "status-light" package

- 062ccf49: Export `SplitView` components from new "split-view" package.

## 0.1.5

### Patch Changes

- 0ab08c7c: add 'use client' pragma to exports

## 0.1.4

### Patch Changes

- f272b8ee: consolidate color-scheme logic surrounding ssr
- bf6a27bb: Update dashboard page to use card-like interface elements for collections and singletons.

  Related app changes:

  - declare side and main app panels as "inline-size" containers
  - less obtrusive change indicators on sidebar singleton
  - create `useLocalizedString` hook, which abstracts l10n message import to one location

  Related component library changes:

  - adjust `AnchorDOMProps` type; require "href" property and remove (MIME) "type" property
  - support "href" (and friends) on `ActionButton` component
  - expose `containerQueries` from "style" package
  - fix class list declaration issue, which was causing a warning from `FieldButton` component

## 0.1.3

### Patch Changes

- a048349f: introduce new `PasswordField` component

## 0.1.2

### Patch Changes

- e667fb9c: Allow users to resize parts of the UI:

  - the sidebar navigation pane
  - secondary fields, when `entryLayout='content'`

- aec6359b: Support "renderEmptyState" prop on `TableView` component.
- b30c4b45: Remove bespoke icon implementations.
- ef586da4: fixes a bug where non-interactive adornments block pointer events
- 6c58f038: introduce `nav-tree` package, and components
- 7fe8d2f4: Fix label and description support in `NumberField`
- 781884f9: tidy panels and collection table appearance

## 0.1.1

### Patch Changes

- b832e495: Layout refactor that moves some stuff out of the sidebar into an app header.

  Component library:

  - `/button` — fix class name order so consumer styles override.
  - `/overlays` — fix gutter between popover and viewport.

## 0.1.0

### Minor Changes

- 50105597: Update lucide icons to `v0.252.0`

  **Deleted:**

  - circleSlashedIcon
  - curlyBracesIcon
  - sidebarCloseIcon
  - sidebarIcon
  - sidebarOpenIcon
  - slashIcon
  - sortAscIcon
  - sortDescIcon
  - verifiedIcon

  **Added:**

  - activitySquareIcon
  - ampersandIcon
  - ampersandsIcon
  - appWindowIcon
  - arrowBigDownDashIcon
  - arrowBigLeftDashIcon
  - arrowBigRightDashIcon
  - arrowBigUpDashIcon
  - arrowDown01Icon
  - arrowDown10Icon
  - arrowDownAZIcon
  - arrowDownFromLineIcon
  - arrowDownLeftFromCircleIcon
  - arrowDownLeftSquareIcon
  - arrowDownNarrowWideIcon
  - arrowDownRightFromCircleIcon
  - arrowDownRightSquareIcon
  - arrowDownSquareIcon
  - arrowDownToDotIcon
  - arrowDownToLineIcon
  - arrowDownUpIcon
  - arrowDownWideNarrowIcon
  - arrowDownZAIcon
  - arrowLeftFromLineIcon
  - arrowLeftSquareIcon
  - arrowLeftToLineIcon
  - arrowRightFromLineIcon
  - arrowRightLeftIcon
  - arrowRightSquareIcon
  - arrowRightToLineIcon
  - arrowUp01Icon
  - arrowUp10Icon
  - arrowUpAZIcon
  - arrowUpFromDotIcon
  - arrowUpFromLineIcon
  - arrowUpLeftFromCircleIcon
  - arrowUpLeftSquareIcon
  - arrowUpNarrowWideIcon
  - arrowUpRightFromCircleIcon
  - arrowUpRightSquareIcon
  - arrowUpSquareIcon
  - arrowUpToLineIcon
  - arrowUpWideNarrowIcon
  - arrowUpZAIcon
  - atomIcon
  - badgeAlertIcon
  - badgeCheckIcon
  - badgeDollarSignIcon
  - badgeHelpIcon
  - badgeIcon
  - badgeInfoIcon
  - badgeMinusIcon
  - badgePercentIcon
  - badgePlusIcon
  - badgeXIcon
  - banIcon
  - barChartBigIcon
  - barChartHorizontalBigIcon
  - bellDotIcon
  - biohazardIcon
  - bookCopyIcon
  - bookDownIcon
  - bookKeyIcon
  - bookLockIcon
  - bookMarkedIcon
  - bookMinusIcon
  - bookPlusIcon
  - bookTemplateIcon
  - bookUp2Icon
  - bookUpIcon
  - bookXIcon
  - bracesIcon
  - bracketsIcon
  - cakeSliceIcon
  - candlestickChartIcon
  - candyCaneIcon
  - caseLowerIcon
  - caseSensitiveIcon
  - caseUpperIcon
  - cassetteTapeIcon
  - castleIcon
  - chevronDownSquareIcon
  - chevronLeftSquareIcon
  - chevronRightSquareIcon
  - chevronUpSquareIcon
  - churchIcon
  - circleDashedIcon
  - circleDollarSignIcon
  - circleDotDashedIcon
  - circleEqualIcon
  - circleOffIcon
  - circleSlash2Icon
  - circleSlashIcon
  - circuitBoardIcon
  - clipboardPasteIcon
  - clubIcon
  - combineIcon
  - contact2Icon
  - copyCheckIcon
  - copyMinusIcon
  - copyPlusIcon
  - copySlashIcon
  - copyXIcon
  - dessertIcon
  - disc2Icon
  - disc3Icon
  - donutIcon
  - doorClosedIcon
  - doorOpenIcon
  - dotIcon
  - ferrisWheelIcon
  - fileCode2Icon
  - fileStackIcon
  - foldHorizontalIcon
  - foldVerticalIcon
  - folderDotIcon
  - folderGit2Icon
  - folderGitIcon
  - folderKanbanIcon
  - folderOpenDotIcon
  - folderRootIcon
  - folderSyncIcon
  - ganttChartIcon
  - goalIcon
  - groupIcon
  - hotelIcon
  - iterationCcwIcon
  - iterationCwIcon
  - keyRoundIcon
  - keySquareIcon
  - layoutPanelLeftIcon
  - layoutPanelTopIcon
  - leafyGreenIcon
  - ligatureIcon
  - listFilterIcon
  - listRestartIcon
  - listTodoIcon
  - listTreeIcon
  - lollipopIcon
  - mailboxIcon
  - memoryStickIcon
  - menuSquareIcon
  - mergeIcon
  - messageSquareDashedIcon
  - messageSquarePlusIcon
  - messagesSquareIcon
  - monitorCheckIcon
  - monitorDotIcon
  - monitorDownIcon
  - monitorPauseIcon
  - monitorPlayIcon
  - monitorStopIcon
  - monitorUpIcon
  - monitorXIcon
  - moonStarIcon
  - moveDownIcon
  - moveDownLeftIcon
  - moveDownRightIcon
  - moveLeftIcon
  - moveRightIcon
  - moveUpIcon
  - moveUpLeftIcon
  - moveUpRightIcon
  - orbitIcon
  - panelBottomCloseIcon
  - panelBottomIcon
  - panelBottomInactiveIcon
  - panelBottomOpenIcon
  - panelLeftCloseIcon
  - panelLeftIcon
  - panelLeftInactiveIcon
  - panelLeftOpenIcon
  - panelRightCloseIcon
  - panelRightIcon
  - panelRightInactiveIcon
  - panelRightOpenIcon
  - panelTopCloseIcon
  - panelTopIcon
  - panelTopInactiveIcon
  - panelTopOpenIcon
  - parenthesesIcon
  - pcCaseIcon
  - piIcon
  - piSquareIcon
  - pilcrowSquareIcon
  - planeLandingIcon
  - planeTakeoffIcon
  - playSquareIcon
  - plugZap2Icon
  - pocketKnifeIcon
  - popcornIcon
  - popsicleIcon
  - presentationIcon
  - projectorIcon
  - radarIcon
  - radiationIcon
  - radioTowerIcon
  - rainbowIcon
  - ratIcon
  - receiptIcon
  - redoDotIcon
  - refreshCcwDotIcon
  - refreshCwOffIcon
  - repeat2Icon
  - replaceAllIcon
  - replaceIcon
  - rollerCoasterIcon
  - rowsIcon
  - satelliteDishIcon
  - satelliteIcon
  - saveAllIcon
  - scatterChartIcon
  - school2Icon
  - schoolIcon
  - scrollTextIcon
  - searchCheckIcon
  - searchCodeIcon
  - searchSlashIcon
  - searchXIcon
  - shapesIcon
  - shieldQuestionIcon
  - sigmaSquareIcon
  - spaceIcon
  - spadeIcon
  - sparkleIcon
  - sparklesIcon
  - spellCheck2Icon
  - spellCheckIcon
  - splitIcon
  - sprayCanIcon
  - squareAsteriskIcon
  - squareCodeIcon
  - squareDashedBottomCodeIcon
  - squareDashedBottomIcon
  - squareDotIcon
  - squareEqualIcon
  - squareGanttIcon
  - squareKanbanDashedIcon
  - squareKanbanIcon
  - squareSlashIcon
  - squareStackIcon
  - squirrelIcon
  - stepBackIcon
  - stepForwardIcon
  - storeIcon
  - testTube2Icon
  - testTubeIcon
  - testTubesIcon
  - textIcon
  - textQuoteIcon
  - textSelectIcon
  - touchpadIcon
  - touchpadOffIcon
  - undoDotIcon
  - unfoldHorizontalIcon
  - unfoldVerticalIcon
  - ungroupIcon
  - unplugIcon
  - user2Icon
  - userCheck2Icon
  - userCircle2Icon
  - userCircleIcon
  - userCog2Icon
  - userMinus2Icon
  - userPlus2Icon
  - userSquare2Icon
  - userSquareIcon
  - userX2Icon
  - users2Icon
  - variableIcon
  - videotapeIcon
  - wallet2Icon
  - walletCardsIcon
  - wallpaperIcon
  - warehouseIcon
  - wholeWordIcon
  - workflowIcon

  **Modified:**

  - accessibilityIcon
  - alarmCheckIcon
  - alarmClockIcon
  - alarmClockOffIcon
  - alarmMinusIcon
  - alarmPlusIcon
  - albumIcon
  - alignEndHorizontalIcon
  - alignEndVerticalIcon
  - alignHorizontalDistributeCenterIcon
  - alignHorizontalDistributeEndIcon
  - alignHorizontalDistributeStartIcon
  - alignHorizontalJustifyCenterIcon
  - alignHorizontalJustifyEndIcon
  - alignHorizontalJustifyStartIcon
  - alignHorizontalSpaceAroundIcon
  - alignHorizontalSpaceBetweenIcon
  - alignStartHorizontalIcon
  - alignStartVerticalIcon
  - alignVerticalDistributeCenterIcon
  - alignVerticalDistributeEndIcon
  - alignVerticalDistributeStartIcon
  - alignVerticalJustifyCenterIcon
  - alignVerticalJustifyEndIcon
  - alignVerticalJustifyStartIcon
  - alignVerticalSpaceAroundIcon
  - alignVerticalSpaceBetweenIcon
  - archiveIcon
  - archiveRestoreIcon
  - arrowBigDownIcon
  - arrowBigLeftIcon
  - arrowBigRightIcon
  - arrowBigUpIcon
  - arrowDownCircleIcon
  - arrowLeftCircleIcon
  - arrowLeftIcon
  - arrowLeftRightIcon
  - arrowRightCircleIcon
  - arrowUpDownIcon
  - arrowUpIcon
  - arrowUpLeftIcon
  - arrowUpRightIcon
  - atSignIcon
  - axeIcon
  - baggageClaimIcon
  - banknoteIcon
  - batteryFullIcon
  - batteryIcon
  - batteryLowIcon
  - batteryMediumIcon
  - bellIcon
  - bellMinusIcon
  - bellOffIcon
  - bellPlusIcon
  - bellRingIcon
  - bikeIcon
  - binaryIcon
  - boldIcon
  - boneIcon
  - bookIcon
  - botIcon
  - briefcaseIcon
  - building2Icon
  - buildingIcon
  - calculatorIcon
  - calendarCheckIcon
  - calendarDaysIcon
  - calendarIcon
  - calendarRangeIcon
  - calendarXIcon
  - citrusIcon
  - clipboardCheckIcon
  - clipboardCopyIcon
  - clipboardEditIcon
  - clipboardIcon
  - clipboardListIcon
  - clipboardSignatureIcon
  - clipboardTypeIcon
  - clipboardXIcon
  - cloudMoonIcon
  - columnsIcon
  - commandIcon
  - constructionIcon
  - contactIcon
  - copyIcon
  - cpuIcon
  - creditCardIcon
  - databaseBackupIcon
  - databaseIcon
  - diamondIcon
  - dice1Icon
  - dice2Icon
  - dice3Icon
  - dice4Icon
  - dice5Icon
  - dice6Icon
  - dicesIcon
  - discIcon
  - divideSquareIcon
  - fileCodeIcon
  - fileDigitIcon
  - fileLock2Icon
  - fileLockIcon
  - fileVideo2Icon
  - filmIcon
  - fishOffIcon
  - flaskRoundIcon
  - folderLockIcon
  - formInputIcon
  - functionSquareIcon
  - gamepadIcon
  - gaugeIcon
  - gridIcon
  - headphonesIcon
  - heartCrackIcon
  - heartHandshakeIcon
  - heartIcon
  - heartOffIcon
  - heartPulseIcon
  - historyIcon
  - imageIcon
  - infinityIcon
  - instagramIcon
  - keyIcon
  - keyboardIcon
  - laptop2Icon
  - layoutDashboardIcon
  - layoutGridIcon
  - layoutIcon
  - layoutListIcon
  - layoutTemplateIcon
  - lifeBuoyIcon
  - lightbulbIcon
  - lightbulbOffIcon
  - listChecksIcon
  - listEndIcon
  - lockIcon
  - mailIcon
  - mailsIcon
  - messageCircleIcon
  - microscopeIcon
  - microwaveIcon
  - minusSquareIcon
  - monitorIcon
  - monitorSmartphoneIcon
  - monitorSpeakerIcon
  - moonIcon
  - mouseIcon
  - networkIcon
  - packageIcon
  - parkingSquareOffIcon
  - pictureInPicture2Icon
  - pizzaIcon
  - plugIcon
  - plugZapIcon
  - plusSquareIcon
  - qrCodeIcon
  - radioIcon
  - radioReceiverIcon
  - rectangleHorizontalIcon
  - rectangleVerticalIcon
  - refreshCcwIcon
  - refreshCwIcon
  - rotateCcwIcon
  - rotateCwIcon
  - scale3dIcon
  - scrollIcon
  - searchIcon
  - serverIcon
  - sheetIcon
  - shuffleIcon
  - slackIcon
  - smartphoneChargingIcon
  - smartphoneIcon
  - smartphoneNfcIcon
  - speakerIcon
  - splineIcon
  - squareIcon
  - stretchHorizontalIcon
  - stretchVerticalIcon
  - sunDimIcon
  - sunMediumIcon
  - sunMoonIcon
  - tableIcon
  - tabletIcon
  - terminalSquareIcon
  - textCursorInputIcon
  - ticketIcon
  - toggleLeftIcon
  - toggleRightIcon
  - toyBrickIcon
  - trainIcon
  - trelloIcon
  - tv2Icon
  - tvIcon
  - umbrellaIcon
  - unlockIcon
  - usbIcon
  - veganIcon
  - vibrateIcon
  - videoIcon
  - walletIcon
  - xSquareIcon
  - youtubeIcon

### Patch Changes

- 944dbe67: text input paper cuts:

  - more vertical padding on `TextArea` component.
  - antialiased editor text, to match the rest of the app.

- 8a9fa5f8: Fix bug where popover fails to flip when invoked for the first time.
- 91857b9b: Update @react-aria/_, @react-stately/_, etc. to latest versions.
- 9f16e062: fix unwanted scrollbars, where appropriate
