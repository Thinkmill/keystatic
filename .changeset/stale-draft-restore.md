---
'@keystatic/core': patch
---

A draft is now only restored automatically if the entry hasn't changed since the draft was saved. Otherwise the saved entry is shown along with a toast offering to restore the draft, so saving can no longer silently overwrite newer content with an old draft.
