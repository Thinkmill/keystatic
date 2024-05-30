# @example/next-block-builder

## 0.1.18

### Patch Changes

- Updated dependencies [[`86bd966`](https://github.com/Thinkmill/keystatic/commit/86bd966ff35981185030ce0850b8041e8a2dc5bb), [`dc7e028`](https://github.com/Thinkmill/keystatic/commit/dc7e0287b1cd1e6b4d09e3b39d390054b60fe130)]:
  - @keystatic/core@0.5.18
  - @keystatic/next@5.0.1

## 0.1.17

### Patch Changes

- Updated dependencies [[`7924ef8`](https://github.com/Thinkmill/keystatic/commit/7924ef87cb4338e0296d715acd3ab9fb7d39aa51), [`42975f4`](https://github.com/Thinkmill/keystatic/commit/42975f45ba071cf3e2659a67e75e86325ce84944), [`8c2abff`](https://github.com/Thinkmill/keystatic/commit/8c2abff7fe38ad3e1687de57f9bc550997619761)]:
  - @keystatic/next@5.0.1
  - @keystatic/core@0.5.17

## 0.1.16

### Patch Changes

- Updated dependencies [[`21394c6`](https://github.com/Thinkmill/keystatic/commit/21394c65a8d507d4355cf71641690464c05d7ec8)]:
  - @keystatic/core@0.5.16
  - @keystatic/next@5.0.0

## 0.1.15

### Patch Changes

- Updated dependencies [[`d3aa1f2`](https://github.com/Thinkmill/keystatic/commit/d3aa1f2386bd690936662d98724eb385564a26cd), [`aa13ea9`](https://github.com/Thinkmill/keystatic/commit/aa13ea917ce2611266c0008197cfea4c1427724c)]:
  - @keystatic/core@0.5.15
  - @keystatic/next@5.0.0

## 0.1.14

### Patch Changes

- Updated dependencies [[`fe63e6a`](https://github.com/Thinkmill/keystatic/commit/fe63e6a77a695d7cafb5aadb12a7eb2e1c914f0b), [`adc0cf6`](https://github.com/Thinkmill/keystatic/commit/adc0cf6282494eb522f6d129a49a7dd9c25c9490), [`5271331`](https://github.com/Thinkmill/keystatic/commit/52713316c9a67058525491e8bba605b69f65c64c), [`7bc3e08`](https://github.com/Thinkmill/keystatic/commit/7bc3e08eb56ebaffd027efff0e1bc875a69df7f2), [`5271331`](https://github.com/Thinkmill/keystatic/commit/52713316c9a67058525491e8bba605b69f65c64c), [`7bc3e08`](https://github.com/Thinkmill/keystatic/commit/7bc3e08eb56ebaffd027efff0e1bc875a69df7f2)]:
  - @keystatic/core@0.5.14
  - @keystatic/next@5.0.0

## 0.1.13

### Patch Changes

- Updated dependencies [[`b509e87`](https://github.com/Thinkmill/keystatic/commit/b509e8794b8e4676feb6e1f0982ddb80cc5376df), [`31286c0`](https://github.com/Thinkmill/keystatic/commit/31286c0e3ff0bd591853fdab70f7f797dad316f5)]:
  - @keystatic/core@0.5.13
  - @keystatic/next@5.0.0

## 0.1.12

### Patch Changes

- Updated dependencies [a2d56566]
- Updated dependencies [603d85be]
- Updated dependencies [d37a5422]
- Updated dependencies [2c818862]
- Updated dependencies [5f11dcd2]
- Updated dependencies [d860d675]
- Updated dependencies [319c0dba]
- Updated dependencies [ce1696f6]
- Updated dependencies [a703043c]
- Updated dependencies [d20e1ad6]
- Updated dependencies [e819d5f2]
  - @keystatic/core@0.5.12
  - @keystatic/next@5.0.0

## 0.1.11

### Patch Changes

- Updated dependencies [dbb9d3cb]
  - @keystatic/core@0.5.11
  - @keystatic/next@5.0.0

## 0.1.10

### Patch Changes

- Updated dependencies [e1ebbdae]
  - @keystatic/core@0.5.10
  - @keystatic/next@5.0.0

## 0.1.9

### Patch Changes

- Updated dependencies [847b9163]
  - @keystatic/core@0.5.9
  - @keystatic/next@5.0.0

## 0.1.8

### Patch Changes

- Updated dependencies [4d1cee00]
  - @keystatic/core@0.5.8
  - @keystatic/next@5.0.0

## 0.1.7

### Patch Changes

- Updated dependencies [c519f119]
  - @keystatic/core@0.5.7
  - @keystatic/next@5.0.0

## 0.1.6

### Patch Changes

- Updated dependencies [c619ef2e]
  - @keystatic/core@0.5.6
  - @keystatic/next@5.0.0

## 0.1.5

### Patch Changes

- Updated dependencies [8ad803c5]
  - @keystatic/core@0.5.0
  - @keystatic/next@5.0.0

## 0.1.4

### Patch Changes

- Updated dependencies [e3947052]
- Updated dependencies [ee3f2038]
  - @keystatic/core@0.4.0
  - @keystatic/next@4.0.0

## 0.1.3

### Patch Changes

- Updated dependencies [0b2432ed]
- Updated dependencies [f4aaa8e3]
  - @keystatic/core@0.3.0
  - @keystatic/next@3.0.0

## 0.1.2

### Patch Changes

- Updated dependencies [b768f147]
- Updated dependencies [32d22480]
  - @keystatic/next@2.0.0
  - @keystatic/core@0.2.0

## 0.1.1

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

- Updated dependencies [bd20acb0]
- Updated dependencies [be85e097]
- Updated dependencies [e3d6fd29]
- Updated dependencies [be5d3646]
  - @keystatic/core@0.1.9
