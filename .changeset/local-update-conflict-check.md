---
'@keystatic/core': patch
---

Detect concurrent local storage edits and deletions by validating expected file and directory SHAs in `/api/keystatic/update`, returning HTTP `409 Conflict` without partial disk writes and showing an actionable conflict notice in the editor.
