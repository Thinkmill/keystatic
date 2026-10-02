---
'@keystatic/core': patch
---

Add content internationalization. Set `i18n` on the config with your `locales` and `defaultLocale`, then mark a collection or singleton as `localized` and include a `{locale}` token in its `path`. The Admin UI shows a language switcher above the navigation that filters entries to the selected locale, and `createReader` accepts a `{ locale }` option for reading localized content.
