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
- Add API route files under `app/api/keystatic/[...params]/route.ts` (or `src/app/...`)
- Add admin UI route files under `app/keystatic` (or `src/app/keystatic`)
- Optionally install required dependencies
