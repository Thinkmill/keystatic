---
'@example/astro-content': patch
'@keystatic/templates-astro': patch
'@keystatic/astro': patch
'keystatic-docs': patch
---

Updates the Astro integration to manage the custom `127.0.0.1` host

Keystatic used to require updating your `dev` script. It's now managed by the integration, feel free to simplify it!

```diff
- "dev": "astro dev --host 127.0.0.1"
+ "dev": "astro dev"
```