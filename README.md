# itgkey

First-class CMS experience, TypeScript API, Markdown & YAML/JSON based, no DB.

Built with DNA from Keystone, connects directly to GitHub and doesn't mess with
your source code. Conceived for modern front-end frameworks like Next.js, Remix
and Astro, designed to fit into your workflow.

## Scaffold a new itgkey project

The quickest way to get started is with the `create-itgkey` CLI, distributed
via GitHub Packages.

### Option A — convenience installer (handles auth for you)

```sh
curl -fsSL https://raw.githubusercontent.com/deropiee/itgkey/main/install.sh | bash -s my-app-name
```

The script will prompt for a [GitHub Personal Access Token](https://github.com/settings/tokens/new?scopes=read:packages)
with the `read:packages` scope the first time it runs, then configure your
local `~/.npmrc` automatically.

### Option B — manual setup

1. Create a [GitHub PAT](https://github.com/settings/tokens/new?scopes=read:packages)
   with the `read:packages` scope.

2. Add the registry to your `~/.npmrc` (one-time):

   ```sh
   echo "@deropiee:registry=https://npm.pkg.github.com" >> ~/.npmrc
   echo "//npm.pkg.github.com/:_authToken=<YOUR_PAT_HERE>"  >> ~/.npmrc
   ```
   Replace `<YOUR_PAT_HERE>` with the token you created.

3. Scaffold any time:

   ```sh
   npx @deropiee/create-itgkey my-app-name
   ```

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
