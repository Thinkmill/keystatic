---
'@keystatic/core': patch
---

Add support for `mailto:` and `tel:` links in document and markdoc editors

Previously, pasting `mailto:` or `tel:` links would not create a hyperlink because the URL validation only accepted `http://` and `https://` schemes. This change expands the URL pattern to include `mailto:` and `tel:` protocols, allowing users to create email and phone links by pasting.
