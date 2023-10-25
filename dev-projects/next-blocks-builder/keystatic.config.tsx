import { config, fields, collection, component } from '@keystatic/core';
import { DocumentRenderer } from '@keystatic/core/renderer';

// Minimal componentBlock styling via surface colors
const surfaceColorLookup = {
  light: '#eeeeee',
  'light-subtle': '#bbbbbb',
  dark: 'black',
  'dark-subtle': '#333333',
  splash: '#10b981',
};

// ----------------------------------
// Shared layout props for all "blocks"
// ----------------------------------
const surface = fields.select({
  label: 'Surface (background color)',
  options: [
    { label: 'Light', value: 'light' },
    { label: 'Light Subtle', value: 'light-subtle' },
    { label: 'Dark', value: 'dark' },
    { label: 'Dark Subtle', value: 'dark-subtle' },
    { label: 'Splash', value: 'splash' },
  ],
  defaultValue: 'light',
});

// Below would be a more comprehensive set of shared layout props

// const sharedLayoutProps = fields.object({
// paddingTop: fields.select({
//   label: 'Padding top',
//   options: [
//     { label: 'Large', value: 'large' },
//     { label: 'Medium', value: 'medium' },
//     { label: 'Small', value: 'small' },
//     { label: 'None', value: 'none' },
//   ],
//   defaultValue: 'medium',
// }),
// paddingBottom: fields.select({
//   label: 'Padding bottom',
//   options: [
//     { label: 'Large', value: 'large' },
//     { label: 'Medium', value: 'medium' },
//     { label: 'Small', value: 'small' },
//     { label: 'None', value: 'none' },
//   ],
//   defaultValue: 'medium',
// }),
// width: fields.select({
//   label: 'Container width',
//   options: [
//     { label: 'Narrow', value: 'narrow' },
//     { label: 'Normal', value: 'normal' },
//   ],
//   defaultValue: 'normal',
// }),
// });

// ------------------------------
// Testimonial component block
// ------------------------------
const testimonial = component({
  label: 'Testimonial',
  preview: props => (
    <div>
      {props.fields.testimonial.value
        ? `Selected: ${props.fields.testimonial.value}`
        : 'Please select a testimonial'}
    </div>
  ),

  schema: {
    testimonial: fields.relationship({
      label: 'Testimonial reference',
      collection: 'testimonials',
      validation: {
        isRequired: true,
      },
    }),
  },
});

// ------------------------------
// Section component block (wrapper for other components)
// ------------------------------
const section = component({
  label: 'Section',
  preview: ({ fields }) => {
    return (
      <div
        style={{
          padding: '1rem 0',
          // @ts-ignore
          borderTop: `dashed 2px ${surfaceColorLookup[fields.surface.value]}`,
          borderBottom: `dashed 2px ${
            // @ts-ignore
            surfaceColorLookup[fields.surface.value]
          }`,
          position: 'relative',
        }}
      >
        {fields.children.element}
      </div>
    );
  },
  schema: {
    surface,
    children: fields.child({
      kind: 'block',
      componentBlocks: 'inherit',
      placeholder: 'Add components here',
    }),
  },
});

// ----------------------------------
// Two-column container
// ----------------------------------
const twoColumns = component({
  label: 'Two Columns',
  preview: props => (
    <div
      style={{
        display: 'flex',
        padding: '1rem 0',
        borderTop: `dashed 2px ${
          // @ts-ignore
          surfaceColorLookup[props.fields.surface.value]
        }`,
        borderBottom: `dashed 2px ${
          // @ts-ignore
          surfaceColorLookup[props.fields.surface.value]
        }`,
        position: 'relative',
      }}
    >
      <div style={{ flex: 1, padding: '1rem' }}>
        {props.fields.left.element}
      </div>
      <div style={{ flex: 1, padding: '1rem' }}>
        {props.fields.right.element}
      </div>
    </div>
  ),
  schema: {
    surface,
    left: fields.child({
      kind: 'block',
      componentBlocks: 'inherit',
      formatting: 'inherit',
      placeholder: 'Add components here',
    }),
    right: fields.child({
      kind: 'block',
      componentBlocks: 'inherit',
      formatting: 'inherit',
      placeholder: 'Add components here',
    }),
  },
});

// ----------------------------------
// Simple text (nested document field — doesn't work yet)
// ----------------------------------
const simpleText = component({
  label: 'Simple text',
  preview: props => <DocumentRenderer document={props.fields.content.value} />,
  schema: {
    content: fields.document({
      label: 'Simple text',
      formatting: true,
    }),
  },
});

// ----------------------------------
// Keystatic config
// ----------------------------------
export default config({
  storage: {
    kind: 'local',
  },
  collections: {
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
            section,
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
