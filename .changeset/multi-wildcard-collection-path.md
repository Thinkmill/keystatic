---
'@keystatic/core': minor
---

Collection `path` now supports multiple adjacent `*` wildcards (e.g. `blog/*/*`). Each `*` matches exactly one segment of the entry's slug, so slugs look like `en/hello`. The slug field validates the segment count and the reader only lists and reads entries at that depth.
