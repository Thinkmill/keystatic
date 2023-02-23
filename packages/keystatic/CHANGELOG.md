# @keystatic/core

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
