import { fields, component, NotEditable } from '@keystatic/core';

import { layoutProps } from './layout-props';

import type { Surface } from '../../keystatic/schema/layout-props';

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
    <NotEditable>
      {props.fields.testimonial.value
        ? `Selected: ${props.fields.testimonial.value}`
        : 'Please select a testimonial'}
    </NotEditable>
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
// Simple text (waiting for the option to show children in the modal)
// ----------------------------------
export const simpleText = component({
  label: 'Simple text',
  preview: props => (
    <div
      style={{
        border: '1px solid #eee',
        borderRadius: 6,
        padding: '10px 6px',
      }}
    >
      {props.fields.content.element}
    </div>
  ),
  chromeless: true,
  schema: {
    content: fields.child({
      kind: 'block',
      placeholder: 'Simple text',
      formatting: 'inherit',
    }),
  },
});

// ----------------------------------
// Call to action
// ----------------------------------
export const callToAction = component({
  label: 'Call to action',
  schema: {
    text: fields.text({ label: 'CTA Text', multiline: true }),
    buttonText: fields.text({ label: 'Button text' }),
    buttonHref: fields.text({ label: 'Button link path' }),
    layoutProps,
  },
  preview: ({ fields }) => (
    <NotEditable
      style={{
        padding: '1rem 0',
        borderTop: `dashed 2px ${
          surfaceColorLookup[fields.layoutProps.fields.surface.value]
        }`,
        borderBottom: `dashed 2px ${
          surfaceColorLookup[fields.layoutProps.fields.surface.value]
        }`,
      }}
    >
      <p>{fields.text.value}</p>
    </NotEditable>
  ),
});
