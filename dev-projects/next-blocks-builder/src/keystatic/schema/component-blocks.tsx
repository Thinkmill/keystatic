import { fields, component } from '@keystatic/core';
import { DocumentRenderer } from '@keystatic/core/renderer';

import { layoutProps } from './layout-props';

import type { Surface } from '@/keystatic/schema/layout-props';

// Color lookup to visually "annotate" the Admin UI about the surface
const surfaceColorLookup: Record<Surface, string> = {
  white: '#eeeeee',
  'off-white': '#bbbbbb',
  black: 'black',
  'off-black': '#333333',
  splash: '#10b981',
};

// ----------------------------------
// Container (with layout props) — not sure if useful/needed
// ----------------------------------
export const container = component({
  label: 'Container',
  schema: {
    layoutProps,
    children: fields.child({
      kind: 'block',
      componentBlocks: 'inherit',
      placeholder: 'Add components here',
    }),
  },
  preview: ({ fields }) => {
    return (
      <div
        style={{
          padding: '1rem 0',
          borderTop: `dashed 2px ${
            surfaceColorLookup[fields.layoutProps.fields.surface.value]
          }`,
          borderBottom: `dashed 2px ${
            surfaceColorLookup[fields.layoutProps.fields.surface.value]
          }`,
          position: 'relative',
        }}
      >
        {fields.children.element}
      </div>
    );
  },
});

// ----------------------------------
// Two-columns container
// ----------------------------------
export const twoColumns = component({
  label: 'Two Columns',
  preview: props => (
    <div
      style={{
        display: 'flex',
        padding: '1rem 0',
        borderTop: `dashed 2px ${
          surfaceColorLookup[props.fields.layoutProps.fields.surface.value]
        }`,
        borderBottom: `dashed 2px ${
          surfaceColorLookup[props.fields.layoutProps.fields.surface.value]
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
    layoutProps,
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
// Testimonial picker
// ----------------------------------
export const testimonial = component({
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

// ----------------------------------
// Simple text (nested document field — doesn't work yet)
// ----------------------------------
export const simpleText = component({
  label: 'Simple text',
  preview: props => <DocumentRenderer document={props.fields.content.value} />,
  schema: {
    content: fields.document({
      label: 'Simple text',
      formatting: true,
    }),
  },
});
