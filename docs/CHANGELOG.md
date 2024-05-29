# keystatic-docs

## 1.0.36

### Patch Changes

- Updated dependencies [[`86bd966`](https://github.com/Thinkmill/keystatic/commit/86bd966ff35981185030ce0850b8041e8a2dc5bb), [`dc7e028`](https://github.com/Thinkmill/keystatic/commit/dc7e0287b1cd1e6b4d09e3b39d390054b60fe130)]:
  - @keystatic/core@0.5.18
  - @keystar/ui@0.7.4
  - @keystatic/next@5.0.1

## 1.0.35

### Patch Changes

- Updated dependencies [[`7924ef8`](https://github.com/Thinkmill/keystatic/commit/7924ef87cb4338e0296d715acd3ab9fb7d39aa51), [`42975f4`](https://github.com/Thinkmill/keystatic/commit/42975f45ba071cf3e2659a67e75e86325ce84944), [`8c2abff`](https://github.com/Thinkmill/keystatic/commit/8c2abff7fe38ad3e1687de57f9bc550997619761)]:
  - @keystar/ui@0.7.3
  - @keystatic/next@5.0.1
  - @keystatic/core@0.5.17

## 1.0.34

### Patch Changes

- Updated dependencies [[`21394c6`](https://github.com/Thinkmill/keystatic/commit/21394c65a8d507d4355cf71641690464c05d7ec8)]:
  - @keystatic/core@0.5.16
  - @keystatic/next@5.0.0

## 1.0.33

### Patch Changes

- Updated dependencies [[`d3aa1f2`](https://github.com/Thinkmill/keystatic/commit/d3aa1f2386bd690936662d98724eb385564a26cd), [`aa13ea9`](https://github.com/Thinkmill/keystatic/commit/aa13ea917ce2611266c0008197cfea4c1427724c)]:
  - @keystatic/core@0.5.15
  - @keystatic/next@5.0.0

## 1.0.32

### Patch Changes

- Updated dependencies [[`fe63e6a`](https://github.com/Thinkmill/keystatic/commit/fe63e6a77a695d7cafb5aadb12a7eb2e1c914f0b), [`adc0cf6`](https://github.com/Thinkmill/keystatic/commit/adc0cf6282494eb522f6d129a49a7dd9c25c9490), [`5271331`](https://github.com/Thinkmill/keystatic/commit/52713316c9a67058525491e8bba605b69f65c64c), [`7bc3e08`](https://github.com/Thinkmill/keystatic/commit/7bc3e08eb56ebaffd027efff0e1bc875a69df7f2), [`5271331`](https://github.com/Thinkmill/keystatic/commit/52713316c9a67058525491e8bba605b69f65c64c), [`7bc3e08`](https://github.com/Thinkmill/keystatic/commit/7bc3e08eb56ebaffd027efff0e1bc875a69df7f2)]:
  - @keystatic/core@0.5.14
  - @keystatic/next@5.0.0

## 1.0.31

### Patch Changes

- Updated dependencies [[`b509e87`](https://github.com/Thinkmill/keystatic/commit/b509e8794b8e4676feb6e1f0982ddb80cc5376df), [`31286c0`](https://github.com/Thinkmill/keystatic/commit/31286c0e3ff0bd591853fdab70f7f797dad316f5)]:
  - @keystatic/core@0.5.13
  - @keystatic/next@5.0.0

## 1.0.30

### Patch Changes

- a2d56566: Introduce new `multiRelationship` field type.
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

## 1.0.29

### Patch Changes

- Updated dependencies [dbb9d3cb]
  - @keystatic/core@0.5.11
  - @keystatic/next@5.0.0

## 1.0.28

### Patch Changes

- Updated dependencies [e1ebbdae]
  - @keystatic/core@0.5.10
  - @keystatic/next@5.0.0

## 1.0.27

### Patch Changes

- Updated dependencies [847b9163]
  - @keystatic/core@0.5.9
  - @keystatic/next@5.0.0

## 1.0.26

### Patch Changes

- Updated dependencies [4d1cee00]
  - @keystatic/core@0.5.8
  - @keystatic/next@5.0.0

## 1.0.25

### Patch Changes

- Updated dependencies [c519f119]
  - @keystatic/core@0.5.7
  - @keystatic/next@5.0.0

## 1.0.24

### Patch Changes

- Updated dependencies [c619ef2e]
  - @keystatic/core@0.5.6
  - @keystatic/next@5.0.0

## 1.0.23

### Patch Changes

- Updated dependencies [8ad803c5]
  - @keystatic/core@0.5.0
  - @keystatic/next@5.0.0

## 1.0.22

### Patch Changes

- 6a60ab3c: Updates the Astro integration to manage the custom `127.0.0.1` host and enables usage with `output: 'server'`

  Keystatic used to require updating your `dev` script. It's now managed by the integration, feel free to simplify it!

  ```diff
  - "dev": "astro dev --host 127.0.0.1"
  + "dev": "astro dev"
  ```

  Moreover, Keystatic now lets you go full SSR! The following Astro config is now supported

  ```mjs
  // astro.config.mjs

  export default defineConfig({
    output: 'server',
  });
  ```

- Updated dependencies [e3947052]
- Updated dependencies [ee3f2038]
  - @keystatic/core@0.4.0
  - @keystatic/next@4.0.0

## 1.0.21

### Patch Changes

- Updated dependencies [0ea27bed]
- Updated dependencies [178fd9f6]
- Updated dependencies [dad16ba6]
  - @keystatic/core@0.3.7
  - @keystar/ui@0.7.0

## 1.0.20

### Patch Changes

- Updated dependencies [ad59430d]
- Updated dependencies [53d8fcc7]
- Updated dependencies [b3071c88]
  - @keystar/ui@0.6.0
  - @keystatic/core@0.3.5

## 1.0.19

### Patch Changes

- e2f22039: feat(docs): Add GitHub reader docs
- Updated dependencies [98130aab]
  - @keystatic/core@0.3.2

## 1.0.18

### Patch Changes

- Updated dependencies [0b2432ed]
- Updated dependencies [f4aaa8e3]
  - @keystatic/core@0.3.0
  - @keystatic/next@3.0.0
  - @keystar/ui@0.5.0

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
