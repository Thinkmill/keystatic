# keystatic-docs

## 0.0.0-test-20240116000936

### Patch Changes

- Updated dependencies [4053f41c]
- Updated dependencies [b7fc29dc]
- Updated dependencies [22dc4030]
- Updated dependencies [6986f36b]
  - @keystatic/core@0.0.0-test-20240116000936
  - @keystatic/next@0.0.0-test-20240116000936
  - @keystar/ui@0.0.0-test-20240116000936

## 1.0.17

### Patch Changes

- Updated dependencies [cd03b1cd]
- Updated dependencies [b768f147]
- Updated dependencies [32d22480]
  - @keystar/ui@0.4.1
  - @keystatic/next@2.0.0
  - @keystatic/core@0.2.0

## 1.0.16

### Patch Changes

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

- Updated dependencies [bd20acb0]
- Updated dependencies [be85e097]
- Updated dependencies [e3d6fd29]
- Updated dependencies [9eaefd73]
- Updated dependencies [be5d3646]
  - @keystatic/core@0.1.9
  - @keystar/ui@0.4.0

## 1.0.15

### Patch Changes

- Updated dependencies [5f9dd460]
- Updated dependencies [083ee638]
- Updated dependencies [ba3e4a0b]
- Updated dependencies [7ed2a7d8]
- Updated dependencies [92c80281]
- Updated dependencies [7dafe782]
  - @keystar/ui@0.3.0
  - @keystatic/core@0.1.2

## 1.0.14

### Patch Changes

- c5407cce: Add datetime field
- Updated dependencies [6d6226be]
- Updated dependencies [03f0543c]
- Updated dependencies [1e96432c]
- Updated dependencies [c24dc631]
- Updated dependencies [6895c566]
- Updated dependencies [7310a672]
- Updated dependencies [c5407cce]
- Updated dependencies [7ec4e84f]
- Updated dependencies [ecd9213a]
- Updated dependencies [ca6774b8]
- Updated dependencies [1f96ff27]
- Updated dependencies [03f0543c]
- Updated dependencies [7767c69a]
  - @keystar/ui@0.2.1
  - @keystatic/core@0.1.0
  - @keystatic/next@1.0.0

## 1.0.13

### Patch Changes

- Updated dependencies [c43d7045]
- Updated dependencies [21395048]
  - @keystatic/core@0.0.116

## 1.0.12

### Patch Changes

- Updated dependencies [ad46c9dd]
- Updated dependencies [47102969]
  - @keystatic/core@0.0.115
  - @keystar/ui@0.2.0

## 1.0.11

### Patch Changes

- Updated dependencies [6b4c476c]
- Updated dependencies [f9f09616]
- Updated dependencies [29586e33]
  - @keystatic/core@0.0.114
  - @keystar/ui@0.1.7

## 1.0.10

### Patch Changes

- Updated dependencies [78c98496]
- Updated dependencies [07c63bab]
- Updated dependencies [062ccf49]
  - @keystar/ui@0.1.6
  - @keystatic/core@0.0.113

## 1.0.9

### Patch Changes

- Updated dependencies [efc83c9c]
- Updated dependencies [0ab08c7c]
  - @keystatic/core@0.0.112
  - @keystar/ui@0.1.5

## 1.0.8

### Patch Changes

- Updated dependencies [f272b8ee]
- Updated dependencies [bf6a27bb]
  - @keystar/ui@0.1.4
  - @keystatic/core@0.0.111

## 1.0.7

### Patch Changes

- Updated dependencies [e667fb9c]
- Updated dependencies [aec6359b]
- Updated dependencies [e0c4c37e]
- Updated dependencies [b30c4b45]
- Updated dependencies [ef586da4]
- Updated dependencies [6c58f038]
- Updated dependencies [7fe8d2f4]
- Updated dependencies [781884f9]
- Updated dependencies [cafe3695]
  - @keystatic/core@0.0.110
  - @keystar/ui@0.1.2

## 1.0.6

### Patch Changes

- Updated dependencies [4e595627]
- Updated dependencies [477b4e96]
- Updated dependencies [b832e495]
- Updated dependencies [b6f4fb12]
- Updated dependencies [68e3be7c]
  - @keystatic/core@0.0.109
  - @keystar/ui@0.1.1

## 1.0.5

### Patch Changes

- Updated dependencies [bbbca74f]
- Updated dependencies [944dbe67]
- Updated dependencies [8a9fa5f8]
- Updated dependencies [91857b9b]
- Updated dependencies [0bafd9f1]
- Updated dependencies [50105597]
- Updated dependencies [9f16e062]
  - @keystatic/core@0.0.108
  - @keystar/ui@0.1.0

## 1.0.4

### Patch Changes

- Updated dependencies [0327f443]
  - @keystatic/next@0.0.11

## 1.0.3

### Patch Changes

- Updated dependencies [0016a2b0]
- Updated dependencies [cd2d22d7]
  - @keystatic/core@0.0.107
  - @keystatic/next@0.0.10

## 1.0.2

### Patch Changes

- Updated dependencies [098a199a]
  - @keystatic/next@0.0.9

## 1.0.1

### Patch Changes

- Updated dependencies [618ba4aa]
- Updated dependencies [30298e81]
  - @keystatic/core@0.0.106
  - @keystatic/next@0.0.8
  - @voussoir/progress@0.1.3
