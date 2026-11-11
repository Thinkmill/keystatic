---
'@keystatic/core': patch
---

Fix `fields.mdx()` and `fields.markdoc()` handling of external `http://` / `https://` image URLs so remote images are preserved on save without corrupting document content or registering phantom local file deletions in `TrackedMap`.
