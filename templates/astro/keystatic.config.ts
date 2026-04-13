import {
  config,
  fields,
  collection,
  component,
  singleton,
} from '@itgkey/core';

const pageBuilderAssetDirectories = {
  files: {
    directory: 'public/page-builder/files',
    publicPath: '/page-builder/files/',
  },
  images: {
    directory: 'public/page-builder/images',
    publicPath: '/page-builder/images/',
  },
  videos: {
    directory: 'public/page-builder/videos',
    publicPath: '/page-builder/videos/',
  },
} as const;

const pageBuilderComponents = {
  section: component({
    label: 'Section',
    schema: {
      title: fields.text({ label: 'Section title' }),
      content: fields.child({
        kind: 'block',
        formatting: 'inherit',
        componentBlocks: 'inherit',
        placeholder: 'Write section content...',
      }),
    },
    preview: () => null,
  }),
  imageBlock: component({
    label: 'Image',
    schema: {
      image: fields.image({
        label: 'Image',
        ...pageBuilderAssetDirectories.images,
      }),
      alt: fields.text({ label: 'Alt text' }),
      caption: fields.text({ label: 'Caption', multiline: true }),
    },
    preview: () => null,
  }),
  videoBlock: component({
    label: 'Video',
    schema: {
      video: fields.file({
        label: 'Video file',
        ...pageBuilderAssetDirectories.videos,
      }),
      poster: fields.image({
        label: 'Poster image',
        ...pageBuilderAssetDirectories.images,
      }),
      caption: fields.text({ label: 'Caption', multiline: true }),
    },
    preview: () => null,
  }),
  fileBlock: component({
    label: 'File',
    schema: {
      file: fields.file({
        label: 'File',
        ...pageBuilderAssetDirectories.files,
      }),
      label: fields.text({ label: 'Link label' }),
      description: fields.text({ label: 'Description', multiline: true }),
    },
    preview: () => null,
  }),
  callToAction: component({
    label: 'Call to Action',
    schema: {
      text: fields.text({ label: 'Text', multiline: true }),
      buttonLabel: fields.text({ label: 'Button label' }),
      buttonHref: fields.text({ label: 'Button link' }),
    },
    preview: () => null,
  }),
};

export default config({
  storage: {
    kind: 'local',
  },
  collections: {
    posts: collection({
      label: 'Posts',
      slugField: 'title',
      path: 'src/content/posts/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        content: fields.markdoc({
          label: 'Content',
          options: {
            image: {
              directory: 'src/assets/images/posts',
              publicPath: '../../assets/images/posts/',
            },
          },
        }),
      },
    }),
  },
  singletons: {
    pages: singleton({
      label: 'Pages',
      path: 'src/content/pages/index',
      schema: {
        items: fields.array(
          fields.object({
            title: fields.text({ label: 'Title' }),
            slug: fields.slug({ name: { label: 'Slug' } }),
            content: fields.markdoc({
              label: 'Content',
              components: pageBuilderComponents as any,
              options: {
                image: {
                  directory: 'src/assets/images/pages',
                  publicPath: '../../assets/images/pages/',
                },
              },
            }),
          }),
          {
            label: 'Pages',
            itemLabel: props =>
              props.fields.title.value ||
              props.fields.slug.value.slug ||
              'Untitled page',
          }
        ),
      },
    }),
  },
});

