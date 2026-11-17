---
'@keystatic/core': minor
---

Add `{field}` placeholders to collection paths. A segment like `{locale}` in a collection's `path` is filled in from the value of the named field in the collection's schema when an entry is created, so entry paths can vary per entry while staying deterministic from config.

```ts
blog: collection({
  label: 'Blog',
  path: 'src/content/blog/{locale}/*',
  slugField: 'title',
  schema: {
    locale: fields.text({ label: 'Locale' }),
    title: fields.slug({ name: { label: 'Title' } }),
  },
});
```

An entry with `locale: 'en'` and slug `my-post` lives at `src/content/blog/en/my-post` and has the slug `en/my-post` — listing, the reader, and both storage backends work unchanged. Placeholder fields can be any form field that serializes to a string, number or boolean (text, select, integer, date, another slug field, ...). Editing a placeholder field moves the entry to its new path, and `en/my-post` and `fr/my-post` are distinct slugs that can co-exist.
