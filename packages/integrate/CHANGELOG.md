# @itgkey/integrate-itgkey

## 0.4.2

### Patch Changes

- Update generated migration prompt to require one distinct block per component/section.
- Add required post-migration verification checklist (including route checks like `/keystatic`, `/itgkey-preview`, and `/itgkey-preview/[slug]`).

## 0.4.1

### Patch Changes

- Write migration prompt to `./.github/prompts/itgkey-migration-agent.prompt.md`.
- Strengthen migration prompt rules to map existing site text/content into CMS fields instead of hardcoding content.

## 0.4.0

### Minor Changes

- Add migration-oriented helper outputs for existing projects:
	- generate `itgkey-blocks.ts` as a custom block/component starter
	- generate `itgkey-migration-agent.prompt.md` for agent-guided project integration
	- keep preserve-mode preview route flow for non-destructive migration

## 0.3.0

### Minor Changes

- Add non-destructive integration mode for existing Next.js apps:
	- preserve current frontend routes by default
	- scaffold preview routes at `/itgkey-preview`
	- add `app/itgkey-responsive.tsx` conversion helper for mapping existing sections to responsive blocks

## 0.2.0

### Minor Changes

- Scaffold a full Next.js starter experience in existing apps:
	- page-builder style singleton pages
	- block-based page rendering routes (`/` and `/[slug]`)
	- frontend navigation from settings singleton
	- posts route with Markdoc rendering
	- starter content files (`pages`, `settings`, `posts`)

## 0.1.1

### Patch Changes

- Fix CLI crash by replacing unsupported spinner `message()` call.
- Clarify that `.` means current directory in the project path prompt.

## 0.1.0

### Minor Changes

- Initial release for integrating itgkey into an existing Next.js App Router project.
