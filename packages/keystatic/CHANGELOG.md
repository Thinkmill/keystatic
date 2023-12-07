# @keystatic/core

## 0.2.5

### Patch Changes

- 13206393: Minor a11y fixes/improvements for document + markdoc editors.
- 0ca7f47a: Markdoc editor popover improvements:

  - boundary respected by popovers
  - popovers tethered to reference regardless of type (node/range/virtual) +
    better perf

- 7a98fd68: Support "layout" prop on `fields.object()`. Add required indicators
  to fields, where appropriate.
- 56b6b121: Refactor the markdoc editor toolbar; move all formatting options
  under a single tab-stop.
- 3288c624: Replace explicit node styles with inherited styling from "prose"
  wrapper, where appropriate, in the markdoc editor.
- bd28cfd4: Collection table: hide "status" column for default branch.
- e32ff596: ProseMirror editor: support and populate "description" + "icon" on
  insert menu items.
- 16bd7064: Improve error message for branch creation name validation.
- e1c9e0cf: ProseMirror editor improvements
- 267845b1: Merge topbar UI into sidebar; reclaim vertical real estate.
- Updated dependencies [0ca7f47a]
- Updated dependencies [13206393]
- Updated dependencies [56b6b121]
- Updated dependencies [bd28cfd4]
- Updated dependencies [0e81263b]
- Updated dependencies [267845b1]
- Updated dependencies [3288c624]
  - @keystar/ui@0.4.5

## 0.2.4

### Patch Changes

- 0de2f090: Add support for tables in `fields.markdoc`
- Updated dependencies [0673fb03]
  - @keystar/ui@0.4.4

## 0.2.3

### Patch Changes

- 2b4f24b8: Prepare the dialog interface for batch commits. The invoking element
  has been omitted from the UI until we're ready to implement.
- Updated dependencies [a3f86e8f]
- Updated dependencies [2b4f24b8]
  - @keystar/ui@0.4.3

## 0.2.2

### Patch Changes

- b9f0758f: Observe nav config as dashboard cards.
- f3cc119c: Fix deleting files inside an entry directory that aren't associated
  with the entry when updating or deleting the entry

## 0.2.1

### Patch Changes

- 9854c6b1: Support `ui.navigation` config.
- 0229959f: Replace hard-coded class names with `ClassList` instances.
- 454f25c9: New config `ui` supports branding options.
- Updated dependencies [9854c6b1]
- Updated dependencies [0229959f]
  - @keystar/ui@0.4.2

## 0.2.0

### Minor Changes

- b768f147: Update router integration between `@keystatic/core` and framework
  integration packages to improve performance

### Patch Changes

- 32d22480: Fix loading entries failing for public repositories when not using a
  `pathPrefix`
- Updated dependencies [cd03b1cd]
  - @keystar/ui@0.4.1

## 0.1.9

### Patch Changes

