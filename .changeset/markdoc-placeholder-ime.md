---
'@keystatic/core': patch
---

Fix first-character IME composition breaking on empty Markdoc fields by rendering the editor placeholder with a CSS pseudo-element node decoration and skipping redundant ProseMirror state updates.
