---
'@keystatic/core': patch
---

Improve syntax highlighting in the `fields.mdx`/`fields.markdoc` editor to only use the first word in the info string to match the language. This is primarily for `fields.mdx` to allow additional information in the info string beyond the editor. In `fields.markdoc` additional content after the first word will be stripped since Markdoc expresses additional information using Markdoc annotations which Keystatic already exposes UI for if `options.codeBlock.schema` is configured.
