# @keystatic/core

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
