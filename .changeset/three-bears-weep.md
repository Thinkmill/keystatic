---
'@keystatic/core': patch
---

The `document` field defaults for formatting have changed to exclude options that require custom Markdoc tags.

See https://keystatic.com/docs/fields/document#formatting-options for the new defaults.

When updating, if you have configured a document field with shorthand for the `formatting` config:

```ts
fields.document({
  // ...
  formatting: true,
})
```

To keep the same options you'll need to change you config to:

```ts
fields.document({
  // ...
  formatting: {
    alignment: true,
    inlineMarks: {
      bold: true,
      code: true,
      italic: true,
      keyboard: true,
      strikethrough: true,
      subscript: true,
      superscript: true,
      underline: true,
    },
    listTypes: true,
    headingLevels: true,
    blockTypes: true,
    softBreaks: true,
  },
})
```
