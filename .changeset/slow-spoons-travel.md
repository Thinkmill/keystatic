---
'@keystatic/core': patch
---

Add an `all` method to the collection reader API to load all entries in a collection and add `resolveLinkedFiles` option to the methods that read entries to eagerly load document fields (and potentially other kinds of fields in the future).
