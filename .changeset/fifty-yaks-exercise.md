---
'@example/next-block-builder': patch
'@keystar/docs': patch
'@keystatic/core': patch
'@keystar/ui': patch
'keystatic-docs': patch
---

Introduce [client-side routing](https://react-spectrum.adobe.com/react-aria/routing.html) concept from react-aria:
- Include `RouterProvider` with `KeystarProvider` (renamed from "VoussoirProvider"), conditionally when _new_ `router` prop is provided. This new router behaviour makes `linkComponent` and friends unnecessary; they have been removed.
- Re-export `useLink` from [react-aria](https://react-spectrum.adobe.com/react-aria/useLink.html), which manages router behaviour on click (among other things), for use outside of the component library. Internally we reference "@react-aria/link" directly.
- Replace instances of link component references with appropriate alternative.
- Support link props e.g. "href", "target" etc. on `Menu` items.
- Consolidate cursor behaviour: `ActionButton`, `Button`, and (Menu) `Item` will now use "pointer" for anchors.

Supporting/related changes:
- Update react-aria dependencies to latest: "@react-aria/\*",  "@react-stately/*",  "@react-types/\*",  "@internationalized/\*".
- Remove linking behaviour from storybook. Might revisit later, but for now it added unnecessary complexity.

App changes:
- Deprecate `link` prop on `Keystatic` component. We can now abstract that behaviour from the existing `router` prop.
- Refactor topbar menu items to use link API; mostly to confirm expected behaviour.
