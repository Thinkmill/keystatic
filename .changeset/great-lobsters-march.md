---
'@keystatic/core': minor
---

Add `slugFields` option to collections for multi-segment collection paths. Each entry maps onto a `*` segment of the collection `path` in order — e.g. `slugFields: ['locale', 'title']` with `path: 'content/blog/*/*'` stores an entry with locale `en` and slug `my-post` at `content/blog/en/my-post` — while keeping slugs static and deterministic. The number of `*` segments and the `slugFields` entries are also checked against each other at the type level.
