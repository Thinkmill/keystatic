---
"@keystatic/astro": patch
---

Fix GitHub-mode API routes crashing under `@astrojs/cloudflare` on Astro v6+ with `Astro.locals.runtime.env has been removed in Astro v6`. Reads Cloudflare's runtime env via a dynamic `cloudflare:workers` import instead, falling back to the previous `context.locals.runtime.env` shape for other adapters/older Astro versions.
