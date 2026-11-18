---
'@keystatic/core': patch
---

Fix signing in with Keystatic Cloud sometimes ending on a `400 invalid_grant` error page even though the sign-in succeeded. The OAuth callback now exchanges the authorization code only once, instead of again on every re-render of the router.
