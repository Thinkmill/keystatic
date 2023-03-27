# @voussoir/core

## 5.0.1

### Patch Changes

- aeac610: Updated generated TypeScript declaration
- Updated dependencies [aeac610]
  - @voussoir/style@0.1.3
  - @voussoir/utils@2.0.2
  - @voussoir/link@0.1.2
  - @voussoir/ssr@0.2.1
  - @voussoir/types@0.1.1

## 5.0.0

### Major Changes

- 44e9f2b: `VoussoirProvider` no longer loads Inter automatically, it must be
  loaded manually.
- 44e9f2b: Removed `injectVoussoirStyles`
- 44e9f2b: `VoussoirProvider` no longer adds the voussoir classes to the
  document element automatically. The previous behaviour can be restored by
  rendering `ClientSideOnlyDocumentElement` inside the `VoussoirProvider`.

### Patch Changes

- 44e9f2b: `VoussoirProvider` now renders an `SSRProvider`
- Updated dependencies [c4611a1]
- Updated dependencies [ee3a58d]
  - @voussoir/ssr@0.2.0
  - @voussoir/link@0.1.1
  - @voussoir/style@0.1.2

## 4.0.1

### Patch Changes

- 19eae03: implement combobox
- Updated dependencies [19eae03]
  - @voussoir/style@0.1.1

## 4.0.0

### Major Changes

- 3eaab6d: Initial Release

### Patch Changes

- Updated dependencies [3eaab6d]
  - @voussoir/link@0.1.0
  - @voussoir/ssr@0.1.0
  - @voussoir/style@0.1.0
  - @voussoir/types@0.1.0
  - @voussoir/utils@2.0.0
