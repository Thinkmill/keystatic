# itgkey

First-class CMS experience, TypeScript API, Markdown & YAML/JSON based, no DB.

Built with DNA from Keystone, connects directly to GitHub and doesn't mess with
your source code. Conceived for modern front-end frameworks like Next.js, Remix
and Astro, designed to fit into your workflow.

## Scaffold a new itgkey project

The quickest way to get started is with npm:

```sh
npx @itgkey/create-itgkey@latest my-app-name
```

Then run:

```sh
cd my-app-name
npm install
npm run dev
```

No GitHub PAT or custom npm registry setup is required.

---

## Add itgkey to an existing Next.js app (minimal steps)

If you already have a Next.js app and want the least amount of manual work,
use this App Router setup.

Quickest way:

```sh
npx @itgkey/integrate-itgkey@latest
```

Or target a specific app directory:

```sh
npx @itgkey/integrate-itgkey@latest ./my-next-app
```

The CLI writes the required files and can install dependencies for you.
It also scaffolds the page-builder style blocks, singleton pages/settings,
dynamic routes, and starter content files.
If existing routes are detected, it can preserve them and scaffold conversion helpers
plus preview routes under `/itgkey-preview`.
It also creates `itgkey-blocks.ts` (custom block starter) and
`.github/prompts/itgkey-migration-agent.prompt.md` (agent migration prompt).
Use that prompt to migrate existing page text/content into CMS fields instead of hardcoded strings.

Manual setup (if preferred):

1. Install dependencies:

```sh
npm install @itgkey/core@latest @itgkey/next@latest @markdoc/markdoc
```

2. Add `keystatic.config.ts` at your project root:

```ts
import { config, collection, fields } from '@itgkey/core';

export default config({
  storage: { kind: 'local' },
  collections: {
    posts: collection({
      label: 'Posts',
      slugField: 'title',
      path: 'posts/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        content: fields.markdoc({ label: 'Content' }),
      },
    }),
  },
});
```

3. Add API route file at `app/api/keystatic/[...params]/route.ts`:

```ts
import { makeRouteHandler } from '@itgkey/next/route-handler';
import keystaticConfig from '../../../../keystatic.config';

export const { POST, GET } = makeRouteHandler({
  config: keystaticConfig,
});
```

4. Add admin UI files:

`app/keystatic/keystatic.tsx`

```tsx
'use client';

import { makePage } from '@itgkey/next/ui/app';
import config from '../../keystatic.config';

export default makePage(config);
```

`app/keystatic/layout.tsx`

```tsx
import KeystaticApp from './keystatic';

export default function RootLayout() {
  return <KeystaticApp />;
}
```

`app/keystatic/[[...params]]/page.tsx`

```tsx
export default function Page() {
  return null;
}
```

5. Run your app and open `/keystatic`.

If your project uses `src/app`, place these files under `src/app/...` instead.

Reference implementation in this repo:

- [templates/nextjs/keystatic.config.ts](templates/nextjs/keystatic.config.ts)
- [templates/nextjs/app/api/keystatic/[...params]/route.ts](templates/nextjs/app/api/keystatic/%5B...params%5D/route.ts)
- [templates/nextjs/app/keystatic/keystatic.tsx](templates/nextjs/app/keystatic/keystatic.tsx)
- [templates/nextjs/app/keystatic/layout.tsx](templates/nextjs/app/keystatic/layout.tsx)
- [templates/nextjs/app/keystatic/[[...params]]/page.tsx](templates/nextjs/app/keystatic/%5B%5B...params%5D%5D/page.tsx)

---

## Developing locally

If you want to spin up itgkey for local development in the monorepo, run:

```sh
pnpm install
cd dev-projects/{example}
pnpm run dev
```

To run the create CLI locally during development:

```sh
pnpm dev:create
```

### Requirements

- node.js v18
- pnpm

Note: if you are getting an error with `pnpm`, make sure you're using
[corepack](https://nodejs.org/api/corepack.html), uninstall pnpm, and then run
`corepack enable pnpm`.

---

## Custom Page Builder Blocks (Template Projects)

If you are building custom singleton pages with a block-based page builder in
the template projects, use this workflow:

1. Add a block schema to `pageBlocks` in your template `keystatic.config`.
2. Render the same block key in your frontend page route switch
   (`block.discriminant`).
3. Wrap each rendered block in its own `<section>` so editors can compose pages
   visually in any order.

### Example: Add a FAQ block

In your template `keystatic.config`:

```ts
faq: {
  label: 'FAQ',
  schema: fields.object({
    title: fields.text({ label: 'Title' }),
    items: fields.array(
      fields.object({
        question: fields.text({ label: 'Question' }),
        answer: fields.text({ label: 'Answer', multiline: true }),
      }),
      { label: 'FAQ items' }
    ),
  }),
},
```

In your frontend page renderer:

```ts
case 'faq':
  return (
    <section key={key}>
      {block.value.title ? <h2>{block.value.title}</h2> : null}
      {(block.value.items ?? []).map((item, i) => (
        <article key={`${key}-faq-${i}`}>
          <h3>{item.question}</h3>
          <p>{item.answer}</p>
        </article>
      ))}
    </section>
  );
```

### Practical tips

- Keep block keys stable (`hero`, `faq`, `stats`) and match them exactly in the
  renderer switch.
- Use `fields.image` and `fields.file` with explicit `directory` and
  `publicPath` values.
- Prefer reusable block patterns (hero, content, media, CTA, testimonials) over
  one-off variants.
- If you update block schemas after creating content, older entries may need a
  migration or manual edit.

### Frontend vs Admin UI styling

- Scope public-site styles to frontend files/routes.
- Avoid global `html`/`body` resets that can leak into admin routes.
- If needed, gate frontend-only UI with route checks (for example hide frontend
  navbar under `/keystatic`).

---

## License

Copyright (c) 2023
[Thinkmill Labs](https://www.thinkmill.com.au/labs?utm_campaign=github-keystatic)
Pty Ltd. Licensed under the MIT License.
