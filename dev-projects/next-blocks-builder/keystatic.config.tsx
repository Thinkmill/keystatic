import { config, fields, collection } from '@keystatic/core';

import {
  callToAction,
  container,
  simpleText,
  testimonial,
  twoColumns,
} from './src/keystatic/schema/component-blocks';

// ----------------------------------
// Keystatic config
// ----------------------------------

const shouldUseCloudStorage = process.env.NODE_ENV === 'production';

export default config({
  storage: shouldUseCloudStorage
    ? { kind: 'cloud', pathPrefix: 'dev-projects/next-blocks-builder' }
    : { kind: 'local' },
  cloud: {
    project: 'thinkmill-labs/next-blocks-builder',
  },
  collections: {
    // "Page builder" collection using component blocks
    pages: collection({
      label: 'Pages',
      path: 'src/content/pages/**',
      slugField: 'title',
      format: { contentField: 'content' },
      entryLayout: 'content',
      previewUrl: `/{slug}`,
      schema: {
        title: fields.slug({ name: { label: 'Page title' } }),
        content: fields.document({
          label: 'Page content',
          formatting: true,
          layouts: [[1], [1, 2], [2, 1]],
          componentBlocks: {
            container,
            testimonial,
            twoColumns,
            simpleText,
            callToAction,
          },
        }),
      },
    }),
    testimonials: collection({
      label: 'Testimonials',
      slugField: 'name',
      path: 'src/content/testimonials/*',
      schema: {
        name: fields.slug({ name: { label: 'Name' } }),
        description: fields.text({
          label: 'Description',
          description: 'Job role, context info, ...',
        }),
        quote: fields.text({ label: 'Quote', multiline: true }),
        image: fields.cloudImage({
          label: 'Image',
        }),
      },
    }),
  },
});
