import { config, collection, singleton, fields } from '@keystatic/core';

export default config({
  storage: {
    kind: 'github',
    repo: { owner: 'Thinkmill', name: 'keystatic-test-repo' },
  },
  collections: {
    posts: collection({
      label: 'Posts',
      getItemSlug: data => data.slug,
      schema: {
        title: fields.text({ label: 'Title' }),
        slug: fields.text({
          label: 'Slug',
          validation: { length: { min: 4 } },
        }),
        publishDate: fields.date({ label: 'Publish Date' }),
        heroImage: fields.image({ label: 'Hero Image' }),
        content: fields.document({
          label: 'Content',
          formatting: true,
          dividers: true,
          links: true,
        }),
        authors: fields.array(
          fields.object({
            name: fields.text({ label: 'Name' }),
            bio: fields.document({
              label: 'Bio',
              formatting: true,
              dividers: true,
              links: true,
            }),
          }),
          { label: 'Authors', itemLabel: props => props.fields.name.value }
        ),
      },
    }),
    people: collection({
      label: 'People',
      directory: 'some/directory/people',
      getItemSlug: data => data.username,
      schema: {
        name: fields.text({ label: 'Name' }),
        username: fields.text({
          label: 'Username',
          validation: { length: { min: 4 } },
        }),
      },
    }),
    packages: collection({
      label: 'Packages',
      directorySuffix: 'somewhere/else',
      getItemSlug: data => data.name,
      format: 'json',
      schema: {
        name: fields.text({ label: 'Name' }),
      },
    }),
    singlefileposts: collection({
      label: 'Single File Posts',
      directory: 'single-file-posts',
      getItemSlug: data => data.slug,
      format: { contentField: 'content', frontmatter: 'yaml' },
      schema: {
        title: fields.text({ label: 'Title' }),
        slug: fields.text({ label: 'Slug' }),
        content: fields.document({
          label: 'Content',
          formatting: true,
          dividers: true,
          links: true,
        }),
      },
    }),
  },
  singletons: {
    settings: singleton({
      label: 'Settings',
      schema: {
        something: fields.checkbox({ label: 'Something' }),
        logo: fields.image({ label: 'Logo' }),
      },
    }),
  },
});
