---
'@keystatic/core': minor
---

Add optional client-side image compression to `fields.image()`

Images can now be automatically compressed before saving using the new `compression` option:

```ts
fields.image({
  label: 'Cover Image',
  compression: {
    maxWidth: 2000,       // px
    maxHeight: 2000,      // px
    maxFileSize: 1048576, // 1MB in bytes
    quality: 0.8,         // 0-1 for lossy formats
    format: 'preserve',   // 'preserve' | 'webp' | 'jpeg'
  },
})
```

When compression is enabled, the UI displays the original and compressed file sizes after upload.
