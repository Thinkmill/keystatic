# @keystatic/create

The `@keystatic/create` packages allows users to create a Keystatic project
direct from their CLI.

```bash
npx create @keystatic
```

## Templates

There are two kinds of templates:

- Simple templates - these are stored in the monorepo under `/templates`. These
  are basic implementations with minimal dependencies.
- Complex templates - these show more advanced examples and are stored in
  separate repositories to keep dependencies in the monorepo smaller, and to
  avoid polluting the repo with lots of code and assets.

Both kind of templates should be published and downloaded by the CLI from npm
directly.

Template major versions should be kept up to date with the major version of the
CLI, so if breaking changes are introduced in the future the CLI can ensure
users are downloading the latest template, not out-of-date cached versions.

## Testing

To run locally use the command `pnpm dev:create`.

When asked for a directory to make the project in, you can specify absolute
paths i.e. `/Users/janedoe/projects/keystatic-test`
