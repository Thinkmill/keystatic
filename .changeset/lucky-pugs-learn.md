---
'@keystatic/core': minor
---

Add `slugFields` option to collections for multi-segment collection paths. Each entry maps onto a `*` segment of the collection `path` in order, enabling entry paths such as `src/content/blog/en/my-post` while keeping slugs static and deterministic.
