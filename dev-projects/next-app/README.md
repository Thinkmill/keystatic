# Keystatic Dev App

This is the main app we're using to develop Keystatic.

It's not intended to be representative of a normal keystatic setup, and will
change from time to time as we develop & test new features.

To get it running locally, you'll need the following variables in a `.env` file:

```bash
KEYSTATIC_SECRET=...
KEYSTATIC_GITHUB_CLIENT_ID=...
KEYSTATIC_GITHUB_CLIENT_SECRET=...
```

It also needs to run on port 3000.

Run `pnpm run dev` to start the app and navigate to `/keystatic` to get to the
Admin UI.
