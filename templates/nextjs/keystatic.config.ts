import { config, collection, fields, singleton } from '@itgkey/core';
import { pageBuilderComponents } from './page-builder';

export const markdocConfig = fields.markdoc.createMarkdocConfig({
  components: pageBuilderComponents as any,
});

const pageBlocks = {
  hero: {
    label: 'Hero',
    schema: fields.object({
      eyebrow: fields.text({ label: 'Eyebrow' }),
      heading: fields.text({ label: 'Heading' }),
      subheading: fields.text({ label: 'Subheading', multiline: true }),
      backgroundImage: fields.image({
        label: 'Background image',
        directory: 'public/page-builder/images',
        publicPath: '/page-builder/images/',
      }),
      primaryCtaLabel: fields.text({ label: 'Primary button label' }),
      primaryCtaHref: fields.text({ label: 'Primary button link' }),
      secondaryCtaLabel: fields.text({ label: 'Secondary button label' }),
      secondaryCtaHref: fields.text({ label: 'Secondary button link' }),
    }),
  },
  content: {
    label: 'Content',
    schema: fields.object({
      eyebrow: fields.text({ label: 'Eyebrow' }),
      heading: fields.text({ label: 'Heading' }),
      body: fields.text({ label: 'Body', multiline: true }),
    }),
  },
  image: {
    label: 'Image',
    schema: fields.object({
      image: fields.image({
        label: 'Image',
        directory: 'public/page-builder/images',
        publicPath: '/page-builder/images/',
      }),
      alt: fields.text({ label: 'Alt text' }),
      caption: fields.text({ label: 'Caption', multiline: true }),
    }),
  },
  videoHeader: {
    label: 'Video Hero',
    schema: fields.object({
      title: fields.text({ label: 'Title' }),
      subtitle: fields.text({ label: 'Subtitle', multiline: true }),
      video: fields.file({
        label: 'Video',
        directory: 'public/page-builder/videos',
        publicPath: '/page-builder/videos/',
      }),
      poster: fields.image({
        label: 'Poster image',
        directory: 'public/page-builder/images',
        publicPath: '/page-builder/images/',
      }),
    }),
  },
  imageWithText: {
    label: 'Image With Text',
    schema: fields.object({
      title: fields.text({ label: 'Title' }),
      image: fields.image({
        label: 'Image',
        directory: 'public/page-builder/images',
        publicPath: '/page-builder/images/',
      }),
      alt: fields.text({ label: 'Alt text' }),
      content: fields.text({ label: 'Content', multiline: true }),
      imagePosition: fields.select({
        label: 'Image position',
        options: [
          { label: 'Left', value: 'left' },
          { label: 'Right', value: 'right' },
        ],
        defaultValue: 'left',
      }),
    }),
  },
  file: {
    label: 'File',
    schema: fields.object({
      file: fields.file({
        label: 'File',
        directory: 'public/page-builder/files',
        publicPath: '/page-builder/files/',
      }),
      label: fields.text({ label: 'Link label' }),
      description: fields.text({ label: 'Description', multiline: true }),
    }),
  },
  stats: {
    label: 'Stats',
    schema: fields.object({
      title: fields.text({ label: 'Title' }),
      items: fields.array(
        fields.object({
          label: fields.text({ label: 'Label' }),
          value: fields.text({ label: 'Value' }),
        }),
        {
          label: 'Stats',
          itemLabel: props => props.fields.label.value || props.fields.value.value,
        }
      ),
    }),
  },
  testimonial: {
    label: 'Testimonial',
    schema: fields.object({
      quote: fields.text({ label: 'Quote', multiline: true }),
      name: fields.text({ label: 'Name' }),
      role: fields.text({ label: 'Role' }),
      avatar: fields.image({
        label: 'Avatar',
        directory: 'public/page-builder/images',
        publicPath: '/page-builder/images/',
      }),
    }),
  },
  spacer: {
    label: 'Spacer',
    schema: fields.object({
      size: fields.select({
        label: 'Size',
        options: [
          { label: 'Small', value: 'small' },
          { label: 'Medium', value: 'medium' },
          { label: 'Large', value: 'large' },
        ],
        defaultValue: 'medium',
      }),
    }),
  },
  featureGrid: {
    label: 'Feature Grid',
    schema: fields.object({
      title: fields.text({ label: 'Title' }),
      items: fields.array(
        fields.object({
          title: fields.text({ label: 'Item title' }),
          description: fields.text({ label: 'Description', multiline: true }),
        }),
        {
          label: 'Features',
          itemLabel: props => props.fields.title.value || 'Feature',
        }
      ),
    }),
  },
  faq: {
    label: 'FAQ',
    schema: fields.object({
      title: fields.text({ label: 'Title' }),
      items: fields.array(
        fields.object({
          question: fields.text({ label: 'Question' }),
          answer: fields.text({ label: 'Answer', multiline: true }),
        }),
        {
          label: 'FAQ items',
          itemLabel: props => props.fields.question.value || 'Question',
        }
      ),
    }),
  },
  logoCloud: {
    label: 'Logo Cloud',
    schema: fields.object({
      title: fields.text({ label: 'Title' }),
      logos: fields.array(
        fields.object({
          name: fields.text({ label: 'Name' }),
          logo: fields.image({
            label: 'Logo',
            directory: 'public/page-builder/images',
            publicPath: '/page-builder/images/',
          }),
        }),
        {
          label: 'Logos',
          itemLabel: props => props.fields.name.value || 'Logo',
        }
      ),
    }),
  },
};

export default config({
  storage: {
    kind: 'local',
  },
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
  singletons: {
    settings: singleton({
      label: 'Settings',
      path: 'settings/index',
      schema: {
        navigation: fields.array(
          fields.object({
            label: fields.text({ label: 'Label' }),
            slug: fields.text({
              label: 'Page slug',
              description:
                'Use the same slug value as the page route (without leading slash).',
            }),
            visible: fields.checkbox({
              label: 'Visible in navigation',
              defaultValue: true,
            }),
          }),
          {
            label: 'Navigation',
            itemLabel: props =>
              props.fields.label.value ||
              props.fields.slug.value ||
              'Navigation item',
          }
        ),
      },
    }),
    pages: singleton({
      label: 'Pages',
      path: 'pages/index',
      schema: {
        items: fields.array(
          fields.object({
            title: fields.text({ label: 'Title' }),
            isHomepage: fields.checkbox({
              label: 'Use as homepage (/)',
              defaultValue: false,
            }),
            slug: fields.slug({ name: { label: 'Slug' } }),
            blocks: fields.blocks(pageBlocks, {
              label: 'Page blocks',
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

