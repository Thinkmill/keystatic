---
"@keystar/ui": patch
---

Added "use client" to style entrypoint in keystar-ui.

This means that `import { css, tokenSchema } from '@keystar/ui/style'` won't break in a Next.js 13 server component.
