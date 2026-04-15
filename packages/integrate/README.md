# @itgkey/integrate-itgkey

Add itgkey to an existing Next.js app with minimal setup.

## Usage

```bash
npx @itgkey/integrate-itgkey@latest
```

Or target a specific directory:

```bash
npx @itgkey/integrate-itgkey@latest ./my-next-app
```

The CLI will:

- Add `keystatic.config.ts`
- Add `page-builder.ts`
- Add API route files under `app/api/keystatic/[...params]/route.ts` (or `src/app/...`)
- Add admin UI route files under `app/keystatic` (or `src/app/keystatic`)
- Add dynamic frontend routes (`/` and `/[slug]`) with block rendering
- Add posts route rendering for Markdoc content (`/posts/[slug]`)
- Add starter content files (`pages/index.yaml`, `settings/index.yaml`, `posts/first-post.mdoc`)
- Add `itgkey-blocks.ts` for user-defined component/block schemas
- Add `.github/prompts/itgkey-migration-agent.prompt.md` for agent-driven project-specific migration
- Optionally install required dependencies

When existing frontend routes are detected, the CLI defaults to preserve mode:

- Keeps your existing `app/page.tsx`, `app/[slug]/page.tsx`, and layout files
- Adds preview routes under `/itgkey-preview`
- Adds `app/itgkey-responsive.tsx` helper to convert existing page sections into responsive blocks

Migration rule: user-facing copy should be CMS-driven.

- During migration, map current page titles/text/buttons into block fields in Keystatic.
- Avoid hardcoding site copy in components so content stays editable from `/keystatic`.
- Treat each existing frontend component/section as its own block (no mega catch-all block).
- After migration, verify multiple routes work (at minimum: `/`, `/keystatic`, `/itgkey-preview`, `/itgkey-preview/[slug]`).
