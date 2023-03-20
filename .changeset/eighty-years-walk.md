---
'@keystatic/core': patch
---

Keystatic no longer has to run on the same port that the setup was run on. For existing apps, you should add `http://127.0.0.1/api/keystatic/github/oauth/callback` as a callback url in your GitHub App settings and remove `KEYSTATIC_URL` from your local env variables if you have it set. **If you don't make these changes, you won't be able to sign in locally.**