- bd20acb0: Improve performance of loading entries in public repositories
- be85e097: Introduce
  [client-side routing](https://react-spectrum.adobe.com/react-aria/routing.html)
  concept from react-aria:

  - Include `RouterProvider` with `KeystarProvider` (renamed from
    "VoussoirProvider"), conditionally when _new_ `router` prop is provided.
    This new router behaviour makes `linkComponent` and friends unnecessary;
    they have been removed.
  - Re-export `useLink` from
    [react-aria](https://react-spectrum.adobe.com/react-aria/useLink.html),
    which manages router behaviour on click (among other things), for use
    outside of the component library. Internally we reference "@react-aria/link"
    directly.
  - Replace instances of link component references with appropriate alternative.
  - Support link props e.g. "href", "target" etc. on `Menu` items.
  - Consolidate cursor behaviour: `ActionButton`, `Button`, and (Menu) `Item`
    will now use "pointer" for anchors.

  Supporting/related changes:

  - Update react-aria dependencies to latest: "@react-aria/\*",
    "@react-stately/\*", "@react-types/\*", "@internationalized/\*".
  - Remove linking behaviour from storybook. Might revisit later, but for now it
    added unnecessary complexity.

  App changes:

  - Deprecate `link` prop on `Keystatic` component. We can now abstract that
    behaviour from the existing `router` prop.
  - Refactor topbar menu items to use link API; mostly to confirm expected
    behaviour.

- e3d6fd29: Fix links and other formatting around inline code being discarded in
  the document editor
- be5d3646: Fix unhandled promise rejection error
- Updated dependencies [be85e097]
- Updated dependencies [9eaefd73]
  - @keystar/ui@0.4.0

## 0.1.8

### Patch Changes

- 221cb5d5: Component library: support props "align" and "menuWidth" on
  `Combobox` component.

  App interface: replace the branch-selection picker with a combobox to create a
  better experience for instances with many branches.

- e8ef9436: move image library button from dashboard to topbar
- be0eaddc: Add `toolbarIcon` option to component blocks and show `cloudImage`
  component in toolbar
- 4875c21f: `TableView` fixes and improvements, since windowing.
- Updated dependencies [221cb5d5]
- Updated dependencies [4875c21f]
  - @keystar/ui@0.3.4

## 0.1.7

### Patch Changes

- e8492482: Virtualized table view.
- e8748091: Fix "Invalid directory in content field serialization" error when
  using a path with a trailing slash in `images.directory` in `fields.document`
- cf66c21b: Add `createGitHubReader` at `@keystatic/core/reader/github`
- 633b9c84: Allow `{branch}` replacement in `previewUrl` option
- 5399756e: Fix parsing empty list items breaking the document editor
- cad4cb33: Center loading indicator on Keystatic Cloud auth callback page
- 633b9c84: `{slug}` is no longer required in `previewUrl` in collections
- ee1cf9bd: Support non-Node.js runtimes such as Cloudflare Workers in the API
  route
- 19010641: Update dependencies to fix double fetching in cloud mode
- b54f0e71: Fix `fields.url` always being required
- d5775591: Link to specific open pull request instead of search page of open
  pull requests
- Updated dependencies [e8492482]
  - @keystar/ui@0.3.3

## 0.1.6

### Patch Changes

- b28d194e: Add `previewUrl` option
- 811c8749: Persist draft changes to entries to browser storage
- d8cd31b8: Fix regression in deletions from adding `pathPrefix`
- 369cfff6: Remove unused code for old template deployment method
- 6923f250: Add `storage.branchPrefix` option to allow enforcing a branch prefix
  when creating new branches and viewing branches
- Updated dependencies [b9ca5380]
  - @keystar/ui@0.3.2

## 0.1.5

### Patch Changes

- e36b026d: Add `storage.pathPrefix` option
- 9411896b: Add link to cloud images on dashboard
- 303e845d: Remove unused dependencies
- 183e1293: Added an option to duplicate an existing entry in a collection
- a05fc4cb: Allow pasting more variations of cloud image urls in
  `fields.cloudImage` and `cloudImage` component block
- df4f06ae: Editor: fields editing in a modal instead of in-document
- b5eb69d1: Show logged in user in header in cloud mode

## 0.1.4

### Patch Changes

- bcb3b8ec: Support constrained proportions on cloud image block and field.
  Refactor `Tooltip` styles to allow consumer overrides via style props.
- 43f0b61f: Fixed bundle size increase when using `@keystatic/core/reader` with
  React server components
- Updated dependencies [bcb3b8ec]
  - @keystar/ui@0.3.1

## 0.1.3

### Patch Changes

- dbd09f04: Fix circular dependencies

## 0.1.2

### Patch Changes

- 92c80281: Shrink the size of hidden child nodes in the document field
- 7dafe782: Calendar widgets for date selection:

  - New package "@keystar/ui/calendar" exposes new components, `Calendar` and
    `RangeCalendar`
  - Update to "@keystar/ui/date-time" exposes new components, `DatePicker` and
    `DateRangePicker`

  Related fixes and improvements:

  - Truncate `ActionButton` label text
  - Support "aria-hidden" on `Heading` and `Text` components

- Updated dependencies [5f9dd460]
- Updated dependencies [083ee638]
- Updated dependencies [ba3e4a0b]
- Updated dependencies [7ed2a7d8]
- Updated dependencies [7dafe782]
  - @keystar/ui@0.3.0

## 0.1.1

### Patch Changes

- be18ce6f: Add `fields.cloudImage` field
- 87b6be2c: Refactor `MainPanelLayout` to improve UX.
- 2549369d: Cloud Image Component Fixes
- f7e0692e: Move `toDataAttributes` to "style" package:

  - add tests
  - improve API
  - improve implementation

- b2988cd5: Fix API route erroring with `storage: { kind: 'cloud' }`
- 8cee0bb3: Export `CloudImageProps` type from the
  `@keystatic/core/component-blocks` entrypoint
- Updated dependencies [f7e0692e]
- Updated dependencies [12f95d48]
  - @keystar/ui@0.2.2

## 0.1.0

### Minor Changes

- 1f96ff27: Move cloud `storage.project` to `cloud.project` option to allow it
  to be referenced in local mode

### Patch Changes

- 03f0543c: Add experimental `cloudImage` component block
- c24dc631: fix entry view content layout issues
- 6895c566: - list-item + table-row: background change only on hover (not focus)
  - allow shortcuts "cmd+s" and "ctrl+s" to save entry
  - remove unused `flattenChildren` utility
- 7310a672: Fixes and improvements to the cloud image block.
- c5407cce: Add datetime field
- ca6774b8: The `document` field defaults for formatting have changed to exclude
  options that require custom Markdoc tags.

  See https://keystatic.com/docs/fields/document#formatting-options for the new
  defaults.

  When updating, if you have configured a document field with shorthand for the
  `formatting` config:

  ```ts
  fields.document({
    // ...
    formatting: true,
  });
  ```

  To keep the same options you'll need to change you config to:

  ```ts
  fields.document({
    // ...
    formatting: {
      alignment: true,
      inlineMarks: {
        bold: true,
        code: true,
        italic: true,
        keyboard: true,
        strikethrough: true,
        subscript: true,
        superscript: true,
        underline: true,
      },
      listTypes: true,
      headingLevels: true,
      blockTypes: true,
      softBreaks: true,
    },
  });
  ```

- 03f0543c: Allow `toolbar: null` to remove toolbar from chromeless component
  blocks and add `onRemove` to component block previews.
- 7767c69a: Optimise the editor appearance when `entryLayout="content"` for a
  more focused experience.

  Component library:

  - Update the antialiasing behaviour everywhere
  - New `Prose` component from "@keystar/ui/typography" package.
  - Improve `Field` implementation and types

- Updated dependencies [6d6226be]
- Updated dependencies [1e96432c]
- Updated dependencies [6895c566]
- Updated dependencies [7ec4e84f]
- Updated dependencies [ecd9213a]
- Updated dependencies [7767c69a]
  - @keystar/ui@0.2.1

## 0.0.116

### Patch Changes

- c43d7045: Added validation to prevent whitespace at the start or end of slug
  field values
- 21395048: Update card style on dashboard

## 0.0.115

### Patch Changes

- ad46c9dd: token schema updates
- 47102969: Misc. UI changes—align with Figma designs
- Updated dependencies [ad46c9dd]
  - @keystar/ui@0.2.0

## 0.0.114

### Patch Changes

- 6b4c476c: Frontend changes:

  - collection: on mobile, toggle the seach field visibility
  - dashboard: fix card focus appearance
  - page header always full-width

- f9f09616: Fix GitHub login button leading to a 404 with `@keystatic/astro`
- Updated dependencies [6b4c476c]
- Updated dependencies [29586e33]
  - @keystar/ui@0.1.7

## 0.0.113

### Patch Changes

- 07c63bab: Reduced sidebar panel max size
- 062ccf49: Export `SplitView` components from new "split-view" package.
- Updated dependencies [78c98496]
- Updated dependencies [062ccf49]
  - @keystar/ui@0.1.6

## 0.0.112

### Patch Changes

- efc83c9c: A leading `/` is no longer added to the `publicPath` in
  `fields.image`, `fields.file`, and `images` in `fields.document`
- Updated dependencies [0ab08c7c]
  - @keystar/ui@0.1.5

## 0.0.111

### Patch Changes

- bf6a27bb: Update dashboard page to use card-like interface elements for
  collections and singletons.

  Related app changes:

  - declare side and main app panels as "inline-size" containers
  - less obtrusive change indicators on sidebar singleton
  - create `useLocalizedString` hook, which abstracts l10n message import to one
    location

  Related component library changes:

  - adjust `AnchorDOMProps` type; require "href" property and remove (MIME)
    "type" property
  - support "href" (and friends) on `ActionButton` component
  - expose `containerQueries` from "style" package
  - fix class list declaration issue, which was causing a warning from
    `FieldButton` component

- Updated dependencies [f272b8ee]
- Updated dependencies [bf6a27bb]
  - @keystar/ui@0.1.4

## 0.0.110

### Patch Changes

- e667fb9c: Allow users to resize parts of the UI:

  - the sidebar navigation pane
  - secondary fields, when `entryLayout='content'`

- aec6359b: Support "renderEmptyState" prop on `TableView` component.
- e0c4c37e: Fix custom attributes on headings in `fields.document`
- 781884f9: tidy panels and collection table appearance
- cafe3695: Improved not found states
- Updated dependencies [e667fb9c]
- Updated dependencies [aec6359b]
- Updated dependencies [b30c4b45]
- Updated dependencies [ef586da4]
- Updated dependencies [6c58f038]
- Updated dependencies [7fe8d2f4]
- Updated dependencies [781884f9]
  - @keystar/ui@0.1.2

## 0.0.109

### Patch Changes

- 4e595627: Avoid full page refreshes when resetting on entry pages
- 477b4e96: The `storage.repo` option now accepts a repository in the form of
  `owner/repo`
- b832e495: Layout refactor that moves some stuff out of the sidebar into an app
  header.

  Component library:

  - `/button` — fix class name order so consumer styles override.
  - `/overlays` — fix gutter between popover and viewport.

- b6f4fb12: Avoid remounting entry form on save
- 68e3be7c: Add second argument for `label` and `description` to `fields.object`
- Updated dependencies [b832e495]
  - @keystar/ui@0.1.1

## 0.0.108

### Patch Changes

- bbbca74f: Add `locale` config option, now defaults to `en-US` instead of
  auto-detecting the Browser's locale.
- 944dbe67: text input paper cuts:

  - more vertical padding on `TextArea` component.
  - antialiased editor text, to match the rest of the app.

- 91857b9b: Update @react-aria/_, @react-stately/_, etc. to latest versions.
- 0bafd9f1: Add `entryLayout?: 'content' | 'form'`
- 9f16e062: fix unwanted scrollbars, where appropriate
- Updated dependencies [944dbe67]
- Updated dependencies [8a9fa5f8]
- Updated dependencies [91857b9b]
- Updated dependencies [50105597]
- Updated dependencies [9f16e062]
  - @keystar/ui@0.1.0

## 0.0.107

### Patch Changes

- 0016a2b0: Add experimental new editor for testing
- Updated dependencies [0016a2b0]
  - @voussoir/overlays@0.1.8

## 0.0.106

### Patch Changes

- 618ba4aa: Remove `url`/`KEYSTATIC_URL` config option
- 30298e81: Update to latest react-aria packages:
  - @react-aria/focus
  - @react-aria/interactions
  - @react-aria/utils
- Updated dependencies [6a33f487]
- Updated dependencies [30298e81]
  - @voussoir/button@0.2.0
  - @voussoir/action-group@0.1.6
  - @voussoir/number-field@0.1.6
  - @voussoir/search-field@0.1.6
  - @voussoir/breadcrumbs@0.1.10
  - @voussoir/text-field@0.1.8
  - @voussoir/typography@0.1.6
  - @voussoir/list-view@0.1.7
  - @voussoir/checkbox@0.2.6
  - @voussoir/combobox@0.1.7
  - @voussoir/nav-list@0.1.3
  - @voussoir/overlays@0.1.7
  - @voussoir/progress@0.1.3
  - @voussoir/listbox@0.1.6
  - @voussoir/tooltip@0.1.4
  - @voussoir/dialog@0.2.4
  - @voussoir/notice@0.1.5
  - @voussoir/picker@0.1.6
  - @voussoir/slots@0.1.3
  - @voussoir/style@0.1.6
  - @voussoir/table@0.1.6
  - @voussoir/toast@0.1.9
  - @voussoir/utils@2.0.3
  - @voussoir/link@0.1.5
  - @voussoir/menu@0.1.5
  - @voussoir/tabs@0.1.5

## 0.0.105

### Patch Changes

- d04a6130: Fix nesting lists parsing in the document field
- 8ba818f5: Update `@markdoc/markdoc` to `0.3.0`

## 0.0.104

### Patch Changes

- a489421d: Add `fields.file`

## 0.0.103

### Patch Changes

- 73c26e63: Never send the structure of `node_modules` in the tree used in local
  mode, even if it's not gitignored

## 0.0.102

### Patch Changes

- 3a1cd9af: Fix TypeScript declarations

## 0.0.101

### Patch Changes

- e03a94d: `@keystatic/core/reader` now uses React's `cache` function in server
  component environments

## 0.0.100

### Patch Changes

- 9bc953d: Fix `forceValidation` not being passed through to field inputs
  correctly

## 0.0.99

### Patch Changes

- f62dca6: Increase gap between fields
- 4823b3d: Fix adding `fields.conditional` to an already existing entry

## 0.0.98

### Patch Changes

- c0257be: Fix edit modal not working in `fields.block()`

## 0.0.97

### Patch Changes

- b0ef96e: Add `fields.block()`

## 0.0.96

### Patch Changes

- 3f684fd: Fix `readOrThrow` in the reader for singletons

## 0.0.95

### Patch Changes

- c70a21d: Fix navigating between some pages preserving state when they
  shouldn't

## 0.0.94

### Patch Changes

- 7fc5360: Add `readOrThrow` to singleton and collection readers
- 0545908: Update `urql`

## 0.0.93

### Patch Changes

- bc20a55: Add `validation.length` to `fields.array`
- 0ef70cf: Fix serialization of image fields inside component blocks
- Updated dependencies [c1c33e2]
  - @voussoir/action-group@0.1.5
  - @voussoir/breadcrumbs@0.1.8
  - @voussoir/button@0.1.8
  - @voussoir/checkbox@0.2.5
  - @voussoir/combobox@0.1.6
  - @voussoir/core@5.0.2
  - @voussoir/dialog@0.2.3
  - @voussoir/drag-and-drop@0.1.2
  - @voussoir/field@0.1.6
  - @voussoir/icon@0.2.1
  - @voussoir/link@0.1.4
  - @voussoir/list-view@0.1.6
  - @voussoir/listbox@0.1.5
  - @voussoir/menu@0.1.4
  - @voussoir/number-field@0.1.5
  - @voussoir/overlays@0.1.6
  - @voussoir/picker@0.1.5
  - @voussoir/radio@0.1.6
  - @voussoir/table@0.1.5
  - @voussoir/tabs@0.1.4
  - @voussoir/text-field@0.1.7
  - @voussoir/toast@0.1.8
  - @voussoir/typography@0.1.5

## 0.0.92

### Patch Changes

- 5dff1df: Allow `defaultValue` to be a function in `fields.text`

## 0.0.91

### Patch Changes

- e0292c2: Remove unused dependencies
- f435b49: Fix `DocumentRenderer` not providing `language` to the code block
  renderer and not providing arbitrary props to the code block and heading
  renderer.
- a09b11d: Fix attempting to edit an image's details after saving it without a
  title erroring

## 0.0.90

### Patch Changes

- e9b0e64: Strict dimension types.
- e390566: Add `formatting.blockTypes.code.schema` and
  `formatting.headingLevels.schema` options to `fields.document` to allow adding
  arbitrary attributes to code blocks and headings.
- 28eeba4: Add `Entry` and `EntryWithResolvedLinkedFiles` types to
  `@keystatic/core/reader`
- Updated dependencies [e9b0e64]
  - @voussoir/action-group@0.1.4
  - @voussoir/badge@0.1.4
  - @voussoir/button@0.1.7
  - @voussoir/checkbox@0.2.4
  - @voussoir/combobox@0.1.5
  - @voussoir/image@0.1.3
  - @voussoir/layout@0.1.3
  - @voussoir/link@0.1.3
  - @voussoir/list-view@0.1.5
  - @voussoir/nav-list@0.1.2
  - @voussoir/notice@0.1.4
  - @voussoir/number-field@0.1.4
  - @voussoir/overlays@0.1.5
  - @voussoir/picker@0.1.4
  - @voussoir/progress@0.1.2
  - @voussoir/radio@0.1.5
  - @voussoir/search-field@0.1.5
  - @voussoir/style@0.1.5
  - @voussoir/table@0.1.4
  - @voussoir/tabs@0.1.3
  - @voussoir/text-field@0.1.6
  - @voussoir/typography@0.1.4
  - @voussoir/breadcrumbs@0.1.7
  - @voussoir/toast@0.1.7

## 0.0.89

### Patch Changes

- d5e079a: Remove circular dependencies causing broken build

## 0.0.88

### Patch Changes

- f1c2585: Add `@keystatic/core/api/utils`

## 0.0.87

### Patch Changes

- bdeef7d: Fix log in page breaking setup flow

## 0.0.86

### Patch Changes

- 6fbbf89: Allow writing a language in the code block markdown shortcut in the
  document editor
- 2df0cb7: Add log in page rather than redirecting to GitHub directly and make
  the log out button work.
- 2fb7327: Fix spacing between blocks in the document editor
- 97ea182: Properly fix using the reader API in React server component
  environments

## 0.0.85

### Patch Changes

- d978f9b: Fix pasting in some cases reversing the order of the pasted elements

## 0.0.84

### Patch Changes

- a45bad6: Updated the tree used in local mode to include all non-gitignored
  files from cwd or `localBaseDirectory` so that `fields.pathReference` works
  correctly.

## 0.0.83

### Patch Changes

- c7da5cd: Add experimental `cloud` storage kind
- 323d8cb: Fix updating slugs not working
- 6b9c653: Fix `@keystatic/core/reader` in server component environments
- 70116b6: Add an `all` method to the collection reader API to load all entries
  in a collection and add `resolveLinkedFiles` option to the methods that read
  entries to eagerly load document fields (and potentially other kinds of fields
  in the future).
- Updated dependencies [c0a4d82]
  - @voussoir/typography@0.1.3
  - @voussoir/types@0.1.2

## 0.0.82

### Patch Changes

- a9932ae: Make the add button in array fields open a modal for the new item
  instead of adding an empty item

## 0.0.81

### Patch Changes

- 91307f5: Include callback url with port in addition to the portless one when
  creating the GitHub app so that installing the app redirects to the right
  place

## 0.0.80

### Patch Changes

- dd8c580: Remove `options` property on `FormField`
- 51199ba: Add `images.schema` option to `fields.document` to allow changing the
  schema for

## 0.0.79

### Patch Changes

- fc71faa: Update frontmatter parsing to be more permissive

## 0.0.78

### Patch Changes

- aeac610: Updated generated TypeScript declaration
- Updated dependencies [aeac610]
- Updated dependencies [aa67b0b]
  - @voussoir/style@0.1.3
  - @voussoir/table@0.1.2
  - @voussoir/toast@0.1.4
  - @voussoir/utils@2.0.2
  - @voussoir/action-group@0.1.3
  - @voussoir/badge@0.1.2
  - @voussoir/breadcrumbs@0.1.4
  - @voussoir/button@0.1.5
  - @voussoir/checkbox@0.2.2
  - @voussoir/combobox@0.1.4
  - @voussoir/core@5.0.1
  - @voussoir/dialog@0.2.1
  - @voussoir/drag-and-drop@0.1.1
  - @voussoir/field@0.1.5
  - @voussoir/icon@0.2.0
  - @voussoir/image@0.1.1
  - @voussoir/layout@0.1.2
  - @voussoir/link@0.1.2
  - @voussoir/list-view@0.1.4
  - @voussoir/listbox@0.1.4
  - @voussoir/menu@0.1.2
  - @voussoir/nav-list@0.1.1
  - @voussoir/notice@0.1.2
  - @voussoir/number-field@0.1.3
  - @voussoir/overlays@0.1.4
  - @voussoir/picker@0.1.3
  - @voussoir/progress@0.1.1
  - @voussoir/radio@0.1.3
  - @voussoir/search-field@0.1.3
  - @voussoir/slots@0.1.2
  - @voussoir/ssr@0.2.1
  - @voussoir/tabs@0.1.2
  - @voussoir/text-field@0.1.4
  - @voussoir/tooltip@0.1.2
  - @voussoir/types@0.1.1
  - @voussoir/typography@0.1.2

## 0.0.77

### Patch Changes

- Updated dependencies [c4611a1]
- Updated dependencies [ee3a58d]
- Updated dependencies [44e9f2b]
- Updated dependencies [44e9f2b]
- Updated dependencies [44e9f2b]
- Updated dependencies [44e9f2b]
  - @voussoir/ssr@0.2.0
  - @voussoir/typography@0.1.1
  - @voussoir/layout@0.1.1
  - @voussoir/icon@0.1.3
  - @voussoir/link@0.1.1
  - @voussoir/core@5.0.0
  - @voussoir/field@0.1.4
  - @voussoir/notice@0.1.1
  - @voussoir/style@0.1.2
  - @voussoir/action-group@0.1.2
  - @voussoir/breadcrumbs@0.1.3
  - @voussoir/button@0.1.4
  - @voussoir/checkbox@0.2.1
  - @voussoir/combobox@0.1.3
  - @voussoir/list-view@0.1.3
  - @voussoir/listbox@0.1.3
  - @voussoir/number-field@0.1.2
  - @voussoir/overlays@0.1.3
  - @voussoir/picker@0.1.2
  - @voussoir/radio@0.1.2
  - @voussoir/tabs@0.1.1
  - @voussoir/toast@0.1.3

## 0.0.76

### Patch Changes

- 1aed6d0: Add `componentBlocks: 'inherit'` option to block child fields

## 0.0.75

### Patch Changes

- 06340d6: Allow using `**` in the collection `path` option instead of `*` to
  allow for slugs with slashes in them
- 8c6a5b0: Fix brackets being added after text when the link keyboard shortcut
  is pressed but links aren't enabled

## 0.0.74

### Patch Changes

- f8796d7: Add "view on github" action to collection and entry pages.
- 3d75342: Add `fields.emptyDocument`
- d69dd72: Add `publicPath` option to `fields.image`

## 0.0.73

### Patch Changes

- 7088dd0: Fix local setup
- Updated dependencies [e1bbb04]
  - @voussoir/icon@0.1.2

## 0.0.72

### Patch Changes

- c26cbba: Cosmetic fixes for the editor table when RTL.
- bcadd92: Move the editor table's "header row" toggle to a block popover.
- 1d1d702: Introduce toasts to the app. Show a "positive" toast when an entry is
  created.
- e750768: Fix deleting rows in tables with a header row
- 4890253: Fix image block in `DocumentRenderer`

## 0.0.71

### Patch Changes

- a171117: Fix previous release

## 0.0.70

### Patch Changes

- d8995ff: Keystatic no longer has to run on the same port that the setup was
  run on. For existing apps, you should add
  `http://127.0.0.1/api/keystatic/github/oauth/callback` as a callback url in
  your GitHub App settings and remove `KEYSTATIC_URL` from your local env
  variables if you have it set. **If you don't make these changes, you won't be
  able to sign in locally.**

## 0.0.69

### Patch Changes

- 5c2ac9a: Fix document editor heading menu
- ca3954f: Fix `fields.conditional` layout
- Updated dependencies [e6ae29c]
  - @voussoir/button@0.1.3
  - @voussoir/icon@0.1.1
  - @voussoir/breadcrumbs@0.1.2

## 0.0.68

### Patch Changes

- 59a6bcf: Use port that Keystatic is running on when doing setup for callback
  URLs

## 0.0.67

### Patch Changes

- 5f9a6c8: Remove usage of `administration` permissions in forking flow

## 0.0.66

### Patch Changes

- 02a0fd1: Fixed keyboard navigation bugs in table cells in the document field
  editor
- 02a0fd1: Fixed table styles in the document field editor
- 6890696: Fix clicking done in a nested array field closing both modals
- 1ea62fe: Add `repository` key to keystatic/core package.json

## 0.0.65

### Patch Changes

- cea2700: Fix validation when a single form field is directly inside an array
  field

## 0.0.64

### Patch Changes

- 50c48da: Adjust action button selected styles. Implement a bespoke popover
  pattern for document editor blocks.
- 641c962: Add `table` block
- Updated dependencies [50c48da]
  - @voussoir/action-group@0.1.1
  - @voussoir/button@0.1.2
  - @voussoir/breadcrumbs@0.1.1

## 0.0.63

### Patch Changes

- c8c4c49: Fix integer field validation

## 0.0.62

### Patch Changes

- 145460a: Fix decoding url encoded strings in the API route

## 0.0.61

### Patch Changes

- 0f71625: Add `description` to
  `fields.{array,checkbox,date,document,image,integer,multiselect,select,pathReference,relationship}`.
  (previously it was only on `fields.{text,slug}`)
- 0f71625: Fix incorrectly attempting to get a GitHub token when using local
  mode

## 0.0.60

### Patch Changes

- d49af4b: Fix `reader.collection.*.list` with collections with `path` options
  without a trailing slash

## 0.0.59

### Patch Changes

- 21a687a: Document editor:
  - Move `image` block details (filename and alt text) into a modal dialog,
    which can be invoked from an actions popover.
  - Give the `link` block a similar treatment.

## 0.0.58

### Patch Changes

- 9f27bde: Fix conditionally changing the `storage` field in a config creating a
  TypeScript error

## 0.0.57

### Patch Changes

- e259a19: Replace `directory`, `directorySuffix` and `format.location` options
  with `path` option

## 0.0.56

### Patch Changes

- 5627932: Fix collection page with `directorySuffix`

## 0.0.55

### Patch Changes

- 86e0b27: Rename `format.frontmatter` to `format.data` and make it optional
- 86e0b27: Add `format.location` option

## 0.0.54

### Patch Changes

- 51ffbae: Add built-in image block to document field
- 6d18465: New package "@voussoir/breadcrumbs" exports `Breadcrumbs` component.

  @voussoir/badge

  Use common test-utils package.

  @voussoir/field

  Reduce field label weight: ~semibold~ --> "medium".

  @voussoir/listbox

  Fix checkmark spacing for lists containing selectable items.

  @voussoir/text-field

  Add font smoothing to input text.

  @voussoir/utils

  Add tests for `isReactText()` guard.

- d161cea: Add `slugField` option to array fields
- Updated dependencies [6d18465]
- Updated dependencies [d87141d]
  - @voussoir/badge@0.1.1
  - @voussoir/field@0.1.3
  - @voussoir/listbox@0.1.2
  - @voussoir/overlays@0.1.2
  - @voussoir/text-field@0.1.3
  - @voussoir/utils@2.0.1
  - @voussoir/tooltip@0.1.1

## 0.0.53

### Patch Changes

- b26b23c: Add error handling for saving/deleting items when using
  `storage: { kind: 'local' }`.

## 0.0.52

### Patch Changes

- 0189c09: Allow users who don't have write permissions to the repo to fork it
  from inside Keystatic.

## 0.0.51

### Patch Changes

- 8f03a96: Fix `fields.image({ directory: ... })` in local mode
- 05a4490: Document editor code block enhancements

## 0.0.50

### Patch Changes

- 8c768a1: Allow changing where image fields store images

## 0.0.49

### Patch Changes

- e2230c0: `fields.document` no longer stores anything in YAML/JSON data files.
- Updated dependencies [0fc5ac0]
  - @voussoir/combobox@0.1.2

## 0.0.48

### Patch Changes

- 1b6eb39: Slugs are no longer duplicated into the YAML/JSON data
- 1b6eb39: Added `fields.slug`
- 1b6eb39: Slugs are now validated for uniqueness
- e9432e1: Add `localBaseDirectory` option to API route config

## 0.0.47

### Patch Changes

- 363136d: Replaced `micromatch` with `minimatch` to remove Node dependencies
- f9f53d8: Slugs are now configured by specifying the `slugField` option with a
  field key instead of a function.
- a903ed9: When a non-default branch is checked out, and the user opens the "new
  branch" dialog, present them with the option to base the new branch on default
  or the currently checked out branch.

## 0.0.46

### Patch Changes

- Updated dependencies [fbcfca4]
  - @voussoir/checkbox@0.2.0
  - @voussoir/text-field@0.1.2
  - @voussoir/field@0.1.2
  - @voussoir/list-view@0.1.2
  - @voussoir/table@0.1.1

## 0.0.45

### Patch Changes

- d196cb0: Change suggested config file name

## 0.0.44

### Patch Changes

- 9a5d260: Fix showing "repo not found error" when changing between different
  Keystatic apps that use different repos.

## 0.0.43

### Patch Changes

- 8582c91: Add `fields.relationship` and `fields.fileReference`

## 0.0.42

### Patch Changes

- a569bdb: Avoid mentioning `NEXT_PUBLIC` environment variables when not using
  Next

## 0.0.41

### Patch Changes

- 5bd8a9c: localization progress
- a322dcb: Remove `next` peer dependency

## 0.0.40

### Patch Changes

- 9bcf3d4: Astro support

## 0.0.39

### Patch Changes

- ccacef0: Prioritise getting the GitHub App's slug from the URL over an
  environment variable.
- Updated dependencies [ccacef0]
  - @voussoir/overlays@0.1.1

## 0.0.38

### Patch Changes

- 2fe951a: Fix markdoc serialisation/deserialisation for strikethrough
- 2f324c4: The specific features of the document editor that are enabled are now
  explicitly specified in the config.

## 0.0.37

### Patch Changes

- 052010c: Fix text alignment not serialising/deserialising to Markdoc
- 6600100: replace "edit" with localized string
- 783aa15: - Use localized string for "search".
  - Use localized string for "add".
  - Use localized string for "create".
- 1272c28: Initial release

## 0.0.36

### Patch Changes

- 4b9b56a: Fix creating new branch on save when using Next app dir
- dfc19e6: Implement the first localized strings.

## 0.0.35

### Patch Changes

- 1a50854: Fix redirect on item create

## 0.0.34

### Patch Changes

- 03250dd: Remove octokit

## 0.0.33

### Patch Changes

- 5a66740: Add `keystatic/next-app` entrypoint to allow running in Next's `app`
  directory.
- ebe4a32: introduce "apps/\*" and begin dog-fooding with l10n strings
- Updated dependencies [ebe4a32]
  - @voussoir/search-field@0.1.2

## 0.0.32

### Patch Changes

- 152aca4: Add remove button to image fields
- e067b3d: Fix viewing branches with slashes in them

## 0.0.31

### Patch Changes

- 5a3b28a: Implement `fields.multiselect` UI
- 935b73f: Document editor toolbar; use `Picker` from heading menu.
- 12cf894: Use combobox in code block language selection
- Updated dependencies [19eae03]
- Updated dependencies [d8b7c51]
- Updated dependencies [92927f2]
  - @voussoir/search-field@0.1.1
  - @voussoir/text-field@0.1.1
  - @voussoir/combobox@0.1.1
  - @voussoir/listbox@0.1.1
  - @voussoir/button@0.1.1
  - @voussoir/dialog@0.2.0
  - @voussoir/picker@0.1.1
  - @voussoir/field@0.1.1
  - @voussoir/slots@0.1.1
  - @voussoir/style@0.1.1
  - @voussoir/core@4.0.1
  - @voussoir/menu@0.1.1
  - @voussoir/list-view@0.1.1

## 0.0.30

### Patch Changes

- f8bb47c: Update syntax target

## 0.0.29

### Patch Changes

- 871e04a: Fix local setup

## 0.0.28

### Patch Changes

- 902b310: Fix image field outside of document fields and fix inferred types in
  reader API for basic form fields

## 0.0.27

### Patch Changes

- dfebac9: Misc UI fixes

## 0.0.26

### Patch Changes

- dba81d3: Add local mode

## 0.0.25

### Patch Changes

- a4c9128: Fix onboarding issue

## 0.0.24

### Patch Changes

- 07c731f: Move `@voussoir/test-utils` to `devDependencies`
- Updated dependencies [07c731f]
  - @voussoir/number-field@0.1.1

## 0.0.23

### Patch Changes

- 957eb6b: Onboarding improvements

## 0.0.22

### Patch Changes

- 0deff67: Improve image field
- 0deff67: Add `fields.date`

## 0.0.21

### Patch Changes

- 3eaab6d: Initial Release
- Updated dependencies [3eaab6d]
  - @voussoir/action-group@0.1.0
  - @voussoir/badge@0.1.0
  - @voussoir/button@0.1.0
  - @voussoir/checkbox@0.1.0
  - @voussoir/core@4.0.0
  - @voussoir/dialog@0.1.0
  - @voussoir/drag-and-drop@0.1.0
  - @voussoir/field@0.1.0
  - @voussoir/icon@0.1.0
  - @voussoir/image@0.1.0
  - @voussoir/layout@0.1.0
  - @voussoir/link@0.1.0
  - @voussoir/list-view@0.1.0
  - @voussoir/listbox@0.1.0
  - @voussoir/menu@0.1.0
  - @voussoir/nav-list@0.1.0
  - @voussoir/notice@0.1.0
  - @voussoir/number-field@0.1.0
  - @voussoir/overlays@0.1.0
  - @voussoir/picker@0.1.0
  - @voussoir/progress@0.1.0
  - @voussoir/search-field@0.1.0
  - @voussoir/slots@0.1.0
  - @voussoir/ssr@0.1.0
  - @voussoir/style@0.1.0
  - @voussoir/table@0.1.0
  - @voussoir/tabs@0.1.0
  - @voussoir/test-utils@2.0.0
  - @voussoir/text-field@0.1.0
  - @voussoir/tooltip@0.1.0
  - @voussoir/types@0.1.0
  - @voussoir/typography@0.1.0
  - @voussoir/utils@2.0.0
