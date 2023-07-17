---
'@keystatic/core': patch
'@keystar/ui': patch
---

Update dashboard page to use card-like interface elements for collections and singletons.

Related app changes:

- declare side and main app panels as "inline-size" containers
- less obtrusive change indicators on sidebar singleton
- create `useLocalizedString` hook, which abstracts l10n message import to one location

Related component library changes:

- adjust `AnchorDOMProps` type; require "href" property and remove (MIME) "type" property
- support "href" (and friends) on `ActionButton` component
- expose `containerQueries` from "style" package
- fix class list declaration issue, which was causing a warning from `FieldButton` component
