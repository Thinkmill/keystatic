import { config, fields, collection } from '@keystatic/core';

import {
  container,
  twoColumns,
  simpleText,
  testimonial,
} from '@/keystatic/schema/component-blocks';

// ----------------------------------
// Keystatic config
// ----------------------------------
export default config({
  storage: {
    kind: 'local',
  },
  collections: {
    // "Page builder" collection using component blocks
    pages: collection({
      label: 'Pages',
      path: 'src/content/pages/**',
      slugField: 'title',
      format: { contentField: 'content' },
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
        quote: fields.text({ label: 'Quote', multiline: true }),
        avatar: fields.image({
          label: 'Avatar',
          directory: 'public/images/testimonials',
          publicPath: '/images/testimonials/',
        }),
      },
    }),
  },
});
