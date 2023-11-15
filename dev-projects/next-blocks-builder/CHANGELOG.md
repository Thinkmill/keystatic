# @example/next-block-builder

## 0.1.2

### Patch Changes

- Updated dependencies [b768f147]
- Updated dependencies [32d22480]
  - @keystatic/next@2.0.0
  - @keystatic/core@0.2.0

## 0.1.1

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
- Updated dependencies [be5d3646]
  - @keystatic/core@0.1.9
