# Cursor Agent Handoff (April 15, 2026)

## Project summary
- Monorepo root: itgkey
- Primary runtime package: packages/keystatic (published as @itgkey/core)
- Templates used for generated apps: templates/nextjs, templates/remix, templates/astro
- Duplicated scaffold copy also exists under create-itgkey-myapp

## How project creation works (important)
- The create CLI (packages/create/src/actions/create-project.ts) downloads templates from GitHub repo archive (main branch), not from npm template packages.
- It then normalizes dependency versions in generated project package.json to latest npm versions of:
  - @itgkey/core
  - @itgkey/next
- Therefore, template fixes require pushing repo changes to GitHub main to affect new generated projects.

## Recent fixes implemented

### 1) Collection search + unchanged status visibility
Files updated:
- packages/keystatic/src/app/CollectionPage.tsx
- create-itgkey-myapp/packages/keystatic/src/app/CollectionPage.tsx

Changes:
- Added explicit Unchanged status icon rendering.
- Expanded search to include parsed entry data values (not slug-only).

### 2) Blocks add UX optimization
Files updated:
- packages/keystatic/src/form/fields/blocks/ui.tsx
- create-itgkey-myapp/packages/keystatic/src/form/fields/blocks/ui.tsx

Changes:
- Large option sets open searchable dialog.
- Block options are grouped by category.
- Add actions are left-aligned.

### 3) Next.js template nav title/slug bug
Files updated:
- templates/nextjs/keystatic.config.ts
- templates/nextjs/app/layout.tsx
- templates/nextjs/page-builder.tsx
- templates/nextjs/settings/index.yaml
- create-itgkey-myapp/templates/nextjs/keystatic.config.ts
- create-itgkey-myapp/templates/nextjs/app/layout.tsx
- create-itgkey-myapp/templates/nextjs/page-builder.tsx
- create-itgkey-myapp/templates/nextjs/settings/index.yaml

Changes:
- Settings navigation schema now separates title and slug.
- Navigation rendering uses slug object safely via getPageSlug.
- Slug normalization now trims, converts spaces to hyphens, collapses hyphens, lowercases.

### 4) Blocks support in post pages/collections
Files updated:
- templates/nextjs/keystatic.config.ts
- templates/remix/keystatic.config.ts
- templates/astro/keystatic.config.ts
- create-itgkey-myapp/templates/nextjs/keystatic.config.ts
- create-itgkey-myapp/templates/remix/keystatic.config.ts
- create-itgkey-myapp/templates/astro/keystatic.config.ts

Changes:
- Next: posts now include both markdoc components and a blocks field.
- Remix/Astro: post markdoc now enables pageBuilderComponents.

## Publish status
- @itgkey/core was bumped and published to npm as 0.5.53.
- npm check confirmed latest @itgkey/core = 0.5.53.

## Why user still saw old behavior in some new projects
- Template changes do not ship from @itgkey/core publish.
- New project output depends on template source from GitHub main used by create CLI.
- If repo changes were not pushed to GitHub main, generated projects remain old.

## Recommended next actions
1. Commit all template and runtime changes.
2. Push branch and merge to main.
3. Create a fresh test project using create-itgkey and verify:
   - Collection search matches content fields.
   - Unchanged status icon appears.
   - Next settings navigation supports separate title and slug.
   - Blocks add dialog is grouped and left-aligned.
   - Posts support custom blocks/components.
4. If distributing template packages separately, optionally publish:
   - @itgkey/templates-nextjs
   - @itgkey/templates-remix
   - @itgkey/templates-astro

## Useful verification commands
- npm view @itgkey/core version
- pnpm up @itgkey/core@latest (inside consumer app)
- git status --short

## Notes for the next agent
- Be careful not to revert unrelated existing edits in repo.
- The create-itgkey-myapp folder mirrors many source files; keep it in sync where relevant.
- If publish commands trigger npm browser auth, complete auth first then rerun publish.
