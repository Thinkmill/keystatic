# keystatic

## Setup

Create a Next.js app with the following pages

```ts
// pages/api/keystatic/[[...params]].tsx
import createKeystaticAPIRoute from 'keystatic/api';

export default createKeystaticAPIRoute({});
```

```ts
// pages/keystatic/[[...params]].tsx
import { collection, component, config, fields, makePage } from 'keystatic';

export default makePage(
  config({
    repo: {
      owner: 'github-owner',
      name: 'github-repo-name',
    },
    collections: {
      posts: collection({
        label: 'Posts',
        directory: './somewhere/posts',
        getItemSlug: data => data.slug,
        schema: {
          title: fields.text({ label: 'Title' }),
          slug: fields.text({
            label: 'Slug',
            validation: { length: { min: 4 } },
          }),
          content: fields.document({
            label: 'Content',
            componentBlocks: {
              something: component({
                label: 'Some Component',
                preview: () => null,
                schema: {},
              }),
            },
          }),
          authors: fields.array(
            fields.object({
              name: fields.text({ label: 'Name' }),
              bio: fields.document({ label: 'Bio' }),
            }),
            { label: 'Authors', itemLabel: props => props.fields.name.value }
          ),
        },
      }),
    },
  })
);
```
