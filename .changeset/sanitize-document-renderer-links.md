---
'@keystatic/core': patch
---

Sanitize link URLs in `DocumentRenderer`. Links with `javascript:`, `data:` or `vbscript:` URLs now render with `about:blank`, including when a custom `link` renderer is used.
