# @voussoir/docs

## 0.0.38

### Patch Changes

- Updated dependencies [[`86bd966`](https://github.com/Thinkmill/keystatic/commit/86bd966ff35981185030ce0850b8041e8a2dc5bb), [`dc7e028`](https://github.com/Thinkmill/keystatic/commit/dc7e0287b1cd1e6b4d09e3b39d390054b60fe130)]:
  - @keystatic/core@0.5.18
  - @keystar/ui@0.7.4
  - @keystatic/next@5.0.1

## 0.0.37

### Patch Changes

- Updated dependencies [[`7924ef8`](https://github.com/Thinkmill/keystatic/commit/7924ef87cb4338e0296d715acd3ab9fb7d39aa51), [`42975f4`](https://github.com/Thinkmill/keystatic/commit/42975f45ba071cf3e2659a67e75e86325ce84944), [`8c2abff`](https://github.com/Thinkmill/keystatic/commit/8c2abff7fe38ad3e1687de57f9bc550997619761)]:
  - @keystar/ui@0.7.3
  - @keystatic/next@5.0.1
  - @keystatic/core@0.5.17

## 0.0.36

### Patch Changes

- Updated dependencies [[`21394c6`](https://github.com/Thinkmill/keystatic/commit/21394c65a8d507d4355cf71641690464c05d7ec8)]:
  - @keystatic/core@0.5.16
  - @keystatic/next@5.0.0

## 0.0.35

### Patch Changes

- Updated dependencies [[`d3aa1f2`](https://github.com/Thinkmill/keystatic/commit/d3aa1f2386bd690936662d98724eb385564a26cd), [`aa13ea9`](https://github.com/Thinkmill/keystatic/commit/aa13ea917ce2611266c0008197cfea4c1427724c)]:
  - @keystatic/core@0.5.15
  - @keystatic/next@5.0.0

## 0.0.34

### Patch Changes

- Updated dependencies [[`fe63e6a`](https://github.com/Thinkmill/keystatic/commit/fe63e6a77a695d7cafb5aadb12a7eb2e1c914f0b), [`adc0cf6`](https://github.com/Thinkmill/keystatic/commit/adc0cf6282494eb522f6d129a49a7dd9c25c9490), [`5271331`](https://github.com/Thinkmill/keystatic/commit/52713316c9a67058525491e8bba605b69f65c64c), [`7bc3e08`](https://github.com/Thinkmill/keystatic/commit/7bc3e08eb56ebaffd027efff0e1bc875a69df7f2), [`5271331`](https://github.com/Thinkmill/keystatic/commit/52713316c9a67058525491e8bba605b69f65c64c), [`7bc3e08`](https://github.com/Thinkmill/keystatic/commit/7bc3e08eb56ebaffd027efff0e1bc875a69df7f2)]:
  - @keystatic/core@0.5.14
  - @keystatic/next@5.0.0

## 0.0.33

### Patch Changes

- Updated dependencies [[`b509e87`](https://github.com/Thinkmill/keystatic/commit/b509e8794b8e4676feb6e1f0982ddb80cc5376df), [`31286c0`](https://github.com/Thinkmill/keystatic/commit/31286c0e3ff0bd591853fdab70f7f797dad316f5)]:
  - @keystatic/core@0.5.13
  - @keystatic/next@5.0.0

## 0.0.32

### Patch Changes

- Updated dependencies [282ab553]
- Updated dependencies [a2d56566]
- Updated dependencies [603d85be]
- Updated dependencies [bd923de5]
- Updated dependencies [e819d5f2]
- Updated dependencies [d37a5422]
- Updated dependencies [2c818862]
- Updated dependencies [5f11dcd2]
- Updated dependencies [d860d675]
- Updated dependencies [319c0dba]
- Updated dependencies [ce1696f6]
- Updated dependencies [a703043c]
- Updated dependencies [d20e1ad6]
- Updated dependencies [e819d5f2]
  - @keystar/ui@0.7.2
  - @keystatic/core@0.5.12
  - @keystatic/next@5.0.0

## 0.0.31

### Patch Changes

- Updated dependencies [dbb9d3cb]
  - @keystatic/core@0.5.11
  - @keystatic/next@5.0.0

## 0.0.30

### Patch Changes

- Updated dependencies [e1ebbdae]
  - @keystatic/core@0.5.10
  - @keystatic/next@5.0.0

## 0.0.29

### Patch Changes

- Updated dependencies [847b9163]
  - @keystatic/core@0.5.9
  - @keystatic/next@5.0.0

## 0.0.28

### Patch Changes

- Updated dependencies [4d1cee00]
  - @keystatic/core@0.5.8
  - @keystatic/next@5.0.0

## 0.0.27

### Patch Changes

- Updated dependencies [c519f119]
  - @keystatic/core@0.5.7
  - @keystatic/next@5.0.0

## 0.0.26

### Patch Changes

- Updated dependencies [c619ef2e]
  - @keystatic/core@0.5.6
  - @keystatic/next@5.0.0

## 0.0.25

### Patch Changes

- Updated dependencies [dad16ba6]
  - @keystar/ui@0.7.0

## 0.0.24

### Patch Changes

- Updated dependencies [ad59430d]
- Updated dependencies [53d8fcc7]
  - @keystar/ui@0.6.0

## 0.0.23

### Patch Changes

- Updated dependencies [f4aaa8e3]
  - @keystar/ui@0.5.0

## 0.0.22

### Patch Changes

- 0229959f: Replace hard-coded class names with `ClassList` instances.
- Updated dependencies [9854c6b1]
- Updated dependencies [0229959f]
  - @keystar/ui@0.4.2

## 0.0.21

### Patch Changes

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

- Updated dependencies [be85e097]
- Updated dependencies [9eaefd73]
  - @keystar/ui@0.4.0

## 0.0.20

### Patch Changes

- b9ca5380: Support "hideHeader" prop on table `Column` components.
- Updated dependencies [b9ca5380]
  - @keystar/ui@0.3.2

## 0.0.19

### Patch Changes

- 7dafe782: Calendar widgets for date selection:

  - New package "@keystar/ui/calendar" exposes new components, `Calendar` and `RangeCalendar`
  - Update to "@keystar/ui/date-time" exposes new components, `DatePicker` and `DateRangePicker`

  Related fixes and improvements:

  - Truncate `ActionButton` label text
  - Support "aria-hidden" on `Heading` and `Text` components

- Updated dependencies [5f9dd460]
- Updated dependencies [083ee638]
- Updated dependencies [ba3e4a0b]
- Updated dependencies [7ed2a7d8]
- Updated dependencies [7dafe782]
  - @keystar/ui@0.3.0

## 0.0.18

### Patch Changes

- ad46c9dd: token schema updates
- Updated dependencies [ad46c9dd]
  - @keystar/ui@0.2.0

## 0.0.17

### Patch Changes

- f272b8ee: consolidate color-scheme logic surrounding ssr
- Updated dependencies [f272b8ee]
- Updated dependencies [bf6a27bb]
  - @keystar/ui@0.1.4

## 0.0.16

### Patch Changes

- b30c4b45: Remove bespoke icon implementations.
- Updated dependencies [e667fb9c]
- Updated dependencies [aec6359b]
- Updated dependencies [b30c4b45]
- Updated dependencies [ef586da4]
- Updated dependencies [6c58f038]
- Updated dependencies [7fe8d2f4]
- Updated dependencies [781884f9]
  - @keystar/ui@0.1.2

## 0.0.15

### Patch Changes

- Updated dependencies [944dbe67]
- Updated dependencies [8a9fa5f8]
- Updated dependencies [91857b9b]
- Updated dependencies [50105597]
- Updated dependencies [9f16e062]
  - @keystar/ui@0.1.0

## 0.0.14

### Patch Changes

- 686dfc3d: Storybook migrate from 6 to 7.

## 0.0.13

### Patch Changes

- Updated dependencies [4114d6d4]
  - @voussoir/editor@0.2.0

## 0.0.12

### Patch Changes

- Updated dependencies [6a33f487]
- Updated dependencies [30298e81]
  - @voussoir/button@0.2.0
  - @voussoir/action-group@0.1.6
  - @voussoir/number-field@0.1.6
  - @voussoir/search-field@0.1.6
  - @voussoir/breadcrumbs@0.1.10
  - @voussoir/text-field@0.1.8
  - @voussoir/typography@0.1.6
  - @voussoir/date-time@0.1.2
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
  - @voussoir/switch@0.1.5
  - @voussoir/slots@0.1.3
  - @voussoir/style@0.1.6
  - @voussoir/table@0.1.6
  - @voussoir/toast@0.1.9
  - @voussoir/utils@2.0.3
  - @voussoir/link@0.1.5
  - @voussoir/menu@0.1.5
  - @voussoir/tabs@0.1.5
  - @voussoir/editor@0.1.1

## 0.0.11

### Patch Changes

- 01e292f: New package "@voussoir/switch" exports `Switch` component.

## 0.0.10

### Patch Changes

- c1c33e2: New package "@voussoir/date-time" exports components `DateField` and `TimeField`.

  **Related**

  - Fix conditional "visuallyHidden" on `Text` component.
  - Bump "@react-aria/i18n" from `3.6.2` to `3.7.1` for all relevant packages.
  - Bump "@react-types/shared" from `3.14.1` to `3.18.0` for all relevant packages.
  - Add exports from "@react-aria/i18n" and "@internationalized/date" to docs' scope.

- Updated dependencies [c1c33e2]
  - @voussoir/action-group@0.1.5
  - @voussoir/breadcrumbs@0.1.8
  - @voussoir/button@0.1.8
  - @voussoir/checkbox@0.2.5
  - @voussoir/combobox@0.1.6
  - @voussoir/core@5.0.2
  - @voussoir/date-time@0.1.1
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

## 0.0.9

### Patch Changes

- e9b0e64: Strict dimension types.
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

## 0.0.8

### Patch Changes

- aeac610: Updated generated TypeScript declaration
- Updated dependencies [aeac610]
- Updated dependencies [aa67b0b]
  - @voussoir/style@0.1.3
  - @voussoir/table@0.1.2
  - @voussoir/toast@0.1.4
  - @voussoir/utils@2.0.2
  - @voussoir/action-group@0.1.3
  - @voussoir/avatar@0.1.2
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
  - @voussoir/next@0.1.1
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
  - @voussoir/test-utils@2.0.2
  - @voussoir/text-field@0.1.4
  - @voussoir/tooltip@0.1.2
  - @voussoir/types@0.1.1
  - @voussoir/typography@0.1.2

## 0.0.7

### Patch Changes

- ee3a58d: Add `'use client'` to entrypoints
- Updated dependencies [c4611a1]
- Updated dependencies [ee3a58d]
- Updated dependencies [44e9f2b]
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
  - @voussoir/next@0.1.0
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
  - @voussoir/test-utils@2.0.1
  - @voussoir/toast@0.1.3

## 0.0.6

### Patch Changes

- ff07e99: Documentation for new avatar package.

## 0.0.5

### Patch Changes

- 27d6e06: docs: move toaster root
- e6ae29c: Support "static" prop on `ActionButton`, `Button` and `ClearButton`, for when they appear over a background. Support `aria-label` on the `Icon` component.
- Updated dependencies [e6ae29c]
  - @voussoir/button@0.1.3
  - @voussoir/icon@0.1.1
  - @voussoir/breadcrumbs@0.1.2
  - @voussoir/toast@0.1.2

## 0.0.4

### Patch Changes

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

- Updated dependencies [6d18465]
- Updated dependencies [d87141d]
  - @voussoir/badge@0.1.1
  - @voussoir/field@0.1.3
  - @voussoir/listbox@0.1.2
  - @voussoir/overlays@0.1.2
  - @voussoir/text-field@0.1.3
  - @voussoir/utils@2.0.1
  - @voussoir/tooltip@0.1.1

## 0.0.3

### Patch Changes

- fbcfca4: New package "@voussoir/radio" exports `Radio` and `RadioGroup` components.

  **Updates**

  - Export `CheckboxGroup` from "@voussoir/checkbox" package.
  - Export `validateFieldProps` from "@voussoir/field" package.

- Updated dependencies [fbcfca4]
  - @voussoir/checkbox@0.2.0
  - @voussoir/text-field@0.1.2
  - @voussoir/field@0.1.2
  - @voussoir/radio@0.1.1
  - @voussoir/list-view@0.1.2
  - @voussoir/table@0.1.1

## 0.0.2

### Patch Changes

- 19eae03: implement combobox
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

## 0.0.1

### Patch Changes

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
