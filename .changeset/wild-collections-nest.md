---
'@keystatic/core': minor
---

Add an optional `computeSlug` to `collection()` that derives a new item's slug from its own field values instead of `slugField`'s input. For a collection whose `path` uses the `**` glob, the returned slug can contain `/` to nest the item under sub-directories (e.g. deriving `2026/09/my-post` from a date field).
